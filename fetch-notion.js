require('dotenv').config();
const { Client } = require('@notionhq/client');
const fs = require('fs');
const path = require('path');

// Initializing a client
const notion = new Client({ auth: process.env.NOTION_API_KEY });

// Ensure the directory exists
const dataDir = path.join(__dirname, 'content/blog');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Function to retrieve blocks for a page
async function getBlocks(blockId) {
  const blocks = [];
  let cursor;
  while (true) {
    const { results, next_cursor } = await notion.blocks.children.list({
      start_cursor: cursor,
      block_id: blockId,
    });
    blocks.push(...results);
    if (!next_cursor) {
      break;
    }
    cursor = next_cursor;
  }
  return blocks;
}

// Function to parse blocks to markdown
function parseBlocksToMarkdown(blocks) {
  return blocks.map(block => {
    switch (block.type) {
      case 'paragraph':
        return block.paragraph.rich_text.map(text => text.plain_text).join('');
      case 'heading_1':
        return `# ${block.heading_1.rich_text.map(text => text.plain_text).join('')}`;
      case 'heading_2':
        return `## ${block.heading_2.rich_text.map(text => text.plain_text).join('')}`;
      case 'heading_3':
        return `### ${block.heading_3.rich_text.map(text => text.plain_text).join('')}`;
      case 'bulleted_list_item':
        return `- ${block.bulleted_list_item.rich_text.map(text => text.plain_text).join('')}`;
      case 'numbered_list_item':
        return `1. ${block.numbered_list_item.rich_text.map(text => text.plain_text).join('')}`;
      case 'to_do':
        return `- [${block.to_do.checked ? 'x' : ' '}] ${block.to_do.rich_text.map(text => text.plain_text).join('')}`;
      case 'quote':
        return `> ${block.quote.rich_text.map(text => text.plain_text).join('')}`;
      case 'code':
        return `\`\`\`${block.code.language}\n${block.code.rich_text.map(text => text.plain_text).join('')}\n\`\`\``;
      case 'image':
        return `![${block.image.caption.map(text => text.plain_text).join('')}](${block.image.file.url})`;
      default:
        return '';
    }
  }).join('\n\n');
}

(async () => {
  const databaseId = process.env.DATABASE_ID;

  try {
    const response = await notion.databases.query({
      database_id: databaseId,
      filter: {
        property: 'Is Published',
        checkbox: {
          equals: true
        }
      }
    });

    const fetchedPosts = response.results.map(async page => {
      const titleProperty = page.properties.Name?.title[0]?.text?.content || 'Untitled';
      const dateProperty = page.properties.Date?.date?.start || '';
      const tagsProperty = page.properties.Tags?.multi_select.map(tag => tag.name) || [];

      console.log(`Fetched post: ${titleProperty}`); // Log title to check if it is fetched correctly

      // Retrieve blocks for this page
      const blocks = await getBlocks(page.id);
      const contentProperty = parseBlocksToMarkdown(blocks);

      console.log(`Content: ${contentProperty}`); // Log content to check if it is fetched correctly

      return {
        id: page.id,
        title: titleProperty,
        content: contentProperty,
        date: dateProperty,
        tags: tagsProperty,
      };
    });

    // Wait for all posts to be fetched
    const posts = await Promise.all(fetchedPosts);

    // Map of existing posts to detect deletions
    const existingPosts = new Map();
    fs.readdirSync(dataDir).forEach(file => {
      if (file.endsWith('.md')) {
        existingPosts.set(file, false);
      }
    });

    // Create/update posts and mark them as existing
    posts.forEach(post => {
      const { title, content, date, tags } = post;
      const safeTitle = title.replace(/[^a-z0-9]+/gi, '-').toLowerCase(); // create a URL-safe title
      const filename = `${safeTitle}.md`;
      const tagsMarkdown = tags.map(tag => `- ${tag}`).join('\n');
      const markdownContent = `---
title: "${title}"
date: "${date}"
tags:
${tagsMarkdown}
---

${content}
`;

      const markdownOutputPath = path.join(dataDir, filename);
      fs.writeFileSync(markdownOutputPath, markdownContent);
      console.log(`Post "${title}" saved to ${markdownOutputPath}`);

      existingPosts.set(filename, true); // Mark as existing
    });

    // Delete markdown files that were not marked as existing
    for (const [file, exists] of existingPosts) {
      if (!exists) {
        fs.unlinkSync(path.join(dataDir, file));
        console.log(`Deleted markdown file: ${file}`);
      }
    }

  } catch (error) {
    console.error(error);
  }
})();

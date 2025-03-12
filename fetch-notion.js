#!/usr/bin/env node
require('dotenv').config();
const { Client } = require('@notionhq/client');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const sharp = require('sharp');
const urlModule = require('url');

// Initializing the Notion client
const notion = new Client({ auth: process.env.NOTION_API_KEY });

const dataDir = path.join(__dirname, 'content/blog');
const imageDir = path.join(__dirname, 'public/images');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}
if (!fs.existsSync(imageDir)) {
  fs.mkdirSync(imageDir, { recursive: true });
}

/**
 * Convert a single Notion text object into properly annotated Markdown.
 */
function applyAnnotations(text) {
  let content = text.plain_text;

  // If code annotation is set, wrap in backticks
  if (text.annotations.code) {
    content = `\`${content}\``;
  }

  // If bold annotation is set, wrap in ** **
  if (text.annotations.bold) {
    content = `**${content}**`;
  }

  // If the text has a link, wrap the annotated string in [link](url)
  if (text.href) {
    content = `[${content}](${text.href})`;
  }

  return content;
}

/**
 * Helper to parse an array of rich_text objects, applying annotations.
 */
function parseRichTextArray(richTextArray) {
  return richTextArray.map(text => applyAnnotations(text)).join('');
}

/**
 * Retrieve blocks for a page
 */
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

/**
 * Download and optimize an image from a URL, then store it locally as .webp
 */
async function downloadAndOptimizeImage(url, filename) {
  const response = await axios.get(url, { responseType: 'arraybuffer' });
  const buffer = Buffer.from(response.data, 'binary');

  // Resize to max width of 1200px, apply sharpen with parameters, then convert to WebP
  const optimizedImageBuffer = await sharp(buffer)
    .resize(1200, null, { withoutEnlargement: true }) // Optional: Prevents enlarging the image if smaller than 960px
    .sharpen({ 
      sigma: 1.5,  // Increase to sharpen more
      flat: 1,     // Helps preserve flat areas
      jagged: 1    // Helps preserve jagged edges
    })
    .webp({ quality: 80 })
    .toBuffer();

  const localPath = path.join(imageDir, `${filename}.webp`);
  await fs.promises.writeFile(localPath, optimizedImageBuffer);

  return `/images/${filename}.webp`;
}


/**
 * Convert a list of Notion blocks into a Markdown string
 */
async function parseBlocksToMarkdown(blocks) {
  const markdownBlocks = await Promise.all(
    blocks.map(async block => {
      switch (block.type) {
        case 'paragraph':
          return parseRichTextArray(block.paragraph.rich_text);

        case 'heading_1':
          return `# ${parseRichTextArray(block.heading_1.rich_text)}`;

        case 'heading_2':
          return `## ${parseRichTextArray(block.heading_2.rich_text)}`;

        case 'heading_3':
          return `### ${parseRichTextArray(block.heading_3.rich_text)}`;

        case 'bulleted_list_item':
          return `- ${parseRichTextArray(block.bulleted_list_item.rich_text)}`;

        case 'numbered_list_item':
          return `1. ${parseRichTextArray(block.numbered_list_item.rich_text)}`;

        case 'to_do':
          return `- [${block.to_do.checked ? 'x' : ' '}] ${parseRichTextArray(block.to_do.rich_text)}`;

        case 'quote':
          return `> ${parseRichTextArray(block.quote.rich_text)}`;

        case 'code':
          return `\`\`\`${block.code.language}\n${block.code.rich_text
            .map(text => text.plain_text)
            .join('')}\n\`\`\``;

        case 'image': {
          const imageUrl = block.image.file?.url || block.image.external?.url;
          if (imageUrl) {
            // Derive a filename from the image URL
            const filename = urlModule.parse(imageUrl).pathname.split('/').pop();
            const localImagePath = await downloadAndOptimizeImage(imageUrl, filename);

            // Grab the caption from the block
            const caption = block.image.caption.map(text => text.plain_text).join('');

            // Wrap the image in a <figure> with the .full-bleed class
            return `<figure class="full-bleed">
  <img src="${localImagePath}" alt="${caption}">
  ${caption ? `<figcaption>${caption}</figcaption>` : ''}
</figure>`;
          }
          return '';
        }

        default:
          return '';
      }
    })
  );

  return markdownBlocks.join('\n\n');
}

(async () => {
  const databaseId = process.env.DATABASE_ID;

  try {
    // Query all published posts from the Notion database
    const response = await notion.databases.query({
      database_id: databaseId,
      filter: {
        property: 'Is Published',
        checkbox: {
          equals: true
        }
      }
    });

    // Process each page
    const fetchedPosts = response.results.map(async page => {
      const titleProperty =
        page.properties.Name?.title[0]?.text?.content || 'Untitled';
      const dateProperty = page.properties.Date?.date?.start || '';
      const tagsProperty =
        page.properties.Tags?.multi_select.map(tag => tag.name) || [];

      console.log(`Fetched post: ${titleProperty}`);

      // Retrieve the content blocks
      const blocks = await getBlocks(page.id);
      const contentProperty = await parseBlocksToMarkdown(blocks);

      console.log(`Content processed for: ${titleProperty}`);

      return {
        id: page.id,
        title: titleProperty,
        content: contentProperty,
        date: dateProperty,
        tags: tagsProperty
      };
    });

    // Wait for all posts to be fetched
    const posts = await Promise.all(fetchedPosts);

    // Track existing .md files for cleanup
    const existingPosts = new Map();
    fs.readdirSync(dataDir).forEach(file => {
      if (file.endsWith('.md')) {
        existingPosts.set(file, false);
      }
    });

    // Create/update post markdown
    posts.forEach(post => {
      const { title, content, date, tags } = post;
      const safeTitle = title.replace(/[^a-z0-9]+/gi, '-').toLowerCase();
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

      // Write file
      const markdownOutputPath = path.join(dataDir, filename);
      fs.writeFileSync(markdownOutputPath, markdownContent);
      console.log(`Post "${title}" saved to ${markdownOutputPath}`);

      existingPosts.set(filename, true);
    });

    // Delete old .md files that are no longer published in Notion
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

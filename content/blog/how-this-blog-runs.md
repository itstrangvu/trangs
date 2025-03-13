---
title: "How this blog runs"
date: "2025-03-12"
tags:
- code
- design
---

This post is slightly technical. TL;DR is that I built this site and blog using Markdown files via Eleventy. 

## Why

I created this site as my little corner of the internet. A space that’s truly mine. I didn’t want to rely on paid platforms like Substack or Medium because I believe in the decentralized web. Owning my content and having full control over my site is important to me. Plus, I thought that building it myself might be a fun coding challenge.



Here’s what I set out to achieve:

- **Own my content** – No lock-ins, no platforms deciding what happens to my writing.

- **Easy posting and editing** – Writing should feel effortless, not like managing a system.

- **Future-proof format** – Markdown is simple, portable, and built to last.

- **Lightweight and fast** – No unnecessary bloat, just clean and speedy pages.

- **Content first** – The words should shine, not be buried under distractions.

This blog is a work in progress, and that’s part of the fun.

### The process

1. Create notes in Notion

1. Generate the blog

1. Push to a Git repository

1. Deploy the site



<figure class="full-bleed">
  <img src="/images/howthisblogruns.png.webp" alt="A visual of how this blog runs">
  <figcaption>A visual of how this blog runs</figcaption>
</figure>

### **Tools and technologies**

- **Notion** – Content creation and organization

- **Eleventy** – Static site generator

- **Git** – Version control and code management

- **Netlify** – Automated deployment and performance monitoring

## Create notes in Notion

Everything starts in **Notion**. I considered alternatives like Obsidian, but ultimately, I chose Notion because I already subscribe to it, and its database functionality is a good fit for my needs. I'm also familiar with the tool, so it made sense to use it.

I needed a way to organize tags and have control over when a note gets published, and Notion provides a structured way to manage that.



<figure class="full-bleed">
  <img src="/images/Screenshot_2025-03-12_at_22.49.58.png.webp" alt="The database in Notion with tags and flag if the post is published or note">
  <figcaption>The database in Notion with tags and flag if the post is published or note</figcaption>
</figure>

I usually start by drafting the post, refining it, and making adjustments until I’m satisfied. Once it’s ready, I mark the **Is Published** checkbox in Notion to publish it.

## Generate the blog

After ensuring I’m happy with the note(s), I run a Node.js script named `fetch-notion.js` that:

1. Connects to Notion via Notion API.

1. Fetches published notes.

1. Downloads images and optimizes them.

1. Converts Notion content to Markdown.

1. Saves posts as `.md` files.

1. Deletes old files to keep the blog clean.



<figure class="full-bleed">
  <img src="/images/11dcebdb-5468-40b7-b4fd-b5798348a27c.png.webp" alt="Output from the script that fetches the content">
  <figcaption>Output from the script that fetches the content</figcaption>
</figure>



After checking the script output to ensure everything looks good, I commit the changes to the [Git repository](https://github.com/itstrangvu/trangs). 



## Deploy the site

After pushing the changes to the repository, Netlify automatically builds and deploys the site. 

As part of this process, a Lighthouse check runs to ensure the site meets performance, accessibility, and SEO standards.

<figure class="full-bleed">
  <img src="/images/Screenshot_2025-03-12_at_17.16.12.png.webp" alt="Netlify deploy log">
  <figcaption>Netlify deploy log</figcaption>
</figure>

<figure class="full-bleed">
  <img src="/images/Screenshot_2025-03-12_at_17.18.09.png.webp" alt="Lighthouse scores with 100 for performance, accessibility, best practices and SEO">
  <figcaption>Lighthouse scores with 100 for performance, accessibility, best practices and SEO</figcaption>
</figure>

## Room for improvement

Setting up this site and blog has been a great learning experience, but there’s still room for improvement. 

Instead of manually generating Markdown files, I’d like to streamline the deployment process so that running the `fetch-notion.js` script isn’t necessary. Fortunately, Notion introduced **Webhooks** in December 2024, and I plan to explore how they can automate this workflow.

Additionally, migrating my portfolio and generating it in the same way as the blog is something I’m considering.

The ultimate goal is to self-host both the site (no need for Netlify) and the git repository (maybe using Gitea?). Dropping Notion is a nice-to-have down the line. Getting ahead of myself here, though! Muhehe.

## Curiosity

Do you fully own your content as well? I’d love to see what you’re building! Feel free to share your blogs, digital gardens, or small personal sites. I’m always curious to connect with like-minded creators.

















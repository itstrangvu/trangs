# trang.vu

Personal website, blog, and design portfolio for **Trang Vũ** — a Senior Product Designer at Similarweb. Built as a fast, zero-JavaScript static site with [Eleventy (11ty)](https://www.11ty.dev/), with long-form content authored in [Notion](https://www.notion.so/) and synced into the repo as Markdown at build time.

Live at **[trang.vu](https://trang.vu/)** (formerly trangs.website, which now redirects here).

Based on [eleventy-base-blog v8](https://github.com/11ty/eleventy-base-blog), heavily customized with a Notion content pipeline, a Notes section, and a Portfolio section.

---

## Tech stack

- **[Eleventy v2](https://www.11ty.dev/)** — static site generator (zero-JS output, pre-rendered).
- **[Nunjucks](https://mozilla.github.io/nunjucks/)** — templating engine for layouts and pages.
- **Markdown** — content format (with `markdown-it-anchor` for heading anchors).
- **[Notion API](https://developers.notion.com/)** (`@notionhq/client`) — content source of truth for Notes and Portfolio.
- **[sharp](https://sharp.pixelplumbing.com/)** — image download/optimization to WebP for the Notion pipeline.
- **[@11ty/eleventy-img](https://www.11ty.dev/docs/plugins/image/)** — build-time responsive image generation (AVIF/WebP/JPEG).
- **[Netlify](https://www.netlify.com/)** — hosting and CI build.
- Node.js **16** (see `.nvmrc`; `package.json` `engines` requires `>=14`).

---

## Getting started

```bash
# 1. Use the pinned Node version
nvm use            # reads .nvmrc (Node 16)

# 2. Install dependencies
npm install

# 3. Run the dev server with live reload (drafts included)
npm start          # → http://localhost:8080

# 4. Or produce a production build into _site/
npm run build
```

### npm scripts

| Script | Command | Purpose |
| --- | --- | --- |
| `npm run build` | `npx @11ty/eleventy` | Production build to `_site/`. |
| `npm run build-ghpages` | `npx @11ty/eleventy --pathprefix=/eleventy-base-blog/` | Build for a GitHub Pages subfolder. |
| `npm start` | `npx @11ty/eleventy --serve --quiet` | Local dev server with live reload (includes drafts). |
| `npm run debug` | `DEBUG=Eleventy* npx @11ty/eleventy` | Build with full Eleventy debug logging. |
| `npm run debugstart` | `DEBUG=Eleventy* npx @11ty/eleventy --serve --quiet` | Dev server with debug logging. |
| `npm run benchmark` | `DEBUG=Eleventy:Benchmark* npx @11ty/eleventy` | Build with benchmark timing. |

---

## Content pipeline (Notion → Markdown)

Notes and Portfolio entries are **not** hand-written in the repo. They are authored in Notion databases and pulled in by two Node scripts that convert Notion blocks to Markdown, download images, optimize them to WebP, and write front-matter-prefixed `.md` files. Files removed from (or unpublished in) Notion are deleted locally on the next run.

### `fetch-notion.js` — Notes

- Reads the Notion database defined by `DATABASE_ID`, filtering to pages where **Is Published** is checked.
- Maps Notion properties → front matter: `Name` → `title`, `Date` → `date`, `Tags` → `tags`.
- Writes Markdown to **`content/notes/`** and images to **`public/images/`**.

### `fetch-portfolio.js` — Portfolio

- Reads the Notion database defined by `PORTFOLIO_DATABASE_ID`, filtering to **Is Published**.
- Maps properties → front matter: `Name` → `title`, plus `Year`, `Client`, `Role`, `Description`, `Categories`, and a `FeaturedImage`.
- Writes Markdown to **`content/portfolio/`** and images to **`public/images/portfolio/`**.
- Preserves `portfolio.11tydata.js` during cleanup.

Both scripts share the same block-to-Markdown conversion (paragraphs, headings, lists, to-dos, quotes, code, images wrapped in `<figure class="full-bleed">`, and **file / PDF** blocks rendered as download links) and the same image handling (resize to max 1200px wide, sharpen, convert to WebP at quality 80).

**Downloadable files:** add a Notion *File* or *PDF* block to a Note or Portfolio page and it becomes a click-to-download link on the page. Notion-hosted files are pulled into `public/files/` (Notes) or `public/files/portfolio/` (Portfolio) — because Notion's own file URLs expire — and served with a `download` attribute so a click saves the file under its original name. External file links are linked directly instead of downloaded.

### Environment variables

Create a `.env` file in the project root (git-ignored):

```bash
NOTION_API_KEY=secret_xxx           # Notion integration token
DATABASE_ID=xxxxxxxx                # Notes database
PORTFOLIO_DATABASE_ID=xxxxxxxx      # Portfolio database
```

Run a sync manually with:

```bash
node fetch-notion.js       # sync Notes
node fetch-portfolio.js    # sync Portfolio
```

---

## Deployment

Deployed on **Netlify** (see `netlify.toml`):

- **Build command:** `node fetch-notion.js && npm run build` — syncs Notes from Notion, then builds the site.
- **Publish directory:** `_site`
- The [Netlify Lighthouse plugin](https://github.com/netlify/netlify-plugin-lighthouse) runs on each build and **fails the build** if performance, accessibility, best-practices, or SEO drop below `1.0`.

> Note: the Netlify build command runs `fetch-notion.js` but not `fetch-portfolio.js`; run the portfolio sync separately (or add it to the command) when portfolio content changes.

During Netlify builds, the image pipeline skips AVIF (`webp`, `jpeg` only) to avoid a heifsave compression error in CI.

---

## Project structure

```
.
├── content/                  # Site content (Eleventy input dir)
│   ├── index.md              # Home page (layouts/home.njk)
│   ├── contact.md            # Contact page
│   ├── 404.md                # Not-found page
│   ├── notes.njk             # Notes listing page (nav: Notes)
│   ├── portfolio.njk         # Portfolio listing page (nav: Portfolio)
│   ├── tags.njk              # Per-tag archive pages
│   ├── tags-list.njk         # All-tags index
│   ├── notes/                # Notes Markdown (synced from Notion) + notes.11tydata.js
│   ├── portfolio/            # Portfolio Markdown (synced from Notion) + portfolio.11tydata.js
│   ├── blog/                 # Legacy blog posts + blog.11tydata.js
│   ├── feed/                 # Atom (feed.njk) + JSON (json.njk) feeds
│   └── sitemap/              # sitemap.xml template
├── _includes/
│   ├── layouts/
│   │   ├── base.njk          # Top-level HTML shell (header, nav, footer, inlined CSS)
│   │   ├── home.njk          # Home page layout
│   │   ├── post.njk          # Note/blog post layout
│   │   └── project.njk       # Portfolio project layout
│   ├── postslist.njk         # Reusable posts list component
│   └── projectslist.njk      # Reusable projects list component
├── _data/
│   └── metadata.js           # Site metadata (title, url, author, description)
├── public/                   # Passthrough-copied to _site root
│   ├── css/                  # index.css, message-box.css, prism-diff.css
│   ├── images/               # Optimized WebP images synced from Notion
│   └── img/favicon/          # Favicons + web manifest
├── eleventy.config.js        # Main Eleventy config (plugins, filters, dirs)
├── eleventy.config.drafts.js # Drafts plugin (drafts only in serve/watch)
├── eleventy.config.images.js # {% image %} shortcode (responsive images)
├── fetch-notion.js           # Notion → content/notes/ sync script
├── fetch-portfolio.js        # Notion → content/portfolio/ sync script
├── migrate-to-notes.sh       # One-off helper: copy blog/ → notes/
├── netlify.toml              # Netlify build + Lighthouse config
├── package.json
├── _site/                    # Build output (git-ignored)
└── node_modules/             # Dependencies (git-ignored)
```

### Eleventy configuration highlights (`eleventy.config.js`)

- **Directories:** input `content/`, includes `_includes/`, data `_data/`, output `_site/`.
- **Template formats:** `md`, `njk`, `html`, `liquid` — all pre-processed with Nunjucks.
- **Plugins:** RSS, syntax highlighting, navigation, HTML `<base>`, bundle, plus the local drafts and images plugins.
- **Filters:** `readableDate`, `htmlDateString`, `head`, `min`, `getAllTags`, and `filterTagList` (hides `all`, `nav`, `post`, `posts`, `notes`, `projects` from tag lists).
- **Markdown:** `markdown-it-anchor` adds `aria-hidden` heading anchor links for h1–h4.

### Collections & navigation

- `content/index.md`, `notes.njk`, `portfolio.njk`, and `contact.md` register in the top nav via `eleventyNavigation` front matter (ordered Home → Notes → Portfolio → Contact).
- Directory data files assign tags/layouts to each section:
  - `content/notes/notes.11tydata.js` → tag `notes`, layout `layouts/post.njk`.
  - `content/portfolio/portfolio.11tydata.js` → tag `projects`, layout `layouts/project.njk`.
  - `content/blog/blog.11tydata.js` → tag `posts`, layout `layouts/post.njk`.

### Drafts

Set `draft: true` in a page's front matter to keep it out of production builds. Drafts are included only during `npm start` (serve/watch), via `eleventy.config.drafts.js`.

---

## Editing content

- **Notes & Portfolio:** edit in Notion, mark **Is Published**, then re-run the sync script (or trigger a Netlify build). Do not edit files in `content/notes/` or `content/portfolio/` directly — they are overwritten on sync.
- **Pages** (Home, Contact, listing pages): edit the Markdown/Nunjucks files under `content/` directly.
- **Styling:** edit CSS in `public/css/`. `index.css` is inlined into every page for performance via `eleventy-plugin-bundle`.
- **Site metadata** (title, author, description, URL): edit `_data/metadata.js`.

---

## License

[MIT](./LICENSE) © Trang Vu

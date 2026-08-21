const { DateTime } = require("luxon");
const markdownItAnchor = require("markdown-it-anchor");

const pluginRss = require("@11ty/eleventy-plugin-rss");
const pluginSyntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const pluginBundle = require("@11ty/eleventy-plugin-bundle");
const pluginNavigation = require("@11ty/eleventy-navigation");
const { EleventyHtmlBasePlugin } = require("@11ty/eleventy");

const pluginDrafts = require("./eleventy.config.drafts.js");
const pluginImages = require("./eleventy.config.images.js");
const pluginPhosphor = require("./eleventy.config.phosphor.js");

module.exports = function(eleventyConfig) {
	// Copy the contents of the `public` folder to the output folder
	// For example, `./public/css/` ends up in `_site/css/`
	eleventyConfig.addPassthroughCopy({
		"./public/": "/",
		"./node_modules/prismjs/themes/prism-okaidia.css": "/css/prism-okaidia.css", 
		"./public/img/favicon/": "/",
	});

	// Run Eleventy when these files change:
	// https://www.11ty.dev/docs/watch-serve/#add-your-own-watch-targets

	// Watch content images for the image pipeline.
	eleventyConfig.addWatchTarget("content/**/*.{svg,webp,png,jpeg,gif}");

	// App plugins
	eleventyConfig.addPlugin(pluginDrafts);
	eleventyConfig.addPlugin(pluginImages);
	eleventyConfig.addPlugin(pluginPhosphor);

	// Official plugins
	eleventyConfig.addPlugin(pluginRss);
	eleventyConfig.addPlugin(pluginSyntaxHighlight, {
		preAttributes: { tabindex: 0 }
	});
	eleventyConfig.addPlugin(pluginNavigation);
	eleventyConfig.addPlugin(EleventyHtmlBasePlugin);
	eleventyConfig.addPlugin(pluginBundle);

	// Filters
	eleventyConfig.addFilter("readableDate", (dateObj, format, zone) => {
		// Formatting tokens for Luxon: https://moment.github.io/luxon/#/formatting?id=table-of-tokens
		return DateTime.fromJSDate(dateObj, { zone: zone || "utc" }).toFormat(format || "dd LLLL yyyy");
	});

	eleventyConfig.addFilter('htmlDateString', (dateObj) => {
		// dateObj input: https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-date-string
		return DateTime.fromJSDate(dateObj, {zone: 'utc'}).toFormat('yyyy-LL-dd');
	});

	// Open external (http/https) links in a new tab. Internal links and heading
	// anchors (href="#...") are left untouched. Used for note content.
	eleventyConfig.addFilter("externalLinksNewTab", (html) => {
		if (typeof html !== "string") return html;
		return html.replace(/<a\s+([^>]*href="https?:\/\/[^"]*"[^>]*)>/gi, (match, attrs) => {
			if (/\btarget=/.test(attrs)) return match; // don't double-add
			return `<a ${attrs} target="_blank" rel="noopener noreferrer">`;
		});
	});

	// Notion writes a quote's attribution inline, after a dash:
	//   > The goal is to turn data into insight. – Carly Fiorina
	// Lift that name out of the quoted sentence and onto its own line, dropping
	// the dash, so the quotation marks close around the words the person
	// actually said. Only a dash near the end of the last paragraph counts, so
	// dashes used mid-quote are left alone. Quotes with no attribution pass
	// through untouched.
	const QUOTE_ATTRIBUTION_RE = /\s+[–—-]\s*([^<>]{1,60}?)\s*(<\/p>\s*)$/;
	eleventyConfig.addFilter("quoteAttribution", (html) => {
		if (typeof html !== "string") return html;
		return html.replace(/<blockquote(\s[^>]*)?>([\s\S]*?)<\/blockquote>/gi, (match, attrs, inner) => {
			const found = inner.match(QUOTE_ATTRIBUTION_RE);
			if (!found) return match;
			const quote = inner.slice(0, found.index) + found[2];
			return `<blockquote${attrs || ""}>${quote}<cite class="quote-attribution">${found[1]}</cite></blockquote>`;
		});
	});

	// Get the first `n` elements of a collection.
	eleventyConfig.addFilter("head", (array, n) => {
		if(!Array.isArray(array) || array.length === 0) {
			return [];
		}
		if( n < 0 ) {
			return array.slice(n);
		}

		return array.slice(0, n);
	});

	// Return the smallest number argument
	eleventyConfig.addFilter("min", (...numbers) => {
		return Math.min.apply(null, numbers);
	});

	// Return all the tags used in a collection
	eleventyConfig.addFilter("getAllTags", collection => {
		let tagSet = new Set();
		for(let item of collection) {
			(item.data.tags || []).forEach(tag => tagSet.add(tag));
		}
		return Array.from(tagSet);
	});

	eleventyConfig.addFilter("filterTagList", function filterTagList(tags) {
		return (tags || []).filter(tag => ["all", "nav", "post", "posts", "notes", "projects"].indexOf(tag) === -1);
	});

	// Return all the unique portfolio categories used across a collection of projects
	eleventyConfig.addFilter("getAllCategories", collection => {
		let categorySet = new Set();
		for(let item of collection) {
			(item.data.categories || []).forEach(category => categorySet.add(category));
		}
		return Array.from(categorySet);
	});

	// Space-separated slugs for a project's categories, for use as a filter data attribute
	eleventyConfig.addFilter("categorySlugs", categories => {
		const slugify = eleventyConfig.getFilter("slugify");
		return (categories || []).map(category => slugify(category)).join(" ");
	});

	// Whether any project in the collection is flagged as still in progress
	eleventyConfig.addFilter("hasComingSoon", collection => {
		return collection.some(item => item.data.comingSoon);
	});

	// Deterministic muted background color for portfolio cards without a featured image
	eleventyConfig.addFilter("colorFromString", str => {
		let hash = 0;
		for(let i = 0; i < (str || "").length; i++) {
			hash = str.charCodeAt(i) + ((hash << 5) - hash);
		}
		const hue = Math.abs(hash) % 360;
		return `hsl(${hue}, 28%, 16%)`;
	});

	// Build a table of contents from already-rendered content HTML.
	// markdown-it-anchor has run by the time a layout sees `content`, so every
	// h2/h3 already carries the id we link to. Usage: {% set toc = content | toc %}
	const TOC_ANCHOR_RE = /<a\b[^>]*class\s*=\s*["'][^"']*\bheader-anchor\b[^"']*["'][^>]*>[\s\S]*?<\/a>/gi;
	const TOC_TAG_RE = /<[^>]+>/g;
	const TOC_ID_RE = /\sid\s*=\s*["']([^"']+)["']/i;
	const TOC_ENTITIES = {
		amp: "&", lt: "<", gt: ">", quot: "\"", apos: "'", nbsp: " ",
		hellip: "…", mdash: "—", ndash: "–",
		lsquo: "‘", rsquo: "’", ldquo: "“", rdquo: "”"
	};

	function tocDecodeEntities(str) {
		return str.replace(/&(#x?[0-9a-f]+|[a-z][a-z0-9]*);/gi, (whole, body) => {
			if(body[0] === "#") {
				const code = (body[1] === "x" || body[1] === "X")
					? parseInt(body.slice(2), 16)
					: parseInt(body.slice(1), 10);
				return Number.isFinite(code) && code > 0 ? String.fromCodePoint(code) : whole;
			}
			const named = TOC_ENTITIES[body.toLowerCase()];
			return named === undefined ? whole : named;
		});
	}

	// Drop the "#" permalink, then any remaining inline tags (<strong>, <code>, …)
	function tocHeadingText(inner) {
		return tocDecodeEntities(inner.replace(TOC_ANCHOR_RE, "").replace(TOC_TAG_RE, ""))
			.replace(/\s+/g, " ")
			.trim();
	}

	eleventyConfig.addFilter("toc", (rawContent) => {
		const html = typeof rawContent === "string"
			? rawContent
			: (rawContent == null ? "" : String(rawContent));
		if(!html) return [];

		// Declared locally: /g + .exec() carries lastIndex state between calls.
		const headingRe = /<h([23])\b([^>]*)>([\s\S]*?)<\/h\1>/gi;
		const flat = [];
		let match;
		while((match = headingRe.exec(html)) !== null) {
			const idMatch = (match[2] || "").match(TOC_ID_RE);
			if(!idMatch) continue;
			const text = tocHeadingText(match[3] || "");
			if(!text) continue;
			flat.push({ level: Number(match[1]), id: idMatch[1], text });
		}
		if(!flat.length) return [];

		// Nest h3 under the preceding h2. Several notes use h3 exclusively —
		// promote those to top level so their table of contents isn't empty.
		const hasH2 = flat.some(h => h.level === 2);
		const tree = [];
		for(const h of flat) {
			const node = { id: h.id, text: h.text, level: h.level, children: [] };
			const parent = tree[tree.length - 1];
			if(hasH2 && h.level === 3 && parent && parent.level === 2) {
				parent.children.push(node);
			} else {
				tree.push(node);
			}
		}
		return tree;
	});

	// Customize Markdown library settings:
	eleventyConfig.amendLibrary("md", mdLib => {
		mdLib.use(markdownItAnchor, {
			permalink: markdownItAnchor.permalink.ariaHidden({
				placement: "after",
				class: "header-anchor",
				symbol: "#",
				ariaHidden: false,
			}),
			level: [1,2,3,4],
			slugify: eleventyConfig.getFilter("slugify")
		});
	});

	// Features to make your build faster (when you need them)

	// If your passthrough copy gets heavy and cumbersome, add this line
	// to emulate the file copy on the dev server. Learn more:
	// https://www.11ty.dev/docs/copy/#emulate-passthrough-copy-during-serve

	// eleventyConfig.setServerPassthroughCopyBehavior("passthrough");

	return {
		// Control which files Eleventy will process
		// e.g.: *.md, *.njk, *.html, *.liquid
		templateFormats: [
			"md",
			"njk",
			"html",
			"liquid",
		],

		// Pre-process *.md files with: (default: `liquid`)
		markdownTemplateEngine: "njk",

		// Pre-process *.html files with: (default: `liquid`)
		htmlTemplateEngine: "njk",

		// These are all optional:
		dir: {
			input: "content",          // default: "."
			includes: "../_includes",  // default: "_includes"
			data: "../_data",          // default: "_data"
			output: "_site"
		},

		// -----------------------------------------------------------------
		// Optional items:
		// -----------------------------------------------------------------

		// If your site deploys to a subdirectory, change `pathPrefix`.
		// Read more: https://www.11ty.dev/docs/config/#deploy-to-a-subdirectory-with-a-path-prefix

		// When paired with the HTML <base> plugin https://www.11ty.dev/docs/plugins/html-base/
		// it will transform any absolute URLs in your HTML to include this
		// folder name and does **not** affect where things go in the output folder.
		pathPrefix: "/",
	};
};

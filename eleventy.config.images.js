// eleventy.config.images.js
const Image = require("@11ty/eleventy-img");

module.exports = function(eleventyConfig) {
  const isNetlify = !!process.env.NETLIFY;

  // CI skips AVIF to avoid "heifsave: Unsupported compression"
  const DEFAULT_FORMATS = isNetlify ? ["webp", "jpeg"] : ["avif", "webp", "jpeg"];

  // `eager` produces an LCP-friendly image: no lazy-loading and fetchpriority=high
  // so the browser discovers and downloads it immediately. Use it only for the
  // above-the-fold / largest image on a page (see `imageEager` shortcode below).
  async function imageShortcode(src, alt = "", sizes = "100vw", widths = [400, 800, 1280], eager = false) {
    if (!alt) {
      throw new Error(`Missing \`alt\` for image: ${src}`);
    }

    const metadata = await Image(src, {
      formats: DEFAULT_FORMATS,
      widths,
      urlPath: "/img/",
      outputDir: "./_site/img/",
      // cache helps local dev speed-ups
      useCache: true,
    });

    const imageAttributes = {
      alt,
      sizes,
      loading: eager ? "eager" : "lazy",
      decoding: "async",
    };
    if (eager) {
      imageAttributes.fetchpriority = "high";
    }

    return Image.generateHTML(metadata, imageAttributes);
  }

  // Eager variant for the LCP/hero image on a page.
  const imageEagerShortcode = (src, alt, sizes, widths) =>
    imageShortcode(src, alt, sizes, widths, true);

  // Nunjucks and 11ty.js async shortcodes
  eleventyConfig.addNunjucksAsyncShortcode("image", imageShortcode);
  eleventyConfig.addJavaScriptFunction("image", imageShortcode);
  eleventyConfig.addNunjucksAsyncShortcode("imageEager", imageEagerShortcode);
  eleventyConfig.addJavaScriptFunction("imageEager", imageEagerShortcode);

  // Liquid async shortcode
  eleventyConfig.addLiquidShortcode("image", async (...args) => {
    return await imageShortcode(...args);
  });
  eleventyConfig.addLiquidShortcode("imageEager", async (...args) => {
    return await imageEagerShortcode(...args);
  });

  // Optional: passthrough for raw image assets if you also reference originals
  eleventyConfig.addPassthroughCopy({ "assets/img": "img" });
};

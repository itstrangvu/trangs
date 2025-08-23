// eleventy.config.images.js
const Image = require("@11ty/eleventy-img");

module.exports = function(eleventyConfig) {
  const isNetlify = !!process.env.NETLIFY;

  // CI skips AVIF to avoid "heifsave: Unsupported compression"
  const DEFAULT_FORMATS = isNetlify ? ["webp", "jpeg"] : ["avif", "webp", "jpeg"];

  async function imageShortcode(src, alt = "", sizes = "100vw", widths = [400, 800, 1280]) {
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
      loading: "lazy",
      decoding: "async",
    };

    return Image.generateHTML(metadata, imageAttributes);
  }

  // Nunjucks and 11ty.js async shortcodes
  eleventyConfig.addNunjucksAsyncShortcode("image", imageShortcode);
  eleventyConfig.addJavaScriptFunction("image", imageShortcode);

  // Liquid async shortcode
  eleventyConfig.addLiquidShortcode("image", async (...args) => {
    return await imageShortcode(...args);
  });

  // Optional: passthrough for raw image assets if you also reference originals
  eleventyConfig.addPassthroughCopy({ "assets/img": "img" });
};

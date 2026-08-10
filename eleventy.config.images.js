// eleventy.config.images.js
const Image = require("@11ty/eleventy-img");
const sharp = require("sharp");

module.exports = function(eleventyConfig) {
  const isNetlify = !!process.env.NETLIFY;

  // CI skips AVIF to avoid "heifsave: Unsupported compression"
  const DEFAULT_FORMATS = isNetlify ? ["webp", "jpeg"] : ["avif", "webp", "jpeg"];

  // Frame count of a local image: >1 means the source is animated (GIF or
  // animated WebP) and must not be flattened into a still. Only those two
  // formats can animate, so nothing else is opened. Remote or unreadable
  // sources fall back to the still path.
  async function framesInImage(src) {
    if (typeof src !== "string" || !/\.(gif|webp)$/i.test(src)) {
      return 1;
    }
    try {
      const { pages } = await sharp(src).metadata();
      return pages || 1;
    } catch (error) {
      return 1;
    }
  }

  // eleventy-img measures an animation as one tall strip of frames, so every
  // reported height is `frames` times too big and the <img> would come out with
  // a wildly wrong aspect ratio. Copy the metadata with the heights divided
  // back down (a copy, so re-running on cached metadata stays idempotent).
  function withFrameHeights(metadata, frames) {
    return Object.fromEntries(
      Object.entries(metadata).map(([format, entries]) => [
        format,
        entries.map(entry => ({ ...entry, height: Math.round(entry.height / frames) })),
      ])
    );
  }

  // `eager` produces an LCP-friendly image: no lazy-loading and fetchpriority=high
  // so the browser discovers and downloads it immediately. Use it only for the
  // above-the-fold / largest image on a page (see `imageEager` shortcode below).
  async function imageShortcode(src, alt = "", sizes = "100vw", widths = [400, 800, 1280], eager = false) {
    if (!alt) {
      throw new Error(`Missing \`alt\` for image: ${src}`);
    }

    // An animated source stays a single animated WebP: AVIF and JPEG here would
    // either drop the animation or bloat the page.
    const frames = await framesInImage(src);
    const isAnimated = frames > 1;

    const metadata = await Image(src, {
      formats: isAnimated ? ["webp"] : DEFAULT_FORMATS,
      widths,
      urlPath: "/img/",
      outputDir: "./_site/img/",
      // cache helps local dev speed-ups
      useCache: true,
      ...(isAnimated ? { sharpOptions: { animated: true } } : {}),
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

    return Image.generateHTML(
      isAnimated ? withFrameHeights(metadata, frames) : metadata,
      imageAttributes
    );
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

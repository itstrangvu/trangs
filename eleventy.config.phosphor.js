// eleventy.config.phosphor.js
// Inline Phosphor icons as plain SVGs at build time.
//
// Usage in templates:
//   {% phosphor "rocket-launch" %}            -> 40px, regular weight
//   {% phosphor "rocket-launch", 48 %}        -> 48px, regular weight
//   {% phosphor "rocket-launch", 40, "bold" %}-> 40px, bold weight
//
// Icons are read from the `@phosphor-icons/core` package. Browse names/weights
// at https://phosphoricons.com. The raw SVGs already use `fill="currentColor"`,
// so they inherit the surrounding text color.
const fs = require("fs");

const WEIGHTS = ["regular", "bold", "duotone", "fill", "light", "thin"];

const cache = new Map();

function loadIcon(name, weight) {
	const key = `${weight}/${name}`;
	if (cache.has(key)) return cache.get(key);

	// Regular weight has no suffix; every other weight does (e.g. `rocket-bold.svg`).
	const file = weight === "regular" ? `${name}.svg` : `${name}-${weight}.svg`;
	// The package exports each SVG as a subpath (see its `exports` field), so
	// resolve the file through Node rather than reaching into node_modules by hand.
	let svg;
	try {
		const filePath = require.resolve(`@phosphor-icons/core/assets/${weight}/${file}`);
		svg = fs.readFileSync(filePath, "utf8");
	} catch (e) {
		throw new Error(
			`Phosphor icon not found: "${name}" (${weight}). Looked for assets/${weight}/${file}. ` +
			`Check the name/weight at https://phosphoricons.com`
		);
	}
	cache.set(key, svg);
	return svg;
}

module.exports = function (eleventyConfig) {
	function phosphor(name, size = 40, weight = "regular") {
		if (!name) return "";
		if (!WEIGHTS.includes(weight)) {
			throw new Error(`Unknown Phosphor weight "${weight}". Use one of: ${WEIGHTS.join(", ")}`);
		}
		const svg = loadIcon(name, weight);
		// Inject sizing + a11y attributes into the root <svg>.
		return svg.replace(
			/^<svg /,
			`<svg class="ph-icon" width="${size}" height="${size}" aria-hidden="true" focusable="false" `
		);
	}

	eleventyConfig.addNunjucksShortcode("phosphor", phosphor);
	eleventyConfig.addLiquidShortcode("phosphor", phosphor);
	eleventyConfig.addJavaScriptFunction("phosphor", phosphor);
};

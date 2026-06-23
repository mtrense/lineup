/**
 * Tile SVG loader.
 *
 * Uses `import.meta.glob` with a static literal pattern to map comparison ids
 * to their raw tile SVG markup at build time (no runtime fetching). The glob
 * resolves to a plain Record<path, svgSource> that is cheap to query.
 *
 * We load the SVG *source* (`?raw`) rather than an asset URL on purpose: the
 * tiles use `fill="currentColor"` so they can theme with the surrounding card
 * in both light and dark mode. That only works when the SVG is inlined into the
 * DOM — an SVG referenced via `<img src>` or CSS `url()` is an isolated document
 * where `currentColor` resolves to black, and small tiles get inlined by Vite as
 * data URIs that break CSS `url()` escaping anyway. Inlining the markup sidesteps
 * both problems. See TileBackground for the render side.
 */

// Static literal pattern — Vite/Vitest requires this to be a string literal
// so the glob can be resolved at build time.
const tiles = import.meta.glob("../../../data/*/tile.svg", {
  eager: true,
  query: "?raw",
  import: "default",
}) as Record<string, string>;

/**
 * Return the raw SVG markup for a comparison type's tile, or `null` if no
 * `tile.svg` exists for that comparison id.
 */
export function getTileSvg(comparisonId: string): string | null {
  const key = `../../../data/${comparisonId}/tile.svg`;
  const svg = tiles[key];
  return svg != null ? svg : null;
}

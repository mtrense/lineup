/**
 * Tile SVG loader.
 *
 * Uses `import.meta.glob` with a static literal pattern to map comparison ids
 * to their tile SVG asset URLs at build time (no runtime fetching). The glob
 * resolves to a plain Record<path, url> that is cheap to query.
 *
 * Under Vitest, SVG imports resolve to the file path string (via
 * `assetsInclude: ["**\/*.svg"]` in vitest.config.ts), so this module works
 * in tests without any special mocking.
 */

// Static literal pattern — Vite/Vitest requires this to be a string literal
// so the glob can be resolved at build time.
const tiles = import.meta.glob("../../../data/*/tile.svg", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

/**
 * Return the asset URL for a comparison type's tile SVG, or `null` if no
 * `tile.svg` exists for that comparison id.
 */
export function getTileUrl(comparisonId: string): string | null {
  const key = `../../../data/${comparisonId}/tile.svg`;
  const url = tiles[key];
  return url != null ? url : null;
}

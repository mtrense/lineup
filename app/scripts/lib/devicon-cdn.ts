/**
 * Rewrites bundled Devicon SVG imports to jsdelivr CDN URLs for the
 * self-contained HTML export build (see PLAN.md, milestone 0019).
 *
 * The live app imports Devicon assets as local `<img src>` files (Vite
 * resolves them to hashed local URLs). The export must not emit any local
 * asset files, so this module maps each `devicon/icons/<name>/<file>.svg`
 * import specifier to the corresponding jsdelivr URL instead — the one
 * permitted runtime network request for the export (FontAwesome renders as
 * inline SVG from the JS bundle and needs no network access).
 *
 * `DEVICON_VERSION` is pinned to the `devicon` version installed in
 * `app/package.json` (currently `2.17.0`). Bumping that dependency must
 * update this constant too, so exported CDN URLs stay reproducible.
 */

/** Pinned to the `devicon` dependency version in app/package.json. */
export const DEVICON_VERSION = "2.17.0";

const DEVICON_ICON_PATTERN = /^devicon\/icons\/[^/]+\/[^/]+\.svg$/;

/**
 * Maps a `devicon/icons/<name>/<file>.svg` import specifier to its pinned
 * jsdelivr CDN URL. Throws for any specifier that isn't a devicon icon path,
 * so callers never silently rewrite unrelated modules.
 */
export function deviconCdnUrl(importPath: string): string {
  if (!DEVICON_ICON_PATTERN.test(importPath)) {
    throw new Error(
      `deviconCdnUrl: not a devicon icon import specifier: "${importPath}"`,
    );
  }
  const iconPath = importPath.slice("devicon/".length);
  return `https://cdn.jsdelivr.net/npm/devicon@${DEVICON_VERSION}/${iconPath}`;
}

function isDeviconIconSpecifier(id: string): boolean {
  return DEVICON_ICON_PATTERN.test(id);
}

/**
 * A minimal Vite plugin shape (deliberately not importing the `vite` types
 * here, so this module stays a plain, framework-light unit under test).
 */
interface DeviconCdnVitePlugin {
  name: string;
  resolveId(id: string): string | null | undefined;
  load(id: string): string | null | undefined;
}

/**
 * Vite plugin factory: resolves `devicon/icons/**\/*.svg` import ids and
 * returns `export default "<cdnUrl>"` for each, leaving all other modules
 * untouched (returns `null`/`undefined` from `resolveId`/`load`).
 */
export function deviconCdnPlugin(): DeviconCdnVitePlugin {
  return {
    name: "devicon-cdn",
    resolveId(id: string) {
      if (!isDeviconIconSpecifier(id)) return null;
      return id;
    },
    load(id: string) {
      if (!isDeviconIconSpecifier(id)) return null;
      return `export default ${JSON.stringify(deviconCdnUrl(id))};`;
    },
  };
}

/**
 * `pnpm export <comparison-type>` CLI — the single integration point for the
 * self-contained HTML export (see PLAN.md, milestone 0019, Task 5).
 *
 * Ties together the pieces built in Tasks 1-4:
 *   - `loadComparison()` (Task 1) reads the comparison's data via `fs`.
 *   - The export's `render.tsx` (Task 2) is loaded at runtime through Vite's
 *     programmatic SSR API (`createServer(...).ssrLoadModule(...)`), reusing
 *     the same plugins (react, tailwindcss, `deviconCdnPlugin()`) as the
 *     export client build, so the SSR-rendered markup (e.g. Devicon `<img
 *     src>` CDN URLs) matches what `entry-client.tsx` hydrates onto.
 *   - `buildExportBundle()` (Task 4) produces the single inlined JS/CSS pair.
 *
 * `stdout` carries ONLY the assembled HTML document — all logs/build noise
 * go to `stderr` — so `pnpm export <type> > file.html` always yields a valid
 * file.
 */
import { createServer } from "vite";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  loadComparison,
  comparisonExists,
  ComparisonNotFoundError,
} from "./lib/load-comparison";
import { buildExportBundle } from "./lib/build-bundle";
import type { ExportData } from "../src/export/ExportRoot";

const APP_ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const EXPORT_CONFIG_PATH = path.join(APP_ROOT, "vite.export.config.ts");

/**
 * Escapes characters that would otherwise let the JSON payload break out of
 * its surrounding `<script>` tag (most notably a literal `</script>`
 * sequence inside a string value). The data is trusted repo JSON, but
 * correct escaping is still required to keep the emitted HTML well-formed.
 */
function escapeForInlineScript(json: string): string {
  return json
    .replace(/</g, "\\u003C")
    .replace(/>/g, "\\u003E")
    .replace(/&/g, "\\u0026");
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

const DARK_MODE_SCRIPT =
  "if (window.matchMedia('(prefers-color-scheme: dark)').matches) { " +
  "document.documentElement.classList.add('dark'); }";

/**
 * Renders `render.tsx`'s `renderExportHtml(data)` through Vite's
 * programmatic SSR API. A dedicated middleware-mode server is created per
 * call (and closed before returning) so the CLI has no lingering handles.
 */
async function renderSsrHtml(data: ExportData): Promise<string> {
  const server = await createServer({
    configFile: EXPORT_CONFIG_PATH,
    root: APP_ROOT,
    server: { middlewareMode: true },
    appType: "custom",
    logLevel: "warn",
  });
  try {
    const mod = await server.ssrLoadModule("/src/export/render.tsx");
    return (mod.renderExportHtml as (data: ExportData) => string)(data);
  } finally {
    await server.close();
  }
}

/**
 * Builds the complete, self-contained HTML document for `comparisonId`.
 * Throws `ComparisonNotFoundError` for an unknown id — callers (namely
 * `main()`) are responsible for turning that into a clean CLI failure.
 */
export async function buildExportHtml(comparisonId: string): Promise<string> {
  if (!comparisonExists(comparisonId)) {
    throw new ComparisonNotFoundError(comparisonId);
  }

  const data = loadComparison(comparisonId);

  const [ssrHtml, { js, css }] = await Promise.all([
    renderSsrHtml(data),
    buildExportBundle(),
  ]);

  const dataJson = escapeForInlineScript(JSON.stringify(data));
  const title = escapeHtml(data.attributes.name);

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
    <script>${DARK_MODE_SCRIPT}</script>
    <style>${css}</style>
  </head>
  <body>
    <div id="root">${ssrHtml}</div>
    <script>window.__LINEUP_DATA__ = ${dataJson};</script>
    <script>${js}</script>
  </body>
</html>
`;
}

/**
 * Thin CLI wrapper: parses `argv`, calls `buildExportHtml()`, and writes the
 * result to `stdout` (or a clear error to `stderr` with a non-zero exit
 * code). Uses `process.exitCode` rather than `process.exit()` so the process
 * exits cleanly once pending work (like closing the Vite server) settles —
 * this also keeps `main()` easy to call directly from tests.
 */
export async function main(
  argv: string[] = process.argv.slice(2),
): Promise<void> {
  const comparisonId = argv[0];
  if (!comparisonId) {
    process.stderr.write(
      "Usage: pnpm export <comparison-type>\n",
    );
    process.exitCode = 1;
    return;
  }

  try {
    const html = await buildExportHtml(comparisonId);
    process.stdout.write(html);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    process.stderr.write(`${message}\n`);
    process.exitCode = 1;
  }
}

const isMainModule =
  process.argv[1] === fileURLToPath(import.meta.url);
if (isMainModule) {
  void main();
}

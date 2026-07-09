/**
 * Runs the dedicated export Vite build (`vite.export.config.ts`, see
 * PLAN.md, milestone 0019, Task 4) and returns the emitted client JS and CSS
 * as strings, ready to be inlined into the exported HTML document by the
 * export CLI.
 */
import { build } from "vite";
import path from "node:path";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import type { OutputAsset, OutputChunk, RollupOutput } from "rollup";

const APP_ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../..",
);
const EXPORT_CONFIG_PATH = path.join(APP_ROOT, "vite.export.config.ts");
const DIST_EXPORT_DIR = path.join(APP_ROOT, "dist-export");

/**
 * Builds the export client bundle and returns its JS and CSS as strings.
 * Prefers reading the generated code directly from Vite's returned Rollup
 * output (avoiding a race with the emitted files on disk); falls back to
 * reading the emitted files from `dist-export/` if the in-memory output
 * doesn't contain what's needed.
 */
export async function buildExportBundle(): Promise<{ js: string; css: string }> {
  const result = await build({
    configFile: EXPORT_CONFIG_PATH,
    root: APP_ROOT,
    logLevel: "warn",
  });

  const output = Array.isArray(result)
    ? (result[0] as RollupOutput).output
    : (result as RollupOutput).output;

  const jsChunk = output.find(
    (item): item is OutputChunk => item.type === "chunk" && item.isEntry,
  );
  const cssAsset = output.find(
    (item): item is OutputAsset =>
      item.type === "asset" && item.fileName.endsWith(".css"),
  );

  const js =
    jsChunk?.code ??
    (await readFile(path.join(DIST_EXPORT_DIR, "entry-client.js"), "utf-8"));
  const css =
    typeof cssAsset?.source === "string"
      ? cssAsset.source
      : await readFile(
          path.join(DIST_EXPORT_DIR, "entry-client.css"),
          "utf-8",
        );

  return { js, css };
}

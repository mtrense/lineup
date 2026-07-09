/**
 * @vitest-environment node
 *
 * Integration test for the export Vite build (see PLAN.md, milestone 0019,
 * Task 4). Runs a real Vite build against `vite.export.config.ts` and
 * asserts the emitted JS/CSS are what the export CLI needs to inline.
 *
 * Runs under the "node" environment (not the project default "jsdom") —
 * esbuild (invoked by Vite's build()) is incompatible with jsdom's
 * TextEncoder shim.
 *
 * Covers:
 *   - buildExportBundle() resolves with non-empty js and css
 *   - js contains a hydration marker (references hydrateRoot)
 *   - css contains a Tailwind-generated rule
 *   - the build emits exactly one JS file and one CSS file on disk (no
 *     separate chunks) — a structural check rather than a text search for
 *     "import(", since React's own dev-mode warning strings can legitimately
 *     contain that substring and produce false positives
 */
import { describe, it, expect } from "vitest";
import { readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildExportBundle } from "./build-bundle";

const DIST_EXPORT_DIR = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../dist-export",
);

describe("buildExportBundle()", () => {
  it(
    "produces a single inlined JS bundle and CSS file",
    async () => {
      const { js, css } = await buildExportBundle();

      expect(js.length).toBeGreaterThan(0);
      expect(css.length).toBeGreaterThan(0);

      expect(js).toMatch(/hydrateRoot/);
      expect(css).toMatch(/--color-background|\.bg-|\.text-|\.flex\b/);

      const emittedFiles = readdirSync(DIST_EXPORT_DIR);
      expect(emittedFiles.filter((f) => f.endsWith(".js"))).toHaveLength(1);
      expect(emittedFiles.filter((f) => f.endsWith(".css"))).toHaveLength(1);
    },
    30000,
  );
});

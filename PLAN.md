# Plan: Single-comparison self-contained HTML export

> Milestone: roadmap/0019-single-comparison-html-export.md
> Started: 2026-07-09

## Overview

Build a `pnpm export <type>` CLI that emits one self-contained HTML file for a
comparison type. Per **ADR 0001**, rendering reuses the app's React components via
`react-dom/server` (SSR) + client `hydrateRoot`, so formatting/ranking always matches
the live app. The reuse target is **`ComparisonView`** — it is prop-driven and
router-free. `ComparisonPage`/`App`/`react-router-dom` are deliberately excluded; the
export supplies data as props and holds filter/sort/selection state in memory only (no
URL persistence, per milestone scope).

**Key architectural facts established during breakdown:**
- `app/src/lib/data.ts` loads data via browser-only dynamic `import()`. The export
  does **not** reuse it; a Node/`fs`-based loader reads `data/<type>/*.json` directly,
  producing the same `{ attributes, candidates, candidateEntries }` shape that
  `ComparisonView` consumes.
- CSS (Tailwind v4) and the client JS are produced by a dedicated Vite build with
  code-splitting disabled and assets inlined, then embedded as a single `<style>` and a
  single `<script>`.
- SSR transform of TS/JSX/CSS/SVG imports is done through Vite's programmatic API
  (`createServer(...).ssrLoadModule(...)`), so the render module needs no separate
  precompiled artifact.
- Icons: FontAwesome renders as inline SVG from the JS bundle (no network). Devicon
  glyphs are currently `<img src>` pointing at Vite-hashed local assets; for the export
  those imports are rewritten to **jsdelivr CDN URLs** (the one permitted network
  request), so no separate asset files are emitted.
- **Dark mode matches the live app**: an inline `<head>` script applies `.dark` from
  `prefers-color-scheme`. No toggle component is added (decision: parity with live app).
- **Script location**: `"export"` script lives in `app/package.json`; the CLI is
  `app/scripts/export.ts`. A repo-root `.scripts/export.sh` wrapper calls
  `pnpm --dir app export "$@"` so it also runs from the repo root.

## Tasks

[x] 1. Node-side comparison-data loader (fs-based)
- **Files:** `app/scripts/lib/load-comparison.ts`, `app/scripts/lib/load-comparison.test.ts`
- **Description:** A pure Node module exporting `loadComparison(comparisonId): { attributes, candidates, candidateEntries }` that reads, via `node:fs`/`node:path`, `data/<id>/attributes.json`, `data/<id>/index.json`, and one file per entry in that index (`data/<id>/<candidateId>.json`), returning the exact shape `ComparisonView` expects (mirroring `getComparisonData` in `app/src/lib/data.ts`, but synchronous and `fs`-based). Resolve the `data/` directory relative to the repo root (`app/..`). Also export `comparisonExists(comparisonId): boolean` (checks the id against `data/index.json`'s `comparisons[]` and/or directory existence). On a missing directory or missing/malformed files, throw a typed `ComparisonNotFoundError` (or a plain `Error` with a stable, clear message like `Unknown comparison type "<id>"`). Reuse the shared `@/types` interfaces via a relative import or a local type import — do not redefine the shapes.
- **Architecture & Decisions:**
  - Deliberately does NOT reuse `data.ts` (its dynamic `import()` is a Vite/browser construct). This fs loader is the export's server-side data path.
  - Keep it framework-free (no React, no Vite) so it is trivially unit-testable under Vitest's node/jsdom env and importable from the CLI.
  - Directory root: compute from `import.meta.url` (`app/scripts/lib/` → repo root is three levels up), not `process.cwd()`, so it works regardless of invocation directory.
- **Non-Functional Considerations:**
  - Validate the id before touching the filesystem to give a clean error instead of an ENOENT stack trace.
- **Test Cases:**
  - `loadComparison("databases")` returns an object whose `candidates` array is non-empty and whose `attributes.groups` is non-empty; a known candidate name (e.g. "PostgreSQL") appears.
  - `candidateEntries` length equals `candidates` length and preserves index order.
  - `loadComparison("does-not-exist")` throws with a message containing the bad id.
  - `comparisonExists("databases")` is `true`; `comparisonExists("nope")` is `false`.
- **Commit Message:** `feat(export): add fs-based comparison-data loader for the HTML export`

[x] 2. Export root component + SSR render function + client hydration entry
- **Files:** `app/src/export/ExportRoot.tsx`, `app/src/export/render.tsx`, `app/src/export/entry-client.tsx`, `app/src/export/render.test.tsx`
- **Description:** Create the reusable render surface shared by SSR and hydration.
  - `ExportRoot.tsx`: a component `ExportRoot({ data })` that renders `<ComparisonView>` with `attributes`/`candidates`/`candidateEntries` from `data`, an initial selection derived from `candidateEntries` where `shownByDefault` is true (fall back to all when none), a no-op `onBack`, and omitted/no-op change callbacks (state stays in `ComparisonView`'s internal `useState`; nothing is persisted). No router, no `ComparisonPage`.
  - `render.tsx`: export `renderExportHtml(data): string` using `renderToString(<ExportRoot data={data} />)` from `react-dom/server`. This is the module the CLI loads via Vite SSR.
  - `entry-client.tsx`: the browser hydration entry. Imports `../index.css` (so the export build captures the app CSS), reads `window.__LINEUP_DATA__`, and calls `hydrateRoot(document.getElementById("root")!, <ExportRoot data={...} />)`. Wrap in `StrictMode` to match `main.tsx`.
- **Architecture & Decisions:**
  - `ExportRoot` is the single source of truth for what the export mounts — used verbatim by both `render.tsx` (server) and `entry-client.tsx` (client) so SSR and hydration trees match (avoids hydration mismatches).
  - Per ADR 0001, reuse `ComparisonView` unchanged; do not fork any rendering/ranking logic.
  - Define a shared `ExportData` type = the loader's return shape; declare `window.__LINEUP_DATA__` via a module `declare global` so both entries are typed.
- **Non-Functional Considerations:**
  - SSR-safety: the initial render must not touch `window`/`document`. `ComparisonView` uses only `useEffect` (SSR-safe) and the filter drawer is closed by default (Radix dialog content not mounted until open), so `renderToString` should not hit browser globals. If any child does, guard it — but verify first, do not pre-emptively patch.
- **Test Cases:**
  - `renderExportHtml(databasesData)` returns a non-empty string containing expected candidate names (e.g. "PostgreSQL") and at least one rendered attribute value (a value that `ValueRenderer` would produce, e.g. a formatted number/text), proving shared components ran.
  - The output contains the comparison table markup (e.g. a `<table` / row structure) and not an empty root.
  - `ExportRoot` renders under `@testing-library/react` without a `Router` provider (no "useNavigate outside Router" error), confirming router independence.
- **Commit Message:** `feat(export): add ExportRoot, SSR render, and client hydration entry`

[x] 3. Rewrite Devicon SVG imports to CDN URLs for the export build
- **Files:** `app/scripts/lib/devicon-cdn.ts`, `app/scripts/lib/devicon-cdn.test.ts`
- **Description:** Provide the mechanism that turns bundled Devicon `<img src>` assets into remote CDN URLs so the export emits no separate asset files and needs no local Devicon assets at runtime. Two parts:
  - A pure helper `deviconCdnUrl(importPath): string` mapping a `devicon/icons/<name>/<file>.svg` import specifier to its jsdelivr URL (pin the installed devicon version, e.g. `https://cdn.jsdelivr.net/npm/devicon@2.17.0/icons/<name>/<file>.svg`). Export a small Vite plugin factory `deviconCdnPlugin()` that resolves `devicon/icons/**/*.svg` import ids and returns `export default "<cdnUrl>"` for each, leaving all other modules untouched.
  - The plugin will be consumed by the export Vite config in Task 4. FontAwesome is unaffected (it is inline SVG via JS).
- **Architecture & Decisions:**
  - Keep the URL derivation as a standalone pure function so it is unit-testable without running a Vite build.
  - Pin the devicon version from `app/package.json` (read it or hard-code the current `2.17.0` with a comment pointing at the dep) so CDN URLs are reproducible; note that a devicon bump must update this.
  - Rewriting at the bundler layer keeps `registry.ts`/`Icon.tsx` untouched — no `__EXPORT__` flags threaded through app code.
- **Non-Functional Considerations:**
  - CDN is the ONLY permitted runtime network request (milestone criterion); this task is what makes Devicon comply. FA and all app logic stay inline.
- **Test Cases:**
  - `deviconCdnUrl("devicon/icons/rust/rust-original.svg")` returns the exact expected jsdelivr URL including the pinned version and path.
  - A non-devicon specifier passed to the mapper is rejected/untouched (guard against over-broad rewrites).
  - (If feasible without a full build) the plugin's `resolveId`/`load` returns `export default "<url>"` for a devicon id and `null`/undefined for an unrelated id.
- **Commit Message:** `feat(export): resolve Devicon icons to CDN URLs in the export bundle`

[x] 4. Vite export build: single inlined JS + CSS bundle
- **Files:** `app/vite.export.config.ts`, `app/scripts/lib/build-bundle.ts`, `app/scripts/lib/build-bundle.test.ts`
- **Description:** Produce the client-side artifacts to inline into the HTML.
  - `vite.export.config.ts`: a Vite build config with entry `src/export/entry-client.tsx`, reusing the `@`/`@data` aliases and the `react`/`tailwindcss` plugins from `vite.config.ts`, plus the `deviconCdnPlugin()` from Task 3. Set `build.cssCodeSplit: false`, `build.assetsInlineLimit: Infinity`, `build.rollupOptions.output.inlineDynamicImports: true`, and a fixed output dir (e.g. `dist-export/`) with predictable filenames (no content hash) so the CLI can locate them. Target a single JS chunk + single CSS file.
  - `build-bundle.ts`: export `buildExportBundle(): Promise<{ js: string; css: string }>` that invokes Vite's programmatic `build()` with the export config and returns the emitted JS and CSS as strings (read from the Rollup output or the emitted files). This is what the CLI calls.
- **Architecture & Decisions:**
  - Separate config file (not a mode branch in `vite.config.ts`) keeps the main app build untouched — this is the "second build target" ADR 0001 anticipates.
  - Prefer reading generated code from Vite's returned Rollup `output[]` over re-reading disk when practical, to avoid races; disk read is an acceptable fallback.
  - Do not add the export build to the default `pnpm build`; it runs only under `pnpm export`.
- **Non-Functional Considerations:**
  - Performance: the build runs per export invocation; acceptable for a CLI. Keep it a one-shot `build()`, not a watcher.
- **Test Cases:**
  - `buildExportBundle()` resolves with non-empty `js` and `css`; `js` contains a hydration marker (e.g. references `hydrateRoot`/the entry) and `css` contains a Tailwind-generated rule (e.g. a `--color-background` custom property or a utility class). (Integration-style test; allow a generous timeout.)
  - The produced `js` contains no `import(` for a separate chunk (single-file / inlined dynamic imports).
- **Commit Message:** `feat(export): add Vite export build producing inlined JS and CSS`

[ ] 5. CLI orchestration, HTML assembly, and `pnpm export` wiring
- **Files:** `app/scripts/export.ts`, `app/scripts/export.test.ts`, `app/package.json`, `.scripts/export.sh`
- **Description:** Tie the pieces into the user-facing command.
  - `export.ts`: parse `process.argv` for the comparison-type id. If missing or `!comparisonExists(id)`, write a clear message to `stderr` and `process.exit(1)` (emit nothing to stdout). Otherwise: `loadComparison(id)` (Task 1) → SSR render via Vite (`createServer(...).ssrLoadModule("src/export/render.tsx")` then call `renderExportHtml(data)`) → `buildExportBundle()` (Task 4) → assemble a complete HTML document and write it to `stdout`. Close the Vite server before exiting.
  - HTML document: `<!DOCTYPE html>` + `<html lang="en">` + `<head>` with `<meta charset>`, `<meta viewport>`, a `<title>` from the comparison name, the **dark-mode inline script copied from `app/index.html`** (`prefers-color-scheme` → `.dark`), and `<style>{css}</style>`; `<body>` with `<div id="root">{ssrHtml}</div>`, a `<script>window.__LINEUP_DATA__ = {json}</script>` (serialize safely — escape `<`/` `/` ` and `</` to avoid breaking the script tag), and `<script>{js}</script>`. Order: data script before the bundle script.
  - `app/package.json`: add `"export": "vite-node scripts/export.ts"` (or `tsx scripts/export.ts` — pick whichever TS runner runs without heavy new deps; prefer `vite-node` since Vite is already required for SSR/build). 
  - `.scripts/export.sh`: a repo-root wrapper (`#!/usr/bin/env bash`, `set -euo pipefail`) that runs `pnpm --dir app export "$@"`, so `.scripts/export.sh <type> > file.html` works from the repo root, fitting the existing `.scripts/` convention.
- **Architecture & Decisions:**
  - This is the only integration point; all rendering/formatting stays in the reused components.
  - Runtime SSR via `ssrLoadModule` (not a prebuilt SSR bundle) so Vite transforms TS/JSX/CSS/SVG on the fly — matches the single-command `pnpm export` outcome.
  - stdout carries ONLY the HTML (all logs/build noise to stderr) so `pnpm export <type> > file.html` yields a valid file.
  - Factor the assembly into a testable `buildExportHtml(id): Promise<string>` core so the test does not shell out; the thin `main()` wrapper handles argv/exit codes.
- **Non-Functional Considerations:**
  - Security: escape the inlined JSON to prevent `</script>` injection from data content; the data is trusted (repo JSON) but correct escaping is required for valid HTML.
  - Rollback: the feature is additive (new files + one script entry); reverting the commits removes it cleanly with no data/app changes.
- **Test Cases:**
  - `buildExportHtml("databases")` returns HTML that (a) contains `<!DOCTYPE html>`, (b) contains expected candidate names and at least one rendered attribute value, (c) contains an inlined `<style>` block, (d) contains `window.__LINEUP_DATA__`, and (e) contains the SSR table markup inside `#root` (not an empty root).
  - Unknown id → the core rejects/throws and `main` exits non-zero with a stderr message naming the id; stdout is empty.
  - The inlined data JSON round-trips (serialized payload `JSON.parse`s back to the loaded data), and any `<` in data is escaped so the script tag is not prematurely closed.
- **Commit Message:** `feat(export): add pnpm export CLI assembling the self-contained HTML file`

## Cross-Cutting Concerns

- **Security:** The only injection surface is the inlined `window.__LINEUP_DATA__` JSON and the SSR HTML. Data comes from trusted repo JSON, but Task 5 must still escape `<`, ` `, ` ` in the serialized data to keep the `<script>` well-formed. No secrets, auth, or user input involved.
- **Performance:** Each `pnpm export` runs a one-shot Vite build + SSR render (seconds, acceptable for a CLI). No watcher, no persistent server. Not wired into `pnpm build`.
- **Observability:** All build/progress logging goes to `stderr`; `stdout` is reserved for the HTML so redirection produces a valid file. No metrics/alerting needed.
- **Migration:** None — additive feature, no data-format or schema changes.
- **Rollback:** Purely additive (new `app/scripts/`, `app/src/export/`, `app/vite.export.config.ts`, one `package.json` script, one `.scripts/` shell wrapper). Reverting the task commits fully removes it; the live app is untouched.

## Notes / Risks carried from reconnaissance

- **SSR-safety of Radix components** (FilterPanel's RangeSlider/DateRangePicker) is the main technical risk. Mitigated because the filter drawer is closed on initial render (its content is not mounted until opened), so `renderToString` should not exercise `ResizeObserver`/`window`. Task 2 verifies via the render test; if a real SSR crash surfaces, guard the offending access rather than forking the component.
- **Devicon version pinning** (Task 3): the CDN URL hard-codes the devicon version; a future devicon dependency bump must update `devicon-cdn.ts`.
- **TS runner for the CLI** (Task 5): the repo has no Node-script runner yet. Prefer `vite-node` (Vite is already a dep and is needed anyway for SSR/build) or `tsx`; add the minimal devDependency if required and note it in the commit.

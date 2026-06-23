# Plan: Landing Page Redesign

> Milestone: [Milestone 18 — Landing Page Redesign](ROADMAP.md#milestone-18-landing-page-redesign)
> Started: 2026-06-23

## Context Snapshot (from scout)

- **Landing page**: `app/src/pages/HomePage.tsx` — 43-line flat grid of shadcn `Card`s linking to `/<id>`; reads `getComparisons()`.
- **Data loader**: `app/src/lib/data.ts` — `getComparisons()` casts `@data/index.json` to `ComparisonsIndex`. The `@data` alias is defined in `app/vite.config.ts` but **not** in `app/vitest.config.ts` (pre-existing gap that this milestone's tests will surface).
- **Types**: `app/src/types/comparison.ts` (`ComparisonType`, `ComparisonsIndex`), re-exported through `app/src/types/index.ts`.
- **Asset loading precedent**: `app/src/lib/icons/registry.ts` imports SVGs via static ESM imports → Vite hashed asset URL strings (stub strings under Vitest, which has `assetsInclude: ["**/*.svg"]`). `import.meta.glob` is not yet used anywhere — the tile loader will be its first use; the glob pattern must be a static string literal.
- **Decorative SVG precedent**: `app/src/lib/icons/Icon.tsx` renders `<img src={url} alt="" aria-hidden>` for decorative glyphs.
- **Tests**: Vitest + jsdom + Testing Library; collocated `*.test.tsx` / `*.test.ts`; data-integrity tests import real JSON and assert invariants (`app/src/lib/icons/icons.*.test.ts`).
- **Skills**: `.claude/skills/<name>/SKILL.md` with YAML frontmatter (`name`, `description`, `model: opus`, `allowed-tools`, `argument-hint`) + markdown body. `gather-data` / `new-type` are good structural references.
- **Routing**: react-router-dom v7 — `/` → `HomePage`, `/:comparisonId` → `ComparisonPage`. Must remain unchanged.

## Group Taxonomy (proposed — confirm during review)

| groupId | name | order | comparisons |
|---------|------|-------|-------------|
| `databases` | Databases | 1 | databases, distributed-databases, rust-embedded-databases |
| `web-frontend` | Web & Frontend | 2 | spa-web-frameworks, ui-component-libraries, rich-text-editors, content-management-systems, website-hosting-providers |
| `ai-dev` | AI & Dev Workflow | 3 | ai-coding-agents, ai-workflows |
| `rust` | Rust | 4 | rust-gui, rust-scripting |
| `hardware` | Hardware | 5 | sbc, battery-powertools |
| `media` | Audio & Media | 6 | audio-transcription |

`test` → `hidden: true`, no `groupId`. Any comparison with a missing/unknown `groupId` degrades into a default "Other" bucket rendered last.

## Tasks

[x] 1. Data model: groups, groupId, hidden flag
- **Files:** `app/src/types/comparison.ts`, `data/index.json`, `app/src/lib/data.ts`, `app/vitest.config.ts`, `app/src/lib/data.test.ts` (new), `CLAUDE.md`
- **Description:** Introduce the grouping data model end-to-end. Add a `ComparisonGroup` interface (`id`, `name`, `description?`, `order: number`) and extend `ComparisonType` with `groupId?: string` and `hidden?: boolean`; extend `ComparisonsIndex` with `groups: ComparisonGroup[]`. Re-export `ComparisonGroup` through `app/src/types/index.ts`. In `data/index.json`, add the top-level `groups[]` array per the taxonomy table, add `groupId` to every active comparison, and add `"hidden": true` to the `test` entry. In `lib/data.ts` keep `getComparisons()` returning all entries, and add: `getComparisonGroups(): ComparisonGroup[]` (sorted by `order`) and `getGroupedComparisons()` returning an ordered list of `{ group, comparisons }` buckets that (a) excludes `hidden` comparisons, (b) places comparisons with a missing/unknown `groupId` into a trailing default "Other" bucket, (c) preserves index order within each group. Add the `@data` alias to `app/vitest.config.ts` (mirror `vite.config.ts`) so loader logic is testable. Document the `groups[]` / `groupId` / `hidden` schema in the `data/index.json` section of `CLAUDE.md`.
- **Architecture & Decisions:**
  - Grouping lives in `groups[]` in `index.json` (locked in during strategic planning) — not a per-item string table or separate file.
  - `getGroupedComparisons()` is the single UI-facing entry point so HomePage never re-implements bucketing/filtering. Default-bucket and hidden-filter logic lives here, tested in isolation.
  - Additive, non-breaking JSON changes — `getComparisons()` and `ComparisonPage` deep links (including `/test`) keep working; the `hidden` filter is landing-page-scoped, never applied at the loader's per-id lookups.
- **Non-Functional Considerations:**
  - `/test` must remain reachable via direct URL — only the landing grid hides it.
- **Test Cases:**
  - `getComparisonGroups()` returns all groups sorted by `order`.
  - `getGroupedComparisons()` buckets every active comparison under the correct group and preserves within-group order.
  - `test` (hidden) is absent from `getGroupedComparisons()` output.
  - A synthetic/unknown `groupId` (or missing) lands in a trailing "Other" bucket rather than vanishing.
  - Data-integrity: every non-hidden comparison in `index.json` has a `groupId` that matches a defined group.
- **Commit Message:** `feat(data): add comparison groups, groupId, and hidden flag to index`

[ ] 2. Tile SVG loader + decorative TileBackground component
- **Files:** `app/src/lib/tiles.ts` (new), `app/src/lib/tiles.test.ts` (new), `app/src/components/TileBackground.tsx` (new), `app/src/components/TileBackground.test.tsx` (new), `data/databases/tile.svg` (new, sample)
- **Description:** Build the tile-graphics pipeline. In `lib/tiles.ts`, use `import.meta.glob` with a static literal pattern (e.g. `import.meta.glob("../../../data/*/tile.svg", { eager: true, query: "?url", import: "default" })`) to map comparison id → asset URL, exposing `getTileUrl(comparisonId: string): string | null` (returns `null` when no `tile.svg` exists). Create `TileBackground`, a presentational component that renders the SVG as a subtle, low-opacity, decorative background (`aria-hidden`, empty/no alt, `pointer-events-none`, absolutely positioned to fill its container) and renders nothing when given a `null`/absent url. Author one real sample `data/databases/tile.svg` (simple, style-consistent, theme-neutral fills) to exercise the pipeline end-to-end.
- **Architecture & Decisions:**
  - Follow the icons precedent: SVGs resolve to Vite asset URL strings (stub strings under Vitest). `import.meta.glob` keys are build-time relative paths — derive the comparison id from the path segment.
  - `TileBackground` is purely decorative per the milestone's accessibility requirement: `aria-hidden="true"`, no semantic alt, never a click/focus target (the parent `Link` owns interaction).
  - Theme-neutral artwork: avoid hardcoded fills that vanish on dark cards; keep opacity low enough that title/description stay legible in both themes.
- **Non-Functional Considerations:**
  - Graceful fallback: missing `tile.svg` → component renders nothing, no broken image, no layout shift.
  - Decorative-only for screen readers.
- **Test Cases:**
  - `getTileUrl("databases")` returns a (stub) url; `getTileUrl("nonexistent")` returns `null`.
  - `TileBackground` with a url renders an `aria-hidden` element and no accessible alt text.
  - `TileBackground` with `null`/no url renders nothing.
- **Commit Message:** `feat(app): add tile SVG loader and decorative TileBackground component`

[ ] 3. Landing page: hero + grouped tile grid
- **Files:** `app/src/pages/HomePage.tsx`, `app/src/components/ComparisonTile.tsx` (new), `app/src/pages/HomePage.test.tsx` (new)
- **Description:** Rewrite the landing grid to render comparisons grouped under named, ordered headings using `getGroupedComparisons()`. Extract a `ComparisonTile` component that wraps the existing `Link` → `Card` (name + description), layering `TileBackground` behind the content. Render each group as a section with a heading (and optional group description) followed by its tile grid; render the trailing "Other" bucket only when non-empty. Replace the current single flat grid; keep the existing hero block (or lightly restyle it) at the top. The hidden `test` comparison must not appear.
- **Architecture & Decisions:**
  - Consume `getGroupedComparisons()` only — no bucketing/filtering logic in the component (it lives in `lib/data.ts` from Task 1).
  - `ComparisonTile` keeps the click target on the whole card and routes to `/<id>` unchanged; `TileBackground` sits behind content with content given a higher stacking context so text stays legible.
  - Responsive grid mirrors the current `md:grid-cols-2 lg:grid-cols-3` approach, now per-group.
- **Non-Functional Considerations:**
  - Accessibility: group headings use real heading elements (`<h2>`), tiles remain keyboard-navigable links, decorative background marked decorative.
  - Dark mode: tiles legible over background SVG in both themes.
- **Test Cases:**
  - HomePage renders a heading for each non-empty group in `order`.
  - Each comparison tile links to `/<id>` and shows its name + description.
  - The `test` comparison is not rendered.
  - A comparison with a `tile.svg` renders a `TileBackground`; one without renders the tile cleanly with no broken image.
  - Empty-state ("No comparisons available") still handled.
- **Commit Message:** `feat(app): render landing page comparisons grouped with tile backgrounds`

[ ] 4. Landing page: explanatory content sections
- **Files:** `app/src/pages/HomePage.tsx`, `app/src/components/LandingSections.tsx` (new), `app/src/pages/HomePage.test.tsx`
- **Description:** Add the four explanatory on-page sections below the grouped grid: (1) what Lineup is, (2) how it's built (static React app, JSON data compiled in at build time), (3) where the data comes from, and (4) how to contribute — framed around the AI-assisted research workflow (`RESEARCH.md` + the gather-data / research skills) with a link to the repository. Implement as a `LandingSections` component composed into `HomePage`. Pull a hero/intro into shape at the top if not finalized in Task 3.
- **Architecture & Decisions:**
  - Static presentational content; keep copy in the component (no new data file) — this is page chrome, not comparison data.
  - Repository URL referenced once as a clear external link.
  - Use semantic sections with headings for structure and accessibility; reuse existing Tailwind/shadcn typography conventions.
- **Non-Functional Considerations:**
  - Responsive (mobile → desktop) and dark-mode correct.
  - Heading hierarchy continues cleanly from the grid sections.
- **Test Cases:**
  - All four sections render with recognizable headings.
  - The repository link is present with a valid `href` and opens the repo.
  - Sections render without depending on comparison data (resilient to empty grid).
- **Commit Message:** `feat(app): add explanatory landing page sections and repo link`

[ ] 5. SVG tile generator skill
- **Files:** `.claude/skills/generate-tile/SKILL.md` (new), `CLAUDE.md`
- **Description:** Author a new skill that, given a comparison type id, generates one or more candidate `data/<type>/tile.svg` suggestions in the project's visual style (subtle, decorative, theme-neutral, low detail suited to a low-opacity background). Match the existing skill file structure exactly (YAML frontmatter: `name`, `description`, `model: opus`, `allowed-tools`, `argument-hint`; then a markdown body describing inputs, the style contract, where output lands — `data/<type>/tile.svg` — and how it relates to the loader/fallback from Task 2). Document the skill (name, args, output location) in the relevant guide section of `CLAUDE.md`.
- **Architecture & Decisions:**
  - Output path is fixed at `data/<type>/tile.svg` so the Task 2 loader picks it up with zero wiring.
  - Encode the style contract in the skill body: viewBox/sizing convention, theme-neutral palette, decorative-only intent, no embedded text.
  - `allowed-tools` scoped to what the skill needs (Read for context, Write for the SVG); no commit step (commits are owned by the `/commit` skill per project convention).
- **Non-Functional Considerations:**
  - Generated SVGs must satisfy the decorative/legibility contract enforced by `TileBackground`.
- **Test Cases:**
  - (Manual) Invoking the skill on a type produces a valid, style-consistent `tile.svg` at the correct path that renders through `TileBackground`.
  - (Structural) SKILL.md frontmatter keys match the existing skill schema.
- **Commit Message:** `feat(skill): add generate-tile skill for comparison tile SVGs`

[ ] 6. First batch of tile graphics + integration verification
- **Files:** `data/<type>/tile.svg` (new, one representative per group), `app/src/pages/HomePage.test.tsx` (extend), `README.md`
- **Description:** Produce a representative first batch of `tile.svg` graphics — at least one per group (databases sample from Task 2 counts) — using the generator skill from Task 5, demonstrating the rendering pipeline across groups while remaining types fall back gracefully. Extend HomePage tests to assert that tiled vs. untiled comparisons both render correctly. Run the full suite and production build; update `README.md` with a short note on tile graphics and the `generate-tile` skill if user-facing docs warrant it.
- **Architecture & Decisions:**
  - Batch scope is "one per group", not all ~16 — full coverage grows over time via the skill (milestone-locked decision). Untiled types use the Task 2 fallback.
  - No candidate or attributes files touched — tiles are per-type decorative assets only.
- **Non-Functional Considerations:**
  - Verify legibility over each new tile in both light and dark mode (manual).
  - Confirm `pnpm --dir app build` stays clean and the bundle doesn't pull in anything unexpected.
- **Test Cases:**
  - A type with a new `tile.svg` renders a `TileBackground`; a type without one renders the fallback (no broken image).
  - Full suite green; production build clean.
- **Commit Message:** `feat(data): add first batch of comparison tile graphics`

## Cross-Cutting Concerns

- **Security:** None — static content, no user input, no secrets. External repo link should be a plain, known URL.
- **Performance:** `import.meta.glob({ eager: true })` inlines tile URLs at build time (no runtime fetch waterfall). Keep SVGs small/simple; confirm the production build stays lean (no full-pack pulls), consistent with the M16/M17 bundle discipline.
- **Accessibility:** Decorative tile graphics marked `aria-hidden` with empty/no alt; group and section headings use real heading elements with a clean hierarchy; tiles remain keyboard-navigable links; verify legibility over backgrounds in light and dark mode.
- **Migration:** Additive JSON schema change only (`groups[]`, `groupId`, `hidden`). No backfill of existing candidate/attributes files. `getComparisons()` stays backward-compatible.
- **Rollback:** Each task is an independent commit; reverting the landing-page commits restores the prior flat grid without touching comparison data. The `@data` vitest-alias and data-model changes are inert if the UI is reverted.

## Open Questions (resolve during review)

1. **Group taxonomy & names** — confirm the six-group split above, especially the single-item `media` group for `audio-transcription` (alternative: fold it into a broader "Tools/Other" group).
2. **Repository URL** — confirm the canonical repo link to use in the contribute section.
3. **Hero treatment** — keep the current minimal hero or expand it as part of Task 3/4.

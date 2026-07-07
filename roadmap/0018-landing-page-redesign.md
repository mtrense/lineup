# Milestone 18: Landing Page Redesign

**Status:** completed
**Completed:** 2026-06-23

### Value / Impact
First-time visitors currently land on an unstyled flat grid of cards with a one-line tagline and no context. This milestone turns the landing page into a proper front door: comparisons organized into named groups, each tile carrying its own decorative background graphic, and on-page sections that explain what Lineup is, how it's built, where the data comes from, and how to contribute. Benefits anyone arriving without prior context — visitors, prospective contributors, and stakeholders being shown the project.

### Outcome
- `data/index.json` gains a top-level `groups[]` section (each group with `id`, `name`, optional `description`, and ordering), and every comparison is tagged with a `groupId`. Comparisons render on the landing page bucketed under their named group heading, in a sensible order.
- A `hidden` (or `sample`) flag exists on comparison entries so the `test` sample type no longer appears on the public landing page.
- Each comparison can supply a decorative `data/<type>/tile.svg`, loaded at build time and rendered as a subtle, low-opacity background behind its tile. Tiles without a bespoke SVG fall back gracefully (no broken/blank tile).
- A new skill generates SVG tile suggestions for a comparison type, so coverage can grow through tooling rather than authoring all graphics by hand. The skill produces candidate `tile.svg` artwork (or drafts) for a given type, consistent with the visual style.
- The landing page is visually redesigned: a hero/intro, the grouped tile grid with background graphics, and explanatory sections covering: (1) what Lineup is, (2) how it's built (static React app, JSON data compiled in), (3) where the data comes from, and (4) how to contribute — framed around the AI-assisted research workflow (RESEARCH.md + the gather-data/research skills) with a link to the repository.
- Existing navigation is preserved: clicking a tile still routes to `/<comparison-id>`; deep links and the comparison view are unaffected.

### Success Criteria
- [x] `data/index.json` has a `groups[]` definition (id, name, description, order) and every active comparison carries a `groupId`; the loader/types expose groups to the UI.
- [x] Landing page renders comparisons grouped under named, ordered group headings (ungrouped/unknown groupId degrades to a sensible default bucket rather than disappearing).
- [x] A `hidden`/`sample` flag is honored: the `test` comparison no longer shows on the landing page but remains reachable/usable for testing.
- [x] Comparison tiles render a subtle background SVG from `data/<type>/tile.svg` when present, at low opacity behind the title/description, without harming legibility (light and dark mode) or click target.
- [x] Tiles with no `tile.svg` render a graceful fallback — no broken image, no layout shift.
- [x] At least a representative first batch of `tile.svg` graphics ship (e.g. one per group), demonstrating the rendering end-to-end; remaining types use the fallback.
- [x] A new skill exists that, given a comparison type, generates one or more `tile.svg` suggestions in the project's style, and is documented (name, args, where output lands).
- [x] The landing page includes the four explanatory content areas (what it is / how it's built / data sources / how to contribute via the AI-assisted workflow), with a link to the repository.
- [x] The page is responsive (mobile → desktop), accessible (headings, alt/ARIA for decorative graphics marked decorative, keyboard nav), and works in dark mode.
- [x] Existing routing/behavior unchanged: tiles link to `/<id>`; the comparison view, filtering, and deep links still work.
- [x] Tests cover the grouping/hidden-flag data logic and the tile rendering (SVG present vs. fallback); the suite stays green and the production build is clean.

### Notes
- **Decisions locked in during strategic planning:** grouping lives in a `groups[]` section of `index.json` (not a per-item string or separate file); tile graphics are hand-authored SVGs stored inline at `data/<type>/tile.svg`; explanatory content lives as sections on the landing page (no separate `/about` route); the contribution story is framed around the AI-assisted research workflow; the `test`/sample type is hidden via a flag; full SVG coverage is achieved over time via a generator skill rather than authored all-at-once in this milestone.
- **Proposed group taxonomy (refine during break-down):** Databases (databases, distributed-databases, rust-embedded-databases); Web & Frontend (spa-web-frameworks, ui-component-libraries, rich-text-editors, content-management-systems, website-hosting-providers); AI & Dev Workflow (ai-coding-agents, ai-workflows); Rust (rust-gui, rust-scripting); Hardware (sbc, battery-powertools); plus audio-transcription. Some types could fit multiple groups — final assignment is a one-per-comparison `groupId` decided in break-down.
- **Largest risk is the SVG work.** The generator skill plus a fallback de-risk it: the milestone is "done" with the rendering pipeline + a first batch of graphics + the skill, not with all ~16 bespoke illustrations.
- **Decorative graphics must be marked decorative** (`aria-hidden` / empty alt) so screen readers skip them; legibility over background SVG must hold in both themes.
- **Out of scope:** changing the comparison view itself; a separate About route; search across comparisons; any live/in-app contribution flow (contribution remains via the repo + research workflow).
- **Possible split during break-down** if it runs large: (a) data model — groups/hidden flag/types/loader; (b) landing redesign — grouped grid, tiles, SVG rendering + fallback, explanatory sections; (c) the SVG generator skill + first batch of graphics.

### Closing Notes
- **Scope landed exactly as broken down.** All six PLAN.md tasks shipped as their planned commits (`c66e839`, `a5f564c`, `3b472fe`, `05f9134`, `6792c66`, `724946c`). No tasks split, grew, or were added mid-milestone. The three open questions (group taxonomy, repo URL, hero treatment) were resolved in review without reshaping the task list.
- **Group taxonomy adopted as proposed, six groups.** `databases`, `web-frontend`, `ai-dev`, `rust`, `hardware`, `media` (the single-item Audio & Media bucket for `audio-transcription`). The "fold media into Other" alternative was not taken — a named group reads better than a catch-all. `getGroupedComparisons()` still degrades any unknown/missing `groupId` into a trailing "Other" bucket, so the taxonomy is forgiving of future additions.
- **One cross-cutting fix beyond the plan — `currentColor` theming.** The first tile batch (Task 6) was committed, then a follow-up fix (`2dc1549`) inlined the tile SVGs and switched them to `fill="currentColor"` so the artwork inherits text colour and adapts to light/dark mode rather than rendering with baked-in fills. This refined the Task 2 decision (SVG-as-`<img>`/asset-URL) for the decorative-tile case specifically; the icon pipeline's `<img>` approach was left untouched. The `generate-tile` skill's style contract encodes `fill="currentColor"` so future tiles are correct by construction.
- **First batch is one tile per group (6 tiles), not per type.** `databases`, `spa-web-frameworks` (web-frontend), `ai-coding-agents` (ai-dev), `rust-gui` (rust), `sbc` (hardware), `audio-transcription` (media). The remaining ~10 types fall back cleanly to no-tile rendering; coverage grows over time via `/generate-tile`, per the milestone-locked decision.
- **The `@data` vitest-alias gap was closed.** Task 1 added the `@data` alias to `app/vitest.config.ts` (previously only in `vite.config.ts`), which is what made `getGroupedComparisons()`/`getComparisonGroups()` testable in isolation — a pre-existing gap the scout flagged and this milestone resolved.
- **Decision changes:** None. **Postponed items:** None.

### Manual Testing & Demo

**Prerequisites:**
- Working tree at `main` (HEAD = `2dc1549` or later).
- `pnpm install` in `app/` has been run at least once.

**Verification Steps:**
1. Run the test suite: `pnpm --dir app test:run`.
   - Expected: 356 passing tests across 28 files, including `data.test.ts` (grouping/hidden-flag logic), `tiles.test.ts`, `TileBackground.test.tsx`, and `HomePage.test.tsx`.
2. Run the production build: `pnpm --dir app build`.
   - Expected: clean `tsc` pass; successful Vite build. The ~671 kB index-chunk warning is pre-existing and unrelated to this milestone.
3. Start the dev server: `pnpm --dir app dev` and open `/`.
   - Expected: comparisons render under six named, ordered group headings (Databases, Web & Frontend, AI & Dev Workflow, Rust, Hardware, Audio & Media) — not a flat grid.
4. Inspect tiles in the Databases, Web & Frontend, AI & Dev Workflow, Rust, Hardware, and Audio & Media groups.
   - Expected: `databases`, `spa-web-frameworks`, `ai-coding-agents`, `rust-gui`, `sbc`, and `audio-transcription` each show a subtle low-opacity background graphic; every other tile renders cleanly with no broken image and no layout shift.
5. Toggle dark mode.
   - Expected: tile artwork inherits the text colour (`currentColor`) and stays subtle; title and description remain legible in both themes.
6. Confirm the `test` sample type is absent from the landing grid, then navigate directly to `/test`.
   - Expected: not shown on the landing page, but the comparison view still loads at its direct URL.
7. Scroll below the grid.
   - Expected: four explanatory sections — "What is Lineup?", "How it's built", "Where the data comes from", "How to contribute" — with a working GitHub repository link (opens in a new tab).
8. Click any tile.
   - Expected: routes to `/<comparison-id>`; the comparison view, filtering, and deep links work unchanged.

**Demo Script** (for stakeholder presentation):
1. Open `/` — point out the redesigned front door: comparisons organized into named groups instead of an undifferentiated card grid.
2. Highlight a tiled group (e.g. Hardware → `sbc`) and note the decorative background graphic sitting subtly behind the title.
3. Toggle dark mode to show the artwork re-tinting via `currentColor` while text stays legible.
4. Scroll to the explanatory sections — walk through what Lineup is, how it's built (static React + JSON compiled at build time), where the data comes from (RESEARCH.md + AI-assisted gather-data workflow), and how to contribute, ending on the GitHub link.
5. Run `/generate-tile <type>` on a type without a tile to show how coverage grows through tooling rather than hand-authoring all artwork.
6. Click a tile to show navigation and the comparison view are unchanged — the redesign is purely the front door.

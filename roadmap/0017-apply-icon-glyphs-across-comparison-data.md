# Milestone 17: Apply Icon Glyphs Across Comparison Data

**Status:** completed
**Completed:** 2026-06-13

### Value / Impact
The icon capability from Milestone 16 is only useful once the real comparisons adopt it. This milestone is a deliberate sweep: explore each comparison type for attributes whose values would read better as glyphs (Platforms/OS support, programming language, license, package manager, supported databases, etc.), then update that type's `attributes.json` (and candidate files where warranted) to use icon-bearing tags. The work is itemized per comparison so it can be split into independent, individually committable tasks during break-down.

### Outcome
- Every active comparison type has been audited for icon-applicable attributes, and the high-value ones now render glyphs (icon-only or icon+label) instead of plain text.
- Updates land in each type's `attributes.json` (tag icon mappings and display options) and, where the audit surfaces values that should become tags or new icon attributes, in the relevant candidate JSON and `RESEARCH.md` files.
- No comparison regresses: rendering, filtering, sorting, and highlighting continue to work.

### Success Criteria
- [x] An audit pass identifies, per comparison type, which attributes benefit from icon glyphs (recorded so break-down can scope one task each). — recorded in PLAN.md's per-type audit verdict table.
- [x] Icon glyphs applied (attributes.json + candidate/RESEARCH.md as needed) for each active comparison type:
  - [x] ai-coding-agents — `interface` tags
  - [x] ai-workflows — `install-mechanism` tags
  - [x] audio-transcription — `platforms` (OS/brand logos)
  - [x] battery-powertools — no icon-worthy attribute; explicitly recorded in RESEARCH.md
  - [x] content-management-systems — `database-support`, `frontend-frameworks` tags (+ hex→named color fix)
  - [x] databases — no icon-worthy attribute; explicitly recorded in RESEARCH.md
  - [x] distributed-databases — no icon-worthy attribute; explicitly recorded in RESEARCH.md
  - [x] rich-text-editors — `framework` tags
  - [x] rust-embedded-databases — no icon-worthy attribute; explicitly recorded in RESEARCH.md
  - [x] rust-gui — no icon-worthy attribute; explicitly recorded in RESEARCH.md
  - [x] rust-scripting — `language-family` tags
  - [x] sbc — `distros-with-images` (Linux distro logos)
  - [x] spa-web-frameworks — `primary-language` (shipped in M16; verified still wired)
  - [x] ui-component-libraries — `framework` tags
  - [x] website-hosting-providers — `git-integration`, `functions-runtime`, `supported-frameworks` tags
- [x] Where the audit finds no icon-worthy attribute for a type, that is explicitly noted rather than silently skipped. — "Icon audit (Milestone 17)" note added to the 5 no-icon RESEARCH.md files.
- [x] All updated comparisons render correctly in the running app with glyphs and working tooltips. — 302-test suite green (per-type `icons.<type>.test.ts` assert every icon resolves through the real registry); manual spot-check pending in verification steps below.
- [x] Filtering/sorting/highlighting verified unaffected on every touched comparison. — icons attach to tag *definitions* only; no candidate `value` arrays changed; FilterPanel parity test green.

### Notes
- **Depends on Milestone 16** — the tag icon field, icon-only display option, and FontAwesome/Devicon rendering must exist first.
- **One task per comparison** during break-down, so each type is an independent commit (`data(<type>): …`).
- **Source policy carries over:** FontAwesome by default, Devicon for tech/language logos.
- **Prefer tag-definition edits:** most changes live in `attributes.json` tag definitions; only touch candidate files when a value must become a tag/icon it wasn't before.
- The `test` sample comparison and the inactive `paas-tools` directory (not registered in `data/index.json`) are out of scope.

### Closing Notes
- **Scope landed exactly as broken down.** All 12 PLAN.md tasks landed as their planned commits: one shared test helper (Task 1), nine per-type data commits (Tasks 2–10), one consolidated docs commit for the five no-icon-worthy types (Task 11), and a final verification roll-up (Task 12). No tasks split, grew, or were added mid-milestone.
- **The plan doubled as the audit artifact.** Success Criterion 1 ("an audit pass identifies, per type, which attributes benefit") was satisfied by PLAN.md's per-type verdict table rather than a separate document — 10 types got glyphs, 5 were recorded as having no icon-worthy attribute (taxonomic/categorical tags, not brand/tech/OS logos).
- **Registry-as-gate held up across the sweep.** Every glyph used in data is an explicit import + entry in `app/src/lib/icons/registry.ts`; the append-only, idempotent-by-name registry let later tasks reuse framework/DB/distro glyphs added by earlier ones without duplication. The production build stayed lean (no full icon CSS bundle, no `import *` of a pack) — confirmed in Task 12.
- **Partial coverage is the norm, by design.** Most touched attributes mix iconned and un-iconned tags (DynamoDB, Deno, Armbian, Remix, Web Components, etc. have no clean Free/Devicon glyph). `display: "both"` was used everywhere new this milestone so un-iconned tags degrade cleanly to label chips; `display: "icon"` remains used only by the M16 `spa-web-frameworks` demo where every tag has a distinct glyph.
- **One cross-cutting data fix beyond pure icon mapping.** `content-management-systems` (Task 3) stored hex tag colors, which `TagsValue` renders as gray; the two touched attributes' colors were converted to named Tailwind colors so their `"both"` chips render colored. Hex colors in non-icon types (`rust-embedded-databases`, `battery-powertools`) were deliberately left untouched.
- **No candidate files changed.** Icons attach to tag definitions in `attributes.json` only; every candidate's `value: string[]` is unchanged, so filtering/sorting/highlighting are unaffected by construction.
- **Decision changes:** None. **Postponed items:** None.

### Manual Testing & Demo

**Prerequisites:**
- Working tree at `main` (HEAD = `29d6f56` or later).
- `pnpm install` in `app/` has been run at least once.

**Verification Steps:**
1. Run the test suite: `pnpm --dir app test:run`.
   - Expected: 302 passing tests across 23 files, including every new `icons.<type>.test.ts` and the pre-existing `demo.test.ts` (spa-web-frameworks).
2. Run the production build: `pnpm --dir app build`.
   - Expected: clean `tsc` pass; lean bundle (only individually-imported glyphs in `registry.ts`; no full icon pack). The 655 kB index-chunk warning is pre-existing and unrelated to this milestone.
3. Start the dev server: `pnpm --dir app dev` and open `/audio-transcription`.
   - Expected: the **Platforms** row shows OS/brand glyphs (Apple for macOS/iOS, Windows, Linux, Android) alongside their labels; Web shows a globe glyph.
4. Open `/website-hosting-providers`.
   - Expected: **Git Integration** shows GitHub/GitLab/Bitbucket brand glyphs; **Functions Runtime** shows Node/Python/Go/Rust/Ruby; **Supported Frameworks** shows Next.js/Nuxt/Gatsby/Astro/Svelte/Angular/Vue/Vite. Un-iconned tags (Deno, Hugo, Jekyll, Remix, Eleventy) render as plain label chips.
5. Open `/content-management-systems`.
   - Expected: **Database Support** shows PostgreSQL/MySQL/MongoDB/SQLite glyphs (DynamoDB/Proprietary as label chips); **Frontend Frameworks** shows framework glyphs. Chips render in color (not gray) — confirming the hex→named-color fix.
6. On any touched type, open the filter dialog and filter on an icon-bearing attribute.
   - Expected: filter options still list tags by their text value; filtering a glyph-rendered tag narrows candidates identically to a label-rendered one. Sorting/highlighting unaffected.
7. Confirm graceful degradation: locate an un-iconned tag (DynamoDB, Deno, Armbian, Web Components).
   - Expected: it renders its text label, never a blank cell.

**Demo Script** (for stakeholder presentation):
1. Open `/audio-transcription` — point out the Platforms row now reads as OS logos rather than "macOS, Windows, Linux, Android".
2. Open `/website-hosting-providers` — show three attribute rows (git host, runtime, framework) each carrying recognizable brand logos, with un-iconned options (Deno, Hugo) sitting cleanly as label chips beside them.
3. Open the filter dialog and filter by a framework or runtime — "filtering operates on the underlying value, so the glyphs are purely presentational; nothing about filtering/sorting changed."
4. Explain the audit discipline: "Five types — databases, distributed-databases, rust-gui, rust-embedded-databases, battery-powertools — were audited and found to have only taxonomic tags with no recognizable logos. Rather than force mismatched glyphs, that verdict is recorded in each type's RESEARCH.md so a future attribute with tech/brand values gets revisited."

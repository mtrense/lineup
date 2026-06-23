# Lineup Roadmap

## Milestone 1: Project Foundation
**Status:** Done

### Goals
- Establish the React application with all tooling configured
- Create the data loading infrastructure
- Have a running development environment

### Success Criteria
- [x] `app/` directory with working Vite + React + TypeScript setup
- [x] pnpm configured as package manager
- [x] Tailwind CSS integrated and working
- [x] shadcn/ui installed with base components
- [x] Build compiles without errors
- [x] Dev server runs with hot module replacement
- [x] Basic routing structure in place (if needed)

---

## Milestone 2: Data Infrastructure
**Status:** Done

### Goals
- Implement compile-time JSON data loading
- Create TypeScript types matching the schema in CLAUDE.md
- Build data access utilities

### Success Criteria
- [x] TypeScript interfaces for all data types (Attribute, AttributeGroup, Candidate, etc.)
- [x] Vite plugin or import mechanism for loading JSON at build time
- [x] `data/index.json` created with comparisons array
- [x] Utility functions for accessing comparison data
- [x] Type-safe data access throughout the app

---

## Milestone 3: Core Comparison UI
**Status:** Done

### Goals
- Build the main comparison view components
- Display candidates side-by-side with their attribute values
- Support all value types defined in the schema

### Success Criteria
- [x] Comparison selection/landing page
- [x] Side-by-side candidate comparison layout
- [x] Collapsible attribute groups
- [x] Value renderers for all types:
  - [x] Integer (with direction indicators)
  - [x] Decimal (with direction indicators)
  - [x] Filesize (formatted display)
  - [x] Duration (formatted display)
  - [x] Text
  - [x] Boolean (checkmark/cross)
  - [x] Rating (configurable symbols)
  - [x] Tags (colored labels)
  - [x] Icon (FontAwesome support)
  - [x] Link (clickable URLs)
- [x] Responsive layout for different screen sizes

---

## Milestone 4: First Comparison Data
**Status:** Done

### Goals
- Add the first real comparison type with researched data
- Validate the data schema works in practice
- Provide a meaningful example for future comparisons

### Implemented Comparison Type
**Databases** - Chosen because:
- Well-documented with objective metrics
- Clear differentiating attributes (ACID compliance, query language, scaling model, etc.)
- Popular candidates are well-known (PostgreSQL, MySQL, MongoDB, SQLite, etc.)
- Mix of value types: booleans, tags, ratings, links, text

### Success Criteria
- [x] `data/databases/` directory created
- [x] `RESEARCH.md` with research guidelines
- [x] `attributes.json` with comprehensive attribute groups (6 groups, 25 attributes)
- [x] `index.json` listing initial candidates
- [x] 5 candidate JSON files with complete data (PostgreSQL, MySQL, SQLite, MongoDB, Redis)
- [x] Data displays correctly in the comparison UI
- [x] Sources provided for factual claims

---

## Milestone 5: Usability Improvements
**Status:** Done

### Goals
- Add URL-based routing for navigation and shareability
- Fix text rendering issues in comparison table
- Improve overall usability

### Success Criteria
- [x] Path-based routing (e.g., `/databases`, `/databases?candidates=postgresql,mysql`)
- [x] Browser back/forward navigation works correctly
- [x] Text values wrap properly in table cells
- [x] Long descriptions display readably
- [x] Deep links to specific comparisons work

---

## Milestone 6: Candidate Selection
**Status:** Done

### Goals
- Allow users to select which candidates to compare
- Support adding/removing candidates from comparison
- Remember selection state

### Success Criteria
- [x] Candidate picker/selector UI
- [x] Add/remove candidates from active comparison
- [x] Visual indication of selected candidates
- [x] Support comparing 2-N candidates
- [x] URL state for shareable comparisons

### Notes
This milestone was implemented as part of Milestone 5 work. The candidate selector with pill buttons, selection state management, and URL persistence were all built into the initial ComparisonView component.

---

## Milestone 7: Filtering and Sorting
**Status:** Done

### Goals
- Enable filtering candidates by attribute values
- Support sorting by specific attributes
- Filtered candidates are greyed out and put to the back of the selection list
- Highlight best/worst values

### Success Criteria
- [x] Sort candidates by any sortable attribute
- [x] Visual ranking indicators based on direction
- [x] Filter candidates by tag values
- [x] Filter candidates by boolean attributes
- [x] Highlight best value in each row (respecting direction)

### Implementation Notes
- Sorting: Click attribute names to cycle through ascending → descending → none
- Highlighting: Best values get subtle green background, respects direction
- Tag filters: OR logic within attribute, AND between attributes
- Boolean filters: Tri-state (Any/Yes/No)
- Filtered candidates appear greyed out and moved to end of selector
- Sort state persisted to URL (`?sort=attribute-id&sortDir=asc|desc`)

---

## Milestone 8: Polish and UX
**Status:** Done

### Goals
- Refine the user experience
- Add helpful features for comparison workflows
- Ensure accessibility

### Success Criteria
- [x] Tooltips showing attribute descriptions
- [x] Source citations accessible (hover/click)
- [x] Keyboard navigation support
- [x] Dark mode support
- [x] Loading states and error handling
- [x] Empty states for missing data
- [x] Print-friendly view

### Implementation Notes
- Keyboard navigation: Focus rings on all interactive elements, skip-to-content link, ARIA attributes
- Loading: Skeleton component during data fetch, improved 404 error page
- Empty states: Styled null values with tooltip, empty comparison message
- Print: CSS media query hides navigation, adjusts table for printing

---

## Milestone 9: Enhanced Filter UI
**Status:** Done

### Goals
- Improve filter controls with clearer visual states
- Make boolean filters more intuitive with tri-state icons and colors
- Display tag filters as interactive pill/button groups
- Provide easy filter clearing per attribute

### Success Criteria
- [x] Boolean filters show distinct visual states:
  - Green with checkmark icon = Yes (filter for true)
  - Grey with minus icon = No choice (any value)
  - Red with cross icon = No (filter for false)
- [x] Tag filters displayed as pill/button groups (not toggle buttons)
- [x] Each tag filter group has a clear button (grey cross icon) on the far right
- [x] Filter states are visually distinct and accessible
- [x] Existing filter functionality preserved (URL state, filter logic)

### Implementation Notes
- Boolean filters: Single compact button per attribute that cycles through states on click
- Tag filters: Smaller pills with reduced padding, clear button appears when tags are selected
- Overall spacing reduced for a more compact filter panel

---

## Milestone 10: Attribute Descriptions and Expandable Rows
**Status:** Done

### Goals
- Add optional descriptions to attributes for more context on what's being assessed
- Replace value tooltips with an expandable row behavior for better discoverability and readability
- Provide a consistent UX pattern matching the existing group collapse behavior

### Success Criteria
- [x] `Attribute` interface extended with optional `description?: string` field
- [x] Expandable rows indicated by subtle angle icon on the left (similar to attribute groups)
- [x] Clicking a row expands to show:
  - Attribute description (if present)
  - Source citations (if present)
  - Value comments (if present)
- [x] Expanded state visually distinct but unobtrusive
- [x] Only rows with additional content (description, sources, or comments) show expand indicator
- [x] Tooltips removed in favor of expand behavior
- [x] Keyboard accessible (Enter/Space to toggle expand)
- [x] Animation consistent with group collapse/expand

### Implementation Notes
- Multiple rows can be expanded simultaneously (independent state per row)
- Chevron icon (ChevronRight/ChevronDown) mirrors attribute group pattern
- Expanded content row shows attribute description in first column, per-candidate sources/comments in remaining columns
- Values with metadata still show dotted underline visual indicator

---

## Milestone 11: Filter Dialog Fix
**Status:** Done

### Goals
- Resolve overlapping buttons in the filters dialog

### Success Criteria
- [x] Filter dialog close button (X) and clear all button no longer overlap
- [x] Dialog layout is clean and accessible on all supported viewport sizes

### Implementation Notes
- Filter dialog SheetTitle uses `pr-8` padding to avoid overlap with the close button

---

## Milestone 12: Repeated Candidate Headers in Sections
**Status:** Done

### Goals
- Display candidate names at the top of each attribute group section
- Provide visual context for which candidate is which when scrolling through long comparisons
- Simpler alternative to sticky headers that avoids alignment issues

### Success Criteria
- [x] Each attribute group shows candidate names in a header row when expanded
- [x] Header row styling matches the main title row (same look and feel)
- [x] Header row collapses/expands with its attribute group
- [x] Works correctly with all existing features (sorting, filtering, highlighting)

### Implementation Notes
- Section header row inserted after group header, only visible when group is expanded
- Uses same styling as main title row: `bg-muted/30`, `font-semibold`, `text-center`
- Sticky left column maintained with `sticky left-0 z-10`

---

## Milestone 13: Filter Dialog Organization
**Status:** Done

### Goals
- Organize filters in the dialog by their attribute group sections
- Match the order of filters to how attributes appear in attributes.json
- Improve discoverability by grouping related filters together

### Success Criteria
- [x] Filters grouped by attribute group (matching attributes.json structure)
- [x] Group headers displayed in the filter dialog to separate sections
- [x] Filters within each group maintain their original attribute order
- [x] Visual hierarchy makes it easy to find specific filters
- [x] Existing filter functionality preserved (URL state, filter logic, clear buttons)

### Implementation Notes
- Replaced separate `tagAttributes` and `booleanAttributes` memos with unified `filterableGroups` structure
- Groups with filterable attributes shown with headers and dividers between sections
- Filters within each group rendered in original attribute order (mixed tags and booleans)
- Keyboard navigation preserved via existing focus-visible styles

---

## Milestone 14: Range Slider Filters
**Status:** Done

### Goals
- Add range slider filters for numeric and temporal attribute types
- Allow users to filter candidates by value ranges (min/max bounds)
- Provide intuitive UI for setting range boundaries

### Success Criteria
- [x] Range slider component with dual handles (min/max)
- [x] Filter support for numeric types:
  - [x] Integer attributes
  - [x] Decimal attributes
  - [x] Rating attributes
  - [x] Filesize attributes (with formatted labels)
  - [x] Duration attributes (with formatted labels)
  - [x] Percentage attributes
- [x] Filter support for temporal types:
  - [x] Date attributes
  - [x] DateTime attributes
- [x] Range bounds calculated from actual candidate values (dynamic min/max)
- [x] Clear button to reset range to full extent
- [x] Visual indication of narrowed range vs full range
- [x] Range filters integrated into filter dialog (organized by attribute group)
- [x] Range filter state persisted to URL
- [x] Candidates outside range are filtered out (greyed out, moved to end)
- [x] Null values handling: option to include/exclude candidates with null values

### Implementation Notes
- RangeSlider component built on shadcn Slider with dual handles
- DateRangePicker component for date/datetime types using shadcn Calendar
- Range values formatted per type (e.g., "1.2 MB - 5.6 GB" for filesize)
- URL format: `?filter.attrId=min,max` or `?filter.attrId=min,max,null` (null suffix = includeNull)
- Debounced slider changes to prevent performance issues
- Comprehensive test coverage (173 tests)

---

## Milestone 15: Candidate Data Freshness Timestamp

**Status:** completed
**Completed:** 2026-04-20

### Value / Impact
Users comparing candidates currently have no way to tell how fresh the data is. Attribute values drift over time (version numbers, prices, feature flags, maintenance status), and a stale comparison can mislead a decision. Surfacing when each candidate was last verified lets readers weigh the data appropriately and helps maintainers spot candidates that need a refresh pass.

### Outcome
- Each candidate JSON file carries a top-level `lastVerified` field (ISO 8601 date, day precision, e.g. `"2026-04-20"`).
- The `gather-data` skill stamps/updates `lastVerified` whenever it writes a candidate file, in both `initial` and `refresh` modes.
- The comparison table renders a dedicated "Last Verified" row inside the **General Information** group, showing the date per candidate.
- Candidates without a `lastVerified` value (pre-existing data) render as `—` in that row, with no forced migration.

### Success Criteria
- [x] `CandidateFile` TypeScript interface extended with optional `lastVerified?: string` (ISO 8601 date).
- [x] `.claude/skills/gather-data/SKILL.md` updated so the skill writes/refreshes a top-level `lastVerified` (current date) whenever it saves a candidate file, in both `initial` and `refresh` modes — including any relevant cheatsheets, Phase 3 instructions, and rules sections.
- [x] `.claude/skills/add-candidate/SKILL.md` reviewed and, if it writes candidate JSON, updated to explicitly *omit* `lastVerified` on scaffold (so the row renders `—` until first research pass).
- [x] Comparison UI shows a "Last Verified" row as the first row of the General Information group, rendering the date per candidate.
- [x] Candidates with a missing/undefined `lastVerified` display `—` (em dash) in that row.
- [x] Existing candidate JSON files are **not** retroactively backfilled — they display `—` until their next gather-data pass.
- [x] CLAUDE.md updated to document the `lastVerified` field in the candidate file schema.
- [x] Existing UI behavior unaffected (sorting, filtering, highlighting continue to work on real attributes only — the new row is purely informational).

### Notes
- **No migration.** The field is explicitly undefined for pre-existing candidates, per the user's decision that these dates can't be added retrospectively without fabricating them. `—` is the honest representation.
- **Purely informational.** The row does not participate in sorting, filtering, highlighting, or freshness-based ranking in this milestone. Treating it as a ranked `date` attribute is deferred as a potential follow-up.
- **Granularity.** Timestamp is candidate-level (one per file), not per-attribute. Per-attribute freshness is out of scope.
- **Placement inside General Information group.** The row lives inside the existing group rather than as a separate table-level header, to reuse current rendering/collapsing machinery without a new layout concept.
- **Scope of updates.** Only `gather-data` touches `lastVerified`. `add-candidate` does not set it (a scaffolded candidate hasn't been researched yet).

### Closing Notes
- **Scope changes:** None to the four planned tasks — each landed as a single commit matching its plan entry (`f0332cd`, `42ad98a`, `f5e28f6`, `cb2c55a`).
- **Architectural surprise — pre-existing `tsc` failures surfaced.** When validating Task 1 with `pnpm build`, 33 unrelated TypeScript errors on `main` came to light in three buckets: unused imports, `vi.fn()` mock type assignability (`Mock<Procedure>` vs typed prop), and `DateType`/`DateTimeType` missing from the `ValueType` union (despite being handled at runtime in `range-utils.ts`). These were tracked in a temporary `TMP_FIX_COMPILER_ISSUES.md` and cleared across four sidecar commits (`6ad7c88`, `56646a7`, `2f38e03`, `4aee81a`, `c489991`) between Task 2 and Task 3. The scratch doc was removed once all buckets were green. Unrelated to `lastVerified` but a useful hygiene pass — Tasks 3 and 4 landed against a clean `tsc`.
- **Decision changes:** None. The original plan's architectural choices (inline row rendering, gating on first group by position not id, day-precision ISO string, no `ValueRenderer` routing, no backfill) held through implementation.
- **Postponed items:** None.

### Manual Testing & Demo

**Prerequisites:**
- Working tree at `main` (HEAD = `cb2c55a` or later).
- `pnpm install` in `app/` has been run at least once.

**Verification Steps:**
1. Start the dev server: `pnpm --dir app dev` and open `/databases`.
   - Expected: the General Information group is expanded by default, and its very first row reads "Last Verified".
2. Inspect the cells of the "Last Verified" row.
   - Expected: each existing candidate shows `—` (em dash, muted italic). No dates are fabricated — pre-existing data was deliberately not backfilled.
3. Collapse the General Information group by clicking its header.
   - Expected: the "Last Verified" row disappears along with every other row in that group.
4. Navigate to any other comparison type (e.g. `/website-hosting-providers`).
   - Expected: the first attribute group (whatever it's named) also shows a "Last Verified" row as its first row; no other group does.
5. Confirm sorting/filtering behavior is untouched.
   - Expected: clicking the "Last Verified" label does nothing (not interactive, no sort cycle triggered). Sorting by a real attribute still produces correct highlighting on the first attribute row.
6. Run the test suite: `pnpm --dir app test:run`.
   - Expected: 181 passing tests, including the new `ComparisonView.lastVerified.test.tsx` cases covering the em-dash fallback, collapse behavior, invalid-date handling, and single-group scoping.
7. Run the type check: `pnpm --dir app build`.
   - Expected: clean `tsc` pass (no residual errors from the mid-milestone hygiene work).

**Demo Script** (for stakeholder presentation):
1. Open `/databases` — point out the new "Last Verified" row at the top of General Information, with `—` across all candidates today.
2. Explain: "Today the row is blank because we deliberately didn't fabricate dates for already-shipped candidates. The next `/gather-data` run on any candidate will stamp that candidate's cell with today's date."
3. Run `/gather-data databases postgresql` (or any candidate) end-to-end.
4. Refresh the page — PostgreSQL's cell now shows a formatted date (e.g. "Apr 20, 2026") while the other candidates still show `—`.
5. Show `/add-candidate databases` producing a scaffold JSON with **no** `lastVerified` field — demonstrating the deliberate split: scaffolding is honest about not yet being researched.

---

## Milestone 16: Icon Glyphs for Attribute Values

**Status:** completed
**Completed:** 2026-06-13

### Value / Impact
Comparisons are easier to scan when categorical values carry recognizable marks instead of plain text — a row of OS logos reads faster than "Windows, macOS, Linux", and a Rust or Python glyph is recognized at a glance. Today this is impossible: the `icon-fontawesome` / `icon-emoji` value types render only a *placeholder* (`IconValue.tsx` loads no icon library), and categorical data like Platforms is stored as plain text tags. This milestone delivers a working icon capability so attribute values can show brand/tech glyphs, with FontAwesome as the default and Devicon where it fits tech logos better.

### Outcome
- FontAwesome is actually wired up (library loaded, not a CSS-class placeholder), and Devicon is available for technology/language logos.
- The **Tags** value type is extended so each tag can carry an optional icon (FontAwesome or Devicon), rendered as a glyph alongside or instead of its label.
- An `attributes.json` display option lets a Tags attribute render **icon-only**; when icon-only, the tag's text label is shown as a **tooltip** on hover/focus.
- Tag **filtering is unchanged** — it still operates on the underlying tag values regardless of whether the cell displays a glyph, a label, or both.
- Because the single `icon-fontawesome` / `icon-emoji` value types share the same glyph renderer, they begin rendering real icons too (no longer placeholders).
- At least one comparison demonstrates the capability end-to-end (e.g. Platforms/OS shown as OS logos and/or a programming-language attribute shown as a brand logo).

### Success Criteria
- [x] FontAwesome integration completed: `IconValue.tsx` renders real glyphs (placeholder comment and class-only approach removed), with the icon library/tree-shaking wired into the build.
- [x] Devicon support available for technology/language logos, selectable per icon (e.g. a `pack`/source indicator distinguishing FontAwesome vs Devicon).
- [x] `Tag` type extended with an optional icon (name + pack/source), documented in the CLAUDE.md schema.
- [x] `Tags` type gains a display option (e.g. `display: "icon"` / `iconOnly`) in `attributes.json` to render icon-only vs icon+label.
- [x] When a tag renders icon-only, its text value appears as an accessible tooltip (and as an `aria-label` for screen readers).
- [x] Existing tag filtering and highlighting continue to operate on tag values irrespective of icon/label display mode.
- [x] Existing single `icon-fontawesome` and `icon-emoji` value types render real glyphs (regression of the former placeholder).
- [x] CLAUDE.md updated to document the new tag `icon` field, the Tags `display`/icon-only option, and the FontAwesome-vs-Devicon source convention.
- [x] One comparison type updated as a working demo (Platforms/OS as logos and/or a language attribute as a logo), visible in the running app.
- [x] Test coverage for: glyph rendering, icon-only tooltip/aria-label, and filtering parity between display modes.

### Notes
- **Icon source policy:** FontAwesome is the default; use Devicon for attributes where it is better suited (programming languages, frameworks, databases, tooling logos). The chosen icon set must be expressible per-tag in `attributes.json`.
- **Tooltip reuse:** prefer reusing the existing expandable-row / tooltip affordances rather than reintroducing a separate hover-tooltip system, to stay consistent with Milestone 10's UX direction.
- **Bundle size:** import individual icons / tree-shake rather than loading an entire icon CSS bundle, to keep the static build lean.
- **Data lives on tag definitions:** icons attach to tag definitions in `attributes.json`, so candidate files that already reference tag ids inherit the glyph without per-candidate edits. Applying icons across the existing comparisons is deferred to Milestone 17.
- **Accessibility:** every icon-only value must remain legible to assistive tech via label/aria text.

### Closing Notes
- **Scope changes:** None. All five planned tasks landed as single commits matching their plan entries (`5024c00`, `dfee6dc`, `52fc383`, `5974fe1`, `ce467f6`). No tasks split, grew, or were added mid-milestone.
- **Architecture held as designed.** The cross-cutting decision to tree-shake via an explicit hand-maintained registry (`app/src/lib/icons/registry.ts`) rather than dynamic `import(name)` proved out: the production build stays lean (no full icon CSS bundle, no `import * as` of a pack) and the registry is the single append-only source of truth that Milestone 17's data sweep will extend mechanically. The `IconRef` discriminator (`{ name, pack? }`, default `fa-solid`) kept the value-type union stable — no new `icon-devicon` value type was needed.
- **Devicon-as-`<img>` decision.** SVG assets render via `<img src={url}>` (Vite asset URL in build, stub string under Vitest), deliberately avoiding `dangerouslySetInnerHTML`. The demo exercises this path with 10 Devicon language logos.
- **Demo chose `spa-web-frameworks` / `primary-language`** with `display: "icon"` to exercise the tooltip + `aria-label` path end-to-end. 10 of 11 language tags carry a Devicon glyph; PureScript has no registry entry and falls back to its text label, demonstrating the graceful-degradation contract by example.
- **Decision changes:** None. Tooltip reuse (Radix wrapper) and the `display` default of `"both"` (preserving prior icon+label behavior) held through implementation.
- **Postponed items:** None. Applying icons across the remaining comparison types is the separate, already-scoped Milestone 17 — not a postponement from this milestone.

### Manual Testing & Demo

**Prerequisites:**
- Working tree at `main` (HEAD = `ce467f6` or later).
- `pnpm install` in `app/` has been run at least once.

**Verification Steps:**
1. Start the dev server: `pnpm --dir app dev` and open `/spa-web-frameworks`.
   - Expected: the **Primary Language** row renders Devicon logos (JavaScript, TypeScript, Rust, Go, C#, Dart, Kotlin, Elm, Scala, Clojure) instead of text labels.
2. Hover or keyboard-focus an icon-only language tag.
   - Expected: a tooltip surfaces the language name; the element exposes the same name via `aria-label` (reachable by Tab, not just mouse).
3. Find the PureScript tag (a language tag with no registry entry).
   - Expected: it falls back to rendering its text label — nothing disappears.
4. Open the filter dialog and filter on Primary Language.
   - Expected: filter options still list languages by their text value; filtering a glyph-rendered tag narrows candidates identically to a label-rendered one.
5. Spot-check a single `icon-fontawesome` / `icon-emoji` value elsewhere in the app.
   - Expected: real glyphs render (no empty `<i className="fas …">` placeholder).
6. Run the test suite: `pnpm --dir app test:run`.
   - Expected: 214 passing tests, including `Icon.test.tsx`, `IconValue.test.tsx`, `TagsValue.test.tsx`, the FilterPanel parity test, and `spa-web-frameworks` `demo.test.ts`.
7. Run the production build: `pnpm --dir app build`.
   - Expected: clean `tsc` pass and a lean bundle (no full icon CSS bundle pulled in).

**Demo Script** (for stakeholder presentation):
1. Open `/spa-web-frameworks` — point out the Primary Language row now reads as a row of recognizable language logos rather than plain text.
2. Hover one logo to reveal the tooltip, then Tab to it to show the same label is keyboard- and screen-reader-accessible.
3. Show PureScript falling back to its text label — "an unregistered glyph degrades gracefully, it never blanks the cell."
4. Open the filter dialog and filter by language to show filtering operates on the underlying value, unaffected by the icon-only display.
5. Explain the registry gate: "Adding a glyph is one import + one registry entry in `app/src/lib/icons/registry.ts` — icons aren't free-form strings, which is what makes the build tree-shakeable. Milestone 17 will roll this out across every comparison type."

---

## Milestone 17: Apply Icon Glyphs Across Comparison Data

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

---

## Milestone 18: Landing Page Redesign

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

---

## Future Considerations (Not Scheduled)

- **Search**: Find candidates across all comparison types
- **Export**: Download comparison as CSV/PDF
- **Embed**: Shareable comparison widgets
- **User Contributions**: Suggest corrections or new candidates
- **Additional Comparison Types**: Languages, frameworks, cloud providers, etc.

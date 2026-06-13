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

**Status:** open

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
- [ ] FontAwesome integration completed: `IconValue.tsx` renders real glyphs (placeholder comment and class-only approach removed), with the icon library/tree-shaking wired into the build.
- [ ] Devicon support available for technology/language logos, selectable per icon (e.g. a `pack`/source indicator distinguishing FontAwesome vs Devicon).
- [ ] `Tag` type extended with an optional icon (name + pack/source), documented in the CLAUDE.md schema.
- [ ] `Tags` type gains a display option (e.g. `display: "icon"` / `iconOnly`) in `attributes.json` to render icon-only vs icon+label.
- [ ] When a tag renders icon-only, its text value appears as an accessible tooltip (and as an `aria-label` for screen readers).
- [ ] Existing tag filtering and highlighting continue to operate on tag values irrespective of icon/label display mode.
- [ ] Existing single `icon-fontawesome` and `icon-emoji` value types render real glyphs (regression of the former placeholder).
- [ ] CLAUDE.md updated to document the new tag `icon` field, the Tags `display`/icon-only option, and the FontAwesome-vs-Devicon source convention.
- [ ] One comparison type updated as a working demo (Platforms/OS as logos and/or a language attribute as a logo), visible in the running app.
- [ ] Test coverage for: glyph rendering, icon-only tooltip/aria-label, and filtering parity between display modes.

### Notes
- **Icon source policy:** FontAwesome is the default; use Devicon for attributes where it is better suited (programming languages, frameworks, databases, tooling logos). The chosen icon set must be expressible per-tag in `attributes.json`.
- **Tooltip reuse:** prefer reusing the existing expandable-row / tooltip affordances rather than reintroducing a separate hover-tooltip system, to stay consistent with Milestone 10's UX direction.
- **Bundle size:** import individual icons / tree-shake rather than loading an entire icon CSS bundle, to keep the static build lean.
- **Data lives on tag definitions:** icons attach to tag definitions in `attributes.json`, so candidate files that already reference tag ids inherit the glyph without per-candidate edits. Applying icons across the existing comparisons is deferred to Milestone 17.
- **Accessibility:** every icon-only value must remain legible to assistive tech via label/aria text.

---

## Milestone 17: Apply Icon Glyphs Across Comparison Data

**Status:** open

### Value / Impact
The icon capability from Milestone 16 is only useful once the real comparisons adopt it. This milestone is a deliberate sweep: explore each comparison type for attributes whose values would read better as glyphs (Platforms/OS support, programming language, license, package manager, supported databases, etc.), then update that type's `attributes.json` (and candidate files where warranted) to use icon-bearing tags. The work is itemized per comparison so it can be split into independent, individually committable tasks during break-down.

### Outcome
- Every active comparison type has been audited for icon-applicable attributes, and the high-value ones now render glyphs (icon-only or icon+label) instead of plain text.
- Updates land in each type's `attributes.json` (tag icon mappings and display options) and, where the audit surfaces values that should become tags or new icon attributes, in the relevant candidate JSON and `RESEARCH.md` files.
- No comparison regresses: rendering, filtering, sorting, and highlighting continue to work.

### Success Criteria
- [ ] An audit pass identifies, per comparison type, which attributes benefit from icon glyphs (recorded so break-down can scope one task each).
- [ ] Icon glyphs applied (attributes.json + candidate/RESEARCH.md as needed) for each active comparison type:
  - [ ] ai-coding-agents
  - [ ] ai-workflows
  - [ ] audio-transcription
  - [ ] battery-powertools
  - [ ] content-management-systems
  - [ ] databases
  - [ ] distributed-databases
  - [ ] rich-text-editors
  - [ ] rust-embedded-databases
  - [ ] rust-gui
  - [ ] rust-scripting
  - [ ] sbc
  - [ ] spa-web-frameworks
  - [ ] ui-component-libraries
  - [ ] website-hosting-providers
- [ ] Where the audit finds no icon-worthy attribute for a type, that is explicitly noted rather than silently skipped.
- [ ] All updated comparisons render correctly in the running app with glyphs and working tooltips.
- [ ] Filtering/sorting/highlighting verified unaffected on every touched comparison.

### Notes
- **Depends on Milestone 16** — the tag icon field, icon-only display option, and FontAwesome/Devicon rendering must exist first.
- **One task per comparison** during break-down, so each type is an independent commit (`data(<type>): …`).
- **Source policy carries over:** FontAwesome by default, Devicon for tech/language logos.
- **Prefer tag-definition edits:** most changes live in `attributes.json` tag definitions; only touch candidate files when a value must become a tag/icon it wasn't before.
- The `test` sample comparison and the inactive `paas-tools` directory (not registered in `data/index.json`) are out of scope.

---

## Future Considerations (Not Scheduled)

- **Search**: Find candidates across all comparison types
- **Export**: Download comparison as CSV/PDF
- **Embed**: Shareable comparison widgets
- **User Contributions**: Suggest corrections or new candidates
- **Additional Comparison Types**: Languages, frameworks, cloud providers, etc.

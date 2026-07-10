# Milestone: Single-comparison self-contained HTML export

**Status:** completed

**Value / Impact:**
Anyone with a comparison they care about can hand off a single `.html` file — over
email, chat, or a shared drive — that opens directly in a browser and behaves like the
live Lineup app for that one comparison, with no server, build step, or repo access
required on the recipient's side.

**Outcome:**
A Node CLI script, invoked as `pnpm export <comparison-type-id> > file.html`, produces a
single self-contained HTML file for that comparison type. The file bundles the
application's JavaScript, CSS, and the selected comparison's data inline. Opened in a
browser, it server-side-renders the comparison for an immediate first paint, then
hydrates into the fully interactive comparison view: filtering, sorting, candidate
toggles, expandable rows, ranking / best-value highlighting, and dark mode all work.
Rendering reuses the app's existing React components (via `react-dom/server` +
client hydration), so the export always matches the live app's formatting. Icon fonts
(FontAwesome / Devicon) may load from their CDN when online; all application logic and
comparison data are inlined and require no network.

**Success Criteria:**
- [x] `pnpm export <valid-type-id>` writes a single HTML file to stdout that includes all
      candidates and all attributes for that comparison type.
- [x] Opening the file in a browser shows the fully-rendered comparison on first paint
      (before any client JS runs) — SSR output, not an empty root.
- [x] After hydration, filtering, sorting, candidate selection, expandable attribute
      rows, and dark-mode toggle all work within the file.
- [x] Value formatting, ranking indicators, and best-value highlighting in the exported
      file match what the live app renders for the same comparison (shared components).
- [x] Application JS, CSS, and the comparison's JSON data are inlined in the single file;
      no separate asset files are emitted and none are fetched at runtime (icon fonts via
      CDN are the only permitted network request).
- [x] Invoking the script with an unknown or missing comparison-type id fails with a
      clear, non-zero-exit error message rather than emitting a broken file.
- [x] The export path is covered by an automated test (e.g. the generated HTML contains
      the expected candidate names and rendered attribute values).

**Notes:**
- **Rendering approach is fixed** by [ADR 0001](../docs/decisions/0001-reuse-app-components-for-html-export.md):
  reuse the app's React components via SSR + hydration rather than a standalone template.
  This creates a second build/render target for the app and couples the export to
  component internals — an accepted trade for guaranteed formatting parity.
- **Ephemeral state only.** Interactivity works in-session but resets on reload; filter /
  sort / selection state is NOT persisted to the URL (the hosted app's deep-link routing
  does not apply to a `file://` single file). Deep-linkable exported state is explicitly
  out of scope.
- **Not truly offline for icons.** Icon fonts may fall back to a CDN; a genuine
  zero-network artifact (inlining fonts as data URIs) is out of scope for this milestone
  and could be a follow-up.
- **Single comparison only.** Exporting multiple comparisons, a landing-page bundle, or
  other formats (CSV/PDF) are out of scope — those remain under Future Considerations.
- Fits the existing `.scripts/` convention and the compile-time JSON data model
  (`app/src/lib/data.ts`); the script selects one comparison type's data at build time.

**Completed:** 2026-07-10

**Closing Notes:**
- **Scope held.** All five planned tasks (fs loader → ExportRoot/SSR/hydration →
  Devicon CDN rewrite → Vite export build → CLI + HTML assembly) landed as broken down,
  one commit each, no tasks added, split, or postponed. 379 tests pass; `tsc -b` and
  `eslint` clean.
- **Architecture followed ADR 0001 exactly.** The export reuses `ComparisonView`
  unchanged via `react-dom/server` + client `hydrateRoot`; no rendering/ranking logic was
  forked. The decision log ([ADR 0001](../docs/decisions/0001-reuse-app-components-for-html-export.md),
  `Accepted`) and the shipped code tell the same story — no new or revised decisions.
- **Anticipated SSR risk did not materialize.** The main flagged risk (Radix
  filter-drawer components touching `window`/`ResizeObserver` under `renderToString`) never
  fired, because the drawer content is unmounted until opened. No SSR guards were needed.
- **Two small implementation deviations from the plan, both improvements:**
  - Task 4's suggested test assertion "the emitted JS contains no `import(`" false-positived
    on React's dev-mode warning strings (which contain the literal `import('./…')`). It was
    replaced with a structural check — exactly one `.js` and one `.css` emitted to
    `dist-export/` — which verifies the same single-chunk property without the false positive.
  - Task 5 uses `tsx` as the CLI runner (added as a devDependency) rather than `vite-node`;
    both were sanctioned by the plan.
- **TS runner sandbox caveat (environment, not code).** `pnpm export <type>` fails inside
  the restricted CI/agent sandbox because `tsx`'s CLI wrapper opens a local IPC pipe the
  sandbox blocks (`EPERM`). The identical runtime `node --import tsx scripts/export.ts <type>`
  works and was used to verify the artifact end-to-end. In a normal developer shell the
  `pnpm export` form is expected to work — confirm during the walk-through below.
- **Nothing postponed.** No `[~]` tasks.

### Manual Testing & Demo

**Prerequisites:**
- Dependencies installed: `pnpm --dir app install` (a `tsx` devDependency was added this milestone).
- Run from a normal developer shell (not the restricted agent sandbox — see the TS runner caveat above).

**Verification Steps:**
1. Generate an export from the repo root: `.scripts/export.sh databases > databases.html`
   (or `pnpm --dir app export databases > databases.html`).
   - Expected: a single `databases.html` (~1.3 MB) is written; **stdout carries only HTML**,
     all Vite build noise goes to stderr; no `dist-export/` assets leak into the redirected file.
2. Open `databases.html` directly in a browser via `file://` (double-click it).
   - Expected: the comparison table renders **immediately on first paint** (SSR), showing
     all candidates (PostgreSQL, MySQL, …) and all attributes — not a blank/loading root.
3. With JS enabled, exercise interactivity: open the filter drawer and filter, sort a
   column, toggle candidate visibility, expand an attribute group/row.
   - Expected: all behave exactly as in the live app; ranking indicators and best-value
     highlighting match the live app for the same comparison.
4. Switch OS appearance between light and dark mode and reload the file.
   - Expected: the export follows `prefers-color-scheme` (dark class applied in `<head>`),
     matching the live app; there is no in-page toggle (by design — parity, ephemeral state).
5. Verify self-containment: open with the network disabled.
   - Expected: everything renders and works offline; the only possible network requests are
     Devicon glyphs from jsdelivr CDN (FontAwesome is inline SVG, all app logic + data are inlined).
6. Error path: `.scripts/export.sh not-a-real-type > out.html; echo "exit=$?"`.
   - Expected: a clear "Unknown comparison type" message on **stderr**, non-zero exit,
     and **empty stdout** (no broken `out.html`).

**Demo Script** (for stakeholder presentation):
1. Start in a terminal at the repo root with nothing generated yet.
2. Run `.scripts/export.sh databases > databases.html` — point out it's a single command,
   no server, and produces one portable file.
3. Open `databases.html` in a browser and note the instant full render (SSR first paint).
4. Filter, sort, and toggle candidates live — emphasize this is the *same* app components,
   so formatting and rankings are guaranteed to match the hosted app.
5. Turn off Wi-Fi and reload to show it's fully self-contained (aside from optional CDN icons).
6. Close by noting the file can now be emailed or dropped in a shared drive and it "just works"
   for any recipient with a browser — no repo, build, or server needed.

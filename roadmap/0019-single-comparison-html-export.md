# Milestone: Single-comparison self-contained HTML export

**Status:** open

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
- [ ] `pnpm export <valid-type-id>` writes a single HTML file to stdout that includes all
      candidates and all attributes for that comparison type.
- [ ] Opening the file in a browser shows the fully-rendered comparison on first paint
      (before any client JS runs) — SSR output, not an empty root.
- [ ] After hydration, filtering, sorting, candidate selection, expandable attribute
      rows, and dark-mode toggle all work within the file.
- [ ] Value formatting, ranking indicators, and best-value highlighting in the exported
      file match what the live app renders for the same comparison (shared components).
- [ ] Application JS, CSS, and the comparison's JSON data are inlined in the single file;
      no separate asset files are emitted and none are fetched at runtime (icon fonts via
      CDN are the only permitted network request).
- [ ] Invoking the script with an unknown or missing comparison-type id fails with a
      clear, non-zero-exit error message rather than emitting a broken file.
- [ ] The export path is covered by an automated test (e.g. the generated HTML contains
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

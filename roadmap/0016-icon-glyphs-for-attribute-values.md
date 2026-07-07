# Milestone 16: Icon Glyphs for Attribute Values

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

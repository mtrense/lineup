# Plan: Icon Glyphs for Attribute Values

> Milestone: [Milestone 16 in ROADMAP.md](./ROADMAP.md#milestone-16-icon-glyphs-for-attribute-values)
> Started: 2026-06-13

## Overview

Turn the icon value types from placeholders into a working capability. The work
builds bottom-up: first a tree-shaken icon **registry + `<Icon>` component**
(FontAwesome and Devicon), then rewire the existing single `icon-fontawesome` /
`icon-emoji` value types onto it, then extend the **Tags** value type so each tag
can carry an icon and a Tags attribute can render **icon-only** with an accessible
tooltip. Filtering parity and a real in-app demo close it out.

### Cross-cutting architectural decisions

- **Tree-shaking via an explicit registry, not dynamic imports.** JSON stores
  icon *names* as strings; a static `import(name)` cannot be tree-shaken. So a
  hand-maintained registry module (`app/src/lib/icons/registry.ts`) maps
  `(pack, name)` → an imported icon definition (FontAwesome) or imported SVG URL
  (Devicon). Adding a new glyph = one import + one registry entry. This is the
  single source of truth both the renderer and Milestone 17's data sweep rely on.
- **Icon source discriminator.** A shared `IconRef` type carries
  `{ name: string; pack?: IconPack }` where
  `IconPack = "fa-solid" | "fa-brands" | "fa-regular" | "devicon"`. Default when
  `pack` is omitted is `"fa-solid"`. FontAwesome is the default source; Devicon is
  used for tech/language/database logos where it reads better.
- **`icon-fontawesome` value-type stays, but its `pack` now flows through the same
  registry.** No new top-level `icon-devicon` value type is introduced — a single
  `icon-fontawesome` value can point at a Devicon glyph via `pack: "devicon"` if
  ever needed, and per-tag icons use the full `IconRef`. This keeps the
  value-type union stable while satisfying "FA-vs-Devicon selectable per icon".
- **Tags display option.** `TagsType` gains `display?: "label" | "icon" | "both"`,
  default `"both"` (preserves today's behavior: render the icon if present, plus
  the label). `"icon"` = icon-only with the label surfaced as an accessible
  tooltip + `aria-label`. A tag in icon-only mode that has *no* icon falls back to
  rendering its text label so nothing disappears.
- **Tooltip mechanism.** Reuse the existing Radix wrapper at
  `app/src/components/ui/tooltip.tsx` for the icon-only hover/focus label. This is
  consistent with the milestone's "reuse existing tooltip affordances" note and
  does not reintroduce the old value-level tooltip system (which Milestone 10
  retired in favor of expandable rows — that stays for source/comment data).

## Tasks

[x] 1. **Add icon dependencies and build the icon registry + `<Icon>` component**
- **Files:** `app/package.json`, `app/src/lib/icons/registry.ts` (new),
  `app/src/lib/icons/Icon.tsx` (new), `app/src/lib/icons/Icon.test.tsx` (new),
  `app/src/lib/icons/index.ts` (new)
- **Description:** Add FontAwesome and Devicon as dependencies and create a
  self-contained icon module that resolves a `(pack, name)` pair to a rendered
  glyph. Nothing else in the app consumes it yet — this task only stands up the
  foundation and proves it renders.
  - Add deps: `@fortawesome/fontawesome-svg-core`,
    `@fortawesome/react-fontawesome`, `@fortawesome/free-solid-svg-icons`,
    `@fortawesome/free-brands-svg-icons`, and `devicon` (SVG assets, imported as
    URLs by Vite).
  - `registry.ts`: define `IconPack` and `IconRef` re-export point, and two maps —
    a FontAwesome map `(name) → IconDefinition` populated from individually
    imported icons, and a Devicon map `(name) → svg url` from individual
    `devicon/icons/<n>/<n>-original.svg` imports. Seed with a small curated set
    that covers the Task 5 demo (e.g. `rust`, `python`, `js`/`javascript`,
    `linux`, `apple`, `windows`, plus a couple of solid icons). Export a
    `resolveIcon(ref): { kind: "fa"; def } | { kind: "svg"; url } | null`.
  - `Icon.tsx`: a presentational `<Icon ref={IconRef} title?={string} className? />`
    component. FA path renders `<FontAwesomeIcon icon={def} />`; Devicon path
    renders `<img src={url} alt="" />`. Unknown `(pack, name)` → render nothing
    (or a muted fallback) without throwing. When `title` is provided, set it as
    `aria-label` / `img alt` so callers can make a bare glyph accessible.
- **Architecture & Decisions:**
  - Registry-as-single-source-of-truth (see cross-cutting decisions). Keep the
    map literal and append-only so Milestone 17 can extend it mechanically.
  - Do **not** use `library.add()` global mutation; import definitions and pass
    them directly to `<FontAwesomeIcon icon={...} />` to keep tree-shaking
    analyzable.
  - SVG imported as default string URL (Vite resolves to an asset URL in build, a
    stub string under Vitest) — render via `<img>`, not inline-SVG injection, to
    avoid `dangerouslySetInnerHTML`.
- **Non-Functional Considerations:**
  - Bundle size: only individually-imported icons ship; no full CSS bundle and no
    barrel `import * as` of an icon pack.
- **Test Cases:**
  - Renders a known FontAwesome brand glyph (assert an `<svg>` with the expected
    `data-icon` attribute is present).
  - Renders a known Devicon glyph (assert an `<img>` whose `src` is truthy).
  - Unknown `(pack, name)` renders nothing and does not throw.
  - `title` prop is applied as `aria-label` (FA) / `alt` (img) on the output.
- **Commit Message:** `feat(app): add icon registry and Icon component (FontAwesome + Devicon)`

[x] 2. **Define the `IconRef` schema and rewire `IconValue` onto the registry**
- **Files:** `app/src/types/attributes.ts`,
  `app/src/components/values/IconValue.tsx`,
  `app/src/components/values/IconValue.test.tsx` (new),
  `app/src/components/values/ValueRenderer.tsx` (only if prop shape shifts)
- **Description:** Replace the FontAwesome placeholder in `IconValue.tsx` with a
  real glyph rendered through the Task 1 `<Icon>` component, and introduce the
  shared `IconRef` / `IconPack` types.
  - In `attributes.ts`: add `export type IconPack` and `export interface IconRef`.
    Update the `icon-fontawesome` member of `IconType` to carry `pack?: IconPack`
    (string-compatible, so existing data stays valid). Leave `icon-emoji`
    unchanged.
  - In `IconValue.tsx`: keep the emoji branch; replace the
    `className="fas fa-..."` placeholder branch with `<Icon>` driven by the
    `(pack, name)` pair. Remove the placeholder comment and the class-string
    construction.
  - Confirm `ValueRenderer.tsx`'s `icon-fontawesome` / `icon-emoji` cases still
    pass the right props (adjust only if `IconValue`'s prop signature changes).
- **Architecture & Decisions:**
  - `IconValue` becomes a thin adapter over `<Icon>`; all glyph logic lives in the
    registry module from Task 1.
- **Non-Functional Considerations:**
  - Accessibility: a standalone icon value with no adjacent text is decorative by
    default (`aria-hidden`); revisit only if a value needs a label.
- **Test Cases:**
  - `icon-fontawesome` value renders a real glyph (svg `data-icon`), not an empty
    `<i className="fas ...">`.
  - `icon-emoji` value still renders the emoji character.
  - A fontawesome value with `pack: "devicon"` resolves through the Devicon path.
- **Commit Message:** `feat(app): render real glyphs for icon value types`

[x] 3. **Extend `Tag` with an icon and `TagsType` with a display option; render glyphs in `TagsValue`**
- **Files:** `app/src/types/attributes.ts`,
  `app/src/components/values/TagsValue.tsx`,
  `app/src/components/values/ValueRenderer.tsx`,
  `app/src/components/values/TagsValue.test.tsx` (new)
- **Description:** Make tags icon-capable and add the icon-only display mode.
  - In `attributes.ts`: change `Tag.icon?: string` → `Tag.icon?: IconRef`; add
    `display?: "label" | "icon" | "both"` to `TagsType`.
  - In `TagsValue.tsx`: accept an optional `display` prop (default `"both"`).
    Render each tag's icon via `<Icon>` (replacing the current raw-string render
    on line 44). For `display: "both"` show icon + label (today's look); for
    `display: "label"` show label only; for `display: "icon"` show the glyph only,
    wrapped so the tag's text `value` is exposed both as a Radix tooltip (hover +
    keyboard focus) and as an `aria-label` on the element. A tag with no icon in
    icon-only mode falls back to its text label.
  - In `ValueRenderer.tsx`: thread `valueType.display` into `<TagsValue>`.
- **Architecture & Decisions:**
  - Icon-only tags must be focusable (e.g. `tabIndex={0}` on the wrapper or a
    `TooltipTrigger`) so the tooltip is reachable by keyboard, matching the
    milestone's accessibility requirement.
  - Filtering reads tag *ids*; this task changes only rendering, never the value
    array — keep `value: string[]` untouched.
- **Non-Functional Considerations:**
  - Accessibility: every icon-only cell carries `aria-label={tag.value}`; verify
    with a screen-reader-oriented assertion (`getByLabelText`).
- **Test Cases:**
  - `display: "both"` (default) renders both the glyph and the label text.
  - `display: "icon"` renders the glyph, hides the visible label, and exposes the
    tag value via `aria-label` (assert `getByLabelText(tag.value)`).
  - Icon-only tooltip surfaces the label on focus/hover (assert tooltip content
    appears).
  - A tag with no `icon` in `display: "icon"` mode falls back to its text label.
  - `display: "label"` renders text only, no `<svg>`/`<img>`.
- **Commit Message:** `feat(app): support per-tag icons and icon-only Tags display`

[x] 4. **Verify filtering/highlighting parity across display modes**
- **Files:** `app/src/components/FilterPanel.tsx` (only if the `Tag.icon` type
  change breaks compilation), `app/src/components/FilterPanel.parity.test.ts`
  (new, or extend `FilterPanel.integration.test.ts`)
- **Description:** Confirm tag filtering and best-value highlighting operate
  identically whether a Tags attribute renders as label, icon, or both. The
  `Tag.icon` shape change in Task 3 should *not* affect the FilterPanel local
  `TagFilterableAttribute` type (it carries only `{ id, value, color }`); fix any
  compile fallout if it does, otherwise this is a pure verification + regression
  task.
- **Architecture & Decisions:**
  - Filtering is value-driven; display mode is presentational. The test encodes
    that contract so a future display change can't silently break filtering.
- **Non-Functional Considerations:**
  - None.
- **Test Cases:**
  - Given identical tag data, the set of candidates passing a tag filter is the
    same for `display: "label"`, `"icon"`, and `"both"`.
  - The filter drawer still lists tag options by their text `value` (icon-only
    display does not blank the filter labels).
  - Highlighting/ranking behavior on a tag attribute is unchanged by display mode.
- **Commit Message:** `test(app): assert tag filtering parity across icon display modes`

[x] 5. **Wire up a working demo comparison and document the schema**
- **Files:** one comparison type's `data/<type>/attributes.json` (+ candidate
  JSON / `RESEARCH.md` only if a value must newly become a tag), `CLAUDE.md`
- **Description:** Prove the capability end-to-end in the running app and document
  it. Recommended demo: add (or convert) a categorical attribute to icon-bearing
  tags — e.g. a **Platforms/OS** attribute rendered as OS logos
  (`linux`/`apple`/`windows`, FontAwesome brands) and/or a **programming
  language** attribute rendered with a Devicon/FA brand logo (e.g. `rust`,
  `python`). Pick a single already-registered comparison type so the change is
  visible at its route. Set the attribute's `display` to `"icon"` to exercise the
  tooltip path, or `"both"` to show icon+label — choose per what reads best.
  - Update `CLAUDE.md`: document the new `Tag.icon` field (`IconRef` shape), the
    `TagsType.display` option, and the FontAwesome-default / Devicon-for-tech
    source convention. Note that adding a glyph requires a registry entry
    (`app/src/lib/icons/registry.ts`), so data authors know icons aren't free-form
    strings.
- **Architecture & Decisions:**
  - Keep the demo to tag-definition edits in `attributes.json` where possible
    (icons attach to tag defs, candidates inherit by id) per the milestone note.
    Only touch candidate files if a chosen value isn't already a tag.
  - Ensure every glyph used in the demo exists in the registry (extend Task 1's
    map as needed within this task).
- **Non-Functional Considerations:**
  - The broader cross-comparison sweep is explicitly Milestone 17 — keep this to
    one type.
- **Test Cases:**
  - Manual: `pnpm --dir app dev`, open the chosen comparison's route, confirm
    glyphs render, tooltips show the label on hover/focus, and filtering on that
    attribute still works.
  - If the demo data is asserted in a test, add a render test confirming the demo
    attribute produces glyph output. Otherwise rely on the manual demo + existing
    suite staying green (`pnpm --dir app test:run`, `pnpm --dir app build`).
- **Commit Message:** `data(<type>): demo icon glyphs for <attribute>` (and a
  separate `docs(claude): document tag icon schema and display option` if you
  prefer to split the doc change)

## Cross-Cutting Concerns

- **Security:** No new inputs from users; data is compile-time JSON. Devicon SVGs
  render via `<img src>` (asset URL), not inline HTML injection — no
  `dangerouslySetInnerHTML`.
- **Performance / Bundle size:** Tree-shake by importing individual FontAwesome
  icon definitions and individual Devicon SVG assets through the registry. Never
  `import * as` an icon pack and never load a full icon CSS bundle. Verify the
  production `pnpm --dir app build` output stays lean.
- **Observability:** N/A (static app, no logging layer).
- **Accessibility:** Icon-only tags must be keyboard-focusable and expose their
  text value via `aria-label` + tooltip. Decorative standalone icon values stay
  `aria-hidden`. This is a first-class test requirement (Task 3).
- **Migration:** None forced. `Tag.icon` changes from `string` to `IconRef`, but
  no existing `attributes.json` sets `tag.icon`, so no data migration is needed;
  the type change is compile-time only.
- **Rollback:** Each task is an independent commit and the feature is additive
  (placeholders → real glyphs, new optional fields). Reverting any task leaves the
  app rendering — at worst falling back to labels / the prior placeholder.

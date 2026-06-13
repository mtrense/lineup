# Plan

> Ready for next milestone breakdown.
> Last completed: Milestone 16 — Icon Glyphs for Attribute Values (2026-06-13)

## Re-iteration: Milestone 16 — Icon Glyphs for Attribute Values

[x] 1. **Drop the colored pill background for icon-only tags that render a glyph**
- **Files:** `app/src/components/values/TagsValue.tsx`,
  `app/src/components/values/TagsValue.test.tsx`
- **Description:** In `display: "icon"` mode, a tag that has a glyph still renders
  inside its colored pill (`colorClass` + `px-2 py-0.5`), which looks odd — the
  background fights the logo (see the TS/JS/Rust demo on `/spa-web-frameworks`).
  The glyph should stand on its own with no colored chip behind it. Concretely, in
  the `display === "icon" && hasIcon` branch (currently `TagsValue.tsx:52–72`),
  stop applying `colorClass` and the pill padding to the `<span>`; keep it a bare,
  focusable, centered inline-flex wrapper that still carries `aria-label`,
  `tabIndex={0}`, and the tooltip. Slightly bump the glyph size if it reads too
  small without the chip (e.g. `h-4 w-4` → `h-5 w-5`) — judgement call against the
  running app.
- **Architecture & Decisions:**
  - Only the icon-only-**with-glyph** branch loses the pill. The icon-only
    **fallback** branch (`display === "icon" && !hasIcon`, ~`:74–84`) keeps its
    colored pill, because it renders a *text label* and the chip is what makes a
    bare word read as a tag. The `"both"` and `"label"` branches are unchanged.
  - Keep accessibility intact: `aria-label`, keyboard focusability, and the Radix
    tooltip must all survive the styling change.
- **Non-Functional Considerations:**
  - Purely presentational; no change to `value: string[]`, filtering, or
    highlighting.
- **Test Cases:**
  - Icon-only tag **with** an icon renders the glyph with no color background
    class applied to its wrapper (assert the wrapper does not carry a
    `bg-*` class, e.g. via `className` inspection or a snapshot of the wrapper).
  - Icon-only tag **with** an icon still exposes `aria-label={tag.value}`, is
    focusable, and surfaces the tooltip on focus/hover (existing assertions stay
    green).
  - Icon-only **fallback** tag (no icon) still renders inside its colored pill
    (assert a `bg-*` class is present) — the chip is intentional for text.
  - `display: "both"` and `display: "label"` pills are visually unchanged
    (existing tests stay green).
- **Commit Message:** `fix(app): drop colored pill behind icon-only tag glyphs`

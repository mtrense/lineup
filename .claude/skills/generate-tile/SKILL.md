---
name: generate-tile
description: "Generate a decorative tile SVG for a Lineup comparison type and write it to data/<type>/tile.svg. The SVG is picked up automatically by the tile loader (getTileUrl) and rendered as a low-opacity background by TileBackground. Arguments: comparison type id (required)."
model: opus
allowed-tools: Read, Glob, Write
argument-hint: "<comparison-type-id>"
---

# Generate Tile

You are generating a decorative background SVG for a Lineup comparison type. The SVG is saved to `data/<type>/tile.svg` and automatically picked up by the tile loader (`getTileUrl`) in `app/src/lib/tiles.ts`. It is rendered by the `TileBackground` component at `opacity-10` behind the comparison tile's title and description on the landing page.

## Argument Parsing

`$ARGUMENTS`:

- First token: **comparison type id** (kebab-case, e.g. `databases`, `rust-gui`). Must match an existing directory under `data/`.

If the id is missing, ask the user to provide one. If `data/<type>/` does not exist, abort and list the valid ids from `data/index.json`.

## Prerequisites

1. Read `data/index.json` to confirm the comparison type exists and to learn its `name` and `description` (use these for thematic inspiration).
2. Glob `data/*/tile.svg` to find any existing tiles and read 1–2 as stylistic references.
3. Read `app/src/components/TileBackground.tsx` to understand the rendering contract (opacity, positioning, `currentColor` inheritance).

## Style Contract

Every generated SVG **must** follow these rules. They encode the decorative/legibility/accessibility requirements agreed in Milestone 18.

### Structure

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" fill="none">
  <!-- motif elements here -->
</svg>
```

- `viewBox="0 0 200 200"` — square canvas; `TileBackground` stretches it with `object-cover`.
- `fill="none"` on the `<svg>` root; individual elements control their own fills.

### Theme Neutrality (most important rule)

- **Use `fill="currentColor"` exclusively.** Never hardcode hex, rgb, or named colours.
- `currentColor` inherits from the surrounding text colour, which switches between light and dark automatically. The tile therefore works on any card background and in both Tailwind themes.
- Vary apparent depth/weight using `opacity` attributes on individual elements (e.g. `opacity="0.6"`), not by mixing different fill colours.

### Detail Level

- **Low detail, bold shapes.** At `opacity-10` only silhouettes and large forms read; fine linework and small labels vanish. Think icon-scale glyphs, not diagrams.
- **No embedded text.** SVGs must contain zero `<text>` or `<tspan>` elements — text at low opacity becomes illegible noise.
- Aim for 5–20 SVG elements; do not include complex paths that balloon file size.

### Thematic Relevance

- The motif should evoke the comparison type — databases → stacked cylinders, web frameworks → layered rectangles suggesting browser chrome, Rust → cog/gear, hardware → circuit traces, etc.
- Avoid licensed or trademarked shapes. Use generic, abstract representations.
- Centre the composition loosely within the 200×200 canvas, leaving a small margin so nothing clips when `object-cover` crops.

### File Size

- Keep the output under ~4 KB. Inline `style` blocks and `<defs>` with gradients are permitted but discouraged — they rarely survive low opacity.

## Generation Procedure

1. Choose a motif based on the comparison type's name, description, and theme.
2. Sketch the element list (shapes, positions, opacities) in your reasoning before writing XML.
3. Write the SVG to `data/<type>/tile.svg` using the Write tool.
4. Read the file back and verify:
   - `viewBox="0 0 200 200"` is present.
   - No `<text>` or `<tspan>` elements.
   - Only `currentColor` fills (grep for hex `#` or `rgb(` — there must be none).
   - File size is reasonable.

If the check fails, rewrite the file and verify again.

## Output

The only file written is `data/<type>/tile.svg`. Do NOT touch `data/index.json`, candidate files, or any app source files.

Do NOT commit. Committing is the user's responsibility, via `/commit`.

## Handoff

After writing the file, tell the user:

- The path of the file: `data/<type>/tile.svg`.
- A one-sentence description of the motif chosen.
- **Next step**: run the app (`/run`) and navigate to the landing page to see the tile rendered live. If the result needs adjustment, describe the change you want and I'll regenerate.

Do NOT re-summarise the style rules or print the SVG source inline.

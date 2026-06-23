/**
 * TileBackground — purely decorative background SVG for comparison tiles.
 *
 * Inlines the tile's SVG *markup* (not an `<img>` or CSS `mask`/`url()`) so the
 * shapes' `fill="currentColor"` inherits the card's text colour and themes
 * correctly in both light and dark mode. An externally-referenced SVG (via
 * `<img src>` or `mask-image: url(...)`) is an isolated document where
 * `currentColor` resolves to black, and Vite inlines small tiles as data URIs
 * that break CSS `url()` escaping — both routes failed in practice. Inlining the
 * markup is the reliable path. The source is first-party (authored by
 * `/generate-tile`), so `dangerouslySetInnerHTML` carries no untrusted input.
 *
 * The art is rendered as a right-aligned, square watermark so the card's title
 * and description on the left stay legible. The SVG's own `preserveAspectRatio`
 * (default `xMidYMid meet`) fits the 200x200 viewBox inside that square.
 *
 * Accessibility contract:
 *   - `aria-hidden="true"` — invisible to screen readers
 *   - `pointer-events-none` — never a click/focus target
 *
 * The parent element must have `position: relative` (or any non-static
 * positioning) for the `inset-0` fill to work correctly.
 */

interface TileBackgroundProps {
  /** Raw SVG markup returned by `getTileSvg()`, or null/undefined for no tile. */
  svg?: string | null;
}

export function TileBackground({ svg }: TileBackgroundProps) {
  if (!svg) {
    return null;
  }

  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.12] text-current"
      aria-hidden="true"
    >
      <div
        className="absolute inset-y-0 right-0 aspect-square h-full [&>svg]:h-full [&>svg]:w-full"
        dangerouslySetInnerHTML={{ __html: svg }}
      />
    </div>
  );
}

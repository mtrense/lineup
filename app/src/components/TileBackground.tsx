/**
 * TileBackground — purely decorative background SVG for comparison tiles.
 *
 * Renders a low-opacity, absolutely-positioned image behind the tile's content.
 * When `url` is null or omitted, renders nothing (graceful fallback).
 *
 * Accessibility contract:
 *   - `aria-hidden="true"` — invisible to screen readers
 *   - `alt=""` — empty alt (decorative img)
 *   - `pointer-events-none` — never a click/focus target
 *
 * The parent element must have `position: relative` (or any non-static
 * positioning) for the `inset-0` fill to work correctly.
 */

interface TileBackgroundProps {
  /** Asset URL returned by `getTileUrl()`, or null/undefined for no tile. */
  url?: string | null;
}

export function TileBackground({ url }: TileBackgroundProps) {
  if (!url) {
    return null;
  }

  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      <img
        src={url}
        alt=""
        aria-hidden="true"
        className="w-full h-full object-cover opacity-10"
      />
    </div>
  );
}

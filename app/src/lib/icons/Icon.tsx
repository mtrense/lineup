import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { resolveIcon } from "./registry";
import type { IconPack } from "./registry";

interface IconProps {
  name: string;
  pack?: IconPack;
  title?: string;
  className?: string;
}

/**
 * Presentational icon component. Resolves a (pack, name) pair through the
 * registry and renders either a FontAwesome SVG or a Devicon <img>.
 *
 * - When `title` is provided, it is applied as `aria-label` (FA) or `alt` (img)
 *   so that a bare glyph remains accessible.
 * - Unknown (pack, name) pairs render nothing and do not throw.
 */
export function Icon({ name, pack, title, className }: IconProps) {
  const resolved = resolveIcon({ name, pack });

  if (!resolved) {
    return null;
  }

  if (resolved.kind === "fa") {
    return (
      <span
        className={className}
        aria-label={title}
        aria-hidden={title ? undefined : true}
      >
        <FontAwesomeIcon icon={resolved.def} />
      </span>
    );
  }

  // Devicon SVG via <img> — no dangerouslySetInnerHTML
  return (
    <img
      src={resolved.url}
      alt={title ?? ""}
      className={className}
      aria-hidden={title ? undefined : true}
    />
  );
}

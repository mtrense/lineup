import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { cn } from "@/lib/utils";
import { REPO_URL } from "@/lib/repo";

interface GitHubLinkProps {
  /** Where the icon points. Defaults to the repository root. */
  href?: string;
  /** Accessible name for the link. */
  label?: string;
  className?: string;
}

/**
 * A deliberately understated GitHub glyph linking back to the source.
 *
 * Rendered in muted grey so it recedes behind the page content, brightening
 * only on hover/focus. The glyph carries no visible text, so the accessible
 * name comes from `aria-label` — every use must name its destination.
 */
export function GitHubLink({
  href = REPO_URL,
  label = "View this project on GitHub",
  className,
}: GitHubLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      title={label}
      className={cn(
        "no-print inline-flex items-center text-muted-foreground/70 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm",
        className
      )}
    >
      <FontAwesomeIcon icon={faGithub} className="h-5 w-5" aria-hidden="true" />
    </a>
  );
}

import { ReactNode } from "react";

interface ValueWithTooltipProps {
  children: ReactNode;
  source?: string[];
  comment?: string;
}

/**
 * Wraps a value with a visual indicator if it has source or comment metadata.
 * The actual content is shown in the expandable row, not as a tooltip.
 */
export function ValueWithTooltip({
  children,
  source,
  comment,
}: ValueWithTooltipProps) {
  const hasMetadata = (source && source.length > 0) || comment;

  if (!hasMetadata) {
    return <>{children}</>;
  }

  // Show a subtle visual indicator (dotted underline) for values with metadata
  return (
    <span className="border-b border-dotted border-muted-foreground/50">
      {children}
    </span>
  );
}

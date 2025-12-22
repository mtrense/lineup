import { ReactNode } from "react";

interface ValueWithTooltipProps {
  children: ReactNode;
  source?: string[];
  comment?: string;
}

/**
 * Pass-through component for values.
 * Previously wrapped values with tooltips, now just renders children directly.
 * Source/comment metadata is shown in expandable rows instead.
 */
export function ValueWithTooltip({
  children,
}: ValueWithTooltipProps) {
  return <>{children}</>;
}

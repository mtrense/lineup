import { ReactNode } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ExternalLink } from "lucide-react";

interface ValueWithTooltipProps {
  children: ReactNode;
  source?: string[];
  comment?: string;
}

export function ValueWithTooltip({
  children,
  source,
  comment,
}: ValueWithTooltipProps) {
  const hasTooltipContent = (source && source.length > 0) || comment;

  if (!hasTooltipContent) {
    return <>{children}</>;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="cursor-help border-b border-dotted border-muted-foreground/50">
          {children}
        </span>
      </TooltipTrigger>
      <TooltipContent className="max-w-xs">
        <div className="space-y-2">
          {comment && <p className="text-sm">{comment}</p>}
          {source && source.length > 0 && (
            <div className="space-y-1">
              {source.map((url, index) => (
                <a
                  key={index}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-primary hover:underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ExternalLink className="h-3 w-3" />
                  <span className="truncate">{formatSourceUrl(url)}</span>
                </a>
              ))}
            </div>
          )}
        </div>
      </TooltipContent>
    </Tooltip>
  );
}

function formatSourceUrl(url: string): string {
  try {
    const parsed = new URL(url);
    return parsed.hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

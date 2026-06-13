import type { Tag } from "@/types";
import { Icon } from "@/lib/icons";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TagsValueProps {
  value: string[];
  tags: Tag[];
  defaultColor: string;
  display?: "label" | "icon" | "both";
}

// Map color names to Tailwind classes
const colorClasses: Record<string, string> = {
  gray: "bg-gray-600 text-gray-100",
  red: "bg-red-600 text-red-100",
  orange: "bg-orange-600 text-orange-100",
  yellow: "bg-yellow-600 text-yellow-100",
  green: "bg-green-600 text-green-100",
  teal: "bg-teal-600 text-teal-100",
  blue: "bg-blue-600 text-blue-100",
  indigo: "bg-indigo-600 text-indigo-100",
  purple: "bg-purple-600 text-purple-100",
  pink: "bg-pink-600 text-pink-100",
};

function getColorClass(color?: string, defaultColor?: string): string {
  const colorKey = color || defaultColor || "gray";
  return colorClasses[colorKey] || colorClasses.gray;
}

export function TagsValue({
  value,
  tags,
  defaultColor,
  display = "both",
}: TagsValueProps) {
  // Create a map of tag IDs to tag definitions
  const tagMap = new Map(tags.map((t) => [t.id, t]));

  return (
    <div className="flex flex-wrap justify-center gap-1">
      {value.map((tagId) => {
        const tag = tagMap.get(tagId);
        const displayValue = tag?.value || tagId;
        const colorClass = getColorClass(tag?.color, defaultColor);
        const hasIcon = Boolean(tag?.icon);

        if (display === "icon" && hasIcon) {
          // Icon-only mode: glyph stands alone with no colored chip behind it
          return (
            <Tooltip key={tagId}>
              <TooltipTrigger asChild>
                <span
                  className="inline-flex items-center justify-center text-foreground"
                  aria-label={displayValue}
                  tabIndex={0}
                >
                  <Icon
                    name={tag!.icon!.name}
                    pack={tag!.icon!.pack}
                    className="h-5 w-5"
                  />
                </span>
              </TooltipTrigger>
              <TooltipContent>{displayValue}</TooltipContent>
            </Tooltip>
          );
        }

        if (display === "icon" && !hasIcon) {
          // Icon-only mode but no icon available — fall back to text label
          return (
            <span
              key={tagId}
              className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${colorClass}`}
            >
              {displayValue}
            </span>
          );
        }

        // display === "both" or display === "label"
        return (
          <span
            key={tagId}
            className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${colorClass}`}
          >
            {display !== "label" && hasIcon && (
              <span className="mr-1">
                <Icon
                  name={tag!.icon!.name}
                  pack={tag!.icon!.pack}
                  className="h-3 w-3"
                />
              </span>
            )}
            {displayValue}
          </span>
        );
      })}
    </div>
  );
}

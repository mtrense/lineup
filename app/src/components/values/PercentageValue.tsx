interface PercentageValueProps {
  value: number; // 0-100 or 0-1 (will be normalized)
  direction: "ascending" | "descending";
}

// Color gradient based on percentage position
function getPercentageColor(
  percentage: number,
  direction: "ascending" | "descending"
): string {
  // If descending, invert the value for color purposes (lower is better)
  const effectiveValue =
    direction === "descending" ? 100 - percentage : percentage;

  if (effectiveValue < 25) return "bg-red-500";
  if (effectiveValue < 50) return "bg-orange-500";
  if (effectiveValue < 75) return "bg-yellow-500";
  return "bg-green-500";
}

export function PercentageValue({ value, direction }: PercentageValueProps) {
  // Normalize: if value is between 0 and 1, treat as decimal percentage
  const percentage = value <= 1 ? Math.round(value * 100) : Math.round(value);
  const clampedPercentage = Math.max(0, Math.min(100, percentage));

  const colorClass = getPercentageColor(clampedPercentage, direction);

  return (
    <div className="flex items-center gap-2">
      {/* Percentage bar */}
      <div className="flex h-4 w-24 items-center overflow-hidden rounded bg-muted">
        <div
          className={`h-full ${colorClass}`}
          style={{ width: `${clampedPercentage}%` }}
        />
      </div>
      {/* Numeric value */}
      <span className="text-sm">{clampedPercentage}%</span>
    </div>
  );
}

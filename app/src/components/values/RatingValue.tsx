interface RatingValueProps {
  value: number;
  lower: number;
  upper: number;
  direction: "ascending" | "descending";
  symbols: {
    empty: string;
    half?: string;
    full: string;
  };
}

// Color gradient from red to green based on rating position
function getRatingColor(normalizedValue: number, direction: "ascending" | "descending"): string {
  // If descending, invert the value for color purposes
  const effectiveValue = direction === "descending" ? 1 - normalizedValue : normalizedValue;

  if (effectiveValue < 0.25) return "bg-red-500";
  if (effectiveValue < 0.5) return "bg-orange-500";
  if (effectiveValue < 0.75) return "bg-yellow-500";
  return "bg-green-500";
}

export function RatingValue({
  value,
  lower,
  upper,
  direction,
  symbols,
}: RatingValueProps) {
  const range = upper - lower;
  const normalizedValue = (value - lower) / range;
  const percentage = Math.round(normalizedValue * 100);

  // Calculate how many full, half, and empty symbols to show
  const totalSymbols = Math.round(upper - lower);
  const adjustedValue = value - lower;
  const fullCount = Math.floor(adjustedValue);
  const hasHalf = symbols.half && adjustedValue - fullCount >= 0.5;
  const emptyCount = totalSymbols - fullCount - (hasHalf ? 1 : 0);

  const colorClass = getRatingColor(normalizedValue, direction);

  // Get label text based on percentage
  const getLabel = () => {
    if (percentage <= 20) return direction === "ascending" ? "Poor" : "Excellent";
    if (percentage <= 40) return direction === "ascending" ? "Fair" : "Good";
    if (percentage <= 60) return "Moderate";
    if (percentage <= 80) return direction === "ascending" ? "Good" : "Fair";
    return direction === "ascending" ? "Excellent" : "Poor";
  };

  return (
    <div className="flex flex-col items-center gap-1">
      {/* Rating bar visualization */}
      <div className="flex h-5 w-full max-w-[200px] items-center gap-0.5">
        <div className={`h-full rounded-l ${colorClass}`} style={{ width: `${percentage}%` }} />
        <div className="h-full flex-1 rounded-r bg-muted" />
      </div>

      {/* Symbol display */}
      <div className="flex items-center gap-0.5 text-sm">
        <span className="flex">
          {Array.from({ length: fullCount }, (_, i) => (
            <span key={`full-${i}`}>{symbols.full}</span>
          ))}
          {hasHalf && <span>{symbols.half}</span>}
          {Array.from({ length: emptyCount }, (_, i) => (
            <span key={`empty-${i}`} className="opacity-30">
              {symbols.empty}
            </span>
          ))}
        </span>
        <span className="ml-1 text-xs text-muted-foreground">{getLabel()}</span>
      </div>
    </div>
  );
}

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

export function RatingValue({
  value,
  lower,
  upper,
  direction: _direction,
  symbols,
}: RatingValueProps) {
  // Calculate how many full, half, and empty symbols to show
  const totalSymbols = Math.round(upper - lower);
  const adjustedValue = value - lower;
  const fullCount = Math.floor(adjustedValue);
  const hasHalf = symbols.half && adjustedValue - fullCount >= 0.5;
  const emptyCount = totalSymbols - fullCount - (hasHalf ? 1 : 0);

  return (
    <div className="flex items-center gap-1.5">
      {/* Symbol display */}
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
      {/* Numeric ratio */}
      <span className="text-xs text-muted-foreground">
        {value}/{upper}
      </span>
    </div>
  );
}

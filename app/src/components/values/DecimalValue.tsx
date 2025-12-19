interface DecimalValueProps {
  value: number;
  direction: "ascending" | "descending" | "neutral";
}

export function DecimalValue({ value, direction: _direction }: DecimalValueProps) {
  // Format with appropriate decimal places
  const formatted = value.toLocaleString(undefined, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 2,
  });

  return <span>{formatted}</span>;
}

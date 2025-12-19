interface IntegerValueProps {
  value: number;
  direction: "ascending" | "descending" | "neutral";
}

export function IntegerValue({ value, direction: _direction }: IntegerValueProps) {
  // Format with thousands separators
  const formatted = Math.round(value).toLocaleString();

  return <span>{formatted}</span>;
}

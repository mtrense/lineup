interface TextValueProps {
  value: string;
}

export function TextValue({ value }: TextValueProps) {
  return <span>{value}</span>;
}

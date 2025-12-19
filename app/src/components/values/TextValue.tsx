interface TextValueProps {
  value: string;
}

export function TextValue({ value }: TextValueProps) {
  return <span className="whitespace-normal break-words">{value}</span>;
}

import { ExternalLink } from "lucide-react";

interface LinkValueProps {
  value: string;
}

export function LinkValue({ value }: LinkValueProps) {
  // Try to extract a display name from the URL
  let displayText = value;
  try {
    const url = new URL(value);
    displayText = url.hostname.replace(/^www\./, "");
  } catch {
    // If URL parsing fails, use the value as-is
  }

  return (
    <a
      href={value}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-primary hover:underline"
    >
      {displayText}
      <ExternalLink className="h-3 w-3" />
    </a>
  );
}

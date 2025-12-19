interface DurationValueProps {
  value: number; // Duration in milliseconds
  direction: "ascending" | "descending";
}

function formatDuration(ms: number): string {
  if (ms < 0) return "0ms";

  // Less than a second
  if (ms < 1000) {
    return `${ms}ms`;
  }

  const totalSeconds = Math.floor(ms / 1000);
  const milliseconds = ms % 1000;

  // Less than a minute
  if (totalSeconds < 60) {
    if (milliseconds > 0) {
      return `${totalSeconds}.${String(milliseconds).padStart(3, "0").slice(0, 2)}s`;
    }
    return `${totalSeconds}s`;
  }

  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  // Less than an hour
  if (minutes < 60) {
    return `${minutes}:${String(seconds).padStart(2, "0")}`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  return `${hours}:${String(remainingMinutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export function DurationValue({ value, direction: _direction }: DurationValueProps) {
  const formatted = formatDuration(value);

  return <span className="font-mono">{formatted}</span>;
}

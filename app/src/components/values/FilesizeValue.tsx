interface FilesizeValueProps {
  value: number; // Size in bytes
  direction: "ascending" | "descending";
}

const units = ["B", "KB", "MB", "GB", "TB", "PB"];

function formatFilesize(bytes: number): string {
  if (bytes === 0) return "0 B";

  const k = 1024;
  const i = Math.floor(Math.log(Math.abs(bytes)) / Math.log(k));
  const unitIndex = Math.min(i, units.length - 1);
  const value = bytes / Math.pow(k, unitIndex);

  // Format with appropriate precision
  const formatted =
    value < 10
      ? value.toFixed(2)
      : value < 100
        ? value.toFixed(1)
        : value.toFixed(0);

  return `${formatted} ${units[unitIndex]}`;
}

export function FilesizeValue({
  value,
  direction: _direction,
}: FilesizeValueProps) {
  const formatted = formatFilesize(value);

  return <span>{formatted}</span>;
}

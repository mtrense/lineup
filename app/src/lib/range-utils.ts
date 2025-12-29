import type { AttributeValue, CandidateFile, ValueType } from "@/types";

/**
 * Get the type string from a ValueType (handles both string and object types)
 */
function getValueTypeString(valueType: ValueType): string {
  if (typeof valueType === "string") {
    return valueType;
  }
  return valueType.type;
}

/** Set of value types that support range filtering */
const RANGEABLE_TYPES = new Set([
  "integer",
  "decimal",
  "percentage",
  "rating",
  "filesize",
  "duration",
  "date",
  "datetime",
]);

/**
 * Check if a value type supports range filtering.
 * Rangeable types are numeric or temporal types that can be compared.
 *
 * Included: integer, decimal, percentage, rating, filesize, duration, date, datetime
 * Excluded: text, boolean, tags, icon, link
 */
export function isRangeableType(valueType: ValueType): boolean {
  const typeString = getValueTypeString(valueType);
  return RANGEABLE_TYPES.has(typeString);
}

/**
 * Extract a numeric value from an AttributeValue based on its ValueType.
 * Returns null if the value cannot be converted to a number.
 *
 * Type-specific handling:
 * - Integer/Decimal/Percentage/Rating: direct number
 * - Filesize: number (bytes)
 * - Duration: number (milliseconds)
 * - Date/DateTime: number (Unix timestamp in milliseconds)
 */
export function getNumericValue(
  attributeValue: AttributeValue | undefined,
  valueType: ValueType
): number | null {
  if (!attributeValue || attributeValue.value === null || attributeValue.value === undefined) {
    return null;
  }

  const value = attributeValue.value;
  const typeString = getValueTypeString(valueType);

  switch (typeString) {
    case "integer":
    case "decimal":
    case "percentage":
    case "rating":
    case "filesize":
    case "duration":
      // All these types store numeric values directly
      if (typeof value === "number") {
        return value;
      }
      return null;

    case "date":
    case "datetime":
      // Date/DateTime are stored as ISO 8601 strings
      if (typeof value === "string") {
        const timestamp = Date.parse(value);
        if (!isNaN(timestamp)) {
          return timestamp;
        }
      }
      return null;

    default:
      // Non-numeric types (text, boolean, tags, icon, link)
      return null;
  }
}

/**
 * Calculate the min/max bounds for a rangeable attribute across all candidates.
 * Returns null if no valid numeric values exist.
 */
export function calculateRangeBounds(
  candidates: CandidateFile[],
  attributeId: string,
  valueType: ValueType
): { min: number; max: number } | null {
  let min: number | null = null;
  let max: number | null = null;

  for (const candidate of candidates) {
    const attributeValue = candidate.values[attributeId];
    const numericValue = getNumericValue(attributeValue, valueType);

    if (numericValue !== null) {
      if (min === null || numericValue < min) {
        min = numericValue;
      }
      if (max === null || numericValue > max) {
        max = numericValue;
      }
    }
  }

  // Return null if no valid values found
  if (min === null || max === null) {
    return null;
  }

  return { min, max };
}

// ============================================================================
// Label Formatters
// ============================================================================

const FILESIZE_UNITS = ["B", "KB", "MB", "GB", "TB", "PB"];

/**
 * Format a filesize value (in bytes) to a human-readable string.
 */
function formatFilesize(bytes: number): string {
  if (bytes === 0) return "0 B";

  const k = 1024;
  const i = Math.floor(Math.log(Math.abs(bytes)) / Math.log(k));
  const unitIndex = Math.min(i, FILESIZE_UNITS.length - 1);
  const value = bytes / Math.pow(k, unitIndex);

  // Format with appropriate precision
  const formatted =
    value < 10
      ? value.toFixed(2)
      : value < 100
        ? value.toFixed(1)
        : value.toFixed(0);

  return `${formatted} ${FILESIZE_UNITS[unitIndex]}`;
}

/**
 * Format a duration value (in milliseconds) to a human-readable string.
 */
function formatDuration(ms: number): string {
  if (ms < 0) return "0ms";

  // Less than a second
  if (ms < 1000) {
    return `${Math.round(ms)}ms`;
  }

  const totalSeconds = Math.floor(ms / 1000);
  const milliseconds = ms % 1000;

  // Less than a minute
  if (totalSeconds < 60) {
    if (milliseconds > 0) {
      return `${totalSeconds}.${String(Math.round(milliseconds)).padStart(3, "0").slice(0, 2)}s`;
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

/**
 * Format a date timestamp (in milliseconds) to a human-readable string.
 */
function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * Format a datetime timestamp (in milliseconds) to a human-readable string.
 */
function formatDateTime(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Format a numeric value for display in a range slider label.
 * The formatting depends on the value type.
 */
export function formatRangeLabel(value: number, valueType: ValueType): string {
  const typeString = getValueTypeString(valueType);

  switch (typeString) {
    case "integer":
      return Math.round(value).toLocaleString();

    case "decimal":
      return value.toLocaleString(undefined, {
        minimumFractionDigits: 1,
        maximumFractionDigits: 2,
      });

    case "percentage":
      // Normalize: if value is between 0 and 1, treat as decimal percentage
      const percentage = value <= 1 ? Math.round(value * 100) : Math.round(value);
      return `${percentage}%`;

    case "rating":
      // For rating, just show the numeric value
      return value.toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 1,
      });

    case "filesize":
      return formatFilesize(value);

    case "duration":
      return formatDuration(value);

    case "date":
      return formatDate(value);

    case "datetime":
      return formatDateTime(value);

    default:
      return String(value);
  }
}

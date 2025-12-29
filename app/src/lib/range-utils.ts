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

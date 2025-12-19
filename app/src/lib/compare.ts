import type { ValueType, Attribute } from "@/types";

type CompareResult = -1 | 0 | 1;
type AttributeValueType = number | string | string[] | boolean | null | undefined;

/**
 * Compare two values for sorting.
 * Returns negative if a < b, positive if a > b, zero if equal.
 * Null/undefined values always sort to the end.
 */
export function compareValues(
  a: AttributeValueType,
  b: AttributeValueType,
  valueType: ValueType
): CompareResult {
  // Handle null/undefined - always sort to end
  const aIsNull = a === null || a === undefined;
  const bIsNull = b === null || b === undefined;

  if (aIsNull && bIsNull) return 0;
  if (aIsNull) return 1; // a goes to end
  if (bIsNull) return -1; // b goes to end

  // Get the type identifier
  const typeId = typeof valueType === "string" ? valueType : valueType.type;

  switch (typeId) {
    case "integer":
    case "decimal":
    case "percentage":
    case "rating":
    case "filesize":
    case "duration":
      return compareNumbers(a as number, b as number);

    case "boolean":
      // true > false
      return compareBooleans(a as boolean, b as boolean);

    case "text":
    case "link":
      return compareStrings(a as string, b as string);

    case "tags":
      // Compare by first tag alphabetically
      return compareTagArrays(a as string[], b as string[]);

    default:
      // Non-comparable types (icons, etc.)
      return 0;
  }
}

function compareNumbers(a: number, b: number): CompareResult {
  if (a < b) return -1;
  if (a > b) return 1;
  return 0;
}

function compareBooleans(a: boolean, b: boolean): CompareResult {
  if (a === b) return 0;
  return a ? -1 : 1; // true comes first
}

function compareStrings(a: string, b: string): CompareResult {
  const result = a.localeCompare(b, undefined, { sensitivity: "base" });
  if (result < 0) return -1;
  if (result > 0) return 1;
  return 0;
}

function compareTagArrays(a: string[], b: string[]): CompareResult {
  // Compare by number of tags, then alphabetically by first tag
  if (a.length === 0 && b.length === 0) return 0;
  if (a.length === 0) return 1;
  if (b.length === 0) return -1;

  // Sort tags and compare first one
  const aSorted = [...a].sort();
  const bSorted = [...b].sort();
  return compareStrings(aSorted[0], bSorted[0]);
}

/**
 * Check if a value type supports ranking/comparison for highlighting best values.
 */
export function isRankableType(valueType: ValueType): boolean {
  if (typeof valueType === "string") {
    return valueType === "boolean";
  }

  const rankableTypes = [
    "integer",
    "decimal",
    "percentage",
    "rating",
    "filesize",
    "duration",
  ];
  return rankableTypes.includes(valueType.type);
}

/**
 * Check if a value type is sortable (can be ordered).
 */
export function isSortableType(valueType: ValueType): boolean {
  if (typeof valueType === "string") {
    return valueType === "boolean" || valueType === "text" || valueType === "link";
  }

  const sortableTypes = [
    "integer",
    "decimal",
    "percentage",
    "rating",
    "filesize",
    "duration",
    "tags",
  ];
  return sortableTypes.includes(valueType.type);
}

/**
 * Get the direction property from a value type, if it has one.
 */
export function getDirection(
  valueType: ValueType
): "ascending" | "descending" | "neutral" | null {
  if (typeof valueType === "string") {
    return null;
  }

  if ("direction" in valueType) {
    return valueType.direction;
  }

  return null;
}

/**
 * Find indices of best value(s) in an array, respecting direction.
 * Returns empty array if type is not rankable or all values are null.
 */
export function findBestIndices(
  values: AttributeValueType[],
  valueType: ValueType
): number[] {
  if (!isRankableType(valueType)) {
    return [];
  }

  const direction = getDirection(valueType);
  if (direction === "neutral" || direction === null) {
    return [];
  }

  // Find non-null values with their indices
  const validEntries: { index: number; value: AttributeValueType }[] = [];
  values.forEach((value, index) => {
    if (value !== null && value !== undefined) {
      validEntries.push({ index, value });
    }
  });

  if (validEntries.length === 0) {
    return [];
  }

  // Sort to find best value
  validEntries.sort((a, b) => {
    const cmp = compareValues(a.value, b.value, valueType);
    // For ascending direction, higher is better, so we want largest first
    // For descending direction, lower is better, so we want smallest first
    return direction === "ascending" ? -cmp : cmp;
  });

  const bestValue = validEntries[0].value;

  // Find all indices with the best value (handle ties)
  return validEntries
    .filter((entry) => compareValues(entry.value, bestValue, valueType) === 0)
    .map((entry) => entry.index);
}

/**
 * Create a sort comparator for candidates based on an attribute.
 */
export function createCandidateSorter(
  attribute: Attribute,
  direction: "asc" | "desc"
) {
  return (
    a: { values: Record<string, { value: AttributeValueType }> },
    b: { values: Record<string, { value: AttributeValueType }> }
  ) => {
    const aValue = a.values[attribute.id]?.value;
    const bValue = b.values[attribute.id]?.value;

    let result = compareValues(aValue, bValue, attribute.valueType);

    // Reverse for descending sort
    if (direction === "desc") {
      result = (result * -1) as CompareResult;
    }

    return result;
  };
}

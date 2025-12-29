/**
 * URL persistence utilities for range filters.
 *
 * URL Format:
 * - `filter.{attrId}={min},{max}` - basic range filter
 * - `filter.{attrId}={min},{max},null` - range filter with includeNull=true
 * - `filter.{attrId}=,{max}` - open-ended (no min)
 * - `filter.{attrId}={min},` - open-ended (no max)
 *
 * Examples:
 * - `?filter.stars=3,5` - stars between 3 and 5
 * - `?filter.size=1000,5000,null` - size 1000-5000 including nulls
 * - `?filter.year=2020,` - year 2020 or later
 */

export interface RangeFilter {
  attributeId: string;
  min: number | null; // null = no lower bound
  max: number | null; // null = no upper bound
  includeNull: boolean; // whether to include candidates with null values
}

const FILTER_PREFIX = "filter.";

/**
 * Serialize range filters to URL search params.
 * Adds/updates params with `filter.{attrId}` keys.
 */
export function serializeRangeFiltersToParams(
  filters: RangeFilter[],
  params: URLSearchParams
): void {
  for (const filter of filters) {
    const key = `${FILTER_PREFIX}${filter.attributeId}`;
    const minPart = filter.min !== null ? String(filter.min) : "";
    const maxPart = filter.max !== null ? String(filter.max) : "";
    const nullPart = filter.includeNull ? ",null" : "";

    const value = `${minPart},${maxPart}${nullPart}`;
    params.set(key, value);
  }
}

/**
 * Parse range filters from URL search params.
 * Extracts all params with `filter.{attrId}` keys and parses their values.
 *
 * Invalid or malformed values are silently ignored.
 */
export function parseRangeFiltersFromParams(
  params: URLSearchParams
): RangeFilter[] {
  const filters: RangeFilter[] = [];

  params.forEach((value, key) => {
    if (!key.startsWith(FILTER_PREFIX)) {
      return;
    }

    const attributeId = key.slice(FILTER_PREFIX.length);
    if (!attributeId) {
      return;
    }

    const parsed = parseFilterValue(value);
    if (parsed) {
      filters.push({
        attributeId,
        ...parsed,
      });
    }
  });

  return filters;
}

/**
 * Parse a single filter value string.
 * Returns null if the value is malformed.
 */
function parseFilterValue(
  value: string
): { min: number | null; max: number | null; includeNull: boolean } | null {
  // Split by comma
  const parts = value.split(",");

  // Need at least 2 parts (min and max)
  if (parts.length < 2) {
    return null;
  }

  // Parse min
  const minStr = parts[0].trim();
  let min: number | null = null;
  if (minStr !== "") {
    const parsed = parseFloat(minStr);
    if (isNaN(parsed)) {
      return null; // Invalid min value
    }
    min = parsed;
  }

  // Parse max
  const maxStr = parts[1].trim();
  let max: number | null = null;
  if (maxStr !== "") {
    const parsed = parseFloat(maxStr);
    if (isNaN(parsed)) {
      return null; // Invalid max value
    }
    max = parsed;
  }

  // Check for includeNull flag
  const includeNull =
    parts.length >= 3 && parts[2].trim().toLowerCase() === "null";

  return { min, max, includeNull };
}

/**
 * Remove all range filter params from a URLSearchParams object.
 * Used when clearing filters.
 */
export function removeRangeFiltersFromParams(params: URLSearchParams): void {
  const keysToRemove: string[] = [];

  params.forEach((_, key) => {
    if (key.startsWith(FILTER_PREFIX)) {
      keysToRemove.push(key);
    }
  });

  for (const key of keysToRemove) {
    params.delete(key);
  }
}

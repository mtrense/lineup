import { useMemo } from "react";
import { Check, Filter, Minus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { RangeSlider } from "@/components/ui/range-slider";
import type { AttributesFile, CandidateFile, TagsType, ValueType } from "@/types";
import {
  isRangeableType,
  calculateRangeBounds,
  formatRangeLabel,
} from "@/lib/range-utils";

export interface TagFilter {
  attributeId: string;
  tagIds: Set<string>;
}

export interface BooleanFilter {
  attributeId: string;
  value: boolean;
}

export interface RangeFilter {
  attributeId: string;
  min: number | null; // null = no lower bound
  max: number | null; // null = no upper bound
  includeNull: boolean; // whether to include candidates with null values
}

export interface FilterState {
  tags: TagFilter[];
  booleans: BooleanFilter[];
  ranges: RangeFilter[];
}

export const emptyFilterState: FilterState = {
  tags: [],
  booleans: [],
  ranges: [],
};

export function getActiveFilterCount(filterState: FilterState): number {
  return (
    filterState.tags.reduce((sum, f) => sum + f.tagIds.size, 0) +
    filterState.booleans.length +
    filterState.ranges.length
  );
}

interface FilterDrawerProps {
  attributes: AttributesFile;
  candidates: CandidateFile[];
  filterState: FilterState;
  onFilterChange: (state: FilterState) => void;
}

type TagFilterableAttribute = {
  type: "tags";
  id: string;
  name: string;
  tags: { id: string; value: string; color?: string }[];
};

type BooleanFilterableAttribute = {
  type: "boolean";
  id: string;
  name: string;
};

type RangeFilterableAttribute = {
  type: "range";
  id: string;
  name: string;
  valueType: ValueType;
  bounds: { min: number; max: number };
};

type FilterableAttribute =
  | TagFilterableAttribute
  | BooleanFilterableAttribute
  | RangeFilterableAttribute;

interface FilterableGroup {
  id: string;
  name: string;
  attributes: FilterableAttribute[];
}

export function FilterDrawer({
  attributes,
  candidates,
  filterState,
  onFilterChange,
}: FilterDrawerProps) {
  // Build filterable groups preserving the original group structure and attribute order
  const filterableGroups = useMemo(() => {
    const result: FilterableGroup[] = [];

    attributes.groups.forEach((group) => {
      const filterableAttrs: FilterableAttribute[] = [];

      group.attributes.forEach((attr) => {
        // Check for tag-type attributes
        if (
          typeof attr.valueType === "object" &&
          attr.valueType.type === "tags"
        ) {
          const tagsType = attr.valueType as TagsType;

          // Find which tags are actually used by candidates
          const usedTagIds = new Set<string>();
          candidates.forEach((candidate) => {
            const value = candidate.values[attr.id]?.value;
            if (Array.isArray(value)) {
              value.forEach((tagId) => usedTagIds.add(tagId));
            }
          });

          if (usedTagIds.size > 0) {
            filterableAttrs.push({
              type: "tags",
              id: attr.id,
              name: attr.name,
              tags: tagsType.tags.filter((t) => usedTagIds.has(t.id)),
            });
          }
        }
        // Check for boolean attributes
        else if (attr.valueType === "boolean") {
          filterableAttrs.push({
            type: "boolean",
            id: attr.id,
            name: attr.name,
          });
        }
        // Check for rangeable attributes
        else if (isRangeableType(attr.valueType)) {
          const bounds = calculateRangeBounds(
            candidates,
            attr.id,
            attr.valueType
          );

          // Only add if we have valid bounds and more than one unique value
          if (bounds !== null && bounds.min !== bounds.max) {
            filterableAttrs.push({
              type: "range",
              id: attr.id,
              name: attr.name,
              valueType: attr.valueType,
              bounds,
            });
          }
        }
      });

      // Only include groups that have filterable attributes
      if (filterableAttrs.length > 0) {
        result.push({
          id: group.id,
          name: group.name,
          attributes: filterableAttrs,
        });
      }
    });

    return result;
  }, [attributes, candidates]);

  // Check if there are any filterable attributes
  const hasFilterableAttributes = filterableGroups.some(
    (g) => g.attributes.length > 0
  );

  const toggleTag = (attributeId: string, tagId: string) => {
    const existingFilter = filterState.tags.find(
      (f) => f.attributeId === attributeId
    );

    if (existingFilter) {
      const newTagIds = new Set(existingFilter.tagIds);
      if (newTagIds.has(tagId)) {
        newTagIds.delete(tagId);
      } else {
        newTagIds.add(tagId);
      }

      if (newTagIds.size === 0) {
        // Remove this filter entirely
        onFilterChange({
          ...filterState,
          tags: filterState.tags.filter((f) => f.attributeId !== attributeId),
        });
      } else {
        onFilterChange({
          ...filterState,
          tags: filterState.tags.map((f) =>
            f.attributeId === attributeId ? { ...f, tagIds: newTagIds } : f
          ),
        });
      }
    } else {
      // Create new filter
      onFilterChange({
        ...filterState,
        tags: [
          ...filterState.tags,
          { attributeId, tagIds: new Set([tagId]) },
        ],
      });
    }
  };

  const clearTagFilter = (attributeId: string) => {
    onFilterChange({
      ...filterState,
      tags: filterState.tags.filter((f) => f.attributeId !== attributeId),
    });
  };

  const toggleBoolean = (attributeId: string, value: boolean | null) => {
    if (value === null) {
      // Remove filter
      onFilterChange({
        ...filterState,
        booleans: filterState.booleans.filter(
          (f) => f.attributeId !== attributeId
        ),
      });
    } else {
      const existing = filterState.booleans.find(
        (f) => f.attributeId === attributeId
      );
      if (existing) {
        onFilterChange({
          ...filterState,
          booleans: filterState.booleans.map((f) =>
            f.attributeId === attributeId ? { ...f, value } : f
          ),
        });
      } else {
        onFilterChange({
          ...filterState,
          booleans: [...filterState.booleans, { attributeId, value }],
        });
      }
    }
  };

  // Cycle through: null (Any) -> true (Yes) -> false (No) -> null (Any)
  const cycleBooleanFilter = (attributeId: string) => {
    const existing = filterState.booleans.find(
      (f) => f.attributeId === attributeId
    );
    const currentValue = existing?.value ?? null;

    if (currentValue === null) {
      toggleBoolean(attributeId, true);
    } else if (currentValue === true) {
      toggleBoolean(attributeId, false);
    } else {
      toggleBoolean(attributeId, null);
    }
  };

  const handleRangeChange = (
    attributeId: string,
    min: number,
    max: number,
    bounds: { min: number; max: number }
  ) => {
    // If range matches full bounds, remove the filter
    if (min === bounds.min && max === bounds.max) {
      onFilterChange({
        ...filterState,
        ranges: filterState.ranges.filter((f) => f.attributeId !== attributeId),
      });
      return;
    }

    const existing = filterState.ranges.find(
      (f) => f.attributeId === attributeId
    );

    if (existing) {
      onFilterChange({
        ...filterState,
        ranges: filterState.ranges.map((f) =>
          f.attributeId === attributeId ? { ...f, min, max } : f
        ),
      });
    } else {
      onFilterChange({
        ...filterState,
        ranges: [
          ...filterState.ranges,
          { attributeId, min, max, includeNull: true },
        ],
      });
    }
  };

  const handleRangeIncludeNullChange = (
    attributeId: string,
    includeNull: boolean,
    bounds: { min: number; max: number }
  ) => {
    const existing = filterState.ranges.find(
      (f) => f.attributeId === attributeId
    );

    if (existing) {
      onFilterChange({
        ...filterState,
        ranges: filterState.ranges.map((f) =>
          f.attributeId === attributeId ? { ...f, includeNull } : f
        ),
      });
    } else {
      // Create a new filter with full range but custom includeNull
      onFilterChange({
        ...filterState,
        ranges: [
          ...filterState.ranges,
          {
            attributeId,
            min: bounds.min,
            max: bounds.max,
            includeNull,
          },
        ],
      });
    }
  };

  const clearRangeFilter = (attributeId: string) => {
    onFilterChange({
      ...filterState,
      ranges: filterState.ranges.filter((f) => f.attributeId !== attributeId),
    });
  };

  const clearAllFilters = () => {
    onFilterChange(emptyFilterState);
  };

  const hasActiveFilters =
    filterState.tags.length > 0 ||
    filterState.booleans.length > 0 ||
    filterState.ranges.length > 0;

  const activeFilterCount = getActiveFilterCount(filterState);

  // Don't render if no filterable attributes
  if (!hasFilterableAttributes) {
    return null;
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Filter className="h-4 w-4" />
          Filters
          {activeFilterCount > 0 && (
            <span className="rounded-full bg-primary px-1.5 py-0.5 text-xs text-primary-foreground">
              {activeFilterCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between pr-8">
            <span>Filters</span>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
              >
                <X className="mr-1 h-3 w-3" />
                Clear all
              </Button>
            )}
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-6 px-4 pb-4">
          {filterableGroups.map((group, groupIndex) => (
            <div key={group.id}>
              {/* Group divider (except for first group) */}
              {groupIndex > 0 && <div className="mb-4 border-t border-border" />}

              {/* Group header */}
              <div className="mb-3 text-sm font-semibold text-foreground">
                {group.name}
              </div>

              {/* Filters within this group */}
              <div className="space-y-3">
                {group.attributes.map((attr) => {
                  if (attr.type === "tags") {
                    // Tag filter
                    const activeFilter = filterState.tags.find(
                      (f) => f.attributeId === attr.id
                    );
                    const hasSelection =
                      activeFilter && activeFilter.tagIds.size > 0;

                    return (
                      <div key={attr.id}>
                        <div className="mb-1.5 text-xs font-medium text-muted-foreground">
                          {attr.name}
                        </div>
                        <div className="flex flex-wrap items-center gap-1.5">
                          {attr.tags.map((tag) => {
                            const isSelected = activeFilter?.tagIds.has(tag.id);
                            return (
                              <button
                                key={tag.id}
                                onClick={() => toggleTag(attr.id, tag.id)}
                                className={`rounded-full px-2.5 py-0.5 text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                                  isSelected
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                                }`}
                                aria-pressed={isSelected}
                              >
                                {tag.value}
                              </button>
                            );
                          })}
                          {hasSelection && (
                            <button
                              onClick={() => clearTagFilter(attr.id)}
                              className="ml-1 rounded-full p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                              aria-label={`Clear ${attr.name} filter`}
                            >
                              <X className="h-3.5 w-3.5" aria-hidden="true" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  } else if (attr.type === "boolean") {
                    // Boolean filter
                    const activeFilter = filterState.booleans.find(
                      (f) => f.attributeId === attr.id
                    );
                    const currentValue = activeFilter?.value ?? null;

                    // Determine styling and icon based on current state
                    let stateClass: string;
                    let StateIcon: typeof Check;
                    let stateLabel: string;

                    if (currentValue === true) {
                      stateClass =
                        "bg-green-500/20 text-green-700 dark:text-green-400 hover:bg-green-500/30";
                      StateIcon = Check;
                      stateLabel = "Yes";
                    } else if (currentValue === false) {
                      stateClass =
                        "bg-red-500/20 text-red-700 dark:text-red-400 hover:bg-red-500/30";
                      StateIcon = X;
                      stateLabel = "No";
                    } else {
                      stateClass =
                        "bg-muted text-muted-foreground hover:bg-muted/80";
                      StateIcon = Minus;
                      stateLabel = "Any";
                    }

                    return (
                      <button
                        key={attr.id}
                        onClick={() => cycleBooleanFilter(attr.id)}
                        className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${stateClass}`}
                        aria-label={`${attr.name}: ${stateLabel}. Click to cycle filter.`}
                      >
                        <StateIcon
                          className="h-4 w-4 shrink-0"
                          aria-hidden="true"
                        />
                        <span>{attr.name}</span>
                        <span className="sr-only">Current: {stateLabel}</span>
                      </button>
                    );
                  } else {
                    // Range filter
                    const activeFilter = filterState.ranges.find(
                      (f) => f.attributeId === attr.id
                    );
                    const currentMin = activeFilter?.min ?? attr.bounds.min;
                    const currentMax = activeFilter?.max ?? attr.bounds.max;
                    const includeNull = activeFilter?.includeNull ?? true;
                    const isModified =
                      activeFilter !== undefined &&
                      (currentMin !== attr.bounds.min ||
                        currentMax !== attr.bounds.max ||
                        !includeNull);

                    return (
                      <div key={attr.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-muted-foreground">
                            {attr.name}
                          </span>
                          {isModified && (
                            <button
                              onClick={() => clearRangeFilter(attr.id)}
                              className="rounded-full p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                              aria-label={`Clear ${attr.name} filter`}
                            >
                              <X className="h-3 w-3" aria-hidden="true" />
                            </button>
                          )}
                        </div>
                        <RangeSlider
                          min={attr.bounds.min}
                          max={attr.bounds.max}
                          value={[currentMin, currentMax]}
                          onChange={(value) =>
                            handleRangeChange(
                              attr.id,
                              value[0],
                              value[1],
                              attr.bounds
                            )
                          }
                          formatLabel={(v) =>
                            formatRangeLabel(v, attr.valueType)
                          }
                        />
                        <div className="flex items-center gap-2">
                          <Checkbox
                            id={`${attr.id}-include-null`}
                            checked={includeNull}
                            onCheckedChange={(checked) =>
                              handleRangeIncludeNullChange(
                                attr.id,
                                checked === true,
                                attr.bounds
                              )
                            }
                          />
                          <Label
                            htmlFor={`${attr.id}-include-null`}
                            className="text-xs text-muted-foreground"
                          >
                            Include unknown
                          </Label>
                        </div>
                      </div>
                    );
                  }
                })}
              </div>
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}

/**
 * Extract numeric value from an attribute value for range filtering.
 * Returns null if the value cannot be converted to a number.
 */
function getNumericValueForRange(value: unknown): number | null {
  if (value === null || value === undefined) {
    return null;
  }
  if (typeof value === "number") {
    return value;
  }
  // Handle date/datetime strings (ISO 8601 format)
  if (typeof value === "string") {
    const timestamp = Date.parse(value);
    if (!isNaN(timestamp)) {
      return timestamp;
    }
  }
  return null;
}

/**
 * Check if a candidate passes a single range filter.
 */
function candidatePassesRangeFilter(
  candidate: CandidateFile,
  rangeFilter: RangeFilter
): boolean {
  const candidateValue = candidate.values[rangeFilter.attributeId]?.value;
  const numericValue = getNumericValueForRange(candidateValue);

  // Handle null values
  if (numericValue === null) {
    return rangeFilter.includeNull;
  }

  // Check lower bound
  if (rangeFilter.min !== null && numericValue < rangeFilter.min) {
    return false;
  }

  // Check upper bound
  if (rangeFilter.max !== null && numericValue > rangeFilter.max) {
    return false;
  }

  return true;
}

/**
 * Check if a candidate passes all active filters.
 */
export function candidatePassesFilters(
  candidate: CandidateFile,
  filterState: FilterState
): boolean {
  // Check tag filters (OR within attribute, AND between attributes)
  for (const tagFilter of filterState.tags) {
    const candidateValue = candidate.values[tagFilter.attributeId]?.value;
    if (!Array.isArray(candidateValue)) {
      return false;
    }
    // Candidate must have at least one of the selected tags
    const hasMatch = candidateValue.some((tagId) =>
      tagFilter.tagIds.has(tagId)
    );
    if (!hasMatch) {
      return false;
    }
  }

  // Check boolean filters
  for (const boolFilter of filterState.booleans) {
    const candidateValue = candidate.values[boolFilter.attributeId]?.value;
    if (candidateValue !== boolFilter.value) {
      return false;
    }
  }

  // Check range filters
  for (const rangeFilter of filterState.ranges) {
    if (!candidatePassesRangeFilter(candidate, rangeFilter)) {
      return false;
    }
  }

  return true;
}

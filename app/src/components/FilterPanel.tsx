import { useMemo } from "react";
import { Check, Filter, Minus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { AttributesFile, CandidateFile, TagsType } from "@/types";

export interface TagFilter {
  attributeId: string;
  tagIds: Set<string>;
}

export interface BooleanFilter {
  attributeId: string;
  value: boolean;
}

export interface FilterState {
  tags: TagFilter[];
  booleans: BooleanFilter[];
}

export const emptyFilterState: FilterState = {
  tags: [],
  booleans: [],
};

export function getActiveFilterCount(filterState: FilterState): number {
  return (
    filterState.tags.reduce((sum, f) => sum + f.tagIds.size, 0) +
    filterState.booleans.length
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

type FilterableAttribute = TagFilterableAttribute | BooleanFilterableAttribute;

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

  const clearAllFilters = () => {
    onFilterChange(emptyFilterState);
  };

  const hasActiveFilters =
    filterState.tags.length > 0 || filterState.booleans.length > 0;

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
                  } else {
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

  return true;
}

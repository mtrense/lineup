import { useState, useMemo, Fragment, useEffect } from "react";
import {
  ChevronLeft,
  ChevronDown,
  ChevronRight,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ValueRenderer } from "@/components/values/ValueRenderer";
import {
  FilterDrawer,
  FilterState,
  emptyFilterState,
  candidatePassesFilters,
} from "@/components/FilterPanel";
import {
  isSortableType,
  createCandidateSorter,
  findBestIndices,
} from "@/lib/compare";
import type { AttributesFile, CandidateFile, Attribute } from "@/types";

export interface SortState {
  attributeId: string;
  direction: "asc" | "desc";
}

interface ComparisonViewProps {
  attributes: AttributesFile;
  candidates: CandidateFile[];
  initialSelection?: string[] | null;
  initialSort?: SortState | null;
  onBack: () => void;
  onSelectionChange?: (selected: string[]) => void;
  onSortChange?: (sort: SortState | null) => void;
}

export function ComparisonView({
  attributes,
  candidates,
  initialSelection,
  initialSort,
  onBack,
  onSelectionChange,
  onSortChange,
}: ComparisonViewProps) {
  // Track which candidates are selected for comparison
  const [selectedCandidates, setSelectedCandidates] = useState<Set<string>>(
    () => {
      if (initialSelection && initialSelection.length > 0) {
        // Filter to only valid candidate names
        const validNames = new Set(candidates.map((c) => c.name));
        const validSelection = initialSelection.filter((name) =>
          validNames.has(name)
        );
        if (validSelection.length > 0) {
          return new Set(validSelection);
        }
      }
      // Default to all candidates selected
      return new Set(candidates.map((c) => c.name));
    }
  );

  // Track which groups are expanded
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(() => {
    const initial = new Set<string>();
    attributes.groups.forEach((group) => {
      if (group.expandedByDefault) {
        initial.add(group.id);
      }
    });
    return initial;
  });

  // Track sort state
  const [sortState, setSortState] = useState<SortState | null>(
    initialSort ?? null
  );

  // Track filter state
  const [filterState, setFilterState] = useState<FilterState>(emptyFilterState);

  // Build a map of attribute id to attribute for sorting
  const attributeMap = useMemo(() => {
    const map = new Map<string, Attribute>();
    attributes.groups.forEach((group) => {
      group.attributes.forEach((attr) => {
        map.set(attr.id, attr);
      });
    });
    return map;
  }, [attributes]);

  // Notify parent of selection changes
  useEffect(() => {
    if (onSelectionChange) {
      onSelectionChange(Array.from(selectedCandidates));
    }
  }, [selectedCandidates, onSelectionChange]);

  // Notify parent of sort changes
  useEffect(() => {
    if (onSortChange) {
      onSortChange(sortState);
    }
  }, [sortState, onSortChange]);

  // Track which candidates pass filters
  const candidateFilterStatus = useMemo(() => {
    const map = new Map<string, boolean>();
    candidates.forEach((c) => {
      map.set(c.name, candidatePassesFilters(c, filterState));
    });
    return map;
  }, [candidates, filterState]);

  // Order candidates for the selector: passing filters first, then filtered out
  const orderedCandidates = useMemo(() => {
    const passing = candidates.filter((c) => candidateFilterStatus.get(c.name));
    const filtered = candidates.filter((c) => !candidateFilterStatus.get(c.name));
    return [...passing, ...filtered];
  }, [candidates, candidateFilterStatus]);

  // Filter and sort candidates for the table
  const visibleCandidates = useMemo(() => {
    let result = candidates.filter((c) => selectedCandidates.has(c.name));

    // Apply sorting if active
    if (sortState) {
      const attribute = attributeMap.get(sortState.attributeId);
      if (attribute) {
        const sorter = createCandidateSorter(attribute, sortState.direction);
        result = [...result].sort(sorter);
      }
    }

    return result;
  }, [candidates, selectedCandidates, sortState, attributeMap]);

  const toggleCandidate = (name: string) => {
    setSelectedCandidates((prev) => {
      const next = new Set(prev);
      if (next.has(name)) {
        next.delete(name);
      } else {
        next.add(name);
      }
      return next;
    });
  };

  const selectAll = () => {
    setSelectedCandidates(new Set(candidates.map((c) => c.name)));
  };

  const clearAll = () => {
    setSelectedCandidates(new Set());
  };

  const toggleGroup = (groupId: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(groupId)) {
        next.delete(groupId);
      } else {
        next.add(groupId);
      }
      return next;
    });
  };

  const toggleSort = (attributeId: string) => {
    setSortState((prev) => {
      if (prev?.attributeId !== attributeId) {
        // Start sorting by this attribute, ascending
        return { attributeId, direction: "asc" };
      }
      if (prev.direction === "asc") {
        // Switch to descending
        return { attributeId, direction: "desc" };
      }
      // Clear sort
      return null;
    });
  };

  return (
    <div className="flex min-h-screen flex-col">
      {/* Skip to content link for accessibility */}
      <a
        href="#comparison-table"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        Skip to comparison table
      </a>

      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 no-print">
        <div className="container mx-auto px-4 py-6">
          <div className="mb-1 flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="text-muted-foreground hover:text-foreground"
            >
              <ChevronLeft className="mr-1 h-4 w-4" />
              Back
            </Button>
          </div>
          <h1 className="text-center text-2xl font-bold md:text-3xl">
            {attributes.name}
          </h1>
          {attributes.description && (
            <p className="mt-2 text-center text-muted-foreground">
              {attributes.description}
            </p>
          )}
        </div>
      </header>

      {/* Candidate Selector */}
      <div className="border-b border-border bg-card/50 px-4 py-4 no-print">
        <div className="container mx-auto">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Select items to compare
            </span>
            <div className="flex items-center gap-3">
              <FilterDrawer
                attributes={attributes}
                candidates={candidates}
                filterState={filterState}
                onFilterChange={setFilterState}
              />
              <div className="flex gap-2">
                <button
                  onClick={selectAll}
                  className="text-sm text-primary hover:underline"
                >
                  Select All
                </button>
                <button
                  onClick={clearAll}
                  className="text-sm text-primary hover:underline"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {orderedCandidates.map((candidate) => {
              const isSelected = selectedCandidates.has(candidate.name);
              const passesFilter = candidateFilterStatus.get(candidate.name);
              return (
                <button
                  key={candidate.name}
                  onClick={() => toggleCandidate(candidate.name)}
                  className={`rounded-full px-3 py-1 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                    isSelected
                      ? passesFilter
                        ? "bg-primary text-primary-foreground"
                        : "bg-primary/50 text-primary-foreground/70"
                      : passesFilter
                        ? "bg-muted text-muted-foreground hover:bg-muted/80"
                        : "bg-muted/50 text-muted-foreground/50 hover:bg-muted/40"
                  }`}
                  aria-pressed={isSelected}
                  aria-label={`${candidate.name}${!passesFilter ? " (filtered)" : ""}`}
                >
                  {candidate.name}
                </button>
              );
            })}
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            {selectedCandidates.size} of {candidates.length} selected
          </p>
        </div>
      </div>

      {/* Comparison Table */}
      <main id="comparison-table" className="flex-1 overflow-x-auto" tabIndex={-1}>
        <div className="container mx-auto px-4 py-6">
          {visibleCandidates.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-4xl text-muted-foreground/30">No items</p>
              <p className="mt-2 text-muted-foreground">
                Select at least one item above to compare.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-border">
              <Table className="w-full">
                <TableHeader>
                  <TableRow className="border-b border-border bg-muted/30 hover:bg-muted/30">
                    <TableHead className="sticky left-0 z-10 w-40 min-w-[160px] bg-muted/30 font-semibold">
                      Attribute
                    </TableHead>
                    {visibleCandidates.map((candidate) => (
                      <TableHead
                        key={candidate.name}
                        className="text-center font-semibold"
                      >
                        {candidate.name}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attributes.groups.map((group) => {
                    const isExpanded = expandedGroups.has(group.id);
                    return (
                      <Fragment key={group.id}>
                        {/* Group Header Row */}
                        <TableRow
                          className="cursor-pointer border-b border-border bg-muted/50 hover:bg-muted/60"
                          onClick={() => toggleGroup(group.id)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              toggleGroup(group.id);
                            }
                          }}
                          tabIndex={0}
                          role="button"
                          aria-expanded={isExpanded}
                          aria-controls={`group-${group.id}`}
                        >
                          <TableCell
                            colSpan={visibleCandidates.length + 1}
                            className="py-2"
                          >
                            <div className="flex items-center gap-2 font-semibold text-primary">
                              {isExpanded ? (
                                <ChevronDown className="h-4 w-4" />
                              ) : (
                                <ChevronRight className="h-4 w-4" />
                              )}
                              {group.name}
                            </div>
                          </TableCell>
                        </TableRow>

                        {/* Attribute Rows */}
                        {isExpanded &&
                          group.attributes.map((attribute) => (
                            <AttributeRow
                              key={attribute.id}
                              attribute={attribute}
                              candidates={visibleCandidates}
                              sortState={sortState}
                              onSort={toggleSort}
                            />
                          ))}
                      </Fragment>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-4 text-center text-sm text-muted-foreground no-print">
        Data sourced from project documentation
      </footer>
    </div>
  );
}

interface AttributeRowProps {
  attribute: Attribute;
  candidates: CandidateFile[];
  sortState: SortState | null;
  onSort: (attributeId: string) => void;
}

function AttributeRow({
  attribute,
  candidates,
  sortState,
  onSort,
}: AttributeRowProps) {
  const isSortable = isSortableType(attribute.valueType);
  const isCurrentSort = sortState?.attributeId === attribute.id;
  const sortDirection = isCurrentSort ? sortState.direction : null;

  // Find best values for highlighting
  const values = candidates.map((c) => c.values[attribute.id]?.value);
  const bestIndices = findBestIndices(values, attribute.valueType);
  const bestIndexSet = new Set(bestIndices);

  const handleSort = () => {
    if (isSortable) {
      onSort(attribute.id);
    }
  };

  return (
    <TableRow className="border-b border-border/50 hover:bg-muted/20">
      <TableCell className="sticky left-0 z-10 w-40 min-w-[160px] bg-background font-medium">
        {isSortable ? (
          <button
            onClick={handleSort}
            className="flex w-full items-center gap-1 rounded text-left hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label={`Sort by ${attribute.name}${sortDirection ? `, currently ${sortDirection === "asc" ? "ascending" : "descending"}` : ""}`}
          >
            <span>{attribute.name}</span>
            {sortDirection === "asc" ? (
              <ArrowUp className="h-3 w-3 text-primary" aria-hidden="true" />
            ) : sortDirection === "desc" ? (
              <ArrowDown className="h-3 w-3 text-primary" aria-hidden="true" />
            ) : (
              <ArrowUpDown className="h-3 w-3 opacity-30" aria-hidden="true" />
            )}
          </button>
        ) : (
          attribute.name
        )}
      </TableCell>
      {candidates.map((candidate, index) => {
        const attributeValue = candidate.values[attribute.id];
        const isBest = bestIndexSet.has(index);
        return (
          <TableCell
            key={candidate.name}
            className={`text-center align-middle break-words ${
              isBest ? "bg-green-50 dark:bg-green-950/30" : ""
            }`}
          >
            <ValueRenderer
              value={attributeValue?.value}
              valueType={attribute.valueType}
              source={attributeValue?.source}
              comment={attributeValue?.comment}
            />
          </TableCell>
        );
      })}
    </TableRow>
  );
}

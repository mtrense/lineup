import { useState, useMemo, Fragment, useEffect } from "react";
import { ChevronLeft, ChevronDown, ChevronRight } from "lucide-react";
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
import type { AttributesFile, CandidateFile, Attribute } from "@/types";

interface ComparisonViewProps {
  attributes: AttributesFile;
  candidates: CandidateFile[];
  initialSelection?: string[] | null;
  onBack: () => void;
  onSelectionChange?: (selected: string[]) => void;
}

export function ComparisonView({
  attributes,
  candidates,
  initialSelection,
  onBack,
  onSelectionChange,
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

  // Notify parent of selection changes
  useEffect(() => {
    if (onSelectionChange) {
      onSelectionChange(Array.from(selectedCandidates));
    }
  }, [selectedCandidates, onSelectionChange]);

  // Filter candidates based on selection
  const visibleCandidates = useMemo(
    () => candidates.filter((c) => selectedCandidates.has(c.name)),
    [candidates, selectedCandidates]
  );

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

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
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
      <div className="border-b border-border bg-card/50 px-4 py-4">
        <div className="container mx-auto">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Select items to compare
            </span>
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
          <div className="flex flex-wrap gap-2">
            {candidates.map((candidate) => {
              const isSelected = selectedCandidates.has(candidate.name);
              return (
                <button
                  key={candidate.name}
                  onClick={() => toggleCandidate(candidate.name)}
                  className={`rounded-full px-3 py-1 text-sm transition-colors ${
                    isSelected
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
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
      <main className="flex-1 overflow-x-auto">
        <div className="container mx-auto px-4 py-6">
          {visibleCandidates.length === 0 ? (
            <p className="py-12 text-center text-muted-foreground">
              Select at least one item to compare.
            </p>
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
      <footer className="border-t border-border py-4 text-center text-sm text-muted-foreground">
        Data sourced from project documentation
      </footer>
    </div>
  );
}

interface AttributeRowProps {
  attribute: Attribute;
  candidates: CandidateFile[];
}

function AttributeRow({ attribute, candidates }: AttributeRowProps) {
  return (
    <TableRow className="border-b border-border/50 hover:bg-muted/20">
      <TableCell className="sticky left-0 z-10 w-40 min-w-[160px] bg-background font-medium">
        {attribute.name}
      </TableCell>
      {candidates.map((candidate) => {
        const attributeValue = candidate.values[attribute.id];
        return (
          <TableCell
            key={candidate.name}
            className="text-center align-middle break-words"
          >
            <ValueRenderer
              value={attributeValue?.value}
              valueType={attribute.valueType}
            />
          </TableCell>
        );
      })}
    </TableRow>
  );
}

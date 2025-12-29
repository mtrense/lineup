import { useEffect, useState, useCallback, useMemo } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { ComparisonView, SortState } from "@/components/ComparisonView";
import { ComparisonLoadingSkeleton } from "@/components/LoadingSkeleton";
import { getComparisonData } from "@/lib/data";
import {
  parseRangeFiltersFromParams,
  serializeRangeFiltersToParams,
  removeRangeFiltersFromParams,
  type RangeFilter,
} from "@/lib/range-url";
import type { AttributesFile, CandidateFile, CandidateEntry } from "@/types";

export function ComparisonPage() {
  const { comparisonId } = useParams<{ comparisonId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [comparisonData, setComparisonData] = useState<{
    attributes: AttributesFile;
    candidates: CandidateFile[];
    candidateEntries: CandidateEntry[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Parse selected candidates from URL
  const candidatesParam = searchParams.get("candidates");
  const selectedFromUrl = candidatesParam
    ? candidatesParam.split(",").filter(Boolean)
    : null;

  // Parse sort state from URL
  const sortParam = searchParams.get("sort");
  const sortDirParam = searchParams.get("sortDir");
  const sortFromUrl: SortState | null =
    sortParam && (sortDirParam === "asc" || sortDirParam === "desc")
      ? { attributeId: sortParam, direction: sortDirParam }
      : null;

  // Parse range filters from URL
  const rangeFiltersFromUrl = useMemo(
    () => parseRangeFiltersFromParams(searchParams),
    [searchParams]
  );

  const loadComparison = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getComparisonData(id);
      setComparisonData(data);
    } catch {
      setError(`Comparison "${id}" not found`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (comparisonId) {
      loadComparison(comparisonId);
    }
  }, [comparisonId, loadComparison]);

  const handleBack = () => {
    navigate("/");
  };

  const handleSelectionChange = useCallback(
    (selectedNames: string[]) => {
      if (!comparisonData) return;

      const allCandidateNames = comparisonData.candidates.map((c) => c.name);
      const allSelected =
        selectedNames.length === allCandidateNames.length &&
        allCandidateNames.every((name) => selectedNames.includes(name));

      if (allSelected || selectedNames.length === 0) {
        // Remove candidates param if all selected or none selected
        setSearchParams((prev) => {
          prev.delete("candidates");
          return prev;
        });
      } else {
        // Convert names to IDs for URL (lowercase, hyphenated)
        setSearchParams((prev) => {
          prev.set("candidates", selectedNames.join(","));
          return prev;
        });
      }
    },
    [comparisonData, setSearchParams]
  );

  const handleSortChange = useCallback(
    (sort: SortState | null) => {
      setSearchParams((prev) => {
        if (sort) {
          prev.set("sort", sort.attributeId);
          prev.set("sortDir", sort.direction);
        } else {
          prev.delete("sort");
          prev.delete("sortDir");
        }
        return prev;
      });
    },
    [setSearchParams]
  );

  const handleRangeFiltersChange = useCallback(
    (filters: RangeFilter[]) => {
      setSearchParams((prev) => {
        // Remove all existing range filter params
        removeRangeFiltersFromParams(prev);
        // Add new range filter params
        if (filters.length > 0) {
          serializeRangeFiltersToParams(filters, prev);
        }
        return prev;
      });
    },
    [setSearchParams]
  );

  if (loading) {
    return <ComparisonLoadingSkeleton />;
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4">
        <div className="text-center">
          <p className="mb-2 text-6xl">404</p>
          <p className="text-lg text-destructive">{error}</p>
          <p className="mt-2 text-sm text-muted-foreground">
            The comparison you're looking for doesn't exist or may have been removed.
          </p>
        </div>
        <button
          onClick={handleBack}
          className="rounded-md bg-primary px-4 py-2 text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          Go back to home
        </button>
      </div>
    );
  }

  if (!comparisonData) {
    return null;
  }

  return (
    <ComparisonView
      attributes={comparisonData.attributes}
      candidates={comparisonData.candidates}
      candidateEntries={comparisonData.candidateEntries}
      initialSelection={selectedFromUrl}
      initialSort={sortFromUrl}
      initialRangeFilters={rangeFiltersFromUrl.length > 0 ? rangeFiltersFromUrl : null}
      onBack={handleBack}
      onSelectionChange={handleSelectionChange}
      onSortChange={handleSortChange}
      onRangeFiltersChange={handleRangeFiltersChange}
    />
  );
}

import { useEffect, useState, useCallback, useMemo, useRef } from "react";
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

/**
 * The slice of comparison state that is mirrored into the URL. ComparisonView
 * reports each piece independently, but they are written to the URL together
 * (see the sync effect below) so the writes cannot clobber one another.
 */
interface ViewState {
  /** null until ComparisonView has reported its initial selection. */
  selection: string[] | null;
  sort: SortState | null;
  ranges: RangeFilter[];
}

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

  // ComparisonView reports selection, sort and range filters through three
  // separate callbacks that all fire on mount. They are collected here and
  // written to the URL by a single effect below.
  const [viewState, setViewState] = useState<ViewState>(() => ({
    selection: null,
    sort: sortFromUrl,
    ranges: rangeFiltersFromUrl,
  }));

  const handleSelectionChange = useCallback((selectedNames: string[]) => {
    setViewState((prev) => ({ ...prev, selection: selectedNames }));
  }, []);

  const handleSortChange = useCallback((sort: SortState | null) => {
    setViewState((prev) => ({ ...prev, sort }));
  }, []);

  const handleRangeFiltersChange = useCallback((filters: RangeFilter[]) => {
    setViewState((prev) => ({ ...prev, ranges: filters }));
  }, []);

  // Mirror the view state into the URL as a single write.
  //
  // Two properties matter here, both of them about the back button:
  //
  //  - `replace: true` — selection, sort and filters are view state, not
  //    navigation. Pushing would make every filter tweak a history entry, so
  //    leaving the comparison would take as many Back presses as the user made
  //    adjustments.
  //  - the no-op guard — ComparisonView's three mount-time notifications would
  //    otherwise each write the (unchanged) URL, stacking up identical entries
  //    the moment the page opens.
  const setSearchParamsRef = useRef(setSearchParams);
  setSearchParamsRef.current = setSearchParams;

  useEffect(() => {
    if (!comparisonData) return;

    const next = new URLSearchParams(searchParams);

    if (viewState.selection) {
      const allCandidateNames = comparisonData.candidates.map((c) => c.name);
      const allSelected =
        viewState.selection.length === allCandidateNames.length &&
        allCandidateNames.every((name) => viewState.selection!.includes(name));

      if (allSelected || viewState.selection.length === 0) {
        // Omit the param when the selection carries no information
        next.delete("candidates");
      } else {
        next.set("candidates", viewState.selection.join(","));
      }
    }

    if (viewState.sort) {
      next.set("sort", viewState.sort.attributeId);
      next.set("sortDir", viewState.sort.direction);
    } else {
      next.delete("sort");
      next.delete("sortDir");
    }

    removeRangeFiltersFromParams(next);
    if (viewState.ranges.length > 0) {
      serializeRangeFiltersToParams(viewState.ranges, next);
    }

    if (next.toString() !== searchParams.toString()) {
      setSearchParamsRef.current(next, { replace: true });
    }
  }, [viewState, comparisonData, searchParams]);

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

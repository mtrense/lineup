import { useEffect, useState, useCallback } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { ComparisonView } from "@/components/ComparisonView";
import { getComparisonData } from "@/lib/data";
import type { AttributesFile, CandidateFile } from "@/types";

export function ComparisonPage() {
  const { comparisonId } = useParams<{ comparisonId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [comparisonData, setComparisonData] = useState<{
    attributes: AttributesFile;
    candidates: CandidateFile[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Parse selected candidates from URL
  const candidatesParam = searchParams.get("candidates");
  const selectedFromUrl = candidatesParam
    ? candidatesParam.split(",").filter(Boolean)
    : null;

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

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Loading comparison data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <p className="text-destructive">{error}</p>
        <button onClick={handleBack} className="text-primary hover:underline">
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
      initialSelection={selectedFromUrl}
      onBack={handleBack}
      onSelectionChange={handleSelectionChange}
    />
  );
}

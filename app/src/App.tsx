import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getComparisons, getComparisonData } from "@/lib/data";
import { ComparisonView } from "@/components/ComparisonView";
import type { ComparisonType, AttributesFile, CandidateFile } from "@/types";

function App() {
  const [comparisons] = useState<ComparisonType[]>(getComparisons());
  const [selectedComparison, setSelectedComparison] = useState<string | null>(
    null
  );
  const [comparisonData, setComparisonData] = useState<{
    attributes: AttributesFile;
    candidates: CandidateFile[];
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const loadComparison = useCallback(async (comparisonId: string) => {
    setLoading(true);
    try {
      const data = await getComparisonData(comparisonId);
      setComparisonData(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (selectedComparison) {
      loadComparison(selectedComparison);
    }
  }, [selectedComparison, loadComparison]);

  // Landing page - comparison selection
  if (!selectedComparison) {
    return (
      <div className="min-h-screen bg-background">
        <main className="container mx-auto px-4 py-16">
          <div className="mb-12 text-center">
            <h1 className="mb-2 text-4xl font-bold">Lineup</h1>
            <p className="text-muted-foreground">
              Compare items side-by-side across shared attributes
            </p>
          </div>

          {comparisons.length === 0 ? (
            <p className="text-center text-muted-foreground">
              No comparisons available.
            </p>
          ) : (
            <div className="mx-auto grid max-w-4xl gap-4 md:grid-cols-2 lg:grid-cols-3">
              {comparisons.map((comparison) => (
                <Card
                  key={comparison.id}
                  className="cursor-pointer transition-colors hover:bg-accent"
                  onClick={() => setSelectedComparison(comparison.id)}
                >
                  <CardHeader>
                    <CardTitle>{comparison.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {comparison.description || "No description"}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </main>
      </div>
    );
  }

  // Comparison view
  return (
    <div className="min-h-screen bg-background">
      {loading ? (
        <div className="flex min-h-screen items-center justify-center">
          <p className="text-muted-foreground">Loading comparison data...</p>
        </div>
      ) : comparisonData ? (
        <ComparisonView
          attributes={comparisonData.attributes}
          candidates={comparisonData.candidates}
          onBack={() => {
            setSelectedComparison(null);
            setComparisonData(null);
          }}
        />
      ) : null}
    </div>
  );
}

export default App;

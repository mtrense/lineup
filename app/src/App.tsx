import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getComparisons, getComparisonData } from "@/lib/data";
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

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container mx-auto flex h-16 items-center px-4">
          <h1 className="text-xl font-semibold">Lineup</h1>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        {!selectedComparison ? (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Available Comparisons</h2>
            {comparisons.length === 0 ? (
              <p className="text-muted-foreground">No comparisons available.</p>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {comparisons.map((comparison) => (
                  <Card
                    key={comparison.id}
                    className="cursor-pointer transition-shadow hover:shadow-md"
                    onClick={() => setSelectedComparison(comparison.id)}
                  >
                    <CardHeader>
                      <CardTitle>{comparison.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">
                        {comparison.description || "No description"}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedComparison(null);
                  setComparisonData(null);
                }}
              >
                Back
              </Button>
              <h2 className="text-2xl font-bold">
                {comparisonData?.attributes.name || "Loading..."}
              </h2>
            </div>

            {loading ? (
              <p className="text-muted-foreground">Loading comparison data...</p>
            ) : comparisonData ? (
              <div className="space-y-6">
                <p className="text-muted-foreground">
                  {comparisonData.attributes.description}
                </p>

                <div className="grid gap-4 md:grid-cols-2">
                  {comparisonData.candidates.map((candidate) => (
                    <Card key={candidate.name}>
                      <CardHeader>
                        <CardTitle>{candidate.name}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                          {candidate.description}
                        </p>
                        <div className="text-sm">
                          {Object.entries(candidate.values).map(
                            ([key, attr]) => (
                              <div key={key} className="flex justify-between">
                                <span className="font-medium">{key}:</span>
                                <span>
                                  {attr.value === null
                                    ? "N/A"
                                    : String(attr.value)}
                                </span>
                              </div>
                            )
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;

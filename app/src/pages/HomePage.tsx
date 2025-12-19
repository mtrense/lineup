import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getComparisons } from "@/lib/data";
import type { ComparisonType } from "@/types";

export function HomePage() {
  const [comparisons] = useState<ComparisonType[]>(getComparisons());

  return (
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
            <Link key={comparison.id} to={`/${comparison.id}`}>
              <Card className="cursor-pointer transition-colors hover:bg-accent h-full">
                <CardHeader>
                  <CardTitle>{comparison.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {comparison.description || "No description"}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}

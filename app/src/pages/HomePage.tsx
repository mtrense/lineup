import { getGroupedComparisons } from "@/lib/data";
import { getTileUrl } from "@/lib/tiles";
import { ComparisonTile } from "@/components/ComparisonTile";

export function HomePage() {
  const groups = getGroupedComparisons();

  return (
    <main className="container mx-auto px-4 py-16">
      {/* Hero */}
      <div className="mb-12 text-center">
        <h1 className="mb-2 text-4xl font-bold">Lineup</h1>
        <p className="text-muted-foreground">
          Compare items side-by-side across shared attributes
        </p>
      </div>

      {/* Grouped grid */}
      {groups.length === 0 ? (
        <p className="text-center text-muted-foreground">
          No comparisons available.
        </p>
      ) : (
        <div className="space-y-12">
          {groups.map(({ group, comparisons }) => (
            <section key={group.id} aria-labelledby={`group-${group.id}`}>
              <h2
                id={`group-${group.id}`}
                className="mb-4 text-xl font-semibold"
              >
                {group.name}
              </h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {comparisons.map((comparison) => (
                  <ComparisonTile
                    key={comparison.id}
                    comparison={comparison}
                    tileUrl={getTileUrl(comparison.id)}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </main>
  );
}

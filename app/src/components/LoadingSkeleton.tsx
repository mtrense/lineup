import { Skeleton } from "@/components/ui/skeleton";

export function ComparisonLoadingSkeleton() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header skeleton */}
      <header className="border-b border-border bg-background/95">
        <div className="container mx-auto px-4 py-6">
          <div className="mb-1 flex items-center gap-2">
            <Skeleton className="h-8 w-16" />
          </div>
          <div className="flex justify-center">
            <Skeleton className="h-8 w-48" />
          </div>
          <div className="mt-2 flex justify-center">
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
      </header>

      {/* Candidate selector skeleton */}
      <div className="border-b border-border bg-card/50 px-4 py-4">
        <div className="container mx-auto">
          <div className="mb-3 flex items-center justify-between">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-8 w-24" />
          </div>
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-24 rounded-full" />
            ))}
          </div>
        </div>
      </div>

      {/* Table skeleton */}
      <main className="flex-1 overflow-x-auto">
        <div className="container mx-auto px-4 py-6">
          <div className="overflow-x-auto rounded-lg border border-border">
            <div className="p-4">
              {/* Header row */}
              <div className="mb-4 flex gap-4">
                <Skeleton className="h-6 w-40" />
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-6 w-32" />
                ))}
              </div>
              {/* Data rows */}
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="mb-3 flex gap-4">
                  <Skeleton className="h-5 w-40" />
                  {Array.from({ length: 3 }).map((_, j) => (
                    <Skeleton key={j} className="h-5 w-32" />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

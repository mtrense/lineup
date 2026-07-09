/**
 * The reusable render surface shared by the SSR render (render.tsx) and the
 * client hydration entry (entry-client.tsx). Reuses `ComparisonView`
 * unchanged (per ADR 0001) — no router, no `ComparisonPage`. All
 * filter/sort/selection state lives in `ComparisonView`'s own `useState`;
 * nothing is persisted or read back out.
 */
import { ComparisonView } from "@/components/ComparisonView";
import type { AttributesFile, CandidateFile, CandidateEntry } from "@/types";

/** The data shape produced by the fs-based loader (see scripts/lib/load-comparison.ts). */
export interface ExportData {
  attributes: AttributesFile;
  candidates: CandidateFile[];
  candidateEntries: CandidateEntry[];
}

export interface ExportRootProps {
  data: ExportData;
}

function noop() {
  // Intentionally empty: the export has no "back" destination and does not
  // persist selection/sort/filter state anywhere.
}

export function ExportRoot({ data }: ExportRootProps) {
  // `initialSelection` is intentionally omitted: ComparisonView already
  // derives the default selection from `candidateEntries.shownByDefault`
  // (falling back to "all" when none are marked), so we let it do that
  // exact computation rather than duplicating the logic here.
  return (
    <ComparisonView
      attributes={data.attributes}
      candidates={data.candidates}
      candidateEntries={data.candidateEntries}
      onBack={noop}
    />
  );
}

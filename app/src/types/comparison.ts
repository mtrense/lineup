// Comparison type definitions

export interface ComparisonType {
  id: string;
  name: string;
  description?: string;
  icon?: string;
}

export interface ComparisonsIndex {
  comparisons: ComparisonType[];
}

export interface CandidateEntry {
  id: string;
  shownByDefault: boolean;
}

export interface CandidateIndex {
  candidates: CandidateEntry[];
}

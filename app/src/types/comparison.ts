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

export interface CandidateIndex {
  candidates: string[];
}

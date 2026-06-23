// Comparison type definitions

export interface ComparisonGroup {
  id: string;
  name: string;
  description?: string;
  order: number;
}

export interface ComparisonType {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  groupId?: string;
  hidden?: boolean;
}

export interface ComparisonsIndex {
  groups: ComparisonGroup[];
  comparisons: ComparisonType[];
}

export interface CandidateEntry {
  id: string;
  shownByDefault: boolean;
}

export interface CandidateIndex {
  candidates: CandidateEntry[];
}

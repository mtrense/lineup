// Candidate data types

export interface AttributeValue {
  value: number | string | string[] | boolean | null;
  source?: string[];
  comment?: string;
}

export interface CandidateFile {
  name: string;
  description?: string;
  icon?: string;
  url?: string;
  lastVerified?: string; // ISO 8601 date (YYYY-MM-DD); written by gather-data, rendered as the "Last Verified" row
  values: {
    [attributeId: string]: AttributeValue;
  };
}

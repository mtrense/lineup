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
  values: {
    [attributeId: string]: AttributeValue;
  };
}

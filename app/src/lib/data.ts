import type {
  ComparisonsIndex,
  ComparisonType,
  AttributesFile,
  CandidateFile,
  CandidateIndex,
} from "@/types";

// Import the root index at build time
import comparisonsIndex from "@data/index.json";

/**
 * Get the list of available comparison types
 */
export function getComparisons(): ComparisonType[] {
  return (comparisonsIndex as ComparisonsIndex).comparisons;
}

/**
 * Dynamically import attributes for a comparison type
 */
export async function getAttributes(
  comparisonId: string
): Promise<AttributesFile> {
  const module = await import(`../../../data/${comparisonId}/attributes.json`);
  return module.default as AttributesFile;
}

/**
 * Dynamically import the candidate index for a comparison type
 */
export async function getCandidateIndex(
  comparisonId: string
): Promise<CandidateIndex> {
  const module = await import(`../../../data/${comparisonId}/index.json`);
  return module.default as CandidateIndex;
}

/**
 * Dynamically import a specific candidate's data
 */
export async function getCandidate(
  comparisonId: string,
  candidateId: string
): Promise<CandidateFile> {
  const module = await import(
    `../../../data/${comparisonId}/${candidateId}.json`
  );
  return module.default as CandidateFile;
}

/**
 * Load all candidates for a comparison type
 */
export async function getAllCandidates(
  comparisonId: string
): Promise<CandidateFile[]> {
  const index = await getCandidateIndex(comparisonId);
  const candidates = await Promise.all(
    index.candidates.map((id) => getCandidate(comparisonId, id))
  );
  return candidates;
}

/**
 * Load full comparison data (attributes + all candidates)
 */
export async function getComparisonData(comparisonId: string): Promise<{
  attributes: AttributesFile;
  candidates: CandidateFile[];
}> {
  const [attributes, candidates] = await Promise.all([
    getAttributes(comparisonId),
    getAllCandidates(comparisonId),
  ]);
  return { attributes, candidates };
}

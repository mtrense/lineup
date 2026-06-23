import type {
  ComparisonsIndex,
  ComparisonType,
  ComparisonGroup,
  AttributesFile,
  CandidateFile,
  CandidateIndex,
  CandidateEntry,
} from "@/types";

// Import the root index at build time
import comparisonsIndex from "@data/index.json";

const index = comparisonsIndex as ComparisonsIndex;

/**
 * Get the list of available comparison types (all entries, including hidden).
 * Backward-compatible — callers that relied on this remain unaffected.
 */
export function getComparisons(): ComparisonType[] {
  return index.comparisons;
}

/**
 * Get the defined comparison groups, sorted by their `order` field ascending.
 */
export function getComparisonGroups(): ComparisonGroup[] {
  return [...index.groups].sort((a, b) => a.order - b.order);
}

/** Sentinel id for the trailing "Other" bucket used when a comparison has no
 *  known groupId. */
const OTHER_GROUP_ID = "__other__";

/**
 * Returns comparisons bucketed into ordered group entries, suitable for the
 * landing-page grouped grid.
 *
 * Rules:
 *  - Hidden comparisons are excluded entirely.
 *  - Each comparison is placed in the bucket whose group.id matches its groupId.
 *  - Comparisons with a missing or unknown groupId are placed in a trailing
 *    "Other" bucket (group.id === "__other__").
 *  - Buckets are ordered by the group's `order` field; "Other" is always last.
 *  - Within-group order follows the original `comparisons` array order.
 *  - Empty buckets (groups with no assigned comparisons) are omitted.
 */
export function getGroupedComparisons(): {
  group: ComparisonGroup;
  comparisons: ComparisonType[];
}[] {
  const groups = getComparisonGroups();
  const groupMap = new Map<string, ComparisonGroup>(
    groups.map((g) => [g.id, g])
  );

  // Build ordered map: groupId → comparisons[]
  const buckets = new Map<string, ComparisonType[]>();

  for (const comp of index.comparisons) {
    if (comp.hidden) continue;

    const targetGroupId =
      comp.groupId && groupMap.has(comp.groupId)
        ? comp.groupId
        : OTHER_GROUP_ID;

    if (!buckets.has(targetGroupId)) {
      buckets.set(targetGroupId, []);
    }
    buckets.get(targetGroupId)!.push(comp);
  }

  // Build result: named groups first (in order), then "Other" if non-empty
  const result: { group: ComparisonGroup; comparisons: ComparisonType[] }[] =
    [];

  for (const group of groups) {
    const comps = buckets.get(group.id);
    if (comps && comps.length > 0) {
      result.push({ group, comparisons: comps });
    }
  }

  const otherComps = buckets.get(OTHER_GROUP_ID);
  if (otherComps && otherComps.length > 0) {
    result.push({
      group: {
        id: OTHER_GROUP_ID,
        name: "Other",
        order: Number.MAX_SAFE_INTEGER,
      },
      comparisons: otherComps,
    });
  }

  return result;
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
    index.candidates.map((entry) => getCandidate(comparisonId, entry.id))
  );
  return candidates;
}

/**
 * Load full comparison data (attributes + all candidates)
 */
export async function getComparisonData(comparisonId: string): Promise<{
  attributes: AttributesFile;
  candidates: CandidateFile[];
  candidateEntries: CandidateEntry[];
}> {
  const [attributes, index] = await Promise.all([
    getAttributes(comparisonId),
    getCandidateIndex(comparisonId),
  ]);
  const candidates = await Promise.all(
    index.candidates.map((entry) => getCandidate(comparisonId, entry.id))
  );
  return { attributes, candidates, candidateEntries: index.candidates };
}

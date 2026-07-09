/**
 * Node/fs-based loader for comparison data, used by the self-contained HTML
 * export CLI (see PLAN.md, milestone 0019).
 *
 * Unlike `app/src/lib/data.ts` (which uses browser-only dynamic `import()`),
 * this module reads `data/<id>/*.json` directly via `node:fs`, synchronously,
 * so it can run from a plain Node CLI script without Vite/browser machinery.
 *
 * It returns the exact shape `ComparisonView` expects — mirroring
 * `getComparisonData()` in `data.ts`.
 */
import { existsSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

import type {
  AttributesFile,
  CandidateFile,
  CandidateEntry,
  ComparisonsIndex,
} from "../../src/types";

// app/scripts/lib/ -> repo root is three levels up.
const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "..");
const DATA_ROOT = join(REPO_ROOT, "data");

export class ComparisonNotFoundError extends Error {
  constructor(comparisonId: string) {
    super(`Unknown comparison type "${comparisonId}"`);
    this.name = "ComparisonNotFoundError";
  }
}

function readJson<T>(path: string, comparisonId: string): T {
  if (!existsSync(path)) {
    throw new ComparisonNotFoundError(comparisonId);
  }
  try {
    return JSON.parse(readFileSync(path, "utf-8")) as T;
  } catch {
    throw new ComparisonNotFoundError(comparisonId);
  }
}

/**
 * Checks whether `comparisonId` is a known comparison type: it must be
 * listed in `data/index.json`'s `comparisons[]` and have a corresponding
 * directory under `data/`.
 */
export function comparisonExists(comparisonId: string): boolean {
  const rootIndexPath = join(DATA_ROOT, "index.json");
  if (!existsSync(rootIndexPath)) {
    return false;
  }
  let rootIndex: ComparisonsIndex;
  try {
    rootIndex = JSON.parse(readFileSync(rootIndexPath, "utf-8")) as ComparisonsIndex;
  } catch {
    return false;
  }
  const knownInIndex = rootIndex.comparisons.some((c) => c.id === comparisonId);
  const dirExists = existsSync(join(DATA_ROOT, comparisonId));
  return knownInIndex && dirExists;
}

/**
 * Loads a comparison type's full data set from the `data/` directory via
 * `fs`, synchronously. Throws `ComparisonNotFoundError` if the comparison id
 * is unknown or any of its backing files are missing/malformed.
 */
export function loadComparison(comparisonId: string): {
  attributes: AttributesFile;
  candidates: CandidateFile[];
  candidateEntries: CandidateEntry[];
} {
  if (!comparisonExists(comparisonId)) {
    throw new ComparisonNotFoundError(comparisonId);
  }

  const comparisonDir = join(DATA_ROOT, comparisonId);

  const attributes = readJson<AttributesFile>(
    join(comparisonDir, "attributes.json"),
    comparisonId
  );
  const candidateIndex = readJson<{ candidates: CandidateEntry[] }>(
    join(comparisonDir, "index.json"),
    comparisonId
  );
  const candidateEntries = candidateIndex.candidates;

  const candidates = candidateEntries.map((entry) =>
    readJson<CandidateFile>(
      join(comparisonDir, `${entry.id}.json`),
      comparisonId
    )
  );

  return { attributes, candidates, candidateEntries };
}

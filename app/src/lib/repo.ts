/**
 * Canonical location of this project's source repository.
 *
 * Kept in one place so the landing page, the comparison headers and the
 * explanatory sections cannot drift apart.
 */
export const REPO_URL = "https://github.com/mtrense/lineup";

/**
 * URL of a comparison type's data directory on GitHub — the folder holding its
 * RESEARCH.md, attributes.json and candidate files.
 */
export function repoDataDirUrl(comparisonId: string): string {
  return `${REPO_URL}/tree/main/data/${comparisonId}`;
}

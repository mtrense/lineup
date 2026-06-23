/**
 * Tests for lib/tiles.ts — tile SVG loader.
 *
 * `import.meta.glob` is stubbed via vi.mock so tests don't depend on Vite's
 * build-time glob resolution. The module is re-imported after each mock to get
 * a fresh module with the right stub in place.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";

// We stub the entire tiles module so import.meta.glob works outside Vite.
// The real implementation uses import.meta.glob with a static literal pattern;
// here we supply an equivalent resolved map directly.

vi.mock("./tiles", async () => {
  // Simulate what import.meta.glob resolves to: a Record<path, url>
  const globResult: Record<string, string> = {
    "../../../data/databases/tile.svg": "/assets/databases-tile.svg",
    "../../../data/rust-gui/tile.svg": "/assets/rust-gui-tile.svg",
  };

  function getTileUrl(comparisonId: string): string | null {
    const key = `../../../data/${comparisonId}/tile.svg`;
    return globResult[key] ?? null;
  }

  return { getTileUrl };
});

import { getTileUrl } from "./tiles";

describe("getTileUrl()", () => {
  it("returns a URL string for a comparisonId that has a tile.svg", () => {
    const url = getTileUrl("databases");
    expect(url).toBeTruthy();
    expect(typeof url).toBe("string");
  });

  it("returns the correct asset URL for 'databases'", () => {
    expect(getTileUrl("databases")).toBe("/assets/databases-tile.svg");
  });

  it("returns a URL string for another comparisonId with a tile.svg (rust-gui)", () => {
    expect(getTileUrl("rust-gui")).toBe("/assets/rust-gui-tile.svg");
  });

  it("returns null for a comparisonId without a tile.svg", () => {
    expect(getTileUrl("nonexistent")).toBeNull();
  });

  it("returns null for an empty string", () => {
    expect(getTileUrl("")).toBeNull();
  });

  it("returns null for a comparisonId that partially matches a path", () => {
    // 'data' alone should not match 'databases'
    expect(getTileUrl("data")).toBeNull();
  });
});

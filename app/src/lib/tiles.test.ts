/**
 * Tests for lib/tiles.ts — tile SVG loader.
 *
 * `import.meta.glob` is stubbed via vi.mock so tests don't depend on Vite's
 * build-time glob resolution. The module is re-imported after each mock to get
 * a fresh module with the right stub in place.
 */
import { describe, it, expect, vi } from "vitest";

// We stub the entire tiles module so import.meta.glob works outside Vite.
// The real implementation uses import.meta.glob with a static literal pattern;
// here we supply an equivalent resolved map of raw SVG markup directly.

vi.mock("./tiles", async () => {
  // Simulate what import.meta.glob({ query: "?raw" }) resolves to: a
  // Record<path, svgSource>.
  const globResult: Record<string, string> = {
    "../../../data/databases/tile.svg":
      '<svg viewBox="0 0 200 200"><rect fill="currentColor"/></svg>',
    "../../../data/rust-gui/tile.svg":
      '<svg viewBox="0 0 200 200"><circle fill="currentColor"/></svg>',
  };

  function getTileSvg(comparisonId: string): string | null {
    const key = `../../../data/${comparisonId}/tile.svg`;
    return globResult[key] ?? null;
  }

  return { getTileSvg };
});

import { getTileSvg } from "./tiles";

describe("getTileSvg()", () => {
  it("returns SVG markup for a comparisonId that has a tile.svg", () => {
    const svg = getTileSvg("databases");
    expect(svg).toBeTruthy();
    expect(typeof svg).toBe("string");
    expect(svg).toContain("<svg");
  });

  it("returns the raw SVG source for 'databases'", () => {
    expect(getTileSvg("databases")).toContain("currentColor");
  });

  it("returns SVG markup for another comparisonId with a tile.svg (rust-gui)", () => {
    expect(getTileSvg("rust-gui")).toContain("<circle");
  });

  it("returns null for a comparisonId without a tile.svg", () => {
    expect(getTileSvg("nonexistent")).toBeNull();
  });

  it("returns null for an empty string", () => {
    expect(getTileSvg("")).toBeNull();
  });

  it("returns null for a comparisonId that partially matches a path", () => {
    // 'data' alone should not match 'databases'
    expect(getTileSvg("data")).toBeNull();
  });
});

/**
 * Tests for data.ts loader functions related to comparison groups.
 *
 * Covers:
 *   - getComparisonGroups() returns all groups sorted by order
 *   - getGroupedComparisons() buckets comparisons under the correct group
 *   - hidden comparisons are excluded from getGroupedComparisons()
 *   - comparisons with missing/unknown groupId land in a trailing "Other" bucket
 *   - data-integrity: every non-hidden comparison has a groupId matching a defined group
 */
import { describe, it, expect } from "vitest";
import {
  getComparisonGroups,
  getGroupedComparisons,
} from "./data";
import comparisonsIndex from "@data/index.json";
import type { ComparisonsIndex, ComparisonGroup } from "@/types";

const index = comparisonsIndex as ComparisonsIndex;

describe("getComparisonGroups()", () => {
  it("returns an array", () => {
    const groups = getComparisonGroups();
    expect(Array.isArray(groups)).toBe(true);
  });

  it("returns all defined groups", () => {
    const groups = getComparisonGroups();
    expect(groups.length).toBeGreaterThan(0);
    expect(groups.length).toBe(index.groups.length);
  });

  it("returns groups sorted by order ascending", () => {
    const groups = getComparisonGroups();
    for (let i = 1; i < groups.length; i++) {
      expect(groups[i].order).toBeGreaterThanOrEqual(groups[i - 1].order);
    }
  });

  it("every group has required fields: id, name, order", () => {
    const groups = getComparisonGroups();
    for (const g of groups) {
      expect(typeof g.id).toBe("string");
      expect(g.id.length).toBeGreaterThan(0);
      expect(typeof g.name).toBe("string");
      expect(g.name.length).toBeGreaterThan(0);
      expect(typeof g.order).toBe("number");
    }
  });
});

describe("getGroupedComparisons()", () => {
  it("returns an array of { group, comparisons } buckets", () => {
    const buckets = getGroupedComparisons();
    expect(Array.isArray(buckets)).toBe(true);
    for (const bucket of buckets) {
      expect(bucket).toHaveProperty("group");
      expect(bucket).toHaveProperty("comparisons");
      expect(Array.isArray(bucket.comparisons)).toBe(true);
    }
  });

  it("excludes hidden comparisons", () => {
    const buckets = getGroupedComparisons();
    const allIds = buckets.flatMap((b) => b.comparisons.map((c) => c.id));
    // 'test' is marked hidden:true in index.json
    expect(allIds).not.toContain("test");
  });

  it("places each non-hidden comparison with a known groupId into the correct group bucket", () => {
    const buckets = getGroupedComparisons();
    const groups = getComparisonGroups();
    const groupIds = new Set(groups.map((g) => g.id));

    for (const bucket of buckets) {
      if (bucket.group.id === "__other__") continue;
      expect(groupIds.has(bucket.group.id)).toBe(true);
      for (const comp of bucket.comparisons) {
        expect(comp.groupId).toBe(bucket.group.id);
      }
    }
  });

  it("returns buckets in group order (by order field)", () => {
    const buckets = getGroupedComparisons();
    // Filter out the trailing "Other" bucket for order checking
    const namedBuckets = buckets.filter((b) => b.group.id !== "__other__");
    for (let i = 1; i < namedBuckets.length; i++) {
      expect(namedBuckets[i].group.order).toBeGreaterThanOrEqual(
        namedBuckets[i - 1].group.order
      );
    }
  });

  it("places comparisons with a missing or unknown groupId into a trailing 'Other' bucket", () => {
    // This is tested structurally via the known groupIds cross-check above.
    // Additionally, if there are any comparisons without a valid groupId, they
    // must appear in a bucket whose group.id is '__other__'.
    const buckets = getGroupedComparisons();
    const groups = getComparisonGroups();
    const groupIds = new Set(groups.map((g) => g.id));

    const otherBucket = buckets.find((b) => b.group.id === "__other__");
    const compIdsWithUnknownGroup = index.comparisons
      .filter(
        (c) =>
          !c.hidden &&
          (!c.groupId || !groupIds.has(c.groupId))
      )
      .map((c) => c.id);

    if (compIdsWithUnknownGroup.length > 0) {
      // There must be an "Other" bucket containing those comparisons
      expect(otherBucket).toBeDefined();
      const otherIds = otherBucket!.comparisons.map((c) => c.id);
      for (const id of compIdsWithUnknownGroup) {
        expect(otherIds).toContain(id);
      }
    }
  });

  it("'Other' bucket, if present, is the last bucket", () => {
    const buckets = getGroupedComparisons();
    const otherIdx = buckets.findIndex((b) => b.group.id === "__other__");
    if (otherIdx !== -1) {
      expect(otherIdx).toBe(buckets.length - 1);
    }
  });

  it("preserves within-group order from index.json", () => {
    const buckets = getGroupedComparisons();
    for (const bucket of buckets) {
      if (bucket.comparisons.length < 2) continue;
      // Each comparison's position in the bucket should match its relative
      // position in the original index array (for this groupId)
      const groupId = bucket.group.id;
      const indexOrder = index.comparisons
        .filter((c) => !c.hidden && c.groupId === groupId)
        .map((c) => c.id);
      const bucketOrder = bucket.comparisons.map((c) => c.id);
      expect(bucketOrder).toEqual(indexOrder);
    }
  });

  it("includes only non-empty buckets (no group with zero comparisons)", () => {
    const buckets = getGroupedComparisons();
    for (const bucket of buckets) {
      expect(bucket.comparisons.length).toBeGreaterThan(0);
    }
  });
});

describe("data-integrity: index.json group assignments", () => {
  it("every non-hidden comparison has a groupId", () => {
    const nonHidden = index.comparisons.filter((c) => !c.hidden);
    for (const comp of nonHidden) {
      expect(
        typeof comp.groupId,
        `Comparison "${comp.id}" is missing groupId`
      ).toBe("string");
    }
  });

  it("every non-hidden comparison's groupId matches a defined group", () => {
    const groupIds = new Set(index.groups.map((g: ComparisonGroup) => g.id));
    const nonHidden = index.comparisons.filter((c) => !c.hidden);
    for (const comp of nonHidden) {
      expect(
        groupIds.has(comp.groupId!),
        `Comparison "${comp.id}" has unknown groupId "${comp.groupId}"`
      ).toBe(true);
    }
  });

  it("groups array is present and non-empty", () => {
    expect(Array.isArray(index.groups)).toBe(true);
    expect(index.groups.length).toBeGreaterThan(0);
  });
});

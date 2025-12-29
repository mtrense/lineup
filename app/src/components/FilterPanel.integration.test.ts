import { describe, it, expect } from "vitest";
import {
  candidatePassesFilters,
  getActiveFilterCount,
  emptyFilterState,
  type FilterState,
  type RangeFilter,
  type TagFilter,
  type BooleanFilter,
} from "./FilterPanel";
import type { CandidateFile } from "@/types";

/**
 * Integration tests for combined filter scenarios (Increment 10).
 * These tests verify filtering works correctly with:
 * - Multiple range filters active
 * - Range + tag + boolean filters combined
 * - Edge cases in filter logic
 */

describe("FilterPanel Integration - Combined Filters", () => {
  // Test candidates with various attributes
  const createTestCandidates = (): CandidateFile[] => [
    {
      name: "PostgreSQL",
      values: {
        "github-stars": { value: 19400 },
        "db-engines-rank": { value: 4 },
        "learning-curve": { value: 3 },
        "first-release": { value: "1996-01-01" },
        "actively-maintained": { value: true },
        "acid-compliant": { value: true },
        "database-type": { value: ["relational"] },
        license: { value: ["postgresql"] },
      },
    },
    {
      name: "MySQL",
      values: {
        "github-stars": { value: 11200 },
        "db-engines-rank": { value: 2 },
        "learning-curve": { value: 4 },
        "first-release": { value: "1995-05-23" },
        "actively-maintained": { value: true },
        "acid-compliant": { value: true },
        "database-type": { value: ["relational"] },
        license: { value: ["gpl"] },
      },
    },
    {
      name: "SQLite",
      values: {
        "github-stars": { value: 7200 },
        "db-engines-rank": { value: 9 },
        "learning-curve": { value: 5 },
        "first-release": { value: "2000-08-17" },
        "actively-maintained": { value: true },
        "acid-compliant": { value: true },
        "database-type": { value: ["relational", "embedded"] },
        license: { value: ["public-domain"] },
      },
    },
    {
      name: "MongoDB",
      values: {
        "github-stars": { value: 28000 },
        "db-engines-rank": { value: 5 },
        "learning-curve": { value: 3 },
        "first-release": { value: "2009-02-11" },
        "actively-maintained": { value: true },
        "acid-compliant": { value: false },
        "database-type": { value: ["document"] },
        license: { value: ["sspl"] },
      },
    },
    {
      name: "Redis",
      values: {
        "github-stars": { value: 68000 },
        "db-engines-rank": { value: 6 },
        "learning-curve": { value: 4 },
        "first-release": { value: "2009-03-22" },
        "actively-maintained": { value: true },
        "acid-compliant": { value: false },
        "database-type": { value: ["key-value"] },
        license: { value: ["rsal"] },
      },
    },
    {
      name: "LegacyDB",
      values: {
        "github-stars": { value: null },
        "db-engines-rank": { value: null },
        "learning-curve": { value: null },
        "first-release": { value: null },
        "actively-maintained": { value: false },
        "acid-compliant": { value: null },
        "database-type": { value: ["relational"] },
        license: { value: ["proprietary"] },
      },
    },
  ];

  describe("Multiple Range Filters Active", () => {
    it("should filter candidates passing all range filters (AND logic)", () => {
      const candidates = createTestCandidates();
      const filterState: FilterState = {
        tags: [],
        booleans: [],
        ranges: [
          // GitHub stars between 10000 and 30000
          {
            attributeId: "github-stars",
            min: 10000,
            max: 30000,
            includeNull: false,
          },
          // DB-Engines rank between 1 and 5
          {
            attributeId: "db-engines-rank",
            min: 1,
            max: 5,
            includeNull: false,
          },
        ],
      };

      const passing = candidates.filter((c) =>
        candidatePassesFilters(c, filterState)
      );

      // PostgreSQL: stars=19400 (pass), rank=4 (pass) -> PASS
      // MySQL: stars=11200 (pass), rank=2 (pass) -> PASS
      // SQLite: stars=7200 (fail), rank=9 (fail) -> FAIL
      // MongoDB: stars=28000 (pass), rank=5 (pass) -> PASS
      // Redis: stars=68000 (fail), rank=6 (fail) -> FAIL
      // LegacyDB: stars=null (fail), rank=null (fail) -> FAIL

      expect(passing.map((c) => c.name)).toEqual([
        "PostgreSQL",
        "MySQL",
        "MongoDB",
      ]);
    });

    it("should include null values when includeNull is true", () => {
      const candidates = createTestCandidates();
      const filterState: FilterState = {
        tags: [],
        booleans: [],
        ranges: [
          {
            attributeId: "github-stars",
            min: 10000,
            max: 30000,
            includeNull: true, // Include null values
          },
        ],
      };

      const passing = candidates.filter((c) =>
        candidatePassesFilters(c, filterState)
      );

      // PostgreSQL: 19400 (pass)
      // MySQL: 11200 (pass)
      // SQLite: 7200 (fail)
      // MongoDB: 28000 (pass)
      // Redis: 68000 (fail)
      // LegacyDB: null (pass due to includeNull)

      expect(passing.map((c) => c.name)).toEqual([
        "PostgreSQL",
        "MySQL",
        "MongoDB",
        "LegacyDB",
      ]);
    });

    it("should exclude null values when includeNull is false", () => {
      const candidates = createTestCandidates();
      const filterState: FilterState = {
        tags: [],
        booleans: [],
        ranges: [
          {
            attributeId: "github-stars",
            min: 1,
            max: 100000,
            includeNull: false, // Exclude null values
          },
        ],
      };

      const passing = candidates.filter((c) =>
        candidatePassesFilters(c, filterState)
      );

      // LegacyDB should be excluded even though range is very wide
      expect(passing.map((c) => c.name)).not.toContain("LegacyDB");
      expect(passing.length).toBe(5); // All except LegacyDB
    });

    it("should handle open-ended ranges (no min)", () => {
      const candidates = createTestCandidates();
      const filterState: FilterState = {
        tags: [],
        booleans: [],
        ranges: [
          {
            attributeId: "github-stars",
            min: null, // No lower bound
            max: 15000,
            includeNull: false,
          },
        ],
      };

      const passing = candidates.filter((c) =>
        candidatePassesFilters(c, filterState)
      );

      // MySQL: 11200 (pass)
      // SQLite: 7200 (pass)
      expect(passing.map((c) => c.name)).toEqual(["MySQL", "SQLite"]);
    });

    it("should handle open-ended ranges (no max)", () => {
      const candidates = createTestCandidates();
      const filterState: FilterState = {
        tags: [],
        booleans: [],
        ranges: [
          {
            attributeId: "github-stars",
            min: 20000,
            max: null, // No upper bound
            includeNull: false,
          },
        ],
      };

      const passing = candidates.filter((c) =>
        candidatePassesFilters(c, filterState)
      );

      // MongoDB: 28000 (pass)
      // Redis: 68000 (pass)
      expect(passing.map((c) => c.name)).toEqual(["MongoDB", "Redis"]);
    });
  });

  describe("Range + Tag Filters Combined", () => {
    it("should apply AND logic between range and tag filters", () => {
      const candidates = createTestCandidates();
      const filterState: FilterState = {
        tags: [
          {
            attributeId: "database-type",
            tagIds: new Set(["relational"]),
          },
        ],
        booleans: [],
        ranges: [
          {
            attributeId: "github-stars",
            min: 10000,
            max: 30000,
            includeNull: false,
          },
        ],
      };

      const passing = candidates.filter((c) =>
        candidatePassesFilters(c, filterState)
      );

      // Must be relational AND have stars 10000-30000
      // PostgreSQL: relational=true, stars=19400 -> PASS
      // MySQL: relational=true, stars=11200 -> PASS
      // SQLite: relational=true, stars=7200 -> FAIL (stars out of range)
      // MongoDB: relational=false, stars=28000 -> FAIL (not relational)
      // Redis: relational=false, stars=68000 -> FAIL (not relational)
      // LegacyDB: relational=true, stars=null -> FAIL (stars null)

      expect(passing.map((c) => c.name)).toEqual(["PostgreSQL", "MySQL"]);
    });

    it("should filter by multiple tags OR logic within tag filter", () => {
      const candidates = createTestCandidates();
      const filterState: FilterState = {
        tags: [
          {
            attributeId: "database-type",
            tagIds: new Set(["relational", "document"]),
          },
        ],
        booleans: [],
        ranges: [
          {
            attributeId: "github-stars",
            min: 15000,
            max: 50000,
            includeNull: false,
          },
        ],
      };

      const passing = candidates.filter((c) =>
        candidatePassesFilters(c, filterState)
      );

      // Must be (relational OR document) AND have stars 15000-50000
      // PostgreSQL: relational=true, stars=19400 -> PASS
      // MySQL: relational=true, stars=11200 -> FAIL (stars out of range)
      // MongoDB: document=true, stars=28000 -> PASS

      expect(passing.map((c) => c.name)).toEqual(["PostgreSQL", "MongoDB"]);
    });
  });

  describe("Range + Boolean Filters Combined", () => {
    it("should apply AND logic between range and boolean filters", () => {
      const candidates = createTestCandidates();
      const filterState: FilterState = {
        tags: [],
        booleans: [
          {
            attributeId: "acid-compliant",
            value: true,
          },
        ],
        ranges: [
          {
            attributeId: "github-stars",
            min: 10000,
            max: 50000,
            includeNull: false,
          },
        ],
      };

      const passing = candidates.filter((c) =>
        candidatePassesFilters(c, filterState)
      );

      // Must be ACID-compliant AND have stars 10000-50000
      // PostgreSQL: acid=true, stars=19400 -> PASS
      // MySQL: acid=true, stars=11200 -> PASS
      // SQLite: acid=true, stars=7200 -> FAIL (stars out of range)
      // MongoDB: acid=false, stars=28000 -> FAIL (not ACID)
      // Redis: acid=false, stars=68000 -> FAIL (not ACID, stars out of range)
      // LegacyDB: acid=null, stars=null -> FAIL

      expect(passing.map((c) => c.name)).toEqual(["PostgreSQL", "MySQL"]);
    });

    it("should filter by boolean=false", () => {
      const candidates = createTestCandidates();
      const filterState: FilterState = {
        tags: [],
        booleans: [
          {
            attributeId: "acid-compliant",
            value: false,
          },
        ],
        ranges: [
          {
            attributeId: "github-stars",
            min: 20000,
            max: 100000,
            includeNull: false,
          },
        ],
      };

      const passing = candidates.filter((c) =>
        candidatePassesFilters(c, filterState)
      );

      // Must NOT be ACID-compliant AND have stars 20000-100000
      // MongoDB: acid=false, stars=28000 -> PASS
      // Redis: acid=false, stars=68000 -> PASS

      expect(passing.map((c) => c.name)).toEqual(["MongoDB", "Redis"]);
    });
  });

  describe("Range + Tag + Boolean Filters Combined", () => {
    it("should apply all filter types with AND logic", () => {
      const candidates = createTestCandidates();
      const filterState: FilterState = {
        tags: [
          {
            attributeId: "database-type",
            tagIds: new Set(["relational"]),
          },
        ],
        booleans: [
          {
            attributeId: "acid-compliant",
            value: true,
          },
        ],
        ranges: [
          {
            attributeId: "learning-curve",
            min: 3,
            max: 5,
            includeNull: false,
          },
        ],
      };

      const passing = candidates.filter((c) =>
        candidatePassesFilters(c, filterState)
      );

      // Must be relational AND ACID-compliant AND learning-curve 3-5
      // PostgreSQL: relational, acid, learning=3 -> PASS
      // MySQL: relational, acid, learning=4 -> PASS
      // SQLite: relational, acid, learning=5 -> PASS

      expect(passing.map((c) => c.name)).toEqual([
        "PostgreSQL",
        "MySQL",
        "SQLite",
      ]);
    });

    it("should return empty when no candidates pass all filters", () => {
      const candidates = createTestCandidates();
      const filterState: FilterState = {
        tags: [
          {
            attributeId: "database-type",
            tagIds: new Set(["key-value"]),
          },
        ],
        booleans: [
          {
            attributeId: "acid-compliant",
            value: true, // Key-value DBs typically aren't ACID
          },
        ],
        ranges: [
          {
            attributeId: "github-stars",
            min: 1,
            max: 100000,
            includeNull: false,
          },
        ],
      };

      const passing = candidates.filter((c) =>
        candidatePassesFilters(c, filterState)
      );

      // No key-value database is ACID-compliant in our test data
      expect(passing).toEqual([]);
    });
  });

  describe("Date Range Filters", () => {
    it("should filter by date range", () => {
      const candidates = createTestCandidates();
      const filterState: FilterState = {
        tags: [],
        booleans: [],
        ranges: [
          {
            attributeId: "first-release",
            min: Date.parse("2000-01-01"),
            max: Date.parse("2010-12-31"),
            includeNull: false,
          },
        ],
      };

      const passing = candidates.filter((c) =>
        candidatePassesFilters(c, filterState)
      );

      // First released 2000-2010:
      // SQLite: 2000-08-17 -> PASS
      // MongoDB: 2009-02-11 -> PASS
      // Redis: 2009-03-22 -> PASS

      expect(passing.map((c) => c.name)).toEqual([
        "SQLite",
        "MongoDB",
        "Redis",
      ]);
    });
  });

  describe("getActiveFilterCount with Combined Filters", () => {
    it("should count all active filter types", () => {
      const filterState: FilterState = {
        tags: [
          { attributeId: "database-type", tagIds: new Set(["relational"]) },
          { attributeId: "license", tagIds: new Set(["gpl", "mit"]) },
        ],
        booleans: [
          { attributeId: "acid-compliant", value: true },
        ],
        ranges: [
          { attributeId: "github-stars", min: 10000, max: 50000, includeNull: false },
          { attributeId: "learning-curve", min: 3, max: 5, includeNull: true },
        ],
      };

      // Tags: 1 + 2 = 3 (counting individual tag selections)
      // Booleans: 1
      // Ranges: 2
      // Total: 6
      expect(getActiveFilterCount(filterState)).toBe(6);
    });

    it("should return 0 for empty filter state", () => {
      expect(getActiveFilterCount(emptyFilterState)).toBe(0);
    });

    it("should count only ranges when no other filters", () => {
      const filterState: FilterState = {
        tags: [],
        booleans: [],
        ranges: [
          { attributeId: "github-stars", min: 1000, max: 50000, includeNull: false },
        ],
      };

      expect(getActiveFilterCount(filterState)).toBe(1);
    });
  });

  describe("Edge Cases in Filtering Logic", () => {
    it("should pass all candidates when filter state is empty", () => {
      const candidates = createTestCandidates();
      const passing = candidates.filter((c) =>
        candidatePassesFilters(c, emptyFilterState)
      );

      expect(passing.length).toBe(candidates.length);
    });

    it("should handle candidates with missing attributes", () => {
      const candidates: CandidateFile[] = [
        {
          name: "Complete",
          values: {
            stars: { value: 1000 },
            rating: { value: 4 },
          },
        },
        {
          name: "MissingStars",
          values: {
            rating: { value: 5 },
            // stars attribute is missing entirely
          },
        },
        {
          name: "MissingRating",
          values: {
            stars: { value: 500 },
            // rating attribute is missing entirely
          },
        },
      ];

      const filterState: FilterState = {
        tags: [],
        booleans: [],
        ranges: [
          { attributeId: "stars", min: 100, max: 2000, includeNull: true },
        ],
      };

      const passing = candidates.filter((c) =>
        candidatePassesFilters(c, filterState)
      );

      // Complete: stars=1000 (pass)
      // MissingStars: stars=undefined treated as null, includeNull=true (pass)
      // MissingRating: stars=500 (pass)
      expect(passing.length).toBe(3);
    });

    it("should handle candidates with empty values object", () => {
      const candidates: CandidateFile[] = [
        { name: "Empty", values: {} },
        { name: "HasValue", values: { stars: { value: 100 } } },
      ];

      const filterState: FilterState = {
        tags: [],
        booleans: [],
        ranges: [
          { attributeId: "stars", min: 50, max: 200, includeNull: true },
        ],
      };

      const passing = candidates.filter((c) =>
        candidatePassesFilters(c, filterState)
      );

      // Both pass: Empty has null (includeNull=true), HasValue is in range
      expect(passing.length).toBe(2);
    });

    it("should correctly handle boundary values", () => {
      const candidates: CandidateFile[] = [
        { name: "AtMin", values: { value: { value: 100 } } },
        { name: "AtMax", values: { value: { value: 200 } } },
        { name: "BelowMin", values: { value: { value: 99 } } },
        { name: "AboveMax", values: { value: { value: 201 } } },
        { name: "InMiddle", values: { value: { value: 150 } } },
      ];

      const filterState: FilterState = {
        tags: [],
        booleans: [],
        ranges: [
          { attributeId: "value", min: 100, max: 200, includeNull: false },
        ],
      };

      const passing = candidates.filter((c) =>
        candidatePassesFilters(c, filterState)
      );

      // Boundary values should be included (range is inclusive)
      expect(passing.map((c) => c.name)).toEqual([
        "AtMin",
        "AtMax",
        "InMiddle",
      ]);
    });
  });
});

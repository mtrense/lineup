import { describe, it, expect } from "vitest";
import {
  isRangeableType,
  isDateType,
  getNumericValue,
  calculateRangeBounds,
  formatRangeLabel,
} from "./range-utils";
import type { CandidateFile, ValueType, AttributeValue } from "@/types";

/**
 * Integration tests for range filter edge cases (Increment 10).
 * These tests verify the filtering logic works correctly with:
 * - All null values for an attribute
 * - Single unique value (should return null bounds or min === max)
 * - Mixed null and numeric values
 * - Very large ranges (filesize: bytes to TB)
 * - Very small ranges (ratings: 1-5)
 */

describe("Range Utils - Edge Cases", () => {
  describe("isRangeableType", () => {
    it("should return true for all rangeable types", () => {
      const rangeableTypes: ValueType[] = [
        { type: "integer", direction: "ascending" },
        { type: "integer", direction: "descending" },
        { type: "integer", direction: "neutral" },
        { type: "decimal", direction: "ascending" },
        { type: "decimal", direction: "neutral" },
        { type: "percentage", direction: "ascending" },
        { type: "rating", lower: 1, upper: 5, direction: "ascending", symbols: { empty: "o", full: "x" } },
        { type: "filesize", direction: "ascending" },
        { type: "duration", direction: "ascending" },
        { type: "date", direction: "ascending" },
        { type: "datetime", direction: "ascending" },
      ];

      for (const type of rangeableTypes) {
        expect(isRangeableType(type)).toBe(true);
      }
    });

    it("should return false for non-rangeable types", () => {
      const nonRangeableTypes: ValueType[] = [
        "text",
        "boolean",
        "link",
        { type: "tags", defaultColor: "gray", tags: [] },
        { type: "icon-fontawesome", name: "star" },
      ];

      for (const type of nonRangeableTypes) {
        expect(isRangeableType(type)).toBe(false);
      }
    });
  });

  describe("isDateType", () => {
    it("should return true for date types", () => {
      const dateTypes: ValueType[] = [
        { type: "date", direction: "ascending" },
        { type: "date", direction: "descending" },
        { type: "datetime", direction: "ascending" },
        { type: "datetime", direction: "descending" },
      ];

      for (const type of dateTypes) {
        expect(isDateType(type)).toBe(true);
      }
    });

    it("should return false for non-date types", () => {
      const nonDateTypes: ValueType[] = [
        { type: "integer", direction: "ascending" },
        { type: "decimal", direction: "ascending" },
        { type: "percentage", direction: "ascending" },
        { type: "rating", lower: 1, upper: 5, direction: "ascending", symbols: { empty: "o", full: "x" } },
        { type: "filesize", direction: "ascending" },
        { type: "duration", direction: "ascending" },
        "text",
        "boolean",
        "link",
        { type: "tags", defaultColor: "gray", tags: [] },
      ];

      for (const type of nonDateTypes) {
        expect(isDateType(type)).toBe(false);
      }
    });
  });

  describe("getNumericValue", () => {
    describe("integer values", () => {
      const integerType: ValueType = { type: "integer", direction: "neutral" };

      it("should extract integer value from attribute", () => {
        const attr: AttributeValue = { value: 42 };
        expect(getNumericValue(attr, integerType)).toBe(42);
      });

      it("should handle null value", () => {
        const attr: AttributeValue = { value: null };
        expect(getNumericValue(attr, integerType)).toBeNull();
      });

      it("should handle undefined attribute", () => {
        expect(getNumericValue(undefined, integerType)).toBeNull();
      });

      it("should handle zero value", () => {
        const attr: AttributeValue = { value: 0 };
        expect(getNumericValue(attr, integerType)).toBe(0);
      });

      it("should handle negative value", () => {
        const attr: AttributeValue = { value: -10 };
        expect(getNumericValue(attr, integerType)).toBe(-10);
      });
    });

    describe("date values", () => {
      const dateType: ValueType = { type: "date", direction: "ascending" };

      it("should convert ISO date string to timestamp", () => {
        const attr: AttributeValue = { value: "2024-01-15" };
        const result = getNumericValue(attr, dateType);
        expect(result).toBe(Date.parse("2024-01-15"));
      });

      it("should convert year-only date string to timestamp", () => {
        const attr: AttributeValue = { value: "2020" };
        const result = getNumericValue(attr, dateType);
        expect(result).toBe(Date.parse("2020"));
      });

      it("should handle null date value", () => {
        const attr: AttributeValue = { value: null };
        expect(getNumericValue(attr, dateType)).toBeNull();
      });

      it("should return null for invalid date string", () => {
        const attr: AttributeValue = { value: "not-a-date" };
        expect(getNumericValue(attr, dateType)).toBeNull();
      });
    });

    describe("filesize values", () => {
      const filesizeType: ValueType = { type: "filesize", direction: "ascending" };

      it("should handle bytes (very small)", () => {
        const attr: AttributeValue = { value: 100 };
        expect(getNumericValue(attr, filesizeType)).toBe(100);
      });

      it("should handle kilobytes", () => {
        const attr: AttributeValue = { value: 1024 };
        expect(getNumericValue(attr, filesizeType)).toBe(1024);
      });

      it("should handle megabytes", () => {
        const attr: AttributeValue = { value: 1024 * 1024 };
        expect(getNumericValue(attr, filesizeType)).toBe(1024 * 1024);
      });

      it("should handle gigabytes", () => {
        const attr: AttributeValue = { value: 1024 * 1024 * 1024 };
        expect(getNumericValue(attr, filesizeType)).toBe(1024 * 1024 * 1024);
      });

      it("should handle terabytes (very large)", () => {
        const tb = 1024 * 1024 * 1024 * 1024;
        const attr: AttributeValue = { value: tb };
        expect(getNumericValue(attr, filesizeType)).toBe(tb);
      });
    });

    describe("rating values", () => {
      const ratingType: ValueType = {
        type: "rating",
        lower: 1,
        upper: 5,
        direction: "ascending",
        symbols: { empty: "o", full: "x" },
      };

      it("should handle rating in range", () => {
        const attr: AttributeValue = { value: 3.5 };
        expect(getNumericValue(attr, ratingType)).toBe(3.5);
      });

      it("should handle minimum rating", () => {
        const attr: AttributeValue = { value: 1 };
        expect(getNumericValue(attr, ratingType)).toBe(1);
      });

      it("should handle maximum rating", () => {
        const attr: AttributeValue = { value: 5 };
        expect(getNumericValue(attr, ratingType)).toBe(5);
      });
    });

    describe("duration values", () => {
      const durationType: ValueType = { type: "duration", direction: "ascending" };

      it("should handle milliseconds", () => {
        const attr: AttributeValue = { value: 500 };
        expect(getNumericValue(attr, durationType)).toBe(500);
      });

      it("should handle seconds (as milliseconds)", () => {
        const attr: AttributeValue = { value: 5000 };
        expect(getNumericValue(attr, durationType)).toBe(5000);
      });

      it("should handle hours (as milliseconds)", () => {
        const attr: AttributeValue = { value: 3600000 };
        expect(getNumericValue(attr, durationType)).toBe(3600000);
      });
    });
  });

  describe("calculateRangeBounds", () => {
    const integerType: ValueType = { type: "integer", direction: "neutral" };
    const ratingType: ValueType = {
      type: "rating",
      lower: 1,
      upper: 5,
      direction: "ascending",
      symbols: { empty: "o", full: "x" },
    };
    const filesizeType: ValueType = { type: "filesize", direction: "ascending" };

    describe("edge case: all null values", () => {
      it("should return null when all candidates have null values", () => {
        const candidates: CandidateFile[] = [
          { name: "A", values: { stars: { value: null } } },
          { name: "B", values: { stars: { value: null } } },
          { name: "C", values: { stars: { value: null } } },
        ];

        const bounds = calculateRangeBounds(candidates, "stars", integerType);
        expect(bounds).toBeNull();
      });

      it("should return null when attribute does not exist in any candidate", () => {
        const candidates: CandidateFile[] = [
          { name: "A", values: {} },
          { name: "B", values: {} },
        ];

        const bounds = calculateRangeBounds(candidates, "missing-attr", integerType);
        expect(bounds).toBeNull();
      });
    });

    describe("edge case: single unique value", () => {
      it("should return same min and max when all candidates have same value", () => {
        const candidates: CandidateFile[] = [
          { name: "A", values: { rating: { value: 3.5 } } },
          { name: "B", values: { rating: { value: 3.5 } } },
          { name: "C", values: { rating: { value: 3.5 } } },
        ];

        const bounds = calculateRangeBounds(candidates, "rating", ratingType);
        expect(bounds).toEqual({ min: 3.5, max: 3.5 });
      });

      it("should return single value bounds when only one candidate has a value", () => {
        const candidates: CandidateFile[] = [
          { name: "A", values: { rating: { value: 4 } } },
          { name: "B", values: { rating: { value: null } } },
          { name: "C", values: { rating: { value: null } } },
        ];

        const bounds = calculateRangeBounds(candidates, "rating", ratingType);
        expect(bounds).toEqual({ min: 4, max: 4 });
      });
    });

    describe("edge case: mixed null and numeric values", () => {
      it("should calculate bounds ignoring null values", () => {
        const candidates: CandidateFile[] = [
          { name: "A", values: { stars: { value: 100 } } },
          { name: "B", values: { stars: { value: null } } },
          { name: "C", values: { stars: { value: 500 } } },
          { name: "D", values: { stars: { value: null } } },
          { name: "E", values: { stars: { value: 300 } } },
        ];

        const bounds = calculateRangeBounds(candidates, "stars", integerType);
        expect(bounds).toEqual({ min: 100, max: 500 });
      });

      it("should handle single non-null value among nulls", () => {
        const candidates: CandidateFile[] = [
          { name: "A", values: { stars: { value: null } } },
          { name: "B", values: { stars: { value: 42 } } },
          { name: "C", values: { stars: { value: null } } },
        ];

        const bounds = calculateRangeBounds(candidates, "stars", integerType);
        expect(bounds).toEqual({ min: 42, max: 42 });
      });
    });

    describe("edge case: very large ranges (filesize)", () => {
      it("should handle range from bytes to terabytes", () => {
        const candidates: CandidateFile[] = [
          { name: "Small", values: { size: { value: 100 } } }, // 100 bytes
          { name: "Medium", values: { size: { value: 1024 * 1024 * 500 } } }, // 500 MB
          { name: "Large", values: { size: { value: 1024 * 1024 * 1024 * 1024 * 2 } } }, // 2 TB
        ];

        const bounds = calculateRangeBounds(candidates, "size", filesizeType);
        expect(bounds).toEqual({
          min: 100,
          max: 1024 * 1024 * 1024 * 1024 * 2,
        });
      });
    });

    describe("edge case: very small ranges (ratings)", () => {
      it("should handle small rating range", () => {
        const candidates: CandidateFile[] = [
          { name: "A", values: { rating: { value: 3 } } },
          { name: "B", values: { rating: { value: 4 } } },
          { name: "C", values: { rating: { value: 5 } } },
        ];

        const bounds = calculateRangeBounds(candidates, "rating", ratingType);
        expect(bounds).toEqual({ min: 3, max: 5 });
      });

      it("should handle decimal ratings", () => {
        const candidates: CandidateFile[] = [
          { name: "A", values: { rating: { value: 3.2 } } },
          { name: "B", values: { rating: { value: 3.8 } } },
          { name: "C", values: { rating: { value: 4.1 } } },
        ];

        const bounds = calculateRangeBounds(candidates, "rating", ratingType);
        expect(bounds).toEqual({ min: 3.2, max: 4.1 });
      });
    });

    describe("empty candidates", () => {
      it("should return null for empty candidates array", () => {
        const candidates: CandidateFile[] = [];
        const bounds = calculateRangeBounds(candidates, "stars", integerType);
        expect(bounds).toBeNull();
      });
    });
  });

  describe("formatRangeLabel - Edge Cases", () => {
    describe("filesize formatting for extreme values", () => {
      const filesizeType: ValueType = { type: "filesize", direction: "ascending" };

      it("should format 0 bytes", () => {
        expect(formatRangeLabel(0, filesizeType)).toBe("0 B");
      });

      it("should format 1 byte", () => {
        expect(formatRangeLabel(1, filesizeType)).toBe("1.00 B");
      });

      it("should format petabytes", () => {
        const pb = 1024 * 1024 * 1024 * 1024 * 1024;
        const label = formatRangeLabel(pb, filesizeType);
        expect(label).toBe("1.00 PB");
      });

      it("should format value between units correctly", () => {
        const value = 1024 * 1024 * 1.5; // 1.5 MB
        const label = formatRangeLabel(value, filesizeType);
        expect(label).toBe("1.50 MB");
      });
    });

    describe("duration formatting for extreme values", () => {
      const durationType: ValueType = { type: "duration", direction: "ascending" };

      it("should format 0 milliseconds", () => {
        expect(formatRangeLabel(0, durationType)).toBe("0ms");
      });

      it("should format negative value (edge case)", () => {
        expect(formatRangeLabel(-100, durationType)).toBe("0ms");
      });

      it("should format exactly 1 second", () => {
        expect(formatRangeLabel(1000, durationType)).toBe("1s");
      });

      it("should format exactly 1 minute", () => {
        expect(formatRangeLabel(60000, durationType)).toBe("1:00");
      });

      it("should format exactly 1 hour", () => {
        expect(formatRangeLabel(3600000, durationType)).toBe("1:00:00");
      });

      it("should format multiple hours", () => {
        // 2 hours, 30 minutes, 45 seconds
        const ms = (2 * 3600 + 30 * 60 + 45) * 1000;
        expect(formatRangeLabel(ms, durationType)).toBe("2:30:45");
      });
    });

    describe("percentage formatting edge cases", () => {
      const percentageType: ValueType = { type: "percentage", direction: "ascending" };

      it("should format 0 percent", () => {
        expect(formatRangeLabel(0, percentageType)).toBe("0%");
      });

      it("should format 100 percent", () => {
        expect(formatRangeLabel(100, percentageType)).toBe("100%");
      });

      it("should format 0.0 (normalized to 0%)", () => {
        expect(formatRangeLabel(0.0, percentageType)).toBe("0%");
      });

      it("should format 1.0 (normalized to 100%)", () => {
        expect(formatRangeLabel(1.0, percentageType)).toBe("100%");
      });
    });

    describe("integer formatting edge cases", () => {
      const integerType: ValueType = { type: "integer", direction: "neutral" };

      it("should format 0", () => {
        expect(formatRangeLabel(0, integerType)).toBe("0");
      });

      it("should format large number with thousands separator", () => {
        expect(formatRangeLabel(1000000, integerType)).toBe("1,000,000");
      });

      it("should format negative number", () => {
        expect(formatRangeLabel(-5000, integerType)).toBe("-5,000");
      });
    });

    describe("date formatting edge cases", () => {
      const dateType: ValueType = { type: "date", direction: "ascending" };

      it("should format Unix epoch", () => {
        const label = formatRangeLabel(0, dateType);
        // Should produce a valid date string (exact format depends on locale)
        expect(label).toBeTruthy();
        expect(label.length).toBeGreaterThan(0);
      });

      it("should format current timestamp", () => {
        const now = Date.now();
        const label = formatRangeLabel(now, dateType);
        expect(label).toBeTruthy();
      });

      it("should format far future date", () => {
        const future = Date.parse("2099-12-31");
        const label = formatRangeLabel(future, dateType);
        expect(label).toContain("2099");
      });
    });
  });
});

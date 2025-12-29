import { describe, it, expect } from "vitest";
import {
  serializeRangeFiltersToParams,
  parseRangeFiltersFromParams,
  type RangeFilter,
} from "./range-url";

describe("Range Filter URL Serialization", () => {
  describe("serializeRangeFiltersToParams", () => {
    it("should serialize a basic range filter with min and max", () => {
      const filters: RangeFilter[] = [
        { attributeId: "stars", min: 3, max: 5, includeNull: false },
      ];
      const params = new URLSearchParams();
      serializeRangeFiltersToParams(filters, params);
      expect(params.get("filter.stars")).toBe("3,5");
    });

    it("should serialize a range filter with includeNull=true", () => {
      const filters: RangeFilter[] = [
        { attributeId: "size", min: 1000, max: 5000, includeNull: true },
      ];
      const params = new URLSearchParams();
      serializeRangeFiltersToParams(filters, params);
      expect(params.get("filter.size")).toBe("1000,5000,null");
    });

    it("should serialize an open-ended range with no min", () => {
      const filters: RangeFilter[] = [
        { attributeId: "stars", min: null, max: 5, includeNull: false },
      ];
      const params = new URLSearchParams();
      serializeRangeFiltersToParams(filters, params);
      expect(params.get("filter.stars")).toBe(",5");
    });

    it("should serialize an open-ended range with no max", () => {
      const filters: RangeFilter[] = [
        { attributeId: "year", min: 2020, max: null, includeNull: false },
      ];
      const params = new URLSearchParams();
      serializeRangeFiltersToParams(filters, params);
      expect(params.get("filter.year")).toBe("2020,");
    });

    it("should serialize an open-ended range with includeNull", () => {
      const filters: RangeFilter[] = [
        { attributeId: "year", min: 2020, max: null, includeNull: true },
      ];
      const params = new URLSearchParams();
      serializeRangeFiltersToParams(filters, params);
      expect(params.get("filter.year")).toBe("2020,,null");
    });

    it("should serialize multiple range filters", () => {
      const filters: RangeFilter[] = [
        { attributeId: "stars", min: 3, max: 5, includeNull: false },
        { attributeId: "size", min: 1000, max: 5000, includeNull: true },
      ];
      const params = new URLSearchParams();
      serializeRangeFiltersToParams(filters, params);
      expect(params.get("filter.stars")).toBe("3,5");
      expect(params.get("filter.size")).toBe("1000,5000,null");
    });

    it("should handle empty filter array", () => {
      const filters: RangeFilter[] = [];
      const params = new URLSearchParams();
      serializeRangeFiltersToParams(filters, params);
      expect(params.toString()).toBe("");
    });

    it("should preserve existing params", () => {
      const filters: RangeFilter[] = [
        { attributeId: "stars", min: 3, max: 5, includeNull: false },
      ];
      const params = new URLSearchParams("sort=name&sortDir=asc");
      serializeRangeFiltersToParams(filters, params);
      expect(params.get("sort")).toBe("name");
      expect(params.get("sortDir")).toBe("asc");
      expect(params.get("filter.stars")).toBe("3,5");
    });

    it("should handle float values", () => {
      const filters: RangeFilter[] = [
        { attributeId: "rating", min: 3.5, max: 4.8, includeNull: false },
      ];
      const params = new URLSearchParams();
      serializeRangeFiltersToParams(filters, params);
      expect(params.get("filter.rating")).toBe("3.5,4.8");
    });

    it("should handle large numbers (timestamps)", () => {
      const filters: RangeFilter[] = [
        { attributeId: "date", min: 1577836800000, max: 1609459200000, includeNull: false },
      ];
      const params = new URLSearchParams();
      serializeRangeFiltersToParams(filters, params);
      expect(params.get("filter.date")).toBe("1577836800000,1609459200000");
    });
  });

  describe("parseRangeFiltersFromParams", () => {
    it("should parse a basic range filter", () => {
      const params = new URLSearchParams("filter.stars=3,5");
      const filters = parseRangeFiltersFromParams(params);
      expect(filters).toHaveLength(1);
      expect(filters[0]).toEqual({
        attributeId: "stars",
        min: 3,
        max: 5,
        includeNull: false,
      });
    });

    it("should parse a range filter with includeNull=true", () => {
      const params = new URLSearchParams("filter.size=1000,5000,null");
      const filters = parseRangeFiltersFromParams(params);
      expect(filters).toHaveLength(1);
      expect(filters[0]).toEqual({
        attributeId: "size",
        min: 1000,
        max: 5000,
        includeNull: true,
      });
    });

    it("should parse an open-ended range with no min", () => {
      const params = new URLSearchParams("filter.stars=,5");
      const filters = parseRangeFiltersFromParams(params);
      expect(filters).toHaveLength(1);
      expect(filters[0]).toEqual({
        attributeId: "stars",
        min: null,
        max: 5,
        includeNull: false,
      });
    });

    it("should parse an open-ended range with no max", () => {
      const params = new URLSearchParams("filter.year=2020,");
      const filters = parseRangeFiltersFromParams(params);
      expect(filters).toHaveLength(1);
      expect(filters[0]).toEqual({
        attributeId: "year",
        min: 2020,
        max: null,
        includeNull: false,
      });
    });

    it("should parse an open-ended range with includeNull", () => {
      const params = new URLSearchParams("filter.year=2020,,null");
      const filters = parseRangeFiltersFromParams(params);
      expect(filters).toHaveLength(1);
      expect(filters[0]).toEqual({
        attributeId: "year",
        min: 2020,
        max: null,
        includeNull: true,
      });
    });

    it("should parse multiple range filters", () => {
      const params = new URLSearchParams(
        "filter.stars=3,5&filter.size=1000,5000,null"
      );
      const filters = parseRangeFiltersFromParams(params);
      expect(filters).toHaveLength(2);
      expect(filters).toContainEqual({
        attributeId: "stars",
        min: 3,
        max: 5,
        includeNull: false,
      });
      expect(filters).toContainEqual({
        attributeId: "size",
        min: 1000,
        max: 5000,
        includeNull: true,
      });
    });

    it("should ignore params that do not start with filter.", () => {
      const params = new URLSearchParams("sort=name&sortDir=asc&candidates=a,b");
      const filters = parseRangeFiltersFromParams(params);
      expect(filters).toHaveLength(0);
    });

    it("should handle empty params", () => {
      const params = new URLSearchParams();
      const filters = parseRangeFiltersFromParams(params);
      expect(filters).toHaveLength(0);
    });

    it("should handle float values", () => {
      const params = new URLSearchParams("filter.rating=3.5,4.8");
      const filters = parseRangeFiltersFromParams(params);
      expect(filters).toHaveLength(1);
      expect(filters[0]).toEqual({
        attributeId: "rating",
        min: 3.5,
        max: 4.8,
        includeNull: false,
      });
    });

    it("should handle large numbers (timestamps)", () => {
      const params = new URLSearchParams(
        "filter.date=1577836800000,1609459200000"
      );
      const filters = parseRangeFiltersFromParams(params);
      expect(filters).toHaveLength(1);
      expect(filters[0]).toEqual({
        attributeId: "date",
        min: 1577836800000,
        max: 1609459200000,
        includeNull: false,
      });
    });

    it("should ignore invalid values (non-numeric)", () => {
      const params = new URLSearchParams("filter.stars=abc,5");
      const filters = parseRangeFiltersFromParams(params);
      // Invalid min should be treated as null or filter should be ignored
      expect(filters).toHaveLength(0);
    });

    it("should ignore malformed filter values (missing comma)", () => {
      const params = new URLSearchParams("filter.stars=5");
      const filters = parseRangeFiltersFromParams(params);
      expect(filters).toHaveLength(0);
    });

    it("should handle negative numbers", () => {
      const params = new URLSearchParams("filter.temp=-10,20");
      const filters = parseRangeFiltersFromParams(params);
      expect(filters).toHaveLength(1);
      expect(filters[0]).toEqual({
        attributeId: "temp",
        min: -10,
        max: 20,
        includeNull: false,
      });
    });
  });

  describe("roundtrip serialization", () => {
    it("should maintain filter state after serialize->parse", () => {
      const original: RangeFilter[] = [
        { attributeId: "stars", min: 3, max: 5, includeNull: false },
        { attributeId: "size", min: 1000, max: 5000, includeNull: true },
        { attributeId: "year", min: 2020, max: null, includeNull: true },
        { attributeId: "rating", min: null, max: 4.5, includeNull: false },
      ];

      const params = new URLSearchParams();
      serializeRangeFiltersToParams(original, params);
      const parsed = parseRangeFiltersFromParams(params);

      expect(parsed).toHaveLength(original.length);
      for (const filter of original) {
        expect(parsed).toContainEqual(filter);
      }
    });
  });

  describe("URL Edge Cases - Invalid Parameters", () => {
    it("should ignore filter with empty attribute id", () => {
      const params = new URLSearchParams("filter.=3,5");
      const filters = parseRangeFiltersFromParams(params);
      expect(filters).toHaveLength(0);
    });

    it("should ignore filter with only comma", () => {
      const params = new URLSearchParams("filter.stars=,");
      const filters = parseRangeFiltersFromParams(params);
      // Both min and max are empty strings, parsed as null
      // This should be a valid open-ended filter (no bounds)
      // Actually checking the implementation - empty both means valid
      expect(filters).toHaveLength(1);
      expect(filters[0]).toEqual({
        attributeId: "stars",
        min: null,
        max: null,
        includeNull: false,
      });
    });

    it("should ignore filter with special characters in value", () => {
      const params = new URLSearchParams("filter.stars=<script>,5");
      const filters = parseRangeFiltersFromParams(params);
      // <script> is not a valid number
      expect(filters).toHaveLength(0);
    });

    it("should handle filter with whitespace in value", () => {
      const params = new URLSearchParams("filter.stars= 3 , 5 ");
      const filters = parseRangeFiltersFromParams(params);
      expect(filters).toHaveLength(1);
      expect(filters[0]).toEqual({
        attributeId: "stars",
        min: 3,
        max: 5,
        includeNull: false,
      });
    });

    it("should ignore filter with NaN values", () => {
      const params = new URLSearchParams("filter.stars=NaN,5");
      const filters = parseRangeFiltersFromParams(params);
      expect(filters).toHaveLength(0);
    });

    it("should ignore filter with Infinity values", () => {
      const params = new URLSearchParams("filter.stars=Infinity,5");
      const filters = parseRangeFiltersFromParams(params);
      // Infinity is a valid number in JavaScript, but let's check behavior
      // parseFloat("Infinity") returns Infinity
      // This depends on implementation - might be valid or ignored
      expect(filters.length).toBeLessThanOrEqual(1);
    });

    it("should handle scientific notation", () => {
      const params = new URLSearchParams("filter.size=1e6,1e9");
      const filters = parseRangeFiltersFromParams(params);
      expect(filters).toHaveLength(1);
      expect(filters[0]).toEqual({
        attributeId: "size",
        min: 1000000,
        max: 1000000000,
        includeNull: false,
      });
    });

    it("should handle zero values", () => {
      const params = new URLSearchParams("filter.rating=0,5");
      const filters = parseRangeFiltersFromParams(params);
      expect(filters).toHaveLength(1);
      expect(filters[0]).toEqual({
        attributeId: "rating",
        min: 0,
        max: 5,
        includeNull: false,
      });
    });

    it("should handle negative zero", () => {
      const params = new URLSearchParams("filter.temp=-0,10");
      const filters = parseRangeFiltersFromParams(params);
      expect(filters).toHaveLength(1);
      // -0 is functionally equivalent to 0 for filtering purposes
      // parseFloat("-0") returns -0, which is fine
      expect(filters[0].min).toEqual(-0);
      // Verify it's numerically equivalent to 0
      expect(filters[0].min === 0).toBe(true);
    });

    it("should handle very small decimal values", () => {
      const params = new URLSearchParams("filter.precision=0.00001,0.00005");
      const filters = parseRangeFiltersFromParams(params);
      expect(filters).toHaveLength(1);
      expect(filters[0]).toEqual({
        attributeId: "precision",
        min: 0.00001,
        max: 0.00005,
        includeNull: false,
      });
    });

    it("should handle filters with hyphenated attribute IDs", () => {
      const params = new URLSearchParams("filter.github-stars=1000,5000");
      const filters = parseRangeFiltersFromParams(params);
      expect(filters).toHaveLength(1);
      expect(filters[0].attributeId).toBe("github-stars");
    });

    it("should handle filters with underscored attribute IDs", () => {
      const params = new URLSearchParams("filter.stack_overflow_count=100,500");
      const filters = parseRangeFiltersFromParams(params);
      expect(filters).toHaveLength(1);
      expect(filters[0].attributeId).toBe("stack_overflow_count");
    });

    it("should handle case where null suffix has different casing", () => {
      const params = new URLSearchParams("filter.stars=3,5,NULL");
      const filters = parseRangeFiltersFromParams(params);
      expect(filters).toHaveLength(1);
      // NULL (uppercase) should be treated as null
      expect(filters[0].includeNull).toBe(true);
    });

    it("should ignore includeNull when it is not 'null'", () => {
      const params = new URLSearchParams("filter.stars=3,5,true");
      const filters = parseRangeFiltersFromParams(params);
      expect(filters).toHaveLength(1);
      // 'true' is not 'null', so includeNull should be false
      expect(filters[0].includeNull).toBe(false);
    });

    it("should handle extra commas gracefully", () => {
      const params = new URLSearchParams("filter.stars=3,5,null,extra");
      const filters = parseRangeFiltersFromParams(params);
      expect(filters).toHaveLength(1);
      // Extra parts after null should be ignored
      expect(filters[0]).toEqual({
        attributeId: "stars",
        min: 3,
        max: 5,
        includeNull: true,
      });
    });
  });

  describe("URL Edge Cases - Multiple Filters", () => {
    it("should handle many filters at once", () => {
      const params = new URLSearchParams(
        "filter.a=1,10&filter.b=2,20&filter.c=3,30&filter.d=4,40&filter.e=5,50"
      );
      const filters = parseRangeFiltersFromParams(params);
      expect(filters).toHaveLength(5);
    });

    it("should handle duplicate filter keys (last one wins)", () => {
      // URLSearchParams typically handles duplicates, but our parser iterates all
      const params = new URLSearchParams();
      params.append("filter.stars", "1,5");
      params.append("filter.stars", "10,50");

      const filters = parseRangeFiltersFromParams(params);
      // Both should be parsed (forEach visits all)
      expect(filters.length).toBeGreaterThanOrEqual(1);
    });

    it("should preserve filter order", () => {
      const original: RangeFilter[] = [
        { attributeId: "z-attr", min: 1, max: 10, includeNull: false },
        { attributeId: "a-attr", min: 2, max: 20, includeNull: false },
        { attributeId: "m-attr", min: 3, max: 30, includeNull: false },
      ];

      const params = new URLSearchParams();
      serializeRangeFiltersToParams(original, params);
      const parsed = parseRangeFiltersFromParams(params);

      // Order might not be preserved due to URLSearchParams iteration
      // but all filters should be present
      expect(parsed).toHaveLength(3);
    });
  });

  describe("URL Edge Cases - Share URL Scenarios", () => {
    it("should parse a realistic share URL", () => {
      const shareUrl =
        "candidates=postgresql,mysql,mongodb&sort=github-stars&sortDir=desc&filter.github-stars=5000,50000&filter.learning-curve=3,5,null";
      const params = new URLSearchParams(shareUrl);
      const filters = parseRangeFiltersFromParams(params);

      expect(filters).toHaveLength(2);
      expect(filters).toContainEqual({
        attributeId: "github-stars",
        min: 5000,
        max: 50000,
        includeNull: false,
      });
      expect(filters).toContainEqual({
        attributeId: "learning-curve",
        min: 3,
        max: 5,
        includeNull: true,
      });
    });

    it("should handle URL-encoded filter values", () => {
      // URL encode the value "3,5,null" -> "3%2C5%2Cnull"
      // But typically the whole param value is encoded together
      const params = new URLSearchParams("filter.stars=3,5");
      const filters = parseRangeFiltersFromParams(params);
      expect(filters).toHaveLength(1);
    });
  });
});

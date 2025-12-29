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
});

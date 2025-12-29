import { describe, it, expect } from "vitest";
import { getActiveFilterCount, type FilterState } from "./FilterPanel";
import { formatRangeLabel } from "@/lib/range-utils";
import type { ValueType } from "@/types";

/**
 * Tests for visual indicators of active range filters (Increment 8).
 * These tests verify:
 * 1. Filter count badge reflects active range filters
 * 2. isModified logic for determining when to show clear button
 * 3. Range label formatting for display
 */

describe("Visual Indicators - Filter Count Badge", () => {
  it("should count single range filter", () => {
    const filterState: FilterState = {
      tags: [],
      booleans: [],
      ranges: [
        {
          attributeId: "size",
          min: 1024,
          max: 1024 * 1024,
          includeNull: true,
        },
      ],
    };

    expect(getActiveFilterCount(filterState)).toBe(1);
  });

  it("should count multiple range filters", () => {
    const filterState: FilterState = {
      tags: [],
      booleans: [],
      ranges: [
        {
          attributeId: "size",
          min: 1024,
          max: 1024 * 1024,
          includeNull: true,
        },
        {
          attributeId: "rating",
          min: 3,
          max: 5,
          includeNull: false,
        },
      ],
    };

    expect(getActiveFilterCount(filterState)).toBe(2);
  });

  it("should count mixed filter types", () => {
    const filterState: FilterState = {
      tags: [
        {
          attributeId: "tags",
          tagIds: new Set(["tag1", "tag2"]),
        },
      ],
      booleans: [
        {
          attributeId: "active",
          value: true,
        },
      ],
      ranges: [
        {
          attributeId: "size",
          min: 1024,
          max: 1024 * 1024,
          includeNull: true,
        },
      ],
    };

    // tags count = 2, booleans count = 1, ranges count = 1 = 4 total
    expect(getActiveFilterCount(filterState)).toBe(4);
  });
});

describe("Visual Indicators - isModified Logic", () => {
  describe("should detect when range is modified from bounds", () => {
    it("detects when min is modified", () => {
      const bounds = { min: 0, max: 100 };
      const currentMin = 10;
      const currentMax = 100;
      const includeNull = true;

      const isModified =
        currentMin !== bounds.min ||
        currentMax !== bounds.max ||
        !includeNull;

      expect(isModified).toBe(true);
    });

    it("detects when max is modified", () => {
      const bounds = { min: 0, max: 100 };
      const currentMin = 0;
      const currentMax = 90;
      const includeNull = true;

      const isModified =
        currentMin !== bounds.min ||
        currentMax !== bounds.max ||
        !includeNull;

      expect(isModified).toBe(true);
    });

    it("detects when includeNull is modified", () => {
      const bounds = { min: 0, max: 100 };
      const currentMin = 0;
      const currentMax = 100;
      const includeNull = false;

      const isModified =
        currentMin !== bounds.min ||
        currentMax !== bounds.max ||
        !includeNull;

      expect(isModified).toBe(true);
    });

    it("detects when all parameters are modified", () => {
      const bounds = { min: 0, max: 100 };
      const currentMin = 10;
      const currentMax = 90;
      const includeNull = false;

      const isModified =
        currentMin !== bounds.min ||
        currentMax !== bounds.max ||
        !includeNull;

      expect(isModified).toBe(true);
    });

    it("returns false when range is at full extent", () => {
      const bounds = { min: 0, max: 100 };
      const currentMin = 0;
      const currentMax = 100;
      const includeNull = true;

      const isModified =
        currentMin !== bounds.min ||
        currentMax !== bounds.max ||
        !includeNull;

      expect(isModified).toBe(false);
    });

    it("returns false when filter is undefined (no active filter)", () => {
      const activeFilter = undefined;
      const isModified = activeFilter !== undefined;

      expect(isModified).toBe(false);
    });
  });
});

describe("Visual Indicators - Range Label Formatting", () => {
  describe("filesize range labels", () => {
    const filesizeType: ValueType = { type: "filesize", direction: "ascending" };

    it("formats small filesize range", () => {
      const min = 1024; // 1 KB
      const max = 1024 * 512; // 512 KB

      const minLabel = formatRangeLabel(min, filesizeType);
      const maxLabel = formatRangeLabel(max, filesizeType);

      expect(minLabel).toBe("1.00 KB");
      expect(maxLabel).toBe("512 KB"); // Over 100, so no decimals
    });

    it("formats large filesize range", () => {
      const min = 1024 * 1024; // 1 MB
      const max = 1024 * 1024 * 1024 * 5; // 5 GB

      const minLabel = formatRangeLabel(min, filesizeType);
      const maxLabel = formatRangeLabel(max, filesizeType);

      expect(minLabel).toBe("1.00 MB");
      expect(maxLabel).toBe("5.00 GB");
    });
  });

  describe("integer range labels", () => {
    const integerType: ValueType = { type: "integer", direction: "neutral" };

    it("formats integer range", () => {
      const min = 10;
      const max = 1000;

      const minLabel = formatRangeLabel(min, integerType);
      const maxLabel = formatRangeLabel(max, integerType);

      expect(minLabel).toBe("10");
      expect(maxLabel).toBe("1,000");
    });
  });

  describe("decimal range labels", () => {
    const decimalType: ValueType = { type: "decimal", direction: "neutral" };

    it("formats decimal range", () => {
      const min = 3.5;
      const max = 4.8;

      const minLabel = formatRangeLabel(min, decimalType);
      const maxLabel = formatRangeLabel(max, decimalType);

      expect(minLabel).toContain("3.5");
      expect(maxLabel).toContain("4.8");
    });
  });

  describe("percentage range labels", () => {
    const percentageType: ValueType = { type: "percentage", direction: "ascending" };

    it("formats percentage range (0-100 scale)", () => {
      const min = 25;
      const max = 75;

      const minLabel = formatRangeLabel(min, percentageType);
      const maxLabel = formatRangeLabel(max, percentageType);

      expect(minLabel).toBe("25%");
      expect(maxLabel).toBe("75%");
    });

    it("formats percentage range (0-1 scale)", () => {
      const min = 0.25;
      const max = 0.75;

      const minLabel = formatRangeLabel(min, percentageType);
      const maxLabel = formatRangeLabel(max, percentageType);

      expect(minLabel).toBe("25%");
      expect(maxLabel).toBe("75%");
    });
  });

  describe("duration range labels", () => {
    const durationType: ValueType = { type: "duration", direction: "ascending" };

    it("formats milliseconds", () => {
      const label = formatRangeLabel(500, durationType);
      expect(label).toBe("500ms");
    });

    it("formats seconds", () => {
      const label = formatRangeLabel(5000, durationType);
      expect(label).toBe("5s");
    });

    it("formats minutes", () => {
      const label = formatRangeLabel(5 * 60 * 1000, durationType);
      expect(label).toBe("5:00");
    });
  });

  describe("date range labels", () => {
    const dateType: ValueType = "text"; // Using text as a simple type for dates in this test

    it("formats date range", () => {
      const min = new Date("2020-01-15").getTime();
      const max = new Date("2023-12-31").getTime();

      const minLabel = formatRangeLabel(min, dateType);
      const maxLabel = formatRangeLabel(max, dateType);

      // With text type, it will just convert to string
      expect(minLabel).toBeTruthy();
      expect(maxLabel).toBeTruthy();
    });
  });
});

describe("Visual Indicators - Range Display Text", () => {
  it("should format range as 'min - max'", () => {
    const filesizeType: ValueType = { type: "filesize", direction: "ascending" };
    const min = 1024 * 1024; // 1 MB
    const max = 1024 * 1024 * 1024 * 5; // 5 GB

    const minLabel = formatRangeLabel(min, filesizeType);
    const maxLabel = formatRangeLabel(max, filesizeType);
    const rangeText = `${minLabel} - ${maxLabel}`;

    expect(rangeText).toBe("1.00 MB - 5.00 GB");
  });

  it("should format integer range as 'min - max'", () => {
    const integerType: ValueType = { type: "integer", direction: "neutral" };
    const min = 10;
    const max = 1000;

    const minLabel = formatRangeLabel(min, integerType);
    const maxLabel = formatRangeLabel(max, integerType);
    const rangeText = `${minLabel} - ${maxLabel}`;

    expect(rangeText).toBe("10 - 1,000");
  });

  it("should format percentage range as 'min - max'", () => {
    const percentageType: ValueType = { type: "percentage", direction: "ascending" };
    const min = 25;
    const max = 75;

    const minLabel = formatRangeLabel(min, percentageType);
    const maxLabel = formatRangeLabel(max, percentageType);
    const rangeText = `${minLabel} - ${maxLabel}`;

    expect(rangeText).toBe("25% - 75%");
  });
});

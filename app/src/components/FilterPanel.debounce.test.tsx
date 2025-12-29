import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useCallback, useRef, useEffect } from "react";
import type { FilterState, RangeFilter } from "./FilterPanel";

/**
 * Unit tests for the debounced range filter handler logic.
 * This tests the debouncing mechanism in isolation.
 */
describe("Range Filter Debouncing", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it("should debounce multiple rapid calls to handleRangeChange", () => {
    const mockOnFilterChange = vi.fn();
    let filterState: FilterState = {
      tags: [],
      booleans: [],
      ranges: [],
    };

    // Simulate the debounced handler
    const { result } = renderHook(() => {
      const debounceTimers = useRef<Map<string, NodeJS.Timeout>>(new Map());

      useEffect(() => {
        return () => {
          debounceTimers.current.forEach((timer) => clearTimeout(timer));
          debounceTimers.current.clear();
        };
      }, []);

      const handleRangeChange = useCallback(
        (
          attributeId: string,
          min: number | null,
          max: number | null,
          includeNull: boolean,
          bounds?: { min: number; max: number }
        ) => {
          const existingTimer = debounceTimers.current.get(attributeId);
          if (existingTimer) {
            clearTimeout(existingTimer);
          }

          const timer = setTimeout(() => {
            if (
              bounds &&
              min === bounds.min &&
              max === bounds.max &&
              includeNull
            ) {
              mockOnFilterChange({
                ...filterState,
                ranges: filterState.ranges.filter(
                  (f) => f.attributeId !== attributeId
                ),
              });
              return;
            }

            const existing = filterState.ranges.find(
              (f) => f.attributeId === attributeId
            );

            if (existing) {
              mockOnFilterChange({
                ...filterState,
                ranges: filterState.ranges.map((f) =>
                  f.attributeId === attributeId
                    ? { ...f, min, max, includeNull }
                    : f
                ),
              });
            } else {
              mockOnFilterChange({
                ...filterState,
                ranges: [
                  ...filterState.ranges,
                  { attributeId, min, max, includeNull },
                ],
              });
            }

            debounceTimers.current.delete(attributeId);
          }, 300);

          debounceTimers.current.set(attributeId, timer);
        },
        [filterState, mockOnFilterChange]
      );

      return { handleRangeChange };
    });

    // Make 5 rapid calls
    act(() => {
      result.current.handleRangeChange("rating", 1, 2, true);
      result.current.handleRangeChange("rating", 1, 3, true);
      result.current.handleRangeChange("rating", 1, 4, true);
      result.current.handleRangeChange("rating", 1, 5, true);
      result.current.handleRangeChange("rating", 1, 5, true);
    });

    // Should not have called onFilterChange yet
    expect(mockOnFilterChange).not.toHaveBeenCalled();

    // Fast-forward time by debounce delay
    act(() => {
      vi.advanceTimersByTime(300);
    });

    // Should have called onFilterChange only once with the final value
    expect(mockOnFilterChange).toHaveBeenCalledTimes(1);
    expect(mockOnFilterChange).toHaveBeenCalledWith({
      tags: [],
      booleans: [],
      ranges: [
        {
          attributeId: "rating",
          min: 1,
          max: 5,
          includeNull: true,
        },
      ],
    });
  });

  it("should handle changes to different attributes independently", () => {
    const mockOnFilterChange = vi.fn();
    let filterState: FilterState = {
      tags: [],
      booleans: [],
      ranges: [],
    };

    const { result } = renderHook(() => {
      const debounceTimers = useRef<Map<string, NodeJS.Timeout>>(new Map());

      useEffect(() => {
        return () => {
          debounceTimers.current.forEach((timer) => clearTimeout(timer));
          debounceTimers.current.clear();
        };
      }, []);

      const handleRangeChange = useCallback(
        (
          attributeId: string,
          min: number | null,
          max: number | null,
          includeNull: boolean
        ) => {
          const existingTimer = debounceTimers.current.get(attributeId);
          if (existingTimer) {
            clearTimeout(existingTimer);
          }

          const timer = setTimeout(() => {
            const existing = filterState.ranges.find(
              (f) => f.attributeId === attributeId
            );

            if (existing) {
              mockOnFilterChange({
                ...filterState,
                ranges: filterState.ranges.map((f) =>
                  f.attributeId === attributeId
                    ? { ...f, min, max, includeNull }
                    : f
                ),
              });
            } else {
              mockOnFilterChange({
                ...filterState,
                ranges: [
                  ...filterState.ranges,
                  { attributeId, min, max, includeNull },
                ],
              });
            }

            debounceTimers.current.delete(attributeId);
          }, 300);

          debounceTimers.current.set(attributeId, timer);
        },
        [filterState, mockOnFilterChange]
      );

      return { handleRangeChange };
    });

    // Make calls to two different attributes
    act(() => {
      result.current.handleRangeChange("rating", 1, 5, true);
      result.current.handleRangeChange("size", 1000, 5000, true);
    });

    // Fast-forward time
    act(() => {
      vi.advanceTimersByTime(300);
    });

    // Should have called onFilterChange twice (once per attribute)
    // Note: In real implementation, the second call would build on the first
    // This test verifies that different attributes have independent debounce timers
    expect(mockOnFilterChange).toHaveBeenCalledTimes(2);
  });

  it("should remove filter when range is reset to full bounds", () => {
    const mockOnFilterChange = vi.fn();
    const existingFilter: RangeFilter = {
      attributeId: "rating",
      min: 2,
      max: 4,
      includeNull: true,
    };
    let filterState: FilterState = {
      tags: [],
      booleans: [],
      ranges: [existingFilter],
    };

    const { result } = renderHook(() => {
      const debounceTimers = useRef<Map<string, NodeJS.Timeout>>(new Map());

      const handleRangeChange = useCallback(
        (
          attributeId: string,
          min: number | null,
          max: number | null,
          includeNull: boolean,
          bounds?: { min: number; max: number }
        ) => {
          const existingTimer = debounceTimers.current.get(attributeId);
          if (existingTimer) {
            clearTimeout(existingTimer);
          }

          const timer = setTimeout(() => {
            // If range matches full bounds and includeNull is true, remove the filter
            if (
              bounds &&
              min === bounds.min &&
              max === bounds.max &&
              includeNull
            ) {
              mockOnFilterChange({
                ...filterState,
                ranges: filterState.ranges.filter(
                  (f) => f.attributeId !== attributeId
                ),
              });
              return;
            }

            const existing = filterState.ranges.find(
              (f) => f.attributeId === attributeId
            );

            if (existing) {
              mockOnFilterChange({
                ...filterState,
                ranges: filterState.ranges.map((f) =>
                  f.attributeId === attributeId
                    ? { ...f, min, max, includeNull }
                    : f
                ),
              });
            }

            debounceTimers.current.delete(attributeId);
          }, 300);

          debounceTimers.current.set(attributeId, timer);
        },
        [filterState, mockOnFilterChange]
      );

      return { handleRangeChange };
    });

    // Reset to full bounds
    act(() => {
      result.current.handleRangeChange(
        "rating",
        1,
        5,
        true,
        { min: 1, max: 5 }
      );
    });

    // Fast-forward time
    act(() => {
      vi.advanceTimersByTime(300);
    });

    // Should have removed the filter
    expect(mockOnFilterChange).toHaveBeenCalledWith({
      tags: [],
      booleans: [],
      ranges: [],
    });
  });
});

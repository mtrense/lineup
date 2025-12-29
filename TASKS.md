# Milestone 14: Range Slider Filters

## Overview

Add range slider filters for numeric and temporal attribute types (integer, decimal, rating, filesize, duration, percentage, date, datetime). Users can filter candidates by setting min/max bounds on these attributes.

## Current State Analysis

- Filter state uses `FilterState` interface with separate `tags` and `booleans` arrays
- Filters are organized by attribute groups in `FilterDrawer`
- `candidatePassesFilters()` function checks if candidates pass all active filters
- URL persistence exists for candidates and sort state, but NOT for filters
- Value formatters exist for all target types in `app/src/components/values/`

## Task Breakdown

### Increment 1: Extend Filter State for Range Filters
**Files:** `app/src/components/FilterPanel.tsx`

- [x] Add `RangeFilter` interface to FilterState:
  ```typescript
  export interface RangeFilter {
    attributeId: string;
    min: number | null;  // null = no lower bound
    max: number | null;  // null = no upper bound
    includeNull: boolean;  // whether to include candidates with null values
  }
  ```
- [x] Extend `FilterState` interface with `ranges: RangeFilter[]`
- [x] Update `emptyFilterState` to include empty ranges array
- [x] Update `getActiveFilterCount()` to count active range filters
- [x] Add `candidatePassesRangeFilter()` helper function
- [x] Integrate range filter logic into `candidatePassesFilters()`

**Commit:** `feat(filters): add range filter state and filtering logic`

---

### Increment 2: Create Range Slider Component
**Files:** `app/src/components/ui/range-slider.tsx` (new)

- [x] Install/verify shadcn Slider component is available
- [x] Create `RangeSlider` component with dual handles:
  ```typescript
  interface RangeSliderProps {
    min: number;
    max: number;
    value: [number, number];
    onChange: (value: [number, number]) => void;
    formatLabel?: (value: number) => string;
    step?: number;
    disabled?: boolean;
  }
  ```
- [x] Display current min/max values above the slider
- [x] Style to match existing UI (consistent with shadcn theme)
- [x] Ensure keyboard accessibility (arrow keys to adjust)

**Commit:** `feat(ui): add RangeSlider component`

---

### Increment 3: Value Normalization Utilities
**Files:** `app/src/lib/range-utils.ts` (new)

- [x] Create utility to extract numeric value from different attribute types:
  ```typescript
  function getNumericValue(value: AttributeValue, valueType: ValueType): number | null
  ```
- [x] Handle type-specific extraction:
  - Integer/Decimal/Percentage/Rating: direct number
  - Filesize: number (bytes)
  - Duration: number (milliseconds)
  - Date/DateTime: number (Unix timestamp)
- [x] Create utility to calculate min/max bounds from candidates:
  ```typescript
  function calculateRangeBounds(
    candidates: CandidateFile[],
    attributeId: string,
    valueType: ValueType
  ): { min: number; max: number } | null
  ```
- [x] Return null if no valid numeric values exist

**Commit:** `feat(filters): add range value normalization utilities`

---

### Increment 4: Label Formatters for Range Values
**Files:** `app/src/lib/range-utils.ts`

- [x] Create unified label formatter:
  ```typescript
  function formatRangeLabel(value: number, valueType: ValueType): string
  ```
- [x] Reuse existing formatting logic from value components:
  - Integer: locale-formatted whole number
  - Decimal: 1-2 decimal places
  - Percentage: "X%"
  - Rating: numeric with attribute's upper bound context
  - Filesize: "1.2 MB" format
  - Duration: "5:30" or "1.5s" format
  - Date: "Jan 15, 2024" format
  - DateTime: "Jan 15, 2024 14:30" format
- [x] Export formatters for use in RangeSlider labels

**Commit:** `feat(filters): add range label formatters`

---

### Increment 5: Identify Rangeable Attributes
**Files:** `app/src/lib/range-utils.ts`

- [x] Create type guard for rangeable value types:
  ```typescript
  function isRangeableType(valueType: ValueType): boolean
  ```
- [x] Include: integer, decimal, percentage, rating, filesize, duration, date, datetime
- [x] Exclude: text, boolean, tags, icon, link

**Commit:** `feat(filters): add rangeable type identification`

---

### Increment 6: Range Filter UI in FilterDrawer
**Files:** `app/src/components/FilterPanel.tsx`

- [x] Update `filterableGroups` memo to include rangeable attributes
- [x] Create `RangeFilterControl` component for individual range filters:
  - Attribute name label
  - RangeSlider with type-appropriate formatting
  - "Include unknown" checkbox for null handling
  - Clear button to reset to full range
- [x] Render range filters alongside tag and boolean filters in groups
- [x] Calculate bounds dynamically from current candidates
- [x] Handle edge case: skip rendering if all values are null or only one unique value

**Commit:** `feat(filters): add range filter controls to filter dialog`

---

### Increment 7: Range Filter State Management
**Files:** `app/src/components/FilterPanel.tsx`

- [x] Add handler for range filter changes:
  ```typescript
  function handleRangeChange(
    attributeId: string,
    min: number | null,
    max: number | null,
    includeNull: boolean
  ): void
  ```
- [x] Update FilterState when slider values change
- [x] Remove range filter when reset to full bounds
- [x] Debounce slider changes to avoid excessive re-renders

**Commit:** `feat(filters): implement range filter state management`

---

### Increment 8: Visual Indicators for Active Range Filters
**Files:** `app/src/components/FilterPanel.tsx`

- [ ] Show visual indicator when range is narrowed from full extent
- [ ] Display current range as text label (e.g., "1.2 MB - 5.6 GB")
- [ ] Style clear button to appear only when range is modified
- [ ] Update filter count badge to reflect active range filters

**Commit:** `feat(filters): add visual indicators for active range filters`

---

### Increment 9: URL Persistence for Range Filters
**Files:** `app/src/pages/ComparisonPage.tsx`, `app/src/components/FilterPanel.tsx`

- [ ] Define URL format: `filter.{attrId}={min},{max}` or `filter.{attrId}={min},{max},null`
  - Example: `?filter.stars=3,5` or `?filter.size=1000,5000,null`
  - The `,null` suffix indicates includeNull=true
- [ ] Parse range filters from URL on page load
- [ ] Update URL when range filters change
- [ ] Handle edge cases:
  - Missing min or max (open-ended ranges): `filter.stars=,5` or `filter.stars=3,`
  - Invalid values (ignore and use defaults)

**Commit:** `feat(filters): persist range filter state to URL`

---

### Increment 10: Integration Testing and Edge Cases
**Files:** Various

- [ ] Test with comparison data that has:
  - All null values for an attribute (should hide filter)
  - Single unique value (should hide or disable filter)
  - Mixed null and numeric values
  - Very large ranges (filesize: bytes to TB)
  - Very small ranges (ratings: 1-5)
- [ ] Verify filtering works correctly with:
  - Multiple range filters active
  - Range + tag + boolean filters combined
  - Candidates sorted while filtered
- [ ] Test URL persistence:
  - Page reload preserves filters
  - Share URL applies filters correctly
  - Invalid URL params handled gracefully

**Commit:** `test(filters): verify range filter edge cases`

---

### Increment 11: Date-Specific Enhancements (Optional)
**Files:** `app/src/components/ui/date-range-picker.tsx` (new, optional)

- [ ] Consider date range picker alternative to slider for date/datetime types
- [ ] Evaluate UX trade-offs:
  - Slider: consistent UI, works for all types
  - Date picker: better precision, calendar visualization
- [ ] If implementing date picker:
  - Use shadcn Calendar component
  - Create DateRangePicker wrapper
  - Integrate into FilterDrawer for date/datetime attributes

**Commit:** `feat(filters): add date range picker (optional enhancement)`

---

## Implementation Order

1. **Increment 1** - State foundation (required for all subsequent work)
2. **Increment 2** - UI component (can be developed in parallel with 3-5)
3. **Increment 3** - Value normalization (required for filtering logic)
4. **Increment 4** - Label formatters (required for good UX)
5. **Increment 5** - Type identification (required for FilterDrawer)
6. **Increment 6** - FilterDrawer integration (brings it all together)
7. **Increment 7** - State management (makes filters functional)
8. **Increment 8** - Visual polish
9. **Increment 9** - URL persistence (important for shareability)
10. **Increment 10** - Testing and edge cases
11. **Increment 11** - Optional date picker enhancement

## Dependencies

- shadcn Slider component (verify installed or add)
- Existing value formatters in `app/src/components/values/`
- Existing filter infrastructure in `FilterPanel.tsx`

## Notes

- Range filters use OR logic with null handling (include OR exclude nulls)
- Range filters use AND logic with other filter types
- Debounce slider changes to prevent performance issues during drag
- Consider step size for different value types (integers: 1, decimals: 0.1, etc.)

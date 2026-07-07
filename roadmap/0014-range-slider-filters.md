# Milestone 14: Range Slider Filters
**Status:** Done

### Goals
- Add range slider filters for numeric and temporal attribute types
- Allow users to filter candidates by value ranges (min/max bounds)
- Provide intuitive UI for setting range boundaries

### Success Criteria
- [x] Range slider component with dual handles (min/max)
- [x] Filter support for numeric types:
  - [x] Integer attributes
  - [x] Decimal attributes
  - [x] Rating attributes
  - [x] Filesize attributes (with formatted labels)
  - [x] Duration attributes (with formatted labels)
  - [x] Percentage attributes
- [x] Filter support for temporal types:
  - [x] Date attributes
  - [x] DateTime attributes
- [x] Range bounds calculated from actual candidate values (dynamic min/max)
- [x] Clear button to reset range to full extent
- [x] Visual indication of narrowed range vs full range
- [x] Range filters integrated into filter dialog (organized by attribute group)
- [x] Range filter state persisted to URL
- [x] Candidates outside range are filtered out (greyed out, moved to end)
- [x] Null values handling: option to include/exclude candidates with null values

### Implementation Notes
- RangeSlider component built on shadcn Slider with dual handles
- DateRangePicker component for date/datetime types using shadcn Calendar
- Range values formatted per type (e.g., "1.2 MB - 5.6 GB" for filesize)
- URL format: `?filter.attrId=min,max` or `?filter.attrId=min,max,null` (null suffix = includeNull)
- Debounced slider changes to prevent performance issues
- Comprehensive test coverage (173 tests)

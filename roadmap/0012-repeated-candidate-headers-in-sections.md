# Milestone 12: Repeated Candidate Headers in Sections
**Status:** Done

### Goals
- Display candidate names at the top of each attribute group section
- Provide visual context for which candidate is which when scrolling through long comparisons
- Simpler alternative to sticky headers that avoids alignment issues

### Success Criteria
- [x] Each attribute group shows candidate names in a header row when expanded
- [x] Header row styling matches the main title row (same look and feel)
- [x] Header row collapses/expands with its attribute group
- [x] Works correctly with all existing features (sorting, filtering, highlighting)

### Implementation Notes
- Section header row inserted after group header, only visible when group is expanded
- Uses same styling as main title row: `bg-muted/30`, `font-semibold`, `text-center`
- Sticky left column maintained with `sticky left-0 z-10`

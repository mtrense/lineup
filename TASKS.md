# Milestone 7: Filtering and Sorting

## Overview
Add sorting and filtering capabilities to the comparison view, with visual highlighting of best/worst values.

---

## Increment 1: Sorting Infrastructure

### Tasks
1. **Add sort state to ComparisonView**
   - Add `sortAttribute: string | null` state
   - Add `sortDirection: 'asc' | 'desc'` state
   - Create `sortCandidates()` function that orders candidates by attribute value

2. **Implement value comparison logic**
   - Create `lib/compare.ts` with comparison functions for each value type:
     - `compareInteger(a, b)` - numeric comparison
     - `compareDecimal(a, b)` - numeric comparison
     - `comparePercentage(a, b)` - numeric comparison
     - `compareRating(a, b)` - numeric comparison
     - `compareFilesize(a, b)` - numeric comparison (bytes)
     - `compareDuration(a, b)` - numeric comparison (milliseconds)
     - `compareDate(a, b)` - date string comparison
     - `compareDatetime(a, b)` - datetime string comparison
     - `compareBoolean(a, b)` - true > false
     - `compareText(a, b)` - alphabetical comparison
   - Handle null/undefined values (always sort to end)

3. **Add sortable indicator to attribute headers**
   - Create clickable sort toggle on attribute name cells
   - Show sort direction icon (↑/↓) when sorted
   - Toggle between asc → desc → none on click

### Files to modify
- `app/src/components/ComparisonView.tsx`
- `app/src/lib/compare.ts` (new)

---

## Increment 2: Best Value Highlighting

### Tasks
1. **Create highlighting logic**
   - Add `findBestValue()` function to identify best value in a row
   - Respect attribute's `direction` property (ascending = higher is better, descending = lower is better)
   - Handle ties (multiple best values)
   - Skip highlighting for non-rankable types (text, tags, icon, link)
   - Skip highlighting when direction is "neutral"

2. **Add visual highlighting styles**
   - Create a subtle highlight style for best values (e.g., green background tint)
   - Ensure highlight is visible but not overwhelming
   - Consider accessibility (not color-only indication)

3. **Apply highlighting in AttributeRow**
   - Calculate best value index(es) for each row
   - Pass `isBest` prop to ValueRenderer or wrap in highlight container

### Files to modify
- `app/src/components/ComparisonView.tsx`
- `app/src/lib/compare.ts`
- `app/src/components/values/ValueRenderer.tsx` (or create wrapper)

---

## Increment 3: Filter by Tags

### Tasks
1. **Create FilterPanel component**
   - Display above or beside the candidate selector
   - Show available tags from all candidates for tag-type attributes
   - Allow multi-select of tags
   - Show active filter count

2. **Implement tag filtering logic**
   - Scan all candidates to extract unique tags per tag attribute
   - Filter candidates that have ANY of the selected tags (OR logic)
   - Update `visibleCandidates` based on tag filters

3. **Add filter state management**
   - Add `tagFilters: Map<attributeId, Set<tagId>>` state
   - Persist filter state to URL (optional, may be complex)

4. **Grey out filtered candidates in selector**
   - Instead of hiding filtered candidates, show them greyed out
   - Move filtered candidates to end of selector list
   - Allow clicking to still toggle selection

### Files to modify
- `app/src/components/ComparisonView.tsx`
- `app/src/components/FilterPanel.tsx` (new)

---

## Increment 4: Filter by Boolean Attributes

### Tasks
1. **Extend FilterPanel for boolean filters**
   - List boolean attributes with tri-state toggle (any / true / false)
   - Show attribute name with current filter state

2. **Implement boolean filtering logic**
   - Filter candidates where boolean attribute matches filter value
   - Combine with tag filters (AND logic between different filter types)

3. **Update greyed-out candidate logic**
   - Apply same grey-out treatment as tag filters
   - Combined filtering should work together

### Files to modify
- `app/src/components/FilterPanel.tsx`
- `app/src/components/ComparisonView.tsx`

---

## Increment 5: Polish and Integration

### Tasks
1. **Ensure URL state for sorting**
   - Add `sort` and `sortDir` query params
   - Restore sort state from URL on page load

2. **Add clear filters button**
   - Quick way to reset all filters
   - Show only when filters are active

3. **Test all value types**
   - Verify sorting works for all numeric types
   - Verify highlighting respects direction
   - Verify filters work correctly

4. **Update documentation**
   - Update README with new features
   - Mark milestone as done in ROADMAP.md

### Files to modify
- `app/src/pages/ComparisonPage.tsx`
- `app/src/components/ComparisonView.tsx`
- `README.md`
- `ROADMAP.md`

---

## Implementation Notes

### Sorting Priority
- Null values always sort to the end regardless of direction
- For ties, maintain original order (stable sort)

### Rankable Value Types
The following types support ranking/comparison:
- `integer` (direction: ascending | descending | neutral)
- `decimal` (direction: ascending | descending | neutral)
- `percentage` (direction: ascending | descending)
- `rating` (direction: ascending | descending)
- `filesize` (direction: ascending | descending)
- `duration` (direction: ascending | descending)
- `date` (direction: ascending | descending)
- `datetime` (direction: ascending | descending)
- `boolean` (can be sorted: true before false or vice versa)

Non-rankable types (no highlighting):
- `text`
- `tags`
- `icon`
- `link`

### Filter Interaction
- Filtered candidates appear greyed out in selector, moved to end
- Filtered candidates are NOT removed from the comparison table
- User can still manually select/deselect filtered candidates
- Sorting applies to visible candidates only

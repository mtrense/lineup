# Milestone 10: Attribute Descriptions and Expandable Rows

## Overview

Replace value tooltips with expandable attribute rows that show descriptions, sources, and comments inline. Multiple rows can be expanded simultaneously, and the expanded content spans all candidate columns.

## Design Decisions

- **Multiple rows can be expanded at the same time** (independent toggle state per row)
- **The whole row expands together**, showing details for the attribute and all candidates simultaneously
- **Expand icon mirrors attribute group chevrons** (ChevronRight → ChevronDown)
- **Only rows with expandable content show the indicator** (has description, or any candidate has source/comment)

## Current State Analysis

### Already Implemented
- `Attribute.description` field already exists in types (`app/src/types/attributes.ts:82`)
- Attribute groups use ChevronDown/ChevronRight icons from lucide-react
- ValueWithTooltip wraps values with source/comment in hover tooltips
- Keyboard accessibility patterns established (Enter/Space toggles)

### Files to Modify
1. `app/src/components/ComparisonView.tsx` - Main comparison table with AttributeRow
2. `app/src/components/values/ValueWithTooltip.tsx` - Remove tooltip, keep content formatting
3. `app/src/components/values/ValueRenderer.tsx` - Pass through source/comment differently

---

## Implementation Increments

### Increment 1: Add Expanded Rows State Management
**Files:** `app/src/components/ComparisonView.tsx`

Tasks:
- [ ] Add `expandedRows` state (Set of attribute IDs) similar to `expandedGroups`
- [ ] Create `toggleRow(attributeId)` function
- [ ] Create helper `hasExpandableContent(attribute, candidates)` that returns true if:
  - `attribute.description` exists, OR
  - Any candidate has `source` or `comment` for this attribute

**Commit:** `feat(ui): add expanded rows state management`

---

### Increment 2: Add Expand Indicator to Attribute Rows
**Files:** `app/src/components/ComparisonView.tsx`

Tasks:
- [ ] Modify the attribute name cell in AttributeRow to include chevron icon
- [ ] Show ChevronRight when collapsed, ChevronDown when expanded
- [ ] Only show chevron if `hasExpandableContent()` returns true
- [ ] Position chevron to the left of the attribute name (before sort button if sortable)
- [ ] Add subtle styling: `text-muted-foreground` for chevron, smaller than group chevrons
- [ ] Make the chevron clickable (or the whole attribute name area)

**Commit:** `feat(ui): add expand indicator to attribute rows`

---

### Increment 3: Implement Expandable Content Row
**Files:** `app/src/components/ComparisonView.tsx`

Tasks:
- [ ] After each AttributeRow, conditionally render an expanded content row
- [ ] Only render when `expandedRows.has(attribute.id)` is true
- [ ] Structure the expanded row:
  - First cell (attribute column): Show attribute description if present
  - Remaining cells (one per candidate): Show source links and comments
- [ ] Style the expanded row:
  - Subtle background differentiation (e.g., `bg-muted/30`)
  - Smaller text for metadata
  - Left border or indent to show hierarchy
- [ ] Animate with CSS transition (match group expand animation if any)

**Commit:** `feat(ui): implement expandable content row`

---

### Increment 4: Add Keyboard Accessibility
**Files:** `app/src/components/ComparisonView.tsx`

Tasks:
- [ ] Add `tabIndex={0}` to expandable row triggers
- [ ] Add `onKeyDown` handler for Enter/Space to toggle expansion
- [ ] Add ARIA attributes:
  - `role="button"` on the expand trigger
  - `aria-expanded` reflecting current state
  - `aria-controls` pointing to expanded content row ID
- [ ] Add `id` to expanded content row for aria-controls reference

**Commit:** `feat(ui): add keyboard accessibility to expandable rows`

---

### Increment 5: Remove Tooltip from Values
**Files:**
- `app/src/components/values/ValueWithTooltip.tsx`
- `app/src/components/values/ValueRenderer.tsx`

Tasks:
- [ ] Modify ValueWithTooltip to no longer wrap content in Tooltip
- [ ] Keep the visual indicator (dotted underline) for values with source/comment
- [ ] ValueRenderer continues to pass source/comment to ValueWithTooltip for indicator styling
- [ ] Consider renaming ValueWithTooltip to ValueWithIndicator or similar
- [ ] Remove Tooltip import if no longer used

**Commit:** `refactor(ui): replace value tooltips with expand indicators`

---

### Increment 6: Style and Polish
**Files:** `app/src/components/ComparisonView.tsx`

Tasks:
- [ ] Ensure expanded row content is well-formatted:
  - Source URLs as clickable links with ExternalLink icon (reuse existing pattern)
  - Comments as italic or muted text
  - Proper spacing between elements
- [ ] Test with various content lengths (long descriptions, multiple sources)
- [ ] Verify dark mode styling
- [ ] Ensure print styles work with expanded rows
- [ ] Test responsive behavior

**Commit:** `style(ui): polish expandable row styling`

---

### Increment 7: Update Documentation and Data
**Files:**
- `CLAUDE.md` - If any schema clarifications needed
- `data/databases/attributes.json` - Add sample descriptions to validate feature

Tasks:
- [ ] Add descriptions to a few attributes in the databases comparison as examples
- [ ] Verify the feature works end-to-end with real data
- [ ] Update ROADMAP.md to mark milestone as Done

**Commit:** `docs: add sample attribute descriptions and mark milestone done`

---

## Testing Checklist

- [ ] Clicking chevron expands/collapses row
- [ ] Multiple rows can be expanded simultaneously
- [ ] Rows without expandable content show no chevron
- [ ] Keyboard navigation works (Tab to reach, Enter/Space to toggle)
- [ ] Screen readers announce expand/collapse state
- [ ] Expanded content displays correctly:
  - Attribute description in first column
  - Per-candidate sources and comments in respective columns
- [ ] Values with sources still show visual indicator (underline)
- [ ] Dark mode renders correctly
- [ ] Printing includes expanded content appropriately
- [ ] No tooltip appears on hover (old behavior removed)

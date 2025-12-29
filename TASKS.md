# Milestone 13: Filter Dialog Organization

## Overview

Reorganize the filter dialog to display filters grouped by their attribute groups (as defined in `attributes.json`) rather than by filter type (tags first, then booleans).

## Current State

In `FilterPanel.tsx`:
- `tagAttributes` and `booleanAttributes` are computed separately by iterating through all groups
- Filters are rendered in two sections: all tag filters first, then all boolean filters
- No grouping or section headers in the dialog

## Tasks

### Increment 1: Refactor filter data structure to preserve group information

**Files:** `app/src/components/FilterPanel.tsx`

- [ ] Create a new data structure `FilterableGroup` that contains:
  - Group metadata (id, name, icon)
  - List of filterable attributes within that group (both tags and booleans)
- [ ] Replace separate `tagAttributes` and `booleanAttributes` memos with a single `filterableGroups` memo
- [ ] Ensure the new structure maintains original attribute order within each group
- [ ] Only include groups that have at least one filterable attribute

### Increment 2: Update render logic to display filters by group

**Files:** `app/src/components/FilterPanel.tsx`

- [ ] Add group headers to visually separate filter sections
- [ ] Render filters in group order (matching attributes.json structure)
- [ ] Within each group, render filters in their original attribute order (mixed tags and booleans)
- [ ] Style group headers to match existing UI patterns (similar to attribute group headers in comparison view)

### Increment 3: Polish and visual refinements

**Files:** `app/src/components/FilterPanel.tsx`

- [ ] Add subtle visual separation between groups (spacing, dividers, or background)
- [ ] Ensure consistent spacing within and between groups
- [ ] Verify keyboard navigation still works correctly
- [ ] Test with multiple comparison types to ensure layout works well

### Increment 4: Update ROADMAP and commit

**Files:** `ROADMAP.md`, `TASKS.md`

- [ ] Mark milestone as Done in ROADMAP.md
- [ ] Move TASKS.md to `docs/archive/MILESTONE-13.md`
- [ ] Final commit

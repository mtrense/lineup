# Milestone 13: Filter Dialog Organization

## Overview

Reorganize the filter dialog to display filters grouped by their attribute groups (as defined in `attributes.json`) rather than by filter type (tags first, then booleans).

## Previous State

In `FilterPanel.tsx`:
- `tagAttributes` and `booleanAttributes` were computed separately by iterating through all groups
- Filters were rendered in two sections: all tag filters first, then all boolean filters
- No grouping or section headers in the dialog

## Tasks

### Increment 1: Refactor filter data structure to preserve group information

**Files:** `app/src/components/FilterPanel.tsx`

- [x] Create a new data structure `FilterableGroup` that contains:
  - Group metadata (id, name, icon)
  - List of filterable attributes within that group (both tags and booleans)
- [x] Replace separate `tagAttributes` and `booleanAttributes` memos with a single `filterableGroups` memo
- [x] Ensure the new structure maintains original attribute order within each group
- [x] Only include groups that have at least one filterable attribute

### Increment 2: Update render logic to display filters by group

**Files:** `app/src/components/FilterPanel.tsx`

- [x] Add group headers to visually separate filter sections
- [x] Render filters in group order (matching attributes.json structure)
- [x] Within each group, render filters in their original attribute order (mixed tags and booleans)
- [x] Style group headers to match existing UI patterns (similar to attribute group headers in comparison view)

### Increment 3: Polish and visual refinements

**Files:** `app/src/components/FilterPanel.tsx`

- [x] Add subtle visual separation between groups (dividers)
- [x] Ensure consistent spacing within and between groups
- [x] Verify keyboard navigation still works correctly
- [x] Test with multiple comparison types to ensure layout works well

### Increment 4: Update ROADMAP and commit

**Files:** `ROADMAP.md`, `TASKS.md`

- [x] Mark milestone as Done in ROADMAP.md
- [x] Move TASKS.md to `docs/archive/MILESTONE-13.md`
- [x] Final commit

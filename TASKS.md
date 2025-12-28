# Milestone 12: Repeated Candidate Headers in Sections

## Overview

Add candidate name headers at the top of each attribute group section, matching the main title row's look and feel. This provides visual context for which candidate is which when scrolling through long comparisons, without the technical complexity of sticky headers.

## Implementation Tasks

### Task 1: Add Section Header Row to Attribute Groups

**Files:** `app/src/components/ComparisonView.tsx`

**Changes:**
1. After the group header row (the collapsible row with the group name), insert a new `TableRow` that displays candidate names
2. The row should only render when the group is expanded (inside the `expandedGroups.has(group.id)` conditional)
3. Structure mirrors the main header:
   - First cell: Empty or light label (e.g., just spacing to align with attribute column)
   - Remaining cells: One `TableHead` per visible candidate with their name

**Styling (match main title row):**
- Use `bg-muted/30` background (same as main header)
- Apply `sticky left-0 z-10` to the first cell
- Use `text-center font-semibold` for candidate names
- Include `border-b border-border` for visual separation

**Commit:** `feat(ui): add repeated candidate headers in attribute group sections`

---

### Task 2: Update Milestone Status

**Files:** `ROADMAP.md`

**Changes:**
1. Mark all success criteria as complete
2. Update milestone status to "Done"
3. Move `TASKS.md` to `docs/archive/MILESTONE-12.md`

**Commit:** `docs: complete milestone 12`

---

## Technical Notes

- The main header row is at lines 357-371 in ComparisonView.tsx
- Group iteration happens at lines 373-425
- The section header should be inserted right after the group header row but inside the expansion conditional
- `visibleCandidates` array provides the ordered list of candidates to display
- Existing z-index strategy (`z-10`) should be maintained for sticky left column

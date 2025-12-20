# Milestone 9: Enhanced Filter UI - Task Breakdown

## Overview
Improve the filter panel UI to provide clearer visual feedback through icons and colors for boolean filters, and a more intuitive pill/button group design for tag filters.

---

## Increment 1: Compact Boolean Filter with Tri-State Icons

### Tasks
1. Redesign boolean filter as a single compact row:
   - Remove separate headline
   - Single button/row showing: `[icon] Attribute Name`
   - Clicking cycles through states: Any → Yes → No → Any

2. Add lucide-react icons for the three states:
   - `Check` (checkmark) for Yes state
   - `Minus` or `Circle` for Any/No choice state (neutral indicator)
   - `X` (cross) for No state

3. Apply state-specific styling to the entire button:
   - Yes: Green tint (`bg-green-500/20 text-green-700 dark:text-green-400`)
   - Any: Grey/muted (`bg-muted text-muted-foreground`)
   - No: Red tint (`bg-red-500/20 text-red-700 dark:text-red-400`)

4. Ensure accessibility:
   - ARIA role and state attributes
   - Screen reader announces current state

### Files to modify
- `app/src/components/FilterPanel.tsx`

---

## Increment 2: Compact Tag Filter Pill Groups with Clear Button

### Tasks
1. Make tag filter layout more compact:
   - Keep headline but make it smaller/inline if possible
   - Horizontal pill group with clear button at the end
   - Consider putting attribute name as a label prefix inline with pills

2. Add clear button for each tag attribute:
   - Position on the far right of the pill group
   - Grey cross icon (`X` from lucide-react)
   - Only visible when at least one tag is selected
   - Clears all selected tags for that attribute

3. Maintain tag pill styling:
   - Selected: Primary color (existing)
   - Unselected: Muted background (existing)
   - Smaller pill size for compactness

4. Add appropriate ARIA labels for the clear button

### Files to modify
- `app/src/components/FilterPanel.tsx`

---

## Increment 3: Polish and Testing

### Tasks
1. Verify dark mode compatibility for all new colors
2. Test keyboard navigation through new controls
3. Ensure screen reader announces state changes correctly
4. Test filter functionality still works correctly:
   - URL state persistence
   - Filter logic (AND between attributes, OR within tags)
   - Candidate grey-out behavior
5. Update milestone status in ROADMAP.md

### Files to modify
- `app/src/components/FilterPanel.tsx` (any fixes)
- `ROADMAP.md` (status update)

---

## Commit Strategy
- Increment 1: `feat(ui): add tri-state icons and colors to boolean filters`
- Increment 2: `feat(ui): redesign tag filters as pill groups with clear buttons`
- Increment 3: `chore: polish filter UI and verify accessibility`

# Milestone 7: Filtering and Sorting
**Status:** Done

### Goals
- Enable filtering candidates by attribute values
- Support sorting by specific attributes
- Filtered candidates are greyed out and put to the back of the selection list
- Highlight best/worst values

### Success Criteria
- [x] Sort candidates by any sortable attribute
- [x] Visual ranking indicators based on direction
- [x] Filter candidates by tag values
- [x] Filter candidates by boolean attributes
- [x] Highlight best value in each row (respecting direction)

### Implementation Notes
- Sorting: Click attribute names to cycle through ascending → descending → none
- Highlighting: Best values get subtle green background, respects direction
- Tag filters: OR logic within attribute, AND between attributes
- Boolean filters: Tri-state (Any/Yes/No)
- Filtered candidates appear greyed out and moved to end of selector
- Sort state persisted to URL (`?sort=attribute-id&sortDir=asc|desc`)

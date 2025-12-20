# Lineup Roadmap

## Milestone 1: Project Foundation
**Status:** Done

### Goals
- Establish the React application with all tooling configured
- Create the data loading infrastructure
- Have a running development environment

### Success Criteria
- [x] `app/` directory with working Vite + React + TypeScript setup
- [x] pnpm configured as package manager
- [x] Tailwind CSS integrated and working
- [x] shadcn/ui installed with base components
- [x] Build compiles without errors
- [x] Dev server runs with hot module replacement
- [x] Basic routing structure in place (if needed)

---

## Milestone 2: Data Infrastructure
**Status:** Done

### Goals
- Implement compile-time JSON data loading
- Create TypeScript types matching the schema in CLAUDE.md
- Build data access utilities

### Success Criteria
- [x] TypeScript interfaces for all data types (Attribute, AttributeGroup, Candidate, etc.)
- [x] Vite plugin or import mechanism for loading JSON at build time
- [x] `data/index.json` created with comparisons array
- [x] Utility functions for accessing comparison data
- [x] Type-safe data access throughout the app

---

## Milestone 3: Core Comparison UI
**Status:** Done

### Goals
- Build the main comparison view components
- Display candidates side-by-side with their attribute values
- Support all value types defined in the schema

### Success Criteria
- [x] Comparison selection/landing page
- [x] Side-by-side candidate comparison layout
- [x] Collapsible attribute groups
- [x] Value renderers for all types:
  - [x] Integer (with direction indicators)
  - [x] Decimal (with direction indicators)
  - [x] Filesize (formatted display)
  - [x] Duration (formatted display)
  - [x] Text
  - [x] Boolean (checkmark/cross)
  - [x] Rating (configurable symbols)
  - [x] Tags (colored labels)
  - [x] Icon (FontAwesome support)
  - [x] Link (clickable URLs)
- [x] Responsive layout for different screen sizes

---

## Milestone 4: First Comparison Data
**Status:** Done

### Goals
- Add the first real comparison type with researched data
- Validate the data schema works in practice
- Provide a meaningful example for future comparisons

### Implemented Comparison Type
**Databases** - Chosen because:
- Well-documented with objective metrics
- Clear differentiating attributes (ACID compliance, query language, scaling model, etc.)
- Popular candidates are well-known (PostgreSQL, MySQL, MongoDB, SQLite, etc.)
- Mix of value types: booleans, tags, ratings, links, text

### Success Criteria
- [x] `data/databases/` directory created
- [x] `RESEARCH.md` with research guidelines
- [x] `attributes.json` with comprehensive attribute groups (6 groups, 25 attributes)
- [x] `index.json` listing initial candidates
- [x] 5 candidate JSON files with complete data (PostgreSQL, MySQL, SQLite, MongoDB, Redis)
- [x] Data displays correctly in the comparison UI
- [x] Sources provided for factual claims

---

## Milestone 5: Usability Improvements
**Status:** Done

### Goals
- Add URL-based routing for navigation and shareability
- Fix text rendering issues in comparison table
- Improve overall usability

### Success Criteria
- [x] Path-based routing (e.g., `/databases`, `/databases?candidates=postgresql,mysql`)
- [x] Browser back/forward navigation works correctly
- [x] Text values wrap properly in table cells
- [x] Long descriptions display readably
- [x] Deep links to specific comparisons work

---

## Milestone 6: Candidate Selection
**Status:** Done

### Goals
- Allow users to select which candidates to compare
- Support adding/removing candidates from comparison
- Remember selection state

### Success Criteria
- [x] Candidate picker/selector UI
- [x] Add/remove candidates from active comparison
- [x] Visual indication of selected candidates
- [x] Support comparing 2-N candidates
- [x] URL state for shareable comparisons

### Notes
This milestone was implemented as part of Milestone 5 work. The candidate selector with pill buttons, selection state management, and URL persistence were all built into the initial ComparisonView component.

---

## Milestone 7: Filtering and Sorting
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

---

## Milestone 8: Polish and UX
**Status:** Done

### Goals
- Refine the user experience
- Add helpful features for comparison workflows
- Ensure accessibility

### Success Criteria
- [x] Tooltips showing attribute descriptions
- [x] Source citations accessible (hover/click)
- [x] Keyboard navigation support
- [x] Dark mode support
- [x] Loading states and error handling
- [x] Empty states for missing data
- [x] Print-friendly view

### Implementation Notes
- Keyboard navigation: Focus rings on all interactive elements, skip-to-content link, ARIA attributes
- Loading: Skeleton component during data fetch, improved 404 error page
- Empty states: Styled null values with tooltip, empty comparison message
- Print: CSS media query hides navigation, adjusts table for printing

---

## Milestone 9: Enhanced Filter UI
**Status:** Done

### Goals
- Improve filter controls with clearer visual states
- Make boolean filters more intuitive with tri-state icons and colors
- Display tag filters as interactive pill/button groups
- Provide easy filter clearing per attribute

### Success Criteria
- [x] Boolean filters show distinct visual states:
  - Green with checkmark icon = Yes (filter for true)
  - Grey with minus icon = No choice (any value)
  - Red with cross icon = No (filter for false)
- [x] Tag filters displayed as pill/button groups (not toggle buttons)
- [x] Each tag filter group has a clear button (grey cross icon) on the far right
- [x] Filter states are visually distinct and accessible
- [x] Existing filter functionality preserved (URL state, filter logic)

### Implementation Notes
- Boolean filters: Single compact button per attribute that cycles through states on click
- Tag filters: Smaller pills with reduced padding, clear button appears when tags are selected
- Overall spacing reduced for a more compact filter panel

---

## Future Considerations (Not Scheduled)

- **Search**: Find candidates across all comparison types
- **Export**: Download comparison as CSV/PDF
- **Embed**: Shareable comparison widgets
- **User Contributions**: Suggest corrections or new candidates
- **Additional Comparison Types**: Languages, frameworks, cloud providers, etc.

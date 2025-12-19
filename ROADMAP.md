# Lineup Roadmap

## Milestone 1: Project Foundation
**Status:** Ready for implementation

### Goals
- Establish the React application with all tooling configured
- Create the data loading infrastructure
- Have a running development environment

### Success Criteria
- [ ] `app/` directory with working Vite + React + TypeScript setup
- [ ] pnpm configured as package manager
- [ ] Tailwind CSS integrated and working
- [ ] shadcn/ui installed with base components
- [ ] Build compiles without errors
- [ ] Dev server runs with hot module replacement
- [ ] Basic routing structure in place (if needed)

---

## Milestone 2: Data Infrastructure
**Status:** Not planned

### Goals
- Implement compile-time JSON data loading
- Create TypeScript types matching the schema in CLAUDE.md
- Build data access utilities

### Success Criteria
- [ ] TypeScript interfaces for all data types (Attribute, AttributeGroup, Candidate, etc.)
- [ ] Vite plugin or import mechanism for loading JSON at build time
- [ ] `data/index.json` created with empty comparisons array
- [ ] Utility functions for accessing comparison data
- [ ] Type-safe data access throughout the app

---

## Milestone 3: Core Comparison UI
**Status:** Not planned

### Goals
- Build the main comparison view components
- Display candidates side-by-side with their attribute values
- Support all value types defined in the schema

### Success Criteria
- [ ] Comparison selection/landing page
- [ ] Side-by-side candidate comparison layout
- [ ] Collapsible attribute groups
- [ ] Value renderers for all types:
  - [ ] Integer (with direction indicators)
  - [ ] Decimal (with direction indicators)
  - [ ] Filesize (formatted display)
  - [ ] Duration (formatted display)
  - [ ] Text
  - [ ] Boolean (checkmark/cross)
  - [ ] Rating (configurable symbols)
  - [ ] Tags (colored labels)
  - [ ] Icon (FontAwesome support)
  - [ ] Link (clickable URLs)
- [ ] Responsive layout for different screen sizes

---

## Milestone 4: First Comparison Data 🎯
**Status:** Not planned

### Goals
- Add the first real comparison type with researched data
- Validate the data schema works in practice
- Provide a meaningful example for future comparisons

### Recommended First Comparison Type
**Databases** - A good choice because:
- Well-documented with objective metrics
- Clear differentiating attributes (ACID compliance, query language, scaling model, etc.)
- Popular candidates are well-known (PostgreSQL, MySQL, MongoDB, SQLite, etc.)
- Mix of value types: booleans, tags, ratings, links, text

### Success Criteria
- [ ] `data/databases/` directory created
- [ ] `RESEARCH.md` with research guidelines
- [ ] `attributes.json` with comprehensive attribute groups
- [ ] `index.json` listing initial candidates
- [ ] At least 4-5 candidate JSON files with complete data
- [ ] Data displays correctly in the comparison UI
- [ ] Sources provided for factual claims

---

## Milestone 5: Candidate Selection
**Status:** Not planned

### Goals
- Allow users to select which candidates to compare
- Support adding/removing candidates from comparison
- Remember selection state

### Success Criteria
- [ ] Candidate picker/selector UI
- [ ] Add/remove candidates from active comparison
- [ ] Visual indication of selected candidates
- [ ] Support comparing 2-N candidates
- [ ] URL state for shareable comparisons (optional)

---

## Milestone 6: Filtering and Sorting
**Status:** Not planned

### Goals
- Enable filtering candidates by attribute values
- Support sorting by specific attributes
- Highlight best/worst values

### Success Criteria
- [ ] Sort candidates by any sortable attribute
- [ ] Visual ranking indicators based on direction
- [ ] Filter candidates by tag values
- [ ] Filter candidates by boolean attributes
- [ ] Highlight best value in each row (respecting direction)

---

## Milestone 7: Polish and UX
**Status:** Not planned

### Goals
- Refine the user experience
- Add helpful features for comparison workflows
- Ensure accessibility

### Success Criteria
- [ ] Tooltips showing attribute descriptions
- [ ] Source citations accessible (hover/click)
- [ ] Keyboard navigation support
- [ ] Dark mode support
- [ ] Loading states and error handling
- [ ] Empty states for missing data
- [ ] Print-friendly view (optional)

---

## Future Considerations (Not Scheduled)

- **Search**: Find candidates across all comparison types
- **Export**: Download comparison as CSV/PDF
- **Embed**: Shareable comparison widgets
- **User Contributions**: Suggest corrections or new candidates
- **Additional Comparison Types**: Languages, frameworks, cloud providers, etc.

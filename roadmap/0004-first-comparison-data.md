# Milestone 4: First Comparison Data
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

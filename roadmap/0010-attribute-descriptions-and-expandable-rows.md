# Milestone 10: Attribute Descriptions and Expandable Rows
**Status:** Done

### Goals
- Add optional descriptions to attributes for more context on what's being assessed
- Replace value tooltips with an expandable row behavior for better discoverability and readability
- Provide a consistent UX pattern matching the existing group collapse behavior

### Success Criteria
- [x] `Attribute` interface extended with optional `description?: string` field
- [x] Expandable rows indicated by subtle angle icon on the left (similar to attribute groups)
- [x] Clicking a row expands to show:
  - Attribute description (if present)
  - Source citations (if present)
  - Value comments (if present)
- [x] Expanded state visually distinct but unobtrusive
- [x] Only rows with additional content (description, sources, or comments) show expand indicator
- [x] Tooltips removed in favor of expand behavior
- [x] Keyboard accessible (Enter/Space to toggle expand)
- [x] Animation consistent with group collapse/expand

### Implementation Notes
- Multiple rows can be expanded simultaneously (independent state per row)
- Chevron icon (ChevronRight/ChevronDown) mirrors attribute group pattern
- Expanded content row shows attribute description in first column, per-candidate sources/comments in remaining columns
- Values with metadata still show dotted underline visual indicator

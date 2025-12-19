# Milestone 5: Usability Improvements

## Tasks

### 1. Fix Text Wrapping in Table Cells
- [x] Update TextRenderer to allow text wrapping
- [x] Ensure long descriptions wrap within cell bounds
- [x] Test with database descriptions

### 2. Add Path-Based Routing
- [x] Install react-router-dom (if not present)
- [x] Create route structure: `/` (home), `/:comparisonId` (comparison view)
- [x] Update App.tsx to use router
- [x] Update navigation to use router links
- [x] Ensure browser back/forward works

### 3. Add URL State for Candidate Selection
- [x] Sync selected candidates to URL query params (e.g., `?candidates=postgresql,mysql`)
- [x] Read initial selection from URL on page load
- [x] Update URL when selection changes (without full page reload)
- [x] Handle invalid candidate IDs gracefully

### 4. Testing
- [x] Verify text wrapping with all databases
- [x] Test deep links work correctly
- [x] Test browser navigation (back/forward)
- [x] Ensure app still works without query params

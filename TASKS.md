# Milestone 5: Usability Improvements

## Tasks

### 1. Fix Text Wrapping in Table Cells
- [ ] Update TextRenderer to allow text wrapping
- [ ] Ensure long descriptions wrap within cell bounds
- [ ] Test with database descriptions

### 2. Add Path-Based Routing
- [ ] Install react-router-dom (if not present)
- [ ] Create route structure: `/` (home), `/:comparisonId` (comparison view)
- [ ] Update App.tsx to use router
- [ ] Update navigation to use router links
- [ ] Ensure browser back/forward works

### 3. Add URL State for Candidate Selection
- [ ] Sync selected candidates to URL query params (e.g., `?candidates=postgresql,mysql`)
- [ ] Read initial selection from URL on page load
- [ ] Update URL when selection changes (without full page reload)
- [ ] Handle invalid candidate IDs gracefully

### 4. Testing
- [ ] Verify text wrapping with all databases
- [ ] Test deep links work correctly
- [ ] Test browser navigation (back/forward)
- [ ] Ensure app still works without query params

# Tasks - Milestone 2: Data Infrastructure

## 1. Create TypeScript types for data schema
- [ ] Create `src/types/attributes.ts` with value type definitions (Integer, Decimal, Filesize, Duration, Rating, Tags, Icon)
- [ ] Create `src/types/attributes.ts` with Attribute, AttributeGroup, and AttributesFile interfaces
- [ ] Create `src/types/candidate.ts` with AttributeValue and CandidateFile interfaces
- [ ] Create `src/types/comparison.ts` with ComparisonType interface
- [ ] Create `src/types/index.ts` to export all types

## 2. Set up data directory structure
- [ ] Create `data/` directory at project root
- [ ] Create `data/index.json` with empty comparisons array
- [ ] Add data directory to Vite's static asset handling

## 3. Configure JSON imports in Vite
- [ ] Update `tsconfig.json` to enable JSON imports with `resolveJsonModule`
- [ ] Configure Vite to handle JSON files from the data directory
- [ ] Create type declarations for JSON imports if needed

## 4. Create data loading utilities
- [ ] Create `src/lib/data.ts` with functions to load comparison data
- [ ] Implement `getComparisons()` to list available comparison types
- [ ] Implement `getComparisonData(type)` to load a specific comparison
- [ ] Implement `getAttributes(type)` to load attributes for a comparison type
- [ ] Implement `getCandidates(type)` to load all candidates for a comparison

## 5. Create sample data for testing
- [ ] Create a minimal test comparison type (e.g., `data/test/`)
- [ ] Add `data/test/attributes.json` with a few sample attributes
- [ ] Add `data/test/index.json` listing test candidates
- [ ] Add sample candidate files with test data

## 6. Verify type safety
- [ ] Ensure all data loading functions return properly typed data
- [ ] Add runtime validation for loaded JSON (optional but recommended)
- [ ] Verify TypeScript catches type errors in data access

## 7. Update App to demonstrate data loading
- [ ] Import and display available comparison types
- [ ] Show that data loads correctly at runtime
- [ ] Verify build still works with data imports

## 8. Final verification and commit
- [ ] All TypeScript types match CLAUDE.md schema
- [ ] JSON imports work in dev and production builds
- [ ] Data loading utilities are type-safe
- [ ] Commit with message: "feat: add data infrastructure with TypeScript types"

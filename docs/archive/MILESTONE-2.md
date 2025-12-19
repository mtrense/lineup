# Tasks - Milestone 2: Data Infrastructure

## 1. Create TypeScript types for data schema
- [x] Create `src/types/attributes.ts` with value type definitions (Integer, Decimal, Filesize, Duration, Rating, Tags, Icon)
- [x] Create `src/types/attributes.ts` with Attribute, AttributeGroup, and AttributesFile interfaces
- [x] Create `src/types/candidate.ts` with AttributeValue and CandidateFile interfaces
- [x] Create `src/types/comparison.ts` with ComparisonType interface
- [x] Create `src/types/index.ts` to export all types

## 2. Set up data directory structure
- [x] Create `data/` directory at project root
- [x] Create `data/index.json` with comparisons array
- [x] Add data directory to Vite's alias handling (@data)

## 3. Configure JSON imports in Vite
- [x] Update `tsconfig.json` to enable JSON imports with `resolveJsonModule`
- [x] Configure Vite path alias for data directory
- [x] Update tsconfig paths for @data alias

## 4. Create data loading utilities
- [x] Create `src/lib/data.ts` with functions to load comparison data
- [x] Implement `getComparisons()` to list available comparison types
- [x] Implement `getComparisonData(type)` to load a specific comparison
- [x] Implement `getAttributes(type)` to load attributes for a comparison type
- [x] Implement `getAllCandidates(type)` to load all candidates for a comparison

## 5. Create sample data for testing
- [x] Create a minimal test comparison type (`data/test/`)
- [x] Add `data/test/attributes.json` with sample attributes
- [x] Add `data/test/index.json` listing test candidates
- [x] Add sample candidate files (alpha.json, beta.json) with test data

## 6. Verify type safety
- [x] Ensure all data loading functions return properly typed data
- [x] Verify TypeScript catches type errors in data access

## 7. Update App to demonstrate data loading
- [x] Import and display available comparison types
- [x] Show that data loads correctly at runtime
- [x] Verify build still works with data imports

## 8. Final verification and commit
- [x] All TypeScript types match CLAUDE.md schema
- [x] JSON imports work in dev and production builds
- [x] Data loading utilities are type-safe
- [x] Commit with message: "feat: add data infrastructure with TypeScript types"

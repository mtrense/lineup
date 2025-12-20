# Task: Add `shownByDefault` Field to Candidate Index

## Overview

Implement Option 3: Enhanced candidate list in `index.json` where each candidate is an object with `id` and `shownByDefault` properties. This allows controlling which candidates are visible by default when a comparison loads.

## Current State

- `data/<comparison-type>/index.json` uses a simple string array: `{ "candidates": ["slate", "lexical", ...] }`
- `CandidateIndex` type in `app/src/types/comparison.ts` expects `candidates: string[]`
- `getAllCandidates()` in `app/src/lib/data.ts` iterates over the string array
- `ComparisonView` defaults to all candidates selected via `new Set(candidates.map((c) => c.name))`

## Target State

- `data/<comparison-type>/index.json` uses an object array:
  ```json
  {
    "candidates": [
      { "id": "slate", "shownByDefault": true },
      { "id": "lexical", "shownByDefault": false }
    ]
  }
  ```
- Type definitions updated to reflect the new structure
- Data loading extracts candidate IDs correctly
- `ComparisonView` initializes selection based on `shownByDefault`

## Increments

### Increment 1: Update Type Definitions

**Files:** `app/src/types/comparison.ts`

- [x] Add `CandidateEntry` interface with `id: string` and `shownByDefault: boolean`
- [x] Update `CandidateIndex` to use `candidates: CandidateEntry[]`

### Increment 2: Update Data Loading

**Files:** `app/src/lib/data.ts`

- [x] Modify `getAllCandidates()` to extract `id` from candidate entries
- [x] Add new function `getCandidateIndex()` or modify existing to return full index with `shownByDefault` info
- [x] Update `getComparisonData()` to include `shownByDefault` metadata alongside candidates

### Increment 3: Update ComparisonView Initial Selection

**Files:** `app/src/components/ComparisonView.tsx`, `app/src/pages/ComparisonPage.tsx`

- [ ] Modify props or data flow to pass `shownByDefault` information
- [ ] Update initial `selectedCandidates` state to use `shownByDefault` when no URL selection is present
- [ ] Ensure URL-based selection still overrides `shownByDefault`

### Increment 4: Migrate Existing Data Files

**Files:** `data/*/index.json` (3 files: databases, rich-text-editors, test)

- [ ] Convert `data/databases/index.json` to new format (all `shownByDefault: true` for backward compatibility)
- [ ] Convert `data/rich-text-editors/index.json` to new format (select prominent editors as default)
- [ ] Convert `data/test/index.json` to new format

### Increment 5: Update Documentation

**Files:** `CLAUDE.md`

- [ ] Update the `CandidateIndex` schema documentation to reflect new structure
- [ ] Add explanation of `shownByDefault` behavior

## Notes

- Backward compatibility: During migration, existing simple string arrays could be supported, but it's cleaner to migrate all files at once
- URL state takes precedence: If `initialSelection` is provided from URL, it should override `shownByDefault`
- Default behavior when all `shownByDefault` are false: Show all (prevents empty initial view)

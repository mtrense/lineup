# TypeScript Build Errors — Fix Plan

Running `pnpm --dir app build` currently fails during `tsc -b` with 33 errors. They fall into **four** independent buckets. Each bucket can be fixed and committed on its own.

**State legend:** `todo` = not started · `in-progress` = started, not finished · `done` = fix landed and verified green · `blocked` = waiting on something (note why) · `skipped` = intentionally not doing (note why).

When resuming a session, update the `State:` line on each task and, if `done`, add a `Commit:` line with the SHA.

---

## Bucket 1 — Unused imports/bindings (TS6133)

**State:** todo

Easy, mechanical fixes. Just remove the unused symbols.

### Task 1.1 — `ComparisonView.lastVerified.test.tsx`
- **State:** todo
- **File:** `app/src/components/ComparisonView.lastVerified.test.tsx`
- **Errors:**
  - L2: `'within'` imported from `@testing-library/react` but never used.
  - L53: `const threeEntries: CandidateEntry[]` declared but never read (the `renderView` helper at L64 rebuilds entries from `candidates`, so the top-level constant is dead).
- **Fix:**
  - Remove `within` from the import list at L2.
  - Remove the `threeEntries` declaration (L53–57). Also remove the now-unused `CandidateEntry` type import if it has no other consumers in this file (check L6).

### Task 1.2 — `FilterPanel.integration.test.ts`
- **State:** todo
- **File:** `app/src/components/FilterPanel.integration.test.ts`
- **Errors:**
  - L7: `RangeFilter` type imported but unused.
  - L8: `TagFilter` type imported but unused.
  - L9: `BooleanFilter` type imported but unused.
- **Fix:** Drop these three type re-imports from the `import {…}` block at L2–10. The runtime helpers (`candidatePassesFilters`, `getActiveFilterCount`, `emptyFilterState`) plus `FilterState` are all that's actually referenced.

---

## Bucket 2 — `vi.fn()` inferred as untyped `Mock` in `FilterPanel.test.tsx` (TS2322, ×18)

- **State:** todo
- **File:** `app/src/components/FilterPanel.test.tsx`
- **Lines:** 97, 132, 165, 190, 212, 246, 275, 318, 363, 395, 425, 452, 475, 511, 590, 629 (all instances where `mockOnFilterChange` is passed as `onFilterChange`)
- **Root cause:** L14 declares
  ```ts
  let mockOnFilterChange: ReturnType<typeof vi.fn>;
  ```
  With current vitest type definitions, `ReturnType<typeof vi.fn>` resolves to `Mock<Procedure | Constructable>`, which TS refuses to assign to the typed prop `onFilterChange: (state: FilterState) => void` (`FilterPanel.tsx:64`).
- **Fix (preferred):** Parameterize the mock with the expected call signature so the declared type matches the prop.
  ```ts
  let mockOnFilterChange: Mock<(state: FilterState) => void>;
  ```
  (Import `Mock` from `vitest`.) Assignment at L82 stays `mockOnFilterChange = vi.fn();` — `vi.fn()` will infer `Mock<() => void>` which is assignable to the broader parameterized type, but if TS complains, use `vi.fn<(state: FilterState) => void>()` to pin the signature.
- **Alternative fix:** Change the declaration to the raw callback type and drop the `ReturnType<…>` wrapper entirely:
  ```ts
  let mockOnFilterChange: (state: FilterState) => void;
  ```
  This loses mock-introspection helpers (`.mock.calls`, etc.). Only choose this if those helpers are never used in the file — grep before deciding.
- **Scope note:** Only `mockOnFilterChange` needs the change; the other locally-typed mocks in the file already compile.

---

## Bucket 3 — `ValueType` union missing `date` / `datetime` members (TS2322, ×8)

- **State:** todo
- **File with errors:** `app/src/lib/range-utils.test.ts` (lines 34, 35, 61, 62, 63, 64, 122, 447)
- **Root cause:** `app/src/types/attributes.ts` defines the `ValueType` union (L63–74) without any `DateType` or `DateTimeType` members, yet:
  - `CLAUDE.md` documents both as first-class value types.
  - `app/src/lib/range-utils.ts` references them in `RANGEABLE_TYPES`, `DATE_TYPES`, and `getNumericValue` / `formatRangeLabel` switch statements.
  - The test file constructs literal `{ type: "date", direction: "ascending" }` values and assigns them to `ValueType`.
  The compiler is correct — the runtime already expects these types, the type definition just hasn't caught up.
- **Fix:** Add `DateType` and `DateTimeType` interfaces to `app/src/types/attributes.ts` and include them in the `ValueType` union. Suggested shape (matches `CLAUDE.md` and `CandidateFile.lastVerified` storage convention):
  ```ts
  export interface DateType {
    type: "date";
    direction: "ascending" | "descending";
    format?: "year" | "month-year" | "full"; // default "full"
  }

  export interface DateTimeType {
    type: "datetime";
    direction: "ascending" | "descending";
  }
  ```
  Then extend the union:
  ```ts
  export type ValueType =
    | IntegerType
    | DecimalType
    | FilesizeType
    | DurationType
    | PercentageType
    | DateType
    | DateTimeType
    | "text"
    | "boolean"
    | RatingType
    | TagsType
    | IconType
    | "link";
  ```
- **Ripple check:** After adding these, walk any `switch`/`if` that narrows on `valueType.type` and confirm `date` / `datetime` cases don't produce new "not exhaustive" or "possibly unhandled" errors. `range-utils.ts` already handles them; the renderer/formatter paths (`ValueCell`, sorting utilities, filter panel rendering) need a quick audit.

---

## Bucket 4 — Verification

**State:** todo

1. Re-run `pnpm --dir app build` — expect clean `tsc -b` + successful `vite build`.
2. Re-run `pnpm --dir app test` to make sure no behavior regressed when `ValueType` widened (the new date/datetime members might unmask missing cases elsewhere).

---

## Suggested commit order

1. **Bucket 1** (`chore(tests): drop unused imports and dead bindings`) — zero-risk.
2. **Bucket 2** (`fix(tests): type mockOnFilterChange with Mock<(state: FilterState) => void>`) — isolated to one test file.
3. **Bucket 3** (`feat(types): add Date and DateTime to ValueType union`) — biggest surface; do a repo-wide grep for `valueType.type` narrowing after landing.
4. Follow with Bucket 4 verification, then a `/commit` per increment.

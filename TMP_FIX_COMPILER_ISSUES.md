# TypeScript Build Errors — Fix Plan

Running `pnpm --dir app build` currently fails during `tsc -b` with 33 errors. They fall into **four** independent buckets. Each bucket can be fixed and committed on its own.

**State legend:** `todo` = not started · `in-progress` = started, not finished · `done` = fix landed and verified green · `blocked` = waiting on something (note why) · `skipped` = intentionally not doing (note why).

When resuming a session, update the `State:` line on each task and, if `done`, add a `Commit:` line with the SHA.

---

## Bucket 1 — Unused imports/bindings (TS6133)

**State:** done (TS6133 errors cleared; verified via `pnpm --dir app build`)

Easy, mechanical fixes. Just remove the unused symbols.

### Task 1.1 — `ComparisonView.lastVerified.test.tsx`
- **State:** done
- **File:** `app/src/components/ComparisonView.lastVerified.test.tsx`
- **Errors:**
  - L2: `'within'` imported from `@testing-library/react` but never used.
  - L53: `const threeEntries: CandidateEntry[]` declared but never read (the `renderView` helper at L64 rebuilds entries from `candidates`, so the top-level constant is dead).
- **Fix applied:**
  - Dropped `within` from the `@testing-library/react` import.
  - Removed the top-level `threeEntries` constant. Kept the `CandidateEntry` type import — still used by the `entries` local inside `renderView`.

### Task 1.2 — `FilterPanel.integration.test.ts`
- **State:** done
- **File:** `app/src/components/FilterPanel.integration.test.ts`
- **Errors:**
  - L7: `RangeFilter` type imported but unused.
  - L8: `TagFilter` type imported but unused.
  - L9: `BooleanFilter` type imported but unused.
- **Fix applied:** Removed the three unused `type RangeFilter`, `type TagFilter`, `type BooleanFilter` re-imports from `./FilterPanel`.

---

## Bucket 2 — `vi.fn()` inferred as untyped `Mock` in `FilterPanel.test.tsx` (TS2322, ×18)

- **State:** done (TS2322 errors on `mockOnFilterChange` cleared; `pnpm --dir app build` now fails only on Bucket 3; 181 tests pass)
- **File:** `app/src/components/FilterPanel.test.tsx`
- **Fix applied:** Added `type Mock` to the `vitest` import and changed the declaration from `ReturnType<typeof vi.fn>` to `Mock<(state: FilterState) => void>`. Assignment `mockOnFilterChange = vi.fn();` infers fine against the parameterized type.

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

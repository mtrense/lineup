# Plan: Candidate Data Freshness Timestamp

> Milestone: [Milestone 15 in ROADMAP.md](./ROADMAP.md#milestone-15-candidate-data-freshness-timestamp)
> Started: 2026-04-20

## Context Snapshot

- Candidate JSON shape lives in `app/src/types/candidate.ts` (`CandidateFile`). Today it exposes `name`, `description?`, `icon?`, `url?`, `values`.
- Candidate files load at build time via dynamic `import()` in `app/src/lib/data.ts` → `getComparisonData()` returns `{ attributes, candidates, candidateEntries }`.
- `app/src/components/ComparisonView.tsx` renders the table: each `AttributeGroup` emits a group-header row, a section-header row (candidate names, when expanded), then one `AttributeRow` per attribute. The "General Information" group is conventionally the first group (`id: "general"` in `data/databases/attributes.json`), `expandedByDefault: true`.
- Existing "empty value" UX: `ValueRenderer` renders `—` (em dash, muted italic) when `value` is `null`/`undefined`. We'll mirror this exact glyph and styling.
- `date-fns` is already a dependency (used by `react-day-picker`); safe to use `format` + `parseISO` for display.
- No existing tests target `ComparisonView.tsx` directly; tests live next to `FilterPanel`, range utils, and the date-range picker. We'll add a focused `ComparisonView.lastVerified.test.tsx`.
- The two skills that touch candidate JSON are `.claude/skills/gather-data/SKILL.md` (writes values) and `.claude/skills/add-candidate/SKILL.md` (scaffolds shells). Both need updates — `gather-data` stamps `lastVerified`, `add-candidate` explicitly does NOT.
- Per milestone notes: **no retroactive backfill** of existing `data/**/*.json` files. They display `—` until their next `gather-data` pass. This constrains the UI to tolerate an undefined field across every already-shipped candidate.

## Tasks

[x] 1. Extend `CandidateFile` with `lastVerified` and document the schema
- **Files:** `app/src/types/candidate.ts`, `CLAUDE.md`
- **Description:** Add an optional `lastVerified?: string` field to the `CandidateFile` interface (ISO 8601 date, day precision, e.g. `"2026-04-20"`). Update the schema block inside `CLAUDE.md` (under `### <candidate>.json`) so the documented interface matches the code. No runtime behavior changes; no consumers yet read the field. This task exists as its own commit so the type addition is visible and reviewable before any UI or skill work lands on top of it.
- **Architecture & Decisions:**
  - Keep the field optional — existing candidates do not set it and the milestone forbids retroactive backfill.
  - Day-precision ISO 8601 string (`YYYY-MM-DD`), not a full datetime. Matches the `date` attribute `format: "full"` storage convention already used elsewhere, and avoids fake precision (we don't actually know the hour a researcher checked).
  - Place the field at the top level of `CandidateFile`, alongside `name`/`description`/`icon`/`url`, not inside `values`. This is candidate-level metadata, not an attribute value.
  - `CLAUDE.md` already documents the file schema as a TypeScript interface — extend that same block so it stays the single source of truth. Add a one-line comment near the field explaining it's written by `gather-data` and rendered as the "Last Verified" row.
- **Non-Functional Considerations:**
  - None. Pure type addition, no I/O, no UI.
- **Test Cases:**
  - `pnpm --dir app run build` succeeds (TypeScript compile passes with the new optional field).
  - Existing vitest suite still passes unmodified: `pnpm --dir app test:run`.
  - No new test file needed for this task — behavior is covered by task 2.
- **Commit Message:** `feat(types): add optional lastVerified field to CandidateFile`

[ ] 2. Render a "Last Verified" row as the first row of the first attribute group
- **Files:** `app/src/components/ComparisonView.tsx`, `app/src/components/ComparisonView.lastVerified.test.tsx` (new)
- **Description:** In `ComparisonView.tsx`, when rendering the first `AttributeGroup` (the General Information group by convention — gated on it being the first group in `attributes.groups`, not on a hardcoded `id === "general"`), emit one extra `TableRow` immediately after the section-header row and before the first `AttributeRow`. The row has:
  - A sticky left cell reading "Last Verified" (same sticky/background treatment as `AttributeRow`'s first `TableCell`, no sort control, no expand chevron — mirror the non-expandable/non-sortable branch so visual alignment with other rows is preserved).
  - One per-candidate cell per `visibleCandidates` entry, rendering `candidate.lastVerified` formatted via `date-fns`' `format(parseISO(v), "MMM d, yyyy")` when present, or the same `—` em-dash fallback that `ValueRenderer` uses for null values (same classes: `text-muted-foreground/50 italic`, `title="No data available"`, `aria-label="No data available"`). Keep the rendering inline — no new component file. The row must not participate in sorting, filtering, highlighting, or row-expansion. Add `aria-label="Last verified date"` on the row's first cell for screen readers. Ensure the row only renders when the first group is expanded (honor `expandedGroups.has(firstGroup.id)`), so collapsing the General Information group hides it along with the rest of the group's rows.
- **Architecture & Decisions:**
  - Gate placement on *first group in declaration order*, not on `id === "general"`. Keeps the logic resilient to future comparison types that may not use the exact id `"general"` but still place their metadata group first.
  - Guard `parseISO` with a try/catch-style helper that falls through to the em-dash fallback on invalid input. An invalid date string in a candidate file is a data error but must not crash the UI. Do not log loudly — the em dash is the user-visible signal.
  - Do NOT route the value through `ValueRenderer`. `ValueRenderer` dispatches on a `ValueType`, and `lastVerified` is not an attribute value. Inlining a tiny render function avoids inventing a synthetic `date` attribute and keeps the sorting/filtering machinery untouched (which the milestone explicitly wants).
  - Reuse the same column count computation already used by the group header row (`visibleCandidates.length + 1`) and per-candidate iteration pattern, so the new row visually aligns with the attribute rows below.
  - Handle the "no visible candidates" path: the surrounding code short-circuits (`visibleCandidates.length === 0` renders an empty state instead of the table), so the new row is naturally skipped.
- **Non-Functional Considerations:**
  - **Accessibility:** The row is purely informational. Don't mark it `role="button"`, don't give it a `tabIndex`. The sticky left cell's `aria-label` is sufficient for screen readers.
  - **Print:** Inherits existing table print styles — no extra work needed. Verify during manual test that the row prints alongside the General Information group rows.
  - **Performance:** Row count grows by 1 only for the first group; no measurable impact.
- **Test Cases:**
  - Given a comparison with three candidates where two have `lastVerified` set and one does not, the "Last Verified" row appears as the first row inside the first attribute group, showing formatted dates for the two and `—` for the third.
  - The em-dash cell for the missing case carries `aria-label="No data available"` (matches the existing null-value UX).
  - Collapsing the first attribute group hides the "Last Verified" row along with the attribute rows (assert the row disappears from the DOM after clicking the group header).
  - Clicking the "Last Verified" label does not change URL, sort state, or filter state (row is not interactive).
  - The row does not affect `findBestIndices`/highlighting on the first real attribute row — the first attribute row's green "best value" background continues to land on the right candidate.
  - A candidate with `lastVerified: "not-a-date"` renders `—` and does not throw (invalid-date fallback branch).
  - Only the first group gets the row: when a test fixture has two groups, the second group does not emit a "Last Verified" row.
- **Commit Message:** `feat(ui): show Last Verified row inside the General Information group`

[ ] 3. Teach `/gather-data` to stamp `lastVerified` on every candidate write
- **Files:** `.claude/skills/gather-data/SKILL.md`
- **Description:** Update the `gather-data` skill so that every time it writes `data/<type>/<candidate>.json`, it also sets the top-level `lastVerified` field to today's date in `YYYY-MM-DD` form. This applies to both `initial` and `refresh` modes. Concretely:
  - In **Phase 3: Write the Candidate File**, add a step (before or after the "Preserve top-level metadata" bullet) instructing the skill to fetch today's date via `Bash` (`date +%Y-%m-%d`) and write it as `lastVerified` at the top level of the JSON, next to `name`/`description`/`icon`/`url` — explicitly above the `values` object for readability.
  - Update the top-level cheatsheet / schema hints in the skill if they enumerate the candidate file shape, so the field is visible where a reader looks for it.
  - In **Phase 4: Summary**, mention `lastVerified: <date>` in the summary line so the user sees the stamp was applied.
  - In the **Rules** section, add: "Always set `lastVerified` to today's date (day precision, `YYYY-MM-DD`) when writing the candidate file — in both `initial` and `refresh` modes. Never copy the old timestamp forward unchanged; the point of the stamp is to record that *this* pass verified the data."
  - The commit-message template at the end of Phase 4 does not need to change — `lastVerified` is part of the candidate file diff.
- **Architecture & Decisions:**
  - Stamping unconditionally (initial and refresh) is correct per the milestone: a refresh pass *is* a verification, so the date should advance even if no attribute value changed.
  - Fetch via `Bash` rather than hardcoding a date or inferring from context. The skill already uses `date +"%Y-%m-%d %H:%M"` for commit messages — reuse the same pattern with a different format string. Keeps time handling consistent.
  - Do not add `lastVerified` to the per-attribute comment guidelines (e.g. "include the date you checked"). Candidate-level granularity is explicit scope; per-attribute freshness is out of scope.
- **Non-Functional Considerations:**
  - None — this is a prompt-engineering change to a skill.
- **Test Cases:**
  - Manual verification (demo step, captured at milestone close):
    - Run `/gather-data <type> <candidate>` on a test candidate. The resulting JSON has `lastVerified: "<today>"` at the top level.
    - Run `/gather-data <type> <candidate>` again with no semantic changes. The resulting JSON's `lastVerified` updates to the new date.
  - Static check: reading the updated `SKILL.md` shows `lastVerified` in Phase 3, the cheatsheet/schema area, Phase 4 summary guidance, and the Rules section — a reviewer can confirm the rule is unmissable.
- **Commit Message:** `skill(gather-data): stamp lastVerified on every candidate write`

[ ] 4. Explicitly prevent `/add-candidate` from setting `lastVerified`
- **Files:** `.claude/skills/add-candidate/SKILL.md`
- **Description:** Update the `add-candidate` skill to make clear the scaffolded JSON **must not** include `lastVerified`. A freshly-scaffolded candidate hasn't been researched yet, so the honest representation is "no stamp → renders as `—`". Concretely:
  - In **Phase 2: File Generation → `data/<type>/<candidate>.json`**, update the scaffold JSON block to remain unchanged (no `lastVerified` key) and add a one-line note below the block: "Do NOT include `lastVerified` — it's written by `/gather-data` on the first research pass."
  - In the **Rules** section, add: "Do NOT write `lastVerified`. A scaffolded candidate has not been researched; the missing field is what makes the 'Last Verified' row render `—` honestly."
- **Architecture & Decisions:**
  - Splitting this from task 3 keeps each skill change atomic and reviewable. Also: if task 3 is approved but task 4 is contested (e.g. user decides they *do* want scaffold to pre-stamp), they can land independently.
  - No code path changes — the scaffold template already omits `lastVerified`. The edit is purely about making the omission deliberate and documented, so a future reviewer (or future Claude) doesn't "fix" the scaffold by adding the field.
- **Non-Functional Considerations:**
  - None.
- **Test Cases:**
  - Manual verification (demo step):
    - Run `/add-candidate <type>` (auto-pick). The resulting scaffold JSON has no `lastVerified` field. The comparison UI renders `—` for that candidate in the "Last Verified" row.
  - Static check: the updated `SKILL.md` contains the explicit "do NOT write lastVerified" rule and the note under the scaffold block.
- **Commit Message:** `skill(add-candidate): forbid writing lastVerified on scaffold`

## Cross-Cutting Concerns

- **Security:** None. No user input, no external data, no auth surface touched.
- **Performance:** Negligible. One extra row per comparison, per render. No extra data fetches — `lastVerified` ships inside the existing candidate JSON imports.
- **Observability:** No logging changes. Invalid date strings in `lastVerified` fall through silently to the em-dash fallback; this is a data-authoring error caught at review time, not something worth alerting on at runtime.
- **Migration:** **None, deliberately.** Existing candidate JSON files stay untouched. They render `—` until their next `/gather-data` pass writes a stamp. This is the explicit milestone decision — honest over fabricated.
- **Rollback:** Revert any subset of the four commits independently. Task 1's type addition is optional (the runtime never crashes if `lastVerified` is missing). Task 2's UI row can be reverted without touching types. Tasks 3 and 4 are skill-only edits and have no runtime impact. Full rollback = revert all four; candidate files written in the interim keep their `lastVerified` field but nothing reads it — harmless.

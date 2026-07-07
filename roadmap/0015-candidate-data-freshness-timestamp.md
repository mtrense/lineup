# Milestone 15: Candidate Data Freshness Timestamp

**Status:** completed
**Completed:** 2026-04-20

### Value / Impact
Users comparing candidates currently have no way to tell how fresh the data is. Attribute values drift over time (version numbers, prices, feature flags, maintenance status), and a stale comparison can mislead a decision. Surfacing when each candidate was last verified lets readers weigh the data appropriately and helps maintainers spot candidates that need a refresh pass.

### Outcome
- Each candidate JSON file carries a top-level `lastVerified` field (ISO 8601 date, day precision, e.g. `"2026-04-20"`).
- The `gather-data` skill stamps/updates `lastVerified` whenever it writes a candidate file, in both `initial` and `refresh` modes.
- The comparison table renders a dedicated "Last Verified" row inside the **General Information** group, showing the date per candidate.
- Candidates without a `lastVerified` value (pre-existing data) render as `—` in that row, with no forced migration.

### Success Criteria
- [x] `CandidateFile` TypeScript interface extended with optional `lastVerified?: string` (ISO 8601 date).
- [x] `.claude/skills/gather-data/SKILL.md` updated so the skill writes/refreshes a top-level `lastVerified` (current date) whenever it saves a candidate file, in both `initial` and `refresh` modes — including any relevant cheatsheets, Phase 3 instructions, and rules sections.
- [x] `.claude/skills/add-candidate/SKILL.md` reviewed and, if it writes candidate JSON, updated to explicitly *omit* `lastVerified` on scaffold (so the row renders `—` until first research pass).
- [x] Comparison UI shows a "Last Verified" row as the first row of the General Information group, rendering the date per candidate.
- [x] Candidates with a missing/undefined `lastVerified` display `—` (em dash) in that row.
- [x] Existing candidate JSON files are **not** retroactively backfilled — they display `—` until their next gather-data pass.
- [x] CLAUDE.md updated to document the `lastVerified` field in the candidate file schema.
- [x] Existing UI behavior unaffected (sorting, filtering, highlighting continue to work on real attributes only — the new row is purely informational).

### Notes
- **No migration.** The field is explicitly undefined for pre-existing candidates, per the user's decision that these dates can't be added retrospectively without fabricating them. `—` is the honest representation.
- **Purely informational.** The row does not participate in sorting, filtering, highlighting, or freshness-based ranking in this milestone. Treating it as a ranked `date` attribute is deferred as a potential follow-up.
- **Granularity.** Timestamp is candidate-level (one per file), not per-attribute. Per-attribute freshness is out of scope.
- **Placement inside General Information group.** The row lives inside the existing group rather than as a separate table-level header, to reuse current rendering/collapsing machinery without a new layout concept.
- **Scope of updates.** Only `gather-data` touches `lastVerified`. `add-candidate` does not set it (a scaffolded candidate hasn't been researched yet).

### Closing Notes
- **Scope changes:** None to the four planned tasks — each landed as a single commit matching its plan entry (`f0332cd`, `42ad98a`, `f5e28f6`, `cb2c55a`).
- **Architectural surprise — pre-existing `tsc` failures surfaced.** When validating Task 1 with `pnpm build`, 33 unrelated TypeScript errors on `main` came to light in three buckets: unused imports, `vi.fn()` mock type assignability (`Mock<Procedure>` vs typed prop), and `DateType`/`DateTimeType` missing from the `ValueType` union (despite being handled at runtime in `range-utils.ts`). These were tracked in a temporary `TMP_FIX_COMPILER_ISSUES.md` and cleared across four sidecar commits (`6ad7c88`, `56646a7`, `2f38e03`, `4aee81a`, `c489991`) between Task 2 and Task 3. The scratch doc was removed once all buckets were green. Unrelated to `lastVerified` but a useful hygiene pass — Tasks 3 and 4 landed against a clean `tsc`.
- **Decision changes:** None. The original plan's architectural choices (inline row rendering, gating on first group by position not id, day-precision ISO string, no `ValueRenderer` routing, no backfill) held through implementation.
- **Postponed items:** None.

### Manual Testing & Demo

**Prerequisites:**
- Working tree at `main` (HEAD = `cb2c55a` or later).
- `pnpm install` in `app/` has been run at least once.

**Verification Steps:**
1. Start the dev server: `pnpm --dir app dev` and open `/databases`.
   - Expected: the General Information group is expanded by default, and its very first row reads "Last Verified".
2. Inspect the cells of the "Last Verified" row.
   - Expected: each existing candidate shows `—` (em dash, muted italic). No dates are fabricated — pre-existing data was deliberately not backfilled.
3. Collapse the General Information group by clicking its header.
   - Expected: the "Last Verified" row disappears along with every other row in that group.
4. Navigate to any other comparison type (e.g. `/website-hosting-providers`).
   - Expected: the first attribute group (whatever it's named) also shows a "Last Verified" row as its first row; no other group does.
5. Confirm sorting/filtering behavior is untouched.
   - Expected: clicking the "Last Verified" label does nothing (not interactive, no sort cycle triggered). Sorting by a real attribute still produces correct highlighting on the first attribute row.
6. Run the test suite: `pnpm --dir app test:run`.
   - Expected: 181 passing tests, including the new `ComparisonView.lastVerified.test.tsx` cases covering the em-dash fallback, collapse behavior, invalid-date handling, and single-group scoping.
7. Run the type check: `pnpm --dir app build`.
   - Expected: clean `tsc` pass (no residual errors from the mid-milestone hygiene work).

**Demo Script** (for stakeholder presentation):
1. Open `/databases` — point out the new "Last Verified" row at the top of General Information, with `—` across all candidates today.
2. Explain: "Today the row is blank because we deliberately didn't fabricate dates for already-shipped candidates. The next `/gather-data` run on any candidate will stamp that candidate's cell with today's date."
3. Run `/gather-data databases postgresql` (or any candidate) end-to-end.
4. Refresh the page — PostgreSQL's cell now shows a formatted date (e.g. "Apr 20, 2026") while the other candidates still show `—`.
5. Show `/add-candidate databases` producing a scaffold JSON with **no** `lastVerified` field — demonstrating the deliberate split: scaffolding is honest about not yet being researched.

---
name: scaffold-type
description: "Scaffold a Lineup comparison type from its RESEARCH.md and/or add candidate stubs to an existing one. First run after /new-type derives data/<type>/attributes.json, registers the type in data/index.json, and scaffolds the Initial Candidates from RESEARCH.md into data/<type>/index.json + per-candidate stub files. Later runs (with or without explicit candidate ids) add more candidate stubs to an existing type. Use between /new-type and /gather-data. Arguments: comparison type id (required), zero or more candidate ids."
disable-model-invocation: true
model: opus
allowed-tools: Read, Glob, Write, Edit, Bash
argument-hint: "<comparison-type-id> [candidate-id ...]"
---

# Comparison: Scaffold Type

You are scaffolding the machine-readable files for a Lineup comparison type based on its existing `RESEARCH.md`. This skill is the bridge between `/new-type` (which drafts the research guide) and `/gather-data` (which populates attribute values via research).

The skill has two operational concerns, both driven off RESEARCH.md, both invoked through the same command:

1. **Schema scaffolding** — on first run, translate RESEARCH.md into `data/<type>/attributes.json`, create `data/<type>/index.json`, and register the type in the top-level `data/index.json`.
2. **Candidate scaffolding** — create `data/<type>/<candidate>.json` stubs (empty `values`) for candidates and append them to `data/<type>/index.json`. Runs on first invocation (using RESEARCH.md's Initial Candidates list) AND on later invocations (adding newly-listed or explicitly-named candidates).

The skill chooses which concerns to run based on repository state — do NOT require the user to pick a mode.

This skill is **non-interactive and bulk-oriented**: it translates RESEARCH.md into the schema + stubs using defensible defaults and writes them directly. Anything that required a judgment call (ambiguous direction, empty tag set, truncated id) is surfaced in the final summary so the user can edit the files in place. The only conditions that stop execution mid-flight are hard precondition failures (missing `data/<type>/`, missing RESEARCH.md, malformed Attribute Groups section, nothing to do).

## Argument Parsing

`$ARGUMENTS` format (positional, whitespace-delimited):

1. **comparison type id** — kebab-case; must match an existing `data/<type>/` directory created by `/new-type`.
2. **candidate ids** (zero or more) — kebab-case file stems; each becomes `<candidate>.json`. When omitted, auto-pick every unscaffolded entry from `RESEARCH.md`'s Initial Candidates list (see **Candidate Auto-Pick** below).

If the comparison type id is missing, not kebab-case, or the directory doesn't exist, abort and ask. This is the one unavoidable prompt — no defensible default exists for it.

## Prerequisites

1. Read `CLAUDE.md` at the project root to confirm this is a Lineup project and pick up local conventions (commit format, shell rules).
2. Confirm `data/<type>/RESEARCH.md` exists. If not, abort and suggest `/new-type <type>`.
3. Read `data/index.json` — needed to decide whether to append a top-level entry for this type.
4. Read `data/<type>/RESEARCH.md` end-to-end. Focus on:
   - **Overview** — source of the `description` field for `attributes.json` and the top-level `data/index.json` entry.
   - **Attribute Groups** tables — each `### <N>. Group Name` becomes a `groups[]` entry, each row becomes one attribute.
   - **Initial Candidates** — source of the candidate pick list and per-candidate display name + description.
   - **Scope / Assessment Guidelines** — may inform tag sets or attribute descriptions.
5. Check whether `data/<type>/attributes.json` exists:
   - **Missing** → first-run mode: schema + candidates will both be scaffolded this pass.
   - **Present** → additive mode: only candidate scaffolding runs. Do NOT overwrite the schema.
6. Read `data/<type>/index.json` if it exists (additive mode) — needed to detect already-registered candidates.
7. Glob `data/<type>/*.json` once so you can detect pre-existing per-candidate scaffold files without re-reading each.
8. Skim 1–2 existing `data/*/attributes.json` files to internalize in-project formatting (indentation, key ordering, `expandedByDefault` conventions).

## Phase 1: Schema Translation (first-run mode only)

Skip this phase entirely if `data/<type>/attributes.json` already exists.

Walk every attribute table in RESEARCH.md and translate each row:

1. **Group**: each `### <N>. Group Name` heading becomes a `{ id, name, expandedByDefault, attributes }` entry. `id` is kebab-case derived from the group name. First 1–2 groups get `expandedByDefault: true`; deeper groups default to `false`.
2. **Attribute**: each table row becomes `{ id, name, valueType, description? }`. `id` is kebab-case derived from the attribute name.
3. **ValueType**: translate the human label in RESEARCH.md's `Type` column into the machine form using the cheatsheet below. For ranked types (integer, decimal, percentage, filesize, duration, date, datetime, rating), infer `direction` from the research note (e.g. "higher is better" → `"ascending"`, "lower is better" → `"descending"`, "neutral" → `"neutral"`). If the note is ambiguous, default to `"ascending"` for `integer`/`decimal`/`percentage`/`rating`/`date`/`datetime` and `"descending"` for `filesize`/`duration` (smaller/faster is the more common preference), and surface the attribute in the summary so the user can flip it.
4. **Tag sets**: when a tag attribute's research note lists the expected tags (e.g. "tags: MIT, Apache-2.0, GPL-3.0"), seed them as `{ id: "...", value: "...", color: "..." }`. `id` is kebab-case, `value` is the display label, and colors are reasonable picks from `blue`, `green`, `red`, `orange`, `purple`, `gray`. Set `defaultColor: "gray"`. If no tags are listed, seed `tags: []` and note this in the summary so the user can add tags.
5. **Rating ranges**: default to `{ "lower": 1, "upper": 5, "direction": "ascending", "symbols": { "empty": "☆", "full": "★" } }` unless RESEARCH.md specifies otherwise.

### ValueType Cheatsheet (RESEARCH.md label → `attributes.json` form)

| RESEARCH.md label            | `valueType` in `attributes.json`                                                                         |
|------------------------------|----------------------------------------------------------------------------------------------------------|
| `text`                       | `"text"`                                                                                                 |
| `boolean`                    | `"boolean"`                                                                                              |
| `link`                       | `"link"`                                                                                                 |
| `integer`                    | `{ "type": "integer", "direction": "ascending" \| "descending" \| "neutral" }`                           |
| `decimal`                    | `{ "type": "decimal", "direction": "ascending" \| "descending" \| "neutral" }`                           |
| `percentage`                 | `{ "type": "percentage", "direction": "ascending" \| "descending" }`                                     |
| `filesize`                   | `{ "type": "filesize", "direction": "ascending" \| "descending" }`                                       |
| `duration`                   | `{ "type": "duration", "direction": "ascending" \| "descending" }`                                       |
| `date (year)`                | `{ "type": "date", "direction": "ascending", "format": "year" }`                                         |
| `date (month-year)`          | `{ "type": "date", "direction": "ascending", "format": "month-year" }`                                   |
| `date (full)`                | `{ "type": "date", "direction": "ascending", "format": "full" }`                                         |
| `datetime`                   | `{ "type": "datetime", "direction": "ascending" }`                                                       |
| `rating (1–5)`               | `{ "lower": 1, "upper": 5, "direction": "ascending", "symbols": { "empty": "☆", "full": "★" } }`         |
| `tags`                       | `{ "type": "tags", "defaultColor": "gray", "tags": [{ "id": "...", "value": "...", "color": "..." }] }` |
| `icon`                       | `{ "type": "icon-fontawesome", "name": "..." }`                                                          |

Rating `symbols.half` is optional for half-stars. Tag IDs are kebab-case; the `value` is the display label.

Track every judgment call you make (defaulted direction, empty tag set, fallback group/attribute id, unrecognized type label coerced to `"text"`) in a running list — it becomes the **Defaults to review** section of the final summary. Do NOT pause to ask the user.

## Phase 2: Candidate Resolution

Always runs. Build the candidate batch from the arguments plus RESEARCH.md.

### Candidate Auto-Pick (when no candidate ids are given)

Scan `RESEARCH.md`'s **Initial Candidates** section for **every** `- [ ] <Name> — …` entry whose derived candidate id is NOT already scaffolded (no `data/<type>/<id>.json`, no entry in `data/<type>/index.json`). Preserve the listed order. The result is the full bulk batch.

- **Deriving the candidate id**: kebab-case of the display name — lowercase, ASCII, spaces and punctuation → hyphens, collapse runs, trim leading/trailing hyphens. `PostgreSQL` → `postgresql`; `Amazon RDS` → `amazon-rds`; `MySQL / MariaDB` → keep the first segment (`mysql`) and flag the truncation in the summary so the user can rename the file if they meant the combined entry.
- **First-run mode**: since `data/<type>/index.json` doesn't exist yet, every Initial Candidates entry is a pick. If the list is empty, report that schema was scaffolded without candidates and suggest running `/scaffold-type <type>` again after adding entries to RESEARCH.md.
- **Additive mode, nothing to pick**: if every Initial Candidates entry is already scaffolded (or the list is empty), report the state and stop after Phase 1 is confirmed no-op. Suggest the user either add new entries to RESEARCH.md or pass explicit candidate ids.

Proceed straight to Phase 3 with the full pick list — do not ask the user to confirm. Each id becomes a filename, easy to rename before commit; surfacing picks in the summary gives the user the same control without an extra round-trip.

### Per-Candidate Skip Conditions (explicit ids only)

For each explicitly-passed candidate id, before processing:

- If `data/<type>/<candidate>.json` already exists OR the id is already in `data/<type>/index.json`: **skip** that one with a note for the summary (suggest `/gather-data <type> <candidate>` for a refresh). Do not abort — continue with the rest of the batch.

Auto-pick mode never produces skips — it filters before batching.

### Per-Candidate Metadata (Non-Interactive)

For each candidate in the batch, derive every field from arguments and RESEARCH.md. Do NOT ask the user any questions — write defensible defaults and surface them in the summary so the user can edit the files directly.

Resolution rules:

- **Display name**:
  1. The matching `- [ ] <Name>` entry in RESEARCH.md (auto-pick mode always; explicit mode when the candidate id matches a kebab-cased entry name).
  2. Otherwise, title-case the candidate id segments (`amazon-rds` → `Amazon Rds`). Flag this fallback in the summary — it is rarely the right casing.
- **Description**: the text after `— ` on the matching RESEARCH.md line, if any. Otherwise omit the field entirely (don't write an empty string).
- **URL**: omit. `/gather-data` will record the official URL on the first research pass.
- **Icon**: omit.
- **`shownByDefault`**: always `true`. Niche entries can be flipped to `false` later by editing `index.json`.
- **Scope fit**: do NOT prompt. A candidate listed in RESEARCH.md is in-scope by definition. An explicit id NOT listed in RESEARCH.md is appended per the Phase 3 rules — surface this in the summary so the user sees that scope was extended.

## Phase 3: File Generation

### `data/<type>/attributes.json` (first-run mode only)

Skip if the file already exists (see Phase 0 precondition check).

```json
{
  "name": "<Display Name>",
  "description": "<one-sentence what this comparison covers>",
  "groups": [
    {
      "id": "<group-id>",
      "name": "<Group Display Name>",
      "description": "<optional>",
      "expandedByDefault": true,
      "attributes": [
        { "id": "<attr-id>", "name": "<Display>", "valueType": "text", "description": "<optional tooltip>" }
      ]
    }
  ]
}
```

- `id` fields are kebab-case.
- First 1–2 groups should have `expandedByDefault: true`; deeper groups can default to `false`.
- Every attribute needs a `valueType`. Every ranked type needs a `direction`.

### `data/<type>/<candidate>.json` (per candidate in the batch)

Create the scaffold:

```json
{
  "name": "<Display Name>",
  "description": "<one-sentence description>",
  "values": {}
}
```

- `values` is intentionally empty. `/gather-data` fills it.
- Do NOT include `lastVerified` — it's written by `/gather-data` on the first research pass.
- Omit `icon`, `url`, and `description` entirely (don't include as empty strings) if not provided.
- Filename MUST match the candidate id exactly: `<candidate-id>.json`, lowercase, hyphens only.

### `data/<type>/index.json`

**First-run mode**: create the file with every scaffolded candidate, in Phase 2 pick order:

```json
{
  "candidates": [
    { "id": "<candidate-id>", "shownByDefault": true }
  ]
}
```

**Additive mode**: append each new candidate entry at the end of the `candidates` array, preserving existing order and whitespace:

```json
{ "id": "<candidate-id>", "shownByDefault": true }
```

Do NOT reorder existing entries. When appending multiple, keep them in the order produced by auto-pick (RESEARCH.md order) or the order of explicit arguments.

If no candidates are in the batch (first-run mode, empty Initial Candidates list), still create `data/<type>/index.json` with `{ "candidates": [] }` so the type is well-formed.

### Top-level `data/index.json` (first-run mode only)

Skip if an entry with `id: "<type>"` already exists (defensive check — shouldn't happen in first-run mode, but guards against partial prior runs).

Append a single entry at the end of the array, preserving all existing entries and whitespace:

```json
{
  "id": "<type>",
  "name": "<Display Name>",
  "description": "<one-sentence description>"
}
```

### `data/<type>/RESEARCH.md` updates

Per candidate in the batch:

- **If the candidate is already listed** under **Initial Candidates**: leave the line untouched. The checkbox stays `- [ ]` — it gets ticked by `/gather-data` when data is actually gathered, not here.
- **If the candidate is NOT listed** (explicit mode only — auto-pick always picks from the list): append a new entry to the end of the **Initial Candidates** list using the format:

  ```
  - [ ] <Display Name> — <one-sentence description> (added <YYYY-MM-DD>)
  ```

  Fetch today's date once via Bash (`date +%Y-%m-%d`) and reuse it for every appended entry in the batch — do not hand-type it. The `(added <date>)` suffix records the post-scoping addition so future audits can distinguish these from candidates that came out of the initial scoping dialogue.

## Phase 4: Summary

Present a single summary covering both the schema (if newly scaffolded) and every candidate in the batch (concise — the user did not participate in the decisions, so the summary is their first view of the result):

- **Mode**: `first-run` (schema + candidates) or `additive` (candidates only).
- **Schema** (first-run only):
  - Path of `data/<type>/attributes.json`, plus the resolved comparison `name` and `description` inline.
  - Confirmation that `data/index.json` was updated with a new top-level entry.
- **Created** (one line per candidate): the scaffold file path, plus the resolved `name` and `description` inline (so the user sees the chosen casing without opening the file).
- **`data/<type>/index.json`**: count of new entries (and whether the file was created or appended).
- **RESEARCH.md**: count of Initial Candidates already listed (untouched) vs. count of entries appended with `(added <date>)` suffix. Omit when no edits happened.
- **Skipped** (only if any): each id with the reason (already scaffolded → suggest `/gather-data`).
- **Defaults to review** — group across the batch; only include the section when defaults actually applied. Examples:
  - Direction defaulted because the research note was ambiguous (list each `<group-id>.<attribute-id>` and the chosen direction).
  - Tag set seeded as empty `[]` (list each `<group-id>.<attribute-id>`).
  - Group/attribute id was derived from a heading or label that produced awkward kebab-case.
  - Type label in RESEARCH.md was unrecognized and fell back to `"text"` (list each occurrence).
  - Display names that were title-cased from the id (`amazon-rds` → `Amazon Rds`).
  - Candidate ids truncated from multi-segment RESEARCH.md entries (`MySQL / MariaDB` → `mysql`).
  - Scope extensions (explicit ids not previously in RESEARCH.md).
- **Next step**: `/gather-data <type>` (auto-picks the next under-researched candidate) or `/gather-data <type> <candidate-id>` per specific candidate.

### Commit hint

Print the expected commit command in the project's multi-`-m` format (per CLAUDE.md). Choose the subject line by mode:

- **First-run mode** (schema + initial candidate stubs):

  ```bash
  git add data/index.json data/<type>/attributes.json data/<type>/index.json data/<type>/*.json
  git commit -m "data(<type>): SCHEMA" \
    -m "<1–2 sentence summary of the comparison and its intended audience, plus a note that initial candidate stubs were scaffolded>" \
    -m "🤖 Generated with [Claude Code](https://claude.com/claude-code)" \
    -m "Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
  ```

  If RESEARCH.md has not been committed yet, remind the user to include it (either folded into this commit or as a prior `data(<type>): RESEARCH` commit, their preference).

- **Additive mode** (candidate stubs only):

  ```bash
  git add data/<type>/index.json data/<type>/RESEARCH.md data/<type>/<candidate>.json ...
  git commit -m "data(<type>): CANDIDATES scaffold <YYYY-MM-DD>" \
    -m "Added scaffolds for <N> candidates: <comma-separated ids>." \
    -m "🤖 Generated with [Claude Code](https://claude.com/claude-code)" \
    -m "Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
  ```

  Fetch the date via `date +%Y-%m-%d`. Only include `RESEARCH.md` in `git add` if the skill actually edited it (explicit ids not previously listed).

Alternatively, suggest the user combine scaffolding with the first `/gather-data` commit so that declarations and initial research land together — this is the common flow when scaffolding a new type in one session.

## Git

Do NOT commit. Print the exact command the user can run (or they can use the project's `/commit` skill if one is installed).

## Rules

- Do NOT ask the user clarifying questions. Resolve every field from arguments + RESEARCH.md + the defaults above; surface anything the user might want to change in the Phase 4 summary. The only exceptions are the hard precondition failures listed below.
- Do NOT modify `RESEARCH.md`'s Scope, Attribute Groups, Research Sources, Assessment Guidelines, or Notes sections — Initial Candidates is the only section this skill edits, and only to append new `- [ ]` lines for explicit ids. Never tick an existing checkbox (`- [ ]` → `- [x]`); that's `/gather-data`'s job.
- Do NOT invent attributes, groups, or tag values not present in RESEARCH.md.
- Do NOT populate any `values` inside candidate files — that's `/gather-data`.
- Do NOT write `lastVerified` on candidate files. A scaffolded candidate has not been researched; the missing field is what makes the "Last Verified" row render `—` honestly.
- Do NOT overwrite `data/<type>/attributes.json` if it already exists — run in additive mode (candidates only) instead. If the schema is wrong, the user should edit it directly.
- Do NOT reorder entries in `data/<type>/index.json`; append only.
- Do NOT reorder entries in the top-level `data/index.json`; append only.
- JSON output MUST be valid: ASCII quotes, no trailing commas, no comments inside `.json` files.
- kebab-case for all `id` fields (comparison type, group, attribute, tag, candidate).
- Filenames: lowercase, hyphens, no spaces, no underscores, no numeric prefixes. Must match the candidate id exactly.
- Match existing project style: indentation, attribute ordering within groups (generic → specific).
- If RESEARCH.md's Attribute Groups section is malformed (missing tables, unparseable Type column, unrecognized labels) AND first-run mode is needed, abort and tell the user precisely what to fix before retrying.
- If a required file or directory is missing (no `data/`, no `CLAUDE.md`, no `RESEARCH.md`, no `data/<type>/`), abort and explain.
- If JSON you are about to write would break the project's build, abort the **whole pass** and report which file is malformed before overwriting anything. Do not leave the scaffold half-applied.
- For explicit ids, skip-and-note pre-existing candidates rather than aborting; the rest of the batch still proceeds.

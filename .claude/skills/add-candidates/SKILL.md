---
name: add-candidates
description: "Add candidate stubs to a Lineup comparison type: create data/<type>/<candidate>.json files with empty values and register them in data/<type>/index.json. Bulk by default — with no candidate ids, scaffolds every unscaffolded entry from RESEARCH.md; with explicit ids, scaffolds each one. Use when declaring items to compare (e.g. adding PostgreSQL to databases) without researching attribute values yet. Arguments: comparison type id (required), zero or more candidate ids."
disable-model-invocation: true
model: sonnet
allowed-tools: Read, Glob, Write, Edit, Bash
argument-hint: "<comparison-type> [candidate-id ...]"
---

# Comparison: Add Candidate(s)

You are adding one or more candidates to an existing Lineup comparison type. This skill creates only scaffolds — attribute values are populated later via `/gather-data`. The separation keeps the commit boundary clean: declaring candidates is a single small commit; researching their data is another.

This skill is **non-interactive and bulk-oriented**: it writes scaffold files and updates `index.json` (and possibly `RESEARCH.md`) directly using defensible defaults. Anything the user might want to override per candidate is surfaced in the Phase 3 summary so they can edit the files in place. The only condition that stops execution mid-flight is a hard precondition failure (missing `data/<type>/`, malformed JSON about to be written, nothing to auto-pick).

## Argument Parsing

`$ARGUMENTS` format (positional, whitespace-delimited):

1. **comparison type id** — kebab-case, must match an existing `data/<type>/` directory.
2. **candidate ids** (zero or more) — kebab-case file stems; each becomes `<candidate>.json`. When omitted, auto-pick **every** unscaffolded entry from `RESEARCH.md`'s Initial Candidates list (see **Auto-Pick** below).

If the comparison type id is missing, ask for it before proceeding (this is the one unavoidable prompt — no defensible default exists). If only the comparison type is provided, run auto-pick over all remaining entries.

## Prerequisites

1. Read the project root `CLAUDE.md` to confirm this is a Lineup project.
2. Confirm `data/<type>/` exists. If not, abort and suggest `/new-type`.
3. Read `data/<type>/RESEARCH.md` — in particular the **Initial Candidates** section (needed for auto-pick and for resolving display name + description in explicit mode).
4. Read `data/<type>/attributes.json` — confirms the type is well-formed.
5. Read `data/<type>/index.json` — needed to detect already-scaffolded candidates.
6. Glob `data/<type>/*.json` once so you can detect pre-existing scaffold files without re-reading.

## Auto-Pick (when no candidate ids are given)

Scan `RESEARCH.md`'s **Initial Candidates** section for **every** `- [ ] <Name> — …` entry whose derived candidate id is NOT already present in `data/<type>/index.json` and has no `data/<type>/<id>.json` file. Preserve the listed order. The result is the full bulk batch.

- **Deriving the candidate id**: kebab-case of the display name — lowercase, ASCII, spaces and punctuation → hyphens, collapse runs, trim leading/trailing hyphens. `PostgreSQL` → `postgresql`; `Amazon RDS` → `amazon-rds`; `MySQL / MariaDB` → keep the first segment (`mysql`) and flag the truncation in the Phase 3 summary so the user can rename the file if they meant the combined entry.
- **Nothing to pick**: if every Initial Candidates entry in RESEARCH.md is already scaffolded (or the list is empty), report the state and stop. Suggest the user either add new entries to RESEARCH.md or pass explicit candidate ids.

Proceed straight to Phase 1 with the full pick list — do not ask the user to confirm. Each id becomes a filename, easy to rename before commit; surfacing picks in the Phase 3 summary gives the user the same control without an extra round-trip.

## Per-Candidate Skip Conditions (explicit ids only)

For each explicitly-passed candidate id, before processing:

- If `data/<type>/<candidate>.json` already exists OR the id is already in `data/<type>/index.json`: **skip** that one with a note for the Phase 3 summary (suggest `/gather-data <type> <candidate>` for a refresh). Do not abort — continue with the rest of the batch.

Auto-pick mode never produces skips — it filters before batching.

## Phase 1: Resolve Metadata (Non-Interactive, Per Candidate)

For each candidate in the batch, derive every field from arguments and RESEARCH.md. Do NOT ask the user any questions — write defensible defaults and surface them in the Phase 3 summary so the user can edit the files directly.

Resolution rules:

- **Display name**:
  1. The matching `- [ ] <Name>` entry in RESEARCH.md (auto-pick mode always; explicit mode when the candidate id matches a kebab-cased entry name).
  2. Otherwise, title-case the candidate id segments (`amazon-rds` → `Amazon Rds`). Flag this fallback in the Phase 3 summary — it is rarely the right casing.
- **Description**: the text after `— ` on the matching RESEARCH.md line, if any. Otherwise omit the field entirely (don't write an empty string).
- **URL**: omit. `/gather-data` will record the official URL on the first research pass.
- **Icon**: omit.
- **`shownByDefault`**: always `true`. Niche entries can be flipped to `false` later by editing `index.json`.
- **Scope fit**: do NOT prompt. A candidate listed in RESEARCH.md is in-scope by definition. An explicit id NOT listed in RESEARCH.md is appended per the Phase 2 rules — surface this in the Phase 3 summary so the user sees that scope was extended.

## Phase 2: File Generation (Per Candidate)

For each candidate in the batch:

### `data/<type>/<candidate>.json`

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

### Update `data/<type>/index.json`

Append all new candidate entries at the end of the `candidates` array, preserving existing order and whitespace:

```json
{ "id": "<candidate-id>", "shownByDefault": true }
```

Do NOT reorder existing entries. When appending multiple, keep them in the order produced by auto-pick (RESEARCH.md order) or the order of explicit arguments.

### Update RESEARCH.md

For each candidate:

- **If the candidate is already listed** under **Initial Candidates** (e.g. `- [ ] PostgreSQL — reference open-source RDBMS`): leave the line untouched. The checkbox stays `- [ ]` — it gets ticked by `/gather-data` when data is actually gathered, not here.
- **If the candidate is NOT listed** (explicit mode only — auto-pick always picks from the list): append a new entry to the end of the **Initial Candidates** list using the format:

  ```
  - [ ] <Display Name> — <one-sentence description> (added <YYYY-MM-DD>)
  ```

  Fetch today's date once via Bash (`date +%Y-%m-%d`) and reuse it for every appended entry in the batch — do not hand-type it. The `(added <date>)` suffix records the post-scoping addition so future audits can distinguish these from candidates that came out of the initial scoping dialogue.

## Phase 3: Summary

Present a single summary covering the entire batch (concise — the user did not participate in the decisions, so the summary is their first view of the result):

- **Created** (one line per candidate): the scaffold file path, plus the resolved `name` and `description` inline (so the user sees the chosen casing without opening the file).
- **`index.json`**: count of new entries appended.
- **RESEARCH.md**: count of entries already listed (untouched) vs. count of entries appended with `(added <date>)` suffix.
- **Skipped** (only if any): each id with the reason (already scaffolded → suggest `/gather-data`).
- **Defaults to review** — group across the batch; only include the section when defaults actually applied. Examples:
  - Display names that were title-cased from the id (list them: `amazon-rds` → `Amazon Rds`).
  - Candidate ids truncated from multi-segment RESEARCH.md entries (`MySQL / MariaDB` → `mysql`).
  - Scope extensions (explicit ids not previously in RESEARCH.md).
- **Next step**: `/gather-data <type> <candidate-id>` per candidate (or whatever the project's bulk gather command is, if one exists).

No commit is created by this skill. Suggest the commit pattern the user should run after gathering data, so that declarations and initial research can land together:

```bash
# After running /gather-data, commit with:
data(<type>): CANDIDATE initial <YYYY-MM-DD HH:MM>
```

If the user wants to commit the scaffolds alone (rare), they can still use the same format.

## Git

Do NOT commit.

## Rules

- Do NOT ask the user clarifying questions. Resolve every field from arguments + RESEARCH.md + the defaults in Phase 1; surface anything the user might want to change in the Phase 3 summary. The only exception is a missing comparison type id (no defensible default exists).
- Do NOT populate any `values` — that's `/gather-data`.
- Do NOT write `lastVerified`. A scaffolded candidate has not been researched; the missing field is what makes the 'Last Verified' row render `—` honestly.
- Do NOT reorder entries in `data/<type>/index.json`; append only.
- Do NOT modify `attributes.json`.
- Do NOT tick an existing RESEARCH.md checkbox (`- [ ]` → `- [x]`); that's `/gather-data`'s job. The only RESEARCH.md edit this skill performs is appending new `- [ ]` lines for candidates not yet listed.
- Filenames: lowercase, hyphens, no spaces, no underscores, no numeric prefixes.
- If JSON you are about to write would break the project's build, abort the **whole batch** and report which file is malformed before overwriting anything. Do not leave the batch half-applied.
- For explicit ids, skip-and-note pre-existing candidates rather than aborting; the rest of the batch still proceeds.

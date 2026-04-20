---
name: add-candidate
description: "Add a candidate stub to a Lineup comparison type: create data/<type>/<candidate>.json with empty values and register it in data/<type>/index.json. Use when declaring a new item to compare (e.g. adding PostgreSQL to databases) without researching its attribute values yet. Arguments: comparison type id (required), optional candidate id (auto-picked from RESEARCH.md when omitted), optional display name."
disable-model-invocation: true
model: sonnet
allowed-tools: Read, Glob, Write, Edit, Bash
argument-hint: "<comparison-type> [candidate-id] [display-name]"
---

# Comparison: Add Candidate

You are adding a new candidate to an existing Lineup comparison type. This skill creates only the scaffold — attribute values are populated later via `/gather-data`. The separation keeps the commit boundary clean: declaring a candidate is a single small commit; researching its data is another.

This skill is **non-interactive**: it writes the scaffold file and updates `index.json` (and possibly `RESEARCH.md`) directly using defensible defaults. Anything the user might want to override is surfaced in the Phase 3 summary so they can edit the files in place. The only condition that stops execution mid-flight is a hard precondition failure (missing `data/<type>/`, malformed JSON about to be written, nothing to auto-pick).

## Argument Parsing

`$ARGUMENTS` format (positional, whitespace-delimited):

1. **comparison type id** — kebab-case, must match an existing `data/<type>/` directory.
2. **candidate id** (optional) — kebab-case file stem; becomes `<candidate>.json`. When omitted, auto-pick the next unscaffolded entry from `RESEARCH.md`'s Initial Candidates list (see **Auto-Pick** below).
3. **display name** (optional, remainder of the line) — overrides the name resolved from RESEARCH.md or derived from the id.

If the comparison type id is missing, ask for it before proceeding (this is the one unavoidable prompt — no defensible default exists). If only the comparison type is provided, run auto-pick.

## Prerequisites

1. Read the project root `CLAUDE.md` to confirm this is a Lineup project.
2. Confirm `data/<type>/` exists. If not, abort and suggest `/new-type`.
3. Read `data/<type>/RESEARCH.md` — in particular the **Initial Candidates** section (needed for auto-pick and for resolving display name + description in explicit mode).
4. Read `data/<type>/attributes.json` — you need the full attribute id list for the scaffold.
5. Read `data/<type>/index.json` — needed to detect already-scaffolded candidates.
6. Under explicit mode only: confirm `data/<type>/<candidate>.json` does NOT already exist. If it does, abort and suggest `/gather-data <type> <candidate>` for a refresh instead.

## Auto-Pick (when candidate id is omitted)

Scan `RESEARCH.md`'s **Initial Candidates** section for the first `- [ ] <Name> — …` entry whose derived candidate id is NOT already present in `data/<type>/index.json` and has no `data/<type>/<id>.json` file. Preserve the listed order.

- **Deriving the candidate id**: kebab-case of the display name — lowercase, ASCII, spaces and punctuation → hyphens, collapse runs, trim leading/trailing hyphens. `PostgreSQL` → `postgresql`; `Amazon RDS` → `amazon-rds`; `MySQL / MariaDB` → keep the first segment (`mysql`) and flag the truncation in the Phase 3 summary so the user can rename the file if they meant the combined entry.
- **Nothing to pick**: if every Initial Candidates entry in RESEARCH.md is already scaffolded (or the list is empty), report the state and stop. Suggest the user either add a new entry to RESEARCH.md or pass an explicit candidate id.

Proceed straight to Phase 1 with the pick — do not ask the user to confirm. The id becomes the filename, which is easy to rename before the candidate is committed; surfacing the pick in the Phase 3 summary gives the user the same control without an extra round-trip.

## Phase 1: Resolve Metadata (Non-Interactive)

Derive every field from arguments and RESEARCH.md. Do NOT ask the user any questions — write defensible defaults and surface them in the Phase 3 summary so the user can edit the files directly.

Resolution rules:

- **Display name**:
  1. The third positional argument, if provided.
  2. The matching `- [ ] <Name>` entry in RESEARCH.md (auto-pick mode always; explicit mode when the candidate id matches a kebab-cased entry name).
  3. Otherwise, title-case the candidate id segments (`amazon-rds` → `Amazon Rds`). Flag this fallback in the Phase 3 summary — it is rarely the right casing.
- **Description**: the text after `— ` on the matching RESEARCH.md line, if any. Otherwise omit the field entirely (don't write an empty string).
- **URL**: omit. `/gather-data` will record the official URL on the first research pass.
- **Icon**: omit.
- **`shownByDefault`**: always `true`. Niche entries can be flipped to `false` later by editing `index.json`.
- **Scope fit**: do NOT prompt. A candidate listed in RESEARCH.md is in-scope by definition. An explicit id NOT listed in RESEARCH.md is appended per the Phase 2 rules — surface this in the Phase 3 summary so the user sees that scope was extended.

## Phase 2: File Generation

### `data/<type>/<candidate>.json`

Create the scaffold:

```json
{
  "name": "<Display Name>",
  "description": "<one-sentence description>",
  "icon": "<icon or omit>",
  "url": "<official url or omit>",
  "values": {}
}
```

- `values` is intentionally empty. `/gather-data` fills it.
- Do NOT include `lastVerified` — it's written by `/gather-data` on the first research pass.
- Omit `icon` and `url` entirely (don't include as empty strings) if not provided.
- Filename MUST match the candidate id exactly: `<candidate-id>.json`, lowercase, hyphens only.

### Update `data/<type>/index.json`

Append a new candidate entry at the end of the `candidates` array, preserving existing order and whitespace:

```json
{ "id": "<candidate-id>", "shownByDefault": true }
```

Do NOT reorder existing entries.

### Update RESEARCH.md

- **If the candidate is already listed** under **Initial Candidates** (e.g. `- [ ] PostgreSQL — reference open-source RDBMS`): leave the line untouched. The checkbox stays `- [ ]` — it gets ticked by `/gather-data` when data is actually gathered, not here.
- **If the candidate is NOT listed** (explicit mode only — auto-pick always picks from the list): append a new entry to the end of the **Initial Candidates** list using the format:

  ```
  - [ ] <Display Name> — <one-sentence description> (added <YYYY-MM-DD>)
  ```

  Fetch today's date via Bash (`date +%Y-%m-%d`) — do not hand-type it. The `(added <date>)` suffix records the post-scoping addition so future audits can distinguish these from candidates that came out of the initial scoping dialogue.

## Phase 3: Summary

Present (concise — the user did not participate in the decisions, so the summary is their first view of the result):

- Path of the scaffold file created, plus the resolved `name` and `description` inline (so the user sees the chosen casing without opening the file).
- The new entry added to `data/<type>/index.json`.
- RESEARCH.md status: either "already listed (untouched)" or "appended to Initial Candidates with `(added <date>)` suffix".
- **Defaults to review** — only when defaults actually applied. Examples (omit the section entirely if none apply):
  - Display name was title-cased from the id (`amazon-rds` → `Amazon Rds`); user likely wants to fix the casing.
  - Candidate id was truncated from a multi-segment RESEARCH.md entry (`MySQL / MariaDB` → `mysql`).
  - Scope was extended (explicit id not previously in RESEARCH.md).
- **Next step**: `/gather-data <type> <candidate-id>` to research and fill in attribute values.

No commit is created by this skill. Suggest the commit pattern the user should run after gathering data, so that declaration and initial research land in one commit:

```bash
# After running /gather-data, commit with:
data(<type>): CANDIDATE initial <YYYY-MM-DD HH:MM>
```

If the user wants to commit the scaffold alone (rare), they can still use the same format.

## Git

Do NOT commit.

## Rules

- Do NOT ask the user clarifying questions. Resolve every field from arguments + RESEARCH.md + the defaults in Phase 1; surface anything the user might want to change in the Phase 3 summary. The only exception is a missing comparison type id (no defensible default exists).
- Do NOT populate any `values` — that's `/gather-data`.
- Do NOT write `lastVerified`. A scaffolded candidate has not been researched; the missing field is what makes the 'Last Verified' row render `—` honestly.
- Do NOT reorder entries in `data/<type>/index.json`; append only.
- Do NOT modify `attributes.json`.
- Do NOT tick an existing RESEARCH.md checkbox (`- [ ]` → `- [x]`); that's `/gather-data`'s job. The only RESEARCH.md edit this skill performs is appending a new `- [ ]` line for candidates not yet listed.
- Filenames: lowercase, hyphens, no spaces, no underscores, no numeric prefixes.
- If the JSON you write would break the project's build, abort and report which file is malformed before overwriting anything.

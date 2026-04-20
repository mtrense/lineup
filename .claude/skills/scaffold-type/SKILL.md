---
name: scaffold-type
description: "Generate schema files for a Lineup comparison type from its existing RESEARCH.md: data/<type>/attributes.json, an empty data/<type>/index.json, and an entry in the top-level data/index.json. Run after /new-type once the user is satisfied with RESEARCH.md. Arguments: comparison type id (kebab-case, required)."
disable-model-invocation: true
model: opus
allowed-tools: Read, Glob, Write, Edit
argument-hint: "<comparison-type-id>"
---

# Comparison: Scaffold Type

You are generating the machine-readable schema files for a Lineup comparison type based on its existing `RESEARCH.md`. This is the second step after `/new-type`, which drafts the research guide and leaves it for human review.

This skill is **non-interactive**: it translates RESEARCH.md into the schema files using defensible defaults and writes them directly. Anything that required a judgment call (ambiguous direction, empty tag set, unrecognized type label) is surfaced in the Phase 3 summary so the user can edit the files in place. The only conditions that stop execution mid-flight are hard precondition failures (missing `data/<type>/`, missing RESEARCH.md, malformed Attribute Groups section, `attributes.json` already exists).

## Argument Parsing

`$ARGUMENTS` format:
- First whitespace-delimited token: **comparison type id** (kebab-case). Must match an existing `data/<type>/` directory.

If the id is missing, not kebab-case, or the directory doesn't exist, abort and ask.

## Prerequisites

1. Read `CLAUDE.md` at the project root to confirm this is a Lineup project and pick up local conventions (commit format, etc.).
2. Confirm `data/<type>/RESEARCH.md` exists. If not, abort and suggest `/new-type <type>`.
3. Confirm `data/<type>/attributes.json` does NOT already exist. If it does, abort — the user should edit it directly rather than have the skill overwrite. Do not overwrite.
4. Read `data/index.json` — you will append one entry at the end, preserving existing entries and whitespace.
5. Read `data/<type>/RESEARCH.md` end-to-end. Focus on:
   - **Overview** — source of the `description` field for `attributes.json` and `data/index.json`.
   - **Attribute Groups** tables — each `### <N>. Group Name` becomes a `groups[]` entry, each row becomes one attribute.
   - **Scope / Assessment Guidelines** — may inform tag sets or attribute descriptions.
6. Skim 1–2 existing `data/*/attributes.json` files to internalize in-project formatting (indentation, key ordering, `expandedByDefault` conventions).

## Phase 1: Translate RESEARCH.md → Schema

Walk every attribute table in RESEARCH.md and translate each row:

1. **Group**: the `### <N>. Group Name` heading becomes a `{ id, name, expandedByDefault, attributes }` entry. `id` is kebab-case derived from the group name. First 1–2 groups get `expandedByDefault: true`; deeper groups default to `false`.
2. **Attribute**: each table row becomes `{ id, name, valueType, description? }`. `id` is kebab-case derived from the attribute name.
3. **ValueType**: translate the human label in RESEARCH.md's `Type` column into the machine form using the cheatsheet below. For ranked types (integer, decimal, percentage, filesize, duration, date, datetime, rating), infer `direction` from the research note (e.g. "higher is better" → `"ascending"`, "lower is better" → `"descending"`, "neutral" → `"neutral"`). If the note is ambiguous, default to `"ascending"` for `integer`/`decimal`/`percentage`/`rating`/`date`/`datetime` and `"descending"` for `filesize`/`duration` (smaller/faster is the more common preference), and surface the attribute in the Phase 3 summary so the user can flip it.
4. **Tag sets**: when a tag attribute's research note lists the expected tags (e.g. "tags: MIT, Apache-2.0, GPL-3.0"), seed them as `{ id: "...", value: "...", color: "..." }`. `id` is kebab-case, `value` is the display label, and colors are reasonable picks from `blue`, `green`, `red`, `orange`, `purple`, `gray`. Set `defaultColor: "gray"`. If no tags are listed, seed `tags: []` and note this in the Phase 3 summary so the user can add tags.
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

Track every judgment call you make (defaulted direction, empty tag set, fallback group/attribute id, unrecognized type label coerced to `"text"`) in a running list — it becomes the **Defaults to review** section of the Phase 3 summary. Do NOT pause to ask the user; proceed straight to Phase 2.

## Phase 2: File Generation

### `data/<type>/attributes.json`

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

### `data/<type>/index.json`

Create as:

```json
{
  "candidates": []
}
```

Empty — candidates are added via `/add-candidate`.

### Update `data/index.json`

Append a single entry at the end of the `comparisons` (or top-level) array, preserving all existing entries and whitespace:

```json
{
  "id": "<type>",
  "name": "<Display Name>",
  "description": "<one-sentence description>"
}
```

## Phase 3: Summary

Present (concise — the user did not participate in the decisions, so the summary is their first view of the result):

- Tree of created files under `data/<type>/`, plus the resolved comparison `name` and `description` inline (so the user sees the chosen wording without opening the file).
- Confirmation that `data/index.json` was updated.
- **Defaults to review** — only when defaults actually applied. Examples (omit the section entirely if none apply):
  - Direction defaulted because the research note was ambiguous (list each `<group-id>.<attribute-id>` and the chosen direction).
  - Tag set seeded as empty `[]` (list each `<group-id>.<attribute-id>`).
  - Group/attribute id was derived from a heading or label that produced an awkward kebab-case (e.g. unicode characters dropped).
  - Type label in RESEARCH.md was unrecognized and fell back to `"text"` (list each occurrence).
- The expected commit command, multi-`-m` format (per the project's CLAUDE.md):

```bash
git add data/index.json data/<type>/attributes.json data/<type>/index.json
git commit -m "data(<type>): SCHEMA" \
  -m "<1–2 sentence summary of the comparison and its intended audience>" \
  -m "🤖 Generated with [Claude Code](https://claude.com/claude-code)" \
  -m "Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

If RESEARCH.md has not been committed yet, remind the user to include it (either folded into this commit or as a prior `data(<type>): RESEARCH` commit, their preference).

Remind the user that the next step is `/add-candidate <type> <candidate-id>` for each initial candidate they want to track.

## Git

Do NOT commit. Print the exact command the user can run (or they can use the project's `/commit` skill if one is installed).

## Rules

- Do NOT ask the user clarifying questions. Resolve every field from RESEARCH.md plus the defaults in Phase 1; surface judgment calls in the Phase 3 summary so the user can edit the files directly. The only exceptions are the hard precondition failures listed below (missing id, missing directory, missing RESEARCH.md, existing `attributes.json`, malformed Attribute Groups section).
- Do NOT modify `RESEARCH.md` — it is the source of truth for this skill.
- Do NOT invent attributes, groups, or tag values not present in RESEARCH.md.
- Do NOT create candidate JSON files — that's `/add-candidate`.
- JSON output MUST be valid: ASCII quotes, no trailing commas, no comments inside `.json` files.
- kebab-case for all `id` fields (comparison type, group, attribute, tag).
- Match existing project style: indentation, attribute ordering within groups (generic → specific).
- If RESEARCH.md's Attribute Groups section is malformed (missing tables, unparseable Type column, unrecognized labels), abort and tell the user precisely what to fix before retrying.
- If `data/<type>/attributes.json` already exists, abort — never overwrite. Ask the user to delete it or edit directly.
- If a required file or directory is missing (no `data/`, no `CLAUDE.md`, no `RESEARCH.md`), abort and explain.

---
name: new-type
description: "Draft data/<type>/RESEARCH.md for a new Lineup comparison type through Socratic scoping. Writes only the research guide so the user can iterate on scope, attributes, and sources before schema files are generated. Use when adding a new side-by-side comparison (databases, hosting providers, etc.) to a Lineup project. Arguments: comparison type id (kebab-case, required), optional free-text seed."
model: opus
allowed-tools: Read, Glob, Write
argument-hint: "<comparison-type-id> [free-text seed]"
---

# Comparison: New Type

You are drafting the research guide for a new comparison type in a Lineup project. A comparison type lives under `data/<type>/`; this skill produces only the authoritative `RESEARCH.md` (scope, attributes, sources, assessment, candidates) so you and the user can collaborate on it before the structural JSON files are generated.

Once RESEARCH.md is in a shape the user is happy with, they run `/scaffold-type <type>` to derive `attributes.json`, register the type in the top-level `data/index.json`, and scaffold stubs for the Candidates into `data/<type>/index.json`. Candidate attribute values are researched later via `/gather-data`. `/scaffold-type` also handles adding further candidate stubs to an already-scaffolded type.

## Argument Parsing

`$ARGUMENTS` format:
- First whitespace-delimited token: **comparison type id** (kebab-case, e.g. `rust-embedded-databases`). Used as the directory name.
- Optional remainder: free-text seed describing what the comparison should cover.

If the id is missing or not kebab-case, ask the user to provide one before proceeding.

## Prerequisites

1. Read `CLAUDE.md` at the project root to confirm this is a Lineup project and to pick up local conventions (commit format, etc.).
2. Read `data/index.json` to see existing comparison types and their shapes.
3. Confirm `data/<type>/` does NOT already exist — if it does, abort and point the user to `/scaffold-type` (to finish schema generation, add more candidate stubs to an existing type) or direct editing.
4. Skim 1–2 existing `data/*/RESEARCH.md` files to internalize the in-project tone and depth before drafting a new one.

## Phase 1: Socratic Scoping (Interactive)

Guide a focused conversation — typically 2–4 rounds, not an interrogation. If a seed was provided, lead with a concrete proposal and ask the user to confirm or redirect ("Here's what I'd suggest based on your seed — let's refine.").

Cover these dimensions:

1. **Purpose** — What decision or question does this comparison help the user make? Who is the intended audience?
2. **Scope** — What items are *included*? What is explicitly *excluded*? (A sharp exclusion list prevents scope creep later.)
3. **Attribute groups** — What thematic clusters of attributes matter? (e.g. "General Information", "Performance", "Ecosystem".) For each group propose 3–8 attributes with:
   - attribute name
   - value type (text / boolean / integer / decimal / date / datetime / filesize / duration / percentage / rating / tags / icon / link)
   - for ranked types: direction (ascending = higher is better, descending = lower is better, neutral = no ranking)
   - for tag types: expected tag set
   - a one-line research note: how to find this value
4. **Candidates** — Propose a seed list of items to research. Order roughly by salience (undisputed leaders first, niche/emerging last) but do not split into tiers.

### Attribute Type Cheatsheet (for RESEARCH.md tables)

Human labels to use in the `Type` column of the attribute tables. The `/scaffold-type` skill translates these into the machine schema; you don't need to write JSON here.

| Label                        | Use for                                        |
|------------------------------|------------------------------------------------|
| `text`                       | Freeform text                                  |
| `boolean`                    | Yes/no                                         |
| `link`                       | Clickable URL                                  |
| `integer` / `decimal`        | Counts or decimal measures (note direction)   |
| `percentage`                 | 0–100 or 0–1 (note direction)                  |
| `filesize` / `duration`      | Ranked quantities (note direction)             |
| `date (year)`                | Release year                                   |
| `date (month-year)`          | Release month + year                           |
| `date (full)`                | Full calendar date                             |
| `datetime`                   | Date + time                                    |
| `rating (1–5)`               | Star rating                                    |
| `tags`                       | Tag set (list the expected tags in the note)  |
| `icon`                       | Font Awesome icon                              |

For ranked types, state direction in the research note (e.g. "higher is better", "lower is better", "neutral"). For tag types, list the expected tag set inline in the research note (e.g. "tags: MIT, Apache-2.0, GPL-3.0, proprietary").

### Convergence

Once you've gathered enough in Phase 1 to draft all seven sections, proceed straight to Phase 2 and write the file. Do NOT present a pre-write chat summary or ask "Ready to generate?" — the user reviews the file itself, not a recap. The user will iterate on the written file directly.

## Phase 2: File Generation

Write `data/<type>/RESEARCH.md` immediately after Phase 1 converges. Do NOT create `attributes.json`, do NOT create `index.json`, and do NOT touch the top-level `data/index.json` — those belong to `/scaffold-type` and should wait until RESEARCH.md is finalized.

### `data/<type>/RESEARCH.md`

Include ALL seven required sections:

1. **Overview** — one paragraph: purpose and what users learn.
2. **Scope** — `**Included:**` and `**Excluded:**` bullet lists. Be specific.
3. **Attribute Groups** — one `### <N>. Group Name` per group, each followed by a markdown table with columns `Attribute | Type | Research Notes`. Type column uses human labels from the cheatsheet above.
4. **Research Sources** — two subsections: `### Primary Sources (Preferred)` and `### Secondary Sources`. Numbered lists, each entry naming the source and what it's useful for.
5. **Assessment Guidelines** — bullet list, one per ambiguous attribute or threshold (`**Attribute Name**: specific criteria`). Explicitly state when `null` is preferable to a guessed value.
6. **Candidates** — a single flat list (no tier subheadings). Each candidate as `- [ ] <Name> — <reason for inclusion>`. Checkboxes get ticked later when data is gathered.
7. **Notes for Researchers** — numbered list of general principles: verify sources, cite with URLs, use `null` with comment when uncertain, note version/date of time-sensitive facts.

Match the tone and depth of existing `data/*/RESEARCH.md` files in the project.

## Phase 3: Handoff

Keep this short — the user reviews the file, not a chat recap. Output only:
- The path of the created file: `data/<type>/RESEARCH.md`.
- **Next step**: review the file and tell me what to change. Once it reads well, run `/scaffold-type <type>` to generate `attributes.json`, the empty `index.json`, and the entry in `data/index.json`.

Do NOT re-summarize scope, attribute groups, or candidates here — they are in the file. Do NOT print a commit command — the type is not yet usable (no schema, not registered in `data/index.json`). The commit pattern is `/scaffold-type`'s concern.

## Git

Do NOT commit.

## Rules

- Do NOT create `attributes.json`, `index.json`, or modify the top-level `data/index.json` — those belong to `/scaffold-type`.
- Do NOT invent candidates the user didn't discuss; keep the initial list aligned with Phase 1.
- kebab-case for the comparison type id.
- Match existing project style: tone and depth in RESEARCH.md.
- If a required file or directory is missing (no `data/`, no `CLAUDE.md`), abort and explain rather than improvising.

---
name: gather-data
description: "Research and populate attribute values for a Lineup candidate using the comparison type's RESEARCH.md as the guide. Actively searches the web for authoritative sources and records {value, source, comment} per attribute, then commits the updated candidate file. Use for initial research or to refresh stale values. Arguments: comparison type (required), optional candidate id (auto-picked as the next under-researched candidate when omitted), optional attribute id or group id to scope the work."
model: opus
allowed-tools: Read, Glob, Grep, Write, Edit, WebSearch, WebFetch, Bash(date:*), Bash(gh repo *), Bash(gh api *), Bash(gh search *), Bash(bash ${CLAUDE_SKILL_DIR}/validate-json.sh*), Bash(git add:*), Bash(git commit:*), Bash(git status:*), Bash(git diff:*)
argument-hint: "<comparison-type> [candidate] [attribute-id[,attribute-id...]|group-id]"
---

# Comparison: Gather Data

You are researching attribute values for a single Lineup candidate and writing them into `data/<type>/<candidate>.json`. The authoritative guide for *what* to research and *how* to assess it is the comparison type's `RESEARCH.md`; your job is to follow it, cite sources, and be honest about uncertainty.

## Argument Parsing

`$ARGUMENTS` (positional):

1. **comparison type id** — must match an existing `data/<type>/` directory.
2. **candidate id** (optional) — must match an existing `data/<type>/<candidate>.json` file. When omitted, auto-pick the next under-researched candidate (see **Auto-Pick** below).
3. **scope filter** (optional) — an attribute id (`license`, `horizontal-scaling`), a comma-separated list of attribute ids (`license,first-release`), or a group id (`general`, `performance`). When omitted, research every attribute defined in `attributes.json`.

If the comparison type is missing, ask the user. If the scope filter doesn't match any known attribute or group, list the valid options and ask. When the candidate is omitted, the scope filter is ignored (auto-pick always runs a full initial pass — pass the candidate explicitly if you want to scope).

## Auto-Pick (when candidate id is omitted)

Use the **Candidates** checkboxes in `RESEARCH.md` as the source of truth — this skill flips `- [ ] <Name>` → `- [x] <Name>` at the end of a successful pass (Phase 3), so an unchecked box means "not yet researched."

1. **Pick the first `- [ ] <Name>` entry** in RESEARCH.md's Candidates section, in listed order. Resolve the name to a candidate id by matching against `data/<type>/index.json` (the entry text may be the display name or the id).
2. **Announce the pick**: `"Auto-picked <candidate-id> (unchecked in RESEARCH.md)"`. Proceed in initial mode without further Socratic exchange (the user can interrupt if the pick is wrong).
3. **Nothing to pick**: if every entry is `- [x]`, report "all registered candidates are checked off in RESEARCH.md" and stop. Suggest the user pass a candidate id explicitly to force a refresh, or scaffold a new candidate via `/scaffold-type`.

Refresh of an already-researched candidate always requires an explicit candidate id — auto-pick never runs refresh mode, to avoid churning fresh data.

## Prerequisites

1. Read the project root `CLAUDE.md` (commit format, shell rules).
2. Read `data/<type>/RESEARCH.md` — focus on:
   - **Attribute Groups** tables (the Research Notes column is your playbook per attribute)
   - **Research Sources** (Primary > Secondary — prioritize accordingly)
   - **Assessment Guidelines** (thresholds, when to use `null`)
3. Read `data/<type>/attributes.json` — authoritative for attribute ids, types, and tag sets.
4. Read `data/<type>/index.json` — needed for auto-pick AND to sanity-check that the target candidate is registered.
5. Read `data/<type>/<candidate>.json` — existing metadata and any previously gathered values (after the candidate is resolved, explicitly or via auto-pick).
6. Determine **mode**:
   - `initial` — if `values` is empty or missing most attributes, OR the candidate was chosen via auto-pick.
   - `refresh` — if the file already contains substantive values AND the candidate was passed explicitly. In refresh mode, prefer updating values with newer sources and explicitly note in a `comment` when a value changed significantly.
   - `backfill` — a refresh variant for filling schema gaps: the file already contains substantive values and the scope filter targets exactly the attribute ids *missing* from `values` (typically added later by `/extend-comparison`). Research only the in-scope attributes and add their entries; every pre-existing value stays untouched. Commits as `refresh` in the commit subject.

## Phase 1: Plan the Research Pass

Before any web search, build a mental (or written-to-user) list of attributes in scope:

- If no scope filter: list every attribute from `attributes.json`, grouped as in RESEARCH.md.
- If scope is a group id: list attributes in that group only.
- If scope is one or more attribute ids: exactly those attributes.

Briefly announce the plan to the user ("Researching 14 attributes across 3 groups for `postgresql` in `databases`, initial mode.") so they can interrupt if the scope is wrong. Then proceed without further Socratic exchange.

## Phase 2: Research Loop

For each in-scope attribute, in the order declared by `attributes.json`:

1. **Consult RESEARCH.md's Research Notes** for that attribute — this often dictates which source type to hit first.
2. **Search primary sources first.** Use `WebSearch` for discovery and `WebFetch` to verify specific claims. Favor: official website, official docs, official repository, official release notes. Fall back to secondary sources (Wikipedia, rankings sites, community wikis) when primary sources are silent.
3. **Match the attribute's `valueType`** when writing the value (see cheatsheet below).
4. **Record `{value, source, comment}`**:
   - `value` — typed per `valueType`. Use `null` when genuinely indeterminate or not applicable (per RESEARCH.md's Assessment Guidelines).
   - `source` — array of fetched URLs that back the value. Include the most authoritative 1–3, not a dump.
   - `comment` — short free-text. Add when: the value is `null` (explain why), the value needed interpretation (cite the specific guideline), the value is contested, or the value is time-sensitive (include the date you checked).
5. **Be honest about uncertainty.** If a reasonable researcher would disagree, pick the most defensible value and note the ambiguity in `comment`. Do NOT invent sources. Do NOT cite URLs you haven't fetched.
6. **Dates**: for `date` valueType with `format: "year"`, write `"2024"`. For `month-year`, `"2024-01"`. For `full`, `"2024-01-15"`. Store ISO 8601 strings.
7. **Tags**: the `value` is a `string[]` of tag ids already defined in `attributes.json`. If the tag you need is missing from the defined set, that is a schema contradiction — stop and follow **Halting on Schema Contradictions** below.
8. **Booleans**: apply the threshold from RESEARCH.md's Assessment Guidelines (e.g. "ACID compliant only if full ACID by default"). Borderline cases → `comment` with the reasoning.

### Halting on Schema Contradictions

Stop the pass early — without writing the candidate file or committing — when you detect that the schema cannot faithfully express what your research found. Typical cases:

- A `tags`-type attribute needs a tag that isn't defined in `attributes.json`.
- An attribute is described in RESEARCH.md but missing from `attributes.json` (or vice-versa) and the gap is load-bearing for this candidate.
- RESEARCH.md's Research Notes imply a different `valueType`, `direction`, or option shape than what `attributes.json` defines.
- A real, important property of the candidate has no defined attribute to land in.
- An Assessment Guideline is missing or self-contradictory for an attribute you're trying to fill.

When you hit one of these, do NOT try to work around it with a stretched value or a silent `null`. Instead:

1. **Do not** edit `attributes.json` directly.
2. **Propose a concrete diff to RESEARCH.md** — show the change as a fenced code block (which Attribute Groups row to add or change, which tag id + label to add to a tag set, which guideline to clarify). Do not apply the diff; the user reviews it first.
3. **Recommend the user run `/scaffold-type <type>`** after they accept the RESEARCH.md change so `attributes.json` is regenerated from the updated guide.
4. **Do NOT write the candidate file, do NOT flip the RESEARCH.md checkbox, do NOT commit.** Skip Phases 3 and 4 entirely.
5. Summarize what you researched so far (which attributes are settled, which are blocked on the contradiction) so the user can resume after the schema is fixed. Then stop and wait for human review.

A `null` value with an honest `comment` is NOT a contradiction — that's the ordinary "no data available" path and it should commit normally. The bar for halting is "the schema itself is wrong or incomplete," not "this candidate is fuzzy."

### ValueType → `value` cheatsheet

| `valueType`                 | `value` shape                          | Example                                                 |
|-----------------------------|----------------------------------------|---------------------------------------------------------|
| `"text"` / `"link"` / icon  | string                                 | `"PostgreSQL"` / `"https://example.com"`                |
| `"boolean"`                 | boolean                                | `true`                                                  |
| `integer` / `decimal` / `percentage` / `filesize` / `duration` | number | `15000` / `3.14` / `99.95`                              |
| `date` / `datetime`         | ISO 8601 string (see Phase 2.6)        | `"1996"` / `"2024-01"` / `"2024-01-15T14:30:00"`        |
| `rating`                    | number within `[lower, upper]`         | `4.5`                                                   |
| `tags`                      | array of tag ids from `attributes.json`| `["mit", "apache2"]`                                    |
| indeterminate / N/A         | `null` + `comment`                     | `{ "value": null, "comment": "closed-source" }`         |

## Phase 3: Write the Candidate File

Write the full updated `data/<type>/<candidate>.json`:

- Fetch today's date via `Bash` (`date +%Y-%m-%d`) and set `lastVerified` at the top level (alongside `name`/`description`/`icon`/`url`, above `values`). Do this in both `initial` and `refresh` modes.
- Preserve top-level metadata (`name`, `description`, `icon`, `url`) unchanged unless the user explicitly asked for a refresh of those too.
- In a scoped pass (attribute/group filter, including `backfill` mode), out-of-scope entries in `values` stay byte-identical — prefer surgical `Edit` inserts over rewriting the whole file.
- Order entries inside `values` to match the attribute order in `attributes.json` (improves diffs and readability).
- Keep JSON strictly valid: double quotes, no trailing commas, no comments.
- After the write, validate the file with the allow-listed script:
  ```bash
  bash ${CLAUDE_SKILL_DIR}/validate-json.sh data/<type>/<candidate>.json
  ```
  It prints `<file>\tVALID` on success and `INVALID` with the parse error otherwise — fix and re-run before proceeding. (When running as a `gather-data-worker` subagent, `${CLAUDE_SKILL_DIR}` is not set; use the repo-relative path `.claude/skills/gather-data/validate-json.sh` instead.)

### Top-level candidate file shape (for reference)

```json
{
  "name": "...",
  "description": "...",
  "icon": "...",
  "url": "...",
  "lastVerified": "YYYY-MM-DD",
  "values": { ... }
}
```

`lastVerified` is written by this skill on every pass. `description`, `icon`, and `url` are optional.

### RESEARCH.md checkbox (initial mode only)

If the candidate appears in `RESEARCH.md`'s **Candidates** section with an unchecked box (`- [ ] <Name>` or `- [ ] <candidate-id>`), switch it to `- [x]` now that real data exists. Match on the display name OR the candidate id; do not touch unrelated lines.

## Phase 4: Commit

This skill is designed to run unattended, so a direct invocation commits its own work. Do NOT stop early to wait for human review — the commit *is* the handoff.

(Exception: when run as a `gather-data-worker` under `/gather-data-cycle`, the worker has no commit tools and skips this phase — the cycle orchestrator flips the RESEARCH.md checkbox and commits each candidate serially. That path is governed by the worker's own instructions, not this section.)

1. Fetch the timestamp: `date +"%Y-%m-%d %H:%M"` via Bash.
2. Stage the files:
   ```bash
   git add data/<type>/<candidate>.json data/<type>/RESEARCH.md
   ```
   Include `data/<type>/index.json` in the `git add` only if you modified it (rare — only happens when the candidate's `shownByDefault` flag needs flipping).
3. Commit using the project's multi-`-m` format (per CLAUDE.md) and Lineup's candidate commit convention:
   ```bash
   git commit -m "data(<type>): CANDIDATE <initial|refresh> <YYYY-MM-DD HH:MM>" \
     -m "<summary of findings and notable comments>" \
     -m "🤖 Generated with [Claude Code](https://claude.com/claude-code)" \
     -m "Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
   ```
4. Run `git status` to confirm the commit landed and the tree is clean.

**When NOT to commit.** Do NOT commit when:
- A schema contradiction was detected (see **Halting on Schema Contradictions** in Phase 2) — the candidate file should not have been written either; report the proposed RESEARCH.md diff and the `/scaffold-type` recommendation, and wait for human review.
- A Primary Source contradicts itself or another Primary Source (see Rules below) and forced you to stop.
- The pass failed catastrophically due to tool errors and no attributes could be populated.

A pass that legitimately landed many `null` values (with honest `comment`s) is NOT a failure and SHOULD commit.

## Phase 5: Summary

After the commit succeeds, present to the user:

- Mode used (`initial` / `refresh`).
- `lastVerified: <date>` — confirm the date stamp that was written.
- Count of attributes populated vs. set to `null` (with a short rationale for each `null`).
- Any `comment`s worth the user's attention (contested values, tag gaps, time-sensitive notes).
- The commit SHA and subject line for the commit that just landed.

## Rules

- Do NOT fabricate sources. Every URL in `source` must have been fetched successfully by `WebFetch`.
- Do NOT set `source: []` silently. If a value has no source (e.g. derived trivially from the candidate's own name), say so in `comment`.
- Do NOT invent attribute ids. Every key in `values` MUST match an `attribute.id` in `attributes.json`.
- Do NOT change the candidate's `name`, `description`, `icon`, or `url` unless explicitly asked.
- Do NOT edit `attributes.json` directly. When the schema can't express your findings (missing tag, missing attribute, mismatched `valueType`, etc.), follow **Halting on Schema Contradictions** in Phase 2: propose a RESEARCH.md diff, recommend `/scaffold-type <type>`, skip Phases 3 and 4, and wait for human review.
- Respect RESEARCH.md's Assessment Guidelines literally. When a guideline says "mark `true` only if X", do not round up.
- When refreshing, never silently drop a previously-recorded value. If you can't verify it, keep it and add a `comment` noting the verification failure, or replace with the new value and note the change.
- Stop and ask if a Primary Source contradicts itself or another Primary Source — surface it to the user instead of picking a side arbitrarily. In that case, skip the commit in Phase 4.
- Always set `lastVerified` to today's date (day precision, `YYYY-MM-DD`) when writing the candidate file — in both `initial` and `refresh` modes. Never copy the old timestamp forward unchanged; the point of the stamp is to record that *this* pass verified the data.
- Commit only the research files: `data/<type>/<candidate>.json`, `data/<type>/RESEARCH.md`, and (if modified) `data/<type>/index.json`. Never use `git add -A` or `git add .` — unrelated dirty state in the working tree must not be swept into the research commit.

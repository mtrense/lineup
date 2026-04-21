---
name: add-candidate
description: "Add a single new candidate to an existing Lineup comparison type, with a scope-fit check against the comparison's RESEARCH.md before anything is written. Creates the `data/<type>/<candidate>.json` stub, appends the entry to `data/<type>/index.json`, and appends a new `- [ ] <Name> — <reason> (added <date>)` line to RESEARCH.md's Initial Candidates list. Use when the user has a specific candidate in mind (often with URL / description / reasoning provided inline) and wants it vetted against scope before it lands. For bulk scaffolding of candidates already listed in RESEARCH.md, use `/scaffold-type` instead. Arguments: comparison type id (required), candidate name (required), optional free-text context (URL, description, reasoning)."
disable-model-invocation: true
model: opus
allowed-tools: Read, Glob, Write, Edit, Bash(date:*), Bash(gh repo *), WebFetch, WebSearch
argument-hint: "<comparison-type> <candidate-name> [url / description / reasoning]"
---

# Comparison: Add Candidate

You are adding a single new candidate to an existing Lineup comparison type. Unlike `/scaffold-type` (which bulk-scaffolds candidates already listed in RESEARCH.md, non-interactively, from defensible defaults), this skill is **single-candidate and scope-aware**: the user provides a name and typically some context, and before any file is written you verify that the candidate is not already present and that it fits the comparison's declared scope.

The skill writes three things on success:

1. `data/<type>/<candidate>.json` — a stub with `name`, optional `description`, optional `url`, and an empty `values` object. `/gather-data` fills the values on a subsequent pass.
2. `data/<type>/index.json` — a new `{ id, shownByDefault }` entry appended at the end.
3. `data/<type>/RESEARCH.md` — a new `- [ ] <Name> — <reason> (added <YYYY-MM-DD>)` line appended to the **Initial Candidates** list.

## Argument Parsing

`$ARGUMENTS` (free-form, but expected shape):

1. **comparison type id** — first whitespace-delimited token; kebab-case; must match an existing `data/<type>/` directory.
2. **candidate name** — the display name. Usually the second token, but may be multiple tokens or a quoted string (e.g. `"Factory AI"`). Parse by intent: the name is the shortest leading run that reads as a product / project name, stopping at obvious breaks like a URL, an em-dash, or a description clause.
3. **free-text context** (optional remainder) — may contain any subset of:
   - a URL (recognize `http(s)://...`)
   - a one-sentence description
   - a reason for inclusion (why it belongs in this comparison)

Don't require a rigid grammar. If the user wrote `/add-candidate ai-workflows Factory AI https://factory.ai — coding agent platform for spec-first delivery`, parse that as `type=ai-workflows`, `name="Factory AI"`, `url="https://factory.ai"`, `reason="coding agent platform for spec-first delivery"`. Use judgment.

If the comparison type is missing or the directory doesn't exist, abort and ask. If the candidate name is missing, abort and ask. These are the only mandatory prompts; every other ambiguity is either resolved from RESEARCH.md or surfaced in the Phase 3 summary.

## Prerequisites

1. Read `CLAUDE.md` at the project root to confirm this is a Lineup project and pick up local conventions (commit format, shell rules).
2. Confirm `data/<type>/` exists. If not, abort and suggest `/new-type <type>` followed by `/scaffold-type <type>`.
3. Confirm `data/<type>/RESEARCH.md` exists. If not, abort — this skill depends on RESEARCH.md's Scope and Initial Candidates sections.
4. Confirm `data/<type>/index.json` exists (the type has been scaffolded). If not, abort and suggest running `/scaffold-type <type>` first.
5. Read `data/<type>/RESEARCH.md` — focus on:
   - **Scope** (Included / Excluded) — the scope-fit check hinges on these.
   - **Initial Candidates** — the list the new entry will be appended to, and the source of truth for "already listed?" checks.
   - **Overview** — context for judging scope fit.
6. Read `data/<type>/index.json` — to detect already-registered candidates and to preserve ordering.
7. `Glob data/<type>/*.json` once to detect pre-existing per-candidate files without reading each.

## Phase 1: Resolve the Candidate Id

Derive the candidate id from the display name (kebab-case): lowercase, ASCII, spaces and punctuation → hyphens, collapse runs, trim leading/trailing hyphens.

- `Factory AI` → `factory-ai`
- `Apache Cassandra` → `apache-cassandra`
- `MySQL / MariaDB` → keep the first segment (`mysql`) and flag the truncation in the summary so the user can rename if they meant the combined entry.

Non-ASCII characters are stripped or transliterated to their closest ASCII form (`ß` → `ss`, `é` → `e`). If stripping leaves the id empty or wildly unlike the input, abort and ask the user for a preferred id.

## Phase 2: Duplicate and Scope Check

Run these checks in order. Any hit stops the write path; report what was found and either abort or ask the user how to proceed.

### 2.1 Already scaffolded?

- If `data/<type>/<candidate-id>.json` already exists: abort. Tell the user the file is already present and suggest `/gather-data <type> <candidate-id>` for an initial / refresh research pass.
- If the id is already in `data/<type>/index.json` (but the file is somehow missing): surface the inconsistency and abort — this is a repo-integrity issue the user should resolve manually before proceeding.

### 2.2 Already listed in RESEARCH.md?

Scan `RESEARCH.md`'s **Initial Candidates** section for an entry whose display name kebab-cases to the same id, or whose text matches the user's name case-insensitively.

- **Hit with unchecked box (`- [ ]`)**: the candidate is listed but not yet scaffolded. Suggest `/scaffold-type <type> <candidate-id>` instead — that's the canonical path for already-listed entries. Stop and let the user decide whether to switch skills. Do not silently proceed.
- **Hit with checked box (`- [x]`)**: the candidate was already researched at some point (the checkbox was flipped by `/gather-data`). This contradicts Phase 2.1 finding nothing — surface it as a likely repo-integrity issue and stop.
- **No hit**: proceed to 2.3.

### 2.3 Scope-fit assessment

Compare the proposed candidate against RESEARCH.md's **Scope** section.

- **Clear fit** (candidate obviously matches an `Included:` bullet and none of the `Excluded:` bullets): proceed without asking. Note in the final summary which bullet(s) you matched against.
- **Clear mismatch** (candidate matches an `Excluded:` bullet, or clearly sits outside the Included set): pause and present the mismatch to the user. Quote the relevant Scope bullets and the reason for the mismatch. Ask: "Do you want to add this anyway?" Only proceed on explicit `yes` / `add anyway` / equivalent. If the user declines, suggest either refining Scope in RESEARCH.md first (so the candidate reads as in-scope going forward), or picking a different candidate.
- **Ambiguous** (candidate plausibly fits, but it's a judgment call — e.g. adjacent category, borderline maturity, depends on interpretation of a Scope bullet): surface the ambiguity to the user with your best read, and ask whether to proceed. Do not invent a confidence.

User context from the arguments (the reasoning free-text) feeds this judgment — if the user wrote `"...because it ships a spec-first workflow on top of Claude Code"`, weigh that against the Scope bullets explicitly.

If the arguments don't give you enough to judge scope confidently (no description, no reasoning, unfamiliar name), a **lightweight** web check is permitted — strictly to answer "does this belong in this comparison?":

- Prefer `WebFetch` on the user-provided URL, or the candidate's landing page / one linked docs page if the URL is obvious. One fetch is usually enough; two is the cap.
- Use `WebSearch` only if no URL was given and you need to locate the official site. One query.
- Read just enough to map the candidate onto the Scope bullets — the product's one-line positioning, its category, whether it hits any Excluded bullet.
- Do NOT harvest attribute values, pricing, version numbers, feature matrices, or other metadata that belongs to `/gather-data`. Do NOT expand the stub's `description` or `url` from web findings beyond what the user gave you.
- If a quick check doesn't resolve the ambiguity, stop and ask the user rather than digging deeper.

The goal of this phase is to catch scope drift before files are written, not to be a gatekeeper. When in doubt, ask once and proceed on confirmation.

## Phase 3: Write the Files

Only run this phase after Phase 2 cleared (either clear fit, or user confirmed to add anyway).

Fetch today's date once via `Bash` (`date +%Y-%m-%d`) and reuse it for the RESEARCH.md append.

### 3.1 `data/<type>/<candidate-id>.json`

Create the stub:

```json
{
  "name": "<Display Name>",
  "description": "<one-sentence description, if the user provided one>",
  "url": "<official URL, if the user provided one>",
  "values": {}
}
```

- Omit `description` entirely if none was provided (don't write an empty string).
- Omit `url` entirely if none was provided.
- Omit `icon` — `/gather-data` handles icons later if at all.
- Do NOT include `lastVerified`. A scaffolded candidate has not been researched; the missing field is what makes the "Last Verified" row render `—` honestly.
- `values` is intentionally empty. `/gather-data` fills it.
- Filename MUST match the candidate id exactly: `<candidate-id>.json`, lowercase, hyphens only.

### 3.2 `data/<type>/index.json`

Append a single entry at the end of the `candidates` array, preserving existing order and whitespace:

```json
{ "id": "<candidate-id>", "shownByDefault": true }
```

Always `shownByDefault: true` for a freshly-added candidate — the user can flip it later by editing `index.json` directly. Do NOT reorder existing entries.

### 3.3 `data/<type>/RESEARCH.md`

Append a new line at the end of the **Initial Candidates** list:

```
- [ ] <Display Name> — <reason for inclusion> (added <YYYY-MM-DD>)
```

- The reason for inclusion comes from the user-provided free-text reasoning. If the user didn't give a reason, write a concise one drawn from the description or URL (e.g. `— coding agent platform`) — do not omit it. The reason is what future audits use to understand why this entry was added post-scoping.
- The `(added <YYYY-MM-DD>)` suffix is mandatory for entries added by this skill — it distinguishes them from candidates that came out of the original scoping dialogue in `/new-type`.
- Checkbox stays `- [ ]`. It will be ticked by `/gather-data` on the first research pass.
- Do NOT touch any other line. Do NOT modify Scope, Attribute Groups, Research Sources, Assessment Guidelines, or Notes sections.
- Do NOT reorder the Initial Candidates list — append only.

## Phase 4: Summary

Present a concise summary:

- **Mode**: `add-candidate` (so the user sees which skill handled this — helpful when skimming a transcript).
- **Candidate**: `<candidate-id>` — `<Display Name>`. Include the resolved URL and description inline if set.
- **Scope check**: one line — `clear fit` (with the matching Included bullet), `user confirmed despite mismatch` (with the bullet that was overridden), or `proceeded on user confirmation after ambiguity`.
- **Files written**:
  - `data/<type>/<candidate-id>.json` (created)
  - `data/<type>/index.json` (1 entry appended)
  - `data/<type>/RESEARCH.md` (1 line appended to Initial Candidates with `(added <date>)` suffix)
- **Defaults to review** (only include when relevant):
  - Candidate id truncated from a multi-segment name (`MySQL / MariaDB` → `mysql`).
  - Display name auto-cased from the user's input where that might be wrong.
  - Reason for inclusion inferred from the description because the user didn't provide one explicitly.
- **Next step**: `/gather-data <type> <candidate-id>` — research attribute values and flip the checkbox in RESEARCH.md.

### Commit hint

Print the expected commit command in the project's multi-`-m` format (per CLAUDE.md):

```bash
git add data/<type>/<candidate-id>.json data/<type>/index.json data/<type>/RESEARCH.md
git commit -m "data(<type>): CANDIDATE add <candidate-id> <YYYY-MM-DD>" \
  -m "<1–2 sentence summary of the candidate and the reason for adding it>" \
  -m "🤖 Generated with [Claude Code](https://claude.com/claude-code)" \
  -m "Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

Fetch the date via `date +%Y-%m-%d` (same value as used in the RESEARCH.md append).

Alternatively, suggest the user fold this into the subsequent `/gather-data` commit so the stub and initial research land together — this is the common flow when the user is adding a candidate they plan to research immediately.

## Git

Do NOT commit. Print the exact command the user can run (or they can use the project's `/commit` skill if one is installed).

## Rules

- Resolve the candidate's identity (name, id, stub contents) from arguments alone. A lightweight web check is permitted in Phase 2.3 **only** to judge scope fit when the arguments are too thin — see that phase for the caps (one or two fetches, or one search). Do NOT use the web to flesh out metadata (description, url, attribute values, version numbers, features) — that is `/gather-data`'s job.
- Do NOT populate any `values` inside the candidate file. That is `/gather-data`'s responsibility.
- Do NOT write `lastVerified`. The missing field signals "not yet researched" honestly.
- Do NOT modify `attributes.json`, Scope, Attribute Groups, Research Sources, Assessment Guidelines, or Notes sections of RESEARCH.md. This skill only appends to the Initial Candidates list.
- Do NOT overwrite any existing candidate file. Phase 2.1 catches pre-existing files; if one slips through, abort rather than clobber.
- Do NOT reorder entries in `data/<type>/index.json` or the RESEARCH.md Initial Candidates list. Append only.
- Do NOT tick any RESEARCH.md checkbox (`- [ ]` → `- [x]`); that is `/gather-data`'s job.
- Do NOT batch multiple candidates in one invocation. Use `/scaffold-type <type> <id> <id> ...` for bulk. This skill is deliberately single-candidate so the scope check stays meaningful.
- Only ask the user clarifying questions at the well-defined pause points: missing type id, missing candidate name, Phase 2.2 hit on an existing Initial Candidates entry, Phase 2.3 scope mismatch or ambiguity. Everything else resolves to defaults + Phase 4 summary.
- kebab-case for the candidate id and all other ids. Filenames: lowercase, hyphens, no spaces, no underscores, no numeric prefixes.
- JSON output MUST be valid: ASCII quotes, no trailing commas, no comments.
- Match existing project style: indentation, key ordering inside candidate files (`name`, `description`, `url`, `values`).
- If a required file is missing (no `CLAUDE.md`, no `data/<type>/`, no `RESEARCH.md`, no `index.json`), abort with a clear message pointing the user at the skill that creates it (`/new-type` or `/scaffold-type`).
- If the RESEARCH.md Initial Candidates section is malformed (no heading, no existing list to append to), abort and tell the user precisely what to fix.

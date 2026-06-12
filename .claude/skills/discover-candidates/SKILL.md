---
name: discover-candidates
description: "Search the web for additional candidates that fit an existing Lineup comparison type, present them for the user to pick from, then scaffold the chosen ones (RESEARCH.md Candidates append, data/<type>/index.json append, per-candidate stub files). Use when the comparison type is already scaffolded and you want to expand its candidate roster with items you haven't identified yourself. Complements `/add-candidate` (user brings one name), `/scaffold-type` (bulk-scaffolds names already in RESEARCH.md), and `/new-type` (drafts the research guide). Arguments: comparison type id (required), optional free-text hint narrowing the search (e.g. a niche, region, or characteristic)."
model: opus
allowed-tools: Read, Glob, Write, Edit, Bash(date:*), Bash(gh repo *), Bash(bash .scripts/validate-json.sh *), WebSearch, WebFetch
argument-hint: "<comparison-type> [search hint]"
---

# Comparison: Discover Candidates

You are expanding an existing Lineup comparison type by searching the web for candidates that fit its declared scope, presenting them for the user to pick from, and scaffolding the chosen ones. Unlike `/add-candidate` (single candidate the user already has in mind) or `/scaffold-type` (bulk-scaffolds names already listed in RESEARCH.md), this skill handles the *discovery* step: "find me more things that belong in this comparison."

The skill does three things on success:

1. **Discovers** candidates via `WebSearch` / `WebFetch`, filtered by the comparison's Scope and deduplicated against already-listed / already-scaffolded entries.
2. **Presents** the filtered list to the user for explicit selection — this skill never silently writes discovered candidates.
3. **Scaffolds** the selected ones: appends to `data/<type>/RESEARCH.md`'s Candidates list, appends entries to `data/<type>/index.json`, and creates `data/<type>/<candidate>.json` stubs with empty `values`.

`/gather-data` fills the attribute values on a subsequent pass — this skill never populates `values` or writes `lastVerified`.

## Argument Parsing

`$ARGUMENTS` (free-form, but expected shape):

1. **comparison type id** — first whitespace-delimited token; kebab-case; must match an existing `data/<type>/` directory that has both `RESEARCH.md` and `index.json`.
2. **search hint** (optional remainder) — free-text narrowing the discovery. May describe:
   - a niche or sub-category (`open-source only`, `Rust-native`, `self-hostable`)
   - a region or language market (`European vendors`, `Japanese tools`)
   - a characteristic missing from current coverage (`embedded options`, `enterprise-tier`, `recently-launched`)
   - specific sources to check (`browse the latest Hacker News threads`, `from the CNCF landscape`)

If the comparison type id is missing or doesn't match an existing directory, abort and ask. The search hint is optional — without it, do a broad sweep targeted at the Scope.

## Prerequisites

1. Read `CLAUDE.md` at the project root to confirm this is a Lineup project and pick up local conventions (commit format, shell rules).
2. Confirm `data/<type>/` exists. If not, abort and suggest `/new-type <type>` followed by `/scaffold-type <type>`.
3. Confirm `data/<type>/RESEARCH.md` exists. If not, abort — this skill depends on Scope and Candidates being in place.
4. Confirm `data/<type>/index.json` exists (the type has been scaffolded). If not, abort and suggest running `/scaffold-type <type>` first.
5. Read `data/<type>/RESEARCH.md` — focus on:
   - **Overview** — what this comparison is for; the discovery query should match this framing.
   - **Scope** (Included / Excluded) — the filter you apply to discovered results.
   - **Candidates** — the de-duplication list. Capture every entry's display name, derived kebab-case id, and checkbox state.
   - **Research Sources** (Secondary Sources especially) — pre-existing leads to check first (curated lists, surveys, community comparisons). These often yield higher-quality candidates than generic web queries.
6. Read `data/<type>/index.json` — detect already-registered candidate ids (some may not be in RESEARCH.md if they were added manually).
7. `Glob data/<type>/*.json` once to detect pre-existing per-candidate files.

## Phase 1: Build the Discovery Query

Derive 2–5 search queries from Scope + Overview + the user's hint. Examples:

- Comparison: `ai-workflows`, hint: `"Japanese vendors"` → queries like `"AI coding agent Japan"`, `"Japanese spec-driven development platform"`, `"日本 AI agent framework"`.
- Comparison: `rust-embedded-databases`, hint: (none) → queries like `"embedded database Rust crate"`, `"Rust KV store library"`, `"embedded SQL Rust"`, plus a pass against the type's Secondary Sources (e.g. fetch a known curated list).
- Comparison: `website-hosting-providers`, hint: `"recently-launched"` → queries like `"new static site hosting 2025"`, `"JAMstack host launched 2025"`.

Prefer specific over generic — a query that names the Scope's Included characteristics produces better signal than a bare category term.

When RESEARCH.md's **Secondary Sources** lists a curated comparison, survey article, or landscape map, `WebFetch` it first. Those documents often enumerate candidates directly and are higher-quality signal than search results.

Announce the discovery plan in one or two sentences before searching (`"Discovering candidates for ai-workflows with hint 'Japanese vendors' — running 3 search queries and fetching the cameronsjo/spec-compare map for cross-reference."`) so the user can redirect if the framing is wrong.

## Phase 2: Web Search & Fetch

Run the planned queries via `WebSearch`. For each promising hit, use `WebFetch` to read the project's own page (repo, website, docs) and extract:

- **Name** — the project / product / tool's official display name and casing.
- **URL** — canonical URL (official website or repository). Prefer the official site; fall back to the repo if there's no standalone site.
- **One-sentence description** — positioning or primary use case, pulled from the project's own words when possible.
- **Why it fits** — a one-line rationale tying back to a specific Scope Included bullet. This is what becomes the `— <reason>` clause in RESEARCH.md.

Don't research attributes here — that's `/gather-data`'s job. The goal at this phase is only to identify *whether the candidate belongs in the comparison at all*, with enough metadata for the user to decide to include it.

Cap discovery at roughly 15–25 raw candidates before filtering, to keep the presentation manageable. If a query returns far more, prefer breadth (different kinds of candidates) over depth (many variants of the same kind).

### Avoid hallucinated candidates

Every candidate presented in Phase 4 MUST be backed by a URL you actually fetched. Do NOT synthesize a plausible-sounding project name from training data. If `WebSearch` / `WebFetch` didn't yield it, it doesn't exist for this skill's purposes.

## Phase 3: Filter & Deduplicate

For each raw candidate from Phase 2, apply filters in order. Track each dropped candidate with a reason for the Phase 4 summary.

### 3.1 Dedup against existing roster

Derive the candidate id via kebab-case (lowercase, ASCII, spaces/punctuation → hyphens, collapse runs). Drop the candidate if any of these match:

- **Already scaffolded**: `data/<type>/<candidate-id>.json` exists OR the id is in `data/<type>/index.json`. Note in the summary ("already scaffolded — skipped").
- **Already listed in RESEARCH.md**: an Candidates entry whose display name kebab-cases to the same id, or whose line text matches case-insensitively. Note the checkbox state in the summary ("already listed, unchecked — suggest `/scaffold-type`" vs. "already listed, researched — skipped").
- **Obvious alias**: the candidate is a renamed / acquired / forked version of one already listed (e.g. `OpenDevin` → `OpenHands`). Surface as a dedup but ask the user whether to treat the new name as a rename or a distinct entry.

### 3.2 Scope-fit filter

Compare each remaining candidate against RESEARCH.md's **Scope**:

- **Clear fit** (matches an Included bullet, doesn't match any Excluded bullet): keep. Record which Included bullet matched — shows up in the Phase 4 preview so the user sees why this candidate landed on the list.
- **Clear mismatch** (matches an Excluded bullet, or clearly outside Included): drop. Record the reason for the Phase 4 "filtered out" section.
- **Ambiguous** (plausible fit, judgment call): keep but mark as ambiguous. Surface the ambiguity in the presentation so the user can decide.

Be conservative on "clear mismatch" — when in doubt, keep and flag as ambiguous. The user reviews the list anyway; erring toward inclusion is cheap, erring toward exclusion silently drops candidates the user might have wanted.

### 3.3 Quality floor

Drop candidates that are clearly not serious enough to compare against the existing roster:

- No public repository AND no official website.
- Abandoned (last commit >2 years ago AND last release >2 years ago) — unless the comparison explicitly includes historical entries per its Scope.
- Reads as vaporware (landing page only, no docs, no repo, no binary).

When in doubt, keep. The user is the final filter.

## Phase 4: Present for Selection (Interactive)

Present the filtered list to the user and wait for an explicit pick. Do NOT write files yet.

Structure the presentation:

```
Discovered N candidates for <type> (hint: "<hint>"):

1. <Display Name> — <one-line description>
   URL: <canonical url>
   Scope fit: matches "<Included bullet>"
   Why: <short rationale>

2. <Display Name>  [ambiguous scope]
   URL: <canonical url>
   Scope fit: plausibly matches "<Included bullet>" — <why it's ambiguous>
   Why: <short rationale>

...

Filtered out (M): <id> (already scaffolded), <id> (in Excluded bullet "..."), ...

Which would you like to add? (e.g. "1, 3, 5", "all", "all except 2", or "none")
```

- Number the entries so the user can pick by index.
- Show ambiguous entries with an explicit `[ambiguous scope]` tag so the user can factor that in.
- Always include the filtered-out summary (even if empty) — it's load-bearing trust signal that the filter wasn't arbitrary.
- Accept flexible selection syntax: numbers (`1, 3, 5`), ranges (`1-4`), `all`, `all except X`, `none`. Parse charitably.

If the user picks `none`, report "no candidates selected, no files changed" and stop. Do not probe for refinement unless the user asks.

If the user wants to refine the search (e.g. "none of these, try X instead"), re-run Phase 1–3 with the new hint rather than force a selection.

## Phase 5: Write the Files

Only run this phase after the user has picked a subset of candidates in Phase 4.

Fetch today's date once via `Bash` (`date +%Y-%m-%d`) and reuse it for every RESEARCH.md append in this batch.

### 5.1 `data/<type>/<candidate-id>.json` (one per pick)

Create the stub:

```json
{
  "name": "<Display Name>",
  "description": "<one-sentence description from Phase 2>",
  "url": "<canonical URL from Phase 2>",
  "values": {}
}
```

- Omit `description` entirely if none was captured (don't write an empty string).
- Omit `url` entirely if none was captured.
- Omit `icon` — `/gather-data` handles icons later if at all.
- Do NOT include `lastVerified`. A scaffolded candidate has not been researched; the missing field is what makes the "Last Verified" row render `—` honestly.
- `values` is intentionally empty. `/gather-data` fills it.
- Filename MUST match the candidate id exactly: `<candidate-id>.json`, lowercase, hyphens only.

If the candidate id truncated awkwardly during kebab-casing (e.g. `MySQL / MariaDB` → `mysql`), flag it in the Phase 6 summary so the user can rename before commit.

### 5.2 `data/<type>/index.json`

Append one entry per pick at the end of the `candidates` array, preserving existing order and whitespace:

```json
{ "id": "<candidate-id>", "shownByDefault": true }
```

Always `shownByDefault: true` for freshly-added candidates — the user can flip it later by editing `index.json` directly. Do NOT reorder existing entries. Keep new entries in the order the user selected them (or, if the user said `all`, Phase 4 presentation order).

### 5.3 `data/<type>/RESEARCH.md`

Append one line per pick to the end of the **Candidates** list:

```
- [ ] <Display Name> — <reason for inclusion> (added <YYYY-MM-DD>)
```

- The reason for inclusion is the short rationale from Phase 2 (scope-fit bullet + any nuance). One clause, not a paragraph.
- The `(added <YYYY-MM-DD>)` suffix is mandatory for entries added by this skill — it distinguishes discovery-sourced entries from candidates that came out of the original `/new-type` scoping dialogue.
- Checkbox stays `- [ ]`. It will be ticked by `/gather-data` on the first research pass.
- Do NOT touch any other line. Do NOT modify Scope, Attribute Groups, Research Sources, Assessment Guidelines, or Notes sections.
- Do NOT reorder the Candidates list — append only.

### 5.4 Validate the JSON files

After all writes, validate every `.json` file touched this pass in one allow-listed call:

```bash
bash .scripts/validate-json.sh data/<type>/index.json data/<type>/<candidate-id>.json ...
```

Run it from the repo root in exactly this relative form — script path and file arguments both repo-relative, never absolute (only the relative form reliably matches the allowlist). The script prints one `<file>\tVALID` / `INVALID` / `MISSING` line per file. If anything is not `VALID`, fix the file and re-run before presenting the summary.

## Phase 6: Summary

Present a concise summary:

- **Mode**: `discover-candidates`.
- **Comparison type**: `<type>`.
- **Search hint**: `"<hint>"` (or "none" when omitted).
- **Discovered**: `<N_raw>` raw candidates → `<N_filtered>` passed filters → `<N_selected>` selected by the user.
- **Added** (one line per candidate):
  `<candidate-id>` — `<Display Name>` — `<one-line description>` (`<Included bullet matched>`)
- **Files written**:
  - `data/<type>/<candidate-id>.json` × `<N_selected>` (created)
  - `data/<type>/index.json` (`<N_selected>` entries appended)
  - `data/<type>/RESEARCH.md` (`<N_selected>` lines appended to Candidates with `(added <date>)` suffix)
- **Filtered out** (only when relevant): brief tally grouped by reason (already scaffolded, Excluded bullet match, quality floor, dedup alias).
- **Defaults to review** (only when relevant):
  - Candidate id truncated from a multi-segment name.
  - Display name auto-cased because the source used inconsistent casing.
  - Ambiguous-scope candidate was picked anyway — flag the Scope bullet it brushes against so the user can tighten RESEARCH.md if they want.
- **Next step**: `/gather-data <type>` (auto-picks the next under-researched candidate, which now includes the new ones) or `/gather-data <type> <candidate-id>` per specific candidate.

### Commit hint

Print the expected commit command in the project's multi-`-m` format (per CLAUDE.md):

```bash
git add data/<type>/index.json data/<type>/RESEARCH.md data/<type>/<candidate>.json ...
git commit -m "data(<type>): CANDIDATES discover <YYYY-MM-DD>" \
  -m "Added <N> candidates via web discovery: <comma-separated ids>. <One-sentence framing — e.g. what hint drove the search>." \
  -m "🤖 Generated with [Claude Code](https://claude.com/claude-code)" \
  -m "Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

Fetch the date via `date +%Y-%m-%d` (same value as used in the RESEARCH.md appends).

Alternatively, suggest folding the discovery commit into subsequent `/gather-data` commits so stub + first research land atomically per candidate — useful when the user plans to research them immediately.

## Git

Do NOT commit. Print the exact command the user can run (or they can use the project's `/commit` skill if one is installed).

## Rules

- Do NOT fabricate candidates. Every entry presented in Phase 4 MUST correspond to a URL you actually fetched via `WebFetch`. If a search result looks promising but the fetch fails, drop it.
- Do NOT silently write files in Phase 5. Phase 4's explicit user selection is the gate — if the user didn't pick it, don't write it.
- Do NOT populate any `values` inside candidate files. That is `/gather-data`'s responsibility.
- Do NOT write `lastVerified` on candidate files. The missing field signals "not yet researched" honestly.
- Do NOT modify `attributes.json`, Scope, Attribute Groups, Research Sources, Assessment Guidelines, or Notes sections of RESEARCH.md. This skill only appends to the Candidates list.
- Do NOT overwrite any existing candidate file. Phase 3.1 catches pre-existing files; if one slips through, abort rather than clobber.
- Do NOT reorder entries in `data/<type>/index.json` or the RESEARCH.md Candidates list. Append only.
- Do NOT tick any RESEARCH.md checkbox (`- [ ]` → `- [x]`); that is `/gather-data`'s job.
- Do NOT modify the top-level `data/index.json` — this skill operates inside an already-registered type.
- Do NOT weaken the Scope filter to pad the list. A shorter filtered list is better than a longer one with borderline entries — the user is the final filter, but Phase 3's filter has to be defensible on its own terms.
- kebab-case for the candidate id and all other ids. Filenames: lowercase, hyphens, no spaces, no underscores, no numeric prefixes.
- JSON output MUST be valid: ASCII quotes, no trailing commas, no comments. Verify every written `.json` file with `bash .scripts/validate-json.sh <file> [...]` (repo-relative paths) and fix anything it flags before finishing.
- Match existing project style: indentation, key ordering inside candidate files (`name`, `description`, `url`, `values`).
- If a required file is missing (no `CLAUDE.md`, no `data/<type>/`, no `RESEARCH.md`, no `index.json`), abort with a clear message pointing the user at the skill that creates it (`/new-type` or `/scaffold-type`).
- If the RESEARCH.md Candidates section is malformed (no heading, no existing list to append to), abort and tell the user precisely what to fix.
- If JSON you are about to write would break the project's build, abort the whole pass and report which file is malformed before overwriting anything. Do not leave the scaffold half-applied.

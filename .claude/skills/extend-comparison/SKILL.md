---
name: extend-comparison
description: "Add one or more new attributes to an existing Lineup comparison type. Updates `data/<type>/RESEARCH.md` (a new row in an Attribute Groups table, plus Assessment Guidelines if applicable) and `data/<type>/attributes.json` (appends to an existing `groups[]` entry or creates a new group) in a single pass. Use when the comparison type has already been scaffolded (both files exist) and you want to extend the attribute set. Does not touch candidate files — existing candidates render `—` for the new attribute until `/gather-data` fills values. Arguments: comparison type id (required), free-text description of the new attribute(s) (required)."
disable-model-invocation: true
model: opus
allowed-tools: Read, Glob, Write, Edit, Bash(date:*)
argument-hint: "<comparison-type> <attribute description>"
---

# Comparison: Extend

You are adding one or more new attributes to an existing Lineup comparison type. This skill is the additive counterpart to `/scaffold-type` — where `/scaffold-type` translates an entire `RESEARCH.md` into `attributes.json` on first run, this skill extends a type that has *already* been scaffolded by inserting new attributes into both files in lockstep. It never rewrites existing attributes, never reorders groups, and never touches candidate files.

The skill writes two things on success:

1. `data/<type>/RESEARCH.md` — a new row appended to the relevant Attribute Groups table (or a whole new `### <N>. Group Name` section if the attribute belongs to a new group). Optionally a new bullet in **Assessment Guidelines** when the attribute needs thresholds or ambiguity clarification.
2. `data/<type>/attributes.json` — a new entry appended to the relevant group's `attributes[]` array (or a whole new group appended to `groups[]`).

Candidate files (`data/<type>/<candidate>.json`) are deliberately untouched. The missing values render as `—` in the UI until `/gather-data <type> <candidate> <new-attribute-id>` fills them in.

## Argument Parsing

`$ARGUMENTS` (free-form, but expected shape):

1. **comparison type id** — first whitespace-delimited token; kebab-case; must match an existing `data/<type>/` directory that has both `RESEARCH.md` and `attributes.json`.
2. **attribute description** — free-text remainder describing the new attribute(s). May include any subset of:
   - attribute name(s)
   - value type (text / boolean / integer / decimal / date / datetime / filesize / duration / percentage / rating / tags / icon / link)
   - direction (higher/lower is better, neutral)
   - target group (existing group name, or a new group name to create)
   - tag set (for `tags` value type)
   - research note (how to find the value)
   - tooltip description
   - assessment criteria (thresholds, when to use `null`)

Examples of user input this skill should parse sensibly:

- `/extend-comparison databases acid-compliance boolean — whether the DB supports full ACID by default`
- `/extend-comparison databases "add a license attribute as tags with MIT, Apache 2.0, GPL-3.0, proprietary"`
- `/extend-comparison ai-workflows "add an 'Offline Support' boolean attribute — whether the tool can run without an internet connection"`
- `/extend-comparison databases "add security group: 2FA (boolean), Encryption at Rest (boolean), RBAC (boolean)"`

Don't require a rigid grammar — parse by intent. If the comparison type id is missing or not kebab-case, abort and ask. If the attribute description is missing entirely, abort and ask. Those are the only mandatory prompts before Phase 1; every other ambiguity either resolves to a defensible default (surfaced in the summary) or pauses at a well-defined checkpoint in Phase 2.

## Prerequisites

1. Read `CLAUDE.md` at the project root to confirm this is a Lineup project and pick up local conventions (commit format, shell rules).
2. Confirm `data/<type>/` exists. If not, abort and suggest `/new-type <type>` followed by `/scaffold-type <type>`.
3. Confirm `data/<type>/RESEARCH.md` exists. If not, abort and suggest `/new-type <type>`.
4. Confirm `data/<type>/attributes.json` exists. If not, abort and suggest `/scaffold-type <type>` — this skill is additive; it does not scaffold schema from scratch.
5. Read `data/<type>/RESEARCH.md` end-to-end. Focus on:
   - **Overview** — context for judging whether the proposed attribute fits the comparison's purpose.
   - **Attribute Groups** tables — every existing group heading (`### <N>. Group Name`) and its row set. Needed to decide whether the new attribute joins an existing group or warrants a new one, and to detect name/id collisions.
   - **Assessment Guidelines** — the bullet format to match when appending new guideline lines.
6. Read `data/<type>/attributes.json` — authoritative for existing group ids, attribute ids, and tag set shapes. Needed for collision detection and to mirror the file's indentation / key ordering when writing.
7. Glob `data/<type>/*.json` only if you need to check whether candidates exist (informs the Phase 4 next-step hint).
8. Skim 1–2 other `data/*/attributes.json` files if uncertain about formatting conventions for a value type you haven't seen in this type.

## Phase 1: Parse the Attribute Description

Walk the free-text and extract one or more attribute specifications. Each specification needs these fields resolved:

| Field            | Source                                                                 |
|------------------|------------------------------------------------------------------------|
| **name**         | The user's wording (prefer their exact casing; title-case if sloppy).  |
| **id**           | kebab-case of `name` (lowercase, ASCII, collapse non-alphanum → `-`).  |
| **valueType**    | Explicit in the description, or inferred from phrasing / examples.     |
| **direction**    | Explicit (higher/lower is better), or default per type (see below).    |
| **group**        | Explicit target group, or the best-fit existing group, or a new group. |
| **tagSet**       | For `tags` only — explicit list, or empty `[]` with flag.              |
| **researchNote**| The "how to find this value" phrase from the user, or a concise fallback drawn from the attribute name. |
| **description** | Optional tooltip — user-provided, or omitted.                         |
| **guideline**   | Optional Assessment Guidelines bullet — user-provided, or omitted.    |

### Default direction for ranked types

When the user didn't explicitly state direction and the type is ranked, apply:

| Type                                   | Default direction | Rationale                                        |
|----------------------------------------|-------------------|--------------------------------------------------|
| `integer`, `decimal`, `percentage`, `rating`, `date`, `datetime` | `ascending`  | Bigger / newer is usually considered "better". |
| `filesize`, `duration`                 | `descending`      | Smaller / faster is usually "better".            |

Surface defaulted directions in the Phase 4 summary under **Defaults to review** so the user can flip them.

### Group placement resolution

For each parsed attribute:

- **Explicit group reference in the description**: use it. If it matches an existing group (case-insensitive name or kebab-case id), append to that group. If it doesn't match any existing group, treat it as a new-group request.
- **No explicit group reference**: score each existing group by thematic fit (the group's `name` + `description` vs. the attribute's name and research note). If one group is a clear winner, use it. Otherwise, pause in Phase 2 and ask the user.
- **New group requested** (explicit or inferred from the description — e.g. "add a security group: ..."): collect all attributes destined for that new group into a single bundle; the whole bundle becomes one new `### <N>. Group Name` section and one `groups[]` entry.

### Id collision detection

- If the derived attribute id already exists anywhere in `attributes.json` (under any group), abort with a message naming the existing attribute and its group. Suggest the user pick a different name or edit the existing attribute directly.
- If the derived new-group id collides with an existing group id, either (a) route the attribute(s) into that existing group if their contents match thematically, or (b) ask the user for a different group name. Surface which path you took in the summary.

### ValueType cheatsheet (for the `attributes.json` write)

Mirror the cheatsheet from `/scaffold-type` — kept here for quick reference:

| Human label              | `valueType` in `attributes.json`                                                                         |
|--------------------------|----------------------------------------------------------------------------------------------------------|
| `text`                   | `"text"`                                                                                                 |
| `boolean`                | `"boolean"`                                                                                              |
| `link`                   | `"link"`                                                                                                 |
| `integer`                | `{ "type": "integer", "direction": "ascending" \| "descending" \| "neutral" }`                           |
| `decimal`                | `{ "type": "decimal", "direction": "ascending" \| "descending" \| "neutral" }`                           |
| `percentage`             | `{ "type": "percentage", "direction": "ascending" \| "descending" }`                                     |
| `filesize`               | `{ "type": "filesize", "direction": "ascending" \| "descending" }`                                       |
| `duration`               | `{ "type": "duration", "direction": "ascending" \| "descending" }`                                       |
| `date (year)`            | `{ "type": "date", "direction": "ascending", "format": "year" }`                                         |
| `date (month-year)`      | `{ "type": "date", "direction": "ascending", "format": "month-year" }`                                   |
| `date (full)`            | `{ "type": "date", "direction": "ascending", "format": "full" }`                                         |
| `datetime`               | `{ "type": "datetime", "direction": "ascending" }`                                                       |
| `rating (1–5)`           | `{ "lower": 1, "upper": 5, "direction": "ascending", "symbols": { "empty": "☆", "full": "★" } }`         |
| `tags`                   | `{ "type": "tags", "defaultColor": "gray", "tags": [{ "id": "...", "value": "...", "color": "..." }] }` |
| `icon`                   | `{ "type": "icon-fontawesome", "name": "..." }`                                                          |

For tags: kebab-case `id`, display label as `value`, colors picked from `blue`, `green`, `red`, `orange`, `purple`, `gray`. If the user listed tags, use them in the given order; if not, seed `tags: []` and flag in the summary.

## Phase 2: Clarification Checkpoints

Pause once, if needed, to resolve genuine ambiguity. Bundle every question into a single round-trip — do not drip-feed questions. The questions that warrant a pause:

- **Value type unresolved**: the description doesn't make the type obvious (e.g. "add a 'Maturity' attribute" — is that `rating`, `tags`, `text`?). Offer 2–3 candidate types with brief reasoning and ask which to use.
- **Group placement unresolved**: multiple existing groups plausibly fit and the description didn't specify. List the top 2 candidates with their `description` and ask, or offer "create a new group called …" as a third option.
- **Tag set required but missing**: for `tags`, if the user didn't list the expected values, either ask for the set OR proceed with `tags: []` and flag it. Prefer to ask when the type's purpose suggests a bounded set (licenses, categories) and proceed with `[]` when the set is likely open-ended (tool names, features) — always surface the choice in the summary.
- **Rating range non-standard**: if the user hinted at a rating type but not the range (`1–5`, `1–10`, etc.), default to `1–5` and flag it.
- **Out-of-scope concern**: if the attribute seems not to fit the comparison's Overview/Scope (e.g. adding `Price` to an open-source library comparison scoped to community / tech fit), raise it and ask whether to proceed. Like `add-candidate`, only pause for *clear* mismatches — don't fish for objections.

For every other ambiguity (sloppy casing, missing description, missing research note, defaulted direction, whether to add an Assessment Guidelines bullet), apply the default and surface it in the Phase 4 summary.

Announce the resolved plan once decisions are made — a compact, skimmable preview before writing — and proceed without a further confirmation round-trip unless the user raises something.

## Phase 3: Write the Files

Only run this phase after Phase 2's clarifications (if any) are resolved.

### 3.1 `data/<type>/attributes.json`

**Appending to an existing group**: locate the group's `attributes: [...]` array and append the new entry at the end. Do NOT reorder existing attributes.

**Creating a new group**: append a new object at the end of `groups: [...]`. Fields:

- `id` — kebab-case of the group name.
- `name` — display name as provided / inferred.
- `description` — optional one-sentence description (omit the key entirely if none).
- `expandedByDefault` — `false` by default for newly-added groups (they're usually more specialized than the core ones); flip to `true` only when the user explicitly signals this group should open on page load.
- `attributes` — array with every attribute destined for this new group.

**Attribute entry shape**:

```json
{ "id": "<attr-id>", "name": "<Display>", "valueType": <per cheatsheet>, "description": "<optional tooltip>" }
```

- `id` is kebab-case.
- `name` is the display name.
- `valueType` follows the cheatsheet exactly — string for primitive types, object with `direction` for ranked types, object with tag set for tags.
- `description` is optional; omit the key entirely if none (don't write an empty string).

**Formatting**: match the existing file's indentation, key ordering within objects, and blank-line style exactly. A diff should show only appended lines, never reformatted existing ones. When in doubt, use the `Edit` tool with a narrowly-scoped `old_string` that anchors on an existing closing bracket so the append is surgical.

**Validity**: JSON MUST be valid — ASCII quotes, no trailing commas, no comments. After writing, the file must still parse as valid JSON.

### 3.2 `data/<type>/RESEARCH.md`

**Appending to an existing Attribute Groups section**: locate the `### <N>. Group Name` heading and its table, then append a new row at the end of that table. Match the column layout used in the type's existing tables (usually `| Attribute | Type | Research Notes |`, but mirror what's there).

Row format:

```
| **<Display Name>** | <type label> | <research note> |
```

- The type label mirrors what `/scaffold-type` expects (see cheatsheet above — `boolean`, `tags`, `rating (1–5)`, `date (year)`, etc.), so a future re-run of `/scaffold-type` would round-trip cleanly.
- The research note should be a single clear sentence about how to find the value. If the user supplied one, use it; if not, synthesize a concise one from the attribute name.

**Creating a new group section**: append a new `### <N>. Group Name` block at the end of the existing Attribute Groups list, using the next sequential number. Structure:

```markdown
### <N>. <Group Name>

| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **<Attr 1>** | <type> | <note> |
| **<Attr 2>** | <type> | <note> |
```

Preserve the blank-line cadence used between existing group sections.

**Assessment Guidelines**: if the user supplied criteria that need codifying (thresholds, when to use `null`, how to interpret a boundary), append a bullet to the existing **Assessment Guidelines** subsection:

```
- **<Attribute Name>**: <criteria in one or two sentences>.
```

If no Assessment Guidelines subsection exists in this type's RESEARCH.md yet, create one under the current heading level following the format seen in other types (`## Assessment Guidelines` as a top-level section, or `### Assessment Guidelines` under **Research Sources**, depending on what the type uses — match the local style).

Do NOT modify:
- **Overview**
- **Scope**
- **Research Sources**
- **Initial Candidates**
- **Notes for Researchers**
- any existing attribute rows

Do NOT renumber existing group headings. Only the newly-added heading gets the next sequential number.

### 3.3 Candidate files — do NOT touch

Candidate files stay as-is. The new attribute's key is simply absent from their `values` object, which renders as `—` in the UI. This is intentional and honest: no value has been researched yet. `/gather-data <type> <candidate> <new-attr-id>` fills it in on a subsequent pass.

## Phase 4: Summary

Present a concise summary:

- **Mode**: `extend-comparison`.
- **Comparison type**: `<type>` (so transcripts are self-describing).
- **Added attributes** (one line per attribute):
  `<group-id>.<attr-id>` — `<Display Name>` (`<valueType summary>`) — `<one-line research note>`
  If a new group was created, note it inline on the first attribute of that group: `<group-id>` *(new group)*.
- **Files modified**:
  - `data/<type>/attributes.json` — `<N>` attribute(s) appended across `<G>` group(s) (`<G_new>` newly created).
  - `data/<type>/RESEARCH.md` — `<N>` row(s) appended; `<G_new>` new group section(s); `<A>` Assessment Guidelines bullet(s) added (omit counts that are zero).
- **Defaults to review** — only when relevant:
  - Direction defaulted because the description was ambiguous (list each `<group-id>.<attr-id>` and the chosen direction).
  - Tag set seeded as empty `[]` (list the affected attributes).
  - Rating range defaulted to `1–5`.
  - `expandedByDefault` defaulted to `false` for newly-created groups.
  - Display names auto-cased from sloppy input.
  - Attribute id collided with an existing group name and was merged into it (or vice versa).
- **Next step**: populate the new attribute(s) on existing candidates. Suggest the concrete commands:
  - `/gather-data <type>` — auto-picks under-researched candidates, which now includes everyone missing the new attribute(s). Useful if most candidates are under-researched anyway.
  - `/gather-data <type> <candidate-id> <new-attr-id>` — surgical refill of a single attribute on a specific, already-researched candidate. List a couple of registered candidate ids so the user can copy-paste.

### Commit hint

Print the expected commit command in the project's multi-`-m` format (per CLAUDE.md):

```bash
git add data/<type>/attributes.json data/<type>/RESEARCH.md
git commit -m "data(<type>): SCHEMA extend <YYYY-MM-DD>" \
  -m "Added <N> attribute(s) (<comma-separated ids>) to <group-id(s)>. <One-sentence why>." \
  -m "🤖 Generated with [Claude Code](https://claude.com/claude-code)" \
  -m "Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

Fetch the date via `date +%Y-%m-%d`. If the user runs `/gather-data` immediately afterwards to fill in the values, recommend folding the schema commit and first data commit together only if the user prefers atomic history — otherwise keep them separate so the schema change is bisectable.

## Git

Do NOT commit. Print the exact command the user can run (or they can use the project's `/commit` skill if one is installed).

## Rules

- Do NOT modify any existing attribute — this skill only appends. If the schema is wrong, the user should edit `attributes.json` / `RESEARCH.md` directly.
- Do NOT reorder existing groups, attributes, or RESEARCH.md sections. Append only.
- Do NOT renumber existing group headings in RESEARCH.md. Only the newly-added group heading gets the next sequential number.
- Do NOT touch candidate files (`data/<type>/<candidate>.json`). Missing values render as `—` honestly; `/gather-data` fills them later.
- Do NOT touch `data/<type>/index.json` (it's a candidate list, not an attribute list).
- Do NOT touch the top-level `data/index.json`.
- Do NOT modify `RESEARCH.md`'s Overview, Scope, Research Sources, Initial Candidates, or Notes for Researchers sections. Only the Attribute Groups tables (append rows or append a new group section) and Assessment Guidelines (append bullets, or create the subsection if absent) are in scope.
- Do NOT invent tag values the user didn't specify. If the tag set is missing, either ask once (Phase 2) or seed `tags: []` and flag it.
- Do NOT overwrite `attributes.json` or `RESEARCH.md` wholesale — use `Edit` with narrowly-scoped `old_string` to append surgically so existing formatting is preserved bit-for-bit.
- Do NOT ask the user more than one consolidated round of clarifying questions. Everything else resolves to defaults + Phase 4 summary.
- Only ask clarifying questions at the well-defined Phase 2 pause points: unresolved value type, unresolved group placement, missing bounded tag set, non-standard rating range, clear scope mismatch. Plus the Phase 0 hard preconditions (missing type id, missing attribute description, missing files).
- kebab-case for all `id` fields (group, attribute, tag).
- JSON output MUST be valid: ASCII quotes, no trailing commas, no comments inside `.json` files.
- Match existing project style: indentation, blank lines, key ordering within objects, attribute ordering within groups (generic → specific — so new attributes land at the end of the group).
- If the RESEARCH.md Attribute Groups section is malformed (no `### <N>. Group Name` headings, or tables with unexpected column layouts), abort and tell the user precisely what to fix before retrying. Do not heal silently.
- If a required file is missing (no `CLAUDE.md`, no `data/<type>/`, no `RESEARCH.md`, no `attributes.json`), abort with a clear message pointing the user at the skill that creates it (`/new-type` or `/scaffold-type`).
- If JSON you are about to write would break the project's build, abort the whole pass and report which file is malformed before overwriting anything. Do not leave the schema half-extended.

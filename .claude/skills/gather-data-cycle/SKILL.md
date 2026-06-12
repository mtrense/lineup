---
name: gather-data-cycle
description: "Drive a batch of /gather-data research passes for a Lineup comparison type, fanning out across candidates in PARALLEL. Enumerates unchecked candidates from RESEARCH.md (initial research), then candidates missing attributes added later via /extend-comparison (scoped backfill). Spawns isolated gather-data-worker subagents (fresh context, no commit) one-per-candidate in parallel batches, then SERIALLY flips each candidate's RESEARCH.md checkbox (initial only) and commits its file with the data(<type>): CANDIDATE convention. Use for long-running, hands-off research sessions across many candidates. Arguments: comparison type id (required), optional count cap and worker count."
disable-model-invocation: true
model: opus
allowed-tools: Read, Glob, Grep, Edit, Agent, Bash(bash .scripts/list-unchecked.sh *), Bash(bash .scripts/list-incomplete.sh *), Bash(bash .scripts/verify-batch.sh *), Bash(git status:*), Bash(git log:*), Bash(git add:*), Bash(git commit:*), Bash(git rev-parse:*), Bash(date:*)
argument-hint: "<comparison-type> [count|all][@workers]   (e.g. `databases 8`, `databases 8@4`, `databases all@3`)"
---

# Gather-Data Cycle — Parallel Research Over Candidates

## Context

- Repo root: !`git rev-parse --show-toplevel`
- Current working tree state: !`git status --porcelain`

The repo root is given above — never derive it yourself, and never prefix git
commands with `git -C <path>`: the allowlist patterns (`git status:*`,
`git add:*`, …) only match commands that **start** with the verb, so a `-C`
prefix triggers a permission prompt. Run the plain allow-listed forms; when an
absolute path is needed (e.g. for `git add`), prefix it with the repo root
above.

You orchestrate a loop that drives a Lineup comparison type to **fully
researched** state. Work comes from two pools, drained in order:

1. **Initial pool** — candidates still unchecked (`- [ ]`) in RESEARCH.md's
   Candidates section. A worker researches the full attribute set and writes
   the whole candidate file.
2. **Backfill pool** — candidates already researched (checked `[x]`) whose
   files are missing attribute keys, typically because `/extend-comparison`
   added attributes after the candidate was researched. A worker researches
   **only the missing attributes** and leaves existing values untouched.

Each candidate is researched by an isolated
`gather-data-worker` subagent in a **fresh, non-contaminated context**: the
whole web search-fetch-verify transcript lives inside the worker and is
discarded on return. Workers run **in parallel** within a batch (every
candidate is its own JSON file, so they never collide), and **you** — the
orchestrator — own the two shared, serial steps: flipping the RESEARCH.md
checkbox and committing each candidate file.

The motivation is twofold: **context hygiene** (the orchestrator stays tiny and
never sees a single WebFetch) and **wall-clock speed** (candidates research
concurrently). The previous `/research-batch` did the first but not the second.

## Why workers don't commit

`/gather-data` run directly still commits its own work. But parallel commits in
one working tree race on the git index, and parallel writes to RESEARCH.md race
on the checkbox lines. So inside the cycle the worker is deliberately stripped
of commit tools and forbidden from touching RESEARCH.md — it only writes its own
`data/<type>/<candidate>.json`. You serialise the flip + commit afterward, which
also preserves Lineup's valued per-candidate `data(<type>): CANDIDATE` commit
provenance.

## Argument Parsing

`$ARGUMENTS` (positional):

1. **comparison type id** (required) — must match an existing `data/<type>/` directory.
2. **count cap** (optional, default `5`) — max candidates to research this cycle.
   A positive integer, or the literal `all` (drain every pending candidate —
   unchecked and incomplete alike).
3. **worker count** — appended to the count token as `@<W>` (e.g. `8@4`, `all@3`,
   or just `@4` to keep the default count). Positive integer; default `4`. Caps
   parallel workers per batch.

Accepted forms for the second token: `8`, `8@4`, `all`, `all@3`, `@4`.
Anything else (non-integer parts, zero/negative, stray tokens) → halt and state
the expected shape. Bind the parsed values as `<count>` and `<workers>`.

If the comparison type is missing or doesn't match a `data/<type>/` directory,
ask the user.

## Prerequisites

1. Read the project root `CLAUDE.md` (commit format, shell rules).
2. Read `.claude/skills/gather-data/SKILL.md` — you will not execute its logic,
   but you must understand what each worker does to brief it and recognise a
   well-formed result.
3. Read `data/<type>/index.json` — you need it to resolve candidate **names**
   (as printed by the helper) to candidate **ids** (the JSON file basenames).
4. Check the working tree state captured in the Context section above. The
   tree **must** be clean before
   starting — each batch leaves uncommitted candidate files, and you must not
   bundle pre-existing dirty state into a research commit. If it isn't clean,
   stop and ask the user to clean up.

## Loop

Repeat until a stop condition triggers (cap hit, both pools drained, or a halt).

### Step 1: Enumerate pending work

Run the bundled helpers from the repo root via their repo-relative path
(`.scripts/...` — this exact form is what the allowlist matches; never use an
absolute path). Do NOT roll your own enumeration with `Grep` + post-processing —
the scripts are the single allowed path so the permission surface stays narrow.

**First, the initial pool:**

```
bash .scripts/list-unchecked.sh <type>
```

It prints one unchecked candidate **name** per line, in declared order.
Resolve each name to a candidate **id** by matching against `data/<type>/index.json`
(an entry's `id`, or the candidate file's `name` field — same matching
`/gather-data` auto-pick uses). If a name can't be resolved to a registered
candidate, skip it and note it in the final summary.

**Only when the initial pool is empty, the backfill pool:**

```
bash .scripts/list-incomplete.sh <type>
```

It prints one TSV line per incomplete candidate: `<id>\t<comma-separated
missing attribute ids>`. Filter the lines:

- Drop any candidate still unchecked in RESEARCH.md or unresolvable above —
  those belong to the initial path (an unchecked stub is "incomplete" too, but
  it must get a full initial pass, not a backfill). With initial drained this
  set is normally empty; it only matters when names were skipped as
  unresolvable.
- A `MISSING_FILE` or `BAD_JSON` line is a registered candidate with no
  parseable file — halt and surface it; that's an inconsistency a human must
  fix, not research work.

What remains is the backfill pool: candidate ids each paired with their list of
missing attribute ids.

If both pools are empty, exit the loop (success path → Step 6).

### Step 2: Build the next batch

A **batch** is the next up-to-`<workers>` distinct candidate ids, in order,
drawn from the initial pool first and the backfill pool only once initial is
empty. A batch never mixes modes — when the initial pool has fewer candidates
left than `<workers>`, run a short initial batch and start backfill in the next
iteration (Step 5's flip/commit handling differs per mode, and homogeneous
batches keep it simple). Candidates are always distinct files, so the whole
batch runs in parallel. If `<count>` was specified and you're near it, shrink
the batch so you don't overshoot — the cap counts candidates of both modes.

### Step 3: Pre-flight check

Run `git status --porcelain`. The tree **must** be clean (you committed
everything from the previous batch in Step 5). If it isn't, halt and report the
dirty paths — do not clean up yourself.

### Step 4: Spawn the batch in parallel

Issue one `Agent` call per candidate in the batch, **all in a single message**
so workers run concurrently. Each call uses `subagent_type: gather-data-worker`
with a self-contained prompt matching the batch's mode.

**Initial batch:**

> Research the Lineup candidate **`<candidate-id>`** in comparison type
> **`<type>`**. Follow `.claude/skills/gather-data/SKILL.md` in `initial` mode:
> Phase 1 (plan), Phase 2 (research loop), and the file-writing part of Phase 3
> — write the full `data/<type>/<candidate-id>.json`. Do **not** flip the
> RESEARCH.md checkbox and do **not** commit; the orchestrator owns both. End
> with the ` ```report ` block defined in your agent instructions.

**Backfill batch:**

> Backfill the Lineup candidate **`<candidate-id>`** in comparison type
> **`<type>`**. Follow `.claude/skills/gather-data/SKILL.md` in `backfill`
> mode, scoped to exactly these missing attributes: **`<attr-id-1>,
> <attr-id-2>, ...`**. Research only those attributes and add their
> `{value, source, comment}` entries to `data/<type>/<candidate-id>.json`,
> keeping every existing value and all top-level metadata untouched (update
> only `lastVerified`). Do **not** commit; the orchestrator owns it. End with
> the ` ```report ` block defined in your agent instructions.

The `gather-data-worker` agent has no commit tools and standing no-flip /
no-commit rules, so it cannot violate the contract even if briefed loosely.

Wait for all workers in the batch to return before continuing.

### Step 5: Post-flight check, then serial flip + commit

First verify the batch as a whole:

1. **Reports well-formed.** Each worker's final message must end with a
   ` ```report ` block. Missing/malformed → halt (`worker omitted report block`).
2. **Expected paths only.** Run `git status --porcelain`. Every dirty path must
   be one of the batch's `data/<type>/<candidate>.json` files (a worker that
   reported `HALTED` should have written nothing). Any unexpected path → halt
   and surface it. Do not commit.

Verify the batch's files in one shot with the bundled helper (never roll your
own `node -e`, `for`-loop, or `cd ...; ...` compound — those can't be
allow-listed and will prompt every run):

```
bash .scripts/verify-batch.sh <type> <id1> <id2> ...
```

For a **backfill batch**, suffix each id with its briefed attribute ids so the
helper also confirms the gaps were actually filled:

```
bash .scripts/verify-batch.sh <type> <id1>:<attrA>,<attrB> <id2>:<attrC> ...
```

It prints one TSV line per id: `<id>  <ok|MISSING|BAD_JSON|MISSING_ATTRS>  <lastVerified>  <populated>  <null>  <still-missing-attrs|->`.
Use the `populated`/`null` columns directly for the Step 5/Step 6 notes. As an
alternative for a single file, the `Read` tool reads the JSON natively — no Bash
at all. Any line that is not `ok`, or is `ok` with an empty `lastVerified` (`-`)
or zero populated values, is a halt for that candidate.

Then, for each worker that reported `status: OK`, **one at a time** (commits must
serialise):

3. Confirm the helper reported `ok` for `data/<type>/<candidate>.json` with a
   `lastVerified` date and non-zero populated values (or read the file directly).
4. **Initial mode only:** flip that candidate's checkbox in
   `data/<type>/RESEARCH.md` with `Edit`: `- [ ] <Name>` → `- [x] <Name>`.
   Match the candidate's display name or id; touch no other line. In backfill
   mode the box is already `[x]` — touch nothing in RESEARCH.md.
5. Stage exactly the touched files (never `git add -A`):
   ```bash
   git add data/<type>/<candidate>.json data/<type>/RESEARCH.md   # initial
   git add data/<type>/<candidate>.json                           # backfill
   ```
6. Get a timestamp (`date +"%Y-%m-%d %H:%M"`) and commit with Lineup's
   convention, using the worker's `commit_summary` as the body. The subject
   token is `initial` for initial mode, `refresh` for backfill; in backfill
   mode the body must name the attributes that were filled:
   ```bash
   git commit -m "data(<type>): CANDIDATE <initial|refresh> <YYYY-MM-DD HH:MM>" \
     -m "<commit_summary from the worker's report>" \
     -m "🤖 Generated with [Claude Code](https://claude.com/claude-code)" \
     -m "Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
   ```
7. Run `git status --porcelain` — the tree must be clean before the next commit.

For each worker that reported `status: HALTED`: do NOT commit it. Finish
committing the `OK` workers in this batch, then **stop the loop** (do not start a
new batch) and surface the `halt_reason` verbatim — schema contradictions and
source conflicts need human attention.

After committing all `OK` workers, log a one-line note per candidate
(e.g. `✓ postgresql — abc1234 — 12 populated / 2 null`). Then:

8. **Cap check.** If `<count>` was specified and you've reached it, exit. Else
   loop back to Step 1.

When you halt mid-loop, the cycle is over for this invocation. Do not retry
inside the same run.

### Step 6: Final summary

When the loop ends — clean exit, cap hit, or halt — print:

- One-line headline: `"Cycle done: X/<planned> candidates committed (Y initial, Z backfill)."`
- A list, one row per committed candidate: `<id> — <mode> — <SHA> — <populated>/<null> — <notable note or —>`.
- Candidates remaining unchecked (count) and candidates remaining incomplete
  (count, from a final `list-incomplete.sh` run if you didn't just drain it).
- Any names that couldn't be resolved to a registered candidate.
- The halt reason, if any, verbatim.
- Next steps if useful: `"Run /gather-data-cycle <type> again to continue"`
  (unchecked or incomplete candidates remain), or
  `"Run /discover-candidates <type>"` (both pools drained).

The commits already happened in Step 5; do not run `/commit`. Mention the human
should review the committed diffs.

## Important Principles

- **Parallel across candidates, serial on shared files.** Workers never touch
  RESEARCH.md, `index.json`, `attributes.json`, or each other's files. Only the
  orchestrator writes RESEARCH.md and commits — one candidate at a time.
- **Context hygiene is half the point.** Stay tiny. Don't read candidate
  research, don't call WebSearch/WebFetch, don't synthesise values — the worker
  does all of that in its own context, discarded on return.
- **Trust the worker's halt.** If a worker halts, do not "try again" or "fix it
  up." Commit the batch's successes, stop the loop, hand control to the human.
- **Missing-worker failure is cheap.** If `gather-data-worker` isn't installed,
  the first `Agent` call returns a clear error naming the unknown subagent —
  a fine halt signal, with no batch state to roll back. Treat the `Agent` call
  itself as the check; a separate pre-check would only duplicate work.
- **Never `git add -A` / `git add .`.** Stage only the candidate file and
  RESEARCH.md, per Lineup's commit hygiene.
- **Never `git -C <path> ...`.** Every git command must start with its
  allow-listed verb (`git status`, `git add`, `git commit`, `git log`). The
  repo root is provided in the Context section — use it to anchor path
  arguments when needed, never as a `-C` prefix.
- **Do not pre-compute ids and assume them.** Re-enumerate each batch from the
  live RESEARCH.md and candidate files (the user may edit them between batches).
- **Backfill bumps `lastVerified` by design.** A scoped backfill stamps the file
  with today's date even though pre-existing values weren't re-verified — same
  behavior as a scoped `/gather-data` run. The commit body names the attributes
  that were actually researched, which is the precise record.

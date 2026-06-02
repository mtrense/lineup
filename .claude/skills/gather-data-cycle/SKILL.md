---
name: gather-data-cycle
description: "Drive a batch of /gather-data research passes for a Lineup comparison type, fanning out across candidates in PARALLEL. Enumerates unchecked candidates from RESEARCH.md, spawns isolated gather-data-worker subagents (fresh context, no commit) one-per-candidate in parallel batches, then SERIALLY flips each candidate's RESEARCH.md checkbox and commits its file with the data(<type>): CANDIDATE convention. Use for long-running, hands-off research sessions across many candidates. Arguments: comparison type id (required), optional count cap and worker count."
disable-model-invocation: true
model: opus
allowed-tools: Read, Glob, Grep, Edit, Agent, Bash(bash .claude/skills/gather-data-cycle/list-unchecked.sh*), Bash(git status:*), Bash(git log:*), Bash(git add:*), Bash(git commit:*), Bash(date:*)
argument-hint: "<comparison-type> [count|all][@workers]   (e.g. `databases 8`, `databases 8@4`, `databases all@3`)"
---

# Gather-Data Cycle — Parallel Research Over Candidates

You orchestrate a loop that drives a Lineup comparison type's **unchecked
candidates** to researched state. Each candidate is researched by an isolated
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
   A positive integer, or the literal `all` (drain every unchecked candidate).
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
4. Run `git status --porcelain` via Bash. The tree **must** be clean before
   starting — each batch leaves uncommitted candidate files, and you must not
   bundle pre-existing dirty state into a research commit. If it isn't clean,
   stop and ask the user to clean up.

## Loop

Repeat until a stop condition triggers (cap hit, pool drained, or a halt).

### Step 1: Enumerate unchecked candidates

Run the bundled helper:

```
bash .claude/skills/gather-data-cycle/list-unchecked.sh <type>
```

It prints one unchecked candidate **name** per line, in declared order. Do NOT
roll your own enumeration with `Grep` + post-processing — the script is the
single allowed path so the permission surface stays narrow.

Resolve each name to a candidate **id** by matching against `data/<type>/index.json`
(an entry's `id`, or the candidate file's `name` field — same matching
`/gather-data` auto-pick uses). If a name can't be resolved to a registered
candidate, skip it and note it in the final summary.

If the resolved list is empty, exit the loop (success path → Step 6).

### Step 2: Build the next batch

A **batch** is the next up-to-`<workers>` distinct unchecked candidate ids, in
order. They are always distinct files, so the whole batch runs in parallel.
If `<count>` was specified and you're near it, shrink the batch so you don't
overshoot.

### Step 3: Pre-flight check

Run `git status --porcelain`. The tree **must** be clean (you committed
everything from the previous batch in Step 5). If it isn't, halt and report the
dirty paths — do not clean up yourself.

### Step 4: Spawn the batch in parallel

Issue one `Agent` call per candidate in the batch, **all in a single message**
so workers run concurrently. Each call uses `subagent_type: gather-data-worker`
with a self-contained prompt:

> Research the Lineup candidate **`<candidate-id>`** in comparison type
> **`<type>`**. Follow `.claude/skills/gather-data/SKILL.md` in `initial` mode:
> Phase 1 (plan), Phase 2 (research loop), and the file-writing part of Phase 3
> — write the full `data/<type>/<candidate-id>.json`. Do **not** flip the
> RESEARCH.md checkbox and do **not** commit; the orchestrator owns both. End
> with the ` ```report ` block defined in your agent instructions.

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

Then, for each worker that reported `status: OK`, **one at a time** (commits must
serialise):

3. Confirm `data/<type>/<candidate>.json` exists and parses as JSON, with a
   `lastVerified` date and non-empty `values`.
4. Flip that candidate's checkbox in `data/<type>/RESEARCH.md` with `Edit`:
   `- [ ] <Name>` → `- [x] <Name>`. Match the candidate's display name or id;
   touch no other line.
5. Stage exactly the candidate file plus RESEARCH.md (never `git add -A`):
   ```bash
   git add data/<type>/<candidate>.json data/<type>/RESEARCH.md
   ```
6. Get a timestamp (`date +"%Y-%m-%d %H:%M"`) and commit with Lineup's
   convention, using the worker's `commit_summary` as the body:
   ```bash
   git commit -m "data(<type>): CANDIDATE initial <YYYY-MM-DD HH:MM>" \
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

- One-line headline: `"Cycle done: X/<planned> candidates committed."`
- A list, one row per committed candidate: `<id> — <SHA> — <populated>/<null> — <notable note or —>`.
- Candidates remaining unchecked (count).
- Any names that couldn't be resolved to a registered candidate.
- The halt reason, if any, verbatim.
- Next steps if useful: `"Run /gather-data-cycle <type> again to continue"`
  (unchecked remain), or `"Run /discover-candidates <type>"` (pool drained).

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
- **Do not pre-compute ids and assume them.** Re-enumerate each batch from the
  live RESEARCH.md (the user may edit it between batches).

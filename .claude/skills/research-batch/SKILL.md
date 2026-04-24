---
name: research-batch
description: "Drive a batch of unattended /gather-data passes for a Lineup comparison type. Sequentially picks the next under-researched candidate (unchecked in RESEARCH.md), spawns an isolated subagent that runs the gather-data flow end-to-end (research + commit), then moves on to the next — repeating until a count cap or no candidates remain. Use for long-running, hands-off research sessions across many candidates. Arguments: comparison type id (required), optional count cap (default 5; pass `all` to drain every remaining unchecked candidate)."
model: opus
allowed-tools: Read, Glob, Grep, Agent, Bash(git status:*), Bash(git log:*)
argument-hint: "<comparison-type> [count|all]"
---

# Comparison: Research Batch

You are driving a **batch of unattended research passes** for a Lineup comparison type. Each pass delegates to `/gather-data` (via a subagent), which researches one candidate and commits the result. You sequence the passes, keep each subagent's context isolated, and aggregate a final report.

This skill exists so the user can kick off a long-running research session and walk away. Your job is: pick the next candidate, hand it to a subagent, wait for the commit, repeat.

## Argument Parsing

`$ARGUMENTS` (positional):

1. **comparison type id** (required) — must match an existing `data/<type>/` directory.
2. **count cap** (optional, default `5`) — maximum number of candidates to research in this batch. Accepts a positive integer or the literal `all` (drain every unchecked candidate).

If the comparison type is missing or doesn't match a `data/<type>/` directory, ask the user. If the count is given but unparseable, ask the user to clarify.

## Prerequisites

1. Read the project root `CLAUDE.md` (shell rules, commit format).
2. Read `data/<type>/RESEARCH.md` — only the **Candidates** section matters here. Count the `- [ ] <Name>` entries; these are the batch's candidate pool, in declared order.
3. Read `.claude/skills/gather-data/SKILL.md` — you will not execute its logic directly, but you need to understand what each subagent will do so you can brief it accurately and recognize a well-formed result.
4. Run `git status` via Bash to confirm the working tree is clean before starting. An unclean tree means the prior session left something uncommitted — stop and ask the user to clean up, because each subagent will commit and you do not want to bundle unrelated changes into a research commit.

## Phase 1: Plan the Batch

Before spawning any subagent:

1. Determine **N** = the number of passes this batch will perform:
   - `N = min(requested_count, unchecked_candidates)` — never attempt more passes than there are unchecked candidates.
   - If `count == "all"`, `N = unchecked_candidates`.
2. List the first N unchecked candidate names from RESEARCH.md, in order — these are the planned targets. Each pass uses `/gather-data`'s auto-pick, so you do NOT pass candidate ids explicitly; you rely on the `- [ ]` → `- [x]` flip inside each pass to advance the queue.
3. Announce the plan to the user in one line: `"Batch plan: N passes for <type>. Next up: <first-3 candidate names>. Starting now."` Proceed without waiting for confirmation — the user invoked the skill to run unattended.
4. If `N == 0` (nothing unchecked), report `"All candidates in <type>/RESEARCH.md are already checked off — nothing to research. Use /gather-data <type> <candidate> to force a refresh, or /discover-candidates / /add-candidate to expand the roster."` and stop.

## Phase 2: Batch Loop

For `i` in `1..N`:

1. **Spawn a subagent via the Agent tool** (`subagent_type: general-purpose`) with a self-contained prompt:
   - Subject: `"Research pass i/N for <type>"`
   - Instruction: _"Read `.claude/skills/gather-data/SKILL.md` and execute it end-to-end with arguments `<type>` (no candidate id — use auto-pick). Follow every phase including the Phase 4 commit. Return a short report (≤120 words): which candidate was picked, mode, commit SHA + subject, populated-vs-null counts, and any comments worth the user's attention. If the skill stopped before committing (e.g. catastrophic failure, primary-source contradiction), return the reason instead of a commit SHA."_
   - Tell the subagent explicitly: the working tree may only contain the candidate file it is researching, plus RESEARCH.md — do not touch anything else.
2. **Wait for the subagent to return.** Capture its report verbatim.
3. **Post-flight check** (run after each subagent returns):
   - `git status` should be clean. If it isn't, stop the batch and surface the dirty state to the user — something went wrong in the subagent's commit.
   - `git log -1 --oneline` should show the new research commit. If the HEAD subject does not start with `data(<type>): CANDIDATE`, stop and surface.
4. **If the check fails**, do NOT spawn the next subagent. Report what's wrong and stop the batch at `i` passes completed.
5. **If the check passes**, append `(candidate, commit SHA, short report)` to an in-memory results list and continue to `i+1`.

Run passes **sequentially**, not in parallel. Commits in the same working tree cannot race; parallelization (via worktrees) is a future addition not covered here.

## Phase 3: Final Report

After the loop exits (either N passes completed or a pass failed):

- One-line headline: `"Batch done: X/N passes committed."`
- A table or list, one row per pass: `<candidate> — <commit SHA> — <populated>/<null> — <notable comment or "—">`.
- If any pass failed mid-batch, explain why and tell the user what's left unchecked.
- Suggest next steps only if useful:
  - `"Run /research-batch <type> again to continue"` (if unchecked candidates remain).
  - `"Run /discover-candidates <type>"` (if the pool ran dry).

Do NOT commit anything yourself — every commit in this batch comes from the subagents running `/gather-data`. This skill is a driver, not a committer.

## Rules

- Pass candidates are chosen by each subagent's auto-pick against the live RESEARCH.md. Do NOT pre-compute the candidate list and pass ids through — a pass may re-read RESEARCH.md and pick a different candidate (e.g. if the user edits the file between spawns), and that is fine.
- Never spawn more than one subagent at a time. Git commits must serialize.
- Do NOT retry a failed pass automatically. Failure modes (tool errors, source contradictions) deserve human attention; looping would mask them.
- Do NOT modify any files in this skill's main flow — only the subagents write. You read, you spawn, you verify, you report.
- Do NOT invoke `/gather-data` by name in the subagent prompt — spawn the subagent and brief it to follow `.claude/skills/gather-data/SKILL.md` directly. (Subagents cannot call slash commands; they can only read skill files and follow them.)
- If the user asked for `all` and the pool is large (>10), still proceed — the user opted in explicitly. But surface the total count in the Phase 1 announcement so they can interrupt if they misjudged.

# AI-Assisted Development Workflows Research Guide

## Overview

This comparison evaluates frameworks and toolchains that structure AI coding agents through software development work. The space ranges from prescriptive spec-driven methodologies (spec → plan → tasks → code) to autonomous coding agents and multi-agent orchestration frameworks. The comparison helps engineering teams choose an approach that fits their preferred degree of ceremony, autonomy, and tooling — assuming they already use AI coding agents such as Claude Code, Cursor, Codex, or similar.

## Scope

**Included:**
- Spec-driven / spec-first development methodologies and the toolchains that operationalize them
- Structured slash-command packs, skill bundles, or template repositories consumed by an AI agent
- Autonomous coding agent platforms (agent + harness + workflow distributed together)
- Multi-agent orchestration frameworks when they are commonly applied to software development workflows
- Commercial platforms built around spec-first or agentic AI development

**Excluded:**
- AI coding agents used only as runtimes (Claude Code, Cursor, Codex CLI, Windsurf, Aider) -- these are the *runtime*, not the workflow. Workflows built *on top of* them are in scope
- Raw LLM APIs and provider SDKs (Anthropic SDK, OpenAI SDK, etc.)
- General project management and issue-tracking tools (Linear, Jira, GitHub Projects)
- Pure prompt libraries or system-prompt collections without a structured workflow or phase model
- Editor-only autocomplete (Copilot completions, Tabnine) without a workflow layer

## Attribute Groups

### 1. General Information

| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Description** | text | One-sentence summary of the project's positioning and primary use case |
| **Website** | link | Official website or landing page |
| **Repository** | link | Primary source repository (GitHub, GitLab, etc.) |
| **Creator / Org** | text | Person, company, or organization behind the project |
| **First Release** | date (year) | Year the project became publicly available |
| **Latest Release** | date (month-year) | Month and year of the most recent tagged release or notable update at time of research |
| **License** | tags | SPDX-style license identifiers: `mit`, `apache-2`, `gpl`, `bsd`, `mpl`, `proprietary`, `other` |
| **Pricing Model** | tags | `free-oss`, `freemium`, `paid-saas`, `paid-self-hosted`. Multiple tags allowed (e.g., OSS core with paid cloud) |
| **Open Source** | boolean | Whether the core methodology and primary tooling is open source (OSI-approved license) |

### 2. Methodology & Phases

| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Covered Phases** | tags | Phases the workflow prescribes: `discovery`, `spec`, `architecture`, `planning`, `tasks`, `implementation`, `review`, `testing`, `deployment`, `retrospective` |
| **Methodology Style** | tags | Conceptual character: `spec-centric`, `process-centric`, `harness-centric`, `strict-tdd`, `bdd`, `agent-agile`, `multi-agent`, `plan-and-execute`, `spec-driven` |
| **Opinionated** | boolean | `true` when the framework prescribes a strict workflow with limited deviation; `false` when users can freely pick and reorder phases |
| **Ceremony Level** | tags | Process weight: `low` (lightweight rituals), `medium`, `high`, `very-high` (heavy documentation, many review gates). Single value expected |
| **Mechanization Level** | tags | Degree of automation: `low` (manual prompt copy-paste), `medium` (CLI helpers), `high` (full CLI/agent execution), `very-high` (end-to-end managed pipeline). Single value expected |

### 3. Autonomy

| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Human-in-the-Loop Checkpoints** | boolean | Whether the workflow defines explicit checkpoints where a human reviews or approves before proceeding |
| **Approval Gates per Phase** | tags | Phases that require human approval: `spec`, `plan`, `tasks`, `implementation`, `deploy`. Empty if fully autonomous |
| **Autonomous End-to-End Execution** | boolean | Whether the tool can be configured to execute from idea to merged code without human intervention |
| **Autonomy Level** | rating (1-5) | 1 = every step confirmed by human; 3 = phase-level approvals; 5 = fully autonomous. Based on default configuration |
| **Rollback / Undo Support** | boolean | Whether the framework provides built-in mechanisms to revert generated artifacts or code changes |

### 4. Agent & Editor Integration

| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Supported AI Agents** | tags | Agents the framework officially supports: `claude-code`, `cursor`, `codex`, `windsurf`, `aider`, `cline`, `copilot-chat`, `roo`, `opencode`, `other`. Only include if documented or provided as a first-party integration |
| **Editor Integrations** | tags | `vscode`, `jetbrains`, `neovim`, `terminal-only`, `web` |
| **Model-Agnostic** | boolean | Whether the framework works with any underlying LLM / agent, or is locked to a specific vendor or model |
| **MCP Support** | boolean | Whether the framework exposes or integrates via Model Context Protocol |

### 5. Artifacts & Project Layout

| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Output Artifact Formats** | tags | `markdown`, `yaml`, `toml`, `json`, `xml`, `code-only`. Include all formats the framework produces for non-code artifacts |
| **Artifacts Covered** | tags | Artifact kinds the workflow produces or maintains: `user-docs`, `architecture`, `roadmap`, `change-logs`, `decisions`, `specs`, `plans`, `tasks`, `test-plans`, `release-notes` |
| **Project Layout Convention** | text | Short description of the on-disk layout the framework expects (e.g., `.speckit/specs/`, `docs/openspec/`, `.bmad/`) |
| **Artifacts Versioned in Git** | boolean | Whether artifacts are tracked alongside source code in git (rather than stored out-of-repo in a SaaS) |
| **Language-Agnostic** | boolean | Whether the framework works across programming languages, or targets a specific stack |

### 6. Quality Gates & Enforcement

| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Enforcement Mechanisms** | tags | How the framework enforces its process: `instructional` (prompts only), `hooks` (pre/post-execution hooks), `linters`, `test-gates` (requires passing tests), `agent-review` (second-agent verification), `ci-checks`, `manual-approval` |
| **Strict Phase Ordering** | boolean | Whether the framework refuses to advance phases out of order (vs. allowing ad-hoc progression) |
| **Artifact Validation** | boolean | Whether produced artifacts are validated against a schema or structural rules (not just free-form markdown) |

### 7. Memory & Context

| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Memory Implementation** | tags | How persistent context is stored: `none`, `session-only`, `markdown-files`, `vector-db`, `knowledge-graph`, `kv-store`, `hybrid` |
| **Persistent Across Sessions** | boolean | Whether context survives between separate sessions/runs without manual handoff |
| **Project Context Files** | boolean | Whether the framework uses or produces project-scoped context files (e.g., `CLAUDE.md`, `.cursorrules`, `AGENTS.md`) |

### 8. Observability & Cost

| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Token / Cost Tracking** | tags | `none`, `basic-logs` (prints token counts), `per-run`, `per-phase`, `budget-limits` (can halt on budget). Multiple allowed |
| **Run History / Traces** | boolean | Whether the framework stores structured run history or traces for later review |
| **Telemetry Opt-In/Out** | boolean | Whether telemetry collection is clearly disclosed and user-controllable |

### 9. Customization & Extensibility

| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Custom Templates** | boolean | Whether users can define their own artifact templates or prompt templates |
| **Hooks / Lifecycle Events** | boolean | Whether user-defined code or scripts can run at lifecycle events (pre-phase, post-phase, etc.) |
| **Sub-Agents / Skills / Personas** | boolean | Whether users can define their own roles, personas, or reusable skills the framework invokes |
| **Marketplace or Shared Templates** | boolean | Whether a public marketplace or community repository of shared templates/skills exists |

### 10. Distribution & Setup

| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Install Mechanism** | tags | Primary ways to install: `npm`, `pip`, `cargo`, `shell-script`, `manual-copy`, `editor-extension`, `binary`, `web-platform` |
| **Setup Time** | tags | Single value estimating first-run setup from scratch: `under-5min`, `5-30min`, `over-30min`, `managed-platform` (no local setup) |
| **Self-Hosted** | boolean | Whether the tool runs entirely on the user's machine/infra (vs. requiring a hosted service) |
| **Requires Cloud Account / Login** | boolean | Whether a vendor account is required to use the core workflow |
| **Git Worktree Support** | boolean | Whether the framework uses or explicitly supports git worktrees for parallel workstreams |

### 11. Community & Ecosystem

| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Documentation Quality** | rating (1-5) | Assess on completeness, clarity, examples, currency. 5 = exceptional, 3 = adequate, 1 = minimal or missing |
| **GitHub Stars** | integer (neutral) | Star count at time of research. Record the date in the `comment` field. `null` for closed-source platforms |
| **Active Maintenance** | boolean | `true` if there has been a commit or release within the last 90 days of the research date |
| **Example Projects / Case Studies** | boolean | Whether the project provides example repos or documented case studies of real use |
| **Community Channel** | tags | `discord`, `slack`, `github-discussions`, `forum`, `reddit` |

## Research Sources

### Primary Sources (Preferred)
1. **Official Repository (GitHub, GitLab, etc.)** - README, docs, issues, release history
2. **Official Documentation Sites** - Linked from the repo or website
3. **Official Blog / Changelogs** - For positioning, launch dates, and roadmap signals
4. **Official Website** - For commercial platforms (pricing, plans, feature matrix)

### Secondary Sources
5. **cameronsjo/spec-compare** - https://github.com/cameronsjo/spec-compare - community-maintained comparison of spec-driven frameworks
6. **Visrow, *Spec-Driven Development Is Eating Software Engineering*** - https://medium.com/@visrow/spec-driven-development-is-eating-software-engineering-a-map-of-30-agentic-coding-frameworks-6ac0b5e2b484 - survey of ~30 agentic coding frameworks
7. **Conference talks and walkthroughs** - YouTube demos from the project's authors
8. **GitHub Stars History** - https://star-history.com - for GitHub star growth over time
9. **Hacker News / Reddit discussions** - for independent developer experience reports

## Assessment Guidelines

- **Covered Phases**: Include a phase only when the framework produces a distinct artifact or invokes a distinct step for it. "The agent can write tests" is not enough to tag `testing` -- there must be an explicit test/QA phase in the workflow.
- **Methodology Style**: Apply `spec-centric` when the spec is the central artifact and code is generated from it; `process-centric` when the process/phase ordering is the core value; `harness-centric` when the value is primarily the tooling that runs prompts/agents; `strict-tdd` when tests must precede implementation as a hard rule. Tags can stack.
- **Ceremony Level**: Assess the default workflow, not stripped-down variants. Heavy use of review gates, multiple artifact types, and formal phase transitions pushes toward `high` or `very-high`.
- **Mechanization Level**: `low` means the user manually pastes prompts; `medium` means CLI wrappers exist but require human stepping; `high` means a single command runs the workflow end-to-end; `very-high` means a managed platform orchestrates all execution.
- **Autonomy Level (1-5)**: Rate the *default* configuration. A tool that *can* be made autonomous but ships with mandatory approvals should be rated low.
- **Enforcement Mechanisms**: `instructional` means enforcement is via prompt language only (the agent is asked to behave correctly); `hooks` and `ci-checks` are mechanical enforcement. Distinguish these clearly.
- **Memory Implementation**: `markdown-files` is the `CLAUDE.md` / `AGENTS.md` style of persistent context. Reserve `vector-db` / `knowledge-graph` for frameworks that ship or require one.
- **GitHub Stars**: Record the count and the date of capture in the `comment` field. This number stales quickly; do not treat it as authoritative over time.
- **Active Maintenance**: A commit within 90 days of the research date. If the last release is old but commits are recent, still mark `true`.
- **When to use `null`**: The attribute cannot be reliably determined from public information; the attribute is not meaningfully applicable to this candidate's model (e.g., GitHub stars for a closed-source commercial product); multiple sources conflict irreconcilably.

## Initial Candidates

- [x] **SpecKit** - GitHub's spec-driven development toolkit, high-profile reference point in the space
- [x] **BMAD-METHOD** - "Breakthrough Method for Agile AI-Driven Development", established multi-agent agile framework with a large following
- [ ] **OpenSpec** - OSS spec-driven framework, frequently referenced as the open alternative
- [ ] **nWave** - https://github.com/nWave-ai/nWave
- [ ] **Tessl** - commercial spec-first AI development platform
- [ ] **Agent-OS** - structured multi-agent workflow framework
- [ ] **Kiro** - AWS's spec-driven dev assistant
- [ ] **CrewAI** - popular multi-agent orchestration, commonly applied to dev workflows
- [ ] **LangGraph** - graph-based agent orchestration framework
- [ ] **AutoGen** - Microsoft's multi-agent conversation framework
- [ ] **OpenHands** - formerly OpenDevin, autonomous coding agent platform
- [ ] **SpecKitty** - https://github.com/Priivacy-ai/spec-kitty
- [ ] **GSD** - *pending user clarification on upstream project / URL*
- [ ] **Devika** - AI software engineer agent (activity has slowed; include for historical context)
- [ ] **Aider architect/editor workflow** - two-phase workflow built into Aider
- [ ] **Cursor Rules / Plans** - Cursor's native spec+plan patterns
- [ ] **RooCode workflows** - role-based agent flows for Roo
- [ ] **ClaudeFlow** - Claude Code-focused workflow pack

## Notes for Researchers

1. **This space moves weekly.** Record the date of research in the `comment` field for any time-sensitive value (stars, last release, maintenance status). Expect data to need refreshes every 2-3 months.

2. **Distinguish the workflow from the agent runtime.** Many projects bundle a methodology with an agent. Evaluate the *workflow contribution* -- the phases, artifacts, and enforcement -- separately from the underlying agent.

3. **Be wary of aspirational docs.** README claims can outrun shipped features. Prefer what the tool actually does in the latest release over marketing copy. Check recent issues for reality checks.

4. **Multi-agent vs. multi-step.** Some frameworks orchestrate *multiple distinct agents* with different roles; others orchestrate *one agent through multiple steps*. Use the `multi-agent` methodology tag only for the former.

5. **Cite everything.** Every non-trivial attribute value should have at least one `source` URL. Prefer the repository or official docs over blog posts.

6. **Use `null` with a comment.** When you can't determine a value, set it to `null` and include a `comment` explaining what you looked at. Do not guess.

7. **Version awareness.** If a major version is in beta or a v2 rewrite is underway, note the version you evaluated in the `comment` field.

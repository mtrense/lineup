# AI Coding Agents Research Guide

## Overview

Compare AI agents whose primary job is writing and editing code inside a real codebase — CLI agents, IDE-integrated agents, editor extensions, and autonomous/cloud agents. The goal is to help a developer pick which agent to adopt by weighing form factor (where it runs), model flexibility, agentic capability (how much it can do on its own), pricing, and trust/privacy posture. This comparison is about the *tools you run*, not the methodologies that orchestrate them (those live in `ai-workflows`) and not the underlying model APIs (those are the engines, not the agents).

Users should be able to:
- Match an agent's form factor to their setup (terminal-first, IDE-native, editor extension, or hands-off cloud agent)
- Judge model flexibility — whether they can switch models, bring their own key, or run local models
- Compare agentic depth — multi-file editing, autonomous task execution, command running, MCP, subagents, codebase indexing
- Place an agent on the interaction spectrum — from inline pair-programming to supervised agents to fire-and-forget async/cloud workers
- Assess workflow fit — git/PR integration, custom rules, hooks and extensibility
- Evaluate trust and privacy — permission model, self-hosting, whether code is used for training
- Compare pricing models and entry cost
- Gauge maturity and community size before committing

## Scope

**Included:**
- CLI / terminal agents (Claude Code, OpenAI Codex CLI, Aider, Gemini CLI)
- IDE-integrated agents — full editors built around an agent (Cursor, Windsurf, Kiro, Zed's agent)
- Editor extensions that add an agent to an existing IDE (GitHub Copilot, Cline, Continue, RooCode, Amazon Q Developer, Augment Code)
- Autonomous / cloud agents that take a task and work asynchronously (Devin, Google Jules)
- Tools with genuine agentic, multi-file codebase-editing capability — not just inline completion

**Excluded:**
- Orchestration *methodologies and frameworks* that structure agents through a process (BMAD, Spec-Kit, Task Master, CrewAI, etc.) → these belong in `ai-workflows`
- Plain chat assistants with no codebase-editing capability (ChatGPT web, Claude.ai chat, Gemini web)
- Raw model APIs and model families themselves (GPT-5, Claude Opus, Gemini) — they are the engines an agent drives, not the agent
- Pure autocomplete / inline-completion tools with no agentic, multi-file editing (classic Tabnine-style completion, Kite)
- Code-review-only or test-generation-only bots that do not edit a working tree
- Agents that are discontinued AND no longer usable

## Attribute Groups

### 1. General Information

| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Developer** | text | Company or org that builds the agent (Anthropic, OpenAI, Cursor/Anysphere, Google, GitHub, etc.). |
| **First Release** | date (month-year) | First public release or general-availability date. Use the public announcement if GA slipped. |
| **Status** | tags | `active`, `beta`, `preview`, `discontinued`. One primary status. |
| **License** | tags | `proprietary`, `open-source`, `source-available`, `freemium`. License of the agent itself, not its model. |
| **Specialization** | tags | `general-purpose`, `frontend-ui`, `testing`, `code-review`, `migration`, `data-science`, `devops`, `mobile`. What the agent is optimized for; most are `general-purpose`. Multi-select. |
| **Website** | link | Official product page or repository. |

### 2. Form & Integration

| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Interface** | tags | `cli`, `ide`, `ide-extension`, `web`, `desktop-app`. Select all that apply (some ship in multiple forms). |
| **Host IDEs** | tags | `vscode`, `jetbrains`, `neovim`, `visual-studio`, `standalone`, `terminal`, `browser`. Where it actually runs; `standalone` for forked editors (Cursor, Windsurf). |
| **Open Source** | boolean | Is the agent's own source code openly licensed? (Not the model.) |
| **Self-Contained vs Plugin** | tags | `standalone-editor`, `extension`, `cli-tool`, `cloud-service`. The fundamental product shape. |

### 3. Models & Flexibility

| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Default Model Provider** | tags | `anthropic`, `openai`, `google`, `meta`, `mistral`, `xai`, `multiple`. The provider behind the default/flagship model. |
| **Model Choice** | boolean | Can the user switch between multiple models/providers from within the agent? |
| **Bring-Your-Own-Key** | boolean | Can the user supply their own API key instead of the vendor's billing? |
| **Local Model Support** | boolean | Can it run against a local/self-hosted model (Ollama, LM Studio, vLLM, etc.)? |

### 4. Agentic Capabilities

| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Multi-file Editing** | boolean | Can it plan and apply coordinated edits across multiple files in one task? |
| **Autonomous Task Execution** | boolean | Can it execute a multi-step task end-to-end with minimal per-step prompting? |
| **Terminal/Command Execution** | boolean | Can it run shell commands / build / test as part of its loop? |
| **MCP Support** | boolean | Supports the Model Context Protocol for external tools/data sources. |
| **Subagents / Parallel Agents** | boolean | Can it spawn or orchestrate multiple agents (sub-tasks, parallel workers)? |
| **Codebase Indexing** | boolean | Builds a semantic index / embeddings of the repo for retrieval (vs reading files ad hoc). |
| **Planning Mode** | boolean | Has an explicit plan-then-execute or read-only planning phase. |
| **Skills** | boolean | Supports reusable, packaged capabilities the agent loads on demand (skills, custom commands, recipes) beyond plain instruction files. |
| **Multimodal Input** | boolean | Accepts images as input — screenshots, mockups, design files (Figma-to-code, screenshot-driven debugging). |
| **Browser / Computer Use** | boolean | Can drive a real browser or GUI to verify its own changes (navigate, click, run e2e checks, screenshot the result). |

### 5. Interaction & Autonomy Model

How the agent engages the developer — from inline pair-programming to fire-and-forget delegation.

| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Operating Mode** | tags | `inline-completion`, `interactive-chat`, `supervised-agent`, `autonomous`, `async-background`. The interaction styles the agent supports; multi-select. |
| **Inline Completion** | boolean | Tab-style autocomplete suggestions as you type (the interactive end). CLI agents typically lack this. |
| **Background / Async Execution** | boolean | Can run a task asynchronously while the developer does other work (cloud agents, background runs). |
| **Persistent Memory** | boolean | Retains context/memory across sessions (project memory, learned preferences) rather than starting fresh each time. |
| **Checkpoints / Rollback** | boolean | Can undo or restore the working tree to a point before an agent run (built-in checkpoints or snapshot restore). |

### 6. Workflow & Collaboration

| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Git Integration** | boolean | Native awareness of git (staging, diffs, commits) beyond just editing files. |
| **PR Creation** | boolean | Can open or update pull requests (directly or via GitHub/GitLab integration). |
| **Custom Rules / Instructions** | boolean | Supports project-level instruction files (rules, AGENTS.md, CLAUDE.md, .cursorrules, etc.). |
| **Hooks / Extensibility** | boolean | Programmable hooks, custom commands/skills, or a plugin API to extend behavior. |

### 7. Trust & Safety

| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Permission Model** | tags | `auto-run`, `ask-approval`, `sandboxed`, `configurable`. How edits and command execution are gated. |
| **Self-Host / On-Prem** | boolean | Can the agent be deployed on the user's own infrastructure. |
| **Privacy Mode** | boolean | Vendor offers a mode that guarantees your code is not used to train models. |
| **Enterprise Controls** | tags | `sso`, `audit-logs`, `rbac`, `vpc`, `none`. Enterprise-grade governance features offered. |

### 8. Pricing

| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Pricing Model** | tags | `free`, `free-tier`, `subscription`, `usage-based`, `byok-only`. Select all that apply. |
| **Free Tier** | boolean | Is there a usable free tier or free plan (not just a trial)? |
| **Entry Price (USD/mo)** | decimal (descending) | Cheapest paid plan's monthly price; lower is better. Use 0 if a real free tier covers core use; null for pure usage-based with no plan. |

### 9. Adoption & Ecosystem

| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Maturity** | rating (1-5, ascending) | 5 = stable, widely deployed, polished; 3 = usable but evolving; 1 = early/experimental. |
| **Community Size** | tags | `huge`, `large`, `medium`, `small`, `niche`. Relative scale of users/community. |
| **Extension/Plugin Ecosystem** | boolean | Has a marketplace or meaningful third-party ecosystem (MCP servers, plugins, community rules). |

## Research Sources

### Primary Sources (Preferred)

1. **Official product page & docs** — feature lists, supported IDEs, model options, permission model.
2. **Official pricing page** — plans, free tier, entry price, enterprise tiers. Snapshot the date.
3. **Official GitHub / repository** — confirms open-source status, license, release history, MCP/extensibility.
4. **Official changelog / release notes** — first-release date, capability additions, status (beta vs GA).
5. **Vendor privacy / trust center** — training-data policy, self-host options, enterprise controls.

### Secondary Sources

6. **Documentation for integrations** — VS Code Marketplace, JetBrains Marketplace listings confirm host IDEs and install base signals.
7. **Independent reviews & comparisons** — recent articles benchmarking agents (verify against primary docs; this space moves fast).
8. **Community discussion** — Reddit (r/ChatGPTCoding, r/cursor), Hacker News threads, vendor Discords for real-world capability and maturity signals.
9. **Model Context Protocol directories** — to confirm MCP support and ecosystem breadth.

### Tertiary / Verify Carefully

10. **Marketing claims** — treat "fully autonomous" and "agentic" labels skeptically; verify the specific capability.
11. **Star counts / download numbers** — rough community-size proxies only; not authoritative.
12. **Wikipedia / aggregators** — fast-moving field; often outdated within weeks.

## Assessment Guidelines

- **Interface vs Host IDEs**: `Interface` is the product shape (is it a CLI? an editor?); `Host IDEs` is *where it actually runs*. A VS Code extension is `Interface: ide-extension` + `Host IDEs: vscode`. A forked editor like Cursor is `Interface: ide` + `Host IDEs: standalone`.
- **Open Source**: Refers to the *agent's* source, not the model it calls. Cursor is closed even though it drives open weights; Aider and Cline are open. Mark `source-available` in License (and `false` here) when code is visible but not OSI-licensed.
- **Model Choice vs BYOK**: `Model Choice` = can you pick among models the vendor offers. `Bring-Your-Own-Key` = can you plug in your own provider account/key. A tool can have one without the other.
- **Autonomous Task Execution**: `true` only if the agent meaningfully chains steps (edit → run → fix → repeat) toward a goal with minimal per-step prompting. A tool that edits one diff per prompt is multi-file but not autonomous.
- **MCP Support**: `true` only for shipped/documented Model Context Protocol support, not a roadmap promise.
- **Subagents / Parallel Agents**: `true` if the agent can spawn sub-tasks or run multiple agents/workers. Background "cloud" task runners that fan out count; a single linear loop does not.
- **Codebase Indexing**: `true` for a built semantic index / embeddings store. Reading files on demand into context is *not* indexing — note the distinction in the comment.
- **Skills**: `true` for packaged, on-demand capabilities the agent loads when relevant (Claude Code skills, custom slash commands, reusable recipes/prompts). Distinct from `Custom Rules / Instructions` (always-on project context) and `Hooks / Extensibility` (programmatic event hooks / plugin APIs). A tool with only a single instruction file and no reusable command/skill mechanism is `false`.
- **Multimodal Input**: Refers to *image* input specifically (screenshots, mockups, designs). Voice/audio alone does not qualify; note it in the comment if present.
- **Browser / Computer Use**: `true` only if the agent itself can operate a browser/GUI to act and verify, not merely fetch a URL's text. Plain web-search or doc-fetch tools do not count.
- **Specialization**: Default to `general-purpose` for broad coding agents. Add a narrower tag only when the product is genuinely positioned and optimized for that niche (e.g. a review-only or UI-first agent), not because it happens to handle that work.
- **Operating Mode**: The defining axis — select every mode the agent genuinely supports. `inline-completion` = tab autocomplete; `interactive-chat` = conversational edits with the user in the loop; `supervised-agent` = runs multi-step but expects per-step or per-action approval; `autonomous` = completes whole tasks with minimal intervention; `async-background` = runs detached while the user does other work. Most IDE tools span several; a pure cloud agent may be only `autonomous` + `async-background`.
- **Inline Completion**: `true` only for genuine as-you-type tab suggestions, not chat-driven edits. This is the cleanest interactive/autonomous discriminator — CLI agents (Claude Code, Aider) are typically `false`.
- **Background / Async Execution**: `true` if the user can dispatch a task and walk away (closing the editor, doing other work). An agent that requires the session to stay focused while it churns is `false`.
- **Persistent Memory**: `true` for memory carried across distinct sessions (stored project memory, learned preferences). A large context window within one session is *not* persistent memory.
- **Checkpoints / Rollback**: `true` for a built-in mechanism to revert an agent run as a unit (Cursor-style checkpoints, snapshot restore). Relying on the user to `git reset` manually does not count.
- **Permission Model**: `auto-run` applies changes/commands without asking; `ask-approval` prompts per action; `sandboxed` isolates execution; `configurable` when the user can choose the posture. Pick the most representative tag(s).
- **Privacy Mode**: `true` only if the vendor explicitly offers a zero-training guarantee for your code (often enterprise or an opt-out setting). Default consumer behavior that *might* train on data is `false`.
- **Entry Price (USD/mo)**: Cheapest *paid* plan billed monthly (convert annual-billed prices to their monthly equivalent and note it). Use `0` when a genuine free tier covers core coding use. Use `null` for pure usage-based pricing with no fixed plan, and explain in the comment.
- **Maturity** rating: 5 = stable GA, large deployment, polished UX; 3 = solid but actively changing APIs/UX; 1 = early preview/experimental. Beta-labeled products rarely exceed 3.
- **Community Size** rough thresholds: `huge` = GitHub Copilot / Cursor scale; `large` = Claude Code, Windsurf, Aider; `medium` = Cline, Continue, Amazon Q; `small`/`niche` = newer or single-vendor tools.

### When to Use `null`

- Pricing for tools with no published plan (pure usage-based or enterprise-quote-only) — `null` + comment.
- Capability flags where the vendor is vague and no independent confirmation exists — prefer `null` over guessing.
- First-release dates for tools whose public history is unclear (renamed/rebranded products) — `null` + comment.
- Community size when there is no credible signal at all.
- Any attribute where vendor marketing and independent testing conflict — `null` and explain in the comment.

## Candidates

- [x] **Claude Code** — Anthropic's terminal-first agentic coding tool; reference CLI agent
- [x] **OpenAI Codex (CLI)** — OpenAI's open-source terminal coding agent
- [x] **Cursor** — AI-native fork of VS Code; leading IDE agent
- [x] **GitHub Copilot** — The incumbent; agent mode plus completion across VS Code and JetBrains
- [x] **Windsurf** — Agentic IDE (formerly Codeium) with "Cascade" flow
- [x] **Kiro** — AWS's spec-driven agentic IDE
- [x] **Aider** — Open-source CLI pair-programmer with strong git integration
- [ ] **Cline** — Open-source autonomous coding agent extension for VS Code
- [ ] **Continue** — Open-source, highly configurable IDE extension agent
- [ ] **Gemini CLI** — Google's open-source terminal agent
- [ ] **Devin** — Cognition's autonomous cloud software engineer
- [ ] **Google Jules** — Google's asynchronous autonomous coding agent
- [ ] **Amazon Q Developer** — AWS's IDE/CLI coding agent
- [ ] **Zed (agent)** — Agentic editing inside the Zed editor
- [ ] **Augment Code** — Codebase-context-focused agent across IDEs
- [ ] **RooCode** — Open-source autonomous agent extension (Cline fork lineage)

## Notes for Researchers

1. **This field moves weekly.** Snapshot the check date in the `comment` for any pricing, status, or capability value — a "true" today may be a "false" or rebrand next quarter.
2. **Separate the agent from the model.** Record the agent's own license and capabilities, not the model's. "Open source" means the *tool* is open, even if it drives a closed model.
3. **Verify capability claims against docs, not marketing.** "Agentic" and "autonomous" are marketing words; confirm the specific behavior (does it actually run commands? open PRs?) in the documentation before marking `true`.
4. **Watch for rebrands and lineage.** Windsurf was Codeium; several extensions are forks of Cline. Note prior names in the comment so the first-release date and history make sense.
5. **Multiple form factors are common.** Many products ship as both a CLI and an extension, or both an editor and a cloud agent. Use multi-select tags rather than forcing one form.
6. **Pricing is layered.** Many tools have free tier + subscription + usage-based all at once. Capture the entry price for the cheapest paid plan and use tags to convey the full model.
7. **Privacy/training policy is often buried.** Check the trust center or enterprise docs, not the homepage; consumer and enterprise tiers frequently differ.
8. **Cite primary sources with URLs.** Prefer the vendor's own docs/pricing/changelog; fall back to independent reviews only to corroborate, and flag conflicts with `null`.
9. **Use `null` + comment over a confident guess.** An unknown capability marked unknown is more useful than a wrong `true`.

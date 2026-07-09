# Codebase Indexing & Context Research Guide

## Overview

Compare tools that give AI coding agents accurate, *tailored* context about the specific repository being worked on — instead of the agent blindly grepping, guessing, or reading files ad hoc. This layer sits between the agent (`ai-coding-agents`) and the model: it decides *which slices of the codebase* an agent should see for a given task. The space spans several retrieval philosophies — semantic embeddings, lexical/trigram search, AST-aware structural retrieval, code knowledge graphs, LLM-ranked repo maps, and whole-repo "packers" — delivered as standalone MCP servers, libraries, CLIs, IDE extensions, or engines welded into an agent. The goal is to help a developer pick the context layer that best fits their agent, repo size, language mix, and privacy posture.

Users should be able to:
- Understand *how* a tool finds relevant code (embeddings vs lexical vs graph vs repo-map vs packing) and what a query returns
- Judge whether it plugs into their agent (MCP, IDE extension, library) or only exists inside a specific product
- Compare indexing behaviour — local vs cloud index, incremental/real-time updates, vector store, embedding model
- Evaluate privacy and deployment — whether code leaves the machine, self-host and local-only options
- Gauge scale limits, maturity, and cost before adopting

## Scope

**Included:**
- Standalone / pluggable context tools — MCP servers (Serena, claude-context), libraries, CLIs, IDE extensions that any agent can consume
- Code search engines used as agent context providers (Sourcegraph/Cody context, Zoekt, Greptile)
- Code knowledge-graph builders that serve structural context to agents (Potpie, Blarify)
- LLM repo-map / ranking approaches (Aider's repo map)
- Whole-repo packers that serialize a codebase into a single context blob (repomix, gitingest, code2prompt) — treated as one retrieval technique among others
- Context/indexing engines bundled inside an agent or IDE (Cursor's codebase index, Windsurf/Codeium indexing, Augment's context engine) — compared on retrieval approach, but flagged as not separately usable

**Excluded:**
- The coding agents themselves — the thing that *consumes* the context → `ai-coding-agents`
- Development-workflow methodologies and orchestration frameworks → `ai-workflows`
- Raw embedding models and vector databases as standalone infrastructure (Qdrant, Milvus, Voyage, OpenAI embeddings) — they are components a context tool *uses*, not the tool
- General-purpose editor code-search/navigation with no AI/agent-facing retrieval story (plain LSP, ctags, ripgrep on its own)
- Structural refactoring/linting tools (ast-grep, Semgrep) unless positioned as agent context providers
- Documentation-site or web RAG tools that do not index a working code repository

## Attribute Groups

### 1. General Information

| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Developer / Org** | text | Company, individual, or org that builds the tool. |
| **Implementation Language** | tags | Major language/framework the tool itself is built in: `rust`, `go`, `typescript`, `javascript`, `python`, `java`, `cpp`, `csharp`, `other`. What you install/run, not the languages it indexes. `null`/`other` for closed engines with no disclosed stack. Multi-select for genuine polyglot cores. |
| **First Release** | date (month-year) | First public release or announcement. Use `null` + comment for rebranded/unclear history. |
| **Status** | tags | `active`, `beta`, `preview`, `discontinued`. One primary status. |
| **License** | tags | `mit`, `apache-2`, `gpl`, `bsd`, `mpl`, `source-available`, `proprietary`, `other`. License of the tool itself. |
| **Open Source** | boolean | Is the tool's own source openly (OSI) licensed? For bundled engines, this is the host product's stance on the engine — usually `false`. |
| **Website** | link | Official product page or landing page. |
| **Repository** | link | Primary source repo. `null` for closed/bundled engines. |
| **GitHub Stars** | integer (neutral) | Star count; record the capture date in the comment. `null` for closed-source/bundled. |

### 2. Form & Distribution

| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Form Factor** | tags | `mcp-server`, `library`, `cli`, `ide-extension`, `cloud-service`, `agent-bundled`, `hook`. What shape the product ships in; multi-select. `agent-bundled` = the retrieval engine lives inside a specific agent/IDE; `hook` = integrates via a git or agent lifecycle hook (e.g. a post-commit hook that auto-syncs the index, like Coraline's `hooks install`). |
| **Standalone Usable** | boolean | Can it be used outside a single host agent — added to your own agent/toolchain? `false` for engines welded into Cursor/Windsurf/Augment. |
| **Bundled Host** | text | For bundled engines, which agent/IDE it ships inside (e.g. "Cursor", "Windsurf"). Empty/`null` for standalone tools. |
| **Install Mechanism** | tags | `npm`, `pip`, `cargo`, `docker`, `binary`, `editor-extension`, `hosted`, `git`. Primary install path(s); multi-select. |

### 3. Retrieval Approach

| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Retrieval Technique** | tags | `embeddings`, `lexical`, `ast-structural`, `code-graph`, `llm-repo-map`, `whole-repo-pack`, `hybrid`. The core method for finding relevant code; multi-select. `lexical` = BM25/trigram/regex; `whole-repo-pack` = serialize everything, no selection. |
| **Query Interface** | tags | `natural-language`, `symbol-lookup`, `regex-lexical`, `tool-call`, `none`. How a caller queries it; multi-select. `none` for packers that take no query. |
| **Returns** | tags | `code-chunks`, `whole-files`, `symbols`, `call-graph`, `summaries`, `file-list`, `repo-blob`. What a retrieval yields; multi-select. |
| **Structural Awareness** | boolean | Uses tree-sitter / LSP / AST to respect code structure (functions, classes) rather than treating code as plain text. |
| **Chunking Strategy** | tags | `ast-aware`, `symbol-level`, `fixed-size`, `file-level`, `none`. How code is split before indexing. `none` for graph/lexical tools that don't chunk. |
| **Reranking** | boolean | Applies a second-stage rerank (cross-encoder, LLM rerank, graph ranking) over first-pass hits before returning. |

### 4. Indexing

| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Index Location** | tags | `local`, `cloud`, `both`, `none`. Where the built index lives. `none` for stateless packers/on-the-fly tools that build nothing persistent. |
| **Incremental Updates** | boolean | Re-indexes only changed files rather than rebuilding the whole index. |
| **Real-Time / Watch** | boolean | Auto-updates the index as files change (on save, on git commit, file watcher) vs manual re-index. |
| **Vector Store** | tags | `qdrant`, `milvus`, `chroma`, `lancedb`, `pgvector`, `faiss`, `sqlite`, `proprietary`, `none`. Backing store for embeddings; `none` for non-embedding tools. Multi-select if pluggable. |
| **Embedding Model** | text | Which embedding model powers semantic retrieval (e.g. "OpenAI text-embedding-3-large", "Voyage code-3", "local bge"). `null`/"n-a" for non-embedding techniques. |

### 5. Integration

| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **MCP Support** | boolean | Exposed as an MCP server / MCP tools that any MCP-capable agent can call. |
| **Agent Compatibility** | tags | `claude-code`, `cursor`, `cline`, `continue`, `copilot`, `windsurf`, `aider`, `codex`, `any-mcp-client`, `self-contained`, `other`. Agents that can consume it; multi-select. `self-contained` for bundled engines usable only by their host. |
| **IDE Integrations** | tags | `vscode`, `jetbrains`, `neovim`, `standalone`, `terminal`, `web`, `none`. Where it surfaces to the developer; multi-select. |
| **Language-Agnostic** | boolean | Indexes any text/language, vs limited to languages with parser support. |
| **Supported Languages** | text | Short note: "any (text-based)", or the parsed-language set (e.g. "tree-sitter: 20+ langs"). |

### 6. Privacy & Deployment

| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Code Leaves Machine** | boolean | Does source or its embeddings get sent to a third-party service by default? `true` = code egresses; note *what* leaves in the comment (raw code vs embeddings only). |
| **Local-Only Option** | boolean | Can it run fully offline — local embeddings/index, no external API call required? |
| **Self-Hostable** | boolean | Can the cloud/service variant be deployed on the user's own infrastructure? |
| **Telemetry** | tags | `none`, `opt-in`, `opt-out`, `required`. Usage-data collection posture. |

### 7. Scale, Pricing & Ecosystem

| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Max Repo Scale** | tags | `small`, `medium`, `large`, `monorepo-scale`. Largest codebase size the tool handles well per docs/positioning. |
| **Pricing Model** | tags | `free-oss`, `freemium`, `paid-saas`, `byok`, `bundled`. Multi-select. `byok` = free tool, you pay the embedding/model API; `bundled` = cost folded into a host agent's plan. |
| **Entry Price (USD/mo)** | decimal (descending) | Cheapest paid plan's monthly price; lower is better. `0` for genuinely free/OSS; `null` for pure usage-based or bundled with no standalone price. |
| **Maturity** | rating (1-5, ascending) | 5 = stable, widely deployed, polished; 3 = usable but evolving; 1 = early/experimental. |
| **Active Maintenance** | boolean | Commit or release within ~90 days of the research date. `null` for closed/bundled with no visible history. |
| **Community Size** | tags | `huge`, `large`, `medium`, `small`, `niche`. Relative scale of users/community. |

## Research Sources

### Primary Sources (Preferred)
1. **Official repository (GitHub/GitLab)** — README, docs, license, release history; confirms retrieval technique, vector store, incremental indexing, language support.
2. **Official documentation site** — architecture pages describing how indexing/retrieval works; MCP and IDE integration instructions.
3. **Official product / pricing page** — for commercial and bundled offerings (Greptile, Sourcegraph, Cursor, Windsurf, Augment).
4. **Official blog / changelog / release notes** — first-release date, technique changes, embedding-model swaps, scale claims.
5. **Trust / security / privacy docs** — whether code leaves the machine, self-host options, telemetry, data-retention.

### Secondary Sources
6. **MCP server directories / registries** — confirm MCP exposure and which clients can consume the tool.
7. **VS Code / JetBrains marketplace listings** — confirm IDE integrations and install-base signals.
8. **Independent benchmarks & comparisons** — retrieval-quality write-ups, RAG-over-code evaluations (verify against primary docs; this space moves fast).
9. **Hacker News / Reddit / project Discord** — real-world scale, indexing-time, and reliability reports.
10. **star-history.com** — GitHub star trajectory as a rough community-size proxy.

### Tertiary / Verify Carefully
11. **Marketing claims** — "understands your whole codebase" is copy, not a technique; confirm the actual retrieval mechanism in docs before tagging.
12. **Star counts / download numbers** — community-size proxies only, not authoritative.

## Assessment Guidelines

- **Form Factor vs Standalone Usable**: `Form Factor` is the shape(s) shipped; `Standalone Usable` is the sharp yes/no on whether you can bolt it onto *your own* agent. A tool can be `agent-bundled` and still standalone-usable if the same engine ships as an MCP server; the classic bundled engines (Cursor index, Windsurf indexing, Augment) are `agent-bundled` + `Standalone Usable: false`. Add `hook` only when the tool ships an actual git/lifecycle-hook integration (a post-commit/pre-commit hook that keeps the index fresh, or an agent hook that injects context) — it usually stacks with `mcp-server`/`cli` rather than replacing them.
- **Implementation Language**: The tool's own build stack (what you install/run), not the languages it can index — a Rust indexer that indexes Python is `rust`. Multi-select only for a genuinely polyglot core; use `null`/`other` for closed engines with no disclosed stack.
- **Retrieval Technique**: Tag every method the tool genuinely uses. `hybrid` only when it *combines* two+ techniques in one retrieval path (e.g. embeddings + lexical fusion), not merely because it offers two separate modes — note the combination in the comment. `whole-repo-pack` is for tools whose job is to emit the entire repo (or a filtered slice) with no query-time selection.
- **Structural Awareness**: `true` only for real AST/parser/LSP use (tree-sitter, language servers, symbol graphs). Splitting on blank lines or fixed token windows is *not* structural — mark `false` and note the chunking in the comment.
- **Chunking Strategy**: `ast-aware` = boundaries follow syntax nodes; `symbol-level` = one chunk per function/class; `fixed-size` = token/line windows; `file-level` = whole files as units; `none` for graph or lexical tools that never chunk. For packers, use `file-level` or `none` as fits.
- **Reranking**: `true` for a documented second-stage reorder (cross-encoder, LLM judge, PageRank-style graph ranking such as Aider's). A single vector-similarity sort is *not* reranking.
- **Index Location**: `none` when nothing persistent is built (stateless packers, on-the-fly grep-style tools). `both` when a local index can optionally sync to or run in the cloud.
- **Incremental Updates / Real-Time**: `Incremental` is about *scope* of re-index (changed files only); `Real-Time` is about *trigger* (automatic on change). A tool can be incremental but manual-triggered — keep them distinct.
- **Vector Store**: Record the actual backing store. `none` for lexical/graph/repo-map/packer tools with no embeddings. Multi-select when the store is user-pluggable (e.g. "qdrant or pgvector"); note the default in the comment.
- **Embedding Model**: Name the default model. For BYO-embedding tools, note "configurable" and give the documented default. Use `null`/"n-a" for non-embedding techniques.
- **MCP Support**: `true` only for shipped/documented MCP server or tools, not a roadmap item.
- **Agent Compatibility**: `any-mcp-client` when it's a generic MCP server (works with anything MCP-capable). `self-contained` for bundled engines that only their own host can use. List named first-party integrations explicitly.
- **Language-Agnostic**: `true` when it indexes arbitrary text/code regardless of language (lexical/embedding tools often are). `false` when retrieval quality depends on parser support and only listed languages are covered; put the parsed set in `Supported Languages`.
- **Code Leaves Machine**: The privacy crux. `true` if source or embeddings are transmitted to a third-party service in the default configuration; specify *what* leaves (raw code vs embeddings only) and whether a local-only mode avoids it, in the comment. Bundled cloud engines are typically `true`.
- **Local-Only Option**: `true` only if a fully offline path exists (local embedding model + local store, no external API). A tool that *requires* a hosted embedding API is `false` even if the index sits on disk.
- **Self-Hostable**: For SaaS/cloud tools, whether an on-prem/self-managed deployment is offered. OSS tools that run locally are inherently self-hostable → `true`.
- **Max Repo Scale**: Judge from documented limits and positioning, not aspiration. `monorepo-scale` for tools explicitly built for very large multi-service repos (Sourcegraph, Zoekt). Use `null` + comment when there is no credible signal.
- **Pricing Model**: `free-oss` for OSS you run yourself; `byok` when the tool is free but you pay an embedding/model provider; `bundled` when there is no standalone price because cost is inside a host agent's plan. Multi-select as needed.
- **Entry Price (USD/mo)**: Cheapest *paid* plan billed monthly (convert annual to monthly and note it). `0` for genuinely free/OSS core use; `null` for pure usage-based or bundled-only pricing (explain in comment).
- **Maturity**: 5 = stable, broadly deployed, polished; 3 = solid but actively changing; 1 = early preview/experimental. Beta-labeled tools rarely exceed 3.
- **Community Size**: `huge` = Sourcegraph/Cursor-index scale; `large` = repomix/Continue; `medium` = Serena/Greptile; `small`/`niche` = newer single-maintainer tools.

### When to Use `null`
- Retrieval/indexing internals for closed bundled engines where the vendor is vague — prefer `null` over guessing the technique.
- Pricing for pure usage-based or bundled-only tools with no standalone plan — `null` + comment.
- Stars / repo / maintenance for closed-source or bundled engines — `null` + comment.
- Max repo scale when there is no credible signal at all.
- Any attribute where vendor marketing and independent testing conflict — `null` and explain in the comment.

## Candidates

- [x] Serena — LSP-based semantic code toolkit exposed as an MCP server; symbol-level structural retrieval for any agent
- [x] Probe — local semantic + lexical code search built for AI agents; no cloud, AST-aware
- [x] claude-context (Zilliz) — MCP server that indexes a repo into Milvus/Zilliz for embedding-based retrieval
- [x] Continue @codebase — Continue's built-in embeddings indexing of the open repository
- [x] Aider Repo Map — tree-sitter repo map ranked by graph/PageRank to feed the most relevant symbols
- [x] Sourcegraph / Cody context — code search engine and context API serving repo-scale retrieval to agents
- [x] Greptile — cloud codebase-understanding API answering questions and providing context over a repo
- [x] Potpie — codebase knowledge-graph platform providing structural context and agents over a repo
- [x] Blarify — builds a code knowledge graph (AST + LSP) into a graph DB for structural retrieval
- [x] Zoekt — fast trigram code search engine (Sourcegraph); lexical retrieval at monorepo scale
- [x] repomix — packs an entire repository into a single AI-friendly context file
- [x] gitingest — turns a git repo (or URL) into a prompt-ready digest of its contents
- [x] code2prompt — CLI that serializes a codebase into a structured prompt with token counting
- [x] VectorCode — CLI/library that builds a local vector index of a repo for RAG-style code retrieval
- [x] Cursor Codebase Index — Cursor's bundled embeddings index of the open workspace
- [ ] Windsurf (Codeium) Indexing — Windsurf's bundled codebase indexing/retrieval engine
- [ ] Augment Context Engine — Augment Code's proprietary large-codebase context/retrieval engine
- [ ] Coraline — 100% local, Rust code-intelligence MCP server combining embeddings, lexical search, and a code knowledge graph; installs a git hook to auto-sync its index on commit

## Notes for Researchers

1. **This field moves weekly.** Snapshot the check date in the `comment` for any pricing, status, embedding-model, or capability value — retrieval techniques and default embedding models change between releases.
2. **Separate the context layer from the agent and the model.** Record *this tool's* technique, index, and privacy posture — not the agent that consumes it or the LLM that reasons over the results.
3. **Verify the retrieval technique in docs, not marketing.** "Understands your whole codebase" is copy. Confirm whether it is embeddings, lexical, a graph, a repo-map, or just packing — and cite the doc that says so.
4. **Name what leaves the machine.** For privacy attributes, distinguish "raw code is uploaded" from "only embeddings are uploaded" from "nothing leaves" — this is the decisive difference for many adopters.
5. **Bundled engines have thin public internals.** For Cursor/Windsurf/Augment, expect to `null` several indexing internals; capture what the vendor *does* state (local vs cloud index, encryption) and flag the rest as undisclosed.
6. **Distinguish incremental from real-time and index from cache.** A persistent on-disk vector index is different from an ephemeral per-session cache; a manual re-index is different from a file-watcher. Keep these precise.
7. **Cite primary sources with URLs.** Prefer the tool's own repo/docs/pricing; fall back to independent reviews only to corroborate, and flag conflicts with `null`.
8. **Use `null` + comment over a confident guess.** An unknown internal marked unknown is more useful than a wrong technique tag.

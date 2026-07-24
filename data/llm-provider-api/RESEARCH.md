# LLM Provider API Research Guide

## Overview

Compare the HTTP APIs through which developers send inference requests to large language models — first-party model APIs, cloud model-hosting platforms, routing gateways, and enterprise assistant platforms that expose a programmatic endpoint. The goal is to help a developer decide **where to send their API calls**: which provider supports the request features they need (tool use, streaming, structured output, vision, prompt caching, batch, long context), how models are accessed and authenticated, what governance and data-handling guarantees apply, and how billing works. This comparison is about the *API surface and its capabilities*, not about which vendor's models score highest on benchmarks — model quality is deliberately out of scope.

Users should be able to:
- Match a provider's request features to their needs — tool/function calling, streaming, schema-enforced structured output, multimodal input, embeddings
- Judge model access — first-party only vs multi-vendor catalog, open-weight availability, version pinning, fine-tuned/custom model deployment
- Compare advanced capabilities — prompt caching, batch processing, extended reasoning, built-in web search / code execution, MCP support, files/retrieval
- Assess integration cost — OpenAI-API compatibility, official SDK languages, migration friction
- Evaluate governance — data residency, zero-retention / no-training defaults, compliance certifications, enterprise auth
- Understand access and billing — auth model, self-serve signup, free credits, pricing model, unified billing across models

## Scope

**Included:**
- **First-party model APIs** — vendors that train and serve their own models over their own API (Anthropic Claude API, OpenAI API, Google Gemini API, Mistral AI, Cohere)
- **Cloud model-hosting platforms** — hyperscaler platforms serving many vendors' models behind one API with IAM/region/compliance stories (Amazon Bedrock, Google Vertex AI, Azure AI Foundry)
- **Routing gateways / aggregators** — a single API that fans out to many models/providers with unified billing, fallback, and normalization (OpenRouter, Together AI, Groq)
- **Enterprise assistant platforms** — workspace/assistant products that also expose a programmatic API for building on their agents/models (dust.tt, Langdock)
- Providers whose API is generally available and self-serve or enterprise-obtainable

**Excluded:**
- **Local / self-hosted inference servers** (Ollama, vLLM, LM Studio, llama.cpp server) — these are runtimes you operate, not hosted provider APIs → out of scope
- **Model families / weights themselves** (GPT-5, Claude Opus, Llama, Gemini) — a model is served *through* an API; here we compare the API, not the model
- **AI coding agents and IDE tools** (Claude Code, Cursor, Copilot) → these live in `ai-coding-agents`; they *consume* these APIs
- **No-code chatbot builders and pure chat UIs** with no documented developer API
- **Pure vector databases / embedding stores** with no LLM inference endpoint
- **Fine-tuning-only or training-only platforms** with no inference-serving API

## Attribute Groups

### 1. General Information

| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Provider** | text | Company or org operating the API (Anthropic, Amazon Web Services, Google, dust.tt, etc.). |
| **Category** | tags | `first-party`, `cloud-platform`, `gateway`, `assistant-platform`. The product shape; single primary tag expected but multi-select allowed for hybrids (e.g. a first-party vendor that also aggregates). |
| **API Launched** | date (month-year) | First public/GA availability of the inference API (not the company founding). Use the developer-API launch, which may lag a consumer product. |
| **Status** | tags | `ga`, `preview`, `beta`. Overall availability of the developer API. |
| **API Docs** | link | Official API reference / developer documentation URL. |
| **Website** | link | Official product/homepage URL. |

### 2. Access & Authentication

| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Auth Methods** | tags | `api-key`, `oauth`, `cloud-iam`, `aws-sigv4`, `service-account`. How requests are authenticated. Cloud platforms typically use `cloud-iam`/`service-account`; gateways and first-party APIs use `api-key`. Multi-select. |
| **Self-Serve Signup** | boolean | Can a developer get a working API key without sales contact or an existing cloud account? `false` for enterprise-quote-only or invite-gated access. |
| **Free Credits / Trial** | boolean | Are there free credits or a usable free tier for evaluation (not merely a demo playground)? Note the amount in the comment. |
| **Regional Endpoints** | tags | `us`, `eu`, `asia`, `global`, `multi-region`. Where the API can be called / served from. Cloud platforms usually expose many regions; single-endpoint providers are `global`. |
| **Data Residency Options** | boolean | Can the customer pin data processing to a chosen region/jurisdiction? Distinct from merely having multiple endpoints — this is a contractual/config guarantee. |

### 3. Model Access

| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Model Breadth** | tags | `single-vendor`, `few-vendors`, `many-vendors`. How many model families are reachable through this one API. First-party = `single-vendor`; gateways/platforms = `many-vendors`. |
| **Open-Weight Models** | boolean | Are open-weight models (Llama, Mistral, Qwen, DeepSeek, etc.) available through the API, alongside or instead of proprietary ones? |
| **Model Version Pinning** | boolean | Can the caller pin a specific dated/immutable model snapshot (vs only a floating alias that may change under them)? |
| **Custom / Fine-Tuned Deployment** | boolean | Can the customer deploy and call their own fine-tuned or private model through the same API? |
| **Model Catalog Size** | tags | `1-5`, `6-20`, `21-100`, `100+`. Rough count of distinct models callable. Use the comment to note the exact figure and check date. |

### 4. Core Request Capabilities

| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Chat / Messages Endpoint** | boolean | Offers a modern multi-turn chat/messages inference endpoint (as opposed to legacy single-prompt completion only). |
| **Streaming** | boolean | Supports token streaming (SSE or equivalent) for incremental responses. |
| **Tool / Function Calling** | boolean | Model can request structured tool/function invocations the caller executes. `true` only for shipped, documented support. |
| **Parallel Tool Calls** | boolean | Model can emit multiple tool calls in a single turn for concurrent execution. |
| **Structured Output** | tags | `json-mode`, `json-schema`, `grammar`, `none`. Strongest guaranteed-shape output supported. `json-schema` = server-enforced schema conformance; `json-mode` = valid-JSON only; `grammar` = constrained decoding / regex/BNF; `none` = prompt-only. |
| **System Prompt** | boolean | Distinct system/developer role or instruction field supported at the API level. |

### 5. Multimodal & Embeddings

| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Image Input (Vision)** | boolean | Accepts images as request input for the LLM to reason over. |
| **Audio Input** | boolean | Accepts audio input (speech understanding / transcription via the same provider API). |
| **Document / PDF Input** | boolean | Native document/PDF ingestion as a first-class input type (not just "paste the text"). |
| **Image Generation** | boolean | Offers an image-generation endpoint through the same API/account. |
| **Text-to-Speech / Audio Output** | boolean | Offers speech/audio synthesis output through the same API/account. |
| **Embeddings Endpoint** | boolean | Offers a text-embeddings endpoint for retrieval/semantic search under the same API. |

### 6. Advanced Capabilities

| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Prompt Caching** | boolean | Supports caching of repeated prompt prefixes for cost/latency reduction (explicit or automatic). Note which in the comment. |
| **Batch API** | boolean | Offers an asynchronous batch/offline endpoint (typically discounted, higher-latency) for bulk jobs. |
| **Max Context Window** | integer (ascending) | Largest input context (tokens) any model on the API supports. Higher is better. Record the model in the comment. |
| **Extended Reasoning** | boolean | Exposes a reasoning/thinking mode or reasoning-effort control (visible or budgeted thinking tokens) at the API level. |
| **Built-in Web Search** | boolean | Provider offers a first-party web-search / grounding tool callable via the API (not you wiring your own). |
| **Built-in Code Execution** | boolean | Provider offers a first-party code-interpreter / sandboxed execution tool via the API. |
| **MCP Support** | boolean | API can connect to Model Context Protocol servers (hosted/remote MCP connectors) as part of a request or agent. Shipped support only. |
| **Files / Retrieval API** | boolean | Offers file upload + managed retrieval/RAG or a files API the model can reference. |
| **Agents / Assistants API** | boolean | Offers a higher-level stateful agents/assistants/threads API above raw inference (managed conversation state, tool orchestration). |

### 7. Compatibility & SDKs

| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **OpenAI-Compatible API** | boolean | Exposes an OpenAI-Chat-Completions-compatible endpoint so existing OpenAI SDK code works with a base-URL swap. The de-facto interop standard for gateways. |
| **Official SDKs** | tags | `python`, `typescript`, `java`, `go`, `ruby`, `dotnet`, `rust`, `php`. First-party maintained client libraries. Multi-select. |
| **Native API Style** | tags | `openai`, `anthropic-messages`, `cloud-native`, `graphql`, `proprietary`. The provider's own primary request/response shape (before any compatibility shim). |
| **Webhooks / Callbacks** | boolean | Supports webhooks or async callbacks for long-running / batch job completion. |

### 8. Reliability & Operations

| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Published SLA** | boolean | A contractual uptime SLA is offered (often paid/enterprise tier). Note the figure/tier in the comment. |
| **Rate Limit Model** | tags | `fixed-tiers`, `usage-based-scaling`, `provisioned-throughput`, `custom`. How throughput limits work — fixed per-tier caps, auto-scaling with spend, reserved capacity, or negotiated. |
| **Provider Fallback / Routing** | boolean | Can automatically route or fall back across underlying providers/models on error or capacity (a defining gateway feature; usually `false`/`null` for first-party). |
| **Status Page** | boolean | Public status/uptime page exists. |

### 9. Governance & Compliance

| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **No-Training Default** | boolean | API inputs/outputs are NOT used to train models by default (zero-training / no-retention-for-training). Consumer-grade defaults that *may* train are `false`. |
| **Zero Data Retention** | boolean | A zero-retention mode (no storage of prompts/outputs beyond the request) is available, at least on request/enterprise. Note the tier in the comment. |
| **Compliance Certifications** | tags | `soc2`, `hipaa`, `iso-27001`, `gdpr`, `fedramp`, `pci`. Documented certifications/attestations. Multi-select. |
| **Enterprise SSO / Access Control** | boolean | Offers SSO/SAML and org-level access controls for API/console governance. |

### 10. Pricing & Billing

| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Pricing Model** | tags | `usage-token`, `subscription`, `provisioned`, `markup`, `free-tier`. How you pay — per-token usage, flat subscription, reserved throughput, gateway markup over passthrough, or a free tier. Multi-select. |
| **Unified Billing** | boolean | One bill/account covers all reachable models/providers (a gateway/platform advantage). `false` when each model or vendor bills separately. |
| **Cache/Batch Discount** | boolean | Offers a price discount for cached prompts and/or batch jobs. Note the rate in the comment. |
| **Cheapest Entry** | tags | `free-tier`, `pay-as-you-go`, `min-commitment`, `enterprise-only`. The lowest-friction way to start paying. `enterprise-only` when no self-serve billing exists. |

## Research Sources

### Primary Sources (Preferred)

1. **Official API reference & developer docs** — authoritative for endpoints, request features (tool use, streaming, structured output), auth, and SDKs.
2. **Official pricing page** — pricing model, cache/batch discounts, free credits, minimum commitments. Snapshot the date.
3. **Official model catalog / models page** — model breadth, open-weight availability, version pinning, context windows.
4. **Official trust center / security & compliance page** — no-training defaults, zero-retention, certifications, data residency.
5. **Official changelog / release notes** — API launch dates, feature GA vs preview status, MCP / agents-API additions.
6. **Official SDK repositories (GitHub)** — confirm which languages have first-party SDKs and OpenAI-compatibility shims.

### Secondary Sources

7. **Provider status pages** — confirm existence of a public status page and SLA posture.
8. **Cloud marketplace listings** (AWS/GCP/Azure) — corroborate compliance, regions, and provisioned-throughput options for hosting platforms.
9. **Independent API comparisons & gateway docs** — for gateways, their own routing/fallback docs; cross-check normalization claims.
10. **Developer community** (provider Discords, forums, Hacker News) — real-world signal on rate limits, reliability, and undocumented behavior. Verify against primary docs.

## Assessment Guidelines

- **Category**: Assign the primary product shape. `first-party` = trains and serves its own models; `cloud-platform` = hyperscaler serving many vendors with IAM/region/compliance emphasis; `gateway` = unified API fanning out to many providers with routing/fallback; `assistant-platform` = a workspace/assistant product whose API is secondary to its app. Multi-tag only for genuine hybrids and explain in the comment.
- **Assistant platforms are a stretch fit** — dust.tt and Langdock expose agents/assistants APIs rather than raw chat/completions. Many Core Request and Multimodal attributes reflect their *underlying* model access; mark the attribute from the perspective of *what their API lets you do*, and use `null` + comment where they simply don't expose a low-level primitive.
- **Model Breadth vs Model Catalog Size**: Breadth is about *vendor diversity* (single vs many model families); Catalog Size is the *raw count*. A gateway can be `many-vendors` + `100+`; a first-party API is `single-vendor` + `1-5`.
- **Model Version Pinning**: `true` only if a specific immutable snapshot id can be called (e.g. a dated model name). An API offering only a floating alias that silently upgrades is `false`; note it.
- **Structured Output**: Pick the *strongest guarantee* the API enforces. `json-schema` (server-validated schema / "strict" structured outputs) outranks `json-mode` (valid-JSON only) outranks `grammar`/constrained decoding outranks `none` (prompt-only). If several exist, tag the strongest and note the others.
- **Tool / Function Calling** and **Parallel Tool Calls**: `true` only for shipped, documented behavior. Mark Parallel Tool Calls `null`/`false` when function calling itself is absent.
- **Prompt Caching**: `true` for any documented prompt/prefix caching, whether explicit (caller marks cache breakpoints) or automatic. Record which and any minimum-token threshold in the comment.
- **Max Context Window**: Record the *largest* window any model on the API supports, with the model named in the comment (windows vary widely per model). Higher is better.
- **Extended Reasoning**: `true` only for an API-level reasoning/thinking control or a dedicated reasoning-mode parameter — not merely "a reasoning model exists somewhere in the catalog."
- **Built-in Web Search / Code Execution**: `true` only for a *first-party* provider-hosted tool exposed via the API. A capability you must wire up yourself with your own search/exec tool does not count.
- **MCP Support**: `true` only for shipped remote/hosted MCP connector support in the API (not a client-side SDK feature of an unrelated tool). Note the exact form in the comment.
- **OpenAI-Compatible API**: `true` if a base-URL swap lets existing OpenAI SDK code run. This is the key interop signal for gateways and many open-weight hosts; verify it is documented, not merely community-reported.
- **No-Training Default**: `true` only when the provider states API data is *not* used for training by default. A default that may train with an opt-out is `false` (note the opt-out). Enterprise tiers often differ from consumer — record the API/business-tier default.
- **Zero Data Retention**: `true` if a zero/abbreviated-retention mode exists at all (often enterprise/on-request). Note the tier and any latency/feature trade-off.
- **Published SLA**: `true` only for a contractual uptime SLA (often a paid tier). A best-effort status page is not an SLA.
- **Provider Fallback / Routing**: The defining gateway capability — automatic cross-provider/model failover or policy routing. `false`/`null` for single-vendor first-party APIs.
- **Unified Billing**: `true` when one account/bill covers everything reachable. Cloud platforms and gateways usually `true`; calling five first-party APIs separately is the `false` baseline.
- **Cheapest Entry**: The lowest-friction path to first paid call. `enterprise-only` when there is no self-serve billing at all (relevant for some assistant platforms).

### When to Use `null`

- A low-level primitive an assistant platform simply doesn't expose (mark the attribute `null` + comment rather than forcing a `false` that reads as "the models can't do this").
- Rate-limit or SLA specifics that are enterprise-negotiated and unpublished — `null` + comment.
- Context windows or catalog sizes that change frequently and can't be pinned at check time — record best-known value with a dated comment, or `null` if genuinely unclear.
- Any capability where docs are ambiguous and no primary source confirms it — prefer `null` over a guessed `true`.
- Compliance certifications you cannot confirm from the trust center — omit rather than assume.

## Candidates

- [x] **Anthropic Claude API** — first-party API for Claude models; reference for tool use, prompt caching, MCP, extended thinking
- [ ] **OpenAI API** — the incumbent first-party API; de-facto compatibility standard (Chat Completions / Responses)
- [ ] **Google Gemini API** — Google's first-party developer API (AI Studio) for Gemini models
- [ ] **Mistral AI API** — first-party API for Mistral's open-weight and proprietary models
- [ ] **Amazon Bedrock** — AWS multi-vendor model-hosting platform with IAM, provisioned throughput, and broad compliance
- [ ] **Google Vertex AI** — Google Cloud's enterprise model platform (Gemini + third-party model garden)
- [ ] **Azure AI Foundry** — Microsoft's enterprise model platform (Azure OpenAI + model catalog)
- [ ] **OpenRouter** — routing gateway with one API over hundreds of models, unified billing, and fallback
- [ ] **Together AI** — gateway/host for open-weight models with an OpenAI-compatible API and fine-tuning
- [ ] **Groq** — low-latency inference gateway (LPU) serving open-weight models via an OpenAI-compatible API
- [ ] **dust.tt** — enterprise assistant platform exposing an API to build on its agents and connected data
- [ ] **Langdock** — enterprise AI workspace/assistant platform with an API over multiple underlying models

## Notes for Researchers

1. **This space moves weekly.** Snapshot the check date in the `comment` for any capability, model-catalog, context-window, or pricing value — a preview feature today may be GA (or renamed) next quarter.
2. **Compare the API, not the model.** Record what the *endpoint* lets you do (tool use, caching, structured output), not how "smart" a model is. Benchmark scores are out of scope.
3. **Largest-available, not per-model.** For catalog-wide attributes (context window, open-weight, multimodal), record the *best case across models on the API* and name the enabling model in the comment.
4. **Assistant platforms need care.** dust.tt and Langdock expose agent/assistant APIs, not raw inference primitives. Judge each attribute by what their API actually lets a developer do, and use `null` + comment where a low-level feature simply isn't surfaced.
5. **Verify OpenAI-compatibility and MCP claims against docs.** Both are heavily marketed; confirm a documented endpoint/connector, not a community forum mention.
6. **Governance defaults differ by tier.** No-training and zero-retention behavior often differs between consumer, developer, and enterprise tiers — record the tier your value applies to.
7. **Cite primary sources with URLs.** Prefer the provider's own API reference, pricing, and trust center; use independent comparisons only to corroborate, and flag conflicts with `null`.

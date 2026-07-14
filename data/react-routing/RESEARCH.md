# React Routing Research Guide

## Overview

This comparison helps a React developer choose how to handle routing — from drop-in, framework-agnostic routing libraries you add to an existing app, to full meta-frameworks whose router is the backbone of the whole application. Both classes are treated as peers so readers can weigh a lightweight standalone router against an all-in-one framework on the same axes.

Users should be able to:
- Understand each option's routing paradigm (component-based, config-object, file-based, hook-based)
- Compare type safety of paths, params, and search params
- Evaluate data-loading, navigation, and rendering capabilities (loaders, prefetch, SSR, RSC, streaming)
- Weigh bundle size and dependency footprint for standalone routers
- Judge maturity, maintenance, tooling, and documentation quality
- Decide whether a routing library or a framework fits their constraints

## Scope

**Included:**
- Standalone, add-to-any-app React routing libraries (React Router, TanStack Router, Wouter, Type-Route, Router5)
- Meta-frameworks whose routing layer is a primary feature, treated as peer candidates (Next.js App Router, TanStack Start, Vike, One, Waku)
- Both component-driven and file-based/config-driven approaches
- Both client-only and SSR/RSC-capable options

**Excluded:**
- Deprecated or unmaintained routers as researched rows — named in Notes instead (Reach Router, React Location, Navi, hookrouter, react-router v3-era APIs)
- Remix v2 as a separate candidate — its framework features have folded into React Router v7; noted, not a separate row
- Non-React or multi-framework routers where React is not first-class (Astro's core router, SvelteKit, Vue Router, Solid Router)
- State-management or data-fetching libraries that are not routers (React Query, Redux, Zustand)
- Pure CSS/animation "page transition" libraries with no routing responsibility
- Build tools without a routing layer (Vite, Rspack) — unless they ship a first-class router

## Attribute Groups

### 1. General Info
| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Name** | text | Official name |
| **Description** | text | One-line value proposition |
| **Website** | link | Official docs or homepage |
| **Repository** | link | GitHub/GitLab URL |
| **License** | text | SPDX identifier (MIT, Apache-2.0, etc.) |
| **Category** | tags | What kind of thing it is. tags: standalone-router, meta-framework |
| **Active Maintenance** | boolean | Commits/releases within the last ~6 months |
| **Initial Release** | date (year) | Year of first public release |
| **Latest Release** | date (full) | Date of most recent stable release |
| **GitHub Stars** | integer (ascending) | Current star count; higher is more popular |
| **npm Weekly Downloads** | integer (ascending) | Weekly downloads of the primary package |

### 2. Routing Model
| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Routing Paradigm** | tags | How routes are declared. tags: component-based, config-object, file-based, hook-based. Multiple allowed (e.g. React Router supports both component and object routes) |
| **Nested / Layout Routes** | boolean | Supports nested routes with shared parent layouts |
| **Dynamic Params** | boolean | Path params like `/users/:id` |
| **Optional / Catch-All Params** | boolean | Optional segments and splat/wildcard routes |
| **Search Params API** | boolean | First-class API for reading/writing query string state (beyond raw `URLSearchParams`) |
| **Programmatic Navigation** | boolean | Imperative navigation via a hook or function (not just `<Link>`) |
| **Route Guards / Middleware** | boolean | Built-in per-route guards, middleware, or `beforeLoad`-style hooks |

### 3. Type Safety
| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Written in TypeScript** | boolean | Ships first-class type definitions authored in TS |
| **Type-Safe Paths / Links** | boolean | `<Link>`/navigate calls are checked against known routes |
| **Type-Safe Params** | boolean | Path params inferred with correct types at usage sites |
| **Type-Safe Search Params** | boolean | Query/search params typed and validated (often via a schema) |
| **Codegen Required** | boolean | Requires a generation/build step to produce route types (vs. pure inference); note the step in a comment |
| **Type Safety Rating** | rating (1-5, ascending) | Overall end-to-end type safety; see Assessment Guidelines |

### 4. Data & Navigation
| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Route Data Loaders** | boolean | Route-level data loading before render (loader / `useLoaderData`-style) |
| **Actions / Mutations** | boolean | Built-in write/mutation primitive tied to routes (actions, form handling) |
| **Prefetching** | boolean | Prefetch route code and/or data on hover/intent |
| **Pending / Transition UI** | boolean | Built-in pending states or React transition integration during navigation |
| **Scroll Restoration** | boolean | Restores scroll position across navigations |
| **Per-Route Code Splitting** | boolean | Lazy-load route components/bundles per route |
| **Per-Route Error Handling** | boolean | Route-scoped error boundaries / error elements |

### 5. Rendering & SSR
| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **SSR Support** | boolean | Server-side rendering supported (built-in or documented). For standalone routers, note whether it's DIY vs. turnkey in a comment |
| **Streaming SSR** | boolean | Supports streaming/suspenseful SSR |
| **React Server Components** | boolean | First-class RSC support |
| **Static Site Generation** | boolean | Can pre-render routes to static HTML |
| **Client-Only Usable** | boolean | Can run as a pure CSR SPA router with no server |
| **Framework-Bound** | boolean | Requires its own build/framework toolchain rather than dropping into any React app. true for meta-frameworks |

### 6. Performance
| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Bundle Size** | filesize (descending) | Router core, minified + gzipped (bundlephobia). null for meta-frameworks where a single "router bundle" figure isn't meaningful — explain in comment |
| **Zero Runtime Dependencies** | boolean | Ships with no (or effectively no) third-party runtime deps |
| **Tree Shakeable** | boolean | Supports dead-code elimination |

### 7. Ecosystem & DX
| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Documentation Quality** | rating (1-5, ascending) | See Assessment Guidelines |
| **Official Devtools** | boolean | Dedicated devtools/inspector for routes and navigation |
| **Data-Fetching Integration** | tags | Documented/first-class integrations. tags: built-in, react-query, swr, trpc, rsc, none |
| **Predecessor / Lineage** | text | Where it came from (e.g. "successor to React Location", "Remix framework features merged in"); use null if none |

## Research Sources

### Primary Sources (Preferred)
1. **Official Documentation** — authoritative for paradigm, features, SSR/RSC, type safety
2. **GitHub Repository** — release dates, stars, maintenance activity, TypeScript status, roadmap
3. **npm Registry** — weekly downloads, dependency footprint, package metadata
4. **bundlephobia.com** — bundle size for standalone router packages

### Secondary Sources
5. **Official Blog / Changelog** — release announcements, migration guides, deprecations
6. **Migration & Comparison guides in official docs** — how a library positions itself vs. others
7. **Framework RFCs / discussions** — for RSC, streaming, and roadmap claims

### Tertiary Sources
8. **Third-party comparison articles** — cross-reference only; verify independently
9. **GitHub Issues / Discussions** — gauge maintenance responsiveness and known limitations
10. **Reddit / X / dev.to** — community sentiment and real-world usage

## Assessment Guidelines

- **Category**: `standalone-router` = you add it to an existing React app and control the rest of the stack; `meta-framework` = it owns the build/server and routing is one part. A candidate gets exactly one tag.
- **Framework-Bound**: `true` when the router cannot be used without its own toolchain/framework (Next.js, TanStack Start, Vike, One, Waku). `false` for drop-in routers even if they *offer* an optional framework mode (e.g. React Router can run library-only).
- **Type Safety Rating**:
  | Rating | Criteria |
  |--------|----------|
  | 1 | No meaningful route typing; params are `string` with no inference |
  | 2 | TS types exist but paths/params are not checked against routes |
  | 3 | Typed params or links, but gaps (e.g. search params untyped) |
  | 4 | Type-safe paths, params, and search params with minor friction |
  | 5 | End-to-end inferred type safety across paths, params, search, and loaders |
- **Documentation Quality Rating**:
  | Rating | Criteria |
  |--------|----------|
  | 1 | Minimal README only |
  | 2 | Basic API list, incomplete examples |
  | 3 | Adequate docs with examples, some gaps |
  | 4 | Comprehensive API reference, guides, examples |
  | 5 | Excellent docs: interactive examples, guides, migration paths, recipes |
- **Bundle Size**: use bundlephobia for standalone routers (min+gzip of the main package). For meta-frameworks, set `null` and explain in a comment that framework runtime size isn't comparable to a router bundle.
- **SSR / RSC for standalone routers**: distinguish "possible but DIY" from "turnkey". If SSR requires the user to wire up their own server, mark the boolean per whether it's genuinely supported and clarify the effort in a comment.
- **When to use Null**:
  - Attribute genuinely doesn't apply (e.g. Bundle Size for a framework)
  - Feature cannot be verified from docs or source
  - Prefer `null` with a comment over guessing

## Candidates

- [x] React Router — the de-facto React router; v7 unifies the library and Remix's framework features
- [x] TanStack Router — type-safe-first router with typed search params and built-in data loading; basis for TanStack Start
- [x] Wouter — minimalist ~2KB hook-based router for small SPAs
- [ ] Type-Route — type-safe routing library focused on inference, framework-agnostic core with React bindings
- [ ] Router5 — framework-agnostic, state-machine-style router with a React binding
- [ ] Next.js (App Router) — the dominant React meta-framework; file-based App Router with RSC and streaming
- [ ] TanStack Start — full-stack React framework built on TanStack Router, SSR + streaming + server functions
- [ ] Vike — flexible, framework-agnostic SSR/SSG meta-framework (formerly vite-plugin-ssr) with React support
- [ ] One — React (and React Native) meta-framework from the Tamagui team, file-based routing across web and native
- [ ] Waku — minimal React Server Components framework with file-based routing

## Notes for Researchers

1. **Peers, not apples-to-apples** — standalone routers and meta-frameworks share the attribute set but will legitimately differ on applicability. Use `null` + comment where an attribute doesn't fit the class rather than forcing a value.
2. **React Router lineage** — v7 merged Remix's framework capabilities. Record React Router at its current major version; mention Remix's status in the Predecessor/Lineage field and comments rather than as a separate row.
3. **Deprecated routers** — Reach Router (merged into React Router), React Location (became TanStack Router), Navi, and hookrouter are out of scope as rows. Mention lineage where a current candidate succeeded one of them.
4. **Type safety is the differentiator** — be precise. Distinguish "written in TypeScript" from "type-safe routes". Note whether type safety needs codegen (TanStack Router historically) vs. pure inference, and capture that nuance in comments.
5. **Version sensitivity** — routing paradigms shift across majors (React Router v5 vs v6 vs v7; Next.js Pages vs App Router). Always state the version researched in source comments and evaluate the current stable major.
6. **SSR/RSC is fast-moving** — RSC and streaming support are evolving. Verify against the latest stable release and cite the doc/RFC you relied on.
7. **Stars and downloads change** — note the research date in source comments for GitHub stars and npm downloads.
8. **Cite everything** — record source URLs per value; when uncertain, use `null` with a comment explaining what you could and couldn't confirm.

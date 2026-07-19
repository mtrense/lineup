# Rust SPA Frameworks Research Guide

## Overview

Compare frameworks and libraries for building Single Page Applications (and, increasingly, full-stack web apps) in Rust. Unlike the language-agnostic `spa-web-frameworks` comparison — which lists Rust options as single rows alongside JS frameworks — this comparison stays inside the Rust ecosystem and goes deep on the concerns that actually decide a Rust web project: the WASM toolchain, reactivity model, rendering/hydration story, the full-stack server-function surface, JS interop ergonomics, WASM bundle size, and the maturity of the surrounding Rust crate ecosystem. It is a fully standalone guide: general-information attributes (license, stars, maturity) are duplicated here so the comparison reads completely on its own without cross-referencing.

Users should be able to:
- Choose a Rust web framework by reactivity model (signals vs virtual-DOM vs Elm-style vs compiler-driven)
- Understand the client-side SPA story *and* the full-stack story (SSR, SSG, hydration, server functions, isomorphic routing) as first-class dimensions
- Compare the WASM build toolchain, output bundle size, and JS interop ergonomics
- Assess routing, state management, styling, and forms support
- Gauge maturity, ecosystem breadth, corporate backing, and community health
- Weigh trade-offs between mature-but-heavier options and lean/experimental ones

## Scope

**Included:**
- Rust frameworks/libraries whose primary target is building interactive web UIs that run in the browser (compiled to WebAssembly, or to JS where applicable)
- Both minimal client-side SPA libraries and full-stack Rust web frameworks that also do SSR/SSG and server functions, provided a genuine client-side SPA/CSR mode exists
- All reactivity paradigms: fine-grained signals, virtual-DOM diffing, Elm/message-passing, and compiler-driven
- Frameworks backed by a company, a foundation, or a solo/community maintainer
- Notable emerging or niche entries alongside the established leaders

**Excluded:**
- Non-Rust web frameworks (React, Vue, Svelte, Blazor, etc.) — those live in `spa-web-frameworks`
- Rust GUI toolkits targeting desktop/mobile whose web support is incidental (iced, Slint, egui, GPUI) — those live in `rust-gui`. Dioxus is the one deliberate cross-listing because its web/SPA story is first-class and substantial.
- Pure server-side HTML templating engines with no client-side reactive runtime (Maud, Askama, Tera, Sailfish) — they render markup but are not SPA frameworks
- Server-side web frameworks without a browser UI layer (Axum, Actix Web, Rocket, Warp) — they may back a Rust SPA but are not themselves SPA frameworks
- Low-level WASM glue with no component/view model (wasm-bindgen, web-sys, js-sys, gloo) — these are building blocks, not frameworks
- HTMX-style "sprinkle" approaches where Rust only serves fragments and the interactivity is HTMX/JS, not a Rust runtime
- Clearly archived/abandoned projects with no viable path (Draco, Ruukh, Willow) — mention in "Not Including" rather than as candidates

## Attribute Groups

### 1. General Information

| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Description** | text | One-line value proposition of the framework. |
| **License** | tags | From Cargo.toml or LICENSE. Common: MIT, Apache-2.0, MPL-2.0. Most Rust web frameworks are MIT/Apache-2.0 dual. Note any deviation. |
| **Repository** | link | Primary source repository (GitHub/GitLab). |
| **Crates.io** | link | Top-level framework crate page on crates.io (not a sub-crate). |
| **Documentation** | link | Primary docs site (book, docs.rs, or custom guide). |
| **First Release** | date (year) | Year of first public release / first crates.io publish. |
| **Latest Stable Version** | text | Current stable version from crates.io. |
| **Latest Release** | date (full) | Date of the most recent crates.io release. |
| **Maintenance Status** | tags | `actively-maintained`, `passively-maintained`, `seeking-maintainer`, `archived`, `abandoned`. Based on commits/releases in the last 6 months. |
| **Maturity** | tags | `experimental`, `beta`, `stable`, `mature`. Based on API stability, production usage, and 1.0 status. |
| **Corporate/Foundation Backing** | text | Company or org funding development (e.g., a sponsoring company, a foundation) or "Community" if none. |

### 2. Architecture & Reactivity

| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Reactivity Model** | tags | `signals` (fine-grained reactive primitives), `virtual-dom` (diff & patch), `elm` (message-passing / unidirectional), `compiler-driven` (reactivity resolved at build time). Select all that genuinely apply. |
| **Component Model** | tags | `function-components` (fn + macro), `struct-components` (impl a trait), `hybrid`. |
| **View Authoring** | tags | `rsx-macro` (JSX-like Rust macro), `html-macro` (html! style), `builder-api` (imperative element builders), `dsl` (custom markup). Select all supported. |
| **Fine-Grained Updates** | boolean | Updates target the exact DOM nodes affected (no full-subtree re-render / diff). True for signal-based frameworks. |
| **Uses Virtual DOM** | boolean | Maintains a virtual DOM and diffs it against the previous render. |
| **Async/Await in Components** | boolean | Components/resources can `.await` (async data loading, suspense-style) natively. |
| **Global State Solution** | tags | `context` (provide/inject), `signals` (shared reactive stores), `external-crate`, `none-built-in`. |

### 3. WASM & Build Toolchain

| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Compiles To** | tags | `wasm`, `js`, `both`. Most compile to WASM via wasm-bindgen; a few (e.g. via a JS backend) differ. |
| **Primary Build Tool** | tags | `trunk`, `wasm-pack`, `dioxus-cli`, `cargo-leptos`, `custom-cli`, `wasm-bindgen-cli`. The officially recommended toolchain. |
| **Official CLI** | boolean | First-party scaffolding/build/dev-server CLI (e.g. a dedicated `x new`/`x serve`). |
| **Dev Server / HMR** | tags | `hot-reload` (view/RSX hot reload without full recompile), `live-reload` (auto rebuild + browser refresh), `manual`. |
| **Minimal WASM Bundle Size** | filesize (descending) | Release build (opt-level=z or 's', wasm-opt applied) of a minimal "hello world" app, `.wasm` gzipped. Smaller is better. Record measurement date + version in a comment. |
| **JS Interop** | tags | `wasm-bindgen` (standard), `web-sys`, `custom-bindings`, `js-sys`. How the framework talks to browser/JS APIs. Select the mechanisms it exposes to users. |
| **JS Interop Ergonomics** | rating (1-5, ascending) | 5 = calling JS / using web APIs is smooth and well-documented; 3 = works via wasm-bindgen with some boilerplate; 1 = awkward, poorly documented. |
| **no_std / Minimal Runtime** | boolean | Can build without the full std or with a deliberately minimal runtime footprint. Rare; usually false. |

### 4. Rendering & Full-Stack

| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Client-Side Rendering (SPA)** | boolean | Supports a pure client-rendered SPA mode (the baseline requirement for inclusion). |
| **Server-Side Rendering** | boolean | Can render HTML on the server for first paint. |
| **Static Site Generation** | boolean | Can pre-render routes to static HTML at build time. |
| **Hydration** | tags | `full` (rehydrate whole tree), `progressive` (stream + hydrate as it arrives), `islands` (hydrate only interactive islands), `none`. Select the modes supported. |
| **Server Functions** | boolean | Provides an isomorphic "server function" mechanism (call server logic directly from client code, wired up automatically). |
| **Streaming SSR** | boolean | Supports streaming server-rendered HTML (out-of-order or in-order). |
| **Backend Integration** | tags | `axum`, `actix-web`, `warp`, `viz`, `standalone` (own server), `any` (framework-agnostic). Which server frameworks it integrates with for full-stack mode. |
| **Isomorphic Routing** | boolean | The same router runs on server and client (routes resolve identically both sides). |

### 5. Routing & Navigation

| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Official Router** | boolean | First-party routing solution shipped or maintained by the core team. |
| **Router Name** | text | Name of the router crate/module (e.g. an official `*-router`) or null. |
| **Nested Routes** | boolean | Supports nested/child route layouts. |
| **Dynamic Route Params** | boolean | Parameterized routes (e.g. `/user/:id`). |
| **Typed Routes** | boolean | Routes are type-checked (enum/derive-based) rather than string-matched. |
| **Route Guards** | boolean | Navigation guards / redirect hooks before entering a route. |
| **Lazy / Code-Split Routes** | boolean | Routes can be code-split and loaded on demand. |

### 6. UI & Styling

| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Styling Approach** | tags | `plain-css`, `scoped-css` (component-scoped styles), `css-in-rust` (styles authored in Rust), `tailwind-friendly`, `inline-style`, `external-only`. Select all first-class approaches. |
| **Scoped Styles** | boolean | Built-in component-scoped styling (styles don't leak globally). |
| **Component Library Ecosystem** | rating (1-5, ascending) | Availability of ready-made UI component crates: 5 = several mature libraries; 3 = a few community kits; 1 = essentially none. |
| **Forms & Inputs** | tags | `two-way-binding`, `controlled`, `uncontrolled`, `form-helpers`. How form state is handled. |
| **SVG / Canvas Support** | boolean | First-class support for authoring SVG in the view macro / interop for canvas. |
| **Suspense / Loading UI** | boolean | Declarative loading boundaries for async resources. |
| **Error Boundaries** | boolean | Catch and render fallback UI for errors in the component tree. |

### 7. Developer Experience

| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Documentation Quality** | rating (1-5, ascending) | 5 = book + tutorials + API docs + examples; 3 = adequate API docs with some examples; 1 = minimal/outdated. |
| **API Ergonomics** | rating (1-5, ascending) | 5 = idiomatic Rust, minimal boilerplate, good error messages; 3 = functional but verbose; 1 = heavy boilerplate or lifetime friction. |
| **Compile Times** | tags | `fast`, `moderate`, `slow`. Relative to peer Rust web frameworks for a small app; note macro-heavy frameworks tend slower. |
| **Examples Count** | tags | `extensive` (>20), `good` (10-20), `limited` (3-10), `minimal` (<3). Official repo examples. |
| **Interactive Playground** | link | URL to an online playground/REPL/example gallery, or null. |
| **Browser DevTools** | boolean | Dedicated devtools/inspector (component tree, signals) beyond generic browser tools. |
| **Testing Support** | tags | `wasm-bindgen-test`, `component-testing`, `e2e-friendly`, `none-official`. What test story the framework documents/supports. |

### 8. Ecosystem & Community

| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **GitHub Stars** | integer (ascending) | Snapshot star count — will go stale; note the date. |
| **Crates.io Downloads** | integer (ascending) | All-time downloads of the top-level crate. |
| **Contributors** | integer (ascending) | Approximate GitHub contributor count. |
| **Community Size** | tags | `large` (active Discord/Matrix >2k, many contributors), `medium` (dedicated chat, regular contributions), `small` (few active contributors), `solo` (single maintainer). |
| **Ecosystem Crates** | tags | `rich` (routers, component kits, integrations widely available), `growing`, `minimal`, `none`. |
| **Notable Production Users** | text | Shipping apps/companies known to use it. Null if none widely documented. Avoid listing tutorials/demos. |
| **Meta-Framework / Full-Stack Kit** | text | Name of the associated full-stack layer (e.g. a fullstack starter or the framework's own full-stack mode) or null. |

## Research Sources

### Primary Sources (Preferred)

1. **Official Repository** — README, examples folder, CHANGELOG, architecture notes.
2. **Official Book / Guide** — The framework's own documentation site (guides, tutorials, feature docs).
3. **Crates.io** — Versions, all-time downloads, feature flags, dependency list.
4. **docs.rs** — API surface, module structure, feature-flag docs.
5. **Are We Web Yet?** (https://www.arewewebyet.org) — Curated index of the Rust web ecosystem, including client-side/WASM frameworks.

### Secondary Sources

6. **lib.rs** — Alternative crate metadata and ranking view.
7. **js-framework-benchmark** (https://krausest.github.io/js-framework-benchmark) — Includes several Rust/WASM frameworks; useful for relative performance and bundle context.
8. **"This Week in Rust"** — Release announcements, ecosystem updates, blog roundups.
9. **Reddit r/rust** — Release threads, comparison discussions, real-world reports.
10. **GitHub Discussions / Issues** — Roadmaps, maintenance responsiveness, real usage reports.

### Tertiary / Approach Carefully

11. **Blog posts and comparison articles** — Useful for context; always check the publication date (anything older than ~12–18 months is likely stale in this fast-moving space).
12. **Benchmarks in project READMEs** — Often cherry-picked; corroborate with js-framework-benchmark or independent runs.
13. **Bundle-size claims without methodology** — Treat as marketing until reproduced with a documented build profile.

## Assessment Guidelines

- **Reactivity Model** — Multiple tags can apply, but pick the *primary* mechanism carefully. `signals` = fine-grained reactive primitives that update exact nodes (e.g. Leptos, Sycamore). `virtual-dom` = builds a virtual tree and diffs it (e.g. Yew, Dioxus). `elm` = a `Model`/`Msg`/`update` loop (e.g. Seed, Sauron). `compiler-driven` = reactivity resolved at compile time. If a framework offers more than one mode, tag all and clarify the default in a comment.
- **Fine-Grained Updates vs Virtual DOM** — These are usually mutually exclusive for the default render path. A signal-based framework should be `Fine-Grained Updates: true` / `Uses Virtual DOM: false`; a diffing framework is the inverse. Note any hybrid in a comment.
- **Minimal WASM Bundle Size** — Build a minimal one-component "hello world" in `--release` with size optimizations (`opt-level = "z"` or `"s"`, LTO, `wasm-opt`), measure the gzipped `.wasm`. Always record the framework version, build profile, and measurement date in a comment — these numbers drift and are only comparable under a consistent method. Prefer `null` + a comment over an unmethodical number.
- **Client-Side Rendering (SPA)** — Must be `true` for inclusion; it is the defining capability. If a project is SSR/server-fragment-only with no genuine client SPA mode, it is out of scope.
- **Server Functions** — Only `true` when the framework provides an *integrated, isomorphic* mechanism (annotate a function, call it from the client, wiring generated). Manually writing a REST endpoint + fetch does not count.
- **Hydration** — Tag the modes actually supported and tested by maintainers. `islands` specifically means selective hydration of interactive regions with otherwise-static HTML. Don't infer islands from generic "partial hydration" marketing without confirmation.
- **Typed Routes** — `true` only when routes are checked by the type system (derive/enum-based), such that an invalid route is a compile error. String-pattern routers are `false`.
- **Official Router** — `true` only if maintained by the core team or shipped in-tree. A widely-used third-party router is `false` with the name noted in a comment.
- **API Ergonomics / Documentation Quality ratings** — Mirror the anchors used across this project: 5 = book + tutorials + rich examples / idiomatic minimal-boilerplate API; 3 = adequate; 1 = minimal or awkward. Justify 5s and 1s in a comment.
- **Component Library Ecosystem rating** — 5 = multiple maintained UI kits (e.g. a Tailwind/DaisyUI-style port, headless component crates); 3 = one or two community kits; 1 = users build everything themselves.
- **Maturity vs Maintenance** — Keep these distinct. A framework can be actively maintained yet still `experimental` (pre-1.0, unstable API). Base `Maturity` on API stability and production usage, not commit frequency.
- **Corporate/Foundation Backing** — Name the specific sponsor when there is one; otherwise "Community". Solo-maintainer projects are "Community" with the situation noted in a comment where relevant.

### When to Use `null`

- Bundle-size or performance numbers without a reliable, documented measurement
- Capabilities behind unstable/experimental feature flags that may be removed
- Production users claimed only via marketing or inferred from a demo
- Platform/rendering features you cannot verify as officially supported (don't guess)
- Conflicting information across sources (prefer `null` + a comment explaining the conflict)

## Candidates

- [x] Leptos — Fine-grained signals, full-stack with server functions and islands, one of the most active Rust web frameworks
- [x] Yew — Mature, React-like virtual-DOM framework with the largest ecosystem and community
- [x] Dioxus — Cross-platform (web/desktop/mobile) RSX framework with a strong web/SPA and fullstack story; deliberate cross-listing with `rust-gui`
- [x] Sycamore — Fine-grained reactive library inspired by SolidJS, lean and signal-based
- [x] Percy — Isomorphic web apps with a virtual DOM (`html!` macro) and SSR, an early entrant
- [x] Sauron — Elm-inspired, minimal virtual-DOM library with SSR support
- [x] Seed — Elm-architecture framework, historically significant; verify current maintenance status
- [x] MoonZoon — Opinionated full-stack framework (Moon backend + Zoon frontend), no-HTML/CSS-required philosophy
- [x] Silkenweb — Fine-grained signals built on futures-signals, no virtual DOM
- [x] Kobold — Static-analysis-driven library that minimizes diffing for fast updates
- [ ] Mogwai — Minimal, channel/stream-based view library with no macros

## Notes for Researchers

1. **Verify maintenance before trusting docs** — This space moves fast and some once-prominent frameworks (e.g. Seed) have slowed markedly. Check the last commit, last release, and open-issue responsiveness before recording `Maturity`/`Maintenance Status`, and note the date.
2. **Cite sources with URLs** — Every non-obvious value should carry a `source` (official repo, book, crates.io, or a dated benchmark). Prefer primary sources.
3. **Record versions and dates for time-sensitive facts** — Stars, downloads, bundle sizes, and latest versions all drift. Note the framework version and the date of measurement in a comment.
4. **Bundle size needs a consistent method** — Only compare WASM sizes measured with the same optimization profile (opt-level, LTO, wasm-opt) and both gzipped. State the method in the comment or use `null`.
5. **Signals vs VDOM is the key axis** — The single most decision-relevant attribute for most users is the reactivity model. Get it precisely right and explain hybrids.
6. **Full-stack blurs the boundary** — Leptos and Dioxus (and MoonZoon) are full-stack; capture SSR/hydration/server-function attributes even though the comparison is SPA-titled, but confirm a real client-side SPA mode exists.
7. **Distinguish official vs community add-ons** — Routers, state stores, and component kits are sometimes first-party, sometimes community. Mark `Official Router` accordingly and note third-party options in comments.
8. **Dioxus spans comparisons** — Here, evaluate Dioxus in its **web/SPA and fullstack** context (`dioxus-web`, `dioxus-fullstack`). Its desktop/mobile story lives in `rust-gui`; cross-link in comments where relevant.
9. **Admit uncertainty** — When research is thin or ambiguous for an attribute, use `null` with a comment rather than guessing. Under-reporting beats a confidently wrong value.
10. **Don't conflate templating with SPA** — Server-side HTML template engines (Maud, Askama) and HTMX-style fragment servers are explicitly out of scope; they render markup but provide no client-side reactive runtime.

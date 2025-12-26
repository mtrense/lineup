# SPA Web Frameworks Research Guide

## Overview

This comparison helps developers choose a frontend framework for building Single Page Applications (SPAs). It covers the major JavaScript/TypeScript frameworks that handle client-side routing, state management, and reactive UI rendering.

Users should be able to:
- Compare the core philosophies and trade-offs of each framework
- Evaluate learning curve, ecosystem maturity, and job market demand
- Assess performance characteristics and bundle sizes
- Understand the meta-framework landscape (SSR, SSG, file-based routing)
- Make informed decisions based on project requirements and team expertise

## Scope

**Included:**
- JavaScript/TypeScript frameworks designed for building SPAs
- Frameworks with reactive UI rendering and component models
- Both established frameworks (React, Vue, Angular) and modern alternatives (Svelte, Solid, Qwik)
- Frameworks that can operate as pure client-side SPAs (even if they also support SSR)
- WebAssembly (WASM) frameworks compiled from Rust, Go, C#, and other languages
- Frameworks that compile to WASM for performance-critical applications

**Excluded:**
- Meta-frameworks (Next.js, Nuxt, SvelteKit, Astro) - these are separate comparison types
- Static site generators without SPA capabilities
- Backend frameworks (Express, Fastify, Nest.js)
- Mobile-only frameworks (React Native, NativeScript, Flutter)
- jQuery and legacy DOM manipulation libraries
- Web component libraries that aren't full application frameworks
- Micro-frontend frameworks (single-spa, Module Federation)

## Attribute Groups

### 1. General Info
| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Name** | text | Official name of the framework |
| **Description** | text | One-line description of the framework's main value proposition |
| **Website** | link | Official website or documentation site |
| **Repository** | link | GitHub repository URL |
| **License** | text | SPDX license identifier (MIT, Apache-2.0, etc.) |
| **Initial Release** | date (year) | Year of first public release |
| **Latest Release** | date (full) | Date of most recent stable release |
| **Current Version** | text | Latest stable version number |
| **GitHub Stars** | integer (ascending) | Current star count |
| **Active Maintenance** | boolean | Regular commits/releases in last 6 months |

### 2. Philosophy & Design
| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Reactivity Model** | tags | How state changes propagate: virtual-dom, fine-grained, signals, dirty-checking, compiler-based |
| **Component Model** | tags | How components are defined: class, function, sfc (single-file), template-based |
| **Rendering Paradigm** | tags | Rendering approach: declarative, imperative, hybrid |
| **State Management** | tags | Built-in state patterns: built-in, external-required, optional-external |
| **Opinionatedness** | tags | How prescriptive: opinionated (Angular), flexible (React), balanced (Vue) |
| **Backward Compatibility** | boolean | Strong commitment to avoiding breaking changes |

### 3. Language & Syntax
| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Primary Language** | tags | Main language: javascript, typescript, rust, go, csharp, dart, kotlin, elm, purescript |
| **Compiles To** | tags | Target output: javascript, wasm, both |
| **TypeScript Support** | tags | TS integration: native (written in TS), first-class (full support), supported (works but not primary), limited, n/a (non-JS language) |
| **Template Syntax** | tags | How views are written: jsx, tsx, html-template, sfc, tagged-template, macro-based, elm-like, dsl |
| **Styling Approach** | tags | Built-in styling patterns: css-modules, scoped-css, css-in-js, inline-styles, external-only |
| **Build Required** | boolean | Whether a build step is required (vs CDN usage) |
| **WASM Interop** | tags | JavaScript interop approach: full (seamless), bridge (explicit calls), limited, n/a |

### 4. Core Features
| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Reactive Primitives** | boolean | Built-in reactive state primitives (signals, refs, observables) |
| **Computed Values** | boolean | Derived state that auto-updates |
| **Two-Way Binding** | boolean | Built-in two-way data binding for forms |
| **Event Handling** | boolean | Declarative event binding in templates |
| **Conditional Rendering** | boolean | Built-in conditional display (v-if, {#if}, ternary) |
| **List Rendering** | boolean | Built-in iteration/mapping for lists |
| **Component Slots** | boolean | Content projection / children / slots |
| **Teleport/Portal** | boolean | Render content outside component tree |
| **Suspense** | boolean | Async loading boundaries |
| **Error Boundaries** | boolean | Catch and handle errors in component tree |
| **Context/Provide-Inject** | boolean | Dependency injection without prop drilling |
| **Refs/Direct DOM Access** | boolean | Escape hatch for direct DOM manipulation |

### 5. Routing & Navigation
| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Official Router** | boolean | First-party routing solution |
| **Router Name** | text | Name of official router (e.g., "Vue Router", "React Router") or null |
| **Nested Routes** | boolean | Support for nested/child routes |
| **Dynamic Routes** | boolean | Parameterized routes (/user/:id) |
| **Route Guards** | boolean | Navigation guards/hooks (beforeEnter, etc.) |
| **Lazy Loading Routes** | boolean | Code-split routes loaded on demand |
| **Scroll Restoration** | boolean | Maintain scroll position on navigation |

### 6. State Management
| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Built-in State** | boolean | Core reactivity for local component state |
| **Built-in Global State** | boolean | Official solution for app-wide state (not third-party) |
| **Global State Library** | text | Name of official/recommended library (Pinia, Redux Toolkit, NgRx) or null |
| **Devtools State Inspection** | boolean | Browser devtools can inspect state |
| **State Persistence** | boolean | Built-in or official persistence layer |
| **Time-Travel Debugging** | boolean | Devtools support for undo/redo state changes |

### 7. Developer Experience
| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Official CLI** | boolean | First-party project scaffolding tool |
| **Hot Module Replacement** | boolean | Live code updates without full reload |
| **Browser Devtools** | boolean | Official browser extension for debugging |
| **VS Code Extension** | boolean | Official or widely-used VS Code extension |
| **Error Messages** | rating (1-5, ascending) | Quality of error messages: 1=cryptic, 3=helpful, 5=excellent with suggestions |
| **Documentation Quality** | rating (1-5, ascending) | 1=minimal, 2=basic, 3=adequate, 4=good, 5=excellent |
| **Interactive Tutorial** | link | URL to official interactive learning experience, or null if none |
| **Playground** | link | URL to online REPL/playground for quick experiments, or null if none |

### 8. Performance
| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Bundle Size (Core)** | filesize (descending) | Core runtime bundle, minified + gzipped |
| **Bundle Size (Full)** | filesize (descending) | Full framework with common addons, minified + gzipped |
| **Virtual DOM** | boolean | Uses virtual DOM diffing |
| **Compile-Time Optimization** | boolean | Compiler performs static analysis optimizations |
| **Tree Shaking** | boolean | Unused code is eliminated |
| **Code Splitting** | boolean | Automatic or easy code splitting |
| **Lazy Components** | boolean | Components can be loaded on demand |
| **SSR Capable** | boolean | Can render on server (hydration) |
| **Streaming SSR** | boolean | Supports streaming server-side rendering |
| **Partial Hydration** | boolean | Can hydrate only interactive parts (islands) |
| **JS Framework Benchmark** | decimal (descending) | Geometric mean from js-framework-benchmark (lower is better) |

### 9. Ecosystem & Community
| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **npm Weekly Downloads** | integer (ascending) | Weekly download count from npm |
| **Component Libraries** | integer (ascending) | Number of major UI component libraries available |
| **Meta-Framework** | text | Primary SSR/SSG framework (Next.js, Nuxt, SvelteKit, etc.) or null |
| **Major Companies Using** | text | Notable companies using in production |
| **Official Sponsor/Backer** | text | Corporate backing (Meta, Google, Vercel, etc.) or "Community" |
| **Discord/Community Size** | integer (ascending) | Approximate Discord/forum member count |
| **Stack Overflow Questions** | integer (ascending) | Number of tagged questions |
| **Job Market Demand** | rating (1-5, ascending) | 1=niche, 2=growing, 3=moderate, 4=strong, 5=dominant |

### 10. Testing
| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Official Testing Library** | boolean | First-party testing utilities |
| **Testing Library Name** | text | Name of official/recommended testing solution |
| **Component Testing** | boolean | Unit testing individual components |
| **E2E Testing Integration** | boolean | Integration with Playwright, Cypress, etc. |
| **Snapshot Testing** | boolean | Supported snapshot testing |

### 11. Mobile & Cross-Platform
| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Mobile Framework** | text | Official mobile solution (React Native, Ionic, NativeScript) or null |
| **PWA Support** | boolean | Built-in or official PWA tooling |
| **Desktop Framework** | text | Official desktop solution (Electron, Tauri) or null |

### 12. Learning & Adoption
| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Learning Curve** | rating (1-5, descending) | 1=very steep, 3=moderate, 5=gentle |
| **Concepts to Learn** | integer (descending) | Number of core concepts before being productive |
| **Time to Hello World** | duration (descending) | Time to create first component (minutes) |
| **Migration Path** | boolean | Official migration guides from other frameworks |
| **Incremental Adoption** | boolean | Can be added to existing apps gradually |

## Research Sources

### Primary Sources (Preferred)
1. **Official Documentation** - Most authoritative for features and capabilities
2. **GitHub Repository** - For release dates, stars, activity, TypeScript status
3. **npm Registry** - For download counts, dependencies
4. **bundlephobia.com** - For accurate bundle size measurements
5. **js-framework-benchmark** - For performance comparisons

### Secondary Sources
6. **Official Blog/Changelog** - For release announcements and roadmap
7. **State of JS Survey** - For community sentiment and adoption trends
8. **Stack Overflow Developer Survey** - For satisfaction and usage statistics

### Tertiary Sources
9. **Comparison articles** - Cross-reference but verify claims independently
10. **GitHub Issues** - Gauge maintenance responsiveness
11. **Reddit/Discord** - Community sentiment and real-world feedback
12. **Job boards** - Indeed, LinkedIn for market demand

## Assessment Guidelines

### Bundle Size
- Measure using bundlephobia.com for consistency
- "Core" = minimal runtime (framework only)
- "Full" = framework + router + state management
- Note version measured

### Reactivity Model Classification
- **virtual-dom**: Creates virtual representation, diffs, and patches (React, Vue 2)
- **fine-grained**: Tracks individual reactive values, precise updates (Solid, Vue 3 Composition)
- **signals**: Reactive primitives that auto-track dependencies (Solid, Preact Signals, Angular 16+)
- **dirty-checking**: Checks all bindings on changes (Angular's Zone.js)
- **compiler-based**: Moves reactivity to compile time (Svelte)

### Learning Curve Rating
| Rating | Criteria |
|--------|----------|
| 1 | Many concepts required upfront, steep initial climb (Angular) |
| 2 | Moderate number of concepts, some complexity |
| 3 | Balanced - some framework-specific concepts to learn (Vue, React) |
| 4 | Few concepts, mostly leverages existing JS knowledge |
| 5 | Minimal learning required, familiar patterns (Svelte, vanilla-like) |

### Documentation Quality Rating
| Rating | Criteria |
|--------|----------|
| 1 | Minimal README, incomplete docs |
| 2 | Basic component list, incomplete API docs |
| 3 | Adequate docs with examples, some gaps |
| 4 | Good docs, API reference, guides, examples (React, Vue) |
| 5 | Excellent docs, interactive tutorials, recipes, migration guides (Svelte) |

### Job Market Demand Rating
| Rating | Criteria |
|--------|----------|
| 1 | Niche, very few job postings |
| 2 | Growing, early adoption phase |
| 3 | Moderate, established but not dominant |
| 4 | Strong demand, many job postings (Vue, Angular) |
| 5 | Dominant, most job postings (React) |

### Error Messages Rating
| Rating | Criteria |
|--------|----------|
| 1 | Cryptic stack traces, no context |
| 2 | Basic error identification |
| 3 | Clear error with component context |
| 4 | Helpful suggestions included |
| 5 | Excellent with links, suggestions, and fix examples |

### When to Use Null
- Feature genuinely doesn't exist
- Cannot verify from documentation or testing
- Not applicable (e.g., Mobile Framework for framework without official mobile solution)

## Initial Candidates

### Tier 1 (Must Have)
The dominant frameworks with the largest ecosystems:

- [x] **React** - Meta's declarative UI library, industry standard
- [x] **Vue** - Progressive framework, strong in Asia and growing globally
- [x] **Angular** - Google's opinionated platform, enterprise standard
- [x] **Svelte** - Compiler-based, no virtual DOM, rising popularity
- [x] **Solid** - Fine-grained reactivity, React-like syntax, performance-focused
- [x] **Preact** - Lightweight React alternative, same API

### Tier 2 (Should Have)
Notable alternatives with specific niches:

- [x] **Qwik** - Resumability-focused, O(1) loading performance
- [x] **Lit** - Google's web components library
- [ ] **Alpine.js** - Lightweight, sprinkle interactivity on HTML
- [ ] **HTMX** - HTML-centric, minimal JavaScript approach
- [ ] **Ember.js** - Convention over configuration, batteries included
- [ ] **Inferno** - Extremely fast React alternative

### Tier 2.5 (WASM/Compiled Languages)
Frameworks using WebAssembly or compiled from non-JS languages:

**Rust**
- [ ] **Leptos** - Full-stack Rust framework with fine-grained reactivity
- [ ] **Yew** - React-like Rust framework, mature ecosystem
- [ ] **Dioxus** - Cross-platform Rust UI (web, desktop, mobile)
- [ ] **Sycamore** - Reactive Rust library with fine-grained updates
- [ ] **Percy** - Rust + WASM for isomorphic web apps

**Go**
- [ ] **Vugu** - Vue-inspired Go framework compiling to WASM
- [ ] **Vecty** - React-like library for Go with GopherJS/WASM

**C# / .NET**
- [ ] **Blazor WebAssembly** - Microsoft's C# in the browser via WASM
- [ ] **Uno Platform** - XAML-based cross-platform UI

**Other Compiled Languages**
- [ ] **Elm** - Functional language with strong guarantees, compiles to JS
- [ ] **PureScript** - Strongly-typed functional language, compiles to JS
- [ ] **Kotlin/JS** - Kotlin compiling to JavaScript
- [ ] **Dart (Flutter Web)** - Flutter's web target using Dart
- [ ] **Scala.js** - Scala compiling to JavaScript
- [ ] **ClojureScript** - Clojure for the browser (often with Reagent/Re-frame)

### Tier 3 (Nice to Have)
Emerging, specialized, or declining options:

- [ ] **Marko** - eBay's streaming-focused framework
- [ ] **Stencil** - Web components compiler from Ionic
- [ ] **Mithril** - Lightweight, hyperscript-based
- [ ] **Riot.js** - Simple, elegant component library
- [ ] **Hyperapp** - 1KB framework for building web interfaces
- [ ] **Aurelia** - Convention-based, standards-focused
- [ ] **Backbone.js** - Legacy but still in maintenance mode
- [ ] **Knockout.js** - MVVM pattern, legacy but maintained

## Notes for Researchers

1. **React is a library, not a framework** - React itself is minimal; the ecosystem (Router, Redux, etc.) makes it framework-like. Note what's included in measurements.

2. **Version matters significantly** - Angular 1.x vs 2+ are completely different. Vue 2 vs 3 have different reactivity. Always research the current major version.

3. **Meta-frameworks vs frameworks** - Next.js, Nuxt, SvelteKit are built on top of these frameworks. Don't confuse meta-framework features with core framework features.

4. **Benchmark caveats** - js-framework-benchmark is useful but synthetic. Real-world performance depends on usage patterns. Note this in comments.

5. **TypeScript distinction** - Some frameworks are written in TypeScript (Angular), some have excellent TS support (Vue 3), some have added it later (React). The experience differs.

6. **"Official" vs "Community"** - For routers, state managers, etc., distinguish between first-party (maintained by core team) and community solutions (even if widely adopted).

7. **Signals are spreading** - Vue, Angular, Preact, Solid all have signals now. Note which are native vs added later.

8. **HTMX and Alpine are different** - They're often compared to SPA frameworks but operate differently. Clarify the paradigm difference in comments.

9. **Corporate backing context** - Meta backs React, Google backs Angular, Vercel hired the Svelte creator. This affects sustainability but also direction.

10. **Job market is regional** - React dominates globally, but Vue is stronger in China and parts of Europe. Angular is stronger in enterprise. Note geographical context.

11. **Bundle sizes change frequently** - Frameworks are continuously optimizing. Always note the version measured and date.

12. **Learning curve is subjective** - Someone with React experience will find Vue easier than someone from Angular. Rate for developers new to frontend frameworks.

13. **WASM bundle sizes are different** - WASM frameworks often have larger initial bundles due to runtime overhead (e.g., Blazor ships .NET runtime). Note this isn't directly comparable to JS framework sizes.

14. **WASM interop overhead** - Crossing the JS/WASM boundary has performance cost. Some frameworks (Leptos, Dioxus) minimize this; others require explicit bridge code. Document the interop experience.

15. **Compiled language ecosystem** - Rust/Go/C# frameworks may have smaller web-specific ecosystems but leverage the parent language's tooling (Cargo, dotnet CLI). Note both web and language ecosystem.

16. **WASM hydration** - Some WASM frameworks support SSR with WASM hydration, others are client-only. This significantly affects initial load experience.

17. **Elm and PureScript compile to JS** - Despite being separate languages, they output JavaScript, not WASM. They belong in this comparison for their unique paradigms but aren't WASM frameworks.

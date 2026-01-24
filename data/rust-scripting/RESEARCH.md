# Rust Embedded Scripting Languages Research Guide

## Overview

Compare scripting languages and interpreters that can be embedded in Rust applications. This comparison helps Rust developers choose the right scripting solution for extending their applications with user-defined logic, configuration, plugins, or game scripting.

Users should be able to:
- Find scripting languages matching their syntax/paradigm preferences
- Assess performance characteristics (startup time, execution speed, memory)
- Compare sandboxing and security capabilities
- Evaluate Rust integration quality and API ergonomics
- Gauge maturity, ecosystem size, and maintenance status
- Understand trade-offs between pure Rust and binding-based solutions

## Scope

**Included:**
- Pure Rust scripting language implementations
- Rust bindings to established scripting languages (Lua, JavaScript, etc.)
- Embeddable interpreters designed for host application integration
- Both JIT-compiled and interpreted solutions
- Domain-specific languages (DSL) designed for embedding

**Excluded:**
- General-purpose Rust-to-WASM compilation (that's a different use case)
- Template engines (Tera, Askama, etc.) - different category
- Configuration languages without scripting capabilities (TOML, YAML parsers)
- Full standalone language implementations not designed for embedding
- Build/task scripting tools (just, cargo-make) - different category
- Shell/command runners

## Attribute Groups

### 1. General Information

| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **License** | tags | Check Cargo.toml or LICENSE file. Common: MIT, Apache-2.0, MPL-2.0. Dual-license counts as multiple tags. |
| **Implementation** | tags | `pure-rust` if no C/C++ dependencies; `rust-bindings` if wrapping native interpreter; `hybrid` if Rust with optional native components |
| **Language Family** | tags | Syntax inspiration: `custom`, `lua-like`, `javascript-like`, `rust-like`, `lisp-like`, `python-like`, `ruby-like`, `functional` |
| **Repository** | link | Primary source repository (GitHub, GitLab, etc.) |
| **Crates.io** | link | Link to crates.io package page |
| **Documentation** | link | Link to docs.rs or custom documentation site |
| **First Release** | date (year) | Year of first public release or first crates.io publish |
| **Latest Stable Version** | text | Current stable version number from crates.io |

### 2. Language Features

| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Typing Discipline** | tags | `dynamic` (runtime types), `static` (compile-time checked), `gradual` (optional types), `duck-typed` |
| **Paradigm** | tags | `imperative`, `functional`, `object-oriented`, `prototype-based`, `multi-paradigm`. Select all that apply. |
| **First-Class Functions** | boolean | Functions can be passed as values, returned, stored in variables |
| **Closures** | boolean | Functions can capture variables from enclosing scope |
| **Pattern Matching** | boolean | Has destructuring/pattern matching constructs |
| **Error Handling** | tags | `exceptions`, `result-type`, `error-values`, `panic-only`. How errors propagate. |
| **Async/Await** | boolean | Native async/await syntax support in the scripting language |
| **Iterators/Generators** | boolean | Iterator protocol or generator functions |
| **Module System** | boolean | Can organize code into reusable modules/namespaces |
| **Standard Library** | tags | `minimal` (bare essentials), `moderate` (common utilities), `comprehensive` (batteries included), `none` (bring your own) |

### 3. Execution Model

| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Execution Strategy** | tags | `interpreted` (direct AST walk), `bytecode` (compiled to VM bytecode), `jit` (just-in-time compilation), `aot` (ahead-of-time compilation) |
| **Compilation Model** | tags | `runtime-eval` (parse at runtime), `precompiled` (can serialize bytecode), `both` |
| **Hot Reloading** | boolean | Can reload/update scripts without restarting host application |
| **REPL Support** | boolean | Interactive read-eval-print-loop available |
| **Debugging Support** | boolean | Breakpoints, step-through, variable inspection possible |
| **Source Maps** | boolean | Maps runtime errors back to original source locations |

### 4. Performance

| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Startup Time** | tags | `instant` (<1ms), `fast` (1-10ms), `moderate` (10-100ms), `slow` (>100ms). Time to initialize interpreter. |
| **Execution Speed** | tags | `near-native` (within 2-5x of native), `fast` (5-20x slower), `moderate` (20-100x), `slow` (>100x). Subjective but based on benchmarks. |
| **Memory Overhead** | tags | `minimal` (<1MB base), `low` (1-10MB), `moderate` (10-50MB), `high` (>50MB). Base interpreter memory. |
| **Garbage Collection** | tags | `none` (manual/RAII), `reference-counting`, `tracing-gc`, `mark-sweep`, `generational` |

### 5. Rust Integration

| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Pure Rust** | boolean | No C/C++ dependencies in the dependency tree. Check with `cargo tree` for native code. |
| **API Safety** | tags | `fully-safe` (no unsafe in public API), `minimal-unsafe` (unsafe contained internally), `unsafe-required` (users must write unsafe), `ffi-unsafe` (C bindings require unsafe) |
| **Idiomatic API** | rating 1-5 | 5=excellent Rust patterns, builders, error handling; 1=C-style or awkward patterns |
| **Serde Integration** | boolean | Native serde support for passing data between Rust and scripts |
| **Async Runtime Compatible** | tags | `native-async` (built-in async), `tokio-compatible`, `async-std-compatible`, `sync-only` |
| **Function Registration** | tags | `macro-based` (derive/attribute macros), `builder-api` (fluent registration), `manual` (verbose manual registration) |
| **Type Mapping** | tags | `automatic` (Rust types map automatically), `manual` (explicit conversion needed), `serde-based` (via serialization) |
| **no_std Compatible** | boolean | Can compile without standard library |
| **WASM Compatible** | boolean | Works in WebAssembly (browser or WASI) |

### 6. Sandboxing & Security

| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Blank Slate Mode** | boolean | Can start with completely empty context - no built-in functions, variables, or standard library. Host controls every symbol available to scripts. |
| **Memory Sandboxing** | boolean | Scripts cannot access arbitrary host memory |
| **CPU Limits** | boolean | Can limit execution time/instruction count to prevent infinite loops |
| **Memory Limits** | boolean | Can cap memory usage to prevent resource exhaustion |
| **Syscall Restrictions** | boolean | Can prevent or control file/network/system access |
| **Capability-Based Security** | boolean | Fine-grained permissions for what scripts can access |
| **Default Deny** | boolean | Scripts have no capabilities by default; must be explicitly granted |

### 7. Interoperability

| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Call Rust from Script** | boolean | Scripts can invoke registered Rust functions |
| **Call Script from Rust** | boolean | Rust can call script-defined functions |
| **Share Data** | tags | `clone-only` (data copied), `references` (share references), `zero-copy` (direct memory access where safe) |
| **Custom Types** | boolean | Can expose Rust structs/enums to scripts |
| **Operator Overloading** | boolean | Custom types can define operators (+, -, [], etc.) |
| **Method Syntax** | boolean | Custom types can have methods callable with dot notation |
| **Callbacks/Events** | boolean | Scripts can register callbacks for host events |

### 8. Ecosystem

| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **GitHub Stars** | integer | Star count from repository (snapshot, will become outdated) |
| **Crates.io Downloads** | integer | All-time downloads from crates.io |
| **Last Release** | date | Date of most recent crates.io release |
| **Package Manager** | boolean | Has ecosystem for distributing script packages/modules |
| **Editor Support** | tags | `syntax-highlighting`, `lsp`, `formatter`, `none`. IDE/editor tooling available. |
| **Example Projects** | tags | `games`, `cli-tools`, `web-backends`, `config`, `plugins`, `automation`. Known use case categories. |

### 9. Community & Maintenance

| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Maintenance Status** | tags | `actively-maintained`, `passively-maintained` (bug fixes only), `seeking-maintainer`, `archived`, `abandoned` |
| **Documentation Quality** | rating 1-5 | 5=comprehensive with tutorials; 3=adequate API docs; 1=minimal |
| **Bus Factor** | tags | `solo` (single maintainer), `small-team` (2-5), `organization` (company-backed or large team) |
| **Maturity** | tags | `experimental`, `beta`, `stable`, `mature` |

### 10. Use Cases

| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Primary Use Cases** | tags | `game-scripting`, `config-logic`, `plugin-system`, `rule-engine`, `automation`, `repl-shell`, `template-logic`, `data-transformation`, `expression-eval` |

## Research Sources

### Primary Sources (Preferred)
1. **Crates.io** - Version info, downloads, dependencies, features
2. **Official Repository** - README, issues, benchmarks, examples
3. **docs.rs** - API documentation
4. **Official Book/Guide** - If the language has documentation site

### Secondary Sources
5. **are-we-game-yet** - Game development ecosystem list
6. **lib.rs** - Alternative crate metadata
7. **Reddit r/rust** - Community discussions, comparisons
8. **Blog posts** - Benchmarks, experience reports (note date)
9. **GitHub Discussions/Issues** - Real-world usage reports

### Sources to Approach Carefully
- Benchmarks from marketing materials (often cherry-picked)
- Comparisons older than 2 years (significant changes possible)
- Performance claims without methodology

## Assessment Guidelines

### Execution Speed Assessment
Based on available benchmarks and language design:
- **near-native**: JIT compilation or very optimized bytecode (LuaJIT, V8)
- **fast**: Well-optimized bytecode VM (Lua, optimized interpreters)
- **moderate**: Standard interpreted or basic bytecode (most pure Rust options)
- **slow**: AST-walking interpreter or heavy abstraction overhead

### Startup Time Assessment
- **instant**: Minimal initialization, no JIT warmup
- **fast**: Small runtime, quick initialization
- **moderate**: Larger runtime or JIT compilation overhead
- **slow**: Heavy runtime initialization (V8, full Python)

### Idiomatic API Rating
- **5**: Derive macros, builder patterns, excellent error types, feels native
- **4**: Good patterns with minor friction points
- **3**: Functional but verbose or some awkward patterns
- **2**: Significant ergonomic issues
- **1**: C-style API, poor error handling, unsafe-heavy

### Documentation Quality Rating
- **5**: Book/guide, tutorials, migration docs, comprehensive examples
- **4**: Good API docs with examples, getting-started guide
- **3**: Adequate API documentation, basic examples
- **2**: Minimal documentation, few examples
- **1**: Missing or severely outdated documentation

### Maturity Assessment
- **experimental**: Not production ready, major missing features
- **beta**: Usable but API unstable, limited production use
- **stable**: Production ready, stable API, documented upgrade path
- **mature**: Years of production use, battle-tested, established ecosystem

### When to Use `null`
- Performance metrics without reliable benchmarks
- Platform support that cannot be verified
- Features that exist but are undocumented
- Conflicting information from sources

## Initial Candidates

### Tier 1 (Must Have)
Core options most Rust developers will evaluate:

- [x] **Rhai** - Popular pure-Rust scripting, simple syntax, good docs
- [x] **mlua** - Lua 5.x/LuaJIT bindings, most mature Lua integration
- [x] **Rune** - Async-native, Rust-like syntax, promising design
- [x] **boa** - JavaScript engine in pure Rust, ES2023+ compliance
- [ ] **rquickjs** - QuickJS bindings, fast JS with small footprint

### Tier 2 (Should Have)
Well-maintained alternatives and specialized options:

- [ ] **Gluon** - Statically typed, functional, Haskell-inspired
- [ ] **Dyon** - Game-focused, unique features (go-like coroutines, 4D vectors)
- [ ] **RustPython** - Python interpreter in Rust
- [ ] **Steel** - Scheme/Racket-inspired, embeddable Lisp
- [ ] **Piccolo** - Lua implementation in pure Rust
- [ ] **rlua** - Earlier Lua bindings (compare to mlua for completeness)
- [ ] **koto** - Simple syntax, built-in iterators, pure Rust

### Tier 3 (Nice to Have)
Newer, specialized, or niche options:

- [ ] **Mun** - Hot reloading focused, static typing, game development target
- [ ] **Starlark** - Google's Bazel config language, pure Rust implementation
- [ ] **deno_core** - V8-based, Deno's core runtime (heavy but powerful)
- [ ] **wasm-bindgen** + interpreters - WASM-based scripting approach
- [ ] **rhai-sci** / **rhai-rand** - Rhai ecosystem extensions
- [ ] **goscript** - Go-like scripting (if actively maintained)
- [ ] **miri** - Rust interpreter (different use case but notable)

### Not Including (with reasons)
- **Lua (C library directly)** - Use mlua/rlua bindings instead
- **V8 (raw bindings)** - Use deno_core or boa instead
- **Full Python embedding** - RustPython covers this; cpython crate is FFI-heavy
- **Nushell** - Shell, not embeddable scripting language
- **WebAssembly runtimes** (wasmtime, wasmer) - Different abstraction layer

## Notes for Researchers

### General Principles
1. **Verify performance claims** - Look for independent benchmarks, not just README claims
2. **Check async story** - "Async support" can mean very different things
3. **Test sandbox claims** - Security features need verification, not just documentation
4. **Note memory models** - GC vs reference counting affects use case suitability
5. **Consider ecosystem** - A language with good tooling may beat a faster one

### Rust-Specific Considerations
1. **Check Cargo.toml features** - Many capabilities behind feature flags
2. **Verify pure Rust claims** - `cargo tree` reveals C dependencies
3. **Test WASM claims** - Not all "pure Rust" compiles to WASM cleanly
4. **Review registration ergonomics** - How easy is it to expose Rust functions?
5. **Check Send + Sync** - Thread safety of interpreter instances

### Performance Evaluation
- Startup time matters for short-lived scripts, less for long-running
- Execution speed matters for compute-heavy scripts, less for orchestration
- Memory overhead matters for many instances, less for single interpreter
- Look for real-world benchmarks, not just micro-benchmarks

### Security Evaluation
- "Sandboxed" without specifics is a red flag
- Check if limits are soft (advisory) or hard (enforced)
- Look for CVE history and security advisories
- Test assumptions about isolation if security-critical

### Common Pitfalls
- "Lua compatible" - May be Lua 5.1 only, missing 5.4 features
- "JavaScript" - ECMAScript version support varies wildly
- "Fast" - Compared to what? Pure interpreter? JIT? Native code?
- "Production ready" - Look for actual production usage, not just claims
- "Hot reloading" - May require specific architecture constraints

# Rust Parser Libraries Research Guide

## Overview

Compare libraries and tools for building parsers in Rust — parser combinators, parser/lexer generators, PEG frameworks, and incremental/lossless syntax-tree toolkits. The comparison is aimed at Rust developers writing a frontend for a programming language, DSL, configuration format, or query language, who need to choose between "grammar as Rust code" and "grammar as a separate file", and who care about diagnostics quality, span tracking, error recovery, and editor-friendly incremental reparsing.

Users should be able to:
- Pick between combinator, generator, PEG, and hand-rolled-with-helpers approaches
- Understand which grammar classes a tool accepts (LR, LALR, PEG, arbitrary recursive descent) and how it treats left recursion and ambiguity
- Assess diagnostics: error recovery, multiple-error reporting, expected-token sets, span fidelity, integration with `ariadne`/`miette`/`codespan`
- Judge suitability for IDE/LSP scenarios (incremental reparsing, lossless CSTs)
- Gauge compile-time cost, runtime performance tier, `no_std` support, and reliance on proc-macros or `build.rs`
- Evaluate maturity, maintenance status, and ecosystem footprint

## Scope

**Included:**
- Parser combinator libraries (`nom`, `winnow`, `chumsky`, `combine`, …)
- Parser generators consuming a grammar file or macro DSL (`lalrpop`, `pest`, `peg`, `grmtools`, `lelwel`, …)
- Lexer generators / tokenizer builders (`logos`, `lexgen`) — they are the front half of most generator-based pipelines
- Incremental and lossless syntax-tree toolkits with first-class Rust APIs (`tree-sitter` Rust bindings and `rust-sitter`, `rowan`)
- Extension crates that materially change the parsing/diagnostic experience of an included library (`nom-supreme`)
- Both pure-Rust implementations and Rust bindings to a native parsing engine

**Excluded:**
- Declarative binary-format parsers (`binrw`, `deku`, `scroll`, `zerocopy`, `nom`'s bit-level use is noted but not a criterion) — different problem space
- Format-specific parsers (`serde_json`, `toml`, `quick-xml`, `pulldown-cmark`, `csv`) — consumers, not parser-building tools
- Regex engines (`regex`, `fancy-regex`) — not parser frameworks
- `syn` / `proc-macro2` — parse Rust token streams only; not general-purpose
- Template engines and scripting languages (covered by other comparisons)
- Language servers, formatters, or full compilers built with these tools

## Attribute Groups

### 1. General Information

| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **License** | tags | From Cargo.toml / LICENSE. Tags: `MIT`, `Apache-2.0`, `MPL-2.0`, `BSD-3-Clause`, `Zlib`. Dual licensing → multiple tags. |
| **Approach** | tags | Primary style: `combinator`, `generator-grammar-file`, `generator-macro`, `peg`, `lexer-only`, `incremental-cst`, `extension`. Pick the dominant one; add a second only if genuinely dual (e.g. `pest` is `generator-grammar-file` + `peg`). |
| **Implementation** | tags | `pure-rust` (no C/C++ in dep tree) vs `rust-bindings` (wraps a native engine, e.g. tree-sitter's C runtime). |
| **Repository** | link | Primary source repository. |
| **Crates.io** | link | Package page. For multi-crate projects link the umbrella/main crate. |
| **Documentation** | link | docs.rs or dedicated book/site (prefer the book when one exists). |
| **First Release** | date (year) | Year of first crates.io publish (check the "Versions" tab). |
| **Latest Stable Version** | text | Current non-prerelease version on crates.io. Note the date checked in `comment`. |

### 2. Parsing Model

| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Grammar Class** | tags | What the tool can parse: `lr1`, `lalr1`, `glr`, `peg`, `recursive-descent`, `ll-k`, `arbitrary` (combinators accept anything expressible as code). Multiple allowed. |
| **Grammar Definition** | tags | `rust-code` (combinators, hand-written), `macro-dsl` (grammar inside a Rust macro), `external-file` (`.lalrpop`, `.pest`, `.y`, `grammar.js`). |
| **Left Recursion** | tags | `native` (directly supported), `precedence-climbing` (via a Pratt/precedence helper), `manual-rewrite` (must eliminate), `n/a` (lexers). |
| **Ambiguity Handling** | tags | `rejected-at-build` (LR conflicts fail generation), `ordered-choice` (PEG first-match semantics), `all-parses` (GLR forests), `backtracking` (combinators try alternatives), `n/a`. |
| **Backtracking** | tags | `unlimited`, `bounded/cut` (has cut/commit operator), `none` (deterministic table-driven), `n/a`. |
| **Lexer Integration** | tags | `built-in` (scannerless or bundled lexer), `external-token-stream` (accepts any `Iterator<Item = Token>`), `pairs-with` (designed to pair with a specific lexer, name it in comment), `is-lexer`. |
| **Precedence / Pratt Support** | boolean | Has a dedicated operator-precedence facility (e.g. `chumsky::pratt`, `pest::pratt_parser`, `%left`/`%right` in LALRPOP). |
| **Unicode-Aware** | boolean | Correctly handles UTF-8 boundaries and offers `char`-level primitives, not just bytes. |

### 3. Input & Output

| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Input Types** | tags | `str`, `bytes`, `token-slice`, `custom-stream` (user-implementable input trait), `rope/text-buffer`. |
| **Streaming / Partial Input** | boolean | Can parse incomplete input and signal "need more" (nom `Incomplete`, winnow `Partial`). |
| **Zero-Copy** | boolean | Output can borrow from the input without allocating (e.g. `&'a str` slices in the AST). |
| **Span Tracking** | tags | `byte-offsets`, `line-col`, `custom-span-type`, `none`. Note if spans are opt-in via wrapper input types (e.g. `nom_locate`). |
| **Output Model** | tags | `typed-ast` (user builds arbitrary Rust types in actions), `generic-tree` (untyped pairs/nodes, e.g. `pest::Pair`), `lossless-cst` (green/red trees retaining trivia), `tokens-only`. |
| **Semantic Actions** | tags | `inline-rust` (arbitrary Rust in grammar actions), `post-walk` (walk generic tree afterwards), `combinator-map` (`.map()`/`.then()` style), `n/a`. |
| **Whitespace / Comment Handling** | tags | `implicit-skip-rules` (e.g. pest `WHITESPACE`/`COMMENT`), `explicit-combinators`, `lexer-skip`, `preserved-as-trivia`. |
| **Stateful Parsing** | boolean | Supports threading user state (symbol tables, indentation stack) through the parse. |

### 4. Error Handling & Diagnostics

| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Error Recovery** | tags | `none` (stop at first error), `basic` (skip-to-sync-token), `configurable` (user-defined recovery strategies), `automatic` (built-in repair, e.g. grmtools' CPCT+ / tree-sitter `ERROR` nodes). |
| **Multiple Errors Per Parse** | boolean | Can report more than one error from a single run. |
| **Expected-Token Reporting** | boolean | Errors carry the set of tokens/rules that would have been valid at the failure point. |
| **Custom Error Types** | boolean | User can substitute their own error type (trait-based, generic parameter, or `map_err`-style). |
| **Error Span Fidelity** | rating (1–5) | 5 = precise byte spans on every error with labels; 3 = position only; 1 = message string only. |
| **Diagnostic Crate Integration** | tags | Documented/first-party bridge to `ariadne`, `miette`, `codespan-reporting`, `annotate-snippets`, or `none`. |
| **Contextual Error Messages** | boolean | Has a mechanism to attach human-readable labels/context to sub-parsers or rules (nom `context`, chumsky `labelled`, LALRPOP error tokens). |

### 5. Incremental & Editor Support

| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Incremental Reparsing** | boolean | Can reuse the previous tree when the input is edited (tree-sitter yes; most others no). |
| **Lossless Syntax Tree** | boolean | Retains whitespace/comments so the source can be reconstructed exactly (rowan, tree-sitter). |
| **Syntax Highlighting Queries** | boolean | Ships a query/pattern language or API designed for highlighting and code navigation. |
| **Used by an LSP / IDE** | tags | Known production editor uses: `rust-analyzer`, `helix`, `zed`, `neovim`, `none-known`. Cite the source. |

### 6. Performance

| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Runtime Speed Tier** | tags | `top-tier` (within ~1.5× of hand-written), `fast` (1.5–3×), `moderate` (3–10×), `slow` (>10×). Base on the `parser-benchmarks` / `json-parser-bench` style community benchmarks; cite them. `null` if no independent data. |
| **Compile-Time Impact** | tags | `light` (<2 s incremental delta), `moderate`, `heavy` (deep generic instantiation or large generated tables; chumsky/combine-style deep types, LALRPOP tables). Subjective; cite a build-time measurement or issue if available. |
| **Allocation Strategy** | tags | `allocation-free-possible`, `arena-friendly`, `allocates-per-node`. |
| **Generated Code Size** | tags | `n/a` (combinators), `small`, `large` (multi-MB tables). Generators only. |

### 7. Rust Integration

| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **no_std Support** | boolean | Compiles without `std` (with or without `alloc`). Note which in comment. |
| **MSRV** | text | Minimum supported Rust version from Cargo.toml `rust-version` or README. |
| **Unsafe Usage** | tags | `forbid-unsafe` (`#![forbid(unsafe_code)]`), `minimal` (few audited blocks), `substantial`, `ffi` (bindings to C). |
| **Proc-Macro Reliance** | tags | `none`, `optional`, `required`. |
| **build.rs Step** | boolean | Requires a build script to generate code (LALRPOP, tree-sitter grammar compilation). |
| **Dependency Count** | integer | Direct non-dev dependencies of the main crate (lower is better). |
| **WASM Compatible** | boolean | Compiles to `wasm32-unknown-unknown` and/or WASI without special setup. |
| **Async-Friendly** | boolean | Parsers/results are `Send` and can be used with async input sources without wrapper hacks. |

### 8. Ecosystem & Maintenance

| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **GitHub Stars** | integer | Snapshot; note date in comment (higher is better). |
| **Crates.io Downloads** | integer | All-time downloads of the main crate (higher is better). |
| **Last Release** | date (full) | Most recent crates.io publish (newer is better). |
| **Maintenance Status** | tags | `actively-maintained`, `passively-maintained`, `seeking-maintainer`, `archived`, `superseded` (name successor in comment, e.g. nom → winnow is *not* superseded; combine → largely dormant). |
| **Documentation Quality** | rating (1–5) | See Assessment Guidelines. |
| **Tutorial / Book** | boolean | Has a dedicated long-form guide beyond API docs (Chumsky tutorial, pest book, LALRPOP book, nom's `choosing_a_combinator` docs). |
| **Notable Users** | text | 2–4 well-known projects using it (with links in `source`). |
| **Bus Factor** | tags | `solo`, `small-team`, `organization`. |

## Research Sources

### Primary Sources (Preferred)
1. **crates.io** — versions, first publish date, downloads, dependency list, MSRV
2. **Official repository** — README, `Cargo.toml` (`rust-version`, features), `#![forbid(unsafe_code)]`, CI, issue tracker, release cadence
3. **docs.rs** — API surface: error types, input traits, span helpers, recovery combinators
4. **Project books/tutorials** — pest book, LALRPOP book, Chumsky tutorial, winnow's "Why winnow" and tutorial, tree-sitter docs
5. **lib.rs** — dependency counts, `no_std` badge, unsafe metrics (cargo-geiger derived)

### Secondary Sources
6. **Community benchmarks** — `rust-parser-benchmarks`, `epage/parse-benchmarks` (winnow author's comparative suite), json-parsing shootouts. Always cite the commit/date.
7. **"Are We Learning Yet" / `lib.rs/parsing` category** — discovering candidates and checking activity
8. **Blog posts & experience reports** — e.g. "nom vs pest", "why I moved to chumsky", rust-analyzer's syntax-tree design notes. Note publication date.
9. **GitHub Issues/Discussions** — real-world reports of compile-time blowups, error-recovery limitations, `no_std` regressions
10. **rust-analyzer / helix / zed source** — verify "used by an LSP/editor" claims directly

### Sources to Approach Carefully
- Benchmarks authored by a candidate's maintainer (bias toward their own tool — cross-check)
- Comparisons older than ~2 years (chumsky 1.0, winnow's split from nom, and nom 8 all changed the landscape)
- Star counts as a quality proxy — many parser crates are old and accumulated stars before better options existed

## Assessment Guidelines

- **Approach**: Assign the *dominant* style. `pest` = `generator-grammar-file` + `peg`. `peg` (rust-peg) = `generator-macro` + `peg`. `rust-sitter` = `generator-macro` + `incremental-cst`. `nom-supreme` = `extension`.
- **Grammar Class for combinators**: Use `arbitrary` — combinators impose no formal grammar class. Do not also tag `peg` unless the library documents PEG semantics explicitly.
- **Left Recursion**: Combinators without a Pratt helper get `manual-rewrite`; with a documented Pratt/precedence module get `precedence-climbing`. LR generators get `native`. PEG tools get `manual-rewrite` unless they document left-recursion support.
- **Error Recovery**: `basic` requires at least one documented skip/sync mechanism; `configurable` requires user-pluggable strategies (chumsky `recover_with`, LALRPOP `!` error token). `automatic` is reserved for tools that repair without user configuration (grmtools, tree-sitter).
- **Error Span Fidelity**: 5 = every error carries a byte-range span *and* supports labelled secondary spans; 4 = byte-range span; 3 = single position/offset; 2 = line number only; 1 = message text only.
- **Runtime Speed Tier**: Requires at least one independent (non-maintainer) benchmark or a maintainer benchmark that includes competitors and is reproducible. Otherwise `null` with a comment explaining what was found.
- **Compile-Time Impact**: Prefer `null` over a guess. Acceptable evidence: a GitHub issue with measurements, a blog post with timings, or a documented "compile times" section.
- **Documentation Quality**: 5 = book/tutorial + comprehensive API docs + cookbook/examples + migration guides; 4 = tutorial + good API docs; 3 = solid API docs with examples; 2 = sparse API docs; 1 = minimal or stale.
- **Maintenance Status**: `actively-maintained` = release or substantive commit in the last 6 months and issues triaged; `passively-maintained` = responds to bugs but no features in 12+ months; `archived` = repo archived or README says so.
- **Used by an LSP / IDE**: Only tag from verified source (a `Cargo.toml` dependency or official docs). `none-known` is a valid value; do not leave `null`.
- **Notable Users**: Prefer projects that are themselves well-known (compilers, editors, popular CLIs). Skip toy projects. `null` if nothing verifiable.
- **When to use `null`**: Unverifiable performance claims; `no_std` support that is asserted but not tested in CI; features present only on an unreleased branch; conflicting information between README and docs.rs. Always add a `comment` explaining why.

## Candidates

- [x] nom — the most widely used Rust parser combinator library; byte- and string-oriented, streaming support
- [x] winnow — fork of nom by a former nom maintainer, focused on ergonomics, imperative style, and documentation
- [x] chumsky — combinator library designed around error recovery and rich diagnostics; Pratt parsing, `ariadne` companion
- [x] pest — PEG parser generator with external `.pest` grammar files and a generic `Pair` tree; large user base
- [x] lalrpop — LR(1)/LALR(1) parser generator with `.lalrpop` grammar files and inline Rust actions
- [x] logos — derive-macro lexer generator focused on speed; the de-facto companion to lalrpop/chumsky
- [ ] tree-sitter — Rust bindings to the incremental, error-tolerant parsing library used by editors
- [ ] combine — early Haskell-Parsec-inspired combinator library; mature but slower-moving
- [ ] peg (rust-peg) — PEG parser generator via a procedural macro DSL embedded in Rust
- [ ] rowan — lossless green/red syntax tree library underpinning rust-analyzer
- [ ] grmtools (lrpar / lrlex) — Yacc-compatible LR parser generator with automatic error recovery (CPCT+)
- [ ] pom — PEG parser combinators using operator overloading for a grammar-like syntax
- [ ] rust-sitter — write tree-sitter grammars as annotated Rust types via a macro
- [ ] lelwel — LL(1) parser generator with a focus on error recovery and lossless output
- [ ] lexgen — lexer generator using a Rust macro DSL, alternative to logos
- [ ] nom-supreme — error-handling and ergonomics extension layer on top of nom
- [ ] yap — lightweight, dependency-free parser combinator crate
- [ ] parsell — streaming/pushdown parser combinator crate designed around zero-copy inputs
- [ ] rust-parsec — Parsec-style combinator crate; verify the exact crates.io name and activity before researching (may be dormant)

### Not Including (with reasons)
- **syn / proc-macro2** — parse Rust token streams only; not a general-purpose parser framework
- **binrw / deku / scroll / zerocopy** — declarative binary formats; out of scope
- **regex / fancy-regex** — regex engines, not parser builders
- **serde_json / toml / quick-xml** — format-specific consumers
- **lex / plex / rustlex** — largely unmaintained lexer generators superseded by logos
- **oak / peresil / nom_locate** — dormant or thin helper crates; `nom_locate` is mentioned in nom's Span Tracking note instead

## Notes for Researchers

1. **Verify claims from primary sources.** README feature lists overstate; check docs.rs for the actual API before recording a `true`.
2. **Cite every value.** Put URLs in `source`; for benchmarks and star/download counts, add the date checked to `comment`.
3. **Use `null` with a `comment` when uncertain** rather than guessing — especially for performance tiers and compile-time impact.
4. **Pin the version.** Record which crate version the research reflects in the Latest Stable Version `comment`; nom 7→8, chumsky 0.9→1.0, and winnow 0.5→0.7 changed APIs and error models materially.
5. **Check feature flags.** `no_std`, `alloc`, `std`, and error-related capabilities are frequently behind Cargo features — record what the default and full feature sets provide.
6. **Distinguish generator vs runtime crates.** For lalrpop, grmtools, tree-sitter, and pest, dependency count / unsafe / `no_std` should describe the *runtime* crate the end user's binary links against; mention the build-time crate in `comment`.
7. **Verify pure-Rust claims with `cargo tree`.** tree-sitter links a C runtime; some "pure Rust" crates pull in `cc` transitively.
8. **"Error recovery" is the most over-claimed attribute.** Look for an actual recovery API or documented behaviour on malformed input, not a marketing sentence.
9. **Editor usage must be traceable** to a `Cargo.toml` or official documentation of the consuming project.
10. **Watch for forks and successors.** Note relationships (nom → winnow, rlua-style splits) in `comment` on Maintenance Status without prejudging which is "better".

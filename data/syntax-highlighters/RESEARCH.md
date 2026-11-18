# Syntax Highlighters Research Guide

## Overview

Compare libraries and tools that turn source code into highlighted output — regex-lexer engines (Pygments, Rouge, Chroma, highlight.js, Prism), TextMate/Sublime-grammar engines (Shiki, syntect, vscode-textmate, starry-night), parse-tree-based engines (tree-sitter-highlight, Lezer), and highlight-first CLIs. The comparison spans every host language, not just JavaScript/TypeScript, and is not limited to web rendering: terminal (ANSI), print (LaTeX/RTF), image, and — explicitly — **intermediate formats** (token streams, scope stacks, styled spans, highlight events, HTML ASTs, JSON) that let an application render highlighting itself are first-class criteria. The audience is developers embedding highlighting into documentation generators, static-site generators, terminals and pagers, chat/LLM UIs, editors, and publishing pipelines.

Users should be able to:
- Find a credible highlighter for their host language (Python, Rust, Go, Ruby, JS/TS, PHP, Swift, C#, C++, Haskell, Elixir) or one usable via bindings/WASM
- Understand the engine model (regex lexer vs TextMate grammar vs parse tree) and what that means for accuracy, embedded languages, and incremental use
- Check which grammar and theme ecosystems a tool can reuse (VS Code/TextMate, Sublime, tree-sitter, Pygments lexers, KDE XML) instead of maintaining its own
- See which intermediate representations a tool exposes and whether they are documented, stable, and serializable — for custom renderers, diffing, or shipping tokens over the wire
- Compare output targets (HTML with inline styles vs classes, ANSI, LaTeX, RTF, SVG, images) and theming (light/dark dual output, CSS variables)
- Gauge runtime footprint (bundle size, native dependencies, WASM, sync vs async init), performance tier, maturity, and maintenance

## Scope

**Included:**
- Highlighting libraries in any host language, embeddable as a dependency
- Highlighting engines that originate in an editor but are usable standalone (`vscode-textmate`, `@lezer/highlight`, KSyntaxHighlighting, `tree-sitter-highlight`)
- Ports and reimplementations of other engines, as separate candidates (Chroma ≈ Pygments for Go, Phiki ≈ Shiki for PHP, giallo, starry-night)
- Highlight-first CLIs whose primary job is producing highlighted output (Andre Simon's `highlight`, GNU Source-highlight; `pygmentize` is covered by the Pygments candidate)
- Libraries whose main product is an intermediate representation for others to render (token/event/hast emitters)

**Excluded:**
- Editor widgets and code-editor components (Monaco, CodeMirror as an editor, Ace, RSyntaxTextArea) — the standalone engine underneath may be in scope, the widget is not
- Tools that merely *use* a highlighting engine (bat, delta, glow, less filters) — they are notable users, not candidates
- Thin integration wrappers and plugins (rehype-pretty-code, Bright, markdown-it/remark highlight plugins, Jekyll/Hugo integrations, Sphinx extensions)
- Grammar/theme packs and syntax bundles (two-face, tree-sitter-langs, shiki language packs) — modelled via the Grammar Ecosystem attribute instead
- Hosted highlighting APIs/services (Torchlight, carbon.now.sh, ray.so) — not embeddable
- Language servers and semantic-token providers (LSP `semanticTokens`) — require a full language toolchain, different problem
- Code formatters / pretty-printers that change the code rather than annotate it

## Attribute Groups

### 1. General Information

| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Host Language** | tags | Language the engine is implemented in / primarily consumed from. tags: `python`, `rust`, `go`, `ruby`, `javascript`, `typescript`, `php`, `swift`, `csharp`, `cpp`, `c`, `haskell`, `elixir`, `java`, `kotlin`, `lua`. Multiple only when genuinely first-class in several (e.g. tree-sitter: `c` + `rust`). |
| **Form Factor** | tags | tags: `library`, `cli`, `wasm-module`, `web-component`. A library that ships its own CLI gets both `library` and `cli`. |
| **License** | tags | From LICENSE / package manifest. tags: `MIT`, `Apache-2.0`, `BSD-2-Clause`, `BSD-3-Clause`, `ISC`, `MPL-2.0`, `GPL-3.0`, `LGPL-2.1`, `MIT OR Apache-2.0`. Note if bundled grammars carry different licences in the comment. |
| **Repository** | link | Canonical source repository. |
| **Package** | link | Registry page: PyPI, crates.io, pkg.go.dev, RubyGems, npm, Packagist, SwiftPM index, NuGet, Hackage, Hex. For CLIs, the official download page or primary distro package. |
| **Documentation** | link | Dedicated docs site if present, else docs.rs / readthedocs / README. |
| **First Release** | date (year) | Year of first public release. Direction: neutral. |
| **Latest Version** | text | Current stable version string; note the date checked in `comment`. |

### 2. Highlighting Engine

| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Engine Model** | tags | tags: `regex-lexer` (hand-written or declarative regex state-machine lexers: Pygments, Rouge, Chroma, highlight.js, Prism), `textmate-grammar` (TextMate/VS Code grammar interpreter: Shiki, vscode-textmate, starry-night), `sublime-syntax` (syntect), `kde-syntax` (KSyntaxHighlighting, skylighting), `parse-tree` (tree-sitter, Lezer), `custom-parser` (hand-written per-language parsers). Pick the dominant model; add a second only if the tool genuinely offers two engines. |
| **Regex Engine** | tags | Which regex implementation runs the grammars. tags: `oniguruma` (C), `oniguruma-wasm`, `js-regexp` (incl. Oniguruma-to-JS transpilation), `fancy-regex`, `rust-regex`, `pcre`, `python-re`, `ruby-regexp`, `go-regexp2`, `go-regexp`, `boost-regex`, `std-regex`, `n/a` (parse-tree engines). |
| **Embedded Languages** | boolean | Highlights nested languages (CSS/JS inside HTML, fenced code in Markdown, SQL in strings via injections). Must work out of the box for at least HTML+JS+CSS. |
| **Language Auto-Detection** | boolean | Can guess the language from content (highlight.js `highlightAuto`, Pygments `guess_lexer`), not just from filename/extension. |
| **Filename / Extension Mapping** | boolean | Has a built-in filename/extension/shebang/mime → language lookup. |
| **Resumable Line State** | boolean | Exposes per-line parse state that can be saved and resumed (TextMate rule stacks, syntect `ParseState`), enabling line-by-line or viewport highlighting without reparsing from the top. |
| **Incremental Reparsing** | boolean | Can update highlighting after an edit by reusing the previous parse (tree-sitter, Lezer). Stronger than Resumable Line State. |
| **Semantic Distinctions** | boolean | Distinguishes roles beyond lexical class — e.g. function definition vs call, parameter vs local, type vs value — via a syntax tree or locals queries. Pure regex lexers are usually `false`. |

### 3. Language & Grammar Support

| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Bundled Languages** | integer | Number of languages available in the default distribution (higher is better). Count languages, not aliases; note how counted and the version in `comment`. |
| **Grammar Format** | tags | Native grammar definition format. tags: `textmate-json`, `textmate-plist`, `sublime-syntax`, `tree-sitter`, `lezer-grammar`, `kde-xml`, `pygments-lexer` (Python classes), `rouge-lexer`, `chroma-xml`, `highlightjs-language`, `prism-language`, `code` (lexers written in host language). |
| **Grammar Ecosystem Compatibility** | tags | Which *external* grammar ecosystems it can consume directly. tags: `vscode-textmate`, `sublime`, `tree-sitter`, `pygments`, `kde`, `own-only`. Ports that convert grammars at build time (e.g. Chroma importing Pygments lexers) count, with a comment. |
| **Runtime Grammar Loading** | boolean | User can register a new or modified grammar at runtime without forking/rebuilding the library. |
| **Lazy Grammar Loading** | boolean | Grammars are loaded on demand rather than all bundled up front (relevant for bundle size and startup). |
| **Grammar Accuracy** | rating (1–5) | See Assessment Guidelines. Rates how faithfully the bundled grammars for mainstream languages track real syntax (modern syntax, edge cases, nested constructs). |

### 4. Themes & Styling

| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Bundled Themes** | integer | Number of themes/styles shipped by default (higher is better). Note version in `comment`. |
| **Theme Format** | tags | tags: `vscode-theme`, `tmtheme`, `sublime-color-scheme`, `pygments-style`, `chroma-xml` (Chroma XML style files using Pygments style strings), `css-stylesheet`, `kde-theme`, `base16`, `code` (themes defined in host-language code). |
| **Token Classification** | tags | How tokens are named for styling. tags: `textmate-scopes` (hierarchical, e.g. `entity.name.function`), `fixed-taxonomy` (closed set like Pygments `Token.Name.Function`, highlight.js `hljs-title`), `capture-names` (tree-sitter `@function.call`), `highlight-tags` (Lezer `tags.*`). |
| **CSS Class Output** | boolean | Can emit class names instead of inline styles, so styling lives in a stylesheet. |
| **Multi-Theme Output** | boolean | Can render one pass that serves several themes (light/dark) at once, e.g. via CSS variables or multiple class sets (Shiki `themes`, starry-night CSS). Class-based output alone does not count unless themes ship as swappable stylesheets — note which in `comment`. |

### 5. Intermediate Representations

The core differentiator of this comparison: what can an application get *besides* a finished string?

| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Public Token API** | boolean | Exposes a documented, public API that yields tokens/spans without rendering to a final format. |
| **IR Kinds** | tags | tags: `token-list` (flat `(type, text)` pairs), `scope-stack` (TextMate scope stacks per token), `styled-spans` (text + resolved colours/font styles), `highlight-events` (start/end/source events, tree-sitter-highlight style), `hast` (HTML abstract syntax tree, unified ecosystem), `html-dom` (DOM nodes), `syntax-tree` (full parse tree with node types), `json` (documented JSON serialization). |
| **Serializable IR** | boolean | The IR is plain data with a documented serialization (JSON, hast, serde) suitable for caching or sending over the wire — not just in-memory objects. |
| **Theme-Resolved Tokens** | boolean | Can emit tokens with colours/styles already resolved from a theme (for renderers that don't speak CSS: terminals, canvas, native UIs, PDFs). |
| **Source Offsets in IR** | boolean | Tokens/events carry byte or character offsets (or line/column) back into the source. |
| **Custom Formatter API** | boolean | Has a documented extension point for writing your own output formatter/renderer (Pygments `Formatter`, Chroma `Formatter`, syntect `highlighted_html_for_string` alternatives, Shiki transformers on hast). |
| **Line Transforms / Decorations** | boolean | Built-in mechanism to annotate ranges/lines (highlighted lines, diff +/- markers, focus, inline annotations) on the IR before output (e.g. Shiki transformers & decorations). |

### 6. Output Formats

| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Output Formats** | tags | First-party (in the main package or official companion) output targets. tags: `html-inline-styles`, `html-classes`, `ansi-16`, `ansi-256`, `ansi-truecolor`, `latex`, `rtf`, `svg`, `image` (PNG/JPEG/etc.), `bbcode`, `pango-markup`, `odt`, `irc`, `markdown`, `react` / `jsx`. Do not count community plugins; mention them in `comment`. |
| **Line Numbers** | boolean | Built-in line-number output for at least one format. |
| **Streaming Output** | boolean | Can emit output incrementally (line-by-line or chunked) rather than only for a complete input buffer — relevant for pagers and LLM token streams. |
| **Terminal-Ready** | boolean | Ships an ANSI/terminal output path suitable for CLIs without extra glue. |

### 7. Runtime & Integration

| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Native Dependencies** | tags | tags: `none` (pure host language), `c-library` (links Oniguruma, tree-sitter runtime, Boost, Qt, etc. — name it in `comment`), `wasm-embedded` (ships a WASM blob, e.g. Oniguruma-WASM), `optional` (pure fallback available, e.g. syntect `fancy-regex` vs `onig`). |
| **Runs in Browser** | boolean | Usable client-side in a browser without a server. |
| **WASM Build** | boolean | Officially compiles to or ships as WASM (or documented `wasm32` support for native-language candidates). |
| **Synchronous API** | boolean | Can highlight synchronously after setup (no mandatory `await` per call). Note async-only initialisation in `comment`. |
| **Bindings / Ports** | tags | Official or well-known bindings in other languages. tags: `python`, `rust`, `go`, `ruby`, `javascript`, `php`, `swift`, `csharp`, `java`, `elixir`, `none`. Name the binding project in `comment`. |
| **Core Package Size** | filesize | Size of the minimal usable distribution (lower is better): minified+gzipped core for JS (bundlephobia/pkg-size), installed wheel/gem/crate size otherwise. Note exactly what was measured in `comment`; `null` when not comparable. |

### 8. Performance

| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Throughput Tier** | tags | tags: `top-tier`, `fast`, `moderate`, `slow`. Requires an independent or reproducible comparative benchmark (see Assessment Guidelines); otherwise `null`. |
| **Initialization Cost** | tags | tags: `light` (<10 ms to first highlight), `moderate` (10–100 ms), `heavy` (>100 ms, e.g. loading many grammars or a WASM regex engine). Cite measurement or documented behaviour; `null` if unmeasured. |

### 9. Ecosystem & Maintenance

| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **GitHub Stars** | integer | Snapshot; note date in `comment` (higher is better). `null` for projects not on GitHub (note the forge). |
| **Monthly Downloads** | integer | From the primary registry (npm, PyPI via pypistats, crates.io recent downloads ÷3, RubyGems, Packagist, NuGet). Note registry and date in `comment` — cross-registry numbers are only roughly comparable (higher is better). `null` for CLIs without a registry. |
| **Last Release** | date (full) | Most recent stable release (newer is better). |
| **Maintenance Status** | tags | tags: `actively-maintained`, `passively-maintained`, `seeking-maintainer`, `dormant`, `archived`, `superseded` (name successor in `comment`). |
| **Documentation Quality** | rating (1–5) | See Assessment Guidelines. |
| **Notable Users** | text | 2–4 well-known projects or products using it (e.g. bat → syntect, Pandoc → skylighting, GitHub → starry-night grammars/tree-sitter, Hugo → Chroma, Sphinx → Pygments). Links in `source`. |
| **Bus Factor** | tags | tags: `solo`, `small-team`, `organization`. |

## Research Sources

### Primary Sources (Preferred)
1. **Official repository** — README, LICENSE, grammar/theme directories (for counting), CHANGELOG, release cadence, issue triage
2. **Official documentation site** — Shiki docs, Pygments docs (lexers/formatters/styles lists), Chroma README, highlight.js `SUPPORTED_LANGUAGES.md`, tree-sitter docs (highlighting chapter), Lezer guide, KSyntaxHighlighting API docs
3. **Package registries** — npm, PyPI, crates.io, RubyGems, Packagist, NuGet, Hackage, Hex, pkg.go.dev: versions, release dates, first publish, dependencies, downloads
4. **API references** — docs.rs, readthedocs, TypeDoc, Javadoc-style references for verifying IR and formatter APIs
5. **Bundle analysis** — bundlephobia, pkg-size.dev, `npm pack --dry-run` metadata for JS package sizes

### Secondary Sources
6. **Download stats services** — pypistats.org, npm-stat, lib.rs, RubyGems stats
7. **Community benchmarks** — e.g. Shiki vs highlight.js vs Prism comparisons, syntect benchmarks, tree-sitter-highlight vs TextMate measurements. Cite commit/date and who ran it
8. **Consumer projects' source** — bat, delta, Zola, Hugo, Pandoc, GitHub Linguist, Sphinx, Jekyll, Docusaurus, Astro — to verify "notable users" claims via manifests
9. **Blog posts & experience reports** — migration write-ups (e.g. moving from Prism to Shiki, from syntect to tree-sitter); note publication date
10. **Wikipedia / distro package trackers** — for older CLIs (GNU Source-highlight, Andre Simon's highlight) first-release dates and status

### Sources to Approach Carefully
- Language counts in READMEs — often include aliases or community grammars; recount from the grammar directory or the official supported-languages list
- Benchmarks authored by a candidate's maintainer without competitors or reproducible setup
- Comparisons older than ~2 years — Shiki v1+ (JS regex engine, hast, transformers), Prism v2 work, and the Rust TextMate/tree-sitter wave (giallo, arborium, inkjet) changed the landscape

## Assessment Guidelines

- **Engine Model**: Classify by what actually executes at highlight time. Chroma = `regex-lexer` (even though many lexers derive from Pygments). syntect = `sublime-syntax` (it also loads `.tmLanguage`; note in comment). skylighting = `kde-syntax`. Shiki = `textmate-grammar` regardless of regex engine choice.
- **Embedded Languages**: `true` requires working HTML+JS+CSS out of the box; Markdown fenced-code nesting alone is insufficient. Note injection mechanism in `comment` (TextMate `embeddedLanguages`, tree-sitter injections, Pygments `using()`).
- **Semantic Distinctions**: `true` only when the engine tracks structure beyond a lexical state machine (tree-sitter locals/queries, Lezer trees). TextMate grammars with clever regexes that recognise `function foo(` get `false` with a comment.
- **Bundled Languages**: Count distinct languages in the default/full distribution. For tools with "core vs full" bundles (highlight.js, Prism, Shiki), record the full count and note the core count in `comment`.
- **Grammar Accuracy**: 5 = grammars track a mainstream upstream (VS Code / tree-sitter official grammars) with modern syntax (e.g. TS 5, Rust 2024, Python 3.12 f-strings) handled; 4 = mostly current with occasional lag; 3 = solid for common constructs, known gaps on modern or nested syntax; 2 = frequent mis-highlighting reported; 1 = basic keyword/string/comment only. Base on issue tracker evidence and spot checks of TS/Rust/Python; `null` if no evidence.
- **Multi-Theme Output**: `true` requires a documented single-render mechanism for at least light+dark; separate renders per theme do not count.
- **Public Token API / IR Kinds**: Only count APIs that are documented and exported. Internal structures reachable via private fields → `false` with a comment. HTML string output is never an IR.
- **Serializable IR**: hast and documented JSON qualify; Rust structs qualify only with documented `serde` support.
- **Output Formats**: Only first-party formatters. Image output via a headless browser screenshot in a separate project does not count.
- **Streaming Output**: `true` requires a documented API that emits output before the full input is consumed (line-by-line iterators count).
- **Throughput Tier**: Normalise to the fastest candidate in a shared benchmark: `top-tier` within ~1.5×, `fast` 1.5–3×, `moderate` 3–10×, `slow` >10×. Requires an independent or reproducible maintainer benchmark that includes competitors; else `null` with a comment.
- **Documentation Quality**: 5 = dedicated docs site with guides, API reference, language/theme catalog, and migration notes; 4 = guide + good API reference; 3 = solid README + API reference with examples; 2 = sparse API docs; 1 = minimal or stale.
- **Maintenance Status**: `actively-maintained` = release or substantive commit in the last 6 months and issues triaged; `passively-maintained` = bug fixes only, no features in 12+ months; `dormant` = no commit, release, or maintainer response in 24+ months, repo not archived; `archived` = archived or declared unmaintained.
- **When to use `null`**: Unmeasured performance/initialisation claims; package sizes that aren't comparable (CLIs, native libraries); features only on unreleased branches; README and API docs disagreeing. Always add a `comment` explaining why.

## Candidates

- [x] Pygments — the reference Python highlighter; huge lexer catalog, many formatters (HTML, LaTeX, RTF, SVG, image, ANSI), and the ancestor of several ports
- [x] highlight.js — the most widely deployed JS highlighter; auto-detection, zero-dependency, runs in browser and Node
- [x] Prism — lightweight, extensible browser-focused JS highlighter with a plugin system
- [x] Shiki — TextMate-grammar highlighter using VS Code grammars and themes; hast IR, transformers, dual themes, JS or Oniguruma-WASM regex engine
- [x] syntect — Rust highlighter using Sublime Text syntaxes; styled-span IR, ANSI/HTML output; powers bat, delta, Zola
- [x] tree-sitter-highlight — parse-tree-based highlighting with highlight events and language injections; used by GitHub and editors
- [x] Chroma — Go highlighter derived from Pygments lexers; used by Hugo, Gitea, glamour
- [x] Rouge — Pygments-compatible Ruby highlighter; default in Jekyll and GitLab
- [x] starry-night — GitHub-grammar-compatible TextMate highlighter emitting hast; CSS-class themes matching github.com
- [x] vscode-textmate — the TextMate grammar interpreter behind VS Code, usable standalone; scope-stack tokens and resumable rule stacks
- [ ] Lezer (@lezer/highlight) — CodeMirror 6's incremental LR parser system with a standalone highlighting API
- [ ] KSyntaxHighlighting — KDE Frameworks' C++/Qt engine with a large XML syntax catalog; used by Kate and Qt Creator
- [ ] skylighting — Haskell port of KDE syntax definitions; powers Pandoc's highlighting across HTML, LaTeX, docx, ANSI
- [ ] highlight (Andre Simon) — long-standing C++/Lua highlight-first CLI and library with many output formats (HTML, LaTeX, RTF, ODT, SVG, ANSI, BBCode, Pango)
- [ ] GNU Source-highlight — GNU's highlight-first CLI/library with configurable output formats; used for `less` input filters
- [ ] giallo — Rust TextMate-grammar engine aiming for VS Code-faithful highlighting
- [ ] arborium — Rust batteries-included tree-sitter highlighting with many bundled grammars and WASM/browser support
- [ ] inkjet — Rust batteries-included tree-sitter highlighting with bundled grammars and multiple formatters
- [ ] Autumnus — Rust tree-sitter highlighter with Neovim-theme support, backing Elixir's Autumn (verify current name — possibly renamed)
- [ ] Makeup — Elixir highlighter used by ExDoc; Pygments-inspired lexer architecture
- [ ] Phiki — PHP port of Shiki using TextMate grammars and VS Code themes
- [ ] tempest/highlight — PHP highlighter with HTML and terminal output, designed for speed and extensibility
- [ ] TextMateSharp — C# TextMate grammar engine port (from tm4e/vscode-textmate); used by AvaloniaEdit
- [ ] ColorCode-Universal — Microsoft's C# highlighter for HTML and UWP/WinUI rich text output
- [ ] Splash — Swift highlighter with HTML, attributed-string, and image output; used in Swift publishing tools
- [ ] sugar-high — tiny zero-dependency JS highlighter for JSX/JS with CSS-variable theming

### Not Including (with reasons)
- **bat / delta / glow** — consumers of syntect/Chroma, not engines (listed as notable users instead)
- **Monaco / CodeMirror / Ace / RSyntaxTextArea** — editor widgets; underlying engines (vscode-textmate, Lezer) are candidates
- **rehype-pretty-code / Bright / markdown-it-shiki / remark-prism** — thin wrappers around included engines
- **two-face / tree-sitter-langs / Shiki language packs** — grammar bundles; covered by Grammar Ecosystem Compatibility
- **Torchlight / carbon.now.sh / ray.so** — hosted services, not embeddable
- **GeSHi / CodeRay / SHJS / SyntaxHighlighter (Alex Gorbatchev)** — dormant legacy highlighters with maintained successors in the list

## Notes for Researchers

1. **Verify claims from primary sources.** README feature lists overstate; confirm IR and formatter APIs exist in the published API reference before recording `true`.
2. **Cite every value.** Put URLs in `source`; for stars, downloads, language/theme counts, and package sizes, add the date checked and version to `comment`.
3. **Use `null` with a `comment` when uncertain** rather than guessing — especially for throughput, initialisation cost, grammar accuracy, and package size.
4. **Pin the version.** Record which version the research reflects; Shiki 0.x → 1.x → 3.x, highlight.js 10 → 11, and Prism 1 → 2 changed APIs and output materially.
5. **Separate core from full bundles.** For JS highlighters with selectable languages/themes, size and counts must say which bundle they describe.
6. **Check feature flags and optional deps.** syntect (`onig` vs `fancy-regex`), Shiki (JS vs Oniguruma engine), tree-sitter crates (bundled grammars) — record defaults and note alternatives in `comment`.
7. **Ports are their own candidates.** Do not copy values from the upstream engine; verify each port's language count, IR, and outputs independently, and note the lineage in `comment`.
8. **Intermediate-format claims need an example.** Prefer a link to a doc page or test showing the IR's shape (token object fields, event enum, hast output) as the `source`.
9. **Notable users must be traceable** to a manifest, lockfile, or official documentation of the consuming project.
10. **Watch renames and successors.** Several newer Rust/Elixir projects have renamed or merged; note the relationship on Maintenance Status without prejudging which is better.

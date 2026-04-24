# Rust GUI Libraries Research Guide

## Overview

Compare GUI libraries available to Rust developers for building graphical user interfaces — primarily desktop, but increasingly mobile and web. This comparison is agnostic to rendering technology: pure-Rust frameworks rendered via wgpu, bindings to native C/C++ toolkits, webview-based wrappers, and immediate-mode renderers are all in scope.

Users should be able to:
- Choose a library based on paradigm (immediate vs retained, elm vs signals vs react-like)
- Assess platform reach (Windows, macOS, Linux/X11, Linux/Wayland, iOS, Android, web)
- Compare rendering backends (GPU, native toolkit, webview, software)
- Evaluate widget coverage, authoring ergonomics, and styling flexibility
- Gauge maturity, ecosystem health, and corporate backing
- Understand trade-offs between pure Rust and binding-based solutions

## Scope

**Included:**
- Pure Rust GUI libraries with a widget/component model (iced, Slint, egui, Xilem, Floem, etc.)
- Rust bindings to established native GUI toolkits (gtk4-rs, cxx-qt, fltk-rs, imgui-rs, cacao)
- Framework layers built on top of bindings (Relm4 on gtk4-rs)
- Webview-based wrappers that bundle HTML/JS into native apps (Tauri)
- Both immediate-mode and retained-mode paradigms
- Both GPU-accelerated and native-toolkit renderers

**Excluded:**
- Terminal UI libraries (ratatui, cursive) — different category
- Pure SPA/web frameworks that are already in `spa-web-frameworks` (Leptos, Yew, Sycamore, Percy) — Dioxus is the one cross-listed candidate because its desktop/mobile story is substantial
- Windowing-only libraries without a widget layer (winit, glutin, tao, sdl2)
- Low-level 2D rendering crates without a widget/component model (wgpu, vello, skia-safe, raqote, tiny-skia)
- Game-engine-bound UI unless usable standalone (bevy_ui)
- Archived or clearly abandoned projects (Druid — superseded by Xilem; Azul)
- Proprietary commercial engines with Rust bindings where the engine itself is closed-source (sciter-rs)

## Attribute Groups

### 1. General Information

| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **License** | tags | Check Cargo.toml or LICENSE. Common: MIT, Apache-2.0, MPL-2.0, LGPL-3.0, GPL-3.0. Note dual-license (e.g., Slint: GPL-3.0/commercial). |
| **Repository** | link | Primary source repository (GitHub, GitLab, sr.ht). |
| **Crates.io** | link | Main crates.io package page. Use the top-level framework crate, not sub-crates. |
| **Documentation** | link | Primary documentation site (docs.rs, book, or custom). |
| **First Release** | date (year) | Year of first public release or first crates.io publish. |
| **Latest Stable Version** | text | Current stable version from crates.io. |
| **Maintenance Status** | tags | `actively-maintained`, `passively-maintained`, `seeking-maintainer`, `archived`, `abandoned`. Check commits in last 6 months. |
| **Maturity** | tags | `experimental`, `beta`, `stable`, `mature`. Based on API stability, production usage, and years since 1.0. |
| **Corporate Backing** | text | Company or foundation funding development (e.g., "SixtyFPS GmbH" for Slint, "Zed Industries" for GPUI, "Community" if none). |

### 2. Architecture & Paradigm

| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Implementation** | tags | `pure-rust` (no C/C++ at runtime), `rust-bindings` (wraps native toolkit), `webview-wrapper` (hosts HTML/JS), `hybrid` (mix). Verify with `cargo tree`. |
| **Rendering Mode** | tags | `immediate` (redraw every frame from state), `retained` (scene graph persists), `hybrid`. |
| **Reactivity Model** | tags | `elm` (msg-passing / unidirectional), `signals` (fine-grained reactive primitives), `react-like` (virtual-dom or RSX diffing), `callbacks` (traditional event handlers), `retained-tree` (direct widget manipulation). Select all that apply. |
| **Binding Target** | tags | For binding libraries: `gtk`, `qt`, `cocoa`, `wxwidgets`, `fltk`, `imgui`, `webview`, `none` (pure Rust). |
| **Thread Model** | tags | `single-threaded-ui` (main-thread only), `multi-threaded`, `send-sync-widgets`. Most GUI libraries require main-thread for UI. |

### 3. Rendering Backend

| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Renderer** | tags | `wgpu`, `opengl`, `vulkan`, `metal`, `directx`, `skia`, `native-toolkit` (OS-drawn widgets), `webview` (HTML/CSS), `software` (CPU rasterizer), `custom`. Select all supported. |
| **GPU Acceleration** | boolean | UI rendering uses the GPU by default. |
| **HiDPI Support** | boolean | Automatic scaling on Retina/high-DPI displays. |
| **Vector Rendering** | boolean | Resolution-independent drawing (SVG-like primitives) available. |
| **Custom Shaders** | boolean | Apps can inject custom GPU shaders/render passes. |
| **Embedded Custom Rendering** | boolean | Can embed a wgpu/OpenGL viewport for custom 3D/2D content inside the UI. |

### 4. Platform Support

| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Windows** | boolean | Native Windows support (Win32/WinRT, not WSL). |
| **macOS** | boolean | Native macOS support (Apple Silicon + Intel). |
| **Linux X11** | boolean | Works under X11. |
| **Linux Wayland** | boolean | Works natively under Wayland (not just XWayland). |
| **iOS** | boolean | Can deploy to iOS. |
| **Android** | boolean | Can deploy to Android. |
| **Web (WASM)** | boolean | Compiles to WebAssembly and runs in a browser. |
| **Embedded / no_std** | boolean | Supports no_std or microcontroller targets. |

### 5. Authoring & Styling

| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Authoring Style** | tags | `declarative-dsl` (own markup language, e.g., Slint's .slint), `rust-macro` (RSX, view! macros), `imperative-rust` (builder API), `xml` (gtk's Glade/UI files). |
| **Hot Reload** | boolean | UI updates without recompile (may be limited to DSL files or dev mode). |
| **Layout System** | tags | `flexbox`, `grid`, `constraints`, `auto` (widget-driven), `manual` (explicit coords). |
| **Styling Approach** | tags | `css-like`, `theme-api` (Rust theme structs), `stylesheet-dsl`, `inline-props`, `native-toolkit` (OS-themed). |
| **Theme Switching** | boolean | Runtime theme/dark-mode switching supported. |
| **Accessibility** | tags | `accesskit` (cross-platform Rust a11y), `native` (inherited from OS toolkit), `partial`, `none`. |
| **Internationalization** | boolean | Built-in i18n support (RTL, complex scripts, localization). |

### 6. Widget Library

| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Widget Breadth** | rating (1-5, ascending) | 5=rich stdlib (buttons, tables, trees, menus, dialogs, rich text, markdown, charts); 3=common widgets covered; 1=minimal primitives only. |
| **Data Grid / Table** | boolean | Has a virtualized or performant table/grid widget. |
| **Rich Text / Markdown** | boolean | Native rich text rendering or markdown widget. |
| **Tree / Outline** | boolean | Hierarchical tree widget. |
| **Native Menus** | boolean | Platform-native menu bar / context menus. |
| **File Dialogs** | boolean | Native file-open/save dialogs (via rfd or built-in). |
| **Charts / Plotting** | boolean | First-party or well-integrated charting widget. |
| **Custom Widgets** | rating (1-5, ascending) | Ease of authoring custom widgets: 5=documented, minimal boilerplate; 1=requires understanding internals. |

### 7. Integration & Extras

| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Async Runtime Compatible** | tags | `tokio`, `async-std`, `smol`, `native-async` (framework provides its own), `sync-only`. Select all that are supported. |
| **System Tray** | boolean | Tray icon support (may require separate crate). |
| **Notifications** | boolean | Native OS notification integration. |
| **Clipboard** | boolean | Built-in clipboard read/write. |
| **Drag and Drop** | boolean | Native OS drag-and-drop support. |
| **Embedded Webview** | boolean | Can embed a webview component (Tauri, wry, etc.) inside the UI. |
| **Multi-Window** | boolean | Multiple top-level windows supported. |

### 8. Performance & Footprint

| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Binary Size** | tags | `tiny` (<2MB), `small` (2-10MB), `moderate` (10-30MB), `large` (>30MB). Release build of a "hello world" equivalent app, stripped. |
| **Startup Time** | tags | `instant` (<50ms), `fast` (50-200ms), `moderate` (200ms-1s), `slow` (>1s). Cold start of minimal app. |
| **Memory Footprint** | tags | `minimal` (<20MB RSS), `low` (20-80MB), `moderate` (80-200MB), `high` (>200MB). Idle memory of minimal app. |
| **Idle Redraw** | tags | `on-demand` (only redraws on state change), `continuous` (60fps even when idle), `configurable`. Matters for battery life. |
| **Dependency Count** | tags | `minimal` (<50 crates), `moderate` (50-200), `heavy` (>200). From `cargo tree`. |

### 9. Developer Experience

| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Documentation Quality** | rating (1-5, ascending) | 5=book + tutorials + API docs + examples; 3=adequate API docs with examples; 1=minimal or severely outdated. |
| **API Ergonomics** | rating (1-5, ascending) | 5=idiomatic Rust, builders, derive macros; 3=functional but verbose; 1=C-style or awkward. |
| **Examples Count** | tags | `extensive` (>20 examples), `good` (10-20), `limited` (3-10), `minimal` (<3). Official examples in the repo. |
| **Interactive Playground** | link | URL to online playground/REPL/demo gallery, or null. |
| **IDE Tooling** | tags | `lsp` (dedicated language server for DSLs), `syntax-highlighting`, `formatter`, `inspector` (widget-tree inspector), `none`. |
| **Dev Tools / Inspector** | boolean | Runtime widget tree / state inspector (similar to browser devtools). |

### 10. Ecosystem & Community

| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **GitHub Stars** | integer (ascending) | Snapshot star count — will become outdated. |
| **Crates.io Downloads** | integer (ascending) | All-time downloads of the top-level crate. |
| **Last Release** | date (full) | Date of most recent crates.io release. |
| **Notable Production Users** | text | Shipping apps known to use this library (e.g., "Zed editor" for GPUI, "1Password" historically for Electron-alternatives). Null if none widely known. |
| **Community Size** | tags | `large` (active Discord/Matrix >5k, many contributors), `medium` (dedicated chat, regular contributions), `small` (few active contributors), `solo` (single maintainer). |
| **Ecosystem Crates** | tags | `rich` (themes, widgets, integrations widely available), `growing`, `minimal`, `none`. |

## Research Sources

### Primary Sources (Preferred)

1. **Official Repository** — README, examples folder, CHANGELOG, architecture docs.
2. **Official Documentation / Book** — The framework's own guide site if it has one (e.g., Dioxus Docs, Slint Docs, Tauri Docs).
3. **Crates.io** — Version, downloads, feature flags, dependencies.
4. **docs.rs** — API documentation and module structure.
5. **are-we-gui-yet** (https://areweguiyet.com) — Curated index of Rust GUI crates with categorization.

### Secondary Sources

6. **lib.rs** — Alternative metadata view (e.g., lib.rs ranks differently from crates.io).
7. **Reddit r/rust** — Ecosystem discussions, release threads, comparison threads.
8. **"This Week in Rust"** — Release announcements, blog posts, project updates.
9. **GitHub Discussions / Issues** — Real-world usage reports, roadmap threads.
10. **Conference talks** (RustConf, EuroRust) — Architecture deep-dives from maintainers.

### Tertiary / Approach Carefully

11. **Blog posts and comparison articles** — Useful for context; always check publication date (anything >18 months old is likely stale in this space).
12. **Benchmarks from project READMEs** — Cherry-picked; verify with independent benchmarks where possible.
13. **Performance claims without methodology** — Treat as marketing until reproduced.

## Assessment Guidelines

- **Implementation classification** — When in doubt, run `cargo tree` on a minimal example. If you see `gtk4-sys`, `qt-sys`, `cpp!` macros, or similar, it is binding-based. If the only C dependencies are platform glue (`winit` uses platform APIs but is considered pure-Rust in this context), it is pure-Rust. Webview-wrappers depend on `wry` or `webview2` and host HTML/JS content.

- **Rendering Mode** — Immediate-mode frameworks rebuild the UI tree every frame from current state (egui, imgui). Retained-mode frameworks maintain a persistent widget tree that updates on change (iced, Slint, gtk). A few libraries (Makepad) blur the line; mark them `hybrid` and explain in a comment.

- **Reactivity Model** — Multiple tags are common:
  - `elm` — explicit `Message` enum + update function (iced)
  - `signals` — fine-grained reactive primitives (Floem, Dioxus with signals, Leptos-style)
  - `react-like` — RSX/virtual-dom diffing (Dioxus classic, Sycamore)
  - `callbacks` — traditional event handlers (gtk4-rs, fltk-rs)
  - `retained-tree` — mutate widgets directly (imgui, egui is immediate but uses this label for its state mutation pattern)

- **Platform Support** — Only mark `true` if the platform is officially supported and tested by the maintainers. Experimental/community ports go in a comment, not the boolean.

- **Accessibility** — `accesskit` means integrated with the AccessKit crate (cross-platform screen-reader support in Rust). `native` means the library inherits a11y from its underlying toolkit (gtk, cocoa). `partial` means some hooks exist but coverage is incomplete.

- **API Ergonomics Rating**:
  - **5** — Derive macros, builder patterns, type-safe events, excellent error handling
  - **4** — Mostly idiomatic with minor friction (e.g., lifetimes leaking into widget definitions)
  - **3** — Functional but verbose; some awkward patterns
  - **2** — Significant boilerplate or unsafe required in user code
  - **1** — C-style API, poor error handling, heavy unsafe surface

- **Documentation Quality Rating**:
  - **5** — Book/guide + tutorials + migration docs + extensive examples (Slint, Tauri, Dioxus)
  - **4** — Good API docs + guides + examples (iced, egui)
  - **3** — Adequate API docs + some examples
  - **2** — Minimal documentation; few examples
  - **1** — Missing or severely outdated

- **Widget Breadth Rating**:
  - **5** — Rich stdlib including tables, trees, rich text, markdown, charts, advanced dialogs (gtk, Qt)
  - **4** — Most common widgets + a few advanced (iced, Slint)
  - **3** — Common widgets (buttons, inputs, containers, lists) well covered
  - **2** — Basic widgets only
  - **1** — Primitives only, user builds most widgets themselves (egui is 3-4 despite being immediate, because its stdlib is rich)

- **Binary / Startup / Memory** — Measure a "hello world" app (one window, one button) in release mode, stripped. Note the measurement date and host OS in a comment because these numbers drift.

- **Tauri special handling** — Tauri is a webview-wrapper where the UI is authored in JS/HTML/CSS via a separate web framework. Treat the Rust side (IPC, system integration) as the subject of comparison. The "authoring style" for the UI itself is webview + whatever JS framework the user picks; use the comment field to clarify this is an app-shell tool rather than a widget library in the traditional sense.

- **Dioxus special handling** — Dioxus targets web, desktop, mobile, and TUI. In this comparison, evaluate it in the desktop/mobile context (via `dioxus-desktop` and `dioxus-mobile`). The web story lives in `spa-web-frameworks`.

### When to Use `null`

- Platform support that cannot be verified as official (don't guess "probably works on Wayland")
- Performance numbers without a reliable measurement
- Production users claimed only via marketing
- Features behind unstable/experimental feature flags that may be removed
- Conflicting information between sources (prefer null + a comment explaining the conflict)

## Candidates

- [x] **iced** — Elm-inspired, pure-Rust, wgpu renderer, active and popular
- [x] **egui** — Immediate-mode, pure-Rust, easy to embed, widely used for tooling UIs
- [x] **Slint** — Declarative DSL, GPL/commercial dual-license, corporate-backed (SixtyFPS GmbH), cross-platform including embedded
- [x] **Dioxus (desktop/mobile)** — React-like / signals, cross-platform, includes mobile targets
- [x] **Xilem** — Raph Levien's successor to Druid, architectural showcase, still early
- [x] **Floem** — SolidJS-inspired signals, powers the Lapce editor
- [x] **Makepad** — Live-coding IDE and in-house framework, unique DSL and rendering
- [x] **Ribir** — Declarative, reactive, pure-Rust
- [ ] **Freya** — Skia-backed renderer for Dioxus components
- [ ] **GPUI** — Zed editor's in-house GPU-accelerated framework, opened up for external use
- [ ] **Vizia** — Declarative, audio-plugin-friendly
- [ ] **gtk4-rs** — Official GTK 4 bindings for Rust
- [ ] **Relm4** — Elm-style framework layered on top of gtk4-rs
- [ ] **cxx-qt** — Modern Qt bindings using CXX, KDAB-maintained
- [ ] **fltk-rs** — FLTK bindings, tiny binaries, cross-platform
- [ ] **imgui-rs** — Dear ImGui bindings, immediate-mode, popular for game tooling
- [ ] **cacao** — Rust bindings to Apple's AppKit (macOS-only, native Cocoa)
- [ ] **Tauri** — Webview-wrapper app shell; UI authored in HTML/JS, Rust provides IPC and system integration

### Not Including (with reasons)

- **Druid** — Archived / superseded by Xilem from the same author. Xilem represents the current direction.
- **Azul** — Long periods of inactivity, not production-ready.
- **winit / tao / glutin** — Windowing and event-loop crates; no widget layer.
- **wgpu / vello / skia-safe / raqote / tiny-skia** — Rendering primitives, not GUI frameworks.
- **bevy_ui** — Part of the Bevy game engine; not standalone enough for this comparison.
- **ratatui / cursive** — Terminal UI, different category entirely.
- **Leptos / Yew / Sycamore / Percy** — Web SPA frameworks, covered in `spa-web-frameworks`.
- **sciter-rs** — Bindings to a proprietary closed-source engine; licensing and transparency make cross-comparison awkward.
- **wxRust** — wxWidgets bindings appear stale; revisit if activity resumes.
- **libui-ng bindings** — Niche and thinly maintained.

## Notes for Researchers

1. **Verify "pure Rust" with `cargo tree`** — Some libraries advertise pure-Rust but pull in C dependencies via optional features (e.g., font rendering via freetype). Distinguish the default feature set from the maximal one.

2. **Check feature flags** — Most Rust GUI libraries have substantial feature-flag surfaces (e.g., iced has `wgpu` vs `tiny-skia` backends, different platforms, accessibility). Research the default features and note significant opt-ins.

3. **Platform support changes frequently** — Wayland support in particular has shifted a lot in 2024-2026. Verify with recent release notes, not old documentation.

4. **Distinguish framework vs binding ergonomics** — A framework built on top of a binding (Relm4 on gtk4-rs) often has very different ergonomics from the raw binding. Research each entry as its own product.

5. **Reactivity is evolving** — Many Rust GUI libraries have added or are adding fine-grained signals (Dioxus, Floem, Leptos). Note the current reactivity model; the historical one may be documented in older material.

6. **Commercial / licensing nuance** — Slint, GPUI, Sciter have commercial or restrictive licensing tiers. Capture the primary open-source license in the tags but clarify commercial options in a comment.

7. **Production usage signals** — Zed (GPUI), Lapce (Floem), various KDE apps (cxx-qt), the Slint demo portfolio, and Tauri's production user list are good anchors. Avoid listing "tutorials" as production users.

8. **Benchmarks age fast** — Any performance claim older than ~12 months should be re-verified or marked stale. Frameworks optimize continuously.

9. **Don't conflate "cross-platform" with "equal quality on every platform"** — Many libraries support macOS and Linux but have rougher Windows support, or vice versa. If quality varies materially, note it in comments.

10. **Accessibility claims need specifics** — "Accessible" without naming a concrete a11y layer (AccessKit, native toolkit a11y) is unreliable. Require a verifiable mechanism.

11. **Hot reload varies widely** — Slint reloads `.slint` files; Dioxus has a hot-reload mode for RSX; most imperative-Rust frameworks require a recompile. Classify precisely.

12. **Dioxus targets overlap comparisons** — When researching Dioxus here, focus on `dioxus-desktop` and `dioxus-mobile`. Cross-link to the SPA framework entry in comments where relevant.

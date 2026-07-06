# Rust Game Engines Research Guide

## Overview

Compare game engines and game-development frameworks available to Rust developers — from full ECS engines with visual editors (Bevy, Fyrox) to lightweight code-first frameworks (Macroquad, ggez, comfy), creative-coding toolkits (Nannou), and mature bindings that let you drive a non-Rust engine from Rust (godot-rust, raylib-rs). The comparison is agnostic to dimensionality (2D, 3D, or both) and to whether the tool ships an editor or is purely code-driven.

Users should be able to:
- Choose a tool by kind (full engine vs framework vs bindings vs creative-coding) and by 2D/3D focus
- Assess architecture (ECS vs scene-graph, scripting options, data-driven scenes)
- Judge editor and tooling maturity (visual editor, live inspector, asset pipeline, hot reload)
- Compare rendering capabilities (rendering backend, PBR, lighting, shaders, particles)
- Evaluate built-in engine systems (physics, audio, animation, UI, input, networking)
- Gauge platform reach, including web (WASM), mobile, and consoles
- Understand the Rust-specific cost of compile times and binary size
- Weigh ecosystem health: shipped titles, community size, plugin availability, and learning resources

## Scope

**Included:**
- Full game engines with a scene model and (often) a visual editor (Bevy, Fyrox)
- Code-first game frameworks / "game libraries" with a render+input+audio game loop (Macroquad, ggez, comfy, notan, Emerald)
- Creative-coding and generative toolkits usable for games (Nannou)
- Genre-specialized toolkits with a coherent engine surface (bracket-lib for roguelikes)
- Retro/fantasy-console-style engines (Turbo)
- Mature Rust bindings to established non-Rust engines, where Rust is a first-class scripting/gameplay language (godot-rust / gdext for Godot 4, raylib-rs for raylib)
- Both 2D-only and 3D-capable tools

**Excluded:**
- Engine sub-components that are not engines on their own: ECS libraries (hecs, specs, bevy_ecs standalone), renderers (rend3, kajiya, wgpu, vello), physics crates (rapier, avian), audio crates (kira, rodio) — these are candidates for the engine's *system* attributes, not standalone entries
- Windowing / low-level bindings without a game-engine surface (winit, sdl2, glfw-rs)
- GUI toolkits (covered in `rust-gui`)
- Clearly archived or abandoned projects: Amethyst (deprecated, redirects to Bevy), Piston (dormant/modular experiment), Tetra (archived), Quicksilver (archived), Ambient (company wound down, repo archived)
- Proprietary closed-source engines with only thin, unofficial Rust bindings

## Attribute Groups

### 1. General Information

| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Kind** | tags | tags: `full-engine`, `framework`, `creative-coding`, `bindings`. Select the primary character; may list two (e.g. Bevy is `full-engine`, Macroquad is `framework`). |
| **License** | tags | Check LICENSE / Cargo.toml. Common: `MIT`, `Apache-2.0`, `MIT/Apache-2.0` (dual), `Zlib`, `MPL-2.0`. Note any binding whose underlying engine has a different license (e.g. Godot is MIT). |
| **Repository** | link | Primary source repository (usually GitHub). |
| **Crates.io** | link | Main crates.io package page for the top-level crate. `null` if not published (e.g. an editor-first engine distributed differently). |
| **Documentation** | link | Primary docs site — book, mdBook, or docs.rs. |
| **First Release** | date (year) | Year of first public release or first crates.io publish. Direction: neutral. |
| **Latest Stable Version** | text | Current stable version from crates.io / releases page. |
| **Maintenance Status** | tags | tags: `actively-maintained`, `passively-maintained`, `seeking-maintainer`, `archived`. Judge from commit cadence over the last 6 months. |
| **Maturity** | tags | tags: `experimental`, `beta`, `stable`, `mature`. Based on API stability, shipped games, and years since first release. Most Rust engines are pre-1.0. |
| **Backing** | text | Company, foundation, or funding model (e.g. "Bevy Foundation", "Fyrox — single lead maintainer + Patreon", "Community"). `null` if unclear. |

### 2. Architecture & Programming Model

| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Implementation** | tags | tags: `pure-rust`, `bindings` (wraps a non-Rust engine). Verify with `cargo tree` — bindings pull in `*-sys` crates or a bundled engine. |
| **Architecture** | tags | tags: `ecs` (entity-component-system), `scene-graph` (node tree), `object-oriented`, `immediate` (redraw-from-state loop). Select all that apply; note the dominant one in a comment. |
| **Built-in ECS** | boolean | Ships a first-class ECS as the primary data model. Bevy=true; godot-rust=false (node-based). |
| **Dimensionality** | tags | tags: `2d`, `3d`. Select all supported with real first-party tooling (not just "you could draw 3D by hand"). |
| **Scripting** | tags | tags: `rust-only`, `lua`, `rhai`, `wasm`, `gdscript`, `c#`, `visual`, `none`. What gameplay logic can be written in besides core Rust. |
| **Data-driven Scenes** | boolean | Scenes/prefabs can be authored and serialized to files (RON, scene format, .tscn) and loaded at runtime, not only built in code. |
| **Reflection / Serialization** | boolean | First-class runtime reflection or (de)serialization of game state (e.g. Bevy Reflect, serde-backed scenes). |
| **Hot Reload** | boolean | Code or asset hot-reloading in dev (asset watch, scripting reload, or dylib reload). Clarify scope in a comment. |

### 3. Editor & Tooling

| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Visual Editor** | boolean | Ships a graphical scene/level editor (Fyrox editor, Godot editor via godot-rust). Frameworks like Macroquad = false. |
| **Live Inspector** | boolean | Runtime entity/component/world inspector (e.g. bevy-inspector-egui, Fyrox inspector). May be first-party or the de-facto community tool — note which in a comment. |
| **Asset Pipeline** | rating (1-5, ascending) | 5 = import/processing pipeline with reprocessing + hot reload; 3 = basic async asset loading of common formats; 1 = manual file loading only. |
| **CLI / Project Tooling** | tags | tags: `cli` (dedicated command-line tool), `cargo-plugin`, `templates` (starter projects), `none`. |
| **Debug / Profiling Tools** | tags | tags: `built-in-profiler`, `tracy`, `egui-overlay`, `diagnostics`, `none`. Select all that apply. |
| **IDE Support** | text | Notable editor/IDE integrations or extensions (e.g. rust-analyzer just works; Godot editor for godot-rust). `null` if nothing beyond standard Rust tooling. |

### 4. Rendering & Graphics

| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Rendering Backend** | tags | tags: `wgpu`, `opengl`, `vulkan`, `metal`, `directx`, `webgl`, `webgpu`, `miniquad`, `custom`. Select all supported. |
| **PBR** | boolean | Physically-based rendering pipeline available for 3D. `false` for 2D-only tools. |
| **Lighting** | tags | tags: `forward`, `deferred`, `clustered`, `baked-gi`, `realtime-gi`, `2d-lighting`, `none`. Select what's supported first-party. |
| **Shadows** | boolean | Real-time shadow mapping (3D) or 2D shadow support. |
| **Custom Shaders** | boolean | User can author custom shaders (WGSL/GLSL/shader graph) and slot them into the pipeline. |
| **Sprites & Tilemaps** | boolean | First-party or de-facto sprite batching and tilemap support. Note plugin vs built-in in a comment. |
| **Particle System** | boolean | Built-in or well-integrated particle/VFX system. |
| **Post-processing** | boolean | Post-processing effects (bloom, tonemapping, FXAA/TAA) available. |
| **Text Rendering** | boolean | Built-in font/text rendering (glyph atlas, layout). |

### 5. Engine Systems

| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Physics** | tags | tags: `built-in`, `rapier`, `avian`, `box2d`, `plugin`, `none`. How physics is provided — bundled, official plugin, or bring-your-own. |
| **Audio** | tags | tags: `built-in`, `kira`, `rodio`, `oddio`, `plugin`, `none`. |
| **Input** | tags | tags: `keyboard-mouse`, `gamepad`, `touch`. Select all first-party supported. |
| **Animation** | tags | tags: `skeletal`, `sprite-frame`, `tween`, `state-machine`, `none`. |
| **UI System** | tags | tags: `built-in`, `egui`, `bevy_ui`, `plugin`, `none`. In-game/tooling UI approach. |
| **Networking** | tags | tags: `built-in`, `plugin`, `none`. Multiplayer/replication support (e.g. Lightyear/renet as plugins for Bevy). Note in a comment. |
| **glTF / Model Import** | boolean | Loads standard 3D model formats (glTF/GLB). `false` for 2D-only tools. |

### 6. Platform Support

| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Windows** | boolean | Native Windows target. |
| **macOS** | boolean | Native macOS (Apple Silicon + Intel). |
| **Linux** | boolean | Native Linux (X11 and/or Wayland). Note if only one in a comment. |
| **Web (WASM)** | boolean | Compiles to WebAssembly and runs in a browser. Very common differentiator in Rust gamedev. |
| **iOS** | boolean | Ships to iOS. Only mark true if officially supported/tested. |
| **Android** | boolean | Ships to Android. |
| **Consoles** | tags | tags: `switch`, `playstation`, `xbox`, `none`. Console support is often gated behind NDA/community forks — only mark specific platforms with a verifiable path; explain in a comment. |

### 7. Performance & Footprint

| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Clean Build Time** | duration | Cold release build of a minimal "hello window" project, from a clean target dir. Direction: descending (faster is better). A major Rust-gamedev pain point — Bevy vs Macroquad differ enormously. Record host CPU + date in a comment. |
| **Incremental Build Time** | tags | tags: `instant` (<2s), `fast` (2-10s), `moderate` (10-30s), `slow` (>30s). Rebuild after a one-line gameplay change. Note whether dynamic linking / mold / cranelift was used. |
| **Binary Size** | tags | tags: `tiny` (<5MB), `small` (5-20MB), `moderate` (20-60MB), `large` (>60MB). Stripped release build of a minimal app. |
| **Web Bundle Size** | tags | tags: `tiny` (<2MB), `small` (2-8MB), `moderate` (8-20MB), `large` (>20MB), `n/a`. WASM binary of a minimal app (post-wasm-opt). Only for web-capable tools. |
| **Runtime Overhead** | tags | tags: `minimal`, `low`, `moderate`, `heavy`. Subjective idle CPU/memory of a trivial app. Note methodology in a comment; prefer `null` over a guess. |

### 8. Ecosystem & Community

| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **GitHub Stars** | integer (ascending) | Snapshot star count — will go stale; record the date in a comment. |
| **Crates.io Downloads** | integer (ascending) | All-time downloads of the top-level crate. `null` for editor-first engines not on crates.io. |
| **Last Release** | date (full) | Date of the most recent tagged/crates.io release. |
| **Shipped Titles** | text | Notable released games known to use this engine (e.g. Tiny Glade for Bevy). `null` if none widely documented. Avoid listing jam prototypes. |
| **Community Size** | tags | tags: `large` (active Discord/forum >5k, many contributors), `medium` (dedicated chat, regular contributions), `small` (few active contributors), `solo` (single maintainer). |
| **Plugin / Asset Ecosystem** | tags | tags: `rich`, `growing`, `minimal`, `none`. Availability of third-party plugins/crates (e.g. Bevy Assets registry). |
| **Learning Resources** | rating (1-5, ascending) | 5 = official book + tutorials + many videos + examples; 3 = decent examples + some guides; 1 = README + sparse examples only. |

## Research Sources

### Primary Sources (Preferred)

1. **Official Repository** — README, `examples/`, CHANGELOG, migration guides, architecture docs.
2. **Official Book / Docs Site** — e.g. Bevy Book / Bevy Quickstart, Fyrox Book, godot-rust Book, Macroquad docs.
3. **Crates.io & docs.rs** — versions, downloads, feature flags, dependency tree, API surface.
4. **Are We Game Yet?** (https://arewegameyet.rs) — curated index of Rust gamedev crates by category (engines, ecs, physics, audio, etc.).
5. **Official release notes / blog** — Bevy's per-release blog posts are especially thorough for feature and perf claims.

### Secondary Sources

6. **lib.rs** — alternative crate metadata and ranking view.
7. **This Week in Rust / This Month in Bevy (or Fyrox)** — release cadence, ecosystem updates.
8. **Reddit r/rust_gamedev and r/rust** — real-world experience, comparison threads, "what engine should I use" discussions.
9. **GitHub Discussions / Issues / Discord** — roadmap, platform-support status, known limitations.
10. **Conference talks (RustConf, game jams post-mortems)** — architecture and shipped-game insights.

### Tertiary / Approach Carefully

11. **Blog comparison posts** — useful for orientation; always check the date — anything >12 months old is likely stale in this fast-moving space.
12. **README benchmarks / perf claims** — often cherry-picked; verify build-time and size numbers yourself where feasible.
13. **"Made with X" showcase pages** — good for shipped-title leads, but confirm the game actually released.

## Assessment Guidelines

- **Kind classification** — `full-engine` = scene model + editor and/or structured runtime with an asset pipeline (Bevy, Fyrox, Godot-via-godot-rust). `framework` = code-first game loop with rendering/input/audio but no editor (Macroquad, ggez, comfy, notan, Emerald). `creative-coding` = generative/visual-art focus, games are a secondary use (Nannou). `bindings` = Rust is a scripting layer over a non-Rust engine (godot-rust, raylib-rs). When a tool straddles two, pick the primary and note the secondary in a comment.
- **Implementation** — Run `cargo tree` on a minimal example. `bindings` pull in a `-sys` crate or bundle a C/C++ engine (raylib, Godot). Everything rendered/simulated in Rust with only platform glue counts as `pure-rust`.
- **Built-in ECS** — Only `true` if an ECS is *the* primary way you structure a game (Bevy). Engines that offer an optional ECS crate but are node-based at heart (Godot via godot-rust) are `false` with a comment.
- **Dimensionality** — Mark `3d` only when there is genuine first-party 3D tooling (camera, meshes, lighting). A 2D framework where you *could* hand-roll perspective is `2d`.
- **Physics / Audio / UI / Networking tags** — Distinguish `built-in` (ships in the core crate), an official/first-party `plugin`, and `none` (bring-your-own). For Bevy specifically, most of these are community plugins — tag `plugin` and name the de-facto choice (rapier/avian, kira) in a comment rather than overstating built-in coverage.
- **Consoles** — Console support is frequently NDA-gated, community-maintained, or fork-only. Only tag a specific console when there is a documented, reproducible path; otherwise `none` with a comment explaining any unofficial routes.
- **Build-time measurements** — This is a headline differentiator for Rust engines. Measure a clean release build of the smallest runnable example on a stated machine, and record CPU, OS, toolchain, and whether dynamic linking / `mold` / `cranelift` were used. If you cannot measure consistently, prefer `null` + comment over an unreliable number.
- **Binary / bundle sizes** — Stripped release build of a minimal app; note wasm-opt for web bundles. Record the measurement date — these drift.
- **Asset Pipeline rating**:
  - **5** — Import + processing pipeline, reprocessing, hot reload, and a broad format set (Bevy AssetServer, Fyrox resource manager)
  - **3** — Async loading of common formats (images, audio, fonts) with reasonable ergonomics
  - **1** — Manual `include_bytes!` / raw file reads only
- **Learning Resources rating**:
  - **5** — Official book + step-by-step tutorials + rich examples + active video ecosystem (Bevy)
  - **3** — Solid examples + some written guides
  - **1** — README plus a handful of examples, little else
- **Maturity vs stars** — A high star count does not imply production readiness in this space. Anchor `maturity` to API churn (how often releases break code) and shipped titles, not popularity.

### When to Use `null`

- Platform or console support that cannot be verified as officially supported (don't guess "probably runs on Switch")
- Build-time / size / memory numbers you could not measure reliably
- Shipped titles known only from marketing or unreleased projects
- Features behind experimental feature flags that may be removed
- Conflicting information between sources (prefer `null` + a comment describing the conflict)
- `Crates.io` / `Crates.io Downloads` for engines distributed primarily as an editor rather than a crate

## Candidates

- [x] **Bevy** — Flagship pure-Rust engine; ECS-first, data-driven, wgpu renderer, huge community and plugin ecosystem
- [x] **Fyrox** — Full 3D/2D engine with a native visual scene editor and resource manager (formerly rg3d)
- [x] **Macroquad** — Minimal, extremely fast-compiling cross-platform 2D/3D framework built on miniquad; excellent web support
- [x] **ggez** — LÖVE-inspired lightweight 2D framework, long-standing and approachable
- [x] **comfy** — Opinionated, batteries-included 2D game engine built on wgpu, designed for fast iteration
- [x] **Nannou** — Creative-coding framework for generative art and interactive visuals, usable for games
- [x] **notan** — Portable, modular multimedia/game framework with strong web support
- [x] **Emerald** — Lightweight, portable 2D engine with built-in physics and audio
- [x] **bracket-lib** — Roguelike toolkit (formerly RLTK) — virtual terminals, pathfinding, FOV, RNG; the de-facto Rust roguelike engine
- [ ] **godot-rust (gdext)** — Official Rust bindings for Godot 4; drive the mature Godot engine and editor with Rust gameplay code
- [ ] **raylib-rs** — Rust bindings to raylib, the popular simple C game library; large tutorial ecosystem
- [ ] **Turbo** — Rust-first retro/fantasy-console-style game engine targeting fast iteration and WASM

### Not Including (with reasons)

- **Amethyst** — Officially deprecated; the team recommends Bevy. Historically important but dead.
- **Piston** — Long-dormant modular experiment; no coherent current engine surface.
- **Tetra / Quicksilver** — Archived 2D frameworks, no longer maintained.
- **Ambient** — Multiplayer engine whose backing company wound down; repository archived.
- **hecs / specs / bevy_ecs (standalone)** — ECS libraries, not engines; they are inputs to an engine's architecture attributes.
- **rend3 / kajiya / wgpu / vello** — Renderers, not engines.
- **rapier / avian / kira / rodio** — Physics and audio crates; they populate engine *system* attributes, not standalone entries.
- **winit / sdl2 / glfw-rs** — Windowing/low-level bindings without a game-engine surface.
- **Bones (bones_framework)** — Niche ECS-based framework tied to Fish Folk games; revisit if it gains broader standalone adoption.

## Notes for Researchers

1. **Verify "pure Rust" with `cargo tree`** — Some tools pull C dependencies via optional features (audio, image codecs). Distinguish default features from the maximal set, and separate genuine bindings (raylib, Godot) from pure-Rust engines with minor platform glue.
2. **Cite sources with URLs** — Record the exact page (release notes, book chapter, crates.io) for every non-obvious value; store it in the candidate's `source` array.
3. **Date every volatile fact** — Stars, downloads, versions, build times, and platform-support status all drift fast here. Note the observation date in a comment.
4. **Distinguish core vs plugin** — In Bevy-style ecosystems, much functionality (physics, networking, advanced UI) lives in community plugins. Tag `plugin` and name the de-facto choice rather than implying it's built in.
5. **Build times are a first-class attribute** — Measure them; don't skip. They are one of the most decision-relevant differences between Rust engines and deserve consistent methodology.
6. **Platform claims need verification** — Only mark iOS/Android/console/Wayland `true` when officially supported and tested. Community ports go in a comment, not the boolean.
7. **Web support is a key differentiator** — Many Rust engines target WASM, but quality and bundle size vary widely. Verify it actually runs in a browser and note the bundle size.
8. **Bindings inherit the host engine's capabilities** — For godot-rust and raylib-rs, many attributes (editor, rendering, physics) reflect Godot/raylib itself. Note in comments where a capability comes from the underlying engine vs the Rust binding layer.
9. **Admit uncertainty** — When research is ambiguous or sources conflict, use `null` with an explanatory comment rather than recording a guess.
10. **Re-verify perf and feature claims from READMEs** — Treat project self-benchmarks and feature lists as marketing until confirmed against release notes or independent reports.

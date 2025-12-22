# Rust Embedded Databases Research Guide

## Overview

Compare embedded/embeddable databases that are either written in Rust or have first-class Rust bindings. This comparison helps Rust developers choose the right embedded database for their applications by evaluating features, Rust integration quality, reliability, and ecosystem maturity.

Users should be able to:
- Find databases matching their data model needs (key-value, SQL, document)
- Assess Rust API quality and safety characteristics
- Compare reliability and ACID guarantees
- Evaluate platform compatibility and async support
- Gauge project maturity and maintenance status

## Scope

**Included:**
- Pure Rust database implementations
- Rust bindings to C/C++ embedded databases with active maintenance
- Key-value stores
- Document databases
- Embedded SQL databases
- Both persistent and in-memory databases

**Excluded:**
- Client-server databases (PostgreSQL, MySQL, etc.)
- Databases without Rust bindings or with abandoned/unmaintained bindings
- Pure caching layers without database semantics (use rust-caching comparison instead)
- Distributed databases requiring cluster setup
- Search engines (Tantivy, MeiliSearch) - different category

## Attribute Groups

### 1. General Information

| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **License** | tags | Check Cargo.toml or LICENSE file. Common: MIT, Apache-2.0, BSD-3-Clause, MPL-2.0. Dual-license counts as multiple tags. |
| **Implementation** | tags | `pure-rust` if no C/C++ dependencies; `rust-bindings` if wrapping native library; `hybrid` if Rust with some native components |
| **Repository** | link | Primary source repository (GitHub, GitLab, etc.) |
| **Crates.io** | link | Link to crates.io package page |
| **Documentation** | link | Link to docs.rs or custom documentation site |
| **First Release** | date (year) | Year of first public release or first crates.io publish |
| **Latest Stable Version** | text | Current stable version number from crates.io |

### 2. Data Model

| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Database Type** | tags | Primary data model: `key-value`, `document`, `sql`, `graph`, `column-family`. Multiple if truly multi-model. |
| **Schema Model** | tags | `schemaless` (arbitrary data), `typed` (Rust types define schema), `sql-schema` (DDL-defined), `flexible` (optional schema) |
| **Query Language** | text | SQL, custom DSL, API-only, or specific query syntax name |
| **Transactions** | boolean | Supports ACID transactions. `true` only if full ACID; mention limitations in comment. |
| **Range Queries** | boolean | Supports ordered key iteration/range scans. Essential for time-series or sorted access patterns. |
| **Secondary Indexes** | boolean | Can query by non-primary-key fields. Note if manual or automatic in comment. |
| **In-Memory Mode** | boolean | Can operate purely in-memory without disk persistence |
| **Persistent Storage** | boolean | Supports durable on-disk storage |

### 3. Storage Engine

| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Storage Architecture** | text | Core storage design: LSM-tree, B+tree, B-tree, append-only log, copy-on-write B+tree, etc. |
| **Compression** | boolean | Built-in data compression support. Note algorithms in comment (LZ4, Snappy, Zstd). |
| **Encryption at Rest** | boolean | Native support for encrypting stored data. `true` only for built-in; external encryption doesn't count. |
| **Memory-Mapped I/O** | boolean | Uses mmap for file access. Note: can affect behavior on network filesystems. |
| **Max Database Size** | text | Known size limits or "unlimited". Note practical limits observed in issues/docs. |

### 4. Rust Integration

| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Pure Rust** | boolean | No C/C++ dependencies in the dependency tree. Check with `cargo tree` for native code. |
| **Async/Tokio Support** | tags | `native-async` (built-in async API), `tokio-compatible` (spawn_blocking friendly), `sync-only` (blocking API only), `async-wrapper` (community async wrapper available) |
| **API Safety** | tags | `fully-safe` (no unsafe in public API), `minimal-unsafe` (unsafe contained internally), `unsafe-required` (users must write unsafe), `ffi-unsafe` (C bindings require unsafe) |
| **Idiomatic API** | rating 1-5 | Subjective: 5=excellent Rust patterns, iterators, error handling; 1=C-style API or awkward patterns |
| **Type Safety** | tags | `generic` (works with any Serialize type), `typed-keys` (type-safe key spaces), `byte-oriented` (raw bytes API), `sql-typed` (SQL type mapping) |
| **Serde Integration** | boolean | Native serde support for serializing/deserializing values |
| **no_std Compatible** | boolean | Can compile without standard library. Check Cargo.toml features. |
| **WASM Compatible** | boolean | Works in WebAssembly (browser or WASI). Check for wasm32 target support. |

### 5. Reliability & Concurrency

| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **ACID Compliant** | boolean | Full ACID guarantees. Partial compliance should be `false` with explanation in comment. |
| **Crash Recovery** | boolean | Automatically recovers consistent state after unexpected shutdown |
| **Concurrent Readers** | boolean | Multiple threads/processes can read simultaneously |
| **Concurrent Writers** | boolean | Multiple threads can write simultaneously. Note if serialized or truly concurrent in comment. |
| **Multi-Process Access** | boolean | Safe access from multiple OS processes to same database file |
| **Write-Ahead Log** | boolean | Uses WAL for durability. Important for crash recovery characteristics. |
| **Maturity** | tags | `experimental` (not production ready), `beta` (usable but evolving), `stable` (production ready), `mature` (battle-tested, years of production use) |

### 6. Platform Support

| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Linux** | boolean | Supported on Linux. Check CI and documented platforms. |
| **macOS** | boolean | Supported on macOS |
| **Windows** | boolean | Supported on Windows. Note any limitations in comment. |
| **iOS** | boolean | Can be built for iOS targets |
| **Android** | boolean | Can be built for Android targets |
| **Embedded/no_std** | boolean | Usable on embedded systems without OS |

### 7. Use Cases

| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Use Cases** | tags | Select all that apply: `config-storage`, `application-state`, `caching`, `time-series`, `session-storage`, `document-store`, `full-text-search`, `analytics`, `iot-edge`, `mobile-app`, `desktop-app`, `cli-tool`, `web-backend` |

### 8. Community & Maintenance

| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **GitHub Stars** | integer | Star count from repository (snapshot, will become outdated) |
| **Crates.io Downloads** | integer | All-time downloads from crates.io |
| **Last Release** | date | Date of most recent crates.io release |
| **Maintenance Status** | tags | `actively-maintained`, `passively-maintained` (bug fixes only), `seeking-maintainer`, `archived`, `abandoned` |
| **Documentation Quality** | rating 1-5 | 5=comprehensive with examples; 3=adequate API docs; 1=minimal or outdated |
| **Bus Factor** | tags | `solo` (single maintainer), `small-team` (2-5), `organization` (company-backed or large team) |

## Research Sources

### Primary Sources (Preferred)
1. **Crates.io** - Version info, downloads, dependencies, features
2. **Official Repository** - README, issues, CI configuration, recent commits
3. **docs.rs** - API documentation, examples
4. **Official Documentation Site** - If separate from docs.rs

### Secondary Sources
5. **GitHub Topics/Awesome Lists** - Discovery of candidates
6. **lib.rs** - Alternative crate metadata and categorization
7. **Reddit r/rust** - Community discussions, experience reports
8. **Blog Posts** - Benchmark comparisons, migration stories (note date)

### Sources to Approach Carefully
- Old benchmarks (performance characteristics change significantly between versions)
- Forum posts older than 2 years
- Unmaintained awesome lists

## Assessment Guidelines

### Maturity Assessment
- **experimental**: Explicitly marked as not production ready, or < 0.1.0, or major known issues
- **beta**: Usable but API still changing, or limited production use reported
- **stable**: 1.0+ release or explicit production-ready status, stable API
- **mature**: Multiple years of production use, well-known adopters, proven at scale

### API Safety Assessment
- **fully-safe**: Public API contains no unsafe, all unsafe is internal implementation detail
- **minimal-unsafe**: Some unsafe in public API but well-documented and contained
- **unsafe-required**: Users must regularly interact with unsafe code
- **ffi-unsafe**: C bindings inherently require unsafe for FFI

### Idiomatic API Rating
- **5**: Excellent - Iterator patterns, Result/Option, builder patterns, comprehensive From/Into impls
- **4**: Good - Mostly idiomatic with minor rough edges
- **3**: Adequate - Functional but some C-isms or awkward patterns
- **2**: Below average - Significant ergonomic issues, manual memory management patterns
- **1**: Poor - C-style API, lots of raw pointers, poor error handling

### Documentation Quality Rating
- **5**: Comprehensive guides, tutorials, migration docs, extensive examples
- **4**: Good API docs with examples, some guides
- **3**: Adequate API documentation, basic examples
- **2**: Minimal documentation, few examples
- **1**: Missing or severely outdated documentation

### When to Use `null`
- Platform support unknown and cannot be determined from CI/docs
- Feature exists but cannot verify current state
- Metric requires testing that cannot be done via research
- Conflicting information from multiple sources

## Initial Candidates

### Tier 1 (Must Have)
Core databases that most Rust developers will consider:

- [x] **sled** - Popular pure-Rust embedded database, modern API
- [x] **redb** - Pure Rust, LMDB-inspired, simple and fast
- [x] **rocksdb** (rust-rocksdb) - Facebook's LSM-tree, industry standard
- [x] **rusqlite** - SQLite bindings, most common embedded SQL choice
- [x] **heed** - LMDB bindings, type-safe wrapper

### Tier 2 (Should Have)
Well-maintained alternatives and specialized options:

- [x] **fjall** - LSM-based, pure Rust, key-value + blob storage
- [x] **lmdb-rkv** (rkv) - Mozilla's LMDB wrapper
- [x] **persy** - Pure Rust, ACID, unique design
- [x] **jammdb** - Pure Rust, LMDB-like API
- [ ] **sqlite (rusqlite bundled)** - SQLite with bundled build
- [x] **duckdb-rs** - DuckDB bindings, analytical queries
- [x] **polodb** - MongoDB-like API, embedded document store

### Tier 3 (Nice to Have)
Newer, more specialized, or niche options:

- [x] **surrealdb embedded** - Multi-model database with true embedded mode (RocksDB, in-memory, etc.)
- [x] **nebari** - From BonsaiDb project, ACID-compliant append-only B-tree
- [x] **native_db** - Pure Rust with secondary indexes, built on redb
- [x] **cacache** - Content-addressable cache with async support
- [x] **pickledb** - Simple JSON/YAML/CBOR key-value store
- [x] **unqlite** - UnQLite bindings (C library, unmaintained bindings)

### Not Researched (with reasons)
- **agatedb** - Crate name reserved only; 0.1.0 from 2020 is experimental and marked "not recommended"
- **vedis-rs** - No Rust bindings found; Vedis is C library without active Rust wrapper

### Not Including (with reasons)
- **TiKV** - Distributed, not embedded
- **Tantivy** - Search engine, different category
- **MeiliSearch** - Search engine, client-server
- **Redis** - Client-server model

## Notes for Researchers

### General Principles
1. **Verify claims** - Don't trust README marketing; check actual code/tests
2. **Check recency** - Note when stats were gathered; they become outdated
3. **Source everything** - Every non-obvious value needs a source URL
4. **Note uncertainty** - Use comments for caveats, use `null` for unknowns
5. **Test compilation** - If possible, verify crate actually compiles on claimed platforms

### Rust-Specific Considerations
1. **Check Cargo.toml features** - Many capabilities are behind feature flags
2. **Review unsafe usage** - `grep -r "unsafe" src/` gives a sense of internal safety
3. **Check dependencies** - `cargo tree` reveals hidden C dependencies
4. **Verify async claims** - "async" might mean different things (native vs spawn_blocking)
5. **MSRV matters** - Minimum Supported Rust Version can affect usability

### Version Sensitivity
- Performance claims tied to specific versions may not apply to current version
- API stability varies; check CHANGELOG for breaking changes frequency
- Star/download counts are snapshots; note the date gathered

### Common Pitfalls
- "Embedded" vs "embeddable" - some databases can embed but are primarily client-server
- "Async support" - verify it's not just sync API wrapped in spawn_blocking
- "Pure Rust" - check entire dependency tree, not just direct dependencies
- "Production ready" - look for actual production use reports, not just claims

# JWT & JOSE Libraries Research Guide

## Overview

Compare libraries that issue, verify, and manipulate JSON Web Tokens and the wider JOSE family (JWS, JWE, JWK/JWKS, JWA) across programming ecosystems. JWT handling is a place where a subtly wrong default becomes a total authentication bypass, so this comparison is weighted toward **security posture** and **algorithm coverage** first, features second, ergonomics and ecosystem third.

Users should be able to:
- Find the maintained, credible JWT/JOSE library for their ecosystem (Rust, Go, JVM, Python, Node.js, Deno, Dart)
- Judge whether a library is safe by default — does it reject `alg: none`, does it force the caller to pin the accepted algorithms, is algorithm/key confusion structurally impossible
- Check whether the algorithms they need (PS256, ES256K, EdDSA, A256GCM, ECDH-ES, …) are actually implemented, not just listed
- See how much of JOSE is covered beyond signed compact JWTs — encryption, JWKS fetching and caching, nested tokens, detached payloads
- Compare key handling: PEM/DER/JWK ingestion, `kid`-based rotation, external signers (KMS/HSM)
- Assess maturity, maintenance, CVE history, and how the library behaves on constrained runtimes (WASM, edge, browser)

## Scope

**Included:**
- Libraries you add as a dependency to sign and/or verify JWTs (JWS compact serialization)
- Full JOSE implementations covering JWE, JWK/JWKS, JWA, and JSON serializations
- Ecosystem-idiomatic libraries for Rust, Go, JVM (Java/Kotlin), Python, Node.js, Deno, and Dart
- Runtime-builtin or WebCrypto-backed implementations shipped with a runtime, where they are the idiomatic choice
- Bindings/wrappers around native JOSE or crypto stacks (OpenSSL, ring, BouncyCastle), flagged as such
- Libraries that only verify, or only sign, provided that is their stated purpose

**Excluded:**
- Hosted identity providers and auth-as-a-service (Auth0, Clerk, Okta, Keycloak, Firebase Auth, Supabase Auth) — they issue tokens, they are not libraries you call
- CLI and debugging tools (`jwt-cli`, jwt.io, token inspectors)
- Full authentication/authorization frameworks where JWT is one incidental feature (Spring Security, Passport, Django REST framework, NextAuth) — the underlying JOSE library they delegate to is in scope, the framework is not
- OAuth 2.0 / OIDC client and server frameworks, unless the package is primarily a JOSE implementation
- Alternative token formats that are not JOSE (PASETO, Branca, Macaroons, Biscuit-auth's own format, CWT/COSE) — a different comparison
- Abandoned libraries with a maintained, drop-in successor by the same author (the successor is listed instead)
- Language ecosystems outside the seven listed above, until the comparison is explicitly widened

## Attribute Groups

### 1. General Information

| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Ecosystem** | tags | Runtime(s) the library targets. tags: `rust`, `go`, `jvm`, `python`, `nodejs`, `deno`, `bun`, `browser`, `dart`, `flutter`. Multi-runtime libraries get every tag they genuinely support (e.g. panva/jose ships for Node, Deno, Bun, browsers, and Cloudflare Workers). |
| **License** | tags | From LICENSE / package manifest. tags: `MIT`, `Apache-2.0`, `MIT OR Apache-2.0`, `BSD-3-Clause`, `ISC`, `MPL-2.0`, `LGPL-2.1`, `EPL-2.0`, `proprietary`. Dual licences get both tags. |
| **Implementation** | tags | How the crypto is done. tags: `native` (pure implementation in the host language), `stdlib-crypto` (delegates to the language's standard crypto), `webcrypto` (SubtleCrypto), `ffi-binding` (OpenSSL/BoringSSL/ring/libsodium), `platform-provider` (JCA/BouncyCastle). |
| **Repository** | link | Canonical source repository. |
| **Package** | link | Registry page: crates.io, pkg.go.dev, Maven Central, PyPI, npm, JSR/deno.land, pub.dev. |
| **Documentation** | link | Best entry point for users: docs.rs, Javadoc, readthedocs, dedicated docs site, or the README if that is genuinely all there is. |
| **First Release** | date (year) | Year of first public release on the registry. Newer is not better here — direction: neutral. |
| **Latest Version** | text | Current stable version string. Note pre-1.0 explicitly (e.g. `0.9.3`) rather than rounding. |

### 2. Algorithm Support

Record what the library **implements and can verify**, not what its README aspirationally mentions. Where an algorithm is behind a feature flag / optional module, still count it as supported and note the flag in the comment.

| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **HMAC (HS)** | tags | tags: `HS256`, `HS384`, `HS512`. Nearly universal; absence is notable. |
| **RSA PKCS#1 v1.5 (RS)** | tags | tags: `RS256`, `RS384`, `RS512`. Still the most deployed family (OIDC id_tokens). |
| **RSA-PSS (PS)** | tags | tags: `PS256`, `PS384`, `PS512`. Often missing in smaller libraries; a real differentiator. |
| **ECDSA (ES)** | tags | tags: `ES256`, `ES384`, `ES512`, `ES256K`. `ES256K` (secp256k1, RFC 8812) is separate and rarer. |
| **EdDSA** | tags | tags: `Ed25519`, `Ed448`. Note whether registered as `EdDSA` (RFC 8037) or the newer `Ed25519` alg identifier (RFC 9679-era registrations). |
| **JWE Key Management** | tags | tags: `dir`, `A128KW`, `A192KW`, `A256KW`, `A128GCMKW`, `A192GCMKW`, `A256GCMKW`, `RSA-OAEP`, `RSA-OAEP-256`, `RSA1_5`, `ECDH-ES`, `ECDH-ES+A128KW`, `ECDH-ES+A256KW`, `PBES2-HS256+A128KW`, `PBES2-HS512+A256KW`. Empty when the library does not do JWE. |
| **JWE Content Encryption** | tags | tags: `A128CBC-HS256`, `A192CBC-HS384`, `A256CBC-HS512`, `A128GCM`, `A192GCM`, `A256GCM`, `XC20P`. |
| **Deprecated Algorithms Available** | tags | Algorithms the library still exposes that are widely considered unsafe or discouraged. tags: `none`, `RSA1_5`, `secp256k1-unrestricted`, `RSA<2048`, `none-of-these`. Use `none-of-these` when the library exposes no discouraged algorithm — do **not** leave empty, since empty reads as "unresearched". |
| **Algorithm Extensibility** | boolean | Can a user register a custom `alg` implementation? Powerful, but also an escape hatch around the library's own safety checks — note which in the comment. |

### 3. Security Posture

The core group. Prefer reading the verification code path or the security section of the docs over trusting a marketing claim. Cite the file/line or doc anchor for anything non-obvious.

| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Rejects `alg: none`** | boolean | `true` when the unsecured JWS variant is rejected unconditionally on the normal verification path. `true` also if it can only be enabled through an explicitly and unmistakably named opt-in (record the opt-in in the comment). `false` if `none` verifies by default or is enabled by a generic "allow all algorithms" setting. |
| **Algorithm Pinning** | tags | How the accepted algorithm set is chosen. tags: `caller-must-specify` (verification will not compile/run without an explicit allow-list — safest), `inferred-from-key` (key type constrains the algorithm structurally), `defaults-to-safe-set` (a curated default list), `trusts-header` (reads `alg` from the untrusted token header — dangerous). |
| **Algorithm Confusion Resistance** | rating (1–5) | Resistance to the classic RS256→HS256 key-confusion attack and its relatives. 5 = the type system or API makes it impossible to pass an RSA public key where an HMAC secret is expected; 3 = prevented by a runtime check; 1 = a raw byte slice/string is accepted for any algorithm. Direction: ascending. |
| **Unverified Decode Is Clearly Separated** | boolean | Is there a distinct, plainly-named API for reading claims without verifying (`decode_unverified`, `unsafeDecode`, `insecure_*`)? `false` when the same function both parses and optionally verifies depending on a flag, or when the unsafe path is the shortest one. |
| **Default Claim Validation** | tags | Claims checked automatically on verification without extra configuration. tags: `exp`, `nbf`, `iat`, `aud`, `iss`, `sub`, `jti`, `typ`, `none`. A library that validates `exp`/`nbf` by default but requires `aud`/`iss` to be passed in is the common case — tag `exp`, `nbf` and say so in the comment. |
| **Audience/Issuer Required** | boolean | Does the API make it hard to verify a token without stating the expected `aud` and `iss`? `true` when they are required parameters or the verifier fails closed without them. |
| **Clock Skew Configurable** | boolean | Can leeway for `exp`/`nbf`/`iat` be set? Note the default value in the comment (a large or unbounded default is worth flagging). |
| **Constant-Time Comparison** | boolean | HMAC tag comparison uses a constant-time primitive. Verify in source; almost everyone claims it. Use `null` if the crypto is delegated somewhere unauditable and no statement exists. |
| **Minimum Key Size Enforced** | boolean | Rejects RSA keys under 2048 bits and HMAC secrets shorter than the hash output (per RFC 7518 §3.2). Note in the comment which of the two it enforces if only one. |
| **`crit` Header Handling** | tags | RFC 7515 §4.1.11 behaviour. tags: `rejects-unknown` (correct — fail on unrecognised critical headers), `caller-declares-understood`, `ignores` (spec violation, security-relevant), `unknown`. |
| **Nested/Recursive Depth Limits** | boolean | Guards against denial-of-service through deeply nested JWE/JWS or huge PBES2 iteration counts. Note the PBES2 `p2c` cap specifically if the library does JWE. |
| **CVE History** | tags | Published advisories against this package. tags: `none-known`, `historical-pre-2020`, `historical-2020s`, `recent-24-months`, `unpatched`. Search GitHub Security Advisories, RustSec, OSV, NVD, and Snyk. Record IDs and one-line summaries in the comment — this attribute is only useful with its comment. |
| **Security Policy** | boolean | A `SECURITY.md` or documented private disclosure channel exists. |
| **Independent Security Review** | boolean | A published third-party audit or a documented review by a recognised security team. `null` if genuinely unknown; `false` means "searched and found none". |

### 4. JOSE Feature Coverage

| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **JWS (Sign & Verify)** | boolean | The baseline. `false` for verify-only or sign-only libraries — say which in the comment. |
| **JWE (Encrypt & Decrypt)** | boolean | Full JWE support, not just the ability to parse the header. |
| **JWK Parsing** | boolean | Can construct keys from JWK documents. |
| **JWKS Remote Fetch** | boolean | Built-in retrieval of a JWKS from a URL (as opposed to "you fetch it, we parse it"). |
| **JWKS Caching & Rotation** | boolean | Caches the key set with TTL/`Cache-Control` handling and refetches on unknown `kid`. Note rate-limiting behaviour — an unthrottled refetch-on-miss is a DoS amplifier. |
| **`kid` Selection** | boolean | Selects the verification key by the token's `kid` from a key set. |
| **JWK Thumbprint** | boolean | RFC 7638 (and ideally RFC 9278 thumbprint URIs). |
| **Nested JWT** | boolean | Signed-then-encrypted tokens handled end to end. |
| **JSON Serialization** | tags | Serializations supported beyond compact form. tags: `compact`, `flattened-json`, `general-json`, `multiple-signatures`. |
| **Detached Payload** | boolean | RFC 7515 Appendix F. |
| **Unencoded Payload** | boolean | RFC 7797 (`b64: false`). |
| **Key Generation** | boolean | Can generate keys/key pairs suitable for the supported algorithms. |
| **X.509 Header Support** | tags | tags: `x5c`, `x5t`, `x5t#S256`, `x5u`, `none`. Note whether `x5c` chains are actually validated or merely parsed — parsing without validation is a trap worth calling out. |

### 5. Key Handling & Integration

| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Key Input Formats** | tags | tags: `pem`, `der`, `pkcs8`, `pkcs1`, `sec1`, `spki`, `jwk`, `jwks`, `raw-bytes`, `pkcs12`, `keystore`. |
| **External Signer Support** | boolean | Can sign with a key it never sees — KMS, HSM, PKCS#11, cloud signer — via a pluggable signer interface. |
| **Framework Integrations** | tags | First-party or well-known adapters. tags: `axum`, `actix`, `tower`, `gin`, `echo`, `chi`, `spring`, `quarkus`, `micronaut`, `django`, `fastapi`, `flask`, `express`, `fastify`, `nestjs`, `hono`, `oak`, `shelf`, `none`. Community adapters count if they are the de facto choice — note this in the comment. |
| **Async API** | tags | tags: `sync-only`, `async-only`, `both`, `n-a` (single-threaded runtime where the distinction is moot). WebCrypto-backed libraries are typically `async-only`. |
| **Typed Claims** | tags | How custom claims are modelled. tags: `strongly-typed` (generics/structs with compile-time checked claim types), `schema-validated` (runtime schema/model, e.g. Pydantic), `map-only` (dictionary of dynamic values), `both`. |

### 6. Portability & Footprint

| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Crypto Backend** | tags | tags: `ring`, `rustcrypto`, `aws-lc-rs`, `openssl`, `boringssl`, `stdlib`, `webcrypto`, `bouncycastle`, `jca`, `libsodium`, `pointycastle`. Drives portability and FIPS options. |
| **Pure Language Implementation** | boolean | No native/FFI dependency in the default configuration. Verify with the ecosystem's dependency tool (`cargo tree`, `go mod graph`, `mvn dependency:tree`, `pip show`, `npm ls`), not the README. |
| **Runs in Browser/WASM** | boolean | Works in a browser or WASM/WASI target. |
| **Edge Runtime Compatible** | boolean | Works on Cloudflare Workers, Vercel Edge, Deno Deploy — i.e. no Node built-ins, no native modules. Use `null` for ecosystems where the question is meaningless (JVM, Dart mobile) rather than `false`. |
| **FIPS-Capable Backend** | boolean | Can be configured against a FIPS 140-validated crypto module (aws-lc-rs FIPS, OpenSSL FIPS provider, BC-FJA). Validation belongs to the module, not this library — say so in the comment. |
| **Dependency Count** | integer | Direct dependencies from the package manifest, default features/config. Direction: descending (fewer is better) for supply-chain surface, but treat it as informational — do not read too much into it across ecosystems. |
| **Package Size** | filesize | Published artifact size (npm tarball unpacked, JAR, wheel, crate). Direction: descending. `null` where the registry does not report it usefully. |

### 7. Ecosystem & Maintenance

| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **GitHub Stars** | integer | Snapshot from the repository. Direction: ascending. Record the date in the comment — it ages immediately. |
| **Downloads** | integer | Registry downloads. Use a consistent window per ecosystem and state it in the comment: npm weekly, PyPI monthly (pypistats), crates.io all-time, pub.dev 30-day. Cross-ecosystem comparison is meaningless — this ranks within an ecosystem only. |
| **Last Release** | date (full) | Date of the most recent stable release. Direction: ascending. |
| **Maintenance Status** | tags | tags: `actively-maintained` (release or substantive commits in the last 6 months), `passively-maintained` (security/bug fixes only), `dormant` (12+ months quiet but no successor), `deprecated` (author points elsewhere), `archived`. |
| **Bus Factor** | tags | tags: `solo`, `small-team` (2–5 regular committers), `organization` (company- or foundation-backed). Check the last ~50 commits, not the all-time contributor list. |
| **Maturity** | tags | tags: `experimental`, `beta`, `stable`, `mature`. See Assessment Guidelines. |
| **RFC Conformance Testing** | tags | Evidence the implementation is tested against the specs. tags: `rfc-test-vectors` (RFC 7515/7516/7517/7518/7520 appendix vectors), `cookbook-7520`, `interop-suite`, `wycheproof`, `own-tests-only`, `unknown`. |
| **Documentation Quality** | rating (1–5) | See Assessment Guidelines. Direction: ascending. |

## Research Sources

### Primary Sources (Preferred)

1. **The library's source repository** — the verification code path is the ground truth for every attribute in the Security Posture group. Read `verify`/`decode` and the header-handling code.
2. **Registry pages** — crates.io, pkg.go.dev, Maven Central / search.maven.org, PyPI, npm, JSR & deno.land/x, pub.dev: versions, release dates, downloads, dependency lists, published size.
3. **Official API documentation** — docs.rs, Javadoc, readthedocs, TypeDoc, dartdoc, or the project's docs site.
4. **The RFCs themselves** — RFC 7515 (JWS), 7516 (JWE), 7517 (JWK), 7518 (JWA), 7519 (JWT), 7520 (cookbook/test vectors), 7638 (thumbprint), 7797 (unencoded payload), 8037 (Edwards/OKP), 8725 (**JWT BCP** — the checklist behind most of the Security Posture group), 8812 (secp256k1).
5. **Vulnerability databases** — GitHub Security Advisories, RustSec Advisory DB, OSV.dev, NVD, Snyk, PyPA Advisory DB, Go vulnerability database (`pkg.go.dev/vuln`).
6. **`SECURITY.md` / published audit reports** — for the security policy and independent review attributes.

### Secondary Sources

7. **Dependency tooling output** — `cargo tree`, `go mod graph`, `mvn dependency:tree`, `pipdeptree`, `npm ls`, `dart pub deps` for the pure-implementation and dependency-count attributes.
8. **jwt.io's library list** — a rough discovery aid for candidates and claimed algorithm coverage; verify everything it says against the source.
9. **Maintainer blog posts and release notes** — especially panva's (jose), Auth0's engineering blog, and RustSec advisories' write-ups; good for understanding *why* a default changed.
10. **Security research on JWT attack classes** — Auth0/PortSwigger/Snyk write-ups on algorithm confusion, `kid` injection, JWKS spoofing, and `jku` abuse; useful for knowing what to look for in the code.
11. **GitHub issues and discussions** — real-world reports of surprising defaults, missing algorithms, and migration friction.

### Sources to Approach Carefully

- **README feature tables** — routinely list algorithms that are planned, partial, or behind an unreleased branch. Confirm against source or tests.
- **jwt.io's green "supports" checkmarks** — coarse-grained and often stale.
- **Comparison blog posts older than two years** — defaults in this space have tightened significantly; a 2019 verdict about a library's `alg: none` behaviour is probably wrong today.
- **Benchmark claims** — throughput here is nearly always dominated by the underlying crypto primitive, not the library; treat performance marketing as noise.

## Assessment Guidelines

- **Rejects `alg: none`**: the decisive question is what happens on the *default* verification path with an attacker-supplied token. An opt-in that is explicit, separately named, and documented as unsafe still counts as `true`; being reachable via a permissive "allow any algorithm" configuration counts as `false`. Always record the exact mechanism in the comment.
- **Algorithm Pinning**: choose the tag describing what the API *forces*, not what the docs recommend. If the signature is `verify(token, key, algorithms)` with `algorithms` required → `caller-must-specify`. If a public RSA key value can only ever drive RSA verification → `inferred-from-key`. If omitting the parameter silently trusts the token header → `trusts-header`, and flag it loudly in the comment.
- **Algorithm Confusion Resistance** (1–5, ascending):
  - **5** — Distinct key types per algorithm family; passing the wrong key type is a compile-time error (or structurally impossible).
  - **4** — Single key abstraction, but the key carries its type and a mismatch fails closed at runtime with a clear error.
  - **3** — Runtime check exists but depends on the caller supplying an algorithm list.
  - **2** — Raw bytes/strings accepted, with only documentation warning against misuse.
  - **1** — Known-exploitable confusion, or the header's `alg` selects the key interpretation.
- **CVE History**: only meaningful together with its comment. A library with a patched 2015 `alg: none` advisory and a decade of clean history is in better shape than one with no advisories and no security process. Record IDs, dates, and whether the issue is fixed in current versions.
- **Maturity**:
  - **experimental** — pre-1.0 with an explicitly unstable API, or incomplete algorithm coverage; not recommended for auth-critical code.
  - **beta** — usable and used, but the API still moves between minor versions.
  - **stable** — 1.0+, stable API, real production deployments, documented upgrade path.
  - **mature** — years of broad production use, an established security process, and a track record of handling advisories well.
- **Documentation Quality** (1–5, ascending): **5** = task-oriented guide with working examples for signing, verification, JWKS, and key management, plus an explicit security-considerations section; **4** = good API docs with runnable examples; **3** = adequate API reference, thin examples; **2** = README-only with a single happy-path snippet; **1** = essentially undocumented.
- **Downloads**: never compare across ecosystems. Always name the window and source in the comment.
- **Edge Runtime Compatible**: use `null`, not `false`, where the concept does not apply to the ecosystem (JVM server libraries, Flutter/Dart mobile packages).
- **When to use `null`**: an algorithm's support cannot be confirmed from source or tests; a security behaviour is undocumented and the code path is unreadable within reasonable effort; a registry does not publish the metric; sources contradict each other. Always pair `null` with a comment saying what was checked and why it was inconclusive. Never guess a security attribute — a wrong `true` on "Rejects `alg: none`" is worse than an honest `null`.

## Candidates

- [x] **jsonwebtoken (Rust)** — the default JWT crate in the Rust ecosystem; ring-backed, JWS-only
- [x] **josekit (Rust)** — full JOSE for Rust including JWE, OpenSSL-backed
- [ ] **jwt-simple (Rust)** — pure-Rust, opinionated safe-by-default API with type-separated key kinds
- [x] **biscuit (Rust)** — long-standing pure-Rust JOSE implementation with JWE support
- [ ] **golang-jwt/jwt (Go)** — the community successor to dgrijalva/jwt-go; the Go default
- [ ] **lestrrat-go/jwx (Go)** — the most complete Go JOSE stack: JWS, JWE, JWK, JWKS caching
- [ ] **go-jose (Go)** — the Square-descended JOSE library maintained under go-jose/go-jose
- [ ] **Nimbus JOSE+JWT (JVM)** — the reference-grade JVM JOSE implementation, near-total spec coverage
- [ ] **JJWT (JVM)** — fluent Java builder API, widely used in Spring-adjacent codebases
- [ ] **java-jwt (JVM)** — Auth0's JVM library, JWT-focused rather than full JOSE
- [ ] **jose4j (JVM)** — mature standalone JVM JOSE implementation with strong RFC coverage
- [ ] **PyJWT (Python)** — the Python default; JWS/JWT-focused, cryptography-backed
- [ ] **joserfc (Python)** — Authlib author's modern successor to python-jose with full JOSE coverage
- [ ] **Authlib JOSE (Python)** — the JOSE component of the Authlib suite
- [ ] **python-jose (Python)** — historically ubiquitous; included partly to document its current maintenance state
- [ ] **jose / panva (Node.js, Deno, browser, edge)** — the reference JS JOSE implementation, WebCrypto-based, runtime-portable
- [ ] **jsonwebtoken (Node.js)** — Auth0's long-standing Node library, still the most-downloaded JWT package
- [ ] **fast-jwt (Node.js)** — performance-oriented Node JWT library used by fastify-jwt
- [ ] **djwt (Deno)** — the Deno-native JWT module
- [ ] **dart_jsonwebtoken (Dart)** — the most-used JWT package on pub.dev
- [ ] **jose (Dart)** — Dart JOSE implementation covering JWS, JWE, and JWK

## Notes for Researchers

1. **Read the verification path.** Every attribute in the Security Posture group should be grounded in source code or an explicit statement in official docs. A README bullet saying "secure by default" is not a source.
2. **RFC 8725 is the checklist.** When unsure what "safe" means for an attribute, the JWT Best Current Practices RFC is the arbiter. Cite it in comments where a library deviates.
3. **Cite with URLs, and prefer permalinks.** For source-derived claims, link a `blob/<commit-sha>/` permalink rather than a branch link, so the citation stays valid.
4. **Record versions.** Every security and feature claim is version-scoped. Put the version you examined in the comment; defaults change between majors (several libraries tightened `alg` handling in a single breaking release).
5. **Date the volatile numbers.** Stars, downloads, and dependency counts are snapshots — state the observation date in the comment.
6. **Distinguish "can" from "does by default".** A library that *supports* audience validation but does not perform it unless asked is a different risk profile from one that fails closed. Both facts belong in the record: the tag for the default, the comment for the capability.
7. **Verify algorithm claims against tests.** Grep the test suite for the algorithm identifier. An algorithm listed in a constants enum but never exercised is a `null` with an explanatory comment, not a `true`.
8. **Check the ecosystem's advisory database, not just NVD.** RustSec, the Go vuln DB, GitHub Advisories, and PyPA all carry entries that never reach NVD.
9. **Be even-handed about age.** An old library with recent commits and a clean advisory history is often the safest choice; a shiny 0.x library with full JOSE coverage may not be. Let the Maturity and Maintenance Status tags carry that nuance rather than editorialising in descriptions.
10. **Note deprecation pointers.** Where a library's own maintainers recommend a successor, record that in the candidate's description and in the Maintenance Status comment — it is the single most useful thing a reader can learn about it.

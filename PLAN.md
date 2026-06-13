# Plan: Milestone 17 — Apply Icon Glyphs Across Comparison Data

> Milestone: ROADMAP.md → "Milestone 17: Apply Icon Glyphs Across Comparison Data"
> Started: 2026-06-13

## Context & Audit

Milestone 16 shipped the icon capability (registry + `IconRef` + `TagsValue`
`display` modes) and a single live demo: `spa-web-frameworks` → `primary-language`
renders Devicon language logos with `display: "icon"`. This milestone rolls icons
out across the remaining comparison data.

**This plan IS the recorded audit pass** (Success Criterion 1). Each per-type task
below names the attribute(s) that benefit from glyphs; types with no icon-worthy
attribute are recorded explicitly in **Task 11** rather than silently skipped.

### Per-type audit verdict

| Comparison type | Verdict | Attribute(s) → glyphs | Task |
|---|---|---|---|
| spa-web-frameworks | **done (M16)** | `primary-language` (Devicon) | — (verify only, Task 12) |
| audio-transcription | apply | `platforms` (OS/brand logos) | 2 |
| content-management-systems | apply | `database-support`, `frontend-frameworks` | 3 |
| website-hosting-providers | apply | `git-integration`, `functions-runtime`, `supported-frameworks` | 4 |
| rich-text-editors | apply | `framework` | 5 |
| ui-component-libraries | apply | `framework` | 6 |
| ai-workflows | apply | `install-mechanism` | 7 |
| ai-coding-agents | apply | `interface` | 8 |
| sbc | apply | `distros-with-images` | 9 |
| rust-scripting | apply | `language-family` | 10 |
| databases | **no icon-worthy** (taxonomic tags, uniform `faDatabase`) | — | 11 |
| distributed-databases | **no icon-worthy** (driver-support levels, not language names) | — | 11 |
| rust-gui | **no icon-worthy** (GPU/toolkit/runtime taxonomy, no Free/Devicon glyphs) | — | 11 |
| rust-embedded-databases | **no icon-worthy** (only "Pure Rust" has a glyph; partial, low value) | — | 11 |
| battery-powertools | **no icon-worthy** (physical product taxonomy) | — | 11 |

## Cross-Cutting Conventions (apply to every data task)

These are decided once here so individual tasks stay short:

1. **Registry is the gate.** Every icon `name` used in `attributes.json` must exist
   in `app/src/lib/icons/registry.ts` or it silently falls back to the text label.
   Each task adds the glyphs it needs (idempotent by name — if a prior task already
   added `react`/`vue`/etc., reuse it; don't duplicate the import).
2. **Pack field = `"devicon"` for all tech/language/OS/brand logos**, mirroring the
   `primary-language` demo. `resolveIcon` automatically prefers a FontAwesome **brand**
   glyph when one exists for that name (theme-friendly `currentColor` fill) and falls
   back to the Devicon `<img>` otherwise. So in `registry.ts`:
   - If FA Free **brands** has the glyph (`faReact`, `faVuejs`, `faAngular`, `faNode`,
     `faNpm`, `faGithub`, `faGitlab`, `faBitbucket`, `faAndroid`, `faPhp`, `faAws`,
     `faDocker`, plus the already-present rust/python/js/linux/apple/windows) →
     import it and add to **`faRegistry`**. Data still says `pack: "devicon"`.
   - Otherwise (typescript, svelte, nextjs, nuxt, gatsby, astro, solid, vite,
     postgresql, mysql, mongodb, sqlite, redis, ubuntu, debian, fedora, raspberrypi,
     ruby, lua, …) → import the Devicon SVG and add to **`deviconRegistry`**. Verify
     the exact `devicon/icons/<name>/<name>-{original|plain}.svg` path exists; if a
     given logo is absent from the Devicon package, leave that tag icon-less (it
     degrades to its label — that is acceptable and expected).
   - Use `pack: "fa-solid"` only for generic UI glyphs (`terminal`, `desktop`,
     `globe`, `server`, `database` — several already registered).
3. **Display mode choice:**
   - Use **`display: "both"`** (icon + label chip) as the default. It renders a small
     glyph inside the colored chip and degrades cleanly to a plain chip for any tag
     that has no glyph — so **partial coverage stays visually consistent**.
   - Use **`display: "icon"`** (bare glyph, label as tooltip) **only** when *every*
     tag in the attribute has a distinct, recognizable glyph and the label is pure
     redundancy (the `primary-language` case). Avoid it when some tags lack glyphs —
     in `"icon"` mode an un-iconned tag renders as a colored label chip *next to* bare
     glyphs, which looks mismatched.
4. **Colors and `"both"` mode.** `TagsValue` only understands **named** Tailwind
   colors (`blue`, `green`, `orange`, …); hex strings fall through to gray. Three
   types store hex colors (`content-management-systems`, `rust-embedded-databases`,
   `battery-powertools`). Only `content-management-systems` is an icon target — Task 3
   converts the two touched attributes' tag colors to named colors so their `"both"`
   chips render in color. Don't touch hex colors in types we're not adding icons to.
5. **Filtering/sorting untouched.** Icons attach to tag *definitions* only; `value:
   string[]` on candidates is never changed. No candidate files are edited unless a
   task explicitly says so (none here do — all targets are existing Tags attributes).
6. **Tests** use the shared helper from Task 1 and live in a per-type
   `app/src/lib/icons/icons.<type>.test.ts` file (independent, no shared-file churn).

---

## Tasks

[x] 1. **Shared test helper for icon-attribute data tests**
- **Files:** `app/src/lib/icons/iconAttribute.testutil.ts` (new)
- **Description:** Factor out the boilerplate that every per-type icon test repeats
  (load `attributes.json`, locate a Tags attribute by group + id, assert it is a tags
  type, assert every tag carrying an `icon` resolves through the real `registry`).
  Model the assertions on the existing `demo.test.ts` (which stays as-is). Export:
  - `getTagsAttribute(attributesFile, groupId, attrId)` → returns the resolved tags
    `valueType` object (with `tags`, `display`) or throws a clear error if missing /
    not a tags type.
  - `iconTags(vt)` → the subset of `vt.tags` that have an `icon`.
  - `expectAllIconsResolve(vt)` → for each icon tag, assert `resolveIcon(tag.icon)`
    is non-null (fails the test naming the offending tag id if not).
  This is a plain `.ts` module (not a `.test.ts`), imported by the per-type test
  files; it contains no `describe`/`it` itself.
- **Architecture & Decisions:**
  - Reuse the `TagDef` / `TagsValueType` / `AttributeGroupDef` shapes already declared
    in `demo.test.ts`; lift them into this module and let `demo.test.ts` keep its own
    copies (no refactor of the existing demo test required — keep this task additive).
  - Calls the **real** `resolveIcon` (no mock), same philosophy as `demo.test.ts`, so
    a missing/misspelled registry entry is caught at test time.
- **Non-Functional Considerations:**
  - Pure test-support code; not shipped in the app bundle.
- **Test Cases:**
  - A throwaway self-check `app/src/lib/icons/iconAttribute.testutil.test.ts` (optional
    but recommended): `getTagsAttribute(spaAttributes, "language-syntax",
    "primary-language")` returns a tags type with `display: "icon"`; `iconTags(vt)`
    has ≥ 4 entries; `expectAllIconsResolve(vt)` passes. This both verifies the helper
    and re-pins the existing demo wiring.
- **Commit Message:** `test(app): add shared helper for icon-attribute data tests`

[x] 2. **data: icon glyphs for `audio-transcription` platforms**
- **Files:** `data/audio-transcription/attributes.json`, `app/src/lib/icons/registry.ts`,
  `app/src/lib/icons/icons.audio-transcription.test.ts` (new)
- **Description:** The `platforms` Tags attribute (macOS, Windows, iOS, Android, Web,
  Linux) reads far faster as OS logos. Add an `icon` to each platform tag and set
  `display: "both"` (keep labels — macOS and iOS both map to the Apple glyph, so the
  label disambiguates). Mapping: macOS → `apple`, iOS → `apple`, Windows → `windows`,
  Linux → `linux`, Android → `android`, Web → `globe` (`pack: "fa-solid"`). All but
  `android` are already registered; add `android: faAndroid` to `faRegistry`.
- **Architecture & Decisions:**
  - `pack: "devicon"` for apple/windows/linux/android (resolver prefers FA brands for
    all four); `pack: "fa-solid"` for `globe`.
  - `display: "both"`, not `"icon"`, per Convention 3 (apple glyph is shared by two
    tags).
- **Test Cases:** (`icons.audio-transcription.test.ts`, using the Task 1 helper)
  - `platforms` is a tags type with `display: "both"`.
  - The macOS, Windows, Linux, Android, Web tags each carry an `icon`.
  - `expectAllIconsResolve(vt)` passes (every platform icon resolves).
- **Commit Message:** `data(audio-transcription): icon glyphs for platforms`

[x] 3. **data: icon glyphs for `content-management-systems` DB & framework tags**
- **Files:** `data/content-management-systems/attributes.json`,
  `app/src/lib/icons/registry.ts`,
  `app/src/lib/icons/icons.content-management-systems.test.ts` (new)
- **Description:** Two strong targets:
  - `database-support` (PostgreSQL, MySQL, MongoDB, SQLite, DynamoDB, Proprietary) →
    icons for postgresql/mysql/mongodb/sqlite (Devicon). DynamoDB and Proprietary have
    no clean logo — leave them icon-less (they degrade to label chips).
  - `frontend-frameworks` (Next.js, Nuxt, Gatsby, Astro, Remix, SvelteKit, …) → icons
    for the frameworks with logos (nextjs, nuxtjs, gatsby, astro, svelte). Remix and
    any logo absent from Devicon stay icon-less.
  Set `display: "both"` on both attributes (partial coverage → keep labels).
  **Also** convert these two attributes' tag `color` values from hex strings to the
  nearest **named** Tailwind colors (`blue`, `green`, `orange`, `purple`, `red`,
  `cyan`, `yellow`, `gray`) so the `"both"` chips render colored rather than gray
  (Convention 4). Leave other attributes in this file untouched.
- **Architecture & Decisions:**
  - Registry additions (all Devicon, none have FA brands): `postgresql`, `mysql`,
    `mongodb`, `sqlite`, `nextjs`, `nuxtjs`, `gatsby`, `astro`, `svelte`. Verify each
    SVG path in the `devicon` package; skip (leave icon-less) any not present.
  - Do **not** convert `primary-language` (it is a plain `text` attribute, out of
    scope) or other hex colors in the file.
- **Test Cases:** (`icons.content-management-systems.test.ts`)
  - `database-support` and `frontend-frameworks` are tags types with `display: "both"`.
  - postgresql/mysql/mongodb/sqlite tags carry icons; nextjs/gatsby/astro tags carry
    icons.
  - `expectAllIconsResolve(vt)` passes for both attributes.
  - Every tag `color` on the two touched attributes is a key of the renderer's
    `colorClasses` map (guard against leftover hex) — assert each color ∈ the named set.
- **Commit Message:** `data(content-management-systems): icon glyphs for database & framework tags`

[x] 4. **data: icon glyphs for `website-hosting-providers`**
- **Files:** `data/website-hosting-providers/attributes.json`,
  `app/src/lib/icons/registry.ts`,
  `app/src/lib/icons/icons.website-hosting-providers.test.ts` (new)
- **Description:** Three targets:
  - `git-integration` (GitHub, GitLab, Bitbucket, Azure DevOps, Self-Hosted Git) →
    `github`/`gitlab`/`bitbucket` (FA brands). Azure DevOps and Self-Hosted have no
    clean Free glyph (Self-Hosted → `server` fa-solid is acceptable if desired).
  - `functions-runtime` (Node.js, Deno, Python, Go, Rust, Ruby, Other) → node, python,
    go, rust, ruby. Deno/Other stay icon-less.
  - `supported-frameworks` (Next.js, Nuxt, Gatsby, Astro, Hugo, Jekyll, SvelteKit,
    Remix, Angular, Vue, Eleventy, Vite) → nextjs, nuxtjs, gatsby, astro, svelte,
    angular, vuejs, vite. Hugo/Jekyll/Remix/Eleventy stay icon-less.
  All three `display: "both"`.
- **Architecture & Decisions:**
  - FA-brands additions to `faRegistry`: `github: faGithub`, `gitlab: faGitlab`,
    `bitbucket: faBitbucket`, `node: faNode` (alias `nodejs`), `angular: faAngular`,
    `vuejs: faVuejs` (alias `vue`). Reuse already-registered python/go/rust.
  - Devicon additions to `deviconRegistry` (those without FA brands): `ruby`, `vite`
    (`vitejs`), and any of nextjs/nuxtjs/gatsby/astro/svelte not already added by
    Task 3 (reuse if present — registry is shared and idempotent by name).
  - This task may run after Task 3 to reuse the framework Devicon entries; if it runs
    first, it adds them and Task 3 reuses. Either order is fine.
- **Test Cases:** (`icons.website-hosting-providers.test.ts`)
  - All three attributes are tags types with `display: "both"`.
  - github/gitlab/bitbucket; node/python/go/rust/ruby; nextjs/angular/vue/vite tags
    carry icons.
  - `expectAllIconsResolve(vt)` passes for all three attributes.
- **Commit Message:** `data(website-hosting-providers): icon glyphs for git, runtime & framework tags`

[x] 5. **data: icon glyphs for `rich-text-editors` framework**
- **Files:** `data/rich-text-editors/attributes.json`, `app/src/lib/icons/registry.ts`,
  `app/src/lib/icons/icons.rich-text-editors.test.ts` (new)
- **Description:** `framework` (Vanilla JS, React, Vue, Angular, Svelte, Solid) is the
  canonical framework-logo case. Add icons: Vanilla JS → `js`, React → `react`, Vue →
  `vue`/`vuejs`, Angular → `angular`, Svelte → `svelte`, Solid → `solid`/`solidjs`.
  Set `display: "both"` (or `"icon"` only if every tag ends up with a glyph — confirm
  Solid resolves first; default to `"both"`).
- **Architecture & Decisions:**
  - FA-brands: `react: faReact`, `vuejs/vue: faVuejs`, `angular: faAngular` (reuse if
    Task 4 added them); `js` already registered.
  - Devicon: `svelte` (reuse from Task 3/4 if present), `solidjs` (`solid`) — verify
    `devicon/icons/solidjs/solidjs-original.svg` exists; if absent, Solid degrades to
    label and `display` must remain `"both"`.
- **Test Cases:** (`icons.rich-text-editors.test.ts`)
  - `framework` is a tags type; React/Vue/Angular/Svelte tags carry icons.
  - `expectAllIconsResolve(vt)` passes.
- **Commit Message:** `data(rich-text-editors): icon glyphs for framework tags`

[ ] 6. **data: icon glyphs for `ui-component-libraries` framework**
- **Files:** `data/ui-component-libraries/attributes.json`, `app/src/lib/icons/registry.ts`,
  `app/src/lib/icons/icons.ui-component-libraries.test.ts` (new)
- **Description:** `framework` (React, Vue, Angular, Svelte, Solid, Vanilla, Web
  Components) — same logo set as Task 5. Add icons: react, vue, angular, svelte, solid,
  vanilla → `js`. Web Components has no clean Free/Devicon logo → leave icon-less.
  `display: "both"`.
- **Architecture & Decisions:**
  - Reuse all registry entries added in Tasks 4–5 (react/vue/angular FA brands,
    svelte/solid Devicon, js). Likely **no new registry imports** needed — verify and
    only add what's missing.
- **Test Cases:** (`icons.ui-component-libraries.test.ts`)
  - `framework` is a tags type with `display: "both"`; React/Vue/Angular/Svelte tags
    carry icons; `expectAllIconsResolve(vt)` passes.
- **Commit Message:** `data(ui-component-libraries): icon glyphs for framework tags`

[ ] 7. **data: icon glyphs for `ai-workflows` install mechanism**
- **Files:** `data/ai-workflows/attributes.json`, `app/src/lib/icons/registry.ts`,
  `app/src/lib/icons/icons.ai-workflows.test.ts` (new)
- **Description:** `install-mechanism` (npm, pip, cargo, shell script, …) maps cleanly
  to package-manager glyphs: npm → `npm` (FA brand `faNpm`), pip → `python` (already
  registered), cargo → `rust` (already registered), shell/script → `terminal`
  (`pack: "fa-solid"`, add `faTerminal`). Other mechanisms without a clean glyph stay
  icon-less. `display: "both"`.
- **Architecture & Decisions:**
  - Add `npm: faNpm` (FA brand) to `faRegistry`; add `terminal: faTerminal`
    (FA solid) to `faRegistry`.
  - Inspect the actual tag ids/values in the file and map only those that have a
    sensible glyph; do not invent tags.
- **Test Cases:** (`icons.ai-workflows.test.ts`)
  - `install-mechanism` is a tags type with `display: "both"`.
  - npm and shell/script tags carry icons; `expectAllIconsResolve(vt)` passes.
- **Commit Message:** `data(ai-workflows): icon glyphs for install-mechanism tags`

[ ] 8. **data: icon glyphs for `ai-coding-agents` interface**
- **Files:** `data/ai-coding-agents/attributes.json`, `app/src/lib/icons/registry.ts`,
  `app/src/lib/icons/icons.ai-coding-agents.test.ts` (new)
- **Description:** `interface` (CLI, IDE/Editor, Web, …) maps to UI glyphs: CLI →
  `terminal` (fa-solid, reuse from Task 7), IDE/Editor → `code` (already registered)
  or `desktop` (add `faDesktop`), Web → `globe` (already registered). `display:
  "both"`. Inspect the file's actual interface tag set and map accordingly; leave any
  tag without a sensible glyph icon-less.
- **Architecture & Decisions:**
  - Add `desktop: faDesktop` (fa-solid) to `faRegistry` if used; reuse `terminal`,
    `code`, `globe`.
  - This is a lower-yield type (generic UI glyphs, not brand logos) but `interface` is
    a legitimate, readable application — keep it modest and honest.
- **Test Cases:** (`icons.ai-coding-agents.test.ts`)
  - `interface` is a tags type with `display: "both"`; the CLI and Web tags carry
    icons; `expectAllIconsResolve(vt)` passes.
- **Commit Message:** `data(ai-coding-agents): icon glyphs for interface tags`

[ ] 9. **data: icon glyphs for `sbc` Linux distros**
- **Files:** `data/sbc/attributes.json`, `app/src/lib/icons/registry.ts`,
  `app/src/lib/icons/icons.sbc.test.ts` (new)
- **Description:** `distros-with-images` (Raspberry Pi OS, Ubuntu, Debian, Armbian,
  Fedora, openSUSE, Alpine, DietPi, Manjaro, Buildroot, Vendor Only) → distro logos
  where available: Ubuntu → `ubuntu`, Debian → `debian`, Fedora → `fedora`, Raspberry
  Pi OS → `raspberrypi`. openSUSE/Alpine/Manjaro only if the Devicon SVG exists
  (verify; otherwise leave icon-less). Armbian, DietPi, Buildroot, Vendor Only have no
  logo → icon-less. `display: "both"` (many tags lack glyphs — labels essential).
- **Architecture & Decisions:**
  - Devicon additions: `ubuntu`, `debian`, `fedora`, `raspberrypi`, and
    `opensuse`/`alpine`/`manjaro` **iff** present in the package. Confirm each path
    (`ubuntu` is typically `ubuntu-plain.svg`, `debian` `debian-plain.svg`, `fedora`
    `fedora-plain.svg`, `raspberrypi` `raspberrypi-original.svg`) before importing.
- **Test Cases:** (`icons.sbc.test.ts`)
  - `distros-with-images` is a tags type with `display: "both"`.
  - Ubuntu, Debian, Fedora, Raspberry Pi OS tags carry icons.
  - `expectAllIconsResolve(vt)` passes (only asserts the tags that *have* icons).
- **Commit Message:** `data(sbc): icon glyphs for Linux distro tags`

[ ] 10. **data: icon glyphs for `rust-scripting` language family**
- **Files:** `data/rust-scripting/attributes.json`, `app/src/lib/icons/registry.ts`,
  `app/src/lib/icons/icons.rust-scripting.test.ts` (new)
- **Description:** `language-family` (Custom, Lua-like, JavaScript-like, Rust-like,
  Lisp-like, Python-like, Ruby-like, Functional) → glyphs as a family *hint*:
  JavaScript-like → `js`, Rust-like → `rust`, Python-like → `python` (all registered),
  Lua-like → `lua`, Ruby-like → `ruby` (add Devicon). Custom/Lisp-like/Functional stay
  icon-less. `display: "both"` (the "-like" suffix means the label must remain — the
  glyph is a hint, not an identity).
- **Architecture & Decisions:**
  - Devicon additions: `lua` (`devicon/icons/lua/lua-original.svg`), `ruby` (reuse if
    Task 4 added it). Verify paths.
- **Test Cases:** (`icons.rust-scripting.test.ts`)
  - `language-family` is a tags type with `display: "both"`.
  - JavaScript-like, Rust-like, Python-like tags carry icons; `expectAllIconsResolve`
    passes.
- **Commit Message:** `data(rust-scripting): icon glyphs for language-family tags`

[ ] 11. **docs: record "no icon-worthy attribute" verdict for the remaining types**
- **Files:** `data/databases/RESEARCH.md`, `data/distributed-databases/RESEARCH.md`,
  `data/rust-gui/RESEARCH.md`, `data/rust-embedded-databases/RESEARCH.md`,
  `data/battery-powertools/RESEARCH.md`
- **Description:** Satisfy Success Criterion "Where the audit finds no icon-worthy
  attribute for a type, that is explicitly noted rather than silently skipped." Append
  a short, consistent note to each of these five `RESEARCH.md` files recording the
  Milestone-17 audit outcome and the rationale, e.g.:
  > **Icon audit (Milestone 17):** No icon-worthy attribute. The Tags attributes here
  > are categorical taxonomy (e.g. database-type, consistency-model, motor-type) rather
  > than brand/technology/OS logos, so there is no recognizable glyph to attach.
  > Revisit if a future attribute introduces tech/brand values.
  Tailor the parenthetical examples per type (databases: database-type/query-language;
  distributed-databases: driver-support levels/data-model; rust-gui: renderer/binding-
  target/async-runtime; rust-embedded-databases: only "Pure Rust" has a glyph — too
  partial to be worthwhile; battery-powertools: tool-category/motor-type/markets).
- **Architecture & Decisions:**
  - Documentation only — no `attributes.json` or candidate edits, no registry change.
  - Keep all five notes in one commit (they are the same logical "explicit skip"
    record); this is the one intentional exception to one-commit-per-type, since these
    types produce no data change.
- **Test Cases:**
  - No automated test (docs only). Verification: each of the five RESEARCH.md files
    contains the "Icon audit (Milestone 17)" note.
- **Commit Message:** `docs(data): record no-icon-worthy audit verdict for 5 comparison types`

[ ] 12. **Verification & roll-up**
- **Files:** none (verification only; may touch nothing or fix fallout)
- **Description:** Final regression pass across the whole sweep:
  1. `pnpm --dir app test:run` — all suites green, including the pre-existing
     `demo.test.ts` (spa-web-frameworks, Criterion: that type stays wired) and every
     new `icons.<type>.test.ts`.
  2. `pnpm --dir app build` — clean `tsc` and a lean bundle (no full icon CSS/pack
     pulled in; only individually-imported glyphs added to `registry.ts`).
  3. Manual spot-check in the dev server (`pnpm --dir app dev`) on at least three
     touched types (e.g. `/audio-transcription`, `/website-hosting-providers`,
     `/content-management-systems`): glyphs render, tooltips/labels show, and the
     filter dialog still filters on the underlying tag values (filtering/sorting/
     highlighting unaffected — Criterion).
  4. Confirm un-iconned tags (DynamoDB, Deno, Armbian, etc.) degrade to their labels
     rather than blanking.
- **Architecture & Decisions:**
  - This task gates milestone closing; if anything regresses, fix in place or open a
    follow-up task before closing.
- **Test Cases:**
  - Full suite green; production build clean; manual checklist above satisfied.
- **Commit Message:** `test(app): verify icon-glyph rollout across comparison data` (only
  if a fix/commit is needed; otherwise no commit — this is a gate, handed to
  milestone-closing).

---

## Cross-Cutting Concerns

- **Security:** None. Static JSON data + individually-imported SVG/icon assets; no
  user input, no network, no secrets.
- **Performance / Bundle size:** Each new glyph is an individual import in
  `registry.ts` (tree-shaken). Devicon logos resolve to Vite asset URLs (`<img>`),
  FA brands fill with `currentColor`. Never import an entire pack or icon CSS bundle.
  Task 12 confirms the bundle stays lean.
- **Accessibility:** `display: "both"` keeps the text label visible; `display: "icon"`
  (not used by new tasks) exposes the label via tooltip + `aria-label`. Both paths are
  already implemented in `TagsValue`; tasks only supply data, so a11y is preserved by
  construction. Verify keyboard focus reaches icon-only glyphs during Task 12 spot-check
  (relevant only to the existing `primary-language` demo).
- **Observability:** N/A (client-only static app).
- **Migration:** None. No candidate `value` arrays change; existing comparisons render
  identically except that targeted Tags attributes now show glyphs. Tags lacking a
  registry entry degrade gracefully to labels — no forced backfill.
- **Rollback:** Each data task is an isolated commit reverting cleanly. Reverting a
  per-type commit removes its icons (and its registry additions if they are unused by
  other types — shared framework/DB glyphs added by an earlier task survive). The
  registry is append-only and idempotent by name, so partial rollback never breaks a
  still-referenced glyph.

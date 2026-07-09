# 0001 — Reuse the app's React components for HTML export (SSR + hydration)

- **Status:** Accepted
- **Date:** 2026-07-09
- **Deciders:** Max Trense (with Claude Code, strategic-planning)
- **Scope:** The single-comparison self-contained HTML export path (milestone 0019) and
  any future export/snapshot features that render comparison data outside the hosted app.

## Context

Milestone 0019 requires exporting one comparison type to a single self-contained HTML
file that is not merely a static table but the fully interactive comparison view
(filtering, sorting, expandable rows, dark mode) working offline. Two fundamentally
different implementation directions were available:

1. A **standalone template** owned by the export script, reimplementing value formatting,
   ranking, and best-value logic in isolation from the app.
2. **Reusing the app's own React components** by server-rendering them
   (`react-dom/server`) and shipping an inlined client bundle that hydrates them.

The forces in tension: formatting fidelity (the export must match the live app exactly,
including every value-type renderer, ranking indicator, and highlight rule) versus
decoupling (an export that does not break when app internals are refactored). The app
already centralises all rendering in React components under `app/src/components/`, and
the "interactive, self-contained" fidelity choice means the exported file must run real
application code regardless — a static template alone cannot satisfy the interactivity
requirement.

## Decision

The export renders the actual app components via `react-dom/server` for the initial HTML
and ships an inlined JavaScript bundle that hydrates them on load. There is a single
source of truth for rendering — the app's React components — shared by both the hosted
app and the export. The export script produces a second build/render target over the same
component tree; it does not maintain its own copy of formatting logic.

## Rationale

The interactivity requirement already forces real application code into the file, so a
standalone template could not have avoided shipping app logic anyway — it would only have
added a *second*, divergent rendering path for the static parts. Reusing the components
guarantees the exported file and the live app can never drift in how a value is formatted
or ranked, which is the primary quality bar for the feature. The duplication cost of a
standalone template (every value renderer reimplemented and kept in sync forever) was
judged strictly worse than the coupling cost of reuse.

## Alternatives considered

- **Standalone template in the export script** — rejected: duplicates all value-formatting
  and ranking logic, which would inevitably drift from the app; and it cannot satisfy the
  "interactive offline" requirement without shipping app code anyway, negating its main
  supposed benefit (decoupling).
- **In-app client-side download button** (serialize current DOM/state to a file) —
  rejected for this milestone in favour of a CLI: a `pnpm export <type>` script fits the
  existing `.scripts/` convention and compile-time data model, is scriptable/CI-friendly,
  and keeps export logic out of the interactive UI. (Not foreclosed as a future addition.)

## Consequences

- **Makes easy:** guaranteed formatting parity with the live app; new value types and
  rendering changes flow into the export for free.
- **Makes hard / costs accepted:** the export is now coupled to component and build
  internals — a second SSR/hydration build target must be maintained, and refactors to
  component prop shapes or data wiring must keep the export build green. Server-rendering
  imposes the constraint that comparison components remain SSR-safe (no unguarded
  `window`/`document` access at module load).
- **Revisit if:** the SSR/hydration build target becomes a disproportionate maintenance
  burden, or a future need for a truly logic-free static snapshot (e.g. email-safe HTML)
  emerges — either would be a new ADR superseding this one.

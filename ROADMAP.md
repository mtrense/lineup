# Lineup Roadmap

<!--
  Index format: each milestone lives in its own file under `roadmap/`, named
  `NNNN-slug.md` (zero-padded sequential number + kebab-case slug). This file is
  a table of contents only — one line per milestone:

      NNNN-slug.md — [status] one-line summary

  where [status] matches the milestone file's **Status:** field. Add new
  milestones by creating the next-numbered file and appending a line here.
-->

0001-project-foundation.md — [Done] Establish the React app with all tooling and the data-loading infrastructure.
0002-data-infrastructure.md — [Done] Compile-time JSON data loading with TypeScript types and access utilities.
0003-core-comparison-ui.md — [Done] Side-by-side comparison UI with collapsible groups and renderers for every value type.
0004-first-comparison-data.md — [Done] First real comparison type (Databases) with researched data validating the schema.
0005-usability-improvements.md — [Done] URL-based routing, shareable deep links, and text-wrapping fixes.
0006-candidate-selection.md — [Done] Candidate selection UI with add/remove and URL-persisted state.
0007-filtering-and-sorting.md — [Done] Filtering and sorting with ranking indicators and best-value highlighting.
0008-polish-and-ux.md — [Done] UX polish: tooltips, source citations, keyboard nav, dark mode, and print view.
0009-enhanced-filter-ui.md — [Done] Clearer filter controls: tri-state boolean icons and tag pill groups.
0010-attribute-descriptions-and-expandable-rows.md — [Done] Optional attribute descriptions surfaced via expandable rows replacing tooltips.
0011-filter-dialog-fix.md — [Done] Fix overlapping close/clear buttons in the filters dialog.
0012-repeated-candidate-headers-in-sections.md — [Done] Repeated candidate-name headers atop each attribute group section.
0013-filter-dialog-organization.md — [Done] Organize the filter dialog by attribute group in source order.
0014-range-slider-filters.md — [Done] Range slider filters for numeric and temporal attribute types.
0015-candidate-data-freshness-timestamp.md — [completed] Per-candidate "Last Verified" timestamp surfacing how fresh the data is.
0016-icon-glyphs-for-attribute-values.md — [completed] Working FontAwesome/Devicon icon glyphs for tag and icon attribute values.
0017-apply-icon-glyphs-across-comparison-data.md — [completed] Sweep applying icon glyphs across every active comparison type's data.
0018-landing-page-redesign.md — [completed] Landing page redesign: grouped tiles, decorative background SVGs, and explanatory sections.
0019-single-comparison-html-export.md — [open] `pnpm export <type>` produces a self-contained, interactive single-comparison HTML file reusing the app's components.

---

## Future Considerations (Not Scheduled)

- **Search**: Find candidates across all comparison types
- **Export**: Download comparison as CSV/PDF
- **Embed**: Shareable comparison widgets
- **User Contributions**: Suggest corrections or new candidates
- **Additional Comparison Types**: Languages, frameworks, cloud providers, etc.

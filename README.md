# Lineup

A static React application for comparing items side-by-side across shared attributes. Whether you're evaluating databases, programming languages, libraries, or any other category, Lineup helps you make informed decisions by presenting data in a clear, comparable format.

## Features

- **Side-by-side comparisons** - View multiple candidates simultaneously with their attributes aligned
- **Grouped landing page** - Comparisons organized into named groups, each tile carrying an optional decorative background graphic, with on-page sections explaining what Lineup is, how it's built, where the data comes from, and how to contribute
- **Multiple comparison types** - Support for databases, languages, libraries, frameworks, and more
- **Rich value types** - Display data as text, numbers, ratings, tags, icons, file sizes, durations, and more
- **Collapsible attribute groups** - Organize related attributes into logical sections
- **Value ranking** - Visual indicators for best/worst values based on configurable direction (higher or lower is better)
- **Source citations** - Every data point can include sources and comments, shown in tooltips on hover
- **Responsive design** - Works on desktop and mobile devices
- **Self-contained HTML export** - Export any single comparison to one portable `.html` file that renders and stays fully interactive (filter, sort, toggle candidates, dark mode) with no server, build step, or repo access — see [Exporting a Comparison](#exporting-a-comparison)

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- [pnpm](https://pnpm.io/) package manager

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/lineup.git
cd lineup

# Install dependencies
cd app
pnpm install

# Start development server
pnpm dev
```

The application will be available at `http://localhost:5173`.

### Building for Production

```bash
cd app
pnpm build
```

The built files will be in `app/dist/` and can be served by any static file server.

### Exporting a Comparison

Export a single comparison type to one self-contained HTML file — everything (application
JS, CSS, and the comparison's data) inlined, so the file opens directly in a browser with
no server, build step, or repo access on the recipient's side:

```bash
# From the repo root
.scripts/export.sh databases > databases.html

# …or directly via the app package
pnpm --dir app export databases > databases.html
```

Open the resulting file in a browser: it server-side-renders on first paint, then hydrates
into the fully interactive comparison view — filtering, sorting, candidate toggles,
expandable rows, ranking/best-value highlighting, and `prefers-color-scheme` dark mode all
work offline. The export reuses the app's own React components, so formatting and rankings
always match the live app. The only possible network request is Devicon icon glyphs from a
CDN; FontAwesome icons and all application logic and data are inlined. Passing an unknown
comparison-type id fails with a clear error on stderr and a non-zero exit (no file is written
to stdout). Interactive state is in-session only and is not persisted to the URL.

## Project Structure

```
lineup/
├── app/                        # React application
│   ├── src/
│   │   ├── components/         # React components
│   │   ├── lib/                # Utilities
│   │   └── types/              # TypeScript types
│   └── package.json
├── data/                       # Comparison data
│   ├── index.json              # Comparison groups + list of available comparisons
│   └── <comparison-type>/      # One directory per comparison type
│       ├── index.json          # List of candidates
│       ├── attributes.json     # Attribute definitions
│       ├── tile.svg            # Optional decorative landing-page tile graphic
│       └── <candidate>.json    # Candidate data files
└── docs/                       # Documentation
```

## Adding Comparison Data

Lineup ships with Claude Code skills under `.claude/skills/` that handle each step of creating and maintaining comparison data. The skills are invoked as slash commands inside Claude Code.

### Skills

| Skill | Purpose |
|-------|---------|
| `/new-type <type> [seed]` | Draft `data/<type>/RESEARCH.md` for a brand-new comparison type through a short Socratic scoping conversation (purpose, scope, attribute groups, candidates). Writes only the research guide so you can iterate on it before any schema files are generated. |
| `/scaffold-type <type> [candidate-id …]` | Translate RESEARCH.md into `data/<type>/attributes.json`, register the type in the top-level `data/index.json`, and scaffold empty-`values` stubs for each Initial Candidate into `data/<type>/index.json`. Re-run later (with or without explicit ids) to scaffold additional candidates. |
| `/add-candidate <type> <name> [url / description / reason]` | Add a single candidate after a scope-fit check against RESEARCH.md's Scope section. Creates the stub, appends to `index.json`, and appends a `- [ ] <Name> — <reason> (added <date>)` line to RESEARCH.md's Candidates list. |
| `/discover-candidates <type> [hint]` | Search the web for candidates that fit the type's scope, filter and deduplicate against the existing roster, present the picks for selection, and scaffold the chosen ones the same way `/add-candidate` does. |
| `/extend-comparison <type> <description>` | Append one or more new attributes (or a whole new attribute group) to an already-scaffolded type. Updates RESEARCH.md's Attribute Groups tables and `attributes.json` in lockstep. Existing candidates render `—` for the new attribute until filled in. |
| `/gather-data <type> [candidate] [attribute-or-group]` | Research and populate attribute values for a candidate via web sources. Records `{value, source, comment}` per attribute, stamps `lastVerified`, and ticks the RESEARCH.md checkbox on first research. |
| `/gather-data-cycle <type> [count\|all][@workers]` | Drive `/gather-data` across many unchecked candidates hands-off. Researches candidates in parallel via isolated fresh-context workers, then serially ticks each RESEARCH.md checkbox and commits its file. Defaults to 5 candidates, 4 parallel workers (e.g. `databases 8@4`, `databases all@3`). |
| `/generate-tile <type>` | Generate a decorative `data/<type>/tile.svg` background graphic for the comparison type's landing-page tile. The SVG uses bold, theme-neutral shapes (no text, no hard-coded colours) that render at low opacity behind the tile card in both light and dark mode. Re-run to regenerate. |

### Typical Workflow

Creating a new comparison type end-to-end:

1. **Scope the type.** `/new-type <type> <optional seed>` — iterate on the generated `RESEARCH.md` until purpose, scope, attribute groups, and candidates read well.
2. **Scaffold schema and stubs.** `/scaffold-type <type>` — generates `attributes.json`, registers the type in `data/index.json`, and creates empty stubs for each Initial Candidate.
3. **Research each candidate.** `/gather-data <type>` — auto-picks the next under-researched candidate, searches primary sources, and populates the `values` block. Repeat until every candidate is covered, or run `/gather-data-cycle <type> [count\|all][@workers]` to research the whole roster hands-off in parallel.

### Growing an Existing Comparison

- **Add a candidate you have in mind.** `/add-candidate <type> <name> <optional url/description/reason>`, then `/gather-data <type> <candidate-id>` to research it.
- **Discover candidates to consider.** `/discover-candidates <type> [hint]` surfaces a vetted picklist from the web; picks are scaffolded automatically.
- **Add a new attribute.** `/extend-comparison <type> <description>`, then `/gather-data <type> <candidate> <new-attribute-id>` per existing candidate to fill the column.

### Manual Alternative

The underlying layout is plain JSON and markdown — see [Project Structure](#project-structure) and the data schema in `CLAUDE.md`. The skills exist for convenience, not as a gate; direct edits work fine.

### Attribute Types

Lineup supports various value types for attributes:

| Type | Description | Example |
|------|-------------|---------|
| `integer` | Whole numbers | Release year, version number |
| `decimal` | Decimal numbers | Performance score |
| `filesize` | File sizes (auto-formatted) | Binary size, memory usage |
| `duration` | Time durations | Build time, response time |
| `date` | Calendar dates (year, month-year, or full) | Release date, initial release year |
| `datetime` | Date and time | Last updated, event timestamp |
| `text` | Free-form text | Description, license |
| `boolean` | Yes/No values | Feature support flags |
| `rating` | Star ratings or similar | Community rating |
| `tags` | Labeled categories; each tag can carry an icon and a Tags attribute can render label, icon-only (with accessible tooltip), or both | Supported platforms, primary language |
| `icon` | Real glyphs via FontAwesome or Devicon (tree-shaken through an icon registry), plus emoji | Logo, language/OS badge |
| `link` | Clickable URLs | Documentation, repository |

### Example Candidate File

```json
{
  "name": "PostgreSQL",
  "description": "Advanced open-source relational database",
  "url": "https://postgresql.org",
  "values": {
    "license": {
      "value": "PostgreSQL License",
      "source": ["https://www.postgresql.org/about/licence/"]
    },
    "acid-compliant": {
      "value": true
    },
    "initial-release": {
      "value": 1996
    }
  }
}
```

## Tech Stack

- **React** - UI framework
- **Vite** - Build tool and dev server
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI component library

## Development

### Available Scripts

```bash
pnpm dev             # Start development server
pnpm build           # Build for production
pnpm preview         # Preview production build
pnpm export <type>   # Export one comparison to a self-contained HTML file (stdout)
pnpm lint            # Run linter
pnpm format          # Format code
```

## Contributing

Contributions are welcome! Whether you want to:

- Add new comparison types with researched data
- Improve the UI/UX
- Fix bugs or add features
- Improve documentation

Please feel free to open an issue or submit a pull request.

## License

[MIT](LICENSE)

# Lineup

A static React application for comparing items side-by-side across shared attributes. Whether you're evaluating databases, programming languages, libraries, or any other category, Lineup helps you make informed decisions by presenting data in a clear, comparable format.

## Features

- **Side-by-side comparisons** - View multiple candidates simultaneously with their attributes aligned
- **Multiple comparison types** - Support for databases, languages, libraries, frameworks, and more
- **Rich value types** - Display data as text, numbers, ratings, tags, icons, file sizes, durations, and more
- **Collapsible attribute groups** - Organize related attributes into logical sections
- **Value ranking** - Visual indicators for best/worst values based on configurable direction (higher or lower is better)
- **Source citations** - Every data point can include sources for verification
- **Responsive design** - Works on desktop and mobile devices

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
│   ├── index.json              # List of available comparisons
│   └── <comparison-type>/      # One directory per comparison type
│       ├── index.json          # List of candidates
│       ├── attributes.json     # Attribute definitions
│       └── <candidate>.json    # Candidate data files
└── docs/                       # Documentation
```

## Adding Comparison Data

### Creating a New Comparison Type

1. Create a directory under `data/` (e.g., `data/databases/`)
2. Add the comparison type to `data/index.json`
3. Create `attributes.json` defining the attributes to compare
4. Create `index.json` listing the candidates
5. Add individual `<candidate>.json` files for each item

### Attribute Types

Lineup supports various value types for attributes:

| Type | Description | Example |
|------|-------------|---------|
| `integer` | Whole numbers | Release year, version number |
| `decimal` | Decimal numbers | Performance score |
| `filesize` | File sizes (auto-formatted) | Binary size, memory usage |
| `duration` | Time durations | Build time, response time |
| `date` | Calendar dates | Release date, end-of-life date |
| `datetime` | Date and time | Last updated, event timestamp |
| `text` | Free-form text | Description, license |
| `boolean` | Yes/No values | Feature support flags |
| `rating` | Star ratings or similar | Community rating |
| `tags` | Labeled categories | Supported platforms |
| `icon` | Icons or emojis | Logo, status indicator |
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
pnpm dev      # Start development server
pnpm build    # Build for production
pnpm preview  # Preview production build
pnpm lint     # Run linter
pnpm format   # Format code
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

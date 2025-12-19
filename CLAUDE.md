# Lineup - Claude Code Guide

## Project Overview

Lineup is a static React application for comparing items side-by-side across shared attributes. It supports multiple comparison types (languages, databases, libraries, etc.) with pluggable data directories.

<!--
@README.md    // User-facing documentation and usage
@ROADMAP.md   // Current state of planning
@TASKS.md     // Breakdown of current milestone
-->

## Tech Stack and Major Decisions

### Framework and Tooling
- `pnpm`/`pnpx`
- Vite
- React
- Tailwind
- shadcn

### Data Handling
- Data is kept in JSON files in the `data` directory
- Comparison types are declared in `data/index.json`
- Candidates for each comparison type are listed in `data/<comparison-type>/index.json`
- All JSON files loaded at compile time via `require`

## Project Structure

```
lineup/
├── app/                        # React application
│   ├── src/
│   └── package.json
├── data/                       # Comparison data directories
│   ├── index.json              # List of comparisons
│   └── <comparison-type>/      # One directory per comparison type
│       ├── RESEARCH.md         # Guidelines for how to do research on specific attributes or other information, where needed
│       ├── index.json          # List of comparison candidates
│       ├── attributes.json     # Attribute definitions
│       └── <candidate>.json    # One file per candidate
├── docs/                       # Documentation
│   └── archive/                # Progress on previous milestones
│       └── MILESTONE-<N>.md    # Tasks from Milestone N
├── CLAUDE.md                   # Guidelines for development and maintenance of comparisons with Claude Code
└── README.md                   # User-facing documentation
```

The web app is placed in the `app/` folder, to keep web app and data separated.

## Data Format

### attributes.json

Defines the attributes for a comparison type.

```typescript
type Integer = {
    type: "integer",
    direction: "ascending" | "descending" | "neutral"  // neutral = no ranking
}

type Decimal = {
    type: "decimal",
    direction: "ascending" | "descending" | "neutral"  // neutral = no ranking
}

type Filesize = {
    type: "filesize",
    direction: "ascending" | "descending"  // smaller vs larger is better
}

type Duration = {
    type: "duration",
    direction: "ascending" | "descending"  // faster vs longer is better
}

type Date = {
    type: "date",
    direction: "ascending" | "descending",  // newer vs older is better
    format?: "year" | "month-year" | "full"  // default: "full"
    // "year" displays "2024", stored as "2024" or "2024-01-01"
    // "month-year" displays "Jan 2024", stored as "2024-01" or "2024-01-15"
    // "full" displays "Jan 15, 2024", stored as "2024-01-15"
}

type DateTime = {
    type: "datetime",
    direction: "ascending" | "descending"  // newer vs older is better
}

type Percentage = {
    type: "percentage",
    direction: "ascending" | "descending"  // higher vs lower percentage is better
}

type Rating = {
    lower: number,
    upper: number,
    direction: "ascending" | "descending",
    symbols: {
        empty: string,
        half?: string,
        full: string
    }
}

type Tag = {
    id: string;
    value: string;
    color?: string;
    icon?: string;
}

type Tags = {
    defaultColor: string;
    tags: Tag[];
}

type FaIcon = {
    type: "icon-fontawesome";
    name: string;
    pack?: string;
}

type Icon = FaIcon | Emoji;

// Presentation type determines how the value is rendered
type ValueType =
  | Integer       // Integer value (stored as number, decimal places cut off)
  | Decimal       // Decimal value (stored as number)
  | Filesize      // Filesize (stored as number, formatted like "1.2 MB")
  | Duration      // Time duration (stored as number of milliseconds, formatted like "1:05:42.345")
  | Date          // Calendar date (stored as ISO 8601 string, format controls display: "2024", "Jan 2024", or "Jan 15, 2024")
  | DateTime      // Date and time (stored as ISO 8601 string "YYYY-MM-DDTHH:mm:ss", displayed like "Jan 15, 2024 14:30")
  | Percentage    // Percentage value (stored as 0-100 or 0-1, displayed with colored bar)
  | "text"        // Freeform text (stored as string)
  | "boolean"     // Checkmark or cross (stored as boolean)
  | Rating        // Star rating or similar (stored as decimal, displayed with symbols and numeric ratio)
  | Tags          // A list of tags
  | Icon          // Icon or small graphic
  | "link";       // Clickable URL


interface Attribute {
  id: string;                         // Unique identifier
  name: string;                       // Display name
  valueType: ValueType;
  description?: string;               // Tooltip/help text
  icon?: string;                      // Optional icon
}

interface AttributeGroup {
  id: string;                         // Unique identifier
  name: string;                       // Display name
  description?: string;               // Optional description
  icon?: string;                      // Optional icon
  expandedByDefault: boolean;         // Whether this group is expanded when the page loads
  attributes: Attribute[];            // List of attributes
}

interface AttributesFile {
  name: string;                       // Comparison type name (e.g., "Databases")
  description?: string;               // What this comparison covers
  groups: AttributeGroup[];           // Attribute group definitions
}
```

### <candidate>.json

Contains a single candidate's data.

```typescript
interface AttributeValue {
  value:
    | number                          // For integer, decimal, filesize, duration, percentage, rating
    | string                          // For text, icon, link, date, datetime
    | string[]                        // For tags
    | boolean                         // For boolean
    | null;                           // Unknown/not applicable
  source?: string[];                  // Source URLs for this value
  comment?: string;                   // Any comment on the source or the value itself
}

interface CandidateFile {
  name: string;                       // Display name (e.g., "PostgreSQL")
  description?: string;               // Short description
  icon?: string;                      // Icon for the candidate
  url?: string;                       // Official website or repository
  values: {
    [attributeId: string]: AttributeValue;  // Key matches Attribute.id
  };
}
```

## Key Concepts

- **Value Types**: How an attribute is stored and displayed (integer, decimal, filesize, duration, date, datetime, percentage, text, boolean, rating, tags, icon, link)
- **Direction**: For rankable types, whether ascending (higher/larger is better) or descending (lower/smaller is better) values are preferred; `neutral` for non-ranked numerics
- **Attribute Groups**: Logical clustering of related attributes with collapsible UI

## Development Workflow

### Planning Phase (Strategic)
When prompted to sketch out the next milestones:
1. Add the next milestones to `ROADMAP.md`
2. Describe each milestone in terms of achieved goals and success criteria
3. Maintain the planning and implementation state of each milestone ("Not planned", "Ready for implementation", "Done")

### Breakdown Phase (Tactical)
When asked to break down the next unfinished milestone:
1. Create a plan in `TASKS.md` at the project root
2. Break down the work into small, meaningful increments
3. Each increment should be independently committable
4. Describe the tasks carried out in each increment in detail
5. Persist the plan in `TASKS.md` for review before proceeding
6. Set the state of the milestone to "Ready for implementation"

### Implementation Phase
For each increment planned in `TASKS.md`:
1. Write failing tests first (TDD approach)
2. Implement the minimal code to pass tests
3. Update all relevant documentation
5. Take care of project configuration like gitignore and similar
6. Update tasks in `TASKS.md`
7. Commit the increment with a meaningful message
8. When all work for the current milestone is done, update `ROADMAP.md` accordingly and move `TASKS.md` to the `docs/progress` directory to be ready for the next planning phase

## Adding and maintaining Comparison Data

### `RESEARCH.md`
- Guidelines on which attributes to research for every candidate
- Guidelines on how to research and assess the given attributes
- Contains a list of candidates not yet researched or planned for re-assessment

### Adding a New Comparison Type
When asked to create a new type of comparison:
1. Create a new directory under `data/`
2. Brainstorm the researched attributes and information with the user, resulting in the creation of a specific `RESEARCH.md`
3. Use `RESEARCH.md` to create `attributes.json` following the schema
4. Add the comparison type to `data/index.json`
5. Make a suggestion for an initial set of candidates and add them to `RESEARCH.md`
6. Create `<candidate>.json` files for each candidate to compare

### Gathering Candidate Data
When asked to research a candidate:
1. Follow the guidelines in the comparison type's `RESEARCH.md`
2. Admit missing of information or ambiguity when the research on an attribute isn't given proper information
3. Create a `<candidate>.json` file according to the given schema with all the gathered information
4. Add the candidate to `data/<comparison-type>/index.json`

## Code Conventions
- Data files use JSON format
- Candidate filenames should be lowercase, hyphenated (e.g., `postgresql.json`)
- All candidates in a comparison type must have values for all required attributes

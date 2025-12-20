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

### index.json (per comparison type)

Lists the candidates for a comparison type and controls initial visibility.

```typescript
interface CandidateEntry {
  id: string;                         // Candidate file name (without .json)
  shownByDefault: boolean;            // Whether candidate is shown on initial page load
}

interface CandidateIndex {
  candidates: CandidateEntry[];       // List of candidates in display order
}
```

**Note:** When `shownByDefault` is `false`, the candidate is still available but not selected initially. Users can toggle visibility. If no candidates have `shownByDefault: true`, all candidates are shown.

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
  source?: string[];                  // Source URLs for this value (shown in tooltip)
  comment?: string;                   // Additional context (shown in tooltip)
}
// Note: When source or comment are present, hovering over the value
// displays a tooltip with the comment text and clickable source links.

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

Each comparison type should have a `RESEARCH.md` file that serves as the authoritative guide for researching candidates. This file ensures consistency across all candidate data files.

#### Required Sections

1. **Overview**
   - Brief description of the comparison type's purpose
   - What users should be able to learn from this comparison

2. **Scope**
   - **Included**: What types of items belong in this comparison
   - **Excluded**: What's explicitly out of scope (prevents ambiguity)

3. **Attribute Groups**
   - Mirror the structure from `attributes.json`
   - For each attribute, provide a table with columns:
     | Attribute | Type | Research Notes |
     |-----------|------|----------------|
   - Research Notes explain how to determine the value (what to look for, edge cases)

4. **Research Sources**
   - **Primary Sources**: Preferred sources (official docs, GitHub, official website)
   - **Secondary Sources**: Fallback sources (Wikipedia, community sites, rankings)

5. **Assessment Guidelines**
   - Clarify how to assess ambiguous attributes
   - Define thresholds and criteria for subjective ratings
   - Specify when to use `null` vs a value

6. **Initial Candidates**
   - Prioritized list of candidates to research
   - Use checkboxes to track completion: `- [x] Done` / `- [ ] Pending`
   - Organize into tiers (Must Have, Should Have, Nice to Have)

7. **Notes for Researchers**
   - General principles (verify before recording, cite sources, admit uncertainty)
   - Date-sensitive data handling
   - Version-specific considerations

#### Example Structure

```markdown
# [Comparison Type] Research Guide

## Overview
[Purpose and goals of this comparison]

## Scope
**Included:** [What belongs here]
**Excluded:** [What doesn't belong]

## Attribute Groups

### 1. [Group Name]
| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Attr 1** | text | How to find this value |
| **Attr 2** | boolean | Criteria for true vs false |

## Research Sources

### Primary Sources (Preferred)
1. Official Documentation
2. Official GitHub Repository

### Secondary Sources
3. Wikipedia
4. Community resources

## Assessment Guidelines
- **[Attribute]**: Specific criteria for this attribute...

## Initial Candidates

### Tier 1 (Must Have)
- [ ] Candidate A - reason for inclusion
- [ ] Candidate B - reason for inclusion

### Tier 2 (Should Have)
- [ ] Candidate C

## Notes for Researchers
1. Always verify claims from multiple sources
2. Use `null` for values that cannot be reliably determined
```

### Adding a New Comparison Type
When asked to create a new type of comparison:
1. Create a new directory under `data/`
2. Brainstorm the researched attributes and information with the user, resulting in the creation of a specific `RESEARCH.md`
3. Use `RESEARCH.md` to create `attributes.json` following the schema
4. Add the comparison type to `data/index.json`
5. Make a suggestion for an initial set of candidates and add them to `RESEARCH.md`
6. Commit the gathered information with a commit message of "data(<comparison-type>): RESEARCH \n <summary of the research>"

### Gathering Candidate Data
When asked to research a candidate:
1. Follow the guidelines in the comparison type's `RESEARCH.md`
2. Admit missing of information or ambiguity when the research on an attribute isn't given proper information
3. Create a `<candidate>.json` file according to the given schema with all the gathered information
4. Add the candidate to `data/<comparison-type>/index.json`
5. Commit the gathered information with a commit message of "data(<comparison-type>): CANDIDATE <initial|refresh> <date-and-time> \n <summary or the gathered information>"

## Code Conventions
- Data files use JSON format
- Candidate filenames should be lowercase, hyphenated (e.g., `postgresql.json`)
- All candidates in a comparison type must have values for all required attributes

# Milestone 3: Core Comparison UI

Build the main comparison view components with side-by-side candidate display and all value type renderers.

## Reference Design

Based on the predecessor screenshot, the UI should feature:
- Dark theme as default
- Clean table layout with attribute groups
- Candidate selector chips at the top
- Collapsible attribute groups with expand/collapse indicators
- Various value renderers with appropriate styling

---

## Increment 1: Dark Theme and Base Layout

### Tasks
- [x] Configure Tailwind for dark mode as default
- [x] Update the base styling in `index.css` to use dark theme
- [x] Create a more refined header with the comparison title centered
- [x] Add the comparison description as a subtitle

### Files modified
- `app/index.html` - Added `dark` class to html element
- `app/src/App.tsx` - Refined landing page and comparison view layout

---

## Increment 2: Comparison Page Layout

### Tasks
- [x] Create `ComparisonView` component for the main comparison display
- [x] Implement the header section with title and description
- [x] Add a sticky header row for candidate names
- [x] Create the scrollable table container

### Files created/modified
- `app/src/components/ComparisonView.tsx` - Main comparison view component
- `app/src/App.tsx` - Integrated ComparisonView

---

## Increment 3: Candidate Selector

### Tasks
- [x] Create `CandidateSelector` component with toggleable chips
- [x] Style chips similar to reference (dark pills, highlight when selected)
- [x] Add "Select All" and "Clear" actions
- [x] Show selection count (e.g., "3 of 16 selected")
- [x] Wire up selection state to filter displayed candidates

### Implementation
Candidate selector is built into ComparisonView component with:
- Toggleable pill-style buttons
- Select All / Clear actions
- Selection count display
- Filtering of visible candidates

---

## Increment 4: Attribute Group Rows

### Tasks
- [x] Create `AttributeGroupRow` component
- [x] Style group headers with distinct background
- [x] Add expand/collapse toggle (chevron icons)
- [x] Track expanded state per group (respecting `expandedByDefault`)
- [x] Show group icon if present

### Implementation
Attribute groups are rendered inline in ComparisonView with:
- Collapsible sections with chevron indicators
- Distinct background styling (muted/50)
- State tracking respecting expandedByDefault

---

## Increment 5: Value Renderers - Basic Types

### Tasks
- [x] Create `ValueRenderer` component that dispatches to specific renderers
- [x] Implement `TextValue` renderer
- [x] Implement `BooleanValue` renderer (✓ green / ✗ red)
- [x] Implement `LinkValue` renderer (clickable, styled link)
- [x] Implement `IntegerValue` renderer (formatted number)
- [x] Implement `DecimalValue` renderer (formatted decimal)

### Files created
- `app/src/components/values/ValueRenderer.tsx`
- `app/src/components/values/TextValue.tsx`
- `app/src/components/values/BooleanValue.tsx`
- `app/src/components/values/LinkValue.tsx`
- `app/src/components/values/IntegerValue.tsx`
- `app/src/components/values/DecimalValue.tsx`
- `app/src/components/values/index.ts`

---

## Increment 6: Value Renderers - Complex Types

### Tasks
- [x] Implement `TagsValue` renderer (colored pills)
- [x] Implement `RatingValue` renderer (colored bar with dots/symbols)
- [x] Implement `FilesizeValue` renderer (formatted like "1.2 MB")
- [x] Implement `DurationValue` renderer (formatted like "1:05:42")
- [x] Implement `IconValue` renderer (FontAwesome or emoji)

### Files created
- `app/src/components/values/TagsValue.tsx`
- `app/src/components/values/RatingValue.tsx`
- `app/src/components/values/FilesizeValue.tsx`
- `app/src/components/values/DurationValue.tsx`
- `app/src/components/values/IconValue.tsx`

---

## Increment 7: Integration and Polish

### Tasks
- [x] Wire up all value renderers in ComparisonView
- [x] Ensure proper column sizing and alignment
- [x] Add hover states and transitions
- [x] Test with existing test data
- [x] Create sample data that exercises all value types

### Files modified
- `app/src/components/ComparisonView.tsx`
- `data/test/attributes.json` - Enhanced with all value types
- `data/test/alpha.json` - Added all value type examples
- `data/test/beta.json` - Added all value type examples

---

## Increment 8: Responsive Layout

### Tasks
- [x] Handle narrow screens with horizontal scroll
- [x] Ensure attribute column stays visible (sticky)
- [x] Test at various breakpoints
- [x] Optimize touch interactions for mobile

### Implementation
- `overflow-x-auto` on table container for horizontal scroll
- `sticky left-0` on attribute column
- Flexible widths with `min-w-[180px]` for candidate columns

---

## Success Criteria (from ROADMAP.md)
- [x] Comparison selection/landing page
- [x] Side-by-side candidate comparison layout
- [x] Collapsible attribute groups
- [x] Value renderers for all types:
  - [x] Integer (with direction indicators)
  - [x] Decimal (with direction indicators)
  - [x] Filesize (formatted display)
  - [x] Duration (formatted display)
  - [x] Text
  - [x] Boolean (checkmark/cross)
  - [x] Rating (configurable symbols)
  - [x] Tags (colored labels)
  - [x] Icon (FontAwesome support)
  - [x] Link (clickable URLs)
- [x] Responsive layout for different screen sizes

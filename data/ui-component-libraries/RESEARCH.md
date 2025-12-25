# UI Component Libraries Research Guide

## Overview

This comparison helps developers choose a UI component library for building web applications. It covers component libraries across major frontend frameworks (React, Vue, Angular, Svelte, Solid) as well as framework-agnostic solutions.

Users should be able to:
- Find a component library that fits their framework and design requirements
- Compare accessibility, customization, and theming capabilities
- Evaluate bundle size impact and performance characteristics
- Assess documentation quality and community health
- Understand the design philosophy (headless vs styled, opinionated vs flexible)

## Scope

**Included:**
- JavaScript/TypeScript UI component libraries for web applications
- Styled component libraries (MUI, Chakra, Ant Design, etc.)
- Headless/unstyled component libraries (Radix, Headless UI, React Aria, etc.)
- Design system implementations (shadcn/ui, Park UI, etc.)
- Framework-specific and framework-agnostic libraries
- Both commercial and open-source options

**Excluded:**
- Pure CSS frameworks without JavaScript components (Tailwind, Bootstrap CSS-only)
- Icon libraries (separate comparison)
- Animation libraries (Framer Motion, GSAP, etc.)
- State management solutions
- Form libraries (unless part of a larger component suite)
- Mobile-only libraries (React Native, NativeScript)
- Full application frameworks (Next.js, Nuxt, etc.)

## Attribute Groups

### 1. General Info
| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Name** | text | Official name of the library |
| **Description** | text | One-line description of the library's main value proposition |
| **Website** | link | Official website or documentation site |
| **Repository** | link | GitHub/GitLab repository URL; null for closed-source |
| **License** | text | SPDX license identifier (MIT, Apache-2.0, Commercial, etc.) |
| **Active Maintenance** | boolean | Regular commits/releases in last 6 months |
| **Initial Release** | date (year) | Year of first public release |
| **Latest Release** | date (full) | Date of most recent stable release |
| **GitHub Stars** | integer (ascending) | Current star count; null for closed-source |

### 2. Framework & Architecture
| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Framework** | tags | Target frameworks: react, vue, angular, svelte, solid, vanilla, web-components. Multi-framework libraries get multiple tags |
| **Styling Approach** | tags | How styles are applied: css-in-js, css-modules, tailwind, scss, vanilla-css, unstyled |
| **Component Model** | tags | Architecture: styled (ready-to-use visuals), headless (behavior-only), hybrid (both options) |
| **TypeScript** | boolean | Written in TypeScript with first-class type definitions |
| **SSR Compatible** | boolean | Works with server-side rendering (Next.js, Nuxt, SvelteKit, etc.) |
| **RSC Compatible** | boolean | React Server Components compatible (React libraries only); null for non-React |

### 3. Design & Theming
| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Design System** | text | Named design system if any (Material Design, Ant Design, Fluent, Carbon, custom, none) |
| **Dark Mode** | boolean | Built-in dark mode support or theme switching |
| **Theming System** | boolean | Customizable theme tokens (colors, spacing, typography, etc.) |
| **CSS Variables** | boolean | Uses CSS custom properties for theming |
| **Design Tokens** | boolean | Exportable/configurable design tokens |
| **RTL Support** | boolean | Right-to-left language support |

### 4. Component Coverage
| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Component Count** | integer (ascending) | Number of distinct components (not counting variants) |

#### Form Inputs (Basic)
| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Text Input** | boolean | Standard text input with variants (password, email, search, etc.) |
| **Textarea** | boolean | Multi-line text input, ideally auto-resizing |
| **Select** | boolean | Single-select dropdown |
| **Multi-Select** | boolean | Select with multiple selection support |
| **Combobox** | boolean | Searchable/filterable select with autocomplete |
| **Checkbox** | boolean | Single checkbox and checkbox groups |
| **Radio** | boolean | Radio button groups |
| **Switch/Toggle** | boolean | Toggle switch for boolean values |
| **Slider** | boolean | Range slider, single or dual-thumb |
| **Number Input** | boolean | Numeric input with increment/decrement |

#### Form Inputs (Advanced)
| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Tag Input** | boolean | Input for multiple tags/tokens with add/remove |
| **Pin Input** | boolean | OTP/PIN code input (individual digit boxes) |
| **Color Picker** | boolean | Color selection with picker UI (not just input type=color) |
| **Date Picker** | boolean | Calendar-based date selection |
| **Time Picker** | boolean | Time selection UI |
| **Date Range Picker** | boolean | Select start and end dates |
| **File Upload** | boolean | File input with preview |
| **Dropzone** | boolean | Drag-and-drop file upload area |
| **Rating Input** | boolean | Star rating or similar input |

#### Composite Inputs
| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Input Groups** | boolean | Combine inputs with addons (icons, buttons, text) |
| **Input with Dropdown** | boolean | Input with attached dropdown (e.g., country code + phone) |
| **Button Groups** | boolean | Grouped/segmented buttons acting as single control |
| **Split Button** | boolean | Button with attached dropdown for secondary actions |

#### Data Display
| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Table** | boolean | Basic data table |
| **Data Table** | boolean | Advanced table with sorting, filtering, pagination |
| **Virtual/Infinite List** | boolean | Virtualized scrolling for large lists |
| **Tree View** | boolean | Hierarchical expandable tree structure |
| **List View** | boolean | Styled list with item components |
| **Card** | boolean | Content container card |
| **Avatar** | boolean | User avatar with fallback |
| **Badge** | boolean | Small status indicator on other elements |
| **Tag/Chip/Pill** | boolean | Standalone label/tag component (removable, clickable) |
| **Timeline** | boolean | Vertical timeline of events |
| **Calendar** | boolean | Month/week calendar view (display, not just picker) |

#### Feedback & Status
| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Alert** | boolean | Static alert/banner messages |
| **Toast/Notification** | boolean | Temporary popup notifications |
| **Progress Bar** | boolean | Determinate progress indicator |
| **Progress Circle** | boolean | Circular progress indicator |
| **Spinner/Loader** | boolean | Indeterminate loading indicator |
| **Skeleton** | boolean | Content placeholder during loading |
| **Empty State** | boolean | Placeholder for empty content areas |

#### Overlays & Dialogs
| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Modal/Dialog** | boolean | Centered overlay dialog |
| **Drawer/Sheet** | boolean | Slide-in panel from edge |
| **Popover** | boolean | Floating content anchored to trigger |
| **Tooltip** | boolean | Hover hint text |
| **Dropdown Menu** | boolean | Action menu on click/hover |
| **Context Menu** | boolean | Right-click menu |
| **Command Palette** | boolean | Keyboard-driven command menu (⌘K style) |

#### Navigation
| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Tabs** | boolean | Tab-based content switching |
| **Vertical Tabs** | boolean | Side-oriented tab navigation |
| **Breadcrumb** | boolean | Hierarchical path navigation |
| **Pagination** | boolean | Page navigation controls |
| **Stepper** | boolean | Multi-step process indicator and navigation |
| **Navigation Menu** | boolean | Site navigation with dropdowns |
| **Sidebar** | boolean | Collapsible sidebar navigation |
| **Bottom Navigation** | boolean | Mobile-style bottom nav bar |

#### Layout
| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Grid** | boolean | CSS grid layout wrapper |
| **Stack** | boolean | Flex-based vertical/horizontal stacking |
| **Container** | boolean | Centered max-width container |
| **Divider** | boolean | Horizontal/vertical separator |
| **Aspect Ratio** | boolean | Maintain aspect ratio container |
| **Collapsible** | boolean | Expandable/collapsible content section |
| **Resizable** | boolean | User-resizable panels |
| **Splitter** | boolean | Resizable split panes |

### 5. Integrations
| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Rich Text Editors** | tags | Official integrations: tiptap, slate, lexical, prosemirror, quill, draft-js, none |
| **Code Editors** | tags | Official integrations: monaco, codemirror, prism, shiki, none |
| **Chart Libraries** | tags | Built-in or official: recharts, chart-js, d3, victory, visx, echarts, nivo, built-in, none |
| **Form Libraries** | tags | Official bindings: react-hook-form, formik, react-final-form, vee-validate, vuelidate, zod, yup, none |
| **Animation Libraries** | tags | Documented integration: framer-motion, react-spring, motion-one, gsap, built-in, none |
| **Icon Libraries** | tags | Bundled or supported: lucide, heroicons, phosphor, radix-icons, fontawesome, material-icons, iconify, built-in, none |
| **Date Libraries** | tags | Documented support: date-fns, dayjs, luxon, moment, temporal, built-in, none |

### 6. Accessibility
| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **ARIA Compliant** | boolean | Components follow WAI-ARIA patterns |
| **Keyboard Navigation** | boolean | Full keyboard support for interactive components |
| **Screen Reader Tested** | boolean | Explicitly tested with screen readers (check docs/repo) |
| **Focus Management** | boolean | Proper focus trapping in modals, focus restoration |
| **WCAG Level** | text | Documented compliance level (A, AA, AAA, or null if unspecified) |
| **Accessibility Rating** | rating (1-5, ascending) | Overall a11y quality: 1=poor, 2=basic, 3=adequate, 4=good, 5=excellent |

### 7. Performance
| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Bundle Size (Full)** | filesize (descending) | Full library bundle, minified + gzipped |
| **Bundle Size (Core)** | filesize (descending) | Minimal/core bundle if tree-shakeable; null if not applicable |
| **Tree Shakeable** | boolean | Supports dead code elimination |
| **Zero Runtime** | boolean | No JavaScript runtime for styling (compile-time only) |
| **Lazy Loading** | boolean | Components can be loaded on demand |

### 8. Developer Experience
| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Documentation Quality** | rating (1-5, ascending) | 1=minimal, 2=basic, 3=adequate, 4=good, 5=excellent |
| **Interactive Docs** | boolean | Live component playground/sandbox in docs |
| **Storybook** | boolean | Official Storybook available |
| **Figma Kit** | boolean | Official Figma design kit available |
| **CLI/Generator** | boolean | CLI tool for scaffolding or adding components |
| **npm Weekly Downloads** | integer (ascending) | Weekly download count from npm |
| **Commercial Support** | boolean | Paid support or enterprise tier available |

### 9. Customization
| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Style Override** | tags | Methods to override styles: className, style-prop, styled-api, slots, css-variables |
| **Compound Components** | boolean | Composable sub-component pattern (e.g., `<Menu.Item>`) |
| **Render Props** | boolean | Customization via render props or render functions |
| **Slots** | boolean | Named slots for content injection (Vue/Svelte) or similar pattern |
| **Unstyled Mode** | boolean | Can use components without default styles |

## Research Sources

### Primary Sources (Preferred)
1. **Official Documentation** - Most authoritative for features and capabilities
2. **GitHub Repository** - For release dates, stars, activity, TypeScript status, a11y testing
3. **npm Registry** - For download counts, bundle analysis, dependencies
4. **bundlephobia.com** - For accurate bundle size measurements

### Secondary Sources
5. **Official Blog/Changelog** - For release announcements and roadmap
6. **Component Storybook** - Test components firsthand
7. **Figma Community** - Verify design kit availability

### Tertiary Sources
8. **Comparison articles** - Cross-reference but verify claims independently
9. **GitHub Issues** - Gauge maintenance responsiveness and known issues
10. **Reddit/Twitter** - Community sentiment and real-world usage feedback

## Assessment Guidelines

### Bundle Size
- Measure using bundlephobia.com for consistency
- "Full" = importing everything; "Core" = minimal useful import
- Note if tree-shaking dramatically changes the story

### Component Count
- Count distinct component types, not variants
- Button with 5 variants = 1 component
- Separate Table, DataTable, VirtualTable = 3 components
- Don't count utility hooks or providers

### Documentation Quality Rating
| Rating | Criteria |
|--------|----------|
| 1 | Minimal README, no component docs |
| 2 | Basic component list, incomplete props documentation |
| 3 | Adequate docs with examples, some gaps in edge cases |
| 4 | Good docs, comprehensive API reference, code examples |
| 5 | Excellent docs, interactive examples, guides, recipes, migration paths |

### Accessibility Rating
| Rating | Criteria |
|--------|----------|
| 1 | No accessibility consideration evident |
| 2 | Basic ARIA attributes, inconsistent keyboard support |
| 3 | ARIA-compliant, keyboard navigation, some a11y docs |
| 4 | Screen reader tested, focus management, documented patterns |
| 5 | WCAG AA+ compliant, a11y audited, exemplary implementation |

### Component Model Classification
- **Styled**: Ships with visual design, ready to use (MUI, Ant Design)
- **Headless**: Behavior and accessibility only, no styles (Radix, Headless UI)
- **Hybrid**: Offers both approaches (Chakra with unstyled option)

### When to Use Null
- Feature genuinely doesn't exist
- Cannot verify from documentation or testing
- Not applicable to the library type (RSC for Vue library)

## Initial Candidates

### Tier 1 (Must Have)
High-adoption libraries across major frameworks:

**React**
- [x] **MUI (Material-UI)** - Most popular React component library
- [x] **Ant Design** - Enterprise-focused, comprehensive
- [x] **Chakra UI** - Developer-friendly, accessible
- [x] **Radix UI** - Headless, accessibility-first primitives
- [x] **shadcn/ui** - Copy-paste components built on Radix + Tailwind
- [x] **React Aria** - Adobe's accessibility primitives
- [x] **Headless UI** - Tailwind Labs' unstyled components
- [x] **Mantine** - Full-featured library with hooks
- [x] **PrimeReact** - Enterprise React component suite from PrimeTek

**Vue**
- [x] **Vuetify** - Material Design for Vue
- [x] **Quasar** - Full framework with components
- [x] **PrimeVue** - Enterprise component suite
- [x] **Naive UI** - TypeScript-first Vue 3 library
- [x] **Element Plus** - Vue 3 successor to Element UI
- [x] **Radix Vue** - Radix primitives for Vue

**Multi-Framework**
- [x] **Shoelace** - Web Components, framework-agnostic
- [x] **daisyUI** - Tailwind component classes
- [x] **Web Awesome** - Shoelace successor with Font Awesome integration

### Tier 2 (Should Have)
Notable alternatives and specialized options:

**React**
- [x] **Blueprint** - Palantir's data-dense UI toolkit
- [x] **Evergreen** - Segment's design system
- [x] **Geist UI** - Vercel-inspired minimal design
- [x] **NextUI** - Beautiful, modern React UI (rebranded to HeroUI in Jan 2025)
- [x] **Tremor** - React components for dashboards
- [x] **Park UI** - Like shadcn for multiple frameworks
- [x] **Ark UI** - Chakra team's headless primitives
- [x] **React Bootstrap** - Bootstrap for React
- [x] **Reactstrap** - Bootstrap 5 React components

**Vue**
- [x] **Vuestic UI** - Vue 3 with Tailwind
- [x] **Oruga** - Lightweight Vue 3 UI
- [ ] **Anu** - DX-focused Vue component library
- [ ] **Headless UI Vue** - Tailwind Labs for Vue

**Angular**
- [ ] **Angular Material** - Official Material Design
- [ ] **PrimeNG** - Enterprise Angular components
- [ ] **NG-ZORRO** - Ant Design for Angular
- [ ] **Clarity** - VMware's design system

**Svelte**
- [ ] **Skeleton** - Tailwind UI toolkit for Svelte
- [ ] **Melt UI** - Headless Svelte primitives
- [ ] **Bits UI** - Headless component primitives
- [ ] **shadcn-svelte** - shadcn port for Svelte

**Solid**
- [ ] **Solid UI** - Solid component library
- [ ] **Kobalte** - Headless Solid primitives
- [ ] **Hope UI** - Chakra-inspired for Solid

### Tier 3 (Nice to Have)
Specialized, emerging, or legacy options:
- [ ] **Semantic UI React** - Natural language principles
- [ ] **Grommet** - HPE's responsive components
- [ ] **Rebass** - Primitive styled components
- [ ] **Theme UI** - Themeable design systems
- [ ] **Reakit** - (now Ariakit) Accessibility toolkit
- [ ] **Ariakit** - Reakit successor, headless a11y
- [ ] **Fluent UI** - Microsoft's design system
- [ ] **Carbon** - IBM's design system

## Notes for Researchers

1. **Be exhaustive on Component Coverage and Integrations** - For these sections, use the `comment` field extensively. Document which specific components exist (e.g., "Has DatePicker and DateRangePicker but no TimePicker"), note any limitations (e.g., "Tree View is read-only, no drag-and-drop"), and specify which integrations are official vs community (e.g., "Official React Hook Form adapter, community Formik wrapper"). This detail helps users make informed decisions.

2. **Verify version compatibility** - Check that features apply to the current major version. Vue 2 vs Vue 3, React 17 vs 18 differences matter.

3. **Distinguish headless from styled** - A headless library scoring low on "Design System" isn't a flaw—it's the point. Evaluate within category.

4. **Framework wrappers** - Some libraries (Shoelace, Radix) have multiple framework bindings. Create separate entries if feature sets differ significantly.

5. **Bundle size nuance** - Tree-shaking makes "full bundle" misleading for some libraries. Note both full and realistic "single component" sizes when relevant.

6. **Accessibility claims vs reality** - Many claim "accessible" but implementation varies. Check for actual screen reader testing, not just ARIA attributes.

7. **Commercial tiers** - Libraries like PrimeReact have free and paid tiers. Document free tier capabilities; note premium features in comments.

8. **shadcn model** - Libraries like shadcn/ui are "copy-paste" rather than npm dependencies. Bundle size is zero (it's your code), but note this in styling approach.

9. **Date sensitivity** - GitHub stars, npm downloads, and release dates change. Note research date in source comments.

10. **Design system relationships** - Note when a library implements an existing design system (Material, Ant, Fluent) vs creating its own.

11. **SSR/RSC complexity** - SSR support levels vary (partial, full, with caveats). RSC compatibility is evolving—verify with latest React version.

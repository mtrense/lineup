# Web-based Rich Text Editors Research Guide

## Overview

This comparison helps developers choose a rich text editor library for web applications. It covers both traditional WYSIWYG editors and markdown-first editors, comparing their technical foundations, feature sets, and developer experience.

Users should be able to:
- Find an editor that fits their framework and technical requirements
- Compare collaboration capabilities across editors
- Evaluate feature completeness for their use case
- Assess long-term viability through community and maintenance metrics

## Scope

**Included:**
- JavaScript/TypeScript rich text editor libraries for web applications
- WYSIWYG editors (contenteditable-based, canvas-based, or hybrid)
- Markdown-first editors with rich preview/editing capabilities
- Both framework-agnostic and framework-specific editors
- Commercial and open-source options

**Excluded:**
- Code editors (Monaco, CodeMirror, Ace) - separate comparison planned
- Simple textarea enhancements without rich formatting
- Full CMS platforms (WordPress editor as standalone is fine, WordPress as CMS is not)
- Desktop-only applications
- PDF editors or document viewers

## Attribute Groups

### 1. General Info
| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Name** | text | Official name of the editor |
| **Description** | text | One-line description of the editor's main value proposition |
| **Website** | link | Official website or documentation site |
| **Repository** | link | GitHub/GitLab repository URL; null for closed-source |
| **License** | text | SPDX license identifier (MIT, Apache-2.0, GPL-3.0, Commercial, etc.) |
| **Initial Release** | date (year) | Year of first public release; check GitHub first commit or npm publish date |
| **Latest Release** | date (full) | Date of most recent stable release; check GitHub releases or npm |
| **GitHub Stars** | integer (ascending) | Current star count; null for closed-source projects |

### 2. Technical Foundation
| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Framework** | tags | Supported frameworks: vanilla, react, vue, angular, svelte, solid. Use "vanilla" if framework-agnostic |
| **Base Library** | text | Underlying editor if this is a wrapper (e.g., "ProseMirror", "Slate", "Lexical"); null if original implementation |
| **Data Model** | tags | How content is stored: html, json, markdown, custom. Most editors support multiple |
| **TypeScript** | boolean | True if written in TypeScript or has official type definitions |
| **Bundle Size** | filesize (descending) | Minified + gzipped size of core package; check bundlephobia.com |
| **Headless Mode** | boolean | Can run without UI/rendering for server-side processing |

### 3. Collaboration
| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Real-time Collaboration** | boolean | Built-in or official plugin for real-time multi-user editing |
| **Collaboration Protocol** | tags | Technology used: yjs, crdt, ot (operational transform), proprietary, none |
| **Offline Support** | boolean | Can queue changes while offline and sync when reconnected |
| **Change Tracking** | boolean | Track changes / revision history like Word's review mode |
| **Comments** | boolean | Inline comments or annotations on content |

### 4. Content Features
| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Tables** | boolean | Create and edit tables with rows/columns |
| **Images** | boolean | Insert, resize, and position images |
| **Embeds** | boolean | Embed videos, iframes, or other external content |
| **Code Blocks** | boolean | Fenced code blocks with syntax highlighting |
| **Math/LaTeX** | boolean | Render mathematical equations |
| **Mentions** | boolean | @mention functionality for users or entities |
| **Emoji Picker** | boolean | Built-in emoji insertion (e.g., `:smile:` triggers picker) |
| **Slash Commands** | boolean | Forward-slash menu for inserting blocks (like Notion's `/` menu) |
| **Drag & Drop Blocks** | boolean | Reorder content blocks via drag and drop |
| **Nested Blocks** | boolean | Support for nested/indented block structures |

### 5. Editing Experience
| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Toolbar** | tags | Toolbar options: floating, fixed, bubble (selection-based), none, customizable |
| **Mobile Support** | boolean | Officially tested and supported on mobile browsers |
| **Keyboard Shortcuts** | boolean | Comprehensive keyboard shortcut support |
| **Accessibility** | boolean | ARIA labels, screen reader support, WCAG compliance efforts |
| **Undo/Redo** | boolean | Built-in history management (virtually all editors have this) |
| **Find & Replace** | boolean | Search and replace functionality |
| **Spell Check** | boolean | Native or integrated spell checking |

### 6. Extensibility
| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Plugin System** | boolean | Documented API for extending functionality via plugins |
| **Custom Nodes** | boolean | Define custom block or inline node types |
| **Custom Marks** | boolean | Define custom inline formatting (marks/decorations) |
| **Schema Customization** | boolean | Modify or extend the document schema |
| **Themes** | boolean | Built-in theming or CSS customization support |

### 7. Developer Experience
| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Documentation Quality** | rating (1-5, ascending) | 1=minimal, 2=basic, 3=adequate, 4=good, 5=excellent. Consider completeness, examples, API reference |
| **npm Weekly Downloads** | integer (ascending) | Weekly download count from npm; indicates adoption |
| **Active Maintenance** | boolean | Regular commits/releases in last 6 months |
| **Commercial Support** | boolean | Paid support or enterprise tier available |

## Research Sources

### Primary Sources (Preferred)
1. **Official Documentation** - Most authoritative for features and capabilities
2. **GitHub Repository** - For release dates, stars, activity, TypeScript status
3. **npm Registry** - For download counts, bundle analysis, dependencies
4. **bundlephobia.com** - For accurate bundle size measurements

### Secondary Sources
5. **Official Blog/Changelog** - For release announcements and feature details
6. **Demo/Playground** - Test features firsthand when documentation is unclear
7. **GitHub Issues/Discussions** - Community feedback on feature requests, bugs

### Tertiary Sources
8. **Comparison articles** - Cross-reference but verify claims independently
9. **Stack Overflow** - Gauge community activity and common issues

## Assessment Guidelines

### Bundle Size
- Measure the core/minimal package, not with all plugins
- Use bundlephobia.com for consistency
- Note if tree-shaking significantly reduces size

### Documentation Quality Rating
| Rating | Criteria |
|--------|----------|
| 1 | Minimal README, no API docs |
| 2 | Basic getting started, incomplete API reference |
| 3 | Adequate docs, covers main use cases, some gaps |
| 4 | Good docs with examples, comprehensive API reference |
| 5 | Excellent docs, tutorials, interactive examples, migration guides |

### Framework Support
- Only tag frameworks with official packages or documented support
- Community wrappers don't count unless officially endorsed
- If framework versions differ significantly in features, create separate entries

### When to Use Null
- Feature doesn't exist and isn't on the roadmap
- Cannot verify from documentation or testing
- Closed-source with no public documentation on the feature

## Initial Candidates

### Tier 1 (Must Have)
Core editors that are widely used or foundational:
- [x] **ProseMirror** - Foundation for many modern editors
- [x] **Tiptap** - Popular ProseMirror wrapper with excellent DX
- [x] **Slate** - Highly customizable React editor framework
- [x] **Lexical** - Meta's modern editor framework
- [x] **Quill** - Long-standing, widely adopted editor
- [x] **CKEditor 5** - Enterprise-grade, feature-rich
- [x] **TinyMCE** - Classic WYSIWYG, widely deployed

### Tier 2 (Should Have)
Notable alternatives and specialized editors:
- [x] **Draft.js** - Meta's legacy editor (archived, still widely used)
- [x] **Yoopta Editor** - Block-based Notion-like editor (https://github.com/yoopta-editor/Yoopta-Editor)
- [x] **Novel** - Notion-style editor with AI features (https://novel.sh/)
- [x] ~~**Notitap**~~ - Skipped: Demo project, not a reusable library
- [x] **Redactor** - Commercial, clean UI (https://imperavi.com/redactor/)
- [x] **Editor.js** - Block-based, outputting clean JSON
- [x] **Milkdown** - Markdown-first, plugin-driven
- [x] **Toast UI Editor** - Markdown + WYSIWYG hybrid

### Tier 3 (Nice to Have)
Specialized or emerging options:
- [x] **Remirror** - React ProseMirror toolkit (https://remirror.io/)
- [x] **BlockNote** - Block-based Notion-like (https://www.blocknotejs.org/)
- [x] **Plate** - Headless Slate plugins (https://platejs.org/)
- [x] **Froala** - Commercial, modern UI (https://froala.com/wysiwyg-editor/)
- [x] **Summernote** - jQuery-based (legacy but still used) (https://summernote.org/)
- [x] **Jodit** - Lightweight, no dependencies (https://xdsoft.net/jodit/)
- [x] **Etherpad** - Focused on real-time collaboration (https://etherpad.org/)

## Notes for Researchers

1. **Verify feature claims** - Test in the demo/playground when possible; marketing pages may overstate capabilities

2. **Check plugin vs core** - Many features require plugins. Note in comments if a feature needs additional packages

3. **Framework-specific entries** - If an editor's React and Vue versions have different feature sets (e.g., different plugin ecosystems), create separate entries

4. **Date sensitivity** - GitHub stars, npm downloads, and latest release dates change frequently. Note the research date in comments

5. **Commercial vs OSS features** - Some editors (CKEditor, TinyMCE) have different features in free vs paid tiers. Document the open-source capabilities; note commercial features in comments

6. **Wrapper relationships** - Clearly document when an editor is built on another (Tiptap → ProseMirror, Novel → Tiptap). This affects bundle size and capability inheritance

7. **Collaboration complexity** - "Real-time collaboration" can mean built-in, official plugin, or "possible with integration". Be specific about what's available out of the box

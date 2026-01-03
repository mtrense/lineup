# Content Management Systems Research Guide

## Overview

This comparison helps developers and organizations choose a Content Management System (CMS) for building websites, blogs, digital experiences, and content-driven applications. It covers both self-hosted open-source solutions and managed/SaaS platforms, comparing their technical architecture, content modeling capabilities, developer experience, and business considerations.

Users should be able to:
- Find a CMS that fits their technical requirements and hosting preferences
- Compare headless vs traditional vs hybrid CMS architectures
- Evaluate content modeling flexibility for their use case
- Assess total cost of ownership (self-hosted vs managed)
- Understand scalability and performance characteristics

## Scope

**Included:**
- Traditional CMSs with built-in frontend rendering
- Headless CMSs (API-first, no frontend)
- Hybrid CMSs (headless + optional frontend)
- Self-hosted open-source solutions
- Managed/SaaS platforms
- Developer-focused "Git-based" CMSs
- Enterprise and small-business solutions

**Excluded:**
- E-commerce platforms (Shopify, WooCommerce) - separate comparison
- Wiki software (MediaWiki, Confluence) - different use case
- Knowledge base / documentation tools (GitBook, Docusaurus)
- Website builders without CMS capabilities (Squarespace page builder aspect)
- Digital Asset Management (DAM) systems as standalone products
- Learning Management Systems (LMS)

## Attribute Groups

### 1. General Info
| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Name** | text | Official product name |
| **Description** | text | One-line description of the CMS's main value proposition |
| **Website** | link | Official website |
| **Repository** | link | GitHub/GitLab repository URL; null for closed-source SaaS |
| **License** | text | SPDX identifier (MIT, GPL-3.0, Apache-2.0, Proprietary, etc.) |
| **Initial Release** | date (year) | Year of first public release |
| **Latest Release** | date (full) | Date of most recent stable release; null for continuously deployed SaaS |
| **GitHub Stars** | integer (ascending) | Current star count; null for closed-source projects |

### 2. Architecture
| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **CMS Type** | tags | Architecture: traditional (coupled frontend), headless (API-only), hybrid (both options) |
| **Deployment Model** | tags | Options: self-hosted, managed, both |
| **Primary Language** | text | Main programming language (PHP, Node.js, Python, Go, Ruby, Java, .NET) |
| **Database Support** | tags | Supported databases: postgresql, mysql, mongodb, sqlite, dynamodb, proprietary |
| **API Type** | tags | API protocols: rest, graphql, grpc, none. Most headless support both REST and GraphQL |
| **Multi-tenancy** | boolean | Built-in support for multiple sites/projects from single installation |
| **Static Site Generation** | boolean | Can generate static HTML output (JAMstack compatible) |
| **Edge Deployment** | boolean | Supports edge/CDN deployment for content delivery |

### 3. Content Modeling
| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Content Types** | boolean | Define custom content types/models (not just posts/pages) |
| **Custom Fields** | boolean | Add custom fields to content types |
| **Field Types** | tags | Available field types: text, richtext, media, reference, json, component, repeater |
| **Content Relationships** | boolean | Link content items (one-to-one, one-to-many, many-to-many) |
| **Nested Components** | boolean | Reusable content components/blocks within entries |
| **Localization** | boolean | Multi-language content with locale management |
| **Content Validation** | boolean | Define validation rules for fields |
| **Embedded Interactives** | boolean | Embed interactive snippets, widgets, or micro frontends within content (beyond simple iframes) |

### 4. Workflows & Processes
| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Content Versioning** | boolean | Track and restore previous versions of content |
| **Draft/Publish Workflow** | boolean | Separate draft and published states |
| **Scheduled Publishing** | boolean | Schedule content to publish/unpublish at specific times |
| **Approval Workflows** | boolean | Multi-step approval processes (submit for review, approve, reject) |
| **Content Locking** | boolean | Prevent concurrent editing conflicts |
| **Audit Logging** | boolean | Track who changed what and when |

### 5. Media Management
| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Media Library** | boolean | Built-in media/asset management |
| **Image Transformations** | boolean | Resize, crop, optimize images on-the-fly |
| **External Media Storage** | boolean | Store media in S3, Cloudinary, or other external services |
| **Video Support** | boolean | Native video upload and/or streaming integration |
| **SVG Support** | boolean | Upload and serve SVG files |
| **Folder Organization** | boolean | Organize media in folders/collections |

### 6. User Management & Permissions
| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Role-Based Access** | boolean | Define roles with specific permissions |
| **Granular Permissions** | boolean | Field-level or content-type-level permissions |
| **SSO/SAML** | boolean | Single sign-on integration (enterprise feature) |
| **Team Collaboration** | boolean | Comments, assignments, notifications for content teams |
| **Audience Restrictions** | boolean | Restrict content access by user groups, membership, or audience segments (closed user groups, gated content) |

### 7. Developer Experience
| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **TypeScript SDK** | boolean | Official TypeScript/JavaScript SDK with types |
| **Content Type SDK** | boolean | Programmatically define content models (code-first approach) |
| **CLI Tools** | boolean | Command-line interface for management tasks |
| **Local Development** | boolean | Run locally for development (for self-hosted); local preview for SaaS |
| **Webhooks** | boolean | Trigger external services on content changes |
| **Plugin/Extension System** | boolean | Extend functionality with plugins or custom code |
| **Admin UI Customization** | boolean | Customize the editorial interface |
| **Documentation Quality** | rating (1-5, ascending) | 1=minimal, 2=basic, 3=adequate, 4=good, 5=excellent |

### 8. Integrations & Ecosystem
| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Frontend Frameworks** | tags | Official integrations: nextjs, nuxt, gatsby, astro, remix, sveltekit |
| **Search Integration** | boolean | Built-in search or integrations with Algolia, Elasticsearch, etc. |
| **Preview Mode** | boolean | Live preview of draft content in frontend |
| **E-commerce Integration** | boolean | Integrations with Stripe, Shopify, Snipcart, etc. |
| **Analytics Integration** | boolean | Built-in analytics or easy integration with GA, etc. |
| **AI Features** | boolean | AI-assisted content generation, translation, or optimization |

### 9. Performance & Scale
| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **CDN Included** | boolean | Built-in CDN for content delivery (primarily for managed services) |
| **Response Caching** | boolean | Built-in API response caching |
| **Rate Limits** | text | API rate limits for managed services; "unlimited" for self-hosted |
| **Global Regions** | boolean | Multi-region deployment available (for managed services) |

### 10. Pricing & Business
| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Free Tier** | boolean | Free plan available (for managed) or fully open-source (for self-hosted) |
| **Open Source** | boolean | Core product is open source |
| **Pricing Model** | tags | Pricing structure: free, freemium, per-seat, per-usage, enterprise-only |
| **Commercial Support** | boolean | Paid support or enterprise tier available |
| **Enterprise Features** | boolean | Enterprise-specific features (SSO, SLA, dedicated support) |

## Research Sources

### Primary Sources (Preferred)
1. **Official Documentation** - Most authoritative for features and capabilities
2. **Official Pricing Page** - For pricing model and tier limits
3. **GitHub Repository** - For release dates, stars, activity, open-source status
4. **Official Blog/Changelog** - For recent features and roadmap

### Secondary Sources
5. **Demo/Sandbox** - Test the admin interface and features firsthand
6. **Integration Marketplace** - See available plugins and integrations
7. **GitHub Issues/Discussions** - Community feedback, feature requests

### Tertiary Sources
8. **Comparison sites** (G2, Capterra) - Cross-reference but verify claims
9. **Case studies** - Real-world usage patterns
10. **Community forums** - Discord, Slack, Reddit discussions

## Assessment Guidelines

### CMS Type Classification
| Type | Criteria |
|------|----------|
| Traditional | Frontend rendering tightly coupled; templates built into CMS |
| Headless | API-only; no built-in frontend rendering |
| Hybrid | Can operate in both modes; optional frontend |

### Deployment Model
- **Self-hosted**: You deploy and manage infrastructure
- **Managed**: Vendor hosts and manages; SaaS model
- **Both**: Offers both self-hosted and managed cloud options

### Documentation Quality Rating
| Rating | Criteria |
|--------|----------|
| 1 | Minimal README, no structured docs |
| 2 | Basic getting started, gaps in reference |
| 3 | Adequate coverage, some tutorials |
| 4 | Good docs, comprehensive API reference, examples |
| 5 | Excellent docs, video tutorials, migration guides, active maintenance |

### When to Use Null
- Feature is not available and not on public roadmap
- Cannot verify from official sources
- Closed-source with no documentation on the feature
- Feature requires third-party plugin with no official endorsement

### Pricing Notes
- Document free tier limitations in comments
- Note if pricing is transparent or "contact sales"
- For self-hosted, note if there's a paid "Pro" version with extra features

## Initial Candidates

### Tier 1 (Must Have)
Major players with significant market share or mindshare:

**Traditional / Hybrid (Self-hosted)**
- [x] **WordPress** - Dominant CMS, powers ~40% of the web
- [x] **Drupal** - Enterprise-grade, highly customizable
- [x] **Joomla** - Popular alternative to WordPress

**Headless / API-first (Self-hosted)**
- [x] **Strapi** - Leading open-source headless CMS (Node.js)
- [x] **Directus** - Open-source data platform / headless CMS
- [x] **Payload CMS** - TypeScript-first headless CMS
- [x] **KeystoneJS** - GraphQL-native headless CMS

**Managed / SaaS**
- [x] **Contentful** - Enterprise headless CMS market leader
- [x] **Sanity** - Real-time collaborative headless CMS
- [x] **Hygraph** (formerly GraphCMS) - GraphQL-native headless CMS
- [x] **Storyblok** - Visual editing headless CMS

### Tier 2 (Should Have)
Notable alternatives and specialized options:

**Traditional / Hybrid**
- [x] **Ghost** - Modern publishing platform (blogging focus)
- [x] **Craft CMS** - Developer-friendly commercial CMS
- [x] **TYPO3** - Enterprise CMS popular in Europe
- [x] **Wagtail** - Django-based CMS (Python)
- [x] **October CMS** - Laravel-based CMS (PHP)

**Headless**
- [x] **Prismic** - Headless CMS with slice-based editing
- [x] **DatoCMS** - Developer-friendly headless CMS
- [x] **Builder.io** - Visual headless CMS with drag-drop
- [x] **Tina CMS** - Git-based, visual editing
- [x] **Decap CMS** (formerly Netlify CMS) - Git-based open-source

**Platform / Hybrid**
- [x] **Webflow** - Visual builder with CMS capabilities
- [x] **Wix** - Website builder with structured content
- [x] **Squarespace** - Design-focused with CMS features

### Tier 3 (Nice to Have)
Emerging or specialized options:

**Self-hosted**
- [x] **Cockpit CMS** - Lightweight headless CMS (PHP)
- [x] **Apostrophe** - In-context editing CMS (Node.js)
- [x] **Publii** - Desktop-based static CMS
- [x] **Grav** - Flat-file CMS (no database)
- [ ] **Statamic** - Laravel flat-file CMS (commercial)
- [ ] **PocketBase** - Backend-as-a-Service with CMS features

**Managed**
- [ ] **Kontent.ai** (formerly Kentico Kontent) - Enterprise headless
- [ ] **Contentstack** - Enterprise headless CMS
- [ ] **Agility CMS** - Hybrid headless with page management
- [ ] **ButterCMS** - Developer-focused headless
- [ ] **Cosmic** - Headless CMS with Bucket-based content

**Emerging / Specialized**
- [ ] **Payload Cloud** - Managed Payload CMS
- [ ] **Outstatic** - Static CMS for Next.js
- [ ] **Keystatic** - Git-based CMS by Thinkmill

## Notes for Researchers

1. **Verify feature availability** - Many CMSs have features in paid tiers only. Document what's available in free/open-source versions; note premium features in comments.

2. **Managed vs self-hosted distinctions** - For CMSs offering both (Strapi, Directus), the managed version may have additional features or limitations. Document both when relevant.

3. **Traditional CMS API capabilities** - WordPress and Drupal now have REST/GraphQL APIs. Consider them "hybrid" if headless usage is well-supported with official plugins.

4. **Plugin ecosystem maturity** - Core features vs plugin requirements matter. Note when key features require third-party plugins.

5. **Version differences** - Major versions can differ significantly (Drupal 7 vs 10, WordPress classic vs Gutenberg). Focus on current recommended versions.

6. **Enterprise vs community editions** - Some CMSs (TYPO3, Drupal) have enterprise support programs. Some (Craft, Statamic) have paid licenses for commercial use.

7. **Content modeling flexibility** - "Custom content types" can mean very different things. WordPress custom post types are limited compared to Strapi's content-type builder.

8. **Date sensitivity** - GitHub stars, pricing, and feature availability change. Note research date in comments for volatile data.

9. **Regional popularity** - Some CMSs are more popular in specific regions (TYPO3 in Germany, eZ Platform in Europe). This may affect community resources and support.

10. **JAMstack compatibility** - Even traditional CMSs can work with static site generators. Document native SSG support vs "possible with integration."

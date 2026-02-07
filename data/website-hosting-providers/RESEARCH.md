# Static Website Hosting Providers Research Guide

## Overview

This comparison evaluates platforms for hosting static websites and JAMstack applications. It helps developers and teams choose a hosting provider by comparing pricing, performance, developer experience, feature sets, and infrastructure capabilities. The focus is on platforms where you deploy frontend assets (HTML, CSS, JS) that are served from edge networks, optionally with serverless backend capabilities.

## Scope

**Included:**
- Platforms primarily designed for or commonly used for static site / JAMstack hosting
- Services that provide a managed deployment pipeline (git-based or CLI-based) for static assets
- Cloud provider offerings specifically targeting static sites (e.g., AWS Amplify, Azure Static Web Apps)
- Platforms that serve static files from CDN/edge networks
- Services that may include serverless functions as a complement to static hosting

**Excluded:**
- Traditional shared hosting providers (e.g., GoDaddy, Bluehost) -- these are general-purpose web hosts, not static-site-focused
- Container-based or VM-based hosting (e.g., DigitalOcean Droplets, AWS EC2) -- these are general compute, not static hosting
- Pure CDN providers without a deployment/build pipeline (e.g., Akamai, Fastly standalone) -- these are infrastructure layers, not hosting platforms
- CMS-as-a-service platforms that include hosting only as a side effect (e.g., WordPress.com, Squarespace) -- the focus is on developer-oriented static hosting
- Self-hosted solutions (e.g., Nginx on your own server)

## Attribute Groups

### 1. General Information

| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Description** | text | One-sentence summary of the platform's positioning and primary use case |
| **Website** | link | Official website URL |
| **Parent Company** | text | The company that owns/operates the service. Important for understanding long-term viability and corporate backing |
| **Year Launched** | date (year) | When the service became publicly available (GA, not beta). Use earliest public launch date |
| **Open Source** | boolean | Whether the core platform/runtime is open source (not just the CLI or SDK) |
| **Primary Focus** | tags | What the platform primarily targets: `static-sites`, `jamstack`, `full-stack`, `edge-first`. A platform can have multiple tags |

### 2. Pricing & Limits

| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Free Tier** | boolean | Whether a meaningful free tier exists (not just a trial). Must allow real production use |
| **Free Tier Bandwidth** | text | Monthly bandwidth included in free tier (e.g., "100 GB/month"). Use "Unlimited" if truly unlimited. null if no free tier |
| **Free Tier Build Minutes** | text | Monthly build minutes in free tier (e.g., "300 min/month"). null if no free tier or no build pipeline |
| **Free Tier Sites** | text | Number of sites/projects allowed on the free tier. Use "Unlimited" if no limit. null if no free tier |
| **Paid Plan Starting Price** | text | Lowest paid plan price as monthly cost (e.g., "$19/month per member"). Specify per-seat vs flat pricing |
| **Bandwidth Overage Cost** | text | Cost for exceeding bandwidth limits (e.g., "$55 per 100 GB"). null if unlimited or unclear |
| **Custom Pricing / Enterprise** | boolean | Whether custom/enterprise pricing is available for large-scale needs |

### 3. Deployment & Build

| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Git Integration** | tags | Supported Git providers: `github`, `gitlab`, `bitbucket`, `azure-devops`, `self-hosted-git`. Check official docs for supported providers |
| **Auto Deploy on Push** | boolean | Whether pushes to a connected branch automatically trigger builds and deployments |
| **CLI Deployment** | boolean | Whether a CLI tool exists for manual/scripted deployments outside of Git workflows |
| **Build System** | boolean | Whether the platform has a built-in CI/CD build pipeline (not just static file upload) |
| **Supported Frameworks** | tags | Officially supported or auto-detected frameworks: `next`, `nuxt`, `gatsby`, `astro`, `hugo`, `jekyll`, `svelte-kit`, `remix`, `angular`, `vue`, `eleventy`, `vite`, `other`. Only list frameworks with explicit support or auto-detection |
| **Monorepo Support** | boolean | Whether the platform can build from a subdirectory of a monorepo (root directory configuration) |
| **Deploy Previews** | boolean | Whether the platform creates preview deployments for pull/merge requests with unique URLs |
| **Instant Rollbacks** | boolean | Whether previous deployments can be promoted to production without rebuilding |
| **Deploy Notifications** | tags | Notification channels for deploy status: `slack`, `email`, `webhook`, `github-status`, `other` |

### 4. Performance & Infrastructure

| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Global CDN** | boolean | Whether assets are served from a globally distributed CDN (not just a single region) |
| **CDN Provider / Network** | text | The underlying CDN or edge network (e.g., "Cloudflare", "AWS CloudFront", "Fastly", "proprietary"). Helps understand performance characteristics |
| **Edge Locations** | text | Approximate number of edge/PoP locations or coverage description (e.g., "300+ locations", "Global"). Use official numbers when available |
| **HTTP/2 Support** | boolean | Whether HTTP/2 is supported by default |
| **HTTP/3 Support** | boolean | Whether HTTP/3 (QUIC) is supported |
| **Response Headers Customization** | boolean | Whether custom HTTP response headers can be configured (security headers, caching, etc.) |
| **Image Optimization** | boolean | Whether the platform offers built-in image optimization/transformation (resizing, format conversion, lazy loading) |
| **Asset Compression** | tags | Supported compression methods: `gzip`, `brotli`. Check whether applied automatically |

### 5. Domains & SSL

| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Custom Domains** | boolean | Whether custom domains can be attached to deployments |
| **Free SSL/TLS** | boolean | Whether SSL certificates are provisioned automatically at no cost (typically via Let's Encrypt) |
| **Wildcard SSL** | boolean | Whether wildcard SSL certificates are supported for subdomains |
| **Automatic HTTPS Redirect** | boolean | Whether HTTP-to-HTTPS redirect is handled automatically |
| **Custom Domain per Preview** | boolean | Whether preview deployments can have custom domain aliases (not just auto-generated URLs) |

### 6. Serverless & Backend Features

| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Serverless Functions** | boolean | Whether the platform offers serverless/edge functions as part of the hosting service |
| **Functions Runtime** | tags | Supported function runtimes: `node`, `deno`, `python`, `go`, `rust`, `ruby`, `other`. Only list if serverless functions are offered |
| **Edge Functions** | boolean | Whether functions can run at the edge (low-latency, close to users) as opposed to a single region |
| **Scheduled Functions (Cron)** | boolean | Whether functions can be triggered on a schedule |
| **Form Handling** | boolean | Whether built-in form submission collection/processing is available (without external services) |
| **Authentication** | boolean | Whether built-in user authentication/identity management is provided |
| **Key-Value Storage** | boolean | Whether a built-in key-value or edge storage solution is available |
| **Database Integration** | boolean | Whether the platform offers an integrated database or first-party database addon |

### 7. Routing & Configuration

| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Redirects** | boolean | Whether URL redirects can be configured (301, 302, etc.) |
| **Rewrites / Proxying** | boolean | Whether URL rewrites or reverse proxying can be configured (serving different content at a path without redirect) |
| **Custom 404 Pages** | boolean | Whether custom not-found pages can be defined |
| **SPA Fallback Routing** | boolean | Whether single-page application routing is supported (all paths serve index.html) |
| **Headers Configuration** | boolean | Whether custom response headers can be defined per-path or globally |
| **A/B Testing / Split Traffic** | boolean | Whether traffic can be split between different deployments for A/B testing or gradual rollouts |

### 8. Collaboration & Workflow

| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Team Members (Free)** | text | Number of team members allowed on the free tier (e.g., "1", "5", "Unlimited") |
| **Role-Based Access Control** | boolean | Whether different permission levels can be assigned to team members |
| **Audit Logs** | boolean | Whether an audit trail of actions is available (typically enterprise feature) |
| **Environment Variables** | boolean | Whether environment variables can be configured for builds |
| **Preview Comments** | boolean | Whether team members can leave comments on deploy previews directly in the platform |

### 9. Compliance & Security

| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **DDoS Protection** | boolean | Whether DDoS mitigation is included (at the CDN/edge level) |
| **WAF** | boolean | Whether a Web Application Firewall is available (may be a paid addon) |
| **SOC 2 Certified** | boolean | Whether the provider has SOC 2 Type II certification |
| **GDPR Compliant** | boolean | Whether the provider has documented GDPR compliance measures |
| **Password Protection** | boolean | Whether deployed sites can be password-protected (HTTP basic auth or similar) |
| **IP Access Control** | boolean | Whether access can be restricted by IP address |

### 10. Community & Ecosystem

| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Documentation Quality** | rating (1-5) | Assess based on: completeness, clarity, examples, search functionality, up-to-date content. 5 = exceptional, 3 = adequate, 1 = poor/missing |
| **Plugin / Integration Ecosystem** | tags | Major integration categories available: `analytics`, `cms`, `monitoring`, `auth`, `database`, `commerce`, `search`. Only list categories with official or first-party integrations |
| **Community Size** | tags | Indicators of community presence: `discord`, `forum`, `github-discussions`, `stackoverflow`. Only include if actively maintained |
| **Status Page** | boolean | Whether a public status/uptime page exists for the service |

## Research Sources

### Primary Sources (Preferred)
1. **Official Documentation** - Pricing pages, feature lists, and technical docs from the provider's website
2. **Official Changelogs/Blog** - For launch dates, feature announcements, and infrastructure details
3. **Official GitHub Repositories** - For open source components, CLI tools, and community engagement metrics

### Secondary Sources
4. **Wikipedia** - For company history, founding dates, and corporate ownership
5. **Crunchbase** - For company funding and ownership information
6. **Web Platform Comparisons** - Sites like Jamstack.org/generators, bejamas.io/compare, or similar for cross-referencing feature claims
7. **Stack Overflow / Community Forums** - For developer experience and real-world usage patterns
8. **Third-party benchmarks** - For performance comparisons (e.g., CDN performance tests, TTFB benchmarks)

## Assessment Guidelines

### Primary Focus Tags
- `static-sites`: Platform is primarily or originally designed for serving static HTML/CSS/JS files
- `jamstack`: Platform explicitly markets itself as a JAMstack platform with build pipelines and API integrations
- `full-stack`: Platform has expanded significantly beyond static hosting to include SSR, databases, and backend features
- `edge-first`: Platform emphasizes edge computing and edge-side rendering as a core capability

### Documentation Quality Rating
| Rating | Criteria |
|--------|----------|
| 5 | Comprehensive, well-organized, searchable, with tutorials, API reference, and examples. Regularly updated |
| 4 | Good coverage, generally well-organized, may lack some advanced topics or have minor gaps |
| 3 | Adequate for getting started, but may have gaps in advanced use cases or be poorly organized |
| 2 | Sparse or outdated, missing important topics, hard to navigate |
| 1 | Minimal or effectively nonexistent documentation |

### Free Tier Assessment
- Only mark `true` if the free tier supports real production use (not just a 14-day trial)
- Record the actual limits, not marketing claims. Check the pricing page fine print
- "Unlimited" should only be used when there is genuinely no stated limit (not "generous but capped")

### Serverless Functions Assessment
- Only mark `true` if functions are a built-in, first-party feature of the hosting platform
- Third-party integrations (e.g., "use AWS Lambda separately") do not count
- Edge functions should be distinguished from regional serverless functions

### When to Use `null`
- The feature exists but specifics cannot be determined from public documentation
- The attribute is not applicable to the platform's model
- Conflicting information from multiple sources cannot be resolved

## Initial Candidates

### Tier 1 (Must Have)
Core platforms that dominate the static/JAMstack hosting space:
- [x] **Netlify** - Pioneer of JAMstack hosting, feature-rich platform with generous free tier
- [x] **Vercel** - Next.js creator's platform, strong edge/serverless capabilities
- [x] **Cloudflare Pages** - Backed by Cloudflare's massive edge network, aggressive free tier
- [x] **GitHub Pages** - Free static hosting integrated with GitHub, widely used for docs and OSS projects
- [x] **Surge** - Simple, single-command static site publishing for developers
- [x] **AWS Amplify Hosting** - Amazon's managed static/SSR hosting with full AWS ecosystem integration

### Tier 2 (Should Have)
Well-established alternatives with distinct positioning:
- [x] **Firebase Hosting** - Google's hosting platform, tight integration with Firebase services
- [x] **Azure Static Web Apps** - Microsoft's static hosting with Azure Functions integration
- [x] **Render** - Modern cloud platform with static site hosting among broader compute offerings
- [x] **DigitalOcean App Platform** - Static site hosting within DO's developer cloud

### Tier 3 (Nice to Have)
Niche or newer entrants with interesting differentiators:
- [x] **Deno Deploy** - Edge-first platform from the Deno runtime creators
- [x] **Fly.io** - Edge application platform that can serve static sites
- [x] **Kinsta** - Managed hosting provider with a static site hosting offering
- [ ] **Hostinger** - Budget hosting with a static site option
- [x] **GitLab Pages** - Static hosting integrated with GitLab CI/CD

## Notes for Researchers

1. **Pricing changes frequently.** Always verify pricing data against the provider's current pricing page. Note the date of verification in the `comment` field.

2. **Feature tiers matter.** Many features are only available on paid plans. Record whether a feature is available at all (the boolean), and note in the `comment` field if it requires a paid plan.

3. **"Unlimited" claims need scrutiny.** Some providers advertise "unlimited bandwidth" but have fair-use policies or soft limits. Note any such caveats in the `comment` field.

4. **Framework support is nuanced.** Distinguish between "this framework works if you configure it" (common for any static output) vs. "we have first-party, zero-config support for this framework" (auto-detection, optimized builds). Only list the latter in the `supported-frameworks` tag.

5. **Edge vs. regional functions.** Serverless functions and edge functions are different. Regional functions run in one data center; edge functions run close to the user. Document which the platform offers.

6. **Consolidation and pivots.** The hosting space evolves rapidly. Some platforms (e.g., Vercel, Netlify) have expanded well beyond static hosting. Evaluate them as they exist today, but note their origins.

7. **Source everything.** Every value should have at least one source URL. Prefer official documentation over blog posts or third-party claims.

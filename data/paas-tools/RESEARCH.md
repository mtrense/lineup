# Platform as a Service (PaaS) Tools Research Guide

## Overview

This comparison helps developers and organizations choose a Platform as a Service (PaaS) tool for deploying, managing, and scaling applications. It covers both managed commercial platforms and self-hosted open-source solutions, comparing their deployment capabilities, infrastructure support, developer experience, and operational features.

Users should be able to:
- Find a PaaS that fits their deployment and scaling requirements
- Compare managed vs self-hosted infrastructure costs and trade-offs
- Evaluate container orchestration and deployment strategies
- Assess developer experience and CI/CD integration capabilities
- Understand pricing models and resource limitations

## Scope

**Included:**
- Managed PaaS platforms (Heroku, Vercel, Render, Railway, etc.)
- Self-hosted PaaS solutions (Dokku, Coolify, CapRover, Dokploy, etc.)
- Container orchestration platforms with PaaS-like interfaces
- Application deployment platforms with managed infrastructure
- Serverless platforms with container/app deployment capabilities

**Excluded:**
- Pure IaaS providers (AWS EC2, DigitalOcean Droplets as raw VMs)
- Pure Kubernetes distributions without PaaS layer (vanilla k8s, k3s alone)
- CI/CD tools without deployment hosting (GitHub Actions alone, Jenkins)
- Static site hosting only (GitHub Pages, Netlify for static only)
- Backend-as-a-Service (Firebase, Supabase) - different use case
- Container registries (Docker Hub, GHCR) without deployment
- Serverless function-only platforms (AWS Lambda standalone)

## Attribute Groups

### 1. General Info
| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Name** | text | Official product name |
| **Description** | text | One-line description of the platform's main value proposition |
| **Website** | link | Official website |
| **Repository** | link | GitHub/GitLab repository URL; null for closed-source SaaS |
| **License** | text | SPDX identifier (MIT, GPL-3.0, Apache-2.0, AGPL-3.0, Proprietary, etc.) |
| **Initial Release** | date (year) | Year of first public release |
| **GitHub Stars** | integer (ascending) | Current star count; null for closed-source projects |

### 2. Platform Type
| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Hosting Model** | tags | Options: managed (vendor-hosted), self-hosted (you run it), hybrid (both available) |
| **Platform Focus** | tags | Primary use case: general-purpose, web-apps, containers, serverless, static-sites, fullstack |
| **Underlying Infrastructure** | tags | What it runs on: docker, kubernetes, firecracker, proprietary, bare-metal |
| **Multi-Tenancy** | boolean | Supports multiple users/teams with isolation on single installation (for self-hosted) |
| **Multi-Server** | boolean | Can distribute workloads across multiple servers/nodes |

### 3. Deployment Capabilities
| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Git Push Deploy** | boolean | Deploy by pushing to a Git remote (Heroku-style `git push`) |
| **GitHub Integration** | boolean | Direct integration with GitHub for auto-deploy on push |
| **GitLab Integration** | boolean | Direct integration with GitLab for auto-deploy |
| **Bitbucket Integration** | boolean | Direct integration with Bitbucket for auto-deploy |
| **Docker Deploy** | boolean | Deploy pre-built Docker images directly |
| **Dockerfile Support** | boolean | Build and deploy from Dockerfile in repository |
| **Buildpacks** | boolean | Automatic detection and building using buildpacks (Heroku-style) |
| **Nixpacks** | boolean | Support for Nixpacks build system |
| **Static Site Deploy** | boolean | Specialized support for static site deployment |
| **Monorepo Support** | boolean | Deploy multiple apps from a single repository |

### 4. Application Support
| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Web Applications** | boolean | Deploy long-running web servers (Node.js, Python, Go, etc.) |
| **Background Workers** | boolean | Run background jobs/workers separate from web processes |
| **Cron Jobs** | boolean | Scheduled task execution |
| **Serverless Functions** | boolean | Deploy individual functions (Lambda-style) |
| **WebSocket Support** | boolean | Support for persistent WebSocket connections |
| **Language Auto-Detection** | tags | Languages auto-detected for buildpacks: nodejs, python, ruby, go, java, php, rust, elixir, dotnet |

### 5. Managed Services
| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Managed PostgreSQL** | boolean | Built-in or one-click PostgreSQL database |
| **Managed MySQL** | boolean | Built-in or one-click MySQL/MariaDB database |
| **Managed Redis** | boolean | Built-in or one-click Redis instance |
| **Managed MongoDB** | boolean | Built-in or one-click MongoDB database |
| **Object Storage** | boolean | S3-compatible object storage included or integrated |
| **Managed SSL** | boolean | Automatic SSL/TLS certificate provisioning (Let's Encrypt or similar) |
| **Custom Domains** | boolean | Support for custom domain names |
| **Wildcard Domains** | boolean | Support for wildcard SSL and subdomains |

### 6. Networking & Routing
| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Load Balancing** | boolean | Built-in load balancing across instances |
| **Auto-Scaling** | boolean | Automatic scaling based on traffic/load |
| **Private Networking** | boolean | Internal network between services/apps |
| **IPv6 Support** | boolean | Native IPv6 support for applications |
| **Edge Deployment** | boolean | Deploy to edge locations globally |
| **Regional Deployment** | tags | Available regions: us, eu, asia, global, custom (for self-hosted) |
| **DDoS Protection** | boolean | Built-in DDoS mitigation |

### 7. Developer Experience
| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **CLI Tool** | boolean | Official command-line interface for deployments and management |
| **Web Dashboard** | boolean | Web-based management interface |
| **API Access** | boolean | Programmatic API for automation |
| **Preview Environments** | boolean | Automatic preview deployments for pull requests |
| **Rollback Support** | boolean | Easy rollback to previous deployments |
| **Environment Variables** | boolean | Secure environment variable management |
| **Secrets Management** | boolean | Dedicated secrets/credentials management (beyond env vars) |
| **Log Streaming** | boolean | Real-time application log access |
| **Log Persistence** | boolean | Historical log storage and search |
| **Metrics/Monitoring** | boolean | Built-in performance metrics and monitoring |
| **Health Checks** | boolean | Automatic health check and restart on failure |
| **SSH Access** | boolean | Direct SSH access to running containers/instances |
| **Documentation Quality** | rating (1-5, ascending) | 1=minimal, 2=basic, 3=adequate, 4=good, 5=excellent |

### 8. CI/CD & Build
| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Built-in CI/CD** | boolean | Integrated build pipeline (not just external CI support) |
| **Build Caching** | boolean | Cache dependencies between builds for faster deploys |
| **Concurrent Builds** | boolean | Run multiple builds simultaneously |
| **Build Minutes** | text | Free tier build minutes or "unlimited" for self-hosted |
| **Zero-Downtime Deploy** | boolean | Rolling deployments without service interruption |
| **Canary Deployments** | boolean | Gradual rollout to percentage of traffic |
| **Blue-Green Deploy** | boolean | Switch between identical environments |

### 9. Team & Security
| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Team Management** | boolean | Multiple users with team/organization support |
| **Role-Based Access** | boolean | Granular permissions per user/team |
| **SSO/SAML** | boolean | Enterprise single sign-on support |
| **Audit Logging** | boolean | Track user actions and deployments |
| **SOC 2 Compliant** | boolean | SOC 2 Type II certification (for managed platforms) |
| **GDPR Compliant** | boolean | GDPR compliance (EU data handling) |
| **VPC/Network Isolation** | boolean | Private/isolated network deployment option |

### 10. Pricing & Limits
| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Free Tier** | boolean | Free plan available for getting started |
| **Open Source** | boolean | Core platform is open source |
| **Pricing Model** | tags | Structure: free, pay-as-you-go, per-app, per-resource, flat-rate, enterprise |
| **Free Tier Apps** | integer (ascending) | Number of apps allowed on free tier; null if no free tier |
| **Sleep on Inactivity** | boolean | Free tier apps sleep after inactivity period |
| **Bandwidth Included** | text | Monthly bandwidth on free/starter tier (e.g., "100 GB", "unlimited") |
| **Commercial Support** | boolean | Paid support options available |

## Research Sources

### Primary Sources (Preferred)
1. **Official Documentation** - Most authoritative for features and capabilities
2. **Official Pricing Page** - For pricing model and tier limits
3. **GitHub Repository** - For release dates, stars, activity, open-source status
4. **Official Blog/Changelog** - For recent features and updates

### Secondary Sources
5. **Demo/Trial** - Test the platform firsthand where possible
6. **Integration/Plugin Marketplace** - See available add-ons and integrations
7. **GitHub Issues/Discussions** - Community feedback, feature requests

### Tertiary Sources
8. **Comparison sites** (G2, Capterra) - Cross-reference but verify claims
9. **Developer blogs/reviews** - Real-world usage experiences
10. **Reddit/HN discussions** - Community sentiment and edge cases

## Assessment Guidelines

### Hosting Model Classification
| Type | Criteria |
|------|----------|
| Managed | Vendor hosts everything; you just deploy code |
| Self-hosted | You install and run on your own infrastructure |
| Hybrid | Offers both self-hosted and managed cloud options |

### Platform Focus Classification
| Focus | Criteria |
|-------|----------|
| General-purpose | Supports diverse workloads (web, workers, DBs, etc.) |
| Web-apps | Primarily focused on web application deployment |
| Containers | Container-centric with Docker/K8s orchestration |
| Serverless | Function-first with container support secondary |
| Static-sites | Optimized for static/JAMstack sites |
| Fullstack | Integrated frontend + backend + database |

### Documentation Quality Rating
| Rating | Criteria |
|--------|----------|
| 1 | Minimal README, no structured docs |
| 2 | Basic getting started, gaps in reference |
| 3 | Adequate coverage, some tutorials |
| 4 | Good docs, comprehensive reference, examples |
| 5 | Excellent docs, video tutorials, migration guides, active maintenance |

### When to Use Null
- Feature is not available and not on public roadmap
- Cannot verify from official sources
- Closed-source with no documentation on the feature
- Feature requires third-party add-on with no official support

### Pricing Notes
- Document free tier limitations in comments (sleep time, build minutes, bandwidth)
- Note if pricing is transparent or "contact sales"
- For self-hosted, note hosting infrastructure requirements
- Be specific about what triggers paid tier (apps, resources, team size)

## Initial Candidates

### Tier 1 (Must Have)
Major players with significant market share or developer mindshare:

**Managed Platforms**
- [ ] **Heroku** - Pioneer of PaaS, git-push deployment model
- [ ] **Vercel** - Frontend/fullstack focus, Next.js creators
- [ ] **Netlify** - JAMstack pioneer, static + serverless
- [ ] **Render** - Modern Heroku alternative, generous free tier
- [ ] **Railway** - Developer-focused, fast deployment
- [ ] **Fly.io** - Edge deployment, runs containers globally
- [ ] **DigitalOcean App Platform** - Simple PaaS from DO

**Self-Hosted Solutions**
- [ ] **Dokku** - The original "mini-Heroku", single-server
- [ ] **Coolify** - Self-hostable Heroku/Vercel alternative
- [ ] **CapRover** - Docker-based PaaS with web UI
- [ ] **Dokploy** - Modern Vercel/Netlify alternative, self-hosted

### Tier 2 (Should Have)
Notable alternatives and specialized options:

**Managed Platforms**
- [ ] **Platform.sh** - Git-driven, multi-environment
- [ ] **Google Cloud Run** - Serverless containers on GCP
- [ ] **AWS App Runner** - AWS's simple container PaaS
- [ ] **Azure Container Apps** - Azure's container PaaS
- [ ] **Northflank** - Kubernetes-based, developer-friendly
- [ ] **Koyeb** - Global serverless platform
- [ ] **Deta** - Simple deployment for Python/Node
- [ ] **Cyclic** - Serverless full-stack apps
- [ ] **Coherence** - Full-stack cloud platform

**Self-Hosted Solutions**
- [ ] **Portainer** - Docker/K8s management with app templates
- [ ] **Rancher** - Kubernetes management platform
- [ ] **Piku** - Minimal PaaS inspired by Dokku
- [ ] **Kamal** - Deploy web apps anywhere (by 37signals)
- [ ] **Tsuru** - Open-source PaaS by Globo.com

### Tier 3 (Nice to Have)
Emerging or specialized options:

**Managed**
- [ ] **Zeabur** - Modern deployment platform
- [ ] **Porter** - Kubernetes PaaS layer
- [ ] **Qovery** - Infrastructure automation on your cloud
- [ ] **Aptible** - Security/compliance focused PaaS
- [ ] **Back4App** - Parse-based backend platform
- [ ] **Gigalixir** - Elixir-specialized PaaS

**Self-Hosted**
- [ ] **Kubero** - GitOps PaaS on Kubernetes
- [ ] **OpenFaaS** - Serverless functions on Docker/K8s
- [ ] **Sablier** - On-demand container scaling
- [ ] **Easypanel** - Modern server control panel
- [ ] **LocalStack** - AWS-compatible local development

**Cloud Provider PaaS**
- [ ] **AWS Elastic Beanstalk** - AWS managed platform
- [ ] **Google App Engine** - GCP original PaaS
- [ ] **Azure App Service** - Azure web app hosting

## Notes for Researchers

1. **Verify current pricing** - PaaS pricing changes frequently. Note the research date and check for recent changes.

2. **Free tier limitations** - Document specific limitations: sleep time, cold start latency, build minutes, bandwidth caps, SSL on custom domains.

3. **Self-hosted requirements** - For self-hosted solutions, note minimum server requirements (RAM, CPU, disk) and supported operating systems.

4. **Docker vs Buildpack support** - Some platforms prefer Dockerfiles, others buildpacks. Note which is recommended/default.

5. **Kubernetes abstraction level** - Some platforms expose K8s concepts, others fully abstract them. Note the complexity level.

6. **Vendor lock-in considerations** - Note proprietary features that increase lock-in (custom configs, specific integrations).

7. **Database add-on details** - For managed databases, note if they're truly managed by the platform or partnerships with external providers.

8. **Regional availability** - Particularly important for compliance (GDPR) and latency requirements.

9. **Community activity** - For open-source solutions, check commit frequency, issue response time, and Discord/Slack community size.

10. **Migration paths** - Note if platform provides export tools or follows standards that ease migration.

11. **Framework-specific features** - Some platforms have special optimizations for specific frameworks (Vercel + Next.js, Render + Rails). Document these.

12. **Cold start times** - For serverless/sleeping instances, cold start latency can be significant. Note if documented.

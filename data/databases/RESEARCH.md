# Database Comparison Research Guide

## Overview

This document provides guidelines for researching and assessing database systems for the Lineup comparison. The goal is to capture objective, verifiable information that helps users make informed decisions when choosing a database.

## Scope

**Included:** General-purpose database management systems (RDBMS, document stores, key-value stores, wide-column stores, graph databases)

**Excluded:** Specialized data stores (search engines like Elasticsearch, time-series databases, message queues), embedded analytics engines, data warehouses

## Attribute Groups

### 1. General Information

| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Name** | text | Official product name |
| **Description** | text | One-sentence description of the database type and primary use case |
| **Website** | link | Official website or primary documentation site |
| **License** | tags | Primary license (MIT, Apache 2.0, GPL, Proprietary, etc.) |
| **First Released** | integer | Year of initial public release |
| **Latest Version** | text | Current stable version number |
| **Actively Maintained** | boolean | Has had a release or significant commits in the last 12 months |

### 2. Database Characteristics

| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Database Type** | tags | Primary category: relational, document, key-value, wide-column, graph, multi-model |
| **Query Language** | tags | SQL, proprietary query language, API-only, etc. |
| **ACID Compliant** | boolean | Full ACID transaction support (all four properties) |
| **Schema** | tags | Schema-enforced, schema-optional, schema-less |

### 3. Scalability & Architecture

| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Horizontal Scaling** | boolean | Native support for distributing data across multiple nodes |
| **Replication** | tags | Supported replication modes: primary-replica, multi-primary, none |
| **Clustering** | boolean | Built-in clustering support without third-party tools |
| **Cloud-Native Offering** | boolean | Official managed cloud service available (not just self-hosted on cloud VMs) |

### 4. Features

| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Full-Text Search** | boolean | Built-in full-text search capabilities |
| **JSON Support** | tags | none, storage-only, queryable, native (for document DBs) |
| **Geospatial** | boolean | Native geospatial data types and queries |
| **Time-Series** | boolean | Specialized time-series data handling |
| **Stored Procedures** | boolean | Support for server-side stored procedures/functions |
| **Triggers** | boolean | Database-level trigger support |
| **Views** | boolean | Support for views (regular or materialized) |

### 5. Operations & Ecosystem

| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Official GUI** | boolean | Official graphical administration tool provided |
| **CLI Tool** | boolean | Official command-line interface |
| **Docker Official Image** | boolean | Official image on Docker Hub |
| **Primary Language** | text | Implementation language (C, C++, Go, Java, Rust, etc.) |

### 6. Community & Adoption

| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **GitHub Stars** | integer | Stars on primary GitHub repository (if open source) |
| **Stack Overflow Tag Count** | integer | Number of questions tagged on Stack Overflow |
| **DB-Engines Ranking** | integer | Current rank on db-engines.com |
| **Learning Curve** | rating (1-5) | Subjective assessment: 1=steep, 5=gentle. Based on documentation quality, SQL familiarity, concept complexity |

## Research Sources

### Primary Sources (Preferred)
1. **Official Documentation** - For feature verification, architecture details
2. **Official GitHub Repository** - For stars, activity, license
3. **Official Website** - For release dates, version numbers, cloud offerings

### Secondary Sources
4. **DB-Engines (db-engines.com)** - Rankings, popularity trends, system properties
5. **Stack Overflow** - Tag counts, common issues
6. **Wikipedia** - Historical information, release dates

### Assessment Guidelines

- **ACID Compliance**: Only mark `true` if the database supports all four ACID properties by default or with standard configuration. Partial compliance = `false`
- **Horizontal Scaling**: Must be a built-in feature, not requiring external sharding solutions
- **Learning Curve**: Consider:
  - Uses standard SQL vs proprietary query language
  - Conceptual complexity (relational vs document vs graph)
  - Quality and completeness of documentation
  - Availability of tutorials and community resources
- **GitHub Stars**: Use `null` for closed-source databases
- **Latest Version**: Use semantic version if available, otherwise use the official version string

## Candidates

- [x] PostgreSQL - Most popular open-source RDBMS
- [x] MySQL - Widely deployed RDBMS
- [x] SQLite - Embedded database standard
- [x] MongoDB - Leading document database
- [x] Redis - Dominant key-value store
- [ ] MariaDB - MySQL fork with growing adoption
- [ ] Microsoft SQL Server - Enterprise RDBMS
- [ ] Oracle Database - Enterprise RDBMS standard
- [ ] Cassandra - Wide-column distributed database
- [ ] Neo4j - Leading graph database
- [ ] CockroachDB - Distributed SQL
- [ ] DynamoDB - AWS key-value/document
- [ ] Firestore - Google document database
- [ ] ClickHouse - Analytics-focused
- [ ] ScyllaDB - Cassandra-compatible

## Notes for Researchers

1. **Verify before recording**: Always check multiple sources for factual claims
2. **Cite sources**: Every value should have at least one source URL
3. **Admit uncertainty**: Use `null` for values that cannot be reliably determined
4. **Date sensitivity**: Some values (GitHub stars, rankings) change frequently - note the date in comments
5. **Version specificity**: Features may vary by version - document which version was assessed

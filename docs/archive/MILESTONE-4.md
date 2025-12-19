# Milestone 4: First Comparison Data - Databases

**Completed:** December 2025

## Summary

Added the first real comparison type (Databases) with comprehensive researched data for 5 database systems.

## Tasks Completed

### 1. Create Data Structure
- [x] Create `data/databases/` directory
- [x] Create `RESEARCH.md` with research guidelines and attribute definitions
- [x] Create `attributes.json` with 6 attribute groups and 25 attributes
- [x] Create `index.json` listing candidates

### 2. Research Databases
- [x] Research PostgreSQL - open-source RDBMS
- [x] Research MySQL - popular RDBMS
- [x] Research SQLite - embedded database
- [x] Research MongoDB - document database
- [x] Research Redis - key-value store

### 3. Create Candidate Files
- [x] `postgresql.json` - with sources from official docs, Wikipedia, DB-Engines
- [x] `mysql.json` - with sources from Oracle docs, GitHub, DB-Engines
- [x] `sqlite.json` - with sources from sqlite.org, Wikipedia
- [x] `mongodb.json` - with sources from MongoDB docs, GitHub
- [x] `redis.json` - with sources from redis.io, GitHub

### 4. Integration
- [x] Update `data/index.json` with databases comparison
- [x] Fix candidate index format (string array, not object array)
- [x] Fix React key warning in ComparisonView
- [x] Improve table layout for better column fitting

## Attribute Groups Created

1. **General Information** (6 attributes)
   - Description, Website, License, First Released, Latest Version, Actively Maintained

2. **Database Characteristics** (4 attributes)
   - Database Type, Query Language, ACID Compliant, Schema Model

3. **Scalability & Architecture** (4 attributes)
   - Horizontal Scaling, Replication, Clustering, Cloud-Native Offering

4. **Features** (7 attributes)
   - Full-Text Search, JSON Support, Geospatial, Time-Series, Stored Procedures, Triggers, Views

5. **Operations & Ecosystem** (4 attributes)
   - Official GUI, CLI Tool, Docker Official Image, Primary Language

6. **Community & Adoption** (4 attributes)
   - GitHub Stars, Stack Overflow Questions, DB-Engines Rank, Learning Curve

## Files Changed

- `data/index.json` - Added databases comparison
- `data/databases/RESEARCH.md` - Research guidelines
- `data/databases/attributes.json` - Attribute definitions
- `data/databases/index.json` - Candidate list
- `data/databases/postgresql.json` - PostgreSQL data
- `data/databases/mysql.json` - MySQL data
- `data/databases/sqlite.json` - SQLite data
- `data/databases/mongodb.json` - MongoDB data
- `data/databases/redis.json` - Redis data
- `app/src/components/ComparisonView.tsx` - Fixed key warning, improved table layout

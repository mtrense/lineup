# Distributed Databases Research Guide

## Overview

This comparison helps engineers and architects evaluate distributed database systems for building scalable, fault-tolerant applications. It focuses on databases designed from the ground up for distribution across multiple nodes, data centers, or regions.

Users should be able to:
- Understand the consistency/availability trade-offs of each system
- Compare performance characteristics for different workloads
- Evaluate operational complexity and maturity
- Identify the best fit for their specific use case (OLTP, OLAP, mixed)

## Scope

**Included:**
- Databases with native multi-node distribution (not just replication add-ons)
- NewSQL databases (distributed SQL)
- Distributed NoSQL databases (document, key-value, wide-column, graph)
- Time-series databases with distribution capabilities
- Both open-source and commercial offerings

**Excluded:**
- Traditional single-node databases with bolt-on replication (e.g., MySQL with Galera)
- Data warehouses/analytics platforms (Snowflake, BigQuery, Redshift)
- Streaming platforms (Kafka, Pulsar) unless they offer database semantics
- In-memory caches (Redis Cluster is borderline - include if it offers persistence)
- Embedded databases

## Attribute Groups

### 1. Overview
| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Website** | link | Official project/product website |
| **License** | text | SPDX identifier preferred (e.g., "Apache-2.0", "BSL-1.1", "Proprietary") |
| **Hosting Options** | tags | Available deployment models: self-hosted, official-managed, third-party-managed, serverless |
| **Initial Release** | date (year) | Year the first public version was released |
| **Primary Language** | text | Main implementation language (use "Proprietary" if closed-source and undisclosed) |
| **Data Model** | tags | One or more of: relational, document, key-value, wide-column, graph, time-series |

### 2. Distribution Architecture
| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Topology** | tags | Architecture style: leader-follower, multi-leader, leaderless/peer-to-peer |
| **Sharding** | tags | How data is partitioned: hash, range, geographic, manual, automatic |
| **Replication Factor** | text | Default/configurable replication (e.g., "3 (configurable)") |
| **Multi-Region** | boolean | Native support for geo-distributed deployments |
| **CAP Position** | tags | Primary CAP theorem focus: CP (consistency), AP (availability), or tunable |

### 3. Consistency & Transactions
| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Consistency Model** | tags | strong, eventual, causal, read-your-writes, linearizable, serializable |
| **ACID Transactions** | boolean | Full ACID transaction support |
| **Transaction Scope** | tags | single-row, single-partition, cross-partition, global |
| **Isolation Levels** | tags | Supported levels: read-uncommitted, read-committed, repeatable-read, snapshot, serializable |
| **Distributed Transactions** | boolean | Cross-node transaction coordination (2PC, Paxos, Raft, etc.) |

### 4. Query Capabilities
| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Query Language** | tags | SQL, CQL, MongoDB Query, GraphQL, proprietary, etc. |
| **SQL Compatibility** | tags | none, partial, full, PostgreSQL-compatible, MySQL-compatible |
| **Secondary Indexes** | boolean | Support for indexes beyond the primary key |
| **Joins** | tags | none, local-only, distributed, materialized |
| **Aggregations** | boolean | Native aggregation/GROUP BY support |
| **Full-Text Search** | boolean | Built-in full-text search capabilities |

### 5. Performance & Scalability
| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Max Tested Cluster Size** | integer | Largest documented cluster (nodes) in production or benchmarks |
| **Write Throughput** | text | Representative benchmark (cite source, note conditions) |
| **Read Latency (p99)** | text | Representative latency figures (cite conditions) |
| **Auto-Scaling** | boolean | Automatic scale-out/scale-in without manual intervention |
| **Hot Spot Handling** | tags | How it handles uneven load: automatic rebalancing, splitting, manual |

### 6. Operations & Reliability
| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Zero-Downtime Upgrades** | boolean | Can upgrade without service interruption |
| **Online Schema Changes** | boolean | Schema modifications without locking/downtime |
| **Point-in-Time Recovery** | boolean | Restore to arbitrary past timestamp |
| **Backup Strategy** | tags | snapshot, incremental, continuous, CDC-based |
| **Kubernetes Operator** | boolean | Official K8s operator available |

### 7. Language Support
| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Rust Driver** | tags | none, official, community, third-party |
| **Go Driver** | tags | none, official, community, third-party |
| **Java Driver** | tags | none, official, community, third-party |
| **C#/.NET Driver** | tags | none, official, community, third-party |
| **Python Driver** | tags | none, official, community, third-party |
| **Ruby Driver** | tags | none, official, community, third-party |
| **C/C++ Driver** | tags | none, official, community, third-party |
| **ORM Support** | tags | Major ORMs with native support (Hibernate, SQLAlchemy, Prisma, GORM, etc.) |

### 8. Cost & Licensing
| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Open Source** | boolean | Core database is open source (not just "source available") |
| **Free Tier** | boolean | Official managed service offers a free tier |
| **Pricing Model** | tags | How the service is priced: per-node, per-vCPU, per-storage, per-request, per-hour, enterprise-license |
| **Cost Estimate (Small)** | text | Rough monthly cost for small deployment (3 nodes, basic specs). Cite source. |

### 9. Realtime & Events
| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Change Data Capture** | boolean | Built-in CDC for streaming changes to external systems |
| **Watch/Subscribe** | boolean | Clients can subscribe to changes on specific keys, documents, or queries |
| **Triggers** | boolean | Database-side triggers that execute on data changes |
| **Event Streaming** | tags | Integration with streaming platforms: kafka, pulsar, kinesis, custom |

### 10. Ecosystem & Community
| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **GitHub Stars** | integer | Stars on main repository (if open source) |
| **Stack Overflow Tags** | integer | Number of questions with relevant tag |

## Research Sources

### Primary Sources (Preferred)
1. Official documentation and architecture guides
2. Official GitHub repository (for open source)
3. Published benchmarks from the vendor (note bias)
4. Academic papers describing the system

### Secondary Sources
1. DB-Engines ranking and information
2. Jepsen consistency analysis reports (highly valuable)
3. Independent benchmarks (TPC-C, YCSB, etc.)
4. Conference talks from maintainers (QCon, SIGMOD, VLDB)
5. Production case studies from notable users

### Sources to Use with Caution
- Vendor comparison pages (inherent bias)
- Outdated blog posts (verify version relevance)
- Community forums (verify accuracy)

## Assessment Guidelines

### Hosting Options
- **self-hosted**: Can be deployed on your own infrastructure (bare metal, VMs, containers)
- **official-managed**: Vendor offers a managed DBaaS (e.g., CockroachDB Cloud, MongoDB Atlas)
- **third-party-managed**: Available through cloud providers or other vendors (e.g., Aiven, Instaclustr)
- **serverless**: True serverless offering with pay-per-request pricing (e.g., DynamoDB, Fauna)

### CAP Position
- **CP**: System prioritizes consistency; may reject writes during partitions (e.g., Spanner, CockroachDB)
- **AP**: System prioritizes availability; may serve stale reads during partitions (e.g., Cassandra, DynamoDB)
- **Tunable**: Consistency level configurable per-operation (e.g., Cassandra with quorum settings)

### ACID Transactions
- Mark `true` only if full ACID is supported (not just "atomic single-row operations")
- Note scope limitations in the Transaction Scope attribute

### SQL Compatibility
- **none**: No SQL interface
- **partial**: SQL-like but missing significant features (no JOINs, limited WHERE, etc.)
- **full**: Comprehensive SQL support
- **PostgreSQL-compatible** / **MySQL-compatible**: Wire-protocol compatible with existing drivers

### Data Model Tags
A database may support multiple models. Include all that apply:
- **relational**: Tables with rows and columns, schema-enforced
- **document**: JSON/BSON documents, flexible schema
- **key-value**: Simple key→value storage
- **wide-column**: Column families (Cassandra/HBase style)
- **graph**: Native graph traversal
- **time-series**: Optimized for time-stamped data

### Performance Figures
- Always cite the source and conditions (hardware, cluster size, workload type)
- Prefer independent benchmarks over vendor claims
- Use `null` if no credible figures are available
- Note if figures are from managed service vs self-hosted

### Language Drivers
- **official**: Maintained by the database vendor
- **community**: Well-maintained community project, often linked from official docs
- **third-party**: Exists but not officially endorsed or may be unmaintained
- **none**: No known driver for this language

For databases with SQL/PostgreSQL/MySQL wire compatibility, note if standard drivers work (e.g., "official (via pg wire protocol)").

### Open Source vs Source Available
- **Open Source**: True OSI-approved license (Apache-2.0, MIT, GPL, etc.)
- **Source Available**: Code is viewable but with restrictions (BSL, SSPL, proprietary with source access)
- Mark `false` for source-available licenses; note the actual license in the License attribute

### Pricing Model Tags
- **per-node**: Fixed price per database node
- **per-vCPU**: Price scales with compute resources
- **per-storage**: Price based on data stored
- **per-request**: Pay per read/write operation (serverless model)
- **per-hour**: Hourly billing for running instances
- **enterprise-license**: Annual/contract-based enterprise licensing

### Realtime & Events
- **Change Data Capture**: Mark `true` if the database has built-in CDC capability (e.g., CockroachDB changefeeds, MongoDB change streams, DynamoDB Streams). Third-party CDC tools like Debezium don't count as "built-in."
- **Watch/Subscribe**: Mark `true` if clients can receive push notifications when data changes. This includes MongoDB change streams, CouchDB continuous changes feed, RethinkDB realtime queries, etc. Polling-based approaches don't qualify.
- **Triggers**: Mark `true` if the database supports server-side triggers (stored procedures that fire on INSERT/UPDATE/DELETE). Note: Some NoSQL databases don't have this concept.
- **Event Streaming**: Tags for native integrations with streaming platforms:
  - **kafka**: Direct Kafka connector/sink maintained by the vendor
  - **pulsar**: Apache Pulsar integration
  - **kinesis**: AWS Kinesis integration
  - **custom**: Proprietary streaming protocol (e.g., DynamoDB Streams)

## Initial Candidates

### Tier 1 (Must Have) - Industry leaders
- [x] CockroachDB - Leading open-source NewSQL, strong consistency
- [x] TiDB - MySQL-compatible distributed SQL from PingCAP
- [x] YugabyteDB - PostgreSQL-compatible distributed SQL
- [x] Apache Cassandra - Battle-tested wide-column store
- [x] ScyllaDB - C++ rewrite of Cassandra for performance
- [x] Amazon DynamoDB - AWS's flagship NoSQL, serverless (Realtime & Events complete)
- [x] Google Cloud Spanner - Google's globally-distributed SQL
- [x] MongoDB (Sharded) - Document DB with native sharding
- [x] Vitess - MySQL sharding middleware (YouTube origin)

### Tier 2 (Should Have) - Significant players
- [x] FoundationDB - Apple's ordered key-value store, unique architecture
- [x] Couchbase - Document DB with strong mobile sync story
- [x] ArangoDB - Multi-model (document, graph, key-value)
- [x] Neo4j (Cluster) - Leading graph database
- [x] PlanetScale - Managed Vitess with branching workflows
- [x] CrateDB - Distributed SQL for machine data
- [x] RethinkDB - Real-time push architecture (consider if maintained)
- [x] Dgraph - Distributed graph database

### Tier 3 (Nice to Have) - Specialized/Emerging
- [x] TiKV - Distributed key-value (from TiDB stack)
- [x] etcd - Distributed key-value for config/coordination
- [ ] ClickHouse (Clustered) - If including analytical
- [ ] QuestDB - Time-series with SQL
- [ ] TimescaleDB (Distributed) - PostgreSQL-based time-series
- [ ] Fauna - Serverless document-relational
- [ ] SurrealDB - Multi-model newcomer
- [ ] Dolt - Git-like versioned SQL database

## Notes for Researchers

1. **Verify version relevance**: Distributed databases evolve rapidly. Note the version when recording capabilities.

2. **Jepsen reports**: If a Jepsen analysis exists, it's gold-standard for consistency claims. Note any failed tests.

3. **Managed vs self-hosted**: Many features differ between self-hosted and managed versions. Note which deployment model the data applies to.

4. **Licensing changes**: Several databases have changed licenses recently (MongoDB SSPL, CockroachDB BSL, etc.). Verify current license.

5. **Use `null` appropriately**:
   - Attribute doesn't apply to this database type
   - No credible data available after reasonable research
   - Feature exists but specifics are undocumented

6. **Performance disclaimers**: Always add source/comment for performance figures. Benchmarks are notoriously context-dependent.

7. **Commercial bias**: Vendor documentation emphasizes strengths. Cross-reference with independent sources, especially for limitations.

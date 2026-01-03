# Battery-Operated Powertools Research Guide

## Overview

This comparison helps users evaluate and compare individual battery-operated (cordless) power tools across different brands and categories. The focus is on specific tools - their performance, features, ergonomics, and value - rather than battery ecosystems as a whole.

Users should be able to:
- Compare specific tools within a category (e.g., impact drivers, circular saws)
- Evaluate performance specifications and real-world capabilities
- Assess build quality, ergonomics, and features
- Understand battery system compatibility and lock-in implications
- Make informed purchasing decisions based on their use case

## Scope

**Included:**
- Individual cordless power tools (18V-60V class)
- Consumer, prosumer, and professional grade tools
- Current generation products (actively manufactured/sold)
- All major tool categories (drills, saws, grinders, nailers, etc.)

**Excluded:**
- Corded power tools
- Outdoor/garden power equipment (mowers, trimmers, blowers - separate comparison)
- Hand tools and accessories
- Batteries and chargers as standalone products
- Discontinued/legacy tools no longer in production

## Attribute Groups

### 1. Product Identity

| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Brand** | text | Manufacturer name (Milwaukee, DeWalt, Makita, etc.) |
| **Model Number** | text | Official model/SKU number |
| **Product Name** | text | Marketing name if applicable |
| **Tool Category** | tags | Primary category: "drill-driver", "impact-driver", "hammer-drill", "circular-saw", "reciprocating-saw", "jigsaw", "miter-saw", "angle-grinder", "orbital-sander", "nailer", "rotary-hammer", "oscillating-tool", "router", "other" |
| **Product Line** | text | Sub-brand or line (e.g., "FUEL", "XR", "LXT", "ONE+ HP") |
| **Markets** | tags | Regions where sold: "north-america", "europe", "asia-pacific", "australia", "global" |
| **Website** | link | Official product page |

### 2. Battery System

| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Battery Platform** | text | Platform name (e.g., "M18", "20V MAX", "18V LXT", "ONE+") |
| **Multi-Brand System** | text | Cross-brand compatibility system if any (e.g., "CAS/AmpShare", "Metabo HPT MultiVolt") or "Proprietary" |
| **Nominal Voltage** | integer | Actual nominal voltage (18V, 36V, etc. - not marketing voltage) |
| **Max Voltage** | integer | For FlexVolt/dual-battery tools, the maximum voltage |
| **Recommended Battery (Ah)** | decimal | Manufacturer-recommended battery capacity for optimal performance |
| **Battery Included** | boolean | Whether the standard purchase includes a battery |

### 3. Performance Specifications

| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Motor Type** | tags | "brushless", "brushed" |
| **Max RPM** | integer | Maximum rotations per minute (no-load) |
| **Max IPM** | integer | Maximum impacts per minute (for impact tools) |
| **Max Torque (Nm)** | integer | Maximum torque output in Newton-meters |
| **No-Load Speed Settings** | integer | Number of speed/gear settings |
| **Chuck Size** | text | Chuck capacity (e.g., "13mm", "10mm") |
| **Blade Capacity** | text | Maximum blade size for saws (e.g., "185mm", "190mm") |
| **Cutting Depth (90°)** | decimal | Maximum cutting depth at 90° for saws (mm) |
| **Cutting Depth (45°)** | decimal | Maximum cutting depth at 45° bevel for saws (mm) |
| **Disc Size** | text | Grinding/cutting disc diameter for grinders |
| **Stroke Length** | decimal | Stroke length for reciprocating saws (mm) |
| **OPM** | integer | Orbits per minute for sanders |
| **BPM** | integer | Blows per minute for rotary hammers |

### 4. Physical Characteristics

| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Weight (bare tool)** | decimal | Weight without battery in kg |
| **Weight (with battery)** | decimal | Weight with standard/recommended battery in kg |
| **Length** | decimal | Overall length in mm |
| **Height** | decimal | Overall height in mm |
| **Head Length** | decimal | For drills/drivers: distance from chuck to back of motor housing (mm) |
| **Compact Design** | boolean | Marketed as compact/subcompact variant |

### 5. Features

| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **LED Work Light** | boolean | Integrated LED to illuminate work area |
| **LED Light Modes** | integer | Number of light modes/settings (0 if no light) |
| **Variable Speed Trigger** | boolean | Speed controlled by trigger pressure |
| **Electronic Brake** | boolean | Motor stops quickly when trigger released |
| **Electric Clutch** | boolean | Electronic clutch for consistent torque settings |
| **Clutch Settings** | integer | Number of clutch/torque settings |
| **Kickback Control** | boolean | Anti-kickback or reactive torque protection |
| **Soft Start** | boolean | Gradual ramp-up to prevent jerking |
| **Belt Clip** | boolean | Includes or accepts a belt clip/hook |
| **Bit Holder** | boolean | Onboard storage for bits |
| **Rafter Hook** | boolean | Hook for hanging tool (common on nailers, circular saws) |
| **Dust Collection** | boolean | Built-in dust collection or port for attachment |
| **Tool-Free Adjustment** | boolean | Key adjustments possible without tools (blade change, depth, etc.) |
| **Smart Connectivity** | boolean | Bluetooth/app connectivity (ONE-KEY, Tool Connect, etc.) |
| **Auto-Stop Mode** | boolean | Can be programmed to stop after set rotations/time |

### 6. Build Quality

| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Housing Material** | text | Primary housing material (e.g., "metal gearbox, polymer body") |
| **IP Rating** | text | Ingress protection rating if specified (e.g., "IP56") |
| **All-Metal Gearbox** | boolean | Gearbox housing is metal (vs polymer) |
| **All-Metal Chuck** | boolean | Chuck is all-metal construction (for drills) |
| **Rubberized Grip** | boolean | Overmolded rubber grip area |
| **Made In** | text | Country of manufacture |

### 7. Market & Value

| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Target User** | tags | "diy", "prosumer", "professional", "industrial" |
| **MSRP (Bare Tool)** | integer | Manufacturer suggested retail price, bare tool (USD) |
| **MSRP (Kit)** | integer | MSRP for kit with battery/charger if available (USD) |
| **Street Price (Bare)** | integer | Typical actual selling price, bare tool (USD) |
| **Warranty** | text | Warranty period and type |
| **Release Year** | date (year) | Year the tool was released/announced |

### 8. Ratings & Reviews

| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Pro Tool Reviews Rating** | rating (1-5) | Rating from protoolreviews.com if available |
| **Amazon Rating** | rating (1-5) | Average Amazon customer rating |
| **Home Depot Rating** | rating (1-5) | Average Home Depot customer rating |

## Research Sources

### Primary Sources (Preferred)
1. Official manufacturer product pages and spec sheets
2. Official retailer listings (Home Depot, Lowe's, Amazon) for specs and pricing
3. Manufacturer press releases for release dates and features

### Secondary Sources
4. Professional tool review sites:
   - Pro Tool Reviews (protoolreviews.com)
   - Tool Box Buzz (toolboxbuzz.com)
   - Tools In Action (toolsinaction.com)
5. YouTube reviewers with measurement equipment:
   - VCG Construction
   - Torque Test Channel
   - Project Farm

### Tertiary Sources
6. User reviews and forums
7. Retailer Q&A sections

## Assessment Guidelines

- **Nominal Voltage**: Record actual nominal voltage. "20V MAX" = 18V nominal, "60V MAX" = 54V nominal.
- **Multi-Brand Systems** (note: these are **not cross-compatible** with each other):
  - "Bosch AMPShare" - Bosch Professional 18V system with 35+ partner brands. Uses Bosch ProCORE18V batteries. Partners include: Fein, Rothenberger, Steinel, Ledlenser, Wagner, Fischer, Klauke, Leister, and many industrial specialists. Website: ampshare.com
  - "Metabo CAS" - Cordless Alliance System, Metabo 18V LiHD platform. Separate from Bosch AMPShare despite similar concept. Partners include: Festool, Mafell, Metabo, Eibenstock, Collomix, Haaga, Starmix, Birchmeier. Uses Metabo LiHD batteries.
  - "Metabo HPT MultiVolt" - Hikoki/Metabo HPT system, works with both 18V and 36V batteries. Note: Metabo HPT (formerly Hitachi, owned by KKR) is a completely different company from Metabo (German, CAS founder).
  - "Parkside 20V/Team" - Lidl house brand, compatible across Parkside tools
  - "Power X-Change" - Einhell platform, some third-party compatibility
  - "Flex 24V" - Flex (US) Stacked Lithium platform. Note: Flex US is separate from Flex EU which participates in other alliances.
  - "EGO 56V" - Outdoor focus but expanding to power tools
  - "Proprietary" - Single-brand only (Milwaukee, DeWalt, Makita, Ryobi, Hilti, etc.)
- **Torque Values**: Prefer manufacturer specs. Note if value is from third-party testing.
- **Weight**: Always specify bare tool weight. Include battery weight separately if available.
- **Street Price**: Use typical non-sale pricing from major retailers. Note date of price check.
- **Target User**:
  - "diy" - Light duty, occasional use, budget-focused
  - "prosumer" - Serious hobbyist, frequent use, willing to pay more
  - "professional" - Daily job site use, durability critical
  - "industrial" - Heavy industrial/manufacturing applications
- **Release Year**: Use announcement year if different from availability year.
- **Markets**:
  - "global" - Sold worldwide under same or similar model numbers
  - "north-america" - US, Canada, Mexico
  - "europe" - EU countries, UK, Switzerland, Norway
  - "asia-pacific" - Japan, South Korea, Southeast Asia, China
  - "australia" - Australia, New Zealand
  - Note: Some brands have region-specific models (e.g., Parkside is Europe-only, Ridgid is primarily North America)

## Initial Candidates

### Impact Drivers (Priority Category)

**Premium / Professional**
- [x] Milwaukee M18 FUEL 2953-20 (Gen 4)
- [x] DeWalt DCF850 ATOMIC 20V MAX
- [x] DeWalt DCF887 20V MAX XR
- [x] Makita XDT19 18V LXT
- [x] Makita XGT TD002G 40V
- [x] Bosch GDR18V-1860CN (Bosch AMPShare)
- [x] Metabo HPT WH18DBDL2
- [x] Festool TID 18 (Metabo CAS)
- [x] Metabo SSD 18 LTX 200 BL (Metabo CAS)
- [x] Hilti SID 6-22

**Prosumer / DIY**
- [x] Ryobi PBLID02 ONE+ HP
- [x] Ridgid R872311 18V SubCompact
- [x] Bosch GSR 18V-60 FC (FlexiClick system)

**Budget / Shared Platform**
- [x] Flex FX1371A-Z 24V (Stacked Lithium)
- [x] Parkside PDSSA 20-Li A1 (Lidl, 20V/Team)
- [x] Einhell TE-CI 18 Li (Power X-Change)
- [x] Worx WX292 20V

### Drill/Drivers

**Premium / Professional**
- [x] Milwaukee M18 FUEL 2903-20
- [ ] DeWalt DCD800 20V MAX XR
- [ ] Makita XFD16 18V LXT
- [ ] Festool T 18+3 (Metabo CAS)
- [ ] Metabo BS 18 LTX BL I (Metabo CAS)
- [ ] Fein ABS 18 QC (Bosch AMPShare)
- [ ] Hilti SF 6-22

**Prosumer / DIY**
- [ ] Ryobi PBLDD01 ONE+ HP
- [ ] Bosch GSR 18V-90 C Professional (Bosch AMPShare)

**Budget / Shared Platform**
- [ ] Flex FX1151-Z 24V
- [ ] Parkside PABS 20-Li D4 (Lidl, 20V/Team)
- [ ] Einhell TE-CD 18 Li-i BL (Power X-Change)

### Hammer Drills

**Premium / Professional**
- [ ] Milwaukee M18 FUEL 2904-20
- [ ] DeWalt DCD999 20V MAX XR FLEXVOLT Advantage
- [ ] Makita XPH16 18V LXT
- [ ] Festool TPC 18/4 (Metabo CAS)
- [ ] Metabo SB 18 LTX BL I (Metabo CAS)
- [ ] Hilti SF 6H-22

**Prosumer / DIY**
- [ ] Bosch GSB 18V-90 C Professional (Bosch AMPShare)
- [ ] Ryobi PBLHM101 ONE+ HP

**Budget / Shared Platform**
- [ ] Parkside PSBSA 20-Li B2 (Lidl, 20V/Team)
- [ ] Einhell TE-CD 18 Li-i Brushless (Power X-Change)

### Circular Saws

**Premium / Professional**
- [ ] Milwaukee M18 FUEL 2732-20 (7-1/4")
- [ ] DeWalt DCS573 20V MAX (7-1/4")
- [ ] Makita XSH06 X2 LXT (36V, 7-1/4")
- [ ] Makita HS004G XGT 40V (190mm)
- [ ] Festool HKC 55 (Metabo CAS)
- [ ] Mafell K 55 18M bl (Metabo CAS)
- [ ] Metabo KS 18 LTX 57 (Metabo CAS)

**Prosumer / DIY**
- [ ] Ryobi PBLCS300 ONE+ HP
- [ ] Bosch GKS 18V-68 GC Professional (Bosch AMPShare)

**Budget / Shared Platform**
- [ ] Flex FX2141-Z 24V (7-1/4")
- [ ] Parkside PHKSA 20-Li A1 (Lidl, 20V/Team)
- [ ] Einhell TE-CS 18/190 Li BL (Power X-Change)

### Reciprocating Saws

**Premium / Professional**
- [ ] Milwaukee M18 FUEL 2821-20 SAWZALL
- [ ] DeWalt DCS369 ATOMIC 20V MAX
- [ ] Makita XRJ07 18V LXT
- [ ] Metabo SSE 18 LTX BL (Metabo CAS)
- [ ] Hilti SR 6-22

**Prosumer / DIY**
- [ ] Bosch GSA 18V-32 Professional (Bosch AMPShare)
- [ ] Ryobi RRS1801M ONE+

**Budget / Shared Platform**
- [ ] Flex FS1301-Z 24V
- [ ] Parkside PSSA 20-Li C3 (Lidl, 20V/Team)
- [ ] Einhell TE-AP 18 Li (Power X-Change)

### Angle Grinders

**Premium / Professional**
- [ ] Milwaukee M18 FUEL 2880-20 (4-1/2"/5")
- [ ] DeWalt DCG418 60V MAX FLEXVOLT (4-1/2"/6")
- [ ] Makita XAG26 18V LXT (4-1/2"/5")
- [ ] Metabo WB 18 LTX BL 125 Quick (Metabo CAS)
- [ ] Festool AGC 18 (Metabo CAS)
- [ ] Hilti AG 6-22

**Prosumer / DIY**
- [ ] Bosch GWS 18V-15 SC Professional (Bosch AMPShare)
- [ ] Ryobi PBLAG01 ONE+ HP

**Budget / Shared Platform**
- [ ] Flex FX3171A-Z 24V (5")
- [ ] Parkside PWSA 20-Li B2 (Lidl, 20V/Team)
- [ ] Einhell TE-AG 18/115 Li BL (Power X-Change)

### Rotary Hammers

**Premium / Professional**
- [ ] Milwaukee M18 FUEL 2912-20 (1" SDS-Plus)
- [ ] DeWalt DCH293 20V MAX XR (1-1/8" SDS-Plus)
- [ ] Makita XRH12 18V LXT (11/16" SDS-Plus)
- [ ] Bosch GBH18V-26 18V (1" SDS-Plus, Bosch AMPShare)
- [ ] Metabo KHA 18 LTX BL 24 Quick (Metabo CAS)
- [ ] Hilti TE 6-22

**Prosumer / DIY**
- [ ] Ryobi PBLRH01 ONE+ HP (SDS-Plus)

**Budget / Shared Platform**
- [ ] Flex FX4221-Z 24V (SDS-Plus)
- [ ] Parkside PABH 20-Li B2 (Lidl, 20V/Team)
- [ ] Einhell HEROCCO (Power X-Change)

### Oscillating Multi-Tools

**Premium / Professional**
- [ ] Milwaukee M18 FUEL 2836-20
- [ ] DeWalt DCS354 ATOMIC 20V MAX
- [ ] Makita XMT04 18V LXT
- [ ] Festool OSC 18 (Metabo CAS)
- [ ] Fein MultiMaster AMM 700 Max (Bosch AMPShare)
- [ ] Metabo MT 18 LTX BL QSL (Metabo CAS)

**Prosumer / DIY**
- [ ] Bosch GOP 18V-34 Professional (Bosch AMPShare)
- [ ] Ryobi PBLMT50 ONE+ HP

**Budget / Shared Platform**
- [ ] Parkside PMSA 20-Li A1 (Lidl, 20V/Team)
- [ ] Einhell VARRITO (Power X-Change)

### Nailers

**Premium / Professional**
- [ ] Milwaukee M18 FUEL 2746-20 (18GA Brad)
- [ ] DeWalt DCN680 20V MAX (18GA Brad)
- [ ] Makita XNB02 18V LXT (18GA Brad)
- [ ] Metabo NFR 18 LTX 90 BL (Metabo CAS, Framing)

**Prosumer / DIY**
- [ ] Ryobi P325 ONE+ (16GA)

**Budget / Shared Platform**
- [ ] Parkside PATN 20-Li A1 (Lidl, 20V/Team)

## Notes for Researchers

1. **Category-Specific Specs**: Not all attributes apply to all tool categories. Use `null` for non-applicable specifications (e.g., "Chuck Size" for a circular saw).

2. **Model Number Variants**: Many tools have multiple SKUs for bare tool vs kit configurations. Focus on the bare tool model but note kit availability.

3. **Generation/Revision Tracking**: Some tools have multiple generations (e.g., Milwaukee FUEL Gen 3 vs Gen 4). Treat each generation as a separate entry if significantly different.

4. **Regional Model Numbers**: Model numbers may vary by region. Use North American model numbers as default.

5. **Performance Validation**: Manufacturer specs may be optimistic. Note when values are verified by third-party testing (Pro Tool Reviews, Torque Test Channel).

6. **Price Volatility**: Power tool prices fluctuate with sales cycles. Record typical street price and note the date. Holiday sales can be 30-40% off.

7. **Spec Sheet Gaps**: Many manufacturers don't publish complete specs. Use `null` rather than guessing. Common gaps: IP ratings, head length, exact weights.

8. **Multi-Brand Systems**: There are two major 18V multi-brand alliances in Europe:
   - **Bosch AMPShare** (Bosch Professional 18V, uses ProCORE batteries)
   - **Metabo CAS** (Metabo 18V LiHD batteries)
   These are **not cross-compatible**. Always verify current membership as brands may join/leave. Note that Metabo HPT (formerly Hitachi) is unrelated to Metabo (German).

# Single Board Computers Research Guide

## Overview

Compare single board computers (SBCs) capable of running Linux, across architectures (ARM, RISC-V, x86) and use cases (home server, retro gaming, edge ML, robotics, media center, headless clusters, learning, light desktop). The goal is to help someone pick the right board for a specific project by comparing compute, I/O, software maturity, power, form factor, and price.

Users should be able to:
- Match a board's compute and I/O to a project (NAS, kiosk, robot controller, mini-server, edge ML, retro emulation, etc.)
- Assess software support — mainline kernel, distro availability, vendor image quality, longevity of updates
- Compare ports and expansion (USB, Ethernet, PCIe, GPIO, HAT compatibility, MIPI camera/display)
- Evaluate AI/GPU capabilities (NPU TOPS, Vulkan/OpenGL ES, hardware video codecs)
- Compare power draw, thermals, and physical footprint
- Gauge real-world price and availability across regions

## Scope

**Included:**
- ARM-based SBCs running Linux (Raspberry Pi family, Rockchip, Allwinner, Amlogic, NXP, Broadcom)
- RISC-V SBCs running Linux (StarFive, T-Head, SpacemiT, JH-class)
- x86 SBCs running Linux that retain a true SBC form factor (LattePanda, UDOO, ODROID-H4, ODYSSEY-X86)
- Boards in current production OR still widely available new at retail
- Boards with at least one official or major community Linux distribution image

**Excluded:**
- Microcontroller boards without an MMU (Arduino, ESP32, RP2040, STM32 dev kits) — cannot run Linux
- Generic x86 mini-PCs and NUCs sold as enclosed systems
- Compute modules without an integrated/typical carrier (RPi CM5 alone, Jetson Orin NX module, Radxa CM5) — covered separately if at all
- NVIDIA Jetson family (Orin Nano, Orin NX, AGX Orin) — AI-accelerator-first product line; comparison axes don't line up cleanly with general-purpose SBCs
- Pure FPGA dev boards and SoC-FPGAs without first-class Linux support
- Dev boards locked to non-Linux RTOS / firmware ecosystems
- Boards no longer manufactured AND no longer sold new (truly EOL)

## Attribute Groups

### 1. General Information

| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Manufacturer** | text | Company that designs/sells the board (Raspberry Pi Ltd, Radxa, Hardkernel, FriendlyELEC, Pine64, etc.). |
| **Model** | text | Official product name (e.g., "Raspberry Pi 5", "ROCK 5B", "ODROID-M1S"). |
| **Release Date** | date (month-year) | Public availability date. Use announcement date if launch slipped. |
| **Status** | tags | `in-production`, `available-new`, `eol-but-stocked`, `discontinued`. |
| **Architecture Family** | tags | `arm64`, `armv7`, `riscv64`, `x86-64`. Select the primary CPU ISA. |
| **Open Source Hardware** | boolean | True if schematics + PCB design released under an OSHW-compatible license. |
| **Country of Origin** | text | Country of design/HQ (UK, China, South Korea, India, USA, etc.). |
| **Website** | link | Official product page. |

### 2. SoC & CPU

| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **SoC** | text | System-on-chip name (e.g., "BCM2712", "RK3588", "Amlogic S922X", "Intel N100", "JH7110"). |
| **SoC Vendor** | tags | `broadcom`, `rockchip`, `amlogic`, `allwinner`, `nxp`, `mediatek`, `starfive`, `t-head`, `spacemit`, `intel`, `amd`, `other`. |
| **CPU Cores** | integer (ascending) | Total core count. |
| **CPU Architecture** | text | Microarchitecture summary (e.g., "4× Cortex-A76", "4× A76 + 4× A55 (big.LITTLE)", "Intel Alder Lake-N"). |
| **Max Clock Speed (GHz)** | decimal (ascending) | Highest advertised core clock under stock settings. |
| **Process Node** | text | Fabrication node if known (e.g., "16 nm", "7 nm", "Intel 7"). |

### 3. GPU & AI Acceleration

| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **GPU** | text | GPU model name (e.g., "VideoCore VII", "Mali-G610 MC4", "Intel UHD Graphics", "Imagination BXE-4-32"). |
| **OpenGL ES Version** | text | Highest supported (e.g., "3.1", "3.2"). |
| **Vulkan Support** | boolean | Vulkan 1.x driver available (mainline or vendor). |
| **NPU** | boolean | Dedicated neural-processing unit on board. |
| **NPU Performance (TOPS)** | decimal (ascending) | Advertised tera-ops; null if no NPU. |
| **HW Video Decode** | tags | Codecs decoded in hardware: `h264`, `h265`, `vp9`, `av1`. |
| **HW Video Encode** | tags | Codecs encoded in hardware. |

### 4. Memory & Storage

| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **RAM Min (GB)** | decimal (ascending) | Smallest configuration sold. |
| **RAM Max (GB)** | decimal (ascending) | Largest configuration sold. |
| **RAM Type** | tags | `lpddr2`, `lpddr3`, `lpddr4`, `lpddr4x`, `lpddr5`, `ddr4`, `ddr5`. |
| **eMMC** | boolean | Onboard eMMC present (any capacity option). |
| **microSD Slot** | boolean | Standard microSD card slot present. |
| **M.2 NVMe Slot** | boolean | M.2 slot supporting NVMe SSD (any key/length). |
| **SATA** | boolean | Native SATA port (not USB-to-SATA). |

### 5. Connectivity & I/O

| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Ethernet** | tags | `none`, `100m`, `1g`, `2.5g`, `10g`. Select the highest port speed. |
| **Dual Ethernet** | boolean | Two or more Ethernet ports. |
| **Wi-Fi** | tags | `none`, `wifi-4`, `wifi-5`, `wifi-6`, `wifi-6e`, `wifi-7`. |
| **Bluetooth** | text | Version if present (e.g., "5.0", "5.2"); null if absent. |
| **USB-A 3.x Ports** | integer (ascending) | Count of USB-A ports running 5 Gbps or faster. |
| **USB-A 2.0 Ports** | integer (ascending) | Count of USB-A ports limited to 480 Mbps. |
| **USB-C Ports (Data)** | integer (ascending) | USB-C ports usable for data (excluding power-only). |
| **PoE Support** | tags | `none`, `via-hat`, `built-in`. PoE+ counts as `built-in`. |

### 6. Display & Camera

| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **HDMI Outputs** | integer (ascending) | Number of HDMI ports. |
| **Max Display Resolution** | text | Highest single-display resolution officially supported (e.g., "4K@60", "8K@30", "4K@30"). |
| **DisplayPort** | boolean | Native DisplayPort output present (USB-C DP-Alt counts; note in comment). |
| **MIPI-DSI** | boolean | MIPI-DSI display connector present. |
| **MIPI-CSI** | boolean | MIPI-CSI camera connector present. |
| **Audio Jack** | boolean | 3.5 mm analog audio output present. |

### 7. Expansion

| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **GPIO Pins** | integer (ascending) | Count of GPIO pins on the main header (40, 26, etc.). |
| **RPi-Compatible Header** | boolean | 40-pin header pin-compatible with the Raspberry Pi GPIO. |
| **RPi HAT Compatible** | boolean | Mechanical and electrical HAT compatibility (header position, mounting holes, EEPROM). |
| **PCIe Lanes Exposed** | text | PCIe lanes exposed to user (e.g., "1× PCIe 2.0", "1× PCIe 3.0", "1× FPC connector + 1× M.2"); "none" if not exposed. |
| **I2C / SPI / UART** | boolean | Any of I²C, SPI, or UART available on the GPIO header. |

### 8. Power & Thermal

| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Power Input** | text | Connector and voltage (e.g., "USB-C 5V/5A", "DC barrel 12V/2A", "USB-C PD 15V"). |
| **Idle Power (W)** | decimal (descending) | Typical idle consumption with peripherals removed; lower is better. |
| **Load Power (W)** | decimal (descending) | Typical full-load draw under stock cooling; lower is better. |
| **Cooling Required** | tags | `passive-ok`, `heatsink-recommended`, `active-required`. Refers to sustained full load. |
| **RTC Battery Header** | boolean | Onboard header or holder for a real-time-clock battery. |

### 9. Form Factor

| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Length (mm)** | decimal | PCB length. |
| **Width (mm)** | decimal | PCB width. |
| **Form Factor Class** | tags | `pi-standard` (~85×56 mm), `pi-zero` (~65×30 mm), `pico-itx` (100×72), `nano-itx`, `credit-card`, `custom`. |
| **Mounting Hole Pattern** | tags | `pi-standard`, `pi-zero`, `none`, `custom`. |
| **Weight (g)** | decimal | Bare board weight. |

### 10. Software Support

| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Mainline Linux Kernel** | tags | `full` (board boots stock mainline kernel), `partial` (boots but features missing), `vendor-only` (requires vendor fork), `none`. |
| **Official OS Image** | boolean | Vendor publishes a maintained Linux image. |
| **Distros With Images** | tags | `raspberry-pi-os`, `ubuntu`, `debian`, `armbian`, `fedora`, `opensuse`, `alpine`, `dietpi`, `manjaro`, `vendor-only`. Select all that publish a board-specific image. |
| **Bootloader** | tags | `u-boot`, `uefi`, `proprietary`, `coreboot`, `tow-boot`. |
| **Long-Term Support** | tags | `5y+`, `3-5y`, `1-3y`, `unclear`. Vendor's stated software-support window. |
| **Android Support** | boolean | Official or maintained Android image available. |

### 11. Pricing & Availability

| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **MSRP Base (USD)** | decimal (descending) | Lowest configuration sold (RAM/storage). Lower is better at equal capability. |
| **MSRP Top (USD)** | decimal (descending) | Highest configuration sold. |
| **Available Regions** | tags | `north-america`, `europe`, `asia-pacific`, `india`, `global`. Where it ships from official channels or major resellers. |
| **Typical Lead Time** | tags | `in-stock`, `weeks`, `months`, `scarce`. Snapshot — note date. |

### 12. Community & Ecosystem

| Attribute | Type | Research Notes |
|-----------|------|----------------|
| **Documentation Quality** | rating (1-5, ascending) | 5 = comprehensive official docs, schematics, datasheet, getting-started; 3 = adequate; 1 = sparse or only forum posts. |
| **Community Size** | tags | `huge` (RPi-scale), `large`, `medium`, `small`, `niche`. |
| **Active Forum / Discord** | boolean | Vendor-run or vendor-blessed forum/Discord with regular activity. |
| **Accessory Ecosystem** | rating (1-5, ascending) | 5 = many cases, HATs, screens, official accessories; 1 = minimal third-party support. |

## Research Sources

### Primary Sources (Preferred)

1. **Official manufacturer product page** — specs, ports, dimensions, official price, OS images.
2. **Official datasheet / hardware reference manual** — authoritative for SoC, RAM, electrical specs.
3. **Official wiki / documentation portal** — Raspberry Pi Documentation, Radxa Wiki, Hardkernel Wiki, FriendlyELEC Wiki, Pine64 Wiki, BeagleBoard Docs.
4. **Vendor's GitHub / git** — kernel forks, U-Boot trees indicate true mainline support.

### Secondary Sources

5. **Linux kernel mainline status pages** — linux-sunxi.org (Allwinner), linux-rockchip.info, eLinux.org board pages, kernel.org defconfigs.
6. **Armbian board pages** — armbian.com — practical mainline-kernel maturity per board.
7. **DietPi / Ubuntu / Debian board lists** — confirms image availability.
8. **Reddit r/SBCs, r/raspberry_pi, r/orangepi, r/RockPi** — recent user reports, availability snapshots.
9. **CNX-Software, Liliputing, Phoronix** — review articles, benchmark data, release coverage.
10. **YouTube channels** — Jeff Geerling (RPi/SBC reviews), ETA Prime, Explaining Computers, Christopher Barnatt.

### Tertiary / Verify Carefully

11. **AliExpress / retailer listings** — useful for street price and availability snapshots; specs there are often wrong, so cross-check with vendor.
12. **Wikipedia** — handy summaries but often outdated for new revisions.
13. **Vendor marketing benchmarks** — treat as best-case until reproduced independently.

## Assessment Guidelines

- **SoC vs Vendor**: Record the SoC string exactly as the vendor names it (e.g., "RK3588" vs "RK3588S" — they differ). The "SoC Vendor" tag is the silicon designer, not the board maker.
- **CPU Cores / Architecture**: For big.LITTLE, list both clusters (e.g., "4× Cortex-A76 + 4× Cortex-A55"). For x86, use the marketing class (e.g., "Intel N100 (Alder Lake-N, 4 cores)").
- **Max Clock Speed**: Use highest sustained stock clock, not transient boost. If the SoC has different ratings on different boards, record what *this* board's docs state.
- **Mainline Linux Kernel** classification:
  - `full` — board boots a stock upstream kernel with all major peripherals working (Ethernet, USB, HDMI, GPIO).
  - `partial` — boots but missing meaningful hardware (e.g., GPU, NPU, Wi-Fi, video codecs).
  - `vendor-only` — requires a vendor-maintained kernel fork; mainline does not boot or boots without essential drivers.
  - `none` — no maintained Linux support exists.
- **Distros With Images**: Only list distros that publish a board-specific image (or whose generic ARM image is officially documented to work). Do not list a distro just because someone got it running once.
- **PoE Support**: `via-hat` means PoE only available through an add-on board (RPi PoE+ HAT). `built-in` means a PoE-capable port is on the SBC itself.
- **Cooling Required**: Base on the *vendor's* recommendation for sustained max load, not idle behavior. RPi 5 is `heatsink-recommended`; RK3588 boards are typically `active-required`.
- **MSRP**: Use the manufacturer's official price for the base configuration. Note date in the comment because SBC pricing fluctuates and many boards are sold at premium markup by resellers.
- **Typical Lead Time**: Snapshot — always include the check date in the comment.
- **Community Size** rough thresholds:
  - `huge` — Raspberry Pi only.
  - `large` — Orange Pi, BeagleBone, ODROID, the Rockchip ecosystem broadly.
  - `medium` — established second-tier vendors (Radxa, Khadas, FriendlyELEC, LibreComputer, Pine64).
  - `small` — newer/niche vendors with active but small followings.
  - `niche` — single-vendor or research-grade boards.
- **Accessory Ecosystem**: Count cases, official displays, official cameras, HATs, vendor-published add-ons. Generic 40-pin HAT compatibility ≠ a vibrant ecosystem.
- **Form Factor Class**: `pi-standard` only if PCB is within ~5 mm of 85×56 mm AND mounts match RPi holes. Otherwise `custom`.
- **Open Source Hardware**: Schematics-only (PDF) does not qualify; needs PCB design files under an OSHW-compatible license. If only schematics PDFs exist, mark `false` with a comment noting partial openness.

### When to Use `null`

- Specs the vendor does not publish and that cannot be verified independently (e.g., process node for many Chinese SoCs, exact idle power without measurement).
- "Mainline Linux" status when the situation is genuinely in flux (mid-merge-window for major drivers) — null with a comment beats a wrong tag.
- NPU TOPS for boards with no NPU.
- Codec lists where the vendor markets "hardware video" without specifying which codecs.
- Conflicting info between vendor docs and community testing — prefer null and explain in the comment.

## Candidates

- [x] **Raspberry Pi 5** — BCM2712, the reference SBC for hobbyist Linux
- [x] **Raspberry Pi 4 Model B** — Still widely deployed; baseline against RPi 5
- [x] **Raspberry Pi Zero 2 W** — Ultra-compact, low-power RPi
- [x] **Raspberry Pi 3 Model B+** — Older but still in production; cheap entry point
- [x] **Radxa ROCK 5B** — RK3588, premier high-performance ARM SBC alternative
- [x] **Radxa ROCK 5B+** — RK3588 refresh with M.2 and storage upgrades
- [x] **Radxa ROCK 5A** — RK3588S in RPi-style form factor
- [x] **Radxa ROCK 4SE** — RK3399-T, mid-tier
- [x] **Radxa ZERO 3W** — RK3566 in Pi Zero form factor
- [x] **Orange Pi 5 Plus** — RK3588, dual 2.5G Ethernet, NAS-friendly
- [x] **Orange Pi 5 Pro** — RK3588S, mid-tier
- [x] **Orange Pi 5 Max** — RK3588 with high-end I/O
- [x] **Orange Pi Zero 3** — Allwinner H618, ultra-cheap LAN-capable
- [x] **Orange Pi 3B** — RK3566, RPi 3B-style form factor
- [x] **FriendlyELEC NanoPC-T6** — RK3588, mini-ITX-ish, dual 2.5G LAN
- [x] **FriendlyELEC NanoPi R6S** — RK3588S router-class form factor
- [x] **FriendlyELEC NanoPi R5S** — RK3568 router-class form factor
- [x] **Hardkernel ODROID-N2+** — Amlogic S922X, mature mid-tier ARM
- [x] **Hardkernel ODROID-M1S** — RK3566S, thin form factor
- [x] **Hardkernel ODROID-C4** — Amlogic S905X3, budget media-friendly
- [x] **Hardkernel ODROID-H4** — Intel N97 x86 SBC, mini-ITX-ish
- [x] **Khadas VIM4** — Amlogic A311D2 with NPU, premium build
- [x] **Khadas Edge2** — RK3588S, slim form factor
- [x] **Banana Pi BPI-M7** — RK3588, large-RAM configurations
- [x] **Banana Pi BPI-F3** — SpacemiT K1 RISC-V octa-core
- [x] **LibreComputer Le Potato (AML-S905X-CC)** — Amlogic S905X, RPi 3-compatible budget
- [x] **LibreComputer Renegade (ROC-RK3328-CC)** — RK3328, budget option
- [x] **LibreComputer Alta (AML-A311D-CC)** — Amlogic A311D with NPU
- [x] **Pine64 Quartz64 Model A** — RK3566, NAS-oriented
- [x] **Pine64 RockPro64** — RK3399, established community _(review by 2026-07-26: both Pine Store SKUs and Ameridroid OOS as of 2026-04-26; if still scarce, flip status to `discontinued`)_
- [x] **Pine64 Star64** — JH7110 RISC-V
- [x] **BeagleBone Black** — TI AM3358, classic industrial / education SBC
- [x] **BeagleBone AI-64** — TI TDA4VM with C7x DSPs
- [x] **BeaglePlay** — TI AM625, modern BeagleBoard line
- [x] **BeagleV-Ahead** — T-Head TH1520 RISC-V
- [ ] **StarFive VisionFive 2** — JH7110 RISC-V, established RISC-V SBC
- [ ] **Milk-V Mars** — JH7110 RISC-V, RPi-style budget
- [ ] **Sipeed LicheePi 4A** — T-Head TH1520 RISC-V
- [ ] **Pine64 Ox64** — BL808 RISC-V, ultra-compact
- [ ] **ASUS Tinker Board 3N** — RK3568, industrial-flavored ASUS line
- [ ] **LattePanda 3 Delta** — Intel N5105 x86 SBC
- [ ] **LattePanda Mu (compute module + carrier kit)** — Intel N100 module + carrier (treated as a usable SBC kit)
- [ ] **UDOO Bolt V8** — AMD Ryzen Embedded V1605B, high-power x86 SBC
- [ ] **UDOO Vision** — Intel Core Ultra x86 SBC
- [ ] **ODYSSEY-X86J4125** — Intel J4125 with onboard Arduino co-MCU
- [ ] **Seeed reTerminal / reComputer R1100** — Compute Module 4 + integrated screen + carrier
- [ ] **MNT Reform / Pocket Reform mainboard** — Open-hardware SBCs (multiple SoC modules)
- [ ] **Mixtile Blade 3** — RK3588, compute-cluster-friendly with dual 2.5G

## Notes for Researchers

1. **Verify mainline status with the kernel, not the vendor README**. "Supports mainline" in marketing often means "boots upstream after applying our patch set." Check `arch/arm64/boot/dts/` for the board's DTS in the relevant kernel version, or armbian.com/<board>.

2. **Snapshot pricing and availability dates**. SBC prices fluctuate widely; record the date of any price/availability check in the `comment` field.

3. **Distinguish base SoC from board variant**. RK3588 and RK3588S differ (PCIe lanes, USB count). RPi 4 has 1/2/4/8 GB versions; record the spread in `RAM Min` / `RAM Max` rather than picking one.

4. **Don't confuse modules with boards**. The Raspberry Pi CM5 is a module; the *carrier* is what makes it usable. Same for Jetson modules. Where a vendor ships a module-plus-carrier as a complete product (LattePanda Mu kit, Seeed reComputer), treat that bundle as the candidate.

5. **Wi-Fi/Bluetooth versions** are easy to misreport. Look at the actual chipset (Realtek 8852, Broadcom CYW43455, Intel AX210) rather than marketing — vendors sometimes list "Wi-Fi 6" when only Wi-Fi 5 hardware is fitted.

6. **HAT compatibility ≠ HAT certification**. A 40-pin RPi-compatible header lets you bolt on most HATs mechanically. Real HAT compliance (EEPROM-based auto-config, mechanical clearance) is rarer; if mechanical-only, note in comment.

7. **PCIe exposure varies wildly**. Some boards bring out a full M.2 slot, some a fragile FPC connector, some only an unpopulated header. Capture this in the `PCIe Lanes Exposed` text.

8. **Idle and load power need a measurement source**. If you can't find a measured number from a credible review (Jeff Geerling, CNX-Software, Phoronix), use null rather than guessing from TDP.

9. **NPU "TOPS" numbers are vendor-quoted INT8 peaks**. They are not directly comparable across vendors. Keep the unit consistent (TOPS @ INT8) and note any deviation in the comment.

10. **Software longevity is a known weak point** for many cheap SBCs. If the vendor has a history of abandoning kernel support after one product cycle, capture that in the `Long-Term Support` tag and add a comment.

11. **Country of origin is the design HQ**, not where the PCB is fabricated. The board itself is almost always assembled in China regardless of vendor HQ.

12. **Use null + comment over guessing**. SBC datasheets are inconsistent. Better to mark a value unknown and note the gap than to extrapolate from a similar-looking board.

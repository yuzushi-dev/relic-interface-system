# Relic Interface System (RIS v2.8.0) — Figma Studio Kit Publishing Runbook

> **Commercial Distribution & Community Publishing Guide**  
> Complete operational manual for generating the master `.fig` file, launching the Figma Community Free Preview, and distributing the Studio Pro package on Polar.sh and Gumroad.

---

## 1. Executive Summary & Product Architecture

The **Relic Interface System (RIS v2.8.0) Figma Studio Kit** is a precision cybernetic brutalist design system and tactical telemetry HUD. Built for mission-critical interfaces, forensic dashboards, sci-fi applications, biofeedback telemetry, and high-density data visualizations.

### 1.1 Dual-Tier Distribution Strategy

| Feature | Community Free Preview | Studio Pro (Lemon Squeezy / Gumroad) |
|---|---|---|
| **Price** | Free (Open Community) | $29 (Indie) / $79 (Team) / $199 (Enterprise) |
| **Figma Master File** | `RIS-v2.8.0-Community-Preview.fig` | `RIS-v2.8.0-Studio-Pro.fig` (Complete) |
| **Foundations & Tokens** | Core Tokens (`community-preview-tokens.json`) | Full W3C DTCG Token Dictionary (`tokens.json`) |
| **Brands Included** | Relic (Default) & BioHub | Relic, BioHub, Omnikon, Neutral (All 4) |
| **Case-Context Skins** | Dark Graphite & Light Paper | Dark, Light, Sealed Dossier, Field Ops, Night Archive, Cyber HUD |
| **Buttons & Controls** | Primary & Default (MD) | 7 Variants × 4 States × 3 Sizes (Full Matrix) |
| **Interactive Components** | Basic Panels & Switch | Mechanical Switches, Corner Brackets, Accordions, Bottom Sheet |
| **Pre-assembled Layouts** | Preview Screenshot | 1440px Desktop Dashboard + 390px Mobile Touch Shell |
| **Vector HUD Assets** | Core 7 SVGs + 34 Micrographics (full flywheel set) | Micrographics Vol. 1 engineered package: React components, zero-reflow CSS, consolidated tokens ($24, [buy](https://buy.polar.sh/polar_cl_tuchJBmHqDLg4PsMquZlguPtUhorHCrMk6YMU1HTdt4)) |
| **Commercial License** | CC BY-NC 4.0 | Full Commercial EULA (Unlimited Client/SaaS Projects) |

---

## 2. Generating the Master `.fig` File via Turnkey Plugin

The kit includes an automated master generator (`figma/code.js`) that creates all styles, variables, token foundations, component sets, and pre-assembled layouts directly on your Figma canvas in under two seconds.

### Step 1: Recommended Typography
Before running the generator, install the three primary open-source typefaces from Google Fonts (or allow the plugin's resilient font loader to fall back to `Inter` automatically):
* **Display & Body**: [Archivo](https://fonts.google.com/specimen/Archivo) (Bold, SemiBold, Medium, Regular)
* **Telemetry & Code**: [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono) (Bold, Medium, Regular)
* **Cyber HUD Display**: [Chakra Petch](https://fonts.google.com/specimen/Chakra+Petch) (Bold, SemiBold, Regular)

### Step 2: Open Figma Desktop
1. Launch the **Figma Desktop App** (macOS, Windows, or Linux).
2. Create a new blank design file named `RIS v2.8.0 — Master Studio Kit`.

### Step 3: Load Plugin Manifest
1. In the top-left menu, go to **Plugins** > **Development** > **Import plugin from manifest...**.
2. Navigate to your workspace directory:
   ```text
   /home/cristina/Scrivania/Relic Interface System/figma/manifest.json
   ```
3. Select `manifest.json`. The plugin `"RIS v2 — Relic Interface System UI Kit Builder"` is now registered.

### Step 4: Execute the Generator Script
1. Press `Ctrl+Alt+P` (Windows/Linux) or `Cmd+Option+P` (macOS) to run the plugin, or navigate to **Plugins** > **Development** > **RIS v2 — Relic Interface System UI Kit Builder**.
2. The script executes synchronously:
   * Registers **38+ Paint Styles** and color variables (Surfaces, Lines, Text, Accents, Brands, Skins).
   * Generates **Artboard 01 — Tokens & Foundations** (1600px wide).
   * Generates **Artboard 02 — Component Master Library** (1720px wide).
   * Generates **Artboard 03 — Pre-assembled Layouts** (2200px wide).
   * Generates **Artboard 04 — Tactical Micrographics & HUD Atoms** (2200px wide, 34 standalone vector graphics across 9 categories).
   * Smoothly scrolls and zooms to fit all four artboards.
3. Verify the completion toast: `⚡ RIS v2.8.0 Commercial Pro Studio Kit Generated Successfully!`.

### Step 5: Setup the Official Thumbnail Cover
1. Create a new page named `Cover`.
2. Drag and drop `figma/assets/cover-artboard.svg` (1920×1080) onto the canvas.
3. Right-click the imported frame > **Set as thumbnail**.

### Step 6: Export the Master `.fig` File
1. In the main Figma menu, navigate to **File** > **Save local copy...**.
2. Save the file as `RIS-v2.8.0-Studio-Pro.fig`. This is your commercial master distribution artifact.

---

## 3. Publishing the Figma Community Free Preview

The Free Preview file acts as your top-of-funnel lead generator on the Figma Community, showcasing the aesthetic depth and mathematical rigor of RIS while providing an upgrade path to Studio Pro.

### 3.1 Creating the Free Preview File
1. Make a duplicate of your generated file (`File` > `Duplicate`).
2. Rename to `RIS v2.8.0 — Tactical Cyber HUD (Free Community Preview)`.
3. Keep **Artboard 01 (Tokens & Foundations)**, **Artboard 02 (Curated Components)**, and **Artboard 04 (Tactical Micrographics & HUD Atoms — all 34, free)**.
4. On **Artboard 03**, insert an **Upgrade to Studio Pro** callout card linking to your Lemon Squeezy / Gumroad store, plus a second callout on Artboard 04 linking to the [Micrographics Vol. 1 checkout](https://buy.polar.sh/polar_cl_tuchJBmHqDLg4PsMquZlguPtUhorHCrMk6YMU1HTdt4) for the React/CSS engineered edition:
   * Showcase screenshots of the 1440px Desktop Dashboard and 390px Mobile Touch Shell.
   * Highlight the 4 Brand Matrix, 3 Case-Context Skins, and Tactical Cyber HUD system.

### 3.2 Community Listing Metadata
* **Listing Title**: `RIS v2.8.0 — Tactical Cyber HUD & Brutalist Design System`
* **Short Tagline**: `Precision forensic instrument UI kit: 45° chamfer vectors, dual-theme engine (WCAG 2.2 AA), and W3C DTCG design tokens.`
* **Category**: `Design systems` · `UI kits` · `Wireframes`
* **Tags**: `cyberpunk`, `hud`, `design-system`, `tokens`, `dark-mode`, `brutalist`, `telemetry`, `forensic`, `dashboard`, `mobile`, `micrographics`
* **Cover Thumbnail**: Use the 1920×1080 artwork generated in `figma/assets/cover-artboard.svg`.

### 3.3 Community Description Copy Template
```markdown
# Relic Interface System (RIS v2.8.0) // Free Community Edition

Precision forensic instrument UI kit & cybernetic brutalist design system for telemetry displays, security consoles, and high-density technical interfaces.

### ⚡ What’s Included in this Free Community File:
- **Zero Rounded Corners**: Hard-edged brutalist geometry with signature 45° angular chamfer cuts (6px, 10px, 16px).
- **Dual-Theme Foundations**: Dark Graphite void (#060708) and Cold Blue-Grey Paper (#e9edef) calibrated for zero eye strain.
- **WCAG 2.2 AA / AAA Certified**: Every ink accent and foreground color verified for high-contrast accessibility.
- **Foundations Specimen**: Complete typography scale (Archivo, JetBrains Mono, Chakra Petch) and 8-step spacing grid (4px–48px).
- **Interactive Controls**: Chamfered buttons (Primary, Default, Secondary, Cyber Neon), status chips, and tactical mechanical toggles.
- **Tokens Studio Ready**: Compatible with Tokens Studio for Figma and W3C DTCG token standards.
- **34 Micrographics HUD Atoms**: Full free vector library (reticles, dials, matrices, clusters, telemetry, calipers, constellations, stamps) — drag-and-drop ready.

---

### 🎯 Get Micrographics Vol. 1 (Engineered Edition):
Want the same 34 micrographics as type-safe React components with zero-reflow CSS animations and consolidated tokens?
👉 [Get Micrographics Vol. 1 — $24 launch](https://buy.polar.sh/polar_cl_tuchJBmHqDLg4PsMquZlguPtUhorHCrMk6YMU1HTdt4)

---

### 🚀 Upgrade to RIS v2.8.0 Studio Pro:
Looking for complete production frames and multi-brand theming?
Get the full commercial package on Polar.sh / Gumroad:
👉 [Get RIS Studio Pro](https://buy.polar.sh/polar_cl_gzshc6MZaGsQy6V3oqQ1U0uK3kIQ7mcGr0wf00JbLZn)

**Studio Pro Includes:**
- Turnkey 1440px Desktop Forensic Dashboard frame
- Turnkey 390px Mobile Touch Shell frame
- All 4 Brand Systems (Relic, BioHub, Omnikon, Neutral)
- 3 Case-Context Skins (Sealed Dossier, Field Collection, Night Archive) + Tactical Cyber HUD
- Full 7-variant × 4-state × 3-size Button Component Sets (60+ variants)
- Complete W3C DTCG `tokens.json` dictionary (12 sets)
- Production Tactical SVG Suite (Radar grids, targeting reticles, L-brackets)
- Turnkey `code.js` master Figma plugin generator script
- Commercial End-User License Agreement (EULA)
```

---

## 4. Polar.sh & Gumroad Commercial Packaging

### 4.1 Distribution ZIP Bundle Structure
Compress the following folder structure into `RIS-v2.8.0-Studio-Pro.zip`:

```text
RIS-v2.8.0-Studio-Pro/
├── RIS-v2.8.0-Studio-Pro.fig           # Master Figma file (4 artboards + components + cover)
├── tokens.json                         # Complete W3C DTCG & Tokens Studio tokens (12 sets)
├── community-preview-tokens.json       # Streamlined preview tokens
├── assets/                             # Tactical HUD vector SVGs
│   ├── micro/                          # 34 Production SVG Micrographics (Reticles, Dials, Matrices, Clusters)
│   ├── chamfer-btn.svg
│   ├── chamfer-panel-md.svg
│   ├── chamfer-panel-sm.svg
│   ├── hud-bracket-tl.svg
│   ├── hud-bracket-tr.svg
│   ├── hud-radar-grid.svg
│   └── hud-reticle.svg
├── cover-artboard.svg                  # 1920x1080 Store Cover artwork
├── FIGMA_STUDIO_GUIDE.md               # User manual & integration guide
├── README.md                           # System architecture & token guide
├── CHANGELOG.md                        # Version history & v2.8.0 updates
└── LICENSE.txt                         # Commercial End-User License Agreement
```

### 4.2 Recommended Pricing Tiers

| License Tier | Price | Target Audience | Rights & Seat Limits |
|---|---|---|---|
| **Indie / Freelance** | **$29** | Solo designers, indie developers, single users | 1 Seat · Unlimited personal & client projects |
| **Team / Agency** | **$79** | Studios, development agencies, startup teams | Up to 10 Seats · Unlimited commercial client work |
| **Enterprise Extended**| **$199**| Scale-ups, enterprise orgs, SaaS platforms | Unlimited Seats · Embedded commercial SaaS usage |

### 4.3 Polar.sh Store Setup
1. Log into your **Polar.sh Dashboard** > **Products**.
2. Click **New Product** > Select **One-time Purchase** (or File Download).
3. **Product Name**: `Relic Interface System (RIS v2.8.0) — Figma Studio Kit Pro`.
4. **Description**: Use the rich product overview highlighting the cybernetic brutalist aesthetic, WCAG 2.2 AA contrast compliance, and full auto layout components.
5. **Files**: Attach `RIS-v2.8.0-Studio-Pro.zip` for instant automated customer download upon purchase.
6. **Pricing**: Set `$39.00` (Launch Early-Bird) or `$49.00` (Standard).
7. **Media**: Upload `cover-artboard.svg` (rendered as 1920×1080 PNG).
8. **Automated Benefits**: Polar acts as Merchant of Record, automatically handling global VAT/sales tax compliance and providing instant file delivery.

### 4.4 Gumroad Store Setup
1. Log into **Gumroad** > **Products** > **New product**.
2. Select **Digital Product**.
3. Set base price to `$29`.
4. Under **Product Variations**, add:
   * `Team License` (+$50 → $79 total)
   * `Enterprise License` (+$170 → $199 total)
5. Upload `RIS-v2.8.0-Studio-Pro.zip` as the downloadable file.
6. Upload `cover-artboard.svg` (or exported PNG) as the product cover and thumbnail.

---

## 5. Commercial End-User License Agreement (`LICENSE.txt`)

Place the following legal text in `LICENSE.txt` within the root of the commercial ZIP bundle:

```text
RELIC INTERFACE SYSTEM (RIS v2.8.0) — COMMERCIAL END USER LICENSE AGREEMENT (EULA)
Copyright (c) 2026 Relic Interface System. All Rights Reserved.

This Commercial End User License Agreement ("Agreement") is a legal agreement between you 
(either an individual or a single entity, "Licensee") and Relic Interface System ("Licensor") 
for the digital assets accompanying this Agreement, including Figma files (.fig), design tokens 
(JSON), SVG vector graphics, scripts, and documentation (collectively, the "Product").

1. GRANT OF LICENSE
Subject to payment of the applicable license fee:
- INDIE LICENSE: Grants one (1) individual user the non-exclusive, non-transferable right 
  to use the Product to design and develop unlimited personal or commercial projects.
- TEAM LICENSE: Grants up to ten (10) individual users within Licensee's organization the 
  non-exclusive, non-transferable right to use the Product across unlimited commercial projects.
- ENTERPRISE LICENSE: Grants unlimited users within Licensee's organization the right to use, 
  modify, and embed derivative interface components within proprietary commercial software 
  applications, websites, and SaaS products.

2. PERMITTED USES
- Creating end products (websites, web applications, mobile applications, software dashboards, 
  video games, and broadcast graphics) for yourself or for clients.
- Modifying, customizing, and styling components to fit specific project requirements.
- Distributing compiled, binary, or rendered end products to end-users without royalty fees.

3. PROHIBITED USES
- You may NOT resell, sublicense, rent, lease, redistribute, or share the source Figma (.fig) 
  files, design tokens (JSON), or vector assets in source form.
- You may NOT publish or make the Product publicly accessible in any repository, public Figma 
  Community file, or web portal where third parties can extract the source assets.
- You may NOT create a competing UI kit, design system template, icon set, or design token 
  bundle based on or derived from the Product.

4. OWNERSHIP & INTELLECTUAL PROPERTY
The Product is licensed, not sold. Licensor retains all title, ownership rights, and intellectual 
property rights in and to the Product. All trademarks, brand references (Relic, BioHub, Omnikon), 
and visual iconography are proprietary to Licensor.

5. DISCLAIMER OF WARRANTIES & LIMITATION OF LIABILITY
THE PRODUCT IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING 
BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND 
NON-INFRINGEMENT. IN NO EVENT SHALL LICENSOR BE LIABLE FOR ANY CLAIM, DAMAGES, OR OTHER 
LIABILITY ARISING FROM, OUT OF, OR IN CONNECTION WITH THE PRODUCT OR THE USE OR OTHER DEALINGS.
```

---

## 6. Support, Maintenance & Updates

* **Customer Desk & Inquiries**: `support@yuzushi.party`
* **Community & Discussions**: [GitHub Discussions](https://github.com/yuzushi-dev/relic-interface-system/discussions)
* **Bug Reports & Token Issues**: [GitHub Issues](https://github.com/yuzushi-dev/relic-interface-system/issues)
* **Live Showcase & Documentation**: [GitHub Pages Specimen](https://yuzushi-dev.github.io/relic-interface-system/)
* **Commercial Storefront**: [Polar.sh Store](https://polar.sh/yuzushi-dev)
* **Release Cadence**:
  * **Patch Updates (v2.8.x)**: Free for all license holders. Includes bug fixes, contrast improvements, and Figma API sync adjustments.
  * **Minor Releases (v2.9.x)**: Free for all license holders. Adds new component variants and telemetry visualizations.
  * **Major Upgrades (v3.0.0)**: Free for Enterprise license holders; 50% upgrade discount for Indie and Team license holders.

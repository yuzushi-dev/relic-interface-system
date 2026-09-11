# Relic Interface System (RIS v2) — Figma UI Kit & Design Tokens

> **Tactical Cyber HUD // Precision Forensic Instrument UI Kit**  
> Complete W3C / Tokens Studio design tokens, turnkey Figma generation plugin, and tactical SVG assets.

---

## 1. Overview

The **Relic Interface System (RIS v2) Figma UI Kit** translates the forensic-grade, tactical cyberpunk HUD web and mobile design system into a turnkey, modular Figma workspace.

### Core Foundations:
* **Geometry**: Hard-edged system (`0px` corner radius). Signature elements feature **45° angular chamfer cuts** on top-right and bottom-left corners:
  * `6px` (`--ris-clip-sm`): Buttons, chips, inputs, switch thumbs.
  * `10px` (`--ris-clip`): Standard panels, cards, KPI blocks.
  * `16px` (`--ris-clip-lg`): Modals, hero displays, drawers.
* **Dual-Theme Engine**:
  * **Dark Mode (Default)**: Deep graphite surface stack (`#060708` void to `#232c33` elevated surface-4) with high-contrast text (`#e6ebe8` fg1).
  * **Light Mode**: Cold blue-grey paper (`#d9dfe3` void, `#e9edef` bg, `#ffffff` surface-3) with calibrated ink accents (all $\ge 4.5:1$ WCAG AA safe).
* **Brand Taxonomy**:
  * **Relic** (Default): Yellow CTA (`#e6a23c`) / Cyan telemetry (`#6fb3c9`).
  * **BioHub**: Cyan data (`#6fb3c9`) / Green biofeedback (`#5fae84`).
  * **Omnikon**: Red biometric auth (`#da6171`) / Yellow CTA (`#e6a23c`).
  * **Neutral**: Violet archival (`#938ac8`) / Cyan secondary (`#6fb3c9`).
* **Case-Context Skins**:
  * **Sealed Dossier**: Evidentiary red (`#cf5e6b`) on cold graphite (`#120e12`).
  * **Field Collection**: Sodium amber (`#d99a4a`) on warm anthracite (`#14120e`).
  * **Night Archive**: Deep orchid (`#be7ecf`) on purple graphite (`#130f1e`).
  * **Tactical Cyber HUD**: Structural red lines (`#6e2d38`), crimson near-black surfaces (`#070406`), and saturated neon accents (`#ff4d62`, `#3df0ff`, `#34f08c`, `#ffd83a`).

---

## 2. Directory Structure

```text
figma/
├── tokens.json            # Complete W3C DTCG & Tokens Studio multi-theme tokens
├── manifest.json          # Figma Plugin manifest
├── code.js                # Turnkey Figma Plugin script (auto-builds canvas specimen)
├── assets/                # Production tactical HUD vector assets (SVGs)
│   ├── chamfer-panel-sm.svg   # 360x200 panel with 10px 45° cuts and HUD calibration ticks
│   ├── chamfer-panel-md.svg   # 540x320 panel with 16px 45° cuts, dot matrix, and brackets
│   ├── chamfer-btn.svg        # 160x36 CTA button with 6px 45° cuts and chevron
│   ├── hud-bracket-tl.svg     # 24x24 Top-left tactical corner L-bracket
│   ├── hud-bracket-tr.svg     # 24x24 Top-right tactical corner L-bracket
│   ├── hud-reticle.svg        # 80x80 Precision targeting reticle & azimuth coordinates
│   ├── hud-radar-grid.svg     # 240x240 Tactical circular radar grid with sweep sector
│   └── micro/                 # 34 Micrographics vector atoms (Relic Micrographics Vol.1 flywheel — see §5)
└── README.md              # Complete integration & publishing documentation
```

---

## 3. Workflow A: Importing `tokens.json` via Tokens Studio / Figma Variables

`tokens.json` adheres strictly to the **W3C Design Token Community Group (DTCG)** format and **Tokens Studio for Figma** multi-set specification.

### Method 1: Tokens Studio for Figma (Recommended)
1. In Figma, open or install the **Tokens Studio for Figma** plugin (Community > Plugins > Tokens Studio for Figma).
2. Open the plugin panel and navigate to **Settings** > **Load from file/folder** or click **Import** > **Tokens file**.
3. Select `figma/tokens.json`.
4. The plugin will immediately recognize all configured token sets:
   * `global`: Typography (`Archivo`, `JetBrains Mono`, `Chakra Petch`), spacing (`4px` grid), shape chamfers (`6px`, `10px`, `16px`), and theme-independent accent fills.
   * `theme-dark` & `theme-light`: Contextual surfaces, borders, text, and ink accents.
   * `brand-relic`, `brand-biohub`, `brand-omnikon`, `brand-neutral`: Accent pairs.
   * `case-sealed`, `case-field`, `case-archive`, `skin-cyber`: Full contextual skins.
5. In the bottom bar of Tokens Studio, switch between pre-configured themes in `$themes`:
   * `Dark / Relic (Default)`
   * `Light / Relic`
   * `Dark / BioHub`
   * `Dark / Omnikon`
   * `Dark / Neutral`
   * `Skin / Sealed Dossier`
   * `Skin / Field Collection`
   * `Skin / Night Archive`
   * `Skin / Tactical Cyber HUD`
6. Click **Styles & Variables** > **Export to Figma Variables** to synchronize native Figma Variables.

### Method 2: Native Figma Variables Import
If using a native Figma Variables JSON sync tool (e.g. *Variables Import/Export* or *Figma Token Sync*):
* Select `tokens.json`.
* Color collections (`Surfaces`, `Lines`, `Text`, `Accents`) will populate with Dark and Light mode modes side-by-side.

---

## 4. Workflow B: Turnkey Figma Plugin (`code.js`)

To instantly create the complete visual specimen, auto layout components, and color styles on your Figma canvas:

### Step 1: Open Figma Desktop App
Open any blank document or your target design system file in Figma.

### Step 2: Import the Manifest
1. Navigate to the top menu: **Plugins** > **Development** > **Import plugin from manifest...**.
2. Select the file `figma/manifest.json` from the repository root.
3. The plugin `"RIS v2 — Relic Interface System UI Kit Builder"` will appear in your Development plugins list.

### Step 3: Run the Plugin
1. Click **Plugins** > **Development** > **RIS v2 — Relic Interface System UI Kit Builder** (or press `Ctrl+Alt+P` / `Cmd+Option+P` to run last plugin).
2. The script will execute automatically in under a second:
   * **Font Loading**: Automatically attempts to load `Archivo`, `JetBrains Mono`, and `Chakra Petch`. If not locally installed in your Figma desktop font catalog, it safely falls back to `Inter` without breaking.
   * **Paint Styles Registration**: Populates your local Figma styles library with grouped paint styles (`RIS / Dark / Surface / ...`, `RIS / Dark / Accent / ...`, `RIS / Light / ...`, `RIS / Brand / ...`, `RIS / Case / ...`, `RIS / Cyber / ...`).
   * **Artboard 01 — Color Architecture & Contrast**: Builds a 1440px wide side-by-side Dark and Light palette canvas with dynamic WCAG 2.2 contrast ratio badges (`AAA PASS`, `AA PASS`). Includes brand matrix and case-context skins.
   * **Artboard 02 — Tactical Components**: Builds an Auto Layout kit featuring:
     1. **Tactical Chamfered Buttons**: Primary (Yellow CTA), Default (Graphite), Secondary (Cyan outline), Danger (Red), Outline, Invert, and Cyber Neon with 45° cut vector paths. Sizes: SM (28px), MD (36px), LG (46px).
     2. **Tactical Chamfered Panels**: Active Telemetry panel with corner L-brackets and `LIVE [●]` chip; Case-Sealed dossier panel with classification tags.
     3. **Tactical Mechanical Switches**: Standby (OFF) and Armed (ON) mechanical slide toggles with 3px chamfered thumb vectors and amber/cyan glow feedback.
     4. **Tactical Accordions**: Closed and active expanded states with inset left accent indicators and monospace parameter diagnostics.
     5. **Mobile Bottom Sheet**: <768px tactical modal (390px mobile frame) with top 14px 45° chamfer cuts, tactile drag handle, header chip, and dual CTA buttons.
     6. **Telemetry KPI Stat Cards**: Heart rate (74 BPM), Neural bandwidth (94.8%), Core temperature (38.2°C), and Threat index (DEFCON 2) with 10px chamfer cuts.
   * **Viewport Adjustment**: Automatically scrolls and zooms directly to the generated artboards.

---

## 5. Tactical SVG Assets (`figma/assets/`)

The vector assets in `figma/assets/` can be dragged directly onto your Figma canvas or into any web/mobile project:

| Asset | Size | Geometry & Role |
|---|---|---|
| `chamfer-panel-sm.svg` | 360×200 | Small panel with 10px 45° cuts (top-right & bottom-left), header divider, and right-border calibration ticks. |
| `chamfer-panel-md.svg` | 540×320 | Medium telemetry container with 16px 45° cuts, dot matrix pattern, corner brackets, and multi-axis rulers. |
| `chamfer-btn.svg` | 160×36 | Primary CTA button with 6px 45° cuts, amber fill, corner ticks, and trailing chevron. |
| `hud-bracket-tl.svg` | 24×24 | Top-left tactical corner L-bracket with coordinate accent ticks. |
| `hud-bracket-tr.svg` | 24×24 | Top-right tactical corner L-bracket with coordinate accent ticks. |
| `hud-reticle.svg` | 80×80 | Precision HUD targeting reticle with concentric arcs, center deadband crosshairs, and azimuth text. |
| `hud-radar-grid.svg` | 240×240 | Tactical azimuth radar display with range rings, 60° phosphor sweep sector, and cardinal indicators. |

### 5.1 Micrographics Vol. 1 (`figma/assets/micro/`)

34 standalone HUD micrographics across 9 categories — free flywheel content, dragged straight onto the Figma canvas or the Community Preview page. The engineered version (React components, zero-reflow CSS animations, consolidated tokens) is the [**Micrographics Vol. 1**](https://buy.polar.sh/polar_cl_tuchJBmHqDLg4PsMquZlguPtUhorHCrMk6YMU1HTdt4) Polar SKU ($24 launch / $34 standard).

| Category | Count | Assets |
|---|---|---|
| `calipers/` | 3 | `bracket-caliper`, `leader-45`, `ruler-100` |
| `clusters/` | 8 | `frequency-diag`, `node-health`, `orbital-relay`, `packet-analyzer`, `power-module`, `sensor-lock`, `tactical-survey`, `terminal-header` |
| `constellations/` | 3 | `network-3node`, `orbital-relay`, `signal-tree` |
| `dials/` | 4 | `azimuth-90`, `compass`, `frequency`, `power-gauge` |
| `equalizers/` | 3 | `audio-signal`, `bandwidth`, `packet-stream` |
| `matrices/` | 4 | `binary-status`, `cross-grid`, `led-4x4`, `status-3x3` |
| `reticles/` | 3 | `corner-bracket`, `optic-grid`, `target-lock` |
| `stamps/` | 3 | `barcode-mini`, `hash-stamp`, `tactical-seal` |
| `telemetry/` | 3 | `epoch-diag`, `node-status`, `system-reset` |

---

## 6. How to Publish to Figma Community (Free or Paid)

### Step 1: Polish the Community Cover Artboard
1. Create an artboard named `Cover` sized at **1920 × 1080 px** (or 1600 × 960 px, 16:9 ratio).
2. Right-click the frame > **Set as thumbnail**.
3. Use the Dark Void background (`#060708`), add the `hud-radar-grid.svg` or `hud-reticle.svg` as watermark artwork, display the `RELIC INTERFACE SYSTEM v2` title in 44px Archivo Bold, and showcase floating 45° chamfered buttons and KPI stat cards.

### Step 2: Organize Component Sets & Variants
1. Select the button variants generated on Artboard 02.
2. In the right panel, click **Create component set**.
3. Add variant properties:
   * `Variant`: `Primary` | `Default` | `Secondary` | `Danger` | `Outline` | `Invert` | `Cyber`
   * `Size`: `SM` (28px) | `MD` (36px) | `LG` (46px)
   * `State`: `Default` | `Hover` | `Active` | `Disabled`
4. Repeat for the Tactical Mechanical Switch (`State`: `Off` | `On`), Accordion (`State`: `Collapsed` | `Expanded`), and KPI Cards.

### Step 3: Publishing Steps
1. Click the file dropdown menu in the top-left toolbar > **Publish to Community...**.
2. **File Name**: `RIS v2 — Tactical Cyber HUD & Design System UI Kit`.
3. **Description**:
   ```markdown
   Relic Interface System (RIS v2) is a professional, forensic-grade Tactical Cyber HUD design system and UI kit.
   
   Features:
   - Hard-edged geometry with 45° chamfered cuts (6px, 10px, 16px).
   - Side-by-side Dark (graphite) & Light (cold paper) modes.
   - 4 Brand palettes: Relic, BioHub, Omnikon, Neutral.
   - 3 Case-Context skins: Sealed Dossier, Field Collection, Night Archive.
   - Tactical Cyber HUD mode with structural crimson lines and neon glows.
   - 100% WCAG 2.2 AA contrast verified.
   - Fully compatible with Tokens Studio for Figma & native Figma Variables.
   ```
4. **Tags**: `cyberpunk`, `hud`, `tactical`, `design-tokens`, `tokens-studio`, `dark-mode`, `ui-kit`, `scifi`, `dashboard`.
5. **Creator Profile**: Select your Figma Profile or Organization.

### Step 4: Monetization (Paid or Free Options)
* **Free Community Resource**:
  * Under **Monetization**, select **Free**. Anyone on Figma Community can duplicate the file to their drafts.
  * Great for community exposure, developer adoption, and GitHub portfolio recognition.
* **Paid / Commercial UI Kit**:
  * **Option A (Figma Creator Fund / Paid Community Files)**: If your account is enrolled in Figma's Creator Monetization Program, select **Paid**, set your price ($19 - $49 USD recommended for specialized developer UI kits), and provide Stripe payout details.
  * **Option B (External Polar.sh / Gumroad Bundle)**: Publish a free "Lite / Specimen" file on Figma Community with a link in the description to your Polar.sh or Gumroad storefront for the complete commercial bundle (including code implementations in CSS, Compose, and Web components).

---

## 7. Verification & Compliance Checklist

- [x] **Strict RIS v2 Naming**: All brands (`relic`, `biohub`, `omnikon`, `neutral`) and case contexts (`sealed`, `field`, `archive`) match codebase tokens.
- [x] **Zero Rounded Corners**: Hard-edged rule (`radius: 0px`) respected; all rounding is replaced with 45° chamfers.
- [x] **WCAG 2.2 AA**: All text, ink accents, and contextual states meet or exceed 4.5:1 on their target backgrounds.
- [x] **Pure Local Workspace**: All created files reside strictly within `figma/`.

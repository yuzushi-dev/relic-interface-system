# Relic Eyewear Micro-HUD Suite Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and ship the Relic Eyewear Micro-HUD Suite: 5 high-utility smart glasses micro-UI atoms (`MicroNavGuidance`, `MicroLiveCaptions`, `MicroVitalTelemetry`, `MicroGlanceNotice`, `MicroSpatialInspection`), 1 turnkey composite eyewear container (`SmartGlassesHUD`), an interactive pass-through simulator lab (`docs/eyewear.html`) with real-world Unsplash daylight/night/industrial imagery, and an automated SVG export pipeline for Figma and waveguide firmware.

**Architecture:** Extend `@relic-ui/react` with dedicated zero-occlusion eyewear primitives in `react/src/components/micro/`. All components render standalone SVG with 1px stroke, 45° tactical chamfers, and emissive alpha (`background: transparent`). The turnkey `SmartGlassesHUD` positions information at the 4 peripheral corners and central boresight across 4 operational modes (`ambient`, `commute`, `meeting`, `field-ops`). An automated script exports production SVGs, and `docs/eyewear.html` provides live interactive testing against real daylight/night/industrial pass-through photos.

**Tech Stack:** React 18+, TypeScript, SVG, Zero-Reflow CSS, Node.js build scripts, W3C Design Tokens.

## Global Constraints

- **Emissive Alpha Invariant**: True optical transparency: black (`#000000`) is never filled; no solid surface backgrounds.
- **1px Crisp Strokes**: All vector strokes use `vector-effect="non-scaling-stroke"` and `shape-rendering="geometricPrecision"`.
- **45° Chamfer Geometry**: Angles and corner cuts must be strictly 45° polygons or chamfer lines. Zero border-radius curves.
- **The 4 Official Brands**: `relic` (amber `#e6a23c` / cyan `#6fb3c9`), `biohub` (phosphor green `#2fe48a` / cyan `#6fb3c9`), `omnikon` (red `#ff2d3c` / yellow `#e6a23c`), `neutral` (cyan `#6fb3c9` / violet `#9d7cd8`).
- **Trademark Rule**: Never introduce third-party trademarks or proprietary lore (`vivokey`, Cyberpunk 2077, Kiroshi, Arasaka, etc.).
- **Zero-Reflow Motion**: Animations strictly touch `transform`, `opacity`, or `stroke-dashoffset`. Never animate `width`, `height`, or `margin`. Honor `@media (prefers-reduced-motion: reduce)`.
- **CLI Protocol**: Always prefix shell commands with `rtk` (never use `rtk find`).

---

### Task 1: Eyewear Types & Optical CSS Utilities

**Files:**
- Modify: `react/src/components/micro/types.ts`
- Modify: `css/ris-micro.css`
- Modify: `docs/css/ris-micro.css`

**Interfaces:**
- Consumes: Existing `MicroBrand`, `MicroSize`, `MicroBaseProps` in `react/src/components/micro/types.ts`
- Produces: `MicroManeuver`, `MicroNavGuidanceProps`, `MicroLiveCaptionsProps`, `MicroVitalTelemetryProps`, `MicroGlanceNoticeProps`, `MicroSpatialInspectionProps`, `SmartGlassesHUDProps`, `EyewearOpticalProfile`

- [ ] **Step 1: Write eyewear type definitions in `react/src/components/micro/types.ts`**

Add the following types to `react/src/components/micro/types.ts`:
```typescript
export type MicroManeuver =
  | 'straight'
  | 'slight-right'
  | 'right'
  | 'sharp-right'
  | 'slight-left'
  | 'left'
  | 'sharp-left'
  | 'u-turn';

export type EyewearOpticalProfile =
  | 'phosphor-green'
  | 'tactical-amber'
  | 'cyber-cyan'
  | 'alert-red';

export type EyewearHudMode =
  | 'ambient'
  | 'commute'
  | 'meeting'
  | 'field-ops';

export interface MicroNavGuidanceProps extends MicroBaseProps {
  maneuver?: MicroManeuver;
  distanceMeters?: number;
  streetName?: string;
  eta?: string;
}

export interface MicroLiveCaptionsProps extends MicroBaseProps {
  line1?: string;
  line2?: string;
  speaker?: string;
  listening?: boolean;
}

export interface MicroVitalTelemetryProps extends MicroBaseProps {
  heartRate?: number;
  hrZone?: 1 | 2 | 3 | 4 | 5;
  altitudeMeters?: number;
  batteryPercent?: number;
  batteryRuntimeHours?: number;
}

export interface MicroGlanceNoticeProps extends MicroBaseProps {
  category?: 'CALENDAR' | 'COLLISION' | 'SYSTEM' | 'SECURITY';
  title?: string;
  subtitle?: string;
  severity?: 'info' | 'warn' | 'critical';
  dismissProgress?: number;
}

export interface MicroSpatialInspectionProps extends MicroBaseProps {
  distanceMeters?: number;
  targetLabel?: string;
  status?: 'scanning' | 'locked' | 'standby';
  specCode?: string;
  bracketWidth?: number;
  bracketHeight?: number;
}

export interface SmartGlassesHUDProps extends MicroBaseProps {
  mode?: EyewearHudMode;
  opticalProfile?: EyewearOpticalProfile;
  navData?: Partial<MicroNavGuidanceProps>;
  captionData?: Partial<MicroLiveCaptionsProps>;
  vitalData?: Partial<MicroVitalTelemetryProps>;
  noticeData?: Partial<MicroGlanceNoticeProps>;
  inspectionData?: Partial<MicroSpatialInspectionProps>;
}
```

- [ ] **Step 2: Add eyewear optical CSS classes and keyframes to `css/ris-micro.css` and `docs/css/ris-micro.css`**

Add CSS helper classes:
```css
/* Eyewear HUD Optical Classes */
.ris-eyewear-glass {
  background: transparent !important;
  color: var(--ris-accent);
}

.ris-eyewear-profile-phosphor {
  --ris-eyewear-accent: #2fe48a;
  --ris-eyewear-dim: rgba(47, 228, 138, 0.25);
  color: #2fe48a;
}

.ris-eyewear-profile-amber {
  --ris-eyewear-accent: #e6a23c;
  --ris-eyewear-dim: rgba(230, 162, 60, 0.25);
  color: #e6a23c;
}

.ris-eyewear-profile-cyan {
  --ris-eyewear-accent: #6fb3c9;
  --ris-eyewear-dim: rgba(111, 179, 201, 0.25);
  color: #6fb3c9;
}

.ris-eyewear-profile-alert {
  --ris-eyewear-accent: #ff2d3c;
  --ris-eyewear-dim: rgba(255, 45, 60, 0.25);
  color: #ff2d3c;
}

@keyframes ris-audio-listen {
  0%, 100% { transform: scale(1); opacity: 0.6; }
  50% { transform: scale(1.35); opacity: 1; }
}

.ris-micro-listen {
  transform-origin: center;
  animation: ris-audio-listen 1.2s ease-in-out infinite;
}

@keyframes ris-decay-line {
  from { stroke-dashoffset: 0; }
  to { stroke-dashoffset: 100; }
}
```

- [ ] **Step 3: Verify TypeScript compilation**

Run: `cd react && rtk npm run build`  
Expected: PASS (0 errors)

- [ ] **Step 4: Commit**

```bash
rtk git add react/src/components/micro/types.ts css/ris-micro.css docs/css/ris-micro.css
rtk git commit -m "feat(eyewear): add shared eyewear types and optical waveguide CSS classes"
```

---

### Task 2: `MicroNavGuidance` Component (Wayfinding & Lane Guidance)

**Files:**
- Create: `react/src/components/micro/MicroNavGuidance.tsx`
- Modify: `react/src/components/micro/index.ts`
- Modify: `react/src/index.ts`

**Interfaces:**
- Consumes: `MicroNavGuidanceProps`, `resolveMicroColor` from `./types`
- Produces: `<MicroNavGuidance />` React component

- [ ] **Step 1: Implement `react/src/components/micro/MicroNavGuidance.tsx`**

Features:
- 45° directional maneuver vector arrows for: `'straight'`, `'slight-right'`, `'right'`, `'sharp-right'`, `'slight-left'`, `'left'`, `'sharp-left'`, `'u-turn'`.
- Dynamic distance countdown rendering: e.g. `< 1000m` -> `in 45m`, `>= 1000m` -> `in 1.2km`.
- Top-right peripheral layout: arrow on left (24×24px), distance in bold 14px monospaced typography, street/waypoint name in 9.5px tracked uppercase, ETA chip `[ETA 16:40]`.
- Non-occluding transparent SVG with crisp 1px borders and 45° chamfered boundary tags.
- Role `role="img"` and dynamic `aria-label`.

- [ ] **Step 2: Export in `react/src/components/micro/index.ts` and `react/src/index.ts`**

Export:
```typescript
export { MicroNavGuidance } from './MicroNavGuidance';
export type { MicroNavGuidanceProps, MicroManeuver } from './types';
```

- [ ] **Step 3: Verify TypeScript compilation**

Run: `cd react && rtk npm run build`  
Expected: PASS

- [ ] **Step 4: Commit**

```bash
rtk git add react/src/components/micro/MicroNavGuidance.tsx react/src/components/micro/index.ts react/src/index.ts
rtk git commit -m "feat(eyewear): add MicroNavGuidance component for optical wayfinding"
```

---

### Task 3: `MicroLiveCaptions` Component (Live Speech-to-Text & Teleprompter)

**Files:**
- Create: `react/src/components/micro/MicroLiveCaptions.tsx`
- Modify: `react/src/components/micro/index.ts`
- Modify: `react/src/index.ts`

**Interfaces:**
- Consumes: `MicroLiveCaptionsProps`, `resolveMicroColor` from `./types`
- Produces: `<MicroLiveCaptions />` React component

- [ ] **Step 1: Implement `react/src/components/micro/MicroLiveCaptions.tsx`**

Features:
- Strictly bounded within 15° foveal comfort arc: 2 lines of text, maximum 38 characters per line.
- Real-time listening indicator: pulsating audio dot with `.ris-micro-listen` animation.
- Mode/Language badge: e.g. `[TRANSLATION EN→IT]` or `[SPEECH RECOG]`.
- Bottom-center / bottom-left non-occluding placement.
- Crisp 1px chamfered bracket marks flanking the caption area to separate text from background imagery without solid fills.

- [ ] **Step 2: Export in `react/src/components/micro/index.ts` and `react/src/index.ts`**

- [ ] **Step 3: Verify TypeScript compilation**

Run: `cd react && rtk npm run build`  
Expected: PASS

- [ ] **Step 4: Commit**

```bash
rtk git add react/src/components/micro/MicroLiveCaptions.tsx react/src/components/micro/index.ts react/src/index.ts
rtk git commit -m "feat(eyewear): add MicroLiveCaptions component for live transcription and teleprompter"
```

---

### Task 4: `MicroVitalTelemetry` Component (Biometrics & Environmental Monitoring)

**Files:**
- Create: `react/src/components/micro/MicroVitalTelemetry.tsx`
- Modify: `react/src/components/micro/index.ts`
- Modify: `react/src/index.ts`

**Interfaces:**
- Consumes: `MicroVitalTelemetryProps`, `resolveMicroColor` from `./types`
- Produces: `<MicroVitalTelemetry />` React component

- [ ] **Step 1: Implement `react/src/components/micro/MicroVitalTelemetry.tsx`**

Features:
- Real-time heart rate with zone tag: e.g. `142 BPM [Z3]`.
- Ambient barometer / altitude reading: e.g. `420m ALT`.
- Battery status with real runtime estimation: `BAT 68% // ~3.4h` + 4-segment 1px quantized battery meter.
- Compact peripheral layout for top-left temple display (`viewBox="0 0 160 40"`).
- Zero solid fills: 1px wireframe delimiters only.

- [ ] **Step 2: Export in `react/src/components/micro/index.ts` and `react/src/index.ts`**

- [ ] **Step 3: Verify TypeScript compilation**

Run: `cd react && rtk npm run build`  
Expected: PASS

- [ ] **Step 4: Commit**

```bash
rtk git add react/src/components/micro/MicroVitalTelemetry.tsx react/src/components/micro/index.ts react/src/index.ts
rtk git commit -m "feat(eyewear): add MicroVitalTelemetry component for biometrics and environmental sensors"
```

---

### Task 5: `MicroGlanceNotice` & `MicroSpatialInspection` Components

**Files:**
- Create: `react/src/components/micro/MicroGlanceNotice.tsx`
- Create: `react/src/components/micro/MicroSpatialInspection.tsx`
- Modify: `react/src/components/micro/index.ts`
- Modify: `react/src/index.ts`

**Interfaces:**
- Consumes: `MicroGlanceNoticeProps`, `MicroSpatialInspectionProps`, `resolveMicroColor` from `./types`
- Produces: `<MicroGlanceNotice />` and `<MicroSpatialInspection />` React components

- [ ] **Step 1: Implement `react/src/components/micro/MicroGlanceNotice.tsx`**

Features:
- Ultra-slim 22px top banner with 45° chamfered edge.
- Category tag (`[CALENDAR]`, `[COLLISION]`, `[SYSTEM]`, `[SECURITY]`).
- Auto-decay countdown progress bar on the bottom border (animating `stroke-dashoffset`).
- Severity color resolver (`info` -> brand primary, `warn` -> amber, `critical` -> red `#ff2d3c`).

- [ ] **Step 2: Implement `react/src/components/micro/MicroSpatialInspection.tsx`**

Features:
- Central boresight targeting frame with **100% hollow/transparent center** (zero occlusion of real-world equipment/machine).
- 4 hollow 45° corner brackets with customizable width and height.
- Real-time LiDAR/ToF distance telemetry tag: e.g. `DST: 1.4m`.
- Component inspection status chip: e.g. `VALVE_ACTUATOR_B2 · [OK]`.
- Vertical 1px graduated range ruler indicator on the right side.

- [ ] **Step 3: Export in `react/src/components/micro/index.ts` and `react/src/index.ts`**

- [ ] **Step 4: Verify TypeScript compilation**

Run: `cd react && rtk npm run build`  
Expected: PASS

- [ ] **Step 5: Commit**

```bash
rtk git add react/src/components/micro/MicroGlanceNotice.tsx react/src/components/micro/MicroSpatialInspection.tsx react/src/components/micro/index.ts react/src/index.ts
rtk git commit -m "feat(eyewear): add MicroGlanceNotice and MicroSpatialInspection components"
```

---

### Task 6: `SmartGlassesHUD` Composite Turnkey Container

**Files:**
- Create: `react/src/components/micro/SmartGlassesHUD.tsx`
- Modify: `react/src/components/micro/index.ts`
- Modify: `react/src/index.ts`

**Interfaces:**
- Consumes: All 5 eyewear atoms, `SmartGlassesHUDProps`, `EyewearHudMode`, `EyewearOpticalProfile`
- Produces: `<SmartGlassesHUD />` React component

- [ ] **Step 1: Implement `react/src/components/micro/SmartGlassesHUD.tsx`**

Features:
- Renders responsive 16:9 transparent SVG overlay (`viewBox="0 0 640 360"` or scalable percentages).
- 4 Operational Modes:
  1. `'ambient'`: Minimalist peripheral time & battery runtime in top-left; center and all other corners 98% empty.
  2. `'commute'`: Top-right `MicroNavGuidance` + top-center compass heading tape (`MicroAzimuthTape`).
  3. `'meeting'`: Bottom-center `MicroLiveCaptions` + top-center `MicroGlanceNotice`.
  4. `'field-ops'`: Center `MicroSpatialInspection` boresight + top-left `MicroVitalTelemetry`.
- Optical Profile bindings: Phosphor Green (`#2fe48a`), Tactical Amber (`#e6a23c`), Cyber Cyan (`#6fb3c9`), Alert Red (`#ff2d3c`).
- Fully accessible with `role="region"` and `aria-label="Smart Glasses Heads Up Display"`.

- [ ] **Step 2: Export in `react/src/components/micro/index.ts` and `react/src/index.ts`**

- [ ] **Step 3: Verify TypeScript compilation**

Run: `cd react && rtk npm run build`  
Expected: PASS

- [ ] **Step 4: Commit**

```bash
rtk git add react/src/components/micro/SmartGlassesHUD.tsx react/src/components/micro/index.ts react/src/index.ts
rtk git commit -m "feat(eyewear): add SmartGlassesHUD turnkey composite container"
```

---

### Task 7: Vector SVG Pipeline & Figma Integration

**Files:**
- Create: `scripts/export-eyewear-svg.js`
- Create: `svg/eyewear/`
- Create: `figma/assets/eyewear/`
- Modify: `release_bundles/relic-pro/figma/code.js`

**Interfaces:**
- Consumes: Compiled React components from `react/dist/index.js`
- Produces: 9 standalone SVG files in `svg/eyewear/` and native Artboard 05 in Figma master script

- [ ] **Step 1: Create `scripts/export-eyewear-svg.js`**

Script behavior:
- Renders standalone W3C valid SVGs for:
  - `svg/eyewear/nav-guidance.svg`
  - `svg/eyewear/live-captions.svg`
  - `svg/eyewear/vital-telemetry.svg`
  - `svg/eyewear/glance-notice.svg`
  - `svg/eyewear/spatial-inspection.svg`
  - `svg/eyewear/hud-viewport-ambient.svg`
  - `svg/eyewear/hud-viewport-commute.svg`
  - `svg/eyewear/hud-viewport-meeting.svg`
  - `svg/eyewear/hud-viewport-field-ops.svg`
- Copies all SVGs to `figma/assets/eyewear/` and `release_bundles/relic-pro/figma/assets/eyewear/`.

- [ ] **Step 2: Run export script**

Run: `rtk node scripts/export-eyewear-svg.js`  
Expected: Output of 9 standalone SVGs verified via `ls svg/eyewear/`.

- [ ] **Step 3: Update `release_bundles/relic-pro/figma/code.js` with Artboard 05**

Add Artboard 05 (`[Artboard 05] — Smart Glasses & Waveguide Micro-HUDs`) generating the eyewear cards and HUD viewports directly on Figma canvas.

- [ ] **Step 4: Verify code.js syntax**

Run: `rtk node --check release_bundles/relic-pro/figma/code.js`  
Expected: PASS (0 errors)

- [ ] **Step 5: Commit**

```bash
rtk git add scripts/export-eyewear-svg.js svg/eyewear/ figma/assets/eyewear/
rtk git commit -m "feat(svg): add eyewear vector export pipeline and assets"
```

---

### Task 8: Interactive Eyewear Simulator Laboratory (`docs/eyewear.html`)

**Files:**
- Create: `scripts/build-eyewear-lab.js`
- Create: `docs/eyewear.html`
- Modify: `docs/index.html` (add nav link to Eyewear HUD)
- Modify: `docs/micro-ui.html` (add nav link to Eyewear HUD)
- Modify: `docs/motion-lab.html` (add nav link to Eyewear HUD)

**Interfaces:**
- Consumes: RIS CSS tokens, `ris.css`, `ris-fx.css`, `ris-skin-cyber.css`, `ris-micro.css`, exported eyewear SVGs, and real Unsplash photos
- Produces: Production standalone `docs/eyewear.html`

- [ ] **Step 1: Implement `scripts/build-eyewear-lab.js`**

Features of `docs/eyewear.html`:
1. **Pass-Through Optical Lens Simulator**:
   - 16:9 binocular/monocular eyewear bezel overlay.
   - Real-World Background Toggle:
     - **Daylight Sunny Street**: `https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1600&q=80`
     - **Night Urban Traffic**: `https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1600&q=80`
     - **Industrial Inspection**: `https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1600&q=80`
     - **Tactical Dark Void**: `#060708`
   - Mode Toggle: `[Ambient]`, `[Commute]`, `[Meeting]`, `[Field Ops]`.
   - Waveguide Profile Toggle: Phosphor Green (`#2fe48a`), Tactical Amber (`#e6a23c`), Cyber Cyan (`#6fb3c9`), Alert Red (`#ff2d3c`).
   - Live Interactive Scrubbers:
     - Turn maneuver distance slider (`0m` – `250m`).
     - Live transcription text typer & selector ("Translation EN→IT", "Meeting Teleprompter", "Safety Checklist").
     - LiDAR distance slider (`0.4m` – `15.0m`).
2. **Atomic Eyewear Cards**:
   - Individual specimen cards for each of the 5 atoms.
   - Click-to-copy `[Copy SVG]` and `[Copy JSX]` buttons.
   - Tactical HUD Sonner toast notifications on copy.
3. **Cross-Navigation**:
   - Consistent RIS header linking to `index.html` (Specimen), `micro-ui.html` (Micrographics), `eyewear.html` (Eyewear HUD), `motion-lab.html` (Motion Lab), `mobile.html` (Mobile).

- [ ] **Step 2: Run build script to generate `docs/eyewear.html`**

Run: `rtk node scripts/build-eyewear-lab.js`  
Expected: `docs/eyewear.html` created successfully.

- [ ] **Step 3: Update navigation bars across existing documentation**

Add Eyewear link (`<a href="eyewear.html" class="ris-btn ris-btn--sm ris-btn--outline">Eyewear HUD</a>`) in `docs/index.html`, `docs/micro-ui.html`, and `docs/motion-lab.html`.

- [ ] **Step 4: Verify in browser / headless check**

Check that `docs/eyewear.html` loads cleanly, has valid HTML, and passes link checks.

- [ ] **Step 5: Commit**

```bash
rtk git add scripts/build-eyewear-lab.js docs/eyewear.html docs/index.html docs/micro-ui.html docs/motion-lab.html
rtk git commit -m "feat(docs): add interactive Eyewear HUD Simulator laboratory"
```

---

### Task 9: Whole-Suite Verification, Packaging & Commercial Sync

**Files:**
- Modify: `README.md`
- Package: `release_bundles/RIS-v2.8.0-Studio-Pro.zip`
- Package: `release_bundles/RIS-v2.8.0-Pro-All-Access.zip`

- [ ] **Step 1: Run complete verification suite**

Run:
```bash
cd react && rtk npm run build
rtk git status
```
Expected: Clean build, zero TypeScript errors.

- [ ] **Step 2: Update README with Eyewear HUD section**

Document the new Eyewear Micro-HUD components and link to the live simulator.

- [ ] **Step 3: Repackage commercial bundles**

Rebuild `release_bundles/RIS-v2.8.0-Studio-Pro.zip` and `release_bundles/RIS-v2.8.0-Pro-All-Access.zip` with the new eyewear assets and updated Figma master script.

- [ ] **Step 4: Push to commercial repository**

Commit and push `release_bundles/relic-pro/` to `origin/main`.

- [ ] **Step 5: Final Git Commit**

```bash
rtk git add README.md release_bundles/
rtk git commit -m "chore(release): complete Eyewear Micro-HUD suite integration and verification"
```

# Relic Eyewear Micro-HUD Suite — Design Specification

**Status**: APPROVED IN BRAINSTORMING (Pending Written Review)  
**Date**: 2026-09-10  
**Target Milestone**: RIS v2.9.0 / Eyewear Expansion  
**Author**: Antigravity & Lead Design Engineering  

---

## 1. Executive Summary & Problem Statement

### 1.1 The Challenge
Modern smart glasses and optical waveguide HUDs (Google Glass Enterprise, RayNeo X2, Even Realities G1, ActiveLook, military HMDs) operate under extreme optical and cognitive constraints:
1. **Zero-Occlusion Requirement**: The central field of view (fovea, central 15° cone) must remain 90–95% unobstructed. Opaque cards or filled polygons create blind spots and induce severe visual disorientation or physical hazards.
2. **Emissive Alpha Physics**: On see-through optical waveguides (MicroLED / Micro-OLED), black (`#000000`) emits no light and represents **100% pure optical transparency**. UI elements must be drawn with crisp 1px lines (`stroke="currentColor"`, `shape-rendering="geometricPrecision"`) and open 45° chamfered brackets rather than filled backgrounds.
3. **Anti-Greeble Rule (High Utility vs Decorative Sci-Fi)**: Futuristic fictional interfaces frequently fail real-world usability by filling viewports with meaningless decorative clutter (rotating random rings, mock hex hashes, fake progress bars). Eyewear interfaces must provide **sub-second glanceability (300–500ms saccades)** for mission-critical jobs: turn-by-turn wayfinding, live transcription/teleprompter, biometric zones, glance-and-dismiss alerts, and boresight technical inspection.

### 1.2 Proposed Solution
The **Relic Eyewear Micro-HUD Suite** introduces a specialized system of **5 high-utility atomic components** and **1 turnkey composite eyewear container** (`SmartGlassesHUD`), alongside a dedicated optical pass-through simulation laboratory (`docs/eyewear.html`) featuring live real-world background imagery (daylight street, night urban, and industrial inspection).

---

## 2. Hardware Waveguide Constraints & Emissive Alpha Invariants

### 2.1 Optical Transparency Physics
- **Emissive Alpha**: No solid surface fills (`background: transparent`).
- **1px Crisp Vector Stroke**: All geometry rendered via `shape-rendering="geometricPrecision"` and `vector-effect="non-scaling-stroke"`.
- **45° Chamfers**: Tactical corners use 45° cutoffs (`clip-path: polygon(...)` or explicit SVG lines) matching the RIS brutalist aesthetic without radius curves.

### 2.2 The 4 Waveguide Chromatic Profiles
In alignment with official RIS Brand Invariants:

| Profile Name | Brand Key | Primary Hex | Accent Hex | Hardware & Photopic Context |
| :--- | :--- | :--- | :--- | :--- |
| **Phosphor Green (525nm)** | `biohub` | `#2fe48a` | `#6fb3c9` | **Military Avionics (P-43 phosphor) & Even Realities G1**. Highest human retinal sensitivity in bright daylight; minimal eye fatigue. |
| **Tactical Amber (590nm)** | `relic` | `#e6a23c` | `#6fb3c9` | **Low blue-light emission**. Optimal for night vision, dusk operations, and reading against concrete/asphalt. |
| **Cyber Cyan (480nm)** | `neutral` | `#6fb3c9` | `#9d7cd8` | **RayNeo X2 / Iron Man aesthetic**. High photopic sharpness for live text transcription and urban transit. |
| **Alert Red (630nm)** | `omnikon` | `#ff2d3c` | `#e6a23c` | **High-urgency states only**. Reserved for immediate collision alerts, battery <10%, or security breaches. |

### 2.3 Ergonomic Typography & Cognitive Boundaries
- **Foveal Comfort Arc (15°)**: Text lines must not require lateral neck turning. Maximum line length for live transcription is **38 characters**.
- **Scale Tokens**:
  - Micro-labels: `9.5px` monospaced (`--ris-font-mono`), uppercase, tracking `+0.08em`.
  - Telemetry Numbers: `12px – 14px` bold monospaced numerals.
  - Turn-by-Turn Maneuver Distance: `16px` bold high-luminance display.

---

## 3. Component Architecture & Props Specification

All components reside in `react/src/components/micro/` and export clean SVG/TSX interfaces.

```
react/src/components/micro/
├── MicroNavGuidance.tsx       # [ATOM 1] Turn-by-turn guidance with countdown, lane vector & ETA
├── MicroLiveCaptions.tsx      # [ATOM 2] Live transcription / teleprompter 2-line display with audio dot
├── MicroVitalTelemetry.tsx    # [ATOM 3] Biometrics & environment: HR zone, altitude/temp, battery runtime
├── MicroGlanceNotice.tsx      # [ATOM 4] Glance & dismiss alert ticker with auto-decay progress bar
├── MicroSpatialInspection.tsx # [ATOM 5] Technical boresight & ToF/LiDAR rangefinder with hollow center
├── SmartGlassesHUD.tsx        # [CONTAINER] Turnkey 4-corner responsive eyewear viewport
└── types.ts                   # Shared eyewear types & brand color resolvers
```

### 3.1 `MicroNavGuidance`
* **Purpose**: Hands-free urban & tactical wayfinding for pedestrians, cyclists, and field agents.
* **Props**:
  - `maneuver`: `'straight' | 'slight-right' | 'right' | 'sharp-right' | 'slight-left' | 'left' | 'sharp-left' | 'u-turn'`
  - `distanceMeters`: `number` (rendered dynamically as `in 40m` or `in 1.2km`)
  - `streetName`: `string` (compact street/waypoint name, e.g. `VIA MANZONI`)
  - `eta`: `string` (e.g. `16:42`)
  - `brand`: `'relic' | 'biohub' | 'omnikon' | 'neutral'` (default `'biohub'`)
  - `size`: `'sm' | 'md' | 'lg' | number`
* **Visual**: Crisp 45° angled arrow glyph, bold distance countdown, and clean divider ticks.

### 3.2 `MicroLiveCaptions`
* **Purpose**: Live speech-to-text, real-time language translation, and discrete speaker teleprompter.
* **Props**:
  - `line1`: `string` (primary caption line, max 38 chars)
  - `line2`: `string` (secondary caption line, max 38 chars)
  - `speaker`: `string` (optional, e.g. `SPEAKER 01` or `TRANSLATION [EN→IT]`)
  - `listening`: `boolean` (displays pulsing audio dot indicator)
  - `brand`: `'relic' | 'biohub' | 'omnikon' | 'neutral'`
* **Visual**: Bottom-aligned 2-line monospaced cluster with listening pulse, completely transparent background.

### 3.3 `MicroVitalTelemetry`
* **Purpose**: Real-time biometric, altitude, and hardware endurance monitoring for athletes and field technicians.
* **Props**:
  - `heartRate`: `number` (BPM)
  - `hrZone`: `1 | 2 | 3 | 4 | 5` (displays zone tag, e.g. `Z3 AEROBIC`)
  - `altitudeMeters`: `number` (e.g. `420m ALT`)
  - `batteryPercent`: `number` (e.g. `68`)
  - `batteryRuntimeHours`: `number` (e.g. `3.4`, rendered as `~3h 24m`)
  - `brand`: `'relic' | 'biohub' | 'omnikon' | 'neutral'`
* **Visual**: Peripheral corner datablock with 4-segment battery bar and heart-pulse pip.

### 3.4 `MicroGlanceNotice`
* **Purpose**: High-urgency contextual alerts and calendar reminders that auto-dismiss in 4 seconds.
* **Props**:
  - `category`: `'CALENDAR' | 'COLLISION' | 'SYSTEM' | 'SECURITY'`
  - `title`: `string` (e.g. `Design Review in 8m`)
  - `subtitle`: `string` (e.g. `Room 4B · 4 participants`)
  - `severity`: `'info' | 'warn' | 'critical'`
  - `dismissProgress`: `number` (0 to 100, animates top 1px countdown decay bar)
  - `brand`: `'relic' | 'biohub' | 'omnikon' | 'neutral'`
* **Visual**: Slim 22px banner at viewport top with chamfered corner and decay countdown line.

### 3.5 `MicroSpatialInspection`
* **Purpose**: Boresight targeting, ToF/LiDAR distance telemetry, and component QR/barcode inspection without obscuring the real-world object.
* **Props**:
  - `distanceMeters`: `number` (measured distance, e.g. `1.4m`)
  - `targetLabel`: `string` (e.g. `VALVE_ACTUATOR_B2`)
  - `status`: `'scanning' | 'locked' | 'standby'`
  - `specCode`: `string` (e.g. `P/N: 884-J · OK`)
  - `bracketWidth`: `number` (default 120)
  - `bracketHeight`: `number` (default 90)
  - `brand`: `'relic' | 'biohub' | 'omnikon' | 'neutral'`
* **Visual**: 4 hollow 45° corner brackets framing the physical object, lateral vertical range ruler, status chip.

### 3.6 `SmartGlassesHUD` (Composite Viewport)
* **Purpose**: Turnkey responsive container orchestrating the 4 peripheral anchors and center inspection boresight.
* **Props**:
  - `mode`: `'ambient' | 'commute' | 'meeting' | 'field-ops'`
  - `opticalProfile`: `'phosphor-green' | 'tactical-amber' | 'cyber-cyan' | 'alert-red'`
  - `navData`: object (data for `MicroNavGuidance`)
  - `captionData`: object (data for `MicroLiveCaptions`)
  - `vitalData`: object (data for `MicroVitalTelemetry`)
  - `noticeData`: object (data for `MicroGlanceNotice`)
  - `inspectionData`: object (data for `MicroSpatialInspection`)
* **Mode Mapping**:
  1. `ambient`: Only top-left minimal clock + remaining battery hours. 98% clear viewport.
  2. `commute`: Top-right `MicroNavGuidance` + top-center compass heading.
  3. `meeting`: Bottom-center `MicroLiveCaptions` + top `MicroGlanceNotice`.
  4. `field-ops`: Center `MicroSpatialInspection` + top-left `MicroVitalTelemetry`.

---

## 4. Optical Pass-Through Visibility Simulator (`docs/eyewear.html`)

A dedicated interactive specimen verifying 1px optical contrast against real-world lighting environments using high-resolution Unsplash imagery:

### 4.1 Real-World Pass-Through Backgrounds
1. **Daylight City / Sunny Street**:
   - URL: `https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1600&q=80`
   - Purpose: Validates high photopic contrast against daylight glare, bright sidewalks, and sky.
2. **Night Urban Street**:
   - URL: `https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1600&q=80`
   - Purpose: Validates non-dazzling contrast against street lamps, traffic lights, and asphalt.
3. **Industrial / Workshop Inspection**:
   - URL: `https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1600&q=80`
   - Purpose: Validates spatial boresight alignment over complex machinery, cables, and tools.
4. **Tactical Lab Void**:
   - Color: `#060708`
   - Purpose: Pure hardware emission inspection (simulating dark room or closed visor).

### 4.2 Live Interactive Simulator Controls
- **Mode Selector**: 4 tactical buttons (`[Ambient]`, `[Commute]`, `[Meeting]`, `[Field Ops]`).
- **Optical Profile Selector**: 4 chromatic toggles (`Phosphor Green`, `Tactical Amber`, `Cyber Cyan`, `Alert Red`).
- **Live Maneuver Scrubber**: Slider `0m – 250m` adjusting distance countdown and active arrow in real-time.
- **Caption Text Selector**: Presets for "Live Translation [EN→IT]", "Keynote Speech Teleprompter", and "Field Safety Checklist".
- **LiDAR Distance Scrubber**: Slider `0.4m – 15.0m` adjusting boresight range indicator and status chip.
- **Background Switcher**: Seamless live toggle between the 3 real photos and the black void.

### 4.3 Atomic Card Showcase
Located below the lens simulator:
- 5 cards with live rendered SVG elements.
- **[Copy SVG]** button with instant standalone W3C markup copy.
- **[Copy JSX]** button with production TSX code snippet.
- Sonner-style tactical toast confirmation (`[0x5A1] SVG copied to clipboard`).

---

## 5. Vector Pipeline & Figma Integration

1. **`scripts/export-eyewear-svg.js`**:
   - Generates standalone W3C valid SVGs into `svg/eyewear/`:
     - `nav-guidance.svg`
     - `live-captions.svg`
     - `vital-telemetry.svg`
     - `glance-notice.svg`
     - `spatial-inspection.svg`
     - `hud-viewport-commute.svg`
     - `hud-viewport-meeting.svg`
     - `hud-viewport-field-ops.svg`
     - `hud-viewport-ambient.svg`
   - Copies generated assets to `figma/assets/eyewear/` and `release_bundles/relic-pro/figma/assets/eyewear/`.
2. **Figma Master Generator (`code.js`)**:
   - Appends **Artboard 05 — Smart Glasses & Waveguide Micro-HUDs** generating native Figma vector nodes on canvas.

---

## 6. Verification Suite & Zero-Reflow Invariants

1. **TypeScript Build**:
   ```bash
   cd react && rtk npm run build
   ```
2. **Motion Audit**:
   - Zero layout reflow: strictly `transform`, `opacity`, and `stroke-dashoffset`.
   - All animations disabled when `@media (prefers-reduced-motion: reduce)` is active.
3. **Cross-Linking & Documentation**:
   - Nav links in `docs/index.html`, `docs/micro-ui.html`, `docs/motion-lab.html`, and `docs/eyewear.html`.

# Relic Forensic Dashboard — Next.js App Router Template

> **Relic Interface System (RIS v2.8.0)** production-ready Next.js application template.
> High-contrast tactical cyber instrument and forensic telemetry command interface.

---

## Architecture & Design Foundations

This template faithfully implements all tenets of the **Relic Interface System (RIS v2.8.0)**:

1. **45° Chamfer Geometry**:
   - Signature polygonal corner clips: 6px (`chamfer-sm` for chips/buttons), 10px (`chamfer-md` for panels), and 16px (`chamfer-lg` for modals).
   - Diagonal dual-corner notches (`chamfer-notch`) for tactical asymmetrical styling.
   - Zero rounded borders (`border-radius: 0px`).

2. **Emil Kowalski Motion System**:
   - **80ms Micro-Feedback**: Buttons and controls snap dynamically with `:active scale(0.97)` and `--ris-ease-snap` (`cubic-bezier(0.16, 1, 0.3, 1)`).
   - **140ms Hover/Switch**: Fast transitions for interactive states.
   - **240ms Enter Animations**: Modals and sheets enter with deceleration curve `--ris-ease-out` (`cubic-bezier(0.22, 1, 0.36, 1)`). Never use `ease-in` for entering elements.
   - **Composited Only**: Strictly animates `transform` and `opacity`.

3. **Zero Layout Reflow**:
   - Tabular numerals (`font-variant-numeric: tabular-nums`) across all numerical telemetry, timestamps, and KPIs prevent jitter and horizontal reflow.
   - Interactive SVG telemetry chart calculates fixed internal coordinate scales without resizing canvas elements.

4. **True Dual Theme (Dark Tactical HUD + Light Technical Drafting Cyan)**:
   - **Dark Mode (`data-theme="dark"`)**: High-contrast tactical HUD with graphite/obsidian surfaces (`#0a0608`), structural crimson lines (`#6e2d38`), neon accents, scanlines, and 32px HUD grid background.
   - **Light Mode (`data-theme="light"`)**: Technical architectural drafting cyan/slate palette (`#1b6b80` / `#165868`), clean ink lines, and technical millimeter grid at 10-15% opacity, eliminating fluorescent glare while retaining full cybernetic geometry.
   - **Multi-Brand Switcher**: Instant switching between `relic` (amber/cyan), `biohub` (cyan/green), `omnikon` (red/yellow), and `neutral` (violet/cyan).

5. **Strict Real Data Telemetry**:
   - Zero dummy lore or fabricated hashes in telemetry charts.
   - Every readout binds 1:1 to calibrated dataset values (time-series transfer bitrate in Mbps, calibrated deltas `Δ +18`, buffer integrity %, signal noise in dB, and threshold `[PEAK ALERT]`).

6. **WCAG 2.2 AA Baseline & Mobile OLED Safety**:
   - All text and border contrasts verified ≥ 4.5:1 against respective surfaces.
   - State is never conveyed by color alone (always accompanied by labels and icons).
   - Skip navigation link (`.ris-skip-nav`) as the first focusable child.
   - **Mobile Safety (GUIDELINES §9)**: 1px edge notch rulers (`.ris-ruler`) are strictly omitted on viewports <768px to prevent optical dead-subpixel illusions on high-density OLED screens. Modals gracefully adapt to touch-friendly Bottom Sheets (`.ris-sheet`) with touch targets ≥44px.

---

## Project Structure

```
templates/forensic-dashboard/
├── app/
│   ├── globals.css           # Direct RIS tokens, dual theme, cyber skin, and chamfers
│   ├── layout.tsx            # App router root layout with metadata and skip-nav
│   └── page.tsx              # Cohesive forensic dashboard with zero layout reflow
├── components/
│   ├── EventLogStream.tsx    # Live scrolling forensic stream with severity badges & buffer controls
│   ├── Icons.tsx             # Tactical SVG icons conforming to RIS 24x24 stroke 1.75
│   ├── KpiGrid.tsx           # 4 high-contrast KPI cards with inline SVG sparklines
│   ├── MobileBottomSheet.tsx # Touch bottom sheet for viewports <768px with swipe handle
│   ├── Sidebar.tsx           # Tactical rail with collapsible items, memory meter & clearance badge
│   ├── SystemModal.tsx       # Tactical override modal with focus trap & 240ms enter animation
│   ├── TelemetryScrubber.tsx # Interactive SVG line chart with real data points & peak alert
│   └── TopBar.tsx            # HUD status bar with ● LOCK, ticker, theme & brand switchers
├── public/
│   └── icons/
│       └── ris-icons.svg     # Relic Interface System SVG icon sprite
├── .dockerignore
├── Dockerfile                # Multi-stage minimal Alpine container build
├── next.config.mjs           # Next.js config with standalone output & security headers
├── package.json              # Project dependencies and operational scripts
├── postcss.config.mjs        # PostCSS with Tailwind CSS & Autoprefixer
├── tailwind.config.ts        # Tailwind configuration with @relic-ui/tailwind preset
└── tsconfig.json             # TypeScript strict configuration
```

---

## Component Summary

| Component | Responsibility | RIS Standards Implemented |
|---|---|---|
| `TopBar.tsx` | Status bar & system chrome | Connection indicator (`● LOCK`), UTC ticker, Dark/Light theme toggle, Brand switcher (`relic`, `biohub`, `omnikon`, `neutral`). |
| `Sidebar.tsx` | Desktop tactical navigation | Collapsible rail (64px ↔ 230px), clearance badge (`[CLEARANCE: LVL-4]`), live hardware memory meter with segmented progress. |
| `KpiGrid.tsx` | Real-time metric indicators | 4 cards (Transfer Bitrate, Buffer Integrity, Signal Noise SNR, Threat Index) with 45° chamfers and mini sparklines. |
| `TelemetryScrubber.tsx` | Interactive waveform analysis | Interactive mouse/touch scrubber line, exact coordinate tracking, calibrated deltas (`Δ +18`), and threshold alert (`[PEAK ALERT]`). |
| `EventLogStream.tsx` | Audit stream & security feed | Severity badges (`INFO`, `WARN`, `CRITICAL`), circular memory buffer, pause/resume streaming, and clear buffer. |
| `SystemModal.tsx` | Critical directive dialog | 240ms `--ris-dur-enter` entrance, keyboard focus trap, `Escape` key listener, 80ms click snap buttons, and action confirmation. |
| `MobileBottomSheet.tsx` | Mobile viewport drawer | Swipe gesture dismiss handle, touch targets ≥44px, safe-area inset padding, hidden edge rulers. |

---

## Quickstart

### 1. Installation

```bash
cd templates/forensic-dashboard
npm install
```

### 2. Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Type Checking & Verification

```bash
npm run typecheck
```

### 4. Production Build

```bash
npm run build
npm run start
```

---

## Deployment Guide

### Vercel Deployment

This project is fully compatible with Vercel zero-configuration deployments:

1. Push your repository to GitHub / GitLab.
2. In the Vercel Dashboard, import the repository and set the **Root Directory** to `templates/forensic-dashboard`.
3. Build Command: `npm run build`
4. Output Directory: `.next`
5. Click **Deploy**.

### Docker Deployment

A production-optimized multi-stage `Dockerfile` is included using `output: 'standalone'` in `next.config.mjs`:

```bash
# Build container image
docker build -t relic-forensic-dashboard .

# Run container on port 3000
docker run -d -p 3000:3000 --name forensic-dashboard relic-forensic-dashboard
```

The container automatically creates an unprivileged `nextjs` system user, drops unused dependencies, and serves the application via the lightweight standalone Node.js server.

---

## Customization

### Changing the Default Theme or Brand

In `app/layout.tsx`, adjust the root `<html>` attributes:

```tsx
<html lang="en" data-theme="dark" data-brand="omnikon" data-skin="cyber">
```

- `data-theme`: `"dark"` | `"light"`
- `data-brand`: `"relic"` | `"biohub"` | `"omnikon"` | `"neutral"`
- `data-skin`: `"cyber"` (tactical HUD aesthetics) or omit for forensic baseline

---

## License

Part of **Relic Interface System Pro**. Governed by the [RIS Pro Commercial License](../../LICENSE_PRO.md).
Authorized for unlimited commercial end-products upon valid license purchase. Standalone redistribution or re-licensing as a template or UI kit is strictly prohibited.

<div align="center">

```
┌─────────────────────────────────────────────────────────────┐
│  [ // RELIC INTERFACE SYSTEM · SYSTEM ARMED · v2.8.0 // ]   │
└─────────────────────────────────────────────────────────────┘
```

# RELIC INTERFACE SYSTEM

### Brutalist tactical HUD & telemetry design system for Web and Jetpack Compose.

[![License: MIT](https://img.shields.io/badge/License-MIT-e6a23c.svg?style=flat-square)](LICENSE)
[![WCAG 2.2 AA](https://img.shields.io/badge/Accessibility-WCAG%202.2%20AA-2fe48a.svg?style=flat-square)](GUIDELINES.md)
[![Compose 1.7+](https://img.shields.io/badge/Android-Jetpack%20Compose-6fb3c9.svg?style=flat-square)](compose/)
[![Zero Reflow](https://img.shields.io/badge/Motion-Zero%20Reflow%20%4060fps-ff2d3c.svg?style=flat-square)](docs/motion-lab.html)

<br />

| ENGINE | COMPLIANCE | REFLOW JANK | MOTION BUDGET | PALETTE |
| :---: | :---: | :---: | :---: | :---: |
| **CSS + Canvas + Compose** | **WCAG 2.2 AA (≥ 4.5:1)** | **0% (Composited)** | **80ms / 140ms / 200ms** | **Dark HUD · Light Blueprint** |

<br />

[Explore Specimen](docs/index.html) · [Mobile App-Shell](docs/mobile.html) · [Motion & Contrast Lab](docs/motion-lab.html) · [Compose Port](compose/README.md)

</div>

---

## ◈ What is RIS?

Most cyberpunk UI libraries fall apart in production: fluorescent neon text on pitch black that burns your eyes, fuzzy box-shadow glows causing frame drops, and fake lorem-ipsum telemetry with random numbers.

**Relic Interface System (RIS)** is the antidote:

- **Disciplined Graphite Surfaces**: Structured with 1px tactile borders and 45° chamfered cuts (6px / 10px / 16px), never fuzzy drop-shadows.
- **Physical Motion**: Calibrated micro-feedback (80ms click snap, 140ms hover), zero-reflow CSS Grid accordion drawers, and an absolute ban on `ease-in` for entering views.
- **Strict Real Data**: Zero fake metrics. Interactive SVG charts with pointer scrubbers and keyboard navigation bind directly to real telemetry points.
- **True Dual Theme**: High-contrast tactical crimson/amber in Dark mode; calm architectural blueprint cyan/slate (`#1b6b80`) in Light mode. Zero illegible neon fills.
- **Native Android Parity**: Complete Jetpack Compose port sharing identical tokens, chamfer clip shapes, and hardware-accelerated Canvas charts.

---

## ◈ Interactive Template & Live Showcase

No local setup is required to evaluate or start building. Launch the full environment right in your browser via GitHub Pages:

[![Live Showcase](https://img.shields.io/badge/Live%20Showcase-GitHub%20Pages-e6a23c?style=for-the-badge&logo=github)](https://yuzushi-dev.github.io/relic-interface-system/)
[![Mobile App--Shell](https://img.shields.io/badge/Mobile%20Shell-Touch%20Specimen-6fb3c9?style=for-the-badge)](https://yuzushi-dev.github.io/relic-interface-system/docs/mobile.html)
[![Motion Lab](https://img.shields.io/badge/Motion%20Lab-Tactical%20HUD-ff2d3c?style=for-the-badge)](https://yuzushi-dev.github.io/relic-interface-system/docs/motion-lab.html)

### Using as a Project Template

Click **Use this template** on GitHub or clone the repository to spin up a new tactical app:

```bash
git clone https://github.com/yuzushi-dev/relic-interface-system.git my-tactical-app
cd my-tactical-app
python3 -m http.server 8080
```

- **Web (Vanilla CSS)**: Import `css/ris-tokens.css` + `css/ris.css` (and optional `css/ris-skin-cyber.css`). Specimen in [`docs/index.html`](docs/index.html).
- **React + TypeScript**: Native `@relic-ui/react` components with zero-reflow CSS Grid, typed hooks, and charts in [`react/`](react/README.md).
- **Figma UI Kit**: Tokens Studio JSON, turnkey plugin generator, and vector shapes in [`figma/`](figma/README.md).
- **Tailwind CSS Plugin**: Ready preset with `.chamfer-*` utilities and design tokens in [`tailwind/`](tailwind/README.md).
- **Android / Compose**: Direct drop-in Gradle library module with Maven/JitPack publishing in [`compose/`](compose/README.md).
- **Agent Prompt**: If building with Claude Code, Cursor, or Codex, pass [`DESIGN.md`](DESIGN.md) directly as the system prompt.

---

## ◈ Component Inventory

Everything you need to ship a forensic dashboard or hardware workbench:

| Category | Primitives | Highlights |
|---|---|---|
| **Buttons & Controls** | `.ris-btn` (Primary, Secondary, Ghost, Danger), `.ris-switch` | 80ms mechanical snap (`scale(0.97)`), AAA invert highlight on hover |
| **Surfaces & Layout** | `.ris-panel`, `.ris-topbar`, `.ris-rail`, `.ris-bottomnav` | Clipped 45° corners, bracket accents (`.ris-bracket`), edge notch rulers |
| **Mobile & Touch** | `.ris-sheet`, `.ris-sheet-handle`, `.ris-listrow` | Touch-first bottom sheets, gesture drag dismiss, 44px touch targets, OLED safe |
| **Disclosures & Overlays** | `.ris-acc`, `.ris-modal-box`, `.ris-toast-stack` | Zero-reflow CSS Grid drawers (`0fr → 1fr`), Sonner-style staggered toasts |
| **Telemetry & Meters** | `.ris-stat`, `.ris-segmeter`, `.ris-progress`, `.ris-radar` | Discrete segmented energy blocks, continuous canvas progress, radar sweep |
| **Interactive Charts** | `RisCharts.line`, `.bars`, `.gauge`, `.intraday`, `.eegWaveform` | Scrubbers with keyboard `Arrow` control, delta badges, peak threshold warnings |
| **Icons** | `icons/ris-icons.svg` | 132 unified technical SVG glyphs (based on Tabler Icons, MIT) |

---

## ◈ Non-Negotiable Engineering Rules

1. **Tokens Only**: Never hardcode hex values in component CSS. Always use `var(--ris-*)`.
2. **Accent = Meaning**: Colors convey state, not decorative clutter (Amber = CTA/active, Cyan = data/scan, Red = alert/blocked, Green = nominal).
3. **No Blind State**: State is never communicated by color alone (WCAG 1.4.1). Always pair with text labels or icons.
4. **Composited Motion**: Animate only `transform` and `opacity`. Never animate `height`, `width`, or `top`.
5. **Strict Real Data**: No randomized mock generators or fake hashes in charts. Every displayed readout maps 1:1 to real metrics.
6. **OLED Safety**: Full-height edge rulers (`.ris-ruler`) are strictly forbidden on viewports `<768px` to prevent optical dead-subpixel illusion.

---

## ◈ Run Local Specimen & Motion Lab

Serve the repository with any HTTP server (e.g. Python):

```bash
python3 -m http.server 8080
```

- **Interactive Desktop Specimen**: `http://localhost:8080/docs/index.html`
- **Mobile Touch Shell**: `http://localhost:8080/docs/mobile.html`
- **Motion & Contrast Lab**: `http://localhost:8080/docs/motion-lab.html`

---

## ◈ Third-Party Attributions & Legal Notice

- **Software License**: [MIT License](LICENSE) © 2026 Relic Interface System Contributors.
- **Icons**: [Tabler Icons](https://tabler.io/icons) (MIT License, © Paweł Kuna).
- **Typography**: Archivo, JetBrains Mono, Chakra Petch, and Rajdhani under the SIL Open Font License.
- **Legal Notice**: Relic Interface System is an independent, original open-source design system. All styling, SVG geometry, color token architectures, Canvas renderers, and motion timings are entirely bespoke and unencumbered.

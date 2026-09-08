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
- **True Dual Theme**: Menacing Kiroshi crimson/amber in Dark mode; calm architectural blueprint cyan/slate (`#1b6b80`) in Light mode. Zero illegible neon fills.
- **Native Android Parity**: Complete Jetpack Compose port sharing identical tokens, chamfer clip shapes, and hardware-accelerated Canvas charts.

---

## ◈ Quickstart (Web)

Link the core stylesheet pipeline and drop in tokens:

```html
<!DOCTYPE html>
<html lang="en" data-theme="dark" data-brand="relic" data-skin="cyber">
<head>
  <link rel="stylesheet" href="css/ris-tokens.css">
  <link rel="stylesheet" href="css/ris.css">
  <link rel="stylesheet" href="css/ris-fx.css">          <!-- Optional: HUD radar, scans, glows -->
  <link rel="stylesheet" href="css/ris-skin-cyber.css">  <!-- Cyberpunk skin (load last) -->
</head>
<body class="ris ris-grid-bg">
  <a class="ris-skip-nav" href="#main">Skip to main content</a>

  <main id="main">
    <button class="ris-btn ris-btn--primary">
      <span>INITIALIZE SCAN</span>
      <svg class="ris-icon" aria-hidden="true"><use href="icons/ris-icons.svg#ris-crosshair"/></svg>
    </button>
  </main>
</body>
</html>
```

---

## ◈ Quickstart (Jetpack Compose)

Drop `compose/` directly into your Android project. Zero external UI dependencies beyond modern Jetpack Compose:

```kotlin
@Composable
fun TelemetryScreen() {
    RisTheme {
        Box(Modifier.fillMaxSize().cyberBackdrop().padding(16.dp)) {
            RisPanel(modifier = Modifier.fillMaxWidth()) {
                Column(Modifier.padding(16.dp)) {
                    Text("REACTOR CORE · TELEMETRY", style = RisH3, color = RisCyberSkin.Fg1)
                    RisProgressBar(progress = 0.84f)
                    RisStat(value = "98.4", label = "Stability %", activeSegments = 4)
                    RisButton(
                        text = "PURGE SYSTEM",
                        onClick = { /* ... */ },
                        variant = RisButtonVariant.Primary
                    )
                }
            }
        }
    }
}
```

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
- **Legal Disclaimer**: Relic Interface System is an independent design system. Aesthetic references (*Cyberpunk 2077*, *Arasaka*, *Militech*, *Edgerunners*, *Kiroshi*) are used strictly as creative commentary and thematic styling homages. This project is not affiliated with, sponsored by, or endorsed by CD PROJEKT S.A.

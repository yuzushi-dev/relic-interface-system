# RIS — Relic Interface System v2

Cyberpunk/HUD multi-product design system (Relic · BioHub · VivoKey/Spark2 ·
general use). Graphite surfaces, sharp borders, clipped corners, disciplined
Cyberpunk 2077 accents. Dark + light, desktop + mobile, WCAG 2.2 AA compliant.

Full production design system: see `AUDIT.md` for architectural decisions and `CHANGELOG.md` for release history.

## Structure

```
relic-interface-system/
├── README.md            ← this file
├── DESIGN.md            ← agent & developer handoff guide
├── AUDIT.md             ← architectural audit and decisions
├── CHANGELOG.md         ← release log
├── GUIDELINES.md        ← principles, themes, brands, accessibility, responsive
├── COMPONENTS.md        ← component reference (classes, ARIA, do/don't)
├── tokens/
│   └── ris.tokens.json  ← source of truth (W3C design tokens draft)
├── css/
│   ├── ris-tokens.css   ← tokens: dark/light themes + brands + typography classes
│   ├── ris.css          ← components + layout chrome + a11y baseline
│   ├── ris-fx.css       ← optional FX: boot reveal, glow, caret, holo, radar
│   └── ris-skin-cyber.css ← opt-in CP2077 skin (data-skin="cyber", load LAST)
├── js/
│   └── ris-charts.js    ← zero-dependency SVG charts (line/bars/spark/gauge/EEG)
├── icons/
│   └── ris-icons.svg    ← 132 glyph sprite (Tabler Icons MIT, biofeedback, implants)
├── docs/
│   ├── index.html       ← interactive desktop specimen (theme + brand toggles)
│   ├── mobile.html      ← interactive mobile app-shell (bottom sheet, touch radar)
│   └── motion-lab.html  ← interactive Kiroshi motion & contrast lab
└── compose/             ← Jetpack Compose v2.8.0 native Android port
    ├── Color.kt         ← palette, semantic tokens, brands (Relic/BioHub/VivoKey)
    ├── Theme.kt         ← RisTheme, LocalRisColors, LocalRisShapes, LocalRisTypography
    ├── Type.kt          ← typography scale (display/hud/body/caption/telemetry)
    ├── Shape.kt         ← chamfered cut-corner shapes (RisCutCornerShape)
    ├── Components.kt    ← buttons, chips, HUD toasts, accordions, bottom sheets, meters
    ├── Charts.kt        ← hardware-accelerated Canvas line, spark, gauge, bar charts
    └── README.md        ← Android integration guide & specimen code
```

## Quick start (web)

```html
<html data-theme="dark" data-brand="biohub">
<head>
  <link rel="stylesheet" href="css/ris-tokens.css">
  <link rel="stylesheet" href="css/ris.css">
</head>
<body class="ris ris-grid-bg">
  <a class="ris-skip-nav" href="#main">Skip to main content</a>
  <button class="ris-btn ris-btn--primary">Start scan</button>
  <svg class="ris-icon" aria-hidden="true"><use href="icons/ris-icons.svg#ris-heart-pulse"/></svg>
</body>
</html>
```

- Theme: `data-theme="dark|light"` (default dark).
- Brand: `data-brand="relic|biohub|vivokey|neutral"` (default relic).
- Skin CP2077 (opt-in): `data-skin="cyber"` + `<link href="css/ris-skin-cyber.css">`
  **loaded last**. Supports Dark HUD and Light drafting themes, fully reversible. See GUIDELINES §8.
- Specimen: `python3 -m http.server 8080` → `http://localhost:8080/docs/index.html`.

## Android / Compose

`compose/` contains the full Jetpack Compose port with complete token, typography, shape, motion, component, and telemetry chart parity. See `compose/README.md` for the full implementation guide, architecture breakdown, and code specimens.

## Non-negotiable rules

1. Tokens only, never raw hex in components.
2. Accent = meaning (see GUIDELINES §1).
3. State is never color alone.
4. WCAG 2.2 AA: contrast, focus, touch targets, reduced-motion (GUIDELINES §4).
5. New components: documented in COMPONENTS.md + specimen + CHANGELOG.

## License & Third-Party Attributions

- Released under the [MIT License](LICENSE).
- Icons provided by [Tabler Icons](https://tabler.io/icons) (MIT License).
- Typography: Archivo, JetBrains Mono, Chakra Petch, and Rajdhani are licensed under the SIL Open Font License (OFL).

## Legal Disclaimer

Relic Interface System (RIS) is an independent open-source design system. Visual motifs, color schemes, and aesthetic naming references (such as *Cyberpunk 2077*, *Arasaka*, *Militech*, *Edgerunners*, and *Kiroshi*) are used solely as artistic homage, design commentary, and theming descriptors. This project is not affiliated with, sponsored by, or endorsed by CD PROJEKT S.A. or any of its subsidiaries.

# RIS — Relic Interface System v2

Cyberpunk/HUD multi-product design system (Relic · BioHub · VivoKey/Spark2 ·
general use). Graphite surfaces, sharp borders, clipped corners, disciplined
Cyberpunk 2077 accents. Dark + light, desktop + mobile, WCAG 2.2 AA compliant.

Evolution of the v1 handoff package (`../design_handoff/`) into a full design system:
see `AUDIT.md` for delta and `CHANGELOG.md` for history.

## Structure

```
ris/
├── README.md            ← this file
├── AUDIT.md             ← v1 → v2 audit (gaps and decisions)
├── CHANGELOG.md
├── GUIDELINES.md        ← principles, themes, brands, accessibility, responsive
├── COMPONENTS.md        ← component reference (classes, ARIA, do/don't)
├── tokens/
│   └── ris.tokens.json  ← source of truth (W3C design tokens draft)
├── css/
│   ├── ris-tokens.css   ← tokens: dark/light themes + brands + typography classes
│   ├── ris.css          ← components + layout chrome + a11y baseline
│   ├── ris-fx.css       ← optional FX: boot reveal, glow, caret, holo
│   └── ris-skin-cyber.css ← opt-in CP2077 skin (data-skin="cyber", load LAST)
├── js/
│   └── ris-charts.js    ← zero-dependency SVG charts (line/bars/spark/gauge/EEG)
├── icons/
│   └── ris-icons.svg    ← 132 glyph sprite (Tabler Icons MIT, biofeedback, implants)
├── docs/
│   ├── index.html       ← interactive desktop specimen (theme + brand toggles)
│   ├── mobile.html      ← interactive mobile app-shell (bottom sheet, touch radar)
│   └── motion-lab.html  ← interactive Kiroshi motion & contrast lab
└── compose/
    └── Color.kt         ← Android port of v2 tokens
```

## Quick start (web)

```html
<html data-theme="dark" data-brand="biohub">
<head>
  <link rel="stylesheet" href="ris/css/ris-tokens.css">
  <link rel="stylesheet" href="ris/css/ris.css">
</head>
<body class="ris ris-grid-bg">
  <a class="ris-skip-nav" href="#main">Skip to main content</a>
  <button class="ris-btn ris-btn--primary">Start scan</button>
  <svg class="ris-icon" aria-hidden="true"><use href="ris/icons/ris-icons.svg#ris-heart-pulse"/></svg>
</body>
</html>
```

- Theme: `data-theme="dark|light"` (default dark).
- Brand: `data-brand="relic|biohub|vivokey|neutral"` (default relic).
- Skin CP2077 (opt-in): `data-skin="cyber"` + `<link href="css/ris-skin-cyber.css">`
  **loaded last**. Dark mode only, fully reversible. See GUIDELINES §8.
- Specimen: `cd ris && python3 -m http.server 8080` → `http://localhost:8080/docs/`.

## Android / Compose

`compose/Color.kt` contains the v2 tokens (dark + light + brand). The components
(Theme/Type/Shape/Components/Charts/Scaffold) align with Compose specifications.

## Non-negotiable rules

1. Tokens only, never raw hex in components.
2. Accent = meaning (see GUIDELINES §1).
3. State is never color alone.
4. WCAG 2.2 AA: contrast, focus, touch targets, reduced-motion (GUIDELINES §4).
5. New components: documented in COMPONENTS.md + specimen + CHANGELOG.

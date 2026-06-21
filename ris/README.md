# RIS — Relic Interface System v2

Design system cyberpunk/HUD multi-prodotto (Relic · BioHub · VivoKey/Spark2 ·
general use). Superfici graphite, bordi duri, angoli clippati, accenti
Cyberpunk 2077 disciplinati. Dark + light, desktop + mobile, WCAG 2.2 AA.

Evoluzione del pacchetto handoff v1 (`../design_handoff/`) in vero design system:
vedi `AUDIT.md` per il delta e `CHANGELOG.md` per la storia.

## Struttura

```
ris/
├── README.md            ← questo file
├── AUDIT.md             ← audit v1 → v2 (gap e decisioni)
├── CHANGELOG.md
├── GUIDELINES.md        ← principi, temi, brand, accessibilità, responsive
├── COMPONENTS.md        ← riferimento per componente (classi, ARIA, do/don't)
├── tokens/
│   └── ris.tokens.json  ← source of truth (W3C design tokens draft)
├── css/
│   ├── ris-tokens.css   ← token: temi dark/light + brand + classi tipografiche
│   ├── ris.css          ← componenti + layout chrome + a11y baseline
│   └── ris-fx.css       ← FX opzionali: glitch, CRT, noise, boot reveal, glow
├── js/
│   └── ris-charts.js    ← grafici SVG zero-dipendenze (line/bars/spark/gauge/EEG)
├── icons/
│   └── ris-icons.svg    ← sprite ~90 glifi (generici + biofeedback + implant)
├── docs/
│   └── index.html       ← specimen interattivo (toggle tema + brand)
└── compose/
    └── Color.kt         ← port Android dei token v2 (resto del port: v1 compose/)
```

## Quick start (web)

```html
<html data-theme="dark" data-brand="biohub">
<head>
  <link rel="stylesheet" href="ris/css/ris-tokens.css">
  <link rel="stylesheet" href="ris/css/ris.css">
</head>
<body class="ris ris-grid-bg">
  <a class="ris-skip-nav" href="#main">Salta al contenuto</a>
  <button class="ris-btn ris-btn--primary">Avvia scansione</button>
  <svg class="ris-icon" aria-hidden="true"><use href="ris/icons/ris-icons.svg#ris-heart-pulse"/></svg>
</body>
</html>
```

- Tema: `data-theme="dark|light"` (default dark).
- Brand: `data-brand="relic|biohub|vivokey|neutral"` (default relic).
- Specimen: `cd ris && python3 -m http.server 8080` → `http://localhost:8080/docs/`.

## Android / Compose

`compose/Color.kt` contiene i token v2 (dark + light + brand). I componenti
(Theme/Type/Shape/Components/Charts/Scaffold) restano quelli del handoff v1
in `../design_handoff/design/compose/` — API invariata, cambiano solo gli hex.

## Regole non negoziabili

1. Solo token, mai hex nei componenti.
2. Accento = significato (vedi GUIDELINES §1).
3. Stato mai solo colore.
4. WCAG 2.2 AA: contrasti, focus, target, reduced-motion (GUIDELINES §4).
5. Nuovi componenti: documentati in COMPONENTS.md + specimen + CHANGELOG.

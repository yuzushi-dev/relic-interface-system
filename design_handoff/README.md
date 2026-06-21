# Relic Interface System — Developer Handoff (multi-product)

A complete design-to-code handoff for the **Relic Interface System (RIS)** — a dense, cyberpunk/HUD visual language (graphite surfaces, hard 1px borders, clipped/angular corners, restrained neon accents, scanline + grid textures, quick mechanical motion) — applied across **three products** in the yuzushi-dev org.

This package gives a developer (or Codex/Claude Code) everything needed to implement RIS in the real codebases: the token source of truth, reusable CSS + Kotlin component layers, interactive HTML/JSX prototypes per product, and per-product implementation notes.

---

## How to use this package
1. **Read this file**, then the per-product doc under `products/` for whatever you're building.
2. **Tokens are the source of truth:** `design/colors_and_type.css` (web) and `design/compose/Color.kt` + `Type.kt` + `Shape.kt` (Android). Port them into the target codebase's token system; never hard-code hexes.
3. **The HTML/JSX files under `design/ui_kits/` are design references, not production code.** Recreate them in each app's real environment (its framework, data layer, routing, component conventions), wiring real data in place of the placeholder fixtures. The prototypes use inline-JSX-over-Babel + a `window` export pattern purely to run build-free — do not carry that into the codebase.
4. **Fidelity is high (hifi):** match the exact colors, type, spacing, corner geometry, and interaction states. Where prototype data is placeholder, substitute real data.

---

## Products

| Product | Repo (`@master`/`@main`) | Stack | RIS adoption | Prototype | Doc |
|---|---|---|---|---|---|
| **Relic Researcher Workbench** | `yuzushi-dev/Relic` | Next.js / React / TS | **Redesign** from its native steel-blue/IBM-Plex look | `design/ui_kits/relic-console/` (desktop `index.html` + `mobile.html`) | `products/RELIC_WORKBENCH.md` |
| **BioHub** | `yuzushi-dev/biohub` | Android / Kotlin / Compose (Material 3) | **Redesign** from Material 3 — *confirmed by stakeholder* | `design/ui_kits/biohub/index.html` | `products/BIOHUB.md` |
| **Spark2Offline** (VivoKey implant auth) | `yuzushi-dev/Spark2Offline` | Android / Kotlin (`android_client`) + Python | **Convergent** — its app is already Cyberpunk-styled | `design/ui_kits/spark2-auth/index.html` | `products/SPARK2.md` |

For each, the repo defines the domain + component inventory; RIS supplies the visual language.

---

## Consuming RIS

### Web (Relic Workbench)
- `design/colors_and_type.css` — all tokens (color, type, spacing, clip, elevation, motion).
- `design/relic.css` — component primitives (panels, buttons, chips, `.ris-stream`, `.ris-facet*`, `.ris-risk`, meters, textures, animations).
- `design/ui_kits/relic-console/*.jsx` — screen + primitive components.

### Native Android (BioHub, Spark2) — `design/compose/`
Kotlin / Jetpack Compose port (handoff reference, not a published library — drop into the app's theme package, wire fonts, adapt):
| File | Contents |
|---|---|
| `Color.kt` | surfaces, lines, text, accents (+dim/glow/line), stream taxonomy, `risRiskColor()` |
| `Type.kt` | font families + `RisHero…RisMono` styles + `RisTypography` (Material3 map) |
| `Shape.kt` | `risClip(cut)` / `risClipMirror(cut)` angular shapes, clip + spacing constants |
| `Theme.kt` | `RelicTheme`, `RisPanel`, `RisChip`, `RisSegMeter`, `RisMeter` |
| `Components.kt` | `RisMetricCard`, `RisRiskBadge`, `RisStreamChip`, `RisCalibration`, `RisFacetSpectrum`, `RisButton`, text atoms |
| `Charts.kt` | `RisLineChart`, `RisEegBands`, `RisEegWaveform` (Canvas, dependency-free) |
| `Scaffold.kt` | `RisTopBar`, `RisBottomNav`, `RisScreen` wrapper + worked `BioDashboardScreenExample` |
| `BioHubScreens.kt` | Pre-written BioHub screens: Inspector, Muse, Sync, Scale, Data (+`BIO_NAV`, `RisSubTabs`) |
| `BioHubApp.kt` | `BioHubApp()` NavHost wiring all BioHub screens + scale drill-down (`setContent { RelicTheme { BioHubApp() } }`) |

See `design/compose/README.md` for porting notes (fonts, corners, Material override, Vico theming).

---

## Design tokens (quick reference)
Full values in `design/colors_and_type.css`. Highlights:
- **Surfaces:** void `#060708` · bg `#0a0c0e` · surface-1..4 `#0f1316`→`#232c33` (never pure black).
- **Text:** fg1 `#e6ebe8` → fg4 `#4a555b`; **use `#98a3a5` for metadata on dark surfaces** (AA-safe).
- **Accents (with meaning):** amber `#f2e205` (active/CTA/pending) · cyan `#16e0e0` (data/evidence) · red `#ff2d3c` (danger/blocked) · green `#2fe48a` (online/approved) · violet `#b06bff` (inference) · magenta `#e85ad6` (Gumi runtime) · orange `#e08a3c` (corrections).
- **Type:** Chakra Petch (display, uppercase) · Rajdhani (body/UI) · JetBrains Mono (telemetry). Body 16px / lh 1.55; 11px floor.
- **Shape:** radius **0**; signature **clipped corner** (6px chips/inputs · 10px panels · 14px modals). Elevation = border + glow, not soft shadows.
- **Motion:** quick + mechanical, 90–160ms; flicker / blink / scanline-sweep motifs. Status is **never color-only** — always pair with label/icon.

---

## Package contents
```
design_handoff/
├── README.md                  ← this file (master)
├── products/
│   ├── RELIC_WORKBENCH.md      ← full per-screen spec + repo mapping (Next.js)
│   ├── BIOHUB.md               ← screens + repo mapping (Android/Compose)
│   └── SPARK2.md               ← auth gate + repo mapping (Android/Compose)
└── design/
    ├── colors_and_type.css     ← token source of truth (web)
    ├── relic.css               ← web component primitives
    ├── assets/                 ← logo + mark SVGs
    ├── compose/                ← Kotlin/Compose token + component port
    └── ui_kits/
        ├── relic-console/      ← Workbench desktop + mobile prototypes
        ├── biohub/             ← BioHub Android prototype (5 screens + Scale)
        └── spark2-auth/        ← Spark2 auth-gate prototype
```

> To run any prototype: open its `index.html` (or `mobile.html`) directly in a browser. They load React/Babel/Lucide from CDN; no build step.

## Assets & icons
- `design/assets/relic-logo.svg`, `relic-mark.svg` — original RIS marks (swap for real brand marks if any).
- Icons: [Lucide](https://lucide.dev) line set, ~1.75px stroke, `currentColor`; accent color only on active/alert. No emoji. Use the codebase's icon package (`lucide-react` on web, Material icons or a Lucide port on Android).

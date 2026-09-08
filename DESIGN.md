# Tactical Cyber (cyber77) — Agent Handoff Guide

**RIS** design system with active **Tactical Cyber** skin (`data-skin="cyber"`).
Use this document to instruct agents or engineers to build applications using this design system without reinventing any components or styles. Copy and adapt the prompt below.

> Relative paths: this file is at the root of the repository. CSS files are in `css/`, design rules in `GUIDELINES.md`, component specs in `COMPONENTS.md`, icons in `icons/ris-icons.svg`, charts in `js/ris-charts.js`, and visual references in `docs/index.html` (desktop), `docs/mobile.html` (mobile), and `docs/motion-lab.html` (motion & contrast lab).

---

## Ready-to-use Agent Prompt (copy, replace `<APP>`)

> Build `<APP>` using this Relic Interface System design system (RIS with active Tactical Cyber skin). **Do not** invent a new style: use the existing architecture.
>
> Mandatory setup:
> - Link CSS in `css/` **in this exact order**:
>   `ris-tokens.css` → `ris.css` → `ris-fx.css` (optional) → `ris-skin-cyber.css` (LAST).
> - If telemetry charts are used, load `js/ris-charts.js` (`RisCharts.line`, `bars`, `gauge`, `intraday`, `eeg`).
> - Use standard SVG icons from `icons/ris-icons.svg`: `<svg class="ris-icon" aria-hidden="true"><use href="icons/ris-icons.svg#ris-<NAME>"/></svg>` (Tabler Icons MIT base).
> - Root: `<html data-theme="dark" data-brand="vivokey" data-skin="cyber">` (or `data-theme="light"` for technical drafting mode).
> - Body: `<body class="ris ris-grid-bg">`.
>
> **Non-negotiable** rules:
> 1. Use **only** `.ris-*` classes and CSS tokens (`var(--ris-*)`). **Never raw hex**
>    in components; custom CSS allowed only for page-level layout grids.
> 2. Components, anatomy, ARIA, do/don't → follow `COMPONENTS.md`.
>    Core principles (identity, themes, brands, a11y, motion) → `GUIDELINES.md`.
> 3. **WCAG 2.2 AA**: contrast ratios (≥4.5:1), `:focus-visible`, target ≥24px (≥44px on mobile),
>    `prefers-reduced-motion`. **State is never color alone**: always labeled or iconified.
> 4. **Motion System**: 80ms micro-feedback (`:active scale(0.97)`), 140ms hover, 200ms accordion/tabs, 240ms modal/sheet enter. **Never use `ease-in` for entering elements** (use `--ris-ease-out` or `--ris-ease-snap`). No layout reflows (`transform`/`opacity` and CSS Grid only).
> 5. **Strict Real Data**: No dummy lore, fake hashes, or simulated random metrics in telemetry charts. Every readout must bind 1:1 to dataset values or real sensors.
> 6. Layout: topbar + rail (desktop) / `.ris-bottomnav` (<768px). Responsive behavior is mandatory. On mobile (<768px), modals adapt to tactical bottom sheets (`.ris-sheet`), and vertical edge rulers (`.ris-ruler`) must NEVER be used on mobile viewports (prevents OLED subpixel artifact illusion).
> 7. Visual references: `docs/index.html` (desktop), `docs/mobile.html` (mobile shell), and `docs/motion-lab.html` (motion & contrast lab).
>
> Specify required views; start from ready components in `COMPONENTS.md`
> (panel, btn, listrow, table, modal, sheet, acc, toast, radar, tabs, kpi, form, chart, etc.). If an uncovered
> component is required, build it using the same tokens and angular chamfer clips,
> then document it.

---

## Wiring (Web)

```html
<html data-theme="dark" data-brand="vivokey" data-skin="cyber">
<head>
  <link rel="stylesheet" href="css/ris-tokens.css">
  <link rel="stylesheet" href="css/ris.css">
  <link rel="stylesheet" href="css/ris-fx.css">          <!-- optional: boot/glow/holo/radar -->
  <link rel="stylesheet" href="css/ris-skin-cyber.css">  <!-- LAST = tactical cyber aesthetics -->
</head>
<body class="ris ris-grid-bg">
  <a class="ris-skip-nav" href="#main">Skip to main content</a>
  <header class="ris-topbar">...</header>
  <!-- use .ris-* classes and icons from icons/ris-icons.svg -->
  <script src="js/ris-charts.js"></script>              <!-- optional: zero-reflow HUD charts -->
</body>
</html>
```

Remove `data-skin="cyber"` + the final `<link>` → reverts to the disciplined forensic default.

## Theme · Brand · Skin

| Attribute on `<html>` | Values | Effect |
|---|---|---|
| `data-theme` | `dark` (default) · `light` | In Dark mode: high-contrast tactical HUD. In Light mode: technical drafting cyan/slate (`#1b6b80`), eliminating fluorescent glare while retaining cybernetic geometry and WCAG 2.2 AA. |
| `data-brand` | `relic` · `biohub` · `vivokey` · `neutral` (+ `sealed`/`field`/`archive`) | Modifies accent pair only. `vivokey` = red/yellow, `relic` = yellow/cyan, `biohub` = cyan/green. |
| `data-skin` | omitted · `cyber` | `cyber` = Tactical Cyber HUD aesthetics (structural red, glow, scanlines, techno font in dark mode; blueprint cyan/slate in light mode). |

## Do / Don't

- ✅ `.ris-btn--primary`, `.ris-panel`, `.ris-listrow`, `.ris-acc`, `.ris-sheet`, `var(--ris-accent)`, `var(--ris-red)`…
- ✅ Standard icons from sprite: `<svg class="ris-icon" aria-hidden="true"><use href="icons/ris-icons.svg#ris-heart-pulse"/></svg>`.
- ✅ Real telemetry data with zero-reflow interactive scrubbers (`RisCharts.*`).
- ✅ State with label+icon (`.ris-stream`, `.ris-risk`, `.ris-chip`).
- ❌ `style="color:#ff003c"` or hardcoded colors → use tokens.
- ❌ Inventing custom buttons/cards when a `.ris-*` class exists.
- ❌ Emojis in UI, raw external icon fonts, or raster icons.
- ❌ Fabricated dummy lore, fake hashes, or simulated random metrics in charts.
- ❌ Indiscriminate glows: the skin already enables default glow on key chrome; avoid clutter.
- ❌ Edge notch rulers (`.ris-ruler`) on mobile screens (<768px): forbidden to avoid OLED subpixel artifact illusion.

## Notes

- **Not a framework-bound library**: CSS + class contract. In React/JSX use the same classes in `className`. For Android, a complete Jetpack Compose port is available in `compose/` with token, shape, motion, component, and telemetry chart parity (see `compose/README.md`).
- **Repository root layout**: RIS v2.8.0 is organized directly at the root of the repository (`css/`, `js/`, `tokens/`, `icons/`, `docs/`, `compose/`).
- Live specimen: `python3 -m http.server 8080` → `http://localhost:8080/docs/index.html`, `mobile.html`, `motion-lab.html`.
- The cyber skin is an **intentional opt-in** over the forensic default (see `GUIDELINES.md §8`): AA preserved, neons tempered, fully reversible across dark and light themes.

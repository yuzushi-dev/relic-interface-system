# cyber77 — Agent Handoff Guide

**RIS** design system with active **Cyberpunk 2077** skin (`data-skin="cyber"`).
Use this document to instruct agents or engineers to build applications using this design system without reinventing any components or styles. Copy and adapt the prompt below.

> Relative paths: this file is at the root of `cyber77/`. CSS files are in `css/`, design rules in `GUIDELINES.md`, component specs in `COMPONENTS.md`, and visual references in `docs/index.html` (desktop) and `docs/mobile.html` (mobile).

---

## Ready-to-use Agent Prompt (copy, replace `<APP>`)

> Build `<APP>` using the design system in this `cyber77/` directory (RIS with active Cyberpunk 2077 skin). **Do not** invent a new style: use the existing architecture.
>
> Mandatory setup:
> - Link CSS in `cyber77/css/` **in this exact order**:
>   `ris-tokens.css` → `ris.css` → `ris-fx.css` (optional) → `ris-skin-cyber.css` (LAST).
> - Root: `<html data-theme="dark" data-brand="vivokey" data-skin="cyber">`.
> - Body: `<body class="ris ris-grid-bg">`.
>
> **Non-negotiable** rules:
> 1. Use **only** `.ris-*` classes and CSS tokens (`var(--ris-*)`). **Never raw hex**
>    in components; custom CSS allowed only for page-level layout grids.
> 2. Components, anatomy, ARIA, do/don't → follow `cyber77/COMPONENTS.md`.
>    Core principles (identity, themes, brands, a11y) → `cyber77/GUIDELINES.md`.
> 3. **WCAG 2.2 AA**: contrast ratios, `:focus-visible`, target ≥24px,
>    `prefers-reduced-motion`. **State is never color alone**: always labeled or iconified.
> 4. Layout: topbar + rail (desktop) / `.ris-bottomnav` (<768px). Responsive behavior is mandatory.
> 5. Visual references: `cyber77/docs/index.html` and `cyber77/docs/mobile.html`.
>
> Specify required views; start from ready components in `COMPONENTS.md`
> (panel, btn, listrow, table, modal, tabs, kpi, form, etc.). If an uncovered
> component is required, build it using the same tokens and angular chamfer clips,
> then document it.

---

## Wiring (Web)

```html
<html data-theme="dark" data-brand="vivokey" data-skin="cyber">
<head>
  <link rel="stylesheet" href="css/ris-tokens.css">
  <link rel="stylesheet" href="css/ris.css">
  <link rel="stylesheet" href="css/ris-fx.css">          <!-- optional: boot/glow/holo -->
  <link rel="stylesheet" href="css/ris-skin-cyber.css">  <!-- LAST = CP2077 aesthetics -->
</head>
<body class="ris ris-grid-bg">
  <!-- use .ris-* classes -->
</body>
</html>
```

Remove `data-skin="cyber"` + the final `<link>` → reverts to the disciplined forensic default.

## Theme · Brand · Skin

| Attribute on `<html>` | Values | Effect |
|---|---|---|
| `data-theme` | `dark` (default) · `light` | cyber skin applies to **dark only** |
| `data-brand` | `relic` · `biohub` · `vivokey` · `neutral` (+ `arasaka`/`militech`/`edgerunners`) | modifies accent pair only. `vivokey` = red/yellow (most CP) |
| `data-skin` | omitted · `cyber` | `cyber` = Cyberpunk 2077 aesthetics (structural red, glow, scanlines, techno font) |

## Do / Don't

- ✅ `.ris-btn--primary`, `.ris-panel`, `.ris-listrow`, `var(--ris-accent)`, `var(--ris-red)`…
- ✅ State with label+icon (`.ris-stream`, `.ris-risk`, `.ris-chip`).
- ❌ `style="color:#ff003c"` or hardcoded colors → use tokens.
- ❌ Inventing custom buttons/cards when a `.ris-*` class exists.
- ❌ Indiscriminate glows: the skin already enables default glow on key chrome; avoid clutter.

## Notes

- **Not a framework-bound library**: CSS + class contract. In React/JSX use the same classes in `className`. For Android, a complete Jetpack Compose port is available in `compose/` (`Color.kt`, `Shape.kt`, `Type.kt`, `Theme.kt`, `Components.kt`, `Charts.kt`).
- Directory renamed `ris`→`cyber77` (2026-06-30): internal filenames (`ris-tokens.css`, `.ris-*` classes, `data-skin`) **remain unchanged**.
- Live specimen: `cd cyber77 && python3 -m http.server 8080` → `http://localhost:8080/docs/`.
- The cyber skin is an **intentional opt-in** over the forensic default (see `GUIDELINES.md §8`): AA preserved, neons tempered, fully reversible.

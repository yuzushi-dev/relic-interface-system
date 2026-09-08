# RIS v2 — Guidelines

Principles of the Relic Interface System. Applies to Web (css/), Android (compose/), and
any new target platforms. Tokens are the single source of truth
(`tokens/ris.tokens.json` ↔ `css/ris-tokens.css` ↔ `compose/Color.kt`): never
hardcode hex values in components.

## 1. Identity

- **Graphite, never pure black.** Surface stack `#060708 → #232c33`; structure is
  provided by 1px hard borders, never fuzzy drop-shadows.
- **Clipped corners, never rounded.** Radius 0; 45° corner cuts: 6px (chip/input/btn),
  10px (panel), 16px (modal/hero).
- **Accent = Meaning.** Sodium amber: active/CTA/pending. Steel ice: data/links/scan.
  Red: danger/blocked. Green: online/approved. Violet: inference.
  Orchid: Gumi runtime. Orange: corrections. An accent that carries no semantic meaning
  must not be used.
- **Forensic / Archival Tool Palette**: cold and precise data colors, a single confident
  warm accent (sodium amber `#e6a23c`), steel ice `#6fb3c9` for telemetry,
  red `#d45565` — used as *fills*; contextual variants are AA-calibrated per theme.
  No oversaturated neon: recognition stems from rigor, not genre cliches.
- **Glow = Exception, not default.** State is signaled through contrast + border weight
  (`--ris-line*`, `--ris-accent-line`), not luminescence. A single sanctioned glow utility:
  `--ris-live` for genuinely critical/live states (e.g., active sensor acquisition).
  Glow utilities (`.ris-glow-text/-border`, `.ris-pulse-glow`) remain opt-in and are
  never applied by default components.
- **Restrained textures**: 32px grid on background, scanlines only on hero/modal surfaces.
  Never behind dense data copy.
- **Motion System (Kiroshi Tactical HUD + Emil Kowalski)**:
  1. *Layer-bound timing tokens*: 80ms micro-feedback (`:active scale(0.97)`), 140ms hover/switch, 200ms accordion/tabs, 240ms modal/sheet enter.
  2. *No `ease-in` for entering elements*: users expect immediate responsiveness; always use `--ris-ease-out` (`cubic-bezier(0.22, 1, 0.36, 1)`) or `--ris-ease-snap` (`cubic-bezier(0.16, 1, 0.3, 1)`).
  3. *Composited-only properties*: animate only `transform` and `opacity`. For accordions and disclosures use CSS Grid (`grid-template-rows: 0fr → 1fr`) avoiding layout reflows (`height`) at 60fps.
  4. *Mobile Ergonomics*: `@media (hover: hover)` prevents "sticky hover" on touchscreens; touch targets ≥44px; modals adapt to Bottom Sheets (`.ris-sheet`) with tactical handles and lightweight native touch gestures.
  5. *Light Mode drafting*: continuous ambient effects in Light Mode utilize low-opacity slate/cyan (10-15%) technical blueprint styling to safeguard optical comfort.
- **Typography**: Archivo (display + body, instrument-grade grotesk), JetBrains
  Mono (telemetry/values). 11px floor reserved for metadata only.

## 2. Themes

- Dark is default (omitted `data-theme` or `"dark"`). Light: `data-theme="light"`.
- Components reference ONLY contextual tokens (`--ris-cyan`, `--ris-fg2`…): the appropriate theme resolves automatically.
- Saturated fills: `--ris-X-fill` + text `--ris-fg-invert` (identical across both themes — yellow CTA remains yellow).
- Never mix: a component must never reference tokens belonging to the opposite theme.

## 3. Brand

`data-brand` on `<html>`: modifies only `--ris-accent*` and `--ris-accent-2*`.

| Brand | Primary | Secondary | Purpose |
|---|---|---|---|
| `relic` (default) | yellow | cyan | research workbench, command surfaces |
| `biohub` | cyan | green | biofeedback, health telemetry |
| `vivokey` | red | yellow | authentication, possession factor, implants |
| `neutral` | violet | cyan | general purpose / third-party projects |

*Semantic* colors (danger, success, stream…) never vary with brand.

### Case-Context Skins (Full Skins)

In addition to product brands, three full skins exist for evidentiary handling contexts —
they alter accent **and** surface tint (in dark mode only; in light mode only AA ink accents adapt).
The `data-brand` keys remain stable for backwards compatibility:

| Key (`data-brand`) | Context | Surfaces (dark) | Accent | Accent-2 |
|---|---|---|---|---|
| `arasaka` → "sealed" | sealed dossier — chain of custody | cold graphite with purple tint | red `#d45565` (ctx `#cf5e6b`) | steel ice `#6fb3c9` |
| `militech` → "field" | field gathering — annotation | warm anthracite | sodium amber `#d99a4a` | olive `#9fae6b` |
| `edgerunners` → "archive" | night archive — cross-reference | purple graphite | orchid `#b274c0` (ctx `#be7ecf`) | steel ice `#6fb3c9` |

Styling direction relies on contrast and borders, never excess glows: sealed = evidentiary austerity (red brackets, dense sobriety); field = field density (segmeter, stepper, annotation chips); archive = archival depth (orchid accents on purple graphite).

## 4. Accessibility (WCAG 2.2 AA — Non-negotiable)

- **Contrast**: every contextual token is ≥4.5:1 against `bg` and `surface-1..3` of its theme (verified; see table in AUDIT/specimen). `--ris-fg4` sits below threshold *by design*: placeholder/disabled only, never informative content.
- **1.4.1 Use of Color**: state is never conveyed by color alone — always paired with an adjacent label or icon.
- **2.4.7 Focus Visible**: 2px `--ris-focus-ring` via `:focus-visible`, 2px offset. Never remove it; custom overrides must maintain ≥3:1 against background.
- **2.5.8 Target Size**: buttons ≥36px, form controls: the entire label is interactive (min-height 24px). Mobile bottom-nav items ≥44px.
- **2.3.3 / Motion**: all motion transitions deactivate under `prefers-reduced-motion: reduce`. Flashes remain strictly below 3 flashes per second (conforming with 2.3.1).
- **2.4.1 Bypass Blocks**: `.ris-skip-nav` as the first child of `<body>`.
- **4.1.2**: ARIA patterns documented per component in `COMPONENTS.md` (dialog, tablist, meter, switch, sort…).
- **1.4.4 Resize**: layout remains fluid; supports 200% zoom without clipping or loss of functionality.
- Minimum release checklist: complete keyboard tab walk, screen reader spot check (NVDA/TalkBack), 200% zoom test, both themes verified.

## 5. Responsive Layout

- Primary layout breakpoint: **768px**.
  - ≥768px: 52px topbar + 64px left rail (`.ris-rail`), max 1280px content container.
  - <768px: rail hidden, sticky 60px bottom navigation (`.ris-bottomnav`) with safe-area insets.
- Grids: `.ris-grid--2/3/4` collapse automatically at 1024px and 640px.
- Dense tables: wrapped in `.ris-table-wrap` for horizontal scroll without breaking layouts.
- Touch ergonomics: no hover-only behaviors on touch viewports.

## 6. Icons

- Native sprite `icons/ris-icons.svg`: 24×24, 1.75 stroke, square caps, angular geometry. Always `currentColor`.
- Decorative: `aria-hidden="true"`. Informative: `role="img"` + `<title>`.
- Accent color applied only to active/alert states; default is `--ris-fg2/fg3`.
- No emojis in UI. Tabler Icons (MIT) form the canonical open-source base.

## 7. Writing a New Component

1. Tokens only; zero magic numbers.
2. Required states: default, hover, focus-visible, active, disabled (+ selected/invalid where applicable).
3. Verify across 2 themes × 4 brands.
4. Verify contrast and target sizes per §4.
5. Document in `COMPONENTS.md` (anatomy, ARIA, do/don't) and add specimen demo.
6. Track in `CHANGELOG.md`.

## 8. Skin `cyber` — Intentional Exception to De-Slop

`data-skin="cyber"` + `css/ris-skin-cyber.css` (loaded **last**) re-applies the Cyberpunk 2077 look & feel as an **opt-in layer** over the forensic baseline without altering its core. It is an explicit design choice: where §1 prescribes restrained palettes, the skin intentionally introduces structural red and glowing accents. The discipline remains intact:

- **WCAG AA remains mandatory** (§4): neons are calibrated for ≥4.5:1 on near-black; state remains paired with text/icons.
- **Dual Theme Support (Dark + Light)**: in Dark mode, applies high-contrast Kiroshi crimson/yellow HUD aesthetic; in Light mode, adapts into a technical architectural drafting cyan/slate palette (`#1b6b80` / `#165868`) with 10-15% ambient opacity, preserving optical comfort without neon glare.
- **Fully reversible**: everything is scoped to `[data-skin="cyber"]`; removing the attribute reverts to the disciplined baseline.
- **Static textures**: scanlines and grain are static background layers, not animation loops → reduced-motion safe by design.

When to use: products or views explicitly demanding full cyberpunk immersion.
When not: tools requiring sterile or archival sobriety.

## 9. Mobile Safety & OLED Display Guidelines

On handheld devices (<768px or native mobile apps), strict rules prevent optical distortions on high-density OLED / AMOLED panels:

1. **Strict Prohibition of Edge Rulers on Mobile Viewports (`.ris-ruler`)**:
   - 1px vertical edge notch rulers (`.ris-ruler--left`, `.ris-ruler--right`) are intended **strictly** for widescreen desktop monitors or cinematic HUD staging.
   - On high-density mobile OLED screens (400–500+ ppi), edge notch lines create an illusion of **dead subpixels, panel cracking, or digitizer failure**.
   - Mandatory rule: on mobile viewports (<768px in CSS and all native mobile apps), `.ris-ruler` must ALWAYS be set to `display: none` or omitted.
2. **No Fixed Tickers Overlapping System Gestures**:
   - `.ris-ticker` must be positioned above the bottom navigation bar or omitted to avoid interfering with system navigation handles (Android/iOS home pills).
3. **Scrollable SubTabs (`.ris-subtabs--scrollable`)**:
   - Segmented buttons must never compress labels below the minimum touch target (44px / 48dp). When exceeding 3 options, always utilize scrollable mode.

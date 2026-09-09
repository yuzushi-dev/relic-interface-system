# Changelog — RIS

## 2.8.0 — 2026-09-08

- **Tactical Scrubber & Real Telemetry (`ris-charts.js`)**:
  - HUD telemetry powered by 100% real data: real-time readout of values with units (`bpm`, `steps`, `pts`), formatted `HH:MM` timestamps, baseline delta (`Δ +22`), and conditional alerts (`[PEAK ALERT]`, `[MAX PEAK]`).
  - Zero-reflow architecture (60fps): coordinates projected via inverse screen CTM (`svg.getScreenCTM().inverse()`), zero DOM nodes allocated or destroyed during pointermove/touchmove events.
  - Keyboard accessibility & WCAG 2.2 AA: interactive arrow key navigation (Left/Right, `Home`, `End`, `Escape`), live `aria-valuenow` and `aria-valuetext` updates, verified contrast across dark and light themes.
  - Continuous 4.5s phosphor micro-sweep via native SVG `<animateTransform>`, automatically suspended during active scrubbing or hovering.
  - Viewport scroll entrance trigger via `IntersectionObserver` and public `RisCharts.replay()` API.
  - Interactive specimen controls: Animation replay and continuous heartbeat live telemetry streaming simulator.
- **Open-Source Icon Integration (Tabler Icons MIT)**:
  - Migrated to 132 Tabler icons (generic + biofeedback/medical) with consistent 1.75 stroke and 24×24 grid.
  - Inlined unified SVG sprite directly into documentation templates to eliminate network latency and CORS anomalies.
  - Fixed CSS closing brace defects in `ris.css` and `ris-skin-cyber.css` that inhibited responsive rules.
- **RIS Motion System (Tactical HUD Forensic)**:
  - Standardized physical timing tokens (`--ris-dur-instant: 80ms`, `--ris-dur-fast: 140ms`, `--ris-dur-base: 200ms`, `--ris-dur-enter: 240ms`) and hybrid easing curves.
  - Physical `:active` micro-punch on buttons (scale 0.97) and Invert Highlight with 14:1 AAA contrast.
  - Zero-reflow CSS Grid accordion disclosure (`grid-template-rows: 0fr → 1fr`).
  - Cascading Sonner-style HUD toast stack.
  - Tactical mobile bottom sheet with native touch drag handle (35% release threshold) and horizontal Master-Detail push transitions.
  - Calibrated Light Mode cyber skin with technical drafting cyan ink for prolonged optical comfort.

## 2.7.0 — 2026-09-03

- **JSON Token Alignment (`ris.tokens.json`)**: introduced `skin.cyber` branch in official design tokens to explicitly model the tactical cyberpunk palette (dark crimson surfaces, structural red lines, saturated accents, Chakra Petch font).
- **Complete Jetpack Compose Port (`compose/`)**:
  - `Color.kt`: added `RisCyberSkin` aligned with skin tokens.
  - `Shape.kt`: native 45° chamfer cuts (`risClip`, `risClipMirror`, `RisClipSm/RisClip/RisClipLg`).
  - `Type.kt`: typography styles with system font fallbacks.
  - `Theme.kt`: `RisTheme` and `cyberBackdrop` modifier.
  - `Components.kt`: canonical primitives `RisButton` (4 variants with cyber glow), squared `RisTextField`, `RisSubTabs` (including scrollable option), `RisProgressBar` (continuous neon canvas ribbon), `RisPanel`, `RisMeter`, `RisChip`.
  - `Charts.kt`: native Canvas charts `RisLineChart` and `RisTimeSeriesChart` with dynamic day-stride calculation to prevent label overlap.
- **Web Components**:
  - Linear progress bar `.ris-progress` (determinate + indeterminate sliding ribbon) in `css/ris.css` and `css/ris-skin-cyber.css`.
  - Scrollable subtabs variant `.ris-subtabs--scrollable` for mobile viewports (<768px).
  - Extracted `.ris-listrow` and `.ris-stat` classes into core `ris.css` with thematic styling in `ris-skin-cyber.css`.
- **Mobile OLED Safety Guidelines**:
  - Formalized in `GUIDELINES.md §9` the prohibition of full-height edge rulers (`.ris-ruler`) on mobile OLED screens to avoid burn-in and optical artifacts.

## 2.6.0 — 2026-06-30

- **Active / live state animations** in `css/ris-fx.css`: `.ris-rec` (recording, pulsing red dot), `.ris-acquiring` (live acquisition, breathing border), `.ris-playing` (4-bar equalizer), `.ris-scan` (scanning/connection sweep). Motion is always an enhancement (accompanied by label/icon, never color alone — WCAG 1.4.1); each features static fallback under `prefers-reduced-motion`. Demo in FX specimen section. Documented in COMPONENTS.md §FX.

## 2.5.1 — 2026-06-30

- **Responsive / mobile `cyber` skin**: `@media (max-width:767px)` block in `ris-skin-cyber.css` — hidden rulers, ticker repositioned above bottomnav, `background-attachment:scroll` (eliminates iOS jank), glowing bottomnav with red accent, compact list-row (56px thumb), `.ris-stat` with value and short meter. Mobile app-shell demo `docs/mobile.html`.
- **Comprehensive Mobile Specimen**: added responsive `.ris-bottomnav` (visible <768px) to `docs/index.html`. Topbar overflow safeguards below 700px.

## 2.5.0 — 2026-06-30

- **Skin `data-skin="cyber"`** (`css/ris-skin-cyber.css`): Tactical cyberpunk HUD look & feel as an **opt-in layer**, loaded last over the forensic baseline. Dark mode only. Features:
  - Re-saturated neon palette tempered for **WCAG AA** on near-black (red `#ff003c` fill / `#ff4d62` text, cyan `#00e5ff`/`#3df0ff`, green `#00e57e`, yellow `#ffe23a`); **structural red** lines (`--ris-line*`); red-tinted near-black surfaces; crimson-to-black gradient + scanlines + grain.
  - **Default glow** on key chrome: topbar line, solid selection fill, primary button, brackets. Display font → **Chakra Petch**.
  - Opt-in decorative chrome: `.ris-serial`, `.ris-hex`, `.ris-binary`, `.ris-ruler`, `.ris-ticker`.
  - New skin-scoped components: `.ris-listrow` (thumb + title + meta + timestamp), `.ris-stat` (LEVEL/TRUST RANK topbar stat).
- **Specimen**: "Skin: Cyber" topbar toggle + dedicated specimen section. Documented in GUIDELINES §7.

## 2.4.1 — 2026-06-17

- **Light theme contrast fix for `.ris-btn--primary`**: introduced `--ris-on-accent` (#07090a, dark across both themes) to guarantee WCAG compliance on bright accent fills.

## 2.4.0 — 2026-06-17

- **Brand/Social Icons**: added `ris-mail`, `ris-linkedin`, `ris-github`, `ris-medium` glyphs to sprite. Documented in COMPONENTS.md §Icons.

## 2.3.0 — 2026-06-11

- **`RisCharts.eegWaveform(el, channels, opts)`**: multi-channel real-data EEG waveform (per-channel trace, DC offset removed, neon stroke + glow). Distinct from synthetic `wave`. Android port in `ui/theme/Charts.kt`.

## 2.2.0 — 2026-06-11

- **`RisCharts.intraday(el, points, opts)`**: intraday trend chart (hourly axis, baseline median±range band, square red peak markers above threshold). Respects `prefers-reduced-motion`.

## 2.1.0 — 2026-06-11

- **Case-context themes** `data-brand="sealed|field|archive"`: full case-context skins (accent + tinted surfaces in dark, AA ink in light).
- **Advanced components**: accordion (native details), stepper/wizard, slide drawer, command palette, upload dropzone.

## 2.0.0 — 2026-06-11

Evolution from handoff kit to full design system. See `AUDIT.md` for full rationale.

### Breaking
- Palette aligned with high-contrast tactical cyber colors: yellow `#fcee0a`, cyan `#00f0ff`, red `#ff003c` (fill) / `#ff4066` (dark contextual), green `#00e57e`, violet `#9a5cff`, magenta `#ff42c8`, orange `#ff9230`.
- Renamed CSS files: `colors_and_type.css→css/ris-tokens.css`, `relic.css→css/ris.css`.
- Deprecated `--ris-amber*` in favor of `--ris-yellow*`.

### New
- **Light theme** `[data-theme="light"]` — AA-safe ink accents, persistent bright fills.
- **Brand layer** `[data-brand="relic|biohub|omnikon|neutral"]`.
- **W3C Design Tokens** (`tokens/ris.tokens.json`).
- **Complete component catalog**: form controls, table, modal, toast, alert, tabs, tooltip, breadcrumb, pagination, KPI, skeleton, empty, kbd/code, avatar, badge-count, responsive shell.
- **Native SVG icon sprite** (Tabler Icons MIT base).
- **A11y baseline**: verified ≥4.5:1 contrast, `:focus-visible`, `prefers-reduced-motion`, skip-nav.
- **FX layer** (`css/ris-fx.css`).
- **Zero-dependency SVG charts** (`js/ris-charts.js`).

## 1.0.0 — 2026-05 (design_handoff)
Original handoff kit: dark tokens, web primitives, initial Compose port, prototypes.

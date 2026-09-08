# RIS v2 — Components Reference

Component usage guide. Each component details: classes, anatomy, required ARIA attributes, implementation notes.
Live specimen: `docs/index.html` (serve the `cyber77/` directory via HTTP).

## Layout Chrome

| Class | Role | Notes |
|---|---|---|
| `.ris-topbar` | Fixed 52px status bar | `<header>`; contains brand, context, global actions |
| `.ris-rail` | Desktop 64px rail | `<nav aria-label>`; hidden on viewports <768px |
| `.ris-bottomnav` | Mobile 60px nav | visible only on <768px; items = `.ris-nav-link`, ≥44px |
| `.ris-nav-link` | Nav item | active: `data-active="true"` or `aria-current="page"` |
| `.ris-shell-content` | Content stage | padding offsets topbar/rail/bottomnav |

## Containers

- **`.ris-panel`** (+`--2`, `--flat`, `--accent`) — anatomy: `.ris-panel-head` /
  `.ris-panel-body` / `.ris-panel-foot`. Head with `.ris-h3` or `.ris-label`.
- **`.ris-bracket`** — accent corner L-brackets on `position:relative` elements. Used to highlight max 1 item per view.
- **`.ris-grid--2/3/4`** — responsive grids; **`.ris-row`/`.ris-stack`/`.ris-wrap`** flex utilities.

## Buttons `.ris-btn`

Variants: `--primary` (accent fill, 1 per view), `--secondary` (accent-2 outline),
default (graphite), `--ghost`, `--danger`. Sizes: `--sm` 28px, default 36px,
`--lg` 46px, `--icon` (square; requires `aria-label`), `--block`.
Disabled: `disabled` attribute (never class alone). Loading: pair with `.ris-spinner`
bearing `role="status"`.

## Chips and State

- `.ris-chip` + `--accent|yellow|cyan|red|green|violet|magenta|orange`; optional dot `<i class="dot">`.
- `.ris-stream[data-stream="evidence|inference|pending|approved|blocked|gumi|runtime|correction|neutral"]` — provenance tag.
- `.ris-risk[data-risk="none|low|medium|high"]`.
- `.ris-badge-count` (+`--danger`) — counters; for notifications include sr-only text.
- Strict rule: chip copy declares the state; color merely reinforces it.

## Forms

Wrapper **`.ris-field`**: `<label for>` always present and visible;
help text `.ris-field-help`; error text `.ris-field-error` + `data-invalid` on field +
`aria-invalid` and `aria-describedby` on input.

| Control | Class | ARIA / Notes |
|---|---|---|
| Text | `.ris-input` | — |
| Search | `.ris-search` > svg + `.ris-input` | `aria-label` when unlabelled |
| Select | `.ris-select` | native, custom chevron |
| Textarea | `.ris-textarea` | vertical resize |
| Checkbox | `label.ris-checkbox > input[type=checkbox]` | label = hit target (≥24px) |
| Radio | `label.ris-radio > input[type=radio]` | diamond clip; same hit target pattern |
| Switch | `label.ris-switch > input[type=checkbox][role=switch]` | on = accent |
| Slider | `input[type=range].ris-slider` | display live numeric value adjacent to label |

## Tables `.ris-table`

Wrapper `.ris-table-wrap` (horizontal scroll, optional max-height for sticky head).
Sortable `th`: `aria-sort="ascending|descending"`. Numeric cells: `num` class
(monospace, tabular nums, right aligned). Selected row: `data-selected="true"`.

## Overlays

- **Modal**: `.ris-modal-backdrop` > `.ris-modal[role=dialog][aria-modal=true][aria-labelledby]`
  with head/body/foot. Dismiss: Esc key, backdrop click, button with `aria-label`.
  Focus trap handled by application (or native `<dialog>`).
- **Toast**: stack `.ris-toast-stack[role=status][aria-live=polite]`;
  item `.ris-toast` + `--success|warning|danger`, title `.title`. Auto-dismiss ≥4s.
- **Inline Alert**: `.ris-alert` + variants; icon + `.title` + message copy.
- **Tooltip**: `.ris-tip[data-tip]` — renders on hover AND focus-visible; supplementary text only, never critical copy.
- **Menu**: `.ris-menu` > `.ris-menu-item` (+`--danger`), separator `.ris-menu-sep[role=separator]`.
  For interactive dropdowns: `role="menu"/"menuitem"` + arrow key handling managed by application.

## Secondary Navigation

- **Tabs**: `.ris-tabs[role=tablist]` > `.ris-tab[role=tab][aria-selected]`.
- **Subtabs** (segmented): `.ris-subtabs` same pattern; `.ris-subtabs--scrollable` for horizontal scrolling on narrow viewports (<768px).
- **Breadcrumb**: `nav.ris-breadcrumb[aria-label]`; current page `aria-current="page"`.
- **Pagination**: `nav.ris-pagination`; current page `aria-current="page"`; prev/next with `aria-label`.

## Data and Telemetry

- **KPI** `.ris-kpi`: `.kpi-label` + `.kpi-value` (+`small` unit) + `.kpi-delta.up/.down`.
  Per-metric accent: `--ris-kpi-accent`.
- **Progress bar** `.ris-progress`: continuous linear cyber bar; determinate (`> .bar` with % width) or indeterminate (`.ris-progress--indeterminate > .bar` with continuous ribbon sweep). Replaces Material circular spinners.
- **Meter** `.ris-meter` / **SegMeter** `.ris-segmeter`: `role="meter"` +
  `aria-valuenow/min/max` + `aria-label`.
- **Confidence** `.ris-conf--high|medium|low`.
- **Facet** `.ris-facet`: head (name+stat), row (anchor/track/needle), conf.
- **List row** `.ris-listrow`: horizontal card with `.thumb`, `.body`, `.title`, `.meta`, `.time` (selection: `data-selected="true"`).
- **HUD Stat** `.ris-stat`: compact numeric value `.v` with label `.n` and `.ris-segmeter` for topbar/header.
- **Log** `.ris-log` (span `.t/.ok/.warn/.err`), **Code** `.ris-code`, **Kbd** `.ris-kbd`.

## Advanced Components

- **Accordion** `.ris-accordion` > native `<details>/<summary>` + `.body` — built-in keyboard accessibility and semantics; open = left accent indicator.
- **Stepper** `.ris-stepper` > `.ris-step[data-state="done|active|"]` with
  `.bar` + `.name[data-n]`. For multi-step wizard flows.
- **Drawer** `.ris-drawer[data-open]` + `.ris-drawer-backdrop` —
  `role="dialog" aria-modal` + dismiss via Esc/backdrop identical to modal dialogs.
- **Command palette** `.ris-cmdk` (input + `.ris-cmdk-list` > `.ris-cmdk-item`) —
  selection `aria-selected`; arrow key navigation managed by application.
- **Dropzone** `.ris-dropzone[data-drag]` — `role="button"` + `tabindex="0"`,
  format/size constraints indicated in `.hint`.

## Loading and Empty Feedback

- **Skeleton** `.ris-skeleton` (shimmer; static under reduced-motion).
- **Empty** `.ris-empty`: icon + `.title` + message copy + action CTA.
- **Spinner** `.ris-spinner` with `role="status"` + `aria-label`.

## Charts (`js/ris-charts.js`)

SVG, zero dependencies, RIS aesthetic (hard grid, neon stroke + glow, square markers,
monospace labels). All animations respect `prefers-reduced-motion`.
A chart is decorative: ALWAYS provide an adjacent textual or tabular alternative;
`opts.label` becomes the summarizing `aria-label`.
All charts support 100% real data Tactical HUD telemetry, interactive tactical scrubber
(mouse hover, touch drag, keyboard arrows), and continuous 4.5s phosphor micro-sweep
triggered on viewport scroll.

| Function | Purpose | Key Options |
|---|---|---|
| `RisCharts.line(el, points, opts)` | Time series (HR, weight…) with tactical scrubber | `unit`, `categories`, `color`, `area`, `gridX/Y`, `interactive`, `ambientSweep`, `animate` |
| `RisCharts.bars(el, values, opts)` | Category counts with column focus overdrive & HUD callout | `unit`, `categories`, `color`, `highlight`, `gap`, `interactive`, `ambientSweep`, `animate` |
| `RisCharts.spark(el, points)` | Inline 96×28 sparkline (compact, non-interactive) | same as line |
| `RisCharts.gauge(el, value01, opts)` | Segmented HUD gauge with active breathing pulse | `segments`, `caption`, `unit`, `interactive` |
| `RisCharts.wave(el, opts)` | Continuous animated EEG waveform (RAF) | `freq`, `amp`, `animate:false` for static |
| `RisCharts.bands(el, bands, opts)` | EEG bands / animated horizontal bars | `[{name,value,color}]`, `animate` |
| `RisCharts.eegWaveform(el, channels, opts)` | Multi-channel real-data EEG waveform (live EEG) | `[[v,…],…]`, `colors`, `width`, `height` |
| `RisCharts.intraday(el, points, opts)` | Daily trend with baseline band, peak markers & HUD scrubber | `[{t,v}]`, `baseline:{median,lo,hi}`, `peakThreshold`, `unit`, `hourStep`, `color`, `interactive` |
| `RisCharts.replay(elOrSvg)` | Replays entrance animations on command | accepts SVG or container element |

## FX — Glitch / CRT (`css/ris-fx.css`)

Optional, decorative, opt-in layer. Rules: max **1 hero glitch per view**;
CRT on shell/panel, never behind dense copy; FX never conveys state or meaning
(WCAG 1.4.1); all FX deactivate or degrade to static under reduced-motion.

| Class | Effect |
|---|---|
| `.ris-glitch[data-text]` | RGB split + slice jitter (≤3 flashes/s — 2.3.1) |
| `.ris-glitch--hover` | Glitch on hover only (0.45s one-shot) |
| `.ris-crt` (+ child `.ris-crt-band`) | RGB phosphors + scanlines + vignette + sweep band |
| `.ris-noise` | Analog static noise (SVG turbulence) for no-signal/empty states |
| `.ris-signal-lost` | Horizontal jitter + chroma tear for error states |
| `.ris-boot` | Staggered children reveal (power-on sequence) |
| `.ris-poweron` | CRT power-on flash (one-shot) |
| `.ris-glow-text` / `--2` / `.ris-glow-border` | Accent phosphor glow |
| `.ris-pulse-glow` | Neon breathing pulse (armed/listening) |
| `.ris-caret` | Blinking terminal cursor |
| `.ris-data-updated` | Row/cell flash on data refresh (toggled via JS) |
| `.ris-holo` | Holographic shimmer for brand marks |

**Active / live states** — motion **always** accompanies a label or icon (never color alone,
WCAG 1.4.1); static fallback recognizable under reduced-motion.

| Class | State | Markup |
|---|---|---|
| `.ris-rec` | recording | `<span class="ris-rec">Rec · 00:42</span>` (pulsing red dot via `::before`) |
| `.ris-acquiring` | live acquisition | on `.ris-panel` → breathing border (glow in/out) |
| `.ris-playing` | streaming playback | `<span class="ris-playing"><i></i><i></i><i></i><i></i></span>` (equalizer) |
| `.ris-scan` | scanning/connection | on container → vertical sweep beam (requires `overflow:hidden`) |

## Icons (Tabler Icons · MIT License)

The system iconographic set is built on the open-source **Tabler Icons** library (pure MIT License, 24×24px grid, `stroke: currentColor; stroke-width: 1.75; stroke-linecap: round; stroke-linejoin: round;`).
Ensures geometric precision, professional vector rendering, and optical consistency across HUDs, telemetry, and mobile interfaces.

`<svg class="ris-icon" aria-hidden="true"><use href="icons/ris-icons.svg#ris-NAME"/></svg>`
Sizes: `--sm` 14px, default 18px, `--lg` 24px, `--xl` 32px.
Complete set of 132 icons: generic (nav, actions, state, system, connectivity, charts) +
biofeedback (`heart`, `heart-pulse`, `ecg`, `hrv`, `pulse`, `bp`, `blood-drop`,
`spo2`, `brain`, `eeg`, `meditation`, `stress`, `focus`, `sleep`, `bed`, `lungs`,
`respiration`, `wind`, `steps`, `run`, `walk`, `flame`, `vo2`, `pai`, `dumbbell`,
`scale`, `body`, `bia`, `muscle`, `bone`, `water`, `temperature`, `dna`, `pill`,
`stethoscope`) + devices/implants (`nfc`, `implant`, `chip-card`, `hand-chip`,
`watch`, `sensor`, `scan`, `fingerprint`).

**Brand / Social**: `mail` (stroke glyph) + solid marks `linkedin`,
`github`, `medium` — solid logos override sprite defaults with
`fill="currentColor" stroke="none"`. Use **only** for links navigating to those
platforms (never as generic decoration).

## Skin `cyber` (`css/ris-skin-cyber.css`, opt-in)

Active with `data-skin="cyber"` on `<html>` + `<link>` loaded **last**.
Supports both Dark HUD and Light drafting themes. See GUIDELINES §8 (intentional opt-in over de-slop, AA preserved).

**Skin-scoped components:**
- `.ris-listrow` — list row with `.thumb` (img/box 84×48) + `.body` (`.title`
  display/cyan + `.meta` mono/red) + `.time`. Selection: `data-selected="true"`
  → **solid fill** + inverted text. Reference: Load Game / Contacts / Inventory.
  For navigable lists use `role="listbox"`/`option` + `aria-selected` in markup.
- `.ris-stat` — topbar stat: `.v` (value display/cyan) + `.n` (label/green) +
  `.ris-segmeter` (segmented meter). Always assign `aria-label` to the meter.

**Decorative utilities** (pure decor → `aria-hidden="true"`):
- `.ris-serial` — device serial codes (`<b>` for illuminated portion). E.g. `PROTOCOL 6520-A44`.
- `.ris-hex` — hex dump block (use `<pre>`).
- `.ris-binary` — vertical binary stream for viewport corners.
- `.ris-ruler` + `--left`/`--right` — fixed edge notch rulers on desktop viewport margins.
- `.ris-ticker` — fixed monospace telemetry block (bottom-left default).

**Automatic overrides** (no additional classes required): topbar with red
glow line, `.ris-btn--primary` with accent glow, solid table row selection, `.ris-tip` with
yellow border, red `.ris-panel`/`.ris-bracket`, cyan glow on input focus.

**Mobile** (`@media ≤767px`): base system switches to topbar + `.ris-bottomnav`;
the skin hides `.ris-ruler`, elevates ticker above navigation bar, applies red glow
line to bottomnav, compacts `.ris-listrow` and `.ris-stat`, and switches to
`background-attachment:scroll` (prevents iOS repaint jank). Demo: `docs/mobile.html`.

## Motion System & Animated Components (v2)

Integration of Tactical Cyber HUD aesthetic + Emil Kowalski motion engineering (zero reflow, 60fps, WCAG 2.2 AA).

### 1. Accordion Disclosure (`.ris-acc`)
Transition via **CSS Grid (`grid-template-rows: 0fr → 1fr`)** in 200ms (`--ris-dur-base`) with `--ris-ease-out`:
```html
<div class="ris-acc">
  <div class="ris-acc-item" data-open="false">
    <button class="ris-acc-trigger" aria-expanded="false" onclick="this.setAttribute('aria-expanded', this.getAttribute('aria-expanded')==='true'?'false':'true'); this.parentElement.setAttribute('data-open', this.getAttribute('aria-expanded'))">
      <span>[ PART 01 ] // ENCRYPTED CHANNEL</span>
      <span class="ris-acc-chevron">▼</span>
    </button>
    <div class="ris-acc-drawer">
      <div class="ris-acc-body">
        <div class="ris-acc-body-inner">Zero reflow fluid disclosure.</div>
      </div>
    </div>
  </div>
</div>
```

### 2. Mobile Bottom Sheet (`.ris-sheet`)
Replaces centered modals on viewports `<768px`. Slides from bottom (`translateY(100%) → translateY(0)`) in 240ms (`--ris-dur-enter` with `--ris-ease-out`):
```html
<div class="ris-sheet-backdrop">
  <div class="ris-sheet">
    <div class="ris-sheet-handle"></div>
    <div class="ris-sheet-head">
      <div class="title">[ HUD // QUICK ACTIONS ]</div>
      <button class="ris-btn ris-btn--sm">&times;</button>
    </div>
    <div class="ris-sheet-body">...</div>
    <div class="ris-sheet-foot">...</div>
  </div>
</div>
```

### 3. Tactical Mechanical Switch (`.ris-switch`)
Physical 140ms sliding snap (`--ris-dur-fast` with `--ris-ease-snap`):
```html
<label class="ris-switch">
  <input type="checkbox" checked>
  <span>TACTICAL SCANNER OVERLAY</span>
</label>
```

### 4. Radar Sweep HUD (`.ris-radar`)
Continuous 2.2s scanning beam with optical reticle and static fallback under `prefers-reduced-motion`:
```html
<div class="ris-panel ris-radar" style="min-height:120px;">
  <!-- telemetry copy with z-index:2 -->
</div>
```

### 5. System Toast Stack (`.ris-toast-stack`)
Cascading stacked layout with progressive scale (`scale(0.96)`) Sonner-style:
```html
<div class="ris-toast-stack">
  <div class="ris-toast">
    <div>
      <span class="title">[ TELEMETRY UPDATED ]</span>
      <div>Packet #084-K received and validated.</div>
    </div>
  </div>
</div>
```

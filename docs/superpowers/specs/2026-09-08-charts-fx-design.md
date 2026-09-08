# Relic Interface System — Charts FX & Tactical Scrubber Design Specification

**Status:** Approved  
**Date:** 2026-09-08  
**Approach:** Option 3 — Hybrid (Kiroshi Tactical Scrubber + Ambient Micro-Sweep)  
**Strict Core Directive:** *"Non aggiungere dati finti o irrilevanti, tutto ciò deve essere funzionale"* (Zero fake metrics or dummy chrome — 1:1 mapping to real chart datasets).

---

## 1. Objectives & Principles

1. **Genuinely Functional Telemetry:**
   - Static SVG charts become inspectable via pointer (mouse & touch drag) and keyboard (Left/Right arrows for accessibility).
   - Tooltip / HUD callouts present **real telemetry only**:
     - `line`: exact value `v`, optional unit (e.g. `bpm`), point index `i + 1 / N`, or timestamp if provided.
     - `intraday`: time of day `HH:MM`, exact value `v`, real delta $\Delta$ against baseline median (`Δ +12`, `Δ -4`), and status indicator `[PICCO]` if `v >= peakThreshold`.
     - `bars`: exact bar value, rank/category, comparison to mean/max.
     - `gauge`: exact numeric readout and percentage.
   - Strictly prohibit random numbers, simulated encryption hashes, or decorative lore strings.

2. **Zero-Reflow SVG Architecture:**
   - All interactive elements (crosshair line, reticle, callout badge, texts) exist inside a pre-rendered `<g class="ris-chart-scrubber">` group inside the SVG.
   - Interactive updates only mutate SVG attributes (`x`, `y`, `x1`, `x2`, `y1`, `y2`, `textContent`, `transform`) or CSS opacity. Zero DOM node creation or destruction during pointer movement.
   - Smooth 60fps performance across desktop and mobile.

3. **Subtle Ambient Idle Micro-Sweep:**
   - Visual scan beam sweeps horizontally across the chart grid every 5s (`.ris-chart-sweep`).
   - Opacity is dialed down to 10–14% in dark mode, 6–8% in light mode so it never obscures data readability.
   - The ambient sweep immediately suspends when user hovers or scrubs the chart (`:hover` / `.is-scrubbing`), giving 100% clarity to manual inspection.
   - Peak points (`intraday` markers above threshold) receive an idle tactical radar warning pulse (`.ris-peak-pulse`).
   - Active gauge segment breathes slightly (`.ris-gauge-breathing`).

4. **Accessibility (WCAG 2.2 AA) & Reduced Motion:**
   - `tabindex="0"` on interactive SVGs with full `ArrowLeft` / `ArrowRight` scrubber navigation.
   - `aria-valuenow`, `aria-valuetext`, and live updates keep screen reader accessibility intact.
   - High-contrast HUD badges: background `var(--ris-surface-0)` / `var(--ris-void)` with 1px border `var(--ris-accent-line)`, typography in `var(--ris-fg1)` with high contrast (> 4.5:1).
   - Under `prefers-reduced-motion: reduce`: all ambient scanlines and pulses are completely disabled. Tactical scrubber remains fully functional without transition delays.

---

## 2. Component Specifications

### 2.1. `RisCharts.line(el, points, opts)`
- **Scrubber Group `<g class="ris-chart-scrubber">`**:
  - Vertical crosshair: `<line class="ris-scrubber-x" y1="0" y2="{h}" stroke="var(--ris-accent-2)" stroke-width="1" stroke-dasharray="2 2" opacity="0.8"/>`
  - Reticle: `<rect class="ris-scrubber-reticle" width="7" height="7" fill="none" stroke="var(--ris-accent-2)" stroke-width="1.5"/>`
  - HUD Callout Badge:
    - `<g class="ris-scrubber-badge">` containing `<rect class="ris-scrubber-box" rx="2"/>` and `<text class="ris-scrubber-txt">`
    - Displays: `PT: {i+1}/{N} | VAL: {value}{unit}`
- **Edge clamping:** The badge flips left/right to never clip outside the chart's SVG viewBox boundaries.

### 2.2. `RisCharts.intraday(el, points, opts)`
- **Scrubber Elements**:
  - Snaps to closest `{t, v}` point on horizontal mouse/touch position.
  - HUD Badge displays:
    - Row 1: `TIME: HH:MM` (formatted from `point.t`)
    - Row 2: `VAL: {point.v}{unit}`
    - Row 3: `Δ BASE: {+/-delta}` (calculated from `baseline.median` if provided)
    - Row 4 (conditional): `[ALERTA PICCO]` in red fill if `point.v >= opts.peakThreshold`.
- **Peak Pulse:** SVG markers exceeding peakThreshold have class `.ris-peak-pulse`.

### 2.3. `RisCharts.bars(el, values, opts)`
- **Interactive Focus & Overdrive:**
  - On `pointerenter` / touch on bar rect:
    - Current bar: `opacity: 1`, neon glow filter applied, `stroke: var(--ris-fg1)`, `stroke-width: 1`.
    - Non-selected bars: smoothly drop to `opacity: 0.25`.
  - Floating HUD badge above the column:
    - Displays real numerical value and category label (or index e.g. `LUN`, `MAR`, or `#01`).
- On `pointerleave`:
  - Reset all bars to original opacity (highlighted index to 1, others to 0.55).

### 2.4. `RisCharts.gauge(el, value, opts)`
- **Breathing Pulse:**
  - The last active segment (`i === on - 1`) receives class `.ris-gauge-breathing`.
- **Scrubber/Readout:**
  - Pointer interaction displays detailed ratio and percentage.

---

## 3. CSS Architecture (`cyber77/css/ris-fx.css`)

```css
/* Ambient Scanline Sweep */
@keyframes ris-chart-sweep {
  0%   { transform: translateX(-100%); opacity: 0; }
  15%  { opacity: var(--ris-chart-sweep-opacity, 0.12); }
  85%  { opacity: var(--ris-chart-sweep-opacity, 0.12); }
  100% { transform: translateX(100%); opacity: 0; }
}

/* Peak Warning Pulse */
@keyframes ris-peak-pulse {
  0%, 100% { transform: scale(1); opacity: 1; filter: drop-shadow(0 0 2px var(--ris-red)); }
  50%      { transform: scale(1.4); opacity: 0.85; filter: drop-shadow(0 0 6px var(--ris-red)); }
}

/* Active Gauge Segment Breathing */
@keyframes ris-gauge-breathing {
  0%, 100% { opacity: 1; filter: drop-shadow(0 0 1px currentColor); }
  50%      { opacity: 0.65; filter: drop-shadow(0 0 5px currentColor); }
}
```

---

## 4. Verification & Validation Plan
1. Interactive manual testing: scrub via mouse and touch gestures.
2. Keyboard navigation test: Tab into chart, scrub with Left/Right arrow keys.
3. Contrast verification: HUD badge contrast vs dark and light backgrounds >= 4.5:1.
4. Reduced motion test: Enable `prefers-reduced-motion: reduce`, confirm idle sweeps and pulses stop immediately while scrubber remains instant.
5. Headless browser screenshot verification to inspect visual rendering.

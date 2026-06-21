# Handoff: Relic Researcher Workbench — RIS Cyberpunk Skin

## Overview
This package documents a **complete visual + interaction design** for the **Relic Researcher Workbench** — a longitudinal personality-modeling governance tool (subjects, dialectical facet models, cross-facet hypotheses, the Gumi agent runtime, evidence transcripts, and a governed event chronicle). The design applies the **Relic Interface System (RIS)** — a dense, cyberpunk/HUD visual language (graphite surfaces, hard 1px borders, clipped/angular corners, restrained neon accents, scanline + grid textures, quick mechanical motion) — to that product's real screens and component inventory.

**Target codebase:** `github.com/yuzushi-dev/Relic` (`@master`), a Next.js (App Router) + React + TypeScript app. The product domain, routes, taxonomy, and component inventory come from that repo (`DESIGN.md`, `ui/app/globals.css`, `ui/components/*`). The repo's own native look is *"Instrument-Grade Utilitarian Precision"* (steel-blue on slate, IBM Plex, light+dark) — **this design intentionally replaces that with the RIS cyberpunk skin.** Confirm with the stakeholder which visual language ships before implementing.

## About the Design Files
The files under `../design/` are **design references created in HTML/JSX** — prototypes showing the intended look and behavior. They are **not production code to copy directly.** The task is to **recreate these designs in the Relic codebase's existing environment** (Next.js + React + TypeScript + its CSS approach), using its established patterns, data layer (`ui/lib/workbench-data`, the `SubjectIntelligenceData` / `EventStream` / baseline / gumi types), routing, and component conventions. Wire the UI to real data instead of the placeholder fixtures embedded in the prototypes.

The prototypes use plain inline-JSX-over-Babel and a global `window` export pattern purely so they run in a browser with no build step — **do not** carry that pattern into the codebase; use normal ES modules / `.tsx` components.

## Fidelity
**High-fidelity (hifi).** Final colors, typography, spacing, corner geometry, and interaction states are all specified here and in `../design/colors_and_type.css`. Recreate the UI pixel-faithfully using the codebase's component libraries, but match the exact tokens below. Where the prototype data is placeholder (field values, transcript text, battery scores), substitute real data from the app's data layer.

---

## Design tokens
All tokens live in **`../design/colors_and_type.css`** as CSS custom properties. Port these into the codebase's token system (Tailwind theme, CSS vars, or a tokens module). Key values:

### Color — surfaces (dark, graphite; never pure black)
| Token | Hex | Use |
|---|---|---|
| `--ris-void` | `#060708` | deepest backdrop, input wells |
| `--ris-bg` | `#0a0c0e` | app background |
| `--ris-surface-1` | `#0f1316` | panel base |
| `--ris-surface-2` | `#141a1e` | raised panel / row hover |
| `--ris-surface-3` | `#1b2228` | selected / elevated |
| `--ris-surface-4` | `#232c33` | popovers, deepest |

### Color — lines & text
| Token | Hex |
|---|---|
| `--ris-line` `#2a343b` · `--ris-line-strong` `#3b4750` · `--ris-line-faint` `#1a2126` |
| `--ris-fg1` `#e6ebe8` (primary) · `--ris-fg2` `#aab4b2` (secondary) · `--ris-fg3` `#717d82` (tertiary) · `--ris-fg4` `#4a555b` (disabled) |

> **Accessibility:** for metadata/captions on dark surfaces, use `#98a3a5` (≈6.5:1) rather than `--ris-fg3`/`--ris-fg4`, which fail AA at small sizes. Status is **never color-only** — always pair with a text label and/or icon.

### Color — accents (use with restraint; each carries meaning)
| Token | Hex | Meaning |
|---|---|---|
| `--ris-amber` | `#f2e205` | active / selection / primary CTA / pending |
| `--ris-cyan` | `#16e0e0` | data / links / scans / evidence |
| `--ris-red` | `#ff2d3c` | danger / blocked / high risk |
| `--ris-green` | `#2fe48a` | online / approved / success |
| `--ris-violet` | `#b06bff` | inference (model-derived) |
| `--ris-magenta` | `#e85ad6` | the **Gumi** runtime signature |
| `--ris-orange` | `#e08a3c` | researcher corrections |

Each accent has `-dim`, `-glow` (translucent fill), and `-line` (translucent border) variants — see the CSS.

### Semantic stream taxonomy (maps the repo's `globals.css` stream classes)
`evidence`→cyan · `inference`→violet · `pending`→amber · `approved`→green · `blocked`→red · `gumi`→magenta · `runtime`→cyan-dim · `correction`→orange. Rendered as the `.ris-stream[data-stream]` chip.

### Typography
- **Display / headings / HUD numerics:** Chakra Petch (uppercase, 600–700, tight tracking)
- **Body / UI / labels:** Rajdhani (sentence-case body; uppercase tracked labels)
- **Mono / telemetry / logs / IDs:** JetBrains Mono (tabular figures)
- Loaded via Google Fonts in the prototype; **self-host for production.**
- Scale (px): hero 44 · h1 32 · h2 24 · h3 19 · **body 16** · small 14 · label/xs 11 (11 floor for hard metadata only). Body line-height 1.55.
- Tracking: labels `.14–.16em`, eyebrows/system tags `.20–.28em`, uppercase.

### Spacing / shape / elevation / motion
- Spacing: 4px base grid (`--ris-s1`…`--ris-s8` = 4/8/12/16/20/24/32/48). Dense UI leans on 8–16.
- **Corner radius is 0.** The signature is the **clipped corner** via `clip-path` polygon (top-right + bottom-left cut). Sizes: 6px chips/inputs, ~9–10px panels/cards, 14–16px modals. See `CLIP(n)` in `relic-console/Primitives.jsx`.
- Elevation = border weight + faint glow, **not** soft drop shadows. `--ris-glow-amber/cyan/red` for active/scan/alert.
- Motion: quick + mechanical, 90–160ms, `cubic-bezier(0.2,0.8,0.2,1)`. Motifs: flicker (rare), blink (status/cursor), scanline sweep (loading). Hover = border flash + inner accent line; press = 1px nudge. Selection should feel like a reticle locking on. No bounce.

---

## Screens / Views

The app is **subject-scoped**: a left nav rail switches top-level areas; a subject context bar quick-switches the active subject on subject-scoped screens. Desktop entry: `../design/ui_kits/relic-console/index.html`. Mobile entry: `../design/ui_kits/relic-console/mobile.html`.

### Chrome (desktop)
- **Top status bar (fixed, 52px):** brand mark · breadcrumb (`ROOT / STUDY / OVERVIEW`, single `/` separator) · right cluster: LIVE chip, subjects-count chip, clock, researcher identity (`RESEARCHER · R-0007-RELIC`).
- **Left nav rail (64px, fixed):** icon buttons — **Study, Subject, Baseline, Gumi, Chronicle** — active item gets amber glow + left accent bar; a red **End Session** power button pinned at the bottom.
- **Subject context bar** appears on Subject / Baseline / Gumi / Chronicle: "SUBJECT" label + pill buttons (SUBJ-0091…0122, active = amber) + SCOPED chip.

### 1. Study (overview dashboard)
- **Purpose:** study-wide health at a glance.
- **Layout:** 4-up KPI row (Subjects, Observations, Hypotheses, Blocked Events) — each a clipped card with a left accent rail, label, big display numeral, mono delta line. Below: Model Health panel (linear + segmented meters: Confidence/Coverage/Drift/Facets) spanning 2 cols; Governance panel (blocked count + segmented bars) 1 col; Priority Review panel (amber-tinted); Activity Feed panel (color-coded mono log rows with stream-colored left border).

### 2. Subject (facet intelligence) — `SubjectIntelligence.tsx`
- **Tabs:** *18-Facet Model · Hypotheses · Evidence Feed.*
- **Facet model:** grouped (Plasticity / Stability / Affiliation). Each **facet row** = name + `pos/conf/obs` stats; a **dialectical spectrum** (left anchor label · track with a glowing **needle** at `pos`% · right anchor label); a **confidence bar** under it colored by level (high≥0.7 green / med≥0.4 amber / low red). See `.ris-facet*` in `relic.css`.
- **Hypotheses:** accordion rows — title + confidence chip (STRONG/MODERATE/WEAK by tone); expanded shows summary + contributing-facet tags.
- **Evidence Feed:** transcript cards (id, channel, timestamp) with a quote block; Gumi-channel entries get a magenta rail, others cyan.

### 3. Baseline (profile) — `baseline/page.tsx`
- **Header:** "Baseline Profile · Version N", subject id, method chip, created date.
- **Fields table:** Field · Value · **Origin** · Section, with section filter pills. Origin badge tone: `subject-stated`→green, `researcher-coded`→cyan, `system-inferred`→neutral.
- **Risk Flags** panel (category + risk badge) and **Version Information** panel (v / created / field count / provenance).
- **Battery scores:** three panels — TIPI (Big Five, 0–7), ECR-RS (Anxiety/Avoidance, 0–7), Project Calibration (0–10) — each rendered as **calibration sliders** (label + value + needle on a track). See `Calibration` in `Primitives.jsx`.

### 4. Gumi (agent profile) — `gumi/page.tsx`
- **Header:** magenta eyebrow, bot icon, "GUMI · MIRA", mode chip, **Sweet Spot** chip, created date.
- **Batteries:** TIPI + ECR-RS calibration sliders; **Sweet Spot** card = big green numeral (target 0.3–0.7) + risk-flag chips.
- **Project Calibration** sliders (magenta). **Background Domains** = dashed-border cards (origin/vocation/temperament/relational stance) each with key→value pairs. **Identity files:** `SOUL.md`, `WORLD.md`, Relationship Policy rendered as mono `<pre>` blocks.

### 5. Chronicle (governed audit) — `TimelineView.tsx` + chronicle sub-sections
- **Sub-tabs:** *Events · Decisions · Snapshots* (segmented control).
- **Events:** class filter pills; event cards with stream-colored left rail, ontology stream chip, initiator + class badges, timestamp, body (blocked events show italic "[ Blocked by safety policy ]" in dim text), risk badge + flags + id.
- **Decisions:** verdict chip (approved/blocked/pending), actor badge (researcher=cyan), policy ref (violet, e.g. `BOUNDARY.no_probe`), rationale, risk, `→ event` cross-ref.
- **Snapshots:** model-state version stack (vN, CURRENT chip on latest, trigger badge), stats (facets / mean conf / drift — drift >0.15 highlighted amber), Δ-change line; selected row expands a note.

### End Session modal
Confirm overlay (red, clipped, scanlines): "END SESSION" → "Lock Workbench" locks the workbench and revokes the researcher token (re-auth required). Cancel / confirm buttons.

### Mobile (`mobile.html` / `MobileApp.jsx`)
Scaled phone bezel, RIS status bar, back-aware top bar, **bottom tab bar: Subjects · Subject · Chronicle · Gumi.**
- **Subjects:** search + list rows (avatar, name, id, conf, stream-colored rail, risk badge, last-seen). Tap → Subject.
- **Subject:** confidence/risk stat cards + compact facet spectrums + a **"Baseline Profile →" drill-down row** that pushes the mobile Baseline screen (grouped fields + origin badges + risk flags + TIPI sliders; back button returns).
- **Chronicle:** same **Events / Decisions / Snapshots** sub-tabs, reflowed as stacked cards.
- **Gumi:** identity header + Sweet Spot card + TIPI sliders.
- Touch targets ≥44px; 390px design column.

---

## Interactions & Behavior
- **Nav:** rail switches screens; subject bar swaps active subject (re-keys subject-scoped screens). Breadcrumb reflects location.
- **Tabs / sub-tabs:** Subject (3), Chronicle (3) — segmented controls, amber active.
- **Filters:** Chronicle Events class pills; Baseline section pills.
- **Selection:** Snapshot rows and list rows select with accent rail + glow; selected snapshot expands a note.
- **Mobile drill-downs:** Subjects→Subject→Baseline, each with a back affordance in the top bar.
- **Modal:** End Session confirm; click-scrim or Cancel dismisses.
- **Motion:** see tokens — quick mechanical transitions; status dots blink; optional boot/sign-in sequence on the desktop entry.

## State Management
Prototype state (lift to the codebase's real data/store):
- `activeScreen` (nav), `activeSubject` (context bar), per-screen `tab`/`subTab`, Chronicle `classFilter`, Baseline `sectionFilter`, snapshot `selectedId`, modal `confirm`, mobile `tab`/`detail`/`baselineOpen`/`chronTab`.
- **Data needs (bind to repo types):** subject registry + per-subject `SubjectIntelligenceData` (facets, hypotheses, evidence), baseline profile (fields + origins + batteries + risk flags + version), gumi profile (batteries, sweet spot, domains, identity files), and the `EventStream` (events / decisions / snapshots). Replace all embedded placeholder arrays.

## Assets
- `../design/assets/relic-logo.svg`, `relic-mark.svg` — original RIS marks (swap for real brand marks if any).
- **Icons:** [Lucide](https://lucide.dev) line set, ~1.75px stroke, `currentColor`; accent color only on active/alert. No emoji. The prototype loads Lucide from CDN; use the codebase's icon package (`lucide-react`).

## Files (in this bundle, under `../design/`)
| Path | What |
|---|---|
| `colors_and_type.css` | All design tokens (color, type, spacing, clip, elevation, motion). **Source of truth.** |
| `relic.css` | Component primitives: panels, buttons, chips, `.ris-stream`, `.ris-facet*`, `.ris-risk`, meters, textures, animations. |
| `ui_kits/relic-console/index.html` | Desktop prototype entry (open in a browser). |
| `ui_kits/relic-console/mobile.html` | Mobile prototype entry. |
| `ui_kits/relic-console/*.jsx` | Screen + primitive components (Primitives, Shell, Dashboard, Profile, Baseline, Gumi, Chronicle, MobileApp, AlertModal). |
| `ui_kits/relic-console/README.md` | Per-screen interaction notes + repo→design mapping. |
| `assets/` | Logo + mark SVGs. |

> To run a prototype: open the `.html` file directly in a browser (no build). It loads React/Babel/Lucide from CDN.

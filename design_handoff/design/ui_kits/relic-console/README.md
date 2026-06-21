# Relic Console — UI Kit

A high-fidelity, interactive recreation of the **Relic Researcher Workbench** ([github.com/yuzushi-dev/Relic](https://github.com/yuzushi-dev/Relic)) styled in the **Relic Interface System** cyberpunk language — a longitudinal personality-modeling governance console. This is a cosmetic/interaction prototype — modular React (inline JSX) components wired into a working click-thru, not production code. The domain, screens, and taxonomy come from the repo; the visual treatment is RIS.

## Run it
Open `index.html`. It loads React + Babel + Lucide from CDN and the two design-system stylesheets (`../../colors_and_type.css`, `../../relic.css`). No build step.

## Flow / what's interactive
1. **Sign-in screen** — animated study-context startup; click **Enter Workbench** (or press `F`) to enter.
2. **Study** — overview KPIs (subjects, observations, hypotheses, blocked events), model health meters, governance, priority review, activity feed.
3. **Subject** — facet intelligence: 18-facet dialectical model (position needle + confidence), cross-facet **hypotheses** accordion, and an **evidence transcript** feed. Tabs switch between them.
4. **Baseline** — baseline profile fields table with **origin provenance** badges (subject-stated / researcher-coded / system-inferred), section filters, **risk flags**, version info, and **TIPI / ECR-RS / project** calibration batteries.
5. **Gumi** — agent profile: TIPI + ECR-RS batteries, **Sweet Spot** gauge (target 0.3–0.7), project calibration, **background domains**, and `SOUL.md` / `WORLD.md` / relationship-policy identity files.
6. **Chronicle** — governed audit split into three sub-sections: **Events** (stream-tagged log + class filters), **Decisions** (governance verdicts: approved / blocked / pending, with actor, policy, rationale, risk), and **Snapshots** (model state-version history with mean-confidence + drift + Δ change).
7. **Subject context bar** — quick-switch the active subject on any subject-scoped screen.
8. **Power button** (rail, bottom) — confirm-to-lock the workbench session.

## Mobile surface
`mobile.html` is the companion mobile prototype — open it directly. A scaled phone bezel hosts a four-tab app (**Subjects · Subject · Chronicle · Gumi**) with a RIS-styled status bar, a back-aware top bar, and a bottom tab bar. Tap a subject in the list to open its facet detail; from there, a **Baseline** card drills down to the full baseline profile (sectioned fields + origin badges + risk flags + TIPI battery). The **Chronicle** tab carries the same three sub-sections as desktop (Events / Decisions / Snaps). Same tokens, primitives, stream colors, and terminology as desktop — just reflowed for a 390px column and touch targets ≥44px. Built from `MobileApp.jsx` (reuses `Icon`/`Chip`/`Label`/`Calibration` from `Primitives.jsx`).

## Files
| File | Role |
|---|---|
| `index.html` | App entry — loads scripts, holds routing/subject/feed state, renders boot + shell + screens + modal/toast. |
| `Primitives.jsx` | Shared: `Icon`, `Panel`, `Btn`, `Chip`, `Label`, `Meter`, `SegMeter`, `Brackets`, `Calibration`, `Stream`, `SubjectBar`, `CLIP()`. |
| `Shell.jsx` | `BootScreen`, `Shell` (top status bar + nav rail), `Clock`. |
| `Dashboard.jsx` | Study overview — `Kpi`, `SysRow`, model health + governance + feed panels. |
| `Profile.jsx` | Subject intelligence — facet model + hypotheses + evidence feed. |
| `Baseline.jsx` | Baseline profile — fields table + risk flags + batteries. |
| `Gumi.jsx` | Gumi agent profile — batteries + sweet spot + domains + identity files. |
| `Chronicle.jsx` | Governed event stream w/ class filters + risk. |
| `MobileApp.jsx` | **Mobile surface** — status bar, top bar, bottom-tab nav, Subjects list, facet detail, Chronicle feed, Gumi mini-profile. |
| `mobile.html` | Mobile prototype entry — phone bezel + scaling, renders `MobileApp`. |
| `AlertModal.jsx` | Configurable confirm overlay. |

## Conventions (important for editing)
- Each `<script type="text/babel">` has its own scope. Components are exported to `window` via `Object.assign(window, {...})` at the bottom of each file so other files can use them.
- No shared `const styles = {}` object — styles are inline or pull from `relic.css` classes / CSS vars, to avoid name collisions.
- Clipped corners use the `CLIP(n)` helper (returns a `clip-path` polygon). Accent glow + borders come from tokens, never hand-rolled colors.
- Icons are Lucide via `<Icon name="..." />`. After any conditional re-render, `lucide.createIcons()` runs in an effect.

## Not included (intentionally)
Real data/auth, persistence, routing libraries, and live model logic. This kit demonstrates the **visual + interaction language**, not a backend.

# RIS — Audit v1 → v2 (2026-06-10)

Audit of the `design_handoff/` kit against requirements:
desktop+mobile, dark+light, complete and varied components, icons (generic + biofeedback),
multi-brand (Relic / BioHub / VivoKey / general use), tactical cyberpunk palette.

## v1 State (Initial findings)

| Area | Status | Notes |
|---|---|---|
| Color tokens (dark) | ✅ solid | graphite stack, semantic accents, stream taxonomy |
| Typography tokens | ✅ solid | Chakra Petch / Rajdhani / JetBrains Mono, scale 11–44px |
| Spacing / clip / motion | ✅ | 4px grid, clip 6/10/16, mechanical ease 90–160ms |
| Light mode | ❌ missing | dark only (`:root` single-theme) |
| Web components (`relic.css`) | ⚠️ partial | panel, btn (5 variants), chip, stream, facet, risk, input, meter, segmeter, divider, 3 animations. **Missing:** select, textarea, checkbox, radio, switch, slider, field/label/error, table, modal, toast, alert, tabs, tooltip, dropdown, breadcrumb, pagination, skeleton, empty-state, kbd/code, topbar/rail/bottom-nav, KPI/stat, avatar, counter badge |
| Responsive | ❌ | no breakpoints in shared CSS (prototypes only) |
| Icons | ⚠️ delegated | CDN Lucide dependency; no dedicated biofeedback icons (HRV, EEG, SpO2, BIA, NFC implants…) |
| Multi-brand | ⚠️ implicit | 3 documented products but no `data-brand` token layer |
| Accessibility | ⚠️ | "status never color-only" declared; lacked focus-visible, reduced-motion, skip-nav in CSS kit |
| Compose port | ✅ | Color/Type/Shape/Theme/Components/Charts/Scaffold — dark only |

## v2 Architectural Decisions

1. **Tactical Cyber Palette.** Accents aligned with high-contrast tactical cyber colors while preserving RIS discipline (accent = meaning, never decoration):
   - yellow `#f2e205` → **Cyber Yellow `#fcee0a`**
   - cyan `#16e0e0` → **glitch blue `#00f0ff`**
   - red `#ff2d3c` → **`#ff003c`**
   - green `#2fe48a` → **netrunner green `#00e57e`**
   - magenta `#e85ad6` → **`#ff42c8`**, violet `#b06bff` → `#9a5cff`, orange `#e08a3c` → `#ff9230`
   - `--ris-amber*` kept as **deprecated aliases** of yellow (backwards compatibility with existing ports).
   - Graphite surfaces preserved: they define system identity (never pure black).
2. **Light mode.** `[data-theme="light"]`: cold blue-gray paper, borders carry structure as in dark mode. Accents have **two levels**: contextual `--ris-X` (bright on dark, AA-safe ink on light) and `--ris-X-fill` always bright (fills with inverted text — yellow CTA remains yellow across both themes).
3. **Brand layer.** `data-brand` on `<html>`/`<body>`: `relic` (yellow/cyan, default), `biohub` (cyan/green), `vivokey` (red/yellow — auth/security), `neutral` (violet/cyan, general use). Configures only `--ris-accent*` + `--ris-accent-2`: semantic colors remain unchanged.
4. **Components.** Complete component inventory (full form controls, table, modal, toast, alert, tabs, tooltip, dropdown, breadcrumb, pagination, skeleton, empty, kbd/code, mobile topbar/rail/bottom-nav, KPI, avatar, badge) + breakpoints ≤768px / ≤440px, `:focus-visible`, `prefers-reduced-motion`, skip-nav.
5. **Native Icons.** `ris-icons.svg` — `<symbol>` 24×24 sprite, stroke 1.75 `currentColor`, angular RIS geometry. 132 glyphs (Tabler Icons MIT base): generic set + biofeedback set (HR/HRV/ECG/EEG, sleep, SpO2, breath, steps, BIA/scale, temperature, stress, meditation, VO2, BP, DNA, NFC/implant for VivoKey, wearables…).
6. **Specimen.** `docs/index.html` at kit root: palette, type, all components, icon grid, with live theme and brand toggle.

## Resolution v2.8.0 (2026-09-08)

- **Complete Compose Port (`compose/`)**: Implemented `Color.kt` (with `RisCyberSkin`), `Shape.kt` (45° chamfer cut), `Type.kt`, `Theme.kt`, `Components.kt` (4 button variants, squared text fields, scrollable subtabs, canvas linear progress bar, panels, chips) and `Charts.kt` with dynamic stride.
- **Modular Cyber Skin**: Formalized coexistence between de-slopped forensic baseline (`ris-tokens.css`, `ris.tokens.json`) and tactical cyber skin (`data-skin="cyber"`, `ris-skin-cyber.css`, `RisCyberSkin` in Compose).
- **Mobile Display Safety**: Enforced removal of side rulers and fixed tickers on mobile OLED viewports to prevent display artifacts.
- **Tactical HUD Motion System**: 80ms physical punch micro-feedback, CSS Grid 0fr→1fr accordions, Sonner-style toast stack, native SVG sweep and interactive keyboard scrubbers on charts.

# RIS — Audit v1 → v2 (2026-06-10)

Audit del kit `design_handoff/` (estratto da `Relic Interface System.zip`) contro i requisiti:
desktop+mobile, dark+light, componenti completi e vari, icone (generiche+biofeedback),
multi-brand (Relic / BioHub / VivoKey / general use), palette più vicina a Cyberpunk 2077.

## Stato v1 (cosa c'era)

| Area | Stato | Note |
|---|---|---|
| Token colore (dark) | ✅ solido | graphite stack, accenti semantici, stream taxonomy |
| Token tipografia | ✅ solido | Chakra Petch / Rajdhani / JetBrains Mono, scala 11–44px |
| Spacing / clip / motion | ✅ | 4px grid, clip 6/10/16, ease meccanico 90–160ms |
| Light mode | ❌ assente | sistema solo dark (`:root` unico) |
| Componenti web (`relic.css`) | ⚠️ parziale | panel, btn (5 varianti), chip, stream, facet, risk, input, meter, segmeter, divider, 3 animazioni. **Mancavano:** select, textarea, checkbox, radio, switch, slider, field/label/error, table, modal, toast, alert, tabs, tooltip, dropdown, breadcrumb, pagination, skeleton, empty-state, kbd/code, topbar/rail/bottom-nav, KPI/stat, avatar, badge contatore |
| Responsive | ❌ | nessun breakpoint nei CSS condivisi (solo nei prototipi) |
| Icone | ⚠️ delegate | dipendenza Lucide via CDN; nessuna icona biofeedback dedicata (HRV, EEG, SpO2, BIA, implant NFC…) |
| Multi-brand | ⚠️ implicito | 3 prodotti documentati ma nessun layer token `data-brand` |
| Accessibilità | ⚠️ | "status never color-only" dichiarato; mancavano focus-visible, reduced-motion, skip-nav nei CSS kit |
| Compose port | ✅ | Color/Type/Shape/Theme/Components/Charts/Scaffold — solo dark |

## Decisioni v2

1. **Palette CP2077.** Accenti riallineati ai colori firma di Cyberpunk 2077 mantenendo
   la disciplina RIS (accento = significato, mai decorazione):
   - giallo `#f2e205` → **Cyber Yellow `#fcee0a`**
   - cyan `#16e0e0` → **glitch blue `#00f0ff`**
   - rosso `#ff2d3c` → **`#ff003c`**
   - verde `#2fe48a` → **netrunner green `#00e57e`**
   - magenta `#e85ad6` → **`#ff42c8`**, violet `#b06bff` → `#9a5cff`, orange `#e08a3c` → `#ff9230`
   - `--ris-amber*` mantenuti come **alias deprecati** del giallo (retro-compat con i port esistenti).
   - Superfici graphite invariate: sono l'identità del sistema (mai nero puro).
2. **Light mode.** `[data-theme="light"]`: carta fredda blu-grigia, bordi che portano la
   struttura come nel dark. Gli accenti hanno **due livelli**: `--ris-X` contestuale
   (bright su dark, ink AA-safe su light) e `--ris-X-fill` sempre bright (riempimenti
   con testo invert — il CTA giallo resta giallo in entrambi i temi).
3. **Brand layer.** `data-brand` su `<html>`/`<body>`: `relic` (yellow/cyan, default),
   `biohub` (cyan/green), `vivokey` (red/yellow — auth/security), `neutral` (violet/cyan,
   general use). Imposta solo `--ris-accent*` + `--ris-accent-2`: i semantici non cambiano.
4. **Componenti.** `relic.css` v2 completa l'inventario (form completo, table, modal,
   toast, alert, tabs, tooltip, dropdown, breadcrumb, pagination, skeleton, empty,
   kbd/code, topbar/rail/bottom-nav mobile, KPI, avatar, badge) + breakpoint ≤768px /
   ≤440px, `:focus-visible`, `prefers-reduced-motion`, skip-nav.
5. **Icone proprie.** `design/icons/ris-icons.svg` — sprite `<symbol>` 24×24, stroke
   1.75 `currentColor`, geometria angolare RIS. ~80 glifi: set generico + set
   biofeedback (HR/HRV/ECG/EEG, sonno, SpO2, respiro, passi, BIA/bilancia, temperatura,
   stress, meditazione, VO2, pressione, DNA, NFC/implant per VivoKey, wearable…).
   Lucide resta opzione valida per ciò che non è coperto.
6. **Specimen.** `index.html` alla radice del kit: palette, type, tutti i componenti,
   griglia icone, con toggle tema e brand live. Sostituisce la verifica "apri i prototipi".

## Risoluzione v2.7.0 (2026-09-03)

- **Port Compose completo (`compose/`)**: Implementati `Color.kt` (con `RisCyberSkin`), `Shape.kt` (chamfer cut 45°), `Type.kt`, `Theme.kt`, `Components.kt` (bottoni 4 varianti, text field squadrati, subtabs scrollable, linear progress bar canvas, panels, chips) e `Charts.kt` con dynamic stride.
- **Modularizzazione Skin CP2077**: Formalizzata la coesistenza tra la base forensic de-slopped (`ris-tokens.css`, `ris.tokens.json`) e la skin Cyberpunk 2077 (`data-skin="cyber"`, `ris-skin-cyber.css`, `RisCyberSkin` in Compose).
- **Mobile Display Safety**: Formalizzato il divieto di righelli laterali e ticker fissi sui display mobile OLED per prevenire difetti visivi.

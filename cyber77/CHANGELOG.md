# Changelog — RIS

## 2.5.1 — 2026-06-30

- **Skin `cyber` responsive/mobile**: blocco `@media (max-width:767px)` in
  `ris-skin-cyber.css` — righello nascosto, ticker sopra la bottomnav,
  `background-attachment:scroll` (no jank iOS), bottomnav con riga rossa glow +
  attivo glow (come la topbar), list-row compatta (thumb 56px), `.ris-stat` con
  solo valore + barra corta. Demo app-shell mobile `docs/mobile.html` (topbar +
  bottomnav, apribile da telefono) + card gallery `preview/cyber-mobile.html`.
- **Specimen = preview mobile completa**: aggiunta `.ris-bottomnav` (visibile
  <768px) a `docs/index.html` → aprendolo sul telefono si vedono **tutti** i
  componenti riadattati + chrome mobile. Topbar fix anti-overflow su ≤700px
  (versione nascosta, brand/skin compatti). `mobile.html` resta esempio app-shell.

## 2.5.0 — 2026-06-30

- **Skin `data-skin="cyber"`** (`css/ris-skin-cyber.css`): look&feel Cyberpunk
  2077 come layer **opt-in**, caricato per ultimo, sopra il default forensic
  de-slopped senza toccarlo. Togli l'attributo/il `<link>` → torna il default.
  Solo dark. Contenuto:
  - Palette neon ri-saturata ma **temperata WCAG AA** su near-black (red `#ff003c`
    fill / `#ff4d62` testo, cyan `#00e5ff`/`#3df0ff`, green `#00e57e`, yellow
    `#ffe23a`); **rosso strutturale** (`--ris-line*` rossi); superfici near-black
    tinte rosso; sfondo gradiente crimson→nero + scanline + grana (layer di
    background statici, reduced-motion safe).
  - **Glow di default** su chrome chiave: riga topbar, selezione (fill pieno),
    bottone primario, brackets. Font display → **Chakra Petch** (techno).
  - Chrome decorativo opt-in: `.ris-serial` `.ris-hex` `.ris-binary` `.ris-ruler`
    (tacche bordo) `.ris-ticker` (angolo dati).
  - Componenti nuovi skin-scoped: `.ris-listrow` (thumb + titolo + meta + ora,
    selezione fill pieno), `.ris-stat` (LEVEL/STREET CRED topbar, riusa `.ris-segmeter`).
  - Tooltip `.ris-tip` con bordo giallo; slider/focus con alone.
- **Specimen**: toggle "Skin: Cyber" in topbar + sezione Skin Cyber. Scelta
  deliberata documentata in GUIDELINES §7 (eccezione consapevole al de-slop).

## 2.4.1 — 2026-06-17

- **Fix contrasto `.ris-btn--primary` in light theme**: il testo usava
  `--ris-fg-invert`, che in light diventa chiaro (#f6f8f8) → su accent-fill
  giallo dava 1.13:1 (WCAG fail). Nuovo token `--ris-on-accent` (#07090a, scuro
  in **entrambi** i temi, perché i fill restano sempre brillanti); il primary
  button lo usa per il testo. Dark invariato.

## 2.4.0 — 2026-06-17

- **Icone brand/social**: `ris-mail` (glifo stroke generico) + `ris-linkedin`,
  `ris-github`, `ris-medium` (loghi solidi: override `fill="currentColor"
  stroke="none"`). Sezione `BRAND / SOCIAL` nello sprite. Da usare solo per link
  reali verso quella piattaforma. Documentate in COMPONENTS.md §Icone.

## 2.3.0 — 2026-06-11

- **`RisCharts.eegWaveform(el, channels, opts)`**: waveform EEG **multi-canale da
  dati reali** (una traccia per canale, DC rimosso e scalato per traccia, stroke
  neon + glow). Diverso da `wave`, che è sintetica/animata. Per la vista EEG
  **live** (es. Muse TP9/AF7/AF8/TP10) accanto a `bands` (band power), commutabili
  nel consumer. Port Android in BioHub `ui/theme/Charts.kt` (`RisEegWaveform` +
  `RisEegBands`), card `EegLiveCard` con switch waveform/band power.

## 2.2.0 — 2026-06-11

- **`RisCharts.intraday(el, points, opts)`**: grafico andamento intraday (asse
  orario, banda baseline mediana±range, marcatori picco quadrati rossi oltre
  soglia). Per visualizzare lo stress/HR del giorno dentro una card. Stile RIS:
  grid duro, stroke neon + glow, label mono, rispetta `prefers-reduced-motion`.
  Specimen aggiornato. Port Android nei consumer (es. BioHub `ui/theme/Charts.kt`,
  `RisIntradayChart`).

## 2.1.0 — 2026-06-11

- **Temi fazione** `data-brand="arasaka|militech|edgerunners"`: skin complete
  (accent + superfici tinte in dark, ink AA in light). Identità verificate su
  fonti CP2077 (artbook via wiki, palette community). Vedi GUIDELINES §3.
- **Componenti avanzati**: accordion (details nativo), stepper/wizard, drawer
  laterale, command palette, dropzone upload.
- Specimen: selector brand con gruppo Fazioni + sezione Avanzati + drawer demo.

## 2.0.0 — 2026-06-11

Da kit handoff a design system. Vedi `AUDIT.md` per il razionale completo.

### Breaking
- Palette riallineata a Cyberpunk 2077: yellow `#f2e205→#fcee0a`,
  cyan `#16e0e0→#00f0ff`, red `#ff2d3c→#ff003c` (fill) / `#ff4066` (contestuale dark),
  green `→#00e57e`, violet `→#9a5cff`, magenta `→#ff42c8`, orange `→#ff9230`.
- File CSS rinominati: `colors_and_type.css→css/ris-tokens.css`, `relic.css→css/ris.css`.
- `--ris-amber*` deprecato (alias funzionante di `--ris-yellow*`).

### Nuovo
- **Light theme** `[data-theme="light"]` — ink accents AA-safe, fill invariati.
- **Brand layer** `[data-brand="relic|biohub|vivokey|neutral"]` — coppia accent.
- **Token JSON** (`tokens/ris.tokens.json`, W3C draft) come source of truth.
- **Componenti nuovi**: field/select/textarea/checkbox/radio/switch/slider/search,
  table (sort/selezione/sticky), modal, toast, alert, tabs/subtabs, tooltip,
  menu, breadcrumb, pagination, KPI, skeleton, empty, kbd/code/log, avatar,
  badge-count, spinner, topbar/rail/bottomnav responsive.
- **Icone proprie**: sprite `icons/ris-icons.svg`, ~90 glifi 24×24 stroke 1.75
  (generici + biofeedback + dispositivi/implant). Rimossa dipendenza Lucide CDN.
- **Accessibilità**: contrasti verificati ≥4.5:1 per token contestuali in
  entrambi i temi; `:focus-visible`, `prefers-reduced-motion`, skip-nav,
  target ≥24px; pattern ARIA documentati.
- **FX layer** (`css/ris-fx.css`): glitch text RGB-split, CRT overlay
  (fosfori+scanline+vignetta+banda), static noise, signal-lost, boot reveal,
  power-on, glow/pulse, caret terminale, data-updated flash, holo shimmer —
  tutti degradano con `prefers-reduced-motion`.
- **Grafici** (`js/ris-charts.js`): line/bars/spark/gauge/wave EEG/bands SVG
  senza dipendenze, stile neon RIS, con `aria-label` e reduced-motion.
- **Docs**: GUIDELINES.md, COMPONENTS.md, specimen interattivo `docs/index.html`
  (incl. matrice stati interattivi, grafici live, FX).
- **Compose**: `compose/Color.kt` v2 con dark+light+brand.

## 1.0.0 — 2026-05 (design_handoff)
Pacchetto handoff originale: token dark, primitive web (panel/btn/chip/stream/
facet/risk/input/meter), port Compose completo, prototipi relic-console /
biohub / spark2-auth, docs per prodotto.

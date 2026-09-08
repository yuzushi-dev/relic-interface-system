# RIS v2 — Componenti

Riferimento d'uso. Ogni componente: classi, anatomia, ARIA richiesto, note.
Demo live: `docs/index.html` (servire la cartella `ris/` via HTTP).

## Chrome di layout

| Classe | Ruolo | Note |
|---|---|---|
| `.ris-topbar` | status bar fissa 52px | `<header>`; contiene brand, contesto, azioni globali |
| `.ris-rail` | rail desktop 64px | `<nav aria-label>`; nascosta <768px |
| `.ris-bottomnav` | nav mobile 60px | visibile solo <768px; item = `.ris-nav-link`, ≥44px |
| `.ris-nav-link` | voce nav | attivo: `data-active="true"` o `aria-current="page"` |
| `.ris-shell-content` | area contenuto | padding compensa topbar/rail/bottomnav |

## Contenitori

- **`.ris-panel`** (+`--2`, `--flat`, `--accent`) — anatomia: `.ris-panel-head` /
  `.ris-panel-body` / `.ris-panel-foot`. Head con `.ris-h3` o `.ris-label`.
- **`.ris-bracket`** — angoli L accent su elemento `position:relative`. Solo per
  evidenziare 1 elemento per vista.
- **`.ris-grid--2/3/4`** — griglie responsive; **`.ris-row`/`.ris-stack`/`.ris-wrap`** utility flex.

## Bottoni `.ris-btn`

Varianti: `--primary` (fill accent, 1 per vista), `--secondary` (outline accent-2),
default (graphite), `--ghost`, `--danger`. Taglie: `--sm` 28px, default 36px,
`--lg` 46px, `--icon` (quadrato; richiede `aria-label`), `--block`.
Disabled: attributo `disabled` (non solo classe). Loading: affiancare `.ris-spinner`
con `role="status"`.

## Chip e stato

- `.ris-chip` + `--accent|yellow|cyan|red|green|violet|magenta|orange`; dot opzionale `<i class="dot">`.
- `.ris-stream[data-stream="evidence|inference|pending|approved|blocked|gumi|runtime|correction|neutral"]` — provenance tag.
- `.ris-risk[data-risk="none|low|medium|high"]`.
- `.ris-badge-count` (+`--danger`) — contatori; per notifiche usare anche testo sr-only.
- Regola dura: il testo del chip dice lo stato; il colore lo rinforza soltanto.

## Form

Wrapper **`.ris-field`**: `<label for>` sempre presente e visibile;
help `.ris-field-help`; errore `.ris-field-error` + `data-invalid` sul field +
`aria-invalid` e `aria-describedby` sull'input.

| Controllo | Classe | ARIA/note |
|---|---|---|
| Testo | `.ris-input` | — |
| Search | `.ris-search` > svg + `.ris-input` | `aria-label` se senza label |
| Select | `.ris-select` | nativo, freccia custom |
| Textarea | `.ris-textarea` | resize verticale |
| Checkbox | `label.ris-checkbox > input[type=checkbox]` | label = target (≥24px) |
| Radio | `label.ris-radio > input[type=radio]` | rombo clip; stesso pattern |
| Switch | `label.ris-switch > input[type=checkbox][role=switch]` | on = accent |
| Slider | `input[type=range].ris-slider` | mostrare il valore corrente accanto alla label |

## Tabella `.ris-table`

Wrapper `.ris-table-wrap` (scroll x, opz. max-height per sticky head).
`th` sortabile: `aria-sort="ascending|descending"`. Celle numeriche: classe `num`
(mono, tabular, right). Riga selezionata: `data-selected="true"`.

## Overlay

- **Modal**: `.ris-modal-backdrop` > `.ris-modal[role=dialog][aria-modal=true][aria-labelledby]`
  con head/body/foot. Chiusura: Esc, click backdrop, bottone con `aria-label`.
  Focus trap a carico dell'app (o `<dialog>` nativo).
- **Toast**: stack `.ris-toast-stack[role=status][aria-live=polite]`;
  item `.ris-toast` + `--success|warning|danger`, titolo `.title`. Auto-dismiss ≥4s.
- **Alert inline**: `.ris-alert` + varianti; icona + `.title` + testo.
- **Tooltip**: `.ris-tip[data-tip]` — appare su hover E focus-visible; solo testo
  supplementare, mai contenuto essenziale.
- **Menu**: `.ris-menu` > `.ris-menu-item` (+`--danger`), separatore `.ris-menu-sep[role=separator]`.
  Per dropdown reali: `role="menu"/"menuitem"` + gestione frecce a carico dell'app.

## Navigazione secondaria

- **Tabs**: `.ris-tabs[role=tablist]` > `.ris-tab[role=tab][aria-selected]`.
- **Subtabs** (segmented): `.ris-subtabs` stesso pattern; `.ris-subtabs--scrollable` per gestione orizzontale su schermi stretti (<768px).
- **Breadcrumb**: `nav.ris-breadcrumb[aria-label]`; corrente `aria-current="page"`.
- **Pagination**: `nav.ris-pagination`; pagina corrente `aria-current="page"`;
  prev/next con `aria-label`.

## Dati e telemetria

- **KPI** `.ris-kpi`: `.kpi-label` + `.kpi-value` (+`small` unità) + `.kpi-delta.up/.down`.
  Accent per metrica: `--ris-kpi-accent`.
- **Progress bar** `.ris-progress`: barra lineare continua cyber; determinata (`> .bar` con larghezza %) o indeterminata (`.ris-progress--indeterminate > .bar` con scorrimento continuo a nastro). Sostituisce i loader circolari M3.
- **Meter** `.ris-meter` / **SegMeter** `.ris-segmeter`: `role="meter"` +
  `aria-valuenow/min/max` + `aria-label`.
- **Confidence** `.ris-conf--high|medium|low`.
- **Facet** `.ris-facet`: head (nome+stat), row (anchor/track/needle), conf.
- **List row** `.ris-listrow`: card orizzontale con `.thumb`, `.body` / `.content`, `.title`, `.meta`, `.time` (selezione: `data-selected="true"`).
- **Stat HUD** `.ris-stat`: valore numerico compatto `.v` con label `.n` e `.ris-segmeter` per topbar/header.
- **Log** `.ris-log` (span `.t/.ok/.warn/.err`), **Code** `.ris-code`, **Kbd** `.ris-kbd`.

## Avanzati

- **Accordion** `.ris-accordion` > `<details>/<summary>` nativi + `.body` —
  tastiera e semantica gratis; aperto = barra accent sinistra.
- **Stepper** `.ris-stepper` > `.ris-step[data-state="done|active|"]` con
  `.bar` + `.name[data-n]`. Per wizard/onboarding.
- **Drawer** `.ris-drawer[data-open]` + `.ris-drawer-backdrop` —
  `role="dialog" aria-modal` + chiusura Esc/backdrop come la modale.
- **Command palette** `.ris-cmdk` (input + `.ris-cmdk-list` > `.ris-cmdk-item`) —
  selezione `aria-selected`; navigazione frecce a carico dell'app.
- **Dropzone** `.ris-dropzone[data-drag]` — `role="button"` + `tabindex="0"`,
  hint formato/limite in `.hint`.

## Feedback di caricamento / vuoto

- **Skeleton** `.ris-skeleton` (shimmer; spento con reduced-motion).
- **Empty** `.ris-empty`: icona + `.title` + testo + CTA.
- **Spinner** `.ris-spinner` con `role="status"` + `aria-label`.

## Grafici (`js/ris-charts.js`)

SVG, zero dipendenze, stile RIS (grid dura, stroke neon + glow, marker quadrati,
label mono). Tutte le animazioni rispettano `prefers-reduced-motion`.
Un grafico è decorativo: fornire SEMPRE alternativa testuale/tabellare;
`opts.label` diventa `aria-label` riassuntivo.
Tutti i grafici supportano la telemetria Kiroshi HUD al 100% su dati reali,
scrubber tattico interattivo (hover mouse, touch drag, frecce tastiera)
e micro-sweep phosphor continuo (4.5s) con trigger su viewport scroll.

| Funzione | Uso | Opzioni chiave |
|---|---|---|
| `RisCharts.line(el, points, opts)` | serie temporali (HR, peso…) con scrubber tattico | `unit`, `categories`, `color`, `area`, `gridX/Y`, `interactive`, `ambientSweep`, `animate` |
| `RisCharts.bars(el, values, opts)` | conteggi con column focus overdrive & HUD callout | `unit`, `categories`, `color`, `highlight`, `gap`, `interactive`, `ambientSweep`, `animate` |
| `RisCharts.spark(el, points)` | sparkline inline 96×28 (compatto, non-interattivo) | come line |
| `RisCharts.gauge(el, value01, opts)` | gauge segmentato HUD con breathing pulse attivo | `segments`, `caption`, `unit`, `interactive` |
| `RisCharts.wave(el, opts)` | waveform EEG animata continua (RAF) | `freq`, `amp`, `animate:false` per statica |
| `RisCharts.bands(el, bands, opts)` | bande EEG / barre orizzontali animate | `[{name,value,color}]`, `animate` |
| `RisCharts.eegWaveform(el, channels, opts)` | waveform EEG multi-canale da dati reali (EEG live) | `[[v,…],…]`, `colors`, `width`, `height` |
| `RisCharts.intraday(el, points, opts)` | trend del giorno con baseline band, peak markers & HUD scrubber | `[{t,v}]`, `baseline:{median,lo,hi}`, `peakThreshold`, `unit`, `hourStep`, `color`, `interactive` |
| `RisCharts.replay(elOrSvg)` | riesegue a comando le animazioni di ingresso | accetta SVG o contenitore genitore |

## FX — Glitch / CRT (`css/ris-fx.css`)

Layer opzionale, decorativo, opt-in. Regole: max **1 hero glitch per vista**;
CRT su shell/panel, mai su testo denso; un FX non porta mai significato
(WCAG 1.4.1); tutto si spegne o degrada a statico con reduced-motion.

| Classe | Effetto |
|---|---|
| `.ris-glitch[data-text]` | RGB split + slice jitter periodico (≤3 flash/s — 2.3.1) |
| `.ris-glitch--hover` | glitch solo su hover (0.45s one-shot) |
| `.ris-crt` (+ figlio `.ris-crt-band`) | fosfori RGB + scanline + vignetta tubo + banda scansione |
| `.ris-noise` | neve analogica (turbolenza SVG) per no-signal/empty |
| `.ris-signal-lost` | jitter orizzontale + chroma tear per stati errore |
| `.ris-boot` | reveal scaglionato dei figli (power-on) |
| `.ris-poweron` | flash CRT di accensione vista (one-shot) |
| `.ris-glow-text` / `--2` / `.ris-glow-border` | bagliore fosforo accent |
| `.ris-pulse-glow` | respiro neon (armed/listening) |
| `.ris-caret` | cursore terminale lampeggiante |
| `.ris-data-updated` | flash riga/cella al refresh del dato (toggle via JS) |
| `.ris-holo` | shimmer olografico per loghi |

**Stati attivi / live** — il moto accompagna **sempre** label/icona (mai da solo,
WCAG 1.4.1); fallback statico ma riconoscibile sotto reduced-motion.

| Classe | Stato | Markup |
|---|---|---|
| `.ris-rec` | recording | `<span class="ris-rec">Rec · 00:42</span>` (dot rosso pulsante via `::before`) |
| `.ris-acquiring` | acquisizione live | su un `.ris-panel` → bordo che respira (glow in/out) |
| `.ris-playing` | riproduzione | `<span class="ris-playing"><i></i><i></i><i></i><i></i></span>` (equalizer) |
| `.ris-scan` | scanning/connessione | su un contenitore → riga di sweep verticale (richiede `overflow:hidden`, già nella classe) |

## Icone (Tabler Icons · Licenza MIT)

Il set iconografico del sistema è basato sulla libreria open-source **Tabler Icons** (Licenza MIT pura, griglia 24×24px, `stroke: currentColor; stroke-width: 1.75; stroke-linecap: round; stroke-linejoin: round;`).
Garantisce massima precisione geometrica, qualità vettoriale professionale ed eleganza costante su HUD, telemetria e mobile.

`<svg class="ris-icon" aria-hidden="true"><use href="icons/ris-icons.svg#ris-NAME"/></svg>`
Taglie: `--sm` 14px, default 18px, `--lg` 24px, `--xl` 32px.
Set completo di 132 icone: generiche (nav, azioni, stato, sistema, connettività, chart) +
biofeedback (`heart`, `heart-pulse`, `ecg`, `hrv`, `pulse`, `bp`, `blood-drop`,
`spo2`, `brain`, `eeg`, `meditation`, `stress`, `focus`, `sleep`, `bed`, `lungs`,
`respiration`, `wind`, `steps`, `run`, `walk`, `flame`, `vo2`, `pai`, `dumbbell`,
`scale`, `body`, `bia`, `muscle`, `bone`, `water`, `temperature`, `dna`, `pill`,
`stethoscope`) + dispositivi/implant (`nfc`, `implant`, `chip-card`, `hand-chip`,
`watch`, `sensor`, `scan`, `fingerprint`).

**Brand/social**: `mail` (glifo stroke generico) + i loghi solidi `linkedin`,
`github`, `medium` — questi ultimi sovrascrivono il default dello sprite con
`fill="currentColor" stroke="none"`. Usali **solo** per un link reale verso quella
piattaforma (mai come decorazione generica).

## Skin `cyber` (`css/ris-skin-cyber.css`, opt-in)

Attiva con `data-skin="cyber"` su `<html>` + `<link>` caricato **per ultimo**.
Solo dark. Vedi GUIDELINES §8 (è un'eccezione consapevole al de-slop, AA mantenuta).

**Componenti skin-scoped:**
- `.ris-listrow` — riga lista con `.thumb` (img/box 84×48) + `.body` (`.title`
  display/cyan + `.meta` mono/rosso) + `.time`. Selezione: `data-selected="true"`
  → **fill pieno** + testo invert. Reference: Load Game / Contacts / Inventory.
  Per liste navigabili usa `role="listbox"`/`option` + `aria-selected` sul markup.
- `.ris-stat` — stat da topbar: `.v` (valore display/cyan) + `.n` (label/verde) +
  `.ris-segmeter` (riusa il meter segmentato). Dai sempre `aria-label` al meter.

**Utility decorative** (puro decoro → `aria-hidden="true"`):
- `.ris-serial` — codici device (`<b>` per la parte accesa). Es. `PROTOCOL 6520-A44`.
- `.ris-hex` — blocco hex dump (usa `<pre>`).
- `.ris-binary` — stream binario verticale per gli angoli.
- `.ris-ruler` + `--left`/`--right` — tacche-righello fisse sui bordi schermo.
- `.ris-ticker` — blocchetto dati mono fisso (default in basso a sinistra).

**Override automatici** (nessuna classe da aggiungere): topbar con riga rossa
glow, `.ris-btn--primary` con alone, selezione tabella a fill, `.ris-tip` con
bordo giallo, `.ris-panel`/`.ris-bracket` rossi, focus input con glow cyan.

**Mobile** (`@media ≤767px`): il sistema base commuta a topbar + `.ris-bottomnav`;
lo skin nasconde `.ris-ruler`, alza il ticker sopra la nav, dà alla bottomnav la
riga rossa glow, compatta `.ris-listrow` e `.ris-stat`, e passa a
`background-attachment:scroll` (no jank iOS). Demo: `docs/mobile.html`.

## Componenti Animati & Motion System (v2)

Integrazione Kiroshi Tactical HUD + ingegneria del movimento Emil Kowalski (zero reflow, 60fps, WCAG 2.2 AA).

### 1. Accordion Disclosure (`.ris-acc`)
Transizione a **CSS Grid (`grid-template-rows: 0fr → 1fr`)** in 200ms (`--ris-dur-base`) con `--ris-ease-out`:
```html
<div class="ris-acc">
  <div class="ris-acc-item" data-open="false">
    <button class="ris-acc-trigger" aria-expanded="false" onclick="this.setAttribute('aria-expanded', this.getAttribute('aria-expanded')==='true'?'false':'true'); this.parentElement.setAttribute('data-open', this.getAttribute('aria-expanded'))">
      <span>[ PARTE 01 ] // CANALE CRITTOGRAFICO</span>
      <span class="ris-acc-chevron">▼</span>
    </button>
    <div class="ris-acc-drawer">
      <div class="ris-acc-body">
        <div class="ris-acc-body-inner">Contenuto fluido a zero reflow.</div>
      </div>
    </div>
  </div>
</div>
```

### 2. Bottom Sheet Mobile (`.ris-sheet`)
Sostituisce le modali centrate su schermi `<768px`. Scivola dal basso (`translateY(100%) → translateY(0)`) in 240ms (`--ris-dur-enter` con `--ris-ease-out`):
```html
<div class="ris-sheet-backdrop">
  <div class="ris-sheet">
    <div class="ris-sheet-handle"></div>
    <div class="ris-sheet-head">
      <div class="title">[ HUD // AZIONI RAPIDE ]</div>
      <button class="ris-btn ris-btn--sm">&times;</button>
    </div>
    <div class="ris-sheet-body">...</div>
    <div class="ris-sheet-foot">...</div>
  </div>
</div>
```

### 3. Switch Meccanico (`.ris-switch`)
Slitta fisica angolare a 140ms (`--ris-dur-fast` con `--ris-ease-snap`):
```html
<label class="ris-switch">
  <input type="checkbox" checked>
  <span>KIROSHI SCANNER OVERLAY</span>
</label>
```

### 4. Radar Sweep HUD (`.ris-radar`)
Scanning beam continuo a 2.2s con reticolo ottico e degradazione statica sotto `prefers-reduced-motion`:
```html
<div class="ris-panel ris-radar" style="min-height:120px;">
  <!-- contenuto telemetrico con z-index:2 -->
</div>
```

### 5. Toast Stack di Sistema (`.ris-toast-stack`)
Impilamento a cascata con scale progressivo (`scale(0.96)`) stile Sonner:
```html
<div class="ris-toast-stack">
  <div class="ris-toast">
    <div>
      <span class="title">[ TELEMETRIA AGGIORNATA ]</span>
      <div>Pacchetto #084-K ricevuto e validato.</div>
    </div>
  </div>
</div>
```


# RIS v2 — Guidelines

Principi del Relic Interface System. Vale per web (css/), Android (compose/) e
qualsiasi nuovo target. I token sono l'unica fonte di verità
(`tokens/ris.tokens.json` ↔ `css/ris-tokens.css` ↔ `compose/Color.kt`): mai
hardcodare hex nei componenti.

## 1. Identità

- **Graphite, mai nero puro.** Stack superfici `#060708 → #232c33`; la struttura
  la danno i bordi 1px, non le ombre morbide.
- **Angoli clippati, mai arrotondati.** Radius 0; corner-cut 6px (chip/input/btn),
  10px (panel), 16px (modal/hero).
- **Accento = significato.** Amber-sodio: attivo/CTA/pending. Steel-ice: dati/link/scan.
  Rosso: pericolo/blocco. Verde: online/approvato. Violet: inferenza.
  Orchidea: runtime Gumi. Orange: correzioni. Un accento che non significa nulla
  non va usato.
- **Palette forense / strumento d'archivio**: colori dati freddi e precisi, un solo
  accento caldo confidente (amber-sodio `#e6a23c`), steel-ice `#6fb3c9` per i dati,
  red `#d45565` — usati come *fill*; le varianti contestuali sono tarate AA per tema.
  Niente neon saturo: la riconoscibilità viene dal rigore, non dal genere.
- **Glow = eccezione, non default.** Lo stato si segnala con contrasto + peso del
  bordo (`--ris-line*`, `--ris-accent-line`), non col bagliore. Un'unica via glow
  sanzionata: `--ris-live` per stati genuinamente critici/live (es. acquisizione
  in corso). Le utility glow (`.ris-glow-text/-border`, `.ris-pulse-glow`) restano
  opt-in e non vengono mai applicate dai componenti di default.
- **Texture con parsimonia**: grid 32px sul background, scanline solo su superfici
  hero/modal. Mai sopra testo denso.
- **Motion meccanico**: 90–160ms, steps() per blink, niente bounce. La chrome di
  genere (CRT/scanline rolling/noise/glitch/signal-tear) è stata rimossa: non
  portava payload. Resta solo `.ris-holo` (shimmer del marchio, scoped ai loghi)
  e `.ris-boot` (stagger sobrio).
- **Tipografia**: Archivo (display + body, grotesk da strumento), JetBrains
  Mono (telemetria/valori). Floor 11px solo per metadati.

## 2. Temi

- Dark è il default (`data-theme` assente o `"dark"`). Light: `data-theme="light"`.
- I componenti referenziano SOLO token contestuali (`--ris-cyan`, `--ris-fg2`…):
  il tema giusto arriva da solo.
- Riempimenti accesi: `--ris-X-fill` + testo `--ris-fg-invert` (identici nei due
  temi — il CTA giallo resta giallo).
- Mai mescolare: un componente non legge i token dell'altro tema.

## 3. Brand

`data-brand` su `<html>`: cambia solo `--ris-accent*` e `--ris-accent-2*`.

| Brand | Primario | Secondario | Uso |
|---|---|---|---|
| `relic` (default) | yellow | cyan | workbench di ricerca, command surfaces |
| `biohub` | cyan | green | biofeedback, telemetria salute |
| `vivokey` | red | yellow | auth, fattore di possesso, implant |
| `neutral` | violet | cyan | general use / progetti terzi |

I colori *semantici* (danger, success, stream…) non cambiano mai col brand.

### Skin di contesto-caso (skin complete)

Oltre ai brand prodotto, tre skin per i contesti di trattamento delle prove —
cambiano accent **e** tinta delle superfici (solo in dark; in light solo gli
accent ink, sempre AA). Le chiavi `data-brand` restano stabili per compat con i
consumer; cambiano solo i valori che lo switch alterna.

| Chiave (`data-brand`) | Contesto | Superfici (dark) | Accent | Accent-2 |
|---|---|---|---|---|
| `arasaka` → "sealed" | dossier sigillato — catena di custodia | grafite fredda a punta porpora | red `#d45565` (ctx `#cf5e6b`) | steel-ice `#6fb3c9` |
| `militech` → "field" | raccolta sul campo — annotazione | antracite calda | amber-sodio `#d99a4a` | oliva `#9fae6b` |
| `edgerunners` → "archive" | archivio notturno — cross-reference | grafite porpora | orchidea `#b274c0` (ctx `#be7ecf`) | steel-ice `#6fb3c9` |

Regia per renderli identitari (sempre contrasto + bordo, mai glow): sealed =
severità evidenziaria (bracket rossi, densità sobria); field = densità di campo
(segmeter, stepper, chip annotazione); archive = profondità d'archivio (accenti
orchidea su grafite porpora). Nessuna skin abbonda di FX.

## 4. Accessibilità (WCAG 2.2 AA — vincolante)

- **Contrasto**: ogni token contestuale è ≥4.5:1 su `bg`, `surface-1..3` del suo
  tema (verificato; vedi tabella in AUDIT/specimen). `--ris-fg4` è sotto soglia
  *by design*: solo placeholder/disabled, mai contenuto.
- **1.4.1 Use of Color**: lo stato non è mai solo colore — sempre etichetta o
  icona accanto (chip, stream, risk, alert lo fanno già).
- **2.4.7 Focus Visible**: ring 2px `--ris-focus-ring` via `:focus-visible`,
  offset 2px. Non rimuoverlo mai; per stili custom mantenere ≥3:1 col fondo.
- **2.5.8 Target Size**: bottoni ≥36px, controlli form: l'intera label è il
  target (min-height 24px). Su mobile bottom-nav item ≥44px.
- **2.3.3 / motion**: tutte le animazioni si disattivano con
  `prefers-reduced-motion: reduce` (già nel CSS base). Flicker/blink restano
  sotto le 3 lampi/secondo (1.1s steps — conforme 2.3.1).
- **2.4.1 Bypass Blocks**: `.ris-skip-nav` come primo figlio del body.
- **4.1.2**: pattern ARIA per componente documentati in `COMPONENTS.md`
  (dialog, tablist, meter, switch, sort…). I prototipi nello specimen li usano.
- **1.4.4 Resize**: tutto in px ma layout fluido; verificare zoom 200% senza
  perdita di contenuto (lo specimen regge).
- Test minimi prima di rilasciare una vista: tab-walk completo, screen reader
  spot-check (NVDA/TalkBack), zoom 200%, entrambi i temi.

## 5. Layout responsive

- Breakpoint unico di struttura: **768px**.
  - ≥768: topbar 52px + rail sinistra 64px (`.ris-rail`), contenuto max 1280px.
  - <768: rail nascosta, bottom-nav 60px (`.ris-bottomnav`) con safe-area inset.
- Griglie: `.ris-grid--2/3/4` collassano automaticamente (1024px, 640px).
- Tabelle dense: wrapper `.ris-table-wrap` con scroll orizzontale, mai layout rotto.
- Touch: su mobile niente hover-only (tooltip ha anche `:focus-visible`).

## 6. Icone

- Sprite proprio `icons/ris-icons.svg`: 24×24, stroke 1.75, square caps,
  geometria angolare. `currentColor` sempre.
- Decorative: `aria-hidden="true"`. Significanti: `role="img"` + `<title>`.
- Accent color solo su attivo/alert; default `--ris-fg2/fg3`.
- Niente emoji nelle UI. Lucide ammesso come riserva per glifi mancanti
  (stesso stroke), ma preferire l'estensione dello sprite.

## 7. Scrivere un nuovo componente

1. Solo token; nessun valore magico.
2. Stati obbligatori: default, hover, focus-visible, active, disabled (+
   selected/invalid dove sensato).
3. Verifica nei 2 temi × 4 brand (lo specimen ha i toggle).
4. Contrasto e target size come da §4.
5. Documentalo in `COMPONENTS.md` (anatomia, ARIA, do/don't) e aggiungilo allo
   specimen.
6. Versiona: bump in `CHANGELOG.md`.

## 8. Skin `cyber` — eccezione consapevole al de-slop

`data-skin="cyber"` + `css/ris-skin-cyber.css` (caricato **per ultimo**) riporta
il look&feel Cyberpunk 2077 come **layer opt-in**, sopra il default forensic
de-slopped, senza modificarlo. È una scelta esplicita: dove §1 dice "niente neon
saturo / graphite mai nero / glow eccezione", lo skin fa l'opposto **di
proposito**. La disciplina non sparisce, si sposta:

- **AA resta vincolante** (§4): i neon sono temperati per ≥4.5:1 su near-black
  (es. red testo `#ff4d62`, non `#ff003c`); lo stato resta con label/icona.
- **Solo dark**: lo skin non si applica in `data-theme="light"`.
- **Reversibile**: tutto è scoped a `[data-skin="cyber"]`; togli l'attributo e
  il sistema torna al default. Brand e light intatti.
- **Texture statiche**: scanline/grana sono layer di background, non animazioni →
  reduced-motion safe per natura.

Quando usarlo: prodotti/viste che vogliono dichiaratamente l'estetica di genere.
Quando no: tutto ciò che deve leggere come strumento sobrio → resta sul default.

# cyber77 — handoff per Claude

Design system **RIS** con skin **Cyberpunk 2077** attiva (`data-skin="cyber"`).
Questo file serve a far costruire a Claude un'app che usa questo design senza
reinventare nulla. Copia il prompt qui sotto e adattalo.

> Path relativi: questo file è alla radice di `cyber77/`. I CSS stanno in `css/`,
> le regole in `GUIDELINES.md`, i componenti in `COMPONENTS.md`, i riferimenti
> visivi in `docs/index.html` (desktop) e `docs/mobile.html` (mobile).

---

## Prompt pronto (copia, sostituisci `<APP>`)

> Costruisci `<APP>` usando il design system in questa cartella `cyber77/` (RIS,
> skin Cyberpunk 2077 attiva). **Non** inventare uno stile nuovo: usa quello esistente.
>
> Setup obbligatorio:
> - Aggancia i CSS in `cyber77/css/` **in quest'ordine esatto**:
>   `ris-tokens.css` → `ris.css` → `ris-fx.css` (opzionale) → `ris-skin-cyber.css` (ULTIMO).
> - Root: `<html data-theme="dark" data-brand="vivokey" data-skin="cyber">`.
> - Body: `<body class="ris ris-grid-bg">`.
>
> Regole **non negoziabili**:
> 1. Usa **solo** le classi `.ris-*` e i token CSS (`var(--ris-*)`). **Mai hex**
>    nei componenti; CSS custom ammesso solo per il layout della pagina.
> 2. Componenti, anatomia, ARIA, do/don't → segui `cyber77/COMPONENTS.md`.
>    Principi (identità, temi, brand, a11y) → `cyber77/GUIDELINES.md`.
> 3. **WCAG 2.2 AA**: contrasti, `:focus-visible`, target ≥24px,
>    `prefers-reduced-motion`. **Stato mai solo colore**: sempre label o icona.
> 4. Layout: topbar + rail (desktop) / `.ris-bottomnav` (<768px). Responsive obbligatorio.
> 5. Riferimento visivo: `cyber77/docs/index.html` e `cyber77/docs/mobile.html`.
>
> Dimmi quali schermate servono; parti dai componenti già pronti in `COMPONENTS.md`
> (panel, btn, listrow, table, modal, tabs, kpi, form, ecc.). Se ti serve un
> componente non coperto, costruiscilo con gli stessi token e clip-path angolari,
> poi annotalo.

---

## Wiring (web)

```html
<html data-theme="dark" data-brand="vivokey" data-skin="cyber">
<head>
  <link rel="stylesheet" href="css/ris-tokens.css">
  <link rel="stylesheet" href="css/ris.css">
  <link rel="stylesheet" href="css/ris-fx.css">          <!-- opzionale: boot/glow/holo -->
  <link rel="stylesheet" href="css/ris-skin-cyber.css">  <!-- ULTIMO = look CP2077 -->
</head>
<body class="ris ris-grid-bg">
  <!-- usa classi .ris-* -->
</body>
</html>
```

Togli `data-skin="cyber"` + l'ultimo `<link>` → torna il default forensic disciplinato.

## Tema · Brand · Skin

| Attributo su `<html>` | Valori | Effetto |
|---|---|---|
| `data-theme` | `dark` (default) · `light` | lo skin cyber è **solo dark** |
| `data-brand` | `relic` · `biohub` · `vivokey` · `neutral` (+ `arasaka`/`militech`/`edgerunners`) | cambia solo la coppia accent. `vivokey` = rosso/giallo (più CP) |
| `data-skin` | assente · `cyber` | `cyber` = look Cyberpunk 2077 (rosso strutturale, glow, scanline, font techno) |

## Do / Don't

- ✅ `.ris-btn--primary`, `.ris-panel`, `.ris-listrow`, `var(--ris-accent)`, `var(--ris-red)`…
- ✅ Stato con label+icona (`.ris-stream`, `.ris-risk`, `.ris-chip`).
- ❌ `style="color:#ff003c"` o colori hardcoded → usa i token.
- ❌ Inventare bottoni/card custom quando esiste la classe `.ris-*`.
- ❌ Glow ovunque: nello skin il glow di default è già sul chrome chiave; non aggiungerne a caso.

## Note

- **Non è una libreria** React/Vue: è CSS + classi. Su React/JSX usi le stesse
  classi in `className`. Per Android c'è il port Compose in `../design_handoff/`.
- Cartella rinominata `ris`→`cyber77` (2026-06-30): i nomi file interni
  (`ris-tokens.css`, classi `.ris-*`, `data-skin`) **restano invariati**.
- Specimen live: `cd cyber77 && python3 -m http.server 8080` → `http://localhost:8080/docs/`.
- Lo skin cyber è un'eccezione **consapevole** al default de-slopped (vedi
  `GUIDELINES.md §8`): AA mantenuta, neon temperati, reversibile.

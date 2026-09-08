# RIS v2 Motion System Implementation Plan (Kiroshi Tactical Forensic)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Integrare in modo sistemico e disciplinato le animazioni nel Design System Relic Interface System v2 (`cyber77/`), combinando l'estetica Kiroshi Tactical HUD (Cyberpunk 2077 / Neuromancer) con l'ingegneria del movimento di Emil Kowalski e la conformità WCAG 2.2 AA.

**Architecture:** Approccio a 3 livelli: Token di movimento fisici standardizzati (`ris-tokens.css`) → Componenti UI Core con micro-interazioni hardware a zero reflow (`ris.css`) → Layer FX decorativo e telemetrico HUD opzionale (`ris-fx.css`).

**Tech Stack:** CSS custom properties, modern CSS (CSS Grid interpolation `0fr -> 1fr`, CSS transforms, `prefers-reduced-motion`), HTML5 specimen docs.

## Global Constraints

- **Durate massime:** Micro-feedback fisico ≤ 80ms; Hover/telemetria ≤ 140ms; Disclosure/Tabs ≤ 200ms; Modali/Toast enter ≤ 240ms.
- **Divieto assoluto di `ease-in` per elementi che entrano a schermo:** Sempre `--ris-ease-out` o `--ris-ease-snap`.
- **Zero reflow jank:** Mai animare proprietà geometriche pesanti come `height`, `width`, `top`, `margin`. Usare solo `transform`, `opacity` e CSS Grid `grid-template-rows`.
- **WCAG 2.2 AA non-negoziabile:** Contrasti sempre ≥ 4.5:1 (e ≥ 7:1 AAA per superfici principali).
- **Reduced-motion first:** Con `prefers-reduced-motion: reduce` le animazioni si azzerano istantaneamente senza rompere il layout.
- **Palette Light Mode:** In Light Mode la skin cyber usa rigorosamente l'azzurro/ciano tecnico forense (`#1b6b80` / `#165868`), zero rosso fluorescente.

---

### Task 1: Consolidamento Token di Movimento

**Files:**
- Modify: `cyber77/tokens/ris.tokens.json:90-100`
- Modify: `cyber77/css/ris-tokens.css:65-75`

**Interfaces:**
- Produces: Token CSS `--ris-dur-instant`, `--ris-dur-fast`, `--ris-dur-base`, `--ris-dur-enter`, `--ris-ease-snap`, `--ris-ease-out`, `--ris-ease-in-out`.

- [x] **Step 1: Aggiornare `ris.tokens.json` con la scala completa**
  Aggiungere in `tokens.motion`:
  - `durInstant`: `80ms`
  - `durFast`: `140ms`
  - `durBase`: `200ms`
  - `durEnter`: `240ms`
  - `easeSnap`: `[0.16, 1, 0.3, 1]`
  - `easeOut`: `[0.22, 1, 0.36, 1]`
  - `easeInOut`: `[0.65, 0, 0.35, 1]`

- [x] **Step 2: Aggiornare `ris-tokens.css`**
  Esportare le variabili `:root` corrispondenti per l'uso immediato in tutti i fogli di stile.

- [x] **Step 3: Verifica sintassi e caricamento CSS**
  Verificare che la pagina risponda con i nuovi token CSS caricati correttamente.

---

### Task 2: Implementazione Animazioni nei Componenti Core

**Files:**
- Modify: `cyber77/css/ris.css`

**Interfaces:**
- Consumes: Token di Task 1 (`--ris-dur-instant`, `--ris-dur-fast`, `--ris-dur-base`, `--ris-dur-enter`, `--ris-ease-snap`, `--ris-ease-out`).
- Produces: `.ris-btn:active`, `.ris-acc` (accordion CSS grid), `.ris-modal-box` (enter animation), `.ris-switch`.

- [x] **Step 1: Rifinire i Bottoni (.ris-btn)**
  - `:active`: `transform: scale(0.97)` a `var(--ris-dur-instant)` (80ms) con `var(--ris-ease-snap)`.
  - `:hover`: 
    - Bottoni primari (`.ris-btn--primary`) e righe selezionate: **Invert Highlight** (sfondo pieno accento, testo nero assoluto `#000000` con contrasto 14:1 AAA).
    - Bottoni secondari/outline: **Flash di Bordo & Bracket** (sfondo scuro preservato, bagliore e bracket accesi a contrasto).

- [x] **Step 2: Implementare Accordion con CSS Grid**
  Aggiungere le classi standard `.ris-acc`, `.ris-acc-trigger`, `.ris-acc-drawer`, `.ris-acc-body`:
  - `display: grid; grid-template-rows: 0fr; transition: grid-template-rows var(--ris-dur-base) var(--ris-ease-out);`
  - `.ris-acc[data-open="true"] .ris-acc-drawer { grid-template-rows: 1fr; }`
  - Rotazione chevron a 180deg sincronizzata.

- [x] **Step 3: Implementare Dialog / Modal Box Enter Animation**
  - `@keyframes ris-modal-enter`: da `opacity: 0; transform: scale(0.96);` a `opacity: 1; transform: scale(1);` in `var(--ris-dur-enter)` (220ms) `var(--ris-ease-out)`.
  - Backdrop fade-in in 160ms.

- [x] **Step 4: Implementare Interruttore Meccanico (.ris-switch)**
  - Thumb a slitta con clip-path angolare e transizione `transform var(--ris-dur-fast) var(--ris-ease-snap)`.

---

### Task 3: Layer FX HUD Dinamico & Toast Stacking

**Files:**
- Modify: `cyber77/css/ris-fx.css`

**Interfaces:**
- Consumes: Token di movimento e colori accento brand/skin.
- Produces: `.ris-radar`, `.ris-data-updated`, `.ris-toast-stack`, `.ris-toast`.

- [x] **Step 1: Raffinare il Flash Telemetrico (.ris-data-updated)**
  - Animazione a 2-step (phosphor/ink afterglow) senza reflow a 140ms/600ms totale.

- [x] **Step 2: Implementare il Radar Sweep HUD (.ris-radar)**
  - Scanning beam continuo a 2.2s lineare con gradiente angolare e maschera circolare/rettangolare.
  - Sotto `prefers-reduced-motion: reduce`, degrada a griglia fissa senza rotazione.

- [x] **Step 3: Implementare Toast HUD Stack stile Sonner / Emil Kowalski**
  - Container `.ris-toast-stack` posizionato in basso a destra su desktop.
  - Transizione a cascata: il toast più recente entra con `translateY(12px) scale(0.97)` → `translateY(0) scale(1)` in 220ms (`--ris-ease-out`).
  - I toast precedenti slittano verso l'alto con scala ridotta (`scale(0.96)`) e opacità 0.9.
  - Timeout predefinito a 4s con uscita accelerata `translateY(8px) scale(0.97)` in 160ms.

---

### Task 4: Mobile & Touch Interaction Motion (Ergonomia & Bottom Sheet)

**Files:**
- Modify: `cyber77/css/ris.css`
- Modify: `cyber77/docs/mobile.html`

**Interfaces:**
- Produces: `.ris-sheet`, `.ris-sheet-handle`, `.ris-bottomnav` punch, Master-Detail push.

- [x] **Step 1: Ergonomia Tattile e Prevenzione "Sticky Hover"**
  - Incapsulare gli stati `:hover` non rilevanti per il touch in `@media (hover: hover)`.
  - Aggiungere `-webkit-tap-highlight-color: transparent` e `touch-action: manipulation`.
  - Garantire target tattili minimi di 44x44px per pulsanti e link della bottomnav.

- [x] **Step 2: Implementare il Bottom Sheet Tattico (.ris-sheet)**
  - Su breakpoint `<768px`, le finestre modali assumono il layout Bottom Sheet ancorato in basso.
  - Entrata: da `transform: translateY(100%)` a `translateY(0)` in 240ms (`--ris-dur-enter` con `--ris-ease-out`).
  - Uscita: `translateY(100%)` in 160ms con `--ris-ease-snap`.
  - Maniglia tattica HUD `.ris-sheet-handle` con supporto a gesture di trascinamento touchstart/touchmove nativo leggero (soglia al 35%) e chiusura al tap su backdrop o maniglia.

- [x] **Step 3: Micro-Punch Tattile sulla Bottomnav (.ris-bottomnav)**
  - Al tap sulle voci della navigation bar: feedback a scatto immediato `:active .ris-icon { transform: scale(0.88); transition: transform 80ms var(--ris-ease-snap); }`.
  - Transizione fluida della tacca attiva (`data-active="true"`).

- [x] **Step 4: Transizioni di Schermo Master-Detail su Mobile Specimen**
  - Aggiornare `cyber77/docs/mobile.html`: il tap su un contatto della lista (`.ris-listrow`) attiva una transizione push orizzontale (`translateX(100%) → 0` in 220ms `--ris-ease-out`) con pulsante di back HUD per tornare alla lista.

---

### Task 5: Consolidamento Skin Cyber Light Mode (Azzurro Tecnico Drafting)

**Files:**
- Modify: `cyber77/css/ris-skin-cyber.css`

**Interfaces:**
- Assicura che tutti i componenti (accordion, toast, radar, switch, bottom sheet) in Skin Cyber Light usino la palette azzurro/ciano `#1b6b80` / `#165868` senza sbattimenti.

- [x] **Step 1: Verificare e rifinire regole `[data-skin="cyber"][data-theme="light"]`**
  - Accordion header e bordi in azzurro/ciano.
  - Toast HUD con accento azzurro anziché rosso.
  - Bottom sheet mobile con bordo superiore in azzurro/ciano e zero bagliori crimson.
  - Effetti continui (radar sweep, scanline, pulse) renderizzati in ciano/ardesia a bassa opacità (10-15%) stile cianografia tecnica drafting, confortevoli per gli occhi.

---

### Task 6: Aggiornamento Documentazione e Specimen

**Files:**
- Modify: `cyber77/COMPONENTS.md`
- Modify: `cyber77/GUIDELINES.md`
- Modify: `cyber77/docs/index.html`
- Modify: `cyber77/docs/mobile.html`
- Preservare: `cyber77/docs/motion-lab.html` (playground di calibrazione permanente)

- [x] **Step 1: Documentare i nuovi componenti in `COMPONENTS.md`**
  - Accordion (HTML, classi, ARIA `aria-expanded`).
  - Bottom Sheet mobile (`.ris-sheet`, anatomia, gesture).
  - Toast HUD (markup, timing raccomandato 4s).
  - Tactical Switch.
  - Radar Viewport.

- [x] **Step 2: Aggiornare le linee guida in `GUIDELINES.md`**
  - Aggiungere il decalogo del movimento Emil Kowalski per RIS v2 (desktop + mobile ergonomics, divieto di `ease-in` per ingressi, zero reflow).

- [x] **Step 3: Aggiornare la pagina principale `cyber77/docs/index.html` e `cyber77/docs/mobile.html`**
  - Inserire le sezioni interattive live per i componenti animati con controlli di tema e skin.
  - Collegamento bidirezionale al `motion-lab.html`.

---

### Task 7: Verifica Finale & A11y Audit (Desktop & Mobile LAN)

**Files:**
- Test via browser / LAN su `http://192.168.1.185:8080/docs/motion-lab.html`, `http://192.168.1.185:8080/docs/index.html` e `http://192.168.1.185:8080/docs/mobile.html`

- [x] **Step 1: Verificare contrasti WCAG 2.2 AA/AAA (dark e light)**
- [x] **Step 2: Verificare `prefers-reduced-motion` su tutti i componenti**
- [x] **Step 3: Verificare i brand multipli (Relic, BioHub, VivoKey, Neutral)**
- [x] **Step 4: Test ergonomico reale su smartphone/touchscreen da rete LAN (assenza di sticky hover, feedback immediato, fluidità bottom sheet e push master-detail)**


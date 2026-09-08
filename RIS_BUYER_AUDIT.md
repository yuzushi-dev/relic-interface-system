# RIS v2.8.0 Pro — Audit d'acquisto (prospettiva Lead Frontend Architect / compratore aziendale)
Data: 2026-09-08 · Commit: dcfa03d · Fascia valutata: $49–$129

**Verdetto: NON ACQUISTARE nella forma attuale.** Il nucleo tecnico (`css/ris-tokens.css`) è
genuinamente buono e misurabilmente AA-compliant. Tutto ciò che sta sopra — licenza, deliverable
Figma, template Next.js, asset di marketing — non regge una due-diligence di 30 minuti.

---

## 1. I dieci motivi per cui si chiude la scheda

Ordinati per potere di uccisione della vendita, non per severità tecnica.

### 1.1 — La licenza rende il prodotto Pro già gratuito (dealbreaker legale)
`LICENSE` alla root è MIT pura, senza alcuna carve-out: «Permission is hereby granted ... to any
person obtaining a copy of the Software ... including without limitation the rights to use, copy,
modify, merge, publish, distribute, sublicense, and/or **sell**». "The Software" copre l'intero
repository, `templates/forensic-dashboard/` e `figma/` inclusi. Quindi i $69 del template Next.js e
i $49 del kit Figma comprano file che chiunque può clonare da
`https://github.com/yuzushi-dev/relic-interface-system` e rivendere legalmente.

Peggio: `LICENSE_PRO.md` §3.2 vieta al licenziatario di «Host raw RIS Pro files in public
GitHub/GitLab repositories» — divieto che il licenziante viola per primo, pubblicamente. Un ufficio
legale aziendale chiude qui e non arriva alla seconda pagina. Non è ambiguità sanabile a posteriori:
la MIT è irrevocabile per ogni copia già distribuita.

### 1.2 — Il file `.fig` venduto non esiste
`docs/COMMERCIAL_PRICING.md` §1 vende «the turn-key Figma Studio Kit (`.fig` file with 150+
components, Auto Layout 5.0, variables, master generator)». `LICENSE_PRO.md` in preambolo elenca
«The Figma Studio Kit (`figma/` master `.fig` bundle, variables, and components)».

    $ find . -name "*.fig" | wc -l
    0

Il README nello stesso repo dice invece «60+ component variants». Tre numeri diversi (60+ / 150+ /
zero) per lo stesso SKU. Questo è materiale da chargeback, non da roadmap.

### 1.3 — Il "kit Figma" produce frame, non componenti
Quello che esiste è `figma/code.js`, 1967 righe di script generatore. Analisi delle chiamate API:

| Chiamata | Occorrenze |
|---|---|
| `figma.createFrame` | **112** |
| `figma.createComponent` | **1** |
| `figma.combineAsVariants` | **2** |
| `layoutMode` (Auto Layout) | 94 |

Un Frame non è un Component: niente istanze, niente instance-swap, niente override, niente
pubblicazione come team library, niente detach. Il deliverable reale è una tavola di disegni statici
che il compratore deve componentizzare a mano — cioè esattamente il lavoro per cui sta pagando.
"60+ component variants" con 2 `combineAsVariants` non è difendibile.

In più `figma/manifest.json` non dichiara `networkAccess`, campo richiesto dal manifest Figma per la
pubblicazione (da verificare contro la spec corrente, ma nella migliore delle ipotesi è una svista). E il generatore ha un
`loadFontSafe(...)` con fallback a Inter: se il compratore non ha Chakra Petch / Archivo /
JetBrains Mono installati localmente, genera silenziosamente un kit che non somiglia al marketing.

### 1.4 — Trade dress e marchi Cyberpunk 2077 dentro un prodotto commerciale
Sotto una nota legale che dichiara «All styling, SVG geometry, color token architectures, Canvas
renderers, and motion timings are entirely bespoke and unencumbered» (README, ultima sezione):

- `docs/mobile.html` — "Delamain" (×2), "Street Cred"
- `docs/index.html` — "Netrunner"
- `preview/cyber-overview.html`, `preview/cyber-mobile.html` — "Street Cred", "Delamain"
- `css/ris-skin-cyber.css`, `CHANGELOG.md` — "STREET CRED"
- `assets/mobile-preview.png` — "KIROSHI FORENSIC", valuta "€$" (eurodollar)
- `assets/dashboard-preview.png` — "Automatic Love — AutoSave-7", "Gig: Hippocratic Oath",
  "NORTHSIDE · STREETKID · LEVEL 12"
- README stesso: «disciplined neon accents (**Cyberpunk 2077 palette**)»

Delamain, Kiroshi e Street Cred sono elementi in-universe di CD Projekt Red. Le loro fan content
guidelines non coprono l'uso commerciale. Per un acquisto aziendale questo è uno stop di
procurement: si sta trasferendo rischio IP al compratore, con in allegato una dichiarazione scritta
che quel rischio non esiste.

### 1.5 — Lo SKU standalone da $69 non installa
`templates/forensic-dashboard/package.json`:

    "private": true,
    "dependencies": {
      "@relic-ui/react": "file:../../react",
      "@relic-ui/tailwind": "file:../../tailwind",

Tre problemi composti: (a) `file:../../` punta fuori dalla cartella venduta — se il buyer riceve
solo il template, `npm install` fallisce; (b) `"private": true` impedisce la pubblicazione;
(c) `.gitignore` ignora `dist/`, quindi `react/dist/` non è tracciato e `@relic-ui/react`
(`"main": "dist/index.js"`) risolve nel vuoto anche clonando l'intero repo. La causa è più precisa
del `.gitignore`: `react/package.json` definisce `prepack`, ma npm esegue `prepare` — non `prepack` —
per le dipendenze `file:`, quindi il build non parte mai all'install. E non c'è `package.json` alla
root né alcuno script che compili la dipendenza prima del template.
Non esiste `.github/`, quindi nessuna CI dimostra che questo percorso funzioni.

Contorno: `next: ^14.2.24` nel settembre 2026, e `metadata.icons.icon: '/favicon.ico'` in
`app/layout.tsx:11` con `public/` che contiene solo `icons/` — 404 a ogni caricamento.

### 1.6 — Gli screenshot di marketing mostrano UI rotta e obsoleta
Sono i primi tre pixel che il compratore vede, e due su tre sono difettosi.

**`assets/mobile-preview.png`** — il grafico "HEART RATE · 7 DAYS" ha lo stroke ciano che muore dopo
due segmenti, con l'area fill grigia staccata dalla linea; "WEEKLY STEPS" renderizza **una sola
barra** in basso a sinistra su sette; il segmeter "BLE LINK & BATTERY" è quasi invisibile; un terzo
inferiore del pannello è vuoto. Si sta vendendo un motore di grafici usando come vetrina un
grafico che non si disegna.

**`assets/charts-preview.png`** — interamente in **italiano** ("GRAFICI", "PASSI · SETTIMANA",
"BANDE EEG", "STRESS · OGGI") su uno store in USD. È un crop di metà pagina con una riga tagliata a
metà in cima. E contiene la contraddizione perfetta: il sottotitolo dichiara «DATI 100% REALI» a
quaranta pixel dal bottone «SIMULA REFRESH DATO → FLASH RIGA». Le bande EEG usano rosa/viola/arancio,
fuori dalla disciplina a 4 colori dichiarata nelle GUIDELINES.

**`assets/dashboard-preview.png`** — è etichettato "Forensic Telemetry Dashboard" nel README ma
**non mostra il template Next.js**: è la pagina specimen con skin cyber, marcata **V2.0.0**, con
metà destra vuota e un muro di prosa. Gli asset sono stantii rispetto al codice: lo specimen attuale
è `lang="en"` e non contiene una stringa italiana, quindi questi PNG sono almeno 8 minor version
indietro.

### 1.7 — Il codice del venditore contraddice le sue stesse promesse
README, principio #5: «**Strict Real Data**: No randomized mock generators or fake hashes in charts».
README del template, §5: «Zero dummy lore or fabricated hashes in telemetry charts».

    templates/forensic-dashboard/components/EventLogStream.tsx:115-116
      const interval = setInterval(() => {
        const template = SIMULATED_FEED[Math.floor(Math.random() * SIMULATED_FEED.length)];

    templates/forensic-dashboard/app/page.tsx:71
      SESSION: <strong>0x9F4C-AA28</strong>

    assets/hero-banner.png
      SHA-256: 0x889F...771B [VALIDATED]

Un `Math.random()` in un `setInterval` dentro un componente client è anche un rischio di
hydration mismatch e rende il template non deterministico in test/screenshot.

### 1.8 — "Zero Layout Reflow" violato nel template di punta
Il badge nel README recita «Zero Reflow @60fps» e il principio #4 dice «Animate only `transform` and
`opacity`. Never animate `height`, `width`, or `top`».

    templates/forensic-dashboard/app/page.tsx:52-54
      className={`flex-1 ... transition-all duration-fast ... mx-auto w-full ${
        isSidebarCollapsed ? 'md:ml-[64px]' : 'md:ml-[230px]'
      }`}

`transition-all` su un cambio di `margin-left`: reflow animato del contenitore principale a ogni
collasso della sidebar, esattamente ciò che il prodotto vende come risolto. Nota collaterale:
`mx-auto` e `md:ml-[230px]` si contendono lo stesso longhand, quindi il centraggio dichiarato non
avviene da `md` in su. (Verificato che `duration-fast` **esiste** nel preset venduto:
`tailwind/index.js:234` definisce `transitionDuration` e lo espone via `themeExtension`. Il difetto è
la proprietà animata, non la classe.)

### 1.9 — La promessa centrale di un design system — una sola fonte di verità — non è mantenuta
Gli stessi token vivono, non generati, in sei posti:

| File | Forma |
|---|---|
| `css/ris-tokens.css` | CSS custom properties (la fonte de facto) |
| `tokens/ris.tokens.json` | DTCG con `$extensions.ris.light` |
| `figma/tokens.json` | Tokens Studio, nesting `global.*` |
| `tailwind/index.js` | oggetto JS |
| `compose/Color.kt` | costanti Kotlin |
| `templates/forensic-dashboard/app/globals.css` | **747 righe ricopiate a mano** |

Nessuno script di build, nessuno Style Dictionary, nessuna CI. Va dato atto che **oggi la deriva non
si è ancora consumata**: ho campionato 19 esadecimali fra `css/ris-tokens.css` e gli 84 colori di
`compose/Color.kt` (fg1-fg4, i fill dark, gli ink accents light, la scala superfici light) e
combaciano tutti — la "Native Android Parity ... identical tokens" del README regge alla verifica.
Ma è parità mantenuta a mano su sei copie senza un test che la protegga: è una condizione, non una
proprietà. Il template Pro è già l'eccezione, una copia di 747 righe invece di un `@import` dei CSS
core. Inoltre `$extensions.ris.light`
è un'estensione proprietaria: né Tokens Studio né Style Dictionary sanno leggerla, quindi il tema
chiaro **non è importabile in Figma** da quel file, che è precisamente ciò per cui esiste. Il
formato DTCG viene citato come feature e usato come decorazione.

### 1.10 — Nessuna prova di qualità e nessun soggetto giuridico dietro un acquisto da $299
Zero test (nessun `*.test.*` o `*.spec.*` nel repo), zero CI (`.github/` non esiste), zero
`CONTRIBUTING.md`, zero `SECURITY.md`. Il badge WCAG è auto-dichiarato: nessun report axe, nessuna
tabella di rapporti pubblicata — pur avendo scritto `getContrastRatio()` e `getContrastTag()` in
`figma/code.js` e non averli mai fatti girare come report.

Alla root del repo, linkato dal README, siede `AUDIT.md`: il documento di lavoro interno, con una
tabella di ❌ e ⚠️ contro il prodotto stesso. Accanto, `docs/COMMERCIAL_PRICING.md` espone
pubblicamente strategia di margine, benchmark e demolizioni nominali dei concorrenti (Arwes
«experimental/alpha, lacks WCAG», Untitled UI «Stripe/Linear clone», Aceternity, Magic UI). Il
compratore vede il proprio margine e il denigratorio sulla concorrenza prima di vedere una demo.
Identità commerciale frammentata su tre nomi — `yuzushi-dev`, `relic-ui.dev`, «Relic Interface
System Team» — senza ragione sociale, sede o P.IVA: una Team License da $299 con SLA 48h non passa
un onboarding fornitori.

---

### Difetti di secondo livello (non uccidono la vendita, ma emergono in code review)

- **Nessun `"use client"` in `react/src/`**, in nessuno dei 18 componenti, mentre sei usano hook
  (`Accordion`, `Charts`, `Modal`, `Sheet`, `Tabs`, `ToastProvider`). Il difetto è mascherato dal
  fatto che `templates/forensic-dashboard/app/page.tsx:1` è `'use client'` e apre un confine client
  su tutto l'albero. Nel momento in cui il compratore usa RIS in un vero albero RSC — cioè la ragione
  per cui si sceglie l'App Router — quei componenti lanciano. Quindi «Complete App Router
  application» è insieme sovravenduto e occultante.
- **Pacchetto npm non consumabile fuori da un bundler**: `react/package.json` non ha `"type"`,
  `main` punta a ESM con import senza estensione (`./components/Button`). Va bene con
  Next/Vite/webpack; rompe sotto Node puro, Jest, vitest SSR. Inoltre `"files": ["dist","src","README.md"]`
  **non include il CSS**: `npm i @relic-ui/react` installa componenti che dipendono da classi `.ris-*`
  che il pacchetto non spedisce e non esporta (`./styles.css` assente da `exports`).
- **ARIA non valida nei motori grafici**, due bug distinti:
  `react/src/utils/risChartsCore.ts:329-345` imposta `role="region"` e poi `aria-valuenow`, che su
  quel ruolo viene ignorato; `js/ris-charts.js:282-301` imposta `tabindex` + `aria-valuenow`
  **senza alcun ruolo**. In entrambi i casi lo screen reader non annuncia il valore scrubbato, cioè
  la feature di a11y più pubblicizzata.
- **ID generati dal testo della label** in tutti e quattro i primitivi di form — proprio quelli
  venduti come upgrade Pro:
  `Input.tsx:13`, `Textarea.tsx:11`, `Select.tsx:18`, `Checkbox.tsx:10` usano
  `` `ris-input-${label.toLowerCase().replace(/\s+/g,'-')}` ``. Due `<Input label="Name" />` nella
  stessa pagina producono `id` duplicati: il secondo `<label htmlFor>` punta al primo campo (WCAG
  1.3.1 / 3.3.2) più warning React. `useId()` è già usato correttamente in `Tabs`, `Accordion`,
  `Switch`, `Modal`, `Sheet` — quindi è incoerenza interna, non ignoranza dell'API.
- **68 righe contenenti `style={{` inline** nei componenti React (9 in `Toast.tsx`, 7 in `Sheet.tsx`
  e in `Modal.tsx`, 6 in `Badge.tsx` e `Accordion.tsx`, 5 in `Alert.tsx`...). Non sovrascrivibili via CSS per specificità, quindi non
  ri-tematizzabili, e richiedono `style-src 'unsafe-inline'`. Per un prodotto che si vende come
  console *forensic/security*, `next.config.mjs` imposta `X-Frame-Options` e `nosniff` ma **nessuna
  Content-Security-Policy**.
- **Preferenze tema scritte e mai lette**: `TopBar.tsx:43,49` fa `localStorage.setItem('ris-theme')`
  e `setItem('ris-brand')`; nessun `getItem` esiste nel template. `app/layout.tsx:31` inchioda
  `data-theme="dark"` nell'HTML e `TopBar` inizializza lo stato *dal DOM*. Il buyer sceglie light,
  ricarica, torna dark. Manca anche lo script bloccante anti-FOUC.
- **Font Google via `@import url(...)` in cima a `app/globals.css`**: render-blocking dentro un
  template Next.js che ha `next/font` a disposizione, con l'aggiunta del problema GDPR
  dell'hotlinking a fonts.googleapis.com per un compratore europeo.
- **`getEngine()` in `Charts.tsx:14-19`** legge `(window as any).RisCharts` e, se presente, sostituisce
  silenziosamente il motore. Un `<script>` in pagina cambia il rendering dei componenti React senza
  che nulla lo dichiari, e il cast è `any`.
- **Il modulo Compose non si costruisce**: `compose/settings.gradle.kts` non contiene alcun `include(...)`
  — il modulo non è incluso nella build — e `compose/build.gradle.kts` dichiara
  `plugins { id("com.android.library"); id("org.jetbrains.kotlin.android") }` senza versioni, senza
  root `build.gradle.kts` e senza wrapper Gradle. Sorgenti piatte montate con l'hack
  `java.srcDirs(".")`. Stack fermo a `compose-bom:2024.09.00` e
  `kotlinCompilerExtensionVersion = "1.5.14"` (Kotlin 1.9), due anni indietro; `compileSdk = 35` con
  `targetSdk` non dichiarato. Il POM generato dichiara **MIT**, mentre il README vende la Compose
  "production suite" nel tier commerciale: terza contraddizione di licenza.

---

## 2. Attrattività visiva e presentazione commerciale

### Quello che funziona
Il linguaggio visivo è genuinamente distintivo. Chamfer a 45° su 6/10/16px, bordi 1px, zero
`border-radius`, superfici grafite con rampa a sei livelli, tipografia Chakra Petch/Archivo/JetBrains
Mono: non somiglia a Tailwind UI né a shadcn, che è precisamente la ragione d'esistere di questo
prodotto. `assets/hero-banner.png` ha un'identità immediatamente riconoscibile e non generica.

**E l'architettura dei token regge alla misura.** Ho calcolato i rapporti WCAG su `css/ris-tokens.css`:

| Coppia | Dark | Light |
|---|---|---|
| fg1 su bg | 16.25 | 15.22 |
| fg2 su bg | 9.22 | 7.75 |
| fg3 su surface-1 | 7.22 | 5.07 |
| accent cyan su bg | 8.37 | 5.85 (ink `#216270`) |
| accent red su bg | 4.93 | 5.18 (ink `#b52f3d`) |

Gli "ink accents" del tema chiaro (`#8a5a12`, `#216270`, `#b52f3d`...) passano davvero AA su
`bg`/`surface-1`/bianco, come afferma il commento a `css/ris-tokens.css:180`. `fg4` fallisce ovunque
(2.63 dark / 2.17 light) ma è documentato «disabled/placeholder only», esente da 1.4.3. Due bordi
non documentati: `fg3` su `--ris-void` in light scende a **4.09**, e l'intera rampa `-dim`
(`#a06a18`, `#c64351`...) sta fra 3.4 e 4.2 — innocua oggi perché usata solo come background in
`css/ris.css:1086`, ma è una trappola per chi la userà come testo. **Il badge AA è sostanzialmente
onesto e questa è la parte migliore del prodotto.** Il problema è che è auto-dichiarato: nessun run
axe, nessuna CI, nessuna tabella pubblicata — e la sua credibilità viene poi bruciata dall'ARIA non
valida nei grafici e dagli `id` duplicati nei form.

Anche dark e light sono reali, non un filtro invertito: il tema chiaro ha una propria famiglia di
accenti "ink" e una propria scala di superfici. È lavoro serio, ed è invisibile nel marketing.

**La disciplina del movimento regge nel core, e si rompe solo nella parte a pagamento.**
`docs/motion-lab.html` (824 righe) dichiara un blocco `prefers-reduced-motion`, `docs/index.html` due,
`css/ris.css` uno. Scansionando tutte le dichiarazioni `transition:`/`animation:` alla ricerca di
proprietà che causano reflow, il core produce due sole occorrenze: un `width` in `css/ris.css` e un
`grid-template-rows` — quest'ultimo è la tecnica `0fr → 1fr` documentata per gli accordion, quindi
intenzionale. `motion-lab.html` ne ha una (`padding`). È un risultato onesto: il budget 80/140/200ms
è implementato davvero. Rende più stridente il fatto che l'unica violazione seria — `transition-all`
su `margin-left` — stia nel template da $69 anziché nel codice gratuito. Il lab però resta un banco
di prova per addetti ai lavori: nessuna CTA, nessun `og:image`, nessuna `meta description`. Dimostra
una competenza che non converte.

### Quello che non funziona
**Non esiste un funnel.** Il badge "Live Showcase" del README porta a `index.html`, che è uno stub di
meta-refresh a 0 secondi verso `docs/index.html`. Nessuna landing page, nessun hero, nessuna sezione
prezzi, nessun bottone d'acquisto sopra la piega. In tre pagine di specimen c'è **un solo** link
Lemon Squeezy, sepolto in `docs/index.html`. Il compratore atterra dritto in una pagina di 1057 righe
che è un catalogo di componenti — utile a chi ha già comprato, inutile a chi deve decidere.

**Il prodotto venduto non è mostrabile.** Non esiste demo live del Forensic Dashboard: il SKU da $69
si può solo immaginare da un PNG che ritrae un'altra pagina. Per un template applicativo, la demo
navigabile *è* la pagina di vendita — Tailwind Plus e Aceternity vendono così, e il pricing doc li
cita come benchmark senza replicarne il meccanismo.

**Zero metadati social.** Nessun `og:image`, `og:title`, `twitter:card` o `meta description` in
`index.html`, `docs/index.html`, `docs/mobile.html`. I canali dove si distribuisce un kit cyberpunk
sono X, Reddit e HN, e ogni link condiviso appare come un rettangolo vuoto. Esiste già un
`hero-banner.png` da 1920px pronto a servire da `og:image` e non è collegato a nulla.

**L'hero banner ha problemi di composizione.** Metà sinistra corretta; metà destra sovraccarica: il
raggio del radar attraversa l'etichetta "TGT-ALPHA // ACQ" e sconfina nel pannello, il riquadro
"NEURAL BANDWIDTH" si sovrappone al cerchio tratteggiato senza intenzione leggibile, il toggle
"ARMED [ON]" fluttua senza ancoraggio, e la fascia centrale resta vuota. La riga
`SHA-256: 0x889F...771B [VALIDATED]` è un hash inventato in un banner che pubblicizza "zero fake
hashes". Sotto, il footer promette "WCAG 2.2 AA / **AAA CERTIFIED**": "certified" da nessuno.

**Il copy è troppo denso e troppo assertivo.** Il README apre attaccando i concorrenti («Most
cyberpunk UI libraries fall apart in production») prima di aver mostrato qualcosa, poi accumula
cinque badge, una tabella di metriche, una tabella feature, una tabella prezzi e un elenco di
componenti — senza mai dire, in una frase, *per chi* è. Non c'è un caso d'uso, un cliente, una
testimonianza, un "built with". Il claim più forte del prodotto («i token reggono AA, ecco i
numeri») non compare da nessuna parte, mentre compaiono claim non verificabili e in tre casi
falsificati dal repo stesso. `AUDIT.md` e `docs/COMMERCIAL_PRICING.md` alla root completano
l'impressione: si sta guardando un cantiere, non uno scaffale.

---

## 3. Le cinque modifiche a più alto impatto di conversione

**1. Separare fisicamente Core e Pro, o rinunciare a vendere.** Spostare `templates/`, `figma/` e i
componenti Pro in un repository privato; lasciare nel repo pubblico MIT solo `css/`, `tokens/`,
`icons/`, `js/` e i primitivi base, con un `LICENSE` che ne delimiti esplicitamente lo scope. Finché
`LICENSE` MIT copre l'intero albero, ogni tier è già gratuito e ogni altra modifica è irrilevante.
Contestualmente: rimuovere `AUDIT.md` e `docs/COMMERCIAL_PRICING.md` dal repo pubblico, e ripulire
Delamain / Kiroshi / Street Cred / Netrunner / "Cyberpunk 2077 palette" da CSS, docs, preview e
CHANGELOG. Questi sono i tre stop di procurement; nessuno di essi è opzionale.

**2. Costruire una landing page che venda, e una demo live del dashboard.** Sostituire lo stub di
meta-refresh in `index.html` con una vera pagina: hero, tre screenshot *attuali*, tabella dei tier
con CTA Lemon Squeezy ripetuta, FAQ su licenza e refund. Deployare
`templates/forensic-dashboard` come demo navigabile — è l'unico asset che dimostra il valore del SKU
più caro e oggi nessuno può vederlo. Aggiungere `og:image` (`hero-banner.png` è già pronto),
`og:title`, `twitter:card` e `meta description` su tutte le pagine. Costo: basso. È il collo di
bottiglia dell'intero funnel.

**3. Rigenerare gli asset di marketing dopo aver corretto i grafici.** Prima capire perché in
`assets/mobile-preview.png` la linea si interrompe dopo due segmenti e il bar chart disegna una
barra su sette — è un bug reale nel motore, non un artefatto di cattura. Poi rifare tutti e tre i
PNG in inglese, sulla v2.8.0, a piena pagina, e far sì che `dashboard-preview.png` mostri davvero il
Forensic Dashboard. Nessuno compra un motore di grafici da uno screenshot in cui il grafico non si
disegna.

**4. Rendere onesto e installabile ciò che si vende.** Il tier Figma: o si spedisce un vero `.fig`
pubblicato come team library, o si riscrive ogni claim (`.fig`, "150+ components", "60+ variants")
in "plugin generatore" e si adegua il prezzo — e comunque `createComponent` + `combineAsVariants`
vanno portati a coprire i componenti reali, perché un frame non è vendibile come componente. Il tier
Next.js: rimuovere `"private": true`, sostituire i `file:../../` con versioni npm pubblicate,
spedire `react/dist` (o uno script di build alla root), aggiungere `public/favicon.ico`. Poi una CI
minima che, da clone pulito, faccia `npm ci && npm run build` su template, react e tailwind: oggi
non esiste alcuna prova che il prodotto si costruisca.

**5. Chiudere le contraddizioni interne che una code review di 20 minuti trova comunque.**
Aggiungere `"use client"` ai sei componenti stateful in `react/src/` e includere il CSS in `files` +
`exports`. Sostituire i quattro id derivati dalla label con `useId()` in `Input`/`Textarea`/`Select`/
`Checkbox`. Correggere l'ARIA dei grafici (`role="slider"` con `aria-valuemin/max/now/text`, oppure
`role="img"` con `aria-label` descrittivo, non `role="region"` + `aria-valuenow`). Rimuovere
`Math.random()` + `SIMULATED_FEED` da `EventLogStream.tsx` e l'hash `0x9F4C-AA28` da `page.tsx:71`,
oppure cancellare il claim "Strict Real Data". Passare da `transition-all` su `margin-left` a un
`transform: translateX()` nel template, oppure ritirare il badge "Zero Reflow". E generare i sei
file di token da `tokens/ris.tokens.json` con Style Dictionary invece di mantenerli a mano: è
l'unica modifica che rende RIS un design *system* invece di sei copie che divergeranno.

**Pubblicare i numeri di contrasto già calcolabili.** Fuori classifica ma quasi gratis: il badge AA è
sostanzialmente vero e nessuno lo sa. Una tabella di rapporti nel README, generata in CI, converte
più di qualunque badge shields.io — e `getContrastRatio()` in `figma/code.js` è già scritto.

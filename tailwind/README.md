# @relic-ui/tailwind

> Dedicated Tailwind CSS plugin and preset for the **Relic Interface System (RIS v2)**.

Bring the tactile, hard-edged forensic instrument UI into any modern web project using pure Tailwind CSS utility classes.

---

## Features

- **Geometric Chamfers**: 45° polygon cuts (`.chamfer-sm`, `.chamfer-md`, `.chamfer-lg`) and RIS signature diagonal notches (`.chamfer-notch`).
- **Tactical Textures**: 32px precision grid (`.hud-grid`) and subtle CRT scanlines overlay (`.scanlines`).
- **Forensic Instrument Colors**: Full mapping of `var(--ris-*)` tokens (`bg`, `void`, `surface-1`..`surface-4`, `line`, `accent`, `yellow`, `cyan`, `red`, `green`, `violet`, etc.).
- **Instrument Typography**:
  - `font-sans`: Archivo
  - `font-mono`: JetBrains Mono
  - `font-display`: Chakra Petch
- **Mechanical Motion**: Tactile micro-feedback transition durations (`dur-instant: 80ms`, `dur-fast: 140ms`, `dur-base: 200ms`, `dur-enter: 240ms`) and high-deceleration curves (`ease-snap`, `ease-out`).
- **Tactical Glows**: Opt-in status and live state cues (`.glow-accent`, `.glow-red`, `.glow-cyan`).

---

## Installation

```bash
npm install @relic-ui/tailwind
# or
pnpm add @relic-ui/tailwind
# or
yarn add @relic-ui/tailwind
```

### Font Loading

Include the RIS typography stack in your HTML `<head>` or main CSS:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700&family=Chakra+Petch:wght@500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">
```

---

## Configuration

### Option A: Using the Preset (Recommended)

In your `tailwind.config.js`:

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [
    require('@relic-ui/tailwind/preset')
  ],
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx,vue,svelte}',
  ],
  theme: {
    extend: {
      // Your project customizations here
    },
  },
};
```

### Option B: Using as a Plugin

If you prefer to configure your own theme and only import RIS utilities and theme extensions:

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  plugins: [
    require('@relic-ui/tailwind')
  ],
};
```

### Option C: Tailwind CSS v4

In Tailwind CSS v4, add the plugin directly to your main CSS stylesheet:

```css
@import "tailwindcss";
@plugin "@relic-ui/tailwind";
```

---

## Design System Tokens & Theme Reference

### 1. Colors

All colors are mapped to their underlying CSS custom properties (`var(--ris-*)`), adapting automatically when switching themes (`data-theme="dark|light"`) or brands (`data-brand="relic|biohub|omnikon|neutral"`):

| Tailwind Color | CSS Variable | Description |
| :--- | :--- | :--- |
| `bg` | `var(--ris-bg)` | App background (#0a0c0e in dark) |
| `void` | `var(--ris-void)` | Deepest backdrop (#060708 in dark) |
| `surface-1` / `surface` | `var(--ris-surface-1)` | Base panel surface |
| `surface-2` | `var(--ris-surface-2)` | Raised card / row hover surface |
| `surface-3` | `var(--ris-surface-3)` | Elevated modal / active row surface |
| `surface-4` | `var(--ris-surface-4)` | Flyout / popover surface |
| `line` | `var(--ris-line)` | Default 1px tactical border |
| `line-strong` | `var(--ris-line-strong)` | Emphasized structural border |
| `line-faint` | `var(--ris-line-faint)` | Grid line / subtle divider |
| `fg1` / `fg` | `var(--ris-fg1)` | Primary legible text |
| `fg2` | `var(--ris-fg2)` | Secondary label text |
| `fg3` | `var(--ris-fg3)` | Metadata / AA-compliant caption |
| `fg4` | `var(--ris-fg4)` | Disabled / hard metadata floor |
| `fg-invert` | `var(--ris-fg-invert)` | Inverted text on solid fills |
| `on-accent` | `var(--ris-on-accent)` | High-contrast text on accent fills |
| `accent` | `var(--ris-accent)` | Primary brand accent (contextual) |
| `accent-2` | `var(--ris-accent-2)` | Secondary cross-reference accent |
| `yellow` | `var(--ris-yellow)` | Amber-sodium forensic accent |
| `cyan` | `var(--ris-cyan)` | Steel-ice telemetry accent |
| `red` | `var(--ris-red)` | Critical alert / telemetry red |
| `green` | `var(--ris-green)` | Verification / telemetry green |
| `violet` | `var(--ris-violet)` | Inference / telemetry violet |
| `magenta` | `var(--ris-magenta)` | Runtime orchid |
| `orange` | `var(--ris-orange)` | Correction amber |

> [!TIP]
> Use standard Tailwind color prefixes: `bg-surface-1`, `border-line-strong`, `text-accent`, `hover:border-cyan`.

### 2. Typography

| Tailwind Class | Font Family | Default Weight / Use Case |
| :--- | :--- | :--- |
| `font-sans` | `Archivo` | UI body copy, field labels, general text |
| `font-mono` | `JetBrains Mono` | Telemetry readouts, metadata, logs, timestamps |
| `font-display` | `Chakra Petch` | HUD headlines, telemetry callouts, section banners |

### 3. Transition Timing & Curves

Mechanical snap and micro-feedback curves:

```html
<!-- Instant press feedback (80ms snap) -->
<button class="transition-all duration-instant ease-snap active:scale-95 ...">

<!-- Smooth panel entrance (200ms high-deceleration) -->
<div class="transition-opacity duration-base ease-out ...">
```

- **Durations**:
  - `duration-instant` / `dur-instant`: `80ms` (tactile press, active state)
  - `duration-fast` / `dur-fast`: `140ms` (hover, toggle, selection)
  - `duration-base` / `dur-base`: `200ms` (tab switch, drawer expansion)
  - `duration-enter` / `dur-enter`: `240ms` (dialog entrance, toast)
- **Curves**:
  - `ease-snap`: `cubic-bezier(0.16, 1, 0.3, 1)` (mechanical tactical snap)
  - `ease-out`: `cubic-bezier(0.22, 1, 0.36, 1)` (smooth high-deceleration)

### 4. Custom Utilities Reference

| Utility | Description |
| :--- | :--- |
| `.chamfer-sm` | 6px 45° polygon clip-path (all 4 corners cut) |
| `.chamfer-md` | 10px 45° polygon clip-path (all 4 corners cut) |
| `.chamfer-lg` | 16px 45° polygon clip-path (all 4 corners cut) |
| `.chamfer-notch` | RIS signature diagonal notch (top-right & bottom-left cut) |
| `.chamfer-notch-sm` | 6px diagonal notch cut |
| `.chamfer-notch-md` | 10px diagonal notch cut |
| `.chamfer-notch-lg` | 16px diagonal notch cut |
| `.chamfer-none` | Disables clip-path (`clip-path: none`) |
| `.hud-grid` | 32px technical backdrop grid |
| `.hud-grid-16` | 16px technical backdrop grid |
| `.scanlines` | Subtle CRT horizontal scanline overlay pseudo-element |
| `.glow-accent` | 1px accent border + 18px soft accent glow |
| `.glow-red` | 1px red border + 18px soft red glow |
| `.glow-cyan` | 1px cyan border + 18px soft cyan glow |
| `.ris-bracket` | Tactical HUD corner brackets (top-left & bottom-right L marks) |

---

## Component Examples

### 1. Tactile RIS Buttons

Replicating `.ris-btn`, `.ris-btn--primary`, and `.ris-btn--ghost`:

```html
<!-- Primary Accent Button -->
<button class="chamfer-notch-sm inline-flex items-center justify-center gap-2 px-4 py-2 min-h-[36px] bg-accent font-sans text-xs font-semibold tracking-wider text-fg-invert uppercase border border-accent duration-instant ease-snap transition-all hover:bg-yellow-fill hover:shadow-glow-accent active:scale-[0.98]">
  <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 16 16">
    <path d="M2 3h12v2H2zm0 4h12v2H2zm0 4h8v2H2z" />
  </svg>
  <span>Execute Stream</span>
</button>

<!-- Secondary Tactical Button -->
<button class="chamfer-notch-sm inline-flex items-center justify-center gap-2 px-4 py-2 min-h-[36px] bg-surface-2 font-sans text-xs font-semibold tracking-wider text-fg1 uppercase border border-line-strong duration-instant ease-snap transition-all hover:bg-surface-3 hover:border-accent hover:text-white active:scale-[0.98]">
  <span>Calibrate Sensor</span>
</button>

<!-- Ghost / Icon Action Button -->
<button class="chamfer-sm inline-flex items-center justify-center w-9 h-9 bg-transparent text-fg3 border border-line duration-fast ease-snap transition-colors hover:text-cyan hover:border-cyan hover:bg-surface-2">
  <span class="font-mono text-xs font-bold">SYS</span>
</button>
```

---

### 2. Chamfered Telemetry Panel / Card

Replicating `.ris-panel` with header, metadata body, and status footer:

```html
<div class="chamfer-notch relative bg-surface-1 border border-line p-0 overflow-hidden">
  <!-- Panel Header -->
  <div class="flex items-center justify-between px-4 py-3 border-b border-line bg-gradient-to-b from-surface-2 to-surface-1">
    <div class="flex items-center gap-2">
      <span class="w-2 h-2 bg-accent inline-block"></span>
      <h3 class="font-display text-sm font-semibold tracking-wide text-fg1 uppercase">
        Telemetry Node 04
      </h3>
    </div>
    <span class="chamfer-sm px-2 py-0.5 font-mono text-[11px] font-semibold tracking-wider text-cyan border border-cyan/30 bg-cyan/10">
      ACTIVE // 0x7F
    </span>
  </div>

  <!-- Panel Body -->
  <div class="p-4 space-y-4">
    <p class="font-sans text-sm text-fg2 leading-relaxed">
      Continuous biometric and telemetry acquisition stream. Buffer integrity at nominal frequency with zero frame drops.
    </p>

    <!-- Telemetry readout grid -->
    <div class="grid grid-cols-2 gap-3 pt-2">
      <div class="bg-surface-2 border border-line-faint p-3">
        <div class="font-mono text-[11px] text-fg3 uppercase tracking-wider">Stride Latency</div>
        <div class="font-display text-xl font-bold text-fg1 mt-1">4.12 <span class="text-xs font-mono font-normal text-fg3">ms</span></div>
      </div>
      <div class="bg-surface-2 border border-line-faint p-3">
        <div class="font-mono text-[11px] text-fg3 uppercase tracking-wider">Sync Ratio</div>
        <div class="font-display text-xl font-bold text-green mt-1">99.8 <span class="text-xs font-mono font-normal text-fg3">%</span></div>
      </div>
    </div>
  </div>

  <!-- Panel Footer -->
  <div class="flex items-center justify-between px-4 py-2.5 border-t border-line bg-surface-1/50 font-mono text-xs text-fg3">
    <span>CHANNEL: CH-ALPHA</span>
    <span class="text-accent">SYNCHRONIZED</span>
  </div>
</div>
```

---

### 3. Full HUD Screen with Grid and Scanlines

Replicating a complete military/forensic tactical workstation:

```html
<div class="min-h-screen bg-bg text-fg1 hud-grid scanlines font-sans antialiased selection:bg-accent selection:text-fg-invert">
  
  <!-- Top Navigation Bar -->
  <header class="h-[52px] bg-surface-1/95 border-b border-line backdrop-blur-md px-6 flex items-center justify-between">
    <div class="flex items-center gap-4">
      <div class="font-display text-lg font-bold tracking-widest text-accent uppercase flex items-center gap-2">
        <span class="inline-block w-2.5 h-2.5 bg-yellow-fill"></span>
        RELIC // OS
      </div>
      <span class="hidden md:inline font-mono text-xs text-fg3 border-l border-line pl-4">
        v2.8.0-RELEASE
      </span>
    </div>

    <!-- Live Acquisition Status -->
    <div class="flex items-center gap-3">
      <div class="flex items-center gap-2 font-mono text-[11px] font-semibold text-red uppercase tracking-wider">
        <span class="w-2 h-2 bg-red-fill animate-pulse"></span>
        LIVE REC
      </div>
      <div class="h-4 w-[1px] bg-line"></div>
      <span class="font-mono text-xs text-fg2">17:47:15 UTC</span>
    </div>
  </header>

  <!-- Main Workspace Layout -->
  <main class="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
    
    <!-- Left Column: Primary Chamfered Radar Widget -->
    <div class="lg:col-span-2 space-y-6">
      <section class="chamfer-notch bg-surface-1 border border-line-strong p-6 relative">
        <div class="flex items-center justify-between mb-4">
          <div class="space-y-0.5">
            <div class="font-mono text-[11px] text-accent tracking-widest uppercase">Telemetry Matrix</div>
            <h2 class="font-display text-2xl font-bold text-fg1 tracking-tight uppercase">Sensor Acquisition</h2>
          </div>
          <span class="chamfer-sm px-3 py-1 font-mono text-xs border border-green/40 text-green bg-green/10">
            NOMINAL
          </span>
        </div>

        <!-- Metric Display Screen -->
        <div class="bg-void border border-line p-6 relative overflow-hidden">
          <div class="flex flex-wrap items-baseline gap-4">
            <span class="font-display text-5xl font-bold text-fg1 tracking-tight">14,280</span>
            <span class="font-mono text-sm text-cyan uppercase tracking-widest">SAMPLES / SEC</span>
          </div>
          <p class="font-mono text-xs text-fg3 mt-2">
            STATION ID: VIVO-FORENSIC-882 // INFERENCE CONFIDENCE: 98.4%
          </p>
        </div>
      </section>
    </div>

    <!-- Right Column: Control & Stream Feed -->
    <div class="space-y-6">
      <section class="chamfer-md bg-surface-2 border border-line p-5">
        <h3 class="font-display text-sm font-bold text-fg1 uppercase tracking-wider mb-3">
          Governance Stream
        </h3>
        <ul class="space-y-2 font-mono text-xs">
          <li class="p-2 bg-surface-1 border-l-2 border-cyan flex justify-between">
            <span class="text-fg2">Evidence #904</span>
            <span class="text-cyan">VERIFIED</span>
          </li>
          <li class="p-2 bg-surface-1 border-l-2 border-violet flex justify-between">
            <span class="text-fg2">Inference Engine</span>
            <span class="text-violet">COMPUTING</span>
          </li>
          <li class="p-2 bg-surface-1 border-l-2 border-yellow flex justify-between">
            <span class="text-fg2">Signature Gate</span>
            <span class="text-yellow">PENDING</span>
          </li>
        </ul>
      </section>
    </div>

  </main>
</div>
```

---

## Theming & Skins

RIS supports theme switching via HTML data attributes. All Tailwind utilities provided by `@relic-ui/tailwind` seamlessly respond to these attributes:

```html
<!-- Dark mode with Relic Brand (Default) -->
<html data-theme="dark" data-brand="relic">

<!-- Light cold-paper drafting mode -->
<html data-theme="light" data-brand="relic">

<!-- Biohub Cyber theme -->
<html data-theme="dark" data-brand="biohub" data-skin="cyber">
```

### Brand Palettes:
- `relic` (default): Amber-sodium (`yellow`) primary, cold steel-ice (`cyan`) secondary.
- `biohub`: Ice cyan (`cyan`) primary, emerald bio (`green`) secondary.
- `omnikon`: Evidentiary crimson (`red`) primary, amber (`yellow`) secondary.
- `neutral`: High-contrast violet (`violet`) primary, steel-ice (`cyan`) secondary.

---

## License

MIT © Relic Interface System Team.

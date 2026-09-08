# @relic-ui/react (v2.8.0)

> **Tactical Cyber React + TypeScript UI Kit for Relic Interface System (RIS v2)**.
> Built for high-density forensic instruments, biometric telemetry, and cyberpunk operational HUDs.

[![Version](https://img.shields.io/badge/version-2.8.0-e6a23c.svg)](package.json)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-6fb3c9.svg)](tsconfig.json)
[![WCAG](https://img.shields.io/badge/WCAG-2.2_AA-5fae84.svg)](GUIDELINES.md)
[![Motion](https://img.shields.io/badge/Motion-Emil_Kowalski-d45565.svg)](https://animations.dev)

---

## ⚡ Highlights

- **Zero Unnecessary Bloat**: Components consume RIS tokens (`var(--ris-*)`) and classes (`.ris-*`) directly without CSS-in-JS runtimes or duplicate styling overhead.
- **Emil Kowalski Motion Principles**:
  - **80ms Active Snap**: `:active { transform: scale(0.97); }` with `--ris-ease-snap` for instantaneous tactile feedback.
  - **Zero Layout Reflow**: Smooth accordion expand/collapse driven by CSS Grid (`grid-template-rows: 0fr → 1fr`) at 60fps without JavaScript height queries.
  - **No Ease-In on Enter**: Strictly uses `--ris-ease-out` / `--ris-ease-snap`; entering overlays scale from `0.96`, never from `0`.
- **WCAG 2.2 AA Certified**: Rigorous contrast ratios (≥4.5:1), keyboard focus navigation, full ARIA roles, and dual-channel status indicators (dot/shape + copy).
- **Tactical Telemetry Charts**: Built-in SVG data visualizers (`LineChart`, `BarChart`, `GaugeChart`, `Sparkline`, `EegWaveform`) with `ResizeObserver` responsiveness, pointer scrubbing callbacks, and leak-free auto-cleanup.

---

## 📦 Installation

```bash
npm install @relic-ui/react
# or
pnpm add @relic-ui/react
# or
yarn add @relic-ui/react
```

### Peer Dependencies
- `react`: `>=18.0.0`
- `react-dom`: `>=18.0.0`

---

## 🚀 Quickstart: Next.js (App Router)

### 1. Import RIS CSS in Root Layout

Import the RIS stylesheets into your root `app/layout.tsx`. RIS stylesheets should be imported in this exact cascading order:
1. `ris-tokens.css` (token definitions and themes)
2. `ris.css` (base structural components)
3. `ris-fx.css` *(optional)* (CRT scanlines, glitches, glows)
4. `ris-skin-cyber.css` *(optional)* (tactical cybernetic skin)

```tsx
// app/layout.tsx
import type { Metadata } from 'next';
import { ToastProvider } from '@relic-ui/react';

// Import RIS CSS stylesheets
import 'relic-interface-system/css/ris-tokens.css';
import 'relic-interface-system/css/ris.css';
import 'relic-interface-system/css/ris-fx.css';
import 'relic-interface-system/css/ris-skin-cyber.css';

export const metadata: Metadata = {
  title: 'Tactical Cyber HUD',
  description: 'Relic Interface System operational console',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark" data-brand="vivokey" data-skin="cyber">
      <body className="ris ris-grid-bg">
        <ToastProvider maxToasts={5} defaultDuration={4000}>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
```

### 2. Build Your First View

All interactive components include client state and gesture handlers, so add `'use client';` at the top of client pages or component files:

```tsx
// app/page.tsx
'use client';

import { useState } from 'react';
import {
  Button,
  Panel,
  Switch,
  Accordion,
  Modal,
  Sheet,
  Tabs,
  Chip,
  Badge,
  TelemetryPill,
  LineChart,
  useToast,
} from '@relic-ui/react';

export default function Dashboard() {
  const [modalOpen, setModalOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [telemetrySync, setTelemetrySync] = useState(true);
  const toast = useToast();

  return (
    <main style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Telemetry Status Bar */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <TelemetryPill label="CORE_0" value="48.2" unit="°C" delta={{ value: "+1.4%", direction: "up" }} variant="accent" />
        <TelemetryPill label="HRV" value="74" unit="bpm" delta={{ value: "-2", direction: "down" }} variant="cyan" />
        <Chip variant="green">SYSTEM NOMINAL</Chip>
        <Badge count={3} variant="danger" />
      </div>

      {/* Main Tactical Panel */}
      <Panel
        title="NEURAL LINK TELEMETRY"
        variant="strong"
        chamfer="md"
        scanlines
        bracket
        actions={
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              toast.hud('LINK CALIBRATED', { description: 'Sub-system neural bus locked at 120Hz.' });
              setModalOpen(true);
            }}
          >
            CALIBRATE
          </Button>
        }
      >
        <LineChart
          points={[42, 49, 45, 58, 64, 61, 72, 79, 74, 88]}
          categories={['00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00']}
          unit=" µV"
          height={160}
          onScrub={(p) => p && console.log('Scrubbed point:', p)}
        />
      </Panel>

      {/* Control Switch */}
      <div style={{ marginTop: '20px' }}>
        <Switch
          checked={telemetrySync}
          onChange={(checked) => setTelemetrySync(checked)}
          label="REAL-TIME TELEMETRY FEED"
          description="Transmits 1:1 sensor matrices across the encrypted optical bridge."
        />
      </div>

      {/* Tactical Dialog */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="TACTICAL CALIBRATION">
        <p style={{ color: 'var(--ris-fg2)', lineHeight: 1.6 }}>
          Confirm hardware handshake sequence across optical channel 04.
        </p>
      </Modal>

      {/* Mobile Tactical Bottom Sheet */}
      <Sheet open={sheetOpen} onClose={() => setSheetOpen(false)} title="DIAGNOSTICS SHEET">
        <p>Telemetry trace recorded.</p>
      </Sheet>
    </main>
  );
}
```

---

## 🧩 Component Catalog & API Reference

### 1. `Button`
Tactical Cyber button with 80ms active scale snap (`scale(0.97)`), zero layout reflow, and accessible busy spinner.

```tsx
import { Button } from '@relic-ui/react';

// Variants
<Button variant="primary">PRIMARY ACTION</Button>
<Button variant="default">DEFAULT GRAPHITE</Button>
<Button variant="secondary">SECONDARY OUTLINE</Button>
<Button variant="danger">ABORT SEQUENCE</Button>
<Button variant="outline">GHOST OUTLINE</Button>
<Button variant="invert">INVERT HIGH-LUM</Button>

// Sizes
<Button size="sm">28PX MINI</Button>
<Button size="md">36PX DEFAULT</Button>
<Button size="lg">46PX TACTICAL</Button>

// States & Icons
<Button loading loadingText="SYNCHRONIZING...">SUBMIT</Button>
<Button leftIcon={<span>⚡</span>} rightIcon={<span>→</span>}>INITIATE</Button>
<Button block>FULL WIDTH STRETCH</Button>
```

#### Props
| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | `'primary' \| 'default' \| 'secondary' \| 'danger' \| 'outline' \| 'invert'` | `'default'` | Visual accent hierarchy |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Height tier (28px / 36px / 46px) |
| `loading` | `boolean` | `false` | Replaces/augments content with `.ris-spinner` (`aria-busy`) |
| `loadingText` | `ReactNode` | `undefined` | Label to display during loading |
| `leftIcon` | `ReactNode` | `undefined` | Leading icon |
| `rightIcon` | `ReactNode` | `undefined` | Trailing icon |
| `block` | `boolean` | `false` | Expands button to 100% container width |
| `iconOnly` | `boolean` | `false` | Square geometry for single-icon buttons |

---

### 2. `Panel`
Angular chamfered container that forms the signature Relic Interface System visual architecture.

```tsx
import { Panel, Button } from '@relic-ui/react';

<Panel
  title="SYSTEM OVERVIEW"
  variant="strong"
  chamfer="md"
  scanlines={true}
  bracket={true}
  actions={<Button size="sm">EXPORT</Button>}
  footer={<span>STATUS: ARMED</span>}
>
  <p>Panel body content with 16px internal padding.</p>
</Panel>
```

#### Props
| Prop | Type | Default | Description |
|---|---|---|---|
| `title` | `ReactNode` | `undefined` | Header title string or element |
| `header` | `ReactNode` | `undefined` | Full custom header replacement |
| `actions` | `ReactNode` | `undefined` | Action controls rendered on right side of head |
| `variant` | `'default' \| 'strong'` | `'default'` | Surface tier (`surface-1` or `surface-2`) |
| `chamfer` | `'none' \| 'sm' \| 'md' \| 'lg'` | `'md'` | Corner cut size (flat / 6px / 10px / 16px) |
| `scanlines` | `boolean` | `false` | Renders CRT scanline overlay texture |
| `bracket` | `boolean` | `false` | Renders accent corner L-brackets (`.ris-bracket`) |
| `footer` | `ReactNode` | `undefined` | Footer container content (`.ris-panel-foot`) |
| `bodyClassName` | `string` | `''` | Extra class for the `.ris-panel-body` container |

---

### 3. `Switch`
Mechanical slide toggle with chamfered thumb, glowing activation track, and WCAG AA hit target.

```tsx
import { Switch } from '@relic-ui/react';

<Switch
  checked={enabled}
  onChange={(checked) => setEnabled(checked)}
  label="QUANTUM ENCRYPTION"
  description="Routes communication matrices through the hardware HSM."
/>
```

#### Props
| Prop | Type | Default | Description |
|---|---|---|---|
| `checked` | `boolean` | `undefined` | Controlled state |
| `defaultChecked` | `boolean` | `undefined` | Uncontrolled default state |
| `label` | `ReactNode` | `undefined` | Primary label text |
| `description` | `ReactNode` | `undefined` | Supporting helper copy (`aria-describedby`) |
| `disabled` | `boolean` | `false` | Disables interaction (`opacity: 0.45`) |
| `onChange` | `(checked: boolean, e) => void` | `undefined` | Change event callback |

---

### 4. `Accordion`
Zero-reflow accordion utilizing modern CSS Grid (`grid-template-rows: 0fr → 1fr`). Expands and collapses at 60fps without JavaScript height measurements or layout thrashing.

```tsx
import { Accordion } from '@relic-ui/react';

<Accordion
  items={[
    {
      id: 'net-sec',
      title: 'NETWORK SECURITY PROTOCOL',
      subtitle: 'CH-01 • AES-GCM-256',
      content: <p>Full optical bus encryption initialized.</p>,
    },
    {
      id: 'biometric',
      title: 'BIOMETRIC SENSOR ARRAYS',
      subtitle: 'SUB-SYSTEM LOCKED',
      content: <p>EEG and pulse telemetry stream online.</p>,
    },
  ]}
  multiple={false}
  defaultValue="net-sec"
/>
```

#### Props
| Prop | Type | Default | Description |
|---|---|---|---|
| `items` | `AccordionItem[]` | required | Array of `{ id, title, content, subtitle?, badge?, disabled? }` |
| `value` | `string \| string[]` | `undefined` | Controlled open item ID(s) |
| `defaultValue` | `string \| string[]` | `undefined` | Uncontrolled initially open item ID(s) |
| `multiple` | `boolean` | `false` | Allows multiple sections to remain open simultaneously |
| `onChange` | `(val: string \| string[]) => void` | `undefined` | Open state change callback |

---

### 5. `Modal`
Desktop centered tactical modal dialog (`.ris-modal`) with 240ms enter transition, focus trap, ESC listener, and backdrop click dismissal.

```tsx
import { Modal, Button } from '@relic-ui/react';

<Modal
  open={isOpen}
  onClose={() => setIsOpen(false)}
  title="SYSTEM OVERRIDE"
  subtitle="AUTHORIZATION LEVEL 4 REQUIRED"
  size="md"
  footer={
    <>
      <Button variant="default" onClick={() => setIsOpen(false)}>CANCEL</Button>
      <Button variant="danger" onClick={handleOverride}>CONFIRM</Button>
    </>
  }
>
  <p>Executing an emergency purge will decouple peripheral optical buses.</p>
</Modal>
```

#### Props
| Prop | Type | Default | Description |
|---|---|---|---|
| `open` | `boolean` | required | Open/visible state |
| `onClose` | `() => void` | required | Close request callback |
| `title` | `ReactNode` | `undefined` | Header title |
| `subtitle` | `ReactNode` | `undefined` | Telemetry or sub-system ID |
| `size` | `'sm' \| 'md' \| 'lg' \| 'full'` | `'md'` | Max width tier (420px / 560px / 840px / 1180px) |
| `closeOnEsc` | `boolean` | `true` | Closes dialog when Escape key is pressed |
| `closeOnBackdrop` | `boolean` | `true` | Closes dialog when backdrop is clicked |
| `showCloseButton` | `boolean` | `true` | Displays tactical '✕' close button in head |
| `portalContainer` | `HTMLElement \| null` | `document.body` | Target DOM element for portal |

---

### 6. `Sheet`
Mobile tactical bottom sheet (`.ris-sheet`) featuring Emil Kowalski gesture physics:
- Drag handle with direct pointer capture
- Damped upward drag resistance (friction instead of hard stops)
- Velocity-based flick dismissal (`velocity > 0.11 px/ms`) or swipe distance threshold
- ESC listener, focus trap, and body scroll lock

```tsx
import { Sheet } from '@relic-ui/react';

<Sheet
  open={sheetOpen}
  onClose={() => setSheetOpen(false)}
  title="TELEMETRY DETAILS"
  subtitle="CHANNEL 02 • SCAN ACTIVE"
>
  <div>Mobile touch content with momentum drag-to-dismiss.</div>
</Sheet>
```

---

### 7. `Tabs`
Full WAI-ARIA tablist with automatic keyboard cycling (ArrowLeft, ArrowRight, Home, End) and zero reflow.

```tsx
import { Tabs } from '@relic-ui/react';

<Tabs
  variant="line" // or 'segmented' for boxed subtabs
  scrollable={true}
  items={[
    { id: 'telemetry', label: 'TELEMETRY', content: <div>Real-time feed</div> },
    { id: 'diagnostics', label: 'DIAGNOSTICS', content: <div>Log stream</div> },
    { id: 'config', label: 'CONFIG', content: <div>System parameters</div> },
  ]}
  defaultValue="telemetry"
/>
```

---

### 8. `ToastProvider` & `useToast()`
Cascading toast notifications anchored in the tactical HUD corner (`.ris-toast-stack`).
- Follows Sonner principles: auto-pauses on hover and tab visibility changes
- Smooth interruptible exit transitions
- Support for actions and timestamps

```tsx
import { useToast, toast } from '@relic-ui/react';

function ActionButton() {
  const toast = useToast();

  return (
    <button
      onClick={() => {
        // Tactical HUD variants
        toast.hud('NEURAL SYNC COMPLETE', { description: 'Bandwidth: 1.2 GB/s' });
        toast.success('FIRMWARE FLASHED', { description: 'Hash: 0x4f...8a' });
        toast.danger('OPTICAL LINK SEVERED', {
          description: 'Bus 03 failed parity check.',
          action: { label: 'RETRY', onClick: () => console.log('Retrying...') },
        });
        toast.warning('BATTERY SUB-SYSTEM LOW');
        toast.info('BUFFER PURGED');
      }}
    >
      Fire Telemetry Alert
    </button>
  );
}

// Can also be called imperatively anywhere without hooks:
toast.hud('GLOBAL SYSTEM BROADCAST');
```

---

### 9. `Chip`, `Badge`, `TelemetryPill`, `Kpi`

```tsx
import { Chip, Badge, TelemetryPill, Kpi } from '@relic-ui/react';

// Status Chips (WCAG AA non-color-only encoding)
<Chip variant="accent">OPERATIONAL</Chip>
<Chip variant="cyan" dot={true}>STANDBY</Chip>
<Chip variant="green">ONLINE</Chip>
<Chip variant="red" onRemove={() => {}}>DISMISSIBLE</Chip>

// RIS Stream Provenance & Risk Tags
<Chip stream="evidence">EVIDENCE DATA</Chip>
<Chip risk="high">CRITICAL RISK</Chip>

// Numeric Count Badge
<Badge count={7} variant="accent" />
<Badge count={104} max={99} variant="danger" />

// Compact Monospace Telemetry Pill
<TelemetryPill
  label="CORE_0"
  value="48.2"
  unit="°C"
  delta={{ value: "+1.4%", direction: "up" }}
  variant="accent"
/>

// Full KPI Block
<Kpi
  label="THROUGHPUT"
  value="1.84"
  unit="GB/s"
  delta={{ value: "+8.2%", direction: "up" }}
  accent="var(--ris-cyan)"
/>
```

---

### 10. `Charts` (`LineChart`, `BarChart`, `GaugeChart`, `Sparkline`, `EegWaveform`)
Native SVG visualizers adhering to RIS telemetry principles:
- **ResizeObserver**: Automatically adapts to container width dynamically.
- **Scrubbing Callbacks**: Real-time `onScrub({ index, value, category, x, y })` callbacks for cross-component HUD sync.
- **Zero Dependencies**: Self-contained SVG engine without external chart libraries.
- **Auto-Cleanup**: Disconnects observers, listeners, and cleans DOM nodes on unmount.

```tsx
import {
  LineChart,
  BarChart,
  GaugeChart,
  Sparkline,
  EegWaveform,
} from '@relic-ui/react';

// Line chart with area glow and tactical scrubber
<LineChart
  points={[12, 19, 15, 27, 32, 29, 44, 40, 52]}
  categories={['01', '02', '03', '04', '05', '06', '07', '08', '09']}
  unit=" ms"
  color="var(--ris-cyan)"
  height={140}
  onScrub={(pt) => console.log(pt ? `Point ${pt.index}: ${pt.value}` : 'Leave')}
/>

// Bar chart with column overdrive
<BarChart
  values={[42, 68, 55, 91, 74, 83]}
  categories={['SYS', 'NET', 'MEM', 'GPU', 'BUS', 'PWR']}
  color="var(--ris-accent)"
  height={120}
  highlight={3} // highlights peak column
/>

// Segmented HUD gauge
<GaugeChart
  value={0.78}
  caption="THROTTLE"
  unit="%"
  segments={16}
  color="var(--ris-accent)"
/>

// Compact 96x28 inline sparkline
<Sparkline points={[5, 8, 4, 9, 12, 11, 15]} color="var(--ris-green)" />

// Multi-channel biometric EEG waveform
<EegWaveform
  channels={[
    [10, 14, 18, 12, 8, 15, 22, 19, 11, 16],
    [5, 9, 7, 14, 18, 12, 6, 11, 14, 8],
    [2, 4, 8, 6, 3, 7, 9, 5, 2, 6],
  ]}
  colors={['var(--ris-cyan)', 'var(--ris-yellow)', 'var(--ris-violet)']}
  height={160}
/>
```

---

## 🎨 Token & Theme Integration

Relic Interface System components natively inherit variables set on `<html>`:

```html
<!-- High-Contrast Dark Mode (Default) -->
<html data-theme="dark" data-brand="vivokey" data-skin="cyber">

<!-- Technical Drafting Blueprint Light Mode (WCAG AA Compliant) -->
<html data-theme="light" data-brand="relic" data-skin="cyber">
```

### Supported Brands
- `vivokey`: Red primary + amber/yellow secondary
- `relic`: Amber-sodium primary + cold cyan secondary
- `biohub`: Cyan primary + emerald green secondary
- `neutral`: Steel slate monochrome + high-contrast white

---

## 📐 Motion Principles Reference

| Interaction | Duration | Timing Function | Purpose |
|---|---|---|---|
| **Button press** | `80ms` | `--ris-ease-snap` | Immediate tactile confirmation (`scale(0.97)`) |
| **Hover / Focus** | `140ms` | `--ris-ease-snap` | Snappy state transition |
| **Accordion / Tabs** | `200ms` | `--ris-ease-out` | Smooth zero-reflow layout movement |
| **Modal / Sheet enter** | `240ms` | `--ris-ease-out` | Fluid entrance (`scale(0.96) → 1`), no ease-in |
| **Phosphor ambient sweep**| `4.5s` | `linear` | Continuous HUD telemetry micro-pulse |

---

## 📄 License

MIT © Relic Interface System

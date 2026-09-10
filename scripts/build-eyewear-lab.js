#!/usr/bin/env node

/**
 * RELIC INTERFACE SYSTEM (RIS v2.9.0)
 * Generator for docs/eyewear.html — Interactive Smart Glasses HUD Simulator & Laboratory
 */

const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');

const rootDir = path.resolve(__dirname, '..');
const reactPath = path.join(rootDir, 'react', 'node_modules', 'react', 'index.js');
const reactDomPath = path.join(rootDir, 'react', 'node_modules', 'react-dom', 'server.node.js');
const distPath = path.join(rootDir, 'react', 'dist', 'index.js');
const eyewearSvgDir = path.join(rootDir, 'svg', 'eyewear');

async function main() {
  const React = await import(pathToFileURL(reactPath).href);
  const ReactDOMServer = await import(pathToFileURL(reactDomPath).href);
  const Micro = await import(pathToFileURL(distPath).href);
  const render = (ReactDOMServer.default || ReactDOMServer).renderToStaticMarkup;

  const OPTICAL_COLORS = {
    'phosphor-green': '#2fe48a',
    'tactical-amber': '#e6a23c',
    'cyber-cyan': '#6fb3c9',
    'alert-red': '#ff2d3c',
  };

  const BRAND_COLORS = {
    relic: '#e6a23c',
    biohub: '#6fb3c9',
    omnikon: '#ff2d3c',
    neutral: '#9d7cd8',
  };

  // Helper to read pre-exported standalone SVGs
  function getStandaloneSvg(filename) {
    const p = path.join(eyewearSvgDir, filename);
    if (fs.existsSync(p)) {
      return fs.readFileSync(p, 'utf8');
    }
    return '';
  }

  // 1. Render all 4 mode viewports for the interactive simulator
  const ambientSvgRaw = render(React.createElement(Micro.SmartGlassesHUD, {
    mode: 'ambient',
    opticalProfile: 'cyber-cyan',
    brand: 'biohub',
    animated: true,
  }));

  const commuteSvgRaw = render(React.createElement(Micro.SmartGlassesHUD, {
    mode: 'commute',
    opticalProfile: 'cyber-cyan',
    brand: 'biohub',
    animated: true,
    navData: {
      distanceMeters: 85,
    },
  }));

  const meetingSvgRaw = render(React.createElement(Micro.SmartGlassesHUD, {
    mode: 'meeting',
    opticalProfile: 'cyber-cyan',
    brand: 'biohub',
    animated: true,
  }));

  const fieldOpsSvgRaw = render(React.createElement(Micro.SmartGlassesHUD, {
    mode: 'field-ops',
    opticalProfile: 'cyber-cyan',
    brand: 'biohub',
    animated: true,
    inspectionData: {
      distanceMeters: 1.4,
    },
  }));

  // 2. Metadata for 5 Atomic Eyewear Cards
  const ATOMIC_CARDS = [
    {
      id: 'nav-guidance',
      name: 'MicroNavGuidance',
      title: 'Navigation & Wayfinding Maneuvers',
      desc: 'Optical turn-by-turn guidance with dynamic distance countdown, street name, and ETA chip. Displays 8 tactical 45° chamfered maneuver arrows with zero central vision occlusion.',
      dimensions: '160×48',
      svgFile: 'nav-guidance.svg',
      jsxSnippet: `<MicroNavGuidance
  maneuver="slight-right"
  distanceMeters={85}
  streetName="VIA DEL CORSO"
  eta="12 MIN"
  opticalProfile="cyber-cyan"
/>`,
      renderLive: () => render(React.createElement(Micro.MicroNavGuidance, {
        maneuver: 'slight-right',
        distanceMeters: 85,
        streetName: 'VIA DEL CORSO',
        eta: '12 MIN',
        opticalProfile: 'cyber-cyan',
        animated: true,
      })),
    },
    {
      id: 'live-captions',
      name: 'MicroLiveCaptions',
      title: 'Real-Time Speech Transcription & Teleprompter',
      desc: 'Live speech-to-text subtitles and teleprompter constrained within a 38-character foveal comfort boundary to prevent eye strain. Features pulsating listening pip and speaker tag.',
      dimensions: '240×52',
      svgFile: 'live-captions.svg',
      jsxSnippet: `<MicroLiveCaptions
  speaker="SYS // AUDIO-01"
  line1="SYSTEM INITIALIZED. LINK NOMINAL"
  line2="AUDIO-IN: 44.1KHZ · LOW LATENCY"
  listening={true}
  opticalProfile="cyber-cyan"
/>`,
      renderLive: () => render(React.createElement(Micro.MicroLiveCaptions, {
        speaker: 'SYS // AUDIO-01',
        line1: 'SYSTEM INITIALIZED. LINK NOMINAL',
        line2: 'AUDIO-IN: 44.1KHZ · LOW LATENCY',
        listening: true,
        opticalProfile: 'cyber-cyan',
        animated: true,
      })),
    },
    {
      id: 'vital-telemetry',
      name: 'MicroVitalTelemetry',
      title: 'Tactical Biometrics & Battery Status',
      desc: 'Real-time heart rate with 45° chamfered ECG pulse diamond, 5-stage HR zone exertion monitor, ambient barometric altitude, and 4-segment quantized battery gauge with runtime estimation.',
      dimensions: '160×48',
      svgFile: 'vital-telemetry.svg',
      jsxSnippet: `<MicroVitalTelemetry
  heartRate={138}
  hrZone={3}
  altitudeMeters={420}
  batteryPercent={68}
  batteryRuntimeHours={3.4}
  opticalProfile="cyber-cyan"
/>`,
      renderLive: () => render(React.createElement(Micro.MicroVitalTelemetry, {
        heartRate: 138,
        hrZone: 3,
        altitudeMeters: 420,
        batteryPercent: 68,
        batteryRuntimeHours: 3.4,
        opticalProfile: 'cyber-cyan',
        animated: true,
      })),
    },
    {
      id: 'glance-notice',
      name: 'MicroGlanceNotice',
      title: 'Peripheral Glance Notice & Auto-Decay',
      desc: 'Ultra-slim 26px banner designed for the upper edge of smart glasses displays. High-urgency contextual alerts (calendar, collision warning, security) with 45° chamfers and auto-decay countdown timer line.',
      dimensions: '220×26',
      svgFile: 'glance-notice.svg',
      jsxSnippet: `<MicroGlanceNotice
  category="COLLISION"
  title="COLLISION WARNING"
  subtitle="OBJECT AT 1.2M"
  severity="warn"
  dismissProgress={35}
  opticalProfile="tactical-amber"
/>`,
      renderLive: () => render(React.createElement(Micro.MicroGlanceNotice, {
        category: 'COLLISION',
        title: 'COLLISION WARNING',
        subtitle: 'OBJECT AT 1.2M',
        severity: 'warn',
        dismissProgress: 35,
        opticalProfile: 'tactical-amber',
        animated: true,
      })),
    },
    {
      id: 'spatial-inspection',
      name: 'MicroSpatialInspection',
      title: 'Central Boresight Frame & LiDAR Telemetry',
      desc: 'Tactical boresight targeting frame engineered with a 100% HOLLOW and transparent center to avoid occluding real-world equipment. Includes 4 corner brackets, exterior ticks, LiDAR range ruler, and target ID.',
      dimensions: '160×120',
      svgFile: 'spatial-inspection.svg',
      jsxSnippet: `<MicroSpatialInspection
  distanceMeters={1.4}
  targetLabel="VALVE_ACTUATOR_B2"
  status="locked"
  specCode="P/N: 884-J · OK"
  opticalProfile="phosphor-green"
/>`,
      renderLive: () => render(React.createElement(Micro.MicroSpatialInspection, {
        distanceMeters: 1.4,
        targetLabel: 'VALVE_ACTUATOR_B2',
        status: 'locked',
        specCode: 'P/N: 884-J · OK',
        opticalProfile: 'phosphor-green',
        animated: true,
      })),
    },
  ];

  // 3. Metadata for 4 Composite Viewport Cards
  const VIEWPORT_CARDS = [
    {
      id: 'hud-ambient',
      mode: 'ambient',
      title: 'Ambient Everyday Mode',
      desc: 'Ultra-minimalist peripheral datablock anchored in the top-left temple. 98% of the wearer’s field of view remains entirely unobstructed for day-long everyday wear.',
      svgFile: 'hud-viewport-ambient.svg',
      profile: 'cyber-cyan',
      jsxSnippet: `<SmartGlassesHUD mode="ambient" opticalProfile="cyber-cyan" />`,
      renderLive: () => ambientSvgRaw,
    },
    {
      id: 'hud-commute',
      mode: 'commute',
      title: 'Commute & Wayfinding Mode',
      desc: 'Top-right navigation guidance with maneuver countdown paired with top-center tactical compass azimuth heading. Central field of view 100% clear for safe road navigation.',
      svgFile: 'hud-viewport-commute.svg',
      profile: 'cyber-cyan',
      jsxSnippet: `<SmartGlassesHUD mode="commute" opticalProfile="cyber-cyan" />`,
      renderLive: () => commuteSvgRaw,
    },
    {
      id: 'hud-meeting',
      mode: 'meeting',
      title: 'Meeting & Teleprompter Mode',
      desc: 'Bottom-center speech transcription within foveal comfort boundary paired with top glance notifications. Complete central transparency allows natural eye contact with colleagues.',
      svgFile: 'hud-viewport-meeting.svg',
      profile: 'tactical-amber',
      jsxSnippet: `<SmartGlassesHUD mode="meeting" opticalProfile="tactical-amber" />`,
      renderLive: () => meetingSvgRaw,
    },
    {
      id: 'hud-field-ops',
      mode: 'field-ops',
      title: 'Field-Ops & Inspection Mode',
      desc: 'Central LiDAR boresight targeting frame framing physical equipment without obstruction, paired with biometric endurance telemetry and environmental radiation status.',
      svgFile: 'hud-viewport-field-ops.svg',
      profile: 'phosphor-green',
      jsxSnippet: `<SmartGlassesHUD mode="field-ops" opticalProfile="phosphor-green" />`,
      renderLive: () => fieldOpsSvgRaw,
    },
  ];

  // Build the complete HTML document
  const html = `<!DOCTYPE html>
<html lang="en" data-theme="dark" data-brand="biohub" data-motion="live">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>RIS v2.9 — Smart Glasses & Optical Waveguide Micro-HUD Laboratory</title>
  <meta name="description" content="Tactical Micro-HUD design system for smart glasses, waveguide AR optics, and compact HUD displays. Brutalist 1px precision with emissive alpha transparency.">

  <!-- RIS Design System Styles -->
  <link rel="stylesheet" href="css/ris-tokens.css">
  <link rel="stylesheet" href="css/ris.css">
  <link rel="stylesheet" href="css/ris-fx.css">
  <link rel="stylesheet" href="css/ris-skin-cyber.css">
  <link rel="stylesheet" href="css/ris-micro.css">

  <style>
    /* ==========================================================================
       OPTICAL SIMULATOR LAB STYLING
       ========================================================================== */
    :root {
      --lab-bg: #07090b;
      --lab-card-bg: rgba(14, 18, 22, 0.75);
      --lab-border: rgba(111, 179, 201, 0.25);
      --lab-line: rgba(111, 179, 201, 0.15);
      --lab-glow: 0 0 24px rgba(111, 179, 201, 0.12);
    }

    [data-theme="light"] {
      --lab-bg: #eef2f5;
      --lab-card-bg: rgba(255, 255, 255, 0.85);
      --lab-border: rgba(27, 107, 128, 0.35);
      --lab-line: rgba(27, 107, 128, 0.2);
      --lab-glow: 0 4px 20px rgba(27, 107, 128, 0.08);
    }

    body {
      margin: 0;
      padding: 0;
      background-color: var(--lab-bg);
      color: var(--ris-fg);
      font-family: var(--ris-font-sans, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif);
      -webkit-font-smoothing: antialiased;
      overflow-x: hidden;
    }

    /* Top Navigation Header */
    .lab-header {
      position: sticky;
      top: 0;
      z-index: 100;
      background: rgba(10, 13, 16, 0.92);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border-bottom: 1px solid var(--lab-border);
      padding: 12px 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      flex-wrap: wrap;
    }

    [data-theme="light"] .lab-header {
      background: rgba(245, 248, 250, 0.92);
    }

    .lab-logo-cluster {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .lab-badge {
      font-family: var(--ris-font-mono, monospace);
      font-size: 10px;
      font-weight: 700;
      padding: 3px 8px;
      border: 1px solid var(--ris-accent);
      color: var(--ris-accent);
      letter-spacing: 0.1em;
      clip-path: polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px));
    }

    .lab-nav-links {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .lab-nav-links a {
      font-family: var(--ris-font-mono, monospace);
      font-size: 11px;
      font-weight: 600;
      text-decoration: none;
      color: var(--ris-fg3);
      padding: 6px 12px;
      border: 1px solid transparent;
      transition: all 140ms ease;
    }

    .lab-nav-links a:hover,
    .lab-nav-links a.active {
      color: var(--ris-accent);
      border-color: var(--lab-border);
      background: rgba(111, 179, 201, 0.08);
      clip-path: polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px));
    }

    .lab-header-controls {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    /* Hero / Lens Simulator Layout */
    .simulator-stage {
      max-width: 1400px;
      margin: 32px auto 48px;
      padding: 0 24px;
    }

    .simulator-title-bar {
      margin-bottom: 24px;
    }

    .simulator-title-bar h1 {
      font-size: 28px;
      font-weight: 800;
      letter-spacing: -0.02em;
      margin: 0 0 6px;
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .simulator-title-bar p {
      margin: 0;
      font-size: 14px;
      color: var(--ris-fg3);
      line-height: 1.5;
    }

    .simulator-grid {
      display: grid;
      grid-template-columns: 1fr 380px;
      gap: 24px;
      align-items: start;
    }

    @media (max-width: 1080px) {
      .simulator-grid {
        grid-template-columns: 1fr;
      }
    }

    /* 16:9 Optical Pass-Through Viewport */
    .lens-viewport-container {
      position: relative;
      width: 100%;
      aspect-ratio: 16 / 9;
      background: #060708;
      border: 1px solid var(--lab-border);
      clip-path: polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px));
      overflow: hidden;
      box-shadow: 0 20px 48px rgba(0, 0, 0, 0.6), var(--lab-glow);
    }

    /* Real-world background imagery */
    .lens-bg-layer {
      position: absolute;
      inset: 0;
      background-size: cover;
      background-position: center;
      transition: opacity 400ms ease, filter 400ms ease;
      z-index: 1;
      opacity: 0;
      filter: brightness(0.92) contrast(1.08);
    }

    .lens-bg-layer.active {
      opacity: 1;
    }

    /* Optical lens bezel, tint, and vignette */
    .lens-bezel-overlay {
      position: absolute;
      inset: 0;
      z-index: 2;
      pointer-events: none;
      background: radial-gradient(circle at center, rgba(14, 20, 24, 0.02) 40%, rgba(5, 7, 9, 0.55) 100%);
      box-shadow: inset 0 0 40px rgba(0, 0, 0, 0.8);
      border: 1px solid rgba(255, 255, 255, 0.08);
    }

    /* Central Boresight Pupil Registration Markers */
    .lens-pupil-markers {
      position: absolute;
      inset: 0;
      z-index: 3;
      pointer-events: none;
    }

    /* Active Emissive Waveguide SVG HUD */
    .lens-hud-layer {
      position: absolute;
      inset: 0;
      z-index: 4;
      display: flex;
      align-items: center;
      justify-content: center;
      pointer-events: none;
    }

    .lens-hud-layer svg {
      width: 100%;
      height: 100%;
      pointer-events: auto;
    }

    /* Control Panel */
    .control-panel {
      background: var(--lab-card-bg);
      border: 1px solid var(--lab-border);
      clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px));
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .control-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .control-label {
      font-family: var(--ris-font-mono, monospace);
      font-size: 10px;
      font-weight: 700;
      color: var(--ris-fg3);
      letter-spacing: 0.1em;
      text-transform: uppercase;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .control-label-val {
      color: var(--ris-accent);
    }

    .button-row {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 6px;
    }

    .button-row--4 {
      grid-template-columns: repeat(4, 1fr);
    }

    .tactical-btn {
      font-family: var(--ris-font-mono, monospace);
      font-size: 10px;
      font-weight: 700;
      padding: 8px 10px;
      border: 1px solid var(--lab-line);
      background: rgba(255, 255, 255, 0.03);
      color: var(--ris-fg2);
      cursor: pointer;
      text-align: center;
      transition: all 120ms ease;
      clip-path: polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px));
    }

    .tactical-btn:hover {
      background: rgba(111, 179, 201, 0.12);
      border-color: var(--ris-accent);
      color: var(--ris-accent);
    }

    .tactical-btn.active {
      background: var(--ris-accent);
      border-color: var(--ris-accent);
      color: #000;
    }

    .tactical-slider {
      -webkit-appearance: none;
      width: 100%;
      height: 4px;
      background: rgba(111, 179, 201, 0.2);
      outline: none;
      border-radius: 0;
    }

    .tactical-slider::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 14px;
      height: 14px;
      background: var(--ris-accent);
      cursor: pointer;
      clip-path: polygon(50% 0, 100% 50%, 50% 100%, 0 50%);
      transition: transform 120ms ease;
    }

    .tactical-slider::-webkit-slider-thumb:hover {
      transform: scale(1.25);
    }

    /* Showcase Cards Grid */
    .section-container {
      max-width: 1400px;
      margin: 64px auto;
      padding: 0 24px;
    }

    .section-header {
      margin-bottom: 24px;
      border-bottom: 1px solid var(--lab-border);
      padding-bottom: 14px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      flex-wrap: wrap;
      gap: 12px;
    }

    .section-header h2 {
      font-size: 20px;
      font-weight: 800;
      margin: 0 0 4px;
      letter-spacing: -0.01em;
    }

    .section-header p {
      margin: 0;
      font-size: 13px;
      color: var(--ris-fg3);
    }

    .cards-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 20px;
    }

    .cards-grid--viewports {
      grid-template-columns: repeat(auto-fill, minmax(480px, 1fr));
    }

    @media (max-width: 640px) {
      .button-row--4 {
        grid-template-columns: repeat(2, 1fr);
      }
      .cards-grid {
        grid-template-columns: 1fr;
      }
      .cards-grid--viewports {
        grid-template-columns: 1fr;
      }
    }

    .eyewear-card {
      background: var(--lab-card-bg);
      border: 1px solid var(--lab-border);
      clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px));
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      transition: border-color 160ms ease, box-shadow 160ms ease;
    }

    .eyewear-card:hover {
      border-color: var(--ris-accent);
      box-shadow: var(--lab-glow);
    }

    .card-preview-stage {
      min-height: 110px;
      background: #060708;
      border: 1px solid var(--lab-line);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
      position: relative;
      overflow: hidden;
    }

    .card-preview-stage--viewport {
      aspect-ratio: 16 / 9;
      padding: 0;
    }

    .card-meta h3 {
      font-size: 15px;
      font-weight: 700;
      margin: 0 0 4px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .card-meta .dims {
      font-family: var(--ris-font-mono, monospace);
      font-size: 11px;
      color: var(--ris-fg4);
      font-weight: 500;
    }

    .card-meta p {
      font-size: 12px;
      color: var(--ris-fg3);
      line-height: 1.45;
      margin: 0;
    }

    .card-actions {
      display: flex;
      gap: 8px;
      margin-top: auto;
    }

    .action-btn {
      flex: 1;
      font-family: var(--ris-font-mono, monospace);
      font-size: 10px;
      font-weight: 700;
      padding: 7px 10px;
      border: 1px solid var(--lab-line);
      background: transparent;
      color: var(--ris-fg2);
      cursor: pointer;
      text-align: center;
      transition: all 120ms ease;
      clip-path: polygon(0 0, calc(100% - 3px) 0, 100% 3px, 100% 100%, 3px 100%, 0 calc(100% - 3px));
    }

    .action-btn:hover {
      background: rgba(111, 179, 201, 0.15);
      border-color: var(--ris-accent);
      color: var(--ris-accent);
    }

    /* Commercial Banner */
    .commercial-banner {
      background: linear-gradient(90deg, rgba(230, 162, 60, 0.12), rgba(111, 179, 201, 0.12));
      border: 1px solid var(--ris-accent);
      padding: 16px 24px;
      margin: 48px auto;
      max-width: 1400px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      flex-wrap: wrap;
      clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px));
    }

    .commercial-content h4 {
      margin: 0 0 4px;
      font-size: 15px;
      font-weight: 800;
      color: var(--ris-accent);
    }

    .commercial-content p {
      margin: 0;
      font-size: 12px;
      color: var(--ris-fg2);
    }

    /* Sonner HUD Toast */
    #hud-toast-container {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 1000;
      display: flex;
      flex-direction: column;
      gap: 8px;
      pointer-events: none;
    }

    .hud-toast {
      font-family: var(--ris-font-mono, monospace);
      font-size: 11px;
      font-weight: 700;
      padding: 10px 16px;
      background: #0a0e12;
      border: 1px solid var(--ris-accent);
      color: var(--ris-accent);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.8), 0 0 12px rgba(111, 179, 201, 0.2);
      clip-path: polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px));
      opacity: 0;
      transform: translateY(12px);
      transition: all 180ms cubic-bezier(0.16, 1, 0.3, 1);
    }

    .hud-toast.show {
      opacity: 1;
      transform: translateY(0);
    }
  </style>
</head>
<body>

  <!-- Top Global Navigation Header -->
  <header class="lab-header">
    <div class="lab-logo-cluster">
      <span class="lab-badge">RIS v2.9</span>
      <strong style="font-size: 13px; letter-spacing: 0.04em;">EYEWEAR MICRO-HUD</strong>
    </div>

    <nav class="lab-nav-links">
      <a href="index.html">Specimens</a>
      <a href="micro-ui.html">Micrographics</a>
      <a href="eyewear.html" class="active">Eyewear HUD</a>
      <a href="motion-lab.html">Motion Lab</a>
      <a href="mobile.html">Mobile OLED</a>
    </nav>

    <div class="lab-header-controls">
      <!-- Theme Switcher -->
      <button class="tactical-btn" onclick="toggleTheme()" id="theme-btn">Theme: Dark</button>

      <!-- Brand Switcher -->
      <button class="tactical-btn" onclick="cycleBrand()" id="brand-btn">Brand: biohub</button>
    </div>
  </header>

  <!-- Commercial CTA Banner -->
  <div class="section-container" style="margin-top: 24px; margin-bottom: 0;">
    <div class="commercial-banner">
      <div class="commercial-content">
        <h4>⚡ RIS PRO STUDIO — SMART GLASSES & HUD GRAPHICS MASTER</h4>
        <p>Get all 34+ Micro-UI vector atoms, 9 eyewear HUD templates, and native Figma generator script.</p>
      </div>
      <a href="https://buy.polar.sh/polar_cl_gzshc6MZaGsQy6V3oqQ1U0uK3kIQ7mcGr0wf00JbLZn" target="_blank" rel="noopener" class="tactical-btn" style="background: var(--ris-accent); color: #000; text-decoration: none; padding: 10px 18px;">
        Get Pro Studio ($24 Launch Offer) ↗
      </a>
    </div>
  </div>

  <!-- Hero Section: Optical Pass-Through Lens Simulator -->
  <main class="simulator-stage">
    <div class="simulator-title-bar">
      <h1>
        <span>OPTICAL WAVEGUIDE PASS-THROUGH SIMULATOR</span>
        <span class="lab-badge" style="font-size: 11px;">100% NON-OCCLUDING</span>
      </h1>
      <p>
        Verifies 1px tactical telemetry contrast and non-occlusion over real-world photopic environments.<br>
        On MicroLED / Micro-OLED see-through waveguides, black pixels emit zero light (100% transparent). Test your HUD across daylight glare, night urban traffic, and complex industrial inspection.
      </p>
    </div>

    <div class="simulator-grid">
      <!-- Left Bay: The 16:9 Lens Simulator -->
      <div class="lens-viewport-container" id="lens-container">
        <!-- Background 1: Daylight Street -->
        <div
          class="lens-bg-layer active"
          id="bg-daylight"
          style="background-image: url('https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1600&q=80');"
        ></div>

        <!-- Background 2: Night Traffic -->
        <div
          class="lens-bg-layer"
          id="bg-night"
          style="background-image: url('https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1600&q=80');"
        ></div>

        <!-- Background 3: Industrial Inspection -->
        <div
          class="lens-bg-layer"
          id="bg-industrial"
          style="background-image: url('https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1600&q=80');"
        ></div>

        <!-- Background 4: Dark Lab Void -->
        <div
          class="lens-bg-layer"
          id="bg-void"
          style="background-color: #060708;"
        ></div>

        <!-- Optical Bezel & Anti-Glare Vignette -->
        <div class="lens-bezel-overlay"></div>

        <!-- Center Crosshair / Pupil Registration Ticks -->
        <div class="lens-pupil-markers">
          <svg viewBox="0 0 640 360" width="100%" height="100%" fill="none" stroke="rgba(255,255,255,0.12)" stroke-width="1" vector-effect="non-scaling-stroke">
            <line x1="316" y1="180" x2="324" y2="180" />
            <line x1="320" y1="176" x2="320" y2="184" />
          </svg>
        </div>

        <!-- Live Rendered HUD SVG Layer -->
        <div class="lens-hud-layer" id="lens-hud">
          ${ambientSvgRaw}
        </div>
      </div>

      <!-- Right Bay: Tactical Control Panel -->
      <aside class="control-panel">
        <!-- 1. Background Switcher -->
        <div class="control-group">
          <label class="control-label">Real-World Pass-Through Lens</label>
          <div class="button-row">
            <button class="tactical-btn active" onclick="setLensBg('daylight', this)">☀️ Daylight City</button>
            <button class="tactical-btn" onclick="setLensBg('night', this)">🌃 Night Traffic</button>
            <button class="tactical-btn" onclick="setLensBg('industrial', this)">🏭 Industrial</button>
            <button class="tactical-btn" onclick="setLensBg('void', this)">⬛ Dark Lab Void</button>
          </div>
        </div>

        <!-- 2. Operational Mode -->
        <div class="control-group">
          <label class="control-label">HUD Operational Mode</label>
          <div class="button-row">
            <button class="tactical-btn active" onclick="setHudMode('ambient', this)">[Ambient]</button>
            <button class="tactical-btn" onclick="setHudMode('commute', this)">[Commute]</button>
            <button class="tactical-btn" onclick="setHudMode('meeting', this)">[Meeting]</button>
            <button class="tactical-btn" onclick="setHudMode('field-ops', this)">[Field Ops]</button>
          </div>
        </div>

        <!-- 3. Waveguide Chromatic Profile -->
        <div class="control-group">
          <label class="control-label">Waveguide Chromatic Profile</label>
          <div class="button-row--4" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px;">
            <button class="tactical-btn active" onclick="setOpticalProfile('cyber-cyan', this)" style="border-bottom: 2px solid #6fb3c9;">Cyan</button>
            <button class="tactical-btn" onclick="setOpticalProfile('phosphor-green', this)" style="border-bottom: 2px solid #2fe48a;">Green</button>
            <button class="tactical-btn" onclick="setOpticalProfile('tactical-amber', this)" style="border-bottom: 2px solid #e6a23c;">Amber</button>
            <button class="tactical-btn" onclick="setOpticalProfile('alert-red', this)" style="border-bottom: 2px solid #ff2d3c;">Alert</button>
          </div>
        </div>

        <!-- 4. Scrubber: Navigation Maneuver Distance -->
        <div class="control-group">
          <label class="control-label">
            <span>Wayfinding Maneuver</span>
            <span class="control-label-val" id="nav-dist-val">85M</span>
          </label>
          <input
            type="range"
            min="0"
            max="250"
            value="85"
            class="tactical-slider"
            id="nav-dist-slider"
            oninput="updateNavDistance(this.value)"
          >
        </div>

        <!-- 5. Scrubber: Speech Transcription Preset -->
        <div class="control-group">
          <label class="control-label">Live Transcription Preset</label>
          <div class="button-row" style="grid-template-columns: 1fr;">
            <button class="tactical-btn active" onclick="setCaptionPreset(0, this)">[EN→IT] Live Translation</button>
            <button class="tactical-btn" onclick="setCaptionPreset(1, this)">Keynote Teleprompter</button>
            <button class="tactical-btn" onclick="setCaptionPreset(2, this)">Safety Valve Inspection</button>
          </div>
        </div>

        <!-- 6. Scrubber: LiDAR Boresight Distance -->
        <div class="control-group">
          <label class="control-label">
            <span>LiDAR Boresight Range</span>
            <span class="control-label-val" id="lidar-dist-val">1.40M</span>
          </label>
          <input
            type="range"
            min="0.2"
            max="10.0"
            step="0.1"
            value="1.4"
            class="tactical-slider"
            id="lidar-dist-slider"
            oninput="updateLidarDistance(this.value)"
          >
        </div>

        <!-- 7. Motion Simulation Toggle -->
        <div class="control-group">
          <label class="control-label">Motion Engine</label>
          <div class="button-row">
            <button class="tactical-btn active" onclick="setMotionMode('live', this)">Live Simulation</button>
            <button class="tactical-btn" onclick="setMotionMode('static', this)">Static Vector</button>
          </div>
        </div>
      </aside>
    </div>
  </main>

  <!-- Section 1: Atomic Eyewear HUD Components -->
  <section class="section-container">
    <div class="section-header">
      <div>
        <h2>01. ATOMIC EYEWEAR HUD COMPONENTS</h2>
        <p>Ultra-compact, non-occluding 1px vector components designed for optical waveguide displays.</p>
      </div>
      <span class="lab-badge">5 STANDALONE ATOMS</span>
    </div>

    <div class="cards-grid">
      ${ATOMIC_CARDS.map(card => `
        <div class="eyewear-card" id="card-${card.id}">
          <div class="card-preview-stage">
            ${card.renderLive()}
          </div>
          <div class="card-meta">
            <h3>
              <span>${card.name}</span>
              <span class="dims">${card.dimensions}</span>
            </h3>
            <p>${card.desc}</p>
          </div>
          <div class="card-actions">
            <button class="action-btn" onclick="copySvg('${card.id}')">[Copy SVG]</button>
            <button class="action-btn" onclick="copyJsx('${card.id}')">[Copy JSX]</button>
          </div>
          <!-- Hidden scripts for clipboard copy -->
          <script type="text/plain" id="svg-${card.id}">${getStandaloneSvg(card.svgFile)}</script>
          <script type="text/plain" id="jsx-${card.id}">${card.jsxSnippet}</script>
        </div>
      `).join('')}
    </div>
  </section>

  <!-- Section 2: Composite 16:9 Viewport Specimen Cards -->
  <section class="section-container">
    <div class="section-header">
      <div>
        <h2>02. TURNKEY 16:9 HUD VIEWPORTS</h2>
        <p>Fully composed optical HUD overlays orchestrating the 4 peripheral anchors and hollow center boresight.</p>
      </div>
      <span class="lab-badge">4 COMPOSITE MODES</span>
    </div>

    <div class="cards-grid cards-grid--viewports">
      ${VIEWPORT_CARDS.map(card => `
        <div class="eyewear-card" id="card-${card.id}">
          <div class="card-preview-stage card-preview-stage--viewport">
            ${card.renderLive()}
          </div>
          <div class="card-meta">
            <h3>
              <span>${card.title}</span>
              <span class="dims">640×360 (16:9)</span>
            </h3>
            <p>${card.desc}</p>
          </div>
          <div class="card-actions">
            <button class="action-btn" onclick="copySvg('${card.id}')">[Copy SVG]</button>
            <button class="action-btn" onclick="copyJsx('${card.id}')">[Copy JSX]</button>
          </div>
          <!-- Hidden scripts for clipboard copy -->
          <script type="text/plain" id="svg-${card.id}">${getStandaloneSvg(card.svgFile)}</script>
          <script type="text/plain" id="jsx-${card.id}">${card.jsxSnippet}</script>
        </div>
      `).join('')}
    </div>
  </section>

  <!-- Sonner-Style HUD Toast Container -->
  <div id="hud-toast-container"></div>

  <!-- Raw SVG templates for live HUD mode switching -->
  <div style="display: none;">
    <div id="raw-hud-ambient">${ambientSvgRaw}</div>
    <div id="raw-hud-commute">${commuteSvgRaw}</div>
    <div id="raw-hud-meeting">${meetingSvgRaw}</div>
    <div id="raw-hud-field-ops">${fieldOpsSvgRaw}</div>
  </div>

  <script>
    // ========================================================================
    // CLIENT INTERACTION & SIMULATOR CONTROLLER
    // ========================================================================

    let currentMode = 'ambient';
    let currentOpticalProfile = 'cyber-cyan';
    let currentBrand = 'biohub';
    let currentMotion = 'live';

    const CAPTION_PRESETS = [
      {
        speaker: 'SYS // AUDIO-01',
        line1: 'SYSTEM INITIALIZED. LINK NOMINAL',
        line2: 'AUDIO-IN: 44.1KHZ · LOW LATENCY',
      },
      {
        speaker: 'OPERATOR 02',
        line1: 'WELCOME TEAM. RELIC SYSTEM',
        line2: 'REVOLUTIONIZING WEARABLE HUDS',
      },
      {
        speaker: 'SAFETY-AI',
        line1: 'VALVE PRESSURIZED TO 4.2 BAR',
        line2: 'ALL SYSTEM SEALS NOMINAL · OK',
      },
    ];

    // 1. Pass-Through Background Switcher
    function setLensBg(bgId, btn) {
      document.querySelectorAll('.lens-bg-layer').forEach(el => el.classList.remove('active'));
      const target = document.getElementById('bg-' + bgId);
      if (target) target.classList.add('active');

      if (btn) {
        btn.parentElement.querySelectorAll('button').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      }
      showHudToast('Lens background updated: ' + bgId.toUpperCase());
    }

    // Fallback clipboard copying for non-HTTPS or denied permissions
    function fallbackCopy(text) {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-9999px';
      textArea.style.top = '-9999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
      } catch (e) {}
      document.body.removeChild(textArea);
    }

    // 2. HUD Mode Switcher
    function setHudMode(mode, btn) {
      currentMode = mode;
      const rawEl = document.getElementById('raw-hud-' + mode);
      const hudContainer = document.getElementById('lens-hud');
      if (rawEl && hudContainer) {
        hudContainer.innerHTML = rawEl.innerHTML;
        applyCurrentOpticalProfile();

        // Re-apply current scrubbed states to the new HUD mode
        const navSlider = document.getElementById('nav-dist-slider');
        if (navSlider) updateNavDistance(navSlider.value);

        const lidarSlider = document.getElementById('lidar-dist-slider');
        if (lidarSlider) updateLidarDistance(lidarSlider.value);

        const activeCaption = document.querySelector('button[onclick^="setCaptionPreset"].active');
        if (activeCaption) {
          const match = activeCaption.getAttribute('onclick').match(/(\d+)/);
          if (match) setCaptionPreset(parseInt(match[1], 10));
        }
      }

      if (btn) {
        btn.parentElement.querySelectorAll('button').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      }
      showHudToast('HUD mode set to [' + mode.toUpperCase() + ']');
    }

    // 3. Optical Profile Switcher
    function setOpticalProfile(profile, btn) {
      currentOpticalProfile = profile;
      applyCurrentOpticalProfile();

      if (btn) {
        btn.parentElement.querySelectorAll('button').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      }
      showHudToast('Waveguide profile: ' + profile.toUpperCase());
    }

    function applyCurrentOpticalProfile() {
      const colors = {
        'phosphor-green': '#2fe48a',
        'tactical-amber': '#e6a23c',
        'cyber-cyan': '#6fb3c9',
        'alert-red': '#ff2d3c',
      };
      const classMap = {
        'phosphor-green': 'phosphor',
        'tactical-amber': 'amber',
        'cyber-cyan': 'cyan',
        'alert-red': 'alert',
      };
      const activeColor = colors[currentOpticalProfile] || '#6fb3c9';
      const activeSuffix = classMap[currentOpticalProfile] || 'cyan';

      // 1. Update simulator HUD and all its nested child SVGs
      const hudContainer = document.getElementById('lens-hud');
      if (hudContainer) {
        hudContainer.querySelectorAll('svg').forEach(svg => {
          svg.style.color = activeColor;
          svg.setAttribute('data-optical-profile', currentOpticalProfile);
          if (svg.className && svg.className.baseVal !== undefined) {
            const clean = svg.className.baseVal.replace(/ris-eyewear-profile-\S+/g, '').trim();
            svg.className.baseVal = (clean + ' ris-eyewear-profile-' + activeSuffix).trim();
          }
        });
      }

      // 2. Update all atomic and turnkey specimen cards
      document.querySelectorAll('.eyewear-card .card-preview-stage svg').forEach(svg => {
        svg.style.color = activeColor;
        svg.setAttribute('data-optical-profile', currentOpticalProfile);
        if (svg.className && svg.className.baseVal !== undefined) {
          const clean = svg.className.baseVal.replace(/ris-eyewear-profile-\S+/g, '').trim();
          svg.className.baseVal = (clean + ' ris-eyewear-profile-' + activeSuffix).trim();
        }
      });
    }

    // 4. Live Scrubber: Navigation Distance
    function updateNavDistance(val) {
      const distNum = parseInt(val, 10);
      const label = document.getElementById('nav-dist-val');
      if (label) label.textContent = distNum + 'M';

      const formatted = distNum < 999.5
        ? 'IN ' + distNum + 'M'
        : 'IN ' + (distNum / 1000).toFixed(1) + 'KM';

      document.querySelectorAll('.ris-micro-nav').forEach(nav => {
        const textDist = nav.querySelector('text[letter-spacing="0.04em"]');
        if (textDist) textDist.textContent = formatted;
      });
    }

    // 5. Live Scrubber: Transcription Preset
    function setCaptionPreset(index, btn) {
      const preset = CAPTION_PRESETS[index];
      if (!preset) return;

      if (btn) {
        btn.parentElement.querySelectorAll('button').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      }

      document.querySelectorAll('.ris-micro-captions').forEach(svgEl => {
        const texts = svgEl.querySelectorAll('text');
        if (texts.length >= 3) {
          const listening = svgEl.getAttribute('data-listening') !== 'false';
          const prefix = listening ? '[REC] ' : '[IDLE] ';
          texts[0].textContent = prefix + preset.speaker.slice(0, 20).toUpperCase();
          texts[1].textContent = preset.line1.slice(0, 34).toUpperCase();
          texts[2].textContent = preset.line2.slice(0, 34).toUpperCase();
        }
      });

      showHudToast('Transcription preset applied');
    }

    // 6. Live Scrubber: LiDAR Range
    function updateLidarDistance(val) {
      const dist = parseFloat(val);
      const label = document.getElementById('lidar-dist-val');
      if (label) label.textContent = dist.toFixed(2) + 'M';

      const clampedDist = Math.max(0.2, Math.min(10.0, dist));
      const distRatio = (clampedDist - 0.2) / (10.0 - 0.2);
      const pipY = Math.round(96 - distRatio * 72);

      document.querySelectorAll('.ris-micro-inspection').forEach(svgEl => {
        const distText = svgEl.querySelector('.ris-micro-inspection-chip-top text:first-child') ||
                         svgEl.querySelector('text[x="12"]');
        if (distText) distText.textContent = 'DST: ' + dist.toFixed(2) + 'M';

        const pip = svgEl.querySelector('polygon');
        if (pip) {
          pip.setAttribute('points', '155,' + (pipY - 2.5) + ' 150.5,' + pipY + ' 155,' + (pipY + 2.5));
        }
      });
    }

    // 7. Motion Simulation Toggle
    function setMotionMode(mode, btn) {
      currentMotion = mode;
      document.documentElement.setAttribute('data-motion', mode);

      if (btn) {
        btn.parentElement.querySelectorAll('button').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      }
      showHudToast('Motion engine: ' + mode.toUpperCase());
    }

    // 8. Theme Toggle
    function toggleTheme() {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      const btn = document.getElementById('theme-btn');
      if (btn) btn.textContent = 'Theme: ' + (next === 'dark' ? 'Dark' : 'Light');
      showHudToast('Theme set to ' + next.toUpperCase());
    }

    // 9. Brand Cycle
    const BRANDS = ['biohub', 'relic', 'omnikon', 'neutral'];
    function cycleBrand() {
      const idx = BRANDS.indexOf(currentBrand);
      currentBrand = BRANDS[(idx + 1) % BRANDS.length];
      document.documentElement.setAttribute('data-brand', currentBrand);
      const btn = document.getElementById('brand-btn');
      if (btn) btn.textContent = 'Brand: ' + currentBrand;
      showHudToast('Brand set to ' + currentBrand.toUpperCase());
    }

    // 10. Copy SVG & JSX with Sonner Toast
    async function copySvg(cardId) {
      const scriptEl = document.getElementById('svg-' + cardId);
      if (!scriptEl) return;

      const colors = {
        'phosphor-green': '#2fe48a',
        'tactical-amber': '#e6a23c',
        'cyber-cyan': '#6fb3c9',
        'alert-red': '#ff2d3c',
      };
      const classMap = {
        'phosphor-green': 'phosphor',
        'tactical-amber': 'amber',
        'cyber-cyan': 'cyan',
        'alert-red': 'alert',
      };
      const activeHex = colors[currentOpticalProfile] || '#6fb3c9';
      const activeSuffix = classMap[currentOpticalProfile] || 'cyan';

      let svgText = scriptEl.textContent;
      svgText = svgText.replace(/color:\s*(?:#[a-fA-F0-9]{3,6}|var\([^)]+\));?/g, 'color: ' + activeHex + ';');
      svgText = svgText.replace(/data-optical-profile="[^"]*"/g, 'data-optical-profile="' + currentOpticalProfile + '"');
      svgText = svgText.replace(/ris-eyewear-profile-[a-z-]+/g, 'ris-eyewear-profile-' + activeSuffix);
      svgText = svgText.replaceAll('#6fb3c9', activeHex).replaceAll('#e6a23c', activeHex).replaceAll('#2fe48a', activeHex).replaceAll('#ff2d3c', activeHex);

      try {
        await navigator.clipboard.writeText(svgText);
        showHudToast('[0x5A1] SVG copied to clipboard');
      } catch (err) {
        fallbackCopy(svgText);
        showHudToast('[0x5A1] SVG copied to clipboard');
      }
    }

    async function copyJsx(cardId) {
      const scriptEl = document.getElementById('jsx-' + cardId);
      if (!scriptEl) return;

      let snippet = scriptEl.textContent;
      snippet = snippet.replace(/opticalProfile="[^"]*"/g, 'opticalProfile="' + currentOpticalProfile + '"');

      try {
        await navigator.clipboard.writeText(snippet);
        showHudToast('[0x7D2] JSX snippet copied to clipboard');
      } catch (err) {
        fallbackCopy(snippet);
        showHudToast('[0x7D2] JSX snippet copied to clipboard');
      }
    }

    function showHudToast(msg) {
      const container = document.getElementById('hud-toast-container');
      if (!container) return;

      const toast = document.createElement('div');
      toast.className = 'hud-toast';
      toast.textContent = msg;
      container.appendChild(toast);

      requestAnimationFrame(() => {
        toast.classList.add('show');
      });

      setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 200);
      }, 2600);
    }
  </script>
</body>
</html>
`;

  const outputPath = path.join(rootDir, 'docs', 'eyewear.html');
  fs.writeFileSync(outputPath, html, 'utf8');
  console.log(`>>> [OK] Generated docs/eyewear.html successfully (${(Buffer.byteLength(html) / 1024).toFixed(1)} KB)`);
}

main().catch(err => {
  console.error('Fatal error generating docs/eyewear.html:', err);
  process.exit(1);
});

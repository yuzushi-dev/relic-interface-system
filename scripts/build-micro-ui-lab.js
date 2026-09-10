#!/usr/bin/env node

/**
 * RELIC INTERFACE SYSTEM (RIS v2)
 * Generator for docs/micro-ui.html — Interactive Showcase Laboratory
 */

const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');

const rootDir = path.resolve(__dirname, '..');
const reactPath = path.join(rootDir, 'react', 'node_modules', 'react', 'index.js');
const reactDomPath = path.join(rootDir, 'react', 'node_modules', 'react-dom', 'server.node.js');
const distPath = path.join(rootDir, 'react', 'dist', 'index.js');

async function main() {
  const React = await import(pathToFileURL(reactPath).href);
  const ReactDOMServer = await import(pathToFileURL(reactDomPath).href);
  const Micro = await import(pathToFileURL(distPath).href);
  const render = (ReactDOMServer.default || ReactDOMServer).renderToStaticMarkup;

  const SECTIONS = [
    {
      id: 'sec-reticles',
      secNum: '01',
      title: 'Reticles & Optical Crosshairs',
      eyebrow: 'OPTICAL TARGETING & ALIGNMENT',
      description: 'High-precision targeting reticles, optic crosshairs, corner alignment brackets, and angular bearing indicators for HUD optics.',
      items: [
        {
          preset: 'target-lock',
          compName: 'MicroReticle',
          title: 'Target Lock Reticle',
          variant: 'target-circle',
          dims: '32×32',
          desc: 'Optic target acquisition reticle with 45° chamfered diamond, cardinal tick lines, and concentric survey circle.',
          category: 'reticles',
          props: { preset: 'target-lock', animated: true },
        },
        {
          preset: 'corner-bracket',
          compName: 'MicroReticle',
          title: 'Corner Alignment Bracket',
          variant: 'corner-box',
          dims: '32×32',
          desc: 'HUD corner alignment brackets with bounding markers for visual spatial framing and optical telemetry targeting.',
          category: 'reticles',
          props: { preset: 'corner-bracket', animated: true },
        },
        {
          preset: 'optic-grid',
          compName: 'MicroReticle',
          title: 'Optic Survey Grid',
          variant: 'optic-survey',
          dims: '32×32',
          desc: 'Optical survey reticle with angular bearing graduation ticks and cardinal crosshair alignment for spatial telemetry.',
          category: 'reticles',
          props: { preset: 'optic-grid', animated: true },
        },
      ],
    },
    {
      id: 'sec-dials',
      secNum: '02',
      title: 'Dials, Gauges & Azimuth Needles',
      eyebrow: 'ROTATIONAL TELEMETRY & AZIMUTH',
      description: 'Radial telemetry gauges, circular frequency bands, 360° compass azimuth needles, and 90° quadrant sweep indicators.',
      interactiveControl: 'dials',
      items: [
        {
          preset: 'frequency',
          compName: 'MicroDial',
          title: 'Frequency Sweep Dial',
          variant: 'segmented',
          dims: '32×32',
          desc: 'Segmented circular RF frequency band dial with continuous rotating radar sweep needle.',
          category: 'dials',
          props: { preset: 'frequency', animated: true },
        },
        {
          preset: 'power-gauge',
          compName: 'MicroDial',
          title: 'Quantized Power Gauge',
          variant: 'arc',
          dims: '32×32',
          desc: 'Quantized arc power gauge with numeric percentage readout, radial graduation pips, and fill track.',
          category: 'dials',
          props: { preset: 'power-gauge', animated: true, value: 75 },
        },
        {
          preset: 'compass',
          compName: 'MicroDial',
          title: 'Azimuth Compass Dial',
          variant: 'radial-ticks',
          dims: '32×32',
          desc: '360° radial azimuth compass with cardinal markers (N/E/S/W) and rotating directional needle.',
          category: 'dials',
          props: { preset: 'compass', animated: true, value: 75 },
        },
        {
          preset: 'azimuth-90',
          compName: 'MicroDial',
          title: '90° Azimuth Quadrant',
          variant: 'arc',
          dims: '32×32',
          desc: '90° quadrant sweep needle gauge for pitch, elevation, and angular deflection telemetry tracking.',
          category: 'dials',
          props: { preset: 'azimuth-90', animated: true, value: 75 },
        },
      ],
    },
    {
      id: 'sec-matrices',
      secNum: '03',
      title: 'LED Matrices & Dot Arrays',
      eyebrow: 'DISCRETE TELEMETRY & BITMASKS',
      description: 'Discrete LED dot matrices, dense binary block status indicators, reticle pattern fields, and 3x3 optical register arrays.',
      interactiveControl: 'matrices',
      items: [
        {
          preset: 'led-4x4',
          compName: 'MicroMatrix',
          title: '4x4 LED Telemetry Array',
          variant: 'dots',
          dims: '32×32',
          desc: '4x4 discrete LED telemetry dot matrix with tactical corner crop brackets and blinking status cells.',
          category: 'matrices',
          props: { preset: 'led-4x4', animated: true },
        },
        {
          preset: 'binary-status',
          compName: 'MicroMatrix',
          title: 'Binary Status Block Grid',
          variant: 'blocks',
          dims: '32×32',
          desc: 'Dense 4x4 binary status block grid indicating bitmask diagnostics and subsystem bus health registers.',
          category: 'matrices',
          props: { preset: 'binary-status', animated: true },
        },
        {
          preset: 'cross-grid',
          compName: 'MicroMatrix',
          title: 'Crosshair Pattern Field',
          variant: 'crosses',
          dims: '32×32',
          desc: 'Crosshair reticle matrix pattern field for coordinate tracking, planar alignment, and spatial grid indexing.',
          category: 'matrices',
          props: { preset: 'cross-grid', animated: true },
        },
        {
          preset: 'status-3x3',
          compName: 'MicroMatrix',
          title: '3x3 Status Register Array',
          variant: 'dots',
          dims: '32×32',
          desc: 'Compact 3x3 optical status indicator array for discrete subsystem state registers and sensor nodes.',
          category: 'matrices',
          props: { preset: 'status-3x3', animated: true },
        },
      ],
    },
    {
      id: 'sec-equalizers',
      secNum: '04',
      title: 'Equalizers & Signal Quantizers',
      eyebrow: 'WAVEFORMS & SPECTRUM ANALYSIS',
      description: 'Discrete audio spectrum visualizers, packet throughput meters, and mirrored bi-directional bandwidth channel bars.',
      interactiveControl: 'equalizers',
      items: [
        {
          preset: 'audio-signal',
          compName: 'MicroEqualizer',
          title: 'Audio Signal Spectrum',
          variant: 'waveform',
          dims: '32×32',
          desc: 'Waveform audio signal bar visualizer with dynamic peak indicators, quantized steps, and baseline axis.',
          category: 'equalizers',
          props: { preset: 'audio-signal', animated: true },
        },
        {
          preset: 'packet-stream',
          compName: 'MicroEqualizer',
          title: 'Packet Stream Quantizer',
          variant: 'discrete',
          dims: '32×32',
          desc: 'Discrete quantized packet throughput meter with stepped channel frequency bars and status cap dots.',
          category: 'equalizers',
          props: { preset: 'packet-stream', animated: true },
        },
        {
          preset: 'bandwidth',
          compName: 'MicroEqualizer',
          title: 'Bi-Directional Bandwidth',
          variant: 'mirrored',
          dims: '33×32',
          desc: 'Mirrored bi-directional bandwidth channel equalizer with duplex transmit/receive line telemetry.',
          category: 'equalizers',
          props: { preset: 'bandwidth', animated: true },
        },
      ],
    },
    {
      id: 'sec-telemetry',
      secNum: '05',
      title: 'Telemetry DataBlocks & Industrial Badges',
      eyebrow: 'SERIAL TAGS & SUBSYSTEM STAMPS',
      description: 'High-density metadata stamps, serial identifiers, framed status tags, and Katakana telemetry markers.',
      items: [
        {
          preset: 'node-status',
          compName: 'MicroTelemetry',
          title: 'Framed Node Status Badge',
          variant: 'framed',
          dims: '80×40',
          desc: 'Framed [ONLINE] node telemetry badge with Katakana accent [ノード] and serial identifier.',
          category: 'telemetry',
          props: { preset: 'node-status', animated: true },
        },
        {
          preset: 'system-reset',
          compName: 'MicroTelemetry',
          title: 'Stacked System Reset Block',
          variant: 'stacked',
          dims: '72×36',
          desc: 'Stacked SYS-RST telemetry block with graduation ticks, hardware status, and Katakana reset glyph [リセット].',
          category: 'telemetry',
          props: { preset: 'system-reset', animated: true },
        },
        {
          preset: 'epoch-diag',
          compName: 'MicroTelemetry',
          title: 'Inline Epoch Diagnostic Strip',
          variant: 'inline',
          dims: '96×24',
          desc: 'Inline horizontal EPOCH diagnostic telemetry strip with real-time timestamp readout and diagnostic code.',
          category: 'telemetry',
          props: { preset: 'epoch-diag', animated: true },
        },
      ],
    },
    {
      id: 'sec-calipers',
      secNum: '06',
      title: 'Calipers & Measurement Rulers',
      eyebrow: 'SPATIAL RULES & GRADUATED SCALES',
      description: 'Spatial measurement rulers, 45° chamfered bounding calipers, and technical annotation leader lines.',
      items: [
        {
          preset: 'ruler-100',
          compName: 'MicroCaliper',
          title: 'Graduated Millimeter Ruler',
          variant: 'ruler',
          dims: '100×16',
          desc: '100px graduated millimeter measurement ruler with millimeter and decimeter division ticks and span bounds.',
          category: 'calipers',
          props: { preset: 'ruler-100', animated: true },
        },
        {
          preset: 'bracket-caliper',
          compName: 'MicroCaliper',
          title: 'Spatial Bounding Caliper',
          variant: 'bracket',
          dims: '80×16',
          desc: '45° chamfered spatial caliper bounding bracket with dimensional dimensioning callouts and corner limits.',
          category: 'calipers',
          props: { preset: 'bracket-caliper', animated: true },
        },
        {
          preset: 'leader-45',
          compName: 'MicroCaliper',
          title: '45° Annotation Leader',
          variant: 'leader-line',
          dims: '64×24',
          desc: '45° dogleg technical annotation leader line with target landing pip and metadata label coordinate.',
          category: 'calipers',
          props: { preset: 'leader-45', animated: true },
        },
      ],
    },
    {
      id: 'sec-constellations',
      secNum: '07',
      title: 'Constellations & Planar Relays',
      eyebrow: 'TOPOLOGY & ORBITAL NETWORKS',
      description: 'Planar mesh networks, orbital satellite relays with beacon pulse waves, and hierarchical downlink trees.',
      items: [
        {
          preset: 'network-3node',
          compName: 'MicroConstellation',
          title: 'Triangular Planar Mesh',
          variant: 'star',
          dims: '32×32',
          desc: 'Triangular 3-node planar mesh network graph with link routing lines, active node beacon, and link status.',
          category: 'constellations',
          props: { preset: 'network-3node', animated: true },
        },
        {
          preset: 'orbital-relay',
          compName: 'MicroConstellation',
          title: 'Orbital Satellite Relay',
          variant: 'relay',
          dims: '32×32',
          desc: 'Central hub orbital relay constellation with radiating communication vectors and beacon pulse waves.',
          category: 'constellations',
          props: { preset: 'orbital-relay', animated: true },
        },
        {
          preset: 'signal-tree',
          compName: 'MicroConstellation',
          title: 'Downlink Signal Tree',
          variant: 'tree',
          dims: '32×32',
          desc: 'Hierarchical downlink signal tree schema for multi-tier subsystem routing topology and packet relays.',
          category: 'constellations',
          props: { preset: 'signal-tree', animated: true },
        },
      ],
    },
    {
      id: 'sec-stamps',
      secNum: '08',
      title: 'Stamps, Hashes & 1D Barcodes',
      eyebrow: 'CRYPTOGRAPHIC CODES & SEALS',
      description: 'Miniature 1D Code-128 tactical asset barcodes, cryptographic hex stamps, and 45° security seals.',
      items: [
        {
          preset: 'barcode-mini',
          compName: 'MicroStamp',
          title: '1D Asset Barcode',
          variant: 'barcode',
          dims: '32×32',
          desc: 'Miniature 1D Code-128 tactical asset barcode with alphanumeric serial stamp and boundary brackets.',
          category: 'stamps',
          props: { preset: 'barcode-mini', animated: true },
        },
        {
          preset: 'hash-stamp',
          compName: 'MicroStamp',
          title: 'Cryptographic Hex Stamp',
          variant: 'hash-tag',
          dims: '32×32',
          desc: 'Cryptographic hex verification stamp pill with checksum hash, status indicators, and validation seal.',
          category: 'stamps',
          props: { preset: 'hash-stamp', animated: true },
        },
        {
          preset: 'tactical-seal',
          compName: 'MicroStamp',
          title: 'Tactical Security Seal',
          variant: 'seal',
          dims: '32×32',
          desc: '45° chamfered technical security seal badge with military-grade authorization markings and validation hash.',
          category: 'stamps',
          props: { preset: 'tactical-seal', animated: true },
        },
      ],
    },
    {
      id: 'sec-clusters',
      secNum: '09',
      title: 'Composed Tactical Clusters',
      eyebrow: 'TURNKEY ASSEMBLED MODULES',
      description: 'Turnkey assembled HUD telemetry modules combining 3 to 6 micro-elements in unified tactical housings.',
      items: [
        {
          preset: 'sensor-lock',
          compName: 'MicroCluster',
          title: 'Sensor Lock Cluster',
          dims: '160×48',
          desc: 'Target acquisition HUD combining targeting crosshair, compass dial, 4x4 matrix, and azimuth coordinates.',
          category: 'clusters',
          props: { preset: 'sensor-lock', animated: true },
        },
        {
          preset: 'node-health',
          compName: 'MicroCluster',
          title: 'Node Health Cluster',
          dims: '160×48',
          desc: 'Telemetry health cluster combining quantized power gauge, system status tag, telemetry matrix, and hardware serial.',
          category: 'clusters',
          props: { preset: 'node-health', animated: true },
        },
        {
          preset: 'frequency-diag',
          compName: 'MicroCluster',
          title: 'Frequency RF Diagnostics',
          dims: '160×48',
          desc: 'Audio/RF diagnostics cluster combining waveform equalizer, circular frequency dial, Katakana label, and hex hash.',
          category: 'clusters',
          props: { preset: 'frequency-diag', animated: true },
        },
        {
          preset: 'terminal-header',
          compName: 'MicroCluster',
          title: 'Terminal HUD Banner',
          dims: '160×48',
          desc: 'HUD terminal banner combining caliper ruler, corner brackets, node status badge, and miniature barcode.',
          category: 'clusters',
          props: { preset: 'terminal-header', animated: true },
        },
        {
          preset: 'orbital-relay',
          compName: 'MicroCluster',
          title: 'Orbital Satellite Cluster',
          dims: '160×48',
          desc: 'Satellite telemetry cluster combining planar constellation graph, network latency tag, and signal beacon.',
          category: 'clusters',
          props: { preset: 'orbital-relay', animated: true },
        },
        {
          preset: 'power-module',
          compName: 'MicroCluster',
          title: 'Power Module Cluster',
          dims: '160×48',
          desc: 'Power cell cluster combining segmented dial, power bars, voltage readout, and caution warning indicator.',
          category: 'clusters',
          props: { preset: 'power-module', animated: true },
        },
        {
          preset: 'packet-analyzer',
          compName: 'MicroCluster',
          title: 'Packet Analyzer Cluster',
          dims: '160×48',
          desc: 'Network throughput cluster combining mirrored bandwidth stream, packet loss matrix, and diagnostic serial.',
          category: 'clusters',
          props: { preset: 'packet-analyzer', animated: true },
        },
        {
          preset: 'tactical-survey',
          compName: 'MicroCluster',
          title: 'Tactical Survey Cluster',
          dims: '160×48',
          desc: 'Sector reconnaissance cluster combining optical survey reticle, azimuth scale, coordinate tags, and ruler.',
          category: 'clusters',
          props: { preset: 'tactical-survey', animated: true },
        },
      ],
    },
  ];

  // Render each card and collect standalone SVG markup
  const cardsHtml = [];
  const templatesHtml = [];

  for (const section of SECTIONS) {
    let sectionCards = '';

    for (const item of section.items) {
      const comp = Micro[item.compName];
      if (!comp) {
        throw new Error(`Missing component: ${item.compName}`);
      }

      // Render React component static markup
      const element = React.createElement(comp, item.props);
      const renderedSvg = render(element);

      // Load standalone SVG from svg/micro/
      const svgFilePath = path.join(rootDir, 'svg', 'micro', item.category, `${item.preset}.svg`);
      let standaloneSvg = '';
      if (fs.existsSync(svgFilePath)) {
        standaloneSvg = fs.readFileSync(svgFilePath, 'utf8');
      } else {
        standaloneSvg = renderedSvg;
      }

      const cardId = `card-${item.category}-${item.preset}`;
      const templateIdSvg = `svg-${item.category}-${item.preset}`;

      // Store raw standalone SVG in <script type="text/plain"> tags for clean, direct text copying
      templatesHtml.push(
        `  <script type="text/plain" id="${templateIdSvg}">${standaloneSvg}</script>`
      );

      // Construct card HTML
      sectionCards += `
      <article class="micro-card" id="${cardId}" data-preset="${item.preset}" data-category="${item.category}">
        <div class="micro-card-header">
          <div class="micro-card-meta">
            <span class="micro-pill">[${item.preset.toUpperCase()}]</span>
            <span class="micro-dims">${item.dims}</span>
          </div>
          <h3 class="micro-card-title">&lt;${item.compName} preset="${item.preset}" /&gt;</h3>
        </div>

        <div class="micro-stage-well">
          <div class="micro-stage-viewport" data-preset-target="${item.preset}">
            ${renderedSvg}
          </div>
        </div>

        <div class="micro-card-body">
          <h4 class="micro-item-name">${item.title}</h4>
          <p class="micro-item-desc">${item.desc}</p>
        </div>

        <div class="micro-card-actions">
          <button class="ris-btn ris-btn--sm ris-btn--secondary btn-copy-svg" onclick="copySvg('${item.preset}', '${item.category}')" title="Copy standalone W3C SVG markup">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
            Copy SVG
          </button>
          <button class="ris-btn ris-btn--sm ris-btn--outline btn-copy-jsx" onclick="copyJsx('${item.preset}', '${item.compName}')" title="Copy React component JSX snippet">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
            Copy JSX
          </button>
        </div>
      </article>`;
    }

    // Section interactive controls banner
    let interactiveHeader = '';
    if (section.interactiveControl === 'dials') {
      interactiveHeader = `
      <div class="interactive-control-bar">
        <div class="control-label-group">
          <span class="control-indicator">LIVE SCRUBBER</span>
          <label for="dial-scrubber">Azimuth &amp; Bearing Angle Control (0°–360°):</label>
        </div>
        <div class="control-input-group">
          <input type="range" id="dial-scrubber" min="0" max="360" value="135" class="ris-range" oninput="updateDialAngle(this.value)">
          <span id="dial-angle-val" class="ris-tag-badge">135°</span>
        </div>
      </div>`;
    } else if (section.interactiveControl === 'matrices') {
      interactiveHeader = `
      <div class="interactive-control-bar">
        <div class="control-label-group">
          <span class="control-indicator">TACTILE GRID</span>
          <span>Click any matrix cell below to toggle active bitmask state:</span>
        </div>
        <div class="control-btn-group">
          <button class="ris-btn ris-btn--sm ris-btn--ghost" onclick="randomizeMatrices()">⚂ Randomize</button>
          <button class="ris-btn ris-btn--sm ris-btn--ghost" onclick="invertMatrices()">◧ Invert Grid</button>
          <button class="ris-btn ris-btn--sm ris-btn--ghost" onclick="clearMatrices()">✕ Clear All</button>
        </div>
      </div>`;
    } else if (section.interactiveControl === 'equalizers') {
      interactiveHeader = `
      <div class="interactive-control-bar">
        <div class="control-label-group">
          <span class="control-indicator">SIGNAL QUANTIZER</span>
          <label for="eq-amp-slider">Dynamic Amplitude &amp; Gain Scaler:</label>
        </div>
        <div class="control-input-group">
          <input type="range" id="eq-amp-slider" min="20" max="160" value="100" class="ris-range" oninput="updateEqualizerAmp(this.value)">
          <span id="eq-amp-val" class="ris-tag-badge">100%</span>
        </div>
      </div>`;
    }

    cardsHtml.push(`
    <section class="lab-section" id="${section.id}">
      <div class="section-header">
        <div class="section-title-wrap">
          <span class="ris-eyebrow" style="color:var(--ris-accent)">[ SEC.${section.secNum} // ${section.eyebrow} ]</span>
          <h2 class="section-title">${section.title}</h2>
        </div>
        <p class="section-desc">${section.description}</p>
      </div>

      ${interactiveHeader}

      <div class="micro-grid">
        ${sectionCards}
      </div>
    </section>`);
  }

  // Generate full HTML page
  const fullHtml = `<!DOCTYPE html>
<html lang="en" data-theme="dark" data-brand="relic" data-skin="cyber">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>RIS v2 — Micro-UI &amp; Telemetry Graphics Laboratory</title>
<link rel="stylesheet" href="css/ris-tokens.css">
<link rel="stylesheet" href="css/ris.css">
<link rel="stylesheet" href="css/ris-fx.css">
<link rel="stylesheet" href="css/ris-skin-cyber.css">
<link rel="stylesheet" href="css/ris-micro.css">
<style>
  :root {
    --ease-snap: cubic-bezier(0.16, 1, 0.3, 1);
    --ease-out: cubic-bezier(0.22, 1, 0.36, 1);
    --hud-bg-well: #070a0d;
    --hud-border-well: #1d2730;
    --hud-radar-line: #1c2a36;
  }

  :root[data-theme="light"] {
    --hud-bg-well: #e5eaed;
    --hud-border-well: #9baab5;
    --hud-radar-line: #cad5dc;
  }

  /* Specimen Shell & Layout */
  .lab-shell {
    max-width: 1280px;
    margin: 0 auto;
    padding: 80px 24px 100px;
  }

  /* Topbar Extension */
  .ris-topbar {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 0 20px;
    height: 56px;
    background: color-mix(in srgb, var(--ris-surface-1) 94%, transparent);
    backdrop-filter: blur(8px);
    border-bottom: 1px solid var(--ris-line);
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 100;
  }

  .topbar-brand-title {
    font-family: var(--ris-font-mono);
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.1em;
    color: var(--ris-accent);
    display: flex;
    align-items: center;
    gap: 8px;
    white-space: nowrap;
  }

  .topbar-nav {
    display: flex;
    gap: 8px;
    align-items: center;
  }

  .topbar-controls {
    margin-left: auto;
    display: flex;
    gap: 8px;
    align-items: center;
  }

  .brand-btn-group {
    display: flex;
    gap: 4px;
    background: var(--ris-surface-2);
    padding: 2px;
    border: 1px solid var(--ris-line);
    clip-path: polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px));
  }

  .brand-btn {
    font-family: var(--ris-font-mono);
    font-size: 9px;
    font-weight: 700;
    padding: 3px 8px;
    background: transparent;
    border: 1px solid transparent;
    color: var(--ris-fg3);
    cursor: pointer;
    text-transform: uppercase;
    transition: all 120ms var(--ease-snap);
  }

  .brand-btn:hover {
    color: var(--ris-fg1);
  }

  .brand-btn.active {
    background: var(--ris-accent-glow);
    border-color: var(--ris-accent);
    color: var(--ris-accent);
    box-shadow: 0 0 6px var(--ris-accent-glow);
  }

  /* Hero Section */
  .hero-banner {
    background: var(--ris-surface-1);
    border: 1px solid var(--ris-line);
    border-left: 4px solid var(--ris-accent);
    padding: 28px 32px;
    margin-top: 20px;
    margin-bottom: 24px;
    clip-path: polygon(0 0, calc(100% - 18px) 0, 100% 18px, 100% 100%, 0 100%);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  }

  .hero-banner h1 {
    margin: 6px 0 12px;
    font-size: 26px;
    letter-spacing: var(--ris-track-wide);
    font-family: var(--ris-font-heading, sans-serif);
    color: var(--ris-fg1);
  }

  .hero-banner p {
    margin: 0;
    color: var(--ris-fg2);
    font-size: 13.5px;
    line-height: 1.6;
    max-width: 960px;
  }

  /* Commercial Polar CTA Banner */
  .commercial-banner {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    background: linear-gradient(135deg, color-mix(in srgb, var(--ris-accent-glow) 30%, var(--ris-surface-1)), var(--ris-surface-1));
    border: 1.5px solid var(--ris-accent);
    padding: 20px 24px;
    margin-bottom: 36px;
    clip-path: polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px));
    box-shadow: 0 6px 24px rgba(0, 0, 0, 0.3), 0 0 16px var(--ris-accent-glow);
  }

  .banner-left {
    flex: 1 1 500px;
  }

  .banner-pill {
    display: inline-block;
    font-family: var(--ris-font-mono);
    font-size: 10px;
    font-weight: 700;
    color: var(--ris-accent);
    letter-spacing: 0.12em;
    margin-bottom: 6px;
  }

  .banner-title {
    margin: 0 0 6px;
    font-size: 18px;
    font-weight: 700;
    color: var(--ris-fg1);
  }

  .banner-desc {
    margin: 0;
    font-size: 12.5px;
    color: var(--ris-fg2);
    line-height: 1.5;
  }

  .banner-cta {
    font-family: var(--ris-font-mono);
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.08em;
    padding: 10px 20px;
    white-space: nowrap;
    text-decoration: none;
    border: 1px solid var(--ris-accent);
    background: var(--ris-accent);
    color: #0a0a0c !important;
    clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px));
    box-shadow: 0 0 12px var(--ris-accent-glow);
    transition: transform 80ms var(--ease-snap), box-shadow 120ms var(--ease-snap);
  }

  .banner-cta:hover {
    transform: translateY(-1px);
    box-shadow: 0 0 18px var(--ris-accent);
  }

  /* Quick Category Navigation Bar */
  .category-nav-bar {
    display: flex;
    align-items: center;
    gap: 8px;
    overflow-x: auto;
    padding: 10px 14px;
    margin-bottom: 40px;
    background: var(--ris-surface-2);
    border: 1px solid var(--ris-line);
    scrollbar-width: thin;
  }

  .category-nav-link {
    font-family: var(--ris-font-mono);
    font-size: 10.5px;
    color: var(--ris-fg3);
    text-decoration: none;
    padding: 4px 10px;
    white-space: nowrap;
    border: 1px solid transparent;
    transition: all 120ms var(--ease-snap);
  }

  .category-nav-link:hover {
    color: var(--ris-accent);
    background: var(--ris-surface-3);
    border-color: var(--ris-accent-line);
  }

  /* Section Styles */
  .lab-section {
    margin-bottom: 64px;
  }

  .section-header {
    margin-bottom: 16px;
  }

  .section-title-wrap {
    display: flex;
    align-items: baseline;
    gap: 12px;
    margin-bottom: 4px;
  }

  .section-title {
    margin: 0;
    font-size: 20px;
    font-family: var(--ris-font-heading, sans-serif);
    color: var(--ris-fg1);
    letter-spacing: var(--ris-track-wide);
  }

  .section-desc {
    margin: 0;
    font-size: 13px;
    color: var(--ris-fg2);
    max-width: 820px;
  }

  /* Interactive Control Bar */
  .interactive-control-bar {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 10px 16px;
    background: var(--ris-surface-2);
    border: 1px solid var(--ris-line-strong);
    margin-bottom: 20px;
    clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%);
  }

  .control-label-group {
    display: flex;
    align-items: center;
    gap: 10px;
    font-family: var(--ris-font-mono);
    font-size: 11px;
    color: var(--ris-fg1);
  }

  .control-indicator {
    padding: 2px 6px;
    background: var(--ris-accent-glow);
    border: 1px solid var(--ris-accent);
    color: var(--ris-accent);
    font-weight: 700;
    font-size: 9.5px;
    letter-spacing: 0.08em;
  }

  .control-input-group {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .control-btn-group {
    display: flex;
    gap: 6px;
  }

  .ris-range {
    cursor: pointer;
    accent-color: var(--ris-accent);
    height: 6px;
  }

  .ris-tag-badge {
    font-family: var(--ris-font-mono);
    font-size: 11px;
    font-weight: 700;
    padding: 2px 8px;
    background: var(--ris-surface-1);
    border: 1px solid var(--ris-accent);
    color: var(--ris-accent);
    min-width: 44px;
    text-align: center;
  }

  /* Responsive Cards Grid */
  .micro-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 18px;
  }

  /* Micro Card */
  .micro-card {
    background: var(--ris-surface-1);
    border: 1px solid var(--ris-line);
    clip-path: polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 0 100%);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    transition: border-color 140ms var(--ease-snap), transform 140ms var(--ease-snap);
  }

  .micro-card:hover {
    border-color: var(--ris-accent-line);
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  }

  .micro-card-header {
    padding: 12px 14px 8px;
    border-bottom: 1px solid var(--ris-line-faint);
  }

  .micro-card-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 4px;
  }

  .micro-pill {
    font-family: var(--ris-font-mono);
    font-size: 9.5px;
    color: var(--ris-accent);
    letter-spacing: 0.08em;
    font-weight: 700;
  }

  .micro-dims {
    font-family: var(--ris-font-mono);
    font-size: 9.5px;
    color: var(--ris-fg3);
  }

  .micro-card-title {
    margin: 0;
    font-family: var(--ris-font-mono);
    font-size: 11.5px;
    color: var(--ris-fg1);
    font-weight: 600;
  }

  /* Stage Viewport (inspection well) */
  .micro-stage-well {
    padding: 14px;
    background: var(--ris-surface-2);
    border-top: 1px solid var(--ris-line-faint);
    border-bottom: 1px solid var(--ris-line-faint);
  }

  .micro-stage-viewport {
    background: var(--hud-bg-well);
    border: 1px solid var(--hud-border-well);
    min-height: 88px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    padding: 14px;
    clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%);
    background-image:
      linear-gradient(var(--hud-radar-line) 1px, transparent 1px),
      linear-gradient(90deg, var(--hud-radar-line) 1px, transparent 1px);
    background-size: 16px 16px;
    color: var(--ris-accent);
    overflow: hidden;
  }

  .micro-stage-viewport svg {
    max-width: 100%;
    height: auto;
  }

  .micro-card-body {
    padding: 12px 14px 10px;
    flex: 1;
  }

  .micro-item-name {
    margin: 0 0 6px;
    font-size: 12.5px;
    font-weight: 600;
    color: var(--ris-fg1);
  }

  .micro-item-desc {
    margin: 0;
    font-size: 11.5px;
    color: var(--ris-fg3);
    line-height: 1.5;
  }

  .micro-card-actions {
    padding: 10px 14px;
    border-top: 1px solid var(--ris-line-faint);
    background: var(--ris-surface-2);
    display: flex;
    gap: 8px;
  }

  .micro-card-actions .ris-btn {
    flex: 1;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    font-family: var(--ris-font-mono);
    font-size: 10px;
  }

  /* Matrix Interactive Cell Cursor */
  #sec-matrices .micro-stage-viewport circle,
  #sec-matrices .micro-stage-viewport rect,
  #sec-matrices .micro-stage-viewport g[opacity] {
    cursor: pointer;
    pointer-events: all;
    transition: opacity 80ms var(--ease-snap);
  }

  #sec-matrices .micro-stage-viewport circle:hover,
  #sec-matrices .micro-stage-viewport rect:hover {
    filter: drop-shadow(0 0 3px var(--ris-accent));
  }

  /* Tactical Sonner-Style HUD Toast Container */
  .tactical-toast-container {
    position: fixed;
    bottom: 24px;
    right: 24px;
    z-index: 10000;
    display: flex;
    flex-direction: column;
    gap: 8px;
    pointer-events: none;
    max-width: 360px;
  }

  .tactical-toast {
    pointer-events: auto;
    font-family: var(--ris-font-mono);
    font-size: 11px;
    color: var(--ris-fg1);
    background: var(--ris-surface-1);
    border: 1px solid var(--ris-accent);
    padding: 10px 16px;
    clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px));
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5), 0 0 12px var(--ris-accent-glow);
    display: flex;
    align-items: center;
    gap: 10px;
    transform: translateY(16px) scale(0.96);
    opacity: 0;
    transition: transform 240ms var(--ease-snap), opacity 240ms var(--ease-snap);
  }

  .tactical-toast.active {
    transform: translateY(0) scale(1);
    opacity: 1;
  }

  .tactical-toast.exit {
    transform: translateY(-8px) scale(0.96);
    opacity: 0;
    transition: transform 180ms var(--ease-out), opacity 180ms var(--ease-out);
  }

  .toast-prefix {
    color: var(--ris-accent);
    font-weight: 700;
  }

  .toast-icon {
    color: var(--ris-green);
  }

  /* Mobile OLED Safety & Breakpoints */
  @media (max-width: 768px) {
    .lab-shell {
      padding: 70px 14px 80px;
    }

    .ris-topbar {
      gap: 6px;
      padding: 0 10px;
    }

    .topbar-brand-title {
      max-width: 140px;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .topbar-nav {
      display: none;
    }

    .brand-btn {
      padding: 2px 5px;
      font-size: 8.5px;
    }

    .commercial-banner {
      flex-direction: column;
      align-items: flex-start;
    }

    .banner-cta {
      width: 100%;
      text-align: center;
    }

    .micro-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
</head>
<body class="ris ris-grid-bg">
<a class="ris-skip-nav" href="#main">Skip to main content</a>

<!-- Topbar Navigation & Controls -->
<header class="ris-topbar">
  <div class="topbar-brand-title">
    <span style="color:var(--ris-accent)">◈</span>
    <span>RIS v2 — Micro-UI &amp; Telemetry Graphics Laboratory</span>
  </div>

  <nav class="topbar-nav" aria-label="Main Navigation">
    <a href="index.html" class="ris-btn ris-btn--sm ris-btn--outline" style="text-decoration:none">🌐 Main Specimen</a>
    <a href="motion-lab.html" class="ris-btn ris-btn--sm ris-btn--outline" style="text-decoration:none">⚡ Motion Lab</a>
    <a href="mobile.html" class="ris-btn ris-btn--sm ris-btn--outline" style="text-decoration:none">📱 Mobile HUD</a>
  </nav>

  <div class="topbar-controls">
    <!-- Brand Switcher -->
    <div class="brand-btn-group" role="group" aria-label="Brand Selector">
      <button class="brand-btn active" data-brand="relic" onclick="setBrand('relic')">RELIC</button>
      <button class="brand-btn" data-brand="biohub" onclick="setBrand('biohub')">BIOHUB</button>
      <button class="brand-btn" data-brand="omnikon" onclick="setBrand('omnikon')">OMNIKON</button>
      <button class="brand-btn" data-brand="neutral" onclick="setBrand('neutral')">NEUTRAL</button>
    </div>

    <!-- Theme Switcher -->
    <button class="ris-btn ris-btn--sm ris-btn--primary" id="theme-btn" onclick="toggleTheme()" title="Toggle Dark HUD and Light Blueprint">
      ◐ THEME: DARK
    </button>

    <!-- Motion Engine Toggle -->
    <button class="ris-btn ris-btn--sm ris-btn--secondary" id="motion-btn" onclick="toggleMotion()" title="Toggle live 60fps telemetry simulation vs static vector export mode">
      ⚡ 60FPS LIVE
    </button>
  </div>
</header>

<main class="lab-shell" id="main">
  <!-- Hero Section -->
  <header class="hero-banner">
    <div class="ris-eyebrow" style="color:var(--ris-accent)">[ SYSTEM STANDARD // SPECIMEN 04 ]</div>
    <h1>Micro-UI &amp; Telemetry Graphics Laboratory</h1>
    <p>
      Explore the comprehensive, brutalist, tactical <strong>Micrographics &amp; Micro-UI Kit</strong> of the Relic Interface System.
      Featuring <strong>34 canonical specimens</strong> across 8 atomic families and composite tactical clusters.
      Every graphic is 100% zero-dependency SVG, responsive to live brand colors and light blueprint themes, with zero layout reflow hardware acceleration.
    </p>
  </header>

  <!-- Commercial CTA Banner -->
  <aside class="commercial-banner">
    <div class="banner-left">
      <span class="banner-pill">[ COMMERCIAL SKU // POLAR.SH ]</span>
      <h2 class="banner-title">Get the Full 150+ Vector Pack &amp; Figma Master — $24 Launch Offer</h2>
      <p class="banner-desc">Includes 150+ standalone SVGs, 70 composed tactical graphics, master .fig file with 4 brand modes, and turnkey React components.</p>
    </div>
    <a href="https://buy.polar.sh/polar_cl_gzshc6MZaGsQy6V3oqQ1U0uK3kIQ7mcGr0wf00JbLZn" target="_blank" rel="noopener" class="banner-cta">
      ★ Buy on Polar ($24)
    </a>
  </aside>

  <!-- Quick Category Jump Navigation -->
  <nav class="category-nav-bar" aria-label="Section Quick Jump">
    <span style="font-family:var(--ris-font-mono);font-size:10px;color:var(--ris-accent);font-weight:700;margin-right:6px">INDEX:</span>
    <a href="#sec-reticles" class="category-nav-link">01. Reticles</a>
    <a href="#sec-dials" class="category-nav-link">02. Dials</a>
    <a href="#sec-matrices" class="category-nav-link">03. Matrices</a>
    <a href="#sec-equalizers" class="category-nav-link">04. Equalizers</a>
    <a href="#sec-telemetry" class="category-nav-link">05. Telemetry</a>
    <a href="#sec-calipers" class="category-nav-link">06. Calipers</a>
    <a href="#sec-constellations" class="category-nav-link">07. Constellations</a>
    <a href="#sec-stamps" class="category-nav-link">08. Stamps</a>
    <a href="#sec-clusters" class="category-nav-link">09. Clusters</a>
  </nav>

  <!-- 9 Categorized Sections -->
  ${cardsHtml.join('\n')}
</main>

<!-- Hidden Templates for Clean Clipboard Copying -->
${templatesHtml.join('\n')}

<!-- Tactical Sonner-Style HUD Toast Notification Container -->
<div id="ris-toast-container" class="tactical-toast-container" aria-live="polite" aria-atomic="true"></div>

<!-- Laboratory Interactivity & Clipboard Script -->
<script>
  let currentBrand = 'relic';
  let hexSerialCounter = 0x7d0;

  // Geometry arc helper for real-time dial updates
  function describeArc(cx, cy, r, startAngle, endAngle) {
    const diff = endAngle - startAngle;
    if (Math.abs(diff) >= 359.9) {
      return 'M ' + (cx - r) + ' ' + cy + ' A ' + r + ' ' + r + ' 0 1 1 ' + (cx + r) + ' ' + cy + ' A ' + r + ' ' + r + ' 0 1 1 ' + (cx - r) + ' ' + cy;
    }
    const sRad = (startAngle * Math.PI) / 180;
    const eRad = (endAngle * Math.PI) / 180;
    const x1 = (cx + r * Math.cos(sRad)).toFixed(2);
    const y1 = (cy + r * Math.sin(sRad)).toFixed(2);
    const x2 = (cx + r * Math.cos(eRad)).toFixed(2);
    const y2 = (cy + r * Math.sin(eRad)).toFixed(2);
    const largeArc = Math.abs(diff) > 180 ? 1 : 0;
    const sweep = diff >= 0 ? 1 : 0;
    return 'M ' + x1 + ' ' + y1 + ' A ' + r + ' ' + r + ' 0 ' + largeArc + ' ' + sweep + ' ' + x2 + ' ' + y2;
  }

  // 1. BRAND SWITCHER
  function setBrand(brand) {
    currentBrand = brand;
    document.documentElement.setAttribute('data-brand', brand);
    document.querySelectorAll('.brand-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-brand') === brand);
    });
    showHudToast('Active brand switched to [' + brand.toUpperCase() + ']');
  }

  // 2. THEME SWITCHER
  function toggleTheme() {
    const html = document.documentElement;
    const current = html.getAttribute('data-theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);

    const btn = document.getElementById('theme-btn');
    if (btn) {
      btn.textContent = next === 'dark' ? '◐ THEME: DARK' : '☼ THEME: LIGHT';
    }
    showHudToast('Theme toggled to ' + (next === 'dark' ? 'Dark HUD' : 'Light Blueprint'));
  }

  // 3. MOTION ENGINE TOGGLE
  function toggleMotion() {
    const html = document.documentElement;
    const isStatic = html.getAttribute('data-motion') === 'static';
    const btn = document.getElementById('motion-btn');

    if (isStatic) {
      html.removeAttribute('data-motion');
      if (btn) {
        btn.textContent = '⚡ 60FPS LIVE';
        btn.classList.remove('ris-btn--danger');
        btn.classList.add('ris-btn--secondary');
      }
      showHudToast('Motion engine: Live Simulation (animated)');
    } else {
      html.setAttribute('data-motion', 'static');
      if (btn) {
        btn.textContent = '⏹ STATIC VECTORS';
        btn.classList.remove('ris-btn--secondary');
        btn.classList.add('ris-btn--danger');
      }
      showHudToast('Motion engine: Static Vector Preview (stopped)');
    }
  }

  // 4. INTERACTIVE DIAL ANGLE SCRUBBER
  function updateDialAngle(angle) {
    const valSpan = document.getElementById('dial-angle-val');
    if (valSpan) valSpan.textContent = angle + '°';

    const numAngle = parseFloat(angle);

    // Rotate compass needle
    const compassCard = document.getElementById('card-compass');
    if (compassCard) {
      const needle = compassCard.querySelector('g[style*="transform-origin"]');
      if (needle) {
        needle.setAttribute('transform', 'rotate(' + (numAngle - 90) + ' 16 16)');
      }
    }

    // Update frequency dial needle
    const freqCard = document.getElementById('card-frequency');
    if (freqCard) {
      const needle = freqCard.querySelector('g[style*="transform-origin"]');
      if (needle) {
        needle.style.animation = 'none';
        needle.setAttribute('transform', 'rotate(' + numAngle + ' 16 16)');
      }
    }

    // Update power gauge readout, arc path and tip pip
    const powerCard = document.getElementById('card-power-gauge');
    if (powerCard) {
      const pct = Math.round((numAngle / 360) * 100);
      const textVal = powerCard.querySelector('text[dominant-baseline="central"]');
      if (textVal) textVal.textContent = pct;

      const currentAngle = 135 + (pct / 100) * 270;
      const paths = powerCard.querySelectorAll('path');
      if (paths.length >= 2) {
        paths[1].setAttribute('d', describeArc(16, 16, 11.5, 135, currentAngle));
      }
      const pip = powerCard.querySelector('circle[r="1.75"]');
      if (pip) {
        const rad = (currentAngle * Math.PI) / 180;
        pip.setAttribute('cx', (16 + 11.5 * Math.cos(rad)).toFixed(2));
        pip.setAttribute('cy', (16 + 11.5 * Math.sin(rad)).toFixed(2));
      }
    }

    // Update azimuth-90 readout, arc path and tip pip
    const azCard = document.getElementById('card-azimuth-90');
    if (azCard) {
      const pct90 = Math.round((numAngle / 360) * 90);
      const textVal = azCard.querySelector('text[dominant-baseline="central"]');
      if (textVal) textVal.textContent = pct90;

      const currentAngle = -90 + (pct90 / 90) * 90;
      const paths = azCard.querySelectorAll('path');
      if (paths.length >= 2) {
        paths[1].setAttribute('d', describeArc(16, 16, 11.5, -90, currentAngle));
      }
      const pip = azCard.querySelector('circle[r="1.75"]');
      if (pip) {
        const rad = (currentAngle * Math.PI) / 180;
        pip.setAttribute('cx', (16 + 11.5 * Math.cos(rad)).toFixed(2));
        pip.setAttribute('cy', (16 + 11.5 * Math.sin(rad)).toFixed(2));
      }
    }
  }

  // 5. INTERACTIVE MATRIX CLICK-TO-TOGGLE
  document.addEventListener('DOMContentLoaded', () => {
    const matrixSec = document.getElementById('sec-matrices');
    if (matrixSec) {
      matrixSec.querySelectorAll('.micro-stage-viewport').forEach(vp => {
        vp.querySelectorAll('circle, rect, g[opacity]').forEach(cell => {
          cell.addEventListener('click', (e) => {
            e.stopPropagation();
            const currentOp = cell.getAttribute('opacity') || '1';
            const nextOp = parseFloat(currentOp) > 0.5 ? '0.2' : '1';
            cell.setAttribute('opacity', nextOp);
            showHudToast('Matrix cell bitmask toggled: ' + nextOp);
          });
        });
      });
    }
  });

  function randomizeMatrices() {
    const matrixSec = document.getElementById('sec-matrices');
    if (!matrixSec) return;
    matrixSec.querySelectorAll('circle, rect, g[opacity]').forEach(cell => {
      cell.setAttribute('opacity', Math.random() > 0.45 ? '1' : '0.2');
    });
    showHudToast('Matrix pattern randomized');
  }

  function invertMatrices() {
    const matrixSec = document.getElementById('sec-matrices');
    if (!matrixSec) return;
    matrixSec.querySelectorAll('circle, rect, g[opacity]').forEach(cell => {
      const op = cell.getAttribute('opacity') || '1';
      cell.setAttribute('opacity', parseFloat(op) > 0.5 ? '0.2' : '1');
    });
    showHudToast('Matrix bitmask inverted');
  }

  function clearMatrices() {
    const matrixSec = document.getElementById('sec-matrices');
    if (!matrixSec) return;
    matrixSec.querySelectorAll('circle, rect, g[opacity]').forEach(cell => {
      cell.setAttribute('opacity', '0.2');
    });
    showHudToast('Matrix cells cleared to standby');
  }

  // 6. INTERACTIVE EQUALIZER AMPLITUDE SLIDER
  function updateEqualizerAmp(val) {
    const valSpan = document.getElementById('eq-amp-val');
    if (valSpan) valSpan.textContent = val + '%';

    const eqSec = document.getElementById('sec-equalizers');
    if (!eqSec) return;

    const scale = parseFloat(val) / 100;
    eqSec.querySelectorAll('.micro-stage-viewport svg').forEach(svg => {
      svg.querySelectorAll('g[style*="transform-origin"]').forEach(bar => {
        bar.style.animation = 'none';
        bar.style.transform = 'scaleY(' + scale + ')';
      });
    });
  }

  // 7. COPY WORKFLOWS WITH SONNER-STYLE HUD TOAST
  async function copySvg(preset, category) {
    const namespacedId = category ? 'svg-' + category + '-' + preset : null;
    const scriptEl = (namespacedId && document.getElementById(namespacedId)) ||
                     document.getElementById('svg-' + preset);
    if (!scriptEl) return;

    let svgMarkup = scriptEl.textContent || scriptEl.innerText || '';

    // Apply current active brand color to copyable SVG
    const BRAND_HEX = {
      relic: '#e6a23c',
      biohub: '#6fb3c9',
      omnikon: '#ff2d3c',
      neutral: '#9d7cd8'
    };
    const activeHex = BRAND_HEX[currentBrand] || '#e6a23c';
    svgMarkup = svgMarkup.replace(/--ris-primary:\\s*#[0-9a-fA-F]+/g, '--ris-primary: ' + activeHex);
    svgMarkup = svgMarkup.replace(/color:\\s*#[0-9a-fA-F]+/g, 'color: ' + activeHex);
    svgMarkup = svgMarkup.replace(/color="[^"]*"/g, 'color="' + activeHex + '"');
    svgMarkup = svgMarkup.replaceAll('#e6a23c', activeHex).replaceAll('#E6A23C', activeHex);
    svgMarkup = svgMarkup.replace('data-brand="relic"', 'data-brand="' + currentBrand + '"');

    try {
      await navigator.clipboard.writeText(svgMarkup);
      showHudToast('SVG copied to clipboard');
    } catch (err) {
      fallbackCopy(svgMarkup);
      showHudToast('SVG copied to clipboard');
    }
  }

  async function copyJsx(preset, compName) {
    const snippet = '<' + compName + ' preset="' + preset + '" brand="' + currentBrand + '" />';
    try {
      await navigator.clipboard.writeText(snippet);
      showHudToast('JSX snippet copied to clipboard');
    } catch (err) {
      fallbackCopy(snippet);
      showHudToast('JSX snippet copied to clipboard');
    }
  }

  function fallbackCopy(text) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.left = '-9999px';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
  }

  // 8. TACTICAL SONNER-STYLE HUD TOAST NOTIFIER
  function showHudToast(message) {
    const container = document.getElementById('ris-toast-container');
    if (!container) return;

    hexSerialCounter++;
    const hex = '0x' + hexSerialCounter.toString(16).toUpperCase();

    const toast = document.createElement('div');
    toast.className = 'tactical-toast';
    toast.innerHTML = 
      '<span class="toast-icon">✓</span>' +
      '<span class="toast-prefix">[' + hex + ']</span>' +
      '<span>' + message + '</span>';

    container.appendChild(toast);

    // Enter animation (requestAnimationFrame)
    requestAnimationFrame(() => {
      toast.classList.add('active');
    });

    // Auto dismiss after 2400ms with smooth exit
    setTimeout(() => {
      toast.classList.remove('active');
      toast.classList.add('exit');
      setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 200);
    }, 2400);
  }
</script>
</body>
</html>
`;

  // Write to docs/micro-ui.html
  const targetPath = path.join(rootDir, 'docs', 'micro-ui.html');
  fs.writeFileSync(targetPath, fullHtml, 'utf8');

  console.log(`>>> Successfully created docs/micro-ui.html (${(fullHtml.length / 1024).toFixed(1)} KB)`);
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

main().catch(err => {
  console.error('Fatal error generating docs/micro-ui.html:', err);
  process.exit(1);
});

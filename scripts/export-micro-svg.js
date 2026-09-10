#!/usr/bin/env node

/**
 * RELIC INTERFACE SYSTEM (RIS v2)
 * Standalone Micro-UI SVG Vector Export Pipeline
 *
 * Renders all 8 atomic micro-components with presets/variants and all 8 <MicroCluster> presets
 * to standalone, W3C-compliant, production-grade SVG files ready for Figma, Adobe Illustrator,
 * and direct browser/web consumption without external CSS dependencies.
 */

const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');

// Primary RIS brand color tokens
const BRAND_COLORS = {
  relic: '#e6a23c',
  biohub: '#6fb3c9',
  omnikon: '#ff2d3c',
  neutral: '#9d7cd8',
};

const STATUS_COLORS = {
  nominal: '#5fae84',
  active: '#e6a23c',
  warning: '#e6a23c',
  critical: '#d45565',
  idle: '#97a4ad',
};

/**
 * Converts React static markup into a standalone W3C-compliant SVG.
 * Ensures xmlns, explicit viewBox, explicit width/height, embedded CSS variables,
 * clean strokes, and standalone color fallbacks for Figma/Illustrator.
 */
function buildSvg(rawSvg, primaryColor = '#e6a23c') {
  let svg = rawSvg;

  // 1. Ensure xmlns namespace on root <svg>
  if (!svg.includes('xmlns="http://www.w3.org/2000/svg"')) {
    svg = svg.replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" ');
  }

  // 2. Add color presentation attribute to root <svg>
  if (!svg.includes('color=')) {
    svg = svg.replace('<svg ', `<svg color="${primaryColor}" `);
  }

  // 3. Resolve CSS variable references to concrete fallback values for vector tools
  svg = svg.replace(/var\(--ris-font-mono,\s*[^)]+\)/g, "'JetBrains Mono', monospace");
  svg = svg.replace(/var\(--ris-[a-zA-Z0-9_-]+,\s*([^)]+)\)/g, (match, fallback) => fallback.trim());

  // 4. Clean up inline style: strip web flexbox properties and normalize colors
  svg = svg.replace(/style="([^"]*)"/g, (match, styleContent) => {
    let parts = styleContent
      .split(';')
      .map(s => s.trim())
      .filter(s => s && !s.startsWith('flex-shrink'));

    if (!parts.some(s => s.startsWith('color:'))) {
      parts.unshift(`color: ${primaryColor}`);
    } else {
      parts = parts.map(s => (s.startsWith('color:') ? `color: ${primaryColor}` : s));
    }
    if (!parts.some(s => s.startsWith('overflow:'))) {
      parts.push('overflow: visible');
    }
    return `style="${parts.join('; ')};"`;
  });

  // 5. Replace currentColor with concrete color for vector tools that lack CSS cascade
  svg = svg.replace(/"currentColor"/g, `"${primaryColor}"`);

  // 6. Convert empty paired tags (<path ...></path>, <line ...></line>, etc.) to self-closing (<path ... />)
  const selfClosingElements = 'path|line|circle|rect|polygon|polyline|ellipse|stop|use';
  const emptyTagRegex = new RegExp(`<(${selfClosingElements})([^>]*?)><\\/\\1>`, 'g');
  svg = svg.replace(emptyTagRegex, '<$1$2 />');

  // 7. Extract root <svg ...> opening tag and content
  const rootMatch = svg.match(/^<svg\b[^>]*>/);
  if (!rootMatch) return svg;

  const rootOpenTag = rootMatch[0];
  const innerContent = svg.slice(rootOpenTag.length, svg.lastIndexOf('</svg>'));

  // 8. Prettify inner content
  const lines = [rootOpenTag];

  // Add <defs><style>...</style></defs> with standard RIS theme variables
  lines.push('  <defs>');
  lines.push('    <style>');
  lines.push('      :root, svg {');
  lines.push(`        --ris-primary: ${primaryColor};`);
  lines.push('        --ris-accent: #e6a23c;');
  lines.push('        --ris-yellow: #e6a23c;');
  lines.push('        --ris-cyan: #6fb3c9;');
  lines.push('        --ris-green: #5fae84;');
  lines.push('        --ris-red: #d45565;');
  lines.push('        --ris-violet: #8479be;');
  lines.push('        --ris-fg4: #97a4ad;');
  lines.push('        --ris-bg: #0a0a0c;');
  lines.push('        --ris-line: rgba(230, 162, 60, 0.4);');
  lines.push("        --ris-font-mono: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;");
  lines.push(`        color: ${primaryColor};`);
  lines.push("        font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;");
  lines.push('      }');
  lines.push('    </style>');
  lines.push('  </defs>');

  // Tokenize and indent innerContent
  const tokens = innerContent.replace(/>\s*</g, '>~~~<').split('~~~');
  let indentLevel = 1;

  for (let token of tokens) {
    token = token.trim();
    if (!token) continue;

    if (token.startsWith('</')) {
      indentLevel = Math.max(1, indentLevel - 1);
      lines.push('  '.repeat(indentLevel) + token);
    } else if (token.startsWith('<text') && token.includes('</text>')) {
      lines.push('  '.repeat(indentLevel) + token);
    } else if (token.endsWith('/>')) {
      lines.push('  '.repeat(indentLevel) + token);
    } else if (token.startsWith('<')) {
      lines.push('  '.repeat(indentLevel) + token);
      indentLevel++;
    } else {
      lines.push('  '.repeat(indentLevel) + token);
    }
  }

  lines.push('</svg>');
  return lines.join('\n') + '\n';
}

/**
 * Validates basic XML structure and required SVG attributes.
 */
function validateSvg(svgContent, filename) {
  if (!svgContent.startsWith('<svg')) {
    throw new Error(`[${filename}] Does not start with <svg tag`);
  }
  if (!svgContent.trim().endsWith('</svg>')) {
    throw new Error(`[${filename}] Does not end with </svg> tag`);
  }
  if (!svgContent.includes('xmlns="http://www.w3.org/2000/svg"')) {
    throw new Error(`[${filename}] Missing xmlns="http://www.w3.org/2000/svg"`);
  }
  if (!svgContent.includes('viewBox=')) {
    throw new Error(`[${filename}] Missing viewBox attribute`);
  }
  if (!svgContent.includes('width=') || !svgContent.includes('height=')) {
    throw new Error(`[${filename}] Missing width or height attribute`);
  }
}

async function main() {
  const rootDir = path.resolve(__dirname, '..');
  const svgOutputDir = path.join(rootDir, 'svg', 'micro');

  console.log('>>> [RIS v2] Starting Micro-UI SVG Vector Export Pipeline...');

  // Resolve dependencies
  let React, ReactDOMServer, Micro;
  try {
    const reactPath = path.join(rootDir, 'react', 'node_modules', 'react', 'index.js');
    const reactDomPath = path.join(rootDir, 'react', 'node_modules', 'react-dom', 'server.node.js');
    const distPath = path.join(rootDir, 'react', 'dist', 'index.js');

    if (!fs.existsSync(distPath)) {
      throw new Error(`React dist not found at ${distPath}. Run "cd react && npm run build" first.`);
    }

    React = await import(pathToFileURL(reactPath).href);
    ReactDOMServer = await import(pathToFileURL(reactDomPath).href);
    Micro = await import(pathToFileURL(distPath).href);
  } catch (err) {
    console.error('Failed to load React or @relic-ui/react:', err.message);
    process.exit(1);
  }

  const render = (ReactDOMServer.default || ReactDOMServer).renderToStaticMarkup;

  // Manifest of all 34 canonical SVG exports across 9 categories
  const manifest = [
    // 1. Reticles
    {
      category: 'reticles',
      filename: 'target-lock.svg',
      component: Micro.MicroReticle,
      props: { preset: 'target-lock', brand: 'relic' },
      color: BRAND_COLORS.relic,
      description: 'Optic target lock with 45° chamfered diamond & cardinal ticks',
    },
    {
      category: 'reticles',
      filename: 'corner-bracket.svg',
      component: Micro.MicroReticle,
      props: { preset: 'corner-bracket', brand: 'relic' },
      color: BRAND_COLORS.relic,
      description: 'HUD corner alignment bracket with bounding markers',
    },
    {
      category: 'reticles',
      filename: 'optic-grid.svg',
      component: Micro.MicroReticle,
      props: { preset: 'optic-grid', brand: 'relic' },
      color: BRAND_COLORS.relic,
      description: 'Optical survey reticle with angular bearing graduation ticks',
    },

    // 2. Dials
    {
      category: 'dials',
      filename: 'frequency.svg',
      component: Micro.MicroDial,
      props: { preset: 'frequency', brand: 'relic' },
      color: BRAND_COLORS.relic,
      description: 'Segmented circular frequency band dial',
    },
    {
      category: 'dials',
      filename: 'power-gauge.svg',
      component: Micro.MicroDial,
      props: { preset: 'power-gauge', brand: 'relic' },
      color: BRAND_COLORS.relic,
      description: 'Quantized arc power gauge with percent readout',
    },
    {
      category: 'dials',
      filename: 'compass.svg',
      component: Micro.MicroDial,
      props: { preset: 'compass', brand: 'relic' },
      color: BRAND_COLORS.relic,
      description: '360° radial azimuth compass with cardinal markers',
    },
    {
      category: 'dials',
      filename: 'azimuth-90.svg',
      component: Micro.MicroDial,
      props: { preset: 'azimuth-90', brand: 'relic' },
      color: BRAND_COLORS.relic,
      description: '90° quadrant sweep needle gauge',
    },

    // 3. Matrices
    {
      category: 'matrices',
      filename: 'led-4x4.svg',
      component: Micro.MicroMatrix,
      props: { preset: 'led-4x4', brand: 'relic' },
      color: BRAND_COLORS.relic,
      description: '4x4 discrete LED telemetry dot matrix',
    },
    {
      category: 'matrices',
      filename: 'binary-status.svg',
      component: Micro.MicroMatrix,
      props: { preset: 'binary-status', brand: 'relic' },
      color: BRAND_COLORS.relic,
      description: 'Dense 4x4 binary status block grid',
    },
    {
      category: 'matrices',
      filename: 'cross-grid.svg',
      component: Micro.MicroMatrix,
      props: { preset: 'cross-grid', brand: 'relic' },
      color: BRAND_COLORS.relic,
      description: 'Crosshair reticle matrix pattern field',
    },
    {
      category: 'matrices',
      filename: 'status-3x3.svg',
      component: Micro.MicroMatrix,
      props: { preset: 'status-3x3', brand: 'relic' },
      color: BRAND_COLORS.relic,
      description: 'Compact 3x3 optical status indicator array',
    },

    // 4. Equalizers
    {
      category: 'equalizers',
      filename: 'audio-signal.svg',
      component: Micro.MicroEqualizer,
      props: { preset: 'audio-signal', brand: 'relic' },
      color: BRAND_COLORS.relic,
      description: 'Waveform audio signal bar visualizer',
    },
    {
      category: 'equalizers',
      filename: 'packet-stream.svg',
      component: Micro.MicroEqualizer,
      props: { preset: 'packet-stream', brand: 'relic' },
      color: BRAND_COLORS.relic,
      description: 'Discrete quantized packet throughput meter',
    },
    {
      category: 'equalizers',
      filename: 'bandwidth.svg',
      component: Micro.MicroEqualizer,
      props: { preset: 'bandwidth', brand: 'relic' },
      color: BRAND_COLORS.relic,
      description: 'Mirrored bi-directional bandwidth channel equalizer',
    },

    // 5. Telemetry
    {
      category: 'telemetry',
      filename: 'node-status.svg',
      component: Micro.MicroTelemetry,
      props: { preset: 'node-status', brand: 'relic' },
      color: STATUS_COLORS.nominal,
      description: 'Framed [ONLINE] node telemetry badge with Katakana accent',
    },
    {
      category: 'telemetry',
      filename: 'system-reset.svg',
      component: Micro.MicroTelemetry,
      props: { preset: 'system-reset', brand: 'relic' },
      color: STATUS_COLORS.active,
      description: 'Stacked SYS-RST telemetry block with graduation ticks',
    },
    {
      category: 'telemetry',
      filename: 'epoch-diag.svg',
      component: Micro.MicroTelemetry,
      props: { preset: 'epoch-diag', brand: 'relic' },
      color: STATUS_COLORS.nominal,
      description: 'Inline horizontal EPOCH diagnostic telemetry strip',
    },

    // 6. Calipers
    {
      category: 'calipers',
      filename: 'ruler-100.svg',
      component: Micro.MicroCaliper,
      props: { preset: 'ruler-100', brand: 'relic' },
      color: BRAND_COLORS.relic,
      description: '100px graduated millimeter measurement ruler',
    },
    {
      category: 'calipers',
      filename: 'bracket-caliper.svg',
      component: Micro.MicroCaliper,
      props: { preset: 'bracket-caliper', brand: 'relic' },
      color: BRAND_COLORS.relic,
      description: '45° chamfered spatial caliper bounding bracket',
    },
    {
      category: 'calipers',
      filename: 'leader-45.svg',
      component: Micro.MicroCaliper,
      props: { preset: 'leader-45', brand: 'relic' },
      color: BRAND_COLORS.relic,
      description: '45° dogleg technical annotation leader line',
    },

    // 7. Constellations
    {
      category: 'constellations',
      filename: 'network-3node.svg',
      component: Micro.MicroConstellation,
      props: { preset: 'network-3node', brand: 'relic' },
      color: BRAND_COLORS.relic,
      description: 'Triangular 3-node planar mesh network graph',
    },
    {
      category: 'constellations',
      filename: 'orbital-relay.svg',
      component: Micro.MicroConstellation,
      props: { preset: 'orbital-relay', brand: 'relic' },
      color: BRAND_COLORS.relic,
      description: 'Central hub orbital relay constellation',
    },
    {
      category: 'constellations',
      filename: 'signal-tree.svg',
      component: Micro.MicroConstellation,
      props: { preset: 'signal-tree', brand: 'relic' },
      color: BRAND_COLORS.relic,
      description: 'Hierarchical downlink signal tree schema',
    },

    // 8. Stamps
    {
      category: 'stamps',
      filename: 'barcode-mini.svg',
      component: Micro.MicroStamp,
      props: { preset: 'barcode-mini', brand: 'relic' },
      color: BRAND_COLORS.relic,
      description: 'Miniature 1D Code-128 tactical asset barcode',
    },
    {
      category: 'stamps',
      filename: 'hash-stamp.svg',
      component: Micro.MicroStamp,
      props: { preset: 'hash-stamp', brand: 'relic' },
      color: BRAND_COLORS.relic,
      description: 'Cryptographic hex verification stamp pill',
    },
    {
      category: 'stamps',
      filename: 'tactical-seal.svg',
      component: Micro.MicroStamp,
      props: { preset: 'tactical-seal', brand: 'relic' },
      color: BRAND_COLORS.relic,
      description: '45° chamfered technical security seal badge',
    },

    // 9. Clusters
    {
      category: 'clusters',
      filename: 'sensor-lock.svg',
      component: Micro.MicroCluster,
      props: { preset: 'sensor-lock', brand: 'relic' },
      color: BRAND_COLORS.relic,
      description: 'Turnkey target acquisition HUD cluster with compass & matrix',
    },
    {
      category: 'clusters',
      filename: 'node-health.svg',
      component: Micro.MicroCluster,
      props: { preset: 'node-health', brand: 'relic' },
      color: BRAND_COLORS.relic,
      description: 'Turnkey telemetry health cluster with power gauge & serial',
    },
    {
      category: 'clusters',
      filename: 'frequency-diag.svg',
      component: Micro.MicroCluster,
      props: { preset: 'frequency-diag', brand: 'relic' },
      color: BRAND_COLORS.relic,
      description: 'Turnkey audio/RF diagnostics cluster with equalizer & dial',
    },
    {
      category: 'clusters',
      filename: 'terminal-header.svg',
      component: Micro.MicroCluster,
      props: { preset: 'terminal-header', brand: 'relic' },
      color: BRAND_COLORS.relic,
      description: 'Turnkey HUD terminal banner with caliper ruler & mini-barcode',
    },
    {
      category: 'clusters',
      filename: 'orbital-relay.svg',
      component: Micro.MicroCluster,
      props: { preset: 'orbital-relay', brand: 'relic' },
      color: BRAND_COLORS.relic,
      description: 'Turnkey satellite telemetry cluster with constellation graph',
    },
    {
      category: 'clusters',
      filename: 'power-module.svg',
      component: Micro.MicroCluster,
      props: { preset: 'power-module', brand: 'relic' },
      color: BRAND_COLORS.relic,
      description: 'Turnkey power cell cluster with segmented dial & power bars',
    },
    {
      category: 'clusters',
      filename: 'packet-analyzer.svg',
      component: Micro.MicroCluster,
      props: { preset: 'packet-analyzer', brand: 'relic' },
      color: BRAND_COLORS.relic,
      description: 'Turnkey network throughput cluster with bandwidth stream & matrix',
    },
    {
      category: 'clusters',
      filename: 'tactical-survey.svg',
      component: Micro.MicroCluster,
      props: { preset: 'tactical-survey', brand: 'relic' },
      color: BRAND_COLORS.relic,
      description: 'Turnkey sector reconnaissance cluster with survey optic & ruler',
    },
  ];

  // Group by category to log statistics
  const categories = [...new Set(manifest.map(m => m.category))];
  console.log(`>>> Found ${manifest.length} vector definitions across ${categories.length} categories:`);
  for (const cat of categories) {
    const count = manifest.filter(m => m.category === cat).length;
    console.log(`    - ${cat}: ${count} files`);
  }

  let exportedCount = 0;
  for (const item of manifest) {
    const targetDir = path.join(svgOutputDir, item.category);
    fs.mkdirSync(targetDir, { recursive: true });

    const targetPath = path.join(targetDir, item.filename);

    const element = React.createElement(item.component, item.props);
    const rawMarkup = render(element);
    const formattedSvg = buildSvg(rawMarkup, item.color);

    // Validate SVG structure
    validateSvg(formattedSvg, item.filename);

    fs.writeFileSync(targetPath, formattedSvg, 'utf8');
    exportedCount++;
  }

  console.log(`>>> Successfully generated & verified ${exportedCount} standalone SVG files in svg/micro/!`);
}

main().catch(err => {
  console.error('Fatal export error:', err);
  process.exit(1);
});

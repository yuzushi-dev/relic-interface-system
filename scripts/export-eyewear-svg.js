#!/usr/bin/env node

/**
 * RELIC INTERFACE SYSTEM (RIS v2.9.0)
 * Standalone Eyewear & Optical Waveguide Micro-HUD SVG Vector Export Pipeline
 *
 * Renders all 5 atomic eyewear components and 4 composite SmartGlassesHUD viewports
 * to standalone, W3C-compliant, production-grade SVG files ready for Figma, Adobe Illustrator,
 * and direct browser/web consumption without external CSS dependencies.
 */

const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');

// Primary RIS brand & optical profile color tokens
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

/**
 * Converts React static markup into a standalone W3C-compliant SVG.
 * Ensures xmlns, explicit viewBox, explicit width/height, embedded CSS variables,
 * clean strokes, and standalone color fallbacks for Figma/Illustrator.
 */
function buildSvg(rawSvg, primaryColor = '#6fb3c9') {
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
  lines.push('        --ris-green: #2fe48a;');
  lines.push('        --ris-red: #ff2d3c;');
  lines.push('        --ris-violet: #8479be;');
  lines.push('        --ris-fg4: #97a4ad;');
  lines.push('        --ris-bg: #0a0a0c;');
  lines.push('        --ris-line: rgba(111, 179, 201, 0.4);');
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
  const svgOutputDir = path.join(rootDir, 'svg', 'eyewear');
  const figmaAssetsDir = path.join(rootDir, 'figma', 'assets', 'eyewear');
  const proBundleDir = path.join(rootDir, 'release_bundles', 'relic-pro', 'figma', 'assets', 'eyewear');

  console.log('>>> [RIS v2.9.0] Starting Eyewear Micro-HUD SVG Vector Export Pipeline...');

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

  // Manifest of all 9 canonical eyewear exports
  const manifest = [
    // 1. Navigation Guidance
    {
      filename: 'nav-guidance.svg',
      component: Micro.MicroNavGuidance,
      props: {
        maneuver: 'slight-right',
        distanceMeters: 85,
        streetName: 'VIA DEL CORSO',
        eta: '12 MIN',
        brand: 'biohub',
        opticalProfile: 'cyber-cyan',
      },
      color: OPTICAL_COLORS['cyber-cyan'],
      description: 'Optical wayfinding maneuver with distance countdown and ETA chip',
    },
    // 2. Live Captions / Transcription
    {
      filename: 'live-captions.svg',
      component: Micro.MicroLiveCaptions,
      props: {
        line1: 'SYSTEM INITIALIZED. LINK NOMINAL',
        line2: 'AUDIO-IN: 44.1KHZ · LOW LATENCY',
        speaker: 'SYS // AUDIO-01',
        listening: true,
        brand: 'biohub',
        opticalProfile: 'cyber-cyan',
      },
      color: OPTICAL_COLORS['cyber-cyan'],
      description: 'Live speech-to-text teleprompter within foveal comfort boundary',
    },
    // 3. Vital Telemetry & Biometrics
    {
      filename: 'vital-telemetry.svg',
      component: Micro.MicroVitalTelemetry,
      props: {
        heartRate: 138,
        hrZone: 3,
        altitudeMeters: 420,
        batteryPercent: 68,
        batteryRuntimeHours: 3.4,
        brand: 'biohub',
        opticalProfile: 'cyber-cyan',
      },
      color: OPTICAL_COLORS['cyber-cyan'],
      description: 'Tactical biometrics, altitude, and 4-segment quantized battery gauge',
    },
    // 4. Glance Notice
    {
      filename: 'glance-notice.svg',
      component: Micro.MicroGlanceNotice,
      props: {
        category: 'COLLISION',
        title: 'COLLISION WARNING',
        subtitle: 'OBJECT AT 1.2M',
        severity: 'warn',
        dismissProgress: 35,
        brand: 'biohub',
        opticalProfile: 'tactical-amber',
      },
      color: OPTICAL_COLORS['tactical-amber'],
      description: 'Peripheral urgent alert with 45° chamfers and decay timer bar',
    },
    // 5. Spatial Inspection Boresight
    {
      filename: 'spatial-inspection.svg',
      component: Micro.MicroSpatialInspection,
      props: {
        distanceMeters: 1.4,
        targetLabel: 'VALVE_ACTUATOR_B2',
        status: 'locked',
        specCode: 'P/N: 884-J · OK',
        bracketWidth: 120,
        bracketHeight: 84,
        brand: 'biohub',
        opticalProfile: 'phosphor-green',
      },
      color: OPTICAL_COLORS['phosphor-green'],
      description: 'Central boresight frame with 100% hollow center and LiDAR range ruler',
    },
    // 6. Viewport: Ambient
    {
      filename: 'hud-viewport-ambient.svg',
      component: Micro.SmartGlassesHUD,
      props: {
        mode: 'ambient',
        opticalProfile: 'cyber-cyan',
        brand: 'biohub',
      },
      color: OPTICAL_COLORS['cyber-cyan'],
      description: '16:9 ambient HUD viewport with minimal clock and battery telemetry',
    },
    // 7. Viewport: Commute
    {
      filename: 'hud-viewport-commute.svg',
      component: Micro.SmartGlassesHUD,
      props: {
        mode: 'commute',
        opticalProfile: 'cyber-cyan',
        brand: 'biohub',
      },
      color: OPTICAL_COLORS['cyber-cyan'],
      description: '16:9 commute HUD viewport with navigation and compass heading',
    },
    // 8. Viewport: Meeting
    {
      filename: 'hud-viewport-meeting.svg',
      component: Micro.SmartGlassesHUD,
      props: {
        mode: 'meeting',
        opticalProfile: 'tactical-amber',
        brand: 'relic',
      },
      color: OPTICAL_COLORS['tactical-amber'],
      description: '16:9 meeting HUD viewport with live captions and glance notice',
    },
    // 9. Viewport: Field Ops
    {
      filename: 'hud-viewport-field-ops.svg',
      component: Micro.SmartGlassesHUD,
      props: {
        mode: 'field-ops',
        opticalProfile: 'phosphor-green',
        brand: 'biohub',
      },
      color: OPTICAL_COLORS['phosphor-green'],
      description: '16:9 field-ops HUD viewport with spatial boresight and vitals',
    },
  ];

  // Ensure output directories exist
  [svgOutputDir, figmaAssetsDir, proBundleDir].forEach(dir => {
    fs.mkdirSync(dir, { recursive: true });
  });

  let exportedCount = 0;

  for (const item of manifest) {
    try {
      const element = React.createElement(item.component, item.props);
      const rawMarkup = render(element);
      const cleanSvg = buildSvg(rawMarkup, item.color);

      validateSvg(cleanSvg, item.filename);

      // Write to primary svg/eyewear/ directory
      const outPath = path.join(svgOutputDir, item.filename);
      fs.writeFileSync(outPath, cleanSvg, 'utf8');

      // Copy to figma/assets/eyewear/
      const figmaPath = path.join(figmaAssetsDir, item.filename);
      fs.writeFileSync(figmaPath, cleanSvg, 'utf8');

      // Copy to release_bundles/relic-pro/figma/assets/eyewear/
      const proPath = path.join(proBundleDir, item.filename);
      fs.writeFileSync(proPath, cleanSvg, 'utf8');

      exportedCount++;
      console.log(`  [OK] Exported ${item.filename} -> ${item.description}`);
    } catch (err) {
      console.error(`  [FAIL] ${item.filename}:`, err.message);
      process.exit(1);
    }
  }

  console.log(`\n>>> Successfully exported ${exportedCount} Eyewear HUD vector SVGs!`);
  console.log(`    Primary Directory: ${svgOutputDir}`);
  console.log(`    Figma Assets:     ${figmaAssetsDir}`);
  console.log(`    Pro Bundle:       ${proBundleDir}\n`);
}

main().catch(err => {
  console.error('Fatal error in export pipeline:', err);
  process.exit(1);
});

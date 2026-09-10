#!/usr/bin/env node

/**
 * Script to append Artboard 05 (Smart Glasses & Waveguide Micro-HUDs)
 * to release_bundles/relic-pro/figma/code.js.
 */

const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const codeJsPath = path.join(rootDir, 'release_bundles', 'relic-pro', 'figma', 'code.js');
const eyewearSvgDir = path.join(rootDir, 'svg', 'eyewear');

if (!fs.existsSync(codeJsPath)) {
  console.error('code.js not found at:', codeJsPath);
  process.exit(1);
}

let code = fs.readFileSync(codeJsPath, 'utf8');

if (code.includes('[Artboard 05] — Smart Glasses')) {
  console.log('Artboard 05 is already present in code.js. Skipping append.');
  process.exit(0);
}

function escapeSvgForJs(svgStr) {
  // Use template literal escaping
  return svgStr.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\${/g, '\\${');
}

const atoms = [
  { file: 'nav-guidance.svg', label: 'NAV-GUIDANCE', tag: 'eyewear-nav-guidance', color: '#6fb3c9' },
  { file: 'live-captions.svg', label: 'LIVE-CAPTIONS', tag: 'eyewear-live-captions', color: '#6fb3c9' },
  { file: 'vital-telemetry.svg', label: 'VITAL-TELEMETRY', tag: 'eyewear-vital-telemetry', color: '#6fb3c9' },
  { file: 'glance-notice.svg', label: 'GLANCE-NOTICE', tag: 'eyewear-glance-notice', color: '#e6a23c' },
  { file: 'spatial-inspection.svg', label: 'SPATIAL-INSPECTION', tag: 'eyewear-spatial-inspection', color: '#2fe48a' },
];

const viewports = [
  { file: 'hud-viewport-ambient.svg', label: 'AMBIENT HUD (16:9)', tag: 'eyewear-hud-ambient', color: '#6fb3c9' },
  { file: 'hud-viewport-commute.svg', label: 'COMMUTE HUD (16:9)', tag: 'eyewear-hud-commute', color: '#6fb3c9' },
  { file: 'hud-viewport-meeting.svg', label: 'MEETING HUD (16:9)', tag: 'eyewear-hud-meeting', color: '#e6a23c' },
  { file: 'hud-viewport-field-ops.svg', label: 'FIELD-OPS HUD (16:9)', tag: 'eyewear-hud-field-ops', color: '#2fe48a' },
];

let artboard5Code = `
    // ------------------------------------------------------------------------
    // [Artboard 05] — Smart Glasses & Waveguide Micro-HUDs (RIS v2.9.0)
    // ------------------------------------------------------------------------
    const artboard5 = figma.createFrame();
    artboard5.name = "[Artboard 05] — Smart Glasses & Waveguide Micro-HUDs (RIS v2.9.0)";
    artboard5.x = 8060;
    artboard5.y = 0;
    artboard5.resize(2200, 2400);
    artboard5.fills = solidPaint("#0a0c0e");
    artboard5.strokes = solidPaint("#2a343b");
    artboard5.strokeWeight = 1.5;
    artboard5.paddingTop = 48;
    artboard5.paddingBottom = 48;
    artboard5.paddingLeft = 48;
    artboard5.paddingRight = 48;
    artboard5.layoutMode = "VERTICAL";
    artboard5.itemSpacing = 28;
    artboard5.primaryAxisSizingMode = "AUTO";
    artboard5.counterAxisSizingMode = "FIXED";

    // Header 05
    const head5 = figma.createFrame();
    head5.layoutMode = "VERTICAL";
    head5.itemSpacing = 6;
    head5.fills = [];
    artboard5.appendChild(head5);

    makeText(head5, "RELIC INTERFACE SYSTEM (RIS v2.9.0)", FONTS.monoBold, 11, "#6fb3c9", 0.12);
    makeText(head5, "05 // SMART GLASSES & WAVEGUIDE MICRO-HUDS", FONTS.displayBold, 26, "#e6ebe8");
    makeText(head5, "Optical Waveguide Architecture · Emissive Alpha Physics · Turnkey 16:9 Viewports", FONTS.displayReg, 13, "#7a889b");

    // Section 1: ATOMIC WAVEGUIDE HUD COMPONENTS
    const sec_eyewear_atoms = figma.createFrame();
    sec_eyewear_atoms.layoutMode = "VERTICAL";
    sec_eyewear_atoms.itemSpacing = 14;
    sec_eyewear_atoms.layoutAlign = "STRETCH";
    sec_eyewear_atoms.fills = solidPaint("#0f1316");
    sec_eyewear_atoms.strokes = solidPaint("#2a343b");
    sec_eyewear_atoms.paddingTop = 18;
    sec_eyewear_atoms.paddingBottom = 18;
    sec_eyewear_atoms.paddingLeft = 20;
    sec_eyewear_atoms.paddingRight = 20;
    artboard5.appendChild(sec_eyewear_atoms);

    const catHead_eyewear_atoms = figma.createFrame();
    catHead_eyewear_atoms.layoutMode = "VERTICAL";
    catHead_eyewear_atoms.itemSpacing = 4;
    catHead_eyewear_atoms.fills = [];
    sec_eyewear_atoms.appendChild(catHead_eyewear_atoms);

    makeText(catHead_eyewear_atoms, "01. ATOMIC WAVEGUIDE HUD COMPONENTS", FONTS.displayBold, 14, "#6fb3c9", 0.08);
    makeText(catHead_eyewear_atoms, "Zero-occlusion 1px optical telemetry for navigation, transcription, vitals, alerts, and LiDAR boresight", FONTS.monoMed, 10, "#7a889b");

    const row_eyewear_atoms = figma.createFrame();
    row_eyewear_atoms.layoutMode = "HORIZONTAL";
    row_eyewear_atoms.itemSpacing = 16;
    row_eyewear_atoms.counterAxisAlignItems = "CENTER";
    row_eyewear_atoms.fills = [];
    sec_eyewear_atoms.appendChild(row_eyewear_atoms);
`;

for (const item of atoms) {
  const svgContent = fs.readFileSync(path.join(eyewearSvgDir, item.file), 'utf8');
  const escapedSvg = escapeSvgForJs(svgContent);

  artboard5Code += `
    // Item: ${item.file}
    const card_${item.tag.replace(/-/g, '_')} = figma.createFrame();
    card_${item.tag.replace(/-/g, '_')}.layoutMode = "VERTICAL";
    card_${item.tag.replace(/-/g, '_')}.itemSpacing = 10;
    card_${item.tag.replace(/-/g, '_')}.counterAxisAlignItems = "CENTER";
    card_${item.tag.replace(/-/g, '_')}.primaryAxisAlignItems = "CENTER";
    card_${item.tag.replace(/-/g, '_')}.fills = solidPaint("#060708");
    card_${item.tag.replace(/-/g, '_')}.strokes = solidPaint("#1e262c");
    card_${item.tag.replace(/-/g, '_')}.paddingTop = 14;
    card_${item.tag.replace(/-/g, '_')}.paddingBottom = 12;
    card_${item.tag.replace(/-/g, '_')}.paddingLeft = 16;
    card_${item.tag.replace(/-/g, '_')}.paddingRight = 16;
    row_eyewear_atoms.appendChild(card_${item.tag.replace(/-/g, '_')});

    try {
      addSvg(card_${item.tag.replace(/-/g, '_')}, \`${escapedSvg}\`, "${item.tag}");
    } catch (eSvg) {
      console.warn("Could not parse SVG ${item.tag}:", eSvg);
    }
    makeText(card_${item.tag.replace(/-/g, '_')}, "${item.label}", FONTS.monoBold, 9.5, "${item.color}", 0.08);
`;
}

artboard5Code += `
    // Section 2: TURNKEY 16:9 HUD VIEWPORTS
    const sec_eyewear_viewports = figma.createFrame();
    sec_eyewear_viewports.layoutMode = "VERTICAL";
    sec_eyewear_viewports.itemSpacing = 16;
    sec_eyewear_viewports.layoutAlign = "STRETCH";
    sec_eyewear_viewports.fills = solidPaint("#0f1316");
    sec_eyewear_viewports.strokes = solidPaint("#2a343b");
    sec_eyewear_viewports.paddingTop = 20;
    sec_eyewear_viewports.paddingBottom = 20;
    sec_eyewear_viewports.paddingLeft = 20;
    sec_eyewear_viewports.paddingRight = 20;
    artboard5.appendChild(sec_eyewear_viewports);

    const catHead_viewports = figma.createFrame();
    catHead_viewports.layoutMode = "VERTICAL";
    catHead_viewports.itemSpacing = 4;
    catHead_viewports.fills = [];
    sec_eyewear_viewports.appendChild(catHead_viewports);

    makeText(catHead_viewports, "02. TURNKEY 16:9 HUD VIEWPORTS", FONTS.displayBold, 14, "#6fb3c9", 0.08);
    makeText(catHead_viewports, "Full 640x360 optical HUD frames orchestrating peripheral anchors for ambient, commute, meeting, and field-ops", FONTS.monoMed, 10, "#7a889b");

    const row_viewports_1 = figma.createFrame();
    row_viewports_1.layoutMode = "HORIZONTAL";
    row_viewports_1.itemSpacing = 20;
    row_viewports_1.counterAxisAlignItems = "CENTER";
    row_viewports_1.fills = [];
    sec_eyewear_viewports.appendChild(row_viewports_1);

    const row_viewports_2 = figma.createFrame();
    row_viewports_2.layoutMode = "HORIZONTAL";
    row_viewports_2.itemSpacing = 20;
    row_viewports_2.counterAxisAlignItems = "CENTER";
    row_viewports_2.fills = [];
    sec_eyewear_viewports.appendChild(row_viewports_2);
`;

for (let i = 0; i < viewports.length; i++) {
  const item = viewports[i];
  const rowVar = i < 2 ? 'row_viewports_1' : 'row_viewports_2';
  const svgContent = fs.readFileSync(path.join(eyewearSvgDir, item.file), 'utf8');
  const escapedSvg = escapeSvgForJs(svgContent);

  artboard5Code += `
    // Viewport: ${item.file}
    const card_${item.tag.replace(/-/g, '_')} = figma.createFrame();
    card_${item.tag.replace(/-/g, '_')}.layoutMode = "VERTICAL";
    card_${item.tag.replace(/-/g, '_')}.itemSpacing = 10;
    card_${item.tag.replace(/-/g, '_')}.counterAxisAlignItems = "CENTER";
    card_${item.tag.replace(/-/g, '_')}.primaryAxisAlignItems = "CENTER";
    card_${item.tag.replace(/-/g, '_')}.fills = solidPaint("#060708");
    card_${item.tag.replace(/-/g, '_')}.strokes = solidPaint("#1e262c");
    card_${item.tag.replace(/-/g, '_')}.paddingTop = 16;
    card_${item.tag.replace(/-/g, '_')}.paddingBottom = 14;
    card_${item.tag.replace(/-/g, '_')}.paddingLeft = 16;
    card_${item.tag.replace(/-/g, '_')}.paddingRight = 16;
    ${rowVar}.appendChild(card_${item.tag.replace(/-/g, '_')});

    try {
      addSvg(card_${item.tag.replace(/-/g, '_')}, \`${escapedSvg}\`, "${item.tag}");
    } catch (eSvg) {
      console.warn("Could not parse SVG ${item.tag}:", eSvg);
    }
    makeText(card_${item.tag.replace(/-/g, '_')}, "${item.label}", FONTS.monoBold, 10, "${item.color}", 0.08);
`;
}

// Find the insertion point before the Zoom & Finish section
const targetStr = '// ------------------------------------------------------------------------\n    // 9. ZOOM TO FIT & FINISH';
if (!code.includes(targetStr)) {
  console.error('Could not find zoom to fit section in code.js');
  process.exit(1);
}

// Replace zoom target to include artboard5 and update notification
let updatedCode = code.replace(
  targetStr,
  artboard5Code + '\n    ' + targetStr
);

updatedCode = updatedCode.replace(
  'figma.viewport.scrollAndZoomIntoView([artboard1, artboard2, artboard3, artboard4]);',
  'figma.viewport.scrollAndZoomIntoView([artboard1, artboard2, artboard3, artboard4, artboard5]);'
);

updatedCode = updatedCode.replace(
  '⚡ RIS v2.8.0 Commercial Pro Studio Kit Generated Successfully!',
  '⚡ RIS v2.9.0 Commercial Pro Studio Kit Generated Successfully!'
);

fs.writeFileSync(codeJsPath, updatedCode, 'utf8');
console.log('>>> Successfully appended Artboard 05 to release_bundles/relic-pro/figma/code.js!');

// ============================================================================
// RELIC INTERFACE SYSTEM (RIS v2) — FIGMA UI KIT BUILDER PLUGIN
// Turnkey Plugin Script for Figma
// Automatically generates Design Tokens, Color Swatches, WCAG Contrast Tags,
// and Tactical Cyber HUD Auto Layout Components on the Figma Canvas.
// ============================================================================

(async function () {
  try {
    // ------------------------------------------------------------------------
    // 1. SAFE FONT LOADER
    // ------------------------------------------------------------------------
    async function loadFontSafe(family, style) {
      try {
        await figma.loadFontAsync({ family, style });
        return { family, style };
      } catch (e) {
        const fallbackStyle =
          style === "Bold" || style === "SemiBold" ? "Bold" : style === "Medium" ? "Medium" : "Regular";
        try {
          await figma.loadFontAsync({ family: "Inter", style: fallbackStyle });
          return { family: "Inter", style: fallbackStyle };
        } catch (e2) {
          await figma.loadFontAsync({ family: "Inter", style: "Regular" });
          return { family: "Inter", style: "Regular" };
        }
      }
    }

    const FONT_DISPLAY_BOLD = await loadFontSafe("Archivo", "Bold");
    const FONT_DISPLAY_SEMI = await loadFontSafe("Archivo", "SemiBold");
    const FONT_DISPLAY_MED = await loadFontSafe("Archivo", "Medium");
    const FONT_DISPLAY_REG = await loadFontSafe("Archivo", "Regular");

    const FONT_MONO_BOLD = await loadFontSafe("JetBrains Mono", "Bold");
    const FONT_MONO_MED = await loadFontSafe("JetBrains Mono", "Medium");
    const FONT_MONO_REG = await loadFontSafe("JetBrains Mono", "Regular");

    const FONT_CYBER_BOLD = await loadFontSafe("Chakra Petch", "Bold");
    const FONT_CYBER_SEMI = await loadFontSafe("Chakra Petch", "SemiBold");
    const FONT_CYBER_REG = await loadFontSafe("Chakra Petch", "Regular");

    const FONTS = {
      displayBold: FONT_DISPLAY_BOLD,
      displaySemi: FONT_DISPLAY_SEMI,
      displayMed: FONT_DISPLAY_MED,
      displayReg: FONT_DISPLAY_REG,
      monoBold: FONT_MONO_BOLD,
      monoMed: FONT_MONO_MED,
      monoReg: FONT_MONO_REG,
      cyberBold: FONT_CYBER_BOLD,
      cyberSemi: FONT_CYBER_SEMI,
      cyberReg: FONT_CYBER_REG,
    };

    // ------------------------------------------------------------------------
    // 2. COLOR PALETTES & CONTRAST MATH
    // ------------------------------------------------------------------------
    function hexToRgb(hex) {
      let clean = hex.replace("#", "").trim();
      if (clean.length === 3) {
        clean = clean.split("").map((c) => c + c).join("");
      }
      const num = parseInt(clean, 16);
      return {
        r: ((num >> 16) & 255) / 255,
        g: ((num >> 8) & 255) / 255,
        b: (num & 255) / 255,
      };
    }

    function solidPaint(hex, opacity = 1) {
      return [{ type: "SOLID", color: hexToRgb(hex), opacity }];
    }

    function getLuminance(r, g, b) {
      const [lr, lg, lb] = [r, g, b].map((c) =>
        c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
      );
      return 0.2126 * lr + 0.7152 * lg + 0.0722 * lb;
    }

    function getContrastRatio(hex1, hex2) {
      const c1 = hexToRgb(hex1);
      const c2 = hexToRgb(hex2);
      const l1 = getLuminance(c1.r, c1.g, c1.b);
      const l2 = getLuminance(c2.r, c2.g, c2.b);
      const hi = Math.max(l1, l2);
      const lo = Math.min(l1, l2);
      return (hi + 0.05) / (lo + 0.05);
    }

    function getContrastTag(hex, bgHex) {
      const ratio = getContrastRatio(hex, bgHex);
      const formatted = ratio.toFixed(1) + ":1";
      if (ratio >= 7.0) return { tag: `${formatted} AAA`, pass: true, tier: "AAA" };
      if (ratio >= 4.5) return { tag: `${formatted} AA`, pass: true, tier: "AA" };
      return { tag: `${formatted} FAIL`, pass: false, tier: "FAIL" };
    }

    // ------------------------------------------------------------------------
    // 3. FIGMA PAINT STYLE REGISTRATION
    // ------------------------------------------------------------------------
    const existingStyles = figma.getLocalPaintStyles();
    const styleMap = new Map();
    for (const s of existingStyles) {
      styleMap.set(s.name, s);
    }

    function registerPaintStyle(name, hex, opacity = 1) {
      let style = styleMap.get(name);
      if (!style) {
        style = figma.createPaintStyle();
        style.name = name;
      }
      style.paints = solidPaint(hex, opacity);
      return style;
    }

    // Register RIS Dark Styles
    registerPaintStyle("RIS / Dark / Surface / Void", "#060708");
    registerPaintStyle("RIS / Dark / Surface / Background", "#0a0c0e");
    registerPaintStyle("RIS / Dark / Surface / Surface 1", "#0f1316");
    registerPaintStyle("RIS / Dark / Surface / Surface 2", "#141a1e");
    registerPaintStyle("RIS / Dark / Surface / Surface 3", "#1b2228");
    registerPaintStyle("RIS / Dark / Surface / Surface 4", "#232c33");
    registerPaintStyle("RIS / Dark / Line / Default", "#2a343b");
    registerPaintStyle("RIS / Dark / Line / Strong", "#3b4750");
    registerPaintStyle("RIS / Dark / Line / Faint", "#1a2126");
    registerPaintStyle("RIS / Dark / Text / Foreground 1", "#e6ebe8");
    registerPaintStyle("RIS / Dark / Text / Foreground 2", "#aab4b2");
    registerPaintStyle("RIS / Dark / Text / Foreground 3", "#98a3a5");
    registerPaintStyle("RIS / Dark / Text / Foreground 4", "#4a555b");
    registerPaintStyle("RIS / Dark / Text / Invert", "#07090a");
    registerPaintStyle("RIS / Dark / Accent / Yellow (CTA)", "#e6a23c");
    registerPaintStyle("RIS / Dark / Accent / Cyan (Data)", "#6fb3c9");
    registerPaintStyle("RIS / Dark / Accent / Red (Danger)", "#da6171");
    registerPaintStyle("RIS / Dark / Accent / Green (Success)", "#5fae84");
    registerPaintStyle("RIS / Dark / Accent / Violet", "#938ac8");
    registerPaintStyle("RIS / Dark / Accent / Magenta (Gumi)", "#b274c0");
    registerPaintStyle("RIS / Dark / Accent / Orange", "#d08a4e");

    // Register RIS Light Styles
    registerPaintStyle("RIS / Light / Surface / Void", "#d9dfe3");
    registerPaintStyle("RIS / Light / Surface / Background", "#e9edef");
    registerPaintStyle("RIS / Light / Surface / Surface 1", "#f4f6f7");
    registerPaintStyle("RIS / Light / Surface / Surface 2", "#fafbfc");
    registerPaintStyle("RIS / Light / Surface / Surface 3", "#ffffff");
    registerPaintStyle("RIS / Light / Line / Default", "#c3ccd2");
    registerPaintStyle("RIS / Light / Line / Strong", "#9aa7b0");
    registerPaintStyle("RIS / Light / Text / Foreground 1", "#11181c");
    registerPaintStyle("RIS / Light / Text / Foreground 2", "#3d4a52");
    registerPaintStyle("RIS / Light / Text / Foreground 3", "#5d6b74");
    registerPaintStyle("RIS / Light / Accent / Yellow (Ink)", "#8a5a12");
    registerPaintStyle("RIS / Light / Accent / Cyan (Ink)", "#216270");
    registerPaintStyle("RIS / Light / Accent / Red (Ink)", "#b52f3d");
    registerPaintStyle("RIS / Light / Accent / Green (Ink)", "#1f6e47");
    registerPaintStyle("RIS / Light / Accent / Violet (Ink)", "#534a9e");

    // Register Brands & Skins
    registerPaintStyle("RIS / Brand / Relic Primary", "#e6a23c");
    registerPaintStyle("RIS / Brand / Relic Secondary", "#6fb3c9");
    registerPaintStyle("RIS / Brand / BioHub Primary", "#6fb3c9");
    registerPaintStyle("RIS / Brand / BioHub Secondary", "#5fae84");
    registerPaintStyle("RIS / Brand / VivoKey Primary", "#da6171");
    registerPaintStyle("RIS / Brand / VivoKey Secondary", "#e6a23c");
    registerPaintStyle("RIS / Brand / Neutral Primary", "#938ac8");
    registerPaintStyle("RIS / Brand / Neutral Secondary", "#6fb3c9");

    registerPaintStyle("RIS / Case / Sealed Dossier", "#cf5e6b");
    registerPaintStyle("RIS / Case / Field Collection", "#d99a4a");
    registerPaintStyle("RIS / Case / Night Archive", "#be7ecf");

    registerPaintStyle("RIS / Cyber / Crimson Line", "#6e2d38");
    registerPaintStyle("RIS / Cyber / Neon Red", "#ff4d62");
    registerPaintStyle("RIS / Cyber / Neon Cyan", "#3df0ff");
    registerPaintStyle("RIS / Cyber / Neon Green", "#34f08c");
    registerPaintStyle("RIS / Cyber / Neon Yellow", "#ffd83a");

    // ------------------------------------------------------------------------
    // 4. CANVAS INITIALIZATION
    // ------------------------------------------------------------------------
    const page = figma.currentPage;
    page.name = "RIS v2 — Specimen & UI Kit";
    page.backgrounds = solidPaint("#060708"); // Void background

    // Helper text maker
    function makeText(parent, str, font, size, hex, tracking = 0, opacity = 1) {
      const node = figma.createText();
      parent.appendChild(node);
      node.fontName = font;
      node.fontSize = size;
      node.characters = str;
      node.fills = solidPaint(hex, opacity);
      if (tracking !== 0) {
        node.letterSpacing = { value: tracking * 100, unit: "PERCENT" };
      }
      return node;
    }

    // Helper SVG node adder
    function addSvg(parent, svgString, name = "svg-node") {
      const node = figma.createNodeFromSvg(svgString);
      node.name = name;
      parent.appendChild(node);
      return node;
    }

    // ------------------------------------------------------------------------
    // 5. ARTBOARD 01 — DESIGN TOKENS & COLOR MATRIX (Side-by-side Dark & Light)
    // ------------------------------------------------------------------------
    const artboard1 = figma.createFrame();
    artboard1.name = "[Artboard] 01 — RIS v2 Design Tokens & Color Architecture";
    artboard1.x = 0;
    artboard1.y = 0;
    artboard1.resize(1440, 1960);
    artboard1.fills = solidPaint("#0a0c0e");
    artboard1.strokes = solidPaint("#2a343b");
    artboard1.strokeWeight = 1.5;
    artboard1.cornerRadius = 0;
    artboard1.paddingTop = 48;
    artboard1.paddingBottom = 48;
    artboard1.paddingLeft = 48;
    artboard1.paddingRight = 48;
    artboard1.layoutMode = "VERTICAL";
    artboard1.itemSpacing = 36;
    artboard1.primaryAxisSizingMode = "AUTO";
    artboard1.counterAxisSizingMode = "FIXED";

    // Header Card
    const headerCard = figma.createFrame();
    headerCard.layoutMode = "VERTICAL";
    headerCard.itemSpacing = 8;
    headerCard.fills = solidPaint("#0f1316");
    headerCard.strokes = solidPaint("#3b4750");
    headerCard.strokeWeight = 1;
    headerCard.paddingTop = 24;
    headerCard.paddingBottom = 24;
    headerCard.paddingLeft = 32;
    headerCard.paddingRight = 32;
    headerCard.layoutAlign = "STRETCH";
    artboard1.appendChild(headerCard);

    makeText(headerCard, "RELIC INTERFACE SYSTEM v2", FONTS.displayBold, 32, "#e6a23c", 0.05);
    makeText(
      headerCard,
      "TACTICAL CYBER HUD // COLOR SYSTEM & WCAG CONTRAST SPECIMEN",
      FONTS.displaySemi,
      14,
      "#6fb3c9",
      0.16
    );
    makeText(
      headerCard,
      "Disciplined forensic instrument aesthetics. Hard graphite surfaces, dual-mode calibrated ink, 4 brand pairs, and 3 case-context skins. Fully validated against WCAG 2.2 AA.",
      FONTS.displayMed,
      13,
      "#aab4b2"
    );

    // Section: Side-by-side Dark & Light Architecture
    const dualThemeRow = figma.createFrame();
    dualThemeRow.layoutMode = "HORIZONTAL";
    dualThemeRow.itemSpacing = 24;
    dualThemeRow.layoutAlign = "STRETCH";
    dualThemeRow.fills = [];
    artboard1.appendChild(dualThemeRow);

    // Dark Mode Palette Column
    const darkCol = figma.createFrame();
    darkCol.layoutMode = "VERTICAL";
    darkCol.itemSpacing = 16;
    darkCol.layoutGrow = 1;
    darkCol.fills = solidPaint("#0f1316");
    darkCol.strokes = solidPaint("#2a343b");
    darkCol.paddingTop = 20;
    darkCol.paddingBottom = 20;
    darkCol.paddingLeft = 24;
    darkCol.paddingRight = 24;
    dualThemeRow.appendChild(darkCol);

    makeText(darkCol, "DARK THEME (DEFAULT GRAPHITE)", FONTS.displayBold, 16, "#e6ebe8", 0.08);
    makeText(darkCol, "Base app backdrop: #0a0c0e | Contrast tags evaluated against surface-1 (#0f1316)", FONTS.monoMed, 10, "#98a3a5");

    const darkSwatches = [
      { name: "Void (Backdrop)", hex: "#060708", role: "Deepest backdrop" },
      { name: "Background", hex: "#0a0c0e", role: "App stage" },
      { name: "Surface 1", hex: "#0f1316", role: "Panel base" },
      { name: "Surface 2", hex: "#141a1e", role: "Raised card" },
      { name: "Surface 3", hex: "#1b2228", role: "Elevated item" },
      { name: "Surface 4", hex: "#232c33", role: "Tooltips / popovers" },
      { name: "Line Default", hex: "#2a343b", role: "Structural border" },
      { name: "Line Strong", hex: "#3b4750", role: "Emphasized border" },
      { name: "Fg 1 (High)", hex: "#e6ebe8", role: "Primary heading/body" },
      { name: "Fg 2 (Medium)", hex: "#aab4b2", role: "Secondary labels" },
      { name: "Fg 3 (Meta)", hex: "#98a3a5", role: "Metadata (AA-safe)" },
      { name: "Fg 4 (Disabled)", hex: "#4a555b", role: "Disabled / placeholder" },
    ];

    for (const sw of darkSwatches) {
      const row = figma.createFrame();
      row.layoutMode = "HORIZONTAL";
      row.itemSpacing = 12;
      row.counterAxisAlignItems = "CENTER";
      row.layoutAlign = "STRETCH";
      row.fills = [];
      darkCol.appendChild(row);

      const box = figma.createFrame();
      box.resize(32, 24);
      box.fills = solidPaint(sw.hex);
      box.strokes = solidPaint("#3b4750");
      box.strokeWeight = 1;
      row.appendChild(box);

      const info = figma.createFrame();
      info.layoutMode = "VERTICAL";
      info.itemSpacing = 2;
      info.layoutGrow = 1;
      info.fills = [];
      row.appendChild(info);

      makeText(info, sw.name, FONTS.displaySemi, 12, "#e6ebe8");
      makeText(info, `${sw.hex} — ${sw.role}`, FONTS.monoMed, 9, "#98a3a5");

      const tagData = getContrastTag(sw.hex, "#0f1316");
      const tagPill = figma.createFrame();
      tagPill.paddingLeft = 8;
      tagPill.paddingRight = 8;
      tagPill.paddingTop = 4;
      tagPill.paddingBottom = 4;
      tagPill.fills = solidPaint(tagData.pass ? "#141a1e" : "#1f1416");
      tagPill.strokes = solidPaint(tagData.pass ? (tagData.tier === "AAA" ? "#5fae84" : "#e6a23c") : "#4a555b");
      tagPill.strokeWeight = 1;
      row.appendChild(tagPill);

      makeText(
        tagPill,
        tagData.tag,
        FONTS.monoBold,
        9,
        tagData.pass ? (tagData.tier === "AAA" ? "#5fae84" : "#e6a23c") : "#98a3a5"
      );
    }

    // Light Mode Palette Column
    const lightCol = figma.createFrame();
    lightCol.layoutMode = "VERTICAL";
    lightCol.itemSpacing = 16;
    lightCol.layoutGrow = 1;
    lightCol.fills = solidPaint("#f4f6f7");
    lightCol.strokes = solidPaint("#c3ccd2");
    lightCol.paddingTop = 20;
    lightCol.paddingBottom = 20;
    lightCol.paddingLeft = 24;
    lightCol.paddingRight = 24;
    dualThemeRow.appendChild(lightCol);

    makeText(lightCol, "LIGHT THEME (COLD BLUE-GREY PAPER)", FONTS.displayBold, 16, "#11181c", 0.08);
    makeText(lightCol, "Base paper backdrop: #e9edef | Contrast tags evaluated against surface-1 (#f4f6f7)", FONTS.monoMed, 10, "#5d6b74");

    const lightSwatches = [
      { name: "Void (Light)", hex: "#d9dfe3", role: "Recessed backdrop" },
      { name: "Background", hex: "#e9edef", role: "App stage paper" },
      { name: "Surface 1", hex: "#f4f6f7", role: "Panel container" },
      { name: "Surface 2", hex: "#fafbfc", role: "Raised card" },
      { name: "Surface 3", hex: "#ffffff", role: "Elevated / white" },
      { name: "Surface 4", hex: "#ffffff", role: "Deepest card" },
      { name: "Line Default", hex: "#c3ccd2", role: "Structural border" },
      { name: "Line Strong", hex: "#9aa7b0", role: "Emphasized border" },
      { name: "Fg 1 (Ink High)", hex: "#11181c", role: "Primary heading/body" },
      { name: "Fg 2 (Ink Medium)", hex: "#3d4a52", role: "Secondary labels" },
      { name: "Fg 3 (Ink Meta)", hex: "#5d6b74", role: "Metadata (AA-safe)" },
      { name: "Fg 4 (Disabled)", hex: "#97a4ad", role: "Disabled / placeholder" },
    ];

    for (const sw of lightSwatches) {
      const row = figma.createFrame();
      row.layoutMode = "HORIZONTAL";
      row.itemSpacing = 12;
      row.counterAxisAlignItems = "CENTER";
      row.layoutAlign = "STRETCH";
      row.fills = [];
      lightCol.appendChild(row);

      const box = figma.createFrame();
      box.resize(32, 24);
      box.fills = solidPaint(sw.hex);
      box.strokes = solidPaint("#c3ccd2");
      box.strokeWeight = 1;
      row.appendChild(box);

      const info = figma.createFrame();
      info.layoutMode = "VERTICAL";
      info.itemSpacing = 2;
      info.layoutGrow = 1;
      info.fills = [];
      row.appendChild(info);

      makeText(info, sw.name, FONTS.displaySemi, 12, "#11181c");
      makeText(info, `${sw.hex} — ${sw.role}`, FONTS.monoMed, 9, "#5d6b74");

      const tagData = getContrastTag(sw.hex, "#f4f6f7");
      const tagPill = figma.createFrame();
      tagPill.paddingLeft = 8;
      tagPill.paddingRight = 8;
      tagPill.paddingTop = 4;
      tagPill.paddingBottom = 4;
      tagPill.fills = solidPaint(tagData.pass ? "#ffffff" : "#e9edef");
      tagPill.strokes = solidPaint(tagData.pass ? (tagData.tier === "AAA" ? "#1f6e47" : "#8a5a12") : "#97a4ad");
      tagPill.strokeWeight = 1;
      row.appendChild(tagPill);

      makeText(
        tagPill,
        tagData.tag,
        FONTS.monoBold,
        9,
        tagData.pass ? (tagData.tier === "AAA" ? "#1f6e47" : "#8a5a12") : "#5d6b74"
      );
    }

    // Section: 4 Brands Accent Matrix
    const brandSection = figma.createFrame();
    brandSection.layoutMode = "VERTICAL";
    brandSection.itemSpacing = 14;
    brandSection.layoutAlign = "STRETCH";
    brandSection.fills = solidPaint("#0f1316");
    brandSection.strokes = solidPaint("#2a343b");
    brandSection.paddingTop = 20;
    brandSection.paddingBottom = 20;
    brandSection.paddingLeft = 24;
    brandSection.paddingRight = 24;
    artboard1.appendChild(brandSection);

    makeText(brandSection, "BRAND ACCENT MATRIX (4 BRANDS)", FONTS.displayBold, 15, "#e6a23c", 0.1);
    makeText(brandSection, "Each brand declares an unambiguous primary CTA accent and secondary telemetry accent.", FONTS.monoMed, 10, "#98a3a5");

    const brandGrid = figma.createFrame();
    brandGrid.layoutMode = "HORIZONTAL";
    brandGrid.itemSpacing = 16;
    brandGrid.layoutAlign = "STRETCH";
    brandGrid.fills = [];
    brandSection.appendChild(brandGrid);

    const brands = [
      { name: "RELIC (DEFAULT)", desc: "Workbench & Command", p: "#e6a23c", s: "#6fb3c9", pName: "Yellow", sName: "Cyan" },
      { name: "BIOHUB", desc: "Neural & Biofeedback", p: "#6fb3c9", s: "#5fae84", pName: "Cyan", sName: "Green" },
      { name: "VIVOKEY", desc: "Biometrics & Security", p: "#da6171", s: "#e6a23c", pName: "Red", sName: "Yellow" },
      { name: "NEUTRAL", desc: "Archival Research", p: "#938ac8", s: "#6fb3c9", pName: "Violet", sName: "Cyan" },
    ];

    for (const b of brands) {
      const card = figma.createFrame();
      card.layoutMode = "VERTICAL";
      card.itemSpacing = 10;
      card.layoutGrow = 1;
      card.fills = solidPaint("#141a1e");
      card.strokes = solidPaint("#2a343b");
      card.paddingTop = 14;
      card.paddingBottom = 14;
      card.paddingLeft = 16;
      card.paddingRight = 16;
      brandGrid.appendChild(card);

      makeText(card, b.name, FONTS.displayBold, 12, "#e6ebe8", 0.08);
      makeText(card, b.desc, FONTS.monoMed, 9, "#98a3a5");

      const rowP = figma.createFrame();
      rowP.layoutMode = "HORIZONTAL";
      rowP.itemSpacing = 8;
      rowP.counterAxisAlignItems = "CENTER";
      rowP.fills = [];
      card.appendChild(rowP);
      const dotP = figma.createFrame();
      dotP.resize(16, 16);
      dotP.fills = solidPaint(b.p);
      rowP.appendChild(dotP);
      makeText(rowP, `PRI: ${b.pName} (${b.p})`, FONTS.monoBold, 9.5, "#e6ebe8");

      const rowS = figma.createFrame();
      rowS.layoutMode = "HORIZONTAL";
      rowS.itemSpacing = 8;
      rowS.counterAxisAlignItems = "CENTER";
      rowS.fills = [];
      card.appendChild(rowS);
      const dotS = figma.createFrame();
      dotS.resize(16, 16);
      dotS.fills = solidPaint(b.s);
      rowS.appendChild(dotS);
      makeText(rowS, `SEC: ${b.sName} (${b.s})`, FONTS.monoBold, 9.5, "#aab4b2");
    }

    // Section: 3 Case-Context Skins + Tactical Cyber HUD
    const skinsSection = figma.createFrame();
    skinsSection.layoutMode = "VERTICAL";
    skinsSection.itemSpacing = 14;
    skinsSection.layoutAlign = "STRETCH";
    skinsSection.fills = solidPaint("#0f1316");
    skinsSection.strokes = solidPaint("#2a343b");
    skinsSection.paddingTop = 20;
    skinsSection.paddingBottom = 20;
    skinsSection.paddingLeft = 24;
    skinsSection.paddingRight = 24;
    artboard1.appendChild(skinsSection);

    makeText(skinsSection, "CASE-CONTEXT SKINS & TACTICAL CYBER HUD", FONTS.displayBold, 15, "#6fb3c9", 0.1);

    const skinsGrid = figma.createFrame();
    skinsGrid.layoutMode = "HORIZONTAL";
    skinsGrid.itemSpacing = 16;
    skinsGrid.layoutAlign = "STRETCH";
    skinsGrid.fills = [];
    skinsSection.appendChild(skinsGrid);

    const skinList = [
      {
        name: "SEALED DOSSIER",
        tag: "case-sealed",
        accent: "#cf5e6b",
        bg: "#070608",
        desc: "Evidentiary red on cold graphite for restricted access records",
      },
      {
        name: "FIELD COLLECTION",
        tag: "case-field",
        accent: "#d99a4a",
        bg: "#080706",
        desc: "Field sodium amber on warm anthracite for rugged field acquisition",
      },
      {
        name: "NIGHT ARCHIVE",
        tag: "case-archive",
        accent: "#be7ecf",
        bg: "#080612",
        desc: "Deep orchid on purple graphite for archival analysis",
      },
      {
        name: "CYBER HUD",
        tag: "skin-cyber",
        accent: "#ff4d62",
        bg: "#070406",
        desc: "Structural red lines (#6e2d38) + calibrated neon glow phosphors",
      },
    ];

    for (const sk of skinList) {
      const card = figma.createFrame();
      card.layoutMode = "VERTICAL";
      card.itemSpacing = 8;
      card.layoutGrow = 1;
      card.fills = solidPaint(sk.bg);
      card.strokes = solidPaint(sk.accent, 0.4);
      card.strokeWeight = 1.5;
      card.paddingTop = 16;
      card.paddingBottom = 16;
      card.paddingLeft = 16;
      card.paddingRight = 16;
      skinsGrid.appendChild(card);

      makeText(card, sk.name, FONTS.displayBold, 12, sk.accent, 0.1);
      makeText(card, `DATA-SKIN: ${sk.tag}`, FONTS.monoBold, 8.5, "#98a3a5");
      makeText(card, sk.desc, FONTS.displayMed, 10, "#aab4b2");

      const pill = figma.createFrame();
      pill.resize(60, 6);
      pill.fills = solidPaint(sk.accent);
      card.appendChild(pill);
    }

    // ------------------------------------------------------------------------
    // 6. ARTBOARD 02 — TACTICAL COMPONENTS & AUTO LAYOUT
    // ------------------------------------------------------------------------
    const artboard2 = figma.createFrame();
    artboard2.name = "[Artboard] 02 — RIS v2 Tactical Components & Auto Layout Kit";
    artboard2.x = 1500;
    artboard2.y = 0;
    artboard2.resize(1520, 2240);
    artboard2.fills = solidPaint("#0a0c0e");
    artboard2.strokes = solidPaint("#2a343b");
    artboard2.strokeWeight = 1.5;
    artboard2.paddingTop = 48;
    artboard2.paddingBottom = 48;
    artboard2.paddingLeft = 48;
    artboard2.paddingRight = 48;
    artboard2.layoutMode = "VERTICAL";
    artboard2.itemSpacing = 36;
    artboard2.primaryAxisSizingMode = "AUTO";
    artboard2.counterAxisSizingMode = "FIXED";

    // Component Artboard Header
    const compHeader = figma.createFrame();
    compHeader.layoutMode = "VERTICAL";
    compHeader.itemSpacing = 8;
    compHeader.fills = solidPaint("#0f1316");
    compHeader.strokes = solidPaint("#3b4750");
    compHeader.strokeWeight = 1;
    compHeader.paddingTop = 24;
    compHeader.paddingBottom = 24;
    compHeader.paddingLeft = 32;
    compHeader.paddingRight = 32;
    compHeader.layoutAlign = "STRETCH";
    artboard2.appendChild(compHeader);

    makeText(compHeader, "TACTICAL CYBER HUD COMPONENTS", FONTS.displayBold, 30, "#e6a23c", 0.05);
    makeText(
      compHeader,
      "PRECISION 45° CHAMFER VECTORS // AUTO LAYOUT SPECIMEN COLLECTION",
      FONTS.displaySemi,
      13,
      "#6fb3c9",
      0.16
    );
    makeText(
      compHeader,
      "Production-ready component specimens: 45° chamfered buttons, telemetry stat cards, mechanical switches, accordions, and mobile tactical bottom sheets.",
      FONTS.displayMed,
      12.5,
      "#aab4b2"
    );

    // ========================================================================
    // SECTION A: TACTICAL CHAMFERED BUTTONS
    // ========================================================================
    const btnSection = figma.createFrame();
    btnSection.layoutMode = "VERTICAL";
    btnSection.itemSpacing = 16;
    btnSection.layoutAlign = "STRETCH";
    btnSection.fills = solidPaint("#0f1316");
    btnSection.strokes = solidPaint("#2a343b");
    btnSection.paddingTop = 24;
    btnSection.paddingBottom = 24;
    btnSection.paddingLeft = 28;
    btnSection.paddingRight = 28;
    artboard2.appendChild(btnSection);

    makeText(btnSection, "01. TACTICAL CHAMFERED BUTTONS (45° CUT PATHS)", FONTS.displayBold, 15, "#e6a23c", 0.1);
    makeText(btnSection, "Signature 45° angular cuts on top-right and bottom-left corners (6px cut). Hard-edged, zero border-radius.", FONTS.monoMed, 10, "#98a3a5");

    // Helper to generate a 45° cut chamfered button frame
    function createChamferButton({ parent, label, variant = "primary", size = "md", icon = "▶" }) {
      const w = size === "sm" ? 130 : size === "lg" ? 190 : 160;
      const h = size === "sm" ? 28 : size === "lg" ? 46 : 36;
      const cut = size === "sm" ? 4 : size === "lg" ? 8 : 6;
      const fontSize = size === "sm" ? 10 : size === "lg" ? 13 : 11;

      let fill = "#e6a23c";
      let stroke = "#e6a23c";
      let textColor = "#07090a";
      let font = FONTS.displayBold;

      if (variant === "default") {
        fill = "#141a1e";
        stroke = "#3b4750";
        textColor = "#e6ebe8";
      } else if (variant === "secondary") {
        fill = "#0a0c0e";
        stroke = "#6fb3c9";
        textColor = "#6fb3c9";
      } else if (variant === "danger") {
        fill = "#1a0e12";
        stroke = "#d45565";
        textColor = "#da6171";
      } else if (variant === "outline") {
        fill = "transparent";
        stroke = "#2a343b";
        textColor = "#aab4b2";
      } else if (variant === "invert") {
        fill = "#e6ebe8";
        stroke = "#e6ebe8";
        textColor = "#07090a";
      } else if (variant === "cyber") {
        fill = "#1a0e12";
        stroke = "#ff4d62";
        textColor = "#f3eef0";
        font = FONTS.cyberBold;
      }

      // SVG code for 45° chamfer cut (top-right and bottom-left)
      const svg = `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" fill="none" xmlns="http://www.w3.org/2000/svg">
        <polygon points="0,0 ${w - cut},0 ${w},${cut} ${w},${h} ${cut},${h} 0,${h - cut}" fill="${fill}" stroke="${stroke}" stroke-width="1.5"/>
        <line x1="${w - cut - 3}" y1="1" x2="${w - 1}" y2="${cut + 3}" stroke="${stroke}" stroke-width="1.5" opacity="0.6"/>
      </svg>`;

      const btnWrapper = figma.createFrame();
      btnWrapper.name = `Btn / ${variant.toUpperCase()} / ${size.toUpperCase()}`;
      btnWrapper.resize(w, h);
      btnWrapper.fills = [];
      btnWrapper.layoutMode = "NONE"; // Absolute stack
      parent.appendChild(btnWrapper);

      // Add SVG background
      const svgBg = figma.createNodeFromSvg(svg);
      svgBg.name = "chamfer-bg";
      svgBg.x = 0;
      svgBg.y = 0;
      btnWrapper.appendChild(svgBg);

      // Add Auto Layout content over the SVG background
      const content = figma.createFrame();
      content.name = "btn-content";
      content.x = 0;
      content.y = 0;
      content.resize(w, h);
      content.fills = [];
      content.layoutMode = "HORIZONTAL";
      content.primaryAxisAlignItems = "CENTER";
      content.counterAxisAlignItems = "CENTER";
      content.itemSpacing = 8;
      btnWrapper.appendChild(content);

      makeText(content, label, font, fontSize, textColor, 0.12);
      if (icon) {
        makeText(content, icon, FONTS.monoBold, fontSize, textColor);
      }

      return btnWrapper;
    }

    const btnRow1 = figma.createFrame();
    btnRow1.layoutMode = "HORIZONTAL";
    btnRow1.itemSpacing = 16;
    btnRow1.fills = [];
    btnSection.appendChild(btnRow1);

    createChamferButton({ parent: btnRow1, label: "PRIMARY CTA", variant: "primary", size: "md" });
    createChamferButton({ parent: btnRow1, label: "DEFAULT", variant: "default", size: "md" });
    createChamferButton({ parent: btnRow1, label: "SECONDARY", variant: "secondary", size: "md" });
    createChamferButton({ parent: btnRow1, label: "DANGER", variant: "danger", size: "md", icon: "⚠" });
    createChamferButton({ parent: btnRow1, label: "OUTLINE", variant: "outline", size: "md" });
    createChamferButton({ parent: btnRow1, label: "INVERT", variant: "invert", size: "md" });
    createChamferButton({ parent: btnRow1, label: "CYBER NEON", variant: "cyber", size: "md", icon: "⚡" });

    // Sizes demonstration row
    const btnRow2 = figma.createFrame();
    btnRow2.layoutMode = "HORIZONTAL";
    btnRow2.itemSpacing = 16;
    btnRow2.counterAxisAlignItems = "CENTER";
    btnRow2.fills = [];
    btnSection.appendChild(btnRow2);

    makeText(btnRow2, "SIZES:", FONTS.monoBold, 11, "#98a3a5");
    createChamferButton({ parent: btnRow2, label: "SM (28PX)", variant: "primary", size: "sm" });
    createChamferButton({ parent: btnRow2, label: "MD (36PX)", variant: "primary", size: "md" });
    createChamferButton({ parent: btnRow2, label: "LG (46PX)", variant: "primary", size: "lg" });

    // ========================================================================
    // SECTION B: TACTICAL CHAMFERED PANELS WITH BRACKETS & CHIPS
    // ========================================================================
    const panelSection = figma.createFrame();
    panelSection.layoutMode = "VERTICAL";
    panelSection.itemSpacing = 16;
    panelSection.layoutAlign = "STRETCH";
    panelSection.fills = solidPaint("#0f1316");
    panelSection.strokes = solidPaint("#2a343b");
    panelSection.paddingTop = 24;
    panelSection.paddingBottom = 24;
    panelSection.paddingLeft = 28;
    panelSection.paddingRight = 28;
    artboard2.appendChild(panelSection);

    makeText(panelSection, "02. TACTICAL CHAMFERED PANELS (BRACKETS & CHIPS)", FONTS.displayBold, 15, "#6fb3c9", 0.1);

    const panelRow = figma.createFrame();
    panelRow.layoutMode = "HORIZONTAL";
    panelRow.itemSpacing = 24;
    panelRow.layoutAlign = "STRETCH";
    panelRow.fills = [];
    panelSection.appendChild(panelRow);

    // Panel 1: Active Telemetry Buffer
    const p1 = figma.createFrame();
    p1.name = "Panel / Active Telemetry";
    p1.layoutMode = "VERTICAL";
    p1.itemSpacing = 14;
    p1.layoutGrow = 1;
    p1.fills = solidPaint("#141a1e");
    p1.strokes = solidPaint("#3b4750");
    p1.strokeWeight = 1.5;
    p1.paddingTop = 20;
    p1.paddingBottom = 20;
    p1.paddingLeft = 24;
    p1.paddingRight = 24;
    panelRow.appendChild(p1);

    // Header with Corner Brackets
    const p1Head = figma.createFrame();
    p1Head.layoutMode = "HORIZONTAL";
    p1Head.counterAxisAlignItems = "CENTER";
    p1Head.itemSpacing = 12;
    p1Head.layoutAlign = "STRETCH";
    p1Head.fills = [];
    p1.appendChild(p1Head);

    // Left L-Bracket
    const bracketTL = addSvg(
      p1Head,
      `<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 13V1H13" stroke="#e6a23c" stroke-width="2"/><rect x="3" y="3" width="2" height="2" fill="#e6a23c"/></svg>`,
      "bracket-tl"
    );

    makeText(p1Head, "ACTIVE TELEMETRY BUFFER", FONTS.displayBold, 13, "#e6ebe8", 0.08);

    const chipLive = figma.createFrame();
    chipLive.layoutMode = "HORIZONTAL";
    chipLive.itemSpacing = 6;
    chipLive.counterAxisAlignItems = "CENTER";
    chipLive.paddingLeft = 8;
    chipLive.paddingRight = 8;
    chipLive.paddingTop = 3;
    chipLive.paddingBottom = 3;
    chipLive.fills = solidPaint("#0f1316");
    chipLive.strokes = solidPaint("#5fae84");
    chipLive.strokeWeight = 1;
    p1Head.appendChild(chipLive);

    const liveDot = figma.createFrame();
    liveDot.resize(6, 6);
    liveDot.fills = solidPaint("#5fae84");
    chipLive.appendChild(liveDot);
    makeText(chipLive, "LIVE [●]", FONTS.monoBold, 9, "#5fae84");

    // Divider
    const p1Div = figma.createFrame();
    p1Div.resize(10, 1);
    p1Div.layoutAlign = "STRETCH";
    p1Div.fills = solidPaint("#2a343b");
    p1.appendChild(p1Div);

    // Body data readouts
    const p1Body = figma.createFrame();
    p1Body.layoutMode = "VERTICAL";
    p1Body.itemSpacing = 6;
    p1Body.layoutAlign = "STRETCH";
    p1Body.fills = [];
    p1.appendChild(p1Body);

    makeText(p1Body, "INGESTION STREAM: PROTOCOL_6520 // NODE-01", FONTS.monoMed, 10, "#98a3a5");
    makeText(p1Body, "BANDWIDTH: 1.44 GB/s — JITTER: <0.2ms", FONTS.monoBold, 11, "#6fb3c9");
    makeText(p1Body, "ENCRYPTION HASH: 0x889F...771B [VALID]", FONTS.monoMed, 10, "#aab4b2");

    // Actions Footer
    const p1Foot = figma.createFrame();
    p1Foot.layoutMode = "HORIZONTAL";
    p1Foot.itemSpacing = 12;
    p1Foot.counterAxisAlignItems = "CENTER";
    p1Foot.fills = [];
    p1.appendChild(p1Foot);
    createChamferButton({ parent: p1Foot, label: "PURGE BUFFER", variant: "default", size: "sm" });
    createChamferButton({ parent: p1Foot, label: "SYNC TELEMETRY", variant: "primary", size: "sm" });

    // Panel 2: Evidentiary Dossier (Case-Sealed)
    const p2 = figma.createFrame();
    p2.name = "Panel / Sealed Dossier";
    p2.layoutMode = "VERTICAL";
    p2.itemSpacing = 14;
    p2.layoutGrow = 1;
    p2.fills = solidPaint("#120e12");
    p2.strokes = solidPaint("#cf5e6b", 0.6);
    p2.strokeWeight = 1.5;
    p2.paddingTop = 20;
    p2.paddingBottom = 20;
    p2.paddingLeft = 24;
    p2.paddingRight = 24;
    panelRow.appendChild(p2);

    const p2Head = figma.createFrame();
    p2Head.layoutMode = "HORIZONTAL";
    p2Head.counterAxisAlignItems = "CENTER";
    p2Head.itemSpacing = 12;
    p2Head.layoutAlign = "STRETCH";
    p2Head.fills = [];
    p2.appendChild(p2Head);

    addSvg(
      p2Head,
      `<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 13V1H13" stroke="#cf5e6b" stroke-width="2"/><rect x="3" y="3" width="2" height="2" fill="#cf5e6b"/></svg>`,
      "bracket-tl-red"
    );

    makeText(p2Head, "EVIDENTIARY DOSSIER // CASE-SEALED", FONTS.displayBold, 13, "#f3eef0", 0.08);

    const chipSealed = figma.createFrame();
    chipSealed.paddingLeft = 8;
    chipSealed.paddingRight = 8;
    chipSealed.paddingTop = 3;
    chipSealed.paddingBottom = 3;
    chipSealed.fills = solidPaint("#1a0e12");
    chipSealed.strokes = solidPaint("#cf5e6b");
    chipSealed.strokeWeight = 1;
    p2Head.appendChild(chipSealed);
    makeText(chipSealed, "SEALED [SEC-4]", FONTS.monoBold, 9, "#cf5e6b");

    const p2Div = figma.createFrame();
    p2Div.resize(10, 1);
    p2Div.layoutAlign = "STRETCH";
    p2Div.fills = solidPaint("#322a34");
    p2.appendChild(p2Div);

    const p2Body = figma.createFrame();
    p2Body.layoutMode = "VERTICAL";
    p2Body.itemSpacing = 6;
    p2Body.layoutAlign = "STRETCH";
    p2Body.fills = [];
    p2.appendChild(p2Body);

    makeText(p2Body, "CLASSIFICATION: RESTRICTED ARCHIVAL MATERIAL", FONTS.monoMed, 10, "#cf5e6b");
    makeText(p2Body, "FINGERPRINT: SHA256: 8F9B24...00A12C", FONTS.monoBold, 11, "#f3eef0");
    makeText(p2Body, "CUSTODY CHAIN: VERIFIED BY ARCHIVIST 04", FONTS.monoMed, 10, "#c8b9bd");

    const p2Foot = figma.createFrame();
    p2Foot.layoutMode = "HORIZONTAL";
    p2Foot.itemSpacing = 12;
    p2Foot.counterAxisAlignItems = "CENTER";
    p2Foot.fills = [];
    p2.appendChild(p2Foot);
    createChamferButton({ parent: p2Foot, label: "REQUEST ACCESS", variant: "danger", size: "sm", icon: "🔒" });

    // ========================================================================
    // SECTION C: TACTICAL MECHANICAL SWITCHES
    // ========================================================================
    const switchSection = figma.createFrame();
    switchSection.layoutMode = "VERTICAL";
    switchSection.itemSpacing = 16;
    switchSection.layoutAlign = "STRETCH";
    switchSection.fills = solidPaint("#0f1316");
    switchSection.strokes = solidPaint("#2a343b");
    switchSection.paddingTop = 24;
    switchSection.paddingBottom = 24;
    switchSection.paddingLeft = 28;
    switchSection.paddingRight = 28;
    artboard2.appendChild(switchSection);

    makeText(switchSection, "03. TACTICAL MECHANICAL SWITCH (SLIDE TOGGLE)", FONTS.displayBold, 15, "#e6a23c", 0.1);
    makeText(switchSection, "Mechanical slide toggle with hard-edged 3px chamfered thumb. AA-safe active glow feedback.", FONTS.monoMed, 10, "#98a3a5");

    const switchRow = figma.createFrame();
    switchRow.layoutMode = "HORIZONTAL";
    switchRow.itemSpacing = 32;
    switchRow.fills = [];
    switchSection.appendChild(switchRow);

    // Switch OFF
    const swOffFrame = figma.createFrame();
    swOffFrame.layoutMode = "HORIZONTAL";
    swOffFrame.counterAxisAlignItems = "CENTER";
    swOffFrame.itemSpacing = 12;
    swOffFrame.fills = [];
    switchRow.appendChild(swOffFrame);

    const trackOff = figma.createFrame();
    trackOff.name = "switch-track-off";
    trackOff.resize(38, 20);
    trackOff.fills = solidPaint("#060708");
    trackOff.strokes = solidPaint("#3b4750");
    trackOff.strokeWeight = 1.2;
    trackOff.layoutMode = "NONE";
    swOffFrame.appendChild(trackOff);

    // Chamfered thumb OFF at left (x=3, y=3)
    const thumbOffSvg = addSvg(
      trackOff,
      `<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><polygon points="0,0 11,0 14,3 14,14 3,14 0,11" fill="#98a3a5"/></svg>`,
      "thumb-off"
    );
    thumbOffSvg.x = 3;
    thumbOffSvg.y = 3;

    makeText(swOffFrame, "SENSOR_ARRAY: STANDBY [OFF]", FONTS.monoMed, 11, "#98a3a5");

    // Switch ON
    const swOnFrame = figma.createFrame();
    swOnFrame.layoutMode = "HORIZONTAL";
    swOnFrame.counterAxisAlignItems = "CENTER";
    swOnFrame.itemSpacing = 12;
    swOnFrame.fills = [];
    switchRow.appendChild(swOnFrame);

    const trackOn = figma.createFrame();
    trackOn.name = "switch-track-on";
    trackOn.resize(38, 20);
    trackOn.fills = solidPaint("#e6a23c", 0.16); // Amber glow fill
    trackOn.strokes = solidPaint("#e6a23c", 0.55); // Amber line
    trackOn.strokeWeight = 1.2;
    trackOn.layoutMode = "NONE";
    swOnFrame.appendChild(trackOn);

    // Chamfered thumb ON at right (x=21, y=3)
    const thumbOnSvg = addSvg(
      trackOn,
      `<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><polygon points="0,0 11,0 14,3 14,14 3,14 0,11" fill="#e6a23c"/></svg>`,
      "thumb-on"
    );
    thumbOnSvg.x = 21;
    thumbOnSvg.y = 3;

    makeText(swOnFrame, "SENSOR_ARRAY: ARMED [ON]", FONTS.monoBold, 11, "#e6a23c");

    // Cyber Switch ON
    const swCyberFrame = figma.createFrame();
    swCyberFrame.layoutMode = "HORIZONTAL";
    swCyberFrame.counterAxisAlignItems = "CENTER";
    swCyberFrame.itemSpacing = 12;
    swCyberFrame.fills = [];
    switchRow.appendChild(swCyberFrame);

    const trackCyber = figma.createFrame();
    trackCyber.resize(38, 20);
    trackCyber.fills = solidPaint("#00e5ff", 0.18);
    trackCyber.strokes = solidPaint("#00e5ff", 0.6);
    trackCyber.strokeWeight = 1.2;
    trackCyber.layoutMode = "NONE";
    swCyberFrame.appendChild(trackCyber);

    const thumbCyberSvg = addSvg(
      trackCyber,
      `<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><polygon points="0,0 11,0 14,3 14,14 3,14 0,11" fill="#34f08c"/></svg>`,
      "thumb-cyber"
    );
    thumbCyberSvg.x = 21;
    thumbCyberSvg.y = 3;

    makeText(swCyberFrame, "CYBER_OVERDRIVE: ACTIVE [ON]", FONTS.cyberBold, 11, "#3df0ff");

    // ========================================================================
    // SECTION D: TACTICAL ACCORDIONS
    // ========================================================================
    const accSection = figma.createFrame();
    accSection.layoutMode = "VERTICAL";
    accSection.itemSpacing = 16;
    accSection.layoutAlign = "STRETCH";
    accSection.fills = solidPaint("#0f1316");
    accSection.strokes = solidPaint("#2a343b");
    accSection.paddingTop = 24;
    accSection.paddingBottom = 24;
    accSection.paddingLeft = 28;
    accSection.paddingRight = 28;
    artboard2.appendChild(accSection);

    makeText(accSection, "04. TACTICAL ACCORDION (DISCLOSURE DRAWER)", FONTS.displayBold, 15, "#5fae84", 0.1);

    const accContainer = figma.createFrame();
    accContainer.layoutMode = "VERTICAL";
    accContainer.layoutAlign = "STRETCH";
    accContainer.fills = solidPaint("#141a1e");
    accContainer.strokes = solidPaint("#2a343b");
    accContainer.strokeWeight = 1;
    accSection.appendChild(accContainer);

    // Item 1: Closed State
    const accItem1 = figma.createFrame();
    accItem1.layoutMode = "HORIZONTAL";
    accItem1.counterAxisAlignItems = "CENTER";
    accItem1.primaryAxisAlignItems = "SPACE_BETWEEN";
    accItem1.layoutAlign = "STRETCH";
    accItem1.paddingTop = 14;
    accItem1.paddingBottom = 14;
    accItem1.paddingLeft = 18;
    accItem1.paddingRight = 18;
    accItem1.fills = solidPaint("#0f1316");
    accItem1.strokes = solidPaint("#2a343b");
    accItem1.strokeWeight = 1;
    accContainer.appendChild(accItem1);

    makeText(accItem1, "DIAGNOSTIC PROTOCOL // 0x4F [HARDWARE SCAN]", FONTS.displaySemi, 12, "#aab4b2", 0.08);
    makeText(accItem1, "▼", FONTS.monoBold, 11, "#98a3a5");

    // Item 2: Open / Expanded State
    const accItem2 = figma.createFrame();
    accItem2.layoutMode = "VERTICAL";
    accItem2.layoutAlign = "STRETCH";
    accItem2.fills = solidPaint("#141a1e");
    accContainer.appendChild(accItem2);

    const accItem2Head = figma.createFrame();
    accItem2Head.layoutMode = "HORIZONTAL";
    accItem2Head.counterAxisAlignItems = "CENTER";
    accItem2Head.primaryAxisAlignItems = "SPACE_BETWEEN";
    accItem2Head.layoutAlign = "STRETCH";
    accItem2Head.paddingTop = 14;
    accItem2Head.paddingBottom = 14;
    accItem2Head.paddingLeft = 16;
    accItem2Head.paddingRight = 18;
    accItem2Head.fills = solidPaint("#1b2228");
    accItem2.appendChild(accItem2Head);

    const accTitleRow = figma.createFrame();
    accTitleRow.layoutMode = "HORIZONTAL";
    accTitleRow.itemSpacing = 8;
    accTitleRow.counterAxisAlignItems = "CENTER";
    accTitleRow.fills = [];
    accItem2Head.appendChild(accTitleRow);

    // Left Active Accent Bar
    const accBar = figma.createFrame();
    accBar.resize(3, 16);
    accBar.fills = solidPaint("#e6a23c");
    accTitleRow.appendChild(accBar);

    makeText(accTitleRow, "NEURAL SYNCHRONIZATION // 0x8B [ACTIVE EXPANDED]", FONTS.displayBold, 12, "#e6a23c", 0.08);
    makeText(accItem2Head, "▲", FONTS.monoBold, 11, "#e6a23c");

    // Drawer Body
    const accItem2Body = figma.createFrame();
    accItem2Body.layoutMode = "VERTICAL";
    accItem2Body.itemSpacing = 6;
    accItem2Body.layoutAlign = "STRETCH";
    accItem2Body.paddingTop = 14;
    accItem2Body.paddingBottom = 16;
    accItem2Body.paddingLeft = 28;
    accItem2Body.paddingRight = 24;
    accItem2Body.fills = solidPaint("#0f1316");
    accItem2Body.strokes = solidPaint("#2a343b");
    accItem2Body.strokeWeight = 1;
    accItem2.appendChild(accItem2Body);

    makeText(accItem2Body, "CORE FREQUENCY: 4.80 GHz // BUS CLOCK: 100 MHz", FONTS.monoBold, 11, "#6fb3c9");
    makeText(accItem2Body, "PACKET LOSS: 0.00% (24,800/24,800 FRAMES RECEIVED)", FONTS.monoMed, 10, "#5fae84");
    makeText(accItem2Body, "RECOMMENDATION: ALL CHANNELS CALIBRATED WITHIN OPERATIONAL MARGIN", FONTS.monoMed, 10, "#98a3a5");

    // ========================================================================
    // SECTION E: MOBILE BOTTOM SHEET (<768PX TACTICAL MODAL)
    // ========================================================================
    const sheetSection = figma.createFrame();
    sheetSection.layoutMode = "VERTICAL";
    sheetSection.itemSpacing = 16;
    sheetSection.layoutAlign = "STRETCH";
    sheetSection.fills = solidPaint("#0f1316");
    sheetSection.strokes = solidPaint("#2a343b");
    sheetSection.paddingTop = 24;
    sheetSection.paddingBottom = 24;
    sheetSection.paddingLeft = 28;
    sheetSection.paddingRight = 28;
    artboard2.appendChild(sheetSection);

    makeText(sheetSection, "05. MOBILE BOTTOM SHEET (<768PX TACTICAL MODAL)", FONTS.displayBold, 15, "#da6171", 0.1);
    makeText(sheetSection, "Tactical bottom sheet modal with 14px 45° top chamfer cuts and tactile drag handle.", FONTS.monoMed, 10, "#98a3a5");

    const sheetWrapper = figma.createFrame();
    sheetWrapper.name = "Mobile Bottom Sheet Specimen (390px)";
    sheetWrapper.resize(390, 360);
    sheetWrapper.layoutMode = "VERTICAL";
    sheetWrapper.itemSpacing = 12;
    sheetWrapper.fills = solidPaint("#141a1e");
    sheetWrapper.strokes = solidPaint("#3b4750");
    sheetWrapper.strokeWeight = 1.5;
    sheetWrapper.paddingTop = 8;
    sheetWrapper.paddingBottom = 16;
    sheetWrapper.paddingLeft = 18;
    sheetWrapper.paddingRight = 18;
    sheetSection.appendChild(sheetWrapper);

    // Tactile Drag Handle (44x4px)
    const handle = figma.createFrame();
    handle.resize(44, 4);
    handle.cornerRadius = 2;
    handle.fills = solidPaint("#4a555b");
    handle.layoutAlign = "CENTER";
    sheetWrapper.appendChild(handle);

    // Sheet Head
    const sheetHead = figma.createFrame();
    sheetHead.layoutMode = "HORIZONTAL";
    sheetHead.primaryAxisAlignItems = "SPACE_BETWEEN";
    sheetHead.counterAxisAlignItems = "CENTER";
    sheetHead.layoutAlign = "STRETCH";
    sheetHead.fills = [];
    sheetWrapper.appendChild(sheetHead);

    makeText(sheetHead, "TACTICAL OVERRIDE", FONTS.displayBold, 14, "#e6ebe8", 0.08);

    const sheetChip = figma.createFrame();
    sheetChip.paddingLeft = 8;
    sheetChip.paddingRight = 8;
    sheetChip.paddingTop = 3;
    sheetChip.paddingBottom = 3;
    sheetChip.fills = solidPaint("#1a0e12");
    sheetChip.strokes = solidPaint("#da6171");
    sheetChip.strokeWeight = 1;
    sheetHead.appendChild(sheetChip);
    makeText(sheetChip, "AUTH REQUIRED", FONTS.monoBold, 8.5, "#da6171");

    // Sheet Body
    const sheetBody = figma.createFrame();
    sheetBody.layoutMode = "VERTICAL";
    sheetBody.itemSpacing = 10;
    sheetBody.layoutGrow = 1;
    sheetBody.layoutAlign = "STRETCH";
    sheetBody.fills = solidPaint("#0f1316");
    sheetBody.strokes = solidPaint("#2a343b");
    sheetBody.strokeWeight = 1;
    sheetBody.paddingTop = 14;
    sheetBody.paddingBottom = 14;
    sheetBody.paddingLeft = 14;
    sheetBody.paddingRight = 14;
    sheetWrapper.appendChild(sheetBody);

    makeText(sheetBody, "CRITICAL AUTHORIZATION STEP", FONTS.displaySemi, 12, "#ffd83a");
    makeText(
      sheetBody,
      "Initiating manual override will temporarily bypass automated forensic data governance locks. Telemetry recording will proceed under audit level Alpha-01.",
      FONTS.displayMed,
      11,
      "#aab4b2"
    );

    // Progress / Segmented Meter in Sheet
    const meterRow = figma.createFrame();
    meterRow.layoutMode = "HORIZONTAL";
    meterRow.itemSpacing = 4;
    meterRow.counterAxisAlignItems = "CENTER";
    meterRow.fills = [];
    sheetBody.appendChild(meterRow);

    for (let i = 0; i < 8; i++) {
      const seg = figma.createFrame();
      seg.resize(18, 6);
      seg.fills = solidPaint(i < 5 ? "#e6a23c" : "#2a343b");
      meterRow.appendChild(seg);
    }
    makeText(meterRow, "62.5% ARMED", FONTS.monoBold, 9, "#e6a23c");

    // Sheet Foot Actions
    const sheetFoot = figma.createFrame();
    sheetFoot.layoutMode = "HORIZONTAL";
    sheetFoot.itemSpacing = 12;
    sheetFoot.layoutAlign = "STRETCH";
    sheetFoot.fills = [];
    sheetWrapper.appendChild(sheetFoot);

    createChamferButton({ parent: sheetFoot, label: "CANCEL", variant: "outline", size: "sm" });
    createChamferButton({ parent: sheetFoot, label: "CONFIRM OVERRIDE", variant: "danger", size: "sm", icon: "⚡" });

    // ========================================================================
    // SECTION F: TELEMETRY KPI STAT CARDS
    // ========================================================================
    const kpiSection = figma.createFrame();
    kpiSection.layoutMode = "VERTICAL";
    kpiSection.itemSpacing = 16;
    kpiSection.layoutAlign = "STRETCH";
    kpiSection.fills = solidPaint("#0f1316");
    kpiSection.strokes = solidPaint("#2a343b");
    kpiSection.paddingTop = 24;
    kpiSection.paddingBottom = 24;
    kpiSection.paddingLeft = 28;
    kpiSection.paddingRight = 28;
    artboard2.appendChild(kpiSection);

    makeText(kpiSection, "06. TELEMETRY KPI STAT CARDS", FONTS.displayBold, 15, "#e6a23c", 0.1);

    const kpiGrid = figma.createFrame();
    kpiGrid.layoutMode = "HORIZONTAL";
    kpiGrid.itemSpacing = 18;
    kpiGrid.layoutAlign = "STRETCH";
    kpiGrid.fills = [];
    kpiSection.appendChild(kpiGrid);

    const kpis = [
      {
        label: "HEART RATE // VIVOKEY",
        val: "74",
        unit: "BPM",
        delta: "▲ +2.4%",
        deltaColor: "#5fae84",
        accent: "#6fb3c9",
      },
      {
        label: "NEURAL BANDWIDTH",
        val: "94.8",
        unit: "% ACTIVE",
        delta: "▲ OPTIMAL",
        deltaColor: "#5fae84",
        accent: "#5fae84",
      },
      {
        label: "CORE TEMPERATURE",
        val: "38.2",
        unit: "°C",
        delta: "▲ +1.1°C",
        deltaColor: "#ffd83a",
        accent: "#e6a23c",
      },
      {
        label: "THREAT LEVEL",
        val: "DEFCON 2",
        unit: "ALERT",
        delta: "▼ ELEVATED",
        deltaColor: "#da6171",
        accent: "#da6171",
      },
    ];

    for (const k of kpis) {
      const card = figma.createFrame();
      card.name = `KPI / ${k.label}`;
      card.layoutMode = "VERTICAL";
      card.itemSpacing = 8;
      card.layoutGrow = 1;
      card.fills = solidPaint("#141a1e");
      card.strokes = solidPaint("#2a343b");
      card.strokeWeight = 1.2;
      card.paddingTop = 16;
      card.paddingBottom = 16;
      card.paddingLeft = 20;
      card.paddingRight = 18;
      kpiGrid.appendChild(card);

      // Top Row with Label & Accent Line
      const topRow = figma.createFrame();
      topRow.layoutMode = "HORIZONTAL";
      topRow.itemSpacing = 8;
      topRow.counterAxisAlignItems = "CENTER";
      topRow.fills = [];
      card.appendChild(topRow);

      const accentBar = figma.createFrame();
      accentBar.resize(3, 12);
      accentBar.fills = solidPaint(k.accent);
      topRow.appendChild(accentBar);

      makeText(topRow, k.label, FONTS.displaySemi, 10.5, "#98a3a5", 0.12);

      // Value Row
      const valRow = figma.createFrame();
      valRow.layoutMode = "HORIZONTAL";
      valRow.itemSpacing = 6;
      valRow.counterAxisAlignItems = "BASELINE";
      valRow.fills = [];
      card.appendChild(valRow);

      makeText(valRow, k.val, FONTS.displayBold, 28, "#e6ebe8", -0.01);
      makeText(valRow, k.unit, FONTS.displaySemi, 12, "#98a3a5");

      // Delta Row
      const deltaRow = figma.createFrame();
      deltaRow.layoutMode = "HORIZONTAL";
      deltaRow.itemSpacing = 6;
      deltaRow.counterAxisAlignItems = "CENTER";
      deltaRow.fills = [];
      card.appendChild(deltaRow);

      makeText(deltaRow, k.delta, FONTS.monoBold, 10, k.deltaColor);
      makeText(deltaRow, "// 24H DELTA", FONTS.monoMed, 9, "#4a555b");
    }

    // ------------------------------------------------------------------------
    // 7. ZOOM TO FIT & FINISH
    // ------------------------------------------------------------------------
    figma.viewport.scrollAndZoomIntoView([artboard1, artboard2]);
    figma.notify("⚡ RIS v2 UI Kit Specimen Generated Successfully!");
    figma.closePlugin();
  } catch (err) {
    console.error("Error generating RIS v2 UI Kit:", err);
    figma.notify("❌ Error generating RIS v2 UI Kit: " + err.message);
    figma.closePlugin();
  }
})();

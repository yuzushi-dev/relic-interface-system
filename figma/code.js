// ============================================================================
// RELIC INTERFACE SYSTEM (RIS v2.8.0) — FIGMA STUDIO KIT MASTER GENERATOR
// Turnkey Commercial Plugin Script for Figma
// Automatically generates:
// 1. Tokens & Foundations (Colors, Archivo/JetBrains/Chakra Typography, 45° Chamfers, Spacing, WCAG)
// 2. Component Master Library (Buttons Matrix, Chamfered Panels, Switches, Chips, Bottom Sheet, Accordions)
// 3. Pre-assembled Layouts (1440px Desktop Dashboard, 390px Mobile Shell, Side-by-side Dark/Light)
// ============================================================================

(async function () {
  try {
    // ------------------------------------------------------------------------
    // 1. RESILIENT FONT LOADER (SAFELY FALLS BACK TO INTER)
    // ------------------------------------------------------------------------
    async function loadFontSafe(family, style) {
      try {
        await figma.loadFontAsync({ family, style });
        return { family, style };
      } catch (e) {
        const fallbackStyle =
          style === "Bold" || style === "SemiBold"
            ? "Bold"
            : style === "Medium"
            ? "Medium"
            : "Regular";
        try {
          await figma.loadFontAsync({ family: "Inter", style: fallbackStyle });
          return { family: "Inter", style: fallbackStyle };
        } catch (e2) {
          try {
            await figma.loadFontAsync({ family: "Inter", style: "Regular" });
            return { family: "Inter", style: "Regular" };
          } catch (e3) {
            console.warn(`Font load fallback failed for ${family} ${style}:`, e3);
            return { family: "Inter", style: "Regular" };
          }
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
    // 2. COLOR PALETTES & CONTRAST MATH (WCAG 2.2 RELATIVE LUMINANCE)
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
    // 3. FIGMA PAINT STYLE & VARIABLE REGISTRATION
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

    // Register Dark Styles
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
    registerPaintStyle("RIS / Dark / Accent / Magenta", "#b274c0");
    registerPaintStyle("RIS / Dark / Accent / Orange", "#d08a4e");

    // Register Light Styles
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

    // Optional Native Figma Variables Registration (if supported by running client)
    try {
      if (figma.variables && typeof figma.variables.createVariableCollection === "function") {
        const collections = figma.variables.getLocalVariableCollections();
        let risColl = collections.find((c) => c.name === "RIS Tokens");
        if (!risColl) {
          risColl = figma.variables.createVariableCollection("RIS Tokens");
        }
      }
    } catch (vErr) {
      console.log("Figma Variables API skipped:", vErr.message);
    }

    // ------------------------------------------------------------------------
    // 4. CANVAS INITIALIZATION & CORE UI BUILDERS
    // ------------------------------------------------------------------------
    const page = figma.currentPage;
    page.name = "RIS v2.8.0 — Master UI Kit";
    page.backgrounds = solidPaint("#060708"); // Tactical Void Background

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

    function addSvg(parent, svgString, name = "svg-node") {
      const node = figma.createNodeFromSvg(svgString);
      node.name = name;
      parent.appendChild(node);
      return node;
    }

    // Generates 45° chamfer path data: cuts on top-right and bottom-left
    function getChamferPathData(w, h, cut) {
      return `M 0 0 L ${w - cut} 0 L ${w} ${cut} L ${w} ${h} L ${cut} ${h} L 0 ${h - cut} Z`;
    }

    // Helper to generate a 45° chamfered button with states
    function createChamferButton({
      parent,
      label,
      variant = "primary",
      size = "md",
      state = "default",
      icon = "▶",
    }) {
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
        fill = "#141a1e";
        stroke = "#6fb3c9";
        textColor = "#6fb3c9";
      } else if (variant === "danger") {
        fill = "#da6171";
        stroke = "#da6171";
        textColor = "#07090a";
      } else if (variant === "outline") {
        fill = "#000000";
        stroke = "#2a343b";
        textColor = "#aab4b2";
      } else if (variant === "invert") {
        fill = "#e6ebe8";
        stroke = "#e6ebe8";
        textColor = "#07090a";
      } else if (variant === "cyber") {
        fill = "#ff4d62";
        stroke = "#3df0ff";
        textColor = "#07090a";
      }

      // State adjustments
      if (state === "hover") {
        if (variant === "primary") fill = "#ffd83a";
        else if (variant === "secondary") stroke = "#3df0ff";
        else if (variant === "default") fill = "#1b2228";
        else if (variant === "danger") fill = "#ff6b7d";
      } else if (state === "active") {
        if (variant === "primary") fill = "#c58428";
        else if (variant === "default") fill = "#0f1316";
      } else if (state === "disabled") {
        fill = "#141a1e";
        stroke = "#2a343b";
        textColor = "#4a555b";
      }

      const btnWrapper = figma.createFrame();
      btnWrapper.name = `Btn / ${variant.toUpperCase()} / ${size.toUpperCase()} / ${state.toUpperCase()}`;
      btnWrapper.resize(w, h);
      btnWrapper.fills = [];
      btnWrapper.clipsContent = false;
      parent.appendChild(btnWrapper);

      const pathData = getChamferPathData(w, h, cut);
      const svgBg = `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" fill="none">
        <path d="${pathData}" fill="${fill}" stroke="${stroke}" stroke-width="${state === 'hover' ? '1.5' : '1'}"/>
      </svg>`;
      addSvg(btnWrapper, svgBg, "btn-chamfer-bg");

      const content = figma.createFrame();
      content.name = "btn-content";
      content.resize(w, h);
      content.fills = [];
      content.layoutMode = "HORIZONTAL";
      content.primaryAxisAlignItems = "CENTER";
      content.counterAxisAlignItems = "CENTER";
      content.itemSpacing = 8;
      btnWrapper.appendChild(content);

      makeText(content, label, font, fontSize, textColor, 0.1);
      if (icon && state !== "disabled") {
        makeText(content, icon, FONTS.monoBold, fontSize, textColor);
      } else if (state === "disabled") {
        makeText(content, "🔒", FONTS.monoBold, fontSize, textColor);
      }

      return btnWrapper;
    }

    // ========================================================================
    // 5. ARTBOARD 01 — TOKENS & FOUNDATIONS
    // ========================================================================
    const artboard1 = figma.createFrame();
    artboard1.name = "[Artboard 01] — Tokens & Foundations (RIS v2.8.0)";
    artboard1.x = 0;
    artboard1.y = 0;
    artboard1.resize(1600, 2400);
    artboard1.fills = solidPaint("#0a0c0e");
    artboard1.strokes = solidPaint("#2a343b");
    artboard1.strokeWeight = 1.5;
    artboard1.paddingTop = 48;
    artboard1.paddingBottom = 48;
    artboard1.paddingLeft = 48;
    artboard1.paddingRight = 48;
    artboard1.layoutMode = "VERTICAL";
    artboard1.itemSpacing = 32;
    artboard1.primaryAxisSizingMode = "AUTO";
    artboard1.counterAxisSizingMode = "FIXED";

    // Header 1
    const head1 = figma.createFrame();
    head1.layoutMode = "VERTICAL";
    head1.itemSpacing = 8;
    head1.fills = solidPaint("#0f1316");
    head1.strokes = solidPaint("#3b4750");
    head1.strokeWeight = 1;
    head1.paddingTop = 24;
    head1.paddingBottom = 24;
    head1.paddingLeft = 32;
    head1.paddingRight = 32;
    head1.layoutAlign = "STRETCH";
    artboard1.appendChild(head1);

    makeText(head1, "RELIC INTERFACE SYSTEM (RIS v2.8.0)", FONTS.displayBold, 32, "#e6a23c", 0.05);
    makeText(
      head1,
      "TOKENS & FOUNDATIONS SPECIMEN // DUAL-THEME ARCHITECTURE & WCAG 2.2 CERTIFICATION",
      FONTS.displaySemi,
      13,
      "#6fb3c9",
      0.16
    );
    makeText(
      head1,
      "Forensic instrument aesthetics. Zero rounded corners, 45° angular chamfer vectors, 4 brand pairs, 3 case skins, and full W3C DTCG tokens.",
      FONTS.displayMed,
      12.5,
      "#aab4b2"
    );

    // Section 1A: Dual-Theme Side-by-side Swatches with WCAG Badges
    const dualThemeRow = figma.createFrame();
    dualThemeRow.layoutMode = "HORIZONTAL";
    dualThemeRow.itemSpacing = 24;
    dualThemeRow.layoutAlign = "STRETCH";
    dualThemeRow.fills = [];
    artboard1.appendChild(dualThemeRow);

    // Dark Mode Column
    const darkCol = figma.createFrame();
    darkCol.layoutMode = "VERTICAL";
    darkCol.itemSpacing = 14;
    darkCol.layoutGrow = 1;
    darkCol.fills = solidPaint("#0f1316");
    darkCol.strokes = solidPaint("#2a343b");
    darkCol.paddingTop = 20;
    darkCol.paddingBottom = 20;
    darkCol.paddingLeft = 24;
    darkCol.paddingRight = 24;
    dualThemeRow.appendChild(darkCol);

    makeText(darkCol, "DARK THEME (DEFAULT GRAPHITE)", FONTS.displayBold, 16, "#e6ebe8", 0.08);
    makeText(
      darkCol,
      "Evaluated against surface-1 (#0f1316) for rigorous forensic contrast compliance.",
      FONTS.monoMed,
      10,
      "#98a3a5"
    );

    const darkSwatches = [
      { name: "Void (Backdrop)", hex: "#060708", role: "Deepest backdrop" },
      { name: "Background", hex: "#0a0c0e", role: "App stage" },
      { name: "Surface 1", hex: "#0f1316", role: "Panel container" },
      { name: "Surface 2", hex: "#141a1e", role: "Raised card" },
      { name: "Surface 3", hex: "#1b2228", role: "Elevated row" },
      { name: "Surface 4", hex: "#232c33", role: "Popovers / dialogs" },
      { name: "Line Default", hex: "#2a343b", role: "Structural border" },
      { name: "Line Strong", hex: "#3b4750", role: "Active border" },
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
      box.resize(32, 22);
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
      tagPill.strokes = solidPaint(
        tagData.pass ? (tagData.tier === "AAA" ? "#5fae84" : "#e6a23c") : "#4a555b"
      );
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

    // Light Mode Column
    const lightCol = figma.createFrame();
    lightCol.layoutMode = "VERTICAL";
    lightCol.itemSpacing = 14;
    lightCol.layoutGrow = 1;
    lightCol.fills = solidPaint("#f4f6f7");
    lightCol.strokes = solidPaint("#c3ccd2");
    lightCol.paddingTop = 20;
    lightCol.paddingBottom = 20;
    lightCol.paddingLeft = 24;
    lightCol.paddingRight = 24;
    dualThemeRow.appendChild(lightCol);

    makeText(lightCol, "LIGHT THEME (COLD BLUE-GREY PAPER)", FONTS.displayBold, 16, "#11181c", 0.08);
    makeText(
      lightCol,
      "Base paper: #e9edef | Calibrated ink text >= 4.5:1 WCAG AA certified.",
      FONTS.monoMed,
      10,
      "#5d6b74"
    );

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
      box.resize(32, 22);
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
      tagPill.strokes = solidPaint(
        tagData.pass ? (tagData.tier === "AAA" ? "#1f6e47" : "#8a5a12") : "#97a4ad"
      );
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

    // Section 1B: Brand Matrix & Case Skins
    const matrixSection = figma.createFrame();
    matrixSection.layoutMode = "VERTICAL";
    matrixSection.itemSpacing = 16;
    matrixSection.layoutAlign = "STRETCH";
    matrixSection.fills = solidPaint("#0f1316");
    matrixSection.strokes = solidPaint("#2a343b");
    matrixSection.paddingTop = 20;
    matrixSection.paddingBottom = 20;
    matrixSection.paddingLeft = 24;
    matrixSection.paddingRight = 24;
    artboard1.appendChild(matrixSection);

    makeText(matrixSection, "BRAND MATRIX (4 BRANDS) & CASE-CONTEXT SKINS", FONTS.displayBold, 15, "#e6a23c", 0.1);

    const brandGrid = figma.createFrame();
    brandGrid.layoutMode = "HORIZONTAL";
    brandGrid.itemSpacing = 16;
    brandGrid.layoutAlign = "STRETCH";
    brandGrid.fills = [];
    matrixSection.appendChild(brandGrid);

    const brandList = [
      { name: "RELIC (DEFAULT)", desc: "Workbench & Command", p: "#e6a23c", s: "#6fb3c9", pName: "Yellow", sName: "Cyan" },
      { name: "BIOHUB", desc: "Neural & Biofeedback", p: "#6fb3c9", s: "#5fae84", pName: "Cyan", sName: "Green" },
      { name: "VIVOKEY", desc: "Biometrics & Security", p: "#da6171", s: "#e6a23c", pName: "Red", sName: "Yellow" },
      { name: "NEUTRAL", desc: "Archival Research", p: "#938ac8", s: "#6fb3c9", pName: "Violet", sName: "Cyan" },
    ];

    for (const b of brandList) {
      const card = figma.createFrame();
      card.layoutMode = "VERTICAL";
      card.itemSpacing = 8;
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
      dotP.resize(14, 14);
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
      dotS.resize(14, 14);
      dotS.fills = solidPaint(b.s);
      rowS.appendChild(dotS);
      makeText(rowS, `SEC: ${b.sName} (${b.s})`, FONTS.monoBold, 9.5, "#aab4b2");
    }

    // Skins Row
    const skinsGrid = figma.createFrame();
    skinsGrid.layoutMode = "HORIZONTAL";
    skinsGrid.itemSpacing = 16;
    skinsGrid.layoutAlign = "STRETCH";
    skinsGrid.fills = [];
    matrixSection.appendChild(skinsGrid);

    const skinList = [
      { name: "SEALED DOSSIER", tag: "case-sealed", accent: "#cf5e6b", bg: "#120e12", desc: "Evidentiary red on cold graphite" },
      { name: "FIELD COLLECTION", tag: "case-field", accent: "#d99a4a", bg: "#14120e", desc: "Field sodium amber on anthracite" },
      { name: "NIGHT ARCHIVE", tag: "case-archive", accent: "#be7ecf", bg: "#130f1e", desc: "Deep orchid on purple graphite" },
      { name: "TACTICAL CYBER HUD", tag: "skin-cyber", accent: "#ff4d62", bg: "#070406", desc: "Crimson lines (#6e2d38) + neons" },
    ];

    for (const sk of skinList) {
      const card = figma.createFrame();
      card.layoutMode = "VERTICAL";
      card.itemSpacing = 6;
      card.layoutGrow = 1;
      card.fills = solidPaint(sk.bg);
      card.strokes = solidPaint(sk.accent, 0.4);
      card.strokeWeight = 1.5;
      card.paddingTop = 14;
      card.paddingBottom = 14;
      card.paddingLeft = 16;
      card.paddingRight = 16;
      skinsGrid.appendChild(card);

      makeText(card, sk.name, FONTS.displayBold, 12, sk.accent, 0.1);
      makeText(card, `DATA-SKIN: ${sk.tag}`, FONTS.monoBold, 8.5, "#98a3a5");
      makeText(card, sk.desc, FONTS.displayMed, 10, "#aab4b2");
    }

    // Section 1C: Typography Scale
    const typoSection = figma.createFrame();
    typoSection.layoutMode = "VERTICAL";
    typoSection.itemSpacing = 14;
    typoSection.layoutAlign = "STRETCH";
    typoSection.fills = solidPaint("#0f1316");
    typoSection.strokes = solidPaint("#2a343b");
    typoSection.paddingTop = 20;
    typoSection.paddingBottom = 20;
    typoSection.paddingLeft = 24;
    typoSection.paddingRight = 24;
    artboard1.appendChild(typoSection);

    makeText(typoSection, "TYPOGRAPHY SCALE (ARCHIVO, JETBRAINS MONO, CHAKRA PETCH)", FONTS.displayBold, 15, "#6fb3c9", 0.1);

    const typoItems = [
      { tier: "3XL // DISPLAY HERO", family: "Archivo Bold", size: 44, lh: 44, track: -0.02, sample: "FORENSIC TELEMETRY 01", hex: "#e6ebe8", font: FONTS.displayBold },
      { tier: "2XL // SECTION HEAD", family: "Archivo Bold", size: 32, lh: 34, track: -0.01, sample: "TACTICAL SURVEILLANCE NODE", hex: "#e6ebe8", font: FONTS.displayBold },
      { tier: "XL // CARD TITLE", family: "Archivo SemiBold", size: 24, lh: 26, track: 0, sample: "Biometric Neural Interface Protocol", hex: "#e6ebe8", font: FONTS.displaySemi },
      { tier: "LG // EMPHASIS VAL", family: "Chakra Petch Bold", size: 19, lh: 22, track: 0.08, sample: "AZIMUTH 042° · LOCK ACTIVE [●]", hex: "#ffd83a", font: FONTS.cyberBold },
      { tier: "MD // BASE BODY", family: "Archivo Regular", size: 16, lh: 25, track: 0, sample: "High precision tactical instruments designed for forensic telemetry.", hex: "#aab4b2", font: FONTS.displayReg },
      { tier: "SM // LABELS & UI", family: "Archivo Medium", size: 14, lh: 21, track: 0.04, sample: "SECONDARY INTERFACE METRIC AND PARAMETER DESCRIPTORS", hex: "#98a3a5", font: FONTS.displayMed },
      { tier: "XS // METADATA MONO", family: "JetBrains Mono Bold", size: 11, lh: 14, track: 0.12, sample: "SHA-256: 0x889F...771B · JITTER: <0.18ms · PACKET DROP: 0.00%", hex: "#6fb3c9", font: FONTS.monoBold },
    ];

    for (const t of typoItems) {
      const row = figma.createFrame();
      row.layoutMode = "HORIZONTAL";
      row.itemSpacing = 20;
      row.counterAxisAlignItems = "BASELINE";
      row.layoutAlign = "STRETCH";
      row.fills = [];
      typoSection.appendChild(row);

      const meta = figma.createFrame();
      meta.layoutMode = "VERTICAL";
      meta.itemSpacing = 2;
      meta.resize(260, 40);
      meta.fills = [];
      row.appendChild(meta);

      makeText(meta, t.tier, FONTS.monoBold, 10, "#e6a23c");
      makeText(meta, `${t.family} · ${t.size}px / ${t.lh}px`, FONTS.monoMed, 9, "#98a3a5");

      const spec = makeText(row, t.sample, t.font, t.size, t.hex, t.track);
      spec.layoutGrow = 1;
    }

    // Section 1D: 45° Chamfer Cuts Scale (6px, 10px, 16px)
    const chamferSection = figma.createFrame();
    chamferSection.layoutMode = "VERTICAL";
    chamferSection.itemSpacing = 16;
    chamferSection.layoutAlign = "STRETCH";
    chamferSection.fills = solidPaint("#0f1316");
    chamferSection.strokes = solidPaint("#2a343b");
    chamferSection.paddingTop = 20;
    chamferSection.paddingBottom = 20;
    chamferSection.paddingLeft = 24;
    chamferSection.paddingRight = 24;
    artboard1.appendChild(chamferSection);

    makeText(chamferSection, "45° ANGULAR CHAMFER SCALE (GEOMETRIC FOUNDATIONS)", FONTS.displayBold, 15, "#e6a23c", 0.1);
    makeText(
      chamferSection,
      "Zero rounded corners. Top-right and bottom-left corners are cut at pure 45° angles. Hard edges preserve tactical forensic feel.",
      FONTS.monoMed,
      10,
      "#98a3a5"
    );

    const chamferRow = figma.createFrame();
    chamferRow.layoutMode = "HORIZONTAL";
    chamferRow.itemSpacing = 20;
    chamferRow.layoutAlign = "STRETCH";
    chamferRow.fills = [];
    chamferSection.appendChild(chamferRow);

    const chamferSpecs = [
      {
        name: "SMALL CLIP (6PX)",
        token: "--ris-clip-sm",
        cut: 6,
        w: 180,
        h: 90,
        usage: "Buttons, chips, text inputs, switch thumbs, tabs",
        color: "#e6a23c",
      },
      {
        name: "MEDIUM CLIP (10PX)",
        token: "--ris-clip",
        cut: 10,
        w: 240,
        h: 110,
        usage: "Standard telemetry panels, KPI cards, table containers",
        color: "#6fb3c9",
      },
      {
        name: "LARGE CLIP (16PX)",
        token: "--ris-clip-lg",
        cut: 16,
        w: 300,
        h: 130,
        usage: "Modals, hero displays, drawers, tactical cockpit frames",
        color: "#5fae84",
      },
    ];

    for (const cs of chamferSpecs) {
      const card = figma.createFrame();
      card.layoutMode = "VERTICAL";
      card.itemSpacing = 10;
      card.layoutGrow = 1;
      card.fills = solidPaint("#141a1e");
      card.strokes = solidPaint("#2a343b");
      card.paddingTop = 16;
      card.paddingBottom = 16;
      card.paddingLeft = 16;
      card.paddingRight = 16;
      chamferRow.appendChild(card);

      makeText(card, cs.name, FONTS.displayBold, 13, cs.color, 0.08);
      makeText(card, `CSS TOKEN: ${cs.token} (${cs.cut}px)`, FONTS.monoBold, 9.5, "#e6ebe8");
      makeText(card, cs.usage, FONTS.displayMed, 10, "#98a3a5");

      // Vector chamfer diagram
      const diagSvg = `<svg width="240" height="70" viewBox="0 0 240 70" fill="none">
        <path d="${getChamferPathData(240, 70, cs.cut)}" fill="#0f1316" stroke="${cs.color}" stroke-width="1.5"/>
        <line x1="${240 - cs.cut}" y1="0" x2="240" y2="${cs.cut}" stroke="#ffd83a" stroke-width="2"/>
        <line x1="${cs.cut}" y1="70" x2="0" y2="${70 - cs.cut}" stroke="#ffd83a" stroke-width="2"/>
        <text x="120" y="40" fill="${cs.color}" font-family="monospace" font-size="10" font-weight="bold" text-anchor="middle">CUT: 45° × ${cs.cut}px</text>
      </svg>`;
      addSvg(card, diagSvg, `chamfer-${cs.cut}px-diagram`);
    }

    // Section 1E: Spacing Scale (4px to 48px)
    const spaceSection = figma.createFrame();
    spaceSection.layoutMode = "VERTICAL";
    spaceSection.itemSpacing = 14;
    spaceSection.layoutAlign = "STRETCH";
    spaceSection.fills = solidPaint("#0f1316");
    spaceSection.strokes = solidPaint("#2a343b");
    spaceSection.paddingTop = 20;
    spaceSection.paddingBottom = 20;
    spaceSection.paddingLeft = 24;
    spaceSection.paddingRight = 24;
    artboard1.appendChild(spaceSection);

    makeText(spaceSection, "SPACING SCALE (4PX TO 48PX)", FONTS.displayBold, 15, "#6fb3c9", 0.1);

    const spaceSteps = [
      { id: "s1", val: 4, token: "--ris-space-1", role: "Micro gap / icon padding" },
      { id: "s2", val: 8, token: "--ris-space-2", role: "Tight element grouping" },
      { id: "s3", val: 12, token: "--ris-space-3", role: "Compact component inset" },
      { id: "s4", val: 16, token: "--ris-space-4", role: "Card inner padding" },
      { id: "s5", val: 20, token: "--ris-space-5", role: "Medium container padding" },
      { id: "s6", val: 24, token: "--ris-space-6", role: "Panel padding / section sub-spacing" },
      { id: "s7", val: 32, token: "--ris-space-7", role: "Major section spacing" },
      { id: "s8", val: 48, token: "--ris-space-8", role: "Artboard margins & layout gutters" },
    ];

    const spaceGrid = figma.createFrame();
    spaceGrid.layoutMode = "VERTICAL";
    spaceGrid.itemSpacing = 8;
    spaceGrid.layoutAlign = "STRETCH";
    spaceGrid.fills = [];
    spaceSection.appendChild(spaceGrid);

    for (const sp of spaceSteps) {
      const sRow = figma.createFrame();
      sRow.layoutMode = "HORIZONTAL";
      sRow.itemSpacing = 16;
      sRow.counterAxisAlignItems = "CENTER";
      sRow.layoutAlign = "STRETCH";
      sRow.fills = [];
      spaceGrid.appendChild(sRow);

      const sLabel = figma.createFrame();
      sLabel.resize(180, 20);
      sLabel.fills = [];
      sRow.appendChild(sLabel);
      makeText(sLabel, `${sp.id.toUpperCase()} · ${sp.val}PX (${sp.token})`, FONTS.monoBold, 9.5, "#e6ebe8");

      const sBar = figma.createFrame();
      sBar.resize(sp.val * 6, 16);
      sBar.fills = solidPaint("#e6a23c", 0.7);
      sBar.strokes = solidPaint("#e6a23c");
      sBar.strokeWeight = 1;
      sRow.appendChild(sBar);

      makeText(sRow, `// ${sp.role}`, FONTS.monoMed, 9, "#98a3a5");
    }

    // ========================================================================
    // 6. ARTBOARD 02 — COMPONENT MASTER LIBRARY
    // ========================================================================
    const artboard2 = figma.createFrame();
    artboard2.name = "[Artboard 02] — Component Master Library (RIS v2.8.0)";
    artboard2.x = 1680;
    artboard2.y = 0;
    artboard2.resize(1720, 2600);
    artboard2.fills = solidPaint("#0a0c0e");
    artboard2.strokes = solidPaint("#2a343b");
    artboard2.strokeWeight = 1.5;
    artboard2.paddingTop = 48;
    artboard2.paddingBottom = 48;
    artboard2.paddingLeft = 48;
    artboard2.paddingRight = 48;
    artboard2.layoutMode = "VERTICAL";
    artboard2.itemSpacing = 32;
    artboard2.primaryAxisSizingMode = "AUTO";
    artboard2.counterAxisSizingMode = "FIXED";

    // Header 2
    const head2 = figma.createFrame();
    head2.layoutMode = "VERTICAL";
    head2.itemSpacing = 8;
    head2.fills = solidPaint("#0f1316");
    head2.strokes = solidPaint("#3b4750");
    head2.strokeWeight = 1;
    head2.paddingTop = 24;
    head2.paddingBottom = 24;
    head2.paddingLeft = 32;
    head2.paddingRight = 32;
    head2.layoutAlign = "STRETCH";
    artboard2.appendChild(head2);

    makeText(head2, "COMPONENT MASTER LIBRARY", FONTS.displayBold, 30, "#e6a23c", 0.05);
    makeText(
      head2,
      "TACTICAL 45° CHAMFER VECTORS // COMPLETE BUTTON SETS, PANELS, SWITCHES & CHIPS",
      FONTS.displaySemi,
      13,
      "#6fb3c9",
      0.16
    );

    // Section 2A: Button Component Set Matrix (Variants × States × Sizes)
    const btnSection = figma.createFrame();
    btnSection.layoutMode = "VERTICAL";
    btnSection.itemSpacing = 16;
    btnSection.layoutAlign = "STRETCH";
    btnSection.fills = solidPaint("#0f1316");
    btnSection.strokes = solidPaint("#2a343b");
    btnSection.paddingTop = 20;
    btnSection.paddingBottom = 20;
    btnSection.paddingLeft = 24;
    btnSection.paddingRight = 24;
    artboard2.appendChild(btnSection);

    makeText(btnSection, "01. BUTTON COMPONENT SET MATRIX (ALL VARIANTS & STATES)", FONTS.displayBold, 15, "#e6a23c", 0.1);
    makeText(btnSection, "Variants: Primary, Default, Secondary, Danger, Cyber Neon. States: Default, Hover, Active, Disabled.", FONTS.monoMed, 10, "#98a3a5");

    const btnVariants = ["primary", "default", "secondary", "danger", "cyber"];
    for (const v of btnVariants) {
      const vRow = figma.createFrame();
      vRow.layoutMode = "HORIZONTAL";
      vRow.itemSpacing = 16;
      vRow.counterAxisAlignItems = "CENTER";
      vRow.fills = [];
      btnSection.appendChild(vRow);

      const vLabel = figma.createFrame();
      vLabel.resize(130, 20);
      vLabel.fills = [];
      vRow.appendChild(vLabel);
      makeText(vLabel, `${v.toUpperCase()}:`, FONTS.monoBold, 11, "#98a3a5");

      createChamferButton({ parent: vRow, label: "DEFAULT", variant: v, size: "md", state: "default" });
      createChamferButton({ parent: vRow, label: "HOVER", variant: v, size: "md", state: "hover" });
      createChamferButton({ parent: vRow, label: "ACTIVE", variant: v, size: "md", state: "active" });
      createChamferButton({ parent: vRow, label: "DISABLED", variant: v, size: "md", state: "disabled" });
    }

    // Sizes Row
    const sizeRow = figma.createFrame();
    sizeRow.layoutMode = "HORIZONTAL";
    sizeRow.itemSpacing = 16;
    sizeRow.counterAxisAlignItems = "CENTER";
    sizeRow.fills = [];
    btnSection.appendChild(sizeRow);

    const sLabel = figma.createFrame();
    sLabel.resize(130, 20);
    sLabel.fills = [];
    sizeRow.appendChild(sLabel);
    makeText(sLabel, "SIZE SCALES:", FONTS.monoBold, 11, "#e6a23c");

    createChamferButton({ parent: sizeRow, label: "SM (28PX)", variant: "primary", size: "sm" });
    createChamferButton({ parent: sizeRow, label: "MD (36PX)", variant: "primary", size: "md" });
    createChamferButton({ parent: sizeRow, label: "LG (46PX)", variant: "primary", size: "lg" });

    // Section 2B: Tactical Chamfered Panels with Corner Brackets
    const panelSection = figma.createFrame();
    panelSection.layoutMode = "VERTICAL";
    panelSection.itemSpacing = 16;
    panelSection.layoutAlign = "STRETCH";
    panelSection.fills = solidPaint("#0f1316");
    panelSection.strokes = solidPaint("#2a343b");
    panelSection.paddingTop = 20;
    panelSection.paddingBottom = 20;
    panelSection.paddingLeft = 24;
    panelSection.paddingRight = 24;
    artboard2.appendChild(panelSection);

    makeText(panelSection, "02. TACTICAL CHAMFERED PANELS WITH CORNER BRACKETS", FONTS.displayBold, 15, "#6fb3c9", 0.1);

    const panelRow = figma.createFrame();
    panelRow.layoutMode = "HORIZONTAL";
    panelRow.itemSpacing = 24;
    panelRow.layoutAlign = "STRETCH";
    panelRow.fills = [];
    panelSection.appendChild(panelRow);

    // Panel 1: Active Telemetry
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

    const p1Head = figma.createFrame();
    p1Head.layoutMode = "HORIZONTAL";
    p1Head.counterAxisAlignItems = "CENTER";
    p1Head.itemSpacing = 12;
    p1Head.layoutAlign = "STRETCH";
    p1Head.fills = [];
    p1.appendChild(p1Head);

    addSvg(
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

    const p1Body = figma.createFrame();
    p1Body.layoutMode = "VERTICAL";
    p1Body.itemSpacing = 6;
    p1Body.layoutAlign = "STRETCH";
    p1Body.fills = [];
    p1.appendChild(p1Body);
    makeText(p1Body, "INGESTION STREAM: PROTOCOL_6520 // NODE-01", FONTS.monoMed, 10, "#98a3a5");
    makeText(p1Body, "BANDWIDTH: 1.44 GB/s — JITTER: <0.2ms", FONTS.monoBold, 11, "#6fb3c9");
    makeText(p1Body, "ENCRYPTION HASH: 0x889F...771B [VALID]", FONTS.monoMed, 10, "#aab4b2");

    const p1Foot = figma.createFrame();
    p1Foot.layoutMode = "HORIZONTAL";
    p1Foot.itemSpacing = 12;
    p1Foot.counterAxisAlignItems = "CENTER";
    p1Foot.fills = [];
    p1.appendChild(p1Foot);
    createChamferButton({ parent: p1Foot, label: "PURGE", variant: "default", size: "sm" });
    createChamferButton({ parent: p1Foot, label: "SYNC", variant: "primary", size: "sm" });

    // Panel 2: Case-Sealed Dossier
    const p2 = figma.createFrame();
    p2.name = "Panel / Case-Sealed Dossier";
    p2.layoutMode = "VERTICAL";
    p2.itemSpacing = 14;
    p2.layoutGrow = 1;
    p2.fills = solidPaint("#120e12");
    p2.strokes = solidPaint("#cf5e6b");
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
    makeText(p2Head, "RESTRICTED CASE DOSSIER", FONTS.displayBold, 13, "#cf5e6b", 0.08);

    const chipSealed = figma.createFrame();
    chipSealed.paddingLeft = 8;
    chipSealed.paddingRight = 8;
    chipSealed.paddingTop = 3;
    chipSealed.paddingBottom = 3;
    chipSealed.fills = solidPaint("#1c161d");
    chipSealed.strokes = solidPaint("#cf5e6b");
    chipSealed.strokeWeight = 1;
    p2Head.appendChild(chipSealed);
    makeText(chipSealed, "SEALED [🔒]", FONTS.monoBold, 9, "#cf5e6b");

    const p2Body = figma.createFrame();
    p2Body.layoutMode = "VERTICAL";
    p2Body.itemSpacing = 6;
    p2Body.layoutAlign = "STRETCH";
    p2Body.fills = [];
    p2.appendChild(p2Body);
    makeText(p2Body, "DOSSIER ID: SEC-8841-B // CLASSIFIED LEVEL 4", FONTS.monoMed, 10, "#98a3a5");
    makeText(p2Body, "TAMPER DETECT: ZERO MUTATIONS [AUDITED]", FONTS.monoBold, 11, "#da6171");
    makeText(p2Body, "ARCHIVE CUSTODY: CRYPTOGRAPHIC TIME-LOCK", FONTS.monoMed, 10, "#aab4b2");

    const p2Foot = figma.createFrame();
    p2Foot.layoutMode = "HORIZONTAL";
    p2Foot.itemSpacing = 12;
    p2Foot.counterAxisAlignItems = "CENTER";
    p2Foot.fills = [];
    p2.appendChild(p2Foot);
    createChamferButton({ parent: p2Foot, label: "VERIFY SEAL", variant: "default", size: "sm" });
    createChamferButton({ parent: p2Foot, label: "ACCESS LOG", variant: "danger", size: "sm", icon: "⚠" });

    // Section 2C: Tactical Mechanical Switches
    const switchSection = figma.createFrame();
    switchSection.layoutMode = "VERTICAL";
    switchSection.itemSpacing = 16;
    switchSection.layoutAlign = "STRETCH";
    switchSection.fills = solidPaint("#0f1316");
    switchSection.strokes = solidPaint("#2a343b");
    switchSection.paddingTop = 20;
    switchSection.paddingBottom = 20;
    switchSection.paddingLeft = 24;
    switchSection.paddingRight = 24;
    artboard2.appendChild(switchSection);

    makeText(switchSection, "03. TACTICAL MECHANICAL SWITCHES (OFF / ON / ARMED)", FONTS.displayBold, 15, "#e6a23c", 0.1);

    const switchRow = figma.createFrame();
    switchRow.layoutMode = "HORIZONTAL";
    switchRow.itemSpacing = 28;
    switchRow.counterAxisAlignItems = "CENTER";
    switchRow.fills = [];
    switchSection.appendChild(switchRow);

    // Switch OFF
    const sOff = figma.createFrame();
    sOff.layoutMode = "HORIZONTAL";
    sOff.itemSpacing = 12;
    sOff.counterAxisAlignItems = "CENTER";
    sOff.fills = [];
    switchRow.appendChild(sOff);

    addSvg(
      sOff,
      `<svg width="90" height="32" viewBox="0 0 90 32" fill="none">
        <rect width="90" height="32" fill="#0f1316" stroke="#2a343b" stroke-width="1.5"/>
        <polygon points="4,4 32,4 35,7 35,25 32,28 4,28 1,25 1,7" fill="#232c33"/>
        <line x1="16" y1="10" x2="16" y2="22" stroke="#4a555b" stroke-width="1.5"/>
        <line x1="20" y1="10" x2="20" y2="22" stroke="#4a555b" stroke-width="1.5"/>
      </svg>`,
      "switch-off"
    );
    makeText(sOff, "STANDBY [OFF]", FONTS.monoBold, 10, "#98a3a5");

    // Switch ON (Amber)
    const sOn = figma.createFrame();
    sOn.layoutMode = "HORIZONTAL";
    sOn.itemSpacing = 12;
    sOn.counterAxisAlignItems = "CENTER";
    sOn.fills = [];
    switchRow.appendChild(sOn);

    addSvg(
      sOn,
      `<svg width="90" height="32" viewBox="0 0 90 32" fill="none">
        <rect width="90" height="32" fill="#0f1316" stroke="#e6a23c" stroke-width="1.5"/>
        <rect x="4" y="4" width="50" height="24" fill="#e6a23c" fill-opacity="0.15"/>
        <polygon points="56,4 86,4 89,7 89,25 86,28 56,28 53,25 53,7" fill="#e6a23c"/>
        <line x1="69" y1="10" x2="69" y2="22" stroke="#07090a" stroke-width="1.5"/>
        <line x1="73" y1="10" x2="73" y2="22" stroke="#07090a" stroke-width="1.5"/>
      </svg>`,
      "switch-on-amber"
    );
    makeText(sOn, "ARMED [ON]", FONTS.monoBold, 10, "#e6a23c");

    // Switch ON (Cyan Cyber)
    const sCyber = figma.createFrame();
    sCyber.layoutMode = "HORIZONTAL";
    sCyber.itemSpacing = 12;
    sCyber.counterAxisAlignItems = "CENTER";
    sCyber.fills = [];
    switchRow.appendChild(sCyber);

    addSvg(
      sCyber,
      `<svg width="90" height="32" viewBox="0 0 90 32" fill="none">
        <rect width="90" height="32" fill="#0f1316" stroke="#3df0ff" stroke-width="1.5"/>
        <rect x="4" y="4" width="50" height="24" fill="#3df0ff" fill-opacity="0.15"/>
        <polygon points="56,4 86,4 89,7 89,25 86,28 56,28 53,25 53,7" fill="#3df0ff"/>
        <line x1="69" y1="10" x2="69" y2="22" stroke="#07090a" stroke-width="1.5"/>
        <line x1="73" y1="10" x2="73" y2="22" stroke="#07090a" stroke-width="1.5"/>
      </svg>`,
      "switch-on-cyan"
    );
    makeText(sCyber, "RADAR SWEEP [ACTIVE]", FONTS.monoBold, 10, "#3df0ff");

    // Section 2D: Status Chips & Badges Collection
    const chipSection = figma.createFrame();
    chipSection.layoutMode = "VERTICAL";
    chipSection.itemSpacing = 16;
    chipSection.layoutAlign = "STRETCH";
    chipSection.fills = solidPaint("#0f1316");
    chipSection.strokes = solidPaint("#2a343b");
    chipSection.paddingTop = 20;
    chipSection.paddingBottom = 20;
    chipSection.paddingLeft = 24;
    chipSection.paddingRight = 24;
    artboard2.appendChild(chipSection);

    makeText(chipSection, "04. STATUS CHIPS & TELEMETRY BADGES", FONTS.displayBold, 15, "#6fb3c9", 0.1);

    const chipRow1 = figma.createFrame();
    chipRow1.layoutMode = "HORIZONTAL";
    chipRow1.itemSpacing = 12;
    chipRow1.counterAxisAlignItems = "CENTER";
    chipRow1.fills = [];
    chipSection.appendChild(chipRow1);

    const chipList = [
      { text: "LIVE [●]", stroke: "#5fae84", textHex: "#5fae84" },
      { text: "STABLE [✓]", stroke: "#6fb3c9", textHex: "#6fb3c9" },
      { text: "ELEVATED [▲]", stroke: "#ffd83a", textHex: "#ffd83a" },
      { text: "CRITICAL [⚠]", stroke: "#da6171", textHex: "#da6171" },
      { text: "DEFCON 2", stroke: "#da6171", textHex: "#da6171" },
      { text: "SEALED [🔒]", stroke: "#cf5e6b", textHex: "#cf5e6b" },
      { text: "AUTH_REQ", stroke: "#e6a23c", textHex: "#e6a23c" },
      { text: "GUMI RT", stroke: "#b274c0", textHex: "#b274c0" },
    ];

    for (const c of chipList) {
      const pill = figma.createFrame();
      pill.layoutMode = "HORIZONTAL";
      pill.counterAxisAlignItems = "CENTER";
      pill.paddingLeft = 10;
      pill.paddingRight = 10;
      pill.paddingTop = 4;
      pill.paddingBottom = 4;
      pill.fills = solidPaint("#141a1e");
      pill.strokes = solidPaint(c.stroke);
      pill.strokeWeight = 1;
      chipRow1.appendChild(pill);
      makeText(pill, c.text, FONTS.monoBold, 9.5, c.textHex);
    }

    // Section 2E: Tactical Accordions
    const accSection = figma.createFrame();
    accSection.layoutMode = "VERTICAL";
    accSection.itemSpacing = 14;
    accSection.layoutAlign = "STRETCH";
    accSection.fills = solidPaint("#0f1316");
    accSection.strokes = solidPaint("#2a343b");
    accSection.paddingTop = 20;
    accSection.paddingBottom = 20;
    accSection.paddingLeft = 24;
    accSection.paddingRight = 24;
    artboard2.appendChild(accSection);

    makeText(accSection, "05. TACTICAL ACCORDIONS (COLLAPSED & EXPANDED)", FONTS.displayBold, 15, "#e6a23c", 0.1);

    // Collapsed Accordion
    const accClosed = figma.createFrame();
    accClosed.layoutMode = "HORIZONTAL";
    accClosed.primaryAxisAlignItems = "SPACE_BETWEEN";
    accClosed.counterAxisAlignItems = "CENTER";
    accClosed.layoutAlign = "STRETCH";
    accClosed.fills = solidPaint("#141a1e");
    accClosed.strokes = solidPaint("#2a343b");
    accClosed.strokeWeight = 1;
    accClosed.paddingTop = 14;
    accClosed.paddingBottom = 14;
    accClosed.paddingLeft = 18;
    accClosed.paddingRight = 18;
    accSection.appendChild(accClosed);

    const accClosedLeft = figma.createFrame();
    accClosedLeft.layoutMode = "HORIZONTAL";
    accClosedLeft.itemSpacing = 10;
    accClosedLeft.counterAxisAlignItems = "CENTER";
    accClosedLeft.fills = [];
    accClosed.appendChild(accClosedLeft);
    makeText(accClosedLeft, "[01 // TELEMETRY]", FONTS.monoBold, 11, "#98a3a5");
    makeText(accClosedLeft, "NODE-ALPHA INGESTION PARAMETERS", FONTS.displayBold, 12.5, "#e6ebe8");

    const accClosedRight = figma.createFrame();
    accClosedRight.layoutMode = "HORIZONTAL";
    accClosedRight.itemSpacing = 10;
    accClosedRight.counterAxisAlignItems = "CENTER";
    accClosedRight.fills = [];
    accClosed.appendChild(accClosedRight);
    makeText(accClosedRight, "SYNCED [●]", FONTS.monoBold, 9.5, "#5fae84");
    makeText(accClosedRight, "▼", FONTS.monoBold, 10, "#98a3a5");

    // Expanded Accordion
    const accOpen = figma.createFrame();
    accOpen.layoutMode = "VERTICAL";
    accOpen.itemSpacing = 12;
    accOpen.layoutAlign = "STRETCH";
    accOpen.fills = solidPaint("#141a1e");
    accOpen.strokes = solidPaint("#e6a23c", 0.6);
    accOpen.strokeWeight = 1.2;
    accOpen.paddingTop = 16;
    accOpen.paddingBottom = 16;
    accOpen.paddingLeft = 18;
    accOpen.paddingRight = 18;
    accSection.appendChild(accOpen);

    const accOpenHead = figma.createFrame();
    accOpenHead.layoutMode = "HORIZONTAL";
    accOpenHead.primaryAxisAlignItems = "SPACE_BETWEEN";
    accOpenHead.counterAxisAlignItems = "CENTER";
    accOpenHead.layoutAlign = "STRETCH";
    accOpenHead.fills = [];
    accOpen.appendChild(accOpenHead);

    const accOpenLeft = figma.createFrame();
    accOpenLeft.layoutMode = "HORIZONTAL";
    accOpenLeft.itemSpacing = 10;
    accOpenLeft.counterAxisAlignItems = "CENTER";
    accOpenLeft.fills = [];
    accOpenHead.appendChild(accOpenLeft);

    const accRail = figma.createFrame();
    accRail.resize(3, 14);
    accRail.fills = solidPaint("#e6a23c");
    accOpenLeft.appendChild(accRail);
    makeText(accOpenLeft, "[02 // NEURAL SENSORS]", FONTS.monoBold, 11, "#e6a23c");
    makeText(accOpenLeft, "BIOMETRIC AUTHENTICATION MATRIX", FONTS.displayBold, 12.5, "#e6ebe8");

    makeText(accOpenHead, "▲", FONTS.monoBold, 10, "#e6a23c");

    const accOpenBody = figma.createFrame();
    accOpenBody.layoutMode = "VERTICAL";
    accOpenBody.itemSpacing = 6;
    accOpenBody.layoutAlign = "STRETCH";
    accOpenBody.fills = solidPaint("#0f1316");
    accOpenBody.paddingTop = 12;
    accOpenBody.paddingBottom = 12;
    accOpenBody.paddingLeft = 14;
    accOpenBody.paddingRight = 14;
    accOpen.appendChild(accOpenBody);

    makeText(accOpenBody, "SENSOR NODE 0x01: ONLINE · LATENCY 0.18ms · 128-BIT TELEMETRY KEY VALIDATED", FONTS.monoMed, 10, "#98a3a5");
    makeText(accOpenBody, "PASSIVE RECORDING ACTIVE // WCAG LEVEL AAA FORENSIC DISPLAY LOCK", FONTS.monoBold, 10.5, "#6fb3c9");

    // Section 2F: Mobile Tactical Bottom Sheet (<768px Drawer)
    const sheetSection = figma.createFrame();
    sheetSection.layoutMode = "VERTICAL";
    sheetSection.itemSpacing = 14;
    sheetSection.layoutAlign = "STRETCH";
    sheetSection.fills = solidPaint("#0f1316");
    sheetSection.strokes = solidPaint("#2a343b");
    sheetSection.paddingTop = 20;
    sheetSection.paddingBottom = 20;
    sheetSection.paddingLeft = 24;
    sheetSection.paddingRight = 24;
    artboard2.appendChild(sheetSection);

    makeText(sheetSection, "06. MOBILE TACTICAL BOTTOM SHEET (<768PX TOUCH DRAWER)", FONTS.displayBold, 15, "#6fb3c9", 0.1);

    const sheetWrapper = figma.createFrame();
    sheetWrapper.name = "Mobile Bottom Sheet Specimen";
    sheetWrapper.resize(390, 260);
    sheetWrapper.fills = solidPaint("#141a1e");
    sheetWrapper.strokes = solidPaint("#3b4750");
    sheetWrapper.strokeWeight = 1.5;
    sheetWrapper.paddingTop = 12;
    sheetWrapper.paddingBottom = 16;
    sheetWrapper.paddingLeft = 16;
    sheetWrapper.paddingRight = 16;
    sheetWrapper.layoutMode = "VERTICAL";
    sheetWrapper.itemSpacing = 12;
    sheetSection.appendChild(sheetWrapper);

    const handle = figma.createFrame();
    handle.resize(44, 4);
    handle.cornerRadius = 2;
    handle.fills = solidPaint("#4a555b");
    handle.layoutAlign = "CENTER";
    sheetWrapper.appendChild(handle);

    const sheetHead = figma.createFrame();
    sheetHead.layoutMode = "HORIZONTAL";
    sheetHead.primaryAxisAlignItems = "SPACE_BETWEEN";
    sheetHead.counterAxisAlignItems = "CENTER";
    sheetHead.layoutAlign = "STRETCH";
    sheetHead.fills = [];
    sheetWrapper.appendChild(sheetHead);

    makeText(sheetHead, "TACTICAL OVERRIDE", FONTS.displayBold, 13, "#e6ebe8", 0.08);

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

    const sheetBody = figma.createFrame();
    sheetBody.layoutMode = "VERTICAL";
    sheetBody.itemSpacing = 8;
    sheetBody.layoutGrow = 1;
    sheetBody.layoutAlign = "STRETCH";
    sheetBody.fills = solidPaint("#0f1316");
    sheetBody.paddingTop = 10;
    sheetBody.paddingBottom = 10;
    sheetBody.paddingLeft = 12;
    sheetBody.paddingRight = 12;
    sheetWrapper.appendChild(sheetBody);

    makeText(sheetBody, "CRITICAL AUTHORIZATION STEP", FONTS.displaySemi, 11, "#ffd83a");
    makeText(
      sheetBody,
      "Initiating manual override will temporarily bypass automated forensic data locks.",
      FONTS.displayMed,
      10,
      "#aab4b2"
    );

    const sheetFoot = figma.createFrame();
    sheetFoot.layoutMode = "HORIZONTAL";
    sheetFoot.itemSpacing = 12;
    sheetFoot.layoutAlign = "STRETCH";
    sheetFoot.fills = [];
    sheetWrapper.appendChild(sheetFoot);

    createChamferButton({ parent: sheetFoot, label: "CANCEL", variant: "outline", size: "sm" });
    createChamferButton({ parent: sheetFoot, label: "CONFIRM OVERRIDE", variant: "danger", size: "sm", icon: "⚡" });

    // ========================================================================
    // 7. ARTBOARD 03 — PRE-ASSEMBLED LAYOUTS
    // ========================================================================
    const artboard3 = figma.createFrame();
    artboard3.name = "[Artboard 03] — Pre-assembled Layouts (RIS v2.8.0)";
    artboard3.x = 3450;
    artboard3.y = 0;
    artboard3.resize(2200, 2600);
    artboard3.fills = solidPaint("#0a0c0e");
    artboard3.strokes = solidPaint("#2a343b");
    artboard3.strokeWeight = 1.5;
    artboard3.paddingTop = 48;
    artboard3.paddingBottom = 48;
    artboard3.paddingLeft = 48;
    artboard3.paddingRight = 48;
    artboard3.layoutMode = "VERTICAL";
    artboard3.itemSpacing = 36;
    artboard3.primaryAxisSizingMode = "AUTO";
    artboard3.counterAxisSizingMode = "FIXED";

    // Header 3
    const head3 = figma.createFrame();
    head3.layoutMode = "VERTICAL";
    head3.itemSpacing = 8;
    head3.fills = solidPaint("#0f1316");
    head3.strokes = solidPaint("#3b4750");
    head3.strokeWeight = 1;
    head3.paddingTop = 24;
    head3.paddingBottom = 24;
    head3.paddingLeft = 32;
    head3.paddingRight = 32;
    head3.layoutAlign = "STRETCH";
    artboard3.appendChild(head3);

    makeText(head3, "PRE-ASSEMBLED FORENSIC WORKSPACES & TOUCH SHELLS", FONTS.displayBold, 30, "#e6a23c", 0.05);
    makeText(
      head3,
      "TURNKEY PRODUCTION FRAMES // 1440PX DESKTOP DASHBOARD, 390PX MOBILE TOUCH SHELL & DUAL-THEME ENGINE",
      FONTS.displaySemi,
      13,
      "#6fb3c9",
      0.16
    );

    // Layout 1: 1440px Desktop Forensic Dashboard Frame
    const deskSection = figma.createFrame();
    deskSection.layoutMode = "VERTICAL";
    deskSection.itemSpacing = 14;
    deskSection.layoutAlign = "STRETCH";
    deskSection.fills = [];
    artboard3.appendChild(deskSection);

    makeText(deskSection, "LAYOUT 01: 1440PX DESKTOP FORENSIC TELEMETRY DASHBOARD", FONTS.displayBold, 16, "#e6ebe8", 0.08);

    const deskFrame = figma.createFrame();
    deskFrame.name = "Desktop 1440px / Forensic Dashboard";
    deskFrame.resize(1440, 880);
    deskFrame.fills = solidPaint("#060708");
    deskFrame.strokes = solidPaint("#2a343b");
    deskFrame.strokeWeight = 1.5;
    deskFrame.layoutMode = "VERTICAL";
    deskSection.appendChild(deskFrame);

    // Topbar (52px)
    const topBar = figma.createFrame();
    topBar.resize(1440, 52);
    topBar.layoutMode = "HORIZONTAL";
    topBar.primaryAxisAlignItems = "SPACE_BETWEEN";
    topBar.counterAxisAlignItems = "CENTER";
    topBar.paddingLeft = 24;
    topBar.paddingRight = 24;
    topBar.fills = solidPaint("#0f1316");
    topBar.strokes = solidPaint("#2a343b");
    topBar.strokeWeight = 1;
    deskFrame.appendChild(topBar);

    const topBarLeft = figma.createFrame();
    topBarLeft.layoutMode = "HORIZONTAL";
    topBarLeft.itemSpacing = 16;
    topBarLeft.counterAxisAlignItems = "CENTER";
    topBarLeft.fills = [];
    topBar.appendChild(topBarLeft);

    makeText(topBarLeft, "[RIS v2.8.0]", FONTS.cyberBold, 16, "#e6a23c", 0.1);
    makeText(topBarLeft, "RELIC // CORE TELEMETRY", FONTS.displayBold, 12, "#e6ebe8", 0.08);
    makeText(topBarLeft, "NODE-ALPHA // AZ-042", FONTS.monoMed, 11, "#98a3a5");

    const topBarRight = figma.createFrame();
    topBarRight.layoutMode = "HORIZONTAL";
    topBarRight.itemSpacing = 16;
    topBarRight.counterAxisAlignItems = "CENTER";
    topBarRight.fills = [];
    topBar.appendChild(topBarRight);

    makeText(topBarRight, "2026-09-08 19:34:55 UTC", FONTS.monoMed, 11, "#6fb3c9");

    const topChip = figma.createFrame();
    topChip.paddingLeft = 8;
    topChip.paddingRight = 8;
    topChip.paddingTop = 3;
    topChip.paddingBottom = 3;
    topChip.fills = solidPaint("#141a1e");
    topChip.strokes = solidPaint("#5fae84");
    topChip.strokeWeight = 1;
    topBarRight.appendChild(topChip);
    makeText(topChip, "ALL NODES ONLINE [●]", FONTS.monoBold, 9, "#5fae84");

    createChamferButton({ parent: topBarRight, label: "EXPORT", variant: "primary", size: "sm" });

    // Workspace Body (Rail + Content)
    const deskBody = figma.createFrame();
    deskBody.layoutMode = "HORIZONTAL";
    deskBody.layoutGrow = 1;
    deskBody.layoutAlign = "STRETCH";
    deskBody.fills = [];
    deskFrame.appendChild(deskBody);

    // Left Tactical Rail (64px)
    const deskRail = figma.createFrame();
    deskRail.resize(64, 796);
    deskRail.layoutMode = "VERTICAL";
    deskRail.itemSpacing = 20;
    deskRail.counterAxisAlignItems = "CENTER";
    deskRail.paddingTop = 20;
    deskRail.fills = solidPaint("#0f1316");
    deskRail.strokes = solidPaint("#2a343b");
    deskRail.strokeWeight = 1;
    deskBody.appendChild(deskRail);

    const railIcons = ["RAD", "TEL", "DOC", "BIO", "SEC", "CFG"];
    for (let i = 0; i < railIcons.length; i++) {
      const rIcon = figma.createFrame();
      rIcon.resize(44, 40);
      rIcon.fills = solidPaint(i === 0 ? "#141a1e" : "#0f1316");
      rIcon.strokes = solidPaint(i === 0 ? "#e6a23c" : "#2a343b");
      rIcon.strokeWeight = 1;
      rIcon.layoutMode = "VERTICAL";
      rIcon.primaryAxisAlignItems = "CENTER";
      rIcon.counterAxisAlignItems = "CENTER";
      deskRail.appendChild(rIcon);
      makeText(rIcon, railIcons[i], FONTS.monoBold, 10, i === 0 ? "#e6a23c" : "#98a3a5");
    }

    // Main Cockpit Area (1376px)
    const deskMain = figma.createFrame();
    deskMain.layoutMode = "VERTICAL";
    deskMain.itemSpacing = 16;
    deskMain.layoutGrow = 1;
    deskMain.paddingTop = 20;
    deskMain.paddingBottom = 20;
    deskMain.paddingLeft = 24;
    deskMain.paddingRight = 24;
    deskMain.fills = [];
    deskBody.appendChild(deskMain);

    // Main Row 1: KPI Stats Bar
    const kpiRow = figma.createFrame();
    kpiRow.layoutMode = "HORIZONTAL";
    kpiRow.itemSpacing = 16;
    kpiRow.layoutAlign = "STRETCH";
    kpiRow.fills = [];
    deskMain.appendChild(kpiRow);

    const deskKpis = [
      { label: "INGESTION STREAM", val: "1.44 GB/s", delta: "▲ OPTIMAL", color: "#5fae84" },
      { label: "VIVOKEY BIOMETRICS", val: "74 BPM", delta: "▲ STABLE", color: "#6fb3c9" },
      { label: "CORE SENSOR TEMP", val: "38.2 °C", delta: "▲ +1.1°C", color: "#ffd83a" },
      { label: "THREAT CONTEXT", val: "DEFCON 2", delta: "▼ ELEVATED", color: "#da6171" },
    ];

    for (const k of deskKpis) {
      const kCard = figma.createFrame();
      kCard.layoutMode = "VERTICAL";
      kCard.itemSpacing = 6;
      kCard.layoutGrow = 1;
      kCard.fills = solidPaint("#0f1316");
      kCard.strokes = solidPaint("#2a343b");
      kCard.paddingTop = 12;
      kCard.paddingBottom = 12;
      kCard.paddingLeft = 16;
      kCard.paddingRight = 16;
      kpiRow.appendChild(kCard);

      makeText(kCard, k.label, FONTS.monoBold, 9.5, "#98a3a5", 0.08);
      makeText(kCard, k.val, FONTS.displayBold, 22, "#e6ebe8");
      makeText(kCard, k.delta, FONTS.monoBold, 9.5, k.color);
    }

    // Main Row 2: Split Cockpit (Radar + Stream Table)
    const splitRow = figma.createFrame();
    splitRow.layoutMode = "HORIZONTAL";
    splitRow.itemSpacing = 16;
    splitRow.layoutGrow = 1;
    splitRow.layoutAlign = "STRETCH";
    splitRow.fills = [];
    deskMain.appendChild(splitRow);

    // Left Cockpit: Radar & Reticle Display (460px)
    const radarCard = figma.createFrame();
    radarCard.resize(460, 520);
    radarCard.layoutMode = "VERTICAL";
    radarCard.itemSpacing = 12;
    radarCard.paddingTop = 16;
    radarCard.paddingBottom = 16;
    radarCard.paddingLeft = 18;
    radarCard.paddingRight = 18;
    radarCard.fills = solidPaint("#0f1316");
    radarCard.strokes = solidPaint("#2a343b");
    splitRow.appendChild(radarCard);

    const rHead = figma.createFrame();
    rHead.layoutMode = "HORIZONTAL";
    rHead.primaryAxisAlignItems = "SPACE_BETWEEN";
    rHead.counterAxisAlignItems = "CENTER";
    rHead.layoutAlign = "STRETCH";
    rHead.fills = [];
    radarCard.appendChild(rHead);
    makeText(rHead, "AZIMUTH RADAR & TARGET LOCK", FONTS.displayBold, 12.5, "#e6ebe8", 0.08);
    makeText(rHead, "AZ. 042°", FONTS.monoBold, 10, "#3df0ff");

    // Embedded Vector Radar Graphic
    const radarSvg = `<svg width="240" height="240" viewBox="0 0 240 240" fill="none">
      <circle cx="120" cy="120" r="116" fill="#0b0e11" stroke="#2a343b" stroke-width="1.5"/>
      <circle cx="120" cy="120" r="28" stroke="#1f282e" stroke-width="1"/>
      <circle cx="120" cy="120" r="56" stroke="#2a343b" stroke-width="1"/>
      <circle cx="120" cy="120" r="84" stroke="#2a343b" stroke-width="1" stroke-dasharray="4 4"/>
      <circle cx="120" cy="120" r="112" stroke="#3b4750" stroke-width="1.2"/>
      <line x1="8" y1="120" x2="232" y2="120" stroke="#3b4750" stroke-width="1"/>
      <line x1="120" y1="8" x2="120" y2="232" stroke="#3b4750" stroke-width="1"/>
      <line x1="120" y1="120" x2="220" y2="62" stroke="#3df0ff" stroke-width="1.5"/>
      <circle cx="170" cy="80" r="6" stroke="#e6a23c" stroke-width="1.5" fill="#e6a23c" fill-opacity="0.3"/>
      <circle cx="80" cy="160" r="4" stroke="#da6171" stroke-width="1.5"/>
      <text x="120" y="24" fill="#e6a23c" font-family="monospace" font-size="8" font-weight="bold" text-anchor="middle">N 000°</text>
    </svg>`;
    const rSvgNode = addSvg(radarCard, radarSvg, "desk-radar-node");
    rSvgNode.layoutAlign = "CENTER";

    makeText(radarCard, "TARGET 01 // LAT: 45°28'00\" N · LON: 09°11'24\" E", FONTS.monoMed, 10, "#98a3a5");
    makeText(radarCard, "BEACON LOCK: 98.4% PROBABILITY [STEADY]", FONTS.monoBold, 10.5, "#5fae84");

    // Right Cockpit: Evidence Stream Table (870px)
    const streamCard = figma.createFrame();
    streamCard.layoutMode = "VERTICAL";
    streamCard.itemSpacing = 10;
    streamCard.layoutGrow = 1;
    streamCard.paddingTop = 16;
    streamCard.paddingBottom = 16;
    streamCard.paddingLeft = 18;
    streamCard.paddingRight = 18;
    streamCard.fills = solidPaint("#0f1316");
    streamCard.strokes = solidPaint("#2a343b");
    splitRow.appendChild(streamCard);

    makeText(streamCard, "REAL-TIME EVIDENCE INGESTION STREAM", FONTS.displayBold, 12.5, "#e6ebe8", 0.08);

    const logRows = [
      { t: "19:34:52", node: "NODE-01", proto: "PROTO_6520", size: "24.2 MB", hash: "0x889F...771B", stat: "SYNCED" },
      { t: "19:34:48", node: "NODE-03", proto: "VIVOKEY_BIO", size: "1.1 MB", hash: "0x442A...991C", stat: "AUTH_OK" },
      { t: "19:34:41", node: "NODE-02", proto: "SEALED_EVT", size: "128.0 MB", hash: "0x918F...B442", stat: "SEALED" },
      { t: "19:34:35", node: "NODE-07", proto: "RADAR_SWEEP", size: "64.8 MB", hash: "0x120C...D311", stat: "STREAM" },
    ];

    for (const r of logRows) {
      const rowFrame = figma.createFrame();
      rowFrame.layoutMode = "HORIZONTAL";
      rowFrame.primaryAxisAlignItems = "SPACE_BETWEEN";
      rowFrame.counterAxisAlignItems = "CENTER";
      rowFrame.layoutAlign = "STRETCH";
      rowFrame.paddingTop = 8;
      rowFrame.paddingBottom = 8;
      rowFrame.paddingLeft = 10;
      rowFrame.paddingRight = 10;
      rowFrame.fills = solidPaint("#141a1e");
      rowFrame.strokes = solidPaint("#2a343b");
      streamCard.appendChild(rowFrame);

      makeText(rowFrame, r.t, FONTS.monoMed, 10, "#98a3a5");
      makeText(rowFrame, r.node, FONTS.monoBold, 10, "#e6ebe8");
      makeText(rowFrame, r.proto, FONTS.monoMed, 10, "#6fb3c9");
      makeText(rowFrame, r.size, FONTS.monoMed, 10, "#aab4b2");
      makeText(rowFrame, r.hash, FONTS.monoMed, 10, "#e6a23c");

      const sPill = figma.createFrame();
      sPill.paddingLeft = 6;
      sPill.paddingRight = 6;
      sPill.paddingTop = 2;
      sPill.paddingBottom = 2;
      sPill.fills = solidPaint("#0f1316");
      sPill.strokes = solidPaint(r.stat === "SEALED" ? "#cf5e6b" : "#5fae84");
      rowFrame.appendChild(sPill);
      makeText(sPill, r.stat, FONTS.monoBold, 8.5, r.stat === "SEALED" ? "#cf5e6b" : "#5fae84");
    }

    // Terminal Audit Dock
    const dockFrame = figma.createFrame();
    dockFrame.layoutMode = "VERTICAL";
    dockFrame.itemSpacing = 4;
    dockFrame.layoutGrow = 1;
    dockFrame.layoutAlign = "STRETCH";
    dockFrame.paddingTop = 8;
    dockFrame.paddingBottom = 8;
    dockFrame.paddingLeft = 12;
    dockFrame.paddingRight = 12;
    dockFrame.fills = solidPaint("#0b0e11");
    dockFrame.strokes = solidPaint("#2a343b");
    streamCard.appendChild(dockFrame);

    makeText(dockFrame, "> [19:34:55.102] INGESTION DAEMON STARTED // LISTENING ON PORT 4433", FONTS.monoMed, 9.5, "#5fae84");
    makeText(dockFrame, "> [19:34:55.244] ALL SIGNALS NORMAL // RESILIENT SHA-256 CHECK PASSED", FONTS.monoMed, 9.5, "#98a3a5");

    // Layout 2: 390px Mobile Touch Shell Frame
    const mobileSection = figma.createFrame();
    mobileSection.layoutMode = "VERTICAL";
    mobileSection.itemSpacing = 14;
    mobileSection.layoutAlign = "STRETCH";
    mobileSection.fills = [];
    artboard3.appendChild(mobileSection);

    makeText(mobileSection, "LAYOUT 02: 390PX MOBILE TOUCH SHELL (RESPONSIVE FORENSIC HUD)", FONTS.displayBold, 16, "#e6ebe8", 0.08);

    const mobileShell = figma.createFrame();
    mobileShell.name = "Mobile 390px / Touch Shell";
    mobileShell.resize(390, 844);
    mobileShell.fills = solidPaint("#060708");
    mobileShell.strokes = solidPaint("#2a343b");
    mobileShell.strokeWeight = 1.5;
    mobileShell.layoutMode = "VERTICAL";
    mobileSection.appendChild(mobileShell);

    // Mobile Top Status Bar
    const mStatus = figma.createFrame();
    mStatus.resize(390, 44);
    mStatus.layoutMode = "HORIZONTAL";
    mStatus.primaryAxisAlignItems = "SPACE_BETWEEN";
    mStatus.counterAxisAlignItems = "CENTER";
    mStatus.paddingLeft = 20;
    mStatus.paddingRight = 20;
    mStatus.fills = solidPaint("#0f1316");
    mobileShell.appendChild(mStatus);
    makeText(mStatus, "19:34", FONTS.monoBold, 11, "#e6ebe8");
    makeText(mStatus, "5G · 98% [●]", FONTS.monoBold, 10, "#5fae84");

    // Mobile Header (52px)
    const mHead = figma.createFrame();
    mHead.resize(390, 52);
    mHead.layoutMode = "HORIZONTAL";
    mHead.primaryAxisAlignItems = "SPACE_BETWEEN";
    mHead.counterAxisAlignItems = "CENTER";
    mHead.paddingLeft = 20;
    mHead.paddingRight = 20;
    mHead.fills = solidPaint("#0a0c0e");
    mHead.strokes = solidPaint("#2a343b");
    mHead.strokeWeight = 1;
    mobileShell.appendChild(mHead);

    makeText(mHead, "[RIS] NODE-01", FONTS.cyberBold, 14, "#e6a23c");
    makeText(mHead, "SYNCED [●]", FONTS.monoBold, 9.5, "#5fae84");

    // Mobile Content
    const mBody = figma.createFrame();
    mBody.layoutMode = "VERTICAL";
    mBody.itemSpacing = 14;
    mBody.layoutGrow = 1;
    mBody.paddingTop = 16;
    mBody.paddingBottom = 16;
    mBody.paddingLeft = 16;
    mBody.paddingRight = 16;
    mBody.fills = [];
    mobileShell.appendChild(mBody);

    // Biometric Card
    const mBio = figma.createFrame();
    mBio.layoutMode = "VERTICAL";
    mBio.itemSpacing = 6;
    mBio.layoutAlign = "STRETCH";
    mBio.fills = solidPaint("#0f1316");
    mBio.strokes = solidPaint("#2a343b");
    mBio.paddingTop = 14;
    mBio.paddingBottom = 14;
    mBio.paddingLeft = 16;
    mBio.paddingRight = 16;
    mBody.appendChild(mBio);

    makeText(mBio, "BIOMETRIC AUTH // VIVOKEY", FONTS.monoBold, 9.5, "#da6171");
    makeText(mBio, "74 BPM", FONTS.displayBold, 28, "#e6ebe8");
    makeText(mBio, "▲ NORMAL SINUS RHYTHM", FONTS.monoBold, 9.5, "#5fae84");

    // Neural Stream Card
    const mNeural = figma.createFrame();
    mNeural.layoutMode = "VERTICAL";
    mNeural.itemSpacing = 6;
    mNeural.layoutAlign = "STRETCH";
    mNeural.fills = solidPaint("#0f1316");
    mNeural.strokes = solidPaint("#2a343b");
    mNeural.paddingTop = 14;
    mNeural.paddingBottom = 14;
    mNeural.paddingLeft = 16;
    mNeural.paddingRight = 16;
    mBody.appendChild(mNeural);

    makeText(mNeural, "NEURAL BANDWIDTH", FONTS.monoBold, 9.5, "#6fb3c9");
    makeText(mNeural, "94.8% OPTIMAL", FONTS.displayBold, 20, "#3df0ff");

    // Mobile Action Button
    createChamferButton({ parent: mBody, label: "AUTHORIZE SYNC ▶", variant: "primary", size: "md" });

    // Mobile Bottom Sheet Docked Preview
    const mSheetDock = figma.createFrame();
    mSheetDock.layoutMode = "VERTICAL";
    mSheetDock.itemSpacing = 8;
    mSheetDock.layoutAlign = "STRETCH";
    mSheetDock.fills = solidPaint("#141a1e");
    mSheetDock.strokes = solidPaint("#3b4750");
    mSheetDock.paddingTop = 10;
    mSheetDock.paddingBottom = 12;
    mSheetDock.paddingLeft = 14;
    mSheetDock.paddingRight = 14;
    mBody.appendChild(mSheetDock);

    const mHandle = figma.createFrame();
    mHandle.resize(36, 4);
    mHandle.cornerRadius = 2;
    mHandle.fills = solidPaint("#4a555b");
    mHandle.layoutAlign = "CENTER";
    mSheetDock.appendChild(mHandle);

    makeText(mSheetDock, "SWIPE TO REVEAL OVERRIDE DRAWER", FONTS.monoMed, 9, "#98a3a5");

    // Mobile Bottom Nav (60px)
    const mNav = figma.createFrame();
    mNav.resize(390, 60);
    mNav.layoutMode = "HORIZONTAL";
    mNav.primaryAxisAlignItems = "SPACE_AROUND";
    mNav.counterAxisAlignItems = "CENTER";
    mNav.fills = solidPaint("#0f1316");
    mNav.strokes = solidPaint("#2a343b");
    mNav.strokeWeight = 1;
    mobileShell.appendChild(mNav);

    const mNavItems = ["RADAR", "SENSORS", "DOSSIER", "KEYS"];
    for (let i = 0; i < mNavItems.length; i++) {
      makeText(mNav, mNavItems[i], FONTS.monoBold, 10, i === 0 ? "#e6a23c" : "#98a3a5");
    }

    // Layout 3: Side-by-side Dark / Light Mode Presentation
    const dualSection = figma.createFrame();
    dualSection.layoutMode = "VERTICAL";
    dualSection.itemSpacing = 16;
    dualSection.layoutAlign = "STRETCH";
    dualSection.fills = [];
    artboard3.appendChild(dualSection);

    makeText(dualSection, "LAYOUT 03: DUAL-THEME ENGINE SPECIMEN (SIDE-BY-SIDE DARK & LIGHT)", FONTS.displayBold, 16, "#e6ebe8", 0.08);

    const dualRow = figma.createFrame();
    dualRow.layoutMode = "HORIZONTAL";
    dualRow.itemSpacing = 24;
    dualRow.layoutAlign = "STRETCH";
    dualRow.fills = [];
    dualSection.appendChild(dualRow);

    // Left Card: Dark Mode
    const dCard = figma.createFrame();
    dCard.layoutMode = "VERTICAL";
    dCard.itemSpacing = 12;
    dCard.layoutGrow = 1;
    dCard.fills = solidPaint("#0a0c0e");
    dCard.strokes = solidPaint("#2a343b");
    dCard.paddingTop = 20;
    dCard.paddingBottom = 20;
    dCard.paddingLeft = 24;
    dCard.paddingRight = 24;
    dualRow.appendChild(dCard);

    makeText(dCard, "DARK MODE (GRAPHITE VOID)", FONTS.displayBold, 14, "#e6ebe8");
    makeText(dCard, "Surface: #0f1316 · Accent: Amber #e6a23c & Cyan #6fb3c9", FONTS.monoMed, 10, "#98a3a5");
    makeText(dCard, "11.8:1 AAA CONTRAST CERTIFIED", FONTS.monoBold, 10.5, "#5fae84");
    createChamferButton({ parent: dCard, label: "DARK ACTION ▶", variant: "primary", size: "md" });

    // Right Card: Light Mode
    const lCard = figma.createFrame();
    lCard.layoutMode = "VERTICAL";
    lCard.itemSpacing = 12;
    lCard.layoutGrow = 1;
    lCard.fills = solidPaint("#e9edef");
    lCard.strokes = solidPaint("#c3ccd2");
    lCard.paddingTop = 20;
    lCard.paddingBottom = 20;
    lCard.paddingLeft = 24;
    lCard.paddingRight = 24;
    dualRow.appendChild(lCard);

    makeText(lCard, "LIGHT MODE (COLD PAPER)", FONTS.displayBold, 14, "#11181c");
    makeText(lCard, "Surface: #ffffff · Calibrated Ink: #8a5a12 & #216270", FONTS.monoMed, 10, "#5d6b74");
    makeText(lCard, "6.4:1 AA CONTRAST CERTIFIED", FONTS.monoBold, 10.5, "#1f6e47");
    createChamferButton({ parent: lCard, label: "LIGHT ACTION ▶", variant: "default", size: "md" });

    // ------------------------------------------------------------------------
    // 8. ZOOM TO FIT & FINISH
    // ------------------------------------------------------------------------
    figma.viewport.scrollAndZoomIntoView([artboard1, artboard2, artboard3]);
    figma.notify("⚡ RIS v2.8.0 Commercial Pro Studio Kit Generated Successfully!");
    figma.closePlugin();
  } catch (err) {
    console.error("Error generating RIS v2.8.0 Studio Kit:", err);
    figma.notify("❌ Error generating RIS v2.8.0 Studio Kit: " + err.message);
    figma.closePlugin();
  }
})();

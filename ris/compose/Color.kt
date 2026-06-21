package design.ris

import androidx.compose.ui.graphics.Color

/**
 * RELIC INTERFACE SYSTEM v2 — Compose color tokens.
 * Source of truth: ../tokens/ris.tokens.json (mirrors ../css/ris-tokens.css).
 *
 * Themes: Dark (default) + Light. Brands: Relic / BioHub / VivoKey / Neutral.
 * Status is NEVER color-only — always pair with a label/icon.
 * Contextual accents are AA-safe (>=4.5:1) on bg/surface of their theme;
 * *Fill accents are always bright and pair with FgInvert text.
 */

// ── Accent fills (forensic/archival instrument palette; theme-independent) ──
val RisYellowFill = Color(0xFFE6A23C) // amber-sodium — active/CTA/pending
val RisCyanFill = Color(0xFF6FB3C9)   // steel-ice    — data/link/scan
val RisRedFill = Color(0xFFD45565)
val RisGreenFill = Color(0xFF5FAE84)
val RisVioletFill = Color(0xFF8479BE)
val RisMagentaFill = Color(0xFFB274C0) // orchid — Gumi runtime
val RisOrangeFill = Color(0xFFD08A4E)

// ═════════════════════════════ DARK (default) ═══════════════════════════════

// Surfaces (graphite stack; never pure black)
val RisVoid = Color(0xFF060708)
val RisBg = Color(0xFF0A0C0E)
val RisSurface1 = Color(0xFF0F1316)
val RisSurface2 = Color(0xFF141A1E)
val RisSurface3 = Color(0xFF1B2228)
val RisSurface4 = Color(0xFF232C33)

// Lines / grid
val RisLine = Color(0xFF2A343B)
val RisLineStrong = Color(0xFF3B4750)
val RisLineFaint = Color(0xFF1A2126)

// Text
val RisFg1 = Color(0xFFE6EBE8)
val RisFg2 = Color(0xFFAAB4B2)
val RisFg3 = Color(0xFF98A3A5) // metadata — AA-safe on Surface1
val RisFg4 = Color(0xFF4A555B) // disabled/placeholder ONLY
val RisFgInvert = Color(0xFF07090A)

// Contextual accents (dark)
val RisYellow = RisYellowFill
val RisCyan = RisCyanFill
val RisRed = Color(0xFFDA6171) // #d45565 fails AA on Surface3
val RisGreen = RisGreenFill
val RisViolet = Color(0xFF938AC8) // #8479be fails AA on Surface3
val RisMagenta = RisMagentaFill
val RisOrange = RisOrangeFill

// Dim variants
val RisYellowDim = Color(0xFF8F6425)
val RisCyanDim = Color(0xFF456F7D)
val RisRedDim = Color(0xFF83353F)
val RisGreenDim = Color(0xFF3B6C52)
val RisVioletDim = Color(0xFF524B76)
val RisMagentaDim = Color(0xFF6E4877)
val RisOrangeDim = Color(0xFF815630)

// Translucent fills (-glow) and borders (-line)
val RisYellowGlow = Color(0x29E6A23C)
val RisCyanGlow = Color(0x216FB3C9)
val RisRedGlow = Color(0x29D45565)
val RisGreenGlow = Color(0x215FAE84)
val RisVioletGlow = Color(0x248479BE)
val RisMagentaGlow = Color(0x24B274C0)
val RisYellowLine = Color(0x73E6A23C)
val RisCyanLine = Color(0x736FB3C9)
val RisRedLine = Color(0x80D45565)
val RisGreenLine = Color(0x6B5FAE84)

// ═══════════════════════════════ LIGHT ══════════════════════════════════════
// Cold blue-grey paper. Ink accents >=4.5:1 on LightBg/LightSurface1/white.

object RisLight {
    val Void = Color(0xFFD9DFE3)
    val Bg = Color(0xFFE9EDEF)
    val Surface1 = Color(0xFFF4F6F7)
    val Surface2 = Color(0xFFFAFBFC)
    val Surface3 = Color(0xFFFFFFFF)
    val Surface4 = Color(0xFFFFFFFF)

    val Line = Color(0xFFC3CCD2)
    val LineStrong = Color(0xFF9AA7B0)
    val LineFaint = Color(0xFFDDE3E7)

    val Fg1 = Color(0xFF11181C)
    val Fg2 = Color(0xFF3D4A52)
    val Fg3 = Color(0xFF5D6B74)
    val Fg4 = Color(0xFF97A4AD)
    val FgInvert = Color(0xFFF6F8F8)

    val Yellow = Color(0xFF8A5A12)
    val Cyan = Color(0xFF216270)
    val Red = Color(0xFFB52F3D)
    val Green = Color(0xFF1F6E47)
    val Violet = Color(0xFF534A9E)
    val Magenta = Color(0xFF8A3F9A)
    val Orange = Color(0xFF925312)
}

// ═══════════════════════════════ BRAND ══════════════════════════════════════

enum class RisBrand { Relic, BioHub, VivoKey, Neutral }

data class RisAccentPair(val primary: Color, val primaryFill: Color, val secondary: Color)

fun risBrandAccents(brand: RisBrand, light: Boolean = false): RisAccentPair = when (brand) {
    RisBrand.Relic -> RisAccentPair(
        if (light) RisLight.Yellow else RisYellow, RisYellowFill,
        if (light) RisLight.Cyan else RisCyan,
    )
    RisBrand.BioHub -> RisAccentPair(
        if (light) RisLight.Cyan else RisCyan, RisCyanFill,
        if (light) RisLight.Green else RisGreen,
    )
    RisBrand.VivoKey -> RisAccentPair(
        if (light) RisLight.Red else RisRed, RisRedFill,
        if (light) RisLight.Yellow else RisYellow,
    )
    RisBrand.Neutral -> RisAccentPair(
        if (light) RisLight.Violet else RisViolet, RisVioletFill,
        if (light) RisLight.Cyan else RisCyan,
    )
}

// ── Semantic stream taxonomy ────────────────────────────────────────────────
val RisStreamEvidence = RisCyan
val RisStreamInference = RisViolet
val RisStreamPending = RisYellow
val RisStreamApproved = RisGreen
val RisStreamBlocked = RisRed
val RisStreamGumi = RisMagenta
val RisStreamRuntime = RisCyanDim
val RisStreamCorrection = RisOrange

// ── Risk levels ─────────────────────────────────────────────────────────────
fun risRiskColor(level: String): Color = when (level.lowercase()) {
    "low" -> RisGreen
    "medium" -> RisYellow
    "high" -> RisRed
    else -> RisFg3
}

// ── v1 compat aliases (amber → yellow) ──────────────────────────────────────
@Deprecated("v2: use RisYellow", ReplaceWith("RisYellow"))
val RisAmber = RisYellow
@Deprecated("v2: use RisYellowDim", ReplaceWith("RisYellowDim"))
val RisAmberDim = RisYellowDim
@Deprecated("v2: use RisYellowGlow", ReplaceWith("RisYellowGlow"))
val RisAmberGlow = RisYellowGlow
@Deprecated("v2: use RisYellowLine", ReplaceWith("RisYellowLine"))
val RisAmberLine = RisYellowLine

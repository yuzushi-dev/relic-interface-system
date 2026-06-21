package com.relic.ris.theme

import androidx.compose.ui.graphics.Color

/**
 * RELIC INTERFACE SYSTEM — Compose color tokens.
 * Port of colors_and_type.css for Kotlin / Jetpack Compose consumers
 * (BioHub, Spark2Offline android_client, …).
 *
 * Usage: reference these directly, or wire into a MaterialTheme darkColorScheme()
 * via RelicTheme (see Theme.kt). Status is NEVER color-only — always pair with a
 * label/icon (see WCAG note below).
 */

// ── Surfaces (graphite stack; never pure black) ─────────────────────────────
val RisVoid      = Color(0xFF060708)  // deepest backdrop, input wells
val RisBg        = Color(0xFF0A0C0E)  // app background
val RisSurface1  = Color(0xFF0F1316)  // panel base
val RisSurface2  = Color(0xFF141A1E)  // raised panel / row hover
val RisSurface3  = Color(0xFF1B2228)  // selected / elevated
val RisSurface4  = Color(0xFF232C33)  // popovers, deepest

// ── Lines / grid ────────────────────────────────────────────────────────────
val RisLine       = Color(0xFF2A343B)
val RisLineStrong = Color(0xFF3B4750)
val RisLineFaint  = Color(0xFF1A2126)

// ── Text ────────────────────────────────────────────────────────────────────
val RisFg1     = Color(0xFFE6EBE8)  // primary
val RisFg2     = Color(0xFFAAB4B2)  // secondary
val RisFg3     = Color(0xFF717D82)  // tertiary
val RisFg4     = Color(0xFF4A555B)  // disabled / placeholder
val RisFgInvert = Color(0xFF07090A) // text on bright accent fills
/** Use for metadata/captions on dark surfaces — ~6.5:1, passes WCAG AA where Fg3/Fg4 fail. */
val RisFgMeta  = Color(0xFF98A3A5)

// ── Accents (use with restraint; each carries meaning) ──────────────────────
val RisAmber   = Color(0xFFF2E205)  // active / selection / primary CTA / pending
val RisCyan    = Color(0xFF16E0E0)  // data / links / scans / evidence
val RisRed     = Color(0xFFFF2D3C)  // danger / blocked / high risk
val RisGreen   = Color(0xFF2FE48A)  // online / approved / success
val RisViolet  = Color(0xFFB06BFF)  // inference (model-derived)
val RisMagenta = Color(0xFFE85AD6)  // Gumi runtime signature
val RisOrange  = Color(0xFFE08A3C)  // researcher corrections

// Dim variants
val RisAmberDim   = Color(0xFFB3A906)
val RisCyanDim    = Color(0xFF0E9EA0)
val RisRedDim     = Color(0xFFB21A26)
val RisGreenDim   = Color(0xFF1A9A5C)

// Translucent fills (-glow) and borders (-line)
val RisAmberGlow = Color(0x2EF2E205)
val RisCyanGlow  = Color(0x2916E0E0)
val RisRedGlow   = Color(0x29FF2D3C)
val RisGreenGlow = Color(0x242FE48A)
val RisAmberLine = Color(0x73F2E205)
val RisCyanLine  = Color(0x7316E0E0)
val RisRedLine   = Color(0x73FF2D3C)

// ── Semantic stream taxonomy (maps Relic Researcher Workbench globals.css) ──
val RisStreamEvidence   = RisCyan
val RisStreamInference  = RisViolet
val RisStreamPending    = RisAmber
val RisStreamApproved   = RisGreen
val RisStreamBlocked    = RisRed
val RisStreamGumi       = RisMagenta
val RisStreamRuntime    = RisCyanDim
val RisStreamCorrection = RisOrange

// ── Risk levels ─────────────────────────────────────────────────────────────
fun risRiskColor(level: String): Color = when (level.lowercase()) {
    "low"    -> RisGreen
    "medium" -> RisAmber
    "high"   -> RisRed
    else     -> RisFg3
}

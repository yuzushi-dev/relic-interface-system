package com.relic.ris.theme

import androidx.compose.material3.Typography
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.Font
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.sp
// import com.relic.ris.R  // <- wire to your font resources

/**
 * RELIC INTERFACE SYSTEM — Compose typography.
 * Port of the type scale in colors_and_type.css.
 *
 * Fonts (add the .ttf files to res/font and uncomment the FontFamily bodies):
 *   - Chakra Petch   → display / headings / HUD numerics (uppercase, tight tracking)
 *   - Rajdhani       → body / UI / labels
 *   - JetBrains Mono → telemetry / logs / IDs (tabular)
 *
 * If you cannot self-host, the nearest system fallbacks are a condensed sans
 * (Rajdhani→"sans-serif-condensed") and monospace.
 */

// Replace SansSerif/Monospace with real Font(...) families once .ttf are added.
val ChakraPetch  = FontFamily.SansSerif   // = FontFamily(Font(R.font.chakra_petch_*, ...))
val Rajdhani     = FontFamily.SansSerif   // = FontFamily(Font(R.font.rajdhani_*, ...))
val JetBrainsMono = FontFamily.Monospace  // = FontFamily(Font(R.font.jetbrains_mono_*, ...))

// Semantic styles (match .ris-* classes). Headings are UPPERCASE by convention —
// uppercase the string at call site or via a text transform.
val RisHero  = TextStyle(fontFamily = ChakraPetch, fontWeight = FontWeight.Bold,     fontSize = 44.sp, lineHeight = 44.sp, letterSpacing = (-0.44).sp)
val RisH1    = TextStyle(fontFamily = ChakraPetch, fontWeight = FontWeight.Bold,     fontSize = 32.sp, lineHeight = 34.sp, letterSpacing = (-0.32).sp)
val RisH2    = TextStyle(fontFamily = ChakraPetch, fontWeight = FontWeight.SemiBold, fontSize = 24.sp, lineHeight = 26.sp)
val RisH3    = TextStyle(fontFamily = ChakraPetch, fontWeight = FontWeight.SemiBold, fontSize = 19.sp, lineHeight = 22.sp)
val RisBody  = TextStyle(fontFamily = Rajdhani,    fontWeight = FontWeight.Medium,   fontSize = 16.sp, lineHeight = 25.sp)
val RisSmall = TextStyle(fontFamily = Rajdhani,    fontWeight = FontWeight.Medium,   fontSize = 14.sp, lineHeight = 21.sp)
/** Small uppercase label — workhorse of the system. Uppercase + 0.16em tracking. */
val RisLabel = TextStyle(fontFamily = Rajdhani,    fontWeight = FontWeight.SemiBold, fontSize = 11.sp, lineHeight = 11.sp, letterSpacing = 1.76.sp)
/** Tiny eyebrow / system tag — mono, very wide tracking. */
val RisEyebrow = TextStyle(fontFamily = JetBrainsMono, fontWeight = FontWeight.Medium, fontSize = 11.sp, letterSpacing = 3.08.sp)
/** Monospace telemetry / values. */
val RisMono  = TextStyle(fontFamily = JetBrainsMono, fontWeight = FontWeight.Medium,  fontSize = 14.sp)

// Material 3 Typography mapping (so MaterialTheme components inherit the system).
val RisTypography = Typography(
    displayLarge   = RisHero,
    headlineLarge  = RisH1,
    headlineMedium = RisH2,
    titleLarge     = RisH3,
    bodyLarge      = RisBody,
    bodyMedium     = RisSmall,
    labelLarge     = RisLabel,
    labelSmall     = RisEyebrow,
)

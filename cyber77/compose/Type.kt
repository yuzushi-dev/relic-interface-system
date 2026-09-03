package design.ris

import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.sp

/**
 * RELIC INTERFACE SYSTEM — Compose typography tokens.
 * Default font fallbacks map to monospace/sans-serif so it works out-of-the-box.
 * Consumers can provide their own FontFamilies (e.g. Chakra Petch, Rajdhani, JetBrains Mono).
 */

val RisDisplayFont: FontFamily = FontFamily.SansSerif
val RisBodyFont: FontFamily = FontFamily.SansSerif
val RisMonoFont: FontFamily = FontFamily.Monospace

// Canonical RIS text styles
val RisHero = TextStyle(
    fontFamily = RisDisplayFont,
    fontWeight = FontWeight.Bold,
    fontSize = 44.sp,
    lineHeight = 44.sp,
    letterSpacing = (-0.44).sp
)

val RisH1 = TextStyle(
    fontFamily = RisDisplayFont,
    fontWeight = FontWeight.Bold,
    fontSize = 32.sp,
    lineHeight = 34.sp,
    letterSpacing = (-0.32).sp
)

val RisH2 = TextStyle(
    fontFamily = RisDisplayFont,
    fontWeight = FontWeight.SemiBold,
    fontSize = 24.sp,
    lineHeight = 26.sp
)

val RisH3 = TextStyle(
    fontFamily = RisDisplayFont,
    fontWeight = FontWeight.SemiBold,
    fontSize = 19.sp,
    lineHeight = 22.sp
)

val RisBody = TextStyle(
    fontFamily = RisBodyFont,
    fontWeight = FontWeight.Medium,
    fontSize = 16.sp,
    lineHeight = 24.sp
)

val RisSmall = TextStyle(
    fontFamily = RisBodyFont,
    fontWeight = FontWeight.Medium,
    fontSize = 14.sp,
    lineHeight = 20.sp
)

val RisLabel = TextStyle(
    fontFamily = RisBodyFont,
    fontWeight = FontWeight.SemiBold,
    fontSize = 11.sp,
    lineHeight = 11.sp,
    letterSpacing = 1.76.sp
)

val RisEyebrow = TextStyle(
    fontFamily = RisMonoFont,
    fontWeight = FontWeight.Medium,
    fontSize = 11.sp,
    letterSpacing = 3.0.sp
)

val RisMono = TextStyle(
    fontFamily = RisMonoFont,
    fontWeight = FontWeight.Medium,
    fontSize = 14.sp
)

package com.relic.ris.theme

import androidx.compose.foundation.shape.GenericShape
import androidx.compose.ui.graphics.Shape
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp

/**
 * RELIC INTERFACE SYSTEM — Compose shapes.
 *
 * The system is HARD-EDGED: corner radius is 0. The signature is the CLIPPED
 * corner (top-right + bottom-left cut) — the Compose equivalent of the CSS
 * clip-path polygon in relic.css.
 *
 * Use: Modifier.clip(risClip(10.dp)) on panels/cards, 6.dp on chips/inputs,
 * 14.dp on modals. Borders carry structure (1.dp solid RisLine); elevation is
 * border + glow, NOT soft drop shadows.
 */

/** Angular clip — cuts the top-right and bottom-left corners by [cut]. */
fun risClip(cut: Dp): Shape = GenericShape { size, density ->
    val c = with(density) { cut.toPx() }
    moveTo(0f, 0f)
    lineTo(size.width - c, 0f)
    lineTo(size.width, c)
    lineTo(size.width, size.height)
    lineTo(c, size.height)
    lineTo(0f, size.height - c)
    close()
}

/** Mirror clip — cuts top-left and bottom-right (for paired panels). */
fun risClipMirror(cut: Dp): Shape = GenericShape { size, density ->
    val c = with(density) { cut.toPx() }
    moveTo(c, 0f)
    lineTo(size.width, 0f)
    lineTo(size.width, size.height - c)
    lineTo(size.width - c, size.height)
    lineTo(0f, size.height)
    lineTo(0f, c)
    close()
}

val RisClipSm = 6.dp   // chips, inputs
val RisClip   = 10.dp  // panels, cards
val RisClipLg = 14.dp  // modals, hero

// Spacing scale (4px base grid)
val RisS1 = 4.dp;  val RisS2 = 8.dp;  val RisS3 = 12.dp; val RisS4 = 16.dp
val RisS5 = 20.dp; val RisS6 = 24.dp; val RisS7 = 32.dp; val RisS8 = 48.dp

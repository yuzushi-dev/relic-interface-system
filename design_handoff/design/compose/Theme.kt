package com.relic.ris.theme

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RectangleShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp

/**
 * RELIC INTERFACE SYSTEM — Compose theme + core composables.
 * A minimal, copy-pasteable starting point for Kotlin apps adopting RIS
 * (overrides Material 3's defaults with the dark cyberpunk skin).
 *
 * NOTE: this is a HANDOFF REFERENCE, not a published library. Drop these files
 * into the app's theme package, wire the fonts in Type.kt, and adapt.
 */

private val RisColorScheme = darkColorScheme(
    primary        = RisAmber,
    onPrimary      = RisFgInvert,
    secondary      = RisCyan,
    onSecondary    = RisFgInvert,
    error          = RisRed,
    background     = RisBg,
    onBackground   = RisFg1,
    surface        = RisSurface1,
    onSurface      = RisFg1,
    surfaceVariant = RisSurface2,
    onSurfaceVariant = RisFg2,
    outline        = RisLineStrong,
    outlineVariant = RisLine,
)

@Composable
fun RelicTheme(content: @Composable () -> Unit) {
    MaterialTheme(colorScheme = RisColorScheme, typography = RisTypography, content = content)
}

/** Angular clipped panel: surface fill + 1px hairline border + corner cut. */
@Composable
fun RisPanel(
    modifier: Modifier = Modifier,
    cut: androidx.compose.ui.unit.Dp = RisClip,
    border: Color = RisLine,
    fill: Color = RisSurface1,
    content: @Composable BoxScope.() -> Unit,
) {
    Box(
        modifier
            .clip(risClip(cut))
            .background(fill)
            .border(1.dp, border, risClip(cut)),
        content = content,
    )
}

/** Status / stream chip. tone = accent color; label always present (never color-only). */
@Composable
fun RisChip(label: String, tone: Color = RisFg2, modifier: Modifier = Modifier) {
    Row(
        modifier
            .clip(RectangleShape)
            .border(1.dp, tone.copy(alpha = 0.45f))
            .background(tone.copy(alpha = 0.10f))
            .padding(horizontal = 8.dp, vertical = 3.dp),
        verticalAlignment = androidx.compose.ui.Alignment.CenterVertically,
    ) {
        Box(Modifier.size(5.dp).background(tone))
        Spacer(Modifier.width(6.dp))
        Text(label.uppercase(), style = RisEyebrow.copy(fontSize = 10.sp, letterSpacing = 1.2.sp), color = tone)
    }
}

/** Segmented HUD meter — [on] of [total] cells lit. */
@Composable
fun RisSegMeter(on: Int, total: Int, tone: Color = RisAmber, modifier: Modifier = Modifier) {
    Row(modifier, horizontalArrangement = Arrangement.spacedBy(2.dp)) {
        repeat(total) { i ->
            Box(Modifier.weight(1f).height(10.dp).background(if (i < on) tone else RisSurface3))
        }
    }
}

/** Linear meter. */
@Composable
fun RisMeter(value: Float, tone: Color = RisAmber, modifier: Modifier = Modifier) {
    Box(modifier.height(6.dp).background(RisSurface3).border(1.dp, RisLine)) {
        Box(Modifier.fillMaxWidth(value.coerceIn(0f, 1f)).fillMaxHeight().background(tone))
    }
}

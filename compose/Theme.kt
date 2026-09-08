package design.ris

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.staticCompositionLocalOf
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.drawBehind
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color

/**
 * RELIC INTERFACE SYSTEM — Compose Theme.
 */

data class RisColors(
    val bg: Color = RisBg,
    val void: Color = RisVoid,
    val surface1: Color = RisSurface1,
    val surface2: Color = RisSurface2,
    val surface3: Color = RisSurface3,
    val surface4: Color = RisSurface4,
    val line: Color = RisLine,
    val lineStrong: Color = RisLineStrong,
    val lineFaint: Color = RisLineFaint,
    val accent: Color = RisYellow,
    val accentFill: Color = RisYellowFill,
    val onAccent: Color = RisFgInvert,
    val cyan: Color = RisCyan,
    val cyanFill: Color = RisCyanFill,
    val red: Color = RisRed,
    val redFill: Color = RisRedFill,
    val green: Color = RisGreen,
    val greenFill: Color = RisGreenFill,
    val fg1: Color = RisFg1,
    val fg2: Color = RisFg2,
    val fg3: Color = RisFg3,
    val fg4: Color = RisFg4,
    val isLight: Boolean = false,
)

fun risDarkColors(): RisColors = RisColors()

fun risLightColors(): RisColors = RisColors(
    bg = RisLight.Bg,
    void = RisLight.Void,
    surface1 = RisLight.Surface1,
    surface2 = RisLight.Surface2,
    surface3 = RisLight.Surface3,
    surface4 = RisLight.Surface4,
    line = RisLight.Line,
    lineStrong = RisLight.LineStrong,
    lineFaint = RisLight.LineFaint,
    accent = RisLight.Yellow,
    accentFill = RisYellowFill,
    onAccent = RisLight.FgInvert,
    cyan = RisLight.Cyan,
    cyanFill = RisCyanFill,
    red = RisLight.Red,
    redFill = RisRedFill,
    green = RisLight.Green,
    greenFill = RisGreenFill,
    fg1 = RisLight.Fg1,
    fg2 = RisLight.Fg2,
    fg3 = RisLight.Fg3,
    fg4 = RisLight.Fg4,
    isLight = true,
)

val LocalRisColors = staticCompositionLocalOf { RisColors() }

object RisTheme {
    val colors: RisColors
        @Composable
        get() = LocalRisColors.current
}

/** Subtle tactical cyber background: crimson gradient + faint scanlines */
fun Modifier.cyberBackdrop(): Modifier = this.drawBehind {
    val gradient = Brush.radialGradient(
        colors = listOf(Color(0x2E8B001F), Color.Transparent),
        center = Offset(size.width * 0.5f, 0f),
        radius = size.width * 0.95f
    )
    drawRect(brush = gradient)

    val step = 4f
    var y = 0f
    val scanlineColor = Color(0x0AFFFFFF)
    while (y < size.height) {
        drawLine(
            color = scanlineColor,
            start = Offset(0f, y),
            end = Offset(size.width, y),
            strokeWidth = 1f
        )
        y += step
    }
}

@Composable
fun RisTheme(
    colors: RisColors = RisColors(),
    content: @Composable () -> Unit,
) {
    val m3Colors = if (colors.isLight) {
        darkColorScheme( // base fallback
            primary = colors.accent,
            onPrimary = colors.onAccent,
            secondary = colors.cyan,
            surface = colors.surface1,
            background = colors.bg,
            outline = colors.line,
        )
    } else {
        darkColorScheme(
            primary = colors.accent,
            onPrimary = colors.onAccent,
            secondary = colors.cyan,
            surface = colors.surface1,
            background = colors.bg,
            outline = colors.line,
        )
    }

    CompositionLocalProvider(
        LocalRisColors provides colors,
    ) {
        MaterialTheme(
            colorScheme = m3Colors,
            content = content,
        )
    }
}

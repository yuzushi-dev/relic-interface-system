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
    val bg: Color = RisCyberSkin.Bg,
    val surface1: Color = RisCyberSkin.Surface1,
    val surface2: Color = RisCyberSkin.Surface2,
    val surface3: Color = RisCyberSkin.Surface3,
    val line: Color = RisCyberSkin.Line,
    val lineStrong: Color = RisCyberSkin.LineStrong,
    val lineFaint: Color = RisCyberSkin.LineFaint,
    val accent: Color = RisCyberSkin.Yellow,
    val accentFill: Color = RisCyberSkin.YellowFill,
    val cyan: Color = RisCyberSkin.Cyan,
    val red: Color = RisCyberSkin.Red,
    val green: Color = RisCyberSkin.Green,
    val fg1: Color = RisCyberSkin.Fg1,
    val fg2: Color = RisCyberSkin.Fg2,
    val fg3: Color = RisCyberSkin.Fg3,
    val fg4: Color = RisCyberSkin.Fg4,
)

val LocalRisColors = staticCompositionLocalOf { RisColors() }

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
    val m3Colors = darkColorScheme(
        primary = colors.accent,
        onPrimary = RisCyberSkin.OnAccent,
        secondary = colors.cyan,
        surface = colors.surface1,
        background = colors.bg,
        outline = colors.line,
    )

    CompositionLocalProvider(
        LocalRisColors provides colors,
    ) {
        MaterialTheme(
            colorScheme = m3Colors,
            content = content,
        )
    }
}

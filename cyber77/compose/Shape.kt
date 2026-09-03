package design.ris

import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Outline
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.Shape
import androidx.compose.ui.unit.Density
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.LayoutDirection
import androidx.compose.ui.unit.dp

/**
 * RELIC INTERFACE SYSTEM — Compose shapes.
 *
 * Hard-edged system: corner radius is 0dp. The signature visual element is
 * the 45-degree chamfered corner (top-right + bottom-left cut).
 *
 * Use: Modifier.clip(risClip(10.dp)) on panels/cards, 6.dp on buttons/inputs,
 * 14.dp on modals.
 */

val RisClipSm: Dp = 6.dp  // chips, buttons, inputs
val RisClip: Dp = 10.dp   // panels, cards
val RisClipLg: Dp = 16.dp // modals, hero blocks

/** Angular clip — cuts top-right and bottom-left corners by [cut]. */
fun risClip(cut: Dp = RisClip): Shape = RisClipShape(cut, mirror = false)

/** Mirror clip — cuts top-left and bottom-right corners by [cut]. */
fun risClipMirror(cut: Dp = RisClip): Shape = RisClipShape(cut, mirror = true)

private class RisClipShape(
    private val cut: Dp,
    private val mirror: Boolean,
) : Shape {
    override fun createOutline(size: Size, layoutDirection: LayoutDirection, density: Density): Outline {
        val c = with(density) { cut.toPx() }
        val w = size.width
        val h = size.height

        val p = Path().apply {
            if (!mirror) {
                moveTo(0f, 0f)
                lineTo(w - c, 0f)
                lineTo(w, c)
                lineTo(w, h)
                lineTo(c, h)
                lineTo(0f, h - c)
                close()
            } else {
                moveTo(c, 0f)
                lineTo(w, 0f)
                lineTo(w, h - c)
                lineTo(w - c, h)
                lineTo(0f, h)
                lineTo(0f, c)
                close()
            }
        }
        return Outline.Generic(p)
    }
}

// 4px base spacing grid
val RisS1 = 4.dp
val RisS2 = 8.dp
val RisS3 = 12.dp
val RisS4 = 16.dp
val RisS5 = 20.dp
val RisS6 = 24.dp
val RisS7 = 32.dp
val RisS8 = 48.dp

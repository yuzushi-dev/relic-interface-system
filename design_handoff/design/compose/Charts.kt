package com.relic.ris.theme

import androidx.compose.animation.core.LinearEasing
import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.tween
import androidx.compose.foundation.Canvas
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.unit.dp
import kotlin.math.PI
import kotlin.math.abs
import kotlin.math.sin

/**
 * RELIC INTERFACE SYSTEM — Canvas chart composables.
 * Kotlin port of charts.js (risLineChart / risEegBands) for BioHub.
 * The repo uses Vico; these are dependency-free RIS-styled equivalents for the
 * cases Vico is overkill, or as a reference for theming Vico to RIS.
 */

/** Line + area chart over a series of values. */
@Composable
fun RisLineChart(
    data: List<Float>,
    modifier: Modifier = Modifier,
    color: androidx.compose.ui.graphics.Color = RisCyan,
) {
    if (data.size < 2) return
    Canvas(modifier) {
        val padX = 6f; val padY = 10f
        val w = size.width; val h = size.height
        val min = data.min(); val max = data.max(); val range = (max - min).takeIf { it != 0f } ?: 1f
        fun x(i: Int) = padX + i.toFloat() / (data.size - 1) * (w - padX * 2)
        fun y(v: Float) = padY + (1f - (v - min) / range) * (h - padY * 2)
        // baseline grid
        for (g in 0..3) {
            val gy = padY + g / 3f * (h - padY * 2)
            drawLine(RisLineFaint, Offset(padX, gy), Offset(w - padX, gy), 1f)
        }
        // area
        val area = Path().apply {
            moveTo(x(0), y(data[0])); data.forEachIndexed { i, v -> lineTo(x(i), y(v)) }
            lineTo(x(data.size - 1), h - padY); lineTo(x(0), h - padY); close()
        }
        drawPath(area, color.copy(alpha = 0.20f))
        // line
        val line = Path().apply { moveTo(x(0), y(data[0])); data.forEachIndexed { i, v -> lineTo(x(i), y(v)) } }
        drawPath(line, color, style = Stroke(width = 3f))
        drawCircle(color, radius = 4f, center = Offset(x(data.size - 1), y(data.last())))
    }
}

/** EEG band-power bars: delta/theta/alpha/beta/gamma. Expects 5 normalized values. */
@Composable
fun RisEegBands(bands: List<Float>, modifier: Modifier = Modifier) {
    val cols = listOf(RisViolet, RisCyan, RisGreen, RisAmber, RisRed)
    Canvas(modifier) {
        val padX = 4f; val padTop = 8f; val padBottom = 16f
        val n = bands.size.coerceAtLeast(1)
        val bw = (size.width - padX * 2) / n
        val max = (bands.maxOrNull() ?: 1f).takeIf { it > 0f } ?: 1f
        bands.forEachIndexed { i, v ->
            val bh = v / max * (size.height - padTop - padBottom)
            val x = padX + i * bw + bw * 0.18f
            val barW = bw * 0.64f
            // track
            drawRect(RisLineFaint, topLeft = Offset(x, padTop), size = androidx.compose.ui.geometry.Size(barW, size.height - padTop - padBottom))
            // bar
            drawRect(cols[i % cols.size], topLeft = Offset(x, padTop + (size.height - padTop - padBottom - bh)), size = androidx.compose.ui.geometry.Size(barW, bh))
        }
    }
}

/** Live multi-channel EEG waveform (e.g. Muse TP9/AF7/AF8/TP10). */
@Composable
fun RisEegWaveform(
    channels: List<List<Float>>,
    modifier: Modifier = Modifier,
    colors: List<androidx.compose.ui.graphics.Color> = listOf(RisCyan, RisAmber, RisGreen, RisViolet),
) {
    Canvas(modifier) {
        val rows = channels.size.coerceAtLeast(1)
        val rowH = size.height / rows
        channels.forEachIndexed { ci, series ->
            if (series.size < 2) return@forEachIndexed
            val baseY = rowH * ci + rowH / 2
            val amp = rowH * 0.4f
            val path = Path()
            series.forEachIndexed { i, v ->
                val px = i.toFloat() / (series.size - 1) * size.width
                val py = baseY - v.coerceIn(-1f, 1f) * amp
                if (i == 0) path.moveTo(px, py) else path.lineTo(px, py)
            }
            drawPath(path, colors[ci % colors.size], style = Stroke(width = 1.5f))
        }
    }
}

/**
 * Decorative voice-activity indicator — animated symmetric bars (NOT real
 * amplitude). Idle = faint flat line; [active] drives the motion. RIS HUD style:
 * one accent [tone], hard round-capped bars. Size via [modifier] (e.g. height 46.dp).
 */
@Composable
fun RisVoiceWave(
    active: Boolean,
    modifier: Modifier = Modifier,
    tone: androidx.compose.ui.graphics.Color = RisCyan,
    bars: Int = 26,
) {
    val phase by rememberInfiniteTransition(label = "ris-voice").animateFloat(
        initialValue = 0f,
        targetValue = 2f * PI.toFloat(),
        animationSpec = infiniteRepeatable(tween(1100, easing = LinearEasing), RepeatMode.Restart),
        label = "ris-voice-phase",
    )
    Canvas(modifier) {
        val mid = size.height / 2f
        val step = size.width / bars
        val sw = step * 0.45f
        for (i in 0 until bars) {
            val x = i * step + step / 2f
            val a = if (active) 0.18f + 0.82f * abs(sin(phase + i * 0.55f)) else 0.10f
            val bh = mid * a
            drawLine(tone, Offset(x, mid - bh), Offset(x, mid + bh), strokeWidth = sw, cap = StrokeCap.Round)
        }
    }
}

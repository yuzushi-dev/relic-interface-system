package design.ris

import androidx.compose.foundation.Canvas
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.PathEffect
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.graphics.nativeCanvas
import androidx.compose.ui.graphics.toArgb
import androidx.compose.ui.unit.dp
import java.time.Instant
import java.time.ZoneId
import java.time.temporal.ChronoUnit

/**
 * RELIC INTERFACE SYSTEM — Canvas chart composables.
 */

/** Line + area chart over a series of values. */
@Composable
fun RisLineChart(
    data: List<Float>,
    modifier: Modifier = Modifier,
    color: Color = RisCyberSkin.Cyan,
) {
    if (data.size < 2) return
    Canvas(modifier) {
        val padX = 6f
        val padY = 10f
        val w = size.width
        val h = size.height
        val min = data.min()
        val max = data.max()
        val range = (max - min).takeIf { it != 0f } ?: 1f

        fun x(i: Int) = padX + i.toFloat() / (data.size - 1) * (w - padX * 2)
        fun y(v: Float) = padY + (1f - (v - min) / range) * (h - padY * 2)

        // Baseline grid lines
        for (g in 0..3) {
            val gy = padY + g / 3f * (h - padY * 2)
            drawLine(RisCyberSkin.LineFaint, Offset(padX, gy), Offset(w - padX, gy), 1f)
        }

        // Fill area
        val area = Path().apply {
            moveTo(x(0), y(data[0]))
            data.forEachIndexed { i, v -> lineTo(x(i), y(v)) }
            lineTo(x(data.size - 1), h - padY)
            lineTo(x(0), h - padY)
            close()
        }
        drawPath(area, color.copy(alpha = 0.20f))

        // Stroke line
        val line = Path().apply {
            moveTo(x(0), y(data[0]))
            data.forEachIndexed { i, v -> lineTo(x(i), y(v)) }
        }
        drawPath(line, color, style = Stroke(width = 3f))
        drawCircle(color, radius = 4f, center = Offset(x(data.size - 1), y(data.last())))
    }
}

/**
 * Time series chart: x proportional to time, local-midnight day separators
 * with dynamically sampled day-of-month labels (prevents label overlapping),
 * min/max Y labels, and optional personal baseline band.
 */
@Composable
fun RisTimeSeriesChart(
    points: List<Pair<Long, Float>>,
    modifier: Modifier = Modifier,
    color: Color = RisCyberSkin.Cyan,
    baselineMedian: Float? = null,
    baselineSigma: Float? = null,
    valueFormat: (Float) -> String = { "%.0f".format(it) },
) {
    if (points.size < 2) return
    val zone = ZoneId.systemDefault()
    Canvas(modifier) {
        val labelPaint = android.graphics.Paint().apply {
            textSize = 9.dp.toPx()
            isAntiAlias = true
            this.color = RisCyberSkin.Fg3.toArgb()
            typeface = android.graphics.Typeface.MONOSPACE
        }
        val padLeft = 6f
        val padRight = labelPaint.measureText("888") + 8f
        val padTop = 12f
        val padBottom = labelPaint.textSize + 8f
        val w = size.width
        val h = size.height

        val tMin = points.first().first
        val tMax = points.last().first
        val tRange = (tMax - tMin).takeIf { it > 0 } ?: 1L

        var vMin = points.minOf { it.second }
        var vMax = points.maxOf { it.second }
        if (baselineMedian != null && baselineSigma != null) {
            vMin = minOf(vMin, baselineMedian - baselineSigma * 2)
            vMax = maxOf(vMax, baselineMedian + baselineSigma * 2)
        }
        val vSpan = (vMax - vMin).takeIf { it > 0.001f } ?: 1f
        val vMinPadded = vMin - vSpan * 0.08f
        val vMaxPadded = vMax + vSpan * 0.08f
        val vRange = vMaxPadded - vMinPadded

        val plotW = w - padLeft - padRight
        val plotH = h - padTop - padBottom

        fun x(t: Long): Float = padLeft + ((t - tMin).toFloat() / tRange) * plotW
        fun y(v: Float): Float = padTop + (1f - (v - vMinPadded) / vRange) * plotH

        // Day separators with dynamic stride to prevent label cluttering
        val startDay = Instant.ofEpochMilli(tMin).atZone(zone).truncatedTo(ChronoUnit.DAYS)
        val endDay = Instant.ofEpochMilli(tMax).atZone(zone).truncatedTo(ChronoUnit.DAYS)
        val totalDays = ChronoUnit.DAYS.between(startDay, endDay).toInt()
        val stepDays = when {
            totalDays <= 7 -> 1
            totalDays <= 14 -> 2
            totalDays <= 31 -> 5
            totalDays <= 60 -> 10
            else -> 15
        }

        var cur = startDay.plusDays(1)
        var dayIndex = 1
        while (!cur.isAfter(endDay)) {
            if (dayIndex % stepDays == 0) {
                val dayMillis = cur.toInstant().toEpochMilli()
                val gx = x(dayMillis)
                drawLine(
                    color = RisCyberSkin.LineFaint,
                    start = Offset(gx, padTop),
                    end = Offset(gx, padTop + plotH),
                    strokeWidth = 1f
                )
                val dayLabel = cur.dayOfMonth.toString()
                val textW = labelPaint.measureText(dayLabel)
                drawContext.canvas.nativeCanvas.drawText(
                    dayLabel,
                    gx - textW / 2f,
                    h - 2f,
                    labelPaint
                )
            }
            cur = cur.plusDays(1)
            dayIndex++
        }

        // Baseline band (median ± 2σ)
        if (baselineMedian != null && baselineSigma != null) {
            val topY = y(baselineMedian + baselineSigma * 2).coerceIn(padTop, padTop + plotH)
            val botY = y(baselineMedian - baselineSigma * 2).coerceIn(padTop, padTop + plotH)
            val medY = y(baselineMedian).coerceIn(padTop, padTop + plotH)
            drawRect(
                color = color.copy(alpha = 0.08f),
                topLeft = Offset(padLeft, topY),
                size = androidx.compose.ui.geometry.Size(plotW, (botY - topY).coerceAtLeast(0f))
            )
            drawLine(
                color = color.copy(alpha = 0.35f),
                start = Offset(padLeft, medY),
                end = Offset(padLeft + plotW, medY),
                strokeWidth = 1.5f,
                pathEffect = PathEffect.dashPathEffect(floatArrayOf(8f, 6f))
            )
        }

        // Fill area
        val area = Path().apply {
            moveTo(x(points[0].first), y(points[0].second))
            points.forEach { (t, v) -> lineTo(x(t), y(v)) }
            lineTo(x(points.last().first), padTop + plotH)
            lineTo(x(points[0].first), padTop + plotH)
            close()
        }
        drawPath(area, color.copy(alpha = 0.18f))

        // Stroke line
        val line = Path().apply {
            moveTo(x(points[0].first), y(points[0].second))
            points.forEach { (t, v) -> lineTo(x(t), y(v)) }
        }
        drawPath(line, color, style = Stroke(width = 3.5f))

        // End pulse marker
        val lastP = points.last()
        val endCenter = Offset(x(lastP.first), y(lastP.second))
        drawCircle(color.copy(alpha = 0.35f), radius = 6f, center = endCenter)
        drawCircle(color, radius = 3.5f, center = endCenter)

        // Min / Max Y labels
        val maxYText = valueFormat(vMax)
        val minYText = valueFormat(vMin)
        drawContext.canvas.nativeCanvas.drawText(
            maxYText,
            w - padRight + 4f,
            padTop + labelPaint.textSize,
            labelPaint
        )
        drawContext.canvas.nativeCanvas.drawText(
            minYText,
            w - padRight + 4f,
            padTop + plotH,
            labelPaint
        )
    }
}

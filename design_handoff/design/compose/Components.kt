package com.relic.ris.theme

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RectangleShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

/**
 * RELIC INTERFACE SYSTEM — building-block composables.
 * Extends Theme.kt (RisPanel/RisChip/RisSegMeter/RisMeter) with the higher-level
 * pieces the kits use: labels, stats, metric cards, risk/stream badges,
 * calibration sliders, dialectical facet spectrums, buttons.
 *
 * Handoff reference — adapt to the app's conventions; wire fonts in Type.kt.
 */

// ── Text atoms ──────────────────────────────────────────────────────────────
/** Small uppercase metadata label (use RisFgMeta on dark surfaces for AA). */
@Composable
fun RisLabelText(text: String, color: Color = RisFgMeta, modifier: Modifier = Modifier) {
    Text(text.uppercase(), style = RisLabel, color = color, modifier = modifier)
}

/** Big tabular display numeral. */
@Composable
fun RisStatText(text: String, size: Int = 24, color: Color = RisFg1, modifier: Modifier = Modifier) {
    Text(text, style = RisH2.copy(fontSize = size.sp, lineHeight = (size + 2).sp), color = color, modifier = modifier)
}

// ── KPI / metric card ─────────────────────────────────────────────────────
/** Telemetry card: left accent rail + label + big value + optional delta line. */
@Composable
fun RisMetricCard(
    label: String,
    value: String,
    unit: String? = null,
    accent: Color = RisCyan,
    delta: String? = null,
    deltaColor: Color = RisFgMeta,
    modifier: Modifier = Modifier,
) {
    RisPanel(modifier = modifier, cut = 8.dp) {
        Box(Modifier.width(2.dp).fillMaxHeight().background(accent).align(Alignment.CenterStart))
        Column(Modifier.padding(start = 15.dp, top = 13.dp, end = 13.dp, bottom = 13.dp)) {
            RisLabelText(label)
            Row(verticalAlignment = Alignment.Bottom) {
                RisStatText(value, size = 30)
                unit?.let { Text(" $it", style = RisMono.copy(fontSize = 12.sp), color = RisFgMeta, modifier = Modifier.padding(bottom = 3.dp)) }
            }
            delta?.let { Spacer(Modifier.height(6.dp)); Text(it, style = RisMono.copy(fontSize = 10.sp), color = deltaColor) }
        }
    }
}

// ── Risk badge ──────────────────────────────────────────────────────────────
@Composable
fun RisRiskBadge(level: String, modifier: Modifier = Modifier) {
    val c = risRiskColor(level)
    Box(
        modifier
            .border(1.dp, if (level.equals("none", true)) RisLineStrong else c.copy(alpha = 0.45f))
            .background(if (level.equals("none", true)) Color.Transparent else c.copy(alpha = 0.12f))
            .padding(horizontal = 8.dp, vertical = 2.dp)
    ) { Text(level.uppercase(), style = RisMono.copy(fontSize = 10.sp, letterSpacing = 0.6.sp), color = c) }
}

// ── Stream chip (provenance/governance taxonomy) ────────────────────────────
fun risStreamColor(stream: String): Color = when (stream.lowercase()) {
    "evidence" -> RisStreamEvidence; "inference" -> RisStreamInference
    "pending" -> RisStreamPending; "approved" -> RisStreamApproved
    "blocked" -> RisStreamBlocked; "gumi" -> RisStreamGumi
    "runtime" -> RisStreamRuntime; "correction" -> RisStreamCorrection
    else -> RisFg3
}
@Composable
fun RisStreamChip(stream: String, label: String = stream, modifier: Modifier = Modifier) =
    RisChip(label = label, tone = risStreamColor(stream), modifier = modifier)

// ── Calibration slider (label + value + needle on a track) ──────────────────
@Composable
fun RisCalibration(label: String, value: Float, max: Float = 7f, tone: Color = RisCyan, modifier: Modifier = Modifier) {
    Column(modifier.padding(vertical = 9.dp)) {
        Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
            Text(label, style = RisMono.copy(fontSize = 11.sp), color = RisFgMeta)
            Text(String.format("%.2f", value), style = RisMono.copy(fontSize = 11.sp), color = RisFg1)
        }
        Spacer(Modifier.height(7.dp))
        Box(Modifier.fillMaxWidth().height(8.dp).background(RisVoid).border(1.dp, RisLineStrong)) {
            val frac = (value / max).coerceIn(0f, 1f)
            Box(
                Modifier.fillMaxWidth(frac).fillMaxHeight()
            ) { Box(Modifier.width(4.dp).fillMaxHeight().background(tone).align(Alignment.CenterEnd)) }
        }
    }
}

// ── Dialectical facet spectrum (needle at pos + confidence bar) ─────────────
@Composable
fun RisFacetSpectrum(
    name: String, leftAnchor: String, rightAnchor: String,
    pos: Float, conf: Float, obs: Int, modifier: Modifier = Modifier,
) {
    val confColor = if (conf >= 0.7f) RisGreen else if (conf >= 0.4f) RisAmber else RisRed
    Column(modifier.padding(vertical = 13.dp)) {
        Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween, verticalAlignment = Alignment.Bottom) {
            Text(name.uppercase(), style = RisH3.copy(fontSize = 13.sp), color = RisFg1)
            Text("pos ${"%.2f".format(pos)} · conf ${"%.2f".format(conf)} · obs $obs", style = RisMono.copy(fontSize = 10.sp), color = RisFgMeta)
        }
        Spacer(Modifier.height(9.dp))
        Row(verticalAlignment = Alignment.CenterVertically) {
            Text(leftAnchor.uppercase(), style = RisMono.copy(fontSize = 9.sp), color = RisFg3, modifier = Modifier.width(72.dp))
            Box(Modifier.weight(1f).height(8.dp).background(RisVoid).border(1.dp, RisLineStrong)) {
                Box(Modifier.fillMaxWidth(pos.coerceIn(0f, 1f)).fillMaxHeight()) {
                    Box(Modifier.width(3.dp).fillMaxHeight().background(RisCyan).align(Alignment.CenterEnd))
                }
            }
            Text(rightAnchor.uppercase(), style = RisMono.copy(fontSize = 9.sp), color = RisFg3, textAlign = TextAlign.End, modifier = Modifier.width(72.dp))
        }
        Spacer(Modifier.height(7.dp))
        Box(Modifier.fillMaxWidth().height(3.dp).background(RisVoid).border(1.dp, RisLine)) {
            Box(Modifier.fillMaxWidth(conf.coerceIn(0f, 1f)).fillMaxHeight().background(confColor))
        }
    }
}

// ── Button (clipped, uppercase, accent variants) ────────────────────────────
enum class RisBtnVariant { Primary, Secondary, Danger, Ghost }
@Composable
fun RisButton(
    label: String,
    onClick: () -> Unit,
    variant: RisBtnVariant = RisBtnVariant.Primary,
    enabled: Boolean = true,
    modifier: Modifier = Modifier,
) {
    val (fill, fg, line) = when (variant) {
        RisBtnVariant.Primary   -> Triple(RisAmber, RisFgInvert, RisAmber)
        RisBtnVariant.Secondary -> Triple(Color.Transparent, RisCyan, RisCyanLine)
        RisBtnVariant.Danger    -> Triple(Color.Transparent, RisRed, RisRedLine)
        RisBtnVariant.Ghost     -> Triple(Color.Transparent, RisFg2, RisLine)
    }
    Box(
        modifier
            .clip(risClip(7.dp))
            .background(if (enabled) fill else RisSurface1)
            .border(1.dp, if (enabled) line else RisLine, risClip(7.dp))
            .then(if (enabled) Modifier.clickableNoRipple(onClick) else Modifier)
            .padding(horizontal = 16.dp, vertical = 11.dp),
        contentAlignment = Alignment.Center,
    ) {
        Text(label.uppercase(), style = RisLabel.copy(fontSize = 11.sp), color = if (enabled) fg else RisFg4)
    }
}

// tiny helper so the file is self-contained
@Composable
private fun Modifier.clickableNoRipple(onClick: () -> Unit): Modifier =
    this.then(androidx.compose.foundation.clickable(
        interactionSource = androidx.compose.runtime.remember { androidx.compose.foundation.interaction.MutableInteractionSource() },
        indication = null,
        onClick = onClick,
    ))

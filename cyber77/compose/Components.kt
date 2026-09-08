package design.ris

import androidx.compose.animation.core.LinearEasing
import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.material3.LocalContentColor
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.expandVertically
import androidx.compose.animation.shrinkVertically
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.RectangleShape
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import java.util.Locale

/**
 * RELIC INTERFACE SYSTEM — Canonical Jetpack Compose Components.
 */

// ── Panels & Cards ─────────────────────────────────────────────────────────

@Composable
fun RisPanel(
    modifier: Modifier = Modifier,
    cut: Dp = RisClip,
    border: Color = RisCyberSkin.Line,
    background: Color = RisCyberSkin.Surface1,
    content: @Composable BoxScope.() -> Unit,
) {
    val shape = risClip(cut)
    Box(
        modifier = modifier
            .clip(shape)
            .background(background)
            .border(1.dp, border, shape),
        content = content,
    )
}

// ── Buttons ─────────────────────────────────────────────────────────────────

enum class RisButtonVariant { Primary, Secondary, Ghost, Danger }

@Composable
fun RisButton(
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    variant: RisButtonVariant = RisButtonVariant.Primary,
    enabled: Boolean = true,
    leadingIcon: (@Composable () -> Unit)? = null,
    content: @Composable RowScope.() -> Unit,
) {
    val (bgColor, borderColor, contentColor) = when (variant) {
        RisButtonVariant.Primary -> Triple(
            if (enabled) RisCyberSkin.YellowFill else RisCyberSkin.Surface3,
            if (enabled) RisCyberSkin.YellowLine else RisCyberSkin.LineFaint,
            if (enabled) RisCyberSkin.OnAccent else RisCyberSkin.Fg4,
        )
        RisButtonVariant.Secondary -> Triple(
            if (enabled) RisCyberSkin.Surface2 else RisCyberSkin.Surface1,
            if (enabled) RisCyberSkin.LineStrong else RisCyberSkin.LineFaint,
            if (enabled) RisCyberSkin.Fg1 else RisCyberSkin.Fg4,
        )
        RisButtonVariant.Ghost -> Triple(
            Color.Transparent,
            if (enabled) RisCyberSkin.Line else RisCyberSkin.LineFaint,
            if (enabled) RisCyberSkin.Fg2 else RisCyberSkin.Fg4,
        )
        RisButtonVariant.Danger -> Triple(
            if (enabled) RisCyberSkin.RedFill else RisCyberSkin.Surface3,
            if (enabled) RisCyberSkin.RedLine else RisCyberSkin.LineFaint,
            if (enabled) RisCyberSkin.OnAccent else RisCyberSkin.Fg4,
        )
    }

    val shape = risClip(RisClipSm)

    Box(
        modifier = modifier
            .clip(shape)
            .background(bgColor)
            .border(1.dp, borderColor, shape)
            .then(
                if (enabled && variant == RisButtonVariant.Primary) {
                    Modifier.shadow(8.dp, shape, ambientColor = RisCyberSkin.YellowGlow, spotColor = RisCyberSkin.YellowGlow)
                } else Modifier
            )
            .then(if (enabled) Modifier.clickable(onClick = onClick) else Modifier)
            .padding(horizontal = 16.dp, vertical = 11.dp),
        contentAlignment = Alignment.Center,
    ) {
        Row(
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.Center,
        ) {
            leadingIcon?.let {
                it()
                Spacer(Modifier.width(8.dp))
            }
            CompositionLocalProvider(LocalContentColor provides contentColor) {
                content()
            }
        }
    }
}

@Composable
fun RisButton(
    text: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    variant: RisButtonVariant = RisButtonVariant.Primary,
    enabled: Boolean = true,
    leadingIcon: (@Composable () -> Unit)? = null,
) {
    RisButton(
        onClick = onClick,
        modifier = modifier,
        variant = variant,
        enabled = enabled,
        leadingIcon = leadingIcon,
    ) {
        Text(
            text = text.uppercase(Locale.ENGLISH),
            style = RisLabel.copy(fontSize = 12.sp, fontWeight = FontWeight.Bold),
        )
    }
}

// ── SubTabs (Segmented Controls) ───────────────────────────────────────────

@Composable
fun RisSubTabs(
    items: List<String>,
    selectedIndex: Int,
    onSelect: (Int) -> Unit,
    modifier: Modifier = Modifier,
    scrollable: Boolean = false,
) {
    val rowModifier = if (scrollable) {
        modifier
            .horizontalScroll(rememberScrollState())
            .border(1.dp, RisCyberSkin.LineStrong)
            .background(RisCyberSkin.Surface1)
    } else {
        modifier
            .border(1.dp, RisCyberSkin.LineStrong)
            .background(RisCyberSkin.Surface1)
    }

    Row(modifier = rowModifier) {
        items.forEachIndexed { index, label ->
            val isSelected = index == selectedIndex
            val itemModifier = if (scrollable) {
                Modifier
                    .background(if (isSelected) RisCyberSkin.YellowFill else Color.Transparent)
                    .clickable { onSelect(index) }
                    .padding(vertical = 9.dp, horizontal = 14.dp)
            } else {
                Modifier
                    .weight(1f)
                    .background(if (isSelected) RisCyberSkin.YellowFill else Color.Transparent)
                    .clickable { onSelect(index) }
                    .padding(vertical = 9.dp, horizontal = 4.dp)
            }
            Box(
                modifier = itemModifier,
                contentAlignment = Alignment.Center,
            ) {
                Text(
                    text = label.uppercase(Locale.ENGLISH),
                    style = RisLabel.copy(
                        fontSize = 11.sp,
                        fontWeight = if (isSelected) FontWeight.Bold else FontWeight.SemiBold,
                    ),
                    color = if (isSelected) RisCyberSkin.OnAccent else RisCyberSkin.Fg3,
                    maxLines = 1,
                )
            }
            if (index < items.size - 1) {
                Box(
                    Modifier
                        .width(1.dp)
                        .height(32.dp)
                        .background(RisCyberSkin.Line)
                )
            }
        }
    }
}

// ── Text Inputs ─────────────────────────────────────────────────────────────

@Composable
fun RisTextField(
    value: String,
    onValueChange: (String) -> Unit,
    modifier: Modifier = Modifier,
    label: String? = null,
    placeholder: String? = null,
    leadingIcon: (@Composable () -> Unit)? = null,
    trailingIcon: (@Composable () -> Unit)? = null,
    singleLine: Boolean = true,
    enabled: Boolean = true,
    isError: Boolean = false,
) {
    OutlinedTextField(
        value = value,
        onValueChange = onValueChange,
        modifier = modifier,
        label = label?.let { { Text(it.uppercase(Locale.ENGLISH), style = RisEyebrow.copy(fontSize = 10.sp)) } },
        placeholder = placeholder?.let { { Text(it, style = RisMono.copy(color = RisCyberSkin.Fg4)) } },
        leadingIcon = leadingIcon,
        trailingIcon = trailingIcon,
        singleLine = singleLine,
        enabled = enabled,
        isError = isError,
        shape = RectangleShape,
        textStyle = RisMono.copy(color = RisCyberSkin.Fg1, fontSize = 14.sp),
        colors = OutlinedTextFieldDefaults.colors(
            focusedContainerColor = RisCyberSkin.Surface2,
            unfocusedContainerColor = RisCyberSkin.Surface1,
            disabledContainerColor = RisCyberSkin.Void,
            errorContainerColor = RisCyberSkin.Surface1,
            focusedBorderColor = RisCyberSkin.Yellow,
            unfocusedBorderColor = RisCyberSkin.Line,
            errorBorderColor = RisCyberSkin.Red,
            focusedLabelColor = RisCyberSkin.Yellow,
            unfocusedLabelColor = RisCyberSkin.Fg3,
            cursorColor = RisCyberSkin.Yellow,
        )
    )
}

// ── Progress Bar ────────────────────────────────────────────────────────────

@Composable
fun RisProgressBar(
    modifier: Modifier = Modifier,
    progress: Float? = null,
    tone: Color = RisCyberSkin.Yellow,
) {
    if (progress != null) {
        RisMeter(value = progress, tone = tone, modifier = modifier)
    } else {
        val transition = rememberInfiniteTransition(label = "ris_progress")
        val anim by transition.animateFloat(
            initialValue = 0f,
            targetValue = 1f,
            animationSpec = infiniteRepeatable(
                animation = tween(1200, easing = LinearEasing),
                repeatMode = RepeatMode.Restart,
            ),
            label = "ris_progress_anim",
        )
        androidx.compose.foundation.Canvas(
            modifier = modifier
                .height(6.dp)
                .background(RisCyberSkin.Surface3)
                .border(1.dp, RisCyberSkin.Line)
        ) {
            val totalW = size.width
            val barW = totalW * 0.35f
            val startX = (anim * (totalW + barW)) - barW
            val drawStart = if (startX < 0f) 0f else startX
            val drawEnd = if (startX + barW > totalW) totalW else startX + barW
            val drawWidth = if (drawEnd > drawStart) drawEnd - drawStart else 0f
            drawRect(
                color = tone,
                topLeft = Offset(drawStart, 0f),
                size = Size(drawWidth, size.height),
            )
        }
    }
}

@Composable
fun RisMeter(
    value: Float,
    modifier: Modifier = Modifier,
    tone: Color = RisCyberSkin.Cyan,
) {
    val clamped = value.coerceIn(0f, 1f)
    Box(
        modifier = modifier
            .fillMaxWidth()
            .height(6.dp)
            .background(RisCyberSkin.Surface2)
            .border(1.dp, RisCyberSkin.Line)
    ) {
        Box(
            modifier = Modifier
                .fillMaxHeight()
                .fillMaxWidth(clamped)
                .background(tone)
        )
    }
}

// ── Badges & Chips ──────────────────────────────────────────────────────────

@Composable
fun RisChip(
    label: String,
    modifier: Modifier = Modifier,
    tone: Color = RisCyberSkin.Cyan,
) {
    Box(
        modifier = modifier
            .clip(risClip(RisClipSm))
            .border(1.dp, tone.copy(alpha = 0.5f), risClip(RisClipSm))
            .background(tone.copy(alpha = 0.12f))
            .padding(horizontal = 8.dp, vertical = 3.dp),
        contentAlignment = Alignment.Center,
    ) {
        Text(
            text = label.uppercase(Locale.ENGLISH),
            style = RisEyebrow.copy(fontSize = 10.sp),
            color = tone,
        )
    }
}

// ── Motion System Constants ────────────────────────────────────────────────

object RisMotion {
    const val DurInstant = 80
    const val DurFast = 140
    const val DurBase = 200
    const val DurEnter = 240
}

// ── Segmented Meter & HUD Stats ────────────────────────────────────────────

@Composable
fun RisSegmentedMeter(
    totalSegments: Int,
    activeSegments: Int,
    modifier: Modifier = Modifier,
    activeColor: Color = RisCyberSkin.Green,
    inactiveColor: Color = RisCyberSkin.Surface3,
    segmentWidth: Dp = 8.dp,
    segmentHeight: Dp = 8.dp,
    gap: Dp = 3.dp,
) {
    Row(
        modifier = modifier,
        horizontalArrangement = Arrangement.spacedBy(gap),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        for (i in 0 until totalSegments) {
            val isActive = i < activeSegments
            Box(
                modifier = Modifier
                    .width(segmentWidth)
                    .height(segmentHeight)
                    .background(if (isActive) activeColor else inactiveColor)
                    .border(0.5.dp, if (isActive) activeColor.copy(alpha = 0.8f) else RisCyberSkin.LineFaint)
            )
        }
    }
}

@Composable
fun RisStat(
    value: String,
    label: String,
    modifier: Modifier = Modifier,
    totalSegments: Int = 5,
    activeSegments: Int = 3,
    tone: Color = RisCyberSkin.Cyan,
) {
    Row(
        modifier = modifier,
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(8.dp),
    ) {
        Text(
            text = value,
            style = RisH3.copy(fontSize = 18.sp, fontWeight = FontWeight.Bold, color = tone),
        )
        Text(
            text = label.uppercase(Locale.ENGLISH),
            style = RisLabel.copy(fontSize = 10.sp, color = RisCyberSkin.Green),
        )
        RisSegmentedMeter(
            totalSegments = totalSegments,
            activeSegments = activeSegments,
            activeColor = RisCyberSkin.Green,
        )
    }
}

// ── List Row (HUD / Master-Detail Item) ─────────────────────────────────────

@Composable
fun RisListRow(
    title: String,
    meta: String,
    time: String,
    modifier: Modifier = Modifier,
    selected: Boolean = false,
    thumb: (@Composable () -> Unit)? = null,
    onClick: (() -> Unit)? = null,
) {
    val shape = risClip(RisClipSm)
    val bgColor = if (selected) RisCyberSkin.RedFill else RisCyberSkin.Surface1
    val borderColor = if (selected) RisCyberSkin.RedFill else RisCyberSkin.Line
    val titleColor = if (selected) RisCyberSkin.OnAccent else RisCyberSkin.Cyan
    val metaColor = if (selected) RisCyberSkin.OnAccent else RisCyberSkin.Red
    val timeColor = if (selected) RisCyberSkin.OnAccent else RisCyberSkin.Red

    Row(
        modifier = modifier
            .fillMaxWidth()
            .clip(shape)
            .background(bgColor)
            .border(1.dp, borderColor, shape)
            .then(if (onClick != null) Modifier.clickable(onClick = onClick) else Modifier)
            .padding(horizontal = 14.dp, vertical = 10.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(12.dp),
    ) {
        thumb?.let {
            Box(
                modifier = Modifier
                    .size(width = 56.dp, height = 40.dp)
                    .background(RisCyberSkin.Surface3)
                    .border(1.dp, RisCyberSkin.Line),
                contentAlignment = Alignment.Center,
            ) {
                it()
            }
        }
        Column(
            modifier = Modifier.weight(1f),
            verticalArrangement = Arrangement.Center,
        ) {
            Text(
                text = title,
                style = RisH3.copy(fontSize = 13.sp, fontWeight = FontWeight.SemiBold, color = titleColor),
                maxLines = 1,
            )
            Spacer(Modifier.height(2.dp))
            Text(
                text = meta.uppercase(Locale.ENGLISH),
                style = RisMono.copy(fontSize = 10.sp, color = metaColor),
                maxLines = 1,
            )
        }
        Text(
            text = time,
            style = RisMono.copy(fontSize = 11.sp, color = timeColor),
        )
    }
}

// ── Accordion Disclosure ───────────────────────────────────────────────────

@Composable
fun RisAccordion(
    title: String,
    expanded: Boolean,
    onToggle: () -> Unit,
    modifier: Modifier = Modifier,
    content: @Composable () -> Unit,
) {
    val shape = risClip(RisClipSm)
    Column(
        modifier = modifier
            .fillMaxWidth()
            .clip(shape)
            .border(1.dp, RisCyberSkin.Line, shape)
            .background(RisCyberSkin.Surface1),
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .background(if (expanded) RisCyberSkin.Surface2 else RisCyberSkin.Surface1)
                .clickable(onClick = onToggle)
                .padding(horizontal = 14.dp, vertical = 12.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween,
        ) {
            Text(
                text = title.uppercase(Locale.ENGLISH),
                style = RisLabel.copy(
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Bold,
                    color = if (expanded) RisCyberSkin.Yellow else RisCyberSkin.Fg1,
                ),
            )
            Text(
                text = if (expanded) "▲" else "▼",
                style = RisMono.copy(fontSize = 10.sp, color = if (expanded) RisCyberSkin.Yellow else RisCyberSkin.Fg3),
            )
        }

        AnimatedVisibility(
            visible = expanded,
            enter = expandVertically(animationSpec = tween(RisMotion.DurBase)) + fadeIn(animationSpec = tween(RisMotion.DurBase)),
            exit = shrinkVertically(animationSpec = tween(RisMotion.DurBase)) + fadeOut(animationSpec = tween(RisMotion.DurBase)),
        ) {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .border(0.5.dp, RisCyberSkin.LineFaint)
                    .padding(14.dp)
            ) {
                content()
            }
        }
    }
}

// ── Tactical Bottom Sheet ──────────────────────────────────────────────────

@Composable
fun RisBottomSheet(
    onDismissRequest: () -> Unit,
    modifier: Modifier = Modifier,
    header: (@Composable RowScope.() -> Unit)? = null,
    content: @Composable ColumnScope.() -> Unit,
) {
    Box(
        modifier = modifier
            .fillMaxWidth()
            .background(RisCyberSkin.Surface1)
            .border(1.dp, RisCyberSkin.LineStrong)
            .padding(top = 8.dp, bottom = 24.dp, start = 16.dp, end = 16.dp),
    ) {
        Column(
            modifier = Modifier.fillMaxWidth(),
            horizontalAlignment = Alignment.CenterHorizontally,
        ) {
            // Drag Handle
            Box(
                modifier = Modifier
                    .width(44.dp)
                    .height(4.dp)
                    .background(RisCyberSkin.Fg3)
                    .clickable(onClick = onDismissRequest)
            )
            Spacer(Modifier.height(14.dp))

            if (header != null) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.SpaceBetween,
                ) {
                    header()
                }
                Spacer(Modifier.height(12.dp))
            }

            content()
        }
    }
}

// ── HUD Toast ──────────────────────────────────────────────────────────────

@Composable
fun RisToast(
    title: String,
    message: String,
    modifier: Modifier = Modifier,
    accentColor: Color = RisCyberSkin.Yellow,
) {
    val shape = risClip(RisClipSm)
    Row(
        modifier = modifier
            .fillMaxWidth()
            .clip(shape)
            .background(RisCyberSkin.Surface1)
            .border(1.dp, RisCyberSkin.LineStrong, shape)
    ) {
        Box(
            modifier = Modifier
                .width(4.dp)
                .height(48.dp)
                .background(accentColor)
        )
        Column(
            modifier = Modifier
                .padding(horizontal = 14.dp, vertical = 8.dp),
            verticalArrangement = Arrangement.Center,
        ) {
            Text(
                text = title.uppercase(Locale.ENGLISH),
                style = RisLabel.copy(fontSize = 11.sp, fontWeight = FontWeight.Bold, color = accentColor),
            )
            Spacer(Modifier.height(2.dp))
            Text(
                text = message,
                style = RisBody.copy(fontSize = 11.sp, color = RisCyberSkin.Fg2),
            )
        }
    }
}

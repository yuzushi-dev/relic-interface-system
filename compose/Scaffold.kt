package design.ris

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.RowScope
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import java.util.Locale

/**
 * RELIC INTERFACE SYSTEM (RIS v2) — Scaffold & Navigation Bar Composables.
 *
 * Designed with Mobile OLED Safety in mind:
 * - NO full-height vertical side rulers (prevents OLED burn-in / differential wear).
 * - Safe padding and discrete hairline dividers instead of static tickers.
 * - Scrollable subtabs for compact viewports.
 */

/**
 * Root tactical scaffold container providing background backdrop, top bar,
 * bottom bar, floating action button slot, and snackbar/toast host.
 *
 * @param modifier Root modifier.
 * @param topBar Optional tactical header or [RisTopBar].
 * @param bottomBar Optional tactical navigation bar or [RisBottomBar].
 * @param snackbarHost Optional host slot for [RisToast] notifications.
 * @param floatingActionButton Optional floating action slot.
 * @param backdrop When true, applies [Modifier.cyberBackdrop] with scanlines and radial gradient.
 * @param backgroundColor Surface background tone (defaults to [RisCyberSkin.Bg]).
 * @param content Screen content receiving safe [PaddingValues].
 */
@Composable
fun RisScaffold(
    modifier: Modifier = Modifier,
    topBar: (@Composable () -> Unit)? = null,
    bottomBar: (@Composable () -> Unit)? = null,
    snackbarHost: (@Composable () -> Unit)? = null,
    floatingActionButton: (@Composable () -> Unit)? = null,
    backdrop: Boolean = true,
    backgroundColor: Color = Color.Unspecified,
    content: @Composable (PaddingValues) -> Unit,
) {
    val resolvedBg = if (backgroundColor != Color.Unspecified) backgroundColor else RisTheme.colors.bg
    val baseModifier = if (backdrop) {
        modifier
            .fillMaxSize()
            .background(resolvedBg)
            .cyberBackdrop()
    } else {
        modifier
            .fillMaxSize()
            .background(resolvedBg)
    }

    Box(modifier = baseModifier) {
        Column(modifier = Modifier.fillMaxSize()) {
            topBar?.invoke()

            Box(
                modifier = Modifier
                    .weight(1f)
                    .fillMaxWidth()
            ) {
                content(PaddingValues(0.dp))
            }

            bottomBar?.invoke()
        }

        floatingActionButton?.let { fab ->
            Box(
                modifier = Modifier
                    .align(Alignment.BottomEnd)
                    .padding(end = 16.dp, bottom = if (bottomBar != null) 72.dp else 16.dp)
            ) {
                fab()
            }
        }

        snackbarHost?.let { host ->
            Box(
                modifier = Modifier
                    .align(Alignment.BottomCenter)
                    .padding(bottom = if (bottomBar != null) 64.dp else 16.dp)
            ) {
                host()
            }
        }
    }
}

/**
 * Tactical HUD Top App Bar.
 *
 * Features chamfered styling, telemetry status badge, title, eyebrow subtitle,
 * and customizable action buttons.
 */
@Composable
fun RisTopBar(
    title: String,
    modifier: Modifier = Modifier,
    subtitle: String? = null,
    statusIndicator: String? = "SYS.ONLINE",
    statusColor: Color = Color.Unspecified,
    navigationIcon: (@Composable () -> Unit)? = null,
    actions: (@Composable RowScope.() -> Unit)? = null,
) {
    val colors = RisTheme.colors
    val resolvedStatusColor = if (statusColor != Color.Unspecified) statusColor else colors.green

    Column(
        modifier = modifier
            .fillMaxWidth()
            .background(colors.surface1)
            .border(width = 1.dp, color = colors.lineStrong)
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp, vertical = 12.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween,
        ) {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(10.dp),
                modifier = Modifier.weight(1f, fill = false),
            ) {
                navigationIcon?.invoke()
                Column {
                    Text(
                        text = title.uppercase(Locale.ENGLISH),
                        style = RisH3.copy(fontSize = 15.sp, fontWeight = FontWeight.Bold, color = colors.fg1),
                        maxLines = 1,
                    )
                    if (subtitle != null) {
                        Text(
                            text = subtitle.uppercase(Locale.ENGLISH),
                            style = RisEyebrow.copy(fontSize = 10.sp, color = colors.fg3),
                            maxLines = 1,
                        )
                    }
                }
            }

            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(12.dp),
            ) {
                if (statusIndicator != null) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(6.dp),
                    ) {
                        Box(
                            modifier = Modifier
                                .size(6.dp)
                                .background(resolvedStatusColor)
                        )
                        Text(
                            text = statusIndicator.uppercase(Locale.ENGLISH),
                            style = RisMono.copy(fontSize = 10.sp, fontWeight = FontWeight.SemiBold, color = resolvedStatusColor),
                        )
                    }
                }

                actions?.invoke(this)
            }
        }

        // Faint bottom hairline
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(1.dp)
                .background(colors.line)
        )
    }
}

/**
 * Tactical HUD Bottom Bar.
 *
 * Provides a bordered bottom container for navigation actions, subtabs, or telemetry controls.
 */
@Composable
fun RisBottomBar(
    modifier: Modifier = Modifier,
    backgroundColor: Color = Color.Unspecified,
    borderColor: Color = Color.Unspecified,
    content: @Composable RowScope.() -> Unit,
) {
    val colors = RisTheme.colors
    val resolvedBg = if (backgroundColor != Color.Unspecified) backgroundColor else colors.surface1
    val resolvedBorder = if (borderColor != Color.Unspecified) borderColor else colors.lineStrong

    Column(
        modifier = modifier
            .fillMaxWidth()
            .background(resolvedBg)
            .border(width = 1.dp, color = resolvedBorder)
    ) {
        // Top edge hairline
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(1.dp)
                .background(colors.line)
        )

        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 12.dp, vertical = 8.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceAround,
            content = content,
        )
    }
}

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
    backgroundColor: Color = RisCyberSkin.Bg,
    content: @Composable (PaddingValues) -> Unit,
) {
    val baseModifier = if (backdrop) {
        modifier
            .fillMaxSize()
            .background(backgroundColor)
            .cyberBackdrop()
    } else {
        modifier
            .fillMaxSize()
            .background(backgroundColor)
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
                    .fillMaxWidth()
                    .align(Alignment.BottomCenter)
                    .padding(horizontal = 16.dp, vertical = if (bottomBar != null) 68.dp else 16.dp)
            ) {
                host()
            }
        }
    }
}

/**
 * Tactical HUD Top Bar / Header.
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
    statusColor: Color = RisCyberSkin.Green,
    navigationIcon: (@Composable () -> Unit)? = null,
    actions: (@Composable RowScope.() -> Unit)? = null,
) {
    Column(
        modifier = modifier
            .fillMaxWidth()
            .background(RisCyberSkin.Surface1)
            .border(width = 1.dp, color = RisCyberSkin.LineStrong)
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
                        style = RisH3.copy(fontSize = 15.sp, fontWeight = FontWeight.Bold, color = RisCyberSkin.Fg1),
                        maxLines = 1,
                    )
                    if (subtitle != null) {
                        Text(
                            text = subtitle.uppercase(Locale.ENGLISH),
                            style = RisEyebrow.copy(fontSize = 10.sp, color = RisCyberSkin.Fg3),
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
                                .background(statusColor)
                        )
                        Text(
                            text = statusIndicator.uppercase(Locale.ENGLISH),
                            style = RisMono.copy(fontSize = 10.sp, fontWeight = FontWeight.SemiBold, color = statusColor),
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
                .background(RisCyberSkin.Line)
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
    backgroundColor: Color = RisCyberSkin.Surface1,
    borderColor: Color = RisCyberSkin.LineStrong,
    content: @Composable RowScope.() -> Unit,
) {
    Column(
        modifier = modifier
            .fillMaxWidth()
            .background(backgroundColor)
            .border(width = 1.dp, color = borderColor)
    ) {
        // Top edge hairline
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(1.dp)
                .background(RisCyberSkin.Line)
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

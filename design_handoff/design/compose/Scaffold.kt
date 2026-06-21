package com.relic.ris.theme

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.material3.darkColorScheme
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.composed
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

/**
 * RELIC INTERFACE SYSTEM — screen-level scaffolds.
 * App chrome (status bar, top bar, bottom nav) + a worked BioHub dashboard
 * example showing how the atoms (RisMetricCard, RisLineChart, RisEegBands)
 * compose into a full screen. Adapt to NavController / real data in the app.
 */

// ── App bars ────────────────────────────────────────────────────────────────
@Composable
fun RisTopBar(title: String, sub: String? = null, onBack: (() -> Unit)? = null, actions: @Composable RowScope.() -> Unit = {}) {
    Row(
        Modifier.fillMaxWidth().background(RisSurface1).border(0.dp, Color.Transparent)
            .padding(horizontal = 16.dp, vertical = 14.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        if (onBack != null) {
            Box(Modifier.size(32.dp).border(1.dp, RisLineStrong).clickable(onBack), contentAlignment = Alignment.Center) {
                Icon(Icons.Default.ChevronLeft, null, tint = RisCyan)
            }
            Spacer(Modifier.width(12.dp))
        }
        Column(Modifier.weight(1f)) {
            Text(title.uppercase(), style = RisH2.copy(fontSize = 24.sp, lineHeight = 25.sp), color = RisFg1)
            sub?.let { Text(it, style = RisMono.copy(fontSize = 10.sp), color = RisFgMeta, modifier = Modifier.padding(top = 4.dp)) }
        }
        actions()
    }
    Box(Modifier.fillMaxWidth().height(1.dp).background(RisLine))
}

data class RisNavItem(val id: String, val icon: ImageVector, val label: String)

@Composable
fun RisBottomNav(items: List<RisNavItem>, active: String, onNav: (String) -> Unit) {
    Box(Modifier.fillMaxWidth().height(1.dp).background(RisLine))
    Row(Modifier.fillMaxWidth().background(RisSurface1)) {
        items.forEach { item ->
            val on = item.id == active
            Column(
                Modifier.weight(1f).clickable { onNav(item.id) }.padding(vertical = 9.dp),
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.spacedBy(4.dp),
            ) {
                Icon(item.icon, null, tint = if (on) RisCyan else RisFg3, modifier = Modifier.size(20.dp))
                Text(item.label.uppercase(), style = RisLabel.copy(fontSize = 9.sp, letterSpacing = 0.8.sp), color = if (on) RisCyan else RisFg3)
            }
        }
    }
}

/** Full screen wrapper: top bar + scrollable body + bottom nav, on RIS background. */
@Composable
fun RisScreen(
    title: String, sub: String? = null,
    nav: List<RisNavItem>, active: String, onNav: (String) -> Unit,
    onBack: (() -> Unit)? = null,
    actions: @Composable RowScope.() -> Unit = {},
    body: @Composable ColumnScope.() -> Unit,
) {
    Column(Modifier.fillMaxSize().background(RisBg)) {
        RisTopBar(title, sub, onBack, actions)
        Column(Modifier.weight(1f).verticalScroll(rememberScrollState()).padding(14.dp), verticalArrangement = Arrangement.spacedBy(12.dp), content = body)
        RisBottomNav(nav, active, onNav)
    }
}

// ── Worked example: BioHub dashboard ────────────────────────────────────────
private val BIO_NAV = listOf(
    RisNavItem("dashboard", Icons.Default.Dashboard, "Dash"),
    RisNavItem("inspector", Icons.Default.List, "Inspector"),
    RisNavItem("muse", Icons.Default.Psychology, "Muse"),
    RisNavItem("sync", Icons.Default.Sync, "Sync"),
    RisNavItem("data", Icons.Default.Storage, "Data"),
)

@Composable
fun BioDashboardScreenExample(onNav: (String) -> Unit = {}) {
    RelicTheme {
        RisScreen(title = "BioHub", sub = "DASHBOARD SALUTE · SYNCED 07:41", nav = BIO_NAV, active = "dashboard", onNav = onNav) {
            Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                RisMetricCard("FC", "62", "bpm", accent = RisRed, delta = "07 mag, 07:38", modifier = Modifier.weight(1f))
                RisMetricCard("HRV", "48", "ms", accent = RisViolet, delta = "07 mag, 07:38", modifier = Modifier.weight(1f))
            }
            RisPanel(cut = 8.dp) {
                Column(Modifier.padding(12.dp)) {
                    RisLabelText("FC — 7 giorni")
                    Spacer(Modifier.height(8.dp))
                    RisLineChart(listOf(58f,61f,57f,60f,63f,59f,62f,64f,60f,58f,55f,62f,66f,61f,59f,63f), Modifier.fillMaxWidth().height(90.dp), color = RisRed)
                }
            }
            RisPanel(cut = 8.dp) {
                Column(Modifier.padding(12.dp)) {
                    RisLabelText("Muse EEG — bande")
                    Spacer(Modifier.height(8.dp))
                    RisEegBands(listOf(0.42f, 0.61f, 0.78f, 0.55f, 0.31f), Modifier.fillMaxWidth().height(90.dp))
                }
            }
        }
    }
}

// local clickable helper (no-ripple) to keep this file self-contained
private fun Modifier.clickable(onClick: () -> Unit): Modifier = composed {
    this.then(androidx.compose.foundation.clickable(
        interactionSource = androidx.compose.runtime.remember { androidx.compose.foundation.interaction.MutableInteractionSource() },
        indication = null, onClick = onClick,
    ))
}

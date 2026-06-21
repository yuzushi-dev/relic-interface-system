package com.relic.ris.theme

import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.unit.dp
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController

/**
 * RELIC INTERFACE SYSTEM — BioHub NavHost example.
 *
 * Ties the BioHub screens (Scaffold.kt + BioHubScreens.kt) together with
 * Navigation-Compose. This is the minimal wiring a developer adapts: each
 * screen already renders its own RisScreen (top bar + bottom nav + body), so
 * the host just maps routes → composables and feeds nav callbacks.
 *
 * Routes mirror the bottom nav (BIO_NAV) plus the "scale" drill-down reached
 * from the dashboard's body-composition card.
 *
 *   setContent { RelicTheme { BioHubApp() } }
 *
 * Dependency: androidx.navigation:navigation-compose.
 */
@Composable
fun BioHubApp(nav: NavHostController = rememberNavController()) {
    // current route → which bottom-nav item is highlighted
    val backStack by nav.currentBackStackEntryAsState()
    val route = backStack?.destination?.route ?: "dashboard"

    // helper: navigate to a top-level destination without stacking duplicates
    fun go(dest: String) {
        if (dest == route) return
        nav.navigate(dest) {
            popUpTo("dashboard") { saveState = true }
            launchSingleTop = true
            restoreState = true
        }
    }

    NavHost(navController = nav, startDestination = "dashboard") {
        composable("dashboard") {
            // Dashboard's body-composition card drills down to "scale"
            BioDashboardScreenRouted(active = "dashboard", onNav = ::go, onScale = { nav.navigate("scale") })
        }
        composable("inspector") { BioInspectorScreen(active = "inspector", onNav = ::go) }
        composable("muse")      { BioMuseScreen(active = "muse", onNav = ::go) }
        composable("sync")      { BioSyncScreen(active = "sync", onNav = ::go) }
        composable("data")      { BioDataScreen(active = "data", onNav = ::go) }
        composable("scale")     { BioScaleScreen(onBack = { nav.popBackStack() }, active = "dashboard", onNav = ::go) }
    }
}

/**
 * Dashboard wrapper that exposes both nav + the scale drill-down.
 * (BioDashboardScreenExample in Scaffold.kt is the standalone demo; this one
 * accepts the host's callbacks.)
 */
@Composable
fun BioDashboardScreenRouted(active: String, onNav: (String) -> Unit, onScale: () -> Unit) {
    RelicTheme {
        RisScreen(title = "BioHub", sub = "DASHBOARD SALUTE · SYNCED 07:41", nav = BIO_NAV, active = active, onNav = onNav) {
            androidx.compose.foundation.layout.Row(
                androidx.compose.ui.Modifier.fillMaxWidth(),
                horizontalArrangement = androidx.compose.foundation.layout.Arrangement.spacedBy(10.dp),
            ) {
                RisMetricCard("FC", "62", "bpm", accent = RisRed, delta = "07 mag, 07:38", modifier = androidx.compose.ui.Modifier.weight(1f))
                RisMetricCard("HRV", "48", "ms", accent = RisViolet, delta = "07 mag, 07:38", modifier = androidx.compose.ui.Modifier.weight(1f))
            }
            // body-composition card → drill-down
            RisPanel(cut = 8.dp, modifier = androidx.compose.ui.Modifier.clickableCard(onScale)) {
                androidx.compose.foundation.layout.Row(
                    androidx.compose.ui.Modifier.fillMaxWidth().padding(13.dp),
                    verticalAlignment = androidx.compose.ui.Alignment.CenterVertically,
                ) {
                    androidx.compose.material3.Icon(androidx.compose.material.icons.Icons.Default.MonitorWeight, null, tint = RisCyan, modifier = androidx.compose.ui.Modifier.size(20.dp))
                    androidx.compose.foundation.layout.Spacer(androidx.compose.ui.Modifier.width(12.dp))
                    androidx.compose.foundation.layout.Column(androidx.compose.ui.Modifier.weight(1f)) {
                        RisLabelText("Composizione corporea")
                        RisStatText("71.4 kg", size = 22)
                    }
                    androidx.compose.material3.Icon(androidx.compose.material.icons.Icons.Default.ChevronRight, null, tint = RisCyan)
                }
            }
            RisPanel(cut = 8.dp) {
                androidx.compose.foundation.layout.Column(androidx.compose.ui.Modifier.padding(12.dp)) {
                    RisLabelText("FC — 7 giorni")
                    androidx.compose.foundation.layout.Spacer(androidx.compose.ui.Modifier.height(8.dp))
                    RisLineChart(listOf(58f,61f,57f,60f,63f,59f,62f,64f,60f,58f,55f,62f,66f,61f,59f,63f),
                        androidx.compose.ui.Modifier.fillMaxWidth().height(90.dp), color = RisRed)
                }
            }
            RisPanel(cut = 8.dp) {
                androidx.compose.foundation.layout.Column(androidx.compose.ui.Modifier.padding(12.dp)) {
                    RisLabelText("Muse EEG — bande")
                    androidx.compose.foundation.layout.Spacer(androidx.compose.ui.Modifier.height(8.dp))
                    RisEegBands(listOf(0.42f, 0.61f, 0.78f, 0.55f, 0.31f), androidx.compose.ui.Modifier.fillMaxWidth().height(90.dp))
                }
            }
        }
    }
}

private fun androidx.compose.ui.Modifier.clickableCard(onClick: () -> Unit): androidx.compose.ui.Modifier =
    androidx.compose.ui.composed {
        this.then(androidx.compose.foundation.clickable(
            interactionSource = androidx.compose.runtime.remember { androidx.compose.foundation.interaction.MutableInteractionSource() },
            indication = null, onClick = onClick,
        ))
    }

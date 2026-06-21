package com.relic.ris.theme

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.composed
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.SolidColor
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

/**
 * RELIC INTERFACE SYSTEM — BioHub screen composables (Android, redesign-confirmed).
 *
 * Kotlin equivalents of the HTML/JSX prototype in ../ui_kits/biohub/. They reuse
 * the RIS atoms (Components.kt), charts (Charts.kt) and scaffold (Scaffold.kt).
 * Wire to real ViewModels / data; the values here are the prototype's placeholders.
 *
 * Bottom nav: dashboard · inspector · muse · sync · data  (+ scale drill-down).
 * Italian copy is kept verbatim from the source app.
 */

val BIO_NAV = listOf(
    RisNavItem("dashboard", Icons.Default.Dashboard, "Dash"),
    RisNavItem("inspector", Icons.Default.List, "Inspector"),
    RisNavItem("muse", Icons.Default.Psychology, "Muse"),
    RisNavItem("sync", Icons.Default.Sync, "Sync"),
    RisNavItem("data", Icons.Default.Storage, "Data"),
)

// ════════════════════════════════════════════════════════════════════════════
// INSPECTOR — Metrics / Sleep tabs
// ════════════════════════════════════════════════════════════════════════════
private data class Metric(val icon: ImageVector, val name: String, val value: String, val unit: String, val records: Int, val tone: Color)

@Composable
fun BioInspectorScreen(active: String = "inspector", onNav: (String) -> Unit = {}) {
    var tab by remember { mutableStateOf("metrics") }
    val metrics = listOf(
        Metric(Icons.Default.Favorite, "Frequenza cardiaca", "62", "bpm", 8420, RisRed),
        Metric(Icons.Default.MonitorHeart, "HRV RMSSD", "48", "ms", 1240, RisViolet),
        Metric(Icons.Default.Air, "SpO2", "97", "%", 940, RisGreen),
        Metric(Icons.Default.DirectionsWalk, "Passi", "8.2k", "/giorno", 365, RisCyan),
        Metric(Icons.Default.LocalFireDepartment, "Calorie attive", "486", "kcal", 365, RisOrange),
    )
    RisScreen(title = "Inspector", sub = "health metrics + sleep", nav = BIO_NAV, active = active, onNav = onNav) {
        RisSubTabs(listOf("metrics" to "Metrics", "sleep" to "Sleep"), tab) { tab = it }
        if (tab == "metrics") {
            metrics.forEach { m ->
                RisPanel(cut = 8.dp) {
                    Row(Modifier.fillMaxWidth().padding(13.dp), verticalAlignment = Alignment.CenterVertically) {
                        Icon(m.icon, null, tint = m.tone, modifier = Modifier.size(20.dp))
                        Spacer(Modifier.width(12.dp))
                        Column(Modifier.weight(1f)) {
                            Text(m.name, style = RisBody.copy(fontSize = 14.sp, fontWeight = FontWeightSemi), color = RisFg1)
                            Text("${m.records} record", style = RisMono.copy(fontSize = 10.sp), color = RisFgMeta)
                        }
                        RisStatText(m.value, size = 20)
                        Text(" ${m.unit}", style = RisMono.copy(fontSize = 10.sp), color = RisFgMeta)
                    }
                }
            }
        } else {
            listOf("07 mag" to "7h 12m", "06 mag" to "6h 48m", "05 mag" to "7h 31m").forEach { (d, dur) ->
                RisPanel(cut = 8.dp) {
                    Row(Modifier.fillMaxWidth().padding(13.dp), verticalAlignment = Alignment.CenterVertically) {
                        Icon(Icons.Default.Bedtime, null, tint = RisViolet, modifier = Modifier.size(20.dp))
                        Spacer(Modifier.width(12.dp))
                        Column(Modifier.weight(1f)) {
                            Text("Sessione sonno", style = RisBody.copy(fontSize = 14.sp, fontWeight = FontWeightSemi), color = RisFg1)
                            Text(d, style = RisMono.copy(fontSize = 10.sp), color = RisFgMeta)
                        }
                        RisStatText(dur, size = 18)
                    }
                }
            }
        }
    }
}

// ════════════════════════════════════════════════════════════════════════════
// MUSE — EEG recorder (BLE / OSC)
// ════════════════════════════════════════════════════════════════════════════
@Composable
fun BioMuseScreen(active: String = "muse", onNav: (String) -> Unit = {}) {
    var mode by remember { mutableStateOf("ble") }
    var recording by remember { mutableStateOf(false) }
    // demo waveform data; replace with live samples
    val channels = remember {
        List(4) { ch -> List(120) { i -> (kotlin.math.sin(i * 0.3f + ch) * 0.6f + kotlin.math.sin(i * 0.11f) * 0.3f) } }
    }
    RisScreen(title = "Muse Recorder", sub = "EEG · BLE / OSC", nav = BIO_NAV, active = active, onNav = onNav) {
        RisSubTabs(listOf("ble" to "BLE Diretto", "osc" to "OSC · Mind Monitor"), mode) { mode = it }
        RisPanel(cut = 8.dp, border = if (recording) RisGreen.copy(alpha = 0.4f) else RisLine) {
            Column(Modifier.padding(14.dp)) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Box(Modifier.size(8.dp).background(if (recording) RisGreen else RisFg3))
                    Spacer(Modifier.width(8.dp))
                    Text(if (recording) "REC · MUSE-2 CONNECTED" else "READY · " + (if (mode == "ble") "scan BLE" else "porta OSC 5000"),
                        style = RisMono.copy(fontSize = 11.sp), color = if (recording) RisGreen else RisFgMeta)
                }
            }
        }
        RisPanel(cut = 8.dp) {
            Column(Modifier.padding(12.dp)) {
                RisLabelText("Live EEG · TP9 / AF7 / AF8 / TP10")
                Spacer(Modifier.height(8.dp))
                RisEegWaveform(channels, Modifier.fillMaxWidth().height(140.dp))
            }
        }
        Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(10.dp)) {
            listOf("Durata" to (if (recording) "00:42" else "—"), "Campioni" to (if (recording) "10.7k" else "0"), "Pkt/s" to (if (recording) "256" else "0")).forEach { (k, v) ->
                RisPanel(cut = 6.dp, modifier = Modifier.weight(1f)) {
                    Column(Modifier.padding(11.dp), horizontalAlignment = Alignment.CenterHorizontally) {
                        RisLabelText(k); Spacer(Modifier.height(4.dp)); RisStatText(v, size = 17)
                    }
                }
            }
        }
        RisButton(if (recording) "Stop registrazione" else "Avvia registrazione",
            onClick = { recording = !recording },
            variant = if (recording) RisBtnVariant.Danger else RisBtnVariant.Primary,
            modifier = Modifier.fillMaxWidth())
    }
}

// ════════════════════════════════════════════════════════════════════════════
// SYNC — Health Connect
// ════════════════════════════════════════════════════════════════════════════
@Composable
fun BioSyncScreen(active: String = "sync", onNav: (String) -> Unit = {}) {
    var granted by remember { mutableStateOf(false) }
    var syncing by remember { mutableStateOf(false) }
    val sources = listOf(
        Icons.Default.Favorite to "Frequenza cardiaca (FC)", Icons.Default.MonitorHeart to "HRV RMSSD",
        Icons.Default.Air to "Saturazione O₂ (SpO2)", Icons.Default.DirectionsWalk to "Passi e distanza",
        Icons.Default.LocalFireDepartment to "Calorie attive e totali", Icons.Default.Bedtime to "Sessioni sonno",
    )
    RisScreen(title = "Health Connect", sub = "sync · permessi · cronologia", nav = BIO_NAV, active = active, onNav = onNav) {
        RisPanel(cut = 8.dp, border = RisGreen.copy(alpha = 0.4f), fill = RisGreenGlow) {
            Row(Modifier.padding(13.dp), verticalAlignment = Alignment.CenterVertically) {
                Icon(Icons.Default.CheckCircle, null, tint = RisGreen, modifier = Modifier.size(20.dp))
                Spacer(Modifier.width(12.dp))
                Column {
                    Text("Health Connect disponibile", style = RisBody.copy(fontSize = 14.sp, fontWeight = FontWeightSemi), color = RisFg1)
                    Text("provider · com.google.android.apps.healthdata", style = RisMono.copy(fontSize = 10.sp), color = RisFgMeta)
                }
            }
        }
        if (!granted) {
            RisButton("Concedi Permessi", onClick = { granted = true }, modifier = Modifier.fillMaxWidth())
        } else {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(Icons.Default.CheckCircle, null, tint = RisGreen, modifier = Modifier.size(18.dp))
                Spacer(Modifier.width(8.dp))
                Text("Permessi concessi", style = RisBody.copy(fontSize = 14.sp), color = RisGreen)
            }
            RisButton(if (syncing) "Sincronizzazione…" else "Sincronizza tutti i dati",
                onClick = { syncing = true }, variant = RisBtnVariant.Secondary, enabled = !syncing, modifier = Modifier.fillMaxWidth())
        }
        RisLabelText("Dati sincronizzati")
        RisPanel(cut = 8.dp) {
            Column {
                sources.forEachIndexed { i, (ic, label) ->
                    Row(Modifier.fillMaxWidth().padding(horizontal = 14.dp, vertical = 8.dp), verticalAlignment = Alignment.CenterVertically) {
                        Icon(ic, null, tint = RisCyan, modifier = Modifier.size(15.dp))
                        Spacer(Modifier.width(11.dp))
                        Text(label, style = RisMono.copy(fontSize = 12.sp), color = RisFg2)
                    }
                    if (i < sources.lastIndex) Box(Modifier.fillMaxWidth().height(1.dp).background(RisLineFaint))
                }
            }
        }
    }
}

// ════════════════════════════════════════════════════════════════════════════
// SCALE — body composition (drill-down from Dashboard)
// ════════════════════════════════════════════════════════════════════════════
@Composable
fun BioScaleScreen(onBack: () -> Unit, active: String = "dashboard", onNav: (String) -> Unit = {}) {
    var phase by remember { mutableStateOf("idle") } // idle/scanning/measuring/reading
    val tiles = listOf(
        "Massa grassa" to "12.14 kg", "Acqua corporea" to "54.2 %", "M. scheletrica" to "33.10 kg",
        "Massa magra (LBM)" to "59.26 kg", "Massa ossea" to "3.20 kg", "Metab. basale" to "1620 kcal",
        "Grasso viscerale" to "8.0", "Età metabolica" to "29 anni",
    )
    RisScreen(title = "Bilancia", sub = "composizione corporea · BIA", nav = BIO_NAV, active = active, onNav = onNav, onBack = onBack) {
        RisPanel(cut = 8.dp) {
            Column(Modifier.padding(16.dp), horizontalAlignment = Alignment.CenterHorizontally, verticalArrangement = Arrangement.spacedBy(12.dp)) {
                Icon(Icons.Default.MonitorWeight, null, tint = if (phase == "reading") RisGreen else RisCyan, modifier = Modifier.size(38.dp))
                Text(when (phase) {
                    "idle" -> "Premi 'Pesati ora', poi sali sulla bilancia."
                    "scanning" -> "In ascolto… sali sulla bilancia"
                    "measuring" -> "71.42 kg — attendo stabilizzazione…"
                    else -> "71.42 kg · 512 Ω  ✓"
                }, style = RisMono.copy(fontSize = 13.sp), color = if (phase == "reading") RisGreen else RisFgMeta)
                RisButton(if (phase == "reading") "Nuova misura" else "Pesati ora",
                    onClick = { phase = if (phase == "reading") "idle" else "reading" },
                    variant = if (phase == "reading") RisBtnVariant.Ghost else RisBtnVariant.Primary,
                    modifier = Modifier.fillMaxWidth())
            }
        }
        if (phase == "reading") {
            RisPanel(cut = 8.dp, fill = RisSurface2) {
                Column(Modifier.padding(14.dp)) {
                    RisLabelText("Composizione corporea")
                    Spacer(Modifier.height(12.dp))
                    Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                        listOf(Triple("Peso", "71.42", "kg"), Triple("BMI", "22.5", "normale"), Triple("Grasso", "17.0", "%")).forEach { (l, v, u) ->
                            Column(Modifier.weight(1f), horizontalAlignment = Alignment.CenterHorizontally) {
                                RisLabelText(l); RisStatText(v, size = 22); Text(u, style = RisMono.copy(fontSize = 9.sp), color = RisFgMeta)
                            }
                        }
                    }
                    Spacer(Modifier.height(12.dp))
                    tiles.chunked(2).forEach { row ->
                        Row(Modifier.fillMaxWidth().padding(bottom = 8.dp), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                            row.forEach { (k, v) ->
                                RisPanel(cut = 0.dp, modifier = Modifier.weight(1f)) {
                                    Column(Modifier.padding(10.dp)) {
                                        Text(k.uppercase(), style = RisLabel.copy(fontSize = 8.5.sp), color = RisFgMeta)
                                        Text(v, style = RisH3.copy(fontSize = 15.sp), color = RisFg1, modifier = Modifier.padding(top = 3.dp))
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

// ════════════════════════════════════════════════════════════════════════════
// DATA — Export / Import toggle
// ════════════════════════════════════════════════════════════════════════════
private data class ExportFmt(val icon: ImageVector, val name: String, val size: String, val tone: Color)

@Composable
fun BioDataScreen(active: String = "data", onNav: (String) -> Unit = {}) {
    var tab by remember { mutableStateOf("export") }
    RisScreen(title = "Data", sub = "export / import", nav = BIO_NAV, active = active, onNav = onNav) {
        RisSubTabs(listOf("export" to "Export", "import" to "Import"), tab) { tab = it }
        if (tab == "export") {
            var sel by remember { mutableStateOf("health_csv") }
            val fmts = listOf(
                "health_csv" to ExportFmt(Icons.Default.MonitorHeart, "Health CSV", "2.4 MB", RisCyan),
                "muse_csv" to ExportFmt(Icons.Default.Psychology, "Muse CSV", "14.8 MB", RisMagenta),
                "merged" to ExportFmt(Icons.Default.Merge, "Merged Timeline", "17.1 MB", RisAmber),
                "json" to ExportFmt(Icons.Default.DataObject, "JSON Backup", "21.3 MB", RisGreen),
            )
            fmts.forEach { (id, f) ->
                val on = id == sel
                RisPanel(cut = 6.dp, border = if (on) f.tone else RisLine, fill = if (on) RisSurface2 else RisSurface1,
                    modifier = Modifier.clickableNoRipple { sel = id }) {
                    Row(Modifier.fillMaxWidth().padding(13.dp), verticalAlignment = Alignment.CenterVertically) {
                        Icon(f.icon, null, tint = f.tone, modifier = Modifier.size(22.dp))
                        Spacer(Modifier.width(12.dp))
                        Text(f.name, style = RisBody.copy(fontSize = 14.sp, fontWeight = FontWeightSemi), color = RisFg1, modifier = Modifier.weight(1f))
                        Text(f.size, style = RisMono.copy(fontSize = 11.sp), color = RisFg2)
                    }
                }
            }
            RisButton("Esporta", onClick = {}, modifier = Modifier.fillMaxWidth())
        } else {
            // Import — GadgetBridge file + Zepp Life API
            RisPanel(cut = 8.dp, fill = RisSurface2) {
                Column(Modifier.padding(14.dp)) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(Icons.Default.Storage, null, tint = RisCyan, modifier = Modifier.size(18.dp))
                        Spacer(Modifier.width(8.dp))
                        Text("GADGETBRIDGE", style = RisH3.copy(fontSize = 13.sp), color = RisFg1)
                    }
                    Text("Importa Gadgetbridge.db (Menu → Database Management → Export DB).",
                        style = RisMono.copy(fontSize = 10.5.sp), color = RisFgMeta, modifier = Modifier.padding(top = 10.dp))
                    Spacer(Modifier.height(10.dp))
                    RisButton("Seleziona Gadgetbridge.db", onClick = {}, variant = RisBtnVariant.Ghost, modifier = Modifier.fillMaxWidth())
                }
            }
            RisPanel(cut = 8.dp, fill = RisSurface2) {
                Column(Modifier.padding(14.dp)) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(Icons.Default.Watch, null, tint = RisCyan, modifier = Modifier.size(18.dp))
                        Spacer(Modifier.width(8.dp))
                        Text("ZEPP LIFE · AMAZFIT", style = RisH3.copy(fontSize = 13.sp), color = RisFg1)
                    }
                    Text("Scarica dati dall'API Zepp Life: HR, HRV, RHR, SpO2, stress, PAI, sonno.",
                        style = RisMono.copy(fontSize = 10.5.sp), color = RisFgMeta, modifier = Modifier.padding(top = 10.dp))
                    Spacer(Modifier.height(10.dp))
                    RisButton("Importa con email/password", onClick = {}, variant = RisBtnVariant.Secondary, modifier = Modifier.fillMaxWidth())
                }
            }
        }
    }
}

// ── shared sub-tab control + helpers ────────────────────────────────────────
@Composable
fun RisSubTabs(tabs: List<Pair<String, String>>, active: String, onTab: (String) -> Unit) {
    Row(Modifier.fillMaxWidth().border(1.dp, RisLineStrong)) {
        tabs.forEachIndexed { i, (id, label) ->
            val on = id == active
            Box(
                Modifier.weight(1f)
                    .background(if (on) RisAmber else Color.Transparent)
                    .then(if (i < tabs.lastIndex) Modifier else Modifier)
                    .clickableNoRipple { onTab(id) }
                    .padding(vertical = 10.dp),
                contentAlignment = Alignment.Center,
            ) { Text(label.uppercase(), style = RisLabel.copy(fontSize = 11.sp), color = if (on) RisFgInvert else RisFg3) }
        }
    }
}

private val FontWeightSemi = androidx.compose.ui.text.font.FontWeight.SemiBold

@Composable
private fun Modifier.clickableNoRipple(onClick: () -> Unit): Modifier = composed {
    this.then(androidx.compose.foundation.clickable(
        interactionSource = remember { androidx.compose.foundation.interaction.MutableInteractionSource() },
        indication = null, onClick = onClick,
    ))
}

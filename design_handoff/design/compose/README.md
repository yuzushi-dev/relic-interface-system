# RIS Compose Token Port

Reference Kotlin / Jetpack Compose port of the Relic Interface System foundations, so RIS is consumable in the **native Android** apps in this org — **BioHub** and **Spark2Offline's `android_client`** — not just the web kits. Now includes building-block components, Canvas charts, and screen scaffolds (not just tokens).

> **These are handoff references, not a published library.** Drop them into the app's theme package (e.g. `ui/theme/`), wire fonts, and adapt. They mirror `../colors_and_type.css` + `../relic.css` exactly.

## Files
| File | Mirrors | Contents |
|---|---|---|
| `Color.kt` | `colors_and_type.css` color tokens | surfaces, lines, text, accents (+dim/glow/line), stream taxonomy, `risRiskColor()` |
| `Type.kt` | `colors_and_type.css` type scale | Chakra Petch / Rajdhani / JetBrains Mono families, `RisHero…RisMono` styles, `RisTypography` (Material3 map) |
| `Shape.kt` | `relic.css` clip-path | `risClip(cut)` / `risClipMirror(cut)` angular shapes, clip + spacing constants |
| `Theme.kt` | `relic.css` primitives | `RelicTheme` (dark colorScheme + type), `RisPanel`, `RisChip`, `RisSegMeter`, `RisMeter` |
| `Components.kt` | `relic.css` + kit components | `RisLabelText`, `RisStatText`, `RisMetricCard`, `RisRiskBadge`, `RisStreamChip` (+`risStreamColor`), `RisCalibration`, `RisFacetSpectrum`, `RisButton` |
| `Charts.kt` | `ui_kits/biohub/charts.js` | `RisLineChart`, `RisEegBands`, `RisEegWaveform` (Canvas, no deps) |
| `Scaffold.kt` | kit screen chrome | `RisTopBar`, `RisBottomNav` (+`RisNavItem`), `RisScreen` wrapper, and a worked `BioDashboardScreenExample` |
| `BioHubScreens.kt` | `../ui_kits/biohub/*.jsx` | Pre-written BioHub screens: `BioInspectorScreen`, `BioMuseScreen`, `BioSyncScreen`, `BioScaleScreen`, `BioDataScreen` (+ `BIO_NAV`, `RisSubTabs`) |
| `BioHubApp.kt` | app wiring | `BioHubApp()` — Navigation-Compose `NavHost` tying all BioHub screens + the scale drill-down together (`setContent { RelicTheme { BioHubApp() } }`) |

## Usage
```kotlin
setContent {
  RelicTheme {
    RisPanel(border = RisCyanLine) {
      Text("SUBJECT 0104", style = RisH2, color = RisFg1, modifier = Modifier.padding(16.dp))
    }
  }
}
```

Screen-level (BioHub redesign — confirmed):
```kotlin
RisScreen(
  title = "BioHub", sub = "DASHBOARD SALUTE",
  nav = bioNav, active = "dashboard", onNav = { navController.navigate(it) },
) {
  Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
    RisMetricCard("FC", "62", "bpm", accent = RisRed, modifier = Modifier.weight(1f))
    RisMetricCard("HRV", "48", "ms", accent = RisViolet, modifier = Modifier.weight(1f))
  }
  RisLineChart(hrSeries, Modifier.fillMaxWidth().height(90.dp), color = RisRed)
  RisEegBands(bandPowers, Modifier.fillMaxWidth().height(90.dp))
}
```
See `BioDashboardScreenExample` in `Scaffold.kt` for the full composition.

## Porting notes
- **Fonts:** add Chakra Petch / Rajdhani / JetBrains Mono `.ttf` to `res/font`, then replace the `FontFamily.SansSerif/Monospace` placeholders in `Type.kt` with real `Font(...)` families. Nearest system fallbacks: `sans-serif-condensed` (Rajdhani) and `monospace`.
- **Corners:** the system is hard-edged (radius 0). Use `Modifier.clip(risClip(10.dp))` for panels, `6.dp` for chips/inputs, `14.dp` for modals — never `RoundedCornerShape`.
- **Elevation:** depth comes from 1.dp borders + faint glow, **not** Material soft shadows. Avoid `CardDefaults.cardElevation()` with high values.
- **Material override:** `RelicTheme` swaps Material 3's color scheme + typography so stock `Card`/`Button`/`Text` inherit RIS. For the signature look, prefer `RisPanel`/`RisButton` over `Card`/`Button`.
- **Status is never color-only** — `RisChip`/`RisStreamChip`/`RisRiskBadge` always show a label; pair risk colors with text/icon.
- **BioHub redesign (confirmed):** these composables are the intended replacement for BioHub's Material 3 screens. `Scaffold.kt` has the dashboard; **`BioHubScreens.kt` pre-writes the remaining five** (Inspector, Muse, Sync, Scale, Data) wired with `RisScreen` + the atoms. Drop them behind a NavHost and replace placeholder values with ViewModel data. The HTML kit in `../ui_kits/biohub/` is the visual reference.
- **Charts:** `Charts.kt` is dependency-free. The app currently uses Vico — either swap to these for the simple cases, or use `Color.kt` tokens to theme Vico to RIS.
- **Spark2 specifically:** its `android_client` is already a Cyberpunk-2077 UI with a near-identical palette — adopting these tokens is mostly a find-and-replace of its inline `object C { … }` colors with `Ris*`, plus swapping its hand-built sharp boxes for `risClip`.

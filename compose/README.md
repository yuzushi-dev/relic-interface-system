# RIS — Jetpack Compose Port (v2.8.0)

Native Android / Jetpack Compose port of the **Relic Interface System (RIS)** with full support for both the v2 forensic baseline palette and the **Tactical Cyber** skin (`RisCyberSkin`), unified with the Tactical HUD Motion System and real-time telemetry.

---

## Package Structure (`design.ris`)

* **[`Color.kt`](Color.kt)**: Baseline color tokens (forensic stack `#e6a23c`, `#6fb3c9`, `RisLight`) and canonical **`RisCyberSkin`** object (dark crimson surfaces `#070406`..`#2c171d`, structural red lines `#6e2d38`, Cyber Yellow `#ffe23a`, Glitch Cyan `#00e5ff`, Red `#ff003c`, neon glows).
* **[`Shape.kt`](Shape.kt)**: Hard-edged brutalist geometry (0dp radius). 45° chamfer cuts: `RisClipSm` (6dp), `RisClip` (10dp), `RisClipLg` (16dp), `risClip(cut)` and `risClipMirror(cut)`.
* **[`Type.kt`](Type.kt)**: Typographic scale (`RisHero`, `RisH1`, `RisH2`, `RisH3`, `RisBody`, `RisLabel`, `RisEyebrow`, `RisMono`).
* **[`Theme.kt`](Theme.kt)**: `RisTheme`, `LocalRisColors` and `Modifier.cyberBackdrop()` (crimson radial gradient + static scanlines).
* **[`Components.kt`](Components.kt)**: Canonical UI & motion components:
  * `RisPanel` (box with chamfer cut and border)
  * `RisButton` (Primary yellow glow, Secondary outline, Ghost, Danger)
  * `RisTextField` (squared 90° input, mono font, eyebrow labels, icons)
  * `RisSubTabs` (segmented controls with `scrollable` option)
  * `RisProgressBar` (linear cyber neon canvas progress bar, no circular spinners)
  * `RisMeter`, `RisChip`
  * `RisSegmentedMeter` (segmented meter with discrete blocks for battery/level HUD)
  * `RisStat` (topbar stat block with value, label, and segmented meter)
  * `RisListRow` (HUD list item with thumbnail box, title, metadata, and timestamp)
  * `RisAccordion` (fluid disclosure with `expandVertically` and `fadeIn`)
  * `RisBottomSheet` (tactical modal sheet with drag handle and chamfer cuts)
  * `RisToast` (HUD toast with accent indicator line and message)
  * `RisMotion` (timing constants: `DurInstant: 80ms`, `DurFast: 140ms`, `DurBase: 200ms`, `DurEnter: 240ms`)
* **[`Charts.kt`](Charts.kt)**: Zero-dependency native Canvas charts:
  * `RisLineChart` (trend with grid and translucent fill)
  * `RisBarChart` (category columns with optional highlight overdrive, baseline, and labels)
  * `RisTimeSeriesChart` (proportional time axis, dynamic day stride to prevent label overlap, robust ±2σ baseline band).

---

## Usage Example

```kotlin
import design.ris.*

@Composable
fun AppContent() {
    RisTheme {
        Box(Modifier.fillMaxSize().cyberBackdrop().padding(16.dp)) {
            RisPanel(modifier = Modifier.fillMaxWidth()) {
                Column(Modifier.padding(16.dp)) {
                    Text("TELEMETRY HUD", style = RisH3, color = RisCyberSkin.Fg1)
                    Spacer(Modifier.height(12.dp))

                    RisProgressBar() // Continuous neon progress bar

                    Spacer(Modifier.height(16.dp))

                    RisStat(value = "12", label = "Level", activeSegments = 3)

                    Spacer(Modifier.height(16.dp))

                    RisButton(
                        text = "ACQUIRE DATA",
                        onClick = { /* ... */ },
                        variant = RisButtonVariant.Primary
                    )
                }
            }
        }
    }
}
```

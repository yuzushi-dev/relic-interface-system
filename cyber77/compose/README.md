# RIS — Jetpack Compose Port (v2.7.0)

Port nativo in Android / Jetpack Compose del **Relic Interface System (RIS)** con supporto completo sia alla palette base forensic v2 che alla skin **Cyberpunk 2077** (`RisCyberSkin`).

---

## Struttura del Package (`design.ris`)

* **[`Color.kt`](file:///home/cristina/Scrivania/Relic%20Interface%20System/cyber77/compose/Color.kt)**: Token colore base (forensic stack `#e6a23c`, `#6fb3c9`, `RisLight`) e oggetto canonico **`RisCyberSkin`** (superfici dark crimson `#070406`..`#2c171d`, linee strutturali rosse `#6e2d38`, Cyber Yellow `#ffe23a`, Glitch Cyan `#00e5ff`, Red `#ff003c`, neon glow).
* **[`Shape.kt`](file:///home/cristina/Scrivania/Relic%20Interface%20System/cyber77/compose/Shape.kt)**: Geometria brutalista hard-edged (0dp radius). Tagli angolari a 45°: `RisClipSm` (6dp), `RisClip` (10dp), `RisClipLg` (16dp), `risClip(cut)` e `risClipMirror(cut)`.
* **[`Type.kt`](file:///home/cristina/Scrivania/Relic%20Interface%20System/cyber77/compose/Type.kt)**: Scala tipografica (`RisHero`, `RisH1`, `RisH2`, `RisH3`, `RisBody`, `RisLabel`, `RisEyebrow`, `RisMono`).
* **[`Theme.kt`](file:///home/cristina/Scrivania/Relic%20Interface%20System/cyber77/compose/Theme.kt)**: `RisTheme`, `LocalRisColors` e `Modifier.cyberBackdrop()` (gradiente radiale crimson + scanline statiche).
* **[`Components.kt`](file:///home/cristina/Scrivania/Relic%20Interface%20System/cyber77/compose/Components.kt)**: Componenti UI canonici:
  * `RisPanel` (box con chamfer cut e bordo)
  * `RisButton` (Primary yellow glow, Secondary outline, Ghost, Danger)
  * `RisTextField` (input squadrato a 90°, mono font, eyebrow labels, icone)
  * `RisSubTabs` (segmented controls con opzione `scrollable`)
  * `RisProgressBar` (linear cyber neon canvas progress bar, senza cerchi spinner)
  * `RisMeter`, `RisChip`
* **[`Charts.kt`](file:///home/cristina/Scrivania/Relic%20Interface%20System/cyber77/compose/Charts.kt)**: Grafici Canvas nativi a zero dipendenze:
  * `RisLineChart` (trend con griglia e area trasparente)
  * `RisTimeSeriesChart` (asse temporale proporzionale, dynamic day stride per evitare sovrapposizione label, banda baseline ±2σ robusta).

---

## Esempio d'Uso

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

                    RisProgressBar() // Barra di avanzamento neon continua

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

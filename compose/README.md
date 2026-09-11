# RIS — Jetpack Compose Port (v2.8.0)

Native Android / Jetpack Compose port of the **Relic Interface System (RIS)** with full support for both the v2 forensic baseline palette and the **Tactical Cyber** skin (`RisCyberSkin`), unified with the Tactical HUD Motion System and real-time telemetry.

Published as a modular Android Library targeting modern Android versions (`minSdk 24`, `compileSdk 35+`, Java 17, Compose BOM 2024.09+).

---

## 📦 Installation Options

### Option 1: JitPack (Recommended for GitHub builds)

Add the JitPack repository to your root `settings.gradle.kts`:

```kotlin
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
        maven { url = uri("https://jitpack.io") }
    }
}
```

Then add the dependency in your application's `build.gradle.kts`:

```kotlin
dependencies {
    implementation("com.github.yuzushi-dev:relic-interface-system:2.8.0")
}
```

---

### Option 2: Maven Registry / Maven Central

If consuming from a Maven repository configured with artifact publishing coordinates:

```kotlin
dependencies {
    implementation("dev.relic:interface-system:2.8.0")
}
```

---

### Option 3: Local Project Module

To include the RIS Compose module directly from source in a multi-module or monorepo project, configure your root `settings.gradle.kts`:

```kotlin
include(":relic-compose")
project(":relic-compose").projectDir = file("../relic-interface-system/compose")
```

Then in your application's `build.gradle.kts`:

```kotlin
dependencies {
    implementation(project(":relic-compose"))
}
```

---

## 🛡️ Mobile OLED Display Safety

Prolonged HUD displays on mobile AMOLED / OLED panels face risks of differential subpixel degradation (burn-in). RIS v2 enforces strict mobile safety standards:

1. **No Full-Height Side Rulers**:
   - Desktop and tablet HUD views occasionally feature decorative vertical calibration rulers. On mobile viewports, these static high-contrast lines cause persistent phosphor wear.
   - RIS Compose mobile components intentionally replace full-height vertical rulers with discrete hairline dividers (`1.dp`, `RisCyberSkin.LineFaint`), safe horizontal padding, and dynamic corner chamfers.
2. **Scrollable SubTabs (`RisSubTabs`)**:
   - Fixed multi-item segment tabs compress text into unreadable wraps on narrow devices (< 400dp width).
   - Use `scrollable = true` to allow horizontal scrolling with natural swipe momentum without clipping labels.
3. **Graphite Surfaces over Pure Black**:
   - Standard surfaces use calibrated deep graphite (`RisBg = #0A0C0E`, `RisSurface1 = #0F1316` or `RisCyberSkin.Surface1 = #120A0D`) rather than raw `#000000` to prevent OLED pixel smearing during rapid scrolling while preserving low energy draw.

---

## 🧩 Package Structure (`design.ris`)

* **[`Color.kt`](Color.kt)**: Baseline color tokens (forensic stack `#E6A23C`, `#6FB3C9`, `RisLight`) and canonical **`RisCyberSkin`** object (dark crimson surfaces `#070406`..`#2C171D`, structural red lines `#6E2D38`, Cyber Yellow `#FFE23A`, Glitch Cyan `#00E5FF`, Red `#FF003C`, neon glows).
* **[`Shape.kt`](Shape.kt)**: Hard-edged brutalist geometry (0dp radius). 45° chamfer cuts: `RisClipSm` (6dp), `RisClip` (10dp), `RisClipLg` (16dp), `risClip(cut)` and `risClipMirror(cut)`.
* **[`Type.kt`](Type.kt)**: Typographic scale (`RisHero`, `RisH1`, `RisH2`, `RisH3`, `RisBody`, `RisLabel`, `RisEyebrow`, `RisMono`).
* **[`Theme.kt`](Theme.kt)**: `RisTheme`, `LocalRisColors`, and `Modifier.cyberBackdrop()` (crimson radial gradient + static scanlines).
* **[`Scaffold.kt`](Scaffold.kt)**: `RisScaffold`, `RisTopBar`, and `RisBottomBar` structured for tactical layout and mobile OLED compliance.
* **[`Components.kt`](Components.kt)**: Canonical UI & motion components:
  * `RisPanel` (tactical container with 45° chamfer cuts and border)
  * `RisButton` (Primary yellow glow, Secondary outline, Ghost, Danger)
  * `RisTextField` (squared 90° input, mono font, eyebrow labels, icons)
  * `RisSubTabs` (segmented controls with `scrollable` support for mobile)
  * `RisProgressBar` (linear cyber neon canvas progress bar, zero circular spinners)
  * `RisMeter`, `RisChip`
  * `RisSegmentedMeter` (segmented meter with discrete blocks for battery/level HUD)
  * `RisStat` (topbar stat block with value, label, and segmented meter)
  * `RisListRow` (HUD list item with thumbnail box, title, metadata, and timestamp)
  * `RisAccordion` (fluid disclosure with `expandVertically` and `fadeIn`)
  * `RisBottomSheet` (tactical modal sheet with drag handle and chamfer cuts)
  * `RisToast` (HUD toast with accent indicator line and message)
  * `RisMotion` (timing constants: `DurInstant: 80ms`, `DurFast: 140ms`, `DurBase: 200ms`, `DurEnter: 240ms`)
* **[`Charts.kt`](Charts.kt)**: Zero-dependency native Canvas charts:
  * `RisLineChart` (continuous trend line with baseline grid and translucent fill)
  * `RisBarChart` (category columns with optional highlight overdrive, baseline, and labels)
  * `RisTimeSeriesChart` (proportional time axis, dynamic day stride to prevent label overlap, robust ±2σ baseline band)

---

## 💻 Code Snippets & Component Usage

### 1. `RisTheme` Setup

Wrap your application or screen hierarchy in `RisTheme`. Defaults to `RisCyberSkin` styling with dark tactical surfaces:

```kotlin
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import design.ris.RisScaffold
import design.ris.RisTheme

@Composable
fun AppRoot() {
    RisTheme {
        RisScaffold(
            modifier = Modifier.fillMaxSize(),
            backdrop = true // Enables radial gradient & faint scanlines
        ) { paddingValues ->
            MainTelemetryScreen()
        }
    }
}
```

---

### 2. `RisButton`

Buttons support 4 variants (`Primary`, `Secondary`, `Ghost`, `Danger`), leading icons, and automatic uppercase formatting:

```kotlin
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.height
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import design.ris.RisButton
import design.ris.RisButtonVariant

@Composable
fun ActionButtonsSample() {
    Column {
        // Primary with amber/yellow neon glow
        RisButton(
            text = "INITIALIZE TELEMETRY",
            variant = RisButtonVariant.Primary,
            onClick = { /* Handle click */ }
        )

        Spacer(Modifier.height(8.dp))

        // Secondary outline button
        RisButton(
            text = "CALIBRATE SENSORS",
            variant = RisButtonVariant.Secondary,
            onClick = { /* Handle click */ }
        )

        Spacer(Modifier.height(8.dp))

        // Danger variant
        RisButton(
            text = "PURGE CACHE",
            variant = RisButtonVariant.Danger,
            onClick = { /* Handle purge */ }
        )
    }
}
```

---

### 3. `RisTextField`

Brutalist 90° input with uppercase eyebrow label, monospace typography, and custom borders:

```kotlin
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import design.ris.RisTextField

@Composable
fun SearchFieldSample() {
    var query by remember { mutableStateOf("") }

    RisTextField(
        value = query,
        onValueChange = { query = it },
        label = "TARGET_IDENTIFIER",
        placeholder = "e.g. RELIC-BIO-7701",
        singleLine = true
    )
}
```

---

### 4. `RisPanel`

Tactical content container with 45° chamfered corners (`RisClip = 10.dp`), hairline borders, and dark surface fills:

```kotlin
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import design.ris.RisClip
import design.ris.RisCyberSkin
import design.ris.RisH3
import design.ris.RisPanel

@Composable
fun MetricPanelSample() {
    RisPanel(
        modifier = Modifier.fillMaxWidth(),
        cut = RisClip,
        background = RisCyberSkin.Surface1,
        border = RisCyberSkin.LineStrong
    ) {
        Column(Modifier.padding(16.dp)) {
            Text(
                text = "NEURAL SYNC METRICS",
                style = RisH3,
                color = RisCyberSkin.Fg1
            )
            // Nested content...
        }
    }
}
```

---

### 5. `RisLineChart`

Render high-performance continuous vector line & area graphs directly on Canvas:

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import design.ris.RisCyberSkin
import design.ris.RisLineChart

@Composable
fun RealtimeFrequencyChart() {
    val telemetryValues = listOf(14.2f, 18.5f, 16.0f, 22.4f, 28.1f, 24.6f, 31.0f)

    RisLineChart(
        data = telemetryValues,
        modifier = Modifier
            .fillMaxWidth()
            .height(180.dp),
        color = RisCyberSkin.Cyan
    )
}
```

---

### 6. `RisTimeSeriesChart`

Canvas time series chart with millisecond epoch timestamps, dynamic day stride (prevents date label overlap on mobile), min/max Y axis labels, and optional personal baseline band (median ± 2σ):

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import design.ris.RisCyberSkin
import design.ris.RisTimeSeriesChart

@Composable
fun HeartRateVariabilityChart() {
    // Pair of (epochMillis, value)
    val now = System.currentTimeMillis()
    val dayMillis = 86_400_000L
    val timePoints = listOf(
        Pair(now - (6 * dayMillis), 64.0f),
        Pair(now - (5 * dayMillis), 71.5f),
        Pair(now - (4 * dayMillis), 68.2f),
        Pair(now - (3 * dayMillis), 75.0f),
        Pair(now - (2 * dayMillis), 73.1f),
        Pair(now - (1 * dayMillis), 79.4f),
        Pair(now, 82.0f)
    )

    RisTimeSeriesChart(
        points = timePoints,
        modifier = Modifier
            .fillMaxWidth()
            .height(220.dp),
        color = RisCyberSkin.Green,
        baselineMedian = 72.0f,
        baselineSigma = 4.0f,
        valueFormat = { "${it.toInt()} ms" }
    )
}
```

---

### 7. Mobile OLED Safe Segmented Controls (`RisSubTabs`)

Use `scrollable = true` to preserve readability and avoid text truncation on smaller mobile screens:

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import design.ris.RisSubTabs

@Composable
fun NavigationTabsSample() {
    var selectedTab by remember { mutableIntStateOf(0) }
    val channels = listOf("OVERVIEW", "BIOMETRICS", "SYSTEM LOG", "DIAGNOSTICS", "NETWORK")

    RisSubTabs(
        items = channels,
        selectedIndex = selectedTab,
        onSelect = { selectedTab = it },
        modifier = Modifier.fillMaxWidth(),
        scrollable = true // Prevents tab cramping on mobile displays
    )
}
```

---

## 🛠️ Build & Verification

To build and verify the module locally using Gradle:

```bash
# Build release AAR
./gradlew :relic-compose:assembleRelease

# Run unit and lint checks
./gradlew :relic-compose:check

# Publish to local Maven repository (~/.m2/repository)
./gradlew :relic-compose:publishToMavenLocal
```

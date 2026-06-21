# BioHub — UI Kit

High-fidelity, interactive recreation of **BioHub** ([github.com/yuzushi-dev/biohub](https://github.com/yuzushi-dev/biohub)) — an Android health-data hub (Kotlin / Jetpack Compose, **Material 3**) — restyled into the **Relic Interface System** cyberpunk language. The domain, screens, metrics, and Italian copy come from the repo; the visual treatment is RIS. This is a cosmetic/interaction prototype, not production code.

> **Note:** adopting RIS here is a deliberate **redesign** from the app's native Material 3 look. For a Kotlin port of these tokens, see `../../compose/`.

## Run it
Open `index.html` (React + Babel + Lucide + `charts.js` from CDN/local; no build). A scaled phone bezel hosts a bottom-tab app.

## Screens (bottom nav)
1. **Dashboard** — FC/HRV primary cards, secondary tiles (Passi/Sonno/SpO2), small metrics (FC Riposo/Stress/PAI/T.Cute), active calories, body composition (BMI/grasso/muscolo/acqua/visc. — **tap to drill into Bilancia**), **FC 7-day line chart** + **Muse EEG band meter**, recent sessions.
2. **Inspector** — *Metrics* / *Sleep* tabs; per-metric cards (icon, latest value, unit, record count) and sleep-session cards.
3. **Muse Recorder** — **BLE Diretto** / **OSC (Mind Monitor)** modes; status card; full BLE flow (scan → found → connect → record → stop/marker); animated **4-channel live EEG waveform** (TP9/AF7/AF8/TP10); session stats (durata / campioni / pkt/s); CSV import.
4. **Sync** — Health Connect availability + permissions flow (Concedi Permessi), sync button with progress, last-sync card, synced-data-sources list, sync history with success/fail states.
5. **Data** — **Export ⟷ Import** toggle. Export: format picker (Health CSV / Muse CSV / Merged Timeline / JSON Backup) + summary + success state. Import: GadgetBridge .db file picker and Zepp Life (Amazfit) API (date range, email/password, remember, progress).

**Drill-down:** **Bilancia (Scale)** — reached from the Dashboard body-composition card: BIA profile (altezza/età/sesso), BLE weigh state machine (idle → scanning → measuring → reading), and a body-composition result (peso/BMI/grasso hero + 8-tile grid). Back chevron returns to Dashboard.

## Files
| File | Role |
|---|---|
| `index.html` | App entry — phone frame, status bar, top bar, bottom nav, routing (+ Scale drill-down). |
| `BioComponents.jsx` | Shared: `Ico`, `Lbl`, `Stat`, `Card`, `StatusBar`, `BioTopBar`, `BioBottomNav`, `clip()`. |
| `Dashboard.jsx` · `Inspector.jsx` · `Muse.jsx` · `Sync.jsx` · `Scale.jsx` · `Export.jsx` · `Import.jsx` | The screens (`Import.jsx` also exports the `BioData` Export/Import wrapper). |
| `charts.js` | Canvas widgets — `risLineChart`, `risEegBands`, `risEegWaveform` (4-ch), `risSynthEeg`. No deps (repo uses Vico; these are the RIS-styled equivalents). |

## Mapping to the repo
| Repo (`app/.../ui/screens/`) | This kit |
|---|---|
| `DashboardScreen.kt` (Vico charts, metric cards) | `Dashboard.jsx` + `charts.js` |
| `HealthInspectorScreen.kt` (Metrics/Sleep tabs) | `Inspector.jsx` |
| `MuseRecorderScreen.kt` (BLE/OSC, EegWaveformCard) | `Muse.jsx` + `risEegWaveform` |
| `HealthSyncScreen.kt` (Health Connect, permissions, history) | `Sync.jsx` |
| `ScaleScreen.kt` (BIA profile, weigh state, body comp) | `Scale.jsx` (Dashboard drill-down) |
| `ExportScreen.kt` · `ImportScreen.kt` (GadgetBridge / Zepp) | `Export.jsx` · `Import.jsx` (`BioData` toggle) |
| `ui/theme/*` (Material 3) | replaced by RIS tokens; Kotlin port in `../../compose/` |

## Not included
Real Health Connect / BLE / OSC data, permissions flows, persistence. Data is representative placeholder. Italian labels are kept verbatim from the source app.

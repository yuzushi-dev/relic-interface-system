# Spark2Offline — `android_client` auth gate (RIS)

Recreation of the **Spark2Offline** Android auth client ([github.com/yuzushi-dev/Spark2Offline](https://github.com/yuzushi-dev/Spark2Offline), `android_client/`) — an offline-first possession-factor gate using an implanted VivoKey Spark 2 (NXP NTAG 413 DNA) plus a PIN knowledge factor.

> **Key point:** the source app is **already a Cyberpunk-2077-style UI** with a palette near-identical to RIS (yellow primary, cyan, magenta/red, blue, dark grid background, monospace, sharp boxes, scan ring). So adopting RIS here is **convergent, not a redesign** — largely a find-and-replace of its inline color object with the `Ris*` Compose tokens (`../design/compose/Color.kt`) plus swapping hand-built sharp boxes for `risClip`.

## Prototype
`../design/ui_kits/spark2-auth/index.html` — open in a browser (no build). Interactive: AUTH / ENROLL / READ mode tabs, animated **scan ring**, status banner, **assurance ladder** (DENIED → PRESENCE → OFFLINE_2FA → ONLINE_ATTESTED), **3-factor breakdown** (possession UID + counter, knowledge PIN via scrypt/AES-256-GCM, online VivoKey `/validate` booster), PIN entry, online-booster toggle, NETLOG. Drives a full arm → tap → scan → result state machine.

## Mapping to the repo
| Repo (`android_client/.../MainActivity.kt`) | Prototype |
|---|---|
| Assurance levels (DENIED…ONLINE_ATTESTED) | the assurance ladder + result ring color |
| NFC tap / scan animation | the animated scan ring (idle/armed/scanning/result) |
| PIN entry + factor verification | PIN field + 3-factor breakdown rows |
| Online attestation toggle | "ONLINE BOOSTER · VivoKey /validate" checkbox |
| Inline color `object` | `../design/compose/Color.kt` `Ris*` tokens |

## Target stack
Kotlin / Jetpack Compose. Use the Compose port in `../design/compose/` directly — this product is the lowest-effort adoption of the three.

## Not included
Real NFC/NTAG 413 DNA SUN verification, scrypt/AES vault, VivoKey API calls, the Python verifier/CLI side of the repo. The prototype simulates the auth state machine for UI demonstration.

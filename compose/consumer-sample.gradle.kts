// =============================================================================
// RELIC INTERFACE SYSTEM (RIS v2) — Consumer Gradle Configuration Sample
// =============================================================================
// This sample illustrates how to integrate the RIS Jetpack Compose library
// into an external Android application using either JitPack, Maven, or a local module.
// =============================================================================

// -----------------------------------------------------------------------------
// STEP 1: Repository Configuration
// -----------------------------------------------------------------------------
// In your root `settings.gradle.kts`:
/*
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
        maven { url = uri("https://jitpack.io") } // Required for JitPack builds
    }
}
*/

// If including as a LOCAL project module in your repository, add to `settings.gradle.kts`:
/*
include(":relic-compose")
project(":relic-compose").projectDir = file("../relic-interface-system/compose")
*/


// -----------------------------------------------------------------------------
// STEP 2: Consumer App Module Dependencies (`app/build.gradle.kts`)
// -----------------------------------------------------------------------------

plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
    // If using Kotlin 2.0+:
    // id("org.jetbrains.kotlin.plugin.compose")
}

android {
    namespace = "com.example.risconsumer"
    compileSdk = 35 // RIS requires compileSdk 34+

    defaultConfig {
        applicationId = "com.example.risconsumer"
        minSdk = 24     // RIS requires minSdk 24+
        targetSdk = 35
        versionCode = 1
        versionName = "1.0.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    kotlinOptions {
        jvmTarget = "17"
    }

    buildFeatures {
        compose = true
    }

    // Required for Kotlin < 2.0 (Kotlin 2.0+ uses compose compiler plugin):
    composeOptions {
        kotlinCompilerExtensionVersion = "1.5.14"
    }
}

dependencies {
    // -------------------------------------------------------------------------
    // Option A: JitPack Dependency (Release tag or commit hash)
    // -------------------------------------------------------------------------
    implementation("com.github.yuzushi-dev:relic-interface-system:2.8.0")

    // -------------------------------------------------------------------------
    // Option B: Maven Central / Internal Maven Registry
    // -------------------------------------------------------------------------
    // implementation("dev.relic:interface-system:2.8.0")

    // -------------------------------------------------------------------------
    // Option C: Local Project Module (e.g. monorepo or submodule)
    // -------------------------------------------------------------------------
    // implementation(project(":relic-compose"))

    // Standard Jetpack Compose & AndroidX dependencies
    val composeBom = platform("androidx.compose:compose-bom:2024.09.00")
    implementation(composeBom)
    implementation("androidx.compose.ui:ui")
    implementation("androidx.compose.material3:material3")
    implementation("androidx.compose.foundation:foundation")
    implementation("androidx.activity:activity-compose:1.9.2")
}

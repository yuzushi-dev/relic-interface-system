plugins {
    id("com.android.library")
    id("org.jetbrains.kotlin.android")
    `maven-publish`
}

android {
    namespace = "design.ris"
    compileSdk = 35 // Android 15 / 34+ target

    defaultConfig {
        minSdk = 24

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
        consumerProguardFiles("consumer-rules.pro")
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    kotlinOptions {
        jvmTarget = "17"
        freeCompilerArgs += listOf(
            "-opt-in=androidx.compose.material3.ExperimentalMaterial3Api",
            "-opt-in=androidx.compose.foundation.ExperimentalFoundationApi"
        )
    }

    buildFeatures {
        compose = true
    }

    composeOptions {
        kotlinCompilerExtensionVersion = "1.5.14"
    }

    sourceSets {
        getByName("main") {
            // Support flat module structure as well as standard src/main/kotlin
            java.srcDirs(".", "src/main/kotlin", "src/main/java")
            manifest.srcFile("AndroidManifest.xml")
        }
    }

    publishing {
        singleVariant("release") {
            withSourcesJar()
            withJavadocJar()
        }
    }
}

dependencies {
    val composeBom = platform("androidx.compose:compose-bom:2024.09.00")
    implementation(composeBom)
    androidTestImplementation(composeBom)

    // Jetpack Compose Foundation & UI
    implementation("androidx.compose.ui:ui")
    implementation("androidx.compose.ui:ui-graphics")
    implementation("androidx.compose.ui:ui-tooling-preview")
    implementation("androidx.compose.foundation:foundation")
    implementation("androidx.compose.material3:material3")
    implementation("androidx.compose.animation:animation")
    implementation("androidx.compose.animation:animation-core")

    // AndroidX & Kotlin extensions
    implementation("androidx.core:core-ktx:1.13.1")
    implementation("androidx.lifecycle:lifecycle-runtime-ktx:2.8.4")

    // Tooling & Testing
    debugImplementation("androidx.compose.ui:ui-tooling")
    debugImplementation("androidx.compose.ui:ui-test-manifest")

    testImplementation("junit:junit:4.13.2")
    androidTestImplementation("androidx.test.ext:junit:1.2.1")
    androidTestImplementation("androidx.test.espresso:espresso-core:3.6.1")
    androidTestImplementation("androidx.compose.ui:ui-test-junit4")
}

afterEvaluate {
    publishing {
        publications {
            register<MavenPublication>("release") {
                groupId = "dev.relic"
                artifactId = "interface-system"
                version = "2.8.0"

                from(components["release"])

                pom {
                    name.set("Relic Interface System - Jetpack Compose")
                    description.set("Brutalist Tactical HUD design system and Jetpack Compose component library (RIS v2).")
                    url.set("https://github.com/yuzushi-dev/relic-interface-system")
                    inceptionYear.set("2026")

                    licenses {
                        license {
                            name.set("MIT License")
                            url.set("https://opensource.org/licenses/MIT")
                            distribution.set("repo")
                        }
                    }

                    developers {
                        developer {
                            id.set("yuzushi-dev")
                            name.set("yuzushi-dev")
                            organization.set("Relic Interface System")
                            organizationUrl.set("https://github.com/yuzushi-dev")
                        }
                    }

                    scm {
                        connection.set("scm:git:git://github.com/yuzushi-dev/relic-interface-system.git")
                        developerConnection.set("scm:git:ssh://github.com:yuzushi-dev/relic-interface-system.git")
                        url.set("https://github.com/yuzushi-dev/relic-interface-system")
                    }

                    issueManagement {
                        system.set("GitHub Issues")
                        url.set("https://github.com/yuzushi-dev/relic-interface-system/issues")
                    }
                }
            }
        }
    }
}

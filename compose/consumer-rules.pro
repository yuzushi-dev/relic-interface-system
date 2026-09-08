# Relic Interface System (RIS v2) ProGuard / R8 Consumer Rules
# Keeps design tokens, composables, and data models intact during code shrinking.

-keep class design.ris.** { *; }
-keepclassmembers class design.ris.** { *; }

# step 1 (one-tree-one-version): rules that must hold before minify can ever be turned on.
# The bridge between the page and the bubble is reached by NAME from JavaScript. R8 has no way
# to see those call sites, so without these rules the page talks to a class that no longer exists.
-keepclasseswithmembers class * { @android.webkit.JavascriptInterface <methods>; }
-keep class il.liba.app.LibaWeb$JsBridge { *; }
-keep class il.liba.app.LibaWeb { *; }

# OrbView builds AGSL shaders from string literals and reflects on RuntimeShader on API 33+.
-keep class il.liba.app.OrbView { *; }
-keep class android.graphics.RuntimeShader { *; }

# Services, receivers and the tile are named in AndroidManifest.xml.
-keep class il.liba.app.BubbleService { *; }
-keep class il.liba.app.TalkTile { *; }
-keep class il.liba.app.App { *; }
-keep class il.liba.app.MainActivity { *; }

# Keep Kotlin metadata so reflection on data holders keeps working.
-keepattributes *Annotation*,Signature,InnerClasses,EnclosingMethod

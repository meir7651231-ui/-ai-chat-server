import java.util.Properties
plugins { id("com.android.application"); id("org.jetbrains.kotlin.android") }
// step 1 (one-tree-one-version): the version lives in ONE file at the repo root.
// Nothing here may hardcode it - gates/one-version.mjs fails the build if it reappears.
val ver = Properties().apply { rootProject.file("../VERSION").inputStream().use { load(it) } }
val vCode = ver.getProperty("versionCode").trim().toInt()
val vName = ver.getProperty("versionName").trim()
android {
    namespace = "il.liba.app"
    compileSdk = 34
    defaultConfig { applicationId = "il.liba.app"; minSdk = 26; targetSdk = 34; versionCode = vCode; versionName = vName }
    // Signing credentials live in keys/keystore.properties (never committed); without it the build falls back to the debug key.
    val ksProps = Properties().apply { val f = rootProject.file("keys/keystore.properties"); if (f.exists()) f.inputStream().use { load(it) } }
    signingConfigs {
        create("liba") {
            if (ksProps.isNotEmpty()) {
                storeFile = rootProject.file(ksProps.getProperty("storeFile").removePrefix("../"))
                storePassword = ksProps.getProperty("storePassword"); keyAlias = ksProps.getProperty("keyAlias"); keyPassword = ksProps.getProperty("keyPassword")
            }
        }
    }
    buildTypes {
        debug { if (ksProps.isNotEmpty()) signingConfig = signingConfigs.getByName("liba") }
        release {
            // minify stays OFF until an instrumented smoke on the real device passes: it can strip
            // @JavascriptInterface (JsBridge) and the AGSL shader classes in OrbView, and the failure
            // mode is an app that opens to a blank bubble. Turn it on with -Pliba.minify=true.
            isMinifyEnabled = (project.findProperty("liba.minify") as String?) == "true"
            proguardFiles(getDefaultProguardFile("proguard-android-optimize.txt"), "proguard-rules.pro")
            if (ksProps.isNotEmpty()) signingConfig = signingConfigs.getByName("liba")
        }
    }
    compileOptions { sourceCompatibility = JavaVersion.VERSION_17; targetCompatibility = JavaVersion.VERSION_17 }
    kotlinOptions { jvmTarget = "17" }
}
dependencies {
    implementation("androidx.core:core-ktx:1.13.1")
    implementation("androidx.appcompat:appcompat:1.7.0")
    implementation("androidx.webkit:webkit:1.11.0")
}

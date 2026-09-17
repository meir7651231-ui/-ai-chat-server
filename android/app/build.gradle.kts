import java.util.Properties
plugins { id("com.android.application"); id("org.jetbrains.kotlin.android") }
android {
    namespace = "il.liba.app"
    compileSdk = 34
    defaultConfig { applicationId = "il.liba.app"; minSdk = 26; targetSdk = 34; versionCode = 25; versionName = "2.3" }
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
        release { isMinifyEnabled = false; if (ksProps.isNotEmpty()) signingConfig = signingConfigs.getByName("liba") }
    }
    compileOptions { sourceCompatibility = JavaVersion.VERSION_17; targetCompatibility = JavaVersion.VERSION_17 }
    kotlinOptions { jvmTarget = "17" }
}
dependencies {
    implementation("androidx.core:core-ktx:1.13.1")
    implementation("androidx.appcompat:appcompat:1.7.0")
    implementation("androidx.webkit:webkit:1.11.0")
}

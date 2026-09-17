plugins { id("com.android.application"); id("org.jetbrains.kotlin.android") }
android {
    namespace = "il.liba.app"
    compileSdk = 34
    defaultConfig { applicationId = "il.liba.app"; minSdk = 26; targetSdk = 34; versionCode = 20; versionName = "2.0" }
    signingConfigs {
        create("liba") { storeFile = file("../keys/liba.jks"); storePassword = "liba-2026-bubble"; keyAlias = "liba"; keyPassword = "liba-2026-bubble" }
    }
    buildTypes {
        debug { signingConfig = signingConfigs.getByName("liba") }
        release { isMinifyEnabled = false; signingConfig = signingConfigs.getByName("liba") }
    }
    compileOptions { sourceCompatibility = JavaVersion.VERSION_17; targetCompatibility = JavaVersion.VERSION_17 }
    kotlinOptions { jvmTarget = "17" }
}
dependencies {
    implementation("androidx.core:core-ktx:1.13.1")
    implementation("androidx.appcompat:appcompat:1.7.0")
    implementation("androidx.webkit:webkit:1.11.0")
}

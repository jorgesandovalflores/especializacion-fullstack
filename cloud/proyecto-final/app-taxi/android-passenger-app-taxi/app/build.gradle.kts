import org.jetbrains.kotlin.konan.properties.Properties

plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.kotlin.compose)
    alias(libs.plugins.hilt.android)
    alias(libs.plugins.ksp)
    alias(libs.plugins.serialization)
    alias(libs.plugins.google.service)
}

android {
    /* PROPERTIES KEYSTORE */
    val propertiesKeystoreFile = rootProject.file("keystore.properties")
    val propertiesKeystore = Properties()
    propertiesKeystore.load(propertiesKeystoreFile.inputStream())

    namespace = "com.example.android_passenger"
    compileSdk = 36

    defaultConfig {
        applicationId = "com.example.android_passenger"
        minSdk = 29
        targetSdk = 36
        versionCode = 4
        versionName = "2.0.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
        buildConfigField("String", "API_BASE_URL", "\"https://6jh2c2wj-3001.brs.devtunnels.ms/\"")
    }

    signingConfigs {
        create("release") {
            storeFile = rootProject.file(propertiesKeystore.getProperty("STORE_FILE_RELEASE"))
            storePassword = propertiesKeystore.getProperty("STORE_PASSWORD_RELEASE")
            keyAlias = propertiesKeystore.getProperty("KEY_ALIAS_RELEASE")
            keyPassword = propertiesKeystore.getProperty("KEY_PASSWORD_RELEASE")
        }
        create("default") {
            storeFile = rootProject.file(propertiesKeystore.getProperty("STORE_FILE_DEBUG"))
            storePassword = propertiesKeystore.getProperty("STORE_PASSWORD_DEBUG")
            keyAlias = propertiesKeystore.getProperty("KEY_ALIAS_DEBUG")
            keyPassword = propertiesKeystore.getProperty("KEY_PASSWORD_DEBUG")
        }
    }

    buildTypes {
        getByName("debug") {
            isMinifyEnabled = false

        }
        release {
            isMinifyEnabled = false
            signingConfig = signingConfigs.getByName("release")
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
    }

    buildFeatures {
        compose = true
        buildConfig = true
    }

    sourceSets["main"].res.srcDirs(
        "src/main/res",
        "src/main/java/com/example/android_passenger/commons/presentation/res",
        "src/main/java/com/example/android_passenger/features/splash/presentation/res",
        "src/main/java/com/example/android_passenger/features/signin/presentation/res",
        "src/main/java/com/example/android_passenger/features/signup/presentation/res",
        "src/main/java/com/example/android_passenger/features/home/presentation/res",
        "src/main/java/com/example/android_passenger/features/menu/presentation/res"
    )

}

kotlin {
    jvmToolchain(17)
}

dependencies {
    constraints {
        implementation(libs.javapoet)
    }
    implementation(libs.androidx.core.ktx)
    implementation(libs.androidx.lifecycle.runtime.ktx)
    implementation(libs.androidx.activity.compose)
    implementation(platform(libs.androidx.compose.bom))
    implementation(libs.androidx.ui)
    implementation(libs.androidx.ui.graphics)
    implementation(libs.androidx.ui.tooling.preview)
    implementation(libs.androidx.material3)

    // Navigation Compose
    implementation(libs.androidx.navigation.compose)
    // Lifecycle + ViewModel
    implementation(libs.androidx.lifecycle.viewmodel.ktx)
    implementation(libs.androidx.lifecycle.runtime.compose)
    // Hilt
    implementation(libs.hilt.android)
    ksp(libs.hilt.compiler)
    implementation(libs.hilt.lifecycle.viewmodel.compose)
    // Retrofit + Gson + OkHttp
    implementation(libs.retrofit.core)
    implementation(libs.retrofit.gson)
    implementation(libs.okhttp.core)
    implementation(libs.okhttp.logging)
    // room
    implementation(libs.room.runtime)
    implementation(libs.room.ktx)
    ksp(libs.room.ksp)
    // Coroutines
    implementation(libs.kotlinx.coroutines.core)
    implementation(libs.kotlinx.coroutines.android)
    // Security
    implementation(libs.security.crypto)
    // serialization
    implementation(libs.serialization)
    // serialization
    implementation(libs.coil.compose)
    implementation(libs.coil.svg)
    // maps
    implementation(libs.maps.compose)
    implementation(libs.play.services.maps)
    implementation(libs.play.services.location)
    implementation(libs.play.services.base)
    // firebase
    implementation(platform(libs.firebase.bom))
    implementation(libs.firebase.messaging)
    implementation(libs.firebase.analytics)
    implementation(libs.firebase.storage)
    implementation(libs.firebase.firestore)
    // Socket.IO
    implementation("io.socket:socket.io-client:2.1.0") {
        exclude(group = "org.json", module = "json")
    }

    // Pruebas unitarias (JVM local)
    testImplementation(libs.junit)
    testImplementation(libs.kotlinx.coroutines.test)

    // Pruebas instrumentadas
    androidTestImplementation(libs.androidx.junit)
    androidTestImplementation(libs.androidx.espresso.core)

    // Compose Testing
    androidTestImplementation(platform(libs.androidx.compose.bom))
    androidTestImplementation(libs.androidx.ui.test.junit4)
    debugImplementation(libs.androidx.ui.test.manifest)

    // librería de apoyo
    testImplementation(libs.mockk)
    androidTestImplementation(libs.androidx.ui.test.junit4)
    debugImplementation(libs.androidx.ui.tooling)
}

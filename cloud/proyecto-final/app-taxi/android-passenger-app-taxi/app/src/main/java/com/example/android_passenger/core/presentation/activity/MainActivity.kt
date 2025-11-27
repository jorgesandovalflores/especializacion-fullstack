package com.example.android_passenger.core.presentation.activity

import android.app.Activity
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.SystemBarStyle
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.core.view.WindowCompat
import androidx.navigation.NavController
import androidx.navigation.NavType
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.navigation
import androidx.navigation.compose.rememberNavController
import androidx.navigation.navArgument
import com.example.android_passenger.features.home.presentation.HomeScreenRoute
import com.example.android_passenger.features.menu.presentation.MenuScreenRoute
import com.example.android_passenger.features.splash.presentation.SplashScreenRoute
import com.example.android_passenger.features.signin.presentation.SignInGenerateOtpRoute
import com.example.android_passenger.features.signin.presentation.SignInValidateOtpRoute
import com.example.android_passenger.features.signup.presentation.SignUpStep1Route
import com.example.android_passenger.features.signup.presentation.SignUpStep2Route
import dagger.hilt.android.AndroidEntryPoint
import java.net.URLEncoder
import java.nio.charset.StandardCharsets
import java.time.Instant
import androidx.core.net.toUri
import com.example.android_passenger.core.presentation.theme.AndroidTheme

// ===== Rutas =====
sealed class Route(val path: String) {
    // Auth
    data object SignIn : Route("sign_in")
    data object SignInGenerate : Route("sign_in/generate")
    data object SignInValidate : Route("sign_in/validate?phone={phone}&expiresAt={expiresAt}") {
        const val KEY_PHONE = "phone"
        const val KEY_EXPIRES_AT = "expiresAt"
        fun build(phone: String, expiresAtUtcMillis: Long): String {
            val phoneEscaped = URLEncoder.encode(phone, StandardCharsets.UTF_8.name())
            return "sign_in/validate?phone=$phoneEscaped&expiresAt=$expiresAtUtcMillis"
        }
    }

    // Signup
    data object SignUp : Route("sign_up")
    data object SignUpStep1 : Route("sign_up/step1")
    data object SignUpStep2 : Route("sign_up/step2")

    // Otras
    data object Splash : Route("splash")
    data object Home : Route("home")
    data object Menu : Route("menu")
}

@AndroidEntryPoint
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        WindowCompat.setDecorFitsSystemWindows(window, false)
        enableEdgeToEdge(
            statusBarStyle = SystemBarStyle.auto(
                lightScrim = android.graphics.Color.TRANSPARENT,
                darkScrim = android.graphics.Color.TRANSPARENT
            ),
            navigationBarStyle = SystemBarStyle.auto(
                lightScrim = android.graphics.Color.TRANSPARENT,
                darkScrim = android.graphics.Color.TRANSPARENT
            )
        )
        window.isStatusBarContrastEnforced = false
        window.isNavigationBarContrastEnforced = false

        setContent {
            AndroidTheme() {
                AppRoot()
            }
        }
    }
}

@Composable
private fun AppRoot() {
    val nav = rememberNavController()

    NavHost(navController = nav, startDestination = Route.Splash.path) {

        composable(Route.Splash.path) {
            SplashScreenRoute(
                onGoSignIn = {
                    nav.navigateClearingBackStack(Route.SignIn.path)
                },
                onGoHome = {
                    nav.navigateClearingBackStack(Route.Home.path)
                },
                onGoSignUp = {
                    nav.navigateClearingBackStack(Route.SignUp.path)
                }
            )
        }

        // ======= Grafo de autenticación =======
        navigation(route = "auth_graph", startDestination = Route.SignIn.path) {

            composable(Route.SignIn.path) {
                SignInEntryRoute(nav = nav)
            }

            composable(Route.SignInGenerate.path) {
                SignInGenerateOtpRoute(
                    onGoValidate = { phone, expiresAtIso ->
                        val expiresAtUtcMillis = runCatching { Instant.parse(expiresAtIso).toEpochMilli() }
                            .getOrDefault(0L)
                        nav.navigate(Route.SignInValidate.build(phone, expiresAtUtcMillis))
                    }
                )
            }

            composable(
                route = Route.SignInValidate.path,
                arguments = listOf(
                    navArgument(Route.SignInValidate.KEY_PHONE) { type = NavType.StringType; nullable = false },
                    navArgument(Route.SignInValidate.KEY_EXPIRES_AT) { type = NavType.LongType; nullable = false }
                )
            ) { backStackEntry ->
                val phone = backStackEntry.arguments?.getString(Route.SignInValidate.KEY_PHONE).orEmpty()
                val expiresAt = backStackEntry.arguments?.getLong(Route.SignInValidate.KEY_EXPIRES_AT) ?: 0L

                SignInValidateOtpRoute(
                    phone = phone,
                    expiresAtUtcMillis = expiresAt,
                    onGoHome = {
                        nav.navigateClearingBackStack(Route.Home.path)
                    },
                    onGoSignUp = {
                        nav.navigate(Route.SignUp.path) {
                            popUpTo("auth_graph") { inclusive = true }
                        }
                    }
                )
            }
        }

        // ======= Grafo de registro =======
        navigation(route = "signup_graph", startDestination = Route.SignUp.path) {

            composable(Route.SignUp.path) {
                SignUpEntryRoute(nav = nav)
            }

            // Step 1 → Step 2
            composable(Route.SignUpStep1.path) {
                SignUpStep1Route(
                    onNext = { nav.navigate(Route.SignUpStep2.path) }
                )
            }

            // Step 2 → Home
            composable(Route.SignUpStep2.path) {
                SignUpStep2Route(
                    onFinish = {
                        nav.navigateClearingBackStack(Route.Home.path)
                    }
                )
            }
        }

        // ======= Home =======
        composable(Route.Home.path) {
            HomeScreenRoute(
                onNavigateToMenu = {
                    nav.navigate(Route.Menu.path)
                },
                onBackPressed = {
                    (nav.context as? Activity)?.finish()
                }
            )
        }

        // ======= Menu =======
        composable(Route.Menu.path) {
            MenuScreenRoute(
                onNavClick = {
                    val popped = nav.popBackStack()
                    if (!popped) {
                        nav.navigateClearingBackStack(Route.Home.path)
                    }
                },
                onMenuClick = { menu ->
                    try {
                        runCatching { menu.deeplink.toUri() }
                            .onSuccess { uri -> nav.navigate(uri) }
                    } catch (e: Exception) {}
                },
                onLogoutSuccess = {
                    nav.navigateClearingBackStack(Route.Splash.path)
                }
            )
        }
    }
}

@Composable
private fun SignInEntryRoute(
    nav: NavController,
    getPendingOtp: () -> PendingOtp? = { null }
) {
    LaunchedEffect(Unit) {
        val pending = getPendingOtp()
        val now = System.currentTimeMillis()
        if (pending != null && pending.expiresAtUtcMillis > now && pending.phone.isNotBlank()) {
            nav.navigateSingleTop(Route.SignInValidate.build(pending.phone, pending.expiresAtUtcMillis)) {
                popUpTo(Route.SignIn.path) { inclusive = true }
            }
        } else {
            nav.navigateSingleTop(Route.SignInGenerate.path) {
                popUpTo(Route.SignIn.path) { inclusive = true }
            }
        }
    }
}

data class PendingOtp(
    val phone: String,
    val expiresAtUtcMillis: Long
)

@Composable
private fun SignUpEntryRoute(
    nav: NavController,
    getStep: () -> Int = { 1 } // 1 o 2
) {
    LaunchedEffect(Unit) {
        when (getStep()) {
            2 -> nav.navigateSingleTop(Route.SignUpStep2.path) {
                popUpTo(Route.SignUp.path) { inclusive = true }
            }
            else -> nav.navigateSingleTop(Route.SignUpStep1.path) {
                popUpTo(Route.SignUp.path) { inclusive = true }
            }
        }
    }
}

private inline fun NavController.navigateSingleTop(
    route: String,
    crossinline builder: androidx.navigation.NavOptionsBuilder.() -> Unit = {}
) {
    this.navigate(route) {
        launchSingleTop = true
        builder()
    }
}

private inline fun NavController.navigateClearingBackStack(route: String) {
    this.navigate(route) {
        popUpTo(this@navigateClearingBackStack.graph.id) {
            inclusive = true
            saveState = false
        }
        launchSingleTop = true
        restoreState = false
    }
}

package com.example.android_passenger.features.splash.presentation

import com.example.android_passenger.R
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.size
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.hilt.lifecycle.viewmodel.compose.hiltViewModel
import com.example.android_passenger.commons.domain.usecase.GetPassengerLocalState
import com.example.android_passenger.commons.presentation.NavigationBarStyle
import com.example.android_passenger.core.presentation.theme.ColorPrimary
import com.example.android_passenger.core.presentation.theme.ColorSecondary
import kotlinx.coroutines.delay


@Composable
fun SplashScreen(
    onGoSignIn: () -> Unit,
    onGoHome: () -> Unit,
    onGoSignUp: () -> Unit,
    modifier: Modifier = Modifier,
    passengerLocalState: GetPassengerLocalState,
) {
    val bg = ColorPrimary

    NavigationBarStyle(color = bg, darkIcons = true)

    // Timer para navegación
    LaunchedEffect(passengerLocalState) {
        when (val value = passengerLocalState) {
            is GetPassengerLocalState.Idle -> { }
            is GetPassengerLocalState.Success -> {
                if (value.value.id.isNullOrEmpty()) {
                    onGoSignIn()
                } else if (value.value.givenName.isNullOrEmpty()) {
                    onGoSignUp()
                } else {
                    onGoHome()
                }
            }
            else -> {
                onGoSignIn()
            }
        }
    }

    // Fondo + logo + loader
    Box(
        modifier = modifier
            .fillMaxSize()
            .background(bg),
        contentAlignment = Alignment.Center
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(24.dp)
        ) {
            Image(
                painter = painterResource(id = R.drawable.feature_splash_logo),
                contentDescription = "Splash Logo",
                modifier = Modifier.size(160.dp)
            )
            CircularProgressIndicator(
                color = ColorSecondary,
                strokeWidth = 4.dp
            )
        }
    }
}

@Composable
fun SplashScreenRoute(
    onGoSignIn: () -> Unit,
    onGoHome: () -> Unit,
    onGoSignUp: () -> Unit,
    modifier: Modifier = Modifier,
    vm: SplashViewModel = hiltViewModel()
) {
    val user = vm.user.collectAsState()
    LaunchedEffect(Unit) {
        delay(1500)
        vm.callGetUser()
    }
    SplashScreen(
        onGoSignIn = onGoSignIn,
        onGoHome = onGoHome,
        onGoSignUp = onGoSignUp,
        modifier = modifier,
        passengerLocalState = user.value
    )
}

@Preview(showBackground = true)
@Composable
fun SplashScreenPreview() {
    SplashScreen(passengerLocalState = GetPassengerLocalState.Idle, onGoSignIn = {}, onGoHome = {}, onGoSignUp = {})
}

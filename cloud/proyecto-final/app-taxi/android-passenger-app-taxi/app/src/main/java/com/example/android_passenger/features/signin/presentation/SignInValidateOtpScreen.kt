package com.example.android_passenger.features.signin.presentation

import android.content.res.Configuration
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.imePadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.systemBarsPadding
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.luminance
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.hilt.lifecycle.viewmodel.compose.hiltViewModel
import com.example.android_passenger.commons.presentation.BaseToast
import com.example.android_passenger.commons.presentation.NavigationBarStyle
import com.example.android_passenger.commons.presentation.OtpCodeInput
import com.example.android_passenger.commons.presentation.PrimaryButton
import com.example.android_passenger.commons.presentation.ToastType
import com.example.android_passenger.core.presentation.theme.AndroidTheme
import com.example.android_passenger.features.signin.domain.usecase.OtpGenerateState
import com.example.android_passenger.features.signin.domain.usecase.OtpValidateState
import com.google.firebase.messaging.FirebaseMessaging
import kotlinx.coroutines.delay
import java.time.Duration
import java.time.Instant
import java.time.ZoneId
import java.time.ZonedDateTime

@Composable
fun SignInValidateOtpScreen(
    phone: String,
    expiresAt: String,
    validateState: OtpValidateState,
    generateState: OtpGenerateState,
    onValidate: (String) -> Unit,
    onResend: () -> Unit,
    modifier: Modifier = Modifier
) {
    val colorScheme = MaterialTheme.colorScheme
    val bg = colorScheme.background

    // Decidimos color de íconos del sistema en función de la luminancia del background
    val isLightBackground = bg.luminance() > 0.5f
    NavigationBarStyle(color = bg, darkIcons = isLightBackground)

    // ====== Estado OTP local (4 dígitos) ======
    var d0 by remember(expiresAt) { mutableStateOf("") }
    var d1 by remember(expiresAt) { mutableStateOf("") }
    var d2 by remember(expiresAt) { mutableStateOf("") }
    var d3 by remember(expiresAt) { mutableStateOf("") }
    val code = remember(d0, d1, d2, d3) { "$d0$d1$d2$d3" }
    val isComplete = code.length == 4

    // ====== Manejo de expiración (cuenta regresiva) ======
    val systemZone = remember { ZoneId.systemDefault() }
    val targetLocal: ZonedDateTime? = remember(expiresAt, systemZone) {
        runCatching { Instant.parse(expiresAt).atZone(systemZone) }.getOrNull()
    }

    var remaining by remember(targetLocal) { mutableIntStateOf(secondsRemaining(targetLocal)) }
    LaunchedEffect(targetLocal) {
        while (true) {
            remaining = secondsRemaining(targetLocal)
            if (remaining <= 0) break
            delay(1000L)
        }
    }
    val countdownText = remember(remaining) { formatAsMMSS(remaining) }
    val isExpired = remaining <= 0

    // ====== Cálculos UI ======
    val isValidating = validateState is OtpValidateState.Loading
    val canValidate = isComplete && !isExpired && !isValidating

    val toastMessage = remember(validateState, generateState) {
        when (val v = validateState) {
            is OtpValidateState.Error -> v.message
            else -> when (val g = generateState) {
                is OtpGenerateState.Error -> g.message
                else -> null
            }
        }
    }

    Surface(
        modifier = modifier
            .fillMaxSize()
            .background(bg),
        color = bg
    ) {
        Box(modifier = Modifier.fillMaxSize()) {

            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .systemBarsPadding()
                    .imePadding()
                    .padding(horizontal = 24.dp),
                verticalArrangement = Arrangement.SpaceBetween
            ) {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(top = 32.dp),
                    verticalArrangement = Arrangement.spacedBy(20.dp)
                ) {
                    Text(
                        text = "Hemos enviado un código de 4 dígitos al número $phone",
                        style = MaterialTheme.typography.titleMedium,
                        color = colorScheme.onBackground
                    )

                    OtpCodeInput(
                        d0 = d0, onD0 = { d0 = it },
                        d1 = d1, onD1 = { d1 = it },
                        d2 = d2, onD2 = { d2 = it },
                        d3 = d3, onD3 = { d3 = it }
                    )

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.End
                    ) {
                        if (!isExpired) {
                            Text(
                                text = "Puedes volver a enviar un código en $countdownText",
                                style = MaterialTheme.typography.bodyMedium.copy(
                                    textDecoration = TextDecoration.Underline
                                ),
                                color = colorScheme.onSurface,
                                textAlign = TextAlign.End
                            )
                        } else {
                            Text(
                                text = "Reenviar código",
                                style = MaterialTheme.typography.bodyMedium.copy(
                                    textDecoration = TextDecoration.Underline
                                ),
                                // Usamos primary para que parezca un link/acción
                                color = colorScheme.primary,
                                modifier = Modifier.clickable { onResend() },
                                textAlign = TextAlign.End
                            )
                        }
                    }
                }

                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(bottom = 24.dp),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    PrimaryButton(
                        text = "Validar",
                        onClick = { if (canValidate) onValidate(code) },
                        enabled = canValidate,
                        loading = isValidating,
                        modifier = Modifier.fillMaxWidth()
                    )
                }
            }

            // Toast de error (si aplica)
            toastMessage?.let {
                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(bottom = 16.dp),
                    contentAlignment = Alignment.BottomCenter
                ) {
                    BaseToast(message = it, type = ToastType.Error)
                }
            }
        }
    }
}

/* ===== Utilidades ===== */
private fun secondsRemaining(targetLocal: ZonedDateTime?): Int {
    if (targetLocal == null) return 0
    val now = ZonedDateTime.now(targetLocal.zone)
    val diff = Duration.between(now, targetLocal).seconds
    return if (diff > 0) diff.toInt() else 0
}

private fun formatAsMMSS(seconds: Int): String {
    val m = seconds / 60
    val s = seconds % 60
    return "%02d:%02d".format(m, s)
}

@Composable
fun SignInValidateOtpRoute(
    phone: String,
    expiresAtUtcMillis: Long,
    onGoHome: () -> Unit,
    onGoSignUp: () -> Unit,
    modifier: Modifier = Modifier,
    vm: SignInViewModel = hiltViewModel()
) {
    val validateState by vm.validateOtpUi.collectAsState()
    val generateState by vm.generateOtpUi.collectAsState()

    var expiresIso by remember(expiresAtUtcMillis) {
        mutableStateOf(Instant.ofEpochMilli(expiresAtUtcMillis).toString())
    }

    // --- Estado del token FCM ---
    var fcmToken by remember { mutableStateOf<String?>(null) }
    var fcmError by remember { mutableStateOf<String?>(null) }

    // Obtiene el token una sola vez
    LaunchedEffect(Unit) {
        FirebaseMessaging.getInstance().token
            .addOnCompleteListener { task ->
                if (task.isSuccessful) {
                    fcmToken = task.result
                    fcmError = null
                } else {
                    fcmToken = null
                    fcmError = task.exception?.message ?: "No se pudo obtener el token FCM"
                }
            }
    }

    LaunchedEffect(validateState) {
        when (val s = validateState) {
            is OtpValidateState.Success -> {
                vm.clearValidateState()
                if (s.showRegister) onGoSignUp() else onGoHome()
            }
            else -> Unit
        }
    }

    LaunchedEffect(generateState) {
        when (val g = generateState) {
            is OtpGenerateState.Success -> {
                expiresIso = g.expiresAt
            }
            else -> Unit
        }
    }

    SignInValidateOtpScreen(
        phone = phone,
        expiresAt = expiresIso,
        validateState = validateState,
        generateState = generateState,
        onValidate = { code ->
            val token = fcmToken
            if (token.isNullOrEmpty()) {
                FirebaseMessaging.getInstance().token
                    .addOnCompleteListener { task ->
                        if (task.isSuccessful) {
                            vm.callValidateOtp(phone, code, task.result)
                        } else {
                            vm.clearValidateState()
                        }
                    }
            } else {
                vm.callValidateOtp(phone, code, token)
            }
        },
        onResend = { vm.callGenerateOtp(phone) },
        modifier = modifier
    )
}

/* ===== Previews ===== */
@Preview(
    showBackground = true,
    backgroundColor = 0xFFFFFFFF,
    uiMode = Configuration.UI_MODE_NIGHT_NO,
    name = "Validate OTP - Idle Light"
)
@Composable
private fun SignInValidateOtpScreenPreview_Idle_Light() {
    val futureUtc = Instant.now().plusSeconds(90).toString()
    AndroidTheme(darkTheme = false) {
        SignInValidateOtpScreen(
            phone = "987654321",
            expiresAt = futureUtc,
            validateState = OtpValidateState.Idle,
            generateState = OtpGenerateState.Idle,
            onValidate = {},
            onResend = {}
        )
    }
}

@Preview(
    showBackground = true,
    backgroundColor = 0xFF000000,
    uiMode = Configuration.UI_MODE_NIGHT_YES,
    name = "Validate OTP - Idle Dark"
)
@Composable
private fun SignInValidateOtpScreenPreview_Idle_Dark() {
    val futureUtc = Instant.now().plusSeconds(90).toString()
    AndroidTheme(darkTheme = true) {
        SignInValidateOtpScreen(
            phone = "987654321",
            expiresAt = futureUtc,
            validateState = OtpValidateState.Idle,
            generateState = OtpGenerateState.Idle,
            onValidate = {},
            onResend = {}
        )
    }
}

@Preview(
    showBackground = true,
    backgroundColor = 0xFFFFFFFF,
    uiMode = Configuration.UI_MODE_NIGHT_NO,
    name = "Validate OTP - Loading Light"
)
@Composable
private fun SignInValidateOtpScreenPreview_Loading_Light() {
    val futureUtc = Instant.now().plusSeconds(60).toString()
    AndroidTheme(darkTheme = false) {
        SignInValidateOtpScreen(
            phone = "987654321",
            expiresAt = futureUtc,
            validateState = OtpValidateState.Loading,
            generateState = OtpGenerateState.Idle,
            onValidate = {},
            onResend = {}
        )
    }
}

@Preview(
    showBackground = true,
    backgroundColor = 0xFFFFFFFF,
    uiMode = Configuration.UI_MODE_NIGHT_NO,
    name = "Validate OTP - Error Light"
)
@Composable
private fun SignInValidateOtpScreenPreview_Error_Light() {
    val futureUtc = Instant.now().plusSeconds(30).toString()
    AndroidTheme(darkTheme = false) {
        SignInValidateOtpScreen(
            phone = "987654321",
            expiresAt = futureUtc,
            validateState = OtpValidateState.Error("Código inválido"),
            generateState = OtpGenerateState.Idle,
            onValidate = {},
            onResend = {}
        )
    }
}

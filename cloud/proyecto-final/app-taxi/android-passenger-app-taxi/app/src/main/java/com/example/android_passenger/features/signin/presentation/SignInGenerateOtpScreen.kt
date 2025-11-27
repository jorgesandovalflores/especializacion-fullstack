package com.example.android_passenger.features.signin.presentation

import android.content.res.Configuration
import android.os.Build
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.WindowInsetsSides
import androidx.compose.foundation.layout.only
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.union
import androidx.compose.foundation.layout.windowInsetsPadding
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.ime
import androidx.compose.foundation.layout.navigationBars
import androidx.compose.foundation.layout.statusBars
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.SpanStyle
import androidx.compose.ui.text.buildAnnotatedString
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.withStyle
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.graphics.luminance
import androidx.compose.ui.res.painterResource
import androidx.hilt.lifecycle.viewmodel.compose.hiltViewModel
import androidx.compose.ui.semantics.LiveRegionMode
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.heading
import androidx.compose.ui.semantics.liveRegion
import androidx.compose.ui.semantics.role
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.semantics.stateDescription
import com.example.android_passenger.R
import com.example.android_passenger.commons.presentation.NavigationBarStyle
import com.example.android_passenger.commons.presentation.PhoneInputField
import com.example.android_passenger.commons.presentation.PrimaryButton
import com.example.android_passenger.commons.presentation.BaseToast
import com.example.android_passenger.commons.presentation.ToastType
import com.example.android_passenger.core.presentation.theme.AndroidTheme
import com.example.android_passenger.core.presentation.utils.PermissionUtils
import com.example.android_passenger.core.presentation.utils.rememberLocationPermissionState
import com.example.android_passenger.core.presentation.utils.rememberNotificationPermissionState
import com.example.android_passenger.features.signin.domain.usecase.OtpGenerateState

@Composable
fun SignInGenerateOtpRoute(
    onGoValidate: (String, String) -> Unit,
    modifier: Modifier = Modifier,
    vm: SignInViewModel = hiltViewModel()
) {
    val appContext = LocalContext.current.applicationContext
    val state by vm.generateOtpUi.collectAsState()
    var phone by remember { mutableStateOf("") }
    val normalized = remember(phone) { phone.filter(Char::isDigit) }
    val isValid = normalized.length == 9
    val loading = state is OtpGenerateState.Loading

    // Estados de permisos
    val notifPerm = rememberNotificationPermissionState()
    val locPerm = rememberLocationPermissionState()

    LaunchedEffect(Unit) {
        PermissionUtils.registerNotificationChannels(context = appContext)
        if (!notifPerm.hasPermission && Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            notifPerm.requestPermission()
        }
    }

    LaunchedEffect(state) {
        when (val s = state) {
            is OtpGenerateState.Success -> {
                vm.clearGenerateState()
                onGoValidate(s.phone, s.expiresAt)
            }
            else -> Unit
        }
    }

    SignInGenerateOtpScreen(
        phone = phone,
        onPhoneChange = { phone = it },
        isValid = isValid,
        loading = loading,
        state = state,
        onSubmit = {
            if (!locPerm.hasPermission) locPerm.requestPermission()
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU && !notifPerm.hasPermission) {
                notifPerm.requestPermission()
            }
            vm.callGenerateOtp(normalized)
        },
        modifier = modifier
    )
}

@Composable
fun SignInGenerateOtpScreen(
    phone: String,
    onPhoneChange: (String) -> Unit,
    isValid: Boolean,
    loading: Boolean,
    state: OtpGenerateState,
    onSubmit: () -> Unit,
    modifier: Modifier = Modifier
) {
    val colorScheme = MaterialTheme.colorScheme
    val bg = colorScheme.background

    val isLightBackground = bg.luminance() > 0.5f
    NavigationBarStyle(color = bg, darkIcons = isLightBackground)

    val toastMessage = remember(state) {
        (state as? OtpGenerateState.Error)?.message
    }

    Box(
        modifier = modifier
            .fillMaxSize()
            .background(bg)
    ) {
        Image(
            painter = painterResource(id = R.drawable.feature_signin_picture),
            contentDescription = "Ilustración de bienvenida para validar tu identidad",
            contentScale = ContentScale.Fit,
            modifier = Modifier
                .fillMaxWidth()
                .windowInsetsPadding(WindowInsets.statusBars.only(WindowInsetsSides.Top))
                .padding(top = 24.dp)
                .align(Alignment.TopCenter)
        )

        Surface(
            color = colorScheme.surface,
            shape = RoundedCornerShape(topStart = 24.dp, topEnd = 24.dp),
            shadowElevation = 0.dp,
            modifier = Modifier
                .fillMaxWidth()
                .align(Alignment.BottomCenter)
                .windowInsetsPadding(
                    WindowInsets.navigationBars
                        .union(WindowInsets.ime)
                        .only(WindowInsetsSides.Bottom)
                )
        ) {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 24.dp, vertical = 28.dp),
                horizontalAlignment = Alignment.Start,
                verticalArrangement = Arrangement.spacedBy(20.dp)
            ) {
                Text(
                    text = buildAnnotatedString {
                        append("Validaremos tu ")
                        withStyle(SpanStyle(fontWeight = FontWeight.Bold)) { append("identidad") }
                        append(", con tu número de teléfono")
                    },
                    style = MaterialTheme.typography.titleMedium,
                    color = colorScheme.onSurface,
                    modifier = Modifier.semantics {
                        // Marcamos como encabezado para TalkBack
                        heading()
                        contentDescription = "Validaremos tu identidad con tu número de teléfono"
                    }
                )

                // Contenedor accesible para el campo de teléfono
                Box(
                    modifier = Modifier
                        .padding(top = 4.dp)
                        .semantics(mergeDescendants = true) {
                            contentDescription = "Campo para ingresar tu número de teléfono. Debe tener nueve dígitos."
                        }
                ) {
                    PhoneInputField(
                        value = phone,
                        onValueChange = onPhoneChange,
                        placeholder = "Ingresa tu número de teléfono",
                        modifier = Modifier
                    )
                }

                PrimaryButton(
                    text = "Ingresar",
                    onClick = onSubmit,
                    enabled = isValid && !loading,
                    loading = loading,
                    modifier = Modifier
                        .padding(top = 8.dp)
                        .semantics {
                            role = androidx.compose.ui.semantics.Role.Button
                            contentDescription = if (isValid && !loading) {
                                "Botón Ingresar. Envía el código de verificación por SMS."
                            } else if (loading) {
                                "Botón Ingresar. Enviando código de verificación."
                            } else {
                                "Botón Ingresar desactivado. Completa tu número de teléfono de nueve dígitos."
                            }
                            stateDescription = when {
                                loading -> "Cargando"
                                isValid && !loading -> "Disponible"
                                else -> "No disponible"
                            }
                        }
                )
            }
        }

        toastMessage?.let {
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(bottom = 16.dp)
                    .semantics {
                        // Indicamos que es un mensaje importante para que TalkBack lo lea automáticamente
                        liveRegion = LiveRegionMode.Polite
                        contentDescription = "Error: $it"
                    },
                contentAlignment = Alignment.BottomCenter
            ) {
                BaseToast(message = it, type = ToastType.Error)
            }
        }
    }
}

@Preview(
    showBackground = true,
    backgroundColor = 0xFFFFFFFF,
    uiMode = Configuration.UI_MODE_NIGHT_NO,
    name = "SignInGenerateOtp - Light"
)
@Composable
fun SignInGenerateOtpScreenPreview_Idle_Light() {
    AndroidTheme(darkTheme = false) {
        SignInGenerateOtpScreen(
            phone = "",
            onPhoneChange = {},
            isValid = false,
            loading = false,
            state = OtpGenerateState.Idle,
            onSubmit = {}
        )
    }
}

@Preview(
    showBackground = true,
    backgroundColor = 0xFF000000,
    uiMode = Configuration.UI_MODE_NIGHT_YES,
    name = "SignInGenerateOtp - Dark Error"
)
@Composable
fun SignInGenerateOtpScreenPreview_Error_Dark() {
    AndroidTheme(darkTheme = true) {
        SignInGenerateOtpScreen(
            phone = "987654321",
            onPhoneChange = {},
            isValid = true,
            loading = false,
            state = OtpGenerateState.Error(
                message = "No pudimos generar el código. Intenta de nuevo."
            ),
            onSubmit = {}
        )
    }
}

@Preview(
    showBackground = true,
    backgroundColor = 0xFFFFFFFF,
    uiMode = Configuration.UI_MODE_NIGHT_NO,
    name = "SignInGenerateOtp - Light Loading"
)
@Composable
fun SignInGenerateOtpScreenPreview_Loading_Light() {
    AndroidTheme(darkTheme = false) {
        SignInGenerateOtpScreen(
            phone = "987654321",
            onPhoneChange = {},
            isValid = true,
            loading = true,
            state = OtpGenerateState.Loading,
            onSubmit = {}
        )
    }
}

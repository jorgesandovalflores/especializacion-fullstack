package com.example.android_passenger.features.signup.presentation

import android.content.res.Configuration
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.luminance
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.hilt.lifecycle.viewmodel.compose.hiltViewModel
import com.example.android_passenger.commons.presentation.BaseToast
import com.example.android_passenger.commons.presentation.GenericInputField
import com.example.android_passenger.commons.presentation.NavigationBarStyle
import com.example.android_passenger.commons.presentation.PrimaryButton
import com.example.android_passenger.commons.presentation.ToastType
import com.example.android_passenger.core.presentation.theme.AndroidTheme
import com.example.android_passenger.features.signup.domain.model.SignUpModelStep1
import com.example.android_passenger.features.signup.domain.model.SignUpModelStep2
import com.example.android_passenger.features.signup.domain.usecase.GetSignUpStep1UseCaseState
import com.example.android_passenger.features.signup.domain.usecase.GetSignUpStep2UseCaseState
import com.example.android_passenger.features.signup.domain.usecase.SignUpUseCaseState

@Composable
fun SignUpStep2Route(
    onFinish: () -> Unit,
    modifier: Modifier = Modifier,
    viewModel: SignUpViewModel = hiltViewModel()
) {
    val step1State by viewModel.getStep1.collectAsState()
    val step2State by viewModel.getStep2.collectAsState()
    val signUpState by viewModel.signUp.collectAsState()

    LaunchedEffect(Unit) {
        viewModel.callGetStep1()
        viewModel.callGetStep2()
    }

    LaunchedEffect(signUpState) {
        when (signUpState) {
            is SignUpUseCaseState.Success -> onFinish()
            else -> Unit
        }
    }

    SignUpStep2Screen(
        step2State = step2State,
        signUpState = signUpState,
        onEmailChange = { },
        onPhoneNumberChange = { },
        onFinish = { email, phoneNumber ->
            val step1Data = when (step1State) {
                is GetSignUpStep1UseCaseState.Success ->
                    (step1State as GetSignUpStep1UseCaseState.Success).data
                else -> SignUpModelStep1("", "", "")
            }

            viewModel.callSignUp(
                step1Data,
                SignUpModelStep2(email = email, phoneNumber = phoneNumber)
            )
        },
        modifier = modifier
    )
}

@Composable
fun SignUpStep2Screen(
    step2State: GetSignUpStep2UseCaseState,
    signUpState: SignUpUseCaseState,
    onEmailChange: (String) -> Unit,
    onPhoneNumberChange: (String) -> Unit,
    onFinish: (email: String, phoneNumber: String) -> Unit,
    modifier: Modifier = Modifier
) {
    val colorScheme = MaterialTheme.colorScheme
    val bg = colorScheme.background

    val isLightBackground = bg.luminance() > 0.5f
    NavigationBarStyle(color = bg, darkIcons = isLightBackground)

    var email by remember { mutableStateOf("") }
    var phoneNumber by remember { mutableStateOf("") }

    LaunchedEffect(step2State) {
        when (step2State) {
            is GetSignUpStep2UseCaseState.Success -> {
                val data = step2State.data
                email = data.email ?: ""
                phoneNumber = data.phoneNumber ?: ""
            }
            else -> Unit
        }
    }

    val isLoadingStep2 = step2State is GetSignUpStep2UseCaseState.Loading
    val isLoadingSignUp = signUpState is SignUpUseCaseState.Loading
    val isLoading = isLoadingStep2 || isLoadingSignUp
    val isValid = email.isNotBlank() && phoneNumber.isNotBlank() && !isLoading

    val toastMessage = remember(signUpState) {
        when (val state = signUpState) {
            is SignUpUseCaseState.Error -> state.message
            else -> null
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
                    .imePadding(),
                verticalArrangement = Arrangement.SpaceBetween
            ) {
                // Header
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(24.dp)
                ) {
                    Text(
                        text = "Información de contacto",
                        style = MaterialTheme.typography.headlineSmall.copy(
                            fontWeight = FontWeight.Bold
                        ),
                        color = colorScheme.onBackground
                    )

                    Text(
                        text = "Completa tus datos de contacto",
                        style = MaterialTheme.typography.bodyMedium,
                        color = colorScheme.onSurfaceVariant
                    )
                }

                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .weight(1f)
                        .padding(24.dp),
                    verticalArrangement = Arrangement.Top
                ) {
                    Column(
                        modifier = Modifier.fillMaxWidth(),
                        verticalArrangement = Arrangement.spacedBy(20.dp)
                    ) {
                        GenericInputField(
                            value = email,
                            onValueChange = {
                                email = it
                                onEmailChange(it)
                            },
                            placeholder = "Ingresa tu correo electrónico",
                            keyboardType = androidx.compose.ui.text.input.KeyboardType.Email,
                            maxLength = 100,
                            imeAction = androidx.compose.ui.text.input.ImeAction.Next,
                            enabled = !isLoading
                        )

                        GenericInputField(
                            value = phoneNumber,
                            onValueChange = {
                                phoneNumber = it
                                onPhoneNumberChange(it)
                            },
                            placeholder = "Ingresa tu número de teléfono",
                            keyboardType = androidx.compose.ui.text.input.KeyboardType.Phone,
                            maxLength = 15,
                            imeAction = androidx.compose.ui.text.input.ImeAction.Done,
                            enabled = !isLoading
                        )
                    }
                }

                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(24.dp),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    PrimaryButton(
                        text = "Finalizar registro",
                        onClick = { onFinish(email, phoneNumber) },
                        enabled = isValid,
                        loading = isLoadingSignUp,
                        modifier = Modifier.fillMaxWidth()
                    )
                }
            }

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

/* ===== Previews ===== */
@Preview(
    showBackground = true,
    backgroundColor = 0xFFFFFFFF,
    uiMode = Configuration.UI_MODE_NIGHT_NO,
    name = "SignUpStep2 - Empty Light"
)
@Composable
private fun SignUpStep2ScreenPreview_Empty_Light() {
    AndroidTheme(darkTheme = false) {
        SignUpStep2Screen(
            step2State = GetSignUpStep2UseCaseState.Success(
                SignUpModelStep2("", "")
            ),
            signUpState = SignUpUseCaseState.Idle,
            onEmailChange = {},
            onPhoneNumberChange = {},
            onFinish = { _, _ -> }
        )
    }
}

@Preview(
    showBackground = true,
    backgroundColor = 0xFF000000,
    uiMode = Configuration.UI_MODE_NIGHT_YES,
    name = "SignUpStep2 - Error Dark"
)
@Composable
private fun SignUpStep2ScreenPreview_Error_Dark() {
    AndroidTheme(darkTheme = true) {
        SignUpStep2Screen(
            step2State = GetSignUpStep2UseCaseState.Success(
                SignUpModelStep2("juan@example.com", "987654321")
            ),
            signUpState = SignUpUseCaseState.Error("Error en el registro"),
            onEmailChange = {},
            onPhoneNumberChange = {},
            onFinish = { _, _ -> }
        )
    }
}

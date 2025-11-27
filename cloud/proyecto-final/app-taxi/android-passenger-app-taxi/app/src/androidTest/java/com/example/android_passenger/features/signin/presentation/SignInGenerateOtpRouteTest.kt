package com.example.android_passenger.features.signin.presentation

import androidx.activity.ComponentActivity
import androidx.compose.ui.test.junit4.createAndroidComposeRule
import androidx.compose.ui.test.onNodeWithText
import androidx.test.ext.junit.runners.AndroidJUnit4
import com.example.android_passenger.core.presentation.theme.AndroidTheme
import com.example.android_passenger.features.signin.domain.usecase.OtpGenerateState
import org.junit.Rule
import org.junit.Test
import org.junit.runner.RunWith

@RunWith(AndroidJUnit4::class)
class SignInGenerateOtpRouteTest {

    @get:Rule
    val composeRule = createAndroidComposeRule<ComponentActivity>()

    @Test
    fun `Cuando_el_estado_es_Error_se_muestra_el_mensaje_de_error`() {
        val errorMessage = "No pudimos generar el código. Intenta de nuevo."

        composeRule.setContent {
            AndroidTheme(darkTheme = false) {
                SignInGenerateOtpScreen(
                    phone = "987654321",
                    onPhoneChange = {},
                    isValid = true,
                    loading = false,
                    state = OtpGenerateState.Error(errorMessage),
                    onSubmit = {}
                )
            }
        }

        composeRule
            .onNodeWithText(errorMessage)
            .assertExists()
    }

}
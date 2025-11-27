package com.example.android_passenger.features.signin.presentation

import androidx.compose.ui.test.assertIsEnabled
import androidx.compose.ui.test.assertIsNotEnabled
import androidx.compose.ui.test.junit4.createComposeRule
import androidx.compose.ui.test.onNodeWithText
import androidx.test.ext.junit.runners.AndroidJUnit4
import com.example.android_passenger.core.presentation.theme.AndroidTheme
import com.example.android_passenger.features.signin.domain.usecase.OtpGenerateState
import org.junit.Rule
import org.junit.Test
import org.junit.runner.RunWith

@RunWith(AndroidJUnit4::class)
class SignInGenerateOtpScreenTest {

    @get:Rule
    val composeRule = createComposeRule()

    @Test
    fun `Boton_Ingresar_debe_estar_desactivado_cuando_el_telefono_es_invalido`() {
        composeRule.setContent {
            AndroidTheme (darkTheme = false) {
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

        composeRule
            .onNodeWithText("Ingresar")
            .assertIsNotEnabled()
    }

    @Test
    fun `Boton_Ingresar_debe_estar_habilitado_cuando_el_telefono_es_valido`() {
        composeRule.setContent {
            AndroidTheme(darkTheme = false) {
                SignInGenerateOtpScreen(
                    phone = "987654321",
                    onPhoneChange = {},
                    isValid = true,
                    loading = false,
                    state = OtpGenerateState.Idle,
                    onSubmit = {}
                )
            }
        }

        composeRule
            .onNodeWithText("Ingresar")
            .assertIsEnabled()
    }

    @Test
    fun `Cuando_el_estado_es_Error_se_muestra_el_toast_de_error`() {
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
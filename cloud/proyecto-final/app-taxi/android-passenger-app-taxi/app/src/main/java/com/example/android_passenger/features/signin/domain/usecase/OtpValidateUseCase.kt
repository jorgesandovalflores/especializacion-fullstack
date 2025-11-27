package com.example.android_passenger.features.signin.domain.usecase

import com.example.android_passenger.commons.domain.enum.PassengerStatusEnum
import com.example.android_passenger.core.domain.SessionStore
import com.example.android_passenger.features.signin.domain.repository.AuthRepository
import com.google.gson.Gson
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow

sealed interface OtpValidateState {
    data object Idle : OtpValidateState
    data object Loading : OtpValidateState
    data class Success(val showRegister: Boolean) : OtpValidateState
    data class Error(val message: String) : OtpValidateState
}

class OtpValidateUseCase(
    private val repo: AuthRepository,
    private val session: SessionStore
) {
    operator fun invoke(phoneReq: String, code: String, tokenFcm: String): Flow<OtpValidateState> = flow {
        val phone = "51$phoneReq"
        emit(OtpValidateState.Loading)

        try {
            val result = repo.otpValidate(phone = phone, code = code, tokenFcm = tokenFcm)
            session.saveTokensAndUser(
                access = result.tokens.accessToken,
                refresh = result.tokens.refreshToken,
                user = Gson().toJson(result.user)
            )
            if (result.user.status == PassengerStatusEnum.INACTIVE_REGISTER.value) {
                emit(OtpValidateState.Success(true))
            } else {
                emit(OtpValidateState.Success(false))
            }
        } catch (t: Throwable) {
            emit(OtpValidateState.Error(t.message ?: "No se pudo enviar el código"))
        }
    }

}
package com.example.android_passenger.features.signin.domain.usecase

import com.example.android_passenger.features.signin.domain.repository.AuthRepository
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow

sealed interface OtpGenerateState {
    data object Idle : OtpGenerateState
    data object Loading : OtpGenerateState
    data class Success(val phone: String, val expiresAt: String) : OtpGenerateState
    data class Error(val message: String) : OtpGenerateState
}

class OtpGenerateUseCase(
    private val repo: AuthRepository
) {
    operator fun invoke(phoneReq: String): Flow<OtpGenerateState> = flow {
        val phone = "51$phoneReq"
        emit(OtpGenerateState.Loading)

        try {
            val result = repo.otpGenerate(phone = phone)
            emit(OtpGenerateState.Success(phone = phoneReq, expiresAt = result.expiresAt))
        } catch (t: Throwable) {
            emit(OtpGenerateState.Error(t.message ?: "No se pudo enviar el código"))
        }
    }
}
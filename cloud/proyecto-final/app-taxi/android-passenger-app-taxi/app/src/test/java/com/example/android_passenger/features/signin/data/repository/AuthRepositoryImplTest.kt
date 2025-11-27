package com.example.android_passenger.features.signin.data.repository

import com.example.android_passenger.commons.domain.usecase.AuthResult
import com.example.android_passenger.features.signin.domain.repository.AuthRepository
import com.example.android_passenger.features.signin.domain.repository.OtpGenerateResult

class AuthRepositoryImplTest(
    private val shouldFail: Boolean = false
): AuthRepository {

    override suspend fun otpGenerate(phone: String): OtpGenerateResult {
        if (shouldFail) {
            throw RuntimeException("Error de red")
        }
        return OtpGenerateResult(
            expiresAt = "2025-12-31T23:59:59Z"
        )
    }

    override suspend fun otpValidate(phone: String, code: String, tokenFcm: String): AuthResult {
        throw NotImplementedError("No se usa en estos tests")
    }

}
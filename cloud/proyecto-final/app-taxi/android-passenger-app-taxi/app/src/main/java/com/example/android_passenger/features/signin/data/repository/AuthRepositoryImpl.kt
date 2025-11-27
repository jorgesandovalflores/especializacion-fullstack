package com.example.android_passenger.features.signin.data.repository

import com.example.android_passenger.commons.domain.usecase.AuthResult
import com.example.android_passenger.core.domain.ErrorMapper
import com.example.android_passenger.features.signin.data.remote.AuthApi
import com.example.android_passenger.features.signin.data.remote.dto.AuthOtpGenerateRequest
import com.example.android_passenger.features.signin.data.remote.dto.AuthOtpValidateRequest
import com.example.android_passenger.features.signin.data.remote.dto.toDomain
import com.example.android_passenger.features.signin.domain.repository.AuthRepository
import com.example.android_passenger.features.signin.domain.repository.OtpGenerateResult

class AuthRepositoryImpl(
    private val api: AuthApi
) : AuthRepository {


    override suspend fun otpGenerate(phone: String): OtpGenerateResult {
        return runCatching {
            api.otpGenerate(AuthOtpGenerateRequest(phone = phone)).toDomain()
        }.getOrElse { throw ErrorMapper.map(it) }
    }

    override suspend fun otpValidate(phone: String, code: String, tokenFcm: String): AuthResult {
        return runCatching {
            api.otpValidate(AuthOtpValidateRequest(phone = phone, code = code, tokenFcm = tokenFcm)).toDomain()
        }.getOrElse { throw ErrorMapper.map(it) }
    }
}
package com.example.android_passenger.features.signin.data.remote

import com.example.android_passenger.features.signin.data.remote.dto.AuthOtpGenerateRequest
import com.example.android_passenger.features.signin.data.remote.dto.AuthOtpGenerateResponse
import com.example.android_passenger.features.signin.data.remote.dto.AuthOtpValidateRequest
import com.example.android_passenger.features.signin.data.remote.dto.AuthOtpValidateResponse
import retrofit2.http.Body
import retrofit2.http.POST

interface AuthApi {
    @POST("auth/otp-generate")
    suspend fun otpGenerate(@Body body: AuthOtpGenerateRequest): AuthOtpGenerateResponse

    @POST("auth/otp-validate")
    suspend fun otpValidate(@Body body: AuthOtpValidateRequest): AuthOtpValidateResponse
}
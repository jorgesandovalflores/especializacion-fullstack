package com.example.android_passenger.core.data

import com.example.android_passenger.core.data.dto.RefreshDto
import com.example.android_passenger.features.signin.data.remote.dto.AuthOtpValidateResponse
import retrofit2.http.Body
import retrofit2.http.POST

interface RefreshApi {
    @POST("auth/refresh")
    suspend fun refresh(@Body body: RefreshDto): AuthOtpValidateResponse
}
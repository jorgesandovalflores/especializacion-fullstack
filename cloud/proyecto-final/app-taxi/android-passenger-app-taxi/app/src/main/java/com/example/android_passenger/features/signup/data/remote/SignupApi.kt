package com.example.android_passenger.features.signup.data.remote

import com.example.android_passenger.features.signup.data.remote.dto.SignUpRequest
import com.example.android_passenger.features.signup.data.remote.dto.SignUpResponse
import retrofit2.http.Body
import retrofit2.http.PUT

interface SignupApi {
    @PUT("passenger/signup")
    suspend fun signUp(
        @Body body: SignUpRequest
    ): SignUpResponse
}
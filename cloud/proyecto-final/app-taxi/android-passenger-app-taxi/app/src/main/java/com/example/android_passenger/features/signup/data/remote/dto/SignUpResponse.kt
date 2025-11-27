package com.example.android_passenger.features.signup.data.remote.dto

import com.example.android_passenger.commons.data.local.dto.PassengerDto
import com.example.android_passenger.commons.data.local.dto.toDomain
import com.example.android_passenger.commons.domain.usecase.AuthResult
import com.example.android_passenger.features.signin.domain.model.SessionTokens

data class SignUpResponse(
    val accessToken: String,
    val refreshToken: String,
    val user: PassengerDto
)

fun SignUpResponse.toDomain(): AuthResult = AuthResult(
    tokens = SessionTokens(
        accessToken = this.accessToken,
        refreshToken = this.refreshToken
    ),
    user = user.toDomain()
)
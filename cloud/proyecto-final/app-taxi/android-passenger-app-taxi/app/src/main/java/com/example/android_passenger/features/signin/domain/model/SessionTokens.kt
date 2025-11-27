package com.example.android_passenger.features.signin.domain.model

data class SessionTokens(
    val accessToken: String,
    val refreshToken: String
)
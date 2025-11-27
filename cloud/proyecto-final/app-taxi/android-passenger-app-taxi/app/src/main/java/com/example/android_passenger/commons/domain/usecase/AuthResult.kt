package com.example.android_passenger.commons.domain.usecase

import com.example.android_passenger.commons.domain.model.Passenger
import com.example.android_passenger.features.signin.domain.model.SessionTokens

data class AuthResult(
    val tokens: SessionTokens,
    val user: Passenger
)

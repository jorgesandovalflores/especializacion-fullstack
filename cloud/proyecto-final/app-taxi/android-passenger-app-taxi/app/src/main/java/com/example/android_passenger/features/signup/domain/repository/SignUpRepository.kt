package com.example.android_passenger.features.signup.domain.repository

import com.example.android_passenger.commons.domain.usecase.AuthResult

interface SignUpRepository {
    suspend fun signUpRemote(givenName: String, familyName: String, photoUrl: String, email: String): AuthResult
}
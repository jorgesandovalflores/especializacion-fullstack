package com.example.android_passenger.features.signup.data.remote.dto

data class SignUpRequest(
    val givenName: String,
    val familyName: String,
    val email: String,
    val photoUrl: String,
)
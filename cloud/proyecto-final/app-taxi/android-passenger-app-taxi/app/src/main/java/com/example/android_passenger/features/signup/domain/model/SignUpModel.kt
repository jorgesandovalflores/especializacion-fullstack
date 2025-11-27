package com.example.android_passenger.features.signup.domain.model

data class SignUpModelStep1(
    val givenName: String,
    val familyName: String,
    val photoUrl: String,
)

data class SignUpModelStep2(
    val email: String,
    var phoneNumber: String,
)
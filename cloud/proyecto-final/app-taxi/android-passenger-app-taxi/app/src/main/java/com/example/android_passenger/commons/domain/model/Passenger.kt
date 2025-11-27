package com.example.android_passenger.commons.domain.model

data class Passenger(
    val id: String,
    val phoneNumber: String,
    val givenName: String?,
    val familyName: String?,
    val email: String?,
    val photoUrl: String?,
    val status: String
)
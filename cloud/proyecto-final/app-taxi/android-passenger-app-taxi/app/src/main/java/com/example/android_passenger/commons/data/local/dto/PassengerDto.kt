package com.example.android_passenger.commons.data.local.dto

import com.example.android_passenger.commons.domain.model.Passenger

data class PassengerDto(
    val id: String,
    val phoneNumber: String,
    val givenName: String?,
    val familyName: String?,
    val email: String?,
    val photoUrl: String?,
    val status: String
)

fun PassengerDto.toDomain(): Passenger = Passenger(
    id = id,
    phoneNumber = phoneNumber,
    givenName = givenName,
    familyName = familyName,
    email = email,
    photoUrl = photoUrl,
    status = status
)
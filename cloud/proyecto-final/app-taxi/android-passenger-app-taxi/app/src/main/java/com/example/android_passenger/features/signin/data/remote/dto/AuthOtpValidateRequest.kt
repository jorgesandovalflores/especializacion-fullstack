package com.example.android_passenger.features.signin.data.remote.dto

data class AuthOtpValidateRequest(
    val phone: String,
    val code: String,
    val tokenFcm: String
)
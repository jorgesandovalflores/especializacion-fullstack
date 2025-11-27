package com.example.android_passenger.features.home.domain.model

data class AlertHome(
    val title: String,
    val body: String
) {
    val isValid: Boolean
        get() = title.isNotEmpty() && body.isNotEmpty()
}
package com.example.android_passenger.features.menu.domain.model

data class Menu(
    val key: String,
    val text: String,
    val iconUrl: String,
    val deeplink: String,
    val order: Int
)
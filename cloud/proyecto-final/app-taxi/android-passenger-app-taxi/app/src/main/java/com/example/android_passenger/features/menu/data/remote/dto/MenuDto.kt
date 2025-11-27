package com.example.android_passenger.features.menu.data.remote.dto

import com.example.android_passenger.features.menu.domain.model.Menu

data class MenuDto (
    val key: String,
    val text: String,
    val iconUrl: String,
    val deeplink: String,
    val order: Int
)

fun MenuDto.toDomain(): Menu = Menu(
    key = this.key,
    text = this.text,
    iconUrl = this.iconUrl,
    deeplink = this.deeplink,
    order = this.order
)

fun List<MenuDto>.toDomainList(): List<Menu> = map { it.toDomain() }

package com.example.android_passenger.features.menu.data.remote

import com.example.android_passenger.features.menu.data.remote.dto.MenuDto
import retrofit2.http.GET

interface MenuApi {
    @GET("menu/active/PASSENGER")
    suspend fun getMenu(): List<MenuDto>
}
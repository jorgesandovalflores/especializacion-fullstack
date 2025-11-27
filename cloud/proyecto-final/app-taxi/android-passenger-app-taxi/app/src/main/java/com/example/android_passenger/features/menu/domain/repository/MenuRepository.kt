package com.example.android_passenger.features.menu.domain.repository

import com.example.android_passenger.features.menu.domain.model.Menu

interface MenuRepository {
    suspend fun getMenuRemote(): List<Menu>
    suspend fun getMenuLocal(): List<Menu>
    suspend fun saveMenuLocal(values: List<Menu>)
}
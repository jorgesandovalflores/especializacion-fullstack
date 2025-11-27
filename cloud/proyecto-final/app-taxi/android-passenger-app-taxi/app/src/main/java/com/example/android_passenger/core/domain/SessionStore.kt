package com.example.android_passenger.core.domain

import kotlinx.coroutines.flow.Flow

interface SessionStore {
    suspend fun saveTokensAndUser(access: String, refresh: String, user: String)
    fun accessToken(): Flow<String?>
    fun refreshToken(): Flow<String?>
    fun getUser(): Flow<String?>
    suspend fun clear()
}
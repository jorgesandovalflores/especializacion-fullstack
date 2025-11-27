package com.example.android_passenger.core.data

import android.content.SharedPreferences
import com.example.android_passenger.core.domain.SessionStore
import kotlinx.coroutines.flow.Flow

class SessionStoreImpl(
    private val prefs: SharedPreferences
) : SessionStore {

    private companion object {
        private const val KEY_ACCESS = "access_token"
        private const val KEY_REFRESH = "refresh_token"
        private const val KEY_USER = "user"
    }

    override suspend fun saveTokensAndUser(access: String, refresh: String, user: String) {
        prefs.edit()
            .putString(KEY_ACCESS, access)
            .putString(KEY_REFRESH, refresh)
            .putString(KEY_USER, user)
            .apply()
    }

    override fun accessToken(): Flow<String?> = prefs.asStringFlow(KEY_ACCESS)
    override fun refreshToken(): Flow<String?> = prefs.asStringFlow(KEY_REFRESH)
    override fun getUser(): Flow<String?> = prefs.asStringFlow(KEY_USER)

    override suspend fun clear() {
        prefs.edit().clear().apply()
    }
}

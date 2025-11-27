package com.example.android_passenger.features.signup.data.local

import android.content.SharedPreferences
import com.example.android_passenger.features.signup.domain.model.SignUpModelStep1
import com.example.android_passenger.features.signup.domain.model.SignUpModelStep2
import com.example.android_passenger.features.signup.domain.store.SignUpStore
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flowOf

class SignUpStoreImpl(
    private val prefs: SharedPreferences
): SignUpStore {

    private companion object {
        private const val KEY_GIVEN_NAME = "given_name"
        private const val KEY_FAMILY_NAME = "family_name"
        private const val KEY_PHOTO_URL = "photo_url"
        private const val KEY_PHONE_NUMBER = "phone_number"
        private const val KEY_EMAIL = "email"
    }

    override suspend fun saveStep1(
        givenName: String,
        familyName: String,
        photoUrl: String
    ) {
        prefs.edit()
            .putString(KEY_GIVEN_NAME, givenName)
            .putString(KEY_FAMILY_NAME, familyName)
            .putString(KEY_PHOTO_URL, photoUrl)
            .apply()
    }

    override suspend fun saveStep2(email: String, phoneNumber: String) {
        prefs.edit()
            .putString(KEY_EMAIL, email)
            .putString(KEY_PHONE_NUMBER, phoneNumber)
            .apply()
    }

    override fun getStep1(): Flow<SignUpModelStep1> = flowOf(
        SignUpModelStep1(
            givenName = prefs.getString(KEY_GIVEN_NAME, "") ?: "",
            familyName = prefs.getString(KEY_FAMILY_NAME, "") ?: "",
            photoUrl = prefs.getString(KEY_PHOTO_URL, "") ?: ""
        )
    )

    override fun getStep2(): Flow<SignUpModelStep2> = flowOf(
        SignUpModelStep2(
            email = prefs.getString(KEY_EMAIL, "") ?: "",
            phoneNumber = prefs.getString(KEY_PHONE_NUMBER, "") ?: ""
        )
    )

    override suspend fun clear() {
        prefs.edit().clear().apply()
    }
}
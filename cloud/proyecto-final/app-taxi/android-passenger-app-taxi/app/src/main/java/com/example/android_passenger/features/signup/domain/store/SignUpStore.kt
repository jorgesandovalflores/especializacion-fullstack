package com.example.android_passenger.features.signup.domain.store

import com.example.android_passenger.features.signup.domain.model.SignUpModelStep1
import com.example.android_passenger.features.signup.domain.model.SignUpModelStep2
import kotlinx.coroutines.flow.Flow

interface SignUpStore {
    suspend fun saveStep1(givenName: String, familyName: String, photoUrl: String)
    suspend fun saveStep2(email: String, phoneNumber: String)
    fun getStep1(): Flow<SignUpModelStep1>
    fun getStep2(): Flow<SignUpModelStep2>
    suspend fun clear()
}
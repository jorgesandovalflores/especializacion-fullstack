package com.example.android_passenger.commons.domain.repository

import com.example.android_passenger.features.signin.domain.model.AddressSearchPagination

interface AddressRepository {
    suspend fun searchAddress(phone: String): AddressSearchPagination
}
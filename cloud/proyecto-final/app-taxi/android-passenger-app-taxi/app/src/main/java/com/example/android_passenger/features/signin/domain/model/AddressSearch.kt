package com.example.android_passenger.features.signin.domain.model

data class AddressSearchPagination(
    val success: Boolean,
    val provider: String,
    val count: Int,
    val results: List<AddressSearch>
)

data class AddressSearch(
    val source: String,
    val address: String,
    val displayName: String,
    val placeId: String,
    val coordinates: AddressSearchCoordinates,
    val needsDetailLookup: Boolean
)

data class AddressSearchCoordinates (
    val lat: Double,
    val lng: Double
)
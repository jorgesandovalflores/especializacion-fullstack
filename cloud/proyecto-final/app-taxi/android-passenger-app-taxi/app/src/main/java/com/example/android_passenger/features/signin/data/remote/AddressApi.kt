package com.example.android_passenger.features.signin.data.remote

import com.example.android_passenger.features.signin.domain.model.AddressSearchPagination
import retrofit2.http.GET
import retrofit2.http.Query

interface AddressApi {

    @GET("address/search")
    suspend fun otpGenerate(
        @Query("query") query: String,
        @Query("limit") limit: Int
    ): AddressSearchPagination

}
package com.example.android_passenger.core.data

import kotlinx.serialization.json.Json
import okhttp3.ResponseBody

object RetrofitErrorParser {
    private val json = Json {
        ignoreUnknownKeys = true
        isLenient = true
        explicitNulls = false
    }

    fun parse(body: ResponseBody?): ApiError? {
        return runCatching {
            val raw = body?.string()?.takeIf { it.isNotBlank() } ?: return null
            json.decodeFromString(ApiError.serializer(), raw)
        }.getOrNull()
    }
}
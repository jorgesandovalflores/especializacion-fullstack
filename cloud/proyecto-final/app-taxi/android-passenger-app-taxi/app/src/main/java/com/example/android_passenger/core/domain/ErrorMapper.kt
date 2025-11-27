package com.example.android_passenger.core.domain

import com.example.android_passenger.core.data.RetrofitErrorParser
import retrofit2.HttpException
import java.io.IOException
import java.net.SocketTimeoutException

object ErrorMapper {

    private const val GENERIC_CLIENT = "Request error"
    private const val GENERIC_SERVER = "Server error"
    private const val GENERIC_NETWORK = "Connection error"
    private const val GENERIC_UNKNOWN = "Unexpected error"

    fun map(t: Throwable): DomainException {
        return when (t) {
            is HttpException -> mapHttp(t)
            is SocketTimeoutException -> DomainException.NetworkException("Connection timeout", causeThrowable = t)
            is IOException -> DomainException.NetworkException(GENERIC_NETWORK, causeThrowable = t)
            else -> DomainException.UnknownException(GENERIC_UNKNOWN, causeThrowable = t)
        }
    }

    private fun mapHttp(e: HttpException): DomainException {
        val code = e.code()
        val apiError = RetrofitErrorParser.parse(e.response()?.errorBody())
        val message = apiError?.message?.takeIf { it.isNotBlank() }
            ?: e.message()
            ?: when (code) {
                in 500..599 -> GENERIC_SERVER
                in 400..499 -> GENERIC_CLIENT
                else -> GENERIC_UNKNOWN
            }

        return when (code) {
            422 -> DomainException.ValidationException(message, code, e)
            in 400..499 -> DomainException.ClientException(message, code, e)
            in 500..599 -> DomainException.ServerException(message, code, e)
            else -> DomainException.UnknownException(message, code, e)
        }
    }
}
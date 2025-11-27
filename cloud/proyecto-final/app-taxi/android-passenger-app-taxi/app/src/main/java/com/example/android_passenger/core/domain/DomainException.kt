package com.example.android_passenger.core.domain

sealed class DomainException(
    override val message: String,
    open val code: Int? = null,
    open val causeThrowable: Throwable? = null
) : RuntimeException(message, causeThrowable) {

    data class ValidationException(
        override val message: String,
        override val code: Int? = 422,
        override val causeThrowable: Throwable? = null
    ) : DomainException(message, code, causeThrowable)

    data class ClientException(
        override val message: String,
        override val code: Int? = null,
        override val causeThrowable: Throwable? = null
    ) : DomainException(message, code, causeThrowable)

    data class ServerException(
        override val message: String,
        override val code: Int? = null,
        override val causeThrowable: Throwable? = null
    ) : DomainException(message, code, causeThrowable)

    data class NetworkException(
        override val message: String,
        override val code: Int? = null,
        override val causeThrowable: Throwable? = null
    ) : DomainException(message, code, causeThrowable)

    data class UnknownException(
        override val message: String = "Unexpected error",
        override val code: Int? = null,
        override val causeThrowable: Throwable? = null
    ) : DomainException(message, code, causeThrowable)
}
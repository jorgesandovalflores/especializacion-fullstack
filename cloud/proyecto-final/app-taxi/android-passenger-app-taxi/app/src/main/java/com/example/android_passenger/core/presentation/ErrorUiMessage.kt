package com.example.android_passenger.core.presentation

import com.example.android_passenger.core.domain.DomainException

fun Throwable.toReadableMessage(): String {
    return when (this) {
        is DomainException -> this.message
        else -> this.message ?: "Unexpected error"
    }
}
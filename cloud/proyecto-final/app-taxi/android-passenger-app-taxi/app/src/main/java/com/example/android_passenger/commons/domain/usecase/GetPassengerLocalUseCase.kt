package com.example.android_passenger.commons.domain.usecase

import com.example.android_passenger.commons.domain.model.Passenger
import com.example.android_passenger.core.domain.SessionStore
import com.google.gson.Gson
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.flow

sealed interface GetPassengerLocalState {
    data object Idle : GetPassengerLocalState
    data object Loading : GetPassengerLocalState
    data class Success(val value: Passenger) : GetPassengerLocalState
    data class Error(val message: String) : GetPassengerLocalState
}

class GetPassengerLocalUseCase(
    private val session: SessionStore
) {
    operator fun invoke(): Flow<GetPassengerLocalState> = flow {
        emit(GetPassengerLocalState.Loading)
        try {
            val userJson = session.getUser().first()
            userJson?.let { it
                emit(GetPassengerLocalState.Success(Gson().fromJson(it, Passenger::class.java)))
            }
        } catch (t: Throwable) {
            emit(GetPassengerLocalState.Error(t.message ?: "Error al recuperar usuario"))
        }
    }
}
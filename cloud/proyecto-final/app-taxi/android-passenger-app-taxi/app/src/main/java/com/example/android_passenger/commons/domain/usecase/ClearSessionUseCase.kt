package com.example.android_passenger.commons.domain.usecase

import com.example.android_passenger.core.domain.SessionStore
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow

sealed interface ClearSessionState {
    data object Idle : ClearSessionState
    data object Success : ClearSessionState
    data class Error(val message: String) : ClearSessionState
}

class ClearSessionUseCase(
    private val session: SessionStore
) {
    operator fun invoke(): Flow<ClearSessionState> = flow {
        try {
            session.clear()
            emit(ClearSessionState.Success)
        } catch (t: Throwable) {
            emit(ClearSessionState.Error(t.message ?: "Error al limpiar store"))
        }
    }
}
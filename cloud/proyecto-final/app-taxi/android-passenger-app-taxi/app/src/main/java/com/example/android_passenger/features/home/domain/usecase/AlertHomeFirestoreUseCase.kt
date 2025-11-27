package com.example.android_passenger.features.home.domain.usecase

import com.example.android_passenger.features.home.domain.model.AlertHome
import com.example.android_passenger.features.home.domain.repository.FirebaseFirestoreRepository
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow
import javax.inject.Inject

sealed interface AlertHomeFirestoreUseCaseState {
    data object Idle : AlertHomeFirestoreUseCaseState
    data object Loading : AlertHomeFirestoreUseCaseState
    data class Success(val alertHome: AlertHome?) : AlertHomeFirestoreUseCaseState
    data class Error(val message: String) : AlertHomeFirestoreUseCaseState
}

class AlertHomeFirestoreUseCase @Inject constructor(
    private val firebaseFirestoreRepository: FirebaseFirestoreRepository
) {
    operator fun invoke(): Flow<AlertHomeFirestoreUseCaseState> = flow {
        emit(AlertHomeFirestoreUseCaseState.Loading)
        try {
            firebaseFirestoreRepository.getAlertHome().collect { alertHome ->
                emit(AlertHomeFirestoreUseCaseState.Success(alertHome))
            }
        } catch (e: Exception) {
            emit(AlertHomeFirestoreUseCaseState.Error("Error al obtener alerta: ${e.message}"))
        }
    }
}
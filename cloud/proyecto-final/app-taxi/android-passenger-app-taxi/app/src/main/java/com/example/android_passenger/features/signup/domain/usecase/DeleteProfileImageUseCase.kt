package com.example.android_passenger.features.signup.domain.usecase

import com.example.android_passenger.features.signup.domain.repository.FirebaseStorageRepository
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow
import javax.inject.Inject

sealed interface DeleteProfileImageUseCaseState {
    data object Idle : DeleteProfileImageUseCaseState
    data object Loading : DeleteProfileImageUseCaseState
    data object Success : DeleteProfileImageUseCaseState
    data class Error(val message: String) : DeleteProfileImageUseCaseState
}

class DeleteProfileImageUseCase @Inject constructor(
    private val firebaseStorageRepository: FirebaseStorageRepository
) {
    operator fun invoke(imageUrl: String): Flow<DeleteProfileImageUseCaseState> = flow {
        emit(DeleteProfileImageUseCaseState.Loading)
        try {
            firebaseStorageRepository.deleteProfileImage(imageUrl)
            emit(DeleteProfileImageUseCaseState.Success)
        } catch (e: Exception) {
            emit(DeleteProfileImageUseCaseState.Error("Error al eliminar la imagen: ${e.message}"))
        }
    }
}
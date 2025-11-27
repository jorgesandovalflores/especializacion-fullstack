package com.example.android_passenger.features.signup.domain.usecase

import android.net.Uri
import com.example.android_passenger.features.signup.domain.repository.FirebaseStorageRepository
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow
import javax.inject.Inject

sealed interface UploadProfileImageUseCaseState {
    data object Idle : UploadProfileImageUseCaseState
    data object Loading : UploadProfileImageUseCaseState
    data class Success(val downloadUrl: String) : UploadProfileImageUseCaseState
    data class Error(val message: String) : UploadProfileImageUseCaseState
}

class UploadProfileImageUseCase @Inject constructor(
    private val firebaseStorageRepository: FirebaseStorageRepository
) {
    operator fun invoke(userId: String, imageUri: Uri): Flow<UploadProfileImageUseCaseState> = flow {
        emit(UploadProfileImageUseCaseState.Loading)
        try {
            val downloadUrl = firebaseStorageRepository.uploadProfileImage(userId, imageUri)
            emit(UploadProfileImageUseCaseState.Success(downloadUrl))
        } catch (e: Exception) {
            emit(UploadProfileImageUseCaseState.Error("Error al subir la imagen: ${e.message}"))
        }
    }
}
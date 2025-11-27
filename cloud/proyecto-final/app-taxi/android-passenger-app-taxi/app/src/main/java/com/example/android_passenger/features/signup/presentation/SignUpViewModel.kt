package com.example.android_passenger.features.signup.presentation

import android.net.Uri
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.android_passenger.core.domain.ErrorMapper
import com.example.android_passenger.core.presentation.toReadableMessage
import com.example.android_passenger.features.signup.domain.model.SignUpModelStep1
import com.example.android_passenger.features.signup.domain.model.SignUpModelStep2
import com.example.android_passenger.features.signup.domain.usecase.DeleteProfileImageUseCase
import com.example.android_passenger.features.signup.domain.usecase.DeleteProfileImageUseCaseState
import com.example.android_passenger.features.signup.domain.usecase.GetSignUpStep1UseCase
import com.example.android_passenger.features.signup.domain.usecase.GetSignUpStep1UseCaseState
import com.example.android_passenger.features.signup.domain.usecase.GetSignUpStep2UseCase
import com.example.android_passenger.features.signup.domain.usecase.GetSignUpStep2UseCaseState
import com.example.android_passenger.features.signup.domain.usecase.SaveSignUpStep1UseCase
import com.example.android_passenger.features.signup.domain.usecase.SignUpUseCase
import com.example.android_passenger.features.signup.domain.usecase.SignUpUseCaseState
import com.example.android_passenger.features.signup.domain.usecase.UploadProfileImageUseCase
import com.example.android_passenger.features.signup.domain.usecase.UploadProfileImageUseCaseState
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class SignUpViewModel @Inject constructor(
    private val getSignUpStep1UseCase: GetSignUpStep1UseCase,
    private val saveSignUpStep1UseCase: SaveSignUpStep1UseCase,
    private val getSignupStep2UseCase: GetSignUpStep2UseCase,
    private val signUpUseCase: SignUpUseCase,
    private val uploadProfileImageUseCase: UploadProfileImageUseCase,
    private val deleteProfileImageUseCase: DeleteProfileImageUseCase
) : ViewModel() {

    private val _getStep1 = MutableStateFlow<GetSignUpStep1UseCaseState>(GetSignUpStep1UseCaseState.Idle)
    val getStep1: StateFlow<GetSignUpStep1UseCaseState> = _getStep1

    private val _uploadImage = MutableStateFlow<UploadProfileImageUseCaseState>(UploadProfileImageUseCaseState.Idle)
    val uploadImage: StateFlow<UploadProfileImageUseCaseState> = _uploadImage

    private val _deleteImage = MutableStateFlow<DeleteProfileImageUseCaseState>(DeleteProfileImageUseCaseState.Idle)
    val deleteImage: StateFlow<DeleteProfileImageUseCaseState> = _deleteImage
    private val _currentPhotoUrl = MutableStateFlow<String?>(null)
    val currentPhotoUrl: StateFlow<String?> = _currentPhotoUrl

    fun callGetStep1() {
        viewModelScope.launch {
            _getStep1.value = GetSignUpStep1UseCaseState.Loading
            try {
                getSignUpStep1UseCase().collect { state ->
                    _getStep1.value = state
                    if (state is GetSignUpStep1UseCaseState.Success) {
                        _currentPhotoUrl.value = state.data.photoUrl
                    }
                }
            } catch (_: Throwable) { }
        }
    }

    fun callSaveStep1(value: SignUpModelStep1) {
        viewModelScope.launch {
            try {
                val updatedValue = value.copy(photoUrl = _currentPhotoUrl.value ?: "")
                saveSignUpStep1UseCase(updatedValue).collect {}
            } catch (_: Throwable) { }
        }
    }

    fun uploadProfileImage(imageUri: Uri) {
        viewModelScope.launch {
            val userId = "temp_${System.currentTimeMillis()}"
            uploadProfileImageUseCase(userId, imageUri).collect { state ->
                _uploadImage.value = state
                when (state) {
                    is UploadProfileImageUseCaseState.Success -> {
                        _currentPhotoUrl.value = state.downloadUrl
                    }
                    else -> {}
                }
            }
        }
    }

    fun deleteProfileImage(imageUrl: String) {
        viewModelScope.launch {
            deleteProfileImageUseCase(imageUrl).collect { state ->
                _deleteImage.value = state
                when (state) {
                    is DeleteProfileImageUseCaseState.Success -> {
                        _currentPhotoUrl.value = null
                    }
                    else -> {}
                }
            }
        }
    }

    fun clearImageUploadState() {
        _uploadImage.value = UploadProfileImageUseCaseState.Idle
    }

    private val _getStep2 = MutableStateFlow<GetSignUpStep2UseCaseState>(GetSignUpStep2UseCaseState.Idle)
    val getStep2: StateFlow<GetSignUpStep2UseCaseState> = _getStep2
    fun callGetStep2() {
        viewModelScope.launch {
            _getStep2.value = GetSignUpStep2UseCaseState.Loading
            try {
                getSignupStep2UseCase().collect {
                    _getStep2.value = it
                }
            } catch (_: Throwable) { }
        }
    }

    private val _signUp = MutableStateFlow<SignUpUseCaseState>(SignUpUseCaseState.Idle)
    val signUp: StateFlow<SignUpUseCaseState> = _signUp
    fun callSignUp(step1: SignUpModelStep1, step2: SignUpModelStep2) {
        viewModelScope.launch {
            _signUp.value = SignUpUseCaseState.Loading
            try {
                val updatedStep1 = step1.copy(photoUrl = _currentPhotoUrl.value ?: "")
                signUpUseCase(signUpStep1 = updatedStep1, signUpStep2 = step2).collect {
                    _signUp.value = it
                }
            } catch (t: Throwable) {
                val mapped = ErrorMapper.map(t)
                _signUp.value = SignUpUseCaseState.Error(message = mapped.toReadableMessage())
            }
        }
    }
}
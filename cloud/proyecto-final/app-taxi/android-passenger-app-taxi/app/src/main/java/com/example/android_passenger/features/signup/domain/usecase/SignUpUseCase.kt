package com.example.android_passenger.features.signup.domain.usecase

import com.example.android_passenger.core.domain.SessionStore
import com.example.android_passenger.features.signup.domain.model.SignUpModelStep1
import com.example.android_passenger.features.signup.domain.model.SignUpModelStep2
import com.example.android_passenger.features.signup.domain.repository.SignUpRepository
import com.example.android_passenger.features.signup.domain.store.SignUpStore
import com.google.gson.Gson
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow

sealed interface SignUpUseCaseState {
    data object Idle : SignUpUseCaseState
    data object Loading : SignUpUseCaseState
    data object Success : SignUpUseCaseState
    data class Error(val message: String) : SignUpUseCaseState
}

class SignUpUseCase(
    private val repo: SignUpRepository,
    private val storeSignIn: SignUpStore,
    private val storeSession: SessionStore
) {
    operator fun invoke(signUpStep1: SignUpModelStep1, signUpStep2: SignUpModelStep2): Flow<SignUpUseCaseState> = flow {
        storeSignIn.saveStep2(email = signUpStep2.email, phoneNumber = signUpStep2.phoneNumber)

        try {
            emit(SignUpUseCaseState.Loading)
            val result = repo.signUpRemote(
                givenName = signUpStep1.givenName,
                familyName = signUpStep1.familyName,
                photoUrl = signUpStep1.photoUrl,
                email = signUpStep2.email
            )
            storeSession.saveTokensAndUser(
                access = result.tokens.accessToken,
                refresh = result.tokens.refreshToken,
                user = Gson().toJson(result.user)
            )
            emit(SignUpUseCaseState.Success)
        } catch (t: Throwable) {
            emit(SignUpUseCaseState.Error(t.message ?: "No se pudo actualizar la información"))
        }
    }
}
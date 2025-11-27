package com.example.android_passenger.features.signup.domain.usecase

import android.util.Log
import com.example.android_passenger.commons.domain.model.Passenger
import com.example.android_passenger.core.domain.SessionStore
import com.example.android_passenger.features.signup.domain.model.SignUpModelStep2
import com.example.android_passenger.features.signup.domain.store.SignUpStore
import com.google.gson.Gson
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.flow

sealed interface GetSignUpStep2UseCaseState {
    data object Idle : GetSignUpStep2UseCaseState
    data object Loading : GetSignUpStep2UseCaseState
    data class Success(val data: SignUpModelStep2) : GetSignUpStep2UseCaseState
}

class GetSignUpStep2UseCase(
    private val storeSignIn: SignUpStore,
    private val storeSession: SessionStore
) {
    operator fun invoke(): Flow<GetSignUpStep2UseCaseState> = flow {
        emit(GetSignUpStep2UseCaseState.Loading)
        val result = storeSignIn.getStep2().first()
        if (result.phoneNumber.isNullOrEmpty()) {
            storeSession.getUser().first()?.let {
                val user = Gson().fromJson(it, Passenger::class.java)
                result.phoneNumber = user.phoneNumber
            }
        }
        Log.d("GetSignUpStep2UseCase", Gson().toJson(result))
        emit(GetSignUpStep2UseCaseState.Success(result))
    }
}
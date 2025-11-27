package com.example.android_passenger.features.signup.domain.usecase

import android.util.Log
import com.example.android_passenger.features.signup.domain.model.SignUpModelStep1
import com.example.android_passenger.features.signup.domain.store.SignUpStore
import com.google.gson.Gson
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.flow

sealed interface GetSignUpStep1UseCaseState {
    data object Idle : GetSignUpStep1UseCaseState
    data object Loading : GetSignUpStep1UseCaseState
    data class Success(val data: SignUpModelStep1) : GetSignUpStep1UseCaseState
}

class GetSignUpStep1UseCase(
    private val storeSignIn: SignUpStore,
) {
    operator fun invoke(): Flow<GetSignUpStep1UseCaseState> = flow {
        emit(GetSignUpStep1UseCaseState.Loading)
        val result = storeSignIn.getStep1().first()
        Log.d("GetSignUpStep1UseCase", Gson().toJson(result))
        emit(GetSignUpStep1UseCaseState.Success(result))
    }
}
package com.example.android_passenger.features.signup.domain.usecase

import com.example.android_passenger.features.signup.domain.model.SignUpModelStep1
import com.example.android_passenger.features.signup.domain.store.SignUpStore
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow

class SaveSignUpStep1UseCase(
    private val storeSignIn: SignUpStore,
) {
    operator fun invoke(step1: SignUpModelStep1): Flow<Unit> = flow {
        storeSignIn.saveStep1(givenName = step1.givenName, familyName = step1.familyName, photoUrl = step1.photoUrl)
    }
}
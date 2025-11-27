package com.example.android_passenger.features.signup.data.repository

import com.example.android_passenger.commons.domain.usecase.AuthResult
import com.example.android_passenger.core.domain.ErrorMapper
import com.example.android_passenger.features.signup.data.remote.SignupApi
import com.example.android_passenger.features.signup.data.remote.dto.SignUpRequest
import com.example.android_passenger.features.signup.data.remote.dto.toDomain
import com.example.android_passenger.features.signup.domain.repository.SignUpRepository

class SignUpRepositoryImpl(
    private val api: SignupApi
): SignUpRepository {

    override suspend fun signUpRemote(givenName: String, familyName: String, photoUrl: String, email: String): AuthResult {
        return runCatching {
            api.signUp(
                SignUpRequest(
                    givenName = givenName,
                    familyName = familyName,
                    photoUrl = photoUrl,
                    email = email
                )
            ).toDomain()
        }.getOrElse { throw ErrorMapper.map(it) }
    }

}
package com.example.android_passenger.features.signin

import com.example.android_passenger.core.domain.SessionStore
import com.example.android_passenger.features.signin.data.remote.AuthApi
import com.example.android_passenger.features.signin.data.repository.AuthRepositoryImpl
import com.example.android_passenger.features.signin.domain.repository.AuthRepository
import com.example.android_passenger.features.signin.domain.usecase.OtpGenerateUseCase
import com.example.android_passenger.features.signin.domain.usecase.OtpValidateUseCase
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import retrofit2.Retrofit
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
object SignInModule {

    @Provides
    @Singleton
    fun provideAuthApi(retrofit: Retrofit): AuthApi =
        retrofit.create(AuthApi::class.java)

    @Provides
    @Singleton
    fun provideAuthRepository(api: AuthApi): AuthRepository =
        AuthRepositoryImpl(api)

    @Provides
    @Singleton
    fun provideOtpGenerateUseCase(
        repo: AuthRepository,
    ): OtpGenerateUseCase = OtpGenerateUseCase(repo)

    @Provides
    @Singleton
    fun provideOtpValidateUseCase(
        repo: AuthRepository,
        sessionStore: SessionStore
    ): OtpValidateUseCase = OtpValidateUseCase(repo, sessionStore)
}
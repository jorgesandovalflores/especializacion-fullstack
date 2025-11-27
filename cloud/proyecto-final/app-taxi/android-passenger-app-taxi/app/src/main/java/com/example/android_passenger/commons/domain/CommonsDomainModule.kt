package com.example.android_passenger.commons.domain

import com.example.android_passenger.commons.domain.usecase.ClearSessionUseCase
import com.example.android_passenger.commons.domain.usecase.GetPassengerLocalUseCase
import com.example.android_passenger.core.domain.SessionStore
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
object CommonsDomainModule {

    @Provides
    @Singleton
    fun provideOtpGenerateUseCase(
        sessionStore: SessionStore
    ): GetPassengerLocalUseCase = GetPassengerLocalUseCase(sessionStore)

    @Provides
    @Singleton
    fun provideClearSessionUseCase(
        sessionStore: SessionStore
    ): ClearSessionUseCase = ClearSessionUseCase(sessionStore)

}
package com.example.android_passenger.core.data

import com.example.android_passenger.core.domain.SessionStore
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import retrofit2.Retrofit
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
object AuthWiringModule {

    @Provides @Singleton
    fun provideTokenRefresher(
        sessionStore: SessionStore,
        @RefreshRetrofit retrofit: Retrofit
    ): TokenRefresher {
        val refreshApi = retrofit.create(RefreshApi::class.java)
        return TokenRefresher(sessionStore, refreshApi)
    }

    @Provides @Singleton
    fun provideTokenAuthenticator(
        tokenRefresher: TokenRefresher,
        sessionStore: SessionStore
    ): TokenAuthenticator = TokenAuthenticator(
        refresher = tokenRefresher,
        session = sessionStore
    )
}

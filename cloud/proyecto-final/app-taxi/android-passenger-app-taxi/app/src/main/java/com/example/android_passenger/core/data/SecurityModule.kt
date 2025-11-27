package com.example.android_passenger.core.data

import android.content.Context
import android.content.SharedPreferences
import com.example.android_passenger.core.domain.SessionStore
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.android.qualifiers.ApplicationContext
import dagger.hilt.components.SingletonComponent
import javax.inject.Qualifier
import javax.inject.Singleton

@Qualifier
@Retention(AnnotationRetention.BINARY)
annotation class SessionPrefs

@Module
@InstallIn(SingletonComponent::class)
object SecurityModule {

    @Provides
    @SessionPrefs
    @Singleton
    fun provideSecurePrefs(@ApplicationContext ctx: Context): SharedPreferences =
        EncryptedPrefsProvider.provide(ctx, "pf_session")

    @Provides
    @Singleton
    fun provideSessionStore(@SessionPrefs prefs: SharedPreferences): SessionStore =
        SessionStoreImpl(prefs)

    @Provides
    @Singleton
    fun provideAuthInterceptor(
        session: SessionStore
    ): AuthInterceptor =
        AuthInterceptor(session = session)
}

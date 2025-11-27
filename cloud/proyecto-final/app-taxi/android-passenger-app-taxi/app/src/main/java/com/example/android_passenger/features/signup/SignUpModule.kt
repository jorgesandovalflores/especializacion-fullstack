package com.example.android_passenger.features.signup

import android.content.Context
import android.content.SharedPreferences
import com.example.android_passenger.core.data.EncryptedPrefsProvider
import com.example.android_passenger.core.domain.SessionStore
import com.example.android_passenger.features.signup.data.local.SignUpStoreImpl
import com.example.android_passenger.features.signup.data.remote.SignupApi
import com.example.android_passenger.features.signup.data.repository.SignUpRepositoryImpl
import com.example.android_passenger.features.signup.domain.repository.FirebaseStorageRepository
import com.example.android_passenger.features.signup.domain.repository.SignUpRepository
import com.example.android_passenger.features.signup.domain.store.SignUpStore
import com.example.android_passenger.features.signup.domain.usecase.DeleteProfileImageUseCase
import com.example.android_passenger.features.signup.domain.usecase.GetSignUpStep2UseCase
import com.example.android_passenger.features.signup.domain.usecase.GetSignUpStep1UseCase
import com.example.android_passenger.features.signup.domain.usecase.SaveSignUpStep1UseCase
import com.example.android_passenger.features.signup.domain.usecase.SignUpUseCase
import com.example.android_passenger.features.signup.domain.usecase.UploadProfileImageUseCase
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.android.qualifiers.ApplicationContext
import dagger.hilt.components.SingletonComponent
import retrofit2.Retrofit
import javax.inject.Qualifier
import javax.inject.Singleton

@Qualifier
@Retention(AnnotationRetention.BINARY)
annotation class SignUpPrefs

@Module
@InstallIn(SingletonComponent::class)
object SignUpModule {

    @Provides
    @SignUpPrefs
    @Singleton
    fun provideSignUpPrefs(@ApplicationContext ctx: Context): SharedPreferences =
        EncryptedPrefsProvider.provide(ctx, "pf_signup")

    @Provides
    @Singleton
    fun provideSignUpStore(@SignUpPrefs prefs: SharedPreferences): SignUpStore =
        SignUpStoreImpl(prefs)

    @Provides
    @Singleton
    fun provideSignupApi(retrofit: Retrofit): SignupApi =
        retrofit.create(SignupApi::class.java)

    @Provides
    @Singleton
    fun provideSignUpRepository(api: SignupApi): SignUpRepository =
        SignUpRepositoryImpl(api)

    @Provides
    @Singleton
    fun provideFirebaseStorageRepository(): FirebaseStorageRepository {
        return FirebaseStorageRepository()
    }

    @Provides
    @Singleton
    fun provideSignUpUseCase(
        repo: SignUpRepository,
        storeSignIn: SignUpStore,
        storeSession: SessionStore
    ): SignUpUseCase = SignUpUseCase(repo = repo, storeSignIn = storeSignIn, storeSession = storeSession)

    @Provides
    @Singleton
    fun provideGetSignUpStep1UseCase(
        storeSignIn: SignUpStore
    ): GetSignUpStep1UseCase = GetSignUpStep1UseCase(storeSignIn = storeSignIn)

    @Provides
    @Singleton
    fun provideGetSignUpStep2UseCase(
        storeSignIn: SignUpStore,
        storeSession: SessionStore
    ): GetSignUpStep2UseCase = GetSignUpStep2UseCase(storeSignIn = storeSignIn, storeSession = storeSession)

    @Provides
    @Singleton
    fun provideSaveSignUpStep1UseCase(
        storeSignIn: SignUpStore
    ): SaveSignUpStep1UseCase = SaveSignUpStep1UseCase(storeSignIn = storeSignIn)

    @Provides
    @Singleton
    fun provideUploadProfileImageUseCase(
        repository: FirebaseStorageRepository
    ): UploadProfileImageUseCase {
        return UploadProfileImageUseCase(repository)
    }

    @Provides
    @Singleton
    fun provideDeleteProfileImageUseCase(
        repository: FirebaseStorageRepository
    ): DeleteProfileImageUseCase {
        return DeleteProfileImageUseCase(repository)
    }

}
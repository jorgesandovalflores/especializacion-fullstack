package com.example.android_passenger.features.menu

import com.example.android_passenger.core.IoAppDispatcher
import com.example.android_passenger.features.menu.data.local.dao.MenuDao
import com.example.android_passenger.features.menu.data.remote.MenuApi
import com.example.android_passenger.features.menu.data.repository.MenuRepositoryImpl
import com.example.android_passenger.features.menu.domain.repository.MenuRepository
import com.example.android_passenger.features.menu.domain.usecase.GetMenuCacheUseCase
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import kotlinx.coroutines.CoroutineDispatcher
import retrofit2.Retrofit
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
object MenuModule {

    @Provides
    @Singleton
    fun provideMenuApi(retrofit: Retrofit): MenuApi =
        retrofit.create(MenuApi::class.java)

    @Provides
    @Singleton
    fun provideMenuRepository(dao: MenuDao, api: MenuApi, @IoAppDispatcher io: CoroutineDispatcher): MenuRepository =
        MenuRepositoryImpl(dao = dao, api = api, io = io)

    @Provides
    @Singleton
    fun provideOtpGenerateUseCase(
        repo: MenuRepository,
        @IoAppDispatcher io: CoroutineDispatcher
    ): GetMenuCacheUseCase = GetMenuCacheUseCase(repo = repo, io = io)

}
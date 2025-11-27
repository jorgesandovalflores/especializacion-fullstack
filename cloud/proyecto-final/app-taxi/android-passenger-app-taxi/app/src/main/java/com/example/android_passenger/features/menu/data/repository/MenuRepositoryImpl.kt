package com.example.android_passenger.features.menu.data.repository

import com.example.android_passenger.core.IoAppDispatcher
import com.example.android_passenger.features.menu.data.local.dao.MenuDao
import com.example.android_passenger.features.menu.data.local.table.toDomain
import com.example.android_passenger.features.menu.data.local.table.toEntities
import com.example.android_passenger.features.menu.data.remote.MenuApi
import com.example.android_passenger.features.menu.data.remote.dto.toDomain
import com.example.android_passenger.features.menu.domain.model.Menu
import com.example.android_passenger.features.menu.domain.repository.MenuRepository
import kotlinx.coroutines.CoroutineDispatcher
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.withContext

class MenuRepositoryImpl(
    private val dao: MenuDao,
    private val api: MenuApi,
    @IoAppDispatcher private val io: CoroutineDispatcher
) : MenuRepository {
    override suspend fun getMenuRemote(): List<Menu> = withContext(io) {
        api.getMenu().map { it.toDomain() }
    }

    override suspend fun getMenuLocal(): List<Menu> = withContext(io) {
        dao.observeAll().first().map { it.toDomain() }
    }

    override suspend fun saveMenuLocal(values: List<Menu>) {
        withContext(io) {
            val entities = values.toEntities()
            dao.upsertAll(entities)
            dao.observeAll().first()
        }
    }
}
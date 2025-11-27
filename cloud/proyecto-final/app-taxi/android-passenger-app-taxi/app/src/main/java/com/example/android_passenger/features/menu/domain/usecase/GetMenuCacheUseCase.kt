package com.example.android_passenger.features.menu.domain.usecase

import com.example.android_passenger.core.IoAppDispatcher
import com.example.android_passenger.features.menu.domain.model.Menu
import com.example.android_passenger.features.menu.domain.repository.MenuRepository
import kotlinx.coroutines.CancellationException
import kotlinx.coroutines.CoroutineDispatcher
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow
import kotlinx.coroutines.withContext

sealed interface GetMenuCacheState {
    data object Idle : GetMenuCacheState
    data object Loading : GetMenuCacheState
    data class Error(val message: String) : GetMenuCacheState
    data class Success(val items: List<Menu>) : GetMenuCacheState
}

class GetMenuCacheUseCase(
    private val repo: MenuRepository,
    @IoAppDispatcher private val io: CoroutineDispatcher
) {
    operator fun invoke(): Flow<GetMenuCacheState> = flow {
        emit(GetMenuCacheState.Loading)

        try {
            val local = withContext(io) { repo.getMenuLocal() }
            if (local.isNotEmpty()) {
                emit(GetMenuCacheState.Success(local))
            }

            val remote = withContext(io) { repo.getMenuRemote() }
            if (remote.isNotEmpty()) {
                withContext(io) { repo.saveMenuLocal(remote) }
                emit(GetMenuCacheState.Success(remote))
            }
        } catch (ce: CancellationException) {
            throw ce
        } catch (t: Throwable) {
            emit(GetMenuCacheState.Error(t.message ?: "No se pudo obtener datos"))
        }
    }
}
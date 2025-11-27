package com.example.android_passenger.core.data

import com.example.android_passenger.core.domain.SessionStore
import com.example.android_passenger.core.data.dto.RefreshDto
import com.google.gson.Gson
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.firstOrNull
import kotlinx.coroutines.sync.Mutex
import kotlinx.coroutines.sync.withLock
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class TokenRefresher @Inject constructor(
    private val session: SessionStore,
    private val refreshApi: RefreshApi
) {
    // Mutex global para serializar el refresh
    private val refreshMutex = Mutex()
    // Job compartido para de-duplicar múltiples llamadas simultáneas
    @Volatile private var ongoingRefresh: Deferred<Boolean>? = null

    /**
     * Intenta refrescar tokens. Deduplica y serializa.
     * Retorna true si el refresh fue exitoso.
     */
    fun refreshTokensBlocking(): Boolean = runBlocking {
        refreshMutex.withLock {
            // Si ya hay un refresh en curso, espera su resultado
            ongoingRefresh?.let { return@runBlocking it.await() }

            val job = CoroutineScope(Dispatchers.IO).async {
                val refresh = session.refreshToken().firstOrNull()
                if (refresh.isNullOrBlank()) return@async false

                return@async try {
                    val resp = refreshApi.refresh(RefreshDto(refresh))
                    session.saveTokensAndUser(
                        access = resp.accessToken,
                        refresh = resp.refreshToken,
                        user = Gson().toJson(resp.user)
                    )
                    true
                } catch (t: Throwable) {
                    false
                }
            }

            ongoingRefresh = job
            try {
                job.await()
            } finally {
                ongoingRefresh = null
            }
        }
    }
}

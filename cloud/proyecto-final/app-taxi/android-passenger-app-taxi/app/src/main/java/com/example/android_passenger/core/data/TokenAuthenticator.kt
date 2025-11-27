package com.example.android_passenger.core.data

import com.example.android_passenger.core.domain.SessionStore
import kotlinx.coroutines.flow.firstOrNull
import kotlinx.coroutines.runBlocking
import okhttp3.Authenticator
import okhttp3.Request
import okhttp3.Response
import okhttp3.Route
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class TokenAuthenticator @Inject constructor(
    private val refresher: TokenRefresher,
    private val session: SessionStore,
) : Authenticator {

    override fun authenticate(route: Route?, response: Response): Request? {
        // 1) Evita loops: si ya intentamos demasiadas veces
        if (response.priorResponseCount() >= 1) {
            // Limpia sesión y que la UI navegue a Splash/Login
            runBlocking { session.clear() }
            return null
        }

        // 2) No refrescar si la URL es el endpoint de refresh
        val path = response.request.url.encodedPath
        if (path.contains("/auth/refresh")) return null

        // 3) Ejecuta refresh (mutex + dedup)
        val ok = refresher.refreshTokensBlocking()
        if (!ok) {
            runBlocking { session.clear() }
            return null
        }

        // 4) Reintenta request original con el nuevo access
        val newAccess = runBlocking { session.accessToken().firstOrNull() }
        if (newAccess.isNullOrBlank()) {
            runBlocking { session.clear() }
            return null
        }

        return response.request
            .newBuilder()
            .header("Authorization", "Bearer $newAccess")
            .header("X-Retry", "1") // marca de diagnóstico
            .build()
    }
}

// Extensión auxiliar para contar reintentos
private fun Response.priorResponseCount(): Int {
    var count = 0
    var r: Response? = priorResponse
    while (r != null) {
        count++
        r = r.priorResponse
    }
    return count
}

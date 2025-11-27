package com.example.android_passenger.core.data

import com.example.android_passenger.core.domain.SessionStore
import kotlinx.coroutines.flow.firstOrNull
import kotlinx.coroutines.runBlocking
import okhttp3.Interceptor
import okhttp3.Response
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class AuthInterceptor @Inject constructor(
    private val session: SessionStore
) : Interceptor {

    override fun intercept(chain: Interceptor.Chain): Response {
        val req = chain.request()
        val path = req.url.encodedPath

        // Endpoints públicos o de auth que NO llevan Authorization
        val isAuthEndpoint = path.contains("/auth/refresh") ||
                path.contains("/auth/otp-generate") ||
                path.contains("/auth/otp-validate")

        if (isAuthEndpoint) return chain.proceed(req)

        val access = runBlocking { session.accessToken().firstOrNull() }
        val newReq = if (!access.isNullOrBlank()) {
            req.newBuilder()
                .header("Authorization", "Bearer $access")
                .build()
        } else req

        return chain.proceed(newReq)
    }
}

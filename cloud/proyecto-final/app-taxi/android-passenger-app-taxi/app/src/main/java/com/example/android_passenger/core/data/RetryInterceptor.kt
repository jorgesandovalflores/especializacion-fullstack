package com.example.android_passenger.core.data

import okhttp3.Interceptor
import okhttp3.Response
import java.io.IOException

class RetryInterceptor(
    private val maxRetries: Int = 3,
    private val delayMillis: Long = 1000
) : Interceptor {

    override fun intercept(chain: Interceptor.Chain): Response {
        var request = chain.request()
        var response: Response
        var retryCount = 0

        while (retryCount <= maxRetries) {
            try {
                response = chain.proceed(request)

                // Reintentar solo en ciertos códigos de error
                if (response.isSuccessful || !shouldRetry(response.code)) {
                    return response
                }

            } catch (e: IOException) {
                // Reintentar en caso de errores de red
                if (retryCount == maxRetries) throw e
            }

            retryCount++
            if (retryCount <= maxRetries) {
                Thread.sleep(delayMillis * retryCount) // Backoff exponencial
            }
        }

        return chain.proceed(request)
    }

    private fun shouldRetry(statusCode: Int): Boolean {
        return statusCode in listOf(
            408, // Request Timeout
            429, // Too Many Requests
            500, // Internal Server Error
            502, // Bad Gateway
            503, // Service Unavailable
            504  // Gateway Timeout
        )
    }
}
package com.example.android_passenger.core.data

import com.example.android_passenger.BuildConfig
import com.example.android_passenger.core.domain.SessionStore
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import io.socket.client.IO
import io.socket.client.Socket
import kotlinx.coroutines.flow.firstOrNull
import kotlinx.coroutines.runBlocking
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import java.net.URISyntaxException
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
object NetworkModule {

    @Provides @Singleton
    fun provideLogging(): HttpLoggingInterceptor =
        HttpLoggingInterceptor().apply { level = HttpLoggingInterceptor.Level.BODY }

    @Provides @Singleton
    fun provideOkHttp(
        logging: HttpLoggingInterceptor,
        auth: AuthInterceptor,
        tokenAuthenticator: TokenAuthenticator
    ): OkHttpClient = OkHttpClient.Builder()
        .addInterceptor(RetryInterceptor(maxRetries = 3, delayMillis = 1000))
        .addInterceptor(logging)
        .addInterceptor(auth)
        .authenticator(tokenAuthenticator)
        .build()

    @Provides @Singleton
    fun provideRetrofit(client: OkHttpClient): Retrofit =
        Retrofit.Builder()
            .baseUrl(BuildConfig.API_BASE_URL)
            .client(client)
            .addConverterFactory(GsonConverterFactory.create())
            .build()

    @Provides
    @Singleton
    fun provideSocketIO(
        okHttpClient: OkHttpClient,
        sessionStore: SessionStore
    ): Socket {
        return try {
            val options = IO.Options().apply {
                // Usar el mismo OkHttpClient para consistencia
                this.callFactory = okHttpClient
                this.webSocketFactory = okHttpClient

                // Configuración de reconexión
                reconnection = true
                reconnectionAttempts = Integer.MAX_VALUE
                reconnectionDelay = 2000
                reconnectionDelayMax = 5000
                timeout = 20000

                // Configuración de transporte
                transports = arrayOf("websocket", "polling")

                // Headers de autenticación
                val access = runBlocking { sessionStore.accessToken().firstOrNull() }
                extraHeaders = mapOf(
                    "Authorization" to listOf("Bearer $access")
                )
            }

            IO.socket("${BuildConfig.API_BASE_URL}events", options)

        } catch (e: URISyntaxException) {
            throw RuntimeException("Invalid Socket.IO URL", e)
        }
    }

}
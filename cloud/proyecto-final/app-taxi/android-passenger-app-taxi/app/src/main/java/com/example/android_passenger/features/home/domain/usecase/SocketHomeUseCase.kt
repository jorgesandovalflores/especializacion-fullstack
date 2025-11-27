package com.example.android_passenger.features.home.domain.usecase

import android.util.Log
import io.socket.client.Socket
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import org.json.JSONObject
import javax.inject.Inject

class SocketHomeUseCase @Inject constructor(
    private val socket: Socket
) {
    private val _connectionState = MutableStateFlow<SocketConnectionState>(SocketConnectionState.Disconnected)
    val connectionState: StateFlow<SocketConnectionState> = _connectionState.asStateFlow()

    private val _routeUpdates = MutableStateFlow<RouteUpdate?>(null)
    val routeUpdates: StateFlow<RouteUpdate?> = _routeUpdates.asStateFlow()

    private val _errors = MutableStateFlow<SocketError?>(null)
    val errors: StateFlow<SocketError?> = _errors.asStateFlow()

    init {
        setupEventListeners()
    }

    fun connect() {
        if (!socket.connected()) {
            socket.connect()
        }
    }

    fun disconnect() {
        if (socket.connected()) {
            socket.disconnect()
        }
    }

    fun joinPassengersMain() {
        if (socket.connected()) {
            socket.emit("join_passengers_main")
        }
    }

    private fun setupEventListeners() {
        socket.on(Socket.EVENT_CONNECT) {
            _connectionState.value = SocketConnectionState.Connected
        }

        socket.on(Socket.EVENT_DISCONNECT) {
            _connectionState.value = SocketConnectionState.Disconnected
        }

        socket.on(Socket.EVENT_CONNECT_ERROR) { args ->
            val error = args.firstOrNull() as? String
            _connectionState.value = SocketConnectionState.Error(error ?: "Unknown connection error")
            _errors.value = SocketError.ConnectionError(error ?: "Unknown error")
        }

        // Eventos de aplicación
        socket.on("connection_success") { args ->
            Log.d("SocketHomeUseCase", "connection_success: $args")
            val data = args.firstOrNull() as? JSONObject
            joinPassengersMain()
        }

        socket.on("joined_passengers_main") { args ->
            Log.d("SocketHomeUseCase", "joined_passengers_main: $args")
            val data = args.firstOrNull() as? JSONObject
            // Confirmación de unión al room
        }

        socket.on("route") { args ->
            try {
                val data = args.firstOrNull() as? JSONObject
                Log.d("SocketHomeUseCase", "route: $data")
                data?.let { json ->
                    val routeUpdate = RouteUpdate(
                        latitude = json.getDouble("latitude"),
                        longitude = json.getDouble("longitude"),
                        bearing = json.getDouble("bearing").toFloat(),
                        progress = json.getDouble("progress").toFloat(),
                        currentStep = json.getInt("currentStep"),
                        totalSteps = json.getInt("totalSteps")
                    )
                    _routeUpdates.value = routeUpdate
                }
            } catch (e: Exception) {
                _errors.value = SocketError.ParseError("Error parsing route update: ${e.message}")
            }
        }

        socket.on("error") { args ->
            val error = args.firstOrNull() as? String
            _errors.value = SocketError.ServerError(error ?: "Unknown server error")
        }
    }

    fun reconnectWithNewToken(newToken: String) {
        disconnect()
    }
}

sealed class SocketConnectionState {
    object Connected : SocketConnectionState()
    object Disconnected : SocketConnectionState()
    data class Error(val message: String) : SocketConnectionState()
    object Connecting : SocketConnectionState()
}

data class RouteUpdate(
    val latitude: Double,
    val longitude: Double,
    val bearing: Float,
    val progress: Float,
    val currentStep: Int,
    val totalSteps: Int
)

sealed class SocketError {
    data class ConnectionError(val message: String) : SocketError()
    data class ServerError(val message: String) : SocketError()
    data class ParseError(val message: String) : SocketError()
}
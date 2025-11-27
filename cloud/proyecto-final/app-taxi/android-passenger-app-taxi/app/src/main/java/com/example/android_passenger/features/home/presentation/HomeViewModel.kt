package com.example.android_passenger.features.home.presentation

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.android_passenger.commons.domain.usecase.GetPassengerLocalState
import com.example.android_passenger.commons.domain.usecase.GetPassengerLocalUseCase
import com.example.android_passenger.core.domain.ErrorMapper
import com.example.android_passenger.core.presentation.toReadableMessage
import com.example.android_passenger.features.home.domain.model.AlertHome
import com.example.android_passenger.features.home.domain.usecase.AlertHomeFirestoreUseCase
import com.example.android_passenger.features.home.domain.usecase.AlertHomeFirestoreUseCaseState
import com.example.android_passenger.features.home.domain.usecase.RouteUpdate
import com.example.android_passenger.features.home.domain.usecase.SocketConnectionState
import com.example.android_passenger.features.home.domain.usecase.SocketError
import com.example.android_passenger.features.home.domain.usecase.SocketHomeUseCase
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class HomeViewModel @Inject constructor(
    private val getPassengerLocalUseCase: GetPassengerLocalUseCase,
    private val alertHomeFirestoreUseCase: AlertHomeFirestoreUseCase,
    private val socketHomeUseCase: SocketHomeUseCase
) : ViewModel() {

    private val _userUi = MutableStateFlow<GetPassengerLocalState>(GetPassengerLocalState.Idle)
    val userUi: StateFlow<GetPassengerLocalState> = _userUi

    private val _alertHomeState = MutableStateFlow<AlertHomeFirestoreUseCaseState>(AlertHomeFirestoreUseCaseState.Idle)
    val alertHomeState: StateFlow<AlertHomeFirestoreUseCaseState> = _alertHomeState

    private val _showAlert = MutableStateFlow(false)
    val showAlert: StateFlow<Boolean> = _showAlert

    private var currentAlert: AlertHome? = null

    fun callGetUser() {
        viewModelScope.launch {
            try {
                getPassengerLocalUseCase().collect {
                    _userUi.value = it
                }
            } catch (t: Throwable) {
                val mapped = ErrorMapper.map(t)
                _userUi.value = GetPassengerLocalState.Error(message = mapped.toReadableMessage())
            }
        }
    }

    fun callGetAlertHome() {
        viewModelScope.launch {
            try {
                alertHomeFirestoreUseCase().collect { state ->
                    _alertHomeState.value = state
                    when (state) {
                        is AlertHomeFirestoreUseCaseState.Success -> {
                            currentAlert = state.alertHome
                            _showAlert.value = state.alertHome?.isValid == true
                        }
                        else -> {
                            _showAlert.value = false
                        }
                    }
                }
            } catch (t: Throwable) {
                _showAlert.value = false
            }
        }
    }

    fun dismissAlert() {
        _showAlert.value = false
    }

    val connectionState: StateFlow<SocketConnectionState> =
        socketHomeUseCase.connectionState

    val routeUpdates: StateFlow<RouteUpdate?> =
        socketHomeUseCase.routeUpdates

    val errors: StateFlow<SocketError?> =
        socketHomeUseCase.errors

    val isConnected: StateFlow<Boolean> =
        socketHomeUseCase.connectionState.map { it is SocketConnectionState.Connected }
            .stateIn(
                viewModelScope,
                SharingStarted.WhileSubscribed(5000),
                false
            )

    fun connect() {
        viewModelScope.launch {
            socketHomeUseCase.connect()
        }
    }

    fun disconnect() {
        viewModelScope.launch {
            socketHomeUseCase.disconnect()
        }
    }

    fun clearError() {

    }

    override fun onCleared() {
        super.onCleared()
        disconnect()
    }
}
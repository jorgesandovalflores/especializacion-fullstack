package com.example.android_passenger.features.signin.presentation

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.android_passenger.core.domain.ErrorMapper
import com.example.android_passenger.core.presentation.toReadableMessage
import com.example.android_passenger.features.signin.domain.usecase.OtpGenerateState
import com.example.android_passenger.features.signin.domain.usecase.OtpGenerateUseCase
import com.example.android_passenger.features.signin.domain.usecase.OtpValidateState
import com.example.android_passenger.features.signin.domain.usecase.OtpValidateUseCase
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class SignInViewModel @Inject constructor(
    private val otpGenerateUseCase: OtpGenerateUseCase,
    private val otpValidateUseCase: OtpValidateUseCase
) : ViewModel() {

    private val _generateOtpUi = MutableStateFlow<OtpGenerateState>(OtpGenerateState.Idle)
    val generateOtpUi: StateFlow<OtpGenerateState> = _generateOtpUi
    fun callGenerateOtp(phone: String) {
        viewModelScope.launch {
            _generateOtpUi.value = OtpGenerateState.Loading
            try {
                otpGenerateUseCase(phone).collect {
                    _generateOtpUi.value = it
                }
            } catch (t: Throwable) {
                val mapped = ErrorMapper.map(t)
                _generateOtpUi.value = OtpGenerateState.Error(message = mapped.toReadableMessage())
            }
        }
    }

    private val _validateOtpUi = MutableStateFlow<OtpValidateState>(OtpValidateState.Idle)
    val validateOtpUi: StateFlow<OtpValidateState> = _validateOtpUi
    fun callValidateOtp(phone: String, code: String, tokenFcm: String) {
        viewModelScope.launch {
            _validateOtpUi.value = OtpValidateState.Loading
            try {
                otpValidateUseCase(phone, code, tokenFcm).collect {
                    _validateOtpUi.value = it
                }
            } catch (t: Throwable) {
                val mapped = ErrorMapper.map(t)
                _validateOtpUi.value = OtpValidateState.Error(message = mapped.toReadableMessage())
            }
        }
    }

    fun clearGenerateState() { _generateOtpUi.value = OtpGenerateState.Idle }
    fun clearValidateState() { _validateOtpUi.value = OtpValidateState.Idle }
}

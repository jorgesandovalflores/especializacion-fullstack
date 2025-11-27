package com.example.android_passenger.features.signin.domain.usecase

import com.example.android_passenger.features.signin.data.repository.AuthRepositoryImplTest
import kotlinx.coroutines.flow.toList
import kotlinx.coroutines.test.runTest
import org.junit.Assert.*
import org.junit.Test

class OtpGenerateUseCaseTest {

    @Test
    fun `cuando el repo responde ok se emite Loading y luego Success`() = runTest {
        val fakeRepo = AuthRepositoryImplTest(shouldFail = false)
        val useCase = OtpGenerateUseCase(repo = fakeRepo)

        val states = useCase("987654321").toList()

        assertTrue(states[0] is OtpGenerateState.Loading)

        val success = states[1] as OtpGenerateState.Success
        assertEquals("987654321", success.phone)
    }

    @Test
    fun `cuando el repo lanza error se emite Loading y luego Error`() = runTest {
        val fakeRepo = AuthRepositoryImplTest(shouldFail = true)
        val useCase = OtpGenerateUseCase(repo = fakeRepo)

        val states = useCase("987654321").toList()

        assertTrue(states[0] is OtpGenerateState.Loading)
        val error = states[1] as OtpGenerateState.Error
        assertTrue(error.message.isNotBlank())
    }

}
package com.example.android_passenger.features.menu.data.repository

import com.example.android_passenger.features.menu.data.local.dao.MenuDao
import com.example.android_passenger.features.menu.data.local.table.MenuEntity
import com.example.android_passenger.features.menu.data.remote.MenuApi
import com.example.android_passenger.features.menu.data.remote.dto.MenuDto
import com.example.android_passenger.features.menu.domain.model.Menu
import io.mockk.coEvery
import io.mockk.coVerify
import io.mockk.mockk
import kotlinx.coroutines.flow.flowOf
import kotlinx.coroutines.test.runTest
import org.junit.After
import org.junit.Assert.*
import org.junit.Before
import org.junit.Test

@OptIn(kotlinx.coroutines.ExperimentalCoroutinesApi::class)
class MenuRepositoryImplTest {

    private lateinit var repository: MenuRepositoryImpl
    private lateinit var mockDao: MenuDao
    private lateinit var mockApi: MenuApi

    private val testMenuList = listOf(
        Menu(key = "home", text = "Inicio", iconUrl = "icon_home.png", deeplink = "app://home", order = 1),
        Menu(key = "profile", text = "Perfil", iconUrl = "icon_profile.png", deeplink = "app://profile", order = 2),
        Menu(key = "settings", text = "Configuración", iconUrl = "icon_settings.png", deeplink = "app://settings", order = 3)
    )

    private val testMenuEntities = listOf(
        MenuEntity(id = "home", text = "Inicio", icon = "icon_home.png", deeplink = "app://home", updatedAt = 123456789L, position = 1),
        MenuEntity(id = "profile", text = "Perfil", icon = "icon_profile.png", deeplink = "app://profile", updatedAt = 123456789L, position = 2),
        MenuEntity(id = "settings", text = "Configuración", icon = "icon_settings.png", deeplink = "app://settings", updatedAt = 123456789L, position = 3)
    )

    private val testMenuDtos = listOf(
        MenuDto(key = "home", text = "Inicio", iconUrl = "icon_home.png", deeplink = "app://home", order = 1),
        MenuDto(key = "profile", text = "Perfil", iconUrl = "icon_profile.png", deeplink = "app://profile", order = 2),
        MenuDto(key = "settings", text = "Configuración", iconUrl = "icon_settings.png", deeplink = "app://settings", order = 3)
    )

    @Before
    fun setUp() {
        mockDao = mockk(relaxed = true)
        mockApi = mockk(relaxed = true)

        repository = MenuRepositoryImpl(
            dao = mockDao,
            api = mockApi,
            io = kotlinx.coroutines.test.UnconfinedTestDispatcher()
        )
    }

    @After
    fun tearDown() {
        // Limpiar los mocks estáticos
    }

    @Test
    fun getMenuRemote() = runTest {
        // Given
        coEvery { mockApi.getMenu() } returns testMenuDtos

        // When
        val result = repository.getMenuRemote()

        // Then
        assertEquals(testMenuList.size, result.size)
        assertEquals(testMenuList[0].key, result[0].key)
        assertEquals(testMenuList[0].text, result[0].text)
        assertEquals(testMenuList[0].iconUrl, result[0].iconUrl)
        assertEquals(testMenuList[0].deeplink, result[0].deeplink)
        assertEquals(testMenuList[0].order, result[0].order)
        coVerify(exactly = 1) { mockApi.getMenu() }
    }

    @Test
    fun getMenuRemote_withEmptyList() = runTest {
        // Given
        coEvery { mockApi.getMenu() } returns emptyList()

        // When
        val result = repository.getMenuRemote()

        // Then
        assertTrue(result.isEmpty())
        coVerify(exactly = 1) { mockApi.getMenu() }
    }

    @Test
    fun getMenuLocal() = runTest {
        // Given
        coEvery { mockDao.observeAll() } returns flowOf(testMenuEntities)

        // When
        val result = repository.getMenuLocal()

        // Then
        assertEquals(testMenuList.size, result.size)
        assertEquals(testMenuList[0].key, result[0].key)
        assertEquals(testMenuList[0].text, result[0].text)
        assertEquals(testMenuList[0].deeplink, result[0].deeplink)
        assertEquals(testMenuList[0].order, result[0].order)
        coVerify(exactly = 1) { mockDao.observeAll() }
    }

    @Test
    fun getMenuLocal_withEmptyDatabase() = runTest {
        // Given
        coEvery { mockDao.observeAll() } returns flowOf(emptyList())

        // When
        val result = repository.getMenuLocal()

        // Then
        assertTrue(result.isEmpty())
        coVerify(exactly = 1) { mockDao.observeAll() }
    }

    @Test
    fun saveMenuLocal() = runTest {
        // Given
        coEvery { mockDao.upsertAll(any()) } returns Unit
        coEvery { mockDao.observeAll() } returns flowOf(emptyList())

        // When
        repository.saveMenuLocal(testMenuList)

        // Then
        coVerify(exactly = 1) {
            mockDao.upsertAll(match { entities ->
                entities.size == testMenuList.size
            })
        }
    }

    @Test
    fun saveMenuLocal_withEmptyList() = runTest {
        // Given
        coEvery { mockDao.upsertAll(any()) } returns Unit
        coEvery { mockDao.observeAll() } returns flowOf(emptyList())

        // When
        repository.saveMenuLocal(emptyList())

        // Then
        coVerify(exactly = 1) { mockDao.upsertAll(emptyList()) }
    }

    @Test
    fun saveMenuLocal_verifyConversion() = runTest {
        // Given
        val menuToSave = listOf(
            Menu(key = "cart", text = "Carrito", iconUrl = "icon_cart.png", deeplink = "app://cart", order = 4)
        )

        coEvery { mockDao.upsertAll(any()) } returns Unit
        coEvery { mockDao.observeAll() } returns flowOf(emptyList())

        // When
        repository.saveMenuLocal(menuToSave)

        // Then
        coVerify {
            mockDao.upsertAll(match { entities ->
                entities.size == 1 &&
                        entities[0].id == "cart" &&
                        entities[0].text == "Carrito" &&
                        entities[0].icon == "icon_cart.png" &&
                        entities[0].deeplink == "app://cart" &&
                        entities[0].position == 4
            })
        }
    }
}
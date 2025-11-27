package com.example.android_passenger.features.menu.presentation

import com.example.android_passenger.R
import android.content.res.Configuration
import androidx.annotation.DrawableRes
import androidx.compose.animation.core.LinearEasing
import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.material3.Surface
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.luminance
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.LocalConfiguration
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.hilt.lifecycle.viewmodel.compose.hiltViewModel
import coil.ImageLoader
import coil.compose.AsyncImage
import coil.compose.SubcomposeAsyncImage
import coil.decode.SvgDecoder
import coil.request.ImageRequest
import com.example.android_passenger.commons.domain.model.Passenger
import com.example.android_passenger.commons.domain.enum.PassengerStatusEnum
import com.example.android_passenger.commons.domain.usecase.ClearSessionState
import com.example.android_passenger.commons.domain.usecase.GetPassengerLocalState
import com.example.android_passenger.commons.presentation.NavigationBarStyle
import com.example.android_passenger.core.presentation.theme.AndroidTheme
import com.example.android_passenger.features.menu.domain.model.Menu
import com.example.android_passenger.features.menu.domain.usecase.GetMenuCacheState

private const val PHONE_MAX_WIDTH_DP = 600
private const val LARGE_PHONE_MAX_WIDTH_DP = 840

@Composable
private fun getDeviceType(): DeviceType {
    val configuration = LocalConfiguration.current
    val screenWidthDp = configuration.screenWidthDp

    return when {
        screenWidthDp < PHONE_MAX_WIDTH_DP -> DeviceType.PHONE
        screenWidthDp <= LARGE_PHONE_MAX_WIDTH_DP -> DeviceType.LARGE_PHONE
        else -> DeviceType.TABLET
    }
}

enum class DeviceType {
    PHONE,       // < 600dp
    LARGE_PHONE, // 600dp - 840dp
    TABLET       // > 840dp
}

@Composable
private fun getGridColumns(): Int {
    return when (getDeviceType()) {
        DeviceType.PHONE -> 1
        DeviceType.LARGE_PHONE -> 2
        DeviceType.TABLET -> 3
    }
}

@Composable
private fun getItemSpacing(): Dp {
    return when (getDeviceType()) {
        DeviceType.PHONE -> 10.dp
        DeviceType.LARGE_PHONE -> 12.dp
        DeviceType.TABLET -> 16.dp
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun MenuTopBar(
    @DrawableRes navIconRes: Int,
    onNavClick: () -> Unit
) {
    TopAppBar(
        modifier = Modifier.padding(horizontal = 16.dp),
        title = { Text(text = "", style = MaterialTheme.typography.titleLarge) },
        navigationIcon = {
            Surface(
                shape = CircleShape,
                color = Color.Transparent,
                tonalElevation = 0.dp,
                modifier = Modifier
                    .size(40.dp)
                    .semantics { contentDescription = "menu_nav_left" },
                onClick = onNavClick
            ) {
                Icon(
                    painter = painterResource(navIconRes),
                    contentDescription = null,
                    tint = MaterialTheme.colorScheme.onSurface,
                    modifier = Modifier
                        .padding(8.dp)
                        .size(24.dp)
                )
            }
        },
        colors = TopAppBarDefaults.topAppBarColors(
            containerColor = Color.Transparent,
            navigationIconContentColor = MaterialTheme.colorScheme.onSurface,
            titleContentColor = MaterialTheme.colorScheme.onSurface
        )
    )
}

@Composable
fun PassengerCard(
    passenger: Passenger?,
    loading: Boolean,
    modifier: Modifier = Modifier
) {
    val colorScheme = MaterialTheme.colorScheme
    val surfaceColor = colorScheme.surface

    val shimmerBase = colorScheme.surfaceVariant.copy(alpha = 0.4f)
    val shimmerHighlight = Color.White.copy(alpha = 0.6f)

    val transition = rememberInfiniteTransition(label = "shimmer")
    val translateAnim by transition.animateFloat(
        initialValue = 0f,
        targetValue = 1000f,
        animationSpec = infiniteRepeatable(
            tween(1200, easing = LinearEasing),
            RepeatMode.Restart
        ),
        label = "shimmerAnim"
    )

    val brush = Brush.linearGradient(
        colors = listOf(shimmerBase, shimmerHighlight, shimmerBase),
        start = androidx.compose.ui.geometry.Offset(translateAnim - 200f, 0f),
        end = androidx.compose.ui.geometry.Offset(translateAnim, 200f)
    )

    Card(
        modifier = modifier,
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = surfaceColor),
        elevation = CardDefaults.cardElevation(defaultElevation = 1.dp)
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            if (loading) {
                Box(
                    modifier = Modifier
                        .size(56.dp)
                        .clip(CircleShape)
                        .background(brush)
                )
            } else {
                val hasPhotoUrl = !passenger?.photoUrl.isNullOrEmpty()

                if (hasPhotoUrl) {
                    SubcomposeAsyncImage(
                        model = ImageRequest.Builder(LocalContext.current)
                            .data(passenger?.photoUrl)
                            .crossfade(true)
                            .build(),
                        loading = {
                            Box(
                                modifier = Modifier
                                    .size(56.dp)
                                    .clip(CircleShape)
                                    .background(colorScheme.secondary.copy(alpha = 0.15f)),
                                contentAlignment = Alignment.Center
                            ) {
                                Text(
                                    text = passenger?.givenName?.firstOrNull()?.uppercase() ?: "U",
                                    style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold),
                                    color = colorScheme.secondary
                                )
                            }
                        },
                        contentDescription = "Foto de perfil",
                        modifier = Modifier
                            .size(56.dp)
                            .clip(CircleShape),
                        contentScale = ContentScale.Crop
                    )
                } else {
                    Box(
                        modifier = Modifier
                            .size(56.dp)
                            .clip(CircleShape)
                            .background(colorScheme.secondary.copy(alpha = 0.15f)),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = passenger?.givenName?.firstOrNull()?.uppercase() ?: "U",
                            style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold),
                            color = colorScheme.secondary
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.width(12.dp))

            Column(modifier = Modifier.weight(1f)) {
                if (loading) {
                    Spacer(
                        modifier = Modifier
                            .height(16.dp)
                            .fillMaxWidth(0.5f)
                            .clip(RoundedCornerShape(4.dp))
                            .background(brush)
                    )
                    Spacer(Modifier.height(8.dp))
                    Spacer(
                        modifier = Modifier
                            .height(12.dp)
                            .fillMaxWidth(0.4f)
                            .clip(RoundedCornerShape(4.dp))
                            .background(brush)
                    )
                    Spacer(Modifier.height(6.dp))
                    Spacer(
                        modifier = Modifier
                            .height(10.dp)
                            .fillMaxWidth(0.3f)
                            .clip(RoundedCornerShape(4.dp))
                            .background(brush)
                    )
                } else {
                    val fullName = listOfNotNull(passenger?.givenName, passenger?.familyName)
                        .joinToString(" ")
                        .ifBlank { "Passenger" }

                    Text(
                        text = fullName,
                        style = MaterialTheme.typography.titleMedium,
                        color = colorScheme.onSurface
                    )
                    Spacer(Modifier.height(2.dp))
                    Text(
                        text = passenger?.phoneNumber ?: "",
                        style = MaterialTheme.typography.bodyMedium,
                        color = colorScheme.onSurfaceVariant
                    )
                    passenger?.email?.let {
                        Spacer(Modifier.height(2.dp))
                        Text(
                            text = it,
                            style = MaterialTheme.typography.bodySmall,
                            color = colorScheme.onSurfaceVariant
                        )
                    }
                }
            }

            if (loading) {
                Spacer(
                    modifier = Modifier
                        .width(40.dp)
                        .height(12.dp)
                        .clip(RoundedCornerShape(4.dp))
                        .background(brush)
                )
            } else {
                Text(
                    text = passenger?.status ?: "",
                    style = MaterialTheme.typography.labelMedium,
                    color = when (passenger?.status?.lowercase()) {
                        PassengerStatusEnum.ACTIVE.value -> colorScheme.primary
                        PassengerStatusEnum.SUSPENDED.value,
                        PassengerStatusEnum.INACTIVE_REGISTER.value -> colorScheme.error
                        else -> colorScheme.onSurfaceVariant
                    },
                    modifier = Modifier.padding(start = 8.dp)
                )
            }
        }
    }
}

@Composable
private fun MenuItemCard(
    item: Menu,
    @DrawableRes rightArrowRes: Int,
    onClick: (Menu) -> Unit,
    isGridLayout: Boolean = false
) {
    val context = LocalContext.current
    val colorScheme = MaterialTheme.colorScheme

    val imageLoader = remember(context) {
        ImageLoader.Builder(context)
            .components { add(SvgDecoder.Factory()) }
            .build()
    }

    val shape = RoundedCornerShape(14.dp)

    Card(
        onClick = { onClick(item) },
        shape = shape,
        colors = CardDefaults.cardColors(
            containerColor = colorScheme.surface
        ),
        elevation = CardDefaults.cardElevation(defaultElevation = 0.5.dp),
        modifier = Modifier
            .fillMaxWidth()
            .then(if (isGridLayout) Modifier.height(120.dp) else Modifier)
    ) {
        if (isGridLayout) {
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(16.dp),
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.Center
            ) {
                AsyncImage(
                    model = ImageRequest.Builder(context)
                        .data(item.iconUrl)
                        .crossfade(true)
                        .build(),
                    imageLoader = imageLoader,
                    contentDescription = item.text,
                    modifier = Modifier
                        .size(32.dp)
                        .clip(CircleShape)
                        .background(colorScheme.surfaceVariant.copy(alpha = 0.5f)),
                    error = painterResource(android.R.drawable.ic_menu_report_image),
                    placeholder = painterResource(android.R.drawable.ic_menu_gallery)
                )

                Spacer(Modifier.height(8.dp))

                Text(
                    text = item.text,
                    style = MaterialTheme.typography.bodyMedium,
                    color = colorScheme.onSurface,
                    textAlign = TextAlign.Center,
                    maxLines = 2,
                    modifier = Modifier.fillMaxWidth()
                )

                Spacer(Modifier.height(4.dp))

                Icon(
                    painter = painterResource(rightArrowRes),
                    contentDescription = "Open",
                    modifier = Modifier
                        .size(16.dp)
                        .semantics { contentDescription = "menu_right_${item.key}" },
                    tint = colorScheme.onSurfaceVariant
                )
            }
        } else {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 14.dp, vertical = 12.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                AsyncImage(
                    model = ImageRequest.Builder(context)
                        .data(item.iconUrl)
                        .crossfade(true)
                        .build(),
                    imageLoader = imageLoader,
                    contentDescription = item.text,
                    modifier = Modifier
                        .size(24.dp)
                        .clip(CircleShape)
                        .background(colorScheme.surfaceVariant.copy(alpha = 0.5f)),
                    error = painterResource(android.R.drawable.ic_menu_report_image),
                    placeholder = painterResource(android.R.drawable.ic_menu_gallery)
                )

                Spacer(Modifier.width(12.dp))

                Text(
                    text = item.text,
                    style = MaterialTheme.typography.bodyLarge,
                    color = colorScheme.onSurface,
                    modifier = Modifier.weight(1f)
                )

                Icon(
                    painter = painterResource(rightArrowRes),
                    contentDescription = "Open",
                    modifier = Modifier
                        .size(20.dp)
                        .semantics { contentDescription = "menu_right_${item.key}" },
                    tint = colorScheme.onSurfaceVariant
                )
            }
        }
    }
}

@Composable
fun MenuScreen(
    onNavClick: () -> Unit,
    onMenuClick: (Menu) -> Unit,
    onLogoutClick: () -> Unit,
    passengerLocalState: GetPassengerLocalState,
    menuCacheState: GetMenuCacheState
) {
    val colorScheme = MaterialTheme.colorScheme
    val bg = colorScheme.background

    val isLightBackground = bg.luminance() > 0.5f
    NavigationBarStyle(color = bg, darkIcons = isLightBackground)

    val loadingPassenger = passengerLocalState is GetPassengerLocalState.Loading
    val loadingMenu = menuCacheState is GetMenuCacheState.Loading

    val passenger = (passengerLocalState as? GetPassengerLocalState.Success)?.value
    val menus = (menuCacheState as? GetMenuCacheState.Success)?.items ?: emptyList()
    val errorMenu = (menuCacheState as? GetMenuCacheState.Error)?.message

    val deviceType = getDeviceType()
    val isGridLayout = deviceType != DeviceType.PHONE
    val gridColumns = getGridColumns()
    val itemSpacing = getItemSpacing()

    // Padding para respetar el BottomNavigationBar
    val bottomPadding = 72.dp

    Surface(
        modifier = Modifier
            .fillMaxSize()
            .background(bg),
        color = bg
    ) {
        Column(modifier = Modifier.fillMaxSize()) {
            MenuTopBar(
                navIconRes = R.drawable.feature_menu_ic_left,
                onNavClick = onNavClick
            )

            Box(
                modifier = Modifier
                    .weight(1f)
                    .fillMaxWidth()
            ) {
                if (isGridLayout) {
                    MenuGridLayout(
                        passenger = passenger,
                        loadingPassenger = loadingPassenger,
                        menus = menus,
                        loadingMenu = loadingMenu,
                        errorMenu = errorMenu,
                        gridColumns = gridColumns,
                        itemSpacing = itemSpacing,
                        onMenuClick = onMenuClick
                    )
                } else {
                    MenuListLayout(
                        passenger = passenger,
                        loadingPassenger = loadingPassenger,
                        menus = menus,
                        loadingMenu = loadingMenu,
                        errorMenu = errorMenu,
                        onMenuClick = onMenuClick
                    )
                }
            }

            // Botón de Cerrar Sesión fijo
            Card(
                onClick = onLogoutClick,
                shape = RoundedCornerShape(14.dp),
                colors = CardDefaults.cardColors(
                    containerColor = colorScheme.surface
                ),
                elevation = CardDefaults.cardElevation(defaultElevation = 0.5.dp),
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp, vertical = 8.dp)
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 14.dp, vertical = 16.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Icon(
                        painter = painterResource(id = android.R.drawable.ic_lock_power_off),
                        contentDescription = "Cerrar sesión",
                        modifier = Modifier.size(24.dp),
                        tint = colorScheme.error
                    )

                    Spacer(Modifier.width(12.dp))

                    Text(
                        text = "Cerrar sesión",
                        style = MaterialTheme.typography.bodyLarge,
                        color = colorScheme.error,
                        modifier = Modifier.weight(1f)
                    )
                }
            }

            Spacer(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(bottomPadding)
            )
        }
    }
}

@Composable
private fun MenuGridLayout(
    passenger: Passenger?,
    loadingPassenger: Boolean,
    menus: List<Menu>,
    loadingMenu: Boolean,
    errorMenu: String?,
    gridColumns: Int,
    itemSpacing: Dp,
    onMenuClick: (Menu) -> Unit
) {
    val colorScheme = MaterialTheme.colorScheme

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(horizontal = 16.dp),
        contentPadding = PaddingValues(bottom = 16.dp)
    ) {
        // Passenger Card
        item {
            PassengerCard(
                passenger = passenger,
                loading = loadingPassenger,
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(top = 8.dp, bottom = 16.dp)
            )
        }

        when {
            loadingMenu -> {
                item {
                    val skeletonItems = 6
                    val rows = (skeletonItems + gridColumns - 1) / gridColumns

                    Column(
                        modifier = Modifier.fillMaxWidth(),
                        verticalArrangement = Arrangement.spacedBy(itemSpacing)
                    ) {
                        repeat(rows) { rowIndex ->
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.spacedBy(itemSpacing)
                            ) {
                                repeat(gridColumns) { columnIndex ->
                                    val itemIndex = rowIndex * gridColumns + columnIndex
                                    if (itemIndex < skeletonItems) {
                                        Box(
                                            modifier = Modifier
                                                .weight(1f)
                                                .height(120.dp)
                                                .clip(RoundedCornerShape(14.dp))
                                                .background(colorScheme.surfaceVariant.copy(alpha = 0.4f))
                                        )
                                    } else {
                                        Spacer(modifier = Modifier.weight(1f))
                                    }
                                }
                            }
                        }
                    }
                }
            }
            menus.isNotEmpty() -> {
                item {
                    val sortedMenus = menus.sortedBy { it.order }
                    val rows = (sortedMenus.size + gridColumns - 1) / gridColumns

                    Column(
                        modifier = Modifier.fillMaxWidth(),
                        verticalArrangement = Arrangement.spacedBy(itemSpacing)
                    ) {
                        repeat(rows) { rowIndex ->
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.spacedBy(itemSpacing)
                            ) {
                                repeat(gridColumns) { columnIndex ->
                                    val itemIndex = rowIndex * gridColumns + columnIndex
                                    if (itemIndex < sortedMenus.size) {
                                        val menu = sortedMenus[itemIndex]
                                        Box(
                                            modifier = Modifier.weight(1f)
                                        ) {
                                            MenuItemCard(
                                                item = menu,
                                                rightArrowRes = R.drawable.feature_menu_ic_right,
                                                onClick = onMenuClick,
                                                isGridLayout = true
                                            )
                                        }
                                    } else {
                                        Spacer(modifier = Modifier.weight(1f))
                                    }
                                }
                            }
                        }
                    }
                    Spacer(modifier = Modifier.height(16.dp))
                }
            }
            errorMenu != null -> {
                item {
                    Text(
                        text = errorMenu,
                        color = colorScheme.error,
                        style = MaterialTheme.typography.bodyMedium,
                        modifier = Modifier.padding(top = 12.dp)
                    )
                }
            }
            else -> {
                item {
                    Text(
                        text = "No hay opciones disponibles",
                        style = MaterialTheme.typography.bodyMedium,
                        color = colorScheme.onSurfaceVariant,
                        modifier = Modifier.padding(top = 12.dp)
                    )
                }
            }
        }
    }
}

@Composable
private fun MenuListLayout(
    passenger: Passenger?,
    loadingPassenger: Boolean,
    menus: List<Menu>,
    loadingMenu: Boolean,
    errorMenu: String?,
    onMenuClick: (Menu) -> Unit
) {
    val colorScheme = MaterialTheme.colorScheme

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(horizontal = 16.dp),
        contentPadding = PaddingValues(bottom = 16.dp)
    ) {
        // Passenger
        item {
            PassengerCard(
                passenger = passenger,
                loading = loadingPassenger,
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(top = 8.dp, bottom = 16.dp)
            )
        }

        when {
            loadingMenu -> {
                items(4) {
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(54.dp)
                            .clip(RoundedCornerShape(14.dp))
                            .background(colorScheme.surfaceVariant.copy(alpha = 0.4f))
                    )
                    Spacer(modifier = Modifier.height(10.dp))
                }
            }
            menus.isNotEmpty() -> {
                items(
                    items = menus.sortedBy { it.order },
                    key = { it.key }
                ) { menu ->
                    MenuItemCard(
                        item = menu,
                        rightArrowRes = R.drawable.feature_menu_ic_right,
                        onClick = onMenuClick,
                        isGridLayout = false
                    )
                    Spacer(modifier = Modifier.height(10.dp))
                }
            }
            errorMenu != null -> {
                item {
                    Text(
                        text = errorMenu,
                        color = colorScheme.error,
                        style = MaterialTheme.typography.bodyMedium,
                        modifier = Modifier.padding(top = 12.dp)
                    )
                }
            }
            else -> {
                item {
                    Text(
                        text = "No hay opciones disponibles",
                        style = MaterialTheme.typography.bodyMedium,
                        color = colorScheme.onSurfaceVariant,
                        modifier = Modifier.padding(top = 12.dp)
                    )
                }
            }
        }
    }
}

@Composable
fun MenuScreenRoute(
    onNavClick: () -> Unit,
    onMenuClick: (Menu) -> Unit,
    onLogoutSuccess: () -> Unit,
    vm: MenuViewModel = hiltViewModel()
) {
    val passengerState by vm.userUi.collectAsState()
    val menuState by vm.menuUi.collectAsState()
    val logoutState by vm.logoutUi.collectAsState()

    LaunchedEffect(Unit) {
        vm.callGetUser()
        vm.callGetMenu()
    }

    LaunchedEffect(logoutState) {
        when (logoutState) {
            is ClearSessionState.Success -> onLogoutSuccess()
            is ClearSessionState.Error -> {
                val errorMessage = (logoutState as ClearSessionState.Error).message
                // Manejar error si lo necesitas
            }
            else -> Unit
        }
    }

    MenuScreen(
        onNavClick = onNavClick,
        onMenuClick = onMenuClick,
        onLogoutClick = { vm.callLogout() },
        passengerLocalState = passengerState,
        menuCacheState = menuState
    )
}

/* -------------------------------------------------------
   Previews
-------------------------------------------------------- */

@Preview(
    name = "MenuScreen - Phone Light",
    showBackground = true,
    showSystemUi = true,
    uiMode = Configuration.UI_MODE_NIGHT_NO
)
@Composable
private fun PreviewMenuScreenPhone_Light() {
    AndroidTheme(darkTheme = false) {
        MenuScreen(
            onNavClick = {},
            onMenuClick = {},
            onLogoutClick = {},
            passengerLocalState = GetPassengerLocalState.Success(
                Passenger(
                    id = "1",
                    phoneNumber = "51987654321",
                    givenName = "Jorge",
                    familyName = "Sandoval",
                    email = "jorge@example.com",
                    photoUrl = "https://example.com/profile.jpg",
                    status = "active"
                )
            ),
            menuCacheState = GetMenuCacheState.Success(
                listOf(
                    Menu("history", "Mis viajes", "ic_menu_history", "app://history", 1),
                    Menu("payments", "Pagos", "ic_menu_payments", "app://payments", 2),
                    Menu("support", "Ayuda", "ic_menu_support", "app://support", 3),
                    Menu("profile", "Perfil", "ic_menu_profile", "app://profile", 4),
                    Menu("settings", "Configuración", "ic_menu_settings", "app://settings", 5),
                    Menu("promotions", "Promociones", "ic_menu_promotions", "app://promotions", 6)
                )
            )
        )
    }
}

@Preview(
    name = "MenuScreen - Tablet Dark",
    showBackground = true,
    showSystemUi = true,
    widthDp = 900,
    uiMode = Configuration.UI_MODE_NIGHT_YES
)
@Composable
private fun PreviewMenuScreenTablet_Dark() {
    AndroidTheme(darkTheme = true) {
        MenuScreen(
            onNavClick = {},
            onMenuClick = {},
            onLogoutClick = {},
            passengerLocalState = GetPassengerLocalState.Success(
                Passenger(
                    id = "1",
                    phoneNumber = "51987654321",
                    givenName = "Jorge",
                    familyName = "Sandoval",
                    email = "jorge@example.com",
                    photoUrl = "https://example.com/profile.jpg",
                    status = "active"
                )
            ),
            menuCacheState = GetMenuCacheState.Success(
                listOf(
                    Menu("history", "Mis viajes", "ic_menu_history", "app://history", 1),
                    Menu("payments", "Pagos", "ic_menu_payments", "app://payments", 2),
                    Menu("support", "Ayuda", "ic_menu_support", "app://support", 3),
                    Menu("profile", "Perfil", "ic_menu_profile", "app://profile", 4),
                    Menu("settings", "Configuración", "ic_menu_settings", "app://settings", 5),
                    Menu("promotions", "Promociones", "ic_menu_promotions", "app://promotions", 6),
                    Menu("documents", "Documentos", "ic_menu_documents", "app://documents", 7),
                    Menu("security", "Seguridad", "ic_menu_security", "app://security", 8)
                )
            )
        )
    }
}

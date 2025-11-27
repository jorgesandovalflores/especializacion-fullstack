package com.example.android_passenger.commons.presentation

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import coil.compose.SubcomposeAsyncImage
import coil.request.ImageRequest

@Composable
fun ComponentPinLocationUser(
    modifier: Modifier = Modifier,
    address: String? = null,
    photoUrl: String? = null,
    isLoading: Boolean = false,
    showAddress: Boolean = false,
    profileSize: Dp = 56.dp,
    pinHeight: Dp = 18.dp,
    pinWidth: Dp = 4.dp,
    elevation: Dp = 6.dp,
    addressBackgroundColor: Color = MaterialTheme.colorScheme.primary,
    circleFallbackColor: Color = MaterialTheme.colorScheme.primary.copy(alpha = 0.35f),
    ringColor: Color = MaterialTheme.colorScheme.primary.copy(alpha = 0.18f),
    pinColor: Color = MaterialTheme.colorScheme.primary.copy(alpha = 0.55f),
    onPhotoLoaded: (() -> Unit)? = null
) {
    Column(
        modifier = modifier.wrapContentSize(),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        // -- Burbuja de dirección (opcional) --
        if (showAddress) {
            Surface(
                modifier = Modifier
                    .shadow(elevation = elevation, shape = RoundedCornerShape(12.dp))
                    .wrapContentWidth()
                    .padding(horizontal = 12.dp),
                shape = RoundedCornerShape(12.dp),
                color = addressBackgroundColor,
                contentColor = Color.White
            ) {
                Box(
                    modifier = Modifier
                        .padding(horizontal = 12.dp, vertical = 8.dp)
                        .defaultMinSize(minWidth = 40.dp, minHeight = 12.dp),
                    contentAlignment = Alignment.Center
                ) {
                    when {
                        isLoading -> {
                            CircularProgressIndicator(
                                modifier = Modifier.size(16.dp),
                                strokeWidth = 2.dp,
                                color = Color.White
                            )
                        }
                        !address.isNullOrBlank() -> {
                            Text(
                                text = address,
                                style = MaterialTheme.typography.labelMedium,
                                textAlign = TextAlign.Center,
                                color = Color.White,
                                maxLines = 2
                            )
                        }
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(6.dp))

        // -- Círculo del pin (foto o color sólido) con anillo muy sutil --
        Box(
            modifier = Modifier
                .size(profileSize + 8.dp) // espacio para anillo
                .clip(CircleShape)
                .background(ringColor),
            contentAlignment = Alignment.Center
        ) {
            Surface(
                modifier = Modifier
                    .size(profileSize)
                    .clip(CircleShape)
                    .border(1.dp, ringColor.copy(alpha = 0.35f), CircleShape)
                    .shadow(elevation = elevation, shape = CircleShape),
                shape = CircleShape,
                color = Color.Transparent
            ) {
                if (!photoUrl.isNullOrBlank()) {
                    SubcomposeAsyncImage(
                        model = ImageRequest.Builder(LocalContext.current)
                            .data(photoUrl)
                            .crossfade(true)
                            .build(),
                        contentDescription = "User photo",
                        contentScale = ContentScale.Crop,
                        loading = {
                            Box(
                                modifier = Modifier
                                    .fillMaxSize()
                                    .background(circleFallbackColor)
                            )
                        },
                        error = {
                            Box(
                                modifier = Modifier
                                    .fillMaxSize()
                                    .background(circleFallbackColor)
                            )
                        },
                        modifier = Modifier.fillMaxSize(),
                        onSuccess = { onPhotoLoaded?.invoke() }
                    )
                } else {
                    // Sin imagen: círculo de color sólido (sin íconos)
                    Box(
                        modifier = Modifier
                            .fillMaxSize()
                            .background(circleFallbackColor)
                    )
                }
            }
        }

        // -- Tallo vertical del pin --
        Spacer(modifier = Modifier.height(6.dp))
        Box(
            modifier = Modifier
                .width(pinWidth)
                .height(pinHeight)
                .clip(RoundedCornerShape(2.dp))
                .background(pinColor)
        )
    }
}

/* --------- API con estado (se mantiene para compatibilidad) --------- */

@Composable
fun ComponentPinLocationUser(
    modifier: Modifier = Modifier,
    state: PinLocationState,
    profileSize: Dp = 56.dp,
    onPhotoLoaded: (() -> Unit)? = null
) {
    ComponentPinLocationUser(
        modifier = modifier,
        address = state.address,
        photoUrl = state.photoUrl,
        isLoading = state.isLoading,
        showAddress = state.showAddress,
        profileSize = profileSize,
        onPhotoLoaded = onPhotoLoaded
    )
}

data class PinLocationState(
    val address: String? = null,
    val photoUrl: String? = null,
    val isLoading: Boolean = false,
    val showAddress: Boolean = false
)

@Composable
fun rememberPinLocationState(
    initialAddress: String? = null,
    initialPhotoUrl: String? = null,
    initialLoading: Boolean = false,
    initialShowAddress: Boolean = false
): PinLocationState {
    return remember {
        PinLocationState(
            address = initialAddress,
            photoUrl = initialPhotoUrl,
            isLoading = initialLoading,
            showAddress = initialShowAddress
        )
    }
}

/* ===== PREVIEWS (solo dos) ===== */
@Preview(name = "Address + Placeholder", showBackground = true, backgroundColor = 0xFFEEEEEE)
@Composable
private fun Preview_Pin_WithAddress_Placeholder() {
    MaterialTheme {
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(Color(0xFFEEEEEE)),
            contentAlignment = Alignment.Center
        ) {
            ComponentPinLocationUser(
                address = "Avenida con número 100, distrito",
                photoUrl = null,
                showAddress = true
            )
        }
    }
}

@Preview(name = "Long Address + Photo", showBackground = true, backgroundColor = 0xFFDDDDDD)
@Composable
private fun Preview_Pin_LongAddress_Photo() {
    MaterialTheme {
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(Color(0xFFDDDDDD)),
            contentAlignment = Alignment.Center
        ) {
            ComponentPinLocationUser(
                address = "Avenida muy larga con nombre extenso y número específico 12345, Distrito Residencial",
                photoUrl = "https://picsum.photos/200/200",
                showAddress = true
            )
        }
    }
}

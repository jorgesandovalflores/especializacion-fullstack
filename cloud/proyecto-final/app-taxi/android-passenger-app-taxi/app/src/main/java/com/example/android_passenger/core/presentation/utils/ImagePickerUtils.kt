package com.example.android_passenger.core.presentation.utils

import android.net.Uri
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.PickVisualMediaRequest
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.runtime.*
import androidx.compose.ui.platform.LocalContext

@Composable
fun rememberImagePicker(
    onImageSelected: (Uri?) -> Unit
): ImagePickerState {
    val context = LocalContext.current

    // Launcher para seleccionar imagen de la galería
    val galleryLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.PickVisualMedia()
    ) { uri ->
        onImageSelected(uri)
    }

    // Launcher para tomar foto con la cámara
    val cameraLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.TakePicture()
    ) { success ->
        if (!success) {
            onImageSelected(null)
        }
    }

    return remember {
        ImagePickerState(
            openGallery = {
                galleryLauncher.launch(
                    PickVisualMediaRequest(ActivityResultContracts.PickVisualMedia.ImageOnly)
                )
            },
            openCamera = { uri ->
                cameraLauncher.launch(uri)
            }
        )
    }
}

data class ImagePickerState(
    val openGallery: () -> Unit,
    val openCamera: (Uri) -> Unit
)
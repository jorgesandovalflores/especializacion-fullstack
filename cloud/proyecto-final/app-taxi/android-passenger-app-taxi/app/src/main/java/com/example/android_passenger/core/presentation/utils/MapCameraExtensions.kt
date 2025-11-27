package com.example.android_passenger.core.presentation.utils

import com.google.android.gms.maps.CameraUpdateFactory
import com.google.android.gms.maps.model.CameraPosition
import com.google.android.gms.maps.model.LatLng
import com.google.maps.android.compose.CameraPositionState

suspend fun CameraPositionState.centerOn(
    target: LatLng,
    zoom: Float = 16f,
    tilt: Float = 0f,
    bearing: Float = 0f,
    durationMs: Int = 800
) {
    val camPos = CameraPosition(target, zoom, tilt, bearing)
    val update = CameraUpdateFactory.newCameraPosition(camPos)
    animate(update, durationMs)
}
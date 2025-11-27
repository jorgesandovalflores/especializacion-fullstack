package com.example.android_passenger.core.presentation.utils

import android.annotation.SuppressLint
import android.content.Context
import android.location.Location
import android.os.Looper
import com.google.android.gms.location.CurrentLocationRequest
import com.google.android.gms.location.FusedLocationProviderClient
import com.google.android.gms.location.LocationCallback
import com.google.android.gms.location.LocationRequest
import com.google.android.gms.location.LocationResult
import com.google.android.gms.location.LocationServices
import com.google.android.gms.location.Priority
import com.google.android.gms.maps.model.LatLng
import kotlinx.coroutines.suspendCancellableCoroutine
import kotlinx.coroutines.withTimeoutOrNull
import kotlin.coroutines.resume

object LocationHelper {

    /**
     * Obtiene una LatLng "lo mejor posible":
     * 1) currentLocation con PRIORITY_HIGH_ACCURACY (timeout corto)
     * 2) fallback a lastLocation si lo anterior no llega a tiempo
     * Requiere permiso de ubicación concedido.
     */
    @SuppressLint("MissingPermission") // Ya debes validar permisos antes
    suspend fun getCurrentLatLng(context: Context, timeoutMs: Long = 4000L): LatLng? {
        val client = LocationServices.getFusedLocationProviderClient(context)

        // 1) Intenta una lectura rápida con getCurrentLocation (API moderna)
        val quick = withTimeoutOrNull(timeoutMs) {
            client.currentLocationHighAccuracy()
        }?.toLatLng()

        if (quick != null) return quick

        // 2) Fallback a lastLocation si existiera
        val last = client.lastLocation()?.toLatLng()
        if (last != null) return last

        // 3) Fallback final con una única actualización activa (solo si es necesario)
        val single = withTimeoutOrNull(timeoutMs) {
            client.singleUpdateOnce()
        }?.toLatLng()

        return single
    }

    @SuppressLint("MissingPermission")
    private suspend fun FusedLocationProviderClient.currentLocationHighAccuracy(): Location? {
        val request = CurrentLocationRequest.Builder()
            .setPriority(Priority.PRIORITY_HIGH_ACCURACY)
            .setMaxUpdateAgeMillis(0)
            .build()
        return suspendCancellableCoroutine { cont ->
            this.getCurrentLocation(request, /* p1 = */ null)
                .addOnSuccessListener { cont.resume(it) }
                .addOnFailureListener { cont.resume(null) }
        }
    }

    @SuppressLint("MissingPermission")
    private suspend fun FusedLocationProviderClient.singleUpdateOnce(): Location? {
        val req = LocationRequest.Builder(Priority.PRIORITY_BALANCED_POWER_ACCURACY, /* interval */ 1000L)
            .setMaxUpdates(1)
            .build()
        return suspendCancellableCoroutine { cont ->
            val callback = object : LocationCallback() {
                override fun onLocationResult(result: LocationResult) {
                    removeLocationUpdates(this)
                    cont.resume(result.lastLocation)
                }
            }
            requestLocationUpdates(req, callback, Looper.getMainLooper())
                .addOnFailureListener {
                    removeLocationUpdates(callback)
                    cont.resume(null)
                }
            cont.invokeOnCancellation { removeLocationUpdates(callback) }
        }
    }

    private suspend fun FusedLocationProviderClient.lastLocation(): Location? {
        return suspendCancellableCoroutine { cont ->
            this.lastLocation
                .addOnSuccessListener { cont.resume(it) }
                .addOnFailureListener { cont.resume(null) }
        }
    }

    private fun Location?.toLatLng(): LatLng? = this?.let { LatLng(it.latitude, it.longitude) }
}

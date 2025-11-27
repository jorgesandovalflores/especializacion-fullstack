package com.example.android_passenger.features.home.domain.repository

import com.example.android_passenger.features.home.domain.model.AlertHome
import com.google.firebase.firestore.FirebaseFirestore
import com.google.firebase.firestore.snapshots
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
import javax.inject.Inject

class FirebaseFirestoreRepository @Inject constructor() {

    fun getAlertHome(): Flow<AlertHome?> {
        return FirebaseFirestore.getInstance()
            .collection("configuration")
            .document("app-passenger-android")
            .snapshots()
            .map { document ->
                document.get("alert_home")?.let { alertMap ->
                    val map = alertMap as? Map<String, String>
                    AlertHome(
                        title = map?.get("title") ?: "",
                        body = map?.get("body") ?: ""
                    )
                }
            }
    }
}
package com.example.android_passenger.features.signup.domain.repository

import android.net.Uri
import com.google.firebase.storage.FirebaseStorage
import com.google.firebase.storage.StorageReference
import kotlinx.coroutines.tasks.await
import javax.inject.Inject

class FirebaseStorageRepository @Inject constructor() {

    private val storage: FirebaseStorage = FirebaseStorage.getInstance()
    private val storageRef: StorageReference = storage.reference

    suspend fun uploadProfileImage(userId: String, imageUri: Uri): String {
        try {
            val imageRef = storageRef.child("profile_images/$userId/${System.currentTimeMillis()}.jpg")
            val uploadTask = imageRef.putFile(imageUri).await()
            val downloadUrl = imageRef.downloadUrl.await()
            return downloadUrl.toString()
        } catch (e: Exception) {
            throw Exception("Error al subir la imagen: ${e.message}")
        }
    }

    suspend fun deleteProfileImage(imageUrl: String) {
        try {
            val storageRef = FirebaseStorage.getInstance().getReferenceFromUrl(imageUrl)
            storageRef.delete().await()
        } catch (e: Exception) {
            println("Error al eliminar imagen: ${e.message}")
        }
    }
}
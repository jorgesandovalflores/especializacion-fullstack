package com.example.android_passenger.core.data

import androidx.room.Database
import androidx.room.RoomDatabase
import com.example.android_passenger.features.menu.data.local.dao.MenuDao
import com.example.android_passenger.features.menu.data.local.table.MenuEntity

@Database(
    entities = [MenuEntity::class],
    version = 1,
    exportSchema = true
)
abstract class AppDatabase : RoomDatabase() {
    abstract fun menuDao(): MenuDao
}

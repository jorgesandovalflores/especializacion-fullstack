package com.example.android_passenger.features.menu.data.local.dao

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import com.example.android_passenger.features.menu.data.local.table.MenuEntity

@Dao
interface MenuDao {
    @Query("SELECT * FROM menu ORDER BY position ASC")
    fun observeAll(): kotlinx.coroutines.flow.Flow<List<MenuEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun upsertAll(items: List<MenuEntity>)

    @Query("DELETE FROM menu")
    suspend fun clear()
}
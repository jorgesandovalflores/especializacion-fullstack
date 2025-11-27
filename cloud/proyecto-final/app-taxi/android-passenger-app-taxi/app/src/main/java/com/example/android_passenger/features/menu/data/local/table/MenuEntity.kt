package com.example.android_passenger.features.menu.data.local.table

import androidx.room.Entity
import androidx.room.PrimaryKey
import androidx.room.Index
import com.example.android_passenger.features.menu.domain.model.Menu

@Entity(
    tableName = "menu",
    indices = [Index(value = ["text"]), Index(value = ["deeplink"], unique = true)]
)
data class MenuEntity(
    @PrimaryKey val id: String,
    val text: String,
    val icon: String,
    val deeplink: String,
    val updatedAt: Long,
    val position: Int
)

fun MenuEntity.toDomain(): Menu = Menu(
    key = this.id,
    text = this.text,
    iconUrl = this.icon,
    deeplink = this.deeplink,
    order = this.position
)

fun Menu.toEntity(): MenuEntity = MenuEntity(
    id = this.key,
    text = this.text,
    icon = this.iconUrl,
    deeplink = this.deeplink,
    updatedAt = System.currentTimeMillis(),
    position = this.order
)

fun List<Menu>.toEntities(): List<MenuEntity> = this.map { it.toEntity() }
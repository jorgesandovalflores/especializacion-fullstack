package com.example.android_passenger.commons.presentation

import android.content.res.Configuration
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.material3.TextField
import androidx.compose.material3.TextFieldDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.luminance
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import com.example.android_passenger.core.presentation.theme.AndroidTheme

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun GenericInputField(
    value: String,
    onValueChange: (String) -> Unit,
    placeholder: String,
    modifier: Modifier = Modifier,
    enabled: Boolean = true,
    keyboardType: KeyboardType = KeyboardType.Text,
    maxLength: Int = Int.MAX_VALUE,
    imeAction: ImeAction = ImeAction.Next
) {
    val colorScheme = MaterialTheme.colorScheme

    val isLightBackground = colorScheme.background.luminance() > 0.5f
    val containerColor = if (isLightBackground) {
        Color.White
    } else {
        colorScheme.surface
    }

    val tfColors = TextFieldDefaults.colors(
        focusedContainerColor = containerColor,
        unfocusedContainerColor = containerColor,
        disabledContainerColor = containerColor.copy(alpha = 0.6f),
        focusedIndicatorColor = Color.Transparent,
        unfocusedIndicatorColor = Color.Transparent,
        disabledIndicatorColor = Color.Transparent,
        cursorColor = colorScheme.primary,
        focusedTextColor = colorScheme.onSurface,
        unfocusedTextColor = colorScheme.onSurface,
        disabledTextColor = colorScheme.onSurface.copy(alpha = 0.6f),
        focusedPlaceholderColor = colorScheme.onSurfaceVariant,
        unfocusedPlaceholderColor = colorScheme.onSurfaceVariant,
        disabledPlaceholderColor = colorScheme.onSurfaceVariant.copy(alpha = 0.6f)
    )

    TextField(
        value = value,
        onValueChange = { newValue ->
            if (newValue.length <= maxLength) {
                onValueChange(newValue)
            }
        },
        placeholder = { Text(text = placeholder) },
        singleLine = true,
        shape = MaterialTheme.shapes.large,
        keyboardOptions = KeyboardOptions(
            keyboardType = keyboardType,
            imeAction = imeAction
        ),
        colors = tfColors,
        enabled = enabled,
        modifier = modifier
            .fillMaxWidth()
            .height(56.dp)
    )
}

/* Previews */
@Preview(
    showBackground = true,
    backgroundColor = 0xFFF0F0F0,
    uiMode = Configuration.UI_MODE_NIGHT_NO,
    name = "GenericInputField - Light"
)
@Composable
private fun GenericInputFieldTextPreview_Light() {
    AndroidTheme(darkTheme = false) {
        var text = remember { mutableStateOf("") }
        Box(modifier = Modifier.padding(16.dp)) {
            GenericInputField(
                value = text.value,
                onValueChange = { text.value = it },
                placeholder = "Ingresa tu nombre",
                keyboardType = KeyboardType.Text,
                maxLength = 50
            )
        }
    }
}

@Preview(
    showBackground = true,
    backgroundColor = 0xFF000000,
    uiMode = Configuration.UI_MODE_NIGHT_YES,
    name = "GenericInputField - Dark"
)
@Composable
private fun GenericInputFieldTextPreview_Dark() {
    AndroidTheme(darkTheme = true) {
        var text = remember { mutableStateOf("Texto de ejemplo") }
        Box(modifier = Modifier.padding(16.dp)) {
            GenericInputField(
                value = text.value,
                onValueChange = { text.value = it },
                placeholder = "Ingresa tu correo",
                keyboardType = KeyboardType.Email
            )
        }
    }
}

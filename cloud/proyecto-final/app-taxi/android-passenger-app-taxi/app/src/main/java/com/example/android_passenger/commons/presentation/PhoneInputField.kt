package com.example.android_passenger.commons.presentation

import android.content.res.Configuration
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
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
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import com.example.android_passenger.core.presentation.theme.AndroidTheme

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun PhoneInputField(
    value: String,
    onValueChange: (String) -> Unit,
    placeholder: String,
    modifier: Modifier = Modifier,
    enabled: Boolean = true
) {
    val colorScheme = MaterialTheme.colorScheme

    // Fondo del TextField: blanco en tema claro, surface en tema oscuro
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
        focusedPrefixColor = colorScheme.onSurface,
        unfocusedPrefixColor = colorScheme.onSurface,
        disabledPrefixColor = colorScheme.onSurface.copy(alpha = 0.6f),
        focusedPlaceholderColor = colorScheme.onSurfaceVariant,
        unfocusedPlaceholderColor = colorScheme.onSurfaceVariant,
        disabledPlaceholderColor = colorScheme.onSurfaceVariant.copy(alpha = 0.6f)
    )

    TextField(
        value = value,
        onValueChange = { raw ->
            val digits = raw.filter { it.isDigit() }
            val normalized = when {
                digits.startsWith("51") && digits.length > 9 -> digits.drop(2)
                digits.startsWith("51") -> digits.drop(2)
                else -> digits
            }.take(9)
            onValueChange(normalized)
        },
        placeholder = { Text(text = placeholder) },
        singleLine = true,
        shape = RoundedCornerShape(28.dp),
        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Phone),
        colors = tfColors,
        enabled = enabled,
        modifier = modifier
            .fillMaxWidth()
            .height(56.dp),
        prefix = {
            if (value.isNotEmpty()) {
                Text(text = "+51 ")
            }
        }
    )
}

/* Previews */

@Preview(
    showBackground = true,
    backgroundColor = 0xFFF0F0F0,
    uiMode = Configuration.UI_MODE_NIGHT_NO,
    name = "PhoneInputField - Light Empty"
)
@Composable
private fun PhoneInputFieldEmptyPreview_Light() {
    AndroidTheme(darkTheme = false) {
        val (phone, setPhone) = remember { mutableStateOf("") }
        Box(modifier = Modifier.padding(16.dp)) {
            PhoneInputField(
                value = phone,
                onValueChange = setPhone,
                placeholder = "Ingresa tu número de teléfono"
            )
        }
    }
}

@Preview(
    showBackground = true,
    backgroundColor = 0xFF000000,
    uiMode = Configuration.UI_MODE_NIGHT_YES,
    name = "PhoneInputField - Dark Filled"
)
@Composable
private fun PhoneInputFieldFilledPreview_Dark() {
    AndroidTheme(darkTheme = true) {
        val (phone, setPhone) = remember { mutableStateOf("987654321") }
        Box(modifier = Modifier.padding(16.dp)) {
            PhoneInputField(
                value = phone,
                onValueChange = setPhone,
                placeholder = "Ingresa tu número de teléfono"
            )
        }
    }
}

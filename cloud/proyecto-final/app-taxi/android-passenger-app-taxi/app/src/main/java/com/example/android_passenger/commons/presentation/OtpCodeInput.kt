package com.example.android_passenger.commons.presentation

import android.content.res.Configuration
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.runtime.Composable
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.focus.FocusRequester
import androidx.compose.ui.focus.focusRequester
import androidx.compose.ui.graphics.luminance
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.android_passenger.core.presentation.theme.AndroidTheme

@Composable
fun OtpBox(
    value: String,
    onChange: (String) -> Unit,
    requester: FocusRequester,
    modifier: Modifier = Modifier
) {
    val shape = MaterialTheme.shapes.medium
    val colorScheme = MaterialTheme.colorScheme

    val isLightTheme = colorScheme.background.luminance() > 0.5f

    val borderColor = if (value.isNotEmpty()) {
        if (isLightTheme) colorScheme.primary else colorScheme.onSurface
    } else {
        colorScheme.outlineVariant
    }

    val boxBackground = if (isLightTheme) {
        colorScheme.surfaceVariant
    } else {
        colorScheme.surface
    }

    val textColor = colorScheme.onSurface

    Box(
        modifier = modifier
            .height(56.dp)
            .clip(shape)
            .border(width = 1.dp, color = borderColor, shape = shape)
            .background(color = boxBackground),
        contentAlignment = Alignment.Center
    ) {
        BasicTextField(
            value = value,
            onValueChange = onChange,
            textStyle = TextStyle(
                fontSize = 22.sp,
                textAlign = TextAlign.Center,
                color = textColor
            ),
            singleLine = true,
            keyboardOptions = KeyboardOptions(
                keyboardType = KeyboardType.Number,
                imeAction = ImeAction.Next
            ),
            keyboardActions = KeyboardActions(
                onNext = { }
            ),
            modifier = Modifier
                .fillMaxWidth()
                .focusRequester(requester)
        )
    }
}

@Composable
fun OtpCodeInput(
    d0: String, onD0: (String) -> Unit,
    d1: String, onD1: (String) -> Unit,
    d2: String, onD2: (String) -> Unit,
    d3: String, onD3: (String) -> Unit,
    modifier: Modifier = Modifier
) {
    val focusManager = androidx.compose.ui.platform.LocalFocusManager.current
    val requesters = remember { List(4) { FocusRequester() } }

    fun next(index: Int) {
        if (index < 3) requesters[index + 1].requestFocus() else focusManager.clearFocus()
    }

    fun prev(index: Int) {
        if (index > 0) requesters[index - 1].requestFocus()
    }

    Row(
        modifier = modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        OtpBox(
            value = d0,
            onChange = { new ->
                val filtered = new.filter(Char::isDigit).take(1)
                if (filtered != d0) onD0(filtered)
                if (filtered.length == 1) next(0)
            },
            requester = requesters[0],
            modifier = Modifier.weight(1f)
        )
        OtpBox(
            value = d1,
            onChange = { new ->
                val filtered = new.filter(Char::isDigit).take(1)
                if (filtered != d1) onD1(filtered)
                if (filtered.length == 1) next(1) else if (filtered.isEmpty()) prev(1)
            },
            requester = requesters[1],
            modifier = Modifier.weight(1f)
        )
        OtpBox(
            value = d2,
            onChange = { new ->
                val filtered = new.filter(Char::isDigit).take(1)
                if (filtered != d2) onD2(filtered)
                if (filtered.length == 1) next(2) else if (filtered.isEmpty()) prev(2)
            },
            requester = requesters[2],
            modifier = Modifier.weight(1f)
        )
        OtpBox(
            value = d3,
            onChange = { new ->
                val filtered = new.filter(Char::isDigit).take(1)
                if (filtered != d3) onD3(filtered)
                if (filtered.isEmpty()) prev(3)
            },
            requester = requesters[3],
            modifier = Modifier.weight(1f)
        )
    }
}

/* Previews */

@Preview(
    showBackground = true,
    widthDp = 360,
    backgroundColor = 0xFFF0F0F0,
    uiMode = Configuration.UI_MODE_NIGHT_NO,
    name = "OTP Code Input - Light"
)
@Composable
fun PreviewOtpCodeInput_Light() {
    var d0 by remember { mutableStateOf("") }
    var d1 by remember { mutableStateOf("") }
    var d2 by remember { mutableStateOf("") }
    var d3 by remember { mutableStateOf("") }

    AndroidTheme(darkTheme = false) {
        Surface(
            color = MaterialTheme.colorScheme.background
        ) {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(24.dp)
            ) {
                OtpCodeInput(
                    d0 = d0, onD0 = { d0 = it },
                    d1 = d1, onD1 = { d1 = it },
                    d2 = d2, onD2 = { d2 = it },
                    d3 = d3, onD3 = { d3 = it },
                    modifier = Modifier.fillMaxWidth()
                )
            }
        }
    }
}

@Preview(
    showBackground = true,
    widthDp = 360,
    backgroundColor = 0xFF000000,
    uiMode = Configuration.UI_MODE_NIGHT_YES,
    name = "OTP Code Input - Dark"
)
@Composable
fun PreviewOtpCodeInput_Dark() {
    var d0 by remember { mutableStateOf("9") }
    var d1 by remember { mutableStateOf("8") }
    var d2 by remember { mutableStateOf("7") }
    var d3 by remember { mutableStateOf("6") }

    AndroidTheme(darkTheme = true) {
        Surface(
            color = MaterialTheme.colorScheme.background
        ) {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(24.dp)
            ) {
                OtpCodeInput(
                    d0 = d0, onD0 = { d0 = it },
                    d1 = d1, onD1 = { d1 = it },
                    d2 = d2, onD2 = { d2 = it },
                    d3 = d3, onD3 = { d3 = it },
                    modifier = Modifier.fillMaxWidth()
                )
            }
        }
    }
}

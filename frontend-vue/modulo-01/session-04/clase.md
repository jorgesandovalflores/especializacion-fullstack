# 🏆 Clase 04: Instalación y Debugging en Vue.js

## 🎯 Objetivo de la Clase
Al finalizar esta sesión, los estudiantes podrán instalar y configurar Vue Devtools, depurar aplicaciones Vue.js de manera efectiva y aplicar mejores prácticas para optimizar el desarrollo.

⏳ **Duración:** 1h 30m

---

## 📌 Contenido de la Clase
1. **Instalación y configuración de Vue Devtools** 🛠️
2. **Debugging en Vue.js** 🐞
3. **Mejores prácticas en desarrollo con Vue.js** 🚀
4. **Preguntas y respuestas + cuestionario final** 📜

---

## 1️⃣ Instalación y Configuración de Vue Devtools 🛠️

### 🔹 ¿Qué es Vue Devtools?
Vue Devtools es una extensión para navegadores que permite inspeccionar y depurar aplicaciones Vue.js de manera visual e interactiva.

### 🔹 Instalación
#### **Google Chrome / Edge**
- Instalar la extensión desde [Chrome Web Store](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd?hl=es-419&utm_source=ext_sidebar)

#### **Firefox**
- Disponible en [Firefox Add-ons](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)

#### **Modo standalone** (útil si la extensión del navegador no funciona):
```bash
npm install -g @vue/devtools
vue-devtools
```
Luego abrir la aplicación desde el navegador y conectar a `localhost`.

### 🔹 Configuración en Vue 3 + Vite
Para habilitar Vue Devtools en un proyecto con Vite:
```typescript
import { createApp } from 'vue';
import App from './App.vue';

const app = createApp(App);
app.config.devtools = true;
app.mount('#app');
```

---

## 2️⃣ Debugging en Vue.js 🐞

### 🔹 Uso de `console.log` y Vue Devtools
`console.log` sigue siendo útil para debugging rápido, pero Vue Devtools permite inspeccionar el estado en tiempo real.

#### **Ejemplo en Vue 3 con Composition API**
```typescript
import { ref } from 'vue';

export default {
  setup() {
    const mensaje = ref("Hola, Vue Devtools!");
    console.log(mensaje.value); // Debug básico
    return { mensaje };
  }
};
```

### 🔹 Uso de Breakpoints con Chrome DevTools

1. Abrir DevTools (`F12` / `Ctrl+Shift+I`)
2. Ir a la pestaña **Sources**
3. Colocar un **breakpoint** en el código deseado
4. Recargar la aplicación y analizar el flujo

#### **Ejemplo con Debugger**
```typescript
setup() {
  const contador = ref(0);
  debugger; // Se detendrá la ejecución aquí
  contador.value++;
  return { contador };
}
```

### 🔹 Herramienta Vue Devtools en acción
1. **Componentes:** Ver la jerarquía de componentes
2. **Estado Reactivo:** Modificar datos en vivo
3. **Eventos:** Ver y disparar eventos manualmente

---

## 3️⃣ Mejores Prácticas en Vue.js 🚀

### 🔹 Organización del Código
- Usa **arquitectura basada en componentes**
- Separa la lógica en `setup()` o `methods`
- Mantén los archivos `.vue` **limpios y reutilizables**

#### **Ejemplo de estructura de un componente bien organizado**
```typescript
<script setup lang="ts">
import { ref, computed } from 'vue';

const contador = ref(0);
const incrementar = () => contador.value++;
const mensaje = computed(() => `El contador está en ${contador.value}`);
</script>

<template>
  <div>
    <p>{{ mensaje }}</p>
    <button @click="incrementar">Incrementar</button>
  </div>
</template>
```

### 🔹 Manejo de Estado con Vue Devtools
Podemos modificar `contador.value` desde Vue Devtools para ver cómo cambia la UI en vivo.

### 🔹 Errores Comunes a Evitar ❌
#### **No modificar `props` directamente**
```typescript
// ❌ INCORRECTO
props.valor = 10; // Esto causará un error

// ✅ CORRECTO
const nuevoValor = ref(props.valor);
nuevoValor.value = 10;
```

#### **Evitar manipulación del DOM manualmente**
```typescript
// ❌ NO RECOMENDADO
document.querySelector('#miElemento').innerText = 'Nuevo texto';

// ✅ USAR DIRECTIVAS
<template>
  <p>{{ mensaje }}</p>
</template>
```

#### **Usar `computed` en lugar de `watch` cuando sea posible**
```typescript
// ❌ USANDO WATCH
watch(precio, (nuevoValor) => {
  precioConImpuesto.value = nuevoValor * 1.18;
});

// ✅ USANDO COMPUTED
const precio = ref(100);
const precioConImpuesto = computed(() => precio.value * 1.18);
```

---

## 🎤 Preguntas y Respuestas + Cuestionario 📜

Al final de la clase, haremos un repaso interactivo donde:
✅ Resolveremos dudas
✅ Aplicaremos lo aprendido en pequeños ejercicios
✅ Responderemos un cuestionario de autoevaluación

---

¡Nos vemos en la próxima clase! 🚀

# Introducción a Props y Binding en Vue.js

Vue.js es un framework progresivo para construir interfaces de usuario que se basa en componentes reutilizables. Para permitir la comunicación entre estos componentes, Vue proporciona un mecanismo llamado **Props**, que permite a un componente padre enviar datos a un componente hijo.

En esta guía, exploraremos en profundidad **Props en Vue.js**, su sintaxis, reactividad, validación y algunas prácticas recomendadas.

---

## ✨ Qué son las Props en Vue.js

Las **props** (abreviación de "properties") en Vue.js permiten que un componente **padre** pase datos a un componente **hijo**.

Esto facilita la comunicación entre componentes y ayuda a construir aplicaciones escalables y modulares. Al utilizar props, un componente padre puede inyectar valores dinámicos en el hijo sin que éste dependa directamente del estado global o variables externas.

### 🔹 Características clave de las Props:
- **Unidireccionalidad**: Los datos fluyen del componente padre al hijo, lo que significa que el hijo **no debe modificar** directamente las props que recibe.
- **Definición explícita**: En Vue 3 con la API Composition, las props deben definirse usando `defineProps`.
- **Validación y valores por defecto**: Vue permite establecer tipos de datos y valores predeterminados para evitar errores en la aplicación.

---

## ✅ Definiendo Props en un Componente Hijo

Para definir props en Vue 3 con la API Composition y TypeScript, utilizamos la función `defineProps`. Esto nos permite especificar qué datos esperará el componente hijo desde su padre.

### 📝 **Ejemplo Básico de Props**

#### **Componente Hijo (ChildComponent.vue)**
```vue
<script setup lang="ts">
// Definimos la prop 'message' y su tipo
defineProps<{ message: string }>();
</script>

<template>
  <div style="display: flex; justify-content: center; align-items: center; height: 100px; border: 1px solid #ddd; padding: 10px;">
    <p>{{ message }}</p>
  </div>
</template>
```

#### **Componente Padre (ParentComponent.vue)**
```vue
<script setup lang="ts">
import ChildComponent from './ChildComponent.vue';

// Definimos una variable reactiva con el mensaje
const greeting = "¡Hola desde el padre!";
</script>

<template>
  <ChildComponent :message="greeting" />
</template>
```

En este ejemplo:
- `ParentComponent.vue` define una variable `greeting` y la pasa al hijo como prop `message`.
- `ChildComponent.vue` recibe `message` y lo muestra en la plantilla.

---

## 🔗 Binding de Props y Reactividad

Las props pueden enlazarse a variables reactivas utilizando `ref` o `computed`. Esto nos permite que las actualizaciones en el padre se reflejen inmediatamente en el hijo.

### 📊 **Ejemplo con `ref`**
```vue
<script setup lang="ts">
import { ref } from 'vue';
import ChildComponent from './ChildComponent.vue';

const dynamicMessage = ref("Mensaje inicial");
</script>

<template>
  <div style="text-align: center;">
    <input v-model="dynamicMessage" placeholder="Escribe un mensaje" style="margin-bottom: 10px; padding: 5px; border: 1px solid #ccc; border-radius: 5px;"/>
    <ChildComponent :message="dynamicMessage" />
  </div>
</template>
```

**✅ Explicación:**
- `dynamicMessage` es reactivo gracias a `ref`.
- Cada vez que el usuario escribe en el `input`, el valor se actualiza y se refleja en el hijo.

---

## 💌 Props con Valores por Defecto

Podemos asignar valores por defecto en caso de que la prop no sea proporcionada.

```vue
<script setup lang="ts">
defineProps<{ message?: string }>();
</script>

<template>
  <div style="text-align: center;">
    <p>{{ message || "Mensaje por defecto" }}</p>
  </div>
</template>
```

Si `message` no se proporciona desde el padre, el componente hijo mostrará "Mensaje por defecto".

---

## 🔍 Validación de Props

Vue permite validar las props con reglas de tipo y valores esperados. Esto es especialmente útil para evitar errores y garantizar que un componente reciba datos correctos.

```vue
<script setup lang="ts">
defineProps<{ count: number }>();
</script>

<template>
  <p style="text-align: center;">El contador es: {{ count }}</p>
</template>
```

En este caso, Vue mostrará una advertencia si `count` no es un número.

---

## 🛠️ Props Computadas

Podemos usar `computed` para derivar nuevas props basadas en las existentes.

```vue
<script setup lang="ts">
import { computed } from 'vue';

defineProps<{ name: string }>();
const uppercaseName = computed(() => name.toUpperCase());
</script>

<template>
  <p style="text-align: center;">Nombre en mayúsculas: {{ uppercaseName }}</p>
</template>
```

En este caso, `uppercaseName` transformará la prop `name` a mayúsculas sin modificar la prop original.

---

## 🚨 Modificación Incorrecta de Props

Las props son **de solo lectura**. Intentar modificarlas directamente dentro del componente hijo generará un error.

#### ❌ **Ejemplo Incorrecto:**
```vue
<script setup lang="ts">
const props = defineProps<{ count: number }>();

props.count++; // ❌ Esto generará un error
</script>
```

### ✅ **Solución: Usar Variables Locales**
Si necesitas modificar una prop dentro del hijo, usa una variable local:

```vue
<script setup lang="ts">
import { ref, watch } from 'vue';

defineProps<{ count: number }>();
const localCount = ref(props.count);

watch(() => props.count, (newVal) => {
  localCount.value = newVal;
});
</script>
```

---

## 🌟 Conclusión

- Las `props` permiten la comunicación **de padre a hijo**.
- Se pueden **validar** y establecer **valores por defecto**.
- Pueden ser **reactivas** si se usan con `ref` o `computed`.
- No se deben modificar directamente en el componente hijo.

**🔍 Próximo Tema:** Comunicación de Hijo a Padre con `emit`. 🚀


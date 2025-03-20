# Directivas Avanzadas y Renderizado Condicional en Vue.js con TypeScript

## 📌 v-for: Iteración sobre listas
La directiva `v-for` se usa para iterar sobre arreglos y objetos en Vue.js.

### Sintaxis básica
```vue
<template>
  <ul>
    <li v-for="(item, index) in items" :key="index">
      {{ index }} - {{ item.name }}
    </li>
  </ul>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const items = ref([
  { name: 'Manzana' },
  { name: 'Banana' },
  { name: 'Cereza' }
]);
</script>
```

### Iteración sobre objetos
```vue
<template>
  <ul>
    <li v-for="(value, key) in user" :key="key">
      {{ key }}: {{ value }}
    </li>
  </ul>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const user = ref({
  nombre: 'Juan',
  edad: 30,
  ciudad: 'Lima'
});
</script>
```

### Iteración sobre números
```vue
<template>
  <ul>
    <li v-for="n in 5" :key="n">
      Elemento {{ n }}
    </li>
  </ul>
</template>
```

## 📌 v-if, v-else-if, v-else vs v-show
Estas directivas permiten mostrar u ocultar elementos condicionalmente.

### Diferencias clave
- `v-if`: No renderiza el elemento en el DOM si la condición es falsa.
- `v-else-if`: Se usa para evaluar múltiples condiciones.
- `v-else`: Se ejecuta si ninguna de las condiciones anteriores se cumple.
- `v-show`: Mantiene el elemento en el DOM pero lo oculta con `display: none`.

### Uso de v-if, v-else-if y v-else
```vue
<template>
  <div>
    <p v-if="estado === 'activo'">El usuario está activo</p>
    <p v-else-if="estado === 'pendiente'">El usuario está pendiente</p>
    <p v-else>El usuario está inactivo</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const estado = ref('activo');
</script>
```

### Uso de v-show
```vue
<template>
  <p v-show="visible">Este texto se oculta con CSS</p>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const visible = ref(true);
</script>
```

### ¿Cuándo usar v-if o v-show?
- Usa `v-if` cuando la condición cambia poco frecuentemente (para optimizar rendimiento).
- Usa `v-show` cuando el elemento necesita ser mostrado/ocultado frecuentemente.

---
Este documento proporciona una introducción a las directivas avanzadas y renderizado condicional en Vue.js con TypeScript. 🚀
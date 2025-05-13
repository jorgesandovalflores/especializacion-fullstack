
# 🎓 Clase 01 - Módulo 04: Optimización de rendimiento en Vue.js

## 🎯 Objetivos

- Aplicar técnicas de mejora de rendimiento en proyectos Vue.js.
- Usar correctamente la reactividad para evitar renders innecesarios.
- Optimizar el renderizado de componentes en interfaces complejas.

---

## 1. 🧩 Técnicas de optimización de rendimiento

### 1.1 Lazy Loading de componentes

**¿Qué es?**  
Cargar un componente solo cuando es necesario, en lugar de incluirlo en el bundle principal.

**Antes (componente cargado siempre)**

```ts
import DetalleUsuario from './DetalleUsuario.vue';

export default {
  components: { DetalleUsuario }
}
```

**Después (Lazy Loading)**

```ts
import { defineAsyncComponent } from 'vue';

const DetalleUsuario = defineAsyncComponent(() =>
  import('./DetalleUsuario.vue')
);

export default {
  components: { DetalleUsuario }
}
```

**Ventaja:** El componente se carga solo cuando se usa. Esto reduce el tamaño del bundle inicial.

---

### 1.2 Debounce para eventos frecuentes

**¿Qué es?**  
Evita ejecutar una función muchas veces seguidas (por ejemplo, al escribir en un input).

**Sin debounce (mala práctica)**

```vue
<template>
  <input v-model="busqueda" @input="filtrar" />
</template>

<script setup lang="ts">
const busqueda = ref('');

function filtrar() {
  console.log('Filtrando:', busqueda.value);
}
</script>
```

**Con debounce (buena práctica)**

```vue
<template>
  <input v-model="busqueda" @input="filtrarDebounce" />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import debounce from 'lodash.debounce';

const busqueda = ref('');
const filtrar = () => console.log('Filtrando:', busqueda.value);
const filtrarDebounce = debounce(filtrar, 300);
</script>
```

**Ventaja:** Reduce llamadas innecesarias mientras el usuario escribe.

---

## 2. 🔁 Uso eficiente de reactividad y watchers

### 2.1 `computed` vs `watch`

| Característica   | `computed`                             | `watch`                                          |
|------------------|-----------------------------------------|--------------------------------------------------|
| Se cachea        | ✅ Sí                                   | ❌ No                                             |
| Uso ideal        | Derivar valores                         | Ejecutar funciones por efectos secundarios       |
| Complejidad      | Simple                                  | Requiere mayor control                           |

**Ejemplo práctico**

```vue
<script setup lang="ts">
import { ref, computed, watch } from 'vue';

const precio = ref(100);
const cantidad = ref(3);

// Computed para el total
const total = computed(() => precio.value * cantidad.value);

// Watch para hacer logging o API call
watch([precio, cantidad], () => {
  console.log('El total ha cambiado:', total.value);
});
</script>
```

**Regla general:** Usa `computed` para mostrar datos en pantalla, `watch` para ejecutar lógicas secundarias.

---

### 2.2 Evitar observación profunda innecesaria

Evita esto si no es necesario:

```ts
watch(objetoComplejo, () => {
  console.log('Cambio detectado');
}, { deep: true });
```

**Consejo:** Usa `deep: true` solo cuando el objeto tiene propiedades anidadas **y todas necesitan seguimiento**. Si solo necesitas una propiedad, observa esa directamente.

---

## 3. 🖼️ Reducción de carga en el renderizado de componentes

### 3.1 `v-if` vs `v-show`

| Instrucción | Cuándo usar                       | Qué hace internamente           |
|-------------|-----------------------------------|----------------------------------|
| `v-if`      | Cuando el contenido se muestra poco | Agrega/quita del DOM completamente |
| `v-show`    | Cuando el contenido se muestra seguido | Cambia solo `display: none`      |

**Ejemplo**

```vue
<template>
  <div v-if="modo === 'admin'">Panel Admin</div>
  <div v-show="mostrarTooltip">Ayuda</div>
</template>
```

---

### 3.2 Paginación en lugar de `v-for` largo

**Sin paginación: 👎**

```vue
<div v-for="producto in productos" :key="producto.id">
  {{ producto.nombre }}
</div>
```

**Con paginación: 👍**

```vue
<template>
  <div v-for="producto in productosPaginados" :key="producto.id">
    {{ producto.nombre }}
  </div>
  <button @click="pagina++">Siguiente</button>
</template>

<script setup lang="ts">
const productos = ref(Array.from({ length: 1000 }, (_, i) => ({ id: i, nombre: `Producto ${i}` })));
const pagina = ref(1);
const porPagina = 10;

const productosPaginados = computed(() =>
  productos.value.slice((pagina.value - 1) * porPagina, pagina.value * porPagina)
);
</script>
```

---

### 3.3 Listado virtual con `vue-virtual-scroller`

**Instalación:**

```bash
npm install vue-virtual-scroller
```

**Uso:**

```vue
<template>
  <RecycleScroller
    :items="items"
    :item-size="50"
    key-field="id"
    class="scroller"
  >
    <template #default="{ item }">
      <div class="item">{{ item.nombre }}</div>
    </template>
  </RecycleScroller>
</template>

<script setup lang="ts">
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css';
import { RecycleScroller } from 'vue-virtual-scroller';

const items = Array.from({ length: 1000 }, (_, i) => ({ id: i, nombre: `Item ${i}` }));
</script>
```

**Ventaja:** Solo renderiza lo que está en pantalla, ideal para listas grandes.

---

## 🧪 Actividad práctica paso a paso

### Objetivo:
Implementar búsqueda optimizada y paginación de productos en Vue.js

1. Crear un array de 100 productos
2. Agregar un campo de búsqueda (con debounce)
3. Filtrar con `computed` los productos según búsqueda
4. Mostrar solo 10 productos por página (paginación)
5. Agregar botón siguiente y anterior

---

## 📌 Resumen

| Tema                               | Qué aprendimos                                            |
|------------------------------------|------------------------------------------------------------|
| Técnicas de rendimiento            | Lazy load, paginación, memoización, throttle/debounce     |
| Uso eficiente de reactividad       | Evitar `watch` innecesarios, usar `computed` y `ref`      |
| Optimización en renderizado        | Paginación, virtual scroller, uso correcto de `key`       |

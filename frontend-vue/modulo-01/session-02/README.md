# Módulo 01 – Fundamentos de Vue.js
## Clase 02: Estructura y reactividad en Vue.js

---

## Objetivos de la clase

Al finalizar esta clase, el alumno será capaz de:

- Comprender cómo Vue renderiza y reacciona a los cambios de estado.
- Usar directivas avanzadas para controlar el DOM de forma declarativa.
- Diferenciar y aplicar correctamente `methods`, `computed` y `watch`.
- Implementar eventos personalizados para comunicar componentes.

---

## Contenido de la clase

1. Reactividad en Vue.js  
2. Directivas avanzadas y renderizado condicional  
   - `v-if`, `v-else`, `v-show`  
   - `v-for` con claves  
   - `v-bind` y `v-model` avanzado  
3. Uso de métodos, computed properties y watchers  
   - `methods`  
   - `computed`  
   - `watch` y `watchEffect`  
4. Manejo de eventos personalizados

---

## 1. Reactividad en Vue.js

### ¿Qué es la reactividad?

La **reactividad** es el mecanismo que permite que la vista se actualice automáticamente cuando cambia el estado de la aplicación.

En Vue 3, la reactividad está basada en **Proxies** de JavaScript. Vue intercepta los accesos y modificaciones a los datos reactivos para saber cuándo debe actualizar el DOM.

```ts
const count = ref(0);
```

Cuando `count.value` cambia:

- Vue detecta el cambio
- Identifica qué partes del template dependen de ese valor
- Actualiza únicamente esas partes del DOM

Esto hace que Vue sea eficiente y evite renders completos innecesarios.

---

### `ref` vs `reactive`

Vue ofrece dos formas principales de definir estado reactivo.

```ts
const name = ref("Juan");

const user = reactive({
    name: "Juan",
    age: 30
});
```

| Característica | `ref` | `reactive` |
|--------------|------|-----------|
| Tipo de datos | Primitivos y objetos | Solo objetos |
| Acceso | `.value` | Directo |
| Uso común | Flags, contadores | Formularios, modelos |

**Buenas prácticas**

- Usar `ref` para valores simples
- Usar `reactive` para estructuras complejas

---

## 2. Directivas avanzadas y renderizado condicional

### `v-if`, `v-else` y `v-show`

```html
<p v-if="isLogged">Bienvenido</p>
<p v-show="isLogged">Bienvenido</p>
```

| Directiva | Comportamiento |
|---------|---------------|
| `v-if` | Crea y destruye el DOM |
| `v-show` | Solo oculta usando CSS |

**Criterio de uso**

- `v-if`: condiciones poco frecuentes
- `v-show`: cambios frecuentes (tabs, modales)

---

### `v-for` y la importancia de `key`

```html
<li v-for="item in items" :key="item.id">
    {{ item.name }}
</li>
```

El atributo `key` permite que Vue:

- Identifique cada elemento de forma única
- Optimice el renderizado
- Mantenga el estado interno de cada nodo

Nunca se debe usar el índice como `key` en listas dinámicas.

---

### `v-bind` avanzado

```html
<img :src="imageUrl" :alt="title" />

<button :disabled="loading">
    Guardar
</button>
```

Uso con objetos:

```html
<div :class="{ active: isActive, error: hasError }"></div>
```

Vue evaluará cada propiedad y aplicará las clases dinámicamente.

---

### `v-model` (visión interna)

```html
<input v-model="email" />
```

Equivale a:

```html
<input
    :value="email"
    @input="email = $event.target.value"
/>
```

Este concepto es fundamental para entender `v-model` en componentes personalizados más adelante.

---

## 3. Métodos, computed properties y watchers

Este punto es uno de los más importantes para evitar problemas de rendimiento y errores de diseño.

---

### `methods`

Los métodos contienen lógica ejecutable.

```ts
const fullName = () => {
    return `${name.value} ${lastName.value}`;
};
```

Los métodos se ejecutan **cada vez que el componente renderiza**, incluso si los valores no han cambiado.

---

### `computed`

Las propiedades computadas representan **valores derivados**.

```ts
const fullName = computed(() => {
    return `${name.value} ${lastName.value}`;
});
```

Características clave:

- Se cachean automáticamente
- Solo se recalculan si cambian sus dependencias
- Son ideales para lógica basada en estado

Uso en template:

```html
<p>{{ fullName }}</p>
```

**Regla práctica**  
Si un valor depende de otros valores reactivos, debe ser `computed`.

---

### `watch`

`watch` permite reaccionar a cambios específicos.

```ts
watch(name, (newValue, oldValue) => {
    console.log(oldValue, newValue);
});
```

Casos de uso comunes:

- Validaciones
- Llamadas a API
- Logs
- Sincronización externa

---

### `watch` con múltiples fuentes

```ts
watch([name, lastName], () => {
    console.log("Alguno cambió");
});
```

---

### `watchEffect`

```ts
watchEffect(() => {
    console.log(name.value);
});
```

| `watch` | `watchEffect` |
|------|-------------|
| Dependencias explícitas | Dependencias automáticas |
| Más control | Más reactivo |
| Ideal para lógica controlada | Ideal para efectos colaterales |

---

## 4. Manejo de eventos personalizados

Los eventos personalizados permiten comunicar componentes, especialmente de **hijo a padre**.

---

### Emisión de eventos en un componente hijo

```ts
const emit = defineEmits<{
    (e: "save", value: string): void;
}>();

const save = () => {
    emit("save", "ok");
};
```

```html
<button @click="save">Guardar</button>
```

---

### Escucha del evento en el componente padre

```html
<ChildComponent @save="onSave" />
```

```ts
const onSave = (value: string) => {
    console.log(value);
};
```

---

### Buenas prácticas con eventos

- Usar nombres claros y semánticos (`save`, `close`, `submit`)
- Evitar lógica de negocio en el componente hijo
- El padre controla el flujo y las decisiones

---

## Resumen conceptual

| Concepto | Uso recomendado |
|--------|----------------|
| `ref` | Estado simple |
| `reactive` | Modelos complejos |
| `computed` | Valores derivados |
| `watch` | Efectos secundarios |
| `emit` | Comunicación ascendente |


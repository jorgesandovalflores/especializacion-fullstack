# Comunicación entre Componentes: Props y Emits

En Vue.js, la comunicación entre componentes es esencial para construir aplicaciones modulares y reutilizables. Existen dos formas principales de pasar datos entre componentes:

- **Props:** Permiten que un componente padre envíe datos a un componente hijo.
- **Emits:** Permiten que un componente hijo envíe eventos al padre para notificarle cambios.

En esta guía, exploraremos en profundidad el uso de **Props y Emits** en Vue.js, su sintaxis, reactividad y mejores prácticas.

---

## 🏗️ Comunicación de Padre a Hijo con Props

Las **props** son la forma principal en la que un componente padre puede enviar datos a un componente hijo.

### 📌 Características clave de las Props:
- **Unidireccionalidad:** Los datos fluyen del padre al hijo.
- **Inmutabilidad:** El hijo **no puede modificar** las props directamente.
- **Definición explícita:** En Vue 3 con la API Composition, las props se definen con `defineProps`.

### 📝 **Ejemplo Básico de Props**

#### **Componente Hijo (ChildComponent.vue)**
```vue
<script setup lang="ts">
// Definimos la prop 'message' y su tipo
defineProps<{ message: string }>();
</script>

<template>
  <div class="box">
    <p>{{ message }}</p>
  </div>
</template>

<style>
.box {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
  border: 1px solid #ddd;
  padding: 10px;
  text-align: center;
}
</style>
```

#### **Componente Padre (ParentComponent.vue)**
```vue
<script setup lang="ts">
import ChildComponent from './ChildComponent.vue';
const greeting = "¡Hola desde el padre!";
</script>

<template>
  <ChildComponent :message="greeting" />
</template>
```

---

## 🔄 Comunicación de Hijo a Padre con Emits

Cuando un componente hijo necesita enviar información de vuelta al padre, utilizamos eventos con `emit`.

### 📌 Características clave de los Emits:
- Permiten que el hijo **notifique cambios** al padre.
- Son ideales para capturar eventos como clics, cambios de datos, etc.
- Se definen en Vue 3 usando `defineEmits`.

### 📝 **Ejemplo Básico de Emits**

#### **Componente Hijo (ChildComponent.vue)**
```vue
<script setup lang="ts">
const emit = defineEmits<["update-message"]>();
</script>

<template>
  <button class="btn" @click="emit('update-message', 'Nuevo mensaje desde el hijo!')">
    Enviar Mensaje al Padre
  </button>
</template>

<style>
.btn {
  padding: 10px 20px;
  background-color: #42b983;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 5px;
}
.btn:hover {
  background-color: #369a72;
}
</style>
```

#### **Componente Padre (ParentComponent.vue)**
```vue
<script setup lang="ts">
import { ref } from 'vue';
import ChildComponent from './ChildComponent.vue';

const message = ref("Mensaje inicial");
</script>

<template>
  <div>
    <p>{{ message }}</p>
    <ChildComponent @update-message="message = $event" />
  </div>
</template>
```

---

## 🛠️ Conclusión

- **Props** permiten la comunicación **de padre a hijo**.
- **Emits** permiten la comunicación **de hijo a padre**.
- Vue proporciona validación y control de estos mecanismos para evitar errores.

**🔍 Próximo Tema:** Comunicación entre Componentes Hermanos con Vuex o Pinia 🚀


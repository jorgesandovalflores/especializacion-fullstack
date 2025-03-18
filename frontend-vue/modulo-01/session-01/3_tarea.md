# Tareas de Vue.js con TypeScript

## Tarea 1: Creación de un Contador

### **Objetivo**
Implementar un contador que incremente y decremente su valor utilizando Vue 3 con Composition API y TypeScript.

### **Instrucciones**
Completa el siguiente código para que el contador funcione correctamente.

```typescript
<script setup lang="ts">
import { ref } from 'vue';

const count = ref(0);

const increment = () => {
  // Implementar la función de incremento
};

const decrement = () => {
  // Implementar la función de decremento
};
</script>

<template>
  <div>
    <h2>Contador: {{ count }}</h2>
    <button @click="increment">+</button>
    <button @click="decrement">-</button>
  </div>
</template>
```

## Tarea 2: Lista de tareas (To-Do List) con Vue 3 y TypeScript

### **Objetivo**
Crear una lista de tareas donde el usuario pueda agregar y eliminar elementos.

### **Instrucciones**
Completa el código agregando la lógica para manejar la lista de tareas.

```typescript
<script setup lang="ts">
import { ref } from 'vue';

interface Task {
  id: number;
  text: string;
}

const tasks = ref<Task[]>([]);
const newTask = ref<string>('');

const addTask = () => {
  // Implementar la función para agregar una tarea
};

const removeTask = (id: number) => {
  // Implementar la función para eliminar una tarea
};
</script>

<template>
  <div>
    <input v-model="newTask" placeholder="Nueva tarea" />
    <button @click="addTask">Agregar</button>

    <ul>
      <li v-for="task in tasks" :key="task.id">
        {{ task.text }}
        <button @click="removeTask(task.id)">Eliminar</button>
      </li>
    </ul>
  </div>
</template>
```
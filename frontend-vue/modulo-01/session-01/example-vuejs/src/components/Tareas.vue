<script setup lang="ts">
import { ref } from 'vue';

interface Task {
  id: number;
  text: string;
}

const tasks = ref<Task[]>([]);
const newTask = ref<string>('');

const addTask = () => {
  if (newTask.value.trim() === '') return;
  tasks.value.push({ id: Date.now(), text: newTask.value.trim() });
  newTask.value = '';
};

const removeTask = (id: number) => {
  tasks.value = tasks.value.filter(task => task.id !== id);
};
</script>

<template>
    <div class="container">
        <h2>Lista de Tareas</h2>
        <div class="input-group">
            <input v-model="newTask" placeholder="Nueva tarea" />
            <button @click="addTask">Agregar</button>
        </div>
        <ul>
            <li v-for="task in tasks" :key="task.id" class="task-item">
                {{ task.text }}
                <button @click="removeTask(task.id)">Eliminar</button>
            </li>
        </ul>
    </div>
</template>

<style scoped>
.container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    text-align: center;
}

.input-group {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
}

input {
    padding: 8px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 5px;
}

button {
    padding: 8px 15px;
    font-size: 16px;
    cursor: pointer;
    border: none;
    border-radius: 5px;
    background-color: #007bff;
    color: white;
    transition: background-color 0.3s;
}

button:hover {
    background-color: #0056b3;
}

ul {
    list-style: none;
    padding: 0;
}

.task-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #1a1a1a;
    padding: 10px;
    margin: 5px 0;
    border-radius: 5px;
    width: 300px;
}
</style>
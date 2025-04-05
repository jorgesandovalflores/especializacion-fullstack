<script setup lang="ts">
// Usa uno u otro store aquí:
import { useTodoPersist as useTodoPersist } from '../stores/todoPersist'
//import { useTodoStorageStore as useTodoStore } from '../stores/todoStorage'
// import { useTodoGlobalStore as useTodoStore } from '../stores/todoGlobal'

import { ref } from 'vue'

const todoStore = useTodoPersist()
const newTodo = ref('')

function add() {
	if (newTodo.value.trim()) {
		todoStore.addTodo(newTodo.value)
		newTodo.value = ''
	}
}

function remove(id: number) {
	if (confirm('¿Estás seguro de eliminar esta tarea?')) {
		todoStore.removeTodo(id)
	}
}
</script>

<template>
	<div class="todo-container">
		<h2>📝 Mi Lista de Tareas</h2>

		<form @submit.prevent="add" class="form">
			<input v-model="newTodo" placeholder="Nueva tarea..." />
			<button type="submit">Agregar</button>
		</form>

		<ul class="todo-list">
			<li v-for="todo in todoStore.todos" :key="todo.id" :class="{ done: todo.done }">
				<span @click="todoStore.toggleTodo(todo.id)">{{ todo.text }}</span>
				<button @click="remove(todo.id)">❌</button>
			</li>
		</ul>
	</div>
</template>

<style scoped>
.todo-container {
	max-width: 400px;
	margin: 2rem auto;
	padding: 1rem;
	border: 1px solid #ddd;
	border-radius: 8px;
	text-align: center;
	box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.form {
	display: flex;
	justify-content: center;
	gap: 0.5rem;
	margin-bottom: 1rem;
}

input {
	flex: 1;
	padding: 0.5rem;
	border: 1px solid #ccc;
	border-radius: 4px;
}

button {
	padding: 0.5rem 1rem;
	cursor: pointer;
}

.todo-list {
	list-style: none;
	padding: 0;
}

.todo-list li {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 0.5rem;
	border-bottom: 1px solid #eee;
}

.todo-list li.done span {
	text-decoration: line-through;
	color: #888;
	cursor: pointer;
}

.todo-list li span {
	cursor: pointer;
}
</style>
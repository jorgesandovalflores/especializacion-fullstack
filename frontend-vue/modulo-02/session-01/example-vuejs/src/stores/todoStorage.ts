import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

interface Todo {
	id: number
	text: string
	done: boolean
}

export const useTodoStorageStore = defineStore('todoStorage', () => {
	const todos = ref<Todo[]>(JSON.parse(localStorage.getItem('todos') || '[]'))

	function addTodo(text: string) {
		todos.value.push({ id: Date.now(), text, done: false })
	}

	function toggleTodo(id: number) {
		const todo = todos.value.find(t => t.id === id)
		if (todo) todo.done = !todo.done
	}

	function removeTodo(id: number) {
		todos.value = todos.value.filter(t => t.id !== id)
	}

	watch(todos, (newTodos) => {
		localStorage.setItem('todos', JSON.stringify(newTodos))
	}, { deep: true })

	return { todos, addTodo, toggleTodo, removeTodo }
})
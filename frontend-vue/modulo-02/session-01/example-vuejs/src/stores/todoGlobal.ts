import { defineStore } from 'pinia'
import { ref } from 'vue'

interface Todo {
	id: number
	text: string
	done: boolean
}

export const useTodoGlobalStore = defineStore('todoGlobal', () => {
	const todos = ref<Todo[]>([])

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

	return { todos, addTodo, toggleTodo, removeTodo }
})
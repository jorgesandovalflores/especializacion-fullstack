// stores/storageCounter.ts
import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useStorageCounterStore = defineStore('storageCounter', () => {
	// Leer del localStorage al iniciar
	const stored = localStorage.getItem('counter')
	const count = ref(stored ? Number(stored) : 0)

	function increment() {
		count.value++
	}

	// Guardar en localStorage cada vez que cambia
	watch(count, (newVal) => {
		localStorage.setItem('counter', newVal.toString())
	})

	return { count, increment }
})

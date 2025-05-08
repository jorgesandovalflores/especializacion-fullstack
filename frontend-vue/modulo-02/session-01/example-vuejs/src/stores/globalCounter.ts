// stores/globalCounter.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useGlobalCounterStore = defineStore('globalCounter', () => {
	const count = ref(0)

	function increment() {
		count.value++
	}

	return { count, increment }
})
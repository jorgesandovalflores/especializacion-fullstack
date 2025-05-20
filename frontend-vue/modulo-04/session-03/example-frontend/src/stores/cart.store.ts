// src/stores/cart.store.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Product } from './product.store'

export const useCartStore = defineStore('cart', () => {
	const cart = ref<Product[]>([])

	const addToCart = (product: Product) => {
		cart.value.push(product)
	}

	const removeFromCart = (id: string) => {
		cart.value = cart.value.filter(p => p.id !== id)
	}

	const total = computed(() =>
		cart.value.reduce((acc, item) => acc + item.price, 0)
	)

	return { cart, addToCart, removeFromCart, total }
})

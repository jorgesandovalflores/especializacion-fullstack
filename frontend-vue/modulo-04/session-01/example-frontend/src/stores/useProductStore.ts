import { defineStore } from 'pinia'
import type { Product } from '../types/Product'

function generateProducts(): Product[] {
	return Array.from({ length: 1000 }, (_, i) => ({
		id: i + 1,
		name: `Product ${i + 1}`,
		description: `Description of product ${i + 1}`,
		price: +(Math.random() * 100).toFixed(2)
	}))
}

export const useProductStore = defineStore('product', () => {
	const products = generateProducts()
	return { products }
})

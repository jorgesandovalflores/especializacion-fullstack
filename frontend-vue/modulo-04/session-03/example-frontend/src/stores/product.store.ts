// src/stores/product.store.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'

export type Product = {
	id: string
	name: string
	price: number
	image: string
}

export const useProductStore = defineStore('product', () => {
	const products = ref<Product[]>([
		{ id: '1', name: 'Laptop Gamer', price: 4200, image: 'https://picsum.photos/150?random=1' },
		{ id: '2', name: 'Teclado Mecánico', price: 250, image: 'https://picsum.photos/150?random=2' },
		{ id: '3', name: 'Mouse Inalámbrico', price: 180, image: 'https://picsum.photos/150?random=3' },
		{ id: '4', name: 'Monitor 24\"', price: 700, image: 'https://picsum.photos/150?random=4' },
		{ id: '5', name: 'Disco SSD 1TB', price: 480, image: 'https://picsum.photos/150?random=5' },
		{ id: '6', name: 'Tarjeta Gráfica RTX 3060', price: 2200, image: 'https://picsum.photos/150?random=6' },
		{ id: '7', name: 'Memoria RAM 16GB', price: 320, image: 'https://picsum.photos/150?random=7' },
		{ id: '8', name: 'Audífonos Bluetooth', price: 150, image: 'https://picsum.photos/150?random=8' },
		{ id: '9', name: 'Silla Ergonómica', price: 860, image: 'https://picsum.photos/150?random=9' },
		{ id: '10', name: 'Webcam Full HD', price: 220, image: 'https://picsum.photos/150?random=10' },
		{ id: '11', name: 'Hub USB-C', price: 90, image: 'https://picsum.photos/150?random=11' },
		{ id: '12', name: 'Tablet Android', price: 950, image: 'https://picsum.photos/150?random=12' },
		{ id: '13', name: 'Smartwatch', price: 400, image: 'https://picsum.photos/150?random=13' },
		{ id: '14', name: 'Impresora Multifuncional', price: 580, image: 'https://picsum.photos/150?random=14' },
		{ id: '15', name: 'Router WiFi 6', price: 300, image: 'https://picsum.photos/150?random=15' },
		{ id: '16', name: 'Cámara de Seguridad', price: 210, image: 'https://picsum.photos/150?random=16' },
		{ id: '17', name: 'Micrófono Profesional', price: 470, image: 'https://picsum.photos/150?random=17' },
		{ id: '18', name: 'Disco Duro Externo 2TB', price: 360, image: 'https://picsum.photos/150?random=18' },
		{ id: '19', name: 'Cargador Universal', price: 110, image: 'https://picsum.photos/150?random=19' },
		{ id: '20', name: 'Soporte para Laptop', price: 140, image: 'https://picsum.photos/150?random=20' },
	])


	return { products }
})

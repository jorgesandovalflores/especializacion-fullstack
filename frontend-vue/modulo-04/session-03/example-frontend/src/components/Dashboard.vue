<!-- src/views/Dashboard.vue -->
<template>
	<div class="container py-4">
		<h2 class="mb-4">🛍️ Dashboard de Pedidos</h2>
		<ProductList />
		<hr />
		<CartView />
		<hr />
		<CheckoutForm />
	</div>
</template>

<script setup lang="ts">
import ProductList from '../components/ProductList.vue'
import CartView from '../components/CartView.vue'
import CheckoutForm from '../components/CheckoutForm.vue'
import { onMounted } from 'vue'

onMounted(()=> {
	throw new Error('Este es un error de prueba para Sentry')
})
</script>
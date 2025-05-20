<!-- src/components/CheckoutForm.vue -->
<template>
	<form @submit.prevent="submitOrder">
		<h4>📦 Finalizar pedido</h4>
		<div class="mb-3">
			<label class="form-label">Nombre</label>
			<input type="text" class="form-control" v-model="name" required />
		</div>
		<div class="mb-3">
			<label class="form-label">Correo</label>
			<input type="email" class="form-control" v-model="email" required />
		</div>
		<button class="btn btn-success w-100" type="submit">Confirmar pedido</button>
	</form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useCartStore } from '../stores/cart.store'

const name = ref('')
const email = ref('')
const cart = useCartStore()

const submitOrder = () => {
	alert(`Pedido confirmado para ${name.value} por un total de S/ ${cart.total}`)
	cart.cart = [] // vaciar carrito
}
</script>

<!-- src/components/CartView.vue -->
<template>
	<div>
		<h4>🛒 Carrito de compras</h4>
		<ul class="list-group mb-3">
			<li class="list-group-item d-flex justify-content-between align-items-center" v-for="item in cart.cart" :key="item.id">
				{{ item.name }}
				<span>S/ {{ item.price }}</span>
				<button class="btn btn-danger btn-sm" @click="cart.removeFromCart(item.id)">✕</button>
			</li>
		</ul>
		<div class="text-end fw-bold">
			Total: S/ {{ cart.total }}
		</div>
	</div>
</template>

<script setup lang="ts">
import { useCartStore } from '../stores/cart.store'
const cart = useCartStore()
</script>

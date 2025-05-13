<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { useProductStore } from '../stores/useProductStore'
import { computed } from 'vue'

const route = useRoute()
const router = useRouter()
const store = useProductStore()

const product = computed(() =>
	store.products.find(p => p.id === Number(route.params.id))
)
</script>

<template>
	<div class="container py-4">
		<div v-if="product">
			<h2>{{ product.name }}</h2>
			<p>{{ product.description }}</p>
			<p><strong>Precio:</strong> S/ {{ product.price }}</p>

			<button class="btn btn-primary" @click="router.push('/')">
				Volver al listado
			</button>
		</div>
		<div v-else>
			<p>Producto no encontrado</p>
			<button class="btn btn-secondary" @click="router.push('/')">
				Volver al listado
			</button>
		</div>
	</div>
</template>

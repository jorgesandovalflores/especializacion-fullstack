<script setup lang="ts">
import type { Product } from '../types/Product'
defineProps<{ product: Product }>()
</script>

<template>
	<div class="col-md-4 mb-3">
		<div class="card h-100" role="button">
			<div class="card-body">
				<h5 class="card-title">{{ product.name }}</h5>
				<p class="card-text">{{ product.description }}</p>
				<span class="badge bg-primary">S/ {{ product.price }}</span>
			</div>
		</div>
	</div>
</template>

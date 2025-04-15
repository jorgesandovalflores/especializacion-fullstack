<template>
	<div class="center">
		<h2>Zona protegida</h2>
		<p>Simulando un 401...</p>
	</div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import api from '../utils/api'

onMounted(async () => {
	await api.get('/unauthorized')
})
</script>

<style scoped>
.center {
	text-align: center;
	margin-top: 3rem;
}
</style>
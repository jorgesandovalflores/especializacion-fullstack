<template>
	<div class="center">
		<h2>Bienvenido a Home</h2>
		<button @click="logout">Cerrar sesión</button>
	</div>
</template>

<script setup lang="ts">
import { useAuthStore } from '../stores/auth'

const { logout } = useAuthStore()
</script>

<style scoped>
.center {
	text-align: center;
	margin-top: 3rem;
}
button {
	padding: 0.5rem 1rem;
	margin-top: 1rem;
}
</style>
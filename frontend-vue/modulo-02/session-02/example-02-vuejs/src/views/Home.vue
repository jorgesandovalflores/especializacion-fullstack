<template>
	<div class="container">
		<h1>Bienvenido al Home</h1>
		<p>Has iniciado sesión correctamente.</p>
		<button @click="handleLogout">Cerrar sesión</button>
	</div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuth } from '../stores/auth'

const router = useRouter()
const { logout } = useAuth()

function handleLogout() {
	logout()
	router.push('/')
}
</script>

<style scoped>
.container {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	min-height: 100vh;
	text-align: center;
}
button {
	padding: 10px 20px;
	cursor: pointer;
	margin-top: 20px;
}
</style>

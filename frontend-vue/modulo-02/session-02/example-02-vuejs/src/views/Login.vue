<template>
	<div class="container">
		<h1>Iniciar sesión</h1>
		<button @click="handleLogin">Entrar</button>
	</div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuth } from '../stores/auth'

const router = useRouter()
const { login } = useAuth()

function handleLogin() {
	login()
	router.push('/home')
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
}
</style>

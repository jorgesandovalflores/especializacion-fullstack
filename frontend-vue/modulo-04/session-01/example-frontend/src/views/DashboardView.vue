<template>
	<div class="container mt-5">
		<h3>Bienvenido, {{ auth.user?.email }}</h3>
		<button class="btn btn-danger mt-3" @click="logout">Cerrar Sesión</button>
	</div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth.store'

const auth = useAuthStore()
const router = useRouter()

onMounted(async () => {
	if (!auth.user) {
		try {
			await auth.fetchProfile()
		} catch {
			auth.logout()
			router.push('/login')
		}
	}
})

const logout = () => {
	auth.logout()
	router.push('/login')
}
</script>

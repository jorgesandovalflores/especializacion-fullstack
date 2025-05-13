<template>
	<div class="container mt-5">
		<div class="row justify-content-center">
			<div class="col-md-4">
				<h3 class="mb-3">Iniciar Sesión</h3>
				<form @submit.prevent="handleLogin">
					<div class="mb-3">
						<label class="form-label">Email</label>
						<input type="email" v-model="email" class="form-control" required />
					</div>
					<div class="mb-3">
						<label class="form-label">Password</label>
						<input type="password" v-model="password" class="form-control" required />
					</div>
					<button class="btn btn-primary w-100" :disabled="loading">
						{{ loading ? 'Ingresando...' : 'Ingresar' }}
					</button>
				</form>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth.store'

const email = ref('')
const password = ref('')
const loading = ref(false)
const router = useRouter()
const auth = useAuthStore()

const handleLogin = async () => {
	loading.value = true
	try {
		await auth.login(email.value, password.value)
		await auth.fetchProfile()
		router.push('/dashboard')
	} catch (err) {
		alert('Credenciales inválidas')
	} finally {
		loading.value = false
	}
}
</script>

<template>
	<div class="min-h-screen flex items-center justify-center bg-[#e5ddd5]">
		<div class="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
			<!-- Header visual -->
			<div class="bg-[#075e54] text-white text-center py-3 rounded-t-2xl -mt-8 -mx-8 mb-6 shadow">
				<h1 class="text-2xl font-bold">Iniciar Sesión</h1>
			</div>

			<label for="username" class="block text-sm font-medium text-gray-700 mb-2">
				Nombre de usuario
			</label>
			<input
				id="username"
				v-model="username"
				type="text"
				placeholder="Escribe tu nombre"
				class="w-full border border-gray-300 px-4 py-2 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-[#25d366]"
			/>

			<button
				@click="handleLogin"
				:disabled="!username.trim()"
				class="w-full bg-[#25d366] text-[#083f2e] py-2 rounded-lg font-semibold hover:bg-[#20b457] transition disabled:opacity-50 disabled:cursor-not-allowed"
			>
				Entrar al chat
			</button>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/store/useAuth'

const router = useRouter()
const auth = useAuth()
const username = ref('')

const handleLogin = () => {
	if (!username.value.trim()) return
	auth.login(username.value.trim())
	router.push('/chat')
}
</script>

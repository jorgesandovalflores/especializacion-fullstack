import { defineStore } from 'pinia'
import { ref } from 'vue'
import { UserService } from '../services/UserService'
import type { ModelUser } from '../common/models/ModelUser'
import router from '../router'

export const useAuthStore = defineStore('auth', () => {
	const token = ref<string | null>(localStorage.getItem('token'))
	const user = ref<ModelUser | null>(null)

	const login = async (email: string, password: string) => {
		try {
			const res = await UserService.signin({email, password})
			token.value = res.token
			user.value = res.user
			localStorage.setItem('token', res.token)
            router.push('/users')
		} catch (e) {
			alert('Credenciales inválidas')
		}
	}

	const logout = () => {
		token.value = null
		user.value = null
		localStorage.removeItem('token')
		router.push('/login')
	}

	return { token, user, login, logout }
})
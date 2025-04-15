import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '../utils/api'
import router from '../router'

export const useAuthStore = defineStore('auth', () => {
	const token = ref<string | null>(localStorage.getItem('token'))
	const user = ref<string | null>(null)

	const login = async (email: string, password: string) => {
		try {
			const res = await api.get(`/Users/124`)
			token.value = res.password
			user.value = res.name
			localStorage.setItem('token', res.token)
			router.push('/home')
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
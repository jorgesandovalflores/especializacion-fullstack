import { defineStore } from 'pinia'
import { api } from '../utils/api'

export const useAuthStore = defineStore('auth', {
	state: () => ({
		accessToken: localStorage.getItem('access_token') || '',
		user: null as null | { email: string },
	}),
	getters: {
		isAuthenticated: state => !!state.accessToken,
	},
	actions: {
		async login(email: string, password: string) {
			const res = await api.post('/auth/login', { email, password })
			this.accessToken = res.data.access_token
			localStorage.setItem('access_token', this.accessToken)
		},
		async fetchProfile() {
			const res = await api.get('/user/me')
			this.user = res.data
		},
		logout() {
			this.accessToken = ''
			this.user = null
			localStorage.removeItem('access_token')
		},
	},
})

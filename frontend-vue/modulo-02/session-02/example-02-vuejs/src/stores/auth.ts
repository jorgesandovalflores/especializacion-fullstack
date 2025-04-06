import { ref } from 'vue'

const user = ref(localStorage.getItem('user') === 'true')

export function useAuth() {
	function login() {
		user.value = true
		localStorage.setItem('user', 'true')
	}

	function logout() {
		user.value = false
		localStorage.removeItem('user')
	}

	function isAuthenticated() {
		return user.value
	}

	return { login, logout, isAuthenticated }
}
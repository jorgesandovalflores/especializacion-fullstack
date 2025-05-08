import axios from 'axios'
import { useAuthStore } from '../stores/auth.store'

export const api = axios.create({
	baseURL: 'http://localhost:3000',
	withCredentials: true,
})

api.interceptors.request.use(config => {
	const auth = useAuthStore()
	if (auth.accessToken) {
		config.headers.Authorization = `Bearer ${auth.accessToken}`
	}
	return config
})

let isRefreshing = false
let queue: any[] = []

api.interceptors.response.use(
	res => res,
	async error => {
		const originalRequest = error.config
		const auth = useAuthStore()

		if (
			error.response?.status === 401 &&
			!originalRequest._retry
		) {
			originalRequest._retry = true

			if (isRefreshing) {
				return new Promise((resolve, reject) => {
					queue.push({ resolve, reject })
				}).then(token => {
					originalRequest.headers.Authorization = `Bearer ${token}`
					return api(originalRequest)
				})
			}

			isRefreshing = true

			try {
				const res = await axios.post('http://localhost:3000/auth/refresh', null, {
					withCredentials: true,
				})

				const newToken = res.data.access_token
				auth.accessToken = newToken
				localStorage.setItem('access_token', newToken)

				queue.forEach(p => p.resolve(newToken))
				queue = []

				return api(originalRequest)
			} catch (err) {
				queue.forEach(p => p.reject(err))
				queue = []
				auth.logout()
				window.location.href = '/login'
				return Promise.reject(err)
			} finally {
				isRefreshing = false
			}
		}

		return Promise.reject(error)
	}
)

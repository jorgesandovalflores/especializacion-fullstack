import axios, { AxiosError } from 'axios'
import type { ModelError } from '../common/models/ModelError'

const axiosInstance = axios.create({
	baseURL: 'https://67fdb9123da09811b1766464.mockapi.io/andes-fullstack-esp',
	headers: {
		'Content-Type': 'application/json'
	},
	timeout: 10000
})

// Interceptor de respuesta para manejar errores 422
axiosInstance.interceptors.response.use(
	response => response,
	(error: AxiosError) => {
		if (error.response?.status === 422) {
			const modelError: ModelError = {
				message: 'Error de validación. Verifica los datos ingresados.'
			}
			return Promise.reject(modelError)
		}

		// Otros errores
		const modelError: ModelError = {
			message: error.message || 'Error inesperado'
		}
		return Promise.reject(modelError)
	}
)

export default axiosInstance

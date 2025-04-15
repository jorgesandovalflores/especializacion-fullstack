const BASE_URL = 'https://67fdb9123da09811b1766464.mockapi.io/andes-fullstack-esp'

async function request(path: string, options: RequestInit = {}) {
	const token = localStorage.getItem('token')
	const headers: HeadersInit = {
		'Content-Type': 'application/json',
		...(token && { Authorization: `Bearer ${token}` })
	}
	const res = await fetch(`${BASE_URL}${path}`, {
		...options,
		headers
	})
	if (res.status === 401) {
		import('../stores/auth').then(({ useAuthStore }) => {
			useAuthStore().logout()
		})
		throw new Error('Unauthorized')
	}
	return await res.json()
}

export default {
	get: (path: string) => request(path),
	post: (path: string, body: any) => request(path, {
		method: 'POST',
		body: JSON.stringify(body)
	})
}
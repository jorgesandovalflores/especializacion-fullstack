// src/store/useAuth.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { SignJWT } from 'jose'

export const useAuth = defineStore('auth', () => {
	const token = ref('')
	const username = ref('')

	async function login(name: string) {
		username.value = name

		const secretStr = import.meta.env.VITE_JWT_SECRET as string
		const secret = new TextEncoder().encode(secretStr)

		const now = Math.floor(Date.now() / 1000)

		const jwt = await new SignJWT({ sub: "1", username: name })
			.setProtectedHeader({ alg: 'HS256', typ: 'JWT' }) // header
			.setIssuedAt(now)                                  // iat
			.setExpirationTime(now + 60 * 60 * 12)             // exp: 12h
			.sign(secret)

		token.value = jwt // <-- formato header.payload.signature firmado con HS256
		// console.log('JWT:', jwt)
	}

	function logout() {
		token.value = ''
		username.value = ''
	}

	return { token, username, login, logout }
})

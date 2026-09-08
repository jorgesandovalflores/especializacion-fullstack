const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000'

export interface LoginPayload {
  email: string
  password: string
}

export interface LoginResponse {
  accessToken: string
  email: string
}

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Credenciales inválidas')
    }
    throw new Error('No se pudo iniciar sesión, intenta nuevamente')
  }

  return response.json() as Promise<LoginResponse>
}

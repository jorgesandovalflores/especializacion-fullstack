# 🎓 Módulo 03 – Clase 01  
## 📘 Consumo de APIs con Axios en Vue.js

---

### 🎯 Objetivos

1. Comprender cómo funcionan las peticiones HTTP y los códigos de estado.
2. Aprender a integrar Axios en un proyecto Vue 3 con TypeScript.
3. Implementar operaciones CRUD consumiendo una API externa.
4. Gestionar respuestas exitosas y errores de validación (422).
5. Separar la lógica del negocio en servicios y stores.
6. Dividir componentes visuales por funcionalidad específica.

---

### 🧱 Contenidos

1. ¿Qué es HTTP y cómo funciona?
2. ¿Qué es Axios y por qué lo usamos?
3. Tipos de peticiones HTTP (GET, POST, PUT, DELETE)
4. Códigos de estado HTTP estándar
5. Configuración global de Axios
6. Interceptores y manejo de errores
7. Ejemplo completo: CRUD de usuarios

---

### ⏰ Duración estimada

📅 Duración: 1h 30 min

---

## 📖 1. Teoría

### 🌐 ¿Qué es HTTP?

HTTP (HyperText Transfer Protocol) es el protocolo que permite la comunicación entre clientes (navegadores, apps) y servidores. Cada interacción se realiza mediante peticiones y se obtienen respuestas.

---

### 📖 2. Tipos de peticiones HTTP

| Método  | Descripción                        |
|---------|------------------------------------|
| GET     | Obtener datos                      |
| POST    | Enviar o crear un nuevo recurso    |
| PUT     | Reemplazar completamente un recurso|
| PATCH   | Actualizar parcialmente un recurso |
| DELETE  | Eliminar un recurso                |

---

### 📬 3. Códigos de respuesta HTTP

| Código | Significado              |
|--------|--------------------------|
| 200    | OK                       |
| 201    | Created                  |
| 204    | No Content               |
| 400    | Bad Request              |
| 401    | Unauthorized             |
| 403    | Forbidden                |
| 404    | Not Found                |
| 422    | Unprocessable Entity     |
| 500    | Internal Server Error    |

---

### 4. ¿Qué es Axios?

Axios es una librería para hacer peticiones HTTP basada en Promesas. Ventajas:

- Sintaxis limpia y simple
- Transformación automática de JSON
- Soporte para interceptores de errores
- Compatible con frontend y backend (Node.js)

---

### ⚙️ 5. Configuración global de Axios

### ✅ Crear proyecto con Vite + Vue 3 + TS

```bash
npm create vite@latest vite-vue3-axios -- --template vue-ts
cd vite-vue3-axios
npm install
npm install axios pinia vue-router
```

---

### ✅ Estructura del proyecto

```
src/
├── components/
│   ├── UserForm.vue
│   ├── UserList.vue
│   └── UserDelete.vue
├── services/
│   ├── axios.ts
│   └── userService.ts
├── stores/
│   └── useUserStore.ts
├── views/
│   └── UsersView.vue
├── main.ts
├── router.ts
```

---

### ✅ Axios – configuración global

```ts
// src/services/axios.ts
import axios from 'axios'

export const api = axios.create({
	baseURL: 'https://reqres.in/api',
	timeout: 10000,
	headers: {
		'Content-Type': 'application/json'
	}
})

api.interceptors.response.use(
	response => response,
	error => {
		if (error.response?.status === 422) {
			console.warn('Errores 422 capturados:', error.response.data)
		}
		return Promise.reject(error)
	}
)
```

---

### ✅ Servicios API

```ts
// src/services/userService.ts
import { api } from './axios'

export const getUsers = async () => (await api.get('/users')).data.data

export const createUser = async (user: { name: string; job: string }) =>
	(await api.post('/users', user)).data

export const updateUser = async (id: number, user: { name: string; job: string }) =>
	(await api.put(`/users/${id}`, user)).data

export const deleteUser = async (id: number) =>
	(await api.delete(`/users/${id}`)).data
```

---

### ✅ Store Pinia

```ts
// src/stores/useUserStore.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import * as userService from '@/services/userService'

export const useUserStore = defineStore('user', () => {
	const users = ref<any[]>([])
	const errors = ref<Record<string, string[]>>({})

	const fetchUsers = async () => {
		users.value = await userService.getUsers()
	}

	const addUser = async (name: string, job: string) => {
		errors.value = {}
		try {
			const newUser = await userService.createUser({ name, job })
			users.value.push(newUser)
		} catch (e: any) {
			if (e.response?.status === 422) {
				errors.value = e.response.data.errors
			}
		}
	}

	const updateUser = async (id: number, name: string, job: string) => {
		await userService.updateUser(id, { name, job })
		await fetchUsers()
	}

	const removeUser = async (id: number) => {
		await userService.deleteUser(id)
		users.value = users.value.filter(u => u.id !== id)
	}

	return { users, errors, fetchUsers, addUser, updateUser, removeUser }
})
```

---

### ✅ Componentes Visuales

### 🔹 `UserForm.vue`

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '@/stores/useUserStore'

const name = ref('')
const job = ref('')
const store = useUserStore()

const handleSubmit = () => {
	store.addUser(name.value, job.value)
}
</script>

<template>
	<div>
		<h3 class="font-semibold">Crear usuario</h3>
		<input v-model="name" placeholder="Nombre" class="border p-1 mb-1 w-full" />
		<input v-model="job" placeholder="Trabajo" class="border p-1 mb-1 w-full" />
		<button @click="handleSubmit" class="bg-blue-600 text-white px-3 py-1">Crear</button>

		<div v-if="Object.keys(store.errors).length" class="text-red-500 mt-2">
			<div v-for="(errs, field) in store.errors" :key="field">
				<strong>{{ field }}:</strong> {{ errs.join(', ') }}
			</div>
		</div>
	</div>
</template>
```

---

### 🔹 `UserList.vue`

```vue
<script setup lang="ts">
import { useUserStore } from '@/stores/useUserStore'
import { onMounted } from 'vue'

const store = useUserStore()
onMounted(() => {
	store.fetchUsers()
})
</script>

<template>
	<div>
		<h3 class="font-semibold">Lista de Usuarios</h3>
		<ul>
			<li v-for="user in store.users" :key="user.id">
				{{ user.first_name }} {{ user.last_name }}
			</li>
		</ul>
	</div>
</template>
```

---

### 🔹 `UserDelete.vue`

```vue
<script setup lang="ts">
import { useUserStore } from '@/stores/useUserStore'

const store = useUserStore()

const handleDelete = (id: number) => {
	if (confirm('¿Eliminar usuario?')) {
		store.removeUser(id)
	}
}
</script>

<template>
	<div>
		<h3 class="font-semibold">Eliminar usuarios</h3>
		<ul>
			<li v-for="user in store.users" :key="user.id" class="flex justify-between">
				<span>{{ user.first_name }} {{ user.last_name }}</span>
				<button @click="handleDelete(user.id)" class="text-red-500">Eliminar</button>
			</li>
		</ul>
	</div>
</template>
```

---

### 🔹 `UsersView.vue`

```vue
<template>
	<div class="max-w-xl mx-auto p-4">
		<UserForm />
		<hr class="my-4" />
		<UserList />
		<hr class="my-4" />
		<UserDelete />
	</div>
</template>

<script setup lang="ts">
import UserForm from '@/components/UserForm.vue'
import UserList from '@/components/UserList.vue'
import UserDelete from '@/components/UserDelete.vue'
</script>
```

---

## ✅ Buenas prácticas

- Usa `axios.create` con `baseURL` para evitar repetir rutas.
- Centraliza interceptores y configuración.
- Separa la lógica HTTP en servicios.
- Divide las responsabilidades visuales por componente.
- Maneja validaciones y errores de código 422 en el store.

---
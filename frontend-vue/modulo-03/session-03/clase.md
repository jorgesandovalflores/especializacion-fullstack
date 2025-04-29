# Curso Frontend Web Vue.js

## Módulo 02 - Clase 03

# CRUD Completo de Usuarios con Validaciones, Manejo Global de Errores, Mejoras de UX y Uso de Librería UI

---

## 🎯 Objetivos de la Clase

- Desarrollar un CRUD completo de usuarios en Vue 3 usando TypeScript.
- Usar una librería UI (`element-plus`) para construir interfaces más profesionales.
- Validar datos manualmente en formularios.
- Manejar errores globalmente con Pinia y Axios interceptors.
- Mejorar la experiencia de usuario (UX) mediante feedback visual y estado de carga.

---

## ⏰ Duración Estimada

**3 horas** (teoría + práctica)

---

## 📚 Contenido Teórico

### 1. ¿Qué es una Librería UI?

Una librería de componentes UI (User Interface) es un conjunto de elementos visuales listos para usar como:
- Inputs
- Selects
- Buttons
- Dialogs
- Tables

**¿Por qué usar una librería UI?**
- Acelera el desarrollo.
- Garantiza consistencia visual.
- Mejora la accesibilidad.

**Ejemplos populares:** Element Plus, Vuetify, PrimeVue, Quasar.

En este curso, simularemos una llamada **ui-element**, similar a Element Plus.

### 2. CRUD en Frontend

Operaciones:
- Create
- Read
- Update
- Delete

### 3. Validaciones en Formularios

Validar:
- Nombre obligatorio.
- Email válido.
- Password ≥ 6 caracteres.
- Rol obligatorio.

### 4. Manejo Global de Errores

Captura mediante Axios + almacenamiento en Pinia.

### 5. Estrategias para Mejorar la UX

- Botones desactivados durante carga.
- Mensajes inmediatos de error.
- Indicadores de carga.
- Confirmaciones antes de eliminar.

---

# 🛠 Instalación y Configuración Inicial

### 1. Instalar dependencias

```bash
pnpm install element-plus
```

### 2. Configurar ui-element en src/main.ts

```typescript
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';

import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';

const app = createApp(App);

app.use(createPinia());
app.use(ElementPlus);

app.mount('#app');
```

---

# 🛠 Estructura de Archivos

```
src/
 ├── components/
 │    ├── UserList.vue
 │    ├── UserForm.vue
 │    └── ConfirmDelete.vue
 ├── stores/
 │    ├── useUserStore.ts
 │    └── useErrorStore.ts
 ├── services/
 │    └── api.ts
 ├── common/
 │    └── models/
 │         ├── ModelUser.ts
 │         └── ModelError.ts
 └── main.ts
```

---

# 🛠 Paso 1: Modelos

```typescript
// src/common/models/ModelUser.ts
export type ModelUser = {
	id: string;
	name: string;
	email: string;
	password: string;
	role: string;
};

// src/common/models/ModelError.ts
export interface ModelError {
	message: string;
}
```

---

# 🛠 Paso 2: Configurar instancia de Axios

```typescript
// src/services/api.ts
import axios, { AxiosError } from "axios";
import { useErrorStore } from "@/stores/useErrorStore";

const api = axios.create({
	baseURL: "https://api.ejemplo.com",
	timeout: 10000,
	headers: {
		"Content-Type": "application/json",
	},
});

api.interceptors.response.use(
	response => response,
	(error: AxiosError) => {
		const errorStore = useErrorStore();
		errorStore.setError(error.message || "Error inesperado");
		return Promise.reject(error);
	}
);

export default api;
```

---

# 🛠 Paso 3: Crear Stores

### Store de Errores

```typescript
// src/stores/useErrorStore.ts
import { defineStore } from "pinia";
import { ref } from "vue";

export const useErrorStore = defineStore("error", () => {
	const message = ref<string | null>(null);

	function setError(newMessage: string) {
		message.value = newMessage;
	}

	function clearError() {
		message.value = null;
	}

	return { message, setError, clearError };
});
```

### Store de Usuarios

```typescript
// src/stores/useUserStore.ts
import { defineStore } from "pinia";
import { ref } from "vue";
import api from "@/services/api";
import type { ModelUser } from "@/common/models/ModelUser";

export const useUserStore = defineStore("user", () => {
	const users = ref<ModelUser[]>([]);
	const loading = ref<boolean>(false);

	async function fetchUsers() {
		try {
			loading.value = true;
			const response = await api.get<ModelUser[]>("/users");
			users.value = response.data;
		} finally {
			loading.value = false;
		}
	}

	async function createUser(user: Omit<ModelUser, "id">) {
		await api.post("/users", user);
		await fetchUsers();
	}

	async function updateUser(id: string, user: Omit<ModelUser, "id">) {
		await api.put(`/users/${id}`, user);
		await fetchUsers();
	}

	async function deleteUser(id: string) {
		await api.delete(`/users/${id}`);
		await fetchUsers();
	}

	return { users, loading, fetchUsers, createUser, updateUser, deleteUser };
});
```

---

# 🛠 Paso 4: Componentes Visuales

## UserList.vue

```vue
<template>
  <div>
    <el-table :data="userStore.users" v-loading="userStore.isLoading">
      <el-table-column prop="name" label="Nombre" />
      <el-table-column prop="email" label="Email" />
      <el-table-column prop="role" label="Rol" />
      <el-table-column label="Acciones">
        <template #default="{ row }">
          <el-button @click="edit(row)">Editar</el-button>
          <el-button type="danger" @click="confirmDelete(row.id)">Eliminar</el-button>
        </template>
      </el-table-column>
    </el-table>

    <UserForm v-if="editingUser" :user="editingUser" @close="editingUser = null" />
    <UserDeletePopup v-if="idToDelete" @confirm="remove" @cancel="idToDelete = ''" />
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useUserStore } from '@/stores/useUserStore';
import UserForm from './UserForm.vue';
import ConfirmDelete from './ConfirmDelete.vue';
import type { ModelUser } from '@/common/models/ModelUser';

const userStore = useUserStore();
const editingUser = ref<ModelUser | null>(null);
const idToDelete = ref<string>('');

onMounted(() => {
  userStore.fetchUsers();
});

function edit(user: ModelUser) {
  editingUser.value = user;
}

function confirmDelete(id: string) {
  idToDelete.value = id;
}

async function remove() {
  if (idToDelete.value) {
    await userStore.deleteUser(idToDelete.value);
    idToDelete.value = '';
  }
}
</script>
```

## UserForm.vue

```vue
<template>
  <ui-dialog :visible="true" @close="$emit('close')">
    <form @submit.prevent="save">
      <ui-input v-model="name" label="Nombre" :error="errors.name" />
      <ui-input v-model="email" label="Email" :error="errors.email" />
      <ui-input v-model="password" type="password" label="Contraseña" :error="errors.password" />
      <ui-select v-model="role" :options="roles" label="Rol" :error="errors.role" />

      <ui-button type="primary" :loading="loading">{{ user ? 'Actualizar' : 'Crear' }}</ui-button>
    </form>
  </ui-dialog>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import { useUserStore } from '@/stores/useUserStore';
import type { ModelUser } from '@/common/models/ModelUser';

const props = defineProps<{ user?: ModelUser }>();
const emit = defineEmits(['close']);

const userStore = useUserStore();

const name = ref('');
const email = ref('');
const password = ref('');
const role = ref('');
const loading = ref(false);
const errors = ref<Record<string, string>>({});

const roles = [
  { label: 'Admin', value: 'admin' },
  { label: 'User', value: 'user' },
];

watch(() => props.user, (u) => {
  if (u) {
    name.value = u.name;
    email.value = u.email;
    password.value = u.password;
    role.value = u.role;
  }
}, { immediate: true });

function validateForm() {
  errors.value = {};

  if (!name.value) errors.value.name = 'Nombre obligatorio';
  if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) errors.value.email = 'Email válido obligatorio';
  if (!password.value || password.value.length < 6) errors.value.password = 'Mínimo 6 caracteres';
  if (!role.value) errors.value.role = 'Rol obligatorio';

  return Object.keys(errors.value).length === 0;
}

async function save() {
  if (!validateForm()) return;

  try {
    loading.value = true;

    const userData = { name: name.value, email: email.value, password: password.value, role: role.value };

    if (props.user) {
      await userStore.updateUser(props.user.id, userData);
    } else {
      await userStore.createUser(userData);
    }

    emit('close');
  } finally {
    loading.value = false;
  }
}
</script>
```

## ConfirmDelete.vue

```vue
<template>
  <ui-dialog :visible="true" @close="$emit('cancel')">
    <p>¿Estás seguro de eliminar este usuario?</p>
    <ui-button type="danger" @click="$emit('confirm')">Sí, eliminar</ui-button>
    <ui-button @click="$emit('cancel')">Cancelar</ui-button>
  </ui-dialog>
</template>

<script lang="ts" setup>
const emit = defineEmits(['confirm', 'cancel']);
</script>
```

---

# 📋 Resumen de la Clase

| Tema                                | Implementado |
|--------------------------------------|--------------|
| CRUD Completo de Usuarios           | ✅ |
| Librería UI (ui-element) integrada   | ✅ |
| Validaciones manuales en formularios | ✅ |
| Manejo Global de Errores             | ✅ |
| Mejoras UX (loadings, modals, validaciones) | ✅ |

---

# 📚 Tarea para el alumno

- Agregar búsqueda de usuarios por nombre en la tabla.
- Agregar paginación en la tabla usando `ui-table`.
- Implementar una alerta de éxito al registrar/editar usuario.

---


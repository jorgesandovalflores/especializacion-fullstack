# 👨‍🏫 Curso: **Frontend Web con Vue.js y TypeScript**  
## 📆 Módulo 02 – Estado y Rutas en Vue.js  
### 🧍‍♂️ Clase 03 – **Integración con Firebase**

---

## 📚 Contenido de la clase

1. Introducción a Firebase y sus servicios
2. Creación y configuración de un proyecto Firebase
3. Conexión de Firebase con una app Vue 3 + TypeScript
4. Implementación de autenticación de usuarios con Firebase Auth
5. Manejo de datos en tiempo real con Firestore
6. Implementación de vistas `LoginView.vue` y `ChatView.vue` con estilos
7. Rutas protegidas y navegación condicional
8. Actividad práctica guiada
9. Tareas para reforzar en casa

---

## 📘 Objetivos de la clase

- Comprender qué es Firebase y sus principales servicios.
- Conectar una app Vue 3 con Firebase utilizando TypeScript.
- Implementar autenticación de usuarios con Firebase Auth.
- Almacenar y sincronizar datos en tiempo real con Firestore.
- Construir un chat básico como ejercicio práctico.

---

## 🧐 Introducción teórica

### 🔥 ¿Qué es Firebase?

Firebase es una **plataforma de desarrollo de aplicaciones** creada en 2011 y adquirida por Google en 2014. Proporciona soluciones backend listas para usar (**BaaS**) que permiten desarrollar sin necesidad de implementar un servidor propio.

### 📆 Servicios comunes de Firebase

| Servicio               | Descripción |
|------------------------|-------------|
| **Firebase Auth**      | Sistema de autenticación con email, Google, Facebook, etc. |
| **Firestore**          | Base de datos NoSQL en tiempo real y altamente escalable. |
| **Firebase Storage**   | Almacenamiento de archivos y medios. |
| **Cloud Functions**    | Funciones serverless para lógica de negocio. |
| **Hosting**            | Para desplegar aplicaciones web SPA de forma segura. |

### 🌟 ¿Por qué usar Firebase con Vue.js?

- Rápida integración.
- Ideal para proyectos pequeños o medianos.
- Sin necesidad de mantener servidores.
- Base perfecta para aprender arquitectura fullstack sin backend tradicional.

---

## 🧱 Estructura de carpetas sugerida

```bash
src/
├── firebase.ts                  # Configuración Firebase
├── services/
│   ├── auth.ts              # Lógica de autenticación
│   └── firestore.ts         # Interacción con Firestore
├── stores/
│   └── user.ts              # Estado del usuario (Pinia)
├── views/
│   ├── LoginView.vue        # Vista de login y registro
│   └── ChatView.vue         # Vista del chat
├── router/
    └── index.ts             # Rutas y navegación protegida
```

---

## ⚖️ Parte 1: Configuración de Firebase

### Paso 1: Crear proyecto en consola de Firebase

1. Ir a https://console.firebase.google.com
2. Crear un nuevo proyecto
3. Agregar app web y copiar configuración (API Key, etc.)
4. Activar "Authentication" > método "Email/Password"
5. Activar "Cloud Firestore" > modo prueba > crear colección `mensajes`

### Paso 2: Instalar Firebase

```bash
npm install firebase
```

### Archivo `src/firebase.ts`

```ts
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'TU_API_KEY',
  authDomain: 'TU_AUTH_DOMAIN',
  projectId: 'TU_PROJECT_ID',
  storageBucket: 'TU_BUCKET',
  messagingSenderId: 'TU_MESSAGING_ID',
  appId: 'TU_APP_ID',
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)
```

---

## 🔐 Parte 2: Autenticación de usuarios

### Archivo `src/services/auth.ts`

```ts
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/firebase'

export const registerUser = (email: string, password: string) => createUserWithEmailAndPassword(auth, email, password)
export const loginUser = (email: string, password: string) => signInWithEmailAndPassword(auth, email, password)
export const logoutUser = () => signOut(auth)
export const onUserStateChange = (callback: (user: any) => void) => onAuthStateChanged(auth, callback)
```

---

## 🧠 Parte 3: Estado del usuario (Pinia)

### Archivo `src/stores/user.ts`

```ts
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  const user = ref<any>(null)
  const setUser = (u: any) => user.value = u
  return { user, setUser }
})
```

---

## 📁 Parte 4: Firestore

### Archivo `src/services/firestore.ts`

```ts
import { collection, addDoc, onSnapshot, Timestamp, query, orderBy } from 'firebase/firestore'
import { db } from '@/firebase'

const messagesRef = collection(db, 'mensajes')

export const addMessage = (text: string, userEmail: string) => {
  return addDoc(messagesRef, {
    text,
    user: userEmail,
    createdAt: Timestamp.now(),
  })
}

export const listenMessages = (callback: (data: any[]) => void) => {
  const q = query(messagesRef, orderBy('createdAt'))
  onSnapshot(q, snapshot => {
    const messages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    callback(messages)
  })
}
```

---

## 🖼️ Parte 5: Vistas con estilo

### Archivo `src/views/LoginView.vue`

```vue
<template>
  <div class="container">
    <div class="card">
      <h2>Acceso</h2>
      <input v-model="email" type="email" placeholder="Correo" />
      <input v-model="password" type="password" placeholder="Contraseña" />
      <div class="buttons">
        <button @click="register">Registrarse</button>
        <button @click="login">Iniciar sesión</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { registerUser, loginUser } from '@/services/auth'
import { useUserStore } from '@/stores/user'

const email = ref('')
const password = ref('')
const router = useRouter()
const store = useUserStore()

const register = async () => {
  const res = await registerUser(email.value, password.value)
  store.setUser(res.user)
  router.push('/chat')
}

const login = async () => {
  const res = await loginUser(email.value, password.value)
  store.setUser(res.user)
  router.push('/chat')
}
</script>

<style scoped>
.container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: #f2f2f2;
}
.card {
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  width: 300px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
input {
  padding: 0.5rem;
  font-size: 1rem;
  width: 100%;
}
.buttons {
  display: flex;
  justify-content: space-between;
}
button {
  padding: 0.5rem 1rem;
  cursor: pointer;
}
</style>
```

### Archivo `src/views/ChatView.vue`

```vue
<template>
  <div class="container">
    <div class="card">
      <h2>Chat en tiempo real</h2>
      <ul class="messages">
        <li v-for="msg in messages" :key="msg.id">
          <strong>{{ msg.user }}</strong>: {{ msg.text }}
        </li>
      </ul>
      <input v-model="text" @keyup.enter="sendMessage" placeholder="Escribe un mensaje" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { addMessage, listenMessages } from '@/services/firestore'
import { useUserStore } from '@/stores/user'

const store = useUserStore()
const text = ref('')
const messages = ref<any[]>([])

onMounted(() => {
  listenMessages(data => messages.value = data)
})

const sendMessage = async () => {
  if (text.value.trim()) {
    await addMessage(text.value, store.user?.email)
    text.value = ''
  }
}
</script>

<style scoped>
.container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: #e9e9e9;
}
.card {
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
  width: 400px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.messages {
  list-style: none;
  padding: 0;
  max-height: 300px;
  overflow-y: auto;
}
input {
  padding: 0.5rem;
  font-size: 1rem;
}
</style>
```

---

## 🗺️ Parte 6: Rutas protegidas

### Archivo `src/router/index.ts`

```ts
import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/LoginView.vue'
import ChatView from '@/views/ChatView.vue'
import { auth } from '@/firebase'

const routes = [
  { path: '/login', component: LoginView },
  { path: '/chat', component: ChatView, meta: { requiresAuth: true } },
  { path: '/:pathMatch(.*)*', redirect: '/login' },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const user = auth.currentUser
  if (to.meta.requiresAuth && !user) {
    next('/login')
  } else {
    next()
  }
})

export default router
```

---

## 🗪 Actividad práctica

Crear una mini app con:
- Registro e inicio de sesión usando Firebase Auth.
- Vista de chat donde se muestran mensajes en tiempo real.
- Protección de rutas según sesión activa.

---

## 📄 Tareas para casa

1. Agregar botón de logout en `ChatView.vue`.
2. Mostrar fecha y hora del mensaje (`createdAt`).
3. Validar campos de email y contraseña.
4. (Opcional) Desplegar app en Firebase Hosting.


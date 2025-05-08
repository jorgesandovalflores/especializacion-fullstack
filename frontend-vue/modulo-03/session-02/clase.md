## Clase 02 - Autenticación y autorización con JWT en Vue.js + NestJS

### 🌟 Objetivos
- Comprender y diferenciar autenticación y autorización.
- Comparar métodos comunes de autenticación.
- Implementar login con JWT usando NestJS y Vue.js.
- Proteger rutas, gestionar sesiones, roles y permisos en frontend.

---

### ⏰ Duración sugerida
3 horas:
- Teoría: 1 hora
- Práctica frontend: 1 hora
- Práctica backend: 1 hora

---

## 1. Teoría de Autenticación y Autorización

### 🔎 Diferencias clave
| Concepto         | Descripción                                  |
|------------------|----------------------------------------------|
| Autenticación     | Verificación de identidad del usuario.         |
| Autorización      | Permiso para acceder a ciertos recursos.     |

### 💰 Tipos de autenticación
| Tipo        | Ventajas                        | Desventajas                    |
|-------------|----------------------------------|---------------------------------|
| Cookies     | Seguras con HttpOnly + CSRF     | Menos escalables               |
| Sesiones    | Estado gestionado en backend    | Mayor consumo de memoria       |
| JWT         | Stateless y portable             | Vulnerable si se almacena mal  |

---

## 2. Backend: API de login con NestJS

### 📦 Instalación
```bash
npm install -g @nestjs/cli
nest new example-backend

nest generate module features/user
nest generate controller features/user
nest generate service features/user
```

### 📗 auth.module.ts
```ts
@Module({
  imports: [JwtModule.register({
    secret: process.env.JWT_SECRET,
    signOptions: { expiresIn: '1h' }
  })],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
```

### 👥 user.service.ts
```ts
@Injectable()
export class UserService {
  private users = [
    { id: 1, email: 'admin@mail.com', password: '1234', role: 'ADMIN' },
    { id: 2, email: 'user@mail.com', password: '1234', role: 'USER' }
  ];

  async findByEmail(email: string) {
    return this.users.find(user => user.email === email);
  }
}
```

### 🔐 auth.service.ts
```ts
@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService, private userService: UserService) {}

  async login(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    if (!user || user.password !== password) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { sub: user.id, email: user.email, role: user.role };
    const token = this.jwtService.sign(payload);
    return { token, user: { name: user.email, role: user.role } };
  }
}
```

### 🔑 auth.controller.ts
```ts
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    return this.authService.login(body.email, body.password);
  }
}
```

---

## 3. Frontend: Vue.js + Pinia + Axios

### 📂 Estructura
```
src/
├── api/
│   └── authService.ts
├── stores/
│   └── useAuthStore.ts
├── views/
│   ├── LoginView.vue
│   ├── HomeView.vue
│   └── ProtectedView.vue
├── router/
│   └── index.ts
```

### 🔗 authService.ts
```ts
import axios from 'axios'

export const login = async (email: string, password: string) => {
  const response = await axios.post('http://localhost:3000/auth/login', { email, password })
  return response.data
}
```

### 📓 useAuthStore.ts (funcional)
```ts
import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string>(localStorage.getItem('token') || '')
  const user = ref<null | { name: string; role: string }>(null)

  const loginSuccess = (_token: string, _user: any) => {
    token.value = _token
    user.value = _user
    localStorage.setItem('token', _token)
  }

  const logout = () => {
    token.value = ''
    user.value = null
    localStorage.removeItem('token')
  }

  return { token, user, loginSuccess, logout }
})
```

### 📅 LoginView.vue
```vue
<template>
  <div class="login">
    <h1>Iniciar Sesión</h1>
    <input v-model="email" placeholder="Email" />
    <input v-model="password" placeholder="Password" type="password" />
    <button @click="loginUser">Entrar</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/useAuthStore'
import { login } from '@/api/authService'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const auth = useAuthStore()
const router = useRouter()

const loginUser = async () => {
  const res = await login(email.value, password.value)
  auth.loginSuccess(res.token, res.user)
  router.push('/home')
}
</script>

<style scoped>
.login { text-align: center; padding: 2rem; }
</style>
```

---

### 😐 router/index.ts (protección de rutas)
```ts
import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/LoginView.vue'
import HomeView from '@/views/HomeView.vue'
import ProtectedView from '@/views/ProtectedView.vue'
import { useAuthStore } from '@/stores/useAuthStore'

const routes = [
  { path: '/login', component: LoginView },
  { path: '/home', component: HomeView, meta: { requiresAuth: true } },
  { path: '/protected', component: ProtectedView, meta: { requiresAuth: true, roles: ['ADMIN'] } }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.token) return next('/login')
  if (to.meta.roles && !to.meta.roles.includes(auth.user?.role || '')) return next('/home')
  next()
})

export default router
```

---

### 🎓 Actividades
- Crear login funcional con NestJS.
- Probar con usuario ADMIN y USER.
- Ocultar secciones según el rol.

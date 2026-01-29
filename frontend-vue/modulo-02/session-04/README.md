## Clase 04 - Autorización y control de acceso

### Objetivos

- Comprender los fundamentos de autenticación y autorización en aplicaciones web.
- Implementar un sistema de control de acceso en Vue.js usando Pinia y TypeScript.
- Proteger rutas y componentes con guardias de navegación.
- Gestionar la sesión del usuario a través del token JWT y el consumo de APIs.

---

## ¿Qué es autenticación y autorización?

### Autenticación

La autenticación es el proceso de verificar la identidad de un usuario. En una aplicación web, esto se logra normalmente mediante un formulario de inicio de sesión. Al autenticarse correctamente, el servidor devuelve un **token JWT (JSON Web Token)** que representa al usuario.

### Autorización

Una vez autenticado, la autorización determina **qué puede hacer ese usuario**, como acceder a ciertos módulos o ejecutar ciertas acciones. Esto se controla a través de **roles** y **permisos**.

## Tipos de autenticación

Existen varias formas de manejar autenticación en aplicaciones web. A continuación se muestra una tabla comparativa:

| Método                   | Descripción                                                      | Ventajas                                 | Desventajas                             |
| ------------------------ | ---------------------------------------------------------------- | ---------------------------------------- | --------------------------------------- |
| **Cookies con sesión**   | El servidor guarda la sesión en memoria o base de datos.         | Simplicidad, integración automática      | No escalable fácilmente, CSRF           |
| **Basic Auth**           | Usuario y contraseña en cada request, codificados en base64.     | Muy simple                               | Poco seguro, no recomendado en frontend |
| **OAuth 2.0**            | Acceso a recursos de terceros con delegación.                    | Estandarizado, ideal para redes sociales | Complejo de implementar                 |
| **JWT (JSON Web Token)** | El backend firma un token que contiene la identidad del usuario. | Stateless, escalable, portable           | Token largo, requiere gestión segura    |

---

## ¿Por qué usar JWT?

JWT (JSON Web Token) es un estándar abierto (RFC 7519) que define un método compacto y seguro para representar información entre dos partes como un objeto JSON firmado digitalmente. Este token se emite por el servidor después de una autenticación exitosa y se envía al cliente para ser incluido en las solicitudes subsecuentes.

### Estructura de un JWT

Un JWT consta de tres partes codificadas en base64:

1. **Header**: especifica el algoritmo de firma (por ejemplo, HMAC SHA256) y el tipo de token.
2. **Payload**: contiene los datos del usuario (claims), como `id`, `email`, `roles`, etc.
3. **Signature**: firma digital que asegura que el token no fue alterado.

Ejemplo:

```
xxxxx.yyyyy.zzzzz
```

- `xxxxx`: encabezado codificado
- `yyyyy`: carga útil (payload)
- `zzzzz`: firma generada por el backend usando una clave secreta

### Ventajas prácticas de JWT

- **Stateless (sin estado):** no se requiere sesión en el servidor, el token contiene toda la información.
- **Escalable:** ideal para arquitecturas distribuidas o microservicios.
- **Transporte seguro:** puede ser enviado por HTTP Header (Authorization: Bearer).
- **Flexible:** se pueden incluir roles, permisos u otra metadata en el `payload`.
- **Compatible con APIs RESTful:** se adapta perfectamente a aplicaciones SPA como las hechas en Vue.js.

### Consideraciones de seguridad

- **Firmar siempre el token** con un secreto seguro (o certificado en caso de RS256).
- **No almacenar en cookies sin protección CSRF.** Es mejor usar `localStorage` o `sessionStorage` con HTTPS.
- **Implementar expiración corta** y mecanismos de refresco del token.

### ¿Cuándo no usar JWT?

JWT no es la mejor opción si:

- Tu app es muy simple y no requiere escalabilidad.
- Necesitas invalidar tokens inmediatamente desde el backend (p. ej. cerrar sesión remota).
- Vas a manejar mucha información dentro del token: recuerda que todo está expuesto (aunque firmado).

Por todas estas razones, en este curso utilizamos JWT como mecanismo principal de autenticación para aplicaciones SPA modernas construidas con Vue.js.

---

## Consumo de API y almacenamiento del token

Al iniciar sesión exitosamente, el backend responde con un token. Este token se debe almacenar (usualmente en `localStorage`) y enviarse en cada solicitud API.

### Ejemplo con interceptor de Axios

```ts
// services/api.ts
import axios from "axios";

const api = axios.create({
    baseURL: "https://api.miapp.com",
});

// Interceptar solicitudes para incluir token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Manejar expiración de sesión
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.location.href = "/login";
        }
        return Promise.reject(error);
    },
);

export default api;
```

> Este interceptor garantiza que cada vez que Axios haga una solicitud, se incluirá el token. Si el backend responde con un 401 (no autorizado), se elimina la sesión y se redirige al login.

---

## Paso 1: Crear estructura de datos del usuario

```ts
// types/User.ts
export type User = {
    id: number;
    name: string;
    roles: string[];
    permissions: string[];
};
```

---

## Paso 2: Crear el store de autenticación

```ts
// stores/auth.ts
import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { User } from "@/types/User";

export const useAuth = defineStore("auth", () => {
    const user = ref<User | null>(null);
    const token = ref<string>("");

    const isAuthenticated = computed(() => !!token.value);

    const hasRole = (role: string): boolean => {
        return user.value?.roles.includes(role) ?? false;
    };

    const hasPermission = (perm: string): boolean => {
        return user.value?.permissions.includes(perm) ?? false;
    };

    const setUser = (_user: User, _token: string) => {
        user.value = _user;
        token.value = _token;
        localStorage.setItem("user", JSON.stringify(_user));
        localStorage.setItem("token", _token);
    };

    const logout = () => {
        user.value = null;
        token.value = "";
        localStorage.removeItem("user");
        localStorage.removeItem("token");
    };

    const loadSession = () => {
        const savedUser = localStorage.getItem("user");
        const savedToken = localStorage.getItem("token");
        if (savedUser && savedToken) {
            user.value = JSON.parse(savedUser);
            token.value = savedToken;
        }
    };

    return {
        user,
        token,
        isAuthenticated,
        hasRole,
        hasPermission,
        setUser,
        logout,
        loadSession,
    };
});
```

---

## Paso 3: Configurar rutas protegidas

```ts
// router/index.ts
import { createRouter, createWebHistory } from "vue-router";
import { useAuth } from "@/stores/auth";

const routes = [
    {
        path: "/login",
        component: () => import("@/views/LoginView.vue"),
    },
    {
        path: "/admin",
        component: () => import("@/views/AdminView.vue"),
        meta: { requiresAuth: true, roles: ["admin"] },
    },
    {
        path: "/unauthorized",
        component: () => import("@/views/UnauthorizedView.vue"),
    },
    {
        path: "/:pathMatch(.*)*",
        component: () => import("@/views/NotFoundView.vue"),
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    const auth = useAuth();
    auth.loadSession();

    if (to.meta.requiresAuth && !auth.isAuthenticated) {
        return next("/login");
    }

    if (to.meta.roles && !to.meta.roles.some((r: string) => auth.hasRole(r))) {
        return next("/unauthorized");
    }

    next();
});

export default router;
```

---

## Paso 4: Crear formulario de login

```vue
<!-- views/LoginView.vue -->
<template>
    <div class="login-container">
        <h2>Iniciar sesión</h2>
        <form @submit.prevent="handleLogin">
            <input v-model="email" type="email" placeholder="Correo" required />
            <input
                v-model="password"
                type="password"
                placeholder="Contraseña"
                required
            />
            <button type="submit">Entrar</button>
        </form>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { useAuth } from "@/stores/auth";

const router = useRouter();
const auth = useAuth();

const email = ref("admin@demo.com");
const password = ref("123456");

const handleLogin = () => {
    auth.setUser(
        {
            id: 1,
            name: "Admin",
            roles: ["admin"],
            permissions: ["can_view_dashboard"],
        },
        "FAKE_TOKEN_ABC123",
    );
    router.push("/admin");
};
</script>

<style scoped>
.login-container {
    max-width: 400px;
    margin: 100px auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 8px;
    text-align: center;
}
input {
    display: block;
    width: 100%;
    margin-bottom: 10px;
    padding: 8px;
}
button {
    width: 100%;
    padding: 10px;
}
</style>
```

---

## Paso 5: Vista protegida por rol

```vue
<!-- views/AdminView.vue -->
<template>
    <div class="admin-container">
        <h1>Panel de Administración</h1>
        <p>
            Bienvenido, solo los usuarios con rol <strong>admin</strong> pueden
            ver esta vista.
        </p>
    </div>
</template>

<style scoped>
.admin-container {
    max-width: 600px;
    margin: 100px auto;
    text-align: center;
}
</style>
```

---

## Paso 6: Vista de acceso denegado

```vue
<!-- views/UnauthorizedView.vue -->
<template>
    <div class="unauthorized">
        <h2>Acceso no autorizado</h2>
        <p>No tienes permisos suficientes para ver esta página.</p>
    </div>
</template>

<style scoped>
.unauthorized {
    text-align: center;
    margin-top: 100px;
}
</style>
```

---

## Paso 7: Vista para rutas no encontradas

```vue
<!-- views/NotFoundView.vue -->
<template>
    <div class="not-found">
        <h2>Página no encontrada</h2>
        <p>La ruta que intentas acceder no existe.</p>
    </div>
</template>

<style scoped>
.not-found {
    text-align: center;
    margin-top: 100px;
}
</style>
```

---

Con estos pasos, ya tienes implementado un sistema completo de:

- Login simulado
- Almacenamiento en localStorage
- Roles y permisos en el store
- Protección de rutas
- Interceptores para consumir APIs seguras
- Componentes con estilos centrados y limpios
- Manejo de rutas no encontradas

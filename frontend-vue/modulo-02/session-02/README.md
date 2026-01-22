# Clase 02 – Configuración y uso de Vue Router

## Objetivo de la clase

Al finalizar la clase, los estudiantes serán capaces de:

- Comprender el funcionamiento de Vue Router.
- Configurar rutas públicas y protegidas.
- Navegar entre vistas de forma declarativa y programática.
- Implementar lazy loading para optimizar carga.
- Explorar y comparar una alternativa moderna: `vue-router/auto`.

---

## Contenido de la clase

1. ¿Qué es Vue Router?
2. Instalación y configuración básica
3. Creación de vistas y declaración de rutas
4. Navegación entre rutas
5. Rutas protegidas con guardias de navegación
6. Lazy loading de componentes
7. Introducción a `vue-router/auto`
8. Comparación: enfoque manual vs automático
9. Preguntas y respuestas

---

## 1️¿Qué es Vue Router?

> Vue Router es la herramienta oficial para el manejo de rutas en aplicaciones Vue. Permite que una SPA (Single Page Application) navegue entre múltiples vistas sin recargar la página.

### Conceptos clave:

- **SPA (Single Page Application):** Una sola página HTML que se actualiza dinámicamente.
- **Ruta:** Asociación entre una URL y un componente.
- **`<router-view>`:** Contenedor dinámico que cambia según la ruta.
- **`<router-link>`:** Reemplazo de `<a>` para navegación sin recarga.

---

## 2️Instalación

```bash
npm install vue-router@4
```

---

## 3️Configuración manual de Vue Router

### `src/router/index.ts`

```ts
import { createRouter, createWebHistory } from "vue-router";
import Home from "@/views/Home.vue";

const routes = [{ path: "/", name: "Home", component: Home }];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
```

### `src/main.ts`

```ts
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

createApp(App).use(router).mount("#app");
```

---

## 4️Crear vistas básicas

```bash
mkdir src/views
touch src/views/Home.vue src/views/About.vue src/views/Dashboard.vue
```

### `Home.vue`

```vue
<template>
    <div class="view">
        <h1>Bienvenido al Home</h1>
        <p>Esta es la vista principal.</p>
    </div>
</template>

<style scoped>
.view {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 60vh;
    text-align: center;
}
</style>
```

---

## 5️Declarar múltiples rutas

```ts
import About from "@/views/About.vue";
import Dashboard from "@/views/Dashboard.vue";

const routes = [
    { path: "/", name: "Home", component: Home },
    { path: "/about", name: "About", component: About },
    { path: "/dashboard", name: "Dashboard", component: Dashboard },
];
```

---

## 6️Navegación entre rutas

### Declarativa:

```vue
<template>
    <nav class="nav">
        <router-link to="/">Inicio</router-link> |
        <router-link to="/about">Acerca</router-link> |
        <router-link to="/dashboard">Panel</router-link>
    </nav>
    <router-view />
</template>

<style>
.nav {
    padding: 20px;
    text-align: center;
    background-color: #f5f5f5;
}
.nav a {
    margin: 0 10px;
    text-decoration: none;
    color: #333;
}
</style>
```

### Programática:

```ts
this.$router.push("/dashboard");
```

---

## 7️Rutas protegidas

```ts
const isAuthenticated = false;

const routes = [
    { path: "/", name: "Home", component: Home },
    {
        path: "/dashboard",
        name: "Dashboard",
        component: Dashboard,
        meta: { requiresAuth: true },
    },
];

router.beforeEach((to, from, next) => {
    if (to.meta.requiresAuth && !isAuthenticated) {
        next("/");
    } else {
        next();
    }
});
```

---

## 8️Lazy Loading

```ts
const routes = [
    {
        path: "/",
        name: "Home",
        component: () => import("@/views/Home.vue"),
    },
    {
        path: "/about",
        name: "About",
        component: () => import("@/views/About.vue"),
    },
];
```

---

## 9️Bonus: `vue-router/auto`

```bash
npm install vue-router
npm install -D unplugin-vue-router
```

### `vite.config.ts`

```ts
import VueRouter from "unplugin-vue-router/vite";

export default defineConfig({
    plugins: [vue(), VueRouter({ dts: true })],
});
```

### Estructura esperada:

```
src/
└── pages/
    ├── index.vue
    ├── about.vue
    └── dashboard.vue
```

### `main.ts`

```ts
import { createApp } from "vue";
import App from "./App.vue";
import { createRouter, setupRouter } from "vue-router/auto";

const router = createRouter();
const app = createApp(App);

setupRouter(app);
app.mount("#app");
```

---

## Comparación

| Característica        | Vue Router Manual      | `vue-router/auto`      |
| --------------------- | ---------------------- | ---------------------- |
| Declaración de rutas  | Manual                 | Automática             |
| Tipado automático     | No                     | Sí                     |
| Escalabilidad         | Complejo si hay muchas | Muy escalable          |
| Configuración inicial | Simple                 | Requiere configuración |
| Ideal para...         | Proyectos pequeños     | Proyectos modernos     |

---

## Preguntas y respuestas

- **¿Qué pasa si accedo a una ruta que no existe?**  
  Puedes definir una ruta `path: '/:pathMatch(.*)*'` para redirigir a una vista 404.

- **¿Vue Router reemplaza HTML tradicional?**  
  No, complementa el sistema SPA para cambiar de vista dinámicamente.

- **¿Vue Router es obligatorio?**  
  No en proyectos muy pequeños, pero sí en cualquier app con múltiples vistas.

- **¿Puedo combinar `vue-router/auto` con rutas protegidas?**  
  Sí, puedes usar `meta` y `beforeEach` como con el router tradicional.

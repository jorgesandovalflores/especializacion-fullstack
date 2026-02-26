# Integración de Sentry en Vue 3 + TypeScript + Vite

Esta guía te ayudará a integrar Sentry paso a paso en un proyecto Vue.js con TypeScript y Vite.

---

## Requisitos previos

- Proyecto creado con Vue 3 + Vite + TypeScript.
- Acceso a https://sentry.io y un proyecto creado para tu app.

---

## 1. Crear cuenta y proyecto en Sentry

1. Ve a [https://sentry.io](https://sentry.io) y regístrate.
2. Crea un nuevo proyecto y selecciona **Vue.js** como plataforma.
3. Copia tu **DSN**.

---

## 2. Instalar dependencias necesarias

```bash
npm install @sentry/vue @sentry/tracing
```

---

## 3. Configurar Sentry en el proyecto

### Crea `src/sentry.ts`

```ts
import * as Sentry from "@sentry/vue";
import { BrowserTracing } from "@sentry/tracing";
import { App } from "vue";
import router from "./router";

export function initSentry(app: App<Element>) {
    Sentry.init({
        app,
        dsn: import.meta.env.VITE_SENTRY_DSN,
        integrations: [
            new BrowserTracing({
                routingInstrumentation: Sentry.vueRouterInstrumentation(router),
            }),
        ],
        tracesSampleRate: 1.0,
    });
}
```

---

## 4. Usar Sentry en `main.ts`

```ts
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { initSentry } from "./sentry";

const app = createApp(App);
app.use(router);

initSentry(app);

app.mount("#app");
```

---

## 5. Configurar DSN en `.env.production`

```
VITE_SENTRY_DSN=https://TU_TOKEN@oXXXX.ingest.sentry.io/YYYY
```

> No subas este archivo a un repositorio público.

---

## 6. Habilitar source maps en Vite

En `vite.config.ts`:

```ts
export default defineConfig({
    build: {
        sourcemap: true,
    },
});
```

---

## 7. Probar con un error intencional

Agrega en cualquier componente:

```ts
throw new Error("Este es un error de prueba para Sentry");
```

Verifica que aparece en el dashboard de Sentry.

---

## 8. (Opcional) Subir source maps a Sentry en producción

```bash
npm install --save-dev @sentry/cli
```

> Puedes configurar esto en tu CI/CD para que los source maps se suban automáticamente luego del build.

---

## Resultado esperado

- Sentry reportará errores automáticamente desde producción.
- Podrás ver rutas, errores y trazas con source maps si están habilitados.

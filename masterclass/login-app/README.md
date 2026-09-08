# login-app

Vista de login (Vue 3 + TypeScript + Vite), con layouts independientes para desktop y mobile, basada en el diseño de `masterclass/design.pen`. Al iniciar sesión correctamente redirige a `/home`.

## Desarrollo local

Requiere que `masterclass/login-backend` esté corriendo (por defecto en `http://localhost:3000`; ver sus credenciales de prueba en su propio README).

```bash
pnpm install
pnpm dev
```

Para apuntar a un backend en otra URL, define `VITE_API_BASE_URL` (por ejemplo en un `.env.local`):

```
VITE_API_BASE_URL=http://localhost:3000
```

## Build de producción

```bash
pnpm build     # type-check (vue-tsc) + build a dist/
pnpm preview   # sirve el build de dist/ localmente
```

## Docker

La imagen compila el proyecto y sirve el resultado estático con nginx (con fallback de rutas para el SPA, necesario para `/login`).

```bash
docker build -t login-app .
docker run -p 8080:80 login-app
```

O con docker compose:

```bash
docker compose up --build
```

En ambos casos la app queda disponible en `http://localhost:8080/login`.

# login-app

Vista de login (Vue 3 + TypeScript + Vite), con layouts independientes para desktop y mobile, basada en el diseño de `masterclass/design.pen`.

## Desarrollo local

```bash
pnpm install
pnpm dev
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

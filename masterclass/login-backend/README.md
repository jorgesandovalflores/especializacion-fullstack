# login-backend

API de autenticación construida con NestJS para el proyecto `login-app`.

## Desarrollo local

```bash
pnpm install
pnpm start:dev
```

El servidor levanta en `http://localhost:3000` (configurable con la variable de entorno `PORT`).

## Documentación (Swagger)

Con el servidor corriendo, la documentación interactiva está disponible en:

```
http://localhost:3000/docs
```

## Endpoint de login

```
POST /auth/login
Content-Type: application/json

{
  "email": "admin@masterclass.com",
  "password": "Admin123!"
}
```

- Simula una tarea costosa: la respuesta demora ~1.5s antes de resolver.
- Credenciales fijas en `src/auth/auth.service.ts` (solo para fines de demo, no usar en producción):
  - `email: admin@masterclass.com`
  - `password: Admin123!`
- Respuestas:
  - `200` credenciales correctas → `{ accessToken, email }`
  - `401` credenciales incorrectas
  - `400` body inválido (email mal formado, password muy corta, etc.)

## Build de producción

```bash
pnpm build
pnpm start:prod
```

## Tests

```bash
pnpm test:e2e
```

## Docker

Imagen multi-stage: compila con pnpm y corre en producción solo con `dist/` + dependencias de producción, como usuario no root (`node`).

```bash
docker build -t login-backend .
docker run -p 3000:3000 login-backend
```

O con docker compose:

```bash
docker compose up --build
```

La API queda en `http://localhost:3000` y la documentación en `http://localhost:3000/docs`.

# Clase 01 – Módulo 04: Desarrollo de API REST con Express/Koa

---

## Objetivos

Al finalizar esta clase, el estudiante será capaz de:

- Comprender qué es una API REST y los principios que la definen.
- Crear una API profesional con Express y Koa, estructurada por capas.
- Aplicar middlewares y validaciones en los endpoints.
- Implementar manejo de errores y respuestas estandarizadas.
- Versionar la API y aplicar buenas prácticas de diseño REST.
- Evaluar cuándo usar Express o Koa según el tipo de proyecto.

---

## Contenido

1. ¿Qué es una API REST?
2. Introducción a Koa: historia, rendimiento y ventajas
3. Instalación y estructura base del proyecto (Koa y Express)
4. Creación de endpoints y middlewares
5. Validaciones y manejo de errores
6. Respuestas estandarizadas
7. Versionado de APIs
8. Buenas prácticas REST
9. Comparativa Express vs Koa
10. Rendimiento y casos de uso recomendados

---

## 1 ¿Qué es una API REST?

Una API REST (Representational State Transfer) permite exponer recursos y operar sobre ellos mediante HTTP. Su diseño se basa en principios como:

- **Stateless**: Cada petición es independiente.
- **Recursos únicos**: Representados como URIs (`/users/1`).
- **Verbos HTTP**: `GET`, `POST`, `PUT`, `DELETE`.
- **Representación en JSON** (por convención moderna).
- **Mensajes claros y códigos de estado HTTP coherentes.**

---

## 2 Introducción a Koa: historia, rendimiento y ventajas

**Koa.js** es un framework minimalista de backend para Node.js, creado en **2013** por el equipo de desarrollo detrás de **Express.js**. Fue diseñado para superar las limitaciones del enfoque de callbacks en Express, proponiendo una arquitectura moderna basada completamente en **promesas y `async/await`**.

### Características destacadas

| Característica | Detalle |
|----------------|---------|
| 🚀 Rendimiento | Más rápido que Express en benchmarks comunes |
| 🧠 Filosofía   | "Menos es más": núcleo minimalista y flexible |
| ⚙️ Middleware | Basado en composición con `async/await` |
| 📦 Tamaño      | Muy liviano y sin dependencias innecesarias |
| 🛠️ Extensibilidad | Se construye desde cero con tus propias decisiones arquitectónicas |

### Benchmarks

Fuente: [fastify/benchmarks](https://github.com/fastify/benchmarks)

| Framework | Req/sec (aproximado) |
|-----------|----------------------|
| Fastify   | ~70,000              |
| **Koa**   | ~35,000              |
| Express   | ~28,000              |

Koa logra mayor rendimiento gracias a su enfoque de bajo nivel, sin middleware innecesario.

### ¿Cuándo usar Koa?

Koa es ideal cuando:

- Necesitas **control completo** sobre tu arquitectura.
- Buscas rendimiento sin usar frameworks complejos.
- Estás creando microservicios pequeños y altamente optimizados.
- Ya tienes experiencia previa con Express y deseas más flexibilidad.

### Consideraciones

Koa no incluye router, validaciones, ni manejo de errores por defecto. Estos deben configurarse manualmente, lo que brinda más poder, pero exige mayor responsabilidad.

---

## 3 Instalación y estructura base del proyecto

### Koa – Paso a paso

```bash
mkdir api-rest-koa && cd api-rest-koa
pnpm init -y
pnpm add koa koa-router koa-bodyparser
pnpm add -D typescript ts-node-dev @types/node @types/koa @types/koa-router
```

**Archivo `tsconfig.json`:**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "CommonJS",
    "moduleResolution": "node",
    "outDir": "dist",
    "rootDir": "src",
    "esModuleInterop": true,
    "strict": true,
    "skipLibCheck": true
  }
}
```

### Estructura inspirada en NestJS

```
src/
├── main.ts
├── app.ts
├── routes/
│   └── v1/
│       └── user.routes.ts
├── controllers/
│   └── user.controller.ts
├── services/
│   └── user.service.ts
├── middlewares/
│   └── error.middleware.ts
├── validators/
│   └── user.validator.ts
├── utils/
│   └── response.ts
├── types/
│   └── user.ts
```

---

## 4 reación de endpoints y middlewares

### `main.ts`

```ts
import { app } from './app'

const PORT = 3000

app.listen(PORT, () => {
	console.log(`Server ready at http://localhost:${PORT}`)
})
```

### `app.ts`

```ts
import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import userRoutes from './routes/v1/user.routes'
import { errorMiddleware } from './middlewares/error.middleware'

const app = new Koa()

app.use(errorMiddleware)
app.use(bodyParser())
app.use(userRoutes.routes()).use(userRoutes.allowedMethods())

export { app }
```

### `routes/v1/user.routes.ts`

```ts
import Router from 'koa-router'
import { getUsers, createUser } from '../../controllers/user.controller'

const router = new Router({ prefix: '/api/v1/users' })

router.get('/', getUsers)
router.post('/', createUser)

export default router
```

### `controllers/user.controller.ts`

```ts
import { Context } from 'koa'
import { UserService } from '../services/user.service'
import { successResponse } from '../utils/response'

export const getUsers = async (ctx: Context) => {
	const users = await UserService.getAll()
	ctx.body = successResponse(users)
}

export const createUser = async (ctx: Context) => {
	const user = await UserService.create(ctx.request.body)
	ctx.status = 201
	ctx.body = successResponse(user, 'Usuario creado correctamente')
}
```

### `services/user.service.ts`

```ts
export const UserService = {
	async getAll() {
		return [{ id: 1, name: 'Alice' }]
	},
	async create(data: any) {
		return { id: Date.now(), ...data }
	}
}
```

---

## 5 Validaciones y manejo de errores

### `middlewares/error.middleware.ts`

```ts
import { Context, Next } from 'koa'

export const errorMiddleware = async (ctx: Context, next: Next) => {
	try {
		await next()
	} catch (err: any) {
		ctx.status = err.status || 500
		ctx.body = {
			status: 'error',
			message: err.message || 'Internal Server Error'
		}
	}
}
```

---

## 6 Respuestas estandarizadas

### `utils/response.ts`

```ts
export const successResponse = (data: any, message = 'Success') => ({
	status: 'success',
	message,
	data
})
```

Ejemplo de respuesta:

```json
{
  "status": "success",
  "message": "Usuario creado correctamente",
  "data": {
    "id": 123,
    "name": "Alice"
  }
}
```

---

## 7 Scripts

```json
	"dev": "ts-node-dev --respawn --transpile-only src/main.ts",
    "build": "tsc",
    "start": "node dist/main.js"
```

---

## 8 Versionado de APIs

- Prefijos en ruta: `/api/v1/users`
- También se puede usar `Accept-Version` o `Accept: application/vnd.api.v1+json`

---

## 9 Buenas prácticas REST

| Recomendación                  | Descripción |
|-------------------------------|-------------|
| Status codes correctos        | 200, 201, 204, 400, 401, 404, 500 |
| Nombres de rutas              | `/users`, `/orders/:id` |
| Verbos HTTP adecuados         | GET, POST, PUT, DELETE |
| Formato de respuesta uniforme | `{ status, message, data }` |
| Separación de capas           | routes → controllers → services |

---

## 10 Comparativa Express vs Koa

| Característica        | **Express** | **Koa** |
|-----------------------|-------------|----------|
| Popularidad           | Muy alta    | En crecimiento |
| Middleware            | Callback    | `async/await` |
| Tamaño                | Más pesado  | Ligero |
| Estructura            | Acoplada    | Modular |
| Rendimiento           | Medio       | Mejor |
| Simplicidad inicial   | Alta        | Media |

---

## 11 Rendimiento y casos de uso recomendados

Koa es más rápido que Express en benchmarks. Ideal cuando:

- Se busca máxima flexibilidad.
- Se trabaja con microservicios o APIs desacopladas.
- Se prioriza rendimiento y limpieza del código.

Evitar Koa si:

- Se requiere productividad inmediata.
- El equipo es principiante en backend.

---
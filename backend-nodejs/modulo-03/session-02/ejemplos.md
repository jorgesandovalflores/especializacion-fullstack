## ✅ PARTE 1: RBAC con NestJS + TypeScript

---

### 🌟 Objetivo

Implementar un sistema de autorización basado en roles (RBAC) usando middleware y guards en NestJS. El objetivo es proteger rutas según el rol del usuario (`admin`, `user`, `supervisor`, etc.).

---

### 📁 Estructura del Proyecto

```bash
rbac-nestjs/
│
├── src/
│   ├── auth/
│   │   ├── auth.middleware.ts         # Simula autenticación, inyecta user mock
│   │   ├── roles.decorator.ts         # Decorador personalizado para definir roles
│   │   └── roles.guard.ts             # Guard que valida los roles permitidos
│   │
│   ├── user/
│   │   └── user.controller.ts         # Controlador con rutas protegidas
│   │
│   ├── app.module.ts
│   └── main.ts
│
├── tsconfig.json
└── package.json
```

---

### 🧱 Paso 1: Crear el proyecto

```bash
nest new rbac-nestjs
cd rbac-nestjs
```

---

### 🧱 Paso 2: Crear el módulo y controlador `user`

```bash
nest g module user
nest g controller user
```

Esto genera:

```
src/user/user.module.ts
src/user/user.controller.ts
```

---

### 🧱 Paso 3: Simular autenticación (`auth.middleware.ts`)

```ts
// src/auth/auth.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
	use(req: Request, res: Response, next: NextFunction) {
		// Simulamos un usuario autenticado
		(req as any).user = {
			id: 1,
			role: 'admin',
			permissions: ['view_reports']
		};
		next();
	}
}
```

Luego lo aplicamos en `main.ts`:

```ts
// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AuthMiddleware } from './auth/auth.middleware';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.use(new AuthMiddleware().use);
	await app.listen(3000);
}
bootstrap();
```

---

### 🧱 Paso 4: Crear el decorador `Roles`

```ts
// src/auth/roles.decorator.ts
import { SetMetadata } from '@nestjs/common';

export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
```

---

### 🧱 Paso 5: Crear el guard `RolesGuard`

```ts
// src/auth/roles.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
	constructor(private reflector: Reflector) {}

	canActivate(context: ExecutionContext): boolean {
		const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
		if (!requiredRoles) return true;

		const request = context.switchToHttp().getRequest();
		const user = request.user;

		return user && requiredRoles.includes(user.role);
	}
}
```

---

### 🧱 Paso 6: Registrar el guard globalmente

```ts
// src/app.module.ts
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './auth/roles.guard';
import { UserModule } from './user/user.module';

@Module({
	imports: [UserModule],
	providers: [
		{
			provide: APP_GUARD,
			useClass: RolesGuard
		}
	]
})
export class AppModule {}
```

---

### 🧱 Paso 7: Crear las rutas protegidas

```ts
// src/user/user.controller.ts
import { Controller, Get, Req } from '@nestjs/common';
import { Request } from 'express';
import { Roles } from '../auth/roles.decorator';

@Controller()
export class UserController {
	@Get('profile')
	getProfile(@Req() req: Request) {
		return { message: 'Perfil de usuario', user: (req as any).user };
	}

	@Get('admin/users')
	@Roles('admin')
	getAllUsers() {
		return { message: 'Usuarios solo para admin' };
	}

	@Get('reports')
	@Roles('admin', 'supervisor')
	getReports() {
		return { message: 'Reportes visibles para admin y supervisor' };
	}
}
```

---

### 🔪 Prueba

Inicia el servidor:

```bash
npm run start:dev
```

Visita:

* [http://localhost:3000/profile](http://localhost:3000/profile)
* [http://localhost:3000/admin/users](http://localhost:3000/admin/users)
* [http://localhost:3000/reports](http://localhost:3000/reports)

---

## ✅ PARTE 2: RBAC con Koa + TypeScript

---

### 🌟 Objetivo

Implementar control de acceso basado en roles en Koa, simulando autenticación y protección de rutas con middleware.

---

### 📁 Estructura del Proyecto

```bash
rbac-koa-ts/
├── src/
│   ├── middleware/
│   │   └── authorize.ts
│   └── server.ts
│
├── tsconfig.json
└── package.json
```

---

### 🧱 Paso 1: Crear el proyecto

```bash
mkdir rbac-koa-ts && cd rbac-koa-ts
npm init -y
npm install koa koa-router koa-bodyparser
npm install -D typescript ts-node @types/koa @types/koa-router @types/node
```

---

### 🧱 Paso 2: `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "outDir": "dist",
    "rootDir": "src",
    "strict": true,
    "esModuleInterop": true
  }
}
```

---

### 🧱 Paso 3: Middleware `authorize.ts`

```ts
// src/middleware/authorize.ts
import { Middleware } from 'koa';

export const authorize = (roles: string[]): Middleware => {
	return async (ctx, next) => {
		const user = ctx.state.user;
		if (!user || !roles.includes(user.role)) {
			ctx.status = 403;
			ctx.body = { message: 'Access denied' };
			return;
		}
		await next();
	};
};
```

---

### 🧱 Paso 4: Servidor y rutas

```ts
// src/server.ts
import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import { authorize } from './middleware/authorize';

const app = new Koa();
const router = new Router();

// Simula autenticación
app.use(async (ctx, next) => {
	ctx.state.user = {
		id: 1,
		role: 'admin',
		permissions: ['view_reports']
	};
	await next();
});

router.get('/profile', (ctx) => {
	ctx.body = { message: 'Perfil público', user: ctx.state.user };
});

router.get('/admin/users', authorize(['admin']), (ctx) => {
	ctx.body = { message: 'Solo para admins' };
});

router.get('/reports', authorize(['admin', 'supervisor']), (ctx) => {
	ctx.body = { message: 'Vista de reportes' };
});

app.use(bodyParser());
app.use(router.routes()).use(router.allowedMethods());

app.listen(3000, () => console.log('Koa server http://localhost:3000'));
```

---

## ✅ PARTE 3: RBAC con Fastify + TypeScript

---

### 🌟 Objetivo

Implementar control de acceso basado en roles en Fastify, simulando autenticación y protección de rutas mediante hooks personalizados.

---

### 📁 Estructura del Proyecto

```bash
rbac-fastify-ts/
├── src/
│   ├── authorize.ts         # Hook de autorización basado en roles
│   ├── server.ts            # Servidor y rutas
│
├── tsconfig.json
└── package.json
```

---

### 🧱 Paso 1: Crear el proyecto

```bash
mkdir rbac-fastify-ts && cd rbac-fastify-ts
npm init -y
npm install fastify
npm install -D typescript ts-node @types/node
```

---

### 🧱 Paso 2: `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "outDir": "dist",
    "rootDir": "src",
    "strict": true,
    "esModuleInterop": true
  }
}
```

---

### 🧱 Paso 3: Hook `authorize.ts`

```ts
// src/authorize.ts
import { FastifyRequest, FastifyReply } from 'fastify';

export function authorize(roles: string[]) {
	return async (req: FastifyRequest, reply: FastifyReply) => {
		const user = (req as any).user;
		if (!user || !roles.includes(user.role)) {
			reply.status(403).send({ message: 'Access denied' });
		}
	};
}
```

---

### 🧱 Paso 4: Servidor y rutas

```ts
// src/server.ts
import Fastify from 'fastify';
import { authorize } from './authorize';

const app = Fastify();

// Simula autenticación
app.addHook('onRequest', async (req, _reply) => {
	(req as any).user = {
		id: 1,
		role: 'admin',
		permissions: ['view_reports']
	};
});

app.get('/profile', async (req, reply) => {
	reply.send({ message: 'Perfil público', user: (req as any).user });
});

app.get('/admin/users', {
	handler: async (req, reply) => {
		await authorize(['admin'])(req, reply);
		reply.send({ message: 'Solo para admins' });
	}
});

app.get('/reports', {
	handler: async (req, reply) => {
		await authorize(['admin', 'supervisor'])(req, reply);
		reply.send({ message: 'Vista de reportes' });
	}
});

app.listen({ port: 3000 }, () => {
	console.log('Fastify server http://localhost:3000');
});
```

## Comparación entre Enfoques (NestJS, Koa, Fastify)

### ✅ NestJS

* Usa **Guards**, que son equivalentes a middlewares pero integrados al sistema de inyección de dependencias y al ciclo de vida de NestJS.
* También puedes usar **middlewares clásicos** (como el de autenticación).
* Usa el decorador `@Roles()` junto con `RolesGuard` para determinar si un usuario tiene acceso.

📌 **Ventaja**: Muy organizado, reutilizable, compatible con decoradores, testable.

---

### ✅ Koa

* Usa un **middleware clásico** (`authorize`) que verifica si `ctx.state.user` tiene el rol esperado.
* Se aplica por ruta o en grupos de rutas.

📌 **Ventaja**: Simple y directo.

---

### ✅ Fastify

* Usa **hooks** (`onRequest`) para autenticación y funciones intermedias (tipo middleware) en el handler para autorización (`authorize`).
* Se ejecutan antes del controlador (`handler`).

📌 **Ventaja**: Muy rápido y flexible.

---

### 🧠 Conclusión

Todos siguen este flujo:

1. **Autenticación previa** → simulan un usuario autenticado (`req.user`, `ctx.state.user`, etc.).
2. **Autorización** → validan si ese usuario tiene el rol o permisos requeridos.
3. **Acción permitida o denegada** → retornan `403` si no está autorizado.

Este patrón permite separar claramente:

* Quién es el usuario (autenticación).
* Qué puede hacer (autorización).

📌 Este enfoque también puede evolucionar fácilmente a ABAC (Attribute-Based Access Control), permitiendo reglas más complejas basadas en atributos del usuario, el recurso o el contexto.

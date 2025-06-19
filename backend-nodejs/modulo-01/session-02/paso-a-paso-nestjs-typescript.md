
# 🚀 Paso a paso: Crear un proyecto NestJS con TypeScript

## ✅ 1. Instalar CLI de NestJS

```bash
npm install -g @nestjs/cli
```

---

## ✅ 2. Crear el proyecto base

```bash
nest new nombre-del-proyecto
```

> Durante la creación, elige `npm`, `yarn` o `pnpm` como gestor de paquetes.

---

## ✅ 3. Estructura base generada

```bash
src/
├── app.controller.ts
├── app.controller.spec.ts
├── app.module.ts
├── app.service.ts
└── main.ts
```

- `main.ts`: Punto de entrada de la app
- `app.module.ts`: Módulo raíz
- `app.controller.ts`: Controlador de ejemplo
- `app.service.ts`: Servicio de ejemplo

---

## ✅ 4. Ejecutar el servidor de desarrollo

```bash
npm run start:dev
```

> App corriendo por defecto en: http://localhost:3000

---

## ✅ 5. Crear un nuevo módulo + controlador + servicio

Ejemplo: módulo `user`

```bash
nest g module user
nest g controller user
nest g service user
```

Esto crea:

```bash
src/user/
├── user.controller.ts
├── user.module.ts
└── user.service.ts
```

---

## ✅ 6. Agregar rutas de ejemplo

```ts
// src/user/user.controller.ts
import { Controller, Get } from '@nestjs/common';

@Controller('users')
export class UserController {
  @Get()
  findAll() {
    return ['Juan', 'María', 'Luis'];
  }
}
```

---

## ✅ 7. Tipar el servicio con DTO

```bash
nest g class user/dto/create-user.dto --no-spec
```

```ts
// src/user/dto/create-user.dto.ts
export class CreateUserDto {
  name: string;
  email: string;
}
```

---

## ✅ 8. TypeScript y herramientas incluidas

NestJS ya incluye por defecto:

- TypeScript
- ESLint
- Jest
- Hot Reload con `start:dev`

---

## ✅ 9. Variables de entorno

Crear `.env`:

```env
PORT=3000
```

Instalar `@nestjs/config`:

```bash
npm install @nestjs/config
```

Y usar en `app.module.ts`:

```ts
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot()],
})
```

Para acceder a variables:

```ts
process.env.PORT
```

---

## ✅ 10. Compilar el proyecto

```bash
npm run build
```

Esto compila TypeScript a JavaScript en la carpeta `dist/`.

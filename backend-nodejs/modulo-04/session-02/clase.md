# Clase 02 – Módulo 03  
## Documentación con Swagger (OpenAPI) en NestJS y Koa

> Convención del curso: **código en inglés** y **comentarios en español**. Indentación con **4 espacios**.

---

## Objetivos

- Entender **qué es OpenAPI** y **qué es Swagger** (y en qué se diferencian).
- Conocer la **anatomía** de un documento OpenAPI 3.x y sus componentes.
- Dominar **tags/etiquetas** clave (OpenAPI + decoradores de NestJS/JSDoc en Koa).
- Probar endpoints con **Swagger UI** (incluyendo flujos con Bearer Token).
- Versionar y **mantener** la documentación a lo largo del tiempo.
- Implementar un **CRUD completo** con **lista pública** y **lista privada** en **NestJS** y **Koa** con **mock data**.

---

## Parte I — Fundamentos

### 1) ¿Qué es OpenAPI?
OpenAPI es una **especificación** (un formato estándar) para describir **APIs HTTP** (endpoints, parámetros, cuerpos, respuestas, seguridad, etc.). Su resultado es un **documento** (generalmente JSON/YAML) que sirve como **contrato** entre equipos (Backend, Frontend, QA, terceros).

### 2) ¿Qué es Swagger?
**Swagger** es un **conjunto de herramientas** que usa OpenAPI:
- **Swagger UI:** interfaz web para **explorar y probar** la API a partir del contrato.
- **Swagger Editor:** editor para escribir/validar especificaciones OpenAPI.
- **OpenAPI/Swagger Codegen:** genera **SDKs** de clientes/servidores desde el contrato.

> Relación: **OpenAPI** = estándar; **Swagger** = herramientas que leen ese estándar.

### 3) Estilos de trabajo: Contract-first vs Code-first
- **Contract-first:** se escribe el **OpenAPI primero**; luego se genera/implementa código a partir del contrato. Útil cuando muchos clientes dependen del contrato.
- **Code-first:** el contrato se **genera desde el código** (decoradores en NestJS, JSDoc en Koa). Productivo para equipos backend, mantiene doc cerca del código.

Ambos son válidos. En este curso, haremos **code-first** en NestJS y Koa.

---

## Parte II — Anatomía de OpenAPI 3.x (visión práctica)

Un documento OpenAPI contiene, entre otros:

- **openapi:** versión de la spec (ej. `"3.0.3"` o `"3.1.0"`).
- **info:** metadatos: `title`, `version`, `description`, `termsOfService`, `contact`, `license`.
- **servers:** lista de servidores base. Soporta **variables** para entornos (`{env}`).
- **paths:** rutas y **operaciones** (`get`, `post`, `patch`, `delete`, etc.).
- **components:** piezas reutilizables: `schemas`, `responses`, `parameters`, `headers`, `requestBodies`, `securitySchemes`, `links`, `callbacks`.
- **security:** seguridad **global** (aplica a todas las operaciones si no se override).
- **tags:** grupos lógicos de endpoints (ej. `Users`, `Auth`, `Orders`).
- **externalDocs:** enlaces a documentación externa.

### Operaciones (dentro de `paths`):
- **summary / description:** explican el propósito del endpoint.
- **tags:** a qué grupo pertenece (orden y agrupación en el UI).
- **operationId:** identificador único (útil para codegen).
- **parameters:** `path`, `query`, `header`, `cookie` (con `name`, `in`, `schema`, `required`, `description`).
- **requestBody:** cuerpo de la petición con `content` por `mediaType` (ej. `application/json`, `multipart/form-data`).
- **responses:** **obligatorio** al menos un código; define `description`, `headers` y `content` con `schema`.
- **security:** anula o complementa la seguridad global por operación.

### Esquemas y tipos (JSON Schema en OpenAPI)
- **Primitivos:** `string`, `number`, `integer`, `boolean`, (`null` en 3.1).
- **Compuestos:** `object` (con `properties`, `required`), `array` (con `items`).
- **Formatos útiles:** `email`, `uuid`, `uri`, `date-time`, `binary`, `password`.
- **Composición:** `allOf`, `oneOf`, `anyOf`, `not` para herencia/polimorfismo.
- **$ref:** referencia a componentes reutilizables (`#/components/schemas/MySchema`).
- **discriminator:** para polimorfismo (selecciona el schema según un campo).

### Serialización de parámetros
- **Query/Path/Header/Cookie** usan `style` y `explode` para definir cómo se codifican arrays/objetos:
  - `form` (por defecto en query), `simple` (path/header), `deepObject` (objetos anidados en query).
- **Path params** siempre `required: true`.

### Ejemplos
- Puedes definir `example` (único) o `examples` (múltiples) en media types y parámetros.
- **Buenas prácticas:** añade **ejemplos reales** y casos de error.

---

## Parte III — Seguridad en OpenAPI

Tipos comunes en `components.securitySchemes`:

- **http + bearer:** JWT u otros tokens por `Authorization: Bearer <token>`.
- **http + basic:** credenciales básicas (no recomendado sin TLS).
- **apiKey:** token en `header`, `query` o `cookie` (ej. `x-api-key`).
- **oauth2:** flujos `authorizationCode`, `clientCredentials`, `password`, `implicit`.
- **openIdConnect:** proveedores OIDC.

> La seguridad puede definirse **globalmente** o por operación. En Swagger UI, aparecerá el botón **Authorize**.

---

## Parte IV — “Etiquetas” que usaremos (mapa mental)

### 1) Claves OpenAPI más usadas (extracto)
- `info.title`, `info.version`, `servers`, `paths`, `components.schemas`, `components.securitySchemes`, `security`, `tags`.

### 2) Decoradores de **NestJS** → concepto OpenAPI
- `@ApiTags('Books')` → `tags` (agrupación/menú en UI).
- `@ApiOperation({ summary, description, deprecated })` → `summary/description/deprecated`.
- `@ApiResponse({ status, description, type })` → `responses`.
- `@ApiBearerAuth('bearer')` → `security` (usa esquema llamado `bearer`).
- `@ApiParam`, `@ApiQuery`, `@ApiHeader` → `parameters` (`in: path|query|header`).
- `@ApiBody` / `@ApiConsumes` → `requestBody` (`content` + `mediaType`).
- `@ApiProperty`, `@ApiPropertyOptional` (en DTOs) → `components.schemas`.

### 3) JSDoc **Koa** (swagger-jsdoc) → concepto OpenAPI
- Bloque `@openapi` en comentarios: define `paths.*`, `tags`, `parameters`, `requestBody`, `responses`.
- Esquemas y seguridad se declaran en `definition.components`.

---

## Parte V — Versionado, mantenimiento y gobierno

- **Versionar** en `info.version` y/o en URL (`/v1`, `/v2`), o con **headers** (content negotiation).
- **Múltiples specs**: exponer `/docs/v1` y `/docs/v2` para mantener compatibilidad.
- **Deprecación:** marca operaciones (`deprecated: true`) y define **políticas** (cuánto tiempo se soporta).
- **Changelog**: mantén un registro de cambios (nuevos campos, deprecaciones, breaks).
- **CI/CD de documentación:**
  - Generar `openapi.json` en cada build.
  - Linting con **Spectral** (evita smells y violaciones de estilo).
  - Publicar a **Pages**, **S3/CDN** o portales (Redoc/Redocly).
- **Seguridad del `/docs` en producción**:
  - Autenticación básica o IP allowlist, o solo exponer versiones públicas.
  - Evitar `persistAuthorization` en ambientes expuestos.

---

## Parte VI — Buenas prácticas (resumen operativo)

- Documenta **todos** los **status codes** significativos (200/201/400/401/403/404/409/422/500).
- Estándar de **errores** consistente (ej. `application/problem+json` o un DTO de error).
- Incluye **ejemplos** y **descripciones** útiles (no triviales).
- Mantén DTOs/Esquemas **exactos** a lo que valida tu backend.
- Reutiliza con `$ref`, pero evita **ciclos** y **sobre-complejidad**.
- Para **uploads**, usa `multipart/form-data` con `format: binary`.
- Documenta **paginación**, **filtros**, **rate limits** y **headers** relevantes.
- Separa público vs privado con **security** y deja claro el flujo de auth.

---

# Parte VII — Implementación en **NestJS** (code-first)

### Dependencias
```bash
pnpm add @nestjs/swagger swagger-ui-express class-validator class-transformer
```

### Estructura sugerida
```
src/
  main.ts
  app.module.ts
  common/
    guards/dummy-jwt.guard.ts
  books/
    books.module.ts
    books.controller.ts
    books.service.ts
    dto/
      book.dto.ts
      create-book.dto.ts
      update-book.dto.ts
```

### `main.ts` — Bootstrap + Swagger UI
```ts
// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.setGlobalPrefix('api'); // comentario: prefijo global

    const config = new DocumentBuilder()
        .setTitle('Books API (NestJS)')
        .setDescription('CRUD with mock data and Swagger')
        .setVersion('1.0.0')
        .addBearerAuth(
            { type: 'http', scheme: 'bearer', bearerFormat: 'JWT', in: 'header' },
            'bearer'
        )
        .addServer('/api')
        .build();

    const document = SwaggerModule.createDocument(app, config, { deepScanRoutes: true });
    SwaggerModule.setup('/docs', app, document, {
        swaggerOptions: { persistAuthorization: true, displayRequestDuration: true },
        customSiteTitle: 'Books API Docs (NestJS)',
    });

    await app.listen(3000);
    console.log('NestJS: http://localhost:3000');
    console.log('Docs:   http://localhost:3000/docs');
}
bootstrap();
```

### `app.module.ts`
```ts
// src/app.module.ts
import { Module } from '@nestjs/common';
import { BooksModule } from './books/books.module';

@Module({
    imports: [BooksModule],
})
export class AppModule {}
```

### Guard dummy (privado con Bearer `testtoken`)
```ts
// src/common/guards/dummy-jwt.guard.ts
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class DummyJwtGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        // comentario: validación mínima del token
        const req = context.switchToHttp().getRequest();
        const auth = req.headers['authorization'] as string | undefined;
        if (!auth || !auth.startsWith('Bearer ')) throw new UnauthorizedException('Missing bearer token');
        const token = auth.substring('Bearer '.length).trim();
        if (token !== 'testtoken') throw new UnauthorizedException('Invalid token');
        return true;
    }
}
```

### DTOs
```ts
// src/books/dto/book.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class BookDto {
    @ApiProperty({ example: '1' })
    id: string;

    @ApiProperty({ example: 'Clean Architecture' })
    title: string;

    @ApiProperty({ example: 'Robert C. Martin' })
    author: string;

    @ApiProperty({ example: 2017 })
    year: number;
}
```

```ts
// src/books/dto/create-book.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, Min, MinLength } from 'class-validator';

export class CreateBookDto {
    @ApiProperty({ example: 'Clean Architecture' })
    @IsString()
    @MinLength(2)
    title: string;

    @ApiProperty({ example: 'Robert C. Martin' })
    @IsString()
    @MinLength(2)
    author: string;

    @ApiProperty({ example: 2017 })
    @IsInt()
    @Min(0)
    year: number;
}
```

```ts
// src/books/dto/update-book.dto.ts
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Min, MinLength } from 'class-validator';

export class UpdateBookDto {
    @ApiPropertyOptional({ example: 'Refactoring' })
    @IsOptional()
    @IsString()
    @MinLength(2)
    title?: string;

    @ApiPropertyOptional({ example: 'Martin Fowler' })
    @IsOptional()
    @IsString()
    @MinLength(2)
    author?: string;

    @ApiPropertyOptional({ example: 2018 })
    @IsOptional()
    @IsInt()
    @Min(0)
    year?: number;
}
```

### Service (mock data)
```ts
// src/books/books.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { BookDto } from './dto/book.dto';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BooksService {
    // comentario: almacenamiento en memoria (mock)
    private books: BookDto[] = [
        { id: '1', title: 'Clean Architecture', author: 'Robert C. Martin', year: 2017 },
        { id: '2', title: 'Refactoring', author: 'Martin Fowler', year: 2018 },
    ];

    findPublic(): BookDto[] { return this.books; }
    findAdmin(): BookDto[] { return this.books; }

    findOne(id: string): BookDto {
        const found = this.books.find(b => b.id === id);
        if (!found) throw new NotFoundException('Book not found');
        return found;
    }

    create(dto: CreateBookDto): BookDto {
        const id = (this.books.length + 1).toString();
        const book: BookDto = { id, ...dto };
        this.books.push(book);
        return book;
    }

    update(id: string, dto: UpdateBookDto): BookDto {
        const idx = this.books.findIndex(b => b.id === id);
        if (idx < 0) throw new NotFoundException('Book not found');
        this.books[idx] = { ...this.books[idx], ...dto };
        return this.books[idx];
    }

    remove(id: string): void {
        const idx = this.books.findIndex(b => b.id === id);
        if (idx < 0) throw new NotFoundException('Book not found');
        this.books.splice(idx, 1);
    }
}
```

### Controller + Swagger
```ts
// src/books/books.controller.ts
import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BooksService } from './books.service';
import { BookDto } from './dto/book.dto';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { DummyJwtGuard } from '../common/guards/dummy-jwt.guard';

@ApiTags('Books')
@Controller('books')
export class BooksController {
    constructor(private readonly books: BooksService) {}

    @Get()
    @ApiOperation({ summary: 'List public books' })
    @ApiResponse({ status: 200, type: [BookDto] })
    findPublic(): BookDto[] { return this.books.findPublic(); }

    @Get('admin')
    @UseGuards(DummyJwtGuard)
    @ApiBearerAuth('bearer')
    @ApiOperation({ summary: 'List private books (admin)' })
    @ApiResponse({ status: 200, type: [BookDto] })
    findAdmin(): BookDto[] { return this.books.findAdmin(); }

    @Get(':id')
    @ApiOperation({ summary: 'Get book by id' })
    @ApiResponse({ status: 200, type: BookDto })
    @ApiResponse({ status: 404, description: 'Not Found' })
    findOne(@Param('id') id: string): BookDto { return this.books.findOne(id); }

    @Post()
    @ApiOperation({ summary: 'Create book' })
    @ApiResponse({ status: 201, type: BookDto })
    create(@Body() dto: CreateBookDto): BookDto { return this.books.create(dto); }

    @Patch(':id')
    @ApiOperation({ summary: 'Update book' })
    @ApiResponse({ status: 200, type: BookDto })
    update(@Param('id') id: string, @Body() dto: UpdateBookDto): BookDto {
        return this.books.update(id, dto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete book' })
    @ApiResponse({ status: 204, description: 'No Content' })
    remove(@Param('id') id: string): void { this.books.remove(id); }
}
```

### Módulo
```ts
// src/books/books.module.ts
import { Module } from '@nestjs/common';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';

@Module({
    controllers: [BooksController],
    providers: [BooksService],
})
export class BooksModule {}
```

**Probar (NestJS):**
- Swagger UI: `http://localhost:3000/docs`
- Público: `GET /api/books`
- Privado: `GET /api/books/admin` → **Authorize** → Bearer `testtoken`

---

# Parte VIII — Implementación en **Koa** (code-first vía JSDoc)

> Para evitar problemas de ESM, usa CommonJS con `ts-node`.

### `package.json` (sugerido)
```json
{
  "name": "swagger-koa",
  "private": true,
  "scripts": {
    "start:dev": "ts-node src/server.ts"
  },
  "dependencies": {
    "@koa/router": "^12.0.0",
    "koa": "^2.15.0",
    "koa-bodyparser": "^4.4.0",
    "koa2-swagger-ui": "^5.10.0",
    "swagger-jsdoc": "^6.2.8"
  },
  "devDependencies": {
    "@types/koa": "^2.13.8",
    "@types/koa__router": "^12.0.4",
    "@types/koa-bodyparser": "^5.0.2",
    "ts-node": "^10.9.2",
    "typescript": "^5.5.4"
  }
}
```

### `tsconfig.json` (sugerido)
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "CommonJS",
    "moduleResolution": "node",
    "esModuleInterop": true,
    "strict": false,
    "outDir": "dist",
    "skipLibCheck": true
  },
  "include": ["src"]
}
```

### Tipos y mock store
```ts
// src/types.ts
export interface Book { id: string; title: string; author: string; year: number; }
export interface CreateBook { title: string; author: string; year: number; }
export interface UpdateBook { title?: string; author?: string; year?: number; }
```

```ts
// src/store.ts
import { Book } from './types';
export const books: Book[] = [
    { id: '1', title: 'Clean Architecture', author: 'Robert C. Martin', year: 2017 },
    { id: '2', title: 'Refactoring', author: 'Martin Fowler', year: 2018 },
];
```

### Auth Bearer dummy
```ts
// src/auth.ts
import { Context, Next } from 'koa';

export async function authBearer(ctx: Context, next: Next) {
    // comentario: validación mínima del token
    const auth = ctx.headers['authorization'];
    if (!auth || !auth.startsWith('Bearer ')) {
        ctx.status = 401;
        ctx.body = { statusCode: 401, error: 'Unauthorized', message: 'Missing bearer token' };
        return;
    }
    const token = auth.substring('Bearer '.length).trim();
    if (token !== 'testtoken') {
        ctx.status = 401;
        ctx.body = { statusCode: 401, error: 'Unauthorized', message: 'Invalid token' };
        return;
    }
    await next();
}
```

### Rutas con JSDoc OpenAPI
```ts
// src/routes/books.routes.ts
import Router from '@koa/router';
import { books } from '../store';
import { Book, CreateBook, UpdateBook } from '../types';
import { Context } from 'koa';

const router = new Router({ prefix: '/books' });

/**
 * @openapi
 * /api/books:
 *   get:
 *     tags: [Books]
 *     summary: List public books
 *     responses:
 *       200:
 *         description: OK
 */
router.get('/', (ctx: Context) => {
    ctx.body = books;
});

/**
 * @openapi
 * /api/books/admin:
 *   get:
 *     tags: [Books]
 *     summary: List private books (admin)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200: { description: OK (private) }
 *       401: { description: Unauthorized }
 */
router.get('/admin', (ctx: Context) => {
    ctx.body = books;
});

/**
 * @openapi
 * /api/books/{id}:
 *   get:
 *     tags: [Books]
 *     summary: Get book by id
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Found }
 *       404: { description: Not Found }
 */
router.get('/:id', (ctx: Context) => {
    const found = books.find(b => b.id === ctx.params.id);
    if (!found) {
        ctx.status = 404;
        ctx.body = { statusCode: 404, error: 'Not Found', message: 'Book not found' };
        return;
    }
    ctx.body = found;
});

/**
 * @openapi
 * /api/books:
 *   post:
 *     tags: [Books]
 *     summary: Create book
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateBook'
 *     responses:
 *       201: { description: Created }
 */
router.post('/', (ctx: Context) => {
    const body = ctx.request.body as CreateBook;
    const id = (books.length + 1).toString();
    const book: Book = { id, ...body };
    books.push(book);
    ctx.status = 201;
    ctx.body = book;
});

/**
 * @openapi
 * /api/books/{id}:
 *   patch:
 *     tags: [Books]
 *     summary: Update book
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateBook'
 *     responses:
 *       200: { description: Updated }
 *       404: { description: Not Found }
 */
router.patch('/:id', (ctx: Context) => {
    const idx = books.findIndex(b => b.id === ctx.params.id);
    if (idx < 0) {
        ctx.status = 404;
        ctx.body = { statusCode: 404, error: 'Not Found', message: 'Book not found' };
        return;
    }
    const body = ctx.request.body as UpdateBook;
    books[idx] = { ...books[idx], ...body };
    ctx.body = books[idx];
});

/**
 * @openapi
 * /api/books/{id}:
 *   delete:
 *     tags: [Books]
 *     summary: Delete book
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       204: { description: No Content }
 *       404: { description: Not Found }
 */
router.delete('/:id', (ctx: Context) => {
    const idx = books.findIndex(b => b.id === ctx.params.id);
    if (idx < 0) {
        ctx.status = 404;
        ctx.body = { statusCode: 404, error: 'Not Found', message: 'Book not found' };
        return;
    }
    books.splice(idx, 1);
    ctx.status = 204;
});

export default router;
```

### Server Koa + Swagger UI (con `url` para evitar problemas de tipos)
```ts
// src/server.ts
import Koa from 'koa';
import Router from '@koa/router';
import bodyParser from 'koa-bodyparser';
import { koaSwagger } from 'koa2-swagger-ui';
import swaggerJSDoc, { OAS3Definition, OAS3Options } from 'swagger-jsdoc';
import booksRoutes from './routes/books.routes';
import { authBearer } from './auth';

const app = new Koa();
const api = new Router({ prefix: '/api' });

// comentario: body parser JSON
app.use(bodyParser());

// comentario: proteger SOLO /api/books/admin
app.use(async (ctx, next) => {
    if (ctx.path === '/api/books/admin') {
        return authBearer(ctx, next);
    }
    return next();
});

// comentario: montar rutas
api.use(booksRoutes.routes(), booksRoutes.allowedMethods());
app.use(api.routes()).use(api.allowedMethods());

// ----- OpenAPI (JSDoc) -----
const swaggerDefinition: OAS3Definition = {
    openapi: '3.0.0',
    info: {
        title: 'Books API (Koa)',
        version: '1.0.0',
        description: 'CRUD with mock data and Swagger (Koa)',
    },
    servers: [{ url: '/api' }],
    components: {
        securitySchemes: {
            bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
        },
        schemas: {
            Book: {
                type: 'object',
                properties: {
                    id: { type: 'string', example: '1' },
                    title: { type: 'string', example: 'Clean Architecture' },
                    author: { type: 'string', example: 'Robert C. Martin' },
                    year: { type: 'integer', example: 2017 },
                },
                required: ['id', 'title', 'author', 'year'],
            },
            CreateBook: {
                type: 'object',
                properties: {
                    title: { type: 'string', example: 'Refactoring' },
                    author: { type: 'string', example: 'Martin Fowler' },
                    year: { type: 'integer', example: 2018 },
                },
                required: ['title', 'author', 'year'],
            },
            UpdateBook: {
                type: 'object',
                properties: {
                    title: { type: 'string' },
                    author: { type: 'string' },
                    year: { type: 'integer' },
                },
            },
        },
    },
};

const swaggerOptions: OAS3Options = {
    definition: swaggerDefinition,
    apis: ['src/routes/**/*.ts'], // comentario: rutas con @openapi
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

// comentario: exponer JSON de la spec
const docsRouter = new Router();
docsRouter.get('/swagger.json', (ctx) => { ctx.body = swaggerSpec; });
app.use(docsRouter.routes()).use(docsRouter.allowedMethods());

// comentario: montar Swagger UI apuntando a la URL del JSON
app.use(
    koaSwagger({
        routePrefix: '/docs',
        swaggerOptions: {
            url: '/swagger.json',
            persistAuthorization: true,
            displayRequestDuration: true,
        },
    })
);

const port = 4000;
app.listen(port, () => {
    console.log(`Koa:  http://localhost:${port}`);
    console.log(`Docs: http://localhost:${port}/docs`);
});
```

**Probar (Koa):**
- Swagger UI: `http://localhost:4000/docs`
- Público: `GET /api/books`
- Privado: `GET /api/books/admin` → **Authorize** → Bearer `testtoken`

---

## Parte IX — Pruebas con Swagger UI (paso a paso)

1. Abre `/docs`.  
2. Pulsa **Authorize** → **bearerAuth** → ingresa `testtoken`.  
3. Expande **Books** → **Try it out** en cada operación.  
4. Revisa el **curl** generado, headers, body y **Response** con schema y ejemplos.  
5. Valida códigos de respuesta y mensajes de error.

---

## Parte X — Versionado y publicación

- **NestJS:** crea dos `DocumentBuilder` y monta `/docs/v1`, `/docs/v2` (puedes filtrar módulos por versión).
- **Koa:** genera dos `swaggerSpec` (cambia `info.version` y/o `servers`) y monta `/docs/v1`, `/docs/v2`.
- **Exportar `openapi.json`:**
  - NestJS: `writeFileSync('./openapi.json', JSON.stringify(document, null, 2));`
  - Koa: ya disponible en `/swagger.json`.
- **Publica** el archivo en S3/CDN o **GitHub Pages**; considera **Redoc**/Redocly para portal público.
- **Gobernanza:** lint con **Spectral**, PRs requieren validar el spec, **changelog** y política de deprecación.

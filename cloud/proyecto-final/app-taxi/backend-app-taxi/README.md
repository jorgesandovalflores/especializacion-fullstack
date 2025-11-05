# Backend AppTaxi (NestJS + TypeORM)

Servicio backend de ejemplo para el curso — arquitectura modular con **NestJS**, **TypeORM (MySQL)**, **JWT**, **i18n**, **Pino logger** y **Swagger**. Incluye un flujo de **login por teléfono** para pasajeros.

---

## Requisitos

- **Node.js** >= 22 (recomendado 20 LTS)
- **npm** (o yarn/pnpm)
- **MySQL** 8.x
- Acceso para crear base de datos y usuario

---

## Tecnologías principales

- **NestJS** (controllers, services, modules)
- **TypeORM 0.3** (migraciones, repos, DataSource)
- **MySQL** (DB relacional)
- **JWT** (`@nestjs/jwt`) — access & refresh tokens
- **i18n** (`nestjs-i18n`) — mensajes en ES/EN via `Accept-Language`
- **Pino** (`nestjs-pino`) — logs estructurados con `x-request-id`
- **Swagger** — documentación de API en `/api/docs`

---

## Instalación

```bash
# 1) Instalar dependencias
pnpm install

# 2) Copiar variables de entorno
cp .env.example .env   # (si el repositorio incluye un ejemplo)

# 3) Configurar .env (ver sección Configuración)
```

> Si prefieres **yarn/pnpm**, reemplaza los comandos de `npm` por tu gestor.

---

## Configuración (.env)

Variables usadas por la app (según `src/core/database/typeorm.config.ts`, `src/main.ts` y servicios):

```bash
# App
APPLICATION_PORT=3001
NODE_DEBUG=false                  # habilita logs bonitos con pino-pretty

# DB
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USERNAME=app_user
DB_PASSWORD=app_pass
DB_NAME=app_taxi
DB_POOL=10

# JWT
JWT_ACCESS_SECRET=change-this-access
JWT_REFRESH_SECRET=change-this-refresh
JWT_ACCESS_TTL_SEC=900          # 15m
JWT_REFRESH_TTL_SEC=2592000     # 30d

# I18N
# El módulo i18n usa Accept-Language y fallback "es"
```

> La app **no** usa `synchronize` en producción. Asegúrate de correr **migraciones**.

---

## Base de datos: migraciones y seeders

### Ejecutar migraciones

Hay dos formas equivalentes:

**A) CLI de TypeORM** (usa el `DataSource` de `src/core/database/typeorm.migration.ts`):

```bash
# generar nueva migración (opcional)
pnpm run migration:generate -- src/core/database/migrations/<nombre>

# aplicar migraciones pendientes
pnpm run migration:run

# revertir última migración
pnpm run migration:revert
```

**B) Runners TS incluidos**

```bash
# ejecutar migraciones desde código
npx ts-node -r tsconfig-paths/register src/core/cli/run-migrations.ts
```

### Seeders

Incluye un seeder de pasajeros (`src/core/database/seeders/passenger-seed.ts`) que carga `passengers.json`.

```bash
npx ts-node -r tsconfig-paths/register src/core/cli/run-seeders.ts
```

---

## Ejecución

### Desarrollo

```bash
pnpm run start:dev
# Swagger: http://localhost:${APPLICATION_PORT}/api/docs
```

### Producción

```bash
pnpm run build
pnpm run start:prod
```

> Por defecto, la app levanta en el puerto `APPLICATION_PORT` (defínelo en `.env`).

---

## Endpoints principales

### POST `/passenger/login`

Login por número de teléfono (E.164 **sin** `+` ni símbolos).

**Request body**

```json
{
    "phone": "51987654321"
}
```

**Responses**

- **200 OK**

```json
{
    "access_token": "jwt_access",
    "refresh_token": "jwt_refresh",
    "user": {
        "id": "uuid",
        "phoneNumber": "51987654321",
        "givenName": "Nombre",
        "familyName": "Apellido",
        "email": "mail@dominio.com",
        "photoUrl": null,
        "status": "ACTIVE",
        "lastLoginAt": "2025-10-01T08:13:09.000Z",
        "createdAt": "2025-09-30T00:00:00.000Z",
        "updatedAt": "2025-09-30T00:00:00.000Z",
        "deletedAt": null
    }
}
```

- **404 Not Found** – pasajero no existe  
  El mensaje proviene de i18n (`passenger.notExists`), respetando `Accept-Language`:

```json
{
    "status_code": 404,
    "message": "Tu número de teléfono no existe.",
    "errors": []
}
```

- **400 Bad Request** – validaciones (pipe global + i18n)  
  Formato manejado por `ValidationExceptionFilter`:

```json
{
    "status_code": 400,
    "error": "Validation Failed",
    "message": [
        "validation.isString",
        "validation.minLength",
        "validation.maxLength"
    ]
}
```

---

## Arquitectura y estructura

Organización modular por **feature** y utilidades en `core/`:

```
src/
├─ app.module.ts
├─ main.ts
├─ core/
│  ├─ database/
│  │  ├─ typeorm.config.ts            # DataSource app
│  │  ├─ typeorm.migration.ts         # DataSource CLI
│  │  ├─ migrations/                  # Migraciones TypeORM
│  │  └─ seeders/                     # Seeders y datos (passengers.json)
│  ├─ http/
│  │  └─ filters/
│  │     ├─ http-exception.filter.ts  # Formato uniforme de errores
│  │     └─ validation-exception.filter.ts
│  ├─ i18n/
│  │  ├─ es/passenger.json            # i18n ES
│  │  └─ en/passenger.json            # i18n EN
│  └─ cli/                            # Runners de migraciones/seeders
│
└─ features/
   └─ passengers/
      ├─ passenger.module.ts
      ├─ controllers/passenger.controller.ts   # POST /passenger/login
      ├─ services/passenger.service.ts         # Emite JWTs y toca lastLoginAt
      ├─ dao/passenger.dao.ts                  # Acceso puro a BD
      ├─ entities/passenger.entity.ts          # TypeORM entity
      ├─ dto/                                  # Request/Response DTOs
      ├─ enum/passenger-status.enum.ts
      └─ mapper/passenger.mapper.ts
```

**Capa de presentación**: Controllers (Swagger, validación)  
**Capa de aplicación**: Services (orquestan DAO + emisión JWT)  
**Capa de acceso a datos**: DAO (TypeORM)  
**Dominio**: Entidades/DTOs/enums/mappers

---

## Seguridad

- **JWT**: usa `JWT_ACCESS_SECRET` y `JWT_REFRESH_SECRET` **fuertes**.
- **No** incluir datos sensibles en el payload JWT.
- Recomendada **rotación** de refresh tokens y almacenamiento/blacklist (Redis/DB).
- Considera **rate limit** en `/passenger/login`.
- Habilita CORS si expones la API a frontends externos.
- No loguees datos personales sensibles.

---

## Logging

- `nestjs-pino` agrega `x-request-id` y logs JSON.
- En `NODE_DEBUG=true`, usa `pino-pretty` (color, tiempos legibles).
- Todas las excepciones HTTP pasan por `HttpExceptionFilter` para formato uniforme.

---

## Swagger

Disponible en:

```
http://localhost:${APPLICATION_PORT}/api/docs
```

Incluye esquema de DTOs y ejemplos de request/response.

---

## Troubleshooting

- **EntityMetadataNotFoundError**: ajusta el glob de entidades en `typeorm.config.ts` (p.ej. `__dirname + "/../../**/*.entity{.ts,.js}"`) o usa `autoLoadEntities: true` y revisa `TypeOrmModule.forFeature(...)`.
- **404 en /passenger/login**: verifica que el `phone` exista en `entity_passenger` y que `deleted_at IS NULL`. Respeta formato E.164 **sin** `+` ni símbolos.
- **i18n no traduce**: confirma las claves (`passenger.notExists`, `validation.*`) y `Accept-Language` del request.

---

## Licencia

Uso académico / educativo.

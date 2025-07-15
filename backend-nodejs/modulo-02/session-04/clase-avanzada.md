# Clase Avanzada – Migraciones y Seeders en Arquitectura de Microservicios

## Objetivos

Al finalizar esta clase, el estudiante será capaz de:

- Aplicar migraciones y seeders organizados por contexto y entorno.
- Justificar y estructurar un *artefacto independiente* para ejecutar migraciones y seeders.
- Adaptar esta estrategia a arquitecturas **monolayer** y **multilayer** desacopladas.
- Automatizar migraciones/seeders en ambientes de staging y producción sin comprometer la integridad del sistema.

---

## Contenido

1. Separación de responsabilidades en microservicios
2. El artefacto `infra.migrator`: propósito y ventajas
3. Aplicación en arquitectura monolayer vs multilayer
4. Ejemplo de implementación
5. Automatización en pipelines de CI/CD

---

## 1. Separación de responsabilidades en microservicios

### Problema

En arquitecturas distribuidas, ejecutar migraciones desde el servicio mismo genera acoplamiento e inconsistencias:

- ¿Qué pasa si el microservicio no inicia correctamente?
- ¿Y si las migraciones se disparan en paralelo desde varias réplicas?
- ¿Dónde centralizo errores o logs de migración?

### Solución

Crear un **microservicio o artefacto específico** encargado de:

- Ejecutar migraciones por servicio
- Lanzar seeders de forma controlada
- Ser invocado manual o automáticamente antes del despliegue

---

## 2. El artefacto `infra.migrator`

### Propósito

Es un **contenedor Docker dedicado**, con código y configuración mínima, que:

- Importa los `ormconfig` y entidades de cada servicio
- Expone comandos como `migrate:run` o `seed:init`
- Puede ser usado en local, staging o producción

### Ventajas

| Ventaja                         | Descripción |
|----------------------------------|-------------|
| Aislamiento                      | No contamina lógica del microservicio. |
| Control                          | Solo se ejecuta cuando y como tú lo defines. |
| Integración en CI/CD             | Facilita integración declarativa y ordenada. |
| Multi-servicio                   | Puede aplicar migraciones de varios servicios en orden. |
| Idempotencia y trazabilidad     | Mejora visibilidad del estado de cada migración. |

---

## 3. Aplicación en arquitecturas

### A. Microservicios Monolayer

- Cada servicio tiene su propia base de datos y `ormconfig`.
- El artefacto `infra.migrator` importa cada `ormconfig.ts` y ejecuta migraciones secuenciales.

```bash
infra/
├── migrator/
│   ├── scripts/
│   │   ├── migrate-auth.ts
│   │   ├── migrate-product.ts
│   │   └── seed-product.ts
│   └── tsconfig.json
```

```ts
// scripts/migrate-auth.ts
import { AppDataSource } from '../../services/auth/src/common/database/mysql-ormconfig';
AppDataSource.initialize().then(() => AppDataSource.runMigrations());
```

### B. Microservicios Multilayer

- Arquitectura dividida en capas `channel`, `support` y `accessdata`.
- Solo la capa `accessdata` tiene acceso a la base de datos y, por tanto, *es la única que el artefacto migrator debe tocar*.

```bash
infra/
├── migrator/
│   └── scripts/
│       ├── migrate-user-accessdata.ts
│       └── seed-user-accessdata.ts
services/
├── user/
│   ├── channel/
│   ├── support/
│   └── accessdata/
│       └── src/migrations/
│       └── src/seeds/
```

> ✅ En este caso, `infra.migrator` importa `accessdata` como dependencia y ejecuta directamente desde su `ormconfig.ts`.

---

## 4. Ejemplo de implementación

### Estructura:

```bash
infra/
├── migrator/
│   ├── tsconfig.json
│   ├── package.json
│   └── scripts/
│       ├── migrate.ts
│       └── seed.ts
```

### `migrate.ts`

```ts
import { AppDataSource } from '../../services/user/accessdata/src/common/database/mysql-ormconfig';

(async () => {
	await AppDataSource.initialize();
	await AppDataSource.runMigrations();
	console.log('✅ Migración completada');
	await AppDataSource.destroy();
})();
```

### `seed.ts`

```ts
import * as fs from 'fs';
import { AppDataSource } from '../../services/user/accessdata/src/common/database/mysql-ormconfig';
import { User } from '../../services/user/accessdata/src/user.entity';

(async () => {
	await AppDataSource.initialize();
	const repo = AppDataSource.getRepository(User);
	const raw = fs.readFileSync('src/data/users.seed.json', 'utf-8');
	const data = JSON.parse(raw);

	for (const item of data) {
		const exists = await repo.findOneBy({ email: item.email });
		if (!exists) await repo.save(repo.create(item));
	}

	await AppDataSource.destroy();
	console.log('✅ Seed completado');
})();
```

---

## 5. Automatización en CI/CD

### GitHub Actions

```yaml
- name: Migrar base de datos
  run: pnpm ts-node infra/migrator/scripts/migrate.ts

- name: Ejecutar seeders (staging solamente)
  if: github.ref == 'refs/heads/staging'
  run: pnpm ts-node infra/migrator/scripts/seed.ts
```

### Dockerfile (opcional)

```Dockerfile
FROM node:18
WORKDIR /app
COPY . .
RUN pnpm install
CMD ["pnpm", "ts-node", "infra/migrator/scripts/migrate.ts"]
```

---

## Recomendaciones Finales

| Recomendación                               | Justificación |
|---------------------------------------------|---------------|
| Artefacto separado `infra.migrator`         | Aislamiento de responsabilidad |
| Ejecutar migraciones antes de levantar servicios | Evita race conditions |
| Solo migrar `accessdata` en multilayer      | Control claro del acceso a base de datos |
| Validar orden y dependencia entre migraciones | Evita errores en despliegue distribuido |
| Exponer logs claros y trazables             | Para debug y rollback más sencillo |

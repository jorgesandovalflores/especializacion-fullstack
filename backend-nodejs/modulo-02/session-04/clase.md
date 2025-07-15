# Clase 04 – Migraciones y Gestión de Datos

## Objetivos

Al finalizar esta sesión, el estudiante será capaz de:

- Comprender la importancia y funcionamiento de las migraciones en proyectos backend.
- Aplicar migraciones y seeders con TypeORM para versionar estructuras y poblar datos.
- Realizar backups y restauraciones seguras de bases de datos.
- Utilizar herramientas modernas para administrar y monitorear el estado de sus bases de datos, incluyendo activación de parámetros clave para análisis avanzado.

---

## Contenido

1. ¿Qué son las migraciones y por qué usarlas?
2. Creación y ejecución de migraciones en TypeORM (manual vs automática)
3. Caso de uso con seeders y estrategias de inicialización de datos
4. Backup y restauración de bases de datos (estrategias y mejores prácticas)
5. Herramientas modernas de administración y monitoreo de bases de datos (con parámetros de análisis profundo)

---

## Desarrollo de la Clase

### 1. ¿Qué son las migraciones y por qué usarlas?

#### Definición

Las migraciones son archivos versionados que aplican cambios en la estructura de una base de datos: crear tablas, modificar columnas, agregar índices, etc.

#### ¿Por qué usarlas?

**Ejemplo 1: trabajo colaborativo**

- Dev A crea nuevas tablas.
- Dev B clona el proyecto y ejecuta `migration:run`, obteniendo los mismos cambios.

**Ejemplo 2: despliegue en producción**

- El backend necesita una nueva columna. Con `migration:run`, la base se actualiza sin intervención manual.

#### Aspectos clave

| Aspecto | Importancia |
|--------|-------------|
| Control de versiones | Igual que el código, la base debe tener historial. |
| Idempotencia | Ejecutar migraciones múltiples veces no debe duplicar cambios. |
| Rollback | Ante errores, puedes revertir migraciones. |
| Automatización | Puede integrarse en pipelines de CI/CD. |

---

### 2. Creación y ejecución de migraciones en TypeORM

#### Migración manual

```bash
pnpm typeorm migration:create src/migrations/CreateUsersTable
```

```ts
await queryRunner.query(\`
	CREATE TABLE users (
		id INT PRIMARY KEY AUTO_INCREMENT,
		name VARCHAR(100),
		email VARCHAR(100) UNIQUE
	);
\`);
```

Aplicar la migración:

```bash
pnpm typeorm migration:run -d src/common/database/mysql-ormconfig.ts
```

Revertir la migración:

```bash
pnpm typeorm migration:revert -d src/common/database/mysql-ormconfig.ts
```

**Ventajas:** control total.  
**Desventajas:** propenso a errores humanos.

---

#### Migración automática (basada en entidades)

```bash
pnpm typeorm migration:generate -d src/common/database/mysql-ormconfig.ts src/migrations/InitSchema
```

```bash
pnpm typeorm migration:run -d src/common/database/mysql-ormconfig.ts
```

```bash
pnpm typeorm migration:revert -d src/common/database/mysql-ormconfig.ts
```

> ⚠️ *Nunca edites migraciones ya ejecutadas en producción. Crea una nueva migración para aplicar correcciones.*

---

### 3. Caso de uso con seeders y estrategias de inicialización

#### Escenario: seed de productos base desde JSON

```json
// src/data/products.seed.json
[
  {
    "name": "Smartphone Galaxy A34",
    "description": "Teléfono con cámara triple y pantalla AMOLED",
    "price": 999.99
  },
  {
    "name": "Laptop Lenovo ThinkPad",
    "description": "14'' FHD, 16GB RAM, 512GB SSD",
    "price": 2999.5
  }
]
```

```ts
// src/seeds/seed.products.ts
import { AppDataSource } from '../common/database/mysql-ormconfig';
import { Product } from '../product/product.entity';
import * as fs from 'fs';

(async () => {
	await AppDataSource.initialize();
	const repo = AppDataSource.getRepository(Product);
	const jsonData = fs.readFileSync('src/data/products.seed.json', 'utf-8');
	const products = JSON.parse(jsonData);

	for (const item of products) {
		const exists = await repo.findOneBy({ name: item.name });
		if (!exists) {
			await repo.save(repo.create(item));
			console.log(`✅ Insertado: ${item.name}`);
		}
	}

	await AppDataSource.destroy();
})();
```

Ejecución del seed:

```bash
pnpm ts-node src/seeds/seed.products.ts
```

#### Buenas prácticas

| Estrategia             | Razón                                         |
|------------------------|-----------------------------------------------|
| Validar existencia     | Evita duplicados.                             |
| Seed por entorno       | Solo en dev/staging.                          |
| Uso de fixtures JSON   | Fáciles de versionar y auditar en producción. |

---

### 4. Backup y restauración de bases de datos

#### Situaciones comunes

- Borrado accidental.
- Restauración en staging.
- Migración de servidor o proveedor.

#### Comandos

**MySQL**

```bash
mysqldump -u root -p app_db > backup.sql
mysql -u root -p app_db < backup.sql
```

**PostgreSQL**

```bash
pg_dump -U postgres -d app_db -f backup.sql
psql -U postgres -d app_db -f backup.sql
```

#### Recomendaciones

| Recomendación           | Justificación                   |
|-------------------------|----------------------------------|
| Automatizar backups     | Usa cron o CI/CD.                |
| Almacenamiento externo  | Evita pérdida total.             |
| Timestamps en nombres   | Identificación rápida.           |
| Restauraciones periódicas | Validar que funcionen.          |
| Encriptación            | Crítico en entornos productivos. |

---

### 5. Administración y monitoreo de base de datos

#### Herramientas

| Herramienta         | Características         |
|---------------------|--------------------------|
| TablePlus           | Moderna, rápida          |
| DBeaver             | Robusta y open source    |
| Beekeeper Studio    | Minimalista y ligera     |
| Prisma Studio       | Visual para Prisma ORM   |

#### Parámetros de monitoreo profundo

##### PostgreSQL

```conf
# postgresql.conf
shared_preload_libraries = 'pg_stat_statements,auto_explain'
auto_explain.log_min_duration = '500ms'
auto_explain.log_analyze = on
```

```sql
CREATE EXTENSION pg_stat_statements;
SELECT * FROM pg_stat_statements ORDER BY total_time DESC LIMIT 10;
```

##### MySQL

```ini
# my.cnf
[mysqld]
performance_schema=ON
slow_query_log = 1
long_query_time = 0.5
```

```sql
SELECT DIGEST_TEXT, COUNT_STAR, 
	SUM_TIMER_WAIT/1000000000 AS total_ms
FROM performance_schema.events_statements_summary_by_digest
ORDER BY total_ms DESC
LIMIT 10;
```

> Usa `pt-query-digest` para analizar slow queries.

---

#### Dashboards recomendados

| Stack                  | Qué ofrece                        |
|------------------------|-----------------------------------|
| Grafana + Prometheus   | Locks, conexiones, rendimiento    |
| New Relic / Datadog    | Observabilidad SaaS completa      |
| pg_stat_statements     | Consultas lentas en PostgreSQL    |
| Slow Query Log (MySQL) | Cuellos de botella en queries     |

#### Beneficios

- Detección temprana de cuellos de botella.
- Optimización basada en métricas.
- Escalabilidad planificada.
- Alertas automáticas proactivas.
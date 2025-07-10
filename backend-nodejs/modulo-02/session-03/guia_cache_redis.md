
# 🚀 Caché con Redis – Guía Completa

---

## 🔍 ¿Qué es Redis?

**Redis** (REmote DIctionary Server) es una **base de datos en memoria**, open source, que almacena datos clave-valor con acceso ultra rápido.

- Creado en 2009 por **Salvatore Sanfilippo** en Italia.
- Soporta estructuras como: `String`, `Hash`, `List`, `Set`, `Sorted Set`, `Stream`, `Bitmap`, `Geo`.
- Tiene persistencia opcional (AOF, RDB) y soporte para expiración (`TTL`).

---

## 🧠 ¿Por qué es tan rápido?

- Funciona completamente en RAM.
- Es single-threaded.
- No accede a disco a menos que se configure.

---

## 🧰 ¿Para qué se usa Redis?

| Uso común           | Ejemplo                                    |
|--------------------|---------------------------------------------|
| Caché              | Guardar respuesta de consultas repetidas    |
| Contadores         | Visitas, likes                              |
| Colas              | Tareas en segundo plano                     |
| Pub/Sub            | Comunicación entre microservicios           |
| Sesiones           | Guardar sesiones de usuario                 |
| Rate limiting      | Limitar llamadas por usuario/IP             |
| Leaderboards       | Top 10 productos                            |
| Locks distribuidos | Evitar doble procesamiento de tareas        |

---

## ⚡ Comparativa rápida

| Función         | Redis         | Memcached | SQL DB        |
|----------------|---------------|-----------|---------------|
| Velocidad      | 🔥 Ultra alta | Alta      | Baja          |
| Tipos de datos | Ricos         | Básicos   | Tablas        |
| TTL            | ✅            | ✅        | ❌            |
| Persistencia   | ✅ Opcional   | ❌        | ✅            |

---

## 🧩 ¿Qué significa cachear?

Guardar temporalmente el resultado de una operación costosa (consulta SQL, API) para evitar repetirla.

### 🧠 Ejemplo real en tu proyecto

```ts
const key = `order:${orderId}:full`;
const cached = await redis.get(key);
if (cached) return JSON.parse(cached);

const order = await this.orderRepository.findFullOrderById(orderId);
await redis.set(key, JSON.stringify(order), 'EX', 30);
return order;
```

---

## 🎯 Estrategias de caché

| Estrategia         | Descripción                                |
|--------------------|---------------------------------------------|
| Read-through       | Consultar caché, si no está, ir a DB        |
| Write-through      | Escribir siempre en DB y caché              |
| Write-behind       | Escribir en caché, y luego en DB            |
| Cache-aside (Lazy) | ⚡ Consultar caché si existe, si no, guardar |

Tu caso ideal: **cache-aside**.

---

## 🛡️ Buenas prácticas

- Usa claves como: `user:123`, `order:42:full`
- Siempre configura TTL (`EX 60`)
- Serializa con `JSON.stringify/parse`
- Evita cachear información muy volátil

---

## 🚀 Cómo usar Redis en NestJS

1. Instala:
```bash
npm install ioredis
```

2. Conecta:
```ts
import Redis from 'ioredis';
export const redis = new Redis({ host: 'localhost', port: 6379 });
```

3. Usa en servicios:

```ts
const key = `product:${id}`;
const cached = await redis.get(key);
if (cached) return JSON.parse(cached);

const product = await this.productRepository.findOneBy({ id });
await redis.set(key, JSON.stringify(product), 'EX', 60);
return product;
```

---

## ✅ Conclusión

Redis es ideal para:

- Cachear rutas complejas como `/orders/:id/full`
- Mejorar velocidad en consultas pesadas
- Reducir carga sobre MySQL/PostgreSQL

Su uso te permite escalar con eficiencia y controlar rendimiento sin sacrificar precisión.


---

# 🧩 Integración de Redis en NestJS

## 1. 📦 Instalación de `ioredis`

```bash
npm install ioredis
```

> `ioredis` es la librería recomendada por su robustez, soporte para pub/sub y clústeres.

---

## 2. 🧱 Crea un proveedor Redis

Archivo: `src/redis/redis.provider.ts`

```ts
// redis.provider.ts
import Redis from 'ioredis';

export const redis = new Redis({
	host: 'localhost',
	port: 6379,
});
```

---

## 3. 🧪 Uso en tus servicios

### Ejemplo: `ProductService`

```ts
import { Injectable } from '@nestjs/common';
import { redis } from '../redis/redis.provider';

@Injectable()
export class ProductService {
	async getProductCached(id: number) {
		const key = `product:${id}`;
		const cached = await redis.get(key);
		if (cached) return JSON.parse(cached);

		const product = await this.productRepository.findOneBy({ id });
		await redis.set(key, JSON.stringify(product), 'EX', 60);
		return product;
	}
}
```

---

## 4. 💡 Buenas prácticas

| Recomendación                | Ejemplo                           |
|-----------------------------|-----------------------------------|
| Prefija claves              | `user:123`, `order:45:full`       |
| Usa TTL                     | `'EX', 60`                        |
| Serializa con JSON          | `JSON.stringify / parse`          |
| Maneja errores con try/catch| Para caídas de Redis              |

---

## 5. ✅ Comprobación con Redis CLI

```bash
redis-cli

> keys *
> get "product:1"
> ttl "product:1"
```

---

## 6. 🚀 Alternativa: `@nestjs/cache-manager` con Redis

### 📦 Instala dependencias

```bash
npm install @nestjs/cache-manager cache-manager ioredis cache-manager-ioredis
```

### 🧱 Configura en tu `AppModule`

```ts
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-ioredis';

@Module({
	imports: [
		CacheModule.register({
			store: redisStore,
			host: 'localhost',
			port: 6379,
			ttl: 60,
		}),
	],
})
export class AppModule {}
```

### ✅ Uso con `@Inject(CACHE_MANAGER)`

```ts
import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

@Injectable()
export class ProductService {
	constructor(@Inject(CACHE_MANAGER) private cache: Cache) {}

	async getCachedProduct(id: number) {
		const key = `product:${id}`;
		const cached = await this.cache.get(key);
		if (cached) return cached;

		const product = await this.productRepository.findOneBy({ id });
		await this.cache.set(key, product, 60);
		return product;
	}
}
```

---

## ✅ Conclusión

| Método                | Ventaja                            | Ideal si…                              |
|----------------------|-------------------------------------|----------------------------------------|
| `ioredis` manual     | Control total                      | Quieres flexibilidad y bajo nivel      |
| `@nestjs/cache-manager` | Integración limpia              | Prefieres inyección y TTL automáticos  |

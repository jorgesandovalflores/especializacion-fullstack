# Clase 03 – Manejo de Errores y Logs

## Objetivos

Al finalizar esta clase, el estudiante será capaz de:

- Aplicar estrategias de manejo de errores robustas para Node.js en cualquier tipo de arquitectura.
- Implementar logs estructurados que se integren con herramientas de monitoreo y análisis.
- Adaptar su estrategia de logging según si su aplicación es monolítica o basada en microservicios.
- Diagnosticar problemas en producción con trazabilidad y seguimiento de errores.

---

## Contenido

1. Estrategias para manejo de errores en Node.js
2. Logs estructurados: concepto, ventajas y patrones
3. Logging y monitoreo en entornos monolíticos vs microservicios
4. Herramientas de logging y monitoreo (Winston, Pino, ELK, Loki)
5. Análisis de errores en producción y trazabilidad avanzada
6. Ejemplo paso a paso con NestJS

---

## 1️⃣ Estrategias para manejo de errores en Node.js

### Fundamentos

En Node.js, el manejo de errores debe ser explícito tanto en código síncrono como asincrónico. Hay que distinguir:

- **Errores de programación**: violaciones de lógica o bugs (`undefined is not a function`, etc.)
- **Errores operacionales**: problemas esperables (red caída, datos inválidos, timeout externo).

📈 **Nunca deberías intentar recuperar un error de programación en tiempo de ejecución.**

---

### 🛠️ Estrategias generales

| Estrategia                           | Descripción                                |
| ------------------------------------ | ------------------------------------------ |
| Try/catch en `async/await`           | Evita fallos silenciosos.                  |
| Middleware de errores (Express/Nest) | Maneja excepciones centralizadas.          |
| Clases personalizadas de Error       | Permiten enriquecer el contexto del fallo. |
| Sanitización de errores              | No revelar detalles internos al cliente.   |

---

### En arquitectura monolítica

- Se utiliza **una sola instancia de manejo global de errores** (por ejemplo, un `filter` en NestJS).
- Es más simple capturar y mostrar un error con contexto completo, ya que todo está en el mismo proceso.
- Pueden registrarse errores críticos directamente con un logger y notificar por correo o sistema externo.

📌 Ejemplo:

```ts
// main.ts en NestJS
app.useGlobalFilters(new AllExceptionsFilter(logger));
```

---

### En microservicios

- Cada microservicio debe implementar su propio sistema de manejo de errores.
- Es fundamental unificar el formato de los errores para trazabilidad inter-servicio.
- Se recomienda agregar `traceId`, `requestId` o `correlationId` en cada log y error.
- Los errores deben viajar en estructuras que puedan ser parseadas por otros servicios.

📌 Ejemplo:

```ts
{
  statusCode: 404,
  message: "Bus no encontrado",
  errorCode: "BUS_NOT_FOUND",
  traceId: "5e74e9d3..."
}
```

---

## 2️⃣ Logs estructurados

### ¿Qué es un log estructurado?

Es un log que sigue un formato consistente (usualmente JSON), útil tanto para humanos como para máquinas.

Ejemplo:

```json
{
  "level": "error",
  "message": "Error al crear viaje",
  "timestamp": "2025-07-30T20:11:10Z",
  "service": "support.travel",
  "traceId": "abcd123",
  "context": {
    "id_driver": "ff8a...",
    "payload": { ... }
  }
}
```

---

### Beneficios

| Beneficio                   | Descripción                                                             |
| --------------------------- | ----------------------------------------------------------------------- |
| Busqueda eficiente          | Se puede filtrar por campos específicos como `user_id`, `traceId`, etc. |
| Integración con dashboards  | Se visualizan errores en tiempo real.                                   |
| Alertas automáticas         | Por volumen de errores o patrones críticos.                             |
| Auditar o reproducir fallos | Puedes reconstruir todo el ciclo de una petición.                       |

---

## 3️⃣ Monolito vs Microservicios

### Monolito

- Usa herramientas como Winston o Pino y guarda logs localmente o en un sistema central.
- Es común que los logs se escriban en archivos (`.log`) o se impriman por consola (usando `stdout`).
- Un solo logger central puede controlar todo.

```ts
// Ejemplo con Winston
logger.error("Fallo en pago", { user_id: "123", amount: 12.5 });
```

---

### Microservicios

- Cada microservicio debe enviar sus logs a un sistema central (como **Grafana Loki** o **Logstash**).
- Deben compartir una convención de logging estructurado.
- Importante usar un `correlationId` común para rastrear una operación distribuida.

Ejemplo de convención entre microservicios:

```ts
logger.info("Solicitud de viaje recibida", {
  correlationId,
  module: "support.travel",
  input: { origin, destination }
});
```

---

## 4️⃣ Herramientas recomendadas

| Herramienta           | Tipo                            | Recomendado para                                |
| --------------------- | ------------------------------- | ----------------------------------------------- |
| **Winston**           | Logger flexible                 | Monolitos, customización por niveles            |
| **Pino**              | Logger rápido y estructurado    | Microservicios, JSON por defecto                |
| **Logstash + Kibana** | Ingesta + visualización         | Sistemas ELK                                    |
| **Grafana Loki**      | Logging distribuido con Grafana | Microservicios (con Prometheus)                 |
| **Sentry / NewRelic** | Observabilidad y errores        | Monitoreo centralizado de errores y rendimiento |

---

## 5️⃣ Análisis de errores en producción

### Estrategias efectivas

- Usar `traceId` por petición.
- Crear paneles de errores por servicio, tipo y severidad.
- Detectar picos de errores por minutos o endpoints.
- Configurar alertas si superan cierto umbral (ej. más de 5 errores 500 por minuto).

### Ejemplo de flujo completo en microservicios

```
Usuario hace request
→ API Gateway inyecta traceId
→ Microservicio channel.travel registra log con traceId
→ Microservicio support.travel registra log con mismo traceId
→ Logs enviados a Loki
→ Grafana muestra la traza completa de la solicitud
```

---

## Ejercicio práctico

1. Implementar logger con `nestjs-pino` en un microservicio.
2. Registrar logs con traceId y metadata contextual (servicio, módulo, payload).
3. Lanzar errores custom con `HttpCustomException` y capturarlos en filtro global.
4. Visualizar los logs en consola estructurada.
5. (Opcional) Enviar logs a Loki vía `pino-loki`.

---

## Conclusión

> *"Los logs son tu caja negra: si no están bien hechos, no sabrás qué pasó cuando todo falle."*

- En entornos **monolíticos**, puedes empezar simple con Winston.
- En **microservicios**, es obligatorio tener trazabilidad distribuida.
- El manejo de errores y los logs bien diseñados te ahorrarán horas (o días) de debugging en producción.

---

## Ejemplo paso a paso con NestJS

### Objetivo

Implementar un microservicio NestJS que:

- Use `nestjs-pino` para logs estructurados.
- Tenga una clase de error personalizada (`HttpCustomException`).
- Use un filtro global (`AllExceptionsFilter`) para manejar errores.
- Registre `traceId` para trazabilidad distribuida.

---

### 1️⃣ Instalación de dependencias

```bash
npm install nestjs-pino pino-http pino
```

---

### 2️⃣ Configuración del logger global

```ts
// main.ts
import { Logger } from 'nestjs-pino';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

async function bootstrap() {
	const app = await NestFactory.create(AppModule, {
		bufferLogs: true,
	});
	app.useLogger(app.get(Logger));
	app.useGlobalFilters(new AllExceptionsFilter(app.get(Logger)));
	await app.listen(3000);
}
bootstrap();
```

---

### 3️⃣ Implementar un filtro de excepciones

```ts
// common/filters/all-exceptions.filter.ts
import {
	ArgumentsHost,
	Catch,
	ExceptionFilter,
	HttpException,
} from '@nestjs/common';
import { Logger } from 'nestjs-pino';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
	constructor(private readonly logger: Logger) {}

	catch(exception: unknown, host: ArgumentsHost): void {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse();
		const request = ctx.getRequest();

		const status =
			exception instanceof HttpException ? exception.getStatus() : 500;

		const message =
			exception instanceof HttpException
				? exception.getResponse()
				: exception;

		const traceId = request.headers['x-trace-id'] || 'N/A';

		this.logger.error(
			{
				message: 'Error capturado por AllExceptionsFilter',
				traceId,
				path: request.url,
				method: request.method,
				error: exception,
			},
			'Exception',
		);

		response.status(status).json({
			statusCode: status,
			message,
			traceId,
			timestamp: new Date().toISOString(),
		});
	}
}
```

---

### 4️⃣ Clase personalizada de error

```ts
// common/exceptions/http-custom.exception.ts
export class HttpCustomException extends Error {
	constructor(
		public readonly statusCode: number,
		public readonly message: string,
		public readonly context?: any,
	) {
		super(message);
	}
}
```

---

### 5️⃣ Controlador de prueba

```ts
// app.controller.ts
import { Controller, Get, Req } from '@nestjs/common';
import { Request } from 'express';
import { HttpCustomException } from './common/exceptions/http-custom.exception';
import { Logger } from 'nestjs-pino';

@Controller()
export class AppController {
	constructor(private readonly logger: Logger) {}

	@Get('error')
	simulateError(@Req() request: Request) {
		const traceId = request.headers['x-trace-id'] || 'N/A';

		this.logger.warn({
			message: 'Se va a lanzar una excepción',
			traceId,
		});

		throw new HttpCustomException(
			400,
			'Este es un error de prueba',
			{ module: 'AppController', requestId: traceId },
		);
	}

	@Get('ok')
	ok(@Req() request: Request) {
		const traceId = request.headers['x-trace-id'] || 'N/A';

		this.logger.info({
			message: 'Petición exitosa',
			traceId,
		});

		return {
			message: 'Todo bien',
			traceId,
		};
	}
}
```

---

### 6️⃣ Petición de prueba con `traceId`

```bash
curl http://localhost:3000/error -H "x-trace-id: 123abc"
```

📅 El log aparecerá estructurado en consola:

```json
{
  "level": "error",
  "message": "Error capturado por AllExceptionsFilter",
  "traceId": "123abc",
  "path": "/error",
  "method": "GET"
}
```

---


## 📡 Envío de logs a Grafana Loki (Docker)

### 1️⃣ Instala `pino-loki`

```bash
pnpm add pino-loki
```

---

### 2️⃣ Configura el `LoggerModule` con `pino-loki`

```ts
// app.module.ts
import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { AppController } from './app.controller';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        level: 'info',
        transport: {
          target: 'pino-loki',
          options: {
            host: 'http://localhost:3100',
            interval: 5,
            labels: { job: 'nestjs-app' },
          },
        },
      },
    }),
  ],
  controllers: [AppController],
})
export class AppModule {}
```

---

### 3️⃣ Docker Compose básico para Loki + Grafana

```yaml
version: "3.8"
services:
  loki:
    image: grafana/loki:2.9.3
    ports:
      - "3100:3100"
    command: -config.file=/etc/loki/local-config.yaml

  grafana:
    image: grafana/grafana:10.2.3
    ports:
      - "3000:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
    volumes:
      - grafana-storage:/var/lib/grafana

volumes:
  grafana-storage:
```

---

### 4️⃣ Configura la fuente de datos en Grafana

1. Accede a Grafana: [http://localhost:3000](http://localhost:3000) (admin/admin)
2. Menú lateral → Configuration → Data Sources → Add data source
3. Selecciona **Loki**
4. Ingresa la URL: `http://loki:3100` (si está en red Docker) o `http://localhost:3100`

---

### 5️⃣ Explo
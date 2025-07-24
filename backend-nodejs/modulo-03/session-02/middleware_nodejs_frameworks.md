## Middleware en Node.js y Frameworks Web

---

### Objetivo

Comprender qué es un middleware en Node.js, qué patrón de diseño aplica, cómo lo personalizan distintos frameworks modernos y en qué casos se usa. Se presentará además una tabla comparativa entre los frameworks más utilizados para desarrollar APIs en Node.js.

---

### ¿Qué es un Middleware?

Un **middleware** es una función que se ejecuta entre la recepción de una petición (request) y el envío de una respuesta (response). Su propósito es interceptar, modificar o procesar la solicitud antes de que llegue a su manejador final.

```ts
(req, res, next) => {
  // lógica intermedia
  next(); // continúa al siguiente middleware o controlador
}
```

---

### Patrón de diseño utilizado

Los middlewares se basan en el **patrón Chain of Responsibility**. Este patrón permite que múltiples objetos (middlewares) tengan la oportunidad de procesar una solicitud, pasándola a lo largo de una cadena hasta que uno la maneje.

---

### 🛠️ ¿Qué frameworks lo utilizan y cómo lo personalizan?

| Framework   | Uso de Middleware          | Personalización                                                     |
| ----------- | -------------------------- | ------------------------------------------------------------------- |
| **Express** | Clásico `(req, res, next)` | Se usa ampliamente para todo (auth, logs, body, CORS, etc.)         |
| **Koa**     | `(ctx, next)`              | Middlewares asincrónicos con `async/await`, devuelve `ctx.response` |
| **NestJS**  | `NestMiddleware` (clase)   | Se define como clase con `use()`, integrados al ciclo de vida y DI  |
| **Fastify** | Hooks (`onRequest`, etc.)  | Más rápidos, estilo plugin, no sigue `(req, res, next)` tradicional |
| **Hapi**    | `server.ext()`             | Middleware como extensión del ciclo de vida de la request           |

---

### Casos de uso comunes

#### 1. Autenticación y Autorización

Permiten validar si un usuario está autenticado antes de acceder a una ruta o si tiene los permisos necesarios para realizar una acción.

- **Ejemplo**: Middleware que verifica un token JWT antes de permitir el acceso a un endpoint protegido.

#### 2. Validación de datos

Interceptan la petición para validar que los datos enviados por el cliente (body, params, query) cumplan un esquema o estructura esperada.

- **Ejemplo**: Validar que el `email` esté presente y tenga formato válido antes de llegar al controlador.

#### 3. Registro de logs (logging)

Registran la actividad del sistema: qué ruta fue accedida, por qué usuario, desde qué IP, etc.

- **Ejemplo**: Middleware que imprime en consola o guarda en archivo cada método y URL invocada.

#### 4. Parseo del cuerpo (body parser)

Se encargan de interpretar el cuerpo de la petición (JSON, formularios, texto) y adjuntarlo al objeto de la request para su fácil lectura.

- **Ejemplo**: Convertir `application/json` en `req.body` utilizable.

#### 5. Manejo de errores

Capturan errores lanzados durante el procesamiento y permiten responder de forma uniforme (evitando errores sin formato o caídas del servidor).

- **Ejemplo**: Si ocurre un error en un controlador, el middleware centralizado responde con un mensaje estructurado de error.

#### 6. CORS (Cross-Origin Resource Sharing)

Permiten o restringen el acceso a la API desde otros dominios. Son fundamentales en aplicaciones frontend-backend separadas.

- **Ejemplo**: Permitir que `frontend.miapp.com` consuma la API alojada en `api.miapp.com`.

#### 7. Compresión y optimización de cabeceras

Reducen el tamaño de las respuestas (gzip, brotli), añaden o modifican cabeceras como `Cache-Control`, `Content-Type`, `Security headers`, etc.

- **Ejemplo**: Middleware que activa `gzip` para todas las respuestas mayores a 1KB.

#### 8. Trazabilidad y métricas

Integración con sistemas como Prometheus o NewRelic para medir tiempo de respuesta, tasa de errores, throughput, etc.

- **Ejemplo**: Middleware que mide la duración de cada request y lo reporta a Prometheus.

---

### Comparativa de Middlewares por Framework

| Framework | Sintaxis Base                 | Middleware Encadenables | Hooks avanzados | DI (Inyección de Dependencias) | Performance |
| --------- | ----------------------------- | ----------------------- | --------------- | ------------------------------ | ----------- |
| Express   | `(req, res, next)`            | ✅                       | ❌               | ❌                              | Medio       |
| Koa       | `async (ctx, next)`           | ✅                       | ❌               | ❌                              | Medio-Alto  |
| NestJS    | `class implements Middleware` | ✅                       | ✅               | ✅                              | Medio       |
| Fastify   | `onRequest(req, reply)`       | ❌ (usa hooks)           | ✅               | ⚠️ (via plugins o DI manual)   | Alto        |
| Hapi      | `server.ext()`                | ✅                       | ✅               | ✅                              | Medio       |

---

### ✅ Conclusión

- El middleware es un concepto esencial en el desarrollo backend con Node.js.
- Su implementación varía según el framework, pero todos permiten intervenir el flujo de petición-respuesta.
- Elegir el framework adecuado dependerá del estilo del equipo, necesidades de performance y facilidad de integración con dependencias.
- Para proyectos complejos y modulares, **NestJS** destaca por su estructura y compatibilidad con DI. Para proyectos minimalistas y de alto rendimiento, **Fastify** es ideal.

---

¿Próximo paso? Podemos extender esto con ejemplos por framework o explicar cómo combinar middlewares con controladores en arquitecturas limpias.


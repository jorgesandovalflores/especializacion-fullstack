
# 📊 Medición de Tráfico y Dimensionamiento del Pool de Conexiones

---

## 🎯 Objetivo

Aprender a medir el tráfico real de una aplicación NestJS y traducirlo en una configuración óptima del `connection pool`. Además, saber cuándo escalar horizontalmente (más instancias de app).

---

## 🧩 ¿Qué es una conexión del pool?

Una conexión representa un canal activo entre la app y la base de datos.

- ✅ Se reutiliza si está libre
- ❌ Si todas están ocupadas, las peticiones esperan (delay)
- 🎯 Un pool bien dimensionado mejora latencia y estabilidad

---

## 🔍 Cómo medir el tráfico de la app

### 📈 A. Medir peticiones concurrentes

#### Middleware en NestJS:

```ts
let currentRequests = 0;

app.use((req, res, next) => {
  currentRequests++;
  res.on('finish', () => currentRequests--);
  next();
});

setInterval(() => console.log('Current requests:', currentRequests), 2000);
```

- 🟢 Promedio en horario regular
- 🔴 Pico en eventos especiales

---

### ⏱ B. Medir duración promedio de consultas

```ts
const start = Date.now();
await pool.query(...);
console.log('Query time:', Date.now() - start);
```

#### Ejemplo de cálculo:

- 50 peticiones por segundo
- Cada una tarda 100ms  
→ `50 * 0.1 = 5 conexiones promedio`  
+30% seguridad → `~7 conexiones necesarias`  
👉 Usa pool de `8-10`

---

## ⚠️ Señales de que tu pool es pequeño

| Síntoma                        | Explicación                                   |
|-------------------------------|-----------------------------------------------|
| 🐢 Respuestas lentas          | Peticiones esperando por conexiones libres    |
| 🔁 Retries de conexión         | El pool no responde a tiempo                  |
| 🧵 `Too many connections`      | El límite del servidor se sobrepasa           |
| ⌛ Tiempos de consulta inestables | Dependen del uso del pool                     |

---

## 📐 ¿Cuándo escalar a más instancias de app?

Cuando:
- El límite del DB server no permite más conexiones
- Necesitas mayor concurrencia de usuarios
- Tienes cuellos de botella en el pool

### 🧠 Ejemplo:

- DB permite 100 conexiones
- Tu app necesita 60 estables
- Otros servicios usan 30
→ No puedes darle 60 conexiones a una sola app  
✅ Solución: 2 instancias con 30 conexiones cada una

---

## 🛠 Herramientas para monitorear

| Herramienta                   | Qué mide                                       |
|------------------------------|------------------------------------------------|
| `pg_stat_activity` / `SHOW PROCESSLIST` | Conexiones actuales por sesión     |
| Prometheus + Grafana         | Conexiones activas, queries en curso           |
| APM (Datadog, New Relic)     | Latencia, throughput, errores                  |
| Logs internos en NestJS      | Tiempo por consulta, cantidad de peticiones   |

---

## ✅ Reglas prácticas

- Si el 90% del tiempo hay conexiones libres → puedes reducir el pool.
- Si hay conexiones esperando o timeout → aumenta el pool o escala horizontalmente.
- Siempre mide en producción, no solo en desarrollo.

---

## 📌 Conclusión

Un buen dimensionamiento del pool:
- 🔒 Asegura estabilidad
- ⚡ Mejora el rendimiento
- 📈 Escala con la demanda

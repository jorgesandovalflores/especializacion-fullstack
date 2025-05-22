# 🧩 Módulo 04: Optimización y Buenas Prácticas  
## 📘 Clase 04: Monitoreo, Debugging y Mantenimiento en Vue.js  

---

## 🎯 Objetivos de la Clase

- Aplicar herramientas modernas de monitoreo de errores y rendimiento.
- Dominar técnicas de debugging y troubleshooting en entornos reales de producción.
- Establecer rutinas de mantenimiento, actualización y control de calidad en proyectos Vue.
- Comprender escenarios típicos en los que estas prácticas son **críticas** para garantizar estabilidad.

---

## 1. 📡 Implementación de herramientas de monitoreo

### 🧭 ¿Por qué es clave el monitoreo?

| Problema sin monitoreo                   | Consecuencias                         | Prevención con monitoreo            |
|------------------------------------------|---------------------------------------|-------------------------------------|
| Errores en producción                    | Usuarios frustrados, churn            | Detección temprana con Sentry       |
| Disminución de rendimiento               | UX pobre, pérdida de conversiones     | Observabilidad con LogRocket/RUM    |
| Comportamientos inesperados del usuario  | Difícil de reproducir                 | Grabación de sesiones (LogRocket)   |

---

### 🛠 Herramientas más usadas en Vue.js

| Herramienta       | Tipo             | Uso en Vue.js                        | Plan recomendado                    |
|-------------------|------------------|--------------------------------------|-------------------------------------|
| **Sentry**        | Error tracking   | Captura automática de errores y performance | Free/Paid                       |
| **LogRocket**     | RUM + Replay     | Analiza sesiones + errores + comportamiento | Paid                          |
| **Vue Devtools Remote** | Devtools remotos | Debug a distancia incluso en producción     | Gratis (usando bridge)             |
| **Google Tag Manager** | Eventos UX      | Integración con herramientas externas       | Gratis                             |

---

### ✅ Ejemplo: Sentry con Vue 3 + Router

```ts
import * as Sentry from '@sentry/vue'
import { BrowserTracing } from '@sentry/tracing'
import { app, router } from './main'

Sentry.init({
	app,
	dsn: import.meta.env.VITE_SENTRY_DSN,
	integrations: [
		new BrowserTracing({
			routingInstrumentation: Sentry.vueRouterInstrumentation(router),
		}),
	],
	tracesSampleRate: 1.0,
})
```

---

## 2. 🐞 Debugging y troubleshooting en producción

### 🧠 ¿Qué cambia en producción?

| Característica           | Desarrollo                  | Producción                              |
|--------------------------|-----------------------------|------------------------------------------|
| Acceso al código         | Total (consola, Vue Devtools)| Limitado (minificado y compilado)       |
| Source maps              | Activos por defecto         | Requiere activación explícita           |
| Logs                     | Verbosos (dev)              | Reducidos o redirigidos (prod)          |
| Feedback del usuario     | Directo                     | Tardío o inexistente sin monitoreo      |

---

### 🔧 Técnicas efectivas de debugging

1. **Source maps en producción**
   ```ts
   build: {
     sourcemap: true,
   }
   ```

2. **Captura global de errores**
   ```ts
   app.config.errorHandler = (err, instance, info) => {
     console.error('Error atrapado globalmente', err)
     Sentry.captureException(err)
   }
   ```

3. **Debugging condicional**
   ```ts
   if (import.meta.env.MODE === 'development') {
     console.log('Detalles:', objeto)
   }
   ```

---

## 3. 🔁 Mantenimiento y actualización continua

### 🧹 Mantenimiento técnico

| Acción                         | Frecuencia sugerida       | Herramienta recomendada     |
|-------------------------------|---------------------------|-----------------------------|
| `npm audit fix`               | Cada semana               | CLI                         |
| Revisión de errores de monitoreo | Diaria                  | Sentry, LogRocket           |
| Actualización de dependencias | Mensual                   | `npm-check-updates`         |
| Limpieza de componentes obsoletos | Trimestral             | ESLint, Unused Imports      |

---

### 🧪 Proceso controlado de actualización

1. **Verifica versiones desactualizadas**
   ```bash
   npx npm-check-updates
   ```

2. **Actualiza dependencias críticas**
   ```bash
   ncu -u && npm install
   ```

3. **Corre pruebas e2e y unitarias**
   ```bash
   npm run test && npm run build
   ```

4. **Deploy en entorno de staging**
   - Validar con QA
   - Revisar errores nuevos

---

## 4. 📌 Escenarios reales de implementación

### 🧪 Escenario A: App de eventos en vivo

- Problema: Se reporta que la app “se queda pegada” al comprar entradas.
- Solución:
  - Se instala **LogRocket** → muestra que usuarios hacen doble clic en botón “Pagar”.
  - Se configura **throttle** y **monitoreo Sentry** para detectar errores por timeout en Axios.

---

### 🧪 Escenario B: App de taxis

- Problema: Usuarios reportan que el mapa no carga en producción.
- Solución:
  - Activación de **source maps** + `Sentry` permite ver que falla una key inválida de Google Maps.
  - Se actualiza config y se implementa sistema de alerta temprana.

---

### 🧪 Escenario C: Panel de administración

- Problema: El backoffice deja de cargar después de actualizar Vue.
- Solución:
  - Actualización forzada de `pinia` + ajuste en el `router` por cambios en la API.
  - Lección: **Revisar changelogs antes de cualquier actualización mayor**.

---
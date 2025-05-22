
# 🎥 Integración de LogRocket en Vue 3 + TypeScript

Esta guía paso a paso te permitirá integrar LogRocket en una aplicación Vue.js con Vite y TypeScript para monitorear sesiones, errores y performance.

---

## ✅ Requisitos previos

- Proyecto creado con Vue 3 + Vite + TypeScript.
- Cuenta gratuita en [https://logrocket.com](https://logrocket.com).

---

## 1. 📝 Crear cuenta y proyecto en LogRocket

1. Ve a [https://logrocket.com](https://logrocket.com) y regístrate.
2. Crea un nuevo proyecto.
3. Copia el **ID de tu proyecto**, con formato `tuusuario/tuapp`.

---

## 2. 📦 Instalar la dependencia de LogRocket

```bash
npm install logrocket
```

---

## 3. ⚙️ Crear archivo de configuración `logrocket.ts`

Crea el archivo en `src/logrocket.ts`:

```ts
import LogRocket from 'logrocket'

export function initLogRocket() {
  if (import.meta.env.MODE === 'production') {
    LogRocket.init(import.meta.env.VITE_LOGROCKET_ID)
  }
}
```

---

## 4. 🧩 Usar LogRocket en `main.ts`

```ts
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { initLogRocket } from './logrocket'

const app = createApp(App)
app.use(router)

initLogRocket()

app.mount('#app')
```

---

## 5. 🔐 Configurar `.env.production`

Agrega tu ID de LogRocket:

```
VITE_LOGROCKET_ID=tuusuario/tuapp
```

---

## 6. 🚀 ¿Qué captura LogRocket automáticamente?

- Errores no capturados (uncaught exceptions).
- Logs de consola (`console.error`, `warn`, etc).
- Clicks, navegación y formularios.
- Sesiones completas reproducibles como video.
- Uso de red (`fetch`, `XHR`).

---

## 7. 🧪 Probar integración

1. Genera un error intencional en un componente:

```ts
throw new Error('Error de prueba LogRocket')
```

2. Haz build y despliega tu app.

3. Accede a tu panel en [LogRocket](https://app.logrocket.com) y revisa la sesión grabada.

---

## 8. ✅ Resultado esperado

- Puedes revisar sesiones completas desde el panel de LogRocket.
- Tienes errores con contexto, trazas y reproducción visual.
- Mejora sustancial en troubleshooting de producción.

---

## 📌 Consideraciones

- **No uses en desarrollo local**, usa `if (import.meta.env.MODE === 'production')`.
- Puedes integrar LogRocket con herramientas como Sentry o Segment.
- Compatible con Vue Router y Vuex/Pinia (puede requerir configuración adicional).


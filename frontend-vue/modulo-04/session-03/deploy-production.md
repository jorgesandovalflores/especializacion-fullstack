# Deploy de una App Vue 3 + TypeScript en Firebase Hosting

Este documento detalla el paso a paso para compilar y desplegar una aplicación Vue 3 + Vite + TypeScript en Firebase Hosting.

---

## Requisitos previos

- Tener instalado Node.js (v16 o superior)
- Tener cuenta en [Firebase](https://firebase.google.com)
- Proyecto ya inicializado con Vue 3, Vite y TypeScript
- Haber ejecutado `npm install`

---

## Paso 1: Instalar Firebase CLI

```bash
npm install -g firebase-tools
firebase --version
```

---

## Paso 2: Iniciar sesión en Firebase

```bash
firebase login
firebase login --reauth // solo si falla la autenticacion
```

---

## Paso 3: Inicializar Firebase en tu proyecto

Ejecuta desde la raíz del proyecto:

```bash
firebase init
```

### En el asistente:

1. **Seleccionar características**
   Usa la tecla `Espacio` para marcar:
   ✅ `Hosting: Configure files for Firebase Hosting`

2. **Seleccionar el proyecto Firebase existente**
   ✅ `Use an existing project`
   ✅ Selecciona: `andes-fullstack-esp`

3. **Public directory**
   ✅ Escribe: `dist`

4. **SPA (Single Page App)**
   ✅ Responde: `Yes` (rewrite all urls to `/index.html`)

5. **¿Automatizar con GitHub Actions?**
   ❌ Responde: `No`

6. **¿Sobrescribir dist/index.html?**
   ❌ Responde: `No`

Esto creará dos archivos:

- `firebase.json`
- `.firebaserc`

---

## Paso 4: Ajustar configuración de producción

### `firebase.json` sugerido:

```json
{
    "hosting": {
        "public": "dist",
        "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
        "rewrites": [
            {
                "source": "**",
                "destination": "/index.html"
            }
        ]
    }
}
```

---

## Paso 5: Compilar la aplicación

```bash
npm run build
```

Esto genera la carpeta `dist/` con la aplicación lista para producción.

---

## Paso 6: Deploy a Firebase Hosting

```bash
firebase deploy
```

Verás en la consola:

```bash
✔ Deploy complete!

✔ Hosting URL: https://<tu-proyecto>.web.app
```

---

## Paso 7: Ver en producción

Abre en el navegador la URL entregada por Firebase Hosting. ¡Tu app Vue está en línea!

---

## 📁 Estructura esperada

```
example-frontend/
├―― dist/                   ✅ Carpeta generada por Vite para producción
├―― src/                    ✅ Código fuente Vue
├―― firebase.json           ✅ Configuración de Firebase Hosting
├―― .firebaserc             ✅ Asociación con el proyecto Firebase
├―― package.json
└―― vite.config.ts
```

---

## Limpieza adicional (opcional)

Para asegurar builds optimizados puedes:

- Usar `vite-plugin-compression` para gzip
- Eliminar `console.log` con `terserOptions`
- Verificar dependencias innecesarias

---

## ¡Despliegue exitoso!

Ahora puedes hacer cambios, volver a compilar (`npm run build`) y ejecutar `firebase deploy` nuevamente cuando quieras actualizar tu aplicación.

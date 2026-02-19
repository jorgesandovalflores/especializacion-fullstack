# Clase 02 - Módulo 04: Configuración de Entorno de Desarrollo y Optimización con Vite

## Objetivo de la clase

Configurar de forma avanzada un entorno de desarrollo con Vite, comprender el uso correcto de variables de entorno y la integración de módulos externos, y aplicar configuraciones para optimizar el rendimiento del proyecto.

## Contenido

1. Configuración del entorno de desarrollo con Vite
2. Uso de variables de entorno en Vite
3. Integración de módulos externos
4. Configuración avanzada para optimización

---

## 1. Configuración de entorno de desarrollo con Vite

### ¿Qué es Vite?

Vite es un _build tool_ moderno que ofrece:

- Inicio instantáneo del servidor de desarrollo
- Recarga en caliente (HMR)
- Bundling optimizado para producción usando esbuild/rollup

### Instalación básica de un proyecto con Vite

```bash
npm create vite@latest my-vite-app -- --template vue-ts
cd my-vite-app
npm install
npm run dev
```

Esto crea un entorno base con soporte para TypeScript y Vue 3.

### Estructura de carpetas clave

| Carpeta / Archivo | Descripción                               |
| ----------------- | ----------------------------------------- |
| `src/`            | Código fuente de la app                   |
| `public/`         | Archivos estáticos no procesados por Vite |
| `vite.config.ts`  | Configuración personalizada del proyecto  |
| `.env`            | Variables de entorno globales             |

---

## 2. Uso de variables de entorno

### ¿Por qué usar variables de entorno?

Permiten manejar valores dinámicos como URL de APIs, claves secretas, etc. sin exponerlos en el código.

### Archivos comunes

| Archivo            | Entorno asociado           |
| ------------------ | -------------------------- |
| `.env`             | Común a todos los entornos |
| `.env.development` | Solo entorno de desarrollo |
| `.env.production`  | Solo entorno de producción |

### Sintaxis y uso

```env
VITE_API_URL=https://api.midominio.com
```

En tu código:

```ts
const apiUrl = import.meta.env.VITE_API_URL;
```

> ⚠️ Todas las variables deben comenzar con `VITE_` para ser accesibles desde el frontend.

---

## 3. Uso de módulos externos

### ¿Qué son?

Bibliotecas de terceros que se integran en el proyecto (por ejemplo: Axios, Lodash, Bootstrap).

### Ejemplo: integrar Axios

```bash
npm install axios
```

```ts
import axios from 'axios'

axios.get(`${import.meta.env.VITE_API_URL}/products`).then(...)
```

### Ejemplo: integrar Bootstrap

```bash
npm install bootstrap
```

```ts
// En main.ts
import "bootstrap/dist/css/bootstrap.min.css";
```

---

## 4. Configuración avanzada para optimización

### Modificación del `vite.config.ts`

#### Alias de rutas

```ts
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

export default defineConfig({
    plugins: [vue()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "src"),
        },
    },
});
```

Esto permite importar así:

```ts
import MyComponent from "@/components/MyComponent.vue";
```

#### Optimización de dependencias

```ts
optimizeDeps: {
  include: ['lodash', 'axios'],
  exclude: ['moment']
}
```

#### Dividir chunks para producción

```ts
build: {
  rollupOptions: {
    output: {
      manualChunks(id) {
        if (id.includes('node_modules')) {
          return 'vendor';
        }
      }
    }
  }
}
```

### Comparativa de rendimiento

| Estrategia   | Beneficio                            | Consideración                 |
| ------------ | ------------------------------------ | ----------------------------- |
| Alias        | Mejora la organización del código    | Requiere configuración manual |
| OptimizeDeps | Reduce tiempo de carga en desarrollo | Afecta cold start             |
| manualChunks | Mejora carga inicial en producción   | Requiere análisis del bundle  |

---

## 5. Ejemplo completo de configuración

```ts
// vite.config.ts
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

export default defineConfig({
    plugins: [vue()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "src"),
        },
    },
    optimizeDeps: {
        include: ["axios"],
    },
    build: {
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (id.includes("node_modules")) {
                        return "vendor";
                    }
                },
            },
        },
    },
});
```

---

## 6. Conclusión

Vite proporciona un entorno de desarrollo moderno, veloz y configurable. Entender cómo aplicar alias, variables de entorno y estrategias de optimización permite crear aplicaciones frontend escalables y listas para producción.

En la próxima clase veremos cómo integrar estas configuraciones en un proyecto real completo.

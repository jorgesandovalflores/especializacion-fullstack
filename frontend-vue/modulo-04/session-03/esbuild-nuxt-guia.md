# Guía Completa: esbuild y Nuxt.js

## esbuild – El bundler ultrarrápido

### ¿Qué es esbuild?

`esbuild` es una herramienta de construcción (bundler y transpiler) escrita en Go, diseñada para ser increíblemente rápida y eficiente.

- 🛠️ Transforma y agrupa archivos JS, TS, CSS.
- 🚀 Es 10–100 veces más rápida que Webpack.
- 📦 Soporta minificación, tree-shaking y code splitting.

---

### Características principales

| Característica   | ¿esbuild lo soporta? | Notas                                         |
| ---------------- | -------------------- | --------------------------------------------- |
| Transpilación TS | ✅                   | Soporte nativo                                |
| Bundling         | ✅                   | Agrupa todos los módulos en uno solo          |
| Minificación     | ✅                   | Muy rápida al eliminar espacios y comentarios |
| Tree-shaking     | ✅                   | Elimina código no utilizado                   |
| Code splitting   | ✅                   | Compatible con `import()` dinámico            |
| Plugins          | ✅ (limitado)        | Soporte básico                                |
| CSS bundling     | ✅                   | También agrupa e importa CSS                  |
| Watch mode       | ✅                   | Para desarrollo                               |

---

### ¿Dónde se usa esbuild?

- **Vite** (Vue, React, Svelte)
- **Snowpack**
- **Turbopack (Next.js futuro)**
- **Standalone** como CLI para proyectos Node

---

### ¿Por qué es tan rápido?

- Está escrito en **Go**, lenguaje compilado.
- Usa concurrencia y operaciones de bajo nivel.
- No depende de Node.js internamente.

---

### Ejemplo de uso standalone

```bash
esbuild app.ts --bundle --minify --outfile=dist/bundle.js
```

---

## Nuxt.js – Framework progresivo para Vue

### ¿Qué es Nuxt?

`Nuxt.js` es un framework de alto nivel construido sobre Vue.js que añade:

- 📄 Generación de rutas automáticas
- 🌐 Renderizado del lado del servidor (SSR)
- ⚡ Generación estática (SSG)
- 🔐 Autenticación
- 🎨 Layouts y páginas listas para usar

---

### ¿Qué problemas resuelve Nuxt?

- SEO en aplicaciones Vue
- Pre-renderizado de contenido
- Estructuración de carpetas y rutas
- Configuración repetitiva de Vue

---

### Modos de renderizado

| Modo   | ¿Qué hace?                                            |
| ------ | ----------------------------------------------------- |
| SPA    | Comportamiento tradicional de Vue                     |
| SSR    | Renderiza HTML en el servidor para SEO                |
| SSG    | Genera HTML estático en build-time                    |
| Hybrid | Puedes usar SSR para algunas páginas y SSG para otras |

---

### Estructura típica de proyecto Nuxt

```
nuxt-app/
├── pages/        # Rutas automáticas
├── layouts/      # Diseños reutilizables
├── components/   # Componentes Vue
├── middleware/   # Lógica entre navegación
├── store/        # Vuex store opcional
├── nuxt.config.ts
```

---

### ¿Qué versiones existen?

- `Nuxt 2`: basado en Vue 2, usa Webpack
- `Nuxt 3`: basado en Vue 3, usa Vite/esbuild y Nitro

---

### ¿Cuándo usar Nuxt?

✅ Cuando necesitas:

- SEO en una SPA
- Mejores tiempos de carga inicial
- Rutas automáticas y menos configuración

---

### ¿Quién lo usa?

- [Algolia](https://www.algolia.com)
- [Netflix Jobs](https://jobs.netflix.com)
- [GitLab Docs](https://docs.gitlab.com)

---

## Comparación rápida

| Característica | esbuild                     | Nuxt.js                          |
| -------------- | --------------------------- | -------------------------------- |
| ¿Qué es?       | Bundler/transpiler          | Framework full-stack para Vue    |
| Enfocado en    | Velocidad de compilación    | Renderizado y estructura de apps |
| Usado en       | Vite, Snowpack, CLI         | Vue apps con SSR, SSG            |
| Complemento de | Vite, herramientas de build | Vue.js                           |
| Nivel          | Bajo (build)                | Alto (estructura + SSR + config) |

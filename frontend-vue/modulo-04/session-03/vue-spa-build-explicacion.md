## 🧠 ¿Cómo Vue.js genera builds livianos para producción?

### ¿Qué es una SPA compilada?

Una SPA (Single Page Application):
- Se sirve desde un único archivo HTML.
- Usa JavaScript modular para renderizar vistas dinámicamente.
- No recarga el navegador al navegar entre vistas.

---

### ⚙️ ¿Qué hace Vue.js con Vite al ejecutar `npm run build`?

1. **Transpilación**
   - Convierte TypeScript y componentes `.vue` en JavaScript.

2. **Bundle**
   - Agrupa archivos en módulos optimizados.
   - Divide el código en chunks (`main`, `vendors`, etc.).

3. **Minificación**
   - Elimina espacios, comentarios, y renombra variables.
   - Quita código no utilizado (tree-shaking).

4. **Lazy Loading (Code Splitting)**
   - Carga código bajo demanda por ruta.
   - Mejora el tiempo de carga inicial.

---

### 📁 Resultado del build (`dist/`)

```
dist/
├── index.html
├── assets/
│   ├── main.[hash].js
│   ├── style.[hash].css
│   └── vendors.[hash].js
```

Este contenido puede desplegarse en Firebase Hosting, Vercel o Netlify fácilmente.

---

### 🆚 Comparativa con otros frameworks

| Framework        | Build Tool         | Code Splitting | SSR / Pre-rendering |
|------------------|--------------------|----------------|---------------------|
| **Vue (Vite)**   | Vite + esbuild     | ✅ Sí          | ✅ Con Nuxt          |
| **React (CRA)**  | Webpack / Vite     | ✅ Sí          | ✅ Con Next.js       |
| **Angular**      | Angular CLI        | ✅ Sí          | ✅ Angular Universal |
| **SvelteKit**    | Vite + Svelte      | ✅ Automático  | ✅ SSR / Edge Ready  |

---

### ✅ Buenas prácticas para builds livianos

- Usar `npm run build` antes de desplegar.
- Configurar variables por entorno (`.env.production`).
- Desactivar `sourceMap` en producción.
- Aplicar `lazy loading` con Vue Router.
- Revisar el tamaño del bundle con `vite-plugin-visualizer`.

---

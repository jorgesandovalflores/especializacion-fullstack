# 📦 Optimización con `manualChunks` en Vite

## 🧩 ¿Qué es `manualChunks`?

`manualChunks` es una opción avanzada en Rollup (y usada por Vite) para dividir manualmente el código en archivos ("chunks") durante el proceso de build.

> Sirve para controlar cómo se agrupan las dependencias y optimizar el rendimiento de carga de la aplicación.

---

## 🎯 ¿Por qué usar manualChunks?

- **Reduce el tamaño de carga inicial.**
- **Permite cachear paquetes comunes como Vue, Pinia, etc.**
- **Divide el código por rutas o vistas específicas.**

---

## ⚙️ Uso básico en Vite

Archivo `vite.config.ts`:

```ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('vue')) {
              return 'vendor-vue'
            }
            if (id.includes('pinia')) {
              return 'vendor-pinia'
            }
            return 'vendor'
          }
        }
      }
    }
  }
})
```

---

## 📁 Resultado del build

```
dist/assets/
├── vendor.js
├── vendor-vue.js
├── vendor-pinia.js
├── main.[hash].js
```

---

## 📈 ¿Cuándo usarlo?

✅ Úsalo si:
- Tienes librerías pesadas (ej. `axios`, `firebase`, `vue`).
- Quieres separar vistas o funcionalidades (ej. auth, admin).
- Quieres mejorar el rendimiento de carga y caching.

---

## 🧠 Buenas prácticas

- No crear demasiados chunks pequeños (aumenta las peticiones HTTP).
- Agrupar dependencias comunes en un solo vendor (cuando sea posible).
- Medir el impacto usando herramientas visuales.

---

## 📚 Ejemplo avanzado

```ts
manualChunks: {
  vendor: ['vue', 'vue-router', 'pinia'],
  ui: ['bootstrap', 'element-plus'],
  auth: ['./src/views/login.vue', './src/views/register.vue']
}
```

---

## 🔍 Analiza el resultado visualmente

Instala:

```bash
npm install -D rollup-plugin-visualizer
```

Configura en `vite.config.ts`:

```ts
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  plugins: [
    vue(),
    visualizer({ open: true })
  ]
})
```

Esto abrirá un reporte visual del tamaño de cada chunk en el navegador.

---

## ✅ Conclusión

`manualChunks` te permite controlar cómo se divide tu código en producción. Bien usado, puede mejorar la performance, caching y escalabilidad de tu aplicación Vue/Vite.

# Clase — Historia de navegación en Vue.js 3  
## SPA y SSR con Vue Router

---

## Objetivos de la clase

- Comprender qué es el sistema de history en Vue Router.
- Identificar las opciones disponibles en Vue 3.
- Elegir correctamente el tipo de history según si la aplicación es SPA o SSR.
- Entender implicancias técnicas como SEO, configuración de servidor y renderizado.

---

## Contenido

- Qué es `history` en Vue Router
- Tipos de history disponibles
- Uso en aplicaciones SPA
- Uso en aplicaciones SSR
- Comparativa y criterios de elección

---

## 1. ¿Qué es `history` en Vue Router?

En Vue Router, `history` define **cómo se almacenan y manejan las rutas de la aplicación**, es decir:

- Cómo se ve la URL en el navegador
- Cómo se navega entre vistas
- Cómo se comporta el botón Back/Forward
- Cómo interactúa el navegador o el servidor con las rutas

Vue Router 4 (Vue 3) desacopla completamente el enrutamiento de la implementación de history, permitiendo usar distintas estrategias según el contexto.

---

## 2. Tipos de history en Vue Router 4

Vue Router ofrece tres implementaciones oficiales:

```ts
createWebHistory()
createWebHashHistory()
createMemoryHistory()
```

Cada una responde a necesidades distintas.

---

## 3. `createWebHistory()` — History API (HTML5)

### Descripción

Utiliza la History API del navegador (`pushState`, `replaceState`).

### Formato de URL

```
/about
/dashboard
```

### Características

- URLs limpias y legibles
- Navegación real del navegador
- Compatible con SEO
- Compatible con SSR

### Requisitos de servidor

El servidor debe redirigir **todas las rutas** al archivo `index.html`.

Ejemplos:
- Nginx
- Apache
- CloudFront
- Vercel
- Netlify

### Uso recomendado

- SPA modernas en producción
- Aplicaciones públicas
- Aplicaciones con SSR

### Ejemplo

```ts
const router = createRouter({
	history: createWebHistory(),
	routes
});
```

### Ventajas

- URLs profesionales
- Buen soporte SEO
- Estándar moderno

### Desventajas

- Requiere configuración del servidor

---

## 4. `createWebHashHistory()` — Hash mode

### Descripción

Utiliza el hash (`#`) de la URL para manejar la navegación.

### Formato de URL

```
/#/about
/#/dashboard
```

### Características

- Todo el enrutamiento ocurre en el cliente
- El navegador no realiza peticiones al servidor por sub-rutas
- No requiere configuración backend

### Uso recomendado

- Hosting estático sin control del servidor
- Sistemas internos
- WebView, Electron, Capacitor
- Aplicaciones legacy

### Ejemplo

```ts
const router = createRouter({
	history: createWebHashHistory(),
	routes
});
```

### Ventajas

- No requiere configuración de servidor
- Alta compatibilidad
- Muy estable

### Desventajas

- URLs poco elegantes
- SEO limitado
- No apto para SSR

---

## 5. `createMemoryHistory()` — History en memoria

### Descripción

Mantiene el estado de navegación únicamente en memoria.

### Características

- No utiliza URLs reales
- No interactúa con el navegador
- Cada request mantiene su propio estado

### Uso recomendado

- Renderizado del lado del servidor (SSR)
- Tests unitarios
- Entornos no visuales

### Ejemplo

```ts
const router = createRouter({
	history: createMemoryHistory(),
	routes
});
```

### Ventajas

- Ideal para SSR
- Totalmente controlable
- No depende del navegador

### Desventajas

- No usable directamente en SPA cliente
- No refleja navegación real

---

## 6. Uso de history en SPA

### Escenarios comunes

| Escenario | History recomendado |
|---------|---------------------|
| SPA moderna | createWebHistory |
| Hosting limitado | createWebHashHistory |
| App híbrida / WebView | createWebHashHistory |

---

## 7. Uso de history en SSR

En aplicaciones con SSR se usan **dos implementaciones distintas**:

### En el servidor

```ts
createMemoryHistory()
```

### En el cliente

```ts
createWebHistory()
```

Esto permite:
- Renderizar rutas en el servidor
- Hidratar correctamente la aplicación
- Mantener URLs limpias y SEO

---

## 8. Comparativa general

| History | SPA | SSR | SEO | Configuración servidor |
|------|-----|-----|-----|-------------------------|
| createWebHistory | Sí | Sí | Sí | Sí |
| createWebHashHistory | Sí | No | No | No |
| createMemoryHistory | No | Sí | Sí | No |

---

## 9. Conclusiones

- `createWebHistory` es la opción estándar para producción.
- `createWebHashHistory` es una solución práctica cuando no se controla el servidor.
- `createMemoryHistory` es clave en SSR y testing.
- La elección del history impacta directamente en SEO, UX y arquitectura.


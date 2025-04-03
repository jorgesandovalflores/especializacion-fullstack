
# 🎓 Módulo 02 - Estado y Rutas en Vue.js  
## Clase 01: **Gestión del estado en Vue.js (Composition API y Pinia)**

---

### 📘 Objetivo de la clase:

El estudiante será capaz de:

- Comprender qué es el estado y por qué es esencial.
- Aplicar **Pinia** para manejar estado global en Vue 3 con **Composition API**.
- Comparar **Pinia** con **Vuex** y entender por qué Pinia es el nuevo estándar.
- Comunicar componentes de forma eficaz mediante stores.
- Implementar persistencia de datos usando `localStorage`.
- Desarrollar una pequeña aplicación como práctica.

---

## 🧭 Agenda de la clase

1. ¿Qué es el estado?
2. Introducción a Pinia con Composition API
3. Comparación entre Vuex y Pinia
4. Comunicación entre componentes con stores
5. Persistencia de datos en el frontend
6. Ejercicio práctico: Lista de tareas
7. Preguntas y resumen

---

## 1. 🎯 ¿Qué es el estado?

El **estado** representa los datos dinámicos de una aplicación: lo que puede cambiar con el tiempo o por interacción del usuario.

- **Estado local:** datos que sólo afectan a un componente (ej. `ref`, `reactive`).
- **Estado global:** datos compartidos entre varios componentes (ej. usuario autenticado, carrito, configuraciones).

### ¿Por qué necesitamos un manejador de estado?

- Centraliza el acceso a datos globales.
- Mejora la mantenibilidad.
- Facilita el debug y trazabilidad.
- Reduce acoplamientos innecesarios.

📌 *Ejemplos reales:*  
- El estado de autenticación en una app.
- La posición del usuario en un mapa.
- El idioma de la aplicación.
- La visibilidad de un modal.

---

## 2. 📦 Introducción a Pinia con Composition API

**Pinia** es la librería oficial de Vue para manejar estado global (reemplaza a Vuex desde Vue 3). Es más simple, ligera y moderna.

### Ventajas de Pinia sobre Vuex

| Característica         | Vuex 3/4            | Pinia                  |
|------------------------|---------------------|------------------------|
| Basado en Composition API | ❌ (Vuex 3), Parcial (Vuex 4) | ✅ Sí |
| Tipado automático      | ❌ Requiere esfuerzo | ✅ Excelente con TypeScript |
| Modular                | ✅                  | ✅ (más simple aún)     |
| API simple             | ❌ Verbosa          | ✅ Minimalista          |
| Soporte oficial        | ✅                  | ✅ (recomendado por Vue) |

### Instalación

```bash
npm install pinia
```

### Configuración en `main.ts`

```ts
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

const app = createApp(App)
app.use(createPinia())
app.mount('#app')
```

---

## 3. 🆚 Pinia vs Vuex: Comparación práctica

**Vuex (antes):**

```ts
// store/index.js
export default new Vuex.Store({
  state: { count: 0 },
  mutations: {
    increment(state) {
      state.count++
    }
  }
})
```

**Pinia (ahora):**

```ts
export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  const increment = () => count.value++
  return { count, increment }
})
```

👉 *Conclusión:* Pinia requiere menos código, es más intuitivo, y se integra mejor con Vue 3.

---

## 4. 🔁 Comunicación entre componentes

Cuando varios componentes necesitan acceder o modificar la misma data, usar un store (como Pinia) es la forma más escalable.

### Ejemplo con Pinia

```ts
// stores/user.ts
export const useUserStore = defineStore('user', () => {
  const name = ref('')
  const setName = (newName: string) => { name.value = newName }
  return { name, setName }
})
```

- `ComponenteA.vue`: actualiza el nombre
- `ComponenteB.vue`: lo muestra

Ambos acceden al **mismo store**, lo que garantiza sincronización de datos sin necesidad de emitir eventos o props.

---

## 5. 💾 Persistencia con localStorage

Podemos usar `watch()` para persistir cambios automáticamente:

```ts
const count = ref(Number(localStorage.getItem('counter')) || 0)

watch(count, (newVal) => {
  localStorage.setItem('counter', newVal.toString())
})
```

### Tip:
Para persistencia más robusta, puedes usar `pinia-plugin-persistedstate`.

```bash
npm install pinia-plugin-persistedstate
```

---

## 6. 🧑‍💻 Ejercicio práctico: Lista de tareas

Se implementará un store con las siguientes operaciones:

- Agregar tarea
- Marcar tarea como hecha/no hecha
- Eliminar tarea
- Persistir el estado en localStorage

Código en `stores/todo.ts`:

```ts
interface Todo {
  id: number
  text: string
  done: boolean
}

export const useTodoStore = defineStore('todo', () => {
  const todos = ref<Todo[]>(JSON.parse(localStorage.getItem('todos') || '[]'))

  function addTodo(text: string) {
    todos.value.push({ id: Date.now(), text, done: false })
  }

  function toggleTodo(id: number) {
    const todo = todos.value.find(t => t.id === id)
    if (todo) todo.done = !todo.done
  }

  function removeTodo(id: number) {
    todos.value = todos.value.filter(t => t.id !== id)
  }

  watch(todos, (newTodos) => {
    localStorage.setItem('todos', JSON.stringify(newTodos))
  }, { deep: true })

  return { todos, addTodo, toggleTodo, removeTodo }
})
```

---

## 7. 🧾 Cierre y repaso

✔️ Diferenciamos entre estado local y global  
✔️ Exploramos Pinia y su sintaxis moderna con Composition API  
✔️ Comparamos Pinia y Vuex para entender por qué Pinia es el estándar actual  
✔️ Comunicamos componentes fácilmente usando stores  
✔️ Persistimos datos en `localStorage`  
✔️ Creamos una app práctica de lista de tareas

---

**¿Preguntas?**  
¡En la próxima clase empezamos con rutas dinámicas y navegación entre páginas! 🚀

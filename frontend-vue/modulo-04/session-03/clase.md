## 🌟 Clase 03 - Módulo 04: Configuración de un Proyecto para Producción

### 🎯 Objetivos

1. Configurar un proyecto Vue 3 para entorno productivo.
2. Generar archivos optimizados con Vite.
3. Construir un dashboard de pedidos con carrito de compras.
4. Desplegar el proyecto en Vercel, Netlify y Firebase Hosting.
5. Comparar entornos y plataformas cloud.

---

### 📃 1. Diferencias entre entornos

| Característica     | Desarrollo                | Producción                      |
| ------------------ | ------------------------- | ------------------------------- |
| Logging            | Verboso (`console.log`)   | Silenciado o servicios externos |
| Archivos estáticos | No minificados, con mapas | Minificados, sin comentarios    |
| Performance        | Build incremental, HMR    | Build completo y optimizado     |
| Seguridad          | Variables visibles        | Variables protegidas            |
| Source Maps        | Activados                 | Desactivados                    |

---

### ⚙️ 2. Configuración de Vite para producción

#### Archivos `.env`

.env.production

```env
VITE_API_URL=https://api.myapp.com
VITE_ENV=production
```

.env.development

```env
VITE_API_URL=http://localhost:3000
VITE_ENV=development
```

#### vite.config.ts

```ts
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), '')
	return {
		plugins: [vue()],
		define: {
			__APP_ENV__: JSON.stringify(env.VITE_ENV),
		},
		build: {
			minify: 'esbuild',
			sourcemap: false,
			outDir: 'dist',
		},
	}
})
```

---

### 🛒 3. Dashboard de pedidos

#### Modelo de producto

```ts
export type Product = {
	id: string
	name: string
	price: number
	image: string
}
```

#### Store de productos (Pinia)

```ts
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useProductStore = defineStore('product', () => {
	const products = ref<Product[]>([
		{ id: '1', name: 'Laptop', price: 2500, image: 'https://via.placeholder.com/150' },
		{ id: '2', name: 'Mouse', price: 100, image: 'https://via.placeholder.com/150' },
		{ id: '3', name: 'Teclado', price: 180, image: 'https://via.placeholder.com/150' },
	])

	return { products }
})
```

#### Store del carrito

```ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Product } from './product.store'

export const useCartStore = defineStore('cart', () => {
	const cart = ref<Product[]>([])

	const addToCart = (product: Product) => cart.value.push(product)
	const removeFromCart = (id: string) => {
		cart.value = cart.value.filter(p => p.id !== id)
	}

	const total = computed(() => cart.value.reduce((acc, item) => acc + item.price, 0))

	return { cart, addToCart, removeFromCart, total }
})
```

#### Componente ProductList.vue

```vue
<template>
	<div class="row">
		<div class="col-md-4 mb-3" v-for="product in products" :key="product.id">
			<div class="card">
				<img :src="product.image" class="card-img-top" />
				<div class="card-body">
					<h5 class="card-title">{{ product.name }}</h5>
					<p class="card-text">S/ {{ product.price }}</p>
					<button class="btn btn-primary w-100" @click="cart.addToCart(product)">Agregar al carrito</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useProductStore } from '@/stores/product.store'
import { useCartStore } from '@/stores/cart.store'

const { products } = useProductStore()
const cart = useCartStore()
</script>
```

#### Componente CartView\.vue

```vue
<template>
	<div>
		<h4>Carrito</h4>
		<ul class="list-group mb-3">
			<li v-for="item in cart.cart" :key="item.id" class="list-group-item d-flex justify-content-between">
				{{ item.name }} - S/ {{ item.price }}
				<button class="btn btn-danger btn-sm" @click="cart.removeFromCart(item.id)">Eliminar</button>
			</li>
		</ul>
		<div class="fw-bold text-end">Total: S/ {{ cart.total }}</div>
	</div>
</template>

<script setup lang="ts">
import { useCartStore } from '@/stores/cart.store'
const cart = useCartStore()
</script>
```

#### Componente CheckoutForm.vue

```vue
<template>
	<form @submit.prevent="submitOrder">
		<h4>Finalizar pedido</h4>
		<div class="mb-3">
			<label class="form-label">Nombre</label>
			<input v-model="name" class="form-control" required />
		</div>
		<div class="mb-3">
			<label class="form-label">Correo</label>
			<input v-model="email" type="email" class="form-control" required />
		</div>
		<button class="btn btn-success w-100" type="submit">Confirmar pedido</button>
	</form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useCartStore } from '@/stores/cart.store'

const name = ref('')
const email = ref('')
const cart = useCartStore()

const submitOrder = () => {
	alert(`Pedido para ${name.value} confirmado! Total: S/ ${cart.total.value}`)
	cart.cart = []
}
</script>
```

#### Vista Dashboard.vue

```vue
<template>
	<div class="container py-4">
		<h2 class="mb-4">Dashboard de Pedidos</h2>
		<ProductList />
		<hr />
		<CartView />
		<hr />
		<CheckoutForm />
	</div>
</template>

<script setup lang="ts">
import ProductList from '@/components/ProductList.vue'
import CartView from '@/components/CartView.vue'
import CheckoutForm from '@/components/CheckoutForm.vue'
</script>
```

#### App.vue

```vue
<template>
  <router-view />
</template>
```

#### router/index.ts

```ts
import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '@/views/Dashboard.vue'

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
```

#### main.ts

```ts
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import 'bootstrap/dist/css/bootstrap.min.css'

createApp(App)
  .use(createPinia())
  .use(router)
  .mount('#app')
```

---

### ☁️ 4. Despliegue en plataformas cloud

| Plataforma   | Dominio Gratis | CI/CD Integrado | Archivos Estáticos | Funciones Backend |
| ------------ | -------------- | --------------- | ------------------ | ----------------- |
| **Vercel**   | ✅              | ✅ (Git push)    | ✅                  | ✅ (Serverless)    |
| **Netlify**  | ✅              | ✅ (Git push)    | ✅                  | ✅                 |
| **Firebase** | ❌ (subdominio) | ❌               | ✅                  | ✅                 |

#### Vercel

```bash
npm install -g vercel
vercel login
vercel
```

#### Netlify

```bash
npm install -g netlify-cli
netlify login
npm run build
netlify deploy --prod --dir=dist
```

#### Firebase

```bash
npm install -g firebase-tools
firebase login
firebase init
npm run build
firebase deploy
```

---

### 💡 Buenas prácticas

* Minificar JS/CSS.
* Eliminar `console.log`.
* Usar `.env.production`.
* HTTPS obligatorio.
* Incluir `robots.txt` y `sitemap.xml`.

---

### ✅ Actividades

1. Mostrar `VITE_ENV` en el dashboard.
2. Desplegar en Vercel y compartir el enlace.
3. Agregar productos al carrito y completar un pedido.

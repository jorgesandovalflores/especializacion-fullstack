# Demo Vue.js con TypeScript, Vite, Pinia, Bootstrap – Búsqueda, Paginación y Detalle

## 1. Inicializar el proyecto

```bash
npm create vite@latest vue-product-demo -- --template vue-ts
cd vue-product-demo
npm install
```

## 2. Instalar dependencias necesarias

```bash
npm install pinia bootstrap lodash
npm install --save-dev @types/lodash
```

## 3. Estructura de carpetas

```
src/
├── assets/
├── components/
│   ├── ProductCard.vue
│   └── Pagination.vue
├── pages/
│   ├── ProductList.vue
│   └── ProductDetail.vue
├── router/
│   └── index.ts
├── store/
│   └── useProductStore.ts
├── types/
│   └── Product.ts
├── App.vue
├── main.ts
```

## 4. Configurar `main.ts`

```ts
import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import "bootstrap/dist/css/bootstrap.min.css";

const app = createApp(App);
app.use(createPinia());
app.use(router);
app.mount("#app");
```

## 5. Definir tipos (`types/Product.ts`)

```ts
export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
}
```

## 6. Crear Store (`store/useProductStore.ts`)

```ts
import { defineStore } from "pinia";
import type { Product } from "@/types/Product";

function generateProducts(): Product[] {
    return Array.from({ length: 1000 }, (_, i) => ({
        id: i + 1,
        name: `Product ${i + 1}`,
        description: `Description of product ${i + 1}`,
        price: +(Math.random() * 100).toFixed(2),
    }));
}

export const useProductStore = defineStore("product", () => {
    const products = generateProducts();
    return { products };
});
```

## 7. Configurar rutas (`router/index.ts`)

```ts
import { createRouter, createWebHistory } from "vue-router";
import ProductList from "@/pages/ProductList.vue";
import ProductDetail from "@/pages/ProductDetail.vue";

export default createRouter({
    history: createWebHistory(),
    routes: [
        { path: "/", name: "ProductList", component: ProductList },
        {
            path: "/product/:id",
            name: "ProductDetail",
            component: ProductDetail,
        },
    ],
});
```

## 8. `ProductList.vue`

```vue
<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useProductStore } from "@/store/useProductStore";
import { useRouter } from "vue-router";
import { debounce } from "lodash";
import ProductCard from "@/components/ProductCard.vue";
import Pagination from "@/components/Pagination.vue";

const store = useProductStore();
const router = useRouter();

const searchTerm = ref("");
const debouncedSearch = ref("");

const currentPage = ref(1);
const perPage = 10;

const totalPages = computed(() =>
    Math.ceil(filteredProducts.value.length / perPage),
);

const filteredProducts = computed(() => {
    const term = debouncedSearch.value.toLowerCase();
    return store.products.filter((p) => p.name.toLowerCase().includes(term));
});

const paginatedProducts = computed(() => {
    const start = (currentPage.value - 1) * perPage;
    return filteredProducts.value.slice(start, start + perPage);
});

watch(
    searchTerm,
    debounce((value) => {
        debouncedSearch.value = value;
        currentPage.value = 1;
    }, 300),
);
</script>

<template>
    <div class="container py-4">
        <h2>Listado de Productos</h2>

        <input
            v-model="searchTerm"
            type="text"
            class="form-control mb-3"
            placeholder="Buscar producto..."
        />

        <div class="row">
            <ProductCard
                v-for="product in paginatedProducts"
                :key="product.id"
                :product="product"
                @click="() => router.push(`/product/${product.id}`)"
            />
        </div>

        <Pagination
            :current-page="currentPage"
            :total-pages="totalPages"
            @prev="() => currentPage.value--"
            @next="() => currentPage.value++"
        />
    </div>
</template>
```

## 9. `ProductCard.vue`

```vue
<script setup lang="ts">
import type { Product } from "@/types/Product";
defineProps<{ product: Product }>();
</script>

<template>
    <div class="col-md-4 mb-3">
        <div class="card h-100" role="button">
            <div class="card-body">
                <h5 class="card-title">{{ product.name }}</h5>
                <p class="card-text">{{ product.description }}</p>
                <span class="badge bg-primary">S/ {{ product.price }}</span>
            </div>
        </div>
    </div>
</template>
```

## 10. `Pagination.vue`

```vue
<script setup lang="ts">
defineProps<{
    currentPage: number;
    totalPages: number;
}>();

const emit = defineEmits(["prev", "next"]);
</script>

<template>
    <div class="d-flex justify-content-center align-items-center gap-3 mt-4">
        <button
            class="btn btn-secondary"
            :disabled="currentPage <= 1"
            @click="emit('prev')"
        >
            Anterior
        </button>

        <span>Página {{ currentPage }} de {{ totalPages }}</span>

        <button
            class="btn btn-secondary"
            :disabled="currentPage >= totalPages"
            @click="emit('next')"
        >
            Siguiente
        </button>
    </div>
</template>
```

## 11. `ProductDetail.vue`

```vue
<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { useProductStore } from "@/store/useProductStore";
import { computed } from "vue";

const route = useRoute();
const router = useRouter();
const store = useProductStore();

const product = computed(() =>
    store.products.find((p) => p.id === Number(route.params.id)),
);
</script>

<template>
    <div class="container py-4">
        <div v-if="product">
            <h2>{{ product.name }}</h2>
            <p>{{ product.description }}</p>
            <p><strong>Precio:</strong> S/ {{ product.price }}</p>

            <button class="btn btn-primary" @click="router.push('/')">
                Volver al listado
            </button>
        </div>
        <div v-else>
            <p>Producto no encontrado</p>
            <button class="btn btn-secondary" @click="router.push('/')">
                Volver al listado
            </button>
        </div>
    </div>
</template>
```

## 12. `App.vue`

```vue
<template>
    <router-view />
</template>
```

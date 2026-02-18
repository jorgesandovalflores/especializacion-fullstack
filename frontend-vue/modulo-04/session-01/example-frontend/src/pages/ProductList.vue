<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useProductStore } from "../stores/useProductStore";
import { useRouter } from "vue-router";
import { debounce } from "lodash";
import ProductCard from "../components/ProductCard.vue";
import Pagination from "../components/Pagination.vue";

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
            @prev="() => currentPage--"
            @next="() => currentPage++"
        />
    </div>
</template>

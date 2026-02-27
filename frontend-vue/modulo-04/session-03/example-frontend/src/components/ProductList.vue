<!-- src/components/ProductList.vue -->
<template>
    <div class="row">
        <div
            class="col-md-4 mb-3"
            v-for="product in products"
            :key="product.id"
        >
            <div class="card">
                <img :src="product.image" class="card-img-top" />
                <div class="card-body">
                    <h5 class="card-title">{{ product.name }}</h5>
                    <p class="card-text">S/ {{ product.price }}</p>
                    <button
                        class="btn btn-primary w-100"
                        @click="cart.addToCart(product)"
                    >
                        Agregar al carrito
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useProductStore } from "../stores/product.store";
import { useCartStore } from "../stores/cart.store";

const { products } = useProductStore();
const cart = useCartStore();

onMounted(() => {
    setTimeout(() => {
        throw new Error("Error lanzado después de 5 segundos en onMounted");
    }, 5000);
});
</script>

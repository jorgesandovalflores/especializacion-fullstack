<template>
  <div class="container py-4">
    <h2 class="mb-4">Comparar Productos</h2>

    <table class="table table-striped">
      <thead>
        <tr>
          <th>Producto</th>
          <th>Precio</th>
          <th>Tienda</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="product in sortedProducts"
          :key="product.id"
          :class="{ 'table-success': product.price === minPrice }"
        >
          <td>{{ product.name }}</td>
          <td>S/ {{ product.price.toFixed(2) }}</td>
          <td>{{ product.store }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import api from '@/services/api'

type Product = {
  id: string
  name: string
  price: number
  store: string
}

const products = ref<Product[]>([])

onMounted(async () => {
  const { data } = await api.get('/products')
  products.value = data
})

const sortedProducts = computed(() =>
  [...products.value].sort((a, b) => a.price - b.price)
)

const minPrice = computed(() =>
  Math.min(...products.value.map((p) => p.price))
)
</script>

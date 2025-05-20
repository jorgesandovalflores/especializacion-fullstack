<template>
  <div class="container py-4">
    <h2 class="mb-4">Listado de Productos</h2>

    <div class="d-flex justify-content-between mb-3">
      <input
        v-model="search"
        class="form-control w-50"
        placeholder="Buscar producto por nombre"
      />
      <router-link class="btn btn-primary" to="/products/new">➕ Nuevo Producto</router-link>
    </div>

    <table class="table table-bordered table-hover">
      <thead class="table-light">
        <tr>
          <th>Nombre</th>
          <th>Precio</th>
          <th>Tienda</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="product in filteredProducts" :key="product.id">
          <td>{{ product.name }}</td>
          <td>S/ {{ product.price.toFixed(2) }}</td>
          <td>{{ product.store }}</td>
          <td>
            <router-link class="btn btn-sm btn-warning" :to="`/products/${product.id}/edit`">Editar</router-link>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import api from '@/services/api'

type Product = {
  id: string
  name: string
  price: number
  store: string
}

const products = ref<Product[]>([])
const search = ref('')

onMounted(async () => {
  const { data } = await api.get('/products')
  products.value = data
})

const filteredProducts = computed(() =>
  products.value.filter((p) =>
    p.name.toLowerCase().includes(search.value.toLowerCase())
  )
)
</script>

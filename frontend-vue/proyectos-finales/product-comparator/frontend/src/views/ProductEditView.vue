<template>
  <div class="container py-4">
    <h2 class="mb-4">Editar Producto</h2>

    <form v-if="form" @submit.prevent="onSubmit">
      <div class="mb-3">
        <label class="form-label">Nombre</label>
        <input v-model="form.name" class="form-control" required />
      </div>

      <div class="mb-3">
        <label class="form-label">Precio (S/)</label>
        <input v-model.number="form.price" type="number" step="0.01" class="form-control" required />
      </div>

      <div class="mb-3">
        <label class="form-label">Tienda</label>
        <input v-model="form.store" class="form-control" required />
      </div>

      <button class="btn btn-warning" type="submit">Actualizar</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/services/api'

const form = ref<{ name: string; price: number; store: string } | null>(null)
const route = useRoute()
const router = useRouter()

onMounted(async () => {
  const { data } = await api.get(`/products/${route.params.id}`)
  form.value = data
})

async function onSubmit() {
  await api.put(`/products/${route.params.id}`, form.value)
  router.push('/products')
}
</script>

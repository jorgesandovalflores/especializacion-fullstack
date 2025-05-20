<template>
  <div class="container py-4">
    <h2 class="mb-4">Registrar Nuevo Producto</h2>

    <form @submit.prevent="onSubmit">
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

      <button class="btn btn-success" type="submit">Guardar</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'

const form = ref({
  name: '',
  price: 0,
  store: ''
})

const router = useRouter()

async function onSubmit() {
  await api.post('/products', form.value)
  router.push('/products')
}
</script>

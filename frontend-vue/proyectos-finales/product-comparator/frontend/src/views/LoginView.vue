<template>
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-md-4">
        <h2 class="mb-4 text-center">Iniciar Sesión</h2>
        <form @submit.prevent="onSubmit">
          <div class="mb-3">
            <label class="form-label">Usuario</label>
            <input v-model="email" type="email" class="form-control" required />
          </div>
          <div class="mb-3">
            <label class="form-label">Contraseña</label>
            <input v-model="password" type="password" class="form-control" required />
          </div>
          <button class="btn btn-primary w-100" type="submit">Entrar</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const email = ref('')
const password = ref('')
const router = useRouter()
const auth = useAuthStore()

async function onSubmit() {
  // Simulación de autenticación
  if (email.value === 'admin@demo.com' && password.value === '123456') {
    auth.login('demo-token')
    router.push({ name: 'home' })
  } else {
    alert('Credenciales incorrectas')
  }
}
</script>

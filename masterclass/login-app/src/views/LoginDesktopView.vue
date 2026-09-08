<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import BaseInput from '../components/BaseInput.vue'
import BaseButton from '../components/BaseButton.vue'
import { login } from '../services/auth.service'
import { saveToken } from '../services/session.service'

const router = useRouter()

const form = reactive({
  email: '',
  password: '',
  rememberMe: false,
})

const isSubmitting = ref(false)
const errorMessage = ref('')

async function handleSubmit() {
  errorMessage.value = ''
  isSubmitting.value = true

  try {
    const response = await login({ email: form.email, password: form.password })
    saveToken(response.accessToken)
    await router.push('/home')
  } catch (error) {
    errorMessage.value =
      error instanceof Error ? error.message : 'No se pudo iniciar sesión'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="login-desktop">
    <form class="login-desktop__card" @submit.prevent="handleSubmit">
      <div class="login-desktop__header">
        <h1 class="login-desktop__title">Bienvenido de nuevo</h1>
        <p class="login-desktop__subtitle">Inicia sesión para continuar</p>
      </div>

      <BaseInput
        v-model="form.email"
        label="Correo electrónico"
        type="email"
        placeholder="tu@correo.com"
      />
      <BaseInput
        v-model="form.password"
        label="Contraseña"
        type="password"
        placeholder="••••••••"
      />

      <div class="login-desktop__options">
        <label class="login-desktop__remember">
          <input type="checkbox" v-model="form.rememberMe" />
          <span>Recuérdame</span>
        </label>
        <a class="login-desktop__link" href="#">¿Olvidaste tu contraseña?</a>
      </div>

      <p v-if="errorMessage" class="login-desktop__error">{{ errorMessage }}</p>

      <BaseButton type="submit" :disabled="isSubmitting">
        {{ isSubmitting ? 'Ingresando...' : 'Iniciar sesión' }}
      </BaseButton>

      <p class="login-desktop__footer">
        ¿No tienes cuenta?
        <a class="login-desktop__link" href="#">Regístrate</a>
      </p>
    </form>
  </div>
</template>

<style scoped>
.login-desktop {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg-page);
  padding: 40px;
}

.login-desktop__card {
  width: 400px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 40px;
  background: #ffffff;
  border: 1px solid var(--color-border);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.login-desktop__header {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.login-desktop__title {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  color: var(--color-text-primary);
}

.login-desktop__subtitle {
  margin: 0;
  font-size: 14px;
  color: var(--color-text-secondary);
}

.login-desktop__options {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.login-desktop__remember {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--color-text-secondary);
}

.login-desktop__link {
  font-size: 13px;
  font-weight: 600;
  color: var(--color-primary);
  text-decoration: none;
}

.login-desktop__link:hover {
  text-decoration: underline;
}

.login-desktop__error {
  margin: 0;
  text-align: center;
  font-size: 13px;
  color: var(--color-error);
}

.login-desktop__footer {
  margin: 0;
  text-align: center;
  font-size: 13px;
  color: var(--color-text-secondary);
}
</style>

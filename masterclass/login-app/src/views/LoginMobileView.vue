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
  <div class="login-mobile">
    <form class="login-mobile__content" @submit.prevent="handleSubmit">
      <div class="login-mobile__header">
        <h1 class="login-mobile__title">Bienvenido de nuevo</h1>
        <p class="login-mobile__subtitle">Inicia sesión para continuar</p>
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

      <div class="login-mobile__options">
        <label class="login-mobile__remember">
          <input type="checkbox" v-model="form.rememberMe" />
          <span>Recuérdame</span>
        </label>
        <a class="login-mobile__link" href="#">¿Olvidaste tu contraseña?</a>
      </div>

      <p v-if="errorMessage" class="login-mobile__error">{{ errorMessage }}</p>

      <BaseButton type="submit" :disabled="isSubmitting">
        {{ isSubmitting ? 'Ingresando...' : 'Iniciar sesión' }}
      </BaseButton>

      <p class="login-mobile__footer">
        ¿No tienes cuenta?
        <a class="login-mobile__link" href="#">Regístrate</a>
      </p>
    </form>
  </div>
</template>

<style scoped>
.login-mobile {
  min-height: 100vh;
  background: #ffffff;
}

.login-mobile__content {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 48px 20px 32px;
}

.login-mobile__header {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.login-mobile__title {
  margin: 0;
  font-size: 22px;
  font-weight: 700;
  color: var(--color-text-primary);
}

.login-mobile__subtitle {
  margin: 0;
  font-size: 14px;
  color: var(--color-text-secondary);
}

.login-mobile__options {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.login-mobile__remember {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--color-text-secondary);
}

.login-mobile__link {
  font-size: 13px;
  font-weight: 600;
  color: var(--color-primary);
  text-decoration: none;
}

.login-mobile__link:hover {
  text-decoration: underline;
}

.login-mobile__error {
  margin: 0;
  text-align: center;
  font-size: 13px;
  color: var(--color-error);
}

.login-mobile__footer {
  margin: 0;
  text-align: center;
  font-size: 13px;
  color: var(--color-text-secondary);
}
</style>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { clearToken } from '../services/session.service'

const router = useRouter()

function handleLogout() {
  clearToken()
  router.push('/login')
}
</script>

<template>
  <div class="home">
    <p class="home__text">home</p>
    <a class="home__logout" href="#" @click.prevent="handleLogout">Cerrar sesión</a>
  </div>
</template>

<style scoped>
.home {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  background: var(--color-bg-page);
}

.home__text {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  color: var(--color-text-primary);
}

.home__logout {
  font-size: 13px;
  font-weight: 600;
  color: var(--color-primary);
  text-decoration: none;
}

.home__logout:hover {
  text-decoration: underline;
}
</style>

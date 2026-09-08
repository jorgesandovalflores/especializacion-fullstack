<script setup lang="ts"></script>

<template>
  <div class="home">
    <p class="home__text">home</p>
  </div>
</template>

<style scoped>
.home {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg-page);
}

.home__text {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  color: var(--color-text-primary);
}
</style>

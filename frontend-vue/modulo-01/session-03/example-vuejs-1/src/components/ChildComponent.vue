<script setup lang="ts">
// Definimos la prop 'message' y su tipo
defineProps<{ message: string }>();
</script>

<template>
  <div style="display: flex; justify-content: center; align-items: center; height: 100px; border: 1px solid #ddd; padding: 10px;">
    <p>{{ message }}</p>
  </div>
</template>
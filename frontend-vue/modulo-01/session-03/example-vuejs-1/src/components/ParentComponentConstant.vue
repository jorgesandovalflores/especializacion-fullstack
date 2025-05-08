<script setup lang="ts">
import ChildComponent from './ChildComponent.vue';

// Definimos una variable reactiva con el mensaje
const greeting = "¡Hola desde el padre!";
</script>

<template>
  <ChildComponent :message="greeting" />
</template>
<script setup lang="ts">
import ChildComponentComputed from './ChildComponentComputed.vue';

// Definimos una variable reactiva con el mensaje
const greeting = "jorge";
</script>

<template>
  <ChildComponentComputed :name="greeting" />
</template>
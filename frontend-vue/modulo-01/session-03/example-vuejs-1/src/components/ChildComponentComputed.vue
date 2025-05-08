<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{ name: string }>();
const uppercaseName = computed(() => props.name.toUpperCase());
</script>

<template>
  <p style="text-align: center;">Nombre en mayúsculas: {{ uppercaseName }}</p>
</template>
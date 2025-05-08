<script setup lang="ts">
import { ref } from "vue";

const message = ref("Hola, Vue con TypeScript!");
</script>

<template>
    <h1>{{ message }}</h1>
</template>

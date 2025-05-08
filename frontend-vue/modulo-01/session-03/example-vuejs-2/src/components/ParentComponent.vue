<script setup lang="ts">
import ChildComponent from './ChildComponent2.vue';
const greeting = "¡Hola desde el padre!";
</script>

<template>
    <ChildComponent :message="greeting" />
</template>
<script setup lang="ts">
    import { ref } from 'vue';
    const estado = ref('pendiente');
</script>

<template>
    <div class="container">
        <p v-if="estado === 'activo'">El usuario está activo</p>
        <p v-else-if="estado === 'pendiente'">El usuario está pendiente</p>
        <p v-else>El usuario está inactivo</p>
    </div>
</template>
  
<style scoped>
    .container {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        text-align: center;
        font-size: 1.2rem;
        font-weight: bold;
    }
</style>
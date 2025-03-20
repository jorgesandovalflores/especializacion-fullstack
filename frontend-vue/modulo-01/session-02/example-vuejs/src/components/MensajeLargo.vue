<script setup lang="ts">
import { ref, computed } from 'vue';
  
const mensaje = ref('');  
const mensajeLargo = computed(() => {
    return mensaje.value.length > 10 ? 'Mensaje muy largo' : 'Mensaje corto';
});
</script>

<template>
    <div class="container">
        <input v-model="mensaje" placeholder="Escribe algo" />
        <p>{{ mensajeLargo }}</p>
    </div>
</template>
  
<style scoped>
    .container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100vh;
        text-align: center;
    }
    input {
        padding: 8px;
        border: 1px solid #ccc;
        border-radius: 5px;
        width: 200px;
        text-align: center;
    }
    p {
        margin-top: 10px;
        font-weight: bold;
    }
</style>
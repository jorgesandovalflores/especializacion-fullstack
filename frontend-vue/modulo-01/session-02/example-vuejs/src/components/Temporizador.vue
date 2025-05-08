<script setup lang="ts">
import { ref, watch } from 'vue';
  
const tiempo = ref(0);  
const iniciar = () => {
    tiempo.value = 0;
    const interval = setInterval(() => {
        tiempo.value++;
        if (tiempo.value >= 10) clearInterval(interval);
    }, 1000);
};
  
watch(tiempo, (nuevoValor) => {
    if (nuevoValor === 5) {
        alert('¡Llegaste a 5 segundos!');
    }
});
</script>

<template>
    <div class="container">
        <p>Tiempo: {{ tiempo }} segundos</p>
        <button @click="iniciar">Iniciar</button>
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
    button {
        margin-top: 10px;
        padding: 10px;
        background-color: #28a745;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
    }
    button:hover {
        background-color: #218838;
    }
</style>
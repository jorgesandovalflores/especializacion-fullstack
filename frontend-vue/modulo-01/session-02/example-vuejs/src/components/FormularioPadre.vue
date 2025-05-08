<script setup lang="ts">
import { ref } from 'vue';
import FormularioHijo from './FormularioHijo.vue';
  
const datos = ref<{ nombre: string; timestamp: string | null }>({ nombre: '', timestamp: null });
const recibirDatos = (info: { nombre: string; timestamp: Date }) => {
    datos.value = { nombre: info.nombre, timestamp: info.timestamp.toLocaleString() };
};
</script>

<template>
    <div class="container">
        <h2>Nombre recibido: {{ datos.nombre || 'Ninguno' }}</h2>
        <h3>Hora: {{ datos.timestamp || '---' }}</h3>
        <FormularioHijo @datosEnviados="recibirDatos" />
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
    h2, h3 {
        margin-bottom: 10px;
    }
</style>
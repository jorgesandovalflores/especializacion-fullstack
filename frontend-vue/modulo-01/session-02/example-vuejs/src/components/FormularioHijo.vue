<script setup lang="ts">
import { ref, defineEmits } from 'vue';
  
const emit = defineEmits(['datosEnviados']);
const nombre = ref('');
  
const enviarDatos = () => {
    emit('datosEnviados', { nombre: nombre.value, timestamp: new Date() });
};
</script>

<template>
    <div class="container">
        <input v-model="nombre" placeholder="Ingresa tu nombre" />
        <button @click="enviarDatos">Enviar</button>
    </div>
</template>
  
<style scoped>
    .container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100vh;
    }
    input {
        padding: 8px;
        margin-bottom: 10px;
        border: 1px solid #ccc;
        border-radius: 5px;
        width: 200px;
        text-align: center;
    }
    button {
        padding: 10px;
        background-color: #ffc107;
        color: black;
        border: none;
        border-radius: 5px;
        cursor: pointer;
    }
    button:hover {
        background-color: #e0a800;
    }
</style>
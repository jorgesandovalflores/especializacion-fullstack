<script setup lang="ts">
import { defineEmits } from 'vue';
  
const emit = defineEmits(['mensajeEnviado']);  
const enviarMensaje = () => {
    emit('mensajeEnviado', '¡Hola desde el componente hijo!');
};
</script>

<template>
    <div class="container">
        <button @click="enviarMensaje">Enviar Mensaje</button>
    </div>
</template>
  
<style scoped>
    .container {
        display: flex;
        align-items: center;
        justify-content: center;
    }
    button {
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
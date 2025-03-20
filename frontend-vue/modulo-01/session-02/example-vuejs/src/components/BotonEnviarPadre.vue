<script setup lang="ts">
import { ref } from 'vue';
import BotonEnviarHijo from './BotonEnviarHijo.vue';
  
const mensaje = ref('Esperando mensaje...');  
const recibirMensaje = (msg: string) => {
    mensaje.value = msg;
};
</script>

<template>
    <div class="container">
        <h2>{{ mensaje }}</h2>
        <BotonEnviarHijo @mensajeEnviado="recibirMensaje" />
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
    h2 {
        margin-bottom: 10px;
    }
</style>
<script setup lang="ts">
import { ref } from 'vue';
  
const mensaje = ref('');
const texto = ref('');
  
const mostrarAlerta = () => {
    alert('¡Botón clickeado!');
};
  
const actualizarTexto = (event: Event) => {
    const input = event.target as HTMLInputElement;
    mensaje.value = `Texto ingresado: ${input.value}`;
};
  
const confirmarTexto = () => {
    alert(`Texto confirmado: ${texto.value}`);
};
  
const resaltar = (event: Event) => {
    (event.target as HTMLElement).style.color = 'red';
};
  
const restaurar = (event: Event) => {
    (event.target as HTMLElement).style.color = 'black';
};
</script>

<template>
    <div class="container">
        <button @click="mostrarAlerta">Haz clic aquí</button>
        <input @input="actualizarTexto" @keydown.enter="confirmarTexto" placeholder="Escribe algo" v-model="texto" />
        <p @mouseover="resaltar" @mouseout="restaurar">Pasa el mouse sobre este texto</p>
        <p>{{ mensaje }}</p>
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
    button {
        padding: 10px 20px;
        background-color: #007bff;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        margin-bottom: 10px;
    }
    button:hover {
        background-color: #0056b3;
    }
    input {
        padding: 8px;
        margin-bottom: 10px;
        border: 1px solid #ccc;
        border-radius: 5px;
        text-align: center;
    }
    p {
        font-size: 18px;
        cursor: pointer;
    }
</style>
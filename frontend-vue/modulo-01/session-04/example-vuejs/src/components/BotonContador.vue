<script setup lang="ts">
import { ref } from 'vue';
    
const count = ref(0);
const incrementar = () => {
    count.value++;
};
</script>

<template>
    <div class="container">
        <p style="color: black;">Has hecho clic {{ count }} veces</p>
        <button @click="incrementar">Incrementar</button>
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
        background-color: #007bff;
        color: black;
        border: none;
        border-radius: 5px;
        cursor: pointer;
    }
    button:hover {
        background-color: #0056b3;
    }
</style>
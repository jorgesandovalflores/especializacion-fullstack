<script setup lang="ts">
import { ref, watch } from 'vue';
    
const props = defineProps<{ default: number }>();
const count = ref(props.default);
const incrementar = () => {
    count.value++;
};

watch(() => props.default, (newVal) => {
    count.value = newVal;
});
</script>

<template>
    <div class="container">
        <p>Has hecho clic {{ count }} veces</p>
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
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
    }
    button:hover {
        background-color: #0056b3;
    }
</style>
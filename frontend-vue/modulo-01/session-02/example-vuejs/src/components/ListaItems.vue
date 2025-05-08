<script setup lang="ts">
import { ref } from 'vue';
  
const items = ref([
    { name: 'Manzana' },
    { name: 'Banana' },
    { name: 'Cereza' }
]);
</script>

<template>
    <div class="container">
        <ul>
            <li v-for="(item, index) in items" :key="index">
                {{ index }} - {{ item.name }}
            </li>
        </ul>
    </div>
</template>
  
<style scoped>
    .container {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        text-align: center;
    }
    ul {
        list-style: none;
        padding: 0;
    }
    li {
        padding: 8px;
        background: #f0f0f0;
        margin: 5px;
        border-radius: 5px;
    }
</style>
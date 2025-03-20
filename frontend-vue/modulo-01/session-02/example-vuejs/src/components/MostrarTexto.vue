<script setup lang="ts">
    import { ref } from 'vue';
    const visible = ref(false);
</script>

<template>
    <div class="container">
        <p v-show="visible">Este texto se oculta con CSS</p>
    </div>
</template>
  
<style scoped>
    .container {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        text-align: center;
        font-size: 1.2rem;
        font-weight: bold;
    }
</style>
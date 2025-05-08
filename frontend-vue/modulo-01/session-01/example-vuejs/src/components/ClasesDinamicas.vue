<script setup lang="ts">
import { ref } from "vue";

const isActive = ref(true);

const clickEvent = () => {
    isActive.value = !isActive.value
}
</script>

<template>
    <button :class="{ active: isActive, 'text-red': !isActive }" @click="clickEvent">
        Botón dinámico
    </button>
</template>

<style scoped>
.active {
    background-color: blue;
    color: white;
}

.text-red {
    color: red;
}
</style>
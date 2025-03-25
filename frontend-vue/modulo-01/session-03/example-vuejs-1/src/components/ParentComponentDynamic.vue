<script setup lang="ts">
import { ref } from 'vue';
import ChildComponent from './ChildComponent.vue';

const dynamicMessage = ref("Mensaje inicial");
</script>

<template>
    <div style="text-align: center;">
        <input v-model="dynamicMessage" placeholder="Escribe un mensaje" style="margin-bottom: 10px; padding: 5px; border: 1px solid #ccc; border-radius: 5px;"/>
        <ChildComponent :message="dynamicMessage" />
    </div>
</template>
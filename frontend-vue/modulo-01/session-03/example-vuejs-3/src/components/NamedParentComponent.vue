<script setup lang="ts">
import NamedSlotComponent from './NamedSlotComponent.vue';
</script>

<template>
    <NamedSlotComponent>
        <template #header>
            <h2>Encabezado personalizado</h2>
        </template>
        <template #footer>
            <p>Pie de página personalizado</p>
        </template>
    </NamedSlotComponent>
</template>
  
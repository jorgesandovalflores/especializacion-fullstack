<script setup lang="ts">
import ScopedSlotComponent from './ScopedSlotComponent.vue';
</script>

<template>
    <ScopedSlotComponent v-slot:default="slotProps">
        <p>{{ slotProps.data.message }}</p>
    </ScopedSlotComponent>
</template>
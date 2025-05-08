<script setup lang="ts">
defineProps<{ message?: string }>();
</script>

<template>
    <div style="text-align: center;">
        <p>{{ message || "Mensaje por defecto" }}</p>
    </div>
</template>
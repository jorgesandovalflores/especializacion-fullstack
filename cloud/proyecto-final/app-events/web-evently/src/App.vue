<script setup lang="ts">
import AppNavbar from "./components/AppNavbar.vue";
import Toasts from "./components/Toasts.vue";
</script>

<template>
    <div class="min-h-screen flex flex-col">
        <AppNavbar />
        <main class="flex-1 container mx-auto px-4 py-6">
            <router-view />
        </main>
        <Toasts />
    </div>
</template>

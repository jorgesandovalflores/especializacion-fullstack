<script setup lang="ts">
import { computed } from "vue";
import { RouterLink } from "vue-router";
import { useAuthStore } from "../stores/auth";

const auth = useAuthStore();
const isOrgOrAdmin = computed(() =>
    ["organizer", "admin"].includes(auth.role ?? ""),
);
const logout = () => auth.logout();
</script>

<template>
    <header class="bg-white/80 backdrop-blur-md shadow-soft sticky top-0 z-30">
        <nav
            class="container mx-auto px-4 py-3 flex items-center justify-between"
        >
            <RouterLink to="/" class="font-semibold text-lg"
                >Evently</RouterLink
            >
            <div class="flex items-center gap-3">
                <RouterLink to="/" class="text-sm hover:underline"
                    >Eventos</RouterLink
                >
                <RouterLink
                    v-if="isOrgOrAdmin"
                    to="/events/create"
                    class="text-sm hover:underline"
                    >Nuevo</RouterLink
                >

                <template v-if="auth.isAuthenticated">
                    <RouterLink
                        to="/me/subscriptions"
                        class="text-sm hover:underline"
                        >Mis inscripciones</RouterLink
                    >
                    <button
                        @click="logout"
                        class="px-3 py-1 rounded-xl bg-gray-900 text-white text-sm"
                    >
                        Salir
                    </button>
                </template>
                <template v-else>
                    <RouterLink to="/login" class="text-sm hover:underline"
                        >Entrar</RouterLink
                    >
                    <RouterLink to="/register" class="text-sm hover:underline"
                        >Registro</RouterLink
                    >
                </template>
            </div>
        </nav>
    </header>
</template>

<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-50">
        <div
            class="bg-white p-8 rounded-lg shadow-lg w-full max-w-xs flex flex-col gap-4"
        >
            <h2 class="text-2xl font-bold text-center text-gray-800 mb-2">
                Acceso
            </h2>
            <input
                v-model="email"
                type="email"
                placeholder="Correo"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
                v-model="password"
                type="password"
                placeholder="Contraseña"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div v-if="error" class="text-red-500 text-sm text-center">
                {{ error }}
            </div>
            <div class="flex justify-between gap-4">
                <button
                    @click="login"
                    class="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    Iniciar sesión
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useAuthStore } from "../stores/useAuthStore";

const email = ref("");
const password = ref("");
const error = ref("");
const store = useAuthStore();

const isValidEmail = (value: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
};

const isValidPassword = (value: string): boolean => {
    return value.length >= 6;
};

const login = async () => {
    if (!isValidEmail(email.value)) {
        error.value = "Correo inválido";
        return;
    }
    if (!isValidPassword(password.value)) {
        error.value = "La contraseña debe tener al menos 6 caracteres";
        return;
    }
    error.value = "";

    try {
        await store.login(email.value, password.value);
    } catch (err: any) {
        error.value = err.message;
    }
};
</script>

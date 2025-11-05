<script setup lang="ts">
import { reactive } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";

const auth = useAuthStore();
const router = useRouter();
const route = useRoute();
const form = reactive({ email: "", password: "" });

const submit = async () => {
    await auth.login(form);
    router.replace((route.query.redirect as string) || "/");
};
</script>

<template>
    <div class="max-w-md mx-auto bg-white rounded-2xl shadow-soft p-6">
        <h1 class="text-xl font-semibold mb-4">Iniciar sesión</h1>
        <form @submit.prevent="submit" class="space-y-3">
            <input
                v-model="form.email"
                type="email"
                required
                placeholder="Email"
                class="w-full rounded-xl border p-3"
            />
            <input
                v-model="form.password"
                type="password"
                required
                placeholder="Contraseña"
                class="w-full rounded-xl border p-3"
            />
            <button class="w-full px-4 py-3 rounded-xl bg-gray-900 text-white">
                Entrar
            </button>
        </form>
        <p class="text-sm mt-3">
            ¿No tienes cuenta?
            <router-link to="/register" class="underline"
                >Regístrate</router-link
            >
        </p>
    </div>
</template>

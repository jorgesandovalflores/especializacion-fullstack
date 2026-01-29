<template>
    <div class="center">
        <h1>Login</h1>
        <input v-model="email" type="email" placeholder="Correo" />
        <input v-model="password" type="password" placeholder="Contraseña" />
        <button @click="handleLogin">Entrar</button>
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useAuthStore } from "../stores/auth";

const email = ref("");
const password = ref("");
const auth = useAuthStore();

const handleLogin = () => {
    auth.login(email.value, password.value);
};
</script>

<style scoped>
.center {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    margin-top: 5rem;
}
input {
    padding: 0.5rem;
    width: 250px;
}
button {
    padding: 0.5rem 1rem;
    cursor: pointer;
}
</style>

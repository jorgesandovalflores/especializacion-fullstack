<template>
    <div class="container">
        <div class="card">
            <h2>Acceso</h2>
            <input
                v-model="email"
                type="email"
                placeholder="Correo"
                class="input"
            />
            <input
                v-model="password"
                type="password"
                placeholder="Contraseña"
                class="input"
            />
            <div v-if="error" class="error">{{ error }}</div>
            <div class="buttons">
                <button @click="register">Registrarse</button>
                <button @click="login">Iniciar sesión</button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { registerUser, loginUser } from "../services/auth";
import { useUserStore } from "../stores/user";

const email = ref("");
const password = ref("");
const error = ref("");
const router = useRouter();
const store = useUserStore();

const isValidEmail = (value: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
};

const isValidPassword = (value: string): boolean => {
    return value.length >= 6;
};

const register = async () => {
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
        const res = await registerUser(email.value, password.value);
        store.setUser(res.user);
        router.push("/chat");
    } catch (err: any) {
        error.value = err.message;
    }
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
        const res = await loginUser(email.value, password.value);
        store.setUser(res.user);
        router.push("/chat");
    } catch (err: any) {
        error.value = err.message;
    }
};
</script>

<style scoped>
.container {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background: #f2f2f2;
}
.card {
    background: white;
    padding: 2rem;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 320px;
    display: flex;
    flex-direction: column;
    gap: 1rem;
}
.input {
    padding: 0.5rem;
    font-size: 1rem;
    width: 100%;
    box-sizing: border-box;
}
.error {
    color: red;
    font-size: 0.9rem;
    text-align: center;
}
.buttons {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
}
button {
    padding: 0.5rem 1rem;
    cursor: pointer;
    flex: 1;
}
</style>

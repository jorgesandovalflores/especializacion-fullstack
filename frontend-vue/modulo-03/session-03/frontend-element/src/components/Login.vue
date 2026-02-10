<template>
    <div class="container">
        <div class="card">
            <h2>Acceso</h2>
            <input v-model="email" type="email" placeholder="Correo" class="input" />
            <input v-model="password" type="password" placeholder="Contraseña" class="input" />
            <div v-if="error" class="error">{{ error }}</div>
            <div class="buttons">
                <button @click="login">Iniciar sesión</button>
            </div>
        </div>
    </div>
  </template>
  
<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '../stores/useAuthStore'
  
const email = ref('')
const password = ref('')
const error = ref('')
const store = useAuthStore()
  
const isValidEmail = (value: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}
  
const isValidPassword = (value: string): boolean => {
    return value.length >= 6
}
  
const login = async () => {
    if (!isValidEmail(email.value)) {
        error.value = 'Correo inválido'
        return
    }
    if (!isValidPassword(password.value)) {
        error.value = 'La contraseña debe tener al menos 6 caracteres'
        return
    }
    error.value = ''
    
    try {
        await store.login(email.value, password.value)
    } catch (err: any) {
        error.value = err.message
    }
}
</script>
  
<style scoped>
    .container {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100vh;
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
<template>
    <div class="container">
        <div class="card">
            <h2>Chat en tiempo real</h2>
            <ul class="messages">
                <li v-for="msg in messages" :key="msg.id">
                    <strong>{{ msg.user }}</strong
                    >: {{ msg.text }}
                </li>
            </ul>
            <input
                v-model="text"
                @keyup.enter="sendMessage"
                placeholder="Escribe un mensaje"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { addMessage, listenMessages } from "../services/firestore";
import { useUserStore } from "../stores/user";

const store = useUserStore();
const text = ref("");
const messages = ref<any[]>([]);

onMounted(() => {
    listenMessages((data) => (messages.value = data));
});

const sendMessage = async () => {
    if (text.value.trim()) {
        await addMessage(text.value, store.user?.email);
        text.value = "";
    }
};
</script>

<style scoped>
.container {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background: #e9e9e9;
}
.card {
    background: white;
    padding: 2rem;
    border-radius: 10px;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
    width: 400px;
    display: flex;
    flex-direction: column;
    gap: 1rem;
}
.messages {
    list-style: none;
    padding: 0;
    max-height: 300px;
    overflow-y: auto;
}
input {
    padding: 0.5rem;
    font-size: 1rem;
}
</style>

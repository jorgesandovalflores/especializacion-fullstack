<script setup lang="ts">
import { ref, onMounted } from "vue";
import UserForm from "./UserForm.vue";
import UserDeletePopup from "./UserDeletePopup.vue";
import { useUserStore } from "../stores/useUserStore";
import type { ModelUser } from "../common/models/ModelUser";
import MapperUser from "../common/mappers/MapperUser";

const userStore = useUserStore();
const showForm = ref(false);
const showDelete = ref(false);
const selectedUser = ref<ModelUser>(MapperUser.toEmpty());

onMounted(() => {
    userStore.fetchUsers();
});

function openForm(user?: (typeof userStore.users)[0]) {
    selectedUser.value = user ? { ...user } : MapperUser.toEmpty();
    showForm.value = true;
}

function closeForm() {
    showForm.value = false;
    selectedUser.value = MapperUser.toEmpty();
}

async function saveUser(user: (typeof userStore.users)[0]) {
    try {
        await userStore.saveUser(user);
        closeForm();
    } catch {}
}

function openDelete(user: (typeof userStore.users)[0]) {
    selectedUser.value = user;
    showDelete.value = true;
}

function closeDelete() {
    showDelete.value = false;
    selectedUser.value = MapperUser.toEmpty();
}

async function confirmDelete() {
    try {
        await userStore.deleteUser(selectedUser.value!.id);
        closeDelete();
    } catch {}
}
</script>

<template>
    <div class="container">
        <h1>Usuarios</h1>

        <p v-if="userStore.error" class="error">
            {{ userStore.error.message }}
        </p>

        <div class="actions">
            <button @click="openForm()">Registrar Usuario</button>
        </div>

        <div class="user-list">
            <div
                v-for="user in userStore.users"
                :key="user.id"
                class="user-card"
            >
                <p><strong>Nombre:</strong> {{ user.name }}</p>
                <p><strong>Email:</strong> {{ user.email }}</p>
                <div class="card-actions">
                    <button @click="openForm(user)">Editar</button>
                    <button @click="openDelete(user)">Eliminar</button>
                </div>
            </div>
        </div>

        <UserForm
            v-if="showForm"
            :user="selectedUser"
            @close="closeForm"
            @save="saveUser"
        />
        <UserDeletePopup
            v-if="showDelete"
            :user="selectedUser"
            @close="closeDelete"
            @confirm="confirmDelete"
        />
    </div>
</template>

<style scoped>
.container {
    max-width: 800px;
    margin: 0 auto;
    text-align: center;
    padding: 1rem;
}

.actions {
    margin-bottom: 1rem;
}

.user-list {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
}

.user-card {
    border: 1px solid #ccc;
    padding: 1rem;
    border-radius: 8px;
    background-color: #f9f9f9;
}

.card-actions {
    margin-top: 1rem;
    display: flex;
    justify-content: space-around;
}

.error {
    color: red;
    margin-bottom: 1rem;
}
</style>

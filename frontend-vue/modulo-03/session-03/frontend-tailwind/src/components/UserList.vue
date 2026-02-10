<template>
    <div class="p-6 bg-gray-50 min-h-screen">
        <!-- Header with button -->
        <div class="flex justify-between items-center mb-6">
            <h1 class="text-2xl font-bold text-gray-800">
                Gestión de Usuarios
            </h1>
            <button
                @click="openCreateForm"
                class="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
            >
                <svg
                    class="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 4v16m8-8H4"
                    />
                </svg>
                Nuevo Usuario
            </button>
        </div>

        <!-- Loading state -->
        <div
            v-if="userStore.loading"
            class="flex justify-center items-center py-12"
        >
            <div
                class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"
            ></div>
        </div>

        <!-- Users table -->
        <div v-else class="bg-white shadow overflow-hidden sm:rounded-lg">
            <!-- Table header -->
            <div class="px-6 py-4 border-b border-gray-200">
                <h2 class="text-lg font-medium text-gray-900">
                    Lista de Usuarios
                </h2>
                <p class="mt-1 text-sm text-gray-500">
                    Total: {{ userStore.users.length }} usuario{{
                        userStore.users.length !== 1 ? "s" : ""
                    }}
                </p>
            </div>

            <!-- Table container -->
            <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th
                                scope="col"
                                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                                Nombre
                            </th>
                            <th
                                scope="col"
                                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                                Email
                            </th>
                            <th
                                scope="col"
                                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                                Rol
                            </th>
                            <th
                                scope="col"
                                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                                Acciones
                            </th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        <tr v-if="userStore.users.length === 0">
                            <td colspan="4" class="px-6 py-12 text-center">
                                <svg
                                    class="mx-auto h-12 w-12 text-gray-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5 5.197a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                                    />
                                </svg>
                                <h3
                                    class="mt-2 text-sm font-medium text-gray-900"
                                >
                                    No hay usuarios
                                </h3>
                                <p class="mt-1 text-sm text-gray-500">
                                    Comienza creando un nuevo usuario.
                                </p>
                            </td>
                        </tr>

                        <tr
                            v-for="user in userStore.users"
                            :key="user.id"
                            class="hover:bg-gray-50 transition-colors"
                        >
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="flex items-center">
                                    <div class="flex-shrink-0 h-10 w-10">
                                        <div
                                            class="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center"
                                        >
                                            <span
                                                class="text-blue-600 font-medium"
                                            >
                                                {{
                                                    user.name
                                                        .charAt(0)
                                                        .toUpperCase()
                                                }}
                                            </span>
                                        </div>
                                    </div>
                                    <div class="ml-4">
                                        <div
                                            class="text-sm font-medium text-gray-900"
                                        >
                                            {{ user.name }}
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="text-sm text-gray-900">
                                    {{ user.email }}
                                </div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span
                                    :class="{
                                        'bg-purple-100 text-purple-800':
                                            user.role === 'admin',
                                        'bg-green-100 text-green-800':
                                            user.role === 'user',
                                    }"
                                    class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                                >
                                    {{
                                        user.role === "admin"
                                            ? "Administrador"
                                            : "Usuario"
                                    }}
                                </span>
                            </td>
                            <td
                                class="px-6 py-4 whitespace-nowrap text-sm font-medium"
                            >
                                <div class="flex space-x-3">
                                    <button
                                        @click="openEditForm(user)"
                                        class="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
                                    >
                                        <svg
                                            class="w-4 h-4 mr-1"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                stroke-width="2"
                                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                            />
                                        </svg>
                                        Editar
                                    </button>
                                    <button
                                        @click="openDeletePopup(user.id)"
                                        class="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-150 ease-in-out"
                                    >
                                        <svg
                                            class="w-4 h-4 mr-1"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                stroke-width="2"
                                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                            />
                                        </svg>
                                        Eliminar
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Pagination (optional, if needed) -->
            <div
                v-if="userStore.users.length > 0"
                class="bg-white px-6 py-4 border-t border-gray-200"
            >
                <div class="flex items-center justify-between">
                    <div class="text-sm text-gray-500">
                        Mostrando
                        <span class="font-medium">{{
                            userStore.users.length
                        }}</span>
                        resultados
                    </div>
                    <!-- Add pagination buttons here if needed -->
                </div>
            </div>
        </div>

        <!-- Modals -->
        <UserForm
            v-if="showForm"
            v-model="showForm"
            :user="selectedUser"
            @saved="refreshUsers"
        />
        <UserDeletePopup
            v-if="showDelete"
            v-model:visible="showDelete"
            @confirm="deleteUser"
        />
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { useUserStore } from "../stores/useUserStore";
import type { ModelUser } from "../common/models/ModelUser";
import UserForm from "./UserForm.vue";
import UserDeletePopup from "./UserDeletePopup.vue";

const userStore = useUserStore();
const showForm = ref(false);
const showDelete = ref(false);
const selectedUser = ref<ModelUser | null>(null);
const idToDelete = ref<string>("");

onMounted(() => {
    refreshUsers();
});

function refreshUsers() {
    userStore.fetchUsers();
}

function openCreateForm() {
    selectedUser.value = null;
    showForm.value = true;
}

function openEditForm(user: ModelUser) {
    selectedUser.value = user;
    showForm.value = true;
}

function openDeletePopup(id: string) {
    idToDelete.value = id;
    showDelete.value = true;
}

async function deleteUser() {
    if (idToDelete.value) {
        await userStore.remove(idToDelete.value);
        idToDelete.value = "";
        showDelete.value = false;
        refreshUsers();
    }
}
</script>

<style scoped>
/* Custom scrollbar for table */
::-webkit-scrollbar {
    height: 8px;
    width: 8px;
}

::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
}

::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
}

/* Smooth transitions */
table {
    transition: all 0.3s ease;
}

/* Responsive adjustments */
@media (max-width: 640px) {
    .flex.justify-between {
        flex-direction: column;
        align-items: flex-start;
    }

    .flex.justify-between button {
        margin-top: 1rem;
        width: 100%;
        justify-content: center;
    }
}
</style>

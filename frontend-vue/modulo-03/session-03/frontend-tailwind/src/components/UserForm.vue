<template>
    <transition name="modal">
        <!-- Modal Overlay -->
        <div
            v-if="localVisible"
            class="fixed inset-0 z-50 overflow-y-auto"
            aria-labelledby="modal-title"
            role="dialog"
            aria-modal="true"
        >
            <div
                class="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0"
            >
                <!-- Background Overlay -->
                <div
                    class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                    @click="handleClose"
                    aria-hidden="true"
                ></div>

                <!-- Center modal trick -->
                <span
                    class="hidden sm:inline-block sm:h-screen sm:align-middle"
                    aria-hidden="true"
                    >&#8203;</span
                >

                <!-- Modal Container -->
                <div
                    class="relative inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle"
                >
                    <!-- Modal Header -->
                    <div class="bg-white px-6 py-4 border-b border-gray-200">
                        <h3
                            class="text-lg font-semibold leading-6 text-gray-900"
                            id="modal-title"
                        >
                            {{ formTitle }}
                        </h3>
                    </div>

                    <!-- Modal Body -->
                    <div class="bg-white px-6 py-5">
                        <form @submit.prevent="submitForm" class="space-y-6">
                            <!-- Name Field -->
                            <div>
                                <label
                                    for="name"
                                    class="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Nombre
                                </label>
                                <input
                                    id="name"
                                    v-model="name"
                                    type="text"
                                    class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out"
                                    :class="{
                                        'border-red-300 focus:ring-red-500 focus:border-red-500':
                                            errors.name,
                                    }"
                                    placeholder="Ingrese el nombre"
                                />
                                <p
                                    v-if="errors.name"
                                    class="mt-1 text-sm text-red-600"
                                >
                                    {{ errors.name }}
                                </p>
                            </div>

                            <!-- Email Field -->
                            <div>
                                <label
                                    for="email"
                                    class="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Email
                                </label>
                                <input
                                    id="email"
                                    v-model="email"
                                    type="email"
                                    class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out"
                                    :class="{
                                        'border-red-300 focus:ring-red-500 focus:border-red-500':
                                            errors.email,
                                    }"
                                    placeholder="ejemplo@correo.com"
                                />
                                <p
                                    v-if="errors.email"
                                    class="mt-1 text-sm text-red-600"
                                >
                                    {{ errors.email }}
                                </p>
                            </div>

                            <!-- Password Field -->
                            <div>
                                <label
                                    for="password"
                                    class="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Contraseña
                                </label>
                                <div class="relative">
                                    <input
                                        id="password"
                                        v-model="password"
                                        :type="
                                            showPassword ? 'text' : 'password'
                                        "
                                        class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm pr-10 transition duration-150 ease-in-out"
                                        :class="{
                                            'border-red-300 focus:ring-red-500 focus:border-red-500':
                                                errors.password,
                                        }"
                                        placeholder="Mínimo 6 caracteres"
                                    />
                                    <button
                                        type="button"
                                        @click="showPassword = !showPassword"
                                        class="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    >
                                        <svg
                                            v-if="showPassword"
                                            class="h-5 w-5 text-gray-400"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                stroke-width="2"
                                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                            />
                                            <path
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                stroke-width="2"
                                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                            />
                                        </svg>
                                        <svg
                                            v-else
                                            class="h-5 w-5 text-gray-400"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                stroke-width="2"
                                                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.59 6.59m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                                            />
                                        </svg>
                                    </button>
                                </div>
                                <p
                                    v-if="errors.password"
                                    class="mt-1 text-sm text-red-600"
                                >
                                    {{ errors.password }}
                                </p>
                            </div>

                            <!-- Role Field -->
                            <div>
                                <label
                                    for="role"
                                    class="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Rol
                                </label>
                                <select
                                    id="role"
                                    v-model="role"
                                    class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out"
                                    :class="{
                                        'border-red-300 focus:ring-red-500 focus:border-red-500':
                                            errors.role,
                                    }"
                                >
                                    <option value="" disabled selected>
                                        Selecciona un rol
                                    </option>
                                    <option value="admin">Admin</option>
                                    <option value="user">User</option>
                                </select>
                                <p
                                    v-if="errors.role"
                                    class="mt-1 text-sm text-red-600"
                                >
                                    {{ errors.role }}
                                </p>
                            </div>

                            <!-- Submit Button -->
                            <div class="pt-2">
                                <button
                                    type="submit"
                                    :disabled="loading"
                                    class="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out"
                                >
                                    <svg
                                        v-if="loading"
                                        class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            class="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            stroke-width="4"
                                        ></circle>
                                        <path
                                            class="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        ></path>
                                    </svg>
                                    {{ user ? "Actualizar" : "Crear" }}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from "vue";
import { useUserStore } from "../stores/useUserStore";
import type { ModelUser } from "../common/models/ModelUser";

// Define props
const props = defineProps<{
    modelValue: boolean;
    user?: ModelUser | null;
}>();

// Define emits
const emit = defineEmits(["update:modelValue", "saved"]);

// Local copy of visible
const localVisible = ref(props.modelValue);

// Form fields
const userStore = useUserStore();
const name = ref("");
const email = ref("");
const password = ref("");
const role = ref("");
const loading = ref(false);
const errors = ref<Record<string, string>>({});
const showPassword = ref(false);

// Computed
const formTitle = computed(() =>
    props.user ? "Editar Usuario" : "Nuevo Usuario",
);

// Watch for parent changes
watch(
    () => props.modelValue,
    (val) => {
        localVisible.value = val;
        if (val) {
            // Reset errors when modal opens
            errors.value = {};
        }
    },
);

// Watch for local changes and emit to parent
watch(localVisible, (val) => {
    emit("update:modelValue", val);
});

// Watch for user changes to populate form
watch(
    () => props.user,
    (u) => {
        if (u) {
            name.value = u.name || "";
            email.value = u.email || "";
            password.value = ""; // Don't show existing password for security
            role.value = u.role || "";
        } else {
            resetForm();
        }
    },
    { immediate: true },
);

// Reset form function
function resetForm() {
    name.value = "";
    email.value = "";
    password.value = "";
    role.value = "";
    errors.value = {};
}

// Validation
function validateForm() {
    errors.value = {};

    if (!name.value.trim()) {
        errors.value.name = "Nombre obligatorio";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.value.trim()) {
        errors.value.email = "Email obligatorio";
    } else if (!emailRegex.test(email.value)) {
        errors.value.email = "Email válido obligatorio";
    }

    // Only validate password for new users or when password is provided
    if (!props.user || password.value) {
        if (!password.value) {
            errors.value.password = "Contraseña obligatoria";
        } else if (password.value.length < 6) {
            errors.value.password = "Mínimo 6 caracteres";
        }
    }

    if (!role.value) {
        errors.value.role = "Rol obligatorio";
    }

    return Object.keys(errors.value).length === 0;
}

// Form submission
async function submitForm() {
    if (!validateForm()) return;

    loading.value = true;
    try {
        const userData = {
            name: name.value,
            email: email.value,
            role: role.value,
            ...(password.value && { password: password.value }),
        };

        if (props.user) {
            await userStore.update(props.user.id, userData);
        } else {
            await userStore.create(userData);
        }

        emit("saved");
        localVisible.value = false;
        resetForm();
    } catch (error: any) {
        // Handle API errors
        if (error.response?.data?.errors) {
            errors.value = error.response.data.errors;
        } else {
            errors.value.general =
                error.message || "Error al guardar el usuario";
        }
    } finally {
        loading.value = false;
    }
}

// Handle modal close
function handleClose() {
    localVisible.value = false;
    resetForm();
}

// Handle escape key
function handleEscapeKey(event: KeyboardEvent) {
    if (event.key === "Escape" && localVisible.value) {
        handleClose();
    }
}

// Add event listeners
import { onMounted, onUnmounted } from "vue";

onMounted(() => {
    document.addEventListener("keydown", handleEscapeKey);
});

onUnmounted(() => {
    document.removeEventListener("keydown", handleEscapeKey);
});

// Prevent body scroll when modal is open
watch(localVisible, (isVisible) => {
    if (isVisible) {
        document.body.style.overflow = "hidden";
    } else {
        document.body.style.overflow = "";
    }
});
</script>

<style scoped>
/* Modal transitions */
.modal-enter-active,
.modal-leave-active {
    transition: opacity 0.25s ease;
}

.modal-enter-from,
.modal-leave-to {
    opacity: 0;
}

.modal-enter-active .bg-gray-500,
.modal-leave-active .bg-gray-500 {
    transition: opacity 0.25s ease;
}

.modal-enter-active .transform,
.modal-leave-active .transform {
    transition: all 0.25s ease;
}

.modal-enter-from .transform {
    opacity: 0;
    transform: scale(0.95) translateY(-10px);
}

.modal-leave-to .transform {
    opacity: 0;
    transform: scale(0.95) translateY(-10px);
}
</style>

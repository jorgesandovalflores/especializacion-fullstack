<template>
    <transition name="modal">
        <!-- Fondo oscuro -->
        <div
            v-if="props.visible"
            class="fixed inset-0 z-50 overflow-y-auto"
            aria-labelledby="modal-title"
            role="dialog"
            aria-modal="true"
        >
            <!-- Fondo transparente con overlay -->
            <div
                class="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0"
            >
                <!-- Fondo con overlay -->
                <div
                    class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                    @click="handleClose"
                    aria-hidden="true"
                ></div>

                <!-- Truco para centrar en pantallas pequeñas -->
                <span
                    class="hidden sm:inline-block sm:h-screen sm:align-middle"
                    aria-hidden="true"
                    >&#8203;</span
                >

                <!-- Modal -->
                <div
                    class="relative inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-md sm:align-middle"
                >
                    <!-- Encabezado -->
                    <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div class="sm:flex sm:items-start">
                            <!-- Icono de advertencia (opcional) -->
                            <div
                                class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10"
                            >
                                <svg
                                    class="h-6 w-6 text-red-600"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke-width="1.5"
                                    stroke="currentColor"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                                    />
                                </svg>
                            </div>

                            <!-- Contenido -->
                            <div
                                class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left"
                            >
                                <h3
                                    class="text-lg font-medium leading-6 text-gray-900"
                                    id="modal-title"
                                >
                                    Confirmar Eliminación
                                </h3>
                                <div class="mt-2">
                                    <p class="text-sm text-gray-500">
                                        ¿Seguro que quieres eliminar este
                                        usuario? Esta acción no se puede
                                        deshacer.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Botones -->
                    <div
                        class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6"
                    >
                        <button
                            type="button"
                            @click="confirmDelete"
                            class="inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                        >
                            Eliminar
                        </button>
                        <button
                            type="button"
                            @click="handleClose"
                            class="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script lang="ts" setup>
import { watch, onMounted, onUnmounted } from "vue";

const props = defineProps<{
    visible: boolean;
}>();

const emit = defineEmits(["update:visible", "confirm"]);

function confirmDelete() {
    emit("confirm");
    emit("update:visible", false);
}

function handleClose() {
    emit("update:visible", false);
}

// Función para manejar tecla Escape
function handleEscapeKey(event: KeyboardEvent) {
    if (event.key === "Escape" && props.visible) {
        handleClose();
    }
}

// Agregar event listener para tecla Escape
onMounted(() => {
    document.addEventListener("keydown", handleEscapeKey);
});

onUnmounted(() => {
    document.removeEventListener("keydown", handleEscapeKey);
});

// También agregamos listener cuando el modal se muestra
watch(
    () => props.visible,
    (isVisible) => {
        if (isVisible) {
            // Prevenir scroll del body
            document.body.style.overflow = "hidden";
        } else {
            // Restaurar scroll
            document.body.style.overflow = "";
        }
    },
);
</script>

<style scoped>
/* Transiciones para el modal */
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

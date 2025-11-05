<script setup lang="ts">
import dayjs from "dayjs";
import { onMounted, ref, computed } from "vue";
import { useRouter } from "vue-router";
import { apiEvents } from "../api/events";
import { apiSubs } from "../api/subscriptions";
import { useAuthStore } from "../stores/auth";
import BaseModal from "../components/BaseModal.vue";
import type { Event } from "../types/models";

const props = defineProps<{ id: string }>();
const router = useRouter();
const auth = useAuthStore();

const event = ref<Event | null>(null);
const dateFmt = computed(() =>
    event.value ? dayjs(event.value.date).format("DD/MM/YYYY HH:mm") : "",
);

const canEdit = computed(
    () => auth.isAuthenticated && ["organizer", "admin"].includes(auth.role!),
);
const canSubscribe = computed(
    () => auth.isAuthenticated && event.value?.status === "ACTIVE",
);

onMounted(async () => {
    event.value = await apiEvents.get(props.id);
});

const goEdit = () =>
    router.push({ name: "event-edit", params: { id: event.value!.id } });

const cancel = async () => {
    if (!event.value) return;
    await apiEvents.cancel(event.value.id);
    event.value = await apiEvents.get(event.value.id);
};

// --- Modal state ---
const showModal = ref(false);
const modalMessage = ref("");

const subscribe = async () => {
    if (!event.value) return;
    await apiSubs.subscribe(event.value.id);
    modalMessage.value = "¡Te inscribiste correctamente al evento!";
    showModal.value = true;
};
</script>

<template>
    <div v-if="event" class="space-y-4">
        <div class="flex items-start justify-between gap-3">
            <h1 class="text-2xl font-bold">{{ event.title }}</h1>
            <span
                class="text-xs px-2 py-0.5 rounded-full"
                :class="
                    event.status === 'ACTIVE'
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-rose-50 text-rose-700'
                "
            >
                {{ event.status }}
            </span>
        </div>
        <p class="text-gray-600">{{ event.description }}</p>
        <p>📍 {{ event.location }}</p>
        <p>🗓️ {{ dateFmt }}</p>

        <div class="flex gap-2">
            <button
                v-if="canEdit"
                @click="goEdit"
                class="px-4 py-2 rounded-xl bg-gray-900 text-white text-sm"
            >
                Editar
            </button>
            <button
                v-if="canEdit"
                @click="cancel"
                class="px-4 py-2 rounded-xl bg-rose-600 text-white text-sm"
            >
                Cancelar
            </button>
            <button
                v-if="canSubscribe"
                @click="subscribe"
                class="px-4 py-2 rounded-xl bg-emerald-600 text-white text-sm"
            >
                Inscribirme
            </button>
        </div>
    </div>

    <!-- Modal de confirmación -->
    <BaseModal v-model="showModal">
        <template #title> Inscripción exitosa </template>
        <p class="text-gray-700">{{ modalMessage }}</p>
        <template #footer>
            <button
                @click="showModal = false"
                class="px-4 py-2 bg-emerald-600 text-white rounded-xl"
            >
                Cerrar
            </button>
        </template>
    </BaseModal>
</template>

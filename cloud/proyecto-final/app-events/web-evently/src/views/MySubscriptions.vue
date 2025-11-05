<script setup lang="ts">
import { onMounted, ref } from "vue";
import type { Subscription } from "../types/models";
import { apiSubs } from "../api/subscriptions";
import EventCard from "../components/EventCard.vue";

const subs = ref<Subscription[]>([]);
onMounted(async () => {
    subs.value = await apiSubs.my();
});
</script>

<template>
    <div class="space-y-4">
        <h1 class="text-2xl font-bold">Mis inscripciones</h1>
        <div
            v-if="subs.length"
            class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
            <EventCard v-for="s in subs" :key="s.id" :event="s.event" />
        </div>
        <p v-else class="text-gray-500">
            Aún no te has inscrito a ningún evento.
        </p>
    </div>
</template>

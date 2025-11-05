<script setup lang="ts">
import EventCard from "../components/EventCard.vue";

import { onMounted, ref } from "vue";
import { apiEvents } from "../api/events";
import type { Event } from "../types/models";

const events = ref<Event[]>([]);
onMounted(async () => {
    events.value = await apiEvents.list();
});
</script>

<template>
    <div class="space-y-4">
        <h1 class="text-2xl font-bold">Eventos</h1>
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <EventCard v-for="e in events" :key="e.id" :event="e" />
        </div>
    </div>
</template>

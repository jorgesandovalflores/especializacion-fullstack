<script setup lang="ts">
import dayjs from "dayjs";
import type { Event } from "../types/models";
const props = defineProps<{ event: Event }>();
const dateFmt = dayjs(props.event.date).format("DD/MM/YYYY HH:mm");
</script>

<template>
    <article class="rounded-2xl bg-white shadow-soft p-4 flex flex-col gap-2">
        <header class="flex items-center justify-between">
            <h3 class="font-semibold text-lg truncate">{{ event.title }}</h3>
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
        </header>
        <p class="text-sm text-gray-600 line-clamp-3">
            {{ event.description }}
        </p>
        <p class="text-sm">📍 {{ event.location }}</p>
        <p class="text-sm">🗓️ {{ dateFmt }}</p>
        <footer class="mt-2">
            <router-link
                :to="{ name: 'event-detail', params: { id: event.id } }"
                class="px-3 py-1 rounded-xl bg-gray-900 text-white text-sm"
                >Ver</router-link
            >
            <slot name="actions" />
        </footer>
    </article>
</template>

<script setup lang="ts">
import { useToastsStore } from "../stores/toasts";

const toasts = useToastsStore();
const color = (type?: string) =>
    type === "success"
        ? "text-emerald-600"
        : type === "warn"
        ? "text-amber-600"
        : type === "error"
        ? "text-rose-600"
        : "text-sky-600";
</script>

<template>
    <div
        class="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 space-y-2 w-[92%] max-w-md"
    >
        <div
            v-for="t in toasts.list"
            :key="t.id"
            class="bg-white/80 backdrop-blur-md shadow-soft rounded-xl px-4 py-3 border flex items-start gap-3"
        >
            <span class="text-sm" :class="color(t.type)">●</span>
            <p class="text-sm flex-1">{{ t.text }}</p>
            <button
                class="text-xs text-gray-500 hover:text-gray-800"
                @click="toasts.remove(t.id)"
            >
                Cerrar
            </button>
        </div>
    </div>
</template>

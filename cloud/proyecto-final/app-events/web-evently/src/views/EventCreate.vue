<script setup lang="ts">
import { reactive } from "vue";
import { useRouter } from "vue-router";
import { apiEvents } from "../api/events";
const router = useRouter();
const form = reactive({ title: "", description: "", location: "", date: "" });
const submit = async () => {
    const iso = new Date(form.date).toISOString();
    const ev = await apiEvents.create({ ...form, date: iso });
    router.replace({ name: "event-detail", params: { id: ev.id } });
};
</script>

<template>
    <div class="max-w-2xl mx-auto bg-white rounded-2xl shadow-soft p-6">
        <h1 class="text-xl font-semibold mb-4">Nuevo evento</h1>
        <form @submit.prevent="submit" class="grid gap-3">
            <input
                v-model="form.title"
                class="rounded-xl border p-3"
                placeholder="Título"
                required
            />
            <textarea
                v-model="form.description"
                class="rounded-xl border p-3"
                rows="4"
                placeholder="Descripción"
            ></textarea>
            <input
                v-model="form.location"
                class="rounded-xl border p-3"
                placeholder="Ubicación"
                required
            />
            <input
                v-model="form.date"
                type="datetime-local"
                class="rounded-xl border p-3"
                required
            />
            <div class="flex justify-end">
                <button class="px-4 py-2 rounded-xl bg-gray-900 text-white">
                    Crear
                </button>
            </div>
        </form>
    </div>
</template>

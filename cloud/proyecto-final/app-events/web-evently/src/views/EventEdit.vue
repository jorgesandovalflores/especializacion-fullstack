<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { apiEvents } from "../api/events";
const route = useRoute();
const router = useRouter();
const loaded = ref(false);
const form = reactive({ title: "", description: "", location: "", date: "" });

onMounted(async () => {
    const ev = await apiEvents.get(route.params.id as string);
    form.title = ev.title;
    form.description = ev.description || "";
    form.location = ev.location;
    const dt = new Date(ev.date);
    form.date = new Date(dt.getTime() - dt.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16);
    loaded.value = true;
});

const submit = async () => {
    const iso = new Date(form.date).toISOString();
    await apiEvents.update(route.params.id as string, { ...form, date: iso });
    router.replace({ name: "event-detail", params: { id: route.params.id } });
};
const back = () => router.back();
</script>

<template>
    <div
        class="max-w-2xl mx-auto bg-white rounded-2xl shadow-soft p-6"
        v-if="loaded"
    >
        <h1 class="text-xl font-semibold mb-4">Editar evento</h1>
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
            <div class="flex justify-end gap-2">
                <button
                    type="button"
                    class="px-4 py-2 rounded-xl bg-gray-100"
                    @click="back"
                >
                    Cancelar
                </button>
                <button class="px-4 py-2 rounded-xl bg-gray-900 text-white">
                    Guardar
                </button>
            </div>
        </form>
    </div>
</template>

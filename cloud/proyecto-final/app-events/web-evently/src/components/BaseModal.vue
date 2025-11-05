<template>
    <div
        v-if="modelValue"
        class="fixed inset-0 flex items-center justify-center bg-white/40 backdrop-blur-sm z-50"
    >
        <div class="bg-white rounded-2xl shadow-xl p-6 w-11/12 max-w-md">
            <h2 class="text-lg font-bold mb-4">
                <slot name="title" />
            </h2>
            <div class="mb-4">
                <slot />
            </div>
            <div class="flex justify-end gap-2">
                <slot name="footer" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps<{ modelValue: boolean }>();
const emit = defineEmits(["update:modelValue"]);
</script>

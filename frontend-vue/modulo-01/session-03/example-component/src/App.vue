<script lang="ts" setup>
import { ref } from "vue";
import Button from "./components/Button.vue";

const loadingPrimary = ref(false);
const loadingSecondary = ref(false);

const onPrimaryClick = async () => {
    loadingPrimary.value = true;
    setTimeout(() => {
        loadingPrimary.value = false;
    }, 1000);
};

const onSecondaryClick = async () => {
    loadingSecondary.value = true;
    setTimeout(() => {
        loadingSecondary.value = false;
    }, 1000);
};
</script>

<template>
    <div
        class="w-full min-h-screen flex justify-center items-start bg-white p-6"
    >
        <div class="w-full max-w-md flex flex-col gap-6">
            <h1 class="text-2xl font-bold">Buttons</h1>

            <!-- Primary -->
            <div class="flex flex-col gap-3">
                <span class="text-sm font-medium">Primary · Enabled</span>
                <Button
                    variant="primary"
                    label="Button label"
                    @click="onPrimaryClick"
                />

                <span class="text-sm font-medium">Primary · Disabled</span>
                <Button
                    variant="primary"
                    label="Button label"
                    :disabled="true"
                />
            </div>

            <!-- Secondary -->
            <div class="flex flex-col gap-3">
                <span class="text-sm font-medium">Secondary · Enabled</span>
                <Button
                    variant="secondary"
                    label="Button label"
                    @click="onSecondaryClick"
                />

                <span class="text-sm font-medium">Secondary · Disabled</span>
                <Button
                    variant="secondary"
                    label="Button label"
                    :disabled="true"
                />
            </div>
        </div>
    </div>
</template>

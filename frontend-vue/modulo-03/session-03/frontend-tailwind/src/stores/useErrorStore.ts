import { defineStore } from "pinia";
import { ref } from "vue";

export const useErrorStore = defineStore("error", () => {
    const message = ref<string | null>(null);

    function setError(newMessage: string) {
        message.value = newMessage;
    }

    function clearError() {
        message.value = null;
    }

    return { message, setError, clearError };
});

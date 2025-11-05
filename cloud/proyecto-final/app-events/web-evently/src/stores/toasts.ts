import { defineStore } from "pinia";
import { ref } from "vue";

export type ToastKind = "info" | "success" | "warn" | "error";
export type Toast = {
    id: string;
    text: string;
    type?: ToastKind;
    timeout?: number;
};

export const useToastsStore = defineStore("toasts", () => {
    const list = ref<Toast[]>([]);

    function push(t: Omit<Toast, "id">) {
        const id = crypto.randomUUID();
        const toast: Toast = { id, timeout: 4000, type: "info", ...t };
        list.value.push(toast);
        setTimeout(() => remove(id), toast.timeout);
    }
    function remove(id: string) {
        list.value = list.value.filter((t) => t.id !== id);
    }

    document.addEventListener("toast", (e: Event) => {
        const d = (e as CustomEvent).detail as {
            text: string;
            type?: ToastKind;
        };
        push({ text: d.text, type: d.type });
    });

    return { list, push, remove };
});

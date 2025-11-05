import axios, { AxiosError } from "axios";
import { useAuthStore } from "../stores/auth";

const baseURL = import.meta.env.VITE_API_BASE_URL || "/api";
export const http = axios.create({ baseURL });

function tryGetAuthStore() {
    try {
        return useAuthStore();
    } catch {
        return null;
    }
}

http.interceptors.request.use((config) => {
    const store = tryGetAuthStore();
    const token =
        store?.accessToken ??
        JSON.parse(localStorage.getItem("auth") || "null")?.accessToken;
    if (token) {
        config.headers = config.headers || {};
        (config.headers as any).Authorization = `Bearer ${token}`;
    }
    return config;
});

let refreshing = false;
let queue: Array<() => void> = [];

http.interceptors.response.use(
    (r) => r,
    async (error: AxiosError) => {
        const original = error.config!;
        if (error.response?.status === 401 && !(original as any)._retry) {
            const store = tryGetAuthStore();
            if (!store?.refreshToken) {
                store?.logout();
                return Promise.reject(error);
            }
            if (refreshing) {
                await new Promise<void>((resolve) => queue.push(resolve));
            } else {
                refreshing = true;
                try {
                    await store.refreshTokens();
                } catch (_) {
                    await store.logout();
                    return Promise.reject(error);
                } finally {
                    refreshing = false;
                    queue.forEach((fn) => fn());
                    queue = [];
                }
            }
            (original as any)._retry = true;
            const token = store.accessToken;
            original.headers = original.headers || {};
            (original.headers as any).Authorization = `Bearer ${token}`;
            return http(original);
        }

        try {
            const { useToastsStore } = await import("../stores/toasts");
            const toasts = useToastsStore();
            const status = error.response?.status;
            const data = error.response?.data as any;
            const message =
                (Array.isArray(data?.message)
                    ? data.message.join(", ")
                    : data?.message) ||
                data?.error ||
                error.message ||
                "Ocurrió un error";

            toasts.push({
                type: status && status >= 500 ? "error" : "warn",
                text: `${status ?? ""} ${message}`.trim(),
            });
        } catch {}

        return Promise.reject(error);
    },
);

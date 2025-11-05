import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { io, Socket } from "socket.io-client";
import type { User } from "../types/models";
import { apiAuth } from "../api/auth";

export const useAuthStore = defineStore("auth", () => {
    const user = ref<User | null>(null);
    const accessToken = ref<string | null>(null);
    const refreshToken = ref<string | null>(null);
    const socket = ref<Socket | null>(null);

    const isAuthenticated = computed(() => !!user.value && !!accessToken.value);
    const role = computed(() => user.value?.role ?? null);

    function _persist() {
        localStorage.setItem(
            "auth",
            JSON.stringify({
                user: user.value,
                accessToken: accessToken.value,
                refreshToken: refreshToken.value,
            }),
        );
    }

    function loadFromStorage() {
        const raw = localStorage.getItem("auth");
        if (!raw) return;
        const parsed = JSON.parse(raw);
        user.value = parsed.user;
        accessToken.value = parsed.accessToken;
        refreshToken.value = parsed.refreshToken;
        _connectSocket();
    }

    async function register(data: {
        name: string;
        email: string;
        password: string;
    }) {
        const res = await apiAuth.register(data);
        user.value = res.user;
        accessToken.value = res.access_token;
        refreshToken.value = res.refresh_token;
        _persist();
        _connectSocket();
    }

    async function login(data: { email: string; password: string }) {
        const res = await apiAuth.login(data);
        user.value = res.user;
        accessToken.value = res.access_token;
        refreshToken.value = res.refresh_token;
        _persist();
        _connectSocket();
    }

    async function refreshTokens() {
        if (!refreshToken.value) throw new Error("No refresh token");
        const res = await apiAuth.refresh(refreshToken.value);
        accessToken.value = res.access_token;
        refreshToken.value = res.refresh_token;
        _persist();
        if (socket.value) {
            // Si tu backend exige "Bearer xxx", usa: { token: 'Bearer ' + accessToken.value }
            socket.value.auth = { token: accessToken.value! };
            socket.value.connect();
        }
    }

    async function logout() {
        try {
            if (refreshToken.value) await apiAuth.logout(refreshToken.value);
        } catch (_) {}
        user.value = null;
        accessToken.value = null;
        refreshToken.value = null;
        localStorage.removeItem("auth");
        _disconnectSocket();
    }

    function _connectSocket() {
        if (!accessToken.value || socket.value) return;

        const host = import.meta.env.VITE_WS_HOST || "http://localhost:3000";
        socket.value = io(host, {
            path: "/notifications/ws",
            transports: ["websocket"],
            autoConnect: true,
            reconnection: true,
            auth: { token: accessToken.value },
        });

        socket.value.on("connect", () => console.log("[WS] connected"));
        socket.value.on("disconnect", () => console.log("[WS] disconnected"));
        socket.value.on("event-updated", (p) =>
            document.dispatchEvent(
                new CustomEvent("toast", {
                    detail: {
                        type: "info",
                        text: `Evento actualizado (${p.eventId})`,
                    },
                }),
            ),
        );
        socket.value.on("event-cancelled", (p) =>
            document.dispatchEvent(
                new CustomEvent("toast", {
                    detail: {
                        type: "warn",
                        text: `Evento cancelado (${p.eventId})`,
                    },
                }),
            ),
        );
    }

    function _disconnectSocket() {
        if (socket.value) {
            socket.value.disconnect();
            socket.value = null;
        }
    }

    return {
        user,
        accessToken,
        refreshToken,
        socket,
        isAuthenticated,
        role,
        loadFromStorage,
        register,
        login,
        refreshTokens,
        logout,
    };
});

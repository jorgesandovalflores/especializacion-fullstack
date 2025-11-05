import type { AuthResponse } from "../types/models";
import { http } from "./http";

export const apiAuth = {
    register: (data: { name: string; email: string; password: string }) =>
        http.post<AuthResponse>("/auth/register", data).then((r) => r.data),

    login: (data: { email: string; password: string }) =>
        http.post<AuthResponse>("/auth/login", data).then((r) => r.data),

    refresh: (refreshToken: string) =>
        http
            .post<{ access_token: string; refresh_token: string }>(
                "/auth/refresh-token",
                {},
                { headers: { Authorization: `Bearer ${refreshToken}` } },
            )
            .then((r) => r.data),

    logout: (refreshToken: string) =>
        http
            .post<{ revoked: boolean }>(
                "/auth/logout",
                {},
                { headers: { Authorization: `Bearer ${refreshToken}` } },
            )
            .then((r) => r.data),
};

import type { Event } from "../types/models";
import { http } from "./http";

export const apiEvents = {
    list: () => http.get<Event[]>("/events").then((r) => r.data),
    get: (id: string) => http.get<Event>(`/events/${id}`).then((r) => r.data),
    create: (payload: {
        title: string;
        description?: string;
        location: string;
        date: string;
    }) => http.post<Event>("/events", payload).then((r) => r.data),
    update: (
        id: string,
        payload: Partial<{
            title: string;
            description?: string;
            location: string;
            date: string;
        }>,
    ) => http.put<Event>(`/events/${id}`, payload).then((r) => r.data),
    remove: (id: string) =>
        http.delete<{ deleted: boolean }>(`/events/${id}`).then((r) => r.data),
    cancel: (id: string) =>
        http.post<Event>(`/events/${id}/cancel`, {}).then((r) => r.data),
};

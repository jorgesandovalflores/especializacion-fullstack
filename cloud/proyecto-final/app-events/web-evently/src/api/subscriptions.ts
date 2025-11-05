import type { Subscription } from "../types/models";
import { http } from "./http";

export const apiSubs = {
    subscribe: (eventId: string) =>
        http
            .post<Subscription>(`/events/${eventId}/subscribe`, {})
            .then((r) => r.data),
    my: () =>
        http
            .get<Subscription[]>("/me/subscriptions")
            .then((r) => r.data)
            .catch(() => []),
};

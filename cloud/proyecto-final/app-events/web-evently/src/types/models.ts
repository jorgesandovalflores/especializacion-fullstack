export type Role = "admin" | "organizer" | "attendee";

export interface User {
    id: string;
    name: string;
    email: string;
    role: Role;
}

export interface Event {
    id: string;
    title: string;
    description?: string;
    location: string;
    date: string;
    status: "ACTIVE" | "CANCELLED";
    createdBy: User;
}

export interface Subscription {
    id: string;
    user: User;
    event: Event;
    subscribedAt: string;
}

export interface AuthResponse {
    user: User;
    access_token: string;
    refresh_token: string;
}

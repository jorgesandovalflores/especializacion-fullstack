import {
    createRouter,
    createWebHistory,
    type RouteRecordRaw,
} from "vue-router";
import { useAuthStore } from "../stores/auth";

declare module "vue-router" {
    interface RouteMeta {
        requiresAuth?: boolean;
        roles?: Array<"admin" | "organizer" | "attendee">;
        guestOnly?: boolean;
    }
}

const routes: RouteRecordRaw[] = [
    {
        path: "/",
        name: "home",
        component: () => import("../views/HomeEvents.vue"),
    },
    {
        path: "/events/:id",
        name: "event-detail",
        component: () => import("../views/EventDetail.vue"),
        props: true,
    },
    {
        path: "/login",
        name: "login",
        component: () => import("../views/Login.vue"),
        meta: { guestOnly: true },
    },
    {
        path: "/register",
        name: "register",
        component: () => import("../views/Register.vue"),
        meta: { guestOnly: true },
    },
    {
        path: "/me/subscriptions",
        name: "my-subs",
        component: () => import("../views/MySubscriptions.vue"),
        meta: { requiresAuth: true, roles: ["attendee", "organizer", "admin"] },
    },
    {
        path: "/events/create",
        name: "event-create",
        component: () => import("../views/EventCreate.vue"),
        meta: { requiresAuth: true, roles: ["organizer", "admin"] },
    },
    {
        path: "/events/:id/edit",
        name: "event-edit",
        component: () => import("../views/EventEdit.vue"),
        props: true,
        meta: { requiresAuth: true, roles: ["organizer", "admin"] },
    },
    {
        path: "/:pathMatch(.*)*",
        name: "404",
        component: () => import("../views/NotFound.vue"),
    },
];

export const router = createRouter({ history: createWebHistory(), routes });

router.beforeEach((to) => {
    const auth = useAuthStore();
    if (!auth.user) auth.loadFromStorage();

    if (to.meta.guestOnly && auth.isAuthenticated) return { name: "home" };

    if (to.meta.requiresAuth && !auth.isAuthenticated) {
        return { name: "login", query: { redirect: to.fullPath } };
    }
    if (to.meta.roles?.length) {
        const ok = to.meta.roles.includes(auth.role as any);
        if (!ok) return { name: "home" };
    }
});

import { createRouter, createWebHistory } from "vue-router";
import LoginView from "../views/LoginView.vue";
import ChatView from "../views/ChatView.vue";
import { auth } from "../firebase";

const routes = [
    { path: "/login", component: LoginView },
    { path: "/chat", component: ChatView, meta: { requiresAuth: true } },
    { path: "/:pathMatch(.*)*", redirect: "/login" },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    const user = auth.currentUser;

    if (to.path === "/login" && user) {
        next("/chat"); // Redirigir a /chat si ya está autenticado
    } else if (to.meta.requiresAuth && !user) {
        next("/login"); // Redirigir a /login si no está autenticado
    } else {
        next();
    }
});

export default router;

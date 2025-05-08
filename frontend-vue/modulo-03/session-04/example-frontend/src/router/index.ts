import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import DashboardView from '../views/DashboardView.vue'
import { useAuthStore } from '../stores/auth.store'

const routes = [
	{ path: '/login', component: LoginView },
	{ path: '/dashboard', component: DashboardView, meta: { requiresAuth: true } },
	{ path: '/:pathMatch(.*)*', redirect: '/login' },
]

const router = createRouter({
	history: createWebHistory(),
	routes,
})

router.beforeEach((to, _, next) => {
	const auth = useAuthStore()
	if (to.meta.requiresAuth && !auth.isAuthenticated) {
		next('/login')
	} else {
		next()
	}
})

export default router

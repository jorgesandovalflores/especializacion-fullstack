import { createRouter, createWebHistory } from 'vue-router'
import Login from '../pages/Login.vue'
import Home from '../pages/Home.vue'
import Protected from '../pages/Protected.vue'
import { useAuthStore } from '../stores/auth'

const router = createRouter({
	history: createWebHistory(),
	routes: [
		{ path: '/login', name: 'Login', component: Login },
		{ path: '/home', name: 'Home', component: Home, meta: { requiresAuth: true } },
		{ path: '/protected', name: 'Protected', component: Protected, meta: { requiresAuth: true } },
		{ path: '/:pathMatch(.*)*', redirect: '/login' }
	]
})

router.beforeEach((to, _, next) => {
	const auth = useAuthStore()
	if (to.path === '/login' && auth.token) {
		next('/home') // Redirigir a /chat si ya está autenticado
	} else if (to.meta.requiresAuth && !auth.token) {
		next('/login')
	} else {
		next()
	}
})

export default router
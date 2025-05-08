import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Home from '../views/Home.vue'
import { useAuth } from '../stores/auth'

const routes = [
	{ path: '/', name: 'Login', component: Login },
	{ path: '/home', name: 'Home', component: Home, meta: { requiresAuth: true } },
]

const router = createRouter({
	history: createWebHistory(),
	routes,
})

router.beforeEach((to, from, next) => {
	const { isAuthenticated } = useAuth()

	// Redirige a /home si ya está autenticado y va al login (/)
	if (to.path === '/' && isAuthenticated()) {
		next('/home')
		return
	}

	// Redirige a / si intenta acceder a rutas protegidas sin login
	if (to.meta.requiresAuth && !isAuthenticated()) {
		next('/')
	} else {
		next()
	}
})

export default router

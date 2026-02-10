import { createRouter, createWebHistory } from 'vue-router'
import Login from '../components/Login.vue'
import UserList from '../components/UserList.vue'
import { useAuthStore } from '../stores/useAuthStore'

const router = createRouter({
	history: createWebHistory(),
	routes: [
		{ path: '/login', name: 'Login', component: Login },
		{ path: '/users', name: 'UserList', component: UserList, meta: { requiresAuth: true } },
		{ path: '/:pathMatch(.*)*', redirect: '/login' }
	]
})

router.beforeEach((to, _, next) => {
	const auth = useAuthStore()
	if (to.path === '/login' && auth.token) {
		next('/users')
	} else if (to.meta.requiresAuth && !auth.token) {
		next('/login')
	} else {
		next()
	}
})

export default router
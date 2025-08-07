import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import ChatView from '../views/ChatView.vue'
import { useAuth } from '@/store/useAuth'

const routes = [
	{ path: '/', component: LoginView },
	{ path: '/chat', component: ChatView }
]

const router = createRouter({
	history: createWebHistory(),
	routes
})

router.beforeEach((to, from, next) => {
	const auth = useAuth()
	if (to.path === '/chat' && !auth.token) {
		next('/')
	} else {
		next()
	}
})

export default router

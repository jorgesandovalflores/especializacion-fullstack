import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import HomeView from '../views/HomeView.vue'
import { isAuthenticated } from '../services/session.service'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', name: 'login', component: LoginView },
    { path: '/home', name: 'home', component: HomeView },
  ],
})

router.beforeEach((to) => {
  const authenticated = isAuthenticated()

  if (to.path === '/login' && authenticated) {
    return '/home'
  }

  if (to.path === '/home' && !authenticated) {
    return '/login'
  }
})

export default router

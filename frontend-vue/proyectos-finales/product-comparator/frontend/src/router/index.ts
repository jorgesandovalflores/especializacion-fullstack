import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import HomeView from '../views/HomeView.vue'
import { useAuthStore } from '@/stores/auth'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView
  },
  {
    path: '/products',
    name: 'products',
    component: () => import('../views/ProductListView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/products/new',
    name: 'product-create',
    component: () => import('../views/ProductCreateView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/products/:id/edit',
    name: 'product-edit',
    component: () => import('../views/ProductEditView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/products/compare',
    name: 'product-compare',
    component: () => import('../views/ProductCompareView.vue'),
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Rutas protegidas
router.beforeEach((to, _, next) => {
  const auth = useAuthStore()

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    next({ name: 'login' })
  } else if(to.name === 'login' && auth.isAuthenticated) {
    next({ name: 'home' })
  } else {
    next()
  }
})

export default router

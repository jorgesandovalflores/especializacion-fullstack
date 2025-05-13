import { createRouter, createWebHistory } from 'vue-router'
import ProductList from '../pages/ProductList.vue'
import ProductDetail from '../pages/ProductDetail.vue'

export default createRouter({
	history: createWebHistory(),
	routes: [
		{ path: '/', name: 'ProductList', component: ProductList },
		{ path: '/product/:id', name: 'ProductDetail', component: ProductDetail }
	]
})

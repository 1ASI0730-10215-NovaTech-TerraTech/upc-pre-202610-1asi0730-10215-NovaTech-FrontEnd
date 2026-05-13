import { createRouter, createWebHistory } from 'vue-router'
import HomeView from './shared/presentation/views/home.vue'
import PageNotFoundView from './shared/presentation/views/page-not-found.vue'
import InventoryView from './inventory/presentation/views/inventory.vue'

const routes = [
    { path: '/', redirect: '/home' },
    { path: '/home', name: 'home', component: HomeView },
    { path: '/inventory', name: 'inventory', component: InventoryView },
    { path: '/:pathMatch(.*)*', name: 'not-found', component: PageNotFoundView }
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
})

export default router
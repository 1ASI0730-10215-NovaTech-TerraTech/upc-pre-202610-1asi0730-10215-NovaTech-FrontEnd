import { createRouter, createWebHistory, RouterView } from 'vue-router'
import HomeView from './shared/presentation/views/home.vue'
import PageNotFoundView from './shared/presentation/views/page-not-found.vue'
import { commercialRoutes } from './commercial/presentation/commercial-management-routes'

const routes = [
    { path: '/', redirect: '/home' },
    { path: '/home', name: 'home', component: HomeView },
    { path: '/commercial', component: RouterView, children: commercialRoutes},
    { path: '/:pathMatch(.*)*', name: 'not-found', component: PageNotFoundView }
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
})

export default router
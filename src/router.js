import { createRouter, createWebHistory } from 'vue-router'
import HomeView from './shared/presentation/views/home.vue'
import AboutView from './shared/presentation/views/about.vue'
import BatchListView from './monitoring/presentation/views/batch-list.vue'
import PageNotFoundView from './shared/presentation/views/page-not-fond.vue'

const routes = [
  { path: '/', redirect: '/home' },
  { path: '/home', name: 'home', component: HomeView },
  { path: '/about', name: 'about', component: AboutView },
  { path: '/monitoring', name: 'monitoring', component: BatchListView },
  { path: '/:pathMatch(.*)*', name: 'not-found', component: PageNotFoundView }
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
})

export default router
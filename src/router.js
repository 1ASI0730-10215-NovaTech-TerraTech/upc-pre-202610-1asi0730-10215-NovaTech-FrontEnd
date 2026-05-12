import { createRouter, createWebHistory } from 'vue-router'
import HomeView from './shared/presentation/views/home.vue'
import BatchListView from './monitoring/presentation/views/batch-list.vue'
import PaymentView from './payment/presentation/views/payment.vue'
import PageNotFoundView from './shared/presentation/views/page-not-fond.vue'

const routes = [
  { path: '/', redirect: '/home' },
  { path: '/home', name: 'home', component: HomeView },
  { path: '/monitoring', name: 'monitoring', component: BatchListView },
  { path: '/payment', name: 'payment', component: PaymentView },
  { path: '/:pathMatch(.*)*', name: 'not-found', component: PageNotFoundView }
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
})

export default router
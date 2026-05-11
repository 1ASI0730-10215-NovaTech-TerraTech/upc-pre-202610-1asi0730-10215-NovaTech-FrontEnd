import { createRouter, createWebHistory } from 'vue-router'
import LotList from './monitoring/presentation/views/LotList.vue'

const routes = [
    { path: '/', name: 'home', component: LotList }
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
})

export default router
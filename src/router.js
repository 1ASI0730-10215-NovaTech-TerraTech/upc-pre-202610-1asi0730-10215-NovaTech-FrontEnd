import { createRouter, createWebHistory, RouterView } from 'vue-router'
import HomeView from './shared/presentation/views/home.vue'
import PageNotFoundView from './shared/presentation/views/page-not-found.vue'
import iamRoutes from './iam/presentation/iam-routes.js'
import monitoringRoutes from './monitoring/presentation/monitoring-routes.js'
import {commercialRoutes} from "./commercial/presentation/commercial-management-routes.js";
import { analyticsRoutes } from "./analytics/presentation/analytics-management-routes.js";
import notificationRoutes from './notification-management/presentation/notification-management-routes.js'
import profileRoutes from "./profile-management/presentation/profile-management-routes.js";
import communityRoutes from './community-management/presentation/community-routes.js';
import stockRoutes from "./stock/presentation/stock-routes.js";
import Layout from "./shared/presentation/components/layout.vue";
import AuthenticationSection from "./iam/presentation/components/authentication-section.vue";
import {authenticationGuard} from "./iam/infrastructure/authentication.guard.js";

const routes = [
    { path: '/', redirect: '/auth/login'},
    { path: '/auth', component: AuthenticationSection, children: iamRoutes},

    { path: '/', component: Layout, children: [
            { path: '', redirect: 'home'},
            { path: '/home', name: 'home', component: HomeView },
            { path: '/stock', component: RouterView, children: stockRoutes },
            { path: '/monitoring', component: RouterView, children: monitoringRoutes },
            { path: '/commercial', component: RouterView, children: commercialRoutes },
            { path: '/analytics', component: RouterView, children: analyticsRoutes },
            { path: '/notifications', component: RouterView, children: notificationRoutes },
            { path: '/settings', component: RouterView, children: profileRoutes },
            { path: '/community', component: RouterView, children: communityRoutes },
        ]
    },
    { path: '/:pathMatch(.*)*', name: 'not-found', component: PageNotFoundView }
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: routes
})

/**
 * Global navigation guard that updates the document title and delegates auth when enabled.
 *
 * @param {import('vue-router').RouteLocationNormalized} to - Target route.
 * @param {import('vue-router').RouteLocationNormalized} from - Previous route.
 * @param {import('vue-router').NavigationGuardNext} next - Guard continuation callback.
 * @returns {void}
 */
router.beforeEach((to, from) => {
    console.log(`Navigating from ${from.name} to ${to.name}`);
    // Set the page title
    let baseTitle = 'TerraTech';
    document.title = `${baseTitle} - ${to.meta['title']}`;
    // When IAM is implemented, use:
    return authenticationGuard(to, from);
    // if not, use:
    // return true;
});

export default router
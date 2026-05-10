import {createRouter, createWebHistory} from "vue-router";
import Home from "./shared/presentation/views/home.vue";

// Routes version when IAM is not implemented
const routes = [
    { path: '/home',            name: 'home',       component: Home,        meta: { title: 'Home' } },
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: routes,

});

/**
 * Global navigation guard that updates the document title and delegates auth when enabled.
 *
 * @param {import('vue-router').RouteLocationNormalized} to - Target route.
 * @param {import('vue-router').RouteLocationNormalized} from - Previous route.
 * @param {import('vue-router').NavigationGuardNext} next - Guard continuation callback.
 * @returns {void}
 */
router.beforeEach((to, from, next) => {
    console.log(`Navigating from ${from.name} to ${to.name}`);
    // Set the page title
    let baseTitle = 'ACME Learning Center';
    document.title = `${baseTitle} - ${to.meta['title']}`;
    // When IAM is implemented, use:
    // return authenticationGuard(to, from, next);
    // if not, use:
    return next();
});

export default router;
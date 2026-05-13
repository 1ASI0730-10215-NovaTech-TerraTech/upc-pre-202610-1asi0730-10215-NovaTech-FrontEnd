const signIn = () => import('./views/sign-in-view.vue');
const signUp = () => import('./views/sign-up-view.vue');

const iamRoutes = [
    { path: '/sign-in', name: 'sign-in', component: signIn, meta: { title: 'Sign-In' } },
    { path: '/sign-up', name: 'sign-up', component: signUp, meta: { title: 'Sign-Up' } },
]

export default iamRoutes;
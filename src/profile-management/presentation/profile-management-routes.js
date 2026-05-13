const ProfileList = () => import('./views/profile-list.vue');
const ProfileForm = () => import('./views/profile-form.vue');

export default [
    { path: '/settings', name: 'profile-list', component: ProfileList },
    {path: '/settings/new', name: 'profile-new', component: () => import('./views/profile-form.vue')},
    {path: '/settings/edit/:id', name: 'profile-edit', component: () => import('./views/profile-form.vue')}
];
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: "/",
            redirect: "/login",
        },
        {
            path: '/login',
            component: () => import('./views/LoginPage.vue')
        },
        {
            path: '/panel',
            component: () => import('./views/PanelPage.vue')
        }
    ]
});

export default router
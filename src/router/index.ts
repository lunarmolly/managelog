import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/auth',
    name: 'auth',
    component: () => import('../views/auth/AuthView.vue'),
    beforeEnter: (to, from, next) => {
      // Проверка наличия токенов
      const tokens = localStorage.getItem('auth_tokens');
      if (tokens) {
        next('/dashboard');
      } else {
        next();
      }
    },
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('../views/DashboardView.vue'),
  },
  {
    path: '/',
    redirect: '/auth',
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;


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
    path: '/projects',
    name: 'projects',
    component: () => import('../views/ProjectsView.vue'),
  },
  {
    path: '/projects/:id/tasks',
    name: 'tasks',
    component: () => import('../views/TasksView.vue'),
    beforeEnter: (to, from, next) => {
      const tokens = localStorage.getItem('auth_tokens');
      if (!tokens) {
        next('/auth');
      } else {
        next();
      }
    },
  },
  {
    path: '/crm',
    name: 'crm',
    component: () => import('../views/CrmView.vue'),
  },
  {
    path: '/teams',
    name: 'teams',
    component: () => import('../views/TeamsView.vue'),
  },
  {
    path: '/user/:id',
    name: 'user-profile',
    component: () => import('../views/UserProfileView.vue'),
    beforeEnter: (to, from, next) => {
      const tokens = localStorage.getItem('auth_tokens');
      if (!tokens) {
        next('/auth');
      } else {
        next();
      }
    },
  },
  {
    path: '/privacy',
    name: 'privacy',
    component: () => import('../views/PrivacyView.vue'),
  },
  {
    path: '/settings',
    name: 'settings',
    component: () => import('../views/SettingsView.vue'),
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('../views/ProfileView.vue'),
    beforeEnter: (to, from, next) => {
      // Проверка наличия токенов
      const tokens = localStorage.getItem('auth_tokens');
      if (!tokens) {
        next('/auth');
      } else {
        next();
      }
    },
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


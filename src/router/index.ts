import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { pinia } from '../stores';

const routes = [
  { path: '/', name: 'home', component: () => import('../views/HomeRedirect.vue') },
  { path: '/auth', name: 'auth', component: () => import('../views/AuthView.vue') },
  { path: '/dashboard', name: 'dashboard', component: () => import('../views/DashboardView.vue') },
  { path: '/403', name: 'error-403', component: () => import('../views/errors/Error403.vue') },
  { path: '/404', name: 'error-404', component: () => import('../views/errors/Error404.vue') },
  { path: '/500', name: 'error-500', component: () => import('../views/errors/Error500.vue') },
  { path: '/502', name: 'error-502', component: () => import('../views/errors/Error502.vue') },
  { path: '/503', name: 'error-503', component: () => import('../views/errors/Error503.vue') },
  { path: '/offline', name: 'error-offline', component: () => import('../views/errors/ErrorOffline.vue') },
  { path: '/error', name: 'error-app', component: () => import('../views/errors/ErrorApp.vue') },
  { path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('../views/NotFoundView.vue') },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to) => {
  const auth = useAuthStore(pinia);
  if (!auth.authInitialized) {
    await auth.initFromStorage();
  }

  if (!auth.isAuthenticated && to.path !== '/auth') {
    return '/auth';
  }

  if (auth.isAuthenticated && (to.path === '/' || to.path === '/auth')) {
    return '/dashboard';
  }
});

export default router;



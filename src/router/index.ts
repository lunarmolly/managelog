import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { pinia } from '../stores';

const routes = [
  { path: '/', name: 'home', component: () => import('../views/HomeRedirect.vue') },
  { path: '/auth', name: 'auth', component: () => import('../views/AuthView.vue') },
  { path: '/dashboard', name: 'dashboard', component: () => import('../views/DashboardView.vue') },
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



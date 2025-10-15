import { createApp } from 'vue';
import { pinia } from './stores';
import App from './App.vue';
import router from './router';
import './styles/index.css';
import './styles/tasks.css';

async function bootstrap() {
  if (import.meta.env.DEV) {
    const { worker } = await import('./mocks/browser');
    await worker.start({ onUnhandledRequest: 'bypass' });
  }

  const app = createApp(App);
  app.use(pinia);
  app.use(router);
  app.mount('#app');
}

bootstrap();



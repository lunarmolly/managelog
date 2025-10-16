<template>
  <div class="app-layout">
    <!-- Global Header (не на auth странице) -->
    <AppHeader v-if="!isAuthPage" />
    
    <!-- Main Content -->
    <main class="main-content" :class="{ 'with-header': !isAuthPage }">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, onErrorCaptured, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useOffline } from './shared/lib/useOffline';
import AppHeader from './components/layout/AppHeader.vue';

const route = useRoute();
const router = useRouter();
const offline = useOffline();

const isAuthPage = computed(() => route.path === '/auth');

onMounted(() => offline.start());
onUnmounted(() => offline.stop());

onErrorCaptured((err) => {
  // Глобальный runtime fallback
  void router.push('/error');
  // возвращаем false, чтобы ошибка не всплывала дальше
  return false;
});
</script>



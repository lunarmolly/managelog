<template>
  <router-view />
  
</template>

<script setup lang="ts">
import { onErrorCaptured, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useOffline } from './shared/lib/useOffline';

const router = useRouter();
const offline = useOffline();

onMounted(() => offline.start());
onUnmounted(() => offline.stop());

onErrorCaptured((err) => {
  // Глобальный runtime fallback
  void router.push('/error');
  // возвращаем false, чтобы ошибка не всплывала дальше
  return false;
});
</script>



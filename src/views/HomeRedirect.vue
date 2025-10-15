<template></template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { pinia } from '../stores';

const router = useRouter();
const auth = useAuthStore(pinia);

onMounted(async () => {
  if (!auth.authInitialized) {
    await auth.initFromStorage();
  }
  if (auth.isAuthenticated) router.replace('/dashboard');
  else router.replace('/auth');
});
</script>



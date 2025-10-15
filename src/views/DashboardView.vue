<template>
  <div class="p-6">
    <h1 class="text-2xl font-semibold mb-2">Dashboard</h1>
    <p class="text-gray-600">Заглушка панели управления.</p>
    <div class="mt-6">
      <button @click="onLogout" class="bg-gray-800 text-white px-4 py-2 rounded-md">Выйти</button>
    </div>
  </div>
  
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const auth = useAuthStore();

async function onLogout() {
  await auth.logout();
  router.replace('/auth');
}
</script>



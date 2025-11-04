<template>
  <div class="p-8">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold">Dashboard</h1>
      <button
        @click="handleLogout"
        class="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded text-sm"
      >
        Выйти
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { logout, clearTokens } from '../api/auth';

const router = useRouter();

async function handleLogout(): Promise<void> {
  try {
    await logout();
  } catch (error) {
    console.error('Logout failed:', error);
  } finally {
    // Убеждаемся, что токены очищены
    clearTokens();
    // Используем window.location для полной перезагрузки и обхода guard'а
    window.location.href = '/auth';
  }
}
</script>


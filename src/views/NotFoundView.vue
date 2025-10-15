<template>
  <div class="min-h-full flex items-center justify-center p-8">
    <div class="text-center">
      <h1 class="text-5xl font-bold mb-3">404</h1>
      <p class="text-gray-600 mb-6">Страница не найдена</p>
      <div class="flex gap-3 justify-center">
        <router-link to="/" class="px-4 py-2 bg-gray-800 text-white rounded-md">На главную</router-link>
        <router-link to="/dashboard" class="px-4 py-2 border rounded-md">В панель</router-link>
      </div>
    </div>
  </div>
  
</template>

<script setup lang="ts">
</script>



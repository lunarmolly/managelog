<template>
  <div class="tasks-page">
    <header class="tasks-header">
      <nav class="flex items-center gap-4">
        <RouterLink to="/dashboard" class="underline">Dashboard</RouterLink>
        <RouterLink to="/projects" class="underline">Проекты</RouterLink>
      </nav>
      <div class="flex items-center gap-3">
        <select class="border rounded px-2 py-1">
          <option>Компания A</option>
          <option>Компания B</option>
        </select>
        <div class="w-8 h-8 rounded-full bg-gray-300"></div>
      </div>
    </header>
    <div class="tasks-main">
      <aside class="tasks-sidebar">Сайдбар (фильтры/действия)</aside>
      <main class="tasks-content">
        <slot />
      </main>
    </div>
  </div>
  
</template>

<script setup lang="ts">
// Стили подключены глобально в main.ts
</script>



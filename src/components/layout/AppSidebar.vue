<template>
  <aside class="tasks-sidebar">
    <div class="space-y-4">
      <div>
        <h3 class="font-medium text-sm text-gray-700 mb-2">Фильтры</h3>
        <div class="space-y-2">
          <label class="flex items-center">
            <input type="checkbox" class="mr-2" />
            <span class="text-sm">Мои задачи</span>
          </label>
          <label class="flex items-center">
            <input type="checkbox" class="mr-2" />
            <span class="text-sm">Срочные</span>
          </label>
          <label class="flex items-center">
            <input type="checkbox" class="mr-2" />
            <span class="text-sm">С дедлайном</span>
          </label>
        </div>
      </div>
      
      <div>
        <h3 class="font-medium text-sm text-gray-700 mb-2">Действия</h3>
        <div class="space-y-2">
          <button class="w-full text-left text-sm py-1 px-2 hover:bg-gray-100 rounded">
            Создать задачу
          </button>
          <button class="w-full text-left text-sm py-1 px-2 hover:bg-gray-100 rounded">
            Создать колонку
          </button>
          <button class="w-full text-left text-sm py-1 px-2 hover:bg-gray-100 rounded">
            Настройки
          </button>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
// Сайдбар с фильтрами и действиями
</script>

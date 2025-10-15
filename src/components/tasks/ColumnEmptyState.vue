<template>
  <div class="empty-state">
    <div class="text-center py-8">
      <div class="text-gray-400 mb-2">📝</div>
      <p class="text-sm text-gray-500 mb-3">Нет задач</p>
      <button
        @click="createTask"
        class="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
      >
        Добавить задачу
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  (e: 'create-task'): void;
}>();

function createTask() {
  emit('create-task');
}
</script>

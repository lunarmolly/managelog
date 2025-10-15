<template>
  <div class="move-menu">
    <button
      @click="showMenu = !showMenu"
      class="px-3 py-1 text-sm border rounded hover:bg-gray-50"
    >
      Переместить в...
    </button>
    
    <div v-if="showMenu" class="absolute top-full left-0 mt-1 bg-white border rounded shadow-lg z-10 min-w-48">
      <div class="p-2">
        <div class="text-xs text-gray-500 mb-2">Выберите колонку:</div>
        <button
          v-for="column in availableColumns"
          :key="column.id"
          @click="moveToColumn(column.id)"
          class="w-full text-left px-2 py-1 hover:bg-gray-100 rounded text-sm"
        >
          {{ column.name }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useTasksStore } from '../../stores/tasks';
import type { Column } from '../../stores/tasks';

const props = defineProps<{
  taskId: string;
  currentColumnId: string;
}>();

const emit = defineEmits<{
  (e: 'move', columnId: string): void;
}>();

const tasksStore = useTasksStore();
const showMenu = ref(false);

const availableColumns = computed(() => 
  tasksStore.columns.filter(c => c.id !== props.currentColumnId)
);

function moveToColumn(columnId: string) {
  emit('move', columnId);
  showMenu.value = false;
}

// Close menu when clicking outside
function handleClickOutside(event: MouseEvent) {
  const target = event.target as HTMLElement;
  if (!target.closest('.move-menu')) {
    showMenu.value = false;
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

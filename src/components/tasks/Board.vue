<template>
  <div class="columns-row">
    <draggable
      v-model="columns"
      group="columns"
      item-key="id"
      class="flex gap-4"
      @end="onColumnReorder"
    >
      <template #item="{ element: column }">
        <Column
          :key="column.id"
          :column="column"
          @create-task="onCreateTask"
          @task-click="onTaskClick"
        />
      </template>
    </draggable>
    
    <!-- Кнопка создания колонки -->
    <div class="w-80 flex-shrink-0">
      <button
        @click="createColumn"
        class="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-500 hover:border-gray-400 hover:text-gray-600"
      >
        + Создать колонку
      </button>
    </div>
  </div>
  
  <!-- Панель задачи -->
  <TaskDetailsPanel
    :is-open="isTaskPanelOpen"
    :task-id="selectedTaskId"
    :column-id="selectedColumnId"
    @close="closeTaskPanel"
    @saved="onTaskSaved"
  />
</template>

<script setup lang="ts">
import { onMounted, computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useTasksStore } from '../../stores/tasks';
import { getColumns, reorderColumns, createColumn as createColumnApi } from '../../api/projects';
import Column from './Column.vue';
import TaskDetailsPanel from './TaskDetailsPanel.vue';
import draggable from 'vuedraggable';

const route = useRoute();
const router = useRouter();
const tasksStore = useTasksStore();

const columns = computed(() => tasksStore.columns);

// Панель задачи
const isTaskPanelOpen = ref(false);
const selectedTaskId = ref<string | undefined>();
const selectedColumnId = ref<string | undefined>();

onMounted(async () => {
  const projectId = route.params.projectId as string;
  const companyId = 'company1'; // mock company
  
  tasksStore.setContext(companyId, projectId);
  
  try {
    const { columns } = await getColumns(companyId, projectId);
    tasksStore.setColumns(columns);
    
    // Проверить deeplink для задачи
    const taskId = route.query.taskId as string;
    if (taskId) {
      selectedTaskId.value = taskId;
      isTaskPanelOpen.value = true;
    }
  } catch (error) {
    console.error('Failed to load columns:', error);
  }
});

async function onColumnReorder() {
  const columnIds = columns.value.map(c => c.id);
  try {
    await reorderColumns('company1', route.params.projectId as string, columnIds);
  } catch (error) {
    console.error('Failed to reorder columns:', error);
  }
}

function onCreateTask(columnId: string) {
  selectedColumnId.value = columnId;
  selectedTaskId.value = undefined;
  isTaskPanelOpen.value = true;
}

function onTaskClick(task: any) {
  selectedTaskId.value = task.id;
  selectedColumnId.value = undefined;
  isTaskPanelOpen.value = true;
  
  // Обновить URL с taskId
  router.replace({ query: { ...route.query, taskId: task.id } });
}

async function createColumn() {
  try {
    const { column } = await createColumnApi('company1', route.params.projectId as string, {
      name: 'Новая колонка',
    });
    tasksStore.setColumns([...columns.value, column]);
  } catch (error) {
    console.error('Failed to create column:', error);
  }
}

function closeTaskPanel() {
  isTaskPanelOpen.value = false;
  selectedTaskId.value = undefined;
  selectedColumnId.value = undefined;
  router.replace({ query: {} });
}

function onTaskSaved(task: any) {
  // Задача уже добавлена в стор через API
  closeTaskPanel();
}
</script>



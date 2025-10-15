<template>
  <section class="column">
    <header class="column-header">
      <h3 class="font-medium">{{ column.name }}</h3>
      <button class="text-sm underline">⋯</button>
    </header>
    <div class="column-list">
      <ColumnEmptyState
        v-if="tasks.length === 0"
        @create-task="$emit('create-task', column.id)"
      />
      <draggable
        v-else
        v-model="tasks"
        group="tasks"
        item-key="id"
        class="space-y-3"
        @end="onTaskReorder"
      >
        <template #item="{ element: task }">
          <TaskCard :key="task.id" :task="task" @click="$emit('task-click', task)" />
        </template>
      </draggable>
    </div>
  </section>
  
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useTasksStore } from '../../stores/tasks';
import { getTasks, reorderTasks } from '../../api/projects';
import { applyAutoSortToColumn } from '../../utils/autoSort';
import TaskCard from './TaskCard.vue';
import ColumnEmptyState from './ColumnEmptyState.vue';
import draggable from 'vuedraggable';

const props = defineProps<{ column: { id: string; name: string } }>();
const emit = defineEmits<{
  (e: 'create-task', columnId: string): void;
  (e: 'task-click', task: any): void;
}>();

const tasksStore = useTasksStore();

const tasks = computed({
  get: () => tasksStore.tasks[props.column.id] || [],
  set: (value) => {
    tasksStore.setTasksForColumn(props.column.id, value);
  }
});

async function onTaskReorder() {
  // Применить автосортировку после drop
  const sortedTasks = applyAutoSortToColumn(tasks.value);
  tasksStore.setTasksForColumn(props.column.id, sortedTasks);
  
  const taskIds = sortedTasks.map(t => t.id);
  try {
    await reorderTasks('company1', 'project1', props.column.id, taskIds);
  } catch (error) {
    console.error('Failed to reorder tasks:', error);
  }
}
</script>



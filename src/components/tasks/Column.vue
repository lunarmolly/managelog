<template>
  <section class="column">
    <header class="column-header">
      <h3 class="font-medium">{{ column.name }}</h3>
      <button class="text-sm underline">⋯</button>
    </header>
    <div class="column-list">
      <draggable
        v-model="tasks"
        group="tasks"
        item-key="id"
        class="space-y-3"
        @end="onTaskReorder"
      >
        <template #item="{ element: task }">
          <TaskCard :key="task.id" :task="task" />
        </template>
      </draggable>
    </div>
  </section>
  
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useTasksStore } from '../../stores/tasks';
import { getTasks, reorderTasks } from '../../api/projects';
import TaskCard from './TaskCard.vue';
import draggable from 'vuedraggable';

const props = defineProps<{ column: { id: string; name: string } }>();
const tasksStore = useTasksStore();

const tasks = computed({
  get: () => tasksStore.tasks[props.column.id] || [],
  set: (value) => {
    tasksStore.setTasksForColumn(props.column.id, value);
  }
});

async function onTaskReorder() {
  const taskIds = tasks.value.map(t => t.id);
  try {
    await reorderTasks('company1', 'project1', props.column.id, taskIds);
  } catch (error) {
    console.error('Failed to reorder tasks:', error);
  }
}
</script>



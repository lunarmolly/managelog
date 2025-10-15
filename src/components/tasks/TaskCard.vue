<template>
  <article class="task-card" @click="openDetails">
    <h4 class="font-medium">{{ task.title }}</h4>
    <div class="flex items-center gap-2 mt-2">
      <span v-if="task.priority" class="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">Срочно</span>
      <span v-if="task.deadline" class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">{{ formatDeadline(task.deadline) }}</span>
      <span v-if="task.timeTracking?.totalMs" class="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">{{ formatTime(task.timeTracking.totalMs) }}</span>
    </div>
    <div class="flex items-center gap-1 mt-2">
      <div v-for="assignee in task.assignees.slice(0, 3)" :key="assignee" class="w-6 h-6 bg-gray-300 rounded-full"></div>
      <span v-if="task.assignees.length > 3" class="text-xs text-gray-500">+{{ task.assignees.length - 3 }}</span>
    </div>
  </article>
  
</template>

<script setup lang="ts">
import type { Task } from '../../stores/tasks';

defineProps<{ task: Task }>();

function openDetails() {
  // TODO: Open task details drawer
}

function formatDeadline(deadline: string) {
  const date = new Date(deadline);
  return date.toLocaleDateString('ru-RU');
}

function formatTime(ms: number) {
  const hours = Math.floor(ms / 3600000);
  const minutes = Math.floor((ms % 3600000) / 60000);
  return `${hours}ч ${minutes}м`;
}
</script>



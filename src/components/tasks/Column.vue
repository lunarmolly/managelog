<template>
  <section class="column">
    <header class="column-header">
      <h3 class="font-medium">{{ column.name }}</h3>
      <button class="text-sm underline">⋯</button>
    </header>
    <div class="column-list">
      <TaskCard v-for="t in tasks" :key="t.id" :task="t" />
    </div>
  </section>
  
</template>

<script setup lang="ts">
import TaskCard from './TaskCard.vue';
const props = defineProps<{ column: { id: string; name: string } }>();
const tasks = [
  { id: props.column.id + '-t1', title: 'Задача 1' },
  { id: props.column.id + '-t2', title: 'Задача 2' },
];
</script>



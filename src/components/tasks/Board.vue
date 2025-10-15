<template>
  <div class="columns-row">
    <Column v-for="c in columns" :key="c.id" :column="c" />
  </div>
  
</template>

<script setup lang="ts">
import Column from './Column.vue';
import { ref } from 'vue';

type ColumnType = { id: string; name: string; color?: string };
const columns = ref<ColumnType[]>([
  { id: 'c1', name: 'Backlog' },
  { id: 'c2', name: 'In Progress' },
  { id: 'c3', name: 'Review' },
  { id: 'c4', name: 'Done' },
]);
</script>



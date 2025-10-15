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
        <Column :key="column.id" :column="column" />
      </template>
    </draggable>
  </div>
  
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useTasksStore } from '../../stores/tasks';
import { getColumns, reorderColumns } from '../../api/projects';
import Column from './Column.vue';
import draggable from 'vuedraggable';

const route = useRoute();
const tasksStore = useTasksStore();

const columns = computed(() => tasksStore.columns);

onMounted(async () => {
  const projectId = route.params.projectId as string;
  const companyId = 'company1'; // mock company
  
  tasksStore.setContext(companyId, projectId);
  
  try {
    const { columns } = await getColumns(companyId, projectId);
    tasksStore.setColumns(columns);
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
</script>



<template>
  <article class="task-card">
    <h4 class="font-medium">{{ task.title }}</h4>
    <div class="text-xs text-gray-500">плейсхолдер индикаторов</div>
  </article>
  
</template>

<script setup lang="ts">
defineProps<{ task: { id: string; title: string } }>();
</script>



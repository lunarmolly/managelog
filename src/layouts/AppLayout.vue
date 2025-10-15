<template>
  <div class="tasks-page">
    <AppHeader />
    <div class="tasks-main">
      <AppSidebar />
      <main class="tasks-content">
        <slot />
      </main>
    </div>
  </div>
  
</template>

<script setup lang="ts">
import AppHeader from '../components/layout/AppHeader.vue';
import AppSidebar from '../components/layout/AppSidebar.vue';
</script>



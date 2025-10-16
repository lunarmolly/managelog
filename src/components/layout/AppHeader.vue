<template>
  <header class="global-header">
    <div class="header-container">
      <!-- Logo -->
      <div class="header-logo">
        <div class="logo-placeholder">managelog</div>
      </div>
      
      <!-- Navigation -->
      <nav class="header-nav">
        <RouterLink 
          to="/dashboard" 
          class="nav-item"
          :class="{ active: $route.path === '/dashboard' }"
        >
          Дашборд
        </RouterLink>
        <RouterLink 
          to="/projects" 
          class="nav-item"
          :class="{ active: $route.path.startsWith('/projects') }"
        >
          Проекты
        </RouterLink>
        <RouterLink 
          to="/crm" 
          class="nav-item"
          :class="{ active: $route.path.startsWith('/crm') }"
        >
          CRM
        </RouterLink>
        <RouterLink 
          to="/teams" 
          class="nav-item"
          :class="{ active: $route.path.startsWith('/teams') }"
        >
          Команды
        </RouterLink>
      </nav>
      
      <!-- Profile -->
      <div class="header-profile">
        <div class="profile-avatar">
          <div class="avatar-circle avatar-bg-1"></div>
          <div class="avatar-circle avatar-bg-2"></div>
          <div class="avatar-photo">U</div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router';
</script>

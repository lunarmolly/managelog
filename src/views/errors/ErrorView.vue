<template>
  <div class="error-layout">
    <div v-if="code" class="error-code">{{ code }}</div>
    <h1 class="error-title">{{ title }}</h1>
    <p v-if="message" class="error-msg">{{ message }}</p>
    <div class="error-actions">
      <RouterLink :to="homeTarget" class="error-btn">На дашборд</RouterLink>
      <button type="button" class="error-btn" @click="reload">Повторить</button>
      <button type="button" class="error-link" @click="goBack">Назад</button>
    </div>
  </div>
  
</template>

<script setup lang="ts">
import '@/styles/error.css';
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/auth';

const props = defineProps<{ code?: string; title: string; message?: string }>();

const router = useRouter();
const auth = useAuthStore();

const homeTarget = computed(() => (auth.isAuthenticated ? '/dashboard' : '/auth'));
function reload() { location.reload(); }
function goBack() { history.length > 1 ? history.back() : router.push(homeTarget.value); }
</script>



<template>
  <div class="min-h-full flex items-center justify-center p-6">
    <div class="w-full max-w-md">
      <div class="flex mb-4 rounded-lg bg-gray-100 p-1">
        <button class="flex-1 py-2 rounded-md" :class="tab==='login' ? 'bg-white shadow' : ''" @click="tab='login'">Вход</button>
        <button class="flex-1 py-2 rounded-md" :class="tab==='register' ? 'bg-white shadow' : ''" @click="tab='register'">Регистрация</button>
      </div>
      <LoginForm v-if="tab==='login'" @success="onSuccess" />
      <RegisterForm v-else @success="onSuccess" />
    </div>
  </div>
  
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import LoginForm from '../components/auth/LoginForm.vue';
import RegisterForm from '../components/auth/RegisterForm.vue';

const tab = ref<'login'|'register'>('login');
const router = useRouter();

function onSuccess() {
  router.push('/dashboard');
}
</script>



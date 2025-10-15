<template>
  <form class="space-y-4" @submit.prevent="onSubmit">
    <div>
      <label class="block text-sm mb-1">Логин или Email</label>
      <input v-model="login" type="text" class="w-full border rounded-md px-3 py-2" :disabled="loading" />
      <p v-if="errors.login" class="text-sm text-red-600 mt-1">{{ errors.login }}</p>
    </div>
    <div>
      <label class="block text-sm mb-1">Пароль</label>
      <input v-model="password" type="password" class="w-full border rounded-md px-3 py-2" :disabled="loading" />
      <p v-if="errors.password" class="text-sm text-red-600 mt-1">{{ errors.password }}</p>
    </div>
    <button type="submit" class="w-full bg-brand-600 text-white py-2 rounded-md disabled:opacity-50" :disabled="loading">Войти</button>
    <p v-if="formError" class="text-sm text-red-600">{{ formError }}</p>
  </form>
  
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useAuthStore } from '../../stores/auth';

const emit = defineEmits<{ (e: 'success'): void }>();
const auth = useAuthStore();

const login = ref('');
const password = ref('');
const loading = ref(false);
const formError = ref('');
const errors = reactive<{ login?: string; password?: string }>({});

function validate() {
  errors.login = login.value ? '' : 'Укажите логин или email';
  errors.password = password.value ? '' : 'Укажите пароль';
  return !errors.login && !errors.password;
}

async function onSubmit() {
  formError.value = '';
  if (!validate()) return;
  loading.value = true;
  try {
    await auth.login({ login: login.value, password: password.value });
    emit('success');
  } catch (e: any) {
    formError.value = e?.message || 'Ошибка входа';
  } finally {
    loading.value = false;
  }
}
</script>



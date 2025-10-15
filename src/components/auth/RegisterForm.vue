<template>
  <form class="space-y-4" @submit.prevent="onSubmit">
    <div class="grid grid-cols-2 gap-3">
      <div>
        <label class="block text-sm mb-1">Имя</label>
        <input v-model="firstName" type="text" class="w-full border rounded-md px-3 py-2" :disabled="loading" />
        <p v-if="errors.firstName" class="text-sm text-red-600 mt-1">{{ errors.firstName }}</p>
      </div>
      <div>
        <label class="block text-sm mb-1">Фамилия</label>
        <input v-model="lastName" type="text" class="w-full border rounded-md px-3 py-2" :disabled="loading" />
        <p v-if="errors.lastName" class="text-sm text-red-600 mt-1">{{ errors.lastName }}</p>
      </div>
    </div>
    <div>
      <label class="block text-sm mb-1">Никнейм</label>
      <input v-model="username" type="text" class="w-full border rounded-md px-3 py-2" :disabled="loading" />
      <p v-if="errors.username" class="text-sm text-red-600 mt-1">{{ errors.username }}</p>
    </div>
    <div>
      <label class="block text-sm mb-1">Пароль</label>
      <input v-model="password" type="password" class="w-full border rounded-md px-3 py-2" :disabled="loading" />
      <p v-if="errors.password" class="text-sm text-red-600 mt-1">{{ errors.password }}</p>
    </div>
    <div>
      <label class="block text-sm mb-1">Подтверждение пароля</label>
      <input v-model="passwordConfirm" type="password" class="w-full border rounded-md px-3 py-2" :disabled="loading" />
      <p v-if="errors.passwordConfirm" class="text-sm text-red-600 mt-1">{{ errors.passwordConfirm }}</p>
    </div>
    <div class="flex items-center space-x-2">
      <input id="agree" v-model="agree" type="checkbox" :disabled="loading" />
      <label for="agree" class="text-sm">Я согласен с условиями</label>
    </div>
    <button type="submit" class="w-full bg-brand-600 text-white py-2 rounded-md disabled:opacity-50" :disabled="loading">Создать аккаунт</button>
    <p v-if="formError" class="text-sm text-red-600">{{ formError }}</p>
  </form>
  
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useAuthStore } from '../../stores/auth';

const emit = defineEmits<{ (e: 'success'): void }>();
const auth = useAuthStore();

const firstName = ref('');
const lastName = ref('');
const username = ref('');
const password = ref('');
const passwordConfirm = ref('');
const agree = ref(false);
const loading = ref(false);
const formError = ref('');
const errors = reactive<{ firstName?: string; lastName?: string; username?: string; password?: string; passwordConfirm?: string }>({});

function validate() {
  errors.firstName = firstName.value ? '' : 'Укажите имя';
  errors.lastName = lastName.value ? '' : 'Укажите фамилию';
  errors.username = username.value ? '' : 'Укажите никнейм';
  errors.password = password.value.length >= 6 ? '' : 'Не менее 6 символов';
  errors.passwordConfirm = passwordConfirm.value === password.value ? '' : 'Пароли не совпадают';
  if (!agree.value) {
    formError.value = 'Необходимо согласие';
  }
  return !errors.firstName && !errors.lastName && !errors.username && !errors.password && !errors.passwordConfirm && agree.value;
}

async function onSubmit() {
  formError.value = '';
  if (!validate()) return;
  loading.value = true;
  try {
    await auth.register({ firstName: firstName.value, lastName: lastName.value, username: username.value, password: password.value, passwordConfirm: passwordConfirm.value, agreements: [agree.value] });
    emit('success');
  } catch (e: any) {
    formError.value = e?.message || 'Ошибка регистрации';
  } finally {
    loading.value = false;
  }
}
</script>



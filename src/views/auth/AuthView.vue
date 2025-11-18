<template>
  <div class="flex h-screen w-full">
    <!-- Левая часть - Overview -->
    <div class="w-[672px] flex flex-col justify-center items-center pl-[152px] gap-9 box-border">
      <div class="flex items-center gap-6 m-0">
        <div class="w-[55px] h-[55px] rounded-full bg-[#e1eaf8] flex-shrink-0"></div>
        <span class="text-[3rem] font-semibold text-[#e1eaf8] whitespace-nowrap lowercase select-none self-center" style="line-height: 1;">managelog</span>
      </div>
      <p class="text-2xl font-bold text-white leading-6 text-center w-[440px] h-16 m-0 select-none">
        Управляйте проектами, аналитикой и командой в одном пространстве
      </p>
    </div>

    <!-- Правая часть - Auth Form -->
    <div class="w-[556px] flex-grow flex justify-center items-center">
      <div class="min-w-[556px] w-fit h-fit p-10 box-border flex flex-col rounded-[40px] bg-[rgba(255,255,255,0.5)]">
        <!-- Табы -->
        <div class="flex gap-[10px] mb-8">
          <button
            :class="[
              'h-12 px-6 bg-[rgba(255,255,255,0.3)] border-none rounded-full transition-all box-border flex items-center justify-center w-fit whitespace-nowrap text-2xl font-medium leading-none m-0',
              activeTab === 'login'
                ? 'bg-[url(\'/images/backgrounds/bg.jpg\')] bg-cover bg-center bg-no-repeat text-white'
                : 'text-[#040910] hover:opacity-90',
            ]"
            @click="activeTab = 'login'"
          >
            вход
          </button>
          <button
            :class="[
              'h-12 px-6 bg-[rgba(255,255,255,0.3)] border-none rounded-full transition-all box-border flex items-center justify-center w-fit whitespace-nowrap text-2xl font-medium leading-none m-0',
              activeTab === 'register'
                ? 'bg-[url(\'/images/backgrounds/bg.jpg\')] bg-cover bg-center bg-no-repeat text-white'
                : 'text-[#040910] hover:opacity-90',
            ]"
            @click="activeTab = 'register'"
          >
            регистрация
          </button>
        </div>

        <!-- Форма входа -->
        <div v-show="activeTab === 'login'" class="flex-1 overflow-y-auto scrollable-fields">
          <form @submit.prevent="handleLogin" novalidate>
            <div class="grid grid-cols-[249px_249px] gap-x-[10px] gap-y-6 pr-2">
              <div class="col-span-2 flex flex-col">
                <label class="block mb-2 text-[15px] font-medium text-white select-none">никнейм</label>
                <input
                  v-model="loginForm.username"
                  type="text"
                  autocomplete="username"
                  class="w-full h-12 px-4 py-3 bg-transparent border border-white rounded-full text-[#e5e7eb] text-sm box-border focus:outline-none focus:border-white"
                  :class="{ 'border-[#912138]': loginErrors.username }"
                  :aria-invalid="!!loginErrors.username"
                  aria-live="polite"
                  @blur="validateLoginField('username')"
                />
                <span v-if="loginErrors.username" class="text-[15px] font-normal text-[#912138] mt-1 mb-0" role="alert">
                  {{ loginErrors.username }}
                </span>
              </div>
              <div class="col-span-2 flex flex-col">
                <label class="block mb-2 text-[15px] font-medium text-white select-none">пароль</label>
                <div class="relative">
                  <input
                    v-model="loginForm.password"
                    :type="showLoginPassword ? 'text' : 'password'"
                    autocomplete="current-password"
                    class="w-full h-12 px-4 pr-12 py-3 bg-transparent border border-white rounded-full text-[#e5e7eb] text-sm box-border focus:outline-none focus:border-white"
                    :class="{ 'border-[#912138]': loginErrors.password }"
                    :aria-invalid="!!loginErrors.password"
                    aria-live="polite"
                    @blur="validateLoginField('password')"
                  />
                  <button
                    type="button"
                    @click="showLoginPassword = !showLoginPassword"
                    class="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center cursor-pointer bg-transparent border-none outline-none"
                    :aria-label="showLoginPassword ? 'Скрыть пароль' : 'Показать пароль'"
                  >
                    <svg
                      v-if="showLoginPassword"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#E1EAF8"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="w-5 h-5"
                    >
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                    <svg
                      v-else
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#E1EAF8"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="w-5 h-5"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  </button>
                </div>
                <span v-if="loginErrors.password" class="text-[15px] font-normal text-[#912138] mt-1 mb-0" role="alert">
                  {{ loginErrors.password }}
                </span>
              </div>
              <button
                type="submit"
                :disabled="isLoginLoading"
                class="w-full h-12 p-0 bg-[url('/images/backgrounds/bg.jpg')] bg-cover bg-center bg-no-repeat border-none rounded-full text-white  text-2xl font-medium cursor-pointer col-span-2 transition-opacity box-border flex items-center justify-center hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span v-if="isLoginLoading">Загрузка...</span>
                <span v-else>войти</span>
              </button>
            </div>
          </form>
        </div>

        <!-- Форма регистрации -->
        <div v-show="activeTab === 'register'" class="flex flex-col flex-1 min-h-0" style="max-height: 70vh;">
          <form @submit.prevent="handleRegister" novalidate class="flex flex-col flex-1 min-h-0">
            <div class="flex-1 overflow-y-auto mb-6 scrollable-fields">
              <div class="grid grid-cols-[249px_249px] gap-x-[10px] gap-y-6 pr-2">
              <!-- Имя -->
              <div class="flex flex-col">
                <label class="block mb-2 text-[15px] font-medium text-white select-none">имя</label>
                <input
                  v-model="registerForm.firstName"
                  type="text"
                  maxlength="24"
                  autocomplete="given-name"
                  class="w-full h-12 px-4 py-3 bg-transparent border border-white rounded-full text-[#e5e7eb] text-sm box-border focus:outline-none focus:border-white"
                  :class="{ 'border-[#912138]': registerErrors.firstName }"
                  :aria-invalid="!!registerErrors.firstName"
                  aria-live="polite"
                  @blur="validateField('firstName')"
                  @input="clearErrorIfValid('firstName')"
                />
                <span v-if="registerErrors.firstName" class=" text-[15px] font-normal text-[#912138] mt-1 mb-0" role="alert">
                  {{ registerErrors.firstName }}
                </span>
              </div>
              <!-- Фамилия -->
              <div class="flex flex-col">
                <label class="block mb-2 text-[15px] font-medium text-white select-none">фамилия</label>
                <input
                  v-model="registerForm.lastName"
                  type="text"
                  maxlength="24"
                  autocomplete="family-name"
                  class="w-full h-12 px-4 py-3 bg-transparent border border-white rounded-full text-[#e5e7eb] text-sm box-border focus:outline-none focus:border-white"
                  :class="{ 'border-[#912138]': registerErrors.lastName }"
                  :aria-invalid="!!registerErrors.lastName"
                  aria-live="polite"
                  @blur="validateField('lastName')"
                  @input="clearErrorIfValid('lastName')"
                />
                <span v-if="registerErrors.lastName" class=" text-[15px] font-normal text-[#912138] mt-1 mb-0" role="alert">
                  {{ registerErrors.lastName }}
                </span>
              </div>
              <!-- Email -->
              <div class="col-span-2 flex flex-col">
                <label class="block mb-2 text-[15px] font-medium text-white select-none">email</label>
                <input
                  v-model="registerForm.email"
                  type="email"
                  maxlength="56"
                  autocomplete="email"
                  class="w-full h-12 px-4 py-3 bg-transparent border border-white rounded-full text-[#e5e7eb] text-sm box-border focus:outline-none focus:border-white"
                  :class="{ 'border-[#912138]': registerErrors.email }"
                  :aria-invalid="!!registerErrors.email"
                  aria-live="polite"
                  @blur="validateField('email')"
                  @input="clearErrorIfValid('email')"
                />
                <span v-if="registerErrors.email" class=" text-[15px] font-normal text-[#912138] mt-1 mb-0" role="alert">
                  {{ registerErrors.email }}
                </span>
              </div>
              <!-- Никнейм -->
              <div class="col-span-2 flex flex-col">
                <label class="block mb-2 text-[15px] font-medium text-white select-none">никнейм</label>
                <input
                  v-model="registerForm.username"
                  type="text"
                  maxlength="56"
                  autocomplete="username"
                  class="w-full h-12 px-4 py-3 bg-transparent border border-white rounded-full text-[#e5e7eb] text-sm box-border focus:outline-none focus:border-white"
                  :class="{ 'border-[#912138]': registerErrors.username }"
                  :aria-invalid="!!registerErrors.username"
                  aria-live="polite"
                  @blur="validateField('username')"
                  @input="clearErrorIfValid('username')"
                />
                <span v-if="registerErrors.username" class=" text-[15px] font-normal text-[#912138] mt-1 mb-0" role="alert">
                  {{ registerErrors.username }}
                </span>
              </div>
              <!-- Пароль -->
              <div class="flex flex-col">
                <label class="block mb-2 text-[15px] font-medium text-white select-none">пароль</label>
                <div class="relative">
                  <input
                    v-model="registerForm.password"
                    :type="showRegisterPassword ? 'text' : 'password'"
                    minlength="8"
                    maxlength="24"
                    autocomplete="new-password"
                    class="w-full h-12 px-4 pr-12 py-3 bg-transparent border border-white rounded-full text-[#e5e7eb] text-sm box-border focus:outline-none focus:border-white"
                    :class="{ 'border-[#912138]': registerErrors.password }"
                    :aria-invalid="!!registerErrors.password"
                    aria-live="polite"
                    @blur="validateField('password')"
                    @input="handlePasswordInput"
                  />
                  <button
                    type="button"
                    @click="showRegisterPassword = !showRegisterPassword"
                    class="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center cursor-pointer bg-transparent border-none outline-none"
                    :aria-label="showRegisterPassword ? 'Скрыть пароль' : 'Показать пароль'"
                  >
                    <svg
                      v-if="showRegisterPassword"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#E1EAF8"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="w-5 h-5"
                    >
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                    <svg
                      v-else
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#E1EAF8"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="w-5 h-5"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  </button>
                </div>
                <span v-if="registerErrors.password" class=" text-[15px] font-normal text-[#912138] mt-1 mb-0" role="alert">
                  {{ registerErrors.password }}
                </span>
              </div>
              <!-- Повторите пароль -->
              <div class="flex flex-col">
                <label class="block mb-2 text-[15px] font-medium text-white select-none">повторите пароль</label>
                <div class="relative">
                  <input
                    v-model="registerForm.confirmPassword"
                    :type="showConfirmPassword ? 'text' : 'password'"
                    autocomplete="new-password"
                    class="w-full h-12 px-4 pr-12 py-3 bg-transparent border border-white rounded-full text-[#e5e7eb] text-sm box-border focus:outline-none focus:border-white"
                    :class="{ 'border-[#912138]': registerErrors.confirmPassword }"
                    :aria-invalid="!!registerErrors.confirmPassword"
                    aria-live="polite"
                    @blur="validateField('confirmPassword')"
                    @input="clearErrorIfValid('confirmPassword')"
                  />
                  <button
                    type="button"
                    @click="showConfirmPassword = !showConfirmPassword"
                    class="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center cursor-pointer bg-transparent border-none outline-none"
                    :aria-label="showConfirmPassword ? 'Скрыть пароль' : 'Показать пароль'"
                  >
                    <svg
                      v-if="showConfirmPassword"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#E1EAF8"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="w-5 h-5"
                    >
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                    <svg
                      v-else
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#E1EAF8"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="w-5 h-5"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  </button>
                </div>
                <span v-if="registerErrors.confirmPassword" class=" text-[15px] font-normal text-[#912138] mt-1 mb-0" role="alert">
                  {{ registerErrors.confirmPassword }}
                </span>
              </div>
              <!-- Согласие на обработку ПД -->
              <div class="col-span-2 flex flex-col" :class="{ 'border border-[#912138] rounded-[4px] p-2 -mt-2 mb-2': registerErrors.personalData }">
                <div class="flex items-center gap-3 mb-0 flex-nowrap">
                  <input
                    v-model="registerForm.personalData"
                    type="checkbox"
                    class="checkbox-input"
                    @change="handlePersonalDataChange"
                  />
                  <label class=" text-[15px] font-medium text-white cursor-default leading-6 select-none">
                    <a href="https://google.com" target="_blank" class="text-[#912138] no-underline underline-offset-[15%] underline decoration-[#912138] decoration-[6.5%] cursor-pointer hover:opacity-80">cогласие</a> на обработку персональных данных
                  </label>
                </div>
                <span v-if="registerErrors.personalData" class=" text-[15px] font-normal text-[#912138] mt-1 mb-0" role="alert">
                  {{ registerErrors.personalData }}
                </span>
              </div>
              <!-- Согласие на рассылку -->
              <!-- <div class="col-span-2 flex flex-col">
                <div class="flex items-center gap-3 mb-0 flex-nowrap">
                  <input
                    v-model="registerForm.marketing"
                    type="checkbox"
                    class="checkbox-input"
                  />
                  <label class=" text-[15px] font-medium text-white cursor-default leading-6 select-none">
                    <a href="https://google.com" target="_blank" class="text-[#912138] no-underline underline-offset-[15%] underline decoration-[#912138] decoration-[6.5%] cursor-pointer hover:opacity-80">cогласие</a> на получение рекламных сообщений
                  </label>
                </div>
              </div> -->
              <!-- Создать компанию -->
              <div class="col-span-2 flex flex-col">
                <div class="flex items-center gap-3 mb-0 flex-nowrap">
                  <input
                    v-model="registerForm.createCompany"
                    type="checkbox"
                    class="checkbox-input"
                    @change="handleCreateCompanyChange"
                  />
                  <label class=" text-[15px] font-medium text-white cursor-default leading-6 select-none">cоздать компанию</label>
                </div>
              </div>
              <!-- Название компании -->
              <div v-if="registerForm.createCompany" class="col-span-2 flex flex-col">
                <label class="block mb-2 text-[15px] font-medium text-white select-none">название компании</label>
                <input
                  v-model="registerForm.companyName"
                  type="text"
                  maxlength="56"
                  autocomplete="organization"
                  class="w-full h-12 px-4 py-3 bg-transparent border border-white rounded-full text-[#e5e7eb] text-sm box-border focus:outline-none focus:border-white"
                  :class="{ 'border-[#912138]': registerErrors.companyName }"
                  :aria-invalid="!!registerErrors.companyName"
                  aria-live="polite"
                  @blur="validateField('companyName')"
                  @input="clearErrorIfValid('companyName')"
                />
                <span v-if="registerErrors.companyName" class=" text-[15px] font-normal text-[#912138] mt-1 mb-0" role="alert">
                  {{ registerErrors.companyName }}
                </span>
              </div>
              </div>
            </div>
            <!-- Кнопка отправки -->
            <button
              type="submit"
              :disabled="isRegisterLoading"
              class="w-full h-12 p-0 bg-[url('/images/backgrounds/bg.jpg')] bg-cover bg-center bg-no-repeat border-none rounded-full text-white  text-2xl font-medium cursor-pointer transition-opacity box-border flex items-center justify-center hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
            >
              <span v-if="isRegisterLoading">Загрузка...</span>
              <span v-else>зарегистрироваться</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { login, register, saveTokens } from '../../api/auth';
import '../../styles/auth.css';

const router = useRouter();
const route = useRoute();

// Состояние табов
const activeTab = ref<'login' | 'register'>('login');

// Состояние видимости паролей
const showLoginPassword = ref(false);
const showRegisterPassword = ref(false);
const showConfirmPassword = ref(false);

// Форма входа
const loginForm = reactive({
  username: '',
  password: '',
});

const loginErrors = reactive<Record<string, string>>({});
const isLoginLoading = ref(false);

// Форма регистрации
const registerForm = reactive({
  firstName: '',
  lastName: '',
  email: '',
  username: '',
  password: '',
  confirmPassword: '',
  personalData: false,
  marketing: false,
  createCompany: false,
  companyName: '',
});

const registerErrors = reactive<Record<string, string>>({});
const isRegisterLoading = ref(false);

// Валидация
function validateName(value: string): boolean {
  return /^[а-яА-ЯёЁa-zA-Z\s-]+$/.test(value);
}

function validateEmail(value: string): boolean {
  return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value);
}

function validateUsername(value: string): boolean {
  return /^[a-zA-Z0-9._]+$/.test(value);
}

function validatePassword(value: string): boolean {
  return /^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+$/.test(value);
}

function validateCompanyName(value: string): boolean {
  return /^[а-яА-ЯёЁa-zA-Z0-9\s-]+$/.test(value);
}

function validateLoginField(field: 'username' | 'password'): void {
  const value = loginForm[field].trim();
  if (!value) {
    loginErrors[field] = 'поле обязательно для заполнения';
  } else {
    delete loginErrors[field];
  }
}

function validateField(field: keyof typeof registerForm): void {
  const value = typeof registerForm[field] === 'string' ? registerForm[field].trim() : '';
  const fieldName = field;

  if (field === 'personalData' || field === 'marketing' || field === 'createCompany') {
    return;
  }

  // Проверка обязательности
  if ((field === 'firstName' || field === 'lastName' || field === 'email' || field === 'username' || field === 'password' || field === 'confirmPassword') && !value) {
    registerErrors[field] = 'поле обязательно для заполнения';
    return;
  }

  // Для companyName проверяем обязательность только если чекбокс включен
  if (field === 'companyName') {
    if (!registerForm.createCompany) {
      delete registerErrors[field];
      return;
    }
    if (!value) {
      registerErrors[field] = 'поле обязательно для заполнения';
      return;
    }
  }

  if (!value && field !== 'companyName') {
    delete registerErrors[field];
    return;
  }

  let isValid = true;
  let errorMessage = '';

  switch (fieldName) {
    case 'firstName':
    case 'lastName':
      if (value.length > 24) {
        errorMessage = 'максимум 24 символа';
        isValid = false;
      } else if (!validateName(value)) {
        errorMessage = 'только буквы кириллицы, латиницы и символ -';
        isValid = false;
      }
      break;
    case 'email':
      if (value.length > 56) {
        errorMessage = 'максимум 56 символов';
        isValid = false;
      } else if (!validateEmail(value)) {
        errorMessage = 'только буквы латиницы и символы - _ . @';
        isValid = false;
      }
      break;
    case 'username':
      if (value.length > 56) {
        errorMessage = 'максимум 56 символов';
        isValid = false;
      } else if (!validateUsername(value)) {
        errorMessage = 'только буквы латиницы и символы . _';
        isValid = false;
      }
      break;
    case 'password':
      if (value.length < 8 || value.length > 24) {
        errorMessage = 'пароль должен быть от 8 до 24 символов';
        isValid = false;
      } else if (!validatePassword(value)) {
        errorMessage = 'только буквы латиницы и специальные символы';
        isValid = false;
      }
      break;
    case 'confirmPassword':
      if (value !== registerForm.password) {
        errorMessage = 'пароли не совпадают';
        isValid = false;
      }
      break;
    case 'companyName':
      if (value.length > 56) {
        errorMessage = 'максимум 56 символов';
        isValid = false;
      } else if (!validateCompanyName(value)) {
        errorMessage = 'только буквы кириллицы, латиницы и символ -';
        isValid = false;
      }
      break;
  }

  if (isValid) {
    delete registerErrors[field];
  } else {
    registerErrors[field] = errorMessage;
  }
}

function clearErrorIfValid(field: keyof typeof registerForm): void {
  if (registerErrors[field]) {
    validateField(field);
  }
}

function handlePasswordInput(): void {
  clearErrorIfValid('password');
  if (registerForm.confirmPassword) {
    validateField('confirmPassword');
  }
}

function handleCreateCompanyChange(): void {
  if (!registerForm.createCompany) {
    registerForm.companyName = '';
    delete registerErrors.companyName;
  }
}

function handlePersonalDataChange(): void {
  if (registerForm.personalData) {
    delete registerErrors.personalData;
  }
}

// Обработка форм
async function handleLogin(): Promise<void> {
  // Очистка ошибок
  Object.keys(loginErrors).forEach(key => delete loginErrors[key]);

  // Валидация
  validateLoginField('username');
  validateLoginField('password');

  if (Object.keys(loginErrors).length > 0) {
    // Фокус на первом поле с ошибкой
    const firstErrorField = Object.keys(loginErrors)[0] as 'username' | 'password';
    const input = document.querySelector(`input[type="${firstErrorField === 'password' ? 'password' : 'text'}"]`) as HTMLInputElement;
    input?.focus();
    return;
  }

  isLoginLoading.value = true;

  try {
    // Определяем, что введено: email или username
    const isEmail = loginForm.username.includes('@');
    const credentials = isEmail
      ? { email: loginForm.username, password: loginForm.password }
      : { login: loginForm.username, password: loginForm.password };

    const response = await login(credentials);
    saveTokens(response.tokens);
    await router.push('/dashboard');
  } catch (error: any) {
    // Обработка ошибок API
    if (error.status === 422) {
      // Ошибки валидации - показываем под полями
      const errorData = error.data;
      if (errorData?.errors) {
        Object.keys(errorData.errors).forEach(field => {
          const fieldName = field === 'login' || field === 'email' ? 'username' : field;
          loginErrors[fieldName] = Array.isArray(errorData.errors[field]) ? errorData.errors[field][0] : errorData.errors[field];
        });
      } else {
        loginErrors.username = errorData?.detail || errorData?.message || 'неверный логин или пароль';
      }
    } else if (error.status === 409) {
      loginErrors.username = 'пользователь уже существует';
    } else {
      loginErrors.username = 'неизвестная ошибка. попробуйте позже.';
    }
  } finally {
    isLoginLoading.value = false;
  }
}

// Автоматический вход по параметрам URL
async function autoLoginFromUrl(): Promise<void> {
  const urlLogin = route.query.login as string | undefined;
  const urlPassword = route.query.password as string | undefined;

  if (urlLogin && urlPassword) {
    // Заполняем форму
    loginForm.username = decodeURIComponent(urlLogin);
    loginForm.password = decodeURIComponent(urlPassword);

    // Переключаемся на вкладку входа
    activeTab.value = 'login';

    // Очищаем URL от параметров для безопасности
    router.replace({ path: route.path, query: {} });

    // Выполняем вход
    try {
      isLoginLoading.value = true;
      const isEmail = loginForm.username.includes('@');
      const credentials = isEmail
        ? { email: loginForm.username, password: loginForm.password }
        : { login: loginForm.username, password: loginForm.password };

      const response = await login(credentials);
      saveTokens(response.tokens);
      await router.push('/dashboard');
    } catch (error: any) {
      // Обработка ошибок API
      if (error.status === 422) {
        const errorData = error.data;
        if (errorData?.errors) {
          Object.keys(errorData.errors).forEach(field => {
            const fieldName = field === 'login' || field === 'email' ? 'username' : field;
            loginErrors[fieldName] = Array.isArray(errorData.errors[field]) ? errorData.errors[field][0] : errorData.errors[field];
          });
        } else {
          loginErrors.username = errorData?.detail || errorData?.message || 'неверный логин или пароль';
        }
      } else if (error.status === 409) {
        loginErrors.username = 'пользователь уже существует';
      } else {
        loginErrors.username = 'неизвестная ошибка. попробуйте позже.';
      }
    } finally {
      isLoginLoading.value = false;
    }
  }
}

// Выполняем автоматический вход при монтировании компонента
onMounted(() => {
  autoLoginFromUrl();
});

async function handleRegister(): Promise<void> {
  // Очистка ошибок
  Object.keys(registerErrors).forEach(key => delete registerErrors[key]);

  // Валидация всех полей
  validateField('firstName');
  validateField('lastName');
  validateField('email');
  validateField('username');
  validateField('password');
  validateField('confirmPassword');

  // Проверка согласия на обработку ПД
  if (!registerForm.personalData) {
    registerErrors.personalData = 'согласие на обработку персональных данных обязательно';
  }

  // Проверка названия компании
  if (registerForm.createCompany) {
    if (!registerForm.companyName.trim()) {
      registerErrors.companyName = 'поле обязательно для заполнения';
    } else {
      validateField('companyName');
    }
  } else {
    // Очищаем ошибку, если чекбокс выключен
    delete registerErrors.companyName;
  }

  if (Object.keys(registerErrors).length > 0) {
    // Фокус на первом поле с ошибкой
    const firstErrorField = Object.keys(registerErrors)[0];
    const input = document.querySelector(`input[name="${firstErrorField}"], input[id="${firstErrorField}"]`) as HTMLInputElement;
    input?.focus();
    return;
  }

  isRegisterLoading.value = true;

  try {
    // Регистрация
    await register({
      email: registerForm.email,
      login: registerForm.username,
      password: registerForm.password,
    });

    // Автоматический вход после регистрации
    try {
      const isEmail = registerForm.email.includes('@');
      const credentials = isEmail
        ? { email: registerForm.email, password: registerForm.password }
        : { login: registerForm.username, password: registerForm.password };

      const loginResponse = await login(credentials);
      saveTokens(loginResponse.tokens);
      await router.push('/dashboard');
    } catch (loginError: any) {
      // Обработка ошибок при автоматическом входе
      if (loginError.status === 422) {
        const errorData = loginError.data;
        if (errorData?.errors) {
          Object.keys(errorData.errors).forEach(field => {
            const fieldName = field === 'login' || field === 'email' ? 'username' : field;
            registerErrors[fieldName] = Array.isArray(errorData.errors[field]) ? errorData.errors[field][0] : errorData.errors[field];
          });
        } else {
          registerErrors.email = errorData?.detail || errorData?.message || 'ошибка при входе после регистрации';
        }
      } else if (loginError.status === 409) {
        registerErrors.email = 'пользователь уже существует';
      } else {
        registerErrors.email = 'неизвестная ошибка. попробуйте позже.';
      }
    }
  } catch (error: any) {
    // Обработка ошибок API при регистрации
    if (error.status === 422) {
      // Ошибки валидации - показываем под полями
      const errorData = error.data;
      if (errorData?.errors) {
        Object.keys(errorData.errors).forEach(field => {
          // Маппинг полей бэкенда на поля формы
          let fieldName = field;
          if (field === 'login') {
            fieldName = 'username';
          }
          registerErrors[fieldName] = Array.isArray(errorData.errors[field]) ? errorData.errors[field][0] : errorData.errors[field];
        });
      } else {
        registerErrors.email = errorData?.detail || errorData?.message || 'ошибка валидации данных';
      }
    } else if (error.status === 409) {
      registerErrors.email = 'пользователь уже существует';
    } else {
      registerErrors.email = 'неизвестная ошибка. попробуйте позже.';
    }
  } finally {
    isRegisterLoading.value = false;
  }
}
</script>

<style scoped>
.scrollable-fields {
  scrollbar-width: thin;
  scrollbar-color: #912138 transparent;
}

.scrollable-fields::-webkit-scrollbar {
  width: 8px;
}

.scrollable-fields::-webkit-scrollbar-track {
  background: transparent;
}

.scrollable-fields::-webkit-scrollbar-thumb {
  background-color: #912138;
  border-radius: 4px;
}

.scrollable-fields::-webkit-scrollbar-thumb:hover {
  background-color: #b83d5e;
}

/* Стили для чекбоксов */
.checkbox-input {
  width: 24px;
  height: 24px;
  min-width: 24px;
  min-height: 24px;
  cursor: pointer;
  appearance: none;
  -webkit-appearance: none;
  border: 1px solid #ffffff;
  border-radius: 4px;
  background: transparent;
  box-sizing: border-box;
  position: relative;
  margin: 0;
  flex-shrink: 0;
  transition: border-color 0.2s ease;
}

.checkbox-input:hover {
  border-color: #e1eaf8;
}

.checkbox-input:checked {
  border-color: #ffffff;
  background: transparent;
}

.checkbox-input:checked::after {
  content: '';
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%) rotate(45deg);
  width: 6px;
  height: 10px;
  border: solid #ffffff;
  border-width: 0 2px 2px 0;
  border-radius: 1px;
}
</style>


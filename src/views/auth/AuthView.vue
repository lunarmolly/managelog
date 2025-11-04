<template>
  <div class="flex h-screen w-full">
    <!-- Левая часть - Overview -->
    <div class="w-[672px] flex flex-col justify-center items-center pl-[152px] gap-9 box-border">
      <div class="w-auto h-[71px] m-0">
        <img src="/images/logos/logo.png" alt="logo" class="h-[71px] w-auto" />
      </div>
      <p class="text-2xl font-bold text-white leading-6 text-center w-[440px] h-16 m-0">
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
        <div v-show="activeTab === 'login'" class="flex-1 overflow-y-auto">
          <form @submit.prevent="handleLogin" novalidate>
            <div class="grid grid-cols-[249px_249px] gap-x-[10px] gap-y-6">
              <div class="col-span-2 flex flex-col">
                <label class="block mb-2  text-[15px] font-medium text-white">никнейм</label>
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
                <label class="block mb-2  text-[15px] font-medium text-white">пароль</label>
                <input
                  v-model="loginForm.password"
                  type="password"
                  autocomplete="current-password"
                  class="w-full h-12 px-4 py-3 bg-transparent border border-white rounded-full text-[#e5e7eb] text-sm box-border focus:outline-none focus:border-white"
                  :class="{ 'border-[#912138]': loginErrors.password }"
                  :aria-invalid="!!loginErrors.password"
                  aria-live="polite"
                  @blur="validateLoginField('password')"
                />
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
        <div v-show="activeTab === 'register'" class="flex-1 overflow-y-auto">
          <form @submit.prevent="handleRegister" novalidate>
            <div class="grid grid-cols-[249px_249px] gap-x-[10px] gap-y-6">
              <!-- Имя -->
              <div class="flex flex-col">
                <label class="block mb-2  text-[15px] font-medium text-white">имя</label>
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
                <label class="block mb-2  text-[15px] font-medium text-white">фамилия</label>
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
                <label class="block mb-2  text-[15px] font-medium text-white">email</label>
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
                <label class="block mb-2  text-[15px] font-medium text-white">никнейм</label>
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
                <label class="block mb-2  text-[15px] font-medium text-white">пароль</label>
                <input
                  v-model="registerForm.password"
                  type="password"
                  minlength="8"
                  maxlength="24"
                  autocomplete="new-password"
                  class="w-full h-12 px-4 py-3 bg-transparent border border-white rounded-full text-[#e5e7eb] text-sm box-border focus:outline-none focus:border-white"
                  :class="{ 'border-[#912138]': registerErrors.password }"
                  :aria-invalid="!!registerErrors.password"
                  aria-live="polite"
                  @blur="validateField('password')"
                  @input="handlePasswordInput"
                />
                <span v-if="registerErrors.password" class=" text-[15px] font-normal text-[#912138] mt-1 mb-0" role="alert">
                  {{ registerErrors.password }}
                </span>
              </div>
              <!-- Повторите пароль -->
              <div class="flex flex-col">
                <label class="block mb-2  text-[15px] font-medium text-white">повторите пароль</label>
                <input
                  v-model="registerForm.confirmPassword"
                  type="password"
                  autocomplete="new-password"
                  class="w-full h-12 px-4 py-3 bg-transparent border border-white rounded-full text-[#e5e7eb] text-sm box-border focus:outline-none focus:border-white"
                  :class="{ 'border-[#912138]': registerErrors.confirmPassword }"
                  :aria-invalid="!!registerErrors.confirmPassword"
                  aria-live="polite"
                  @blur="validateField('confirmPassword')"
                  @input="clearErrorIfValid('confirmPassword')"
                />
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
                    class="w-6 h-6 min-w-6 min-h-6 shrink-0 cursor-pointer appearance-none border border-white rounded-[4px] bg-transparent box-border relative m-0 checked:bg-[#85AFE4] checked:border-[#85AFE4]"
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
              <div class="col-span-2 flex flex-col">
                <div class="flex items-center gap-3 mb-0 flex-nowrap">
                  <input
                    v-model="registerForm.marketing"
                    type="checkbox"
                    class="w-6 h-6 min-w-6 min-h-6 shrink-0 cursor-pointer appearance-none border border-white rounded-[4px] bg-transparent box-border relative m-0 checked:bg-[#85AFE4] checked:border-[#85AFE4]"
                  />
                  <label class=" text-[15px] font-medium text-white cursor-default leading-6 select-none">
                    <a href="https://google.com" target="_blank" class="text-[#912138] no-underline underline-offset-[15%] underline decoration-[#912138] decoration-[6.5%] cursor-pointer hover:opacity-80">cогласие</a> на получение рекламных сообщений
                  </label>
                </div>
              </div>
              <!-- Создать компанию -->
              <div class="col-span-2 flex flex-col">
                <div class="flex items-center gap-3 mb-0 flex-nowrap">
                  <input
                    v-model="registerForm.createCompany"
                    type="checkbox"
                    class="w-6 h-6 min-w-6 min-h-6 shrink-0 cursor-pointer appearance-none border border-white rounded-[4px] bg-transparent box-border relative m-0 checked:bg-[#85AFE4] checked:border-[#85AFE4]"
                    @change="handleCreateCompanyChange"
                  />
                  <label class=" text-[15px] font-medium text-white cursor-default leading-6 select-none">cоздать компанию</label>
                </div>
              </div>
              <!-- Название компании -->
              <div v-if="registerForm.createCompany" class="col-span-2 flex flex-col">
                <label class="block mb-2  text-[15px] font-medium text-white">название компании</label>
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
              <!-- Кнопка отправки -->
              <button
                type="submit"
                :disabled="isRegisterLoading"
                class="w-full h-12 p-0 bg-[url('/images/backgrounds/bg.jpg')] bg-cover bg-center bg-no-repeat border-none rounded-full text-white  text-2xl font-medium cursor-pointer col-span-2 transition-opacity box-border flex items-center justify-center hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span v-if="isRegisterLoading">Загрузка...</span>
                <span v-else>зарегистрироваться</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { login, register, saveTokens } from '../../api/auth';
import '../../styles/auth.css';

const router = useRouter();

// Состояние табов
const activeTab = ref<'login' | 'register'>('login');

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
    loginErrors[field] = 'Поле обязательно для заполнения';
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
    registerErrors[field] = 'Поле обязательно для заполнения';
    return;
  }

  // Для companyName проверяем обязательность только если чекбокс включен
  if (field === 'companyName') {
    if (!registerForm.createCompany) {
      delete registerErrors[field];
      return;
    }
    if (!value) {
      registerErrors[field] = 'Поле обязательно для заполнения';
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
        errorMessage = 'Максимум 24 символа';
        isValid = false;
      } else if (!validateName(value)) {
        errorMessage = 'Только буквы кириллицы, латиницы и символ -';
        isValid = false;
      }
      break;
    case 'email':
      if (value.length > 56) {
        errorMessage = 'Максимум 56 символов';
        isValid = false;
      } else if (!validateEmail(value)) {
        errorMessage = 'Только буквы латиницы и символы - _ . @';
        isValid = false;
      }
      break;
    case 'username':
      if (value.length > 56) {
        errorMessage = 'Максимум 56 символов';
        isValid = false;
      } else if (!validateUsername(value)) {
        errorMessage = 'Только буквы латиницы и символы . _';
        isValid = false;
      }
      break;
    case 'password':
      if (value.length < 8 || value.length > 24) {
        errorMessage = 'Пароль должен быть от 8 до 24 символов';
        isValid = false;
      } else if (!validatePassword(value)) {
        errorMessage = 'Только буквы латиницы и специальные символы';
        isValid = false;
      }
      break;
    case 'confirmPassword':
      if (value !== registerForm.password) {
        errorMessage = 'Пароли не совпадают';
        isValid = false;
      }
      break;
    case 'companyName':
      if (value.length > 56) {
        errorMessage = 'Максимум 56 символов';
        isValid = false;
      } else if (!validateCompanyName(value)) {
        errorMessage = 'Только буквы кириллицы, латиницы и символ -';
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
    if (error.status === 422 || error.status === 400) {
      const errorData = error.data;
      if (errorData.errors) {
        // Ошибки валидации полей
        Object.keys(errorData.errors).forEach(field => {
          const fieldName = field === 'login' || field === 'email' ? 'username' : field;
          loginErrors[fieldName] = Array.isArray(errorData.errors[field]) ? errorData.errors[field][0] : errorData.errors[field];
        });
      } else {
        loginErrors.username = error.message || 'Неверный логин или пароль';
      }
    } else {
      loginErrors.username = error.message || 'Произошла ошибка при входе';
    }
  } finally {
    isLoginLoading.value = false;
  }
}

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
    registerErrors.personalData = 'Согласие на обработку персональных данных обязательно';
  }

  // Проверка названия компании
  if (registerForm.createCompany) {
    if (!registerForm.companyName.trim()) {
      registerErrors.companyName = 'Поле обязательно для заполнения';
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
    const isEmail = registerForm.email.includes('@');
    const credentials = isEmail
      ? { email: registerForm.email, password: registerForm.password }
      : { login: registerForm.username, password: registerForm.password };

    const loginResponse = await login(credentials);
    saveTokens(loginResponse.tokens);
    await router.push('/dashboard');
  } catch (error: any) {
    // Обработка ошибок API
    if (error.status === 422 || error.status === 400) {
      const errorData = error.data;
      if (errorData.errors) {
        // Ошибки валидации полей
        Object.keys(errorData.errors).forEach(field => {
          registerErrors[field] = Array.isArray(errorData.errors[field]) ? errorData.errors[field][0] : errorData.errors[field];
        });
      } else {
        registerErrors.email = error.message || 'Ошибка при регистрации';
      }
    } else {
      registerErrors.email = error.message || 'Произошла ошибка при регистрации';
    }
  } finally {
    isRegisterLoading.value = false;
  }
}
</script>


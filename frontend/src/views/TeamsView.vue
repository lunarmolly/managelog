<template>
  <div class="teams-view">
    <!-- Заголовок -->
    <div class="teams-header">
      <h1 class="teams-title">сотрудники</h1>
      <button
        v-if="canCreateEmployee"
        class="create-employee-btn"
        @click="openCreateEmployeeModal"
        type="button"
      >
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span>добавить сотрудника</span>
      </button>
    </div>

    <!-- Поиск -->
    <div v-if="!isLoading && companyUsers.length > 0" class="teams-search">
      <div class="search-container">
        <div class="search-input-wrapper">
          <svg class="search-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M21 21L16.65 16.65" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <input
            v-model="searchQuery"
            type="text"
            class="search-input"
            placeholder="поиск по имени, фамилии или отчеству..."
            autocomplete="off"
            @input="handleSearchInput"
          />
          <button
            v-if="searchQuery"
            class="search-clear"
            @click="clearSearch"
            type="button"
            aria-label="Очистить поиск"
          >
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
        <div v-if="searchQuery && filteredCompanyUsers.length === 0" class="search-no-results">
          <p>ничего не найдено</p>
        </div>
      </div>
    </div>

    <!-- Список сотрудников -->
    <div v-if="isLoading" class="teams-loading">
      <div class="loading-spinner"></div>
      <p>загрузка сотрудников...</p>
    </div>

    <div v-else-if="companyUsers.length === 0" class="teams-empty">
      <p>нет сотрудников в компании</p>
    </div>

    <div v-else class="teams-grid">
      <div
        v-for="user in filteredCompanyUsers"
        :key="user.id"
        class="team-member-card"
        :class="{ 'team-member-card--current-user': user.id === currentUserId }"
        @click="goToUserProfile(user.id)"
      >
        <!-- Аватар -->
        <div class="member-avatar">
          <img
            v-if="user.avatar"
            :src="getAvatarUrl(user.avatar)"
            :alt="getMemberFullName(user)"
          />
          <div v-else class="member-avatar-placeholder">
            {{ getMemberInitial(user) }}
          </div>
        </div>

        <!-- Информация о сотруднике -->
        <div class="member-info">
          <!-- Имя Фамилия -->
          <div class="member-name">
            {{ getMemberFullName(user) }}
          </div>

          <!-- Роль в компании (не показываем employee) -->
          <div v-if="user.companyRole && user.companyRole !== 'employee'" class="member-company-role">
            <span class="company-role-badge" :class="`company-role-badge--${user.companyRole}`">
              {{ getCompanyRoleLabel(user.companyRole) }}
            </span>
          </div>

          <!-- Роль (должность) -->
          <div v-if="user.role" class="member-role">
            {{ user.role }}
          </div>

          <!-- Email -->
          <div v-if="user.email" class="member-contact">
            {{ user.email }}
          </div>

          <!-- Телефон -->
          <div v-if="user.phone" class="member-contact">
            {{ formatPhoneNumber(user.phone) }}
          </div>
        </div>
      </div>
    </div>

    <!-- Модальное окно создания сотрудника -->
    <div
      v-if="showCreateEmployeeModal"
      class="modal-overlay"
      @click="closeCreateEmployeeModal"
    >
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2 class="modal-title">добавить сотрудника</h2>
          <button class="modal-close" @click="closeCreateEmployeeModal" type="button" aria-label="Закрыть">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>

        <form @submit.prevent="handleCreateEmployee" class="modal-form">
          <!-- Имя -->
          <div class="modal-field">
            <label class="modal-field-label">
              имя <span class="required">*</span>
            </label>
            <input
              v-model="employeeForm.firstName"
              type="text"
              class="modal-field-input"
              :class="{ 'modal-field-input--error': employeeFormErrors.firstName }"
              placeholder="введите имя"
              @input="clearFieldError('firstName')"
            />
            <div v-if="employeeFormErrors.firstName" class="modal-field-error">
              {{ employeeFormErrors.firstName }}
            </div>
          </div>

          <!-- Фамилия -->
          <div class="modal-field">
            <label class="modal-field-label">
              фамилия <span class="required">*</span>
            </label>
            <input
              v-model="employeeForm.lastName"
              type="text"
              class="modal-field-input"
              :class="{ 'modal-field-input--error': employeeFormErrors.lastName }"
              placeholder="введите фамилию"
              @input="clearFieldError('lastName')"
            />
            <div v-if="employeeFormErrors.lastName" class="modal-field-error">
              {{ employeeFormErrors.lastName }}
            </div>
          </div>

          <!-- Email -->
          <div class="modal-field">
            <label class="modal-field-label">
              email <span class="required">*</span>
            </label>
            <input
              v-model="employeeForm.email"
              type="email"
              class="modal-field-input"
              :class="{ 'modal-field-input--error': employeeFormErrors.email }"
              placeholder="email@example.com"
              @input="clearFieldError('email')"
            />
            <div v-if="employeeFormErrors.email" class="modal-field-error">
              {{ employeeFormErrors.email }}
            </div>
          </div>

          <!-- Логин -->
          <div class="modal-field">
            <label class="modal-field-label">
              логин <span class="required">*</span>
            </label>
            <input
              v-model="employeeForm.login"
              type="text"
              class="modal-field-input"
              :class="{ 'modal-field-input--error': employeeFormErrors.login }"
              placeholder="введите логин"
              @input="clearFieldError('login')"
            />
            <div v-if="employeeFormErrors.login" class="modal-field-error">
              {{ employeeFormErrors.login }}
            </div>
          </div>

          <!-- Пароль -->
          <div class="modal-field">
            <label class="modal-field-label">
              пароль <span class="required">*</span>
            </label>
            <input
              v-model="employeeForm.password"
              type="password"
              class="modal-field-input"
              :class="{ 'modal-field-input--error': employeeFormErrors.password }"
              placeholder="минимум 8 символов"
              @input="clearFieldError('password')"
            />
            <div v-if="employeeFormErrors.password" class="modal-field-error">
              {{ employeeFormErrors.password }}
            </div>
          </div>

          <!-- Роль в компании -->
          <div class="modal-field">
            <label class="modal-field-label">
              роль в компании <span class="required">*</span>
            </label>
            <select
              v-model="employeeForm.companyRole"
              class="modal-field-input"
              :class="{ 'modal-field-input--error': employeeFormErrors.companyRole }"
              @change="clearFieldError('companyRole')"
            >
              <option value="">выберите роль</option>
              <option value="employee">сотрудник</option>
              <option value="manager">руководитель</option>
              <option v-if="currentUserRole === 'owner'" value="owner">владелец</option>
            </select>
            <div v-if="employeeFormErrors.companyRole" class="modal-field-error">
              {{ employeeFormErrors.companyRole }}
            </div>
          </div>

          <!-- Отчество (необязательно) -->
          <div class="modal-field">
            <label class="modal-field-label">отчество</label>
            <input
              v-model="employeeForm.middleName"
              type="text"
              class="modal-field-input"
              :class="{ 'modal-field-input--error': employeeFormErrors.middleName }"
              placeholder="введите отчество"
              @input="clearFieldError('middleName')"
            />
            <div v-if="employeeFormErrors.middleName" class="modal-field-error">
              {{ employeeFormErrors.middleName }}
            </div>
          </div>

          <!-- Отображаемое имя (необязательно) -->
          <div class="modal-field">
            <label class="modal-field-label">отображаемое имя</label>
            <input
              v-model="employeeForm.displayName"
              type="text"
              class="modal-field-input"
              :class="{ 'modal-field-input--error': employeeFormErrors.displayName }"
              placeholder="как отображать имя"
              @input="clearFieldError('displayName')"
            />
            <div v-if="employeeFormErrors.displayName" class="modal-field-error">
              {{ employeeFormErrors.displayName }}
            </div>
          </div>

          <!-- Роль (должность) (необязательно) -->
          <div class="modal-field">
            <label class="modal-field-label">должность</label>
            <input
              v-model="employeeForm.role"
              type="text"
              class="modal-field-input"
              :class="{ 'modal-field-input--error': employeeFormErrors.role }"
              placeholder="например: разработчик"
              @input="clearFieldError('role')"
            />
            <div v-if="employeeFormErrors.role" class="modal-field-error">
              {{ employeeFormErrors.role }}
            </div>
          </div>

          <!-- Телефон (необязательно) -->
          <div class="modal-field">
            <label class="modal-field-label">телефон</label>
            <input
              v-model="employeeForm.phone"
              type="tel"
              class="modal-field-input"
              :class="{ 'modal-field-input--error': employeeFormErrors.phone }"
              placeholder="+7 (999) 999-99-99"
              @input="clearFieldError('phone')"
            />
            <div v-if="employeeFormErrors.phone" class="modal-field-error">
              {{ employeeFormErrors.phone }}
            </div>
          </div>

          <!-- Дата рождения (необязательно) -->
          <div class="modal-field">
            <label class="modal-field-label">дата рождения</label>
            <input
              v-model="employeeForm.birthDate"
              type="date"
              class="modal-field-input"
              :class="{ 'modal-field-input--error': employeeFormErrors.birthDate }"
              @input="clearFieldError('birthDate')"
            />
            <div v-if="employeeFormErrors.birthDate" class="modal-field-error">
              {{ employeeFormErrors.birthDate }}
            </div>
          </div>

          <div class="modal-actions">
            <button
              type="button"
              class="modal-btn modal-btn--secondary"
              @click="closeCreateEmployeeModal"
            >
              отмена
            </button>
            <button
              type="submit"
              class="modal-btn modal-btn--primary"
              :disabled="isCreatingEmployee"
            >
              <span v-if="isCreatingEmployee" class="btn-spinner"></span>
              <span v-else>создать</span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Модальное окно с данными для входа -->
    <div
      v-if="showCredentialsModal"
      class="modal-overlay"
      @click="closeCredentialsModal"
    >
      <div class="modal-content modal-content--credentials" @click.stop>
        <div class="modal-header">
          <h2 class="modal-title">сотрудник создан</h2>
          <button class="modal-close" @click="closeCredentialsModal" type="button" aria-label="Закрыть">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>

        <div class="credentials-content">
          <p class="credentials-message">
            Сохраните данные для входа. Они больше не будут отображаться.
          </p>

          <div class="credentials-data">
            <div class="credential-item">
              <div class="credential-label">логин:</div>
              <div class="credential-value">{{ createdEmployeeCredentials?.login }}</div>
              <button
                class="credential-copy"
                @click="copyToClipboard(createdEmployeeCredentials?.login || '')"
                type="button"
                aria-label="Копировать логин"
              >
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 1H4C2.9 1 2 1.9 2 3V17H4V3H16V1ZM19 5H8C6.9 5 6 5.9 6 7V21C6 22.1 6.9 23 8 23H19C20.1 23 21 22.1 21 21V7C21 5.9 20.1 5 19 5ZM19 21H8V7H19V21Z" fill="currentColor"/>
                </svg>
              </button>
            </div>

            <div class="credential-item">
              <div class="credential-label">пароль:</div>
              <div class="credential-value">{{ createdEmployeeCredentials?.password }}</div>
              <button
                class="credential-copy"
                @click="copyToClipboard(createdEmployeeCredentials?.password || '')"
                type="button"
                aria-label="Копировать пароль"
              >
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 1H4C2.9 1 2 1.9 2 3V17H4V3H16V1ZM19 5H8C6.9 5 6 5.9 6 7V21C6 22.1 6.9 23 8 23H19C20.1 23 21 22.1 21 21V7C21 5.9 20.1 5 19 5ZM19 21H8V7H19V21Z" fill="currentColor"/>
                </svg>
              </button>
            </div>
          </div>

          <div class="credentials-actions">
            <router-link
              to="/auth"
              class="modal-btn modal-btn--primary"
              @click="closeCredentialsModal"
            >
              перейти к входу
            </router-link>
            <button
              type="button"
              class="modal-btn modal-btn--secondary"
              @click="closeCredentialsModal"
            >
              закрыть
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { getCompanyUsers, getUserInfo, createEmployee, type CompanyUser, type CompanyRole, type CreateEmployeeRequest, type CreateEmployeeResponse } from '@/api/user';

const router = useRouter();

const companyUsers = ref<CompanyUser[]>([]);
const currentUserId = ref<string | null>(null);
const currentUserRole = ref<CompanyRole | null>(null);
const isLoading = ref(true);
const searchQuery = ref('');

// Модальные окна
const showCreateEmployeeModal = ref(false);
const showCredentialsModal = ref(false);
const isCreatingEmployee = ref(false);
const createdEmployeeCredentials = ref<CreateEmployeeResponse | null>(null);

// Форма создания сотрудника
const employeeForm = reactive<CreateEmployeeRequest & { middleName?: string; displayName?: string; birthDate?: string; role?: string; phone?: string }>({
  email: '',
  login: '',
  password: '',
  firstName: '',
  lastName: '',
  middleName: '',
  displayName: '',
  birthDate: '',
  role: '',
  phone: '',
  companyRole: 'employee' as CompanyRole,
});

const employeeFormErrors = reactive<Record<string, string>>({});

// Проверка, может ли пользователь создавать сотрудников
const canCreateEmployee = computed(() => {
  return currentUserRole.value === 'owner' || currentUserRole.value === 'manager';
});

// Отсортированный список сотрудников (текущий пользователь первым)
const sortedCompanyUsers = computed(() => {
  if (!currentUserId.value) return companyUsers.value;
  
  const currentUser = companyUsers.value.find(u => u.id === currentUserId.value);
  const otherUsers = companyUsers.value.filter(u => u.id !== currentUserId.value);
  
  return currentUser ? [currentUser, ...otherUsers] : companyUsers.value;
});

// Отфильтрованный список сотрудников по поисковому запросу
const filteredCompanyUsers = computed(() => {
  const users = sortedCompanyUsers.value;
  
  if (!searchQuery.value.trim()) {
    return users;
  }
  
  const query = searchQuery.value.toLowerCase().trim();
  
  return users.filter(user => {
    // Поиск по имени
    const firstName = (user.firstName || '').toLowerCase();
    // Поиск по фамилии
    const lastName = (user.lastName || '').toLowerCase();
    // Поиск по отчеству (middleName)
    const middleName = (user.middleName || '').toLowerCase();
    // Поиск по полному имени
    const fullName = getMemberFullName(user).toLowerCase();
    // Поиск по логину (на случай, если нет ФИО)
    const login = (user.login || '').toLowerCase();
    // Поиск по отображаемому имени
    const displayName = (user.displayName || '').toLowerCase();
    
    // Проверяем, содержит ли любое из полей поисковый запрос
    return firstName.includes(query) ||
           lastName.includes(query) ||
           middleName.includes(query) ||
           fullName.includes(query) ||
           login.includes(query) ||
           displayName.includes(query);
  });
});

// Формирование полного URL аватара
function getAvatarUrl(avatar: string | null | undefined): string {
  if (!avatar) return '';
  
  // Если уже полный URL, возвращаем как есть
  if (avatar.startsWith('http')) {
    return avatar;
  }
  
  // Если относительный путь, формируем полный URL
  const baseUrl = import.meta.env.VITE_API_BASE_URL?.replace('/api/v1', '') || 'http://localhost:3000';
  if (avatar.startsWith('/')) {
    return `${baseUrl}${avatar}`;
  }
  
  // Если просто имя файла, формируем полный путь
  return `${baseUrl}/api/v1/avatars/${avatar}`;
}

// Получение полного имени (Имя Фамилия)
function getMemberFullName(user: CompanyUser): string {
  const parts: string[] = [];
  if (user.firstName) parts.push(user.firstName);
  if (user.lastName) parts.push(user.lastName);
  
  return parts.length > 0 ? parts.join(' ') : (user.login || 'Неизвестно');
}

// Получение первой буквы для аватара
function getMemberInitial(user: CompanyUser): string {
  if (user.firstName) return user.firstName.charAt(0).toUpperCase();
  if (user.lastName) return user.lastName.charAt(0).toUpperCase();
  if (user.login) return user.login.charAt(0).toUpperCase();
  return '?';
}

// Получение текста роли в компании
function getCompanyRoleLabel(role: CompanyRole | null | undefined): string {
  if (!role) return '';
  const labels: Record<CompanyRole, string> = {
    owner: 'владелец',
    manager: 'руководитель',
    employee: 'сотрудник',
  };
  return labels[role] || role;
}

// Форматирование телефона
function formatPhoneNumber(phone: string): string {
  // Удаляем все символы кроме цифр
  const digits = phone.replace(/\D/g, '');
  
  // Если пусто, возвращаем как есть
  if (!digits) return phone;
  
  // Если номер начинается с 8, заменяем на 7
  let phoneDigits = digits.startsWith('8') ? '7' + digits.slice(1) : digits;
  
  // Если номер начинается не с 7, добавляем 7
  if (phoneDigits && !phoneDigits.startsWith('7')) {
    phoneDigits = '7' + phoneDigits;
  }
  
  // Ограничиваем длину (7 + 10 цифр = 11)
  if (phoneDigits.length > 11) {
    phoneDigits = phoneDigits.slice(0, 11);
  }
  
  // Форматируем: +7 (XXX) XXX-XX-XX
  if (phoneDigits.length === 11) {
    const code = phoneDigits.slice(1, 4);
    const part1 = phoneDigits.slice(4, 7);
    const part2 = phoneDigits.slice(7, 9);
    const part3 = phoneDigits.slice(9, 11);
    return `+7 (${code}) ${part1}-${part2}-${part3}`;
  }
  
  return phone;
}

// Обработка ввода в поле поиска
function handleSearchInput(): void {
  // Можно добавить debounce здесь, если нужно
}

// Очистка поиска
function clearSearch(): void {
  searchQuery.value = '';
}

// Открытие модального окна создания сотрудника
function openCreateEmployeeModal(): void {
  // Сброс формы
  Object.assign(employeeForm, {
    email: '',
    login: '',
    password: '',
    firstName: '',
    lastName: '',
    middleName: '',
    displayName: '',
    birthDate: '',
    role: '',
    phone: '',
    companyRole: 'employee' as CompanyRole,
  });
  Object.keys(employeeFormErrors).forEach(key => delete employeeFormErrors[key]);
  showCreateEmployeeModal.value = true;
  document.body.style.overflow = 'hidden';
}

// Закрытие модального окна создания сотрудника
function closeCreateEmployeeModal(): void {
  showCreateEmployeeModal.value = false;
  document.body.style.overflow = '';
}

// Очистка ошибки поля
function clearFieldError(field: string): void {
  if (employeeFormErrors[field]) {
    delete employeeFormErrors[field];
  }
}

// Создание сотрудника
async function handleCreateEmployee(): Promise<void> {
  // Очистка предыдущих ошибок
  Object.keys(employeeFormErrors).forEach(key => delete employeeFormErrors[key]);

  // Валидация обязательных полей
  if (!employeeForm.firstName?.trim()) {
    employeeFormErrors.firstName = 'Имя обязательно';
  }
  if (!employeeForm.lastName?.trim()) {
    employeeFormErrors.lastName = 'Фамилия обязательна';
  }
  if (!employeeForm.email?.trim()) {
    employeeFormErrors.email = 'Email обязателен';
  }
  if (!employeeForm.login?.trim()) {
    employeeFormErrors.login = 'Логин обязателен';
  }
  if (!employeeForm.password?.trim()) {
    employeeFormErrors.password = 'Пароль обязателен';
  }
  if (!employeeForm.companyRole) {
    employeeFormErrors.companyRole = 'Роль в компании обязательна';
  }

  if (Object.keys(employeeFormErrors).length > 0) {
    return;
  }

  try {
    isCreatingEmployee.value = true;

    // Подготовка данных для отправки
    const data: CreateEmployeeRequest = {
      email: employeeForm.email.trim(),
      login: employeeForm.login.trim(),
      password: employeeForm.password,
      firstName: employeeForm.firstName.trim(),
      lastName: employeeForm.lastName.trim(),
      companyRole: employeeForm.companyRole,
    };

    // Добавляем необязательные поля, если они заполнены
    if (employeeForm.middleName?.trim()) {
      data.middleName = employeeForm.middleName.trim();
    }
    if (employeeForm.displayName?.trim()) {
      data.displayName = employeeForm.displayName.trim();
    }
    if (employeeForm.birthDate) {
      data.birthDate = employeeForm.birthDate;
    }
    if (employeeForm.role?.trim()) {
      data.role = employeeForm.role.trim();
    }
    if (employeeForm.phone?.trim()) {
      data.phone = employeeForm.phone.trim();
    }

    const response = await createEmployee(data);
    
    // Сохраняем данные для входа
    createdEmployeeCredentials.value = response;
    
    // Закрываем модальное окно создания и открываем модальное окно с данными
    closeCreateEmployeeModal();
    showCredentialsModal.value = true;
    document.body.style.overflow = 'hidden';
    
    // Обновляем список сотрудников
    await loadCompanyUsers();
  } catch (error: any) {
    console.error('Ошибка создания сотрудника:', error);
    
    // Обработка ошибок валидации
    if (error.status === 422 && error.data?.errors) {
      Object.keys(error.data.errors).forEach((field) => {
        const messages = error.data.errors[field];
        if (Array.isArray(messages) && messages.length > 0) {
          employeeFormErrors[field] = messages[0];
        }
      });
    } else if (error.status === 409 && error.data?.errors) {
      Object.keys(error.data.errors).forEach((field) => {
        const messages = error.data.errors[field];
        if (Array.isArray(messages) && messages.length > 0) {
          employeeFormErrors[field] = messages[0];
        }
      });
    } else {
      employeeFormErrors.general = error.message || 'Не удалось создать сотрудника';
    }
  } finally {
    isCreatingEmployee.value = false;
  }
}

// Закрытие модального окна с данными для входа
function closeCredentialsModal(): void {
  showCredentialsModal.value = false;
  createdEmployeeCredentials.value = null;
  document.body.style.overflow = '';
}

// Копирование в буфер обмена
async function copyToClipboard(text: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(text);
    // Можно добавить уведомление об успешном копировании
  } catch (err) {
    console.error('Ошибка копирования в буфер обмена:', err);
  }
}

// Переход на страницу профиля пользователя
function goToUserProfile(userId: string): void {
  // Если это текущий пользователь, переходим на страницу редактирования профиля
  if (userId === currentUserId.value) {
    router.push('/profile');
  } else {
    router.push(`/user/${userId}`);
  }
}

// Загрузка информации о текущем пользователе
async function loadCurrentUser(): Promise<void> {
  try {
    const userInfo = await getUserInfo();
    currentUserId.value = userInfo.id;
    currentUserRole.value = userInfo.companyRole || null;
  } catch (error: any) {
    console.error('Ошибка загрузки информации о текущем пользователе:', error);
    if (error.status === 401 || error.status === 403) {
      localStorage.removeItem('auth_tokens');
      router.push('/auth');
    }
  }
}

// Загрузка сотрудников компании
async function loadCompanyUsers(): Promise<void> {
  try {
    isLoading.value = true;
    await loadCurrentUser();
    companyUsers.value = await getCompanyUsers();
  } catch (error: any) {
    console.error('Ошибка загрузки сотрудников компании:', error);
    if (error.status === 401 || error.status === 403) {
      localStorage.removeItem('auth_tokens');
      router.push('/auth');
    }
  } finally {
    isLoading.value = false;
  }
}

onMounted(() => {
  loadCompanyUsers();
});
</script>

<style scoped>
.teams-view {
  min-height: calc(100vh - 100px);
  position: relative;
  overflow: visible;
  padding: 36px;
  padding-bottom: 120px;
  z-index: 1;
  box-sizing: border-box;
}

/* Фиксированный фон через псевдоэлемент */
.teams-view::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #1a161c;
  background-image: url('/images/backgrounds/bg.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  z-index: -1;
  will-change: transform;
}

.teams-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 48px;
  max-width: 1400px;
  margin-left: auto;
  margin-right: auto;
  gap: 24px;
}

.create-employee-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: rgba(145, 33, 56, 0.5);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 40px;
  color: #e1eaf8;
  font-family: 'Involve', Arial, sans-serif;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.create-employee-btn:hover {
  background: rgba(145, 33, 56, 0.7);
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(145, 33, 56, 0.3);
}

.create-employee-btn svg {
  width: 20px;
  height: 20px;
}

.teams-title {
  font-family: 'Involve', Arial, sans-serif;
  font-size: 48px;
  font-weight: 600;
  color: #e1eaf8;
  margin: 0;
  text-transform: lowercase;
  letter-spacing: -0.02em;
}

.teams-search {
  max-width: 1400px;
  margin: 0 auto 32px;
}

.search-container {
  position: relative;
}

.search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  background: rgba(245, 245, 245, 0.5);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 40px;
  padding: 16px 24px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
}

.search-input-wrapper:focus-within {
  border-color: rgba(145, 33, 56, 0.5);
  box-shadow: 0 4px 24px rgba(145, 33, 56, 0.15);
  background: rgba(245, 245, 245, 0.7);
}

.search-icon {
  width: 20px;
  height: 20px;
  color: rgba(41, 45, 50, 0.5);
  flex-shrink: 0;
  margin-right: 12px;
  transition: color 0.3s ease;
}

.search-input-wrapper:focus-within .search-icon {
  color: rgba(145, 33, 56, 0.8);
}

.search-input {
  flex: 1;
  border: none;
  background: transparent;
  outline: none;
  font-family: 'Involve', Arial, sans-serif;
  font-size: 16px;
  font-weight: 400;
  color: #292d32;
  padding: 0;
  min-width: 0;
}

.search-input::placeholder {
  color: rgba(41, 45, 50, 0.4);
  font-weight: 400;
}

.search-clear {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  border-radius: 50%;
  color: rgba(41, 45, 50, 0.5);
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
  margin-left: 8px;
  padding: 0;
}

.search-clear:hover {
  background: rgba(41, 45, 50, 0.1);
  color: rgba(41, 45, 50, 0.8);
}

.search-clear:active {
  transform: scale(0.95);
}

.search-clear svg {
  width: 18px;
  height: 18px;
}

.search-no-results {
  margin-top: 16px;
  padding: 24px;
  text-align: center;
  color: rgba(41, 45, 50, 0.6);
  font-family: 'Involve', Arial, sans-serif;
  font-size: 16px;
  text-transform: lowercase;
}

.teams-loading,
.teams-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 80px 24px;
  color: rgba(225, 234, 248, 0.7);
  font-family: 'Involve', Arial, sans-serif;
  font-size: 18px;
  text-transform: lowercase;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(145, 33, 56, 0.3);
  border-top-color: #912138;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.teams-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 24px;
  max-width: 1400px;
  margin: 0 auto;
}

.team-member-card {
  background: rgba(245, 245, 245, 0.5);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 40px;
  padding: 24px;
  display: flex;
  gap: 24px;
  align-items: flex-start;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
  cursor: pointer;
}

.team-member-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.team-member-card--current-user {
  border: 2px solid rgba(145, 33, 56, 0.5);
  box-shadow: 0 8px 32px rgba(145, 33, 56, 0.2);
}

.team-member-card--current-user:hover {
  border-color: rgba(145, 33, 56, 0.7);
  box-shadow: 0 12px 40px rgba(145, 33, 56, 0.3);
}

.member-avatar {
  width: 120px;
  height: 120px;
  border-radius: 60px;
  overflow: hidden;
  flex-shrink: 0;
  background: rgba(145, 33, 56, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 16px rgba(145, 33, 56, 0.2);
}

.member-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.member-avatar-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #e1eaf8;
  font-size: 48px;
  font-weight: 600;
  font-family: 'Involve', Arial, sans-serif;
}

.member-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 0;
}

.member-name {
  font-family: 'Involve', Arial, sans-serif;
  font-size: 18px;
  font-weight: 500;
  color: #292d32;
  line-height: 1.3;
  word-break: break-word;
  letter-spacing: -0.01em;
}

.member-company-role {
  margin-bottom: 4px;
}

.company-role-badge {
  display: inline-block;
  padding: 6px 12px;
  border-radius: 16px;
  font-family: 'Involve', Arial, sans-serif;
  font-size: 13px;
  font-weight: 500;
  text-transform: lowercase;
  letter-spacing: 0.01em;
}

.company-role-badge--owner {
  background: rgba(145, 33, 56, 0.2);
  color: #912138;
  border: 1px solid rgba(145, 33, 56, 0.3);
}

.company-role-badge--manager {
  background: rgba(33, 150, 243, 0.2);
  color: #2196f3;
  border: 1px solid rgba(33, 150, 243, 0.3);
}

.company-role-badge--employee {
  background: rgba(41, 45, 50, 0.1);
  color: rgba(41, 45, 50, 0.7);
  border: 1px solid rgba(41, 45, 50, 0.2);
}

.member-role {
  font-family: 'Involve', Arial, sans-serif;
  font-size: 16px;
  font-weight: 400;
  color: #292d32;
  line-height: 1.4;
  opacity: 0.8;
}

.member-contact {
  font-family: 'Involve', Arial, sans-serif;
  font-size: 16px;
  font-weight: 400;
  color: #292d32;
  line-height: 1.4;
  opacity: 0.7;
  word-break: break-word;
}

/* Модальные окна */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 20px;
  overflow-y: auto;
}

.modal-content {
  background: rgba(4, 9, 16, 0.95);
  backdrop-filter: blur(30px);
  -webkit-backdrop-filter: blur(30px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 40px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  padding: 32px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  animation: modalFadeIn 0.3s ease;
}

.modal-content--credentials {
  max-width: 500px;
}

@keyframes modalFadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.modal-title {
  font-family: 'Involve', Arial, sans-serif;
  font-size: 24px;
  font-weight: 600;
  color: #e1eaf8;
  margin: 0;
  text-transform: lowercase;
}

.modal-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  color: #e1eaf8;
  cursor: pointer;
  transition: all 0.2s ease;
  padding: 0;
}

.modal-close:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: scale(1.1);
}

.modal-close svg {
  width: 18px;
  height: 18px;
}

.modal-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.modal-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.modal-field-label {
  font-family: 'Involve', Arial, sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: #e1eaf8;
  display: flex;
  align-items: center;
  gap: 4px;
}

.required {
  color: #912138;
  font-weight: 600;
}

.modal-field-input {
  width: 100%;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  color: #e1eaf8;
  font-family: 'Involve', Arial, sans-serif;
  font-size: 16px;
  transition: all 0.3s ease;
  outline: none;
}

.modal-field-input:focus {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(145, 33, 56, 0.5);
  box-shadow: 0 0 0 3px rgba(145, 33, 56, 0.1);
}

.modal-field-input--error {
  border-color: #ff6b6b;
  background: rgba(255, 107, 107, 0.1);
}

.modal-field-input::placeholder {
  color: rgba(225, 234, 248, 0.4);
}

.modal-field-error {
  font-family: 'Involve', Arial, sans-serif;
  font-size: 13px;
  color: #ff6b6b;
  margin-top: -4px;
}

.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 8px;
}

.modal-btn {
  padding: 12px 24px;
  border-radius: 40px;
  font-family: 'Involve', Arial, sans-serif;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-width: 120px;
}

.modal-btn--primary {
  background: rgba(145, 33, 56, 0.7);
  color: #e1eaf8;
  border: 1px solid rgba(145, 33, 56, 0.5);
}

.modal-btn--primary:hover:not(:disabled) {
  background: rgba(145, 33, 56, 0.9);
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(145, 33, 56, 0.4);
}

.modal-btn--secondary {
  background: rgba(255, 255, 255, 0.05);
  color: #e1eaf8;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.modal-btn--secondary:hover {
  background: rgba(255, 255, 255, 0.1);
}

.modal-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(225, 234, 248, 0.3);
  border-top-color: #e1eaf8;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

/* Модальное окно с данными для входа */
.credentials-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.credentials-message {
  font-family: 'Involve', Arial, sans-serif;
  font-size: 16px;
  color: rgba(225, 234, 248, 0.8);
  text-align: center;
  margin: 0;
  line-height: 1.5;
}

.credentials-data {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.credential-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
}

.credential-label {
  font-family: 'Involve', Arial, sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: rgba(225, 234, 248, 0.6);
  min-width: 80px;
}

.credential-value {
  flex: 1;
  font-family: 'Involve', Arial, sans-serif;
  font-size: 16px;
  font-weight: 500;
  color: #e1eaf8;
  word-break: break-all;
}

.credential-copy {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  color: #e1eaf8;
  cursor: pointer;
  transition: all 0.2s ease;
  padding: 0;
  flex-shrink: 0;
}

.credential-copy:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: scale(1.1);
}

.credential-copy svg {
  width: 16px;
  height: 16px;
}

.credentials-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.credentials-actions .modal-btn {
  flex: 1;
  text-decoration: none;
}

/* Адаптивность */
@media (max-width: 1024px) {
  .teams-grid {
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 20px;
  }
}

@media (max-width: 768px) {
  .teams-view {
    padding: 20px 16px;
    padding-bottom: 100px;
    min-height: auto;
  }

  .teams-title {
    font-size: 36px;
  }

  .teams-search {
    margin-bottom: 24px;
  }

  .search-input-wrapper {
    padding: 12px 16px;
  }

  .search-icon {
    width: 18px;
    height: 18px;
    margin-right: 10px;
  }

  .search-input {
    font-size: 14px;
  }

  .search-input::placeholder {
    font-size: 14px;
  }

  .search-clear {
    width: 28px;
    height: 28px;
  }

  .search-clear svg {
    width: 16px;
    height: 16px;
  }

  .teams-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .team-member-card {
    padding: 20px;
    gap: 20px;
  }

  .member-avatar {
    width: 100px;
    height: 100px;
    border-radius: 50px;
  }

  .member-avatar-placeholder {
    font-size: 40px;
  }

  .member-name {
    font-size: 16px;
  }

  .member-role,
  .member-contact {
    font-size: 14px;
  }

  .modal-content {
    padding: 24px;
    border-radius: 24px;
    max-height: 95vh;
  }

  .modal-title {
    font-size: 20px;
  }

  .modal-field {
    gap: 6px;
  }

  .modal-field-input {
    padding: 10px 14px;
    font-size: 14px;
  }

  .modal-actions {
    flex-direction: column;
  }

  .modal-btn {
    width: 100%;
  }

  .credentials-actions {
    flex-direction: column;
  }
}
</style>

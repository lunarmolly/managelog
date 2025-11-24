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
    <Teleport to="body">
      <div
        v-if="showCreateEmployeeModal"
        class="modal-overlay"
        @click="closeModalOnOverlay"
      >
        <div class="create-employee-modal" @click.stop>
        <div class="modal-header">
          <button class="modal-close-btn" @click="closeCreateEmployeeModal" aria-label="Закрыть">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M18 6L6 18M6 6L18 18"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
          <h2 class="modal-title">добавить сотрудника</h2>
          <div class="modal-subtitle">Заполните информацию о новом сотруднике</div>
        </div>

        <form @submit.prevent="handleCreateEmployee" class="modal-form">
          <!-- Имя -->
          <div class="modal-field">
            <label class="modal-field-label" for="employee-firstName">
              Имя
              <span class="modal-field-required">*</span>
            </label>
            <div class="modal-input-wrapper">
              <input
                id="employee-firstName"
                v-model="employeeForm.firstName"
                type="text"
                class="modal-field-input"
                :class="{ 'modal-field-input--error': employeeFormErrors.firstName }"
                placeholder="Введите имя"
                required
                @input="clearFieldError('firstName')"
              />
            </div>
            <span v-if="employeeFormErrors.firstName" class="modal-field-error">{{ employeeFormErrors.firstName }}</span>
          </div>

          <!-- Фамилия -->
          <div class="modal-field">
            <label class="modal-field-label" for="employee-lastName">
              Фамилия
              <span class="modal-field-required">*</span>
            </label>
            <div class="modal-input-wrapper">
              <input
                id="employee-lastName"
                v-model="employeeForm.lastName"
                type="text"
                class="modal-field-input"
                :class="{ 'modal-field-input--error': employeeFormErrors.lastName }"
                placeholder="Введите фамилию"
                required
                @input="clearFieldError('lastName')"
              />
            </div>
            <span v-if="employeeFormErrors.lastName" class="modal-field-error">{{ employeeFormErrors.lastName }}</span>
          </div>

          <!-- Email -->
          <div class="modal-field">
            <label class="modal-field-label" for="employee-email">
              Email
              <span class="modal-field-required">*</span>
            </label>
            <div class="modal-input-wrapper">
              <input
                id="employee-email"
                v-model="employeeForm.email"
                type="email"
                class="modal-field-input"
                :class="{ 'modal-field-input--error': employeeFormErrors.email }"
                placeholder="email@example.com"
                required
                @input="clearFieldError('email')"
              />
            </div>
            <span v-if="employeeFormErrors.email" class="modal-field-error">{{ employeeFormErrors.email }}</span>
          </div>

          <!-- Логин -->
          <div class="modal-field">
            <label class="modal-field-label" for="employee-login">
              Логин
              <span class="modal-field-required">*</span>
            </label>
            <div class="modal-input-wrapper">
              <input
                id="employee-login"
                v-model="employeeForm.login"
                type="text"
                class="modal-field-input"
                :class="{ 'modal-field-input--error': employeeFormErrors.login }"
                placeholder="Введите логин"
                required
                @input="clearFieldError('login')"
              />
            </div>
            <span v-if="employeeFormErrors.login" class="modal-field-error">{{ employeeFormErrors.login }}</span>
          </div>

          <!-- Пароль -->
          <div class="modal-field">
            <label class="modal-field-label" for="employee-password">
              Пароль
              <span class="modal-field-required">*</span>
            </label>
            <div class="modal-input-wrapper">
              <input
                id="employee-password"
                v-model="employeeForm.password"
                type="password"
                class="modal-field-input"
                :class="{ 'modal-field-input--error': employeeFormErrors.password }"
                placeholder="Минимум 8 символов"
                required
                @input="clearFieldError('password')"
              />
            </div>
            <span v-if="employeeFormErrors.password" class="modal-field-error">{{ employeeFormErrors.password }}</span>
          </div>

          <!-- Тип -->
          <div class="modal-field">
            <label class="modal-field-label" for="employee-companyRole">
              Тип
              <span class="modal-field-required">*</span>
            </label>
            <div class="modal-select-wrapper">
              <div 
                class="modal-select-btn" 
                :class="{ 
                  active: isCompanyRoleMenuOpen, 
                  'modal-select-btn--error': employeeFormErrors.companyRole,
                  'modal-select-btn--filled': employeeForm.companyRole
                }" 
                @click.stop="toggleCompanyRoleMenu"
              >
                <span class="modal-select-text">{{ companyRoleButtonText }}</span>
                <svg class="modal-select-arrow" :class="{ 'modal-select-arrow--open': isCompanyRoleMenuOpen }" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 9L12 15L18 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <div v-if="isCompanyRoleMenuOpen" class="modal-select-dropdown active" @click.stop>
                <div
                  v-for="option in companyRoleOptions"
                  :key="option.value"
                  class="modal-select-item"
                  :class="{ active: employeeForm.companyRole === option.value }"
                  @click.stop="selectCompanyRole(option.value)"
                >
                  <span>{{ option.label }}</span>
                  <svg v-if="employeeForm.companyRole === option.value" class="modal-select-check" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>
            <span v-if="employeeFormErrors.companyRole" class="modal-field-error">{{ employeeFormErrors.companyRole }}</span>
          </div>

          <!-- Роль -->
          <div class="modal-field">
            <label class="modal-field-label" for="employee-role">Роль</label>
            <div class="modal-select-wrapper">
              <div 
                class="modal-select-btn" 
                :class="{ 
                  active: isRoleMenuOpen, 
                  'modal-select-btn--error': employeeFormErrors.role,
                  'modal-select-btn--filled': employeeForm.role
                }" 
                @click.stop="toggleRoleMenu"
              >
                <span class="modal-select-text">{{ roleButtonText }}</span>
                <svg class="modal-select-arrow" :class="{ 'modal-select-arrow--open': isRoleMenuOpen }" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 9L12 15L18 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <div v-if="isRoleMenuOpen" class="modal-select-dropdown active" @click.stop>
                <div
                  v-for="option in roleOptions"
                  :key="option"
                  class="modal-select-item"
                  :class="{ active: employeeForm.role === option }"
                  @click.stop="selectRole(option)"
                >
                  <span>{{ option }}</span>
                  <svg v-if="employeeForm.role === option" class="modal-select-check" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>
            <span v-if="employeeFormErrors.role" class="modal-field-error">{{ employeeFormErrors.role }}</span>
          </div>

          <div class="modal-actions">
            <button
              type="submit"
              class="modal-btn modal-btn-create"
              :disabled="isCreatingEmployee"
            >
              <div class="modal-btn-icon">
                <svg
                  v-if="!isCreatingEmployee"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 5v14m7-7H5"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                <div v-else class="btn-spinner"></div>
              </div>
              <span>{{ isCreatingEmployee ? 'создание...' : 'создать сотрудника' }}</span>
            </button>
            <div class="modal-btn modal-btn-cancel" @click="closeCreateEmployeeModal">
              <div class="modal-btn-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M20 5C20.2652 5 20.5196 5.10536 20.7071 5.29289C20.8946 5.48043 21 5.73478 21 6C21 6.26522 20.8946 6.51957 20.7071 6.70711C20.5196 6.89464 20.2652 7 20 7H19L18.997 7.071L18.064 20.142C18.0281 20.6466 17.8023 21.1188 17.4321 21.4636C17.0619 21.8083 16.5749 22 16.069 22H7.93C7.42414 22 6.93707 21.8083 6.56688 21.4636C6.1967 21.1188 5.97092 20.6466 5.935 20.142L5.002 7.072L5 7H4C3.73478 7 3.48043 6.89464 3.29289 6.70711C3.10536 6.51957 3 6.26522 3 6C3 5.73478 3.10536 5.48043 3.29289 5.29289C3.48043 5.10536 3.73478 5 4 5H20ZM16.997 7H7.003L7.931 20H16.069L16.997 7ZM14 2C14.2652 2 14.5196 2.10536 14.7071 2.29289C14.8946 2.48043 15 2.73478 15 3C15 3.26522 14.8946 3.51957 14.7071 3.70711C14.5196 3.89464 14.2652 4 14 4H10C9.73478 4 9.48043 3.89464 9.29289 3.70711C9.10536 3.51957 9 3.26522 9 3C9 2.73478 9.10536 2.48043 9.29289 2.29289C9.48043 2.10536 9.73478 2 10 2H14Z"
                    fill="#912138"
                  />
                </svg>
              </div>
              <span>отмена</span>
            </div>
          </div>
        </form>
      </div>
      </div>
    </Teleport>

    <!-- Модальное окно с данными для входа -->
    <Teleport to="body">
      <div
        v-if="showCredentialsModal"
        class="modal-overlay"
        @click="closeCredentialsModal"
      >
        <div class="create-employee-modal create-employee-modal--credentials" @click.stop>
        <div class="modal-header">
          <button class="modal-close-btn" @click="closeCredentialsModal" aria-label="Закрыть">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M18 6L6 18M6 6L18 18"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
          <h2 class="modal-title">сотрудник создан</h2>
          <div class="modal-subtitle">Сохраните данные для входа</div>
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

          <div class="modal-actions">
            <router-link
              to="/auth"
              class="modal-btn modal-btn-create"
              @click="closeCredentialsModal"
            >
              <div class="modal-btn-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M12 5v14m7-7H5"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
              <span>перейти к входу</span>
            </router-link>
            <div class="modal-btn modal-btn-cancel" @click="closeCredentialsModal">
              <div class="modal-btn-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M18 6L6 18M6 6L18 18"
                    stroke="#912138"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
              <span>закрыть</span>
            </div>
          </div>
        </div>
      </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, reactive } from 'vue';
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
const employeeForm = reactive<CreateEmployeeRequest & { role?: string }>({
  email: '',
  login: '',
  password: '',
  firstName: '',
  lastName: '',
  role: '',
  companyRole: 'employee' as CompanyRole,
});

const employeeFormErrors = reactive<Record<string, string>>({});

// Состояния выпадающих меню
const isCompanyRoleMenuOpen = ref(false);
const isRoleMenuOpen = ref(false);

// Опции для типов
const companyRoleOptions = computed(() => {
  const options: Array<{ value: CompanyRole; label: string }> = [
    { value: 'employee', label: 'Сотрудник' },
    { value: 'manager', label: 'Руководитель' },
  ];
  if (currentUserRole.value === 'owner') {
    options.push({ value: 'owner', label: 'Владелец' });
  }
  return options;
});

// Опции для ролей
const roleOptions = ['менеджер', 'разработчик', 'дизайнер', 'аналитик'];

// Текст на кнопке выбора типа
const companyRoleButtonText = computed(() => {
  if (!employeeForm.companyRole) return '';
  const option = companyRoleOptions.value.find(opt => opt.value === employeeForm.companyRole);
  return option ? option.label : '';
});

// Текст на кнопке выбора роли
const roleButtonText = computed(() => {
  return employeeForm.role || '';
});

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
    role: '',
    companyRole: 'employee' as CompanyRole,
  });
  Object.keys(employeeFormErrors).forEach(key => delete employeeFormErrors[key]);
  isCompanyRoleMenuOpen.value = false;
  isRoleMenuOpen.value = false;
  showCreateEmployeeModal.value = true;
  document.body.style.overflow = 'hidden';
}

// Закрытие модального окна создания сотрудника
function closeCreateEmployeeModal(): void {
  showCreateEmployeeModal.value = false;
  document.body.style.overflow = '';
}

// Закрытие модального окна при клике на overlay
function closeModalOnOverlay(event: MouseEvent): void {
  const target = event.target as HTMLElement;
  if (target.classList.contains('modal-overlay')) {
    if (showCredentialsModal.value) {
      closeCredentialsModal();
    } else if (showCreateEmployeeModal.value) {
      closeCreateEmployeeModal();
    }
  }
}

// Очистка ошибки поля
function clearFieldError(field: string): void {
  if (employeeFormErrors[field]) {
    delete employeeFormErrors[field];
  }
}

// Управление меню типа
function toggleCompanyRoleMenu(): void {
  isCompanyRoleMenuOpen.value = !isCompanyRoleMenuOpen.value;
  if (isCompanyRoleMenuOpen.value) {
    isRoleMenuOpen.value = false;
  }
}

function selectCompanyRole(value: CompanyRole): void {
  employeeForm.companyRole = value;
  isCompanyRoleMenuOpen.value = false;
  clearFieldError('companyRole');
}

// Управление меню роли
function toggleRoleMenu(): void {
  isRoleMenuOpen.value = !isRoleMenuOpen.value;
  if (isRoleMenuOpen.value) {
    isCompanyRoleMenuOpen.value = false;
  }
}

function selectRole(value: string): void {
  employeeForm.role = value;
  isRoleMenuOpen.value = false;
  clearFieldError('role');
}

// Закрытие меню при клике вне
function handleClickOutsideMenus(event: MouseEvent): void {
  const target = event.target as HTMLElement;
  if (!target.closest('.modal-select-wrapper')) {
    isCompanyRoleMenuOpen.value = false;
    isRoleMenuOpen.value = false;
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
    employeeFormErrors.companyRole = 'Тип обязателен';
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
    if (employeeForm.role?.trim()) {
      data.role = employeeForm.role.trim();
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
  document.addEventListener('click', handleClickOutsideMenus);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutsideMenus);
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
  flex-wrap: wrap;
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
  align-items: stretch;
  justify-content: flex-end;
  z-index: 1000;
  overflow: hidden;
}

.create-employee-modal {
  background: rgba(4, 9, 16, 0.95);
  backdrop-filter: blur(30px);
  -webkit-backdrop-filter: blur(30px);
  border-left: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0;
  width: 100%;
  max-width: 720px;
  max-height: 100vh;
  height: 100vh;
  overflow-y: auto;
  overflow-x: hidden;
  padding: clamp(1.5rem, 3vw, 2rem) clamp(1.5rem, 3vw, 2.5rem);
  display: flex;
  flex-direction: column;
  gap: clamp(1.5rem, 3vw, 2rem);
  box-shadow: -10px 0 40px rgba(0, 0, 0, 0.5);
  box-sizing: border-box;
  animation: slideInRight 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.create-employee-modal--credentials {
  max-width: 500px;
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.modal-header {
  display: flex;
  flex-direction: column;
  gap: clamp(0.5rem, 1vw, 0.75rem);
  padding-bottom: clamp(1rem, 2vw, 1.5rem);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
}

.modal-close-btn {
  position: absolute;
  top: 0;
  right: 0;
  width: clamp(2rem, 4vw, 2.5rem);
  height: clamp(2rem, 4vw, 2.5rem);
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: clamp(0.5rem, 1vw, 0.75rem);
  color: #e1eaf8;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  flex-shrink: 0;
}

.modal-close-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
  transform: scale(1.05);
}

.modal-close-btn svg {
  width: 1.25rem;
  height: 1.25rem;
}

.modal-title {
  color: #ffffff;
  font-size: clamp(1.5rem, 3vw, 2rem);
  font-weight: 600;
  font-family: 'Involve', Arial, sans-serif;
  margin: 0;
  line-height: 1.3;
  letter-spacing: -0.02em;
}

.modal-subtitle {
  color: rgba(225, 234, 248, 0.7);
  font-size: clamp(0.875rem, 1.5vw, 1rem);
  font-weight: 400;
  font-family: 'Involve', Arial, sans-serif;
  line-height: 1.5;
  margin: 0;
}

.modal-form {
  display: flex;
  flex-direction: column;
  gap: clamp(1.5rem, 3vw, 2rem);
}

.modal-field {
  display: flex;
  flex-direction: column;
  gap: clamp(0.5rem, 1vw, 0.75rem);
}

.modal-field-label {
  font-size: clamp(0.875rem, 1.5vw, 1rem);
  font-weight: 500;
  font-family: 'Involve', Arial, sans-serif;
  color: #e1eaf8;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  line-height: 1.5;
}

.modal-field-required {
  color: #912138;
  font-weight: 600;
}

.modal-input-wrapper {
  position: relative;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: clamp(0.75rem, 1.5vw, 1rem);
  padding: clamp(0.75rem, 1.5vw, 1rem) clamp(1rem, 2vw, 1.25rem);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.modal-input-wrapper:hover {
  background: rgba(255, 255, 255, 0.07);
  border-color: rgba(255, 255, 255, 0.15);
}

.modal-input-wrapper:focus-within {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(145, 33, 56, 0.5);
  box-shadow: 0 0 0 3px rgba(145, 33, 56, 0.1);
}

.modal-field-input {
  width: 100%;
  font-size: clamp(0.9375rem, 1.5vw, 1.125rem);
  font-weight: 400;
  font-family: 'Involve', Arial, sans-serif;
  color: #ffffff;
  background: transparent;
  border: none;
  outline: none;
  padding: 0;
  line-height: 1.5;
}

.modal-field-input--error {
  color: #ff6b6b;
}

.modal-input-wrapper:has(.modal-field-input--error) {
  border-color: #ff6b6b;
  background: rgba(255, 107, 107, 0.1);
}

.modal-field-input::placeholder {
  color: rgba(225, 234, 248, 0.5);
}

.modal-input-wrapper select.modal-field-input {
  cursor: pointer;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M5 7.5L10 12.5L15 7.5' stroke='%23e1eaf8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right clamp(1rem, 2vw, 1.25rem) center;
  background-size: 20px 20px;
  padding-right: clamp(2.75rem, 5.5vw, 3.5rem);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.modal-input-wrapper:hover select.modal-field-input {
  background-image: url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M5 7.5L10 12.5L15 7.5' stroke='%23ffffff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
}

.modal-input-wrapper:focus-within select.modal-field-input {
  background-image: url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M5 7.5L10 12.5L15 7.5' stroke='%23912138' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
}

.modal-input-wrapper select.modal-field-input option {
  background: rgba(4, 9, 16, 0.98);
  color: #e1eaf8;
  padding: clamp(0.75rem, 1.5vw, 1rem) clamp(1rem, 2vw, 1.25rem);
  font-family: 'Involve', Arial, sans-serif;
  font-size: clamp(0.9375rem, 1.5vw, 1.125rem);
  border: none;
}

.modal-input-wrapper select.modal-field-input option:hover,
.modal-input-wrapper select.modal-field-input option:focus {
  background: rgba(145, 33, 56, 0.2);
}

.modal-input-wrapper select.modal-field-input option:checked {
  background: rgba(145, 33, 56, 0.3);
  color: #ffffff;
  font-weight: 500;
}

.modal-field-error {
  font-family: 'Involve', Arial, sans-serif;
  font-size: 13px;
  color: #ff6b6b;
  margin-top: 4px;
  display: flex;
  align-items: center;
  gap: 6px;
  line-height: 1.4;
}

.modal-field-error::before {
  content: '⚠';
  font-size: 14px;
}

/* Кастомные dropdown для выбора типа и роли */
.modal-select-wrapper {
  position: relative;
  width: 100%;
}

.modal-select-btn {
  height: clamp(2.75rem, 5.5vw, 3.5rem);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: clamp(0.75rem, 1.5vw, 1rem);
  background: rgba(255, 255, 255, 0.05);
  padding: 0 clamp(1rem, 2vw, 1.25rem);
  color: #e1eaf8;
  font-family: 'Involve', Arial, sans-serif;
  font-size: clamp(0.9375rem, 1.5vw, 1.125rem);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  width: 100%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: clamp(0.5rem, 1vw, 0.75rem);
  box-sizing: border-box;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.modal-select-btn:hover {
  border-color: rgba(255, 255, 255, 0.15);
  background: rgba(255, 255, 255, 0.08);
}

.modal-select-btn.active {
  border-color: rgba(145, 33, 56, 0.5);
  background: rgba(255, 255, 255, 0.08);
  box-shadow: 0 0 0 3px rgba(145, 33, 56, 0.1);
}

.modal-select-btn--error {
  border-color: #ff6b6b;
  background: rgba(255, 107, 107, 0.1);
}

.modal-select-btn--filled {
  color: #ffffff;
}

.modal-select-text {
  flex: 1;
  text-align: left;
  color: inherit;
  min-height: 1.5em;
  display: flex;
  align-items: center;
}

.modal-select-btn:not(.modal-select-btn--filled) .modal-select-text {
  color: rgba(225, 234, 248, 0.5);
}

.modal-select-arrow {
  width: 20px;
  height: 20px;
  color: rgba(225, 234, 248, 0.6);
  transition: transform 0.3s ease;
  flex-shrink: 0;
}

.modal-select-arrow--open {
  transform: rotate(180deg);
  color: rgba(145, 33, 56, 0.8);
}

.modal-select-btn:hover .modal-select-arrow {
  color: rgba(225, 234, 248, 0.9);
}

.modal-select-btn.active .modal-select-arrow {
  color: rgba(145, 33, 56, 0.8);
}

.modal-select-dropdown {
  position: absolute;
  top: calc(100% + clamp(0.5rem, 1vw, 0.75rem));
  left: 0;
  right: 0;
  background: rgba(145, 33, 56, 0.98);
  backdrop-filter: blur(30px);
  -webkit-backdrop-filter: blur(30px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: clamp(0.875rem, 1.5vw, 1.25rem);
  padding: clamp(0.75rem, 1.5vw, 1rem) 0;
  min-width: 100%;
  z-index: 10001;
  display: none;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.5);
  animation: fadeInDown 0.2s ease-out;
  max-height: calc(100vh - 200px);
  overflow-y: auto;
  overflow-x: hidden;
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-select-dropdown.active {
  display: block;
}

.modal-select-dropdown::-webkit-scrollbar {
  width: 6px;
}

.modal-select-dropdown::-webkit-scrollbar-track {
  background: transparent;
}

.modal-select-dropdown::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
}

.modal-select-dropdown::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}

.modal-select-item {
  padding: clamp(0.75rem, 1.5vw, 1rem) clamp(1.25rem, 2.5vw, 1.75rem);
  color: #e1eaf8;
  font-size: clamp(0.875rem, 1.25vw, 0.9375rem);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: clamp(0.75rem, 1.5vw, 1rem);
  border-radius: clamp(0.5rem, 1vw, 0.625rem);
  margin: 0 clamp(0.5rem, 1vw, 0.75rem) clamp(0.25rem, 0.5vw, 0.375rem);
  min-height: clamp(2.5rem, 5vw, 3rem);
  text-transform: lowercase;
}

.modal-select-item:hover {
  background: rgba(255, 255, 255, 0.12);
  color: #ffffff;
}

.modal-select-item.active {
  background: rgba(255, 255, 255, 0.18);
  color: #ffffff;
}

.modal-select-check {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  color: #ffffff;
  stroke-width: 2.5;
}

.modal-actions {
  display: flex;
  gap: clamp(0.75rem, 1.5vw, 1rem);
  padding-top: clamp(1rem, 2vw, 1.5rem);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin-top: auto;
}

.modal-btn {
  border-radius: clamp(0.75rem, 1.5vw, 1rem);
  padding: clamp(0.75rem, 1.5vw, 1rem) clamp(1.5rem, 3vw, 2rem);
  height: auto;
  min-height: clamp(2.75rem, 5.5vw, 3.5rem);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: clamp(0.5rem, 1vw, 0.75rem);
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: clamp(0.9375rem, 1.5vw, 1.125rem);
  font-weight: 500;
  font-family: 'Involve', Arial, sans-serif;
  border: 1px solid transparent;
  flex: 1;
  text-decoration: none;
}

.modal-btn-create {
  background: #912138;
  color: #ffffff;
  border-color: rgba(145, 33, 56, 0.5);
}

.modal-btn-create:hover:not(:disabled) {
  background: #a02a43;
  border-color: rgba(145, 33, 56, 0.7);
  color: #ffffff;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(145, 33, 56, 0.3);
}

.modal-btn-cancel {
  background: rgba(255, 255, 255, 0.05);
  color: #e1eaf8;
  border-color: rgba(255, 255, 255, 0.1);
}

.modal-btn-cancel:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-1px);
}

.modal-btn-icon {
  width: clamp(1.25rem, 2.5vw, 1.5rem);
  height: clamp(1.25rem, 2.5vw, 1.5rem);
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: inherit;
}

.modal-btn-icon svg {
  width: 100%;
  height: 100%;
}

.modal-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #ffffff;
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

  .teams-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
    margin-bottom: 24px;
  }

  .teams-title {
    font-size: 36px;
    width: 100%;
  }

  .create-employee-btn {
    width: 100%;
    justify-content: center;
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

  .modal-overlay {
    align-items: flex-start;
    justify-content: center;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    z-index: 10010;
  }

  .create-employee-modal {
    width: 100%;
    max-width: 100%;
    height: auto;
    min-height: 100vh;
    max-height: none;
    border-left: none;
    border-radius: 0;
    padding: 12px 16px;
    gap: 20px;
    box-shadow: none;
  }

  .modal-field {
    gap: clamp(0.5rem, 1vw, 0.75rem);
  }

  .modal-actions {
    flex-direction: column;
    gap: clamp(0.75rem, 1.5vw, 1rem);
    gap: 12px;
  }

  .modal-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>

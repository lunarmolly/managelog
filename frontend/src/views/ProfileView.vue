<template>
  <div class="profile-view">
    <!-- Заголовок -->
    <div class="profile-header">
      <h1 class="profile-title">мой профиль</h1>
      <p class="profile-subtitle">расскажите о себе — это поможет коллегам лучше вас узнать</p>
    </div>

    <!-- Основной контент -->
    <div class="profile-content">
      <!-- Левая колонка: Аватар и информация -->
      <div class="profile-sidebar">
        <div class="profile-avatar-section">
          <AvatarUploader
            ref="avatarUploaderRef"
            :avatar-url="avatarUrl"
            @upload="handleAvatarUpload"
            @delete="handleAvatarDelete"
            @error="handleAvatarError"
          />
          <div v-if="avatarError" class="avatar-error-message">{{ avatarError }}</div>
          <div class="profile-name">{{ displayName }}</div>
          <div class="profile-username">@{{ profileForm.login }}</div>
          <div class="profile-role">{{ profileForm.role || 'роль пока не выбрана' }}</div>
        </div>
        <button 
          class="save-btn" 
          @click="handleSaveProfile"
          :disabled="isSaving || isLoading"
        >
          <span v-if="isSaving" class="save-btn-content">
            <span class="save-btn-spinner"></span>
            сохраняю...
          </span>
          <span v-else class="save-btn-content">
            <svg class="save-btn-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16L21 8V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M17 21V13H7V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M7 3V8H15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            сохранить изменения
          </span>
        </button>
        <transition name="fade">
          <p v-if="saveSuccessMessage" class="save-success-message">
            <svg class="success-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            {{ saveSuccessMessage }}
          </p>
        </transition>
      </div>

      <!-- Правая колонка: Форма -->
      <div class="profile-form-container">
        <!-- Основные данные -->
        <div class="form-section">
          <div class="form-section-header">
            <h2 class="form-section-title">личная информация</h2>
            <p class="form-section-description">как вас зовут и как к вам обращаться</p>
          </div>
          
          <div class="form-grid">
            <div class="form-field">
              <label class="form-label">имя</label>
              <input
                v-model="profileForm.firstName"
                type="text"
                maxlength="24"
                class="form-input"
                :class="{ 'form-input--error': profileErrors.firstName, 'form-input--filled': profileForm.firstName }"
                placeholder="ваше имя"
              />
              <span v-if="profileErrors.firstName" class="form-error">{{ profileErrors.firstName }}</span>
            </div>
            <div class="form-field">
              <label class="form-label">фамилия</label>
              <input
                v-model="profileForm.lastName"
                type="text"
                maxlength="24"
                class="form-input"
                :class="{ 'form-input--error': profileErrors.lastName, 'form-input--filled': profileForm.lastName }"
                placeholder="ваша фамилия"
              />
              <span v-if="profileErrors.lastName" class="form-error">{{ profileErrors.lastName }}</span>
            </div>
            <div class="form-field">
              <label class="form-label">отчество</label>
              <input
                v-model="profileForm.middleName"
                type="text"
                maxlength="24"
                class="form-input"
                :class="{ 'form-input--error': profileErrors.middleName, 'form-input--filled': profileForm.middleName }"
                placeholder="если есть"
              />
              <span v-if="profileErrors.middleName" class="form-error">{{ profileErrors.middleName }}</span>
            </div>
            <div class="form-field form-field--full">
              <label class="form-label">как вас называть?</label>
              <input
                v-model="profileForm.displayName"
                type="text"
                maxlength="56"
                class="form-input"
                :class="{ 'form-input--error': profileErrors.displayName, 'form-input--filled': profileForm.displayName }"
                placeholder="например: Саша, Александр или как угодно"
              />
              <span v-if="profileErrors.displayName" class="form-error">{{ profileErrors.displayName }}</span>
              <p class="form-hint">
                <svg class="hint-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M12 16V12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M12 8H12.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                так система будет к вам обращаться. коллеги этого не увидят
              </p>
            </div>
            <div class="form-field">
              <label class="form-label">дата рождения</label>
              <input
                v-model="profileForm.birthDate"
                type="date"
                class="form-input"
                :class="{ 'form-input--error': profileErrors.birthDate, 'form-input--filled': profileForm.birthDate }"
              />
              <span v-if="profileErrors.birthDate" class="form-error">{{ profileErrors.birthDate }}</span>
            </div>
            <div class="form-field">
              <label class="form-label">ваша роль</label>
              <div class="role-select-wrapper">
                <div 
                  class="role-select-btn" 
                  :class="{ active: isRoleMenuOpen, 'form-input--error': profileErrors.role, 'form-input--filled': profileForm.role }" 
                  @click.stop="toggleRoleMenu"
                >
                  <span class="role-select-text">{{ roleButtonText }}</span>
                  <svg class="role-select-arrow" :class="{ 'role-select-arrow--open': isRoleMenuOpen }" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 9L12 15L18 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
                <div v-if="isRoleMenuOpen" class="role-dropdown-menu active" @click.stop>
                  <div
                    v-for="option in roleOptions"
                    :key="option"
                    class="role-dropdown-item"
                    :class="{ active: profileForm.role === option }"
                    @click.stop="selectRole(option)"
                  >
                    <span>{{ option }}</span>
                    <svg v-if="profileForm.role === option" class="role-check-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </div>
                </div>
              </div>
              <span v-if="profileErrors.role" class="form-error">{{ profileErrors.role }}</span>
            </div>
          </div>
        </div>

        <!-- Разделитель -->
        <div class="form-divider"></div>

        <!-- Контакты -->
        <div class="form-section">
          <div class="form-section-header">
            <h2 class="form-section-title">контакты</h2>
            <p class="form-section-description">куда отправлять уведомления и как с вами связаться</p>
          </div>
          
          <div class="form-grid">
            <div class="form-field form-field--full">
              <label class="form-label">электронная почта</label>
              <input
                v-model="profileForm.email"
                type="email"
                class="form-input"
                :class="{ 'form-input--error': profileErrors.email, 'form-input--filled': profileForm.email }"
                placeholder="ваш@email.com"
                required
              />
              <span v-if="profileErrors.email" class="form-error">{{ profileErrors.email }}</span>
            </div>
            <div class="form-field">
              <label class="form-label">телефон</label>
              <input
                v-model="profileForm.phone"
                type="tel"
                class="form-input"
                :class="{ 'form-input--error': profileErrors.phone, 'form-input--filled': profileForm.phone }"
                placeholder="+7 (999) 123-45-67"
                @input="handlePhoneInput"
                maxlength="18"
              />
              <span v-if="profileErrors.phone" class="form-error">{{ profileErrors.phone }}</span>
            </div>
          </div>
        </div>

        <!-- Разделитель -->
        <div class="form-divider"></div>

        <!-- Смена пароля -->
        <div class="form-section form-section--collapsible">
          <div class="form-section-header" @click="togglePasswordSection">
            <div>
              <h2 class="form-section-title">безопасность</h2>
              <p class="form-section-description">смена пароля — на случай, если забыли или хотите усилить защиту</p>
            </div>
            <svg class="section-toggle-icon" :class="{ 'section-toggle-icon--open': isPasswordSectionOpen }" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 9L12 15L18 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          
          <div v-show="isPasswordSectionOpen" class="form-section-content">
            <div class="form-grid">
              <div class="form-field form-field--full">
                <label class="form-label">текущий пароль</label>
                <input
                  v-model="passwordForm.currentPassword"
                  type="password"
                  class="form-input"
                  :class="{ 'form-input--error': passwordErrors.currentPassword, 'form-input--filled': passwordForm.currentPassword }"
                  placeholder="введите текущий пароль"
                />
                <span v-if="passwordErrors.currentPassword" class="form-error">{{ passwordErrors.currentPassword }}</span>
              </div>
              <div class="form-field">
                <label class="form-label">новый пароль</label>
                <input
                  v-model="passwordForm.newPassword"
                  type="password"
                  class="form-input"
                  :class="{ 'form-input--error': passwordErrors.newPassword, 'form-input--filled': passwordForm.newPassword }"
                  placeholder="минимум 8 символов"
                />
                <span v-if="passwordErrors.newPassword" class="form-error">{{ passwordErrors.newPassword }}</span>
                <p v-if="passwordForm.newPassword && !passwordErrors.newPassword" class="form-hint form-hint--success">
                  <svg class="hint-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  отличный пароль!
                </p>
              </div>
              <div class="form-field">
                <label class="form-label">повторите новый пароль</label>
                <input
                  v-model="passwordForm.confirmPassword"
                  type="password"
                  class="form-input"
                  :class="{ 'form-input--error': passwordErrors.confirmPassword, 'form-input--filled': passwordForm.confirmPassword }"
                  placeholder="для подтверждения"
                />
                <span v-if="passwordErrors.confirmPassword" class="form-error">{{ passwordErrors.confirmPassword }}</span>
              </div>
            </div>
            <p class="form-section-note">
              <svg class="note-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M12 16V12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M12 8H12.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              оставьте поля пустыми, если не хотите менять пароль
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted, type ComponentPublicInstance } from 'vue';
import { useRouter } from 'vue-router';
import { getUserInfo, updateUserInfo, type UserInfo, type UserUpdateRequest } from '@/api/user';
import { uploadAvatar, deleteAvatar } from '@/api/profile';
import { login, type LoginRequest } from '@/api/auth';
import AvatarUploader from '@/components/profile/AvatarUploader.vue';

const router = useRouter();

const profileForm = reactive<UserUpdateRequest & { login: string }>({
  email: '',
  firstName: '',
  lastName: '',
  middleName: '',
  displayName: '',
  birthDate: '',
  role: '',
  phone: '',
  login: '',
});


const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
});

const profileErrors = reactive<Record<string, string>>({});
const passwordErrors = reactive<Record<string, string>>({});
const isSaving = ref(false);
const isLoading = ref(true);
const saveSuccessMessage = ref<string>('');
const avatarUrl = ref<string | null>(null);
const avatarError = ref<string>('');
const avatarUploaderRef = ref<ComponentPublicInstance & { clearError?: () => void } | null>(null);

const roleOptions = ['менеджер', 'разработчик', 'дизайнер', 'аналитик'];
const isRoleMenuOpen = ref(false);
const isPasswordSectionOpen = ref(false);

function togglePasswordSection(): void {
  isPasswordSectionOpen.value = !isPasswordSectionOpen.value;
}

function formatPhoneNumber(value: string): string {
  // Удаляем все символы кроме цифр
  const digits = value.replace(/\D/g, '');
  
  // Если пусто, возвращаем пустую строку
  if (!digits) {
    return '';
  }
  
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
  
  // Если только одна цифра (7), возвращаем +7
  if (phoneDigits.length === 1) {
    return '+7';
  }
  
  // Форматируем: +7 (XXX) XXX-XX-XX
  const code = phoneDigits.slice(1, 4);
  const part1 = phoneDigits.slice(4, 7);
  const part2 = phoneDigits.slice(7, 9);
  const part3 = phoneDigits.slice(9, 11);
  
  let result = '+7';
  
  if (code) {
    result += ` (${code}`;
    if (part1) {
      result += `) ${part1}`;
      if (part2) {
        result += `-${part2}`;
        if (part3) {
          result += `-${part3}`;
        }
      }
    }
  }
  
  return result;
}

function handlePhoneInput(event: Event): void {
  const target = event.target as HTMLInputElement;
  const inputValue = target.value;
  const cursorPosition = target.selectionStart || 0;
  
  // Получаем отформатированное значение
  const formatted = formatPhoneNumber(inputValue);
  
  // Подсчитываем количество цифр до курсора в исходном вводе
  const digitsBeforeCursor = inputValue.substring(0, cursorPosition).replace(/\D/g, '').length;
  
  // Устанавливаем новое значение
  profileForm.phone = formatted;
  
  // Если пользователь вводил в конец, ставим курсор в конец
  const wasAtEnd = cursorPosition >= inputValue.length - 1;
  
  if (wasAtEnd) {
    // Курсор в конец
    requestAnimationFrame(() => {
      target.setSelectionRange(formatted.length, formatted.length);
    });
  } else {
    // Вычисляем новую позицию курсора на основе количества цифр
    let digitCount = 0;
    let newPosition = formatted.length;
    
    for (let i = 0; i < formatted.length; i++) {
      if (/\d/.test(formatted[i])) {
        digitCount++;
        if (digitCount >= digitsBeforeCursor) {
          newPosition = i + 1;
          break;
        }
      }
    }
    
    requestAnimationFrame(() => {
      target.setSelectionRange(newPosition, newPosition);
    });
  }
}

const roleButtonText = computed(() => {
  return profileForm.role || 'выберите роль';
});

const displayName = computed(() => {
  // Если displayName указан, используем его
  if (profileForm.displayName) return profileForm.displayName;
  // Если не указан, используем имя (firstName)
  if (profileForm.firstName) return profileForm.firstName;
  // Если и имя нет, используем логин
  if (profileForm.login) return profileForm.login;
  return 'Пользователь';
});

async function loadProfile(): Promise<void> {
  try {
    isLoading.value = true;
    const profile = await getUserInfo();
    
    console.log('Получен профиль из API:', profile);
    
    // Обязательные поля - обрабатываем null и undefined
    profileForm.email = (profile.email && profile.email.trim()) || '';
    profileForm.firstName = (profile.firstName && profile.firstName.trim()) || '';
    profileForm.lastName = (profile.lastName && profile.lastName.trim()) || '';
    profileForm.login = (profile.login && profile.login.trim()) || '';
    
    // displayName: если не указан, используем firstName
    const displayNameValue = profile.displayName || profile.firstName || '';
    profileForm.displayName = (displayNameValue && displayNameValue.trim()) || '';
    
    // Необязательные поля - обрабатываем null и undefined
    profileForm.middleName = (profile.middleName && profile.middleName.trim()) || '';
    profileForm.role = (profile.role && profile.role.trim()) || '';
    // Форматируем телефон при загрузке, если он есть
    if (profile.phone && profile.phone.trim()) {
      profileForm.phone = formatPhoneNumber(profile.phone.trim());
    } else {
      profileForm.phone = '';
    }
    
    // Аватар - формируем полный URL если есть
    if (profile.avatar) {
      // Если avatar уже содержит полный URL, используем его, иначе формируем
      if (profile.avatar.startsWith('http')) {
        avatarUrl.value = profile.avatar;
      } else if (profile.avatar.startsWith('/')) {
        // Если начинается с /, добавляем базовый URL
        const baseUrl = import.meta.env.VITE_API_BASE_URL?.replace('/api/v1', '') || 'http://localhost:3000';
        avatarUrl.value = `${baseUrl}${profile.avatar}`;
      } else {
        // Если просто имя файла, формируем полный путь
        const baseUrl = import.meta.env.VITE_API_BASE_URL?.replace('/api/v1', '') || 'http://localhost:3000';
        avatarUrl.value = `${baseUrl}/api/v1/avatars/${profile.avatar}`;
      }
    } else {
      avatarUrl.value = null;
    }
    
    // birthDate: если приходит строка, используем её; если Date, форматируем
    if (profile.birthDate) {
      if (typeof profile.birthDate === 'string') {
        // Если уже в формате YYYY-MM-DD, используем как есть
        profileForm.birthDate = profile.birthDate.split('T')[0];
      } else {
        // Если Date объект, форматируем
        const date = new Date(profile.birthDate);
        if (!isNaN(date.getTime())) {
          profileForm.birthDate = date.toISOString().split('T')[0];
        } else {
          profileForm.birthDate = '';
        }
      }
    } else {
      profileForm.birthDate = '';
    }
    
    console.log('Данные установлены в форму:', {
      email: profileForm.email,
      firstName: profileForm.firstName,
      lastName: profileForm.lastName,
      login: profileForm.login,
      displayName: profileForm.displayName,
      middleName: profileForm.middleName,
      role: profileForm.role,
      phone: profileForm.phone,
      birthDate: profileForm.birthDate,
    });
  } catch (error: any) {
    console.error('Ошибка загрузки профиля:', error);
    console.error('Детали ошибки:', {
      status: error.status,
      message: error.message,
      data: error.data,
    });
    if (error.status === 401 || error.status === 403) {
      // Токен недействителен или истек - перенаправляем на страницу авторизации
      localStorage.removeItem('auth_tokens');
      router.push('/auth');
    } else {
      alert('Не удалось загрузить профиль. Проверьте консоль для деталей.');
    }
  } finally {
    isLoading.value = false;
  }
}


function validatePasswordChange(): boolean {
  Object.keys(passwordErrors).forEach(key => delete passwordErrors[key]);

  if (!passwordForm.currentPassword && !passwordForm.newPassword && !passwordForm.confirmPassword) {
    return true; // Пароль не меняется
  }

  if (!passwordForm.currentPassword) {
    passwordErrors.currentPassword = 'Введите текущий пароль';
    return false;
  }

  if (!passwordForm.newPassword) {
    passwordErrors.newPassword = 'Введите новый пароль';
    return false;
  }

  if (passwordForm.newPassword.length < 8 || passwordForm.newPassword.length > 24) {
    passwordErrors.newPassword = 'Пароль должен быть от 8 до 24 символов';
    return false;
  }

  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    passwordErrors.confirmPassword = 'Пароли не совпадают';
    return false;
  }

  return true;
}


async function handleSaveProfile(): Promise<void> {
  // Очистка ошибок и сообщения об успехе
  Object.keys(profileErrors).forEach(key => delete profileErrors[key]);
  Object.keys(passwordErrors).forEach(key => delete passwordErrors[key]);
  saveSuccessMessage.value = '';

  // Валидация смены пароля только если пароль меняется
  const isPasswordChanging = passwordForm.newPassword && passwordForm.newPassword.trim() !== '';
  if (isPasswordChanging && !validatePasswordChange()) {
    return;
  }

  isSaving.value = true;

  try {
    const updateData: UserUpdateRequest = {};

    // Email всегда обязателен
    if (!profileForm.email || profileForm.email.trim() === '') {
      profileErrors.email = 'Email обязателен';
      isSaving.value = false;
      return;
    }
    updateData.email = profileForm.email.trim();

    // Обязательные поля - можно изменить
    if (profileForm.firstName !== undefined && profileForm.firstName !== null) {
      updateData.firstName = profileForm.firstName.trim() || undefined;
    }
    if (profileForm.lastName !== undefined && profileForm.lastName !== null) {
      updateData.lastName = profileForm.lastName.trim() || undefined;
    }

    // Пароль - отправляем ТОЛЬКО если указан новый пароль
    // Если пароль не меняется, вообще не отправляем это поле
    if (isPasswordChanging) {
      // Проверяем текущий пароль через login
      try {
        const loginData: LoginRequest = {
          login: profileForm.login,
          password: passwordForm.currentPassword,
        };
        await login(loginData);
        
        // Если текущий пароль верный, обновляем на новый
        updateData.password = passwordForm.newPassword.trim();
      } catch (error: any) {
        passwordErrors.currentPassword = 'Неверный текущий пароль';
        isSaving.value = false;
        return;
      }
    }
    // Если пароль НЕ меняется, НЕ добавляем его в updateData

    // Обработка необязательных полей - пустые строки отправляем как пустые строки для удаления
    // Отчество - всегда отправляем, даже если пустое (для удаления)
    // Отправляем пустую строку, сервер обработает как null
    const middleNameValue = profileForm.middleName !== undefined && profileForm.middleName !== null 
      ? profileForm.middleName.trim() 
      : '';
    updateData.middleName = middleNameValue;
    
    // Роль - ВСЕГДА отправляем, даже если пустая (для удаления)
    // Если поле пустое, отправляем пустую строку, сервер обработает как null
    const roleValue = profileForm.role !== undefined && profileForm.role !== null 
      ? profileForm.role.trim() 
      : '';
    // Всегда отправляем role, даже если пустой - это нужно для удаления
    updateData.role = roleValue;
    
    // Телефон - всегда отправляем, даже если пустое (для удаления)
    // Убираем форматирование перед отправкой (оставляем только цифры)
    let phoneValue = '';
    if (profileForm.phone !== undefined && profileForm.phone !== null && profileForm.phone.trim() !== '') {
      // Удаляем все символы кроме цифр
      const digits = profileForm.phone.replace(/\D/g, '');
      // Если номер начинается с 8, заменяем на 7
      phoneValue = digits.startsWith('8') ? '7' + digits.slice(1) : digits;
      // Если номер не начинается с 7, добавляем 7
      if (phoneValue && !phoneValue.startsWith('7')) {
        phoneValue = '7' + phoneValue;
      }
      // Ограничиваем длину
      if (phoneValue.length > 11) {
        phoneValue = phoneValue.slice(0, 11);
      }
    }
    updateData.phone = phoneValue || '';
    
    // Дата рождения - всегда отправляем, даже если пустая (для удаления)
    // Отправляем пустую строку, сервер обработает как null
    const birthDateValue = profileForm.birthDate !== undefined && profileForm.birthDate !== null 
      ? profileForm.birthDate.trim() 
      : '';
    updateData.birthDate = birthDateValue;
    // displayName - если пустой, отправляем undefined, сервер установит из firstName
    if (profileForm.displayName !== undefined && profileForm.displayName !== null) {
      const trimmed = profileForm.displayName.trim();
      updateData.displayName = trimmed !== '' ? trimmed : undefined;
    }

    const updatedProfile = await updateUserInfo(updateData);

    // Обновляем форму с данными с сервера
    // Email всегда должен быть, так как он обязателен
    if (updatedProfile.email) {
      profileForm.email = updatedProfile.email;
    }
    profileForm.firstName = updatedProfile.firstName || '';
    profileForm.lastName = updatedProfile.lastName || '';
    // displayName: если не указан, используем firstName
    profileForm.displayName = updatedProfile.displayName || updatedProfile.firstName || '';
    // Необязательные поля
    profileForm.middleName = updatedProfile.middleName || '';
    profileForm.role = updatedProfile.role || '';
    // Форматируем телефон после сохранения
    if (updatedProfile.phone && updatedProfile.phone.trim()) {
      profileForm.phone = formatPhoneNumber(updatedProfile.phone.trim());
    } else {
      profileForm.phone = '';
    }
    profileForm.birthDate = updatedProfile.birthDate ? updatedProfile.birthDate.split('T')[0] : '';

    // Очищаем форму пароля
    passwordForm.currentPassword = '';
    passwordForm.newPassword = '';
    passwordForm.confirmPassword = '';

    // Показываем сообщение об успехе на 5 секунд
    saveSuccessMessage.value = 'всё сохранено! изменения применены';
    setTimeout(() => {
      saveSuccessMessage.value = '';
    }, 5000);
  } catch (error: any) {
    console.error('Ошибка обновления профиля:', error);
    
    if (error.status === 0) {
      // Ошибка подключения - показываем общее сообщение, а не только для email
      const errorMessage = error.data?.detail || error.message || 'Не удалось подключиться к серверу. Убедитесь, что API сервер запущен на http://localhost:3000';
      alert(errorMessage);
      console.error('Ошибка подключения к API:', errorMessage);
    } else if (error.status === 422) {
      const errorData = error.data;
      if (errorData?.errors) {
        Object.keys(errorData.errors).forEach(field => {
          if (field === 'password') {
            passwordErrors.newPassword = Array.isArray(errorData.errors[field]) 
              ? errorData.errors[field][0] 
              : errorData.errors[field];
          } else {
            profileErrors[field] = Array.isArray(errorData.errors[field]) 
              ? errorData.errors[field][0] 
              : errorData.errors[field];
          }
        });
      } else {
        profileErrors.email = errorData?.detail || errorData?.message || 'Ошибка валидации';
      }
    } else if (error.status === 409) {
      profileErrors.email = error.data?.detail || 'Пользователь с таким email уже существует';
    } else if (error.status === 401 || error.status === 403) {
      // Токен недействителен или истек - перенаправляем на страницу авторизации
      localStorage.removeItem('auth_tokens');
      router.push('/auth');
    } else {
      profileErrors.email = error.data?.detail || error.message || 'Неизвестная ошибка';
    }
  } finally {
    isSaving.value = false;
  }
}

function toggleRoleMenu(): void {
  isRoleMenuOpen.value = !isRoleMenuOpen.value;
}

function selectRole(role: string): void {
  profileForm.role = role;
  isRoleMenuOpen.value = false;
}

function handleAvatarError(error: string): void {
  avatarError.value = error;
  // Очищаем ошибку через 5 секунд
  setTimeout(() => {
    avatarError.value = '';
  }, 5000);
}

async function handleAvatarUpload(file: File): Promise<void> {
  // Очищаем предыдущие ошибки
  avatarError.value = '';
  
  try {
    isSaving.value = true;
    const result = await uploadAvatar(file);
    
    // Обновляем URL аватара
    if (result.avatar) {
      if (result.avatar.startsWith('http')) {
        avatarUrl.value = result.avatar;
      } else if (result.avatar.startsWith('/')) {
        const baseUrl = import.meta.env.VITE_API_BASE_URL?.replace('/api/v1', '') || 'http://localhost:3000';
        avatarUrl.value = `${baseUrl}${result.avatar}`;
      } else {
        const baseUrl = import.meta.env.VITE_API_BASE_URL?.replace('/api/v1', '') || 'http://localhost:3000';
        avatarUrl.value = `${baseUrl}/api/v1/avatars/${result.avatar}`;
      }
    }
    
    // Перезагружаем профиль для получения обновленных данных
    await loadProfile();
    
    // Очищаем ошибки из компонента загрузки
    if (avatarUploaderRef.value?.clearError) {
      avatarUploaderRef.value.clearError();
    }
    
    saveSuccessMessage.value = 'аватар обновлён! выглядите отлично';
    setTimeout(() => {
      saveSuccessMessage.value = '';
    }, 5000);
  } catch (error: any) {
    console.error('Ошибка загрузки аватара:', error);
    console.error('Детали ошибки:', {
      status: error.status,
      data: error.data,
      message: error.message,
    });
    
    // Выводим ошибку на экран
    let errorMessage = 'Ошибка при загрузке аватара';
    
    if (error.status === 422) {
      // Ошибка валидации
      if (error.data?.errors?.avatar) {
        const avatarErrors = error.data.errors.avatar;
        errorMessage = Array.isArray(avatarErrors) ? avatarErrors[0] : avatarErrors;
      } else if (error.data?.detail) {
        errorMessage = error.data.detail;
      }
    } else if (error.status === 413) {
      errorMessage = 'Файл слишком большой. Максимальный размер: 50MB';
    } else if (error.status === 400) {
      if (error.data?.errors?.avatar) {
        const avatarErrors = error.data.errors.avatar;
        errorMessage = Array.isArray(avatarErrors) ? avatarErrors[0] : avatarErrors;
      } else if (error.data?.detail) {
        errorMessage = error.data.detail;
      }
    } else if (error.status === 500) {
      // Серверная ошибка - выводим детальное сообщение
      if (error.data?.detail) {
        errorMessage = error.data.detail;
      } else if (error.data?.errors?.avatar) {
        const avatarErrors = error.data.errors.avatar;
        errorMessage = Array.isArray(avatarErrors) ? avatarErrors[0] : avatarErrors;
      } else {
        errorMessage = 'Ошибка сервера при загрузке аватара';
      }
    } else if (error.data?.detail) {
      errorMessage = error.data.detail;
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    avatarError.value = errorMessage;
    
    // Очищаем ошибку через 10 секунд
    setTimeout(() => {
      avatarError.value = '';
    }, 10000);
  } finally {
    isSaving.value = false;
  }
}

async function handleAvatarDelete(): Promise<void> {
  // Очищаем предыдущие ошибки
  avatarError.value = '';
  
  try {
    isSaving.value = true;
    await deleteAvatar();
    
    avatarUrl.value = null;
    
    // Перезагружаем профиль для получения обновленных данных
    await loadProfile();
    
    // Очищаем ошибки из компонента загрузки
    if (avatarUploaderRef.value?.clearError) {
      avatarUploaderRef.value.clearError();
    }
    
    saveSuccessMessage.value = 'аватар удалён. можно загрузить новый';
    setTimeout(() => {
      saveSuccessMessage.value = '';
    }, 5000);
  } catch (error: any) {
    console.error('Ошибка удаления аватара:', error);
    
    // Выводим ошибку на экран
    const errorMessage = error.data?.detail || error.message || 'Ошибка при удалении аватара';
    avatarError.value = errorMessage;
    
    // Очищаем ошибку через 8 секунд
    setTimeout(() => {
      avatarError.value = '';
    }, 8000);
  } finally {
    isSaving.value = false;
  }
}

// Закрытие меню роли при клике вне его
function handleClickOutsideRoleMenu(event: MouseEvent): void {
  const target = event.target as HTMLElement;
  if (!target.closest('.role-select-wrapper')) {
    isRoleMenuOpen.value = false;
  }
}

onMounted(() => {
  loadProfile();
  document.addEventListener('click', handleClickOutsideRoleMenu);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutsideRoleMenu);
});
</script>

<style scoped>
.profile-view {
  min-height: 100vh;
  background-color: #1a161c;
  background-image: url('/images/backgrounds/bg.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  padding: 36px;
  position: relative;
  overflow: visible;
}

.profile-header {
  text-align: center;
  margin-bottom: 48px;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}

.profile-title {
  font-family: 'Involve', Arial, sans-serif;
  font-size: 48px;
  font-weight: 600;
  color: #e1eaf8;
  margin: 0 0 12px 0;
  text-transform: lowercase;
  letter-spacing: -0.02em;
}

.profile-subtitle {
  font-family: 'Involve', Arial, sans-serif;
  font-size: 18px;
  font-weight: 400;
  color: rgba(225, 234, 248, 0.7);
  margin: 0;
  line-height: 1.5;
}

.profile-subtitle {
  font-family: 'Involve', Arial, sans-serif;
  font-size: 20px;
  font-weight: 400;
  color: #e1eaf8;
  margin: 0;
}

.profile-content {
  display: flex;
  gap: 24px;
  align-items: flex-start;
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  align-content: flex-start;
}

.profile-sidebar {
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex-shrink: 0;
  width: 283px;
  position: sticky;
  top: 100px;
  align-self: flex-start;
  height: fit-content;
  z-index: 10;
  will-change: transform;
}

.profile-avatar-section {
  background: rgba(225, 234, 248, 0.5);
  border-radius: 40px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.profile-avatar-container {
  width: 200px;
  height: 200px;
  border-radius: 100px;
  background: #d9d9d9;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 45px 45.3px 11px rgba(145, 33, 56, 0.4);
  overflow: hidden;
}

.profile-avatar {
  width: 129px;
  height: 129px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.profile-avatar svg {
  width: 100%;
  height: 100%;
}

.change-photo-btn {
  background: rgba(41, 45, 50, 0.3);
  border: none;
  border-radius: 40px;
  padding: 12px 24px;
  color: #e1eaf8;
  font-family: 'Involve', Arial, sans-serif;
  font-size: 20px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s ease;
  text-transform: lowercase;
}

.change-photo-btn:hover {
  background: rgba(41, 45, 50, 0.5);
}

.profile-name {
  font-family: 'Involve', Arial, sans-serif;
  font-size: 20px;
  font-weight: 500;
  color: #292d32;
  text-align: center;
}

.profile-username {
  font-family: 'Involve', Arial, sans-serif;
  font-size: 16px;
  font-weight: 400;
  color: #292d32;
  text-align: center;
}

.profile-role {
  background: rgba(41, 45, 50, 0.3);
  border-radius: 40px;
  padding: 12px 24px;
  font-family: 'Involve', Arial, sans-serif;
  font-size: 16px;
  font-weight: 400;
  color: #e1eaf8;
  text-align: center;
  width: 100%;
  min-height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.save-btn {
  background: #912138;
  border: none;
  border-radius: 40px;
  padding: 12px 24px;
  color: white;
  font-family: 'Involve', Arial, sans-serif;
  font-size: 18px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  text-transform: lowercase;
  width: 100%;
  min-height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-shadow: 0 4px 12px rgba(145, 33, 56, 0.3);
}

.save-btn:hover:not(:disabled) {
  background: #a82a42;
  box-shadow: 0 6px 16px rgba(145, 33, 56, 0.4);
  transform: translateY(-1px);
}

.save-btn:active:not(:disabled) {
  transform: translateY(0);
}

.save-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.save-btn-content {
  display: flex;
  align-items: center;
  gap: 8px;
}

.save-btn-icon {
  width: 20px;
  height: 20px;
}

.save-btn-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.save-success-message {
  font-family: 'Involve', Arial, sans-serif;
  font-size: 14px;
  color: #4CAF50;
  text-align: center;
  margin-top: 12px;
  padding: 12px 16px;
  background: rgba(76, 175, 80, 0.15);
  border: 1px solid rgba(76, 175, 80, 0.3);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  animation: fadeIn 0.3s ease;
}

.success-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.avatar-error-message {
  font-family: 'Involve', Arial, sans-serif;
  font-size: 14px;
  color: #ff4444;
  text-align: center;
  margin-top: 12px;
  padding: 8px 16px;
  background: rgba(255, 68, 68, 0.1);
  border: 1px solid rgba(255, 68, 68, 0.3);
  border-radius: 8px;
  width: 100%;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.profile-form-container {
  flex: 1;
  background: rgba(145, 33, 56, 0.5);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 40px;
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 32px;
  border: 1px solid rgba(225, 234, 248, 0.1);
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-section-header {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 4px;
}

.form-section--collapsible .form-section-header {
  cursor: pointer;
  padding: 8px;
  margin: -8px;
  border-radius: 12px;
  transition: background 0.2s ease;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
}

.form-section--collapsible .form-section-header:hover {
  background: rgba(255, 255, 255, 0.05);
}

.form-section-content {
  margin-top: 8px;
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.section-toggle-icon {
  width: 24px;
  height: 24px;
  color: #e1eaf8;
  transition: transform 0.3s ease;
  flex-shrink: 0;
  margin-top: 4px;
}

.section-toggle-icon--open {
  transform: rotate(180deg);
}

.form-section-title {
  font-family: 'Involve', Arial, sans-serif;
  font-size: 24px;
  font-weight: 600;
  color: #e1eaf8;
  margin: 0;
  text-transform: lowercase;
  letter-spacing: -0.01em;
}

.form-section-description {
  font-family: 'Involve', Arial, sans-serif;
  font-size: 15px;
  font-weight: 400;
  color: rgba(225, 234, 248, 0.7);
  margin: 0;
  line-height: 1.5;
}

.form-section-note {
  font-family: 'Involve', Arial, sans-serif;
  font-size: 14px;
  font-weight: 400;
  color: rgba(225, 234, 248, 0.6);
  margin: 16px 0 0 0;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  line-height: 1.5;
}

.note-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  opacity: 0.7;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-field--full {
  grid-column: 1 / -1;
}

.form-label {
  font-family: 'Involve', Arial, sans-serif;
  font-size: 16px;
  font-weight: 500;
  color: #e1eaf8;
  text-transform: lowercase;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.form-label-required {
  font-size: 12px;
  font-weight: 400;
  color: #ff6b6b;
  text-transform: lowercase;
}

.form-label-optional {
  font-size: 12px;
  font-weight: 400;
  color: rgba(225, 234, 248, 0.5);
  text-transform: lowercase;
}

.form-label-hint {
  font-size: 12px;
  font-weight: 400;
  color: rgba(225, 234, 248, 0.6);
  text-transform: lowercase;
}

.form-input {
  height: 48px;
  border: 1.5px solid rgba(225, 234, 248, 0.3);
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.05);
  padding: 0 18px;
  color: #e1eaf8;
  font-family: 'Involve', Arial, sans-serif;
  font-size: 16px;
  transition: all 0.2s ease;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.form-input:hover {
  border-color: rgba(225, 234, 248, 0.5);
  background: rgba(255, 255, 255, 0.08);
}

.form-input:focus {
  outline: none;
  border-color: #912138;
  background: rgba(255, 255, 255, 0.1);
  box-shadow: 0 0 0 3px rgba(145, 33, 56, 0.2);
}

.form-input--filled {
  border-color: rgba(145, 33, 56, 0.5);
}

.form-input--error {
  border-color: #ff4444;
  background: rgba(255, 68, 68, 0.1);
}

.form-input--error:focus {
  box-shadow: 0 0 0 3px rgba(255, 68, 68, 0.2);
}

.form-input::placeholder {
  color: rgba(225, 234, 248, 0.4);
  font-style: italic;
}

.role-select-wrapper {
  position: relative;
  width: 100%;
}

.role-select-btn {
  height: 48px;
  border: 1.5px solid rgba(225, 234, 248, 0.3);
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.05);
  padding: 0 18px;
  color: #e1eaf8;
  font-family: 'Involve', Arial, sans-serif;
  font-size: 16px;
  transition: all 0.2s ease;
  width: 100%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  box-sizing: border-box;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.role-select-btn:hover {
  border-color: rgba(225, 234, 248, 0.5);
  background: rgba(255, 255, 255, 0.08);
}

.role-select-arrow {
  width: 20px;
  height: 20px;
  color: rgba(225, 234, 248, 0.6);
  transition: transform 0.3s ease;
  flex-shrink: 0;
}

.role-select-arrow--open {
  transform: rotate(180deg);
}

.role-select-btn:hover {
  border-color: rgba(225, 234, 248, 0.8);
}

.role-select-btn:focus {
  outline: none;
  border-color: #912138;
}

.role-select-btn.active {
  border-color: #912138;
}

.role-select-btn.form-input--error {
  border-color: #ff4444;
}

.role-select-text {
  flex: 1;
  text-align: left;
  color: #e1eaf8;
}

.role-dropdown-menu {
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

.role-dropdown-menu.active {
  display: block;
}

.role-dropdown-menu::-webkit-scrollbar {
  width: 6px;
}

.role-dropdown-menu::-webkit-scrollbar-track {
  background: transparent;
}

.role-dropdown-menu::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
}

.role-dropdown-menu::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}

.role-dropdown-item {
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

.role-dropdown-item:hover {
  background: rgba(255, 255, 255, 0.12);
  color: #ffffff;
}

.role-dropdown-item.active {
  background: rgba(255, 255, 255, 0.18);
  color: #ffffff;
}

.role-check-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}


.form-error {
  font-family: 'Involve', Arial, sans-serif;
  font-size: 13px;
  color: #ff6b6b;
  margin-top: 2px;
  display: flex;
  align-items: center;
  gap: 6px;
  line-height: 1.4;
}

.form-error::before {
  content: '⚠';
  font-size: 14px;
}

.form-hint {
  font-family: 'Involve', Arial, sans-serif;
  font-size: 13px;
  font-weight: 400;
  color: rgba(225, 234, 248, 0.6);
  margin: 4px 0 0 0;
  display: flex;
  align-items: center;
  gap: 6px;
  line-height: 1.4;
}

.form-hint--success {
  color: #4CAF50;
}

.hint-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  opacity: 0.7;
}

.form-divider {
  height: 1px;
  background: rgba(225, 234, 248, 0.3);
  width: 100%;
  margin: 12px 0;
}

@media (max-width: 1024px) {
  .profile-content {
    flex-direction: column;
  }

  .profile-sidebar {
    width: 100%;
    position: relative;
    top: 0;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .profile-view {
    padding: 20px 16px;
  }

  .profile-title {
    font-size: 36px;
  }

  .profile-subtitle {
    font-size: 16px;
  }

  .profile-avatar-container {
    width: 150px;
    height: 150px;
  }

  .profile-form-container {
    padding: 20px;
  }
}
</style>


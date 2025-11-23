<template>
  <div class="profile-view">
    <!-- Заголовок -->
    <div class="profile-header">
      <h1 class="profile-title">профиль</h1>
      <p class="profile-subtitle">рады видеть вас</p>
    </div>

    <!-- Основной контент -->
    <div class="profile-content">
      <!-- Левая колонка: Аватар и информация -->
      <div class="profile-sidebar">
        <div class="profile-avatar-section">
          <div class="profile-avatar-container">
            <div class="profile-avatar">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" fill="#912138"/>
                <path d="M12.0002 14.5C6.99016 14.5 2.95016 17.86 2.95016 22C2.95016 22.28 3.17016 22.5 3.45016 22.5H20.5502C20.8302 22.5 21.0502 22.28 21.0502 22C21.0502 17.86 17.0102 14.5 12.0002 14.5Z" fill="#912138"/>
              </svg>
            </div>
          </div>
          <button class="change-photo-btn" @click="handleChangePhoto">
            изменить фото
          </button>
          <div class="profile-name">{{ displayName }}</div>
          <div class="profile-username">@{{ profileForm.login }}</div>
          <div class="profile-role">{{ profileForm.role || 'роль не указана' }}</div>
        </div>
        <button 
          class="save-btn" 
          @click="handleSaveProfile"
          :disabled="isSaving"
        >
          <span v-if="isSaving">Сохранение...</span>
          <span v-else>сохранить</span>
        </button>
      </div>

      <!-- Правая колонка: Форма -->
      <div class="profile-form-container">
        <!-- Основные данные -->
        <div class="form-section">
          <h2 class="form-section-title">основные данные</h2>
          <p class="form-section-description">вы так красивы сегодня! есть обновления?</p>
          
          <div class="form-row">
            <div class="form-field">
              <label class="form-label">имя</label>
              <input
                v-model="profileForm.firstName"
                type="text"
                maxlength="24"
                class="form-input"
                :class="{ 'form-input--error': profileErrors.firstName }"
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
                :class="{ 'form-input--error': profileErrors.lastName }"
              />
              <span v-if="profileErrors.lastName" class="form-error">{{ profileErrors.lastName }}</span>
            </div>
          </div>

          <div class="form-row">
            <div class="form-field">
              <label class="form-label">отчество</label>
              <input
                v-model="profileForm.middleName"
                type="text"
                maxlength="24"
                class="form-input"
                :class="{ 'form-input--error': profileErrors.middleName }"
              />
              <span v-if="profileErrors.middleName" class="form-error">{{ profileErrors.middleName }}</span>
            </div>
            <div class="form-field">
              <label class="form-label">как вас называть?</label>
              <input
                v-model="profileForm.displayName"
                type="text"
                maxlength="56"
                class="form-input"
                :class="{ 'form-input--error': profileErrors.displayName }"
              />
              <span v-if="profileErrors.displayName" class="form-error">{{ profileErrors.displayName }}</span>
              <p class="form-hint">так система будет обращаться к вам (ваши коллеги и руководители не увидят)</p>
            </div>
          </div>

          <div class="form-row">
            <div class="form-field">
              <label class="form-label">дата рождения</label>
              <input
                v-model="profileForm.birthDate"
                type="date"
                class="form-input"
                :class="{ 'form-input--error': profileErrors.birthDate }"
              />
              <span v-if="profileErrors.birthDate" class="form-error">{{ profileErrors.birthDate }}</span>
            </div>
            <div class="form-field">
              <label class="form-label">роль</label>
              <div class="role-input-wrapper">
                <input
                  v-model="profileForm.role"
                  type="text"
                  maxlength="50"
                  class="form-input"
                  :class="{ 'form-input--error': profileErrors.role }"
                  placeholder="выберите или введите свою роль"
                  @focus="showRoleDropdown = true"
                  @blur="handleRoleBlur"
                  @input="filterRoleOptions"
                />
                <div v-if="showRoleDropdown && filteredRoleOptions.length > 0" class="role-dropdown">
                  <div
                    v-for="option in filteredRoleOptions"
                    :key="option"
                    class="role-option"
                    @mousedown.prevent="selectRole(option)"
                  >
                    {{ option }}
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
          <h2 class="form-section-title">контакты</h2>
          <p class="form-section-description">используются для уведомлений и связи при необходимости</p>
          
          <div class="form-row">
            <div class="form-field">
              <label class="form-label">почта</label>
              <input
                v-model="profileForm.email"
                type="email"
                class="form-input"
                :class="{ 'form-input--error': profileErrors.email }"
              />
              <span v-if="profileErrors.email" class="form-error">{{ profileErrors.email }}</span>
            </div>
            <div class="form-field">
              <label class="form-label">телефон</label>
              <input
                v-model="profileForm.phone"
                type="tel"
                class="form-input"
                :class="{ 'form-input--error': profileErrors.phone }"
              />
              <span v-if="profileErrors.phone" class="form-error">{{ profileErrors.phone }}</span>
            </div>
          </div>
        </div>

        <!-- Разделитель -->
        <div class="form-divider"></div>

        <!-- Учетные данные -->
        <div class="form-section">
          <h2 class="form-section-title">учетные данные</h2>
          <p class="form-section-description">никнейм используется для входа в аккаунт и не может быть изменен</p>
          
          <div class="form-row">
            <div class="form-field">
              <label class="form-label">никнейм</label>
              <input
                :value="profileForm.login"
                type="text"
                class="form-input form-input--readonly"
                readonly
                disabled
              />
              <p class="form-hint">нельзя изменить</p>
            </div>
          </div>
        </div>

        <!-- Разделитель -->
        <div class="form-divider"></div>

        <!-- Смена пароля -->
        <div class="form-section">
          <h2 class="form-section-title">сменить пароль</h2>
          
          <div class="form-row">
            <div class="form-field">
              <label class="form-label">текущий пароль</label>
              <input
                v-model="passwordForm.currentPassword"
                type="password"
                class="form-input"
                :class="{ 'form-input--error': passwordErrors.currentPassword }"
              />
              <span v-if="passwordErrors.currentPassword" class="form-error">{{ passwordErrors.currentPassword }}</span>
            </div>
            <div class="form-field">
              <label class="form-label">новый пароль</label>
              <input
                v-model="passwordForm.newPassword"
                type="password"
                class="form-input"
                :class="{ 'form-input--error': passwordErrors.newPassword }"
              />
              <span v-if="passwordErrors.newPassword" class="form-error">{{ passwordErrors.newPassword }}</span>
            </div>
            <div class="form-field">
              <label class="form-label">повторите пароль</label>
              <input
                v-model="passwordForm.confirmPassword"
                type="password"
                class="form-input"
                :class="{ 'form-input--error': passwordErrors.confirmPassword }"
              />
              <span v-if="passwordErrors.confirmPassword" class="form-error">{{ passwordErrors.confirmPassword }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getProfile, updateProfile, type Profile, type ProfileUpdateRequest } from '@/api/profile';
import { login, type LoginRequest } from '@/api/auth';

const router = useRouter();

const profileForm = reactive<ProfileUpdateRequest & { login: string }>({
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

const roleOptions = ['менеджер', 'разработчик', 'дизайнер', 'аналитик'];
const showRoleDropdown = ref(false);
const filteredRoleOptions = ref<string[]>(roleOptions);

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
    const profile = await getProfile();
    
    // Обязательные поля
    profileForm.email = profile.email || '';
    profileForm.firstName = profile.firstName || '';
    profileForm.lastName = profile.lastName || '';
    profileForm.login = profile.login || '';
    
    // displayName: если не указан, используем firstName
    profileForm.displayName = profile.displayName || profile.firstName || '';
    
    // Необязательные поля (только если указаны)
    profileForm.middleName = profile.middleName || '';
    profileForm.role = profile.role || '';
    profileForm.phone = profile.phone || '';
    profileForm.birthDate = profile.birthDate ? profile.birthDate.split('T')[0] : '';
  } catch (error: any) {
    console.error('Ошибка загрузки профиля:', error);
    if (error.status === 401) {
      router.push('/auth');
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

function filterRoleOptions(): void {
  const searchValue = profileForm.role?.toLowerCase() || '';
  if (searchValue === '') {
    filteredRoleOptions.value = roleOptions;
  } else {
    filteredRoleOptions.value = roleOptions.filter(role => 
      role.toLowerCase().includes(searchValue)
    );
  }
  showRoleDropdown.value = true;
}

function selectRole(role: string): void {
  profileForm.role = role;
  showRoleDropdown.value = false;
  filteredRoleOptions.value = roleOptions;
}

function handleRoleBlur(): void {
  // Задержка, чтобы клик по опции успел сработать
  setTimeout(() => {
    showRoleDropdown.value = false;
  }, 200);
}

async function handleSaveProfile(): Promise<void> {
  // Очистка ошибок
  Object.keys(profileErrors).forEach(key => delete profileErrors[key]);
  Object.keys(passwordErrors).forEach(key => delete passwordErrors[key]);

  // Валидация смены пароля только если пароль меняется
  const isPasswordChanging = passwordForm.newPassword && passwordForm.newPassword.trim() !== '';
  if (isPasswordChanging && !validatePasswordChange()) {
    return;
  }

  isSaving.value = true;

  try {
    const updateData: ProfileUpdateRequest = {};

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

    // Обработка необязательных полей - пустые строки отправляем как undefined для удаления
    if (profileForm.middleName !== undefined && profileForm.middleName !== null) {
      const trimmed = profileForm.middleName.trim();
      updateData.middleName = trimmed !== '' ? trimmed : undefined;
    }
    // Роль - ВСЕГДА отправляем, даже если пустая (для удаления)
    // Если поле пустое, отправляем пустую строку, сервер обработает как null
    const roleValue = profileForm.role !== undefined && profileForm.role !== null 
      ? profileForm.role.trim() 
      : '';
    // Всегда отправляем role, даже если пустой - это нужно для удаления
    updateData.role = roleValue;
    if (profileForm.phone !== undefined && profileForm.phone !== null) {
      const trimmed = profileForm.phone.trim();
      updateData.phone = trimmed !== '' ? trimmed : undefined;
    }
    if (profileForm.birthDate !== undefined && profileForm.birthDate !== null) {
      updateData.birthDate = profileForm.birthDate !== '' ? profileForm.birthDate : undefined;
    }
    // displayName - если пустой, отправляем undefined, сервер установит из firstName
    if (profileForm.displayName !== undefined && profileForm.displayName !== null) {
      const trimmed = profileForm.displayName.trim();
      updateData.displayName = trimmed !== '' ? trimmed : undefined;
    }

    const updatedProfile = await updateProfile(updateData);
    
    // Обновляем форму с данными с сервера
    profileForm.email = updatedProfile.email || '';
    profileForm.firstName = updatedProfile.firstName || '';
    profileForm.lastName = updatedProfile.lastName || '';
    // displayName: если не указан, используем firstName
    profileForm.displayName = updatedProfile.displayName || updatedProfile.firstName || '';
    // Необязательные поля
    profileForm.middleName = updatedProfile.middleName || '';
    profileForm.role = updatedProfile.role || '';
    profileForm.phone = updatedProfile.phone || '';
    profileForm.birthDate = updatedProfile.birthDate ? updatedProfile.birthDate.split('T')[0] : '';

    // Очищаем форму пароля
    passwordForm.currentPassword = '';
    passwordForm.newPassword = '';
    passwordForm.confirmPassword = '';

    alert('Профиль успешно обновлен');
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
    } else if (error.status === 401) {
      router.push('/auth');
    } else {
      profileErrors.email = error.data?.detail || error.message || 'Неизвестная ошибка';
    }
  } finally {
    isSaving.value = false;
  }
}

function handleChangePhoto(): void {
  // TODO: Реализовать загрузку фото
  alert('Функция загрузки фото будет реализована позже');
}

onMounted(() => {
  loadProfile();
});
</script>

<style scoped>
.profile-view {
  min-height: 100vh;
  background: #040910;
  padding: 36px;
  position: relative;
  overflow: visible;
}

.profile-header {
  text-align: center;
  margin-bottom: 40px;
}

.profile-title {
  font-family: 'Involve', Arial, sans-serif;
  font-size: 48px;
  font-weight: 600;
  color: #e1eaf8;
  margin: 0 0 12px 0;
  text-transform: lowercase;
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
}

.save-btn {
  background: #912138;
  border: none;
  border-radius: 40px;
  padding: 12px 24px;
  color: white;
  font-family: 'Involve', Arial, sans-serif;
  font-size: 20px;
  font-weight: 500;
  cursor: pointer;
  transition: opacity 0.2s ease;
  text-transform: lowercase;
  width: 100%;
  height: 48px;
}

.save-btn:hover:not(:disabled) {
  opacity: 0.9;
}

.save-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.profile-form-container {
  flex: 1;
  background: rgba(145, 33, 56, 0.5);
  border-radius: 40px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.form-section-title {
  font-family: 'Involve', Arial, sans-serif;
  font-size: 24px;
  font-weight: 600;
  color: #e1eaf8;
  margin: 0;
  text-transform: lowercase;
}

.form-section-description {
  font-family: 'Involve', Arial, sans-serif;
  font-size: 16px;
  font-weight: 400;
  color: #e1eaf8;
  margin: 0;
}

.form-row {
  display: flex;
  gap: 24px;
}

.form-field {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.form-label {
  font-family: 'Involve', Arial, sans-serif;
  font-size: 20px;
  font-weight: 500;
  color: #e1eaf8;
  text-transform: lowercase;
}

.form-input {
  height: 36px;
  border: 1px solid #e1eaf8;
  border-radius: 55px;
  background: transparent;
  padding: 0 16px;
  color: #e1eaf8;
  font-family: 'Involve', Arial, sans-serif;
  font-size: 16px;
  transition: border-color 0.2s ease;
}

.role-select-wrapper {
  position: relative;
  width: 100%;
}

.role-select-wrapper input[list] {
  width: 100%;
}

.form-input:focus {
  outline: none;
  border-color: #912138;
}

.form-input--error {
  border-color: #ff4444;
}

.form-input::placeholder {
  color: rgba(225, 234, 248, 0.5);
}

.role-select-wrapper {
  position: relative;
  width: 100%;
}

.form-select {
  height: 36px;
  border: 1px solid #e1eaf8;
  border-radius: 55px;
  background: transparent;
  padding: 0 16px;
  color: #e1eaf8;
  font-family: 'Involve', Arial, sans-serif;
  font-size: 16px;
  transition: border-color 0.2s ease;
  width: 100%;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23e1eaf8' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 16px center;
  padding-right: 40px;
}

.form-select:focus {
  outline: none;
  border-color: #912138;
}

.form-select.form-input--error {
  border-color: #ff4444;
}

.role-input-wrapper {
  position: relative;
  width: 100%;
}

.role-input-wrapper .form-input {
  width: 100%;
  box-sizing: border-box;
}

.role-dropdown {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  width: 100%;
  background: rgba(145, 33, 56, 0.95);
  border: 1px solid rgba(225, 234, 248, 0.3);
  border-radius: 12px;
  max-height: 200px;
  overflow-y: auto;
  z-index: 1000;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.role-option {
  padding: 12px 16px;
  color: #e1eaf8;
  font-family: 'Involve', Arial, sans-serif;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  text-transform: lowercase;
}

.role-option:hover {
  background-color: rgba(225, 234, 248, 0.1);
}

.role-option:first-child {
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
}

.role-option:last-child {
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
}

.form-error {
  font-family: 'Involve', Arial, sans-serif;
  font-size: 14px;
  color: #ff4444;
  margin-top: -4px;
}

.form-hint {
  font-family: 'Involve', Arial, sans-serif;
  font-size: 16px;
  font-weight: 400;
  color: #e1eaf8;
  margin: 0;
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

  .form-row {
    flex-direction: column;
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


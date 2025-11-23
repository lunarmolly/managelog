<template>
  <div class="settings">
    <div class="settings__container">
      <h1 class="settings__title">настройки</h1>

      <!-- Секция профиля -->
      <div class="settings__section">
        <h2 class="settings__section-title">профиль</h2>
        <form @submit.prevent="handleSaveProfile" class="settings__form">
          <div class="settings__form-grid">
            <!-- Имя -->
            <div class="settings__form-field">
              <label class="settings__form-label">имя</label>
              <input
                v-model="profileForm.firstName"
                type="text"
                maxlength="24"
                class="settings__form-input"
                :class="{ 'settings__form-input--error': profileErrors.firstName }"
              />
              <span v-if="profileErrors.firstName" class="settings__form-error">{{ profileErrors.firstName }}</span>
            </div>

            <!-- Фамилия -->
            <div class="settings__form-field">
              <label class="settings__form-label">фамилия</label>
              <input
                v-model="profileForm.lastName"
                type="text"
                maxlength="24"
                class="settings__form-input"
                :class="{ 'settings__form-input--error': profileErrors.lastName }"
              />
              <span v-if="profileErrors.lastName" class="settings__form-error">{{ profileErrors.lastName }}</span>
            </div>

            <!-- Отчество -->
            <div class="settings__form-field">
              <label class="settings__form-label">отчество <span class="settings__form-label-optional">(необязательно)</span></label>
              <input
                v-model="profileForm.middleName"
                type="text"
                maxlength="24"
                class="settings__form-input"
                :class="{ 'settings__form-input--error': profileErrors.middleName }"
              />
              <span v-if="profileErrors.middleName" class="settings__form-error">{{ profileErrors.middleName }}</span>
            </div>

            <!-- Отображаемое имя -->
            <div class="settings__form-field">
              <label class="settings__form-label">как называть</label>
              <input
                v-model="profileForm.displayName"
                type="text"
                maxlength="56"
                class="settings__form-input"
                :class="{ 'settings__form-input--error': profileErrors.displayName }"
                placeholder="По умолчанию: имя"
              />
              <span v-if="profileErrors.displayName" class="settings__form-error">{{ profileErrors.displayName }}</span>
            </div>

            <!-- Дата рождения -->
            <div class="settings__form-field">
              <label class="settings__form-label">дата рождения <span class="settings__form-label-optional">(необязательно)</span></label>
              <input
                v-model="profileForm.birthDate"
                type="date"
                class="settings__form-input"
                :class="{ 'settings__form-input--error': profileErrors.birthDate }"
              />
              <span v-if="profileErrors.birthDate" class="settings__form-error">{{ profileErrors.birthDate }}</span>
            </div>

            <!-- Роль -->
            <div class="settings__form-field">
              <label class="settings__form-label">роль <span class="settings__form-label-optional">(необязательно)</span></label>
              <input
                v-model="profileForm.role"
                type="text"
                maxlength="50"
                class="settings__form-input"
                :class="{ 'settings__form-input--error': profileErrors.role }"
              />
              <span v-if="profileErrors.role" class="settings__form-error">{{ profileErrors.role }}</span>
            </div>

            <!-- Email -->
            <div class="settings__form-field">
              <label class="settings__form-label">почта</label>
              <input
                v-model="profileForm.email"
                type="email"
                class="settings__form-input"
                :class="{ 'settings__form-input--error': profileErrors.email }"
              />
              <span v-if="profileErrors.email" class="settings__form-error">{{ profileErrors.email }}</span>
            </div>

            <!-- Телефон -->
            <div class="settings__form-field">
              <label class="settings__form-label">телефон <span class="settings__form-label-optional">(необязательно)</span></label>
              <input
                v-model="profileForm.phone"
                type="tel"
                class="settings__form-input"
                :class="{ 'settings__form-input--error': profileErrors.phone }"
                placeholder="+7 (999) 123-45-67"
              />
              <span v-if="profileErrors.phone" class="settings__form-error">{{ profileErrors.phone }}</span>
            </div>

            <!-- Username (только для чтения) -->
            <div class="settings__form-field">
              <label class="settings__form-label">username</label>
              <input
                :value="profileForm.login"
                type="text"
                class="settings__form-input settings__form-input--readonly"
                readonly
                disabled
              />
              <span class="settings__form-hint">Нельзя изменить</span>
            </div>

            <!-- Пароль -->
            <div class="settings__form-field">
              <label class="settings__form-label">новый пароль <span class="settings__form-label-optional">(оставьте пустым, чтобы не менять)</span></label>
              <input
                v-model="profileForm.password"
                type="password"
                class="settings__form-input"
                :class="{ 'settings__form-input--error': profileErrors.password }"
                placeholder="Минимум 8 символов"
              />
              <span v-if="profileErrors.password" class="settings__form-error">{{ profileErrors.password }}</span>
            </div>
          </div>

          <div class="settings__form-actions">
            <button
              type="submit"
              :disabled="isSaving"
              class="settings__form-button"
            >
              <span v-if="isSaving">Сохранение...</span>
              <span v-else>сохранить изменения</span>
            </button>
          </div>
        </form>
      </div>

      <div class="settings__section">
        <h2 class="settings__section-title">верхняя панель</h2>
        <div class="settings__options">
          <label class="settings__option">
            <input
              type="radio"
              name="headerType"
              value="compact"
              :checked="settingsStore.headerType === 'compact'"
              @change="settingsStore.setHeaderType('compact')"
              class="settings__radio"
            />
            <span class="settings__option-label">компактная</span>
          </label>
          <label class="settings__option">
            <input
              type="radio"
              name="headerType"
              value="brand"
              :checked="settingsStore.headerType === 'brand'"
              @change="settingsStore.setHeaderType('brand')"
              class="settings__radio"
            />
            <span class="settings__option-label">фирменная</span>
          </label>
        </div>
      </div>

      <div class="settings__section">
        <h2 class="settings__section-title">мобильная панель</h2>
        <div class="settings__options">
          <label class="settings__option">
            <input
              type="radio"
              name="mobileHeaderPosition"
              value="top"
              :checked="settingsStore.mobileHeaderPosition === 'top'"
              @change="settingsStore.setMobileHeaderPosition('top')"
              class="settings__radio"
            />
            <span class="settings__option-label">сверху</span>
          </label>
          <label class="settings__option">
            <input
              type="radio"
              name="mobileHeaderPosition"
              value="bottom"
              :checked="settingsStore.mobileHeaderPosition === 'bottom'"
              @change="settingsStore.setMobileHeaderPosition('bottom')"
              class="settings__radio"
            />
            <span class="settings__option-label">снизу</span>
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useSettingsStore } from '@/stores/settings';
import { getProfile, updateProfile, type Profile, type ProfileUpdateRequest } from '@/api/profile';

const settingsStore = useSettingsStore();

const profileForm = reactive<ProfileUpdateRequest & { login: string }>({
  email: '',
  firstName: '',
  lastName: '',
  middleName: '',
  displayName: '',
  birthDate: '',
  role: '',
  phone: '',
  password: '',
  login: '',
});

const profileErrors = reactive<Record<string, string>>({});
const isSaving = ref(false);
const isLoading = ref(true);

async function loadProfile(): Promise<void> {
  try {
    isLoading.value = true;
    const profile = await getProfile();
    
    profileForm.email = profile.email || '';
    profileForm.firstName = profile.firstName || '';
    profileForm.lastName = profile.lastName || '';
    profileForm.middleName = profile.middleName || '';
    profileForm.displayName = profile.displayName || profile.firstName || '';
    profileForm.birthDate = profile.birthDate ? profile.birthDate.split('T')[0] : '';
    profileForm.role = profile.role || '';
    profileForm.phone = profile.phone || '';
    profileForm.login = profile.login || '';
    profileForm.password = '';
  } catch (error: any) {
    console.error('Ошибка загрузки профиля:', error);
    if (error.status === 401) {
      // Пользователь не авторизован - перенаправить на страницу входа
      window.location.href = '/auth';
    }
  } finally {
    isLoading.value = false;
  }
}

async function handleSaveProfile(): Promise<void> {
  // Очистка ошибок
  Object.keys(profileErrors).forEach(key => delete profileErrors[key]);

  isSaving.value = true;

  try {
    const updateData: ProfileUpdateRequest = {};

    if (profileForm.email) updateData.email = profileForm.email;
    if (profileForm.firstName !== undefined) updateData.firstName = profileForm.firstName || undefined;
    if (profileForm.lastName !== undefined) updateData.lastName = profileForm.lastName || undefined;
    if (profileForm.middleName !== undefined) updateData.middleName = profileForm.middleName || undefined;
    if (profileForm.displayName !== undefined) updateData.displayName = profileForm.displayName || undefined;
    if (profileForm.birthDate) updateData.birthDate = profileForm.birthDate;
    if (profileForm.role !== undefined) updateData.role = profileForm.role || undefined;
    if (profileForm.phone !== undefined) updateData.phone = profileForm.phone || undefined;
    if (profileForm.password) updateData.password = profileForm.password;

    const updatedProfile = await updateProfile(updateData);
    
    // Обновляем форму с данными с сервера
    profileForm.email = updatedProfile.email || '';
    profileForm.firstName = updatedProfile.firstName || '';
    profileForm.lastName = updatedProfile.lastName || '';
    profileForm.middleName = updatedProfile.middleName || '';
    profileForm.displayName = updatedProfile.displayName || updatedProfile.firstName || '';
    profileForm.birthDate = updatedProfile.birthDate ? updatedProfile.birthDate.split('T')[0] : '';
    profileForm.role = updatedProfile.role || '';
    profileForm.phone = updatedProfile.phone || '';
    profileForm.password = ''; // Очищаем пароль после сохранения

    alert('Профиль успешно обновлен');
  } catch (error: any) {
    console.error('Ошибка обновления профиля:', error);
    
    if (error.status === 0) {
      profileErrors.email = error.data?.detail || error.message || 'Не удалось подключиться к серверу';
    } else if (error.status === 422) {
      const errorData = error.data;
      if (errorData?.errors) {
        Object.keys(errorData.errors).forEach(field => {
          profileErrors[field] = Array.isArray(errorData.errors[field]) 
            ? errorData.errors[field][0] 
            : errorData.errors[field];
        });
      } else {
        profileErrors.email = errorData?.detail || errorData?.message || 'Ошибка валидации';
      }
    } else if (error.status === 409) {
      profileErrors.email = error.data?.detail || 'Пользователь с таким email уже существует';
    } else if (error.status === 401) {
      window.location.href = '/auth';
    } else {
      profileErrors.email = error.data?.detail || error.message || 'Неизвестная ошибка';
    }
  } finally {
    isSaving.value = false;
  }
}

onMounted(() => {
  loadProfile();
});
</script>

<style scoped>
@font-face {
  font-family: 'Involve';
  src: url('/fonts/Involve-Regular.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
}

@font-face {
  font-family: 'Involve';
  src: url('/fonts/Involve-Medium.woff2') format('woff2');
  font-weight: 500;
  font-style: normal;
}

@font-face {
  font-family: 'Involve';
  src: url('/fonts/Involve-SemiBold.woff2') format('woff2');
  font-weight: 600;
  font-style: normal;
}

@font-face {
  font-family: 'Involve';
  src: url('/fonts/Involve-Bold.woff2') format('woff2');
  font-weight: 700;
  font-style: normal;
}

.settings {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
  font-family: 'Involve', Arial, sans-serif;
}

.settings__container {
  background: rgba(145, 33, 56, 0.3);
  backdrop-filter: blur(25px);
  -webkit-backdrop-filter: blur(25px);
  border-radius: 20px;
  padding: 40px;
}

.settings__title {
  font-size: 32px;
  font-weight: 700;
  color: #e1eaf8;
  margin: 0 0 40px 0;
  text-transform: lowercase;
  letter-spacing: 1px;
}

.settings__section {
  margin-bottom: 32px;
}

.settings__section-title {
  font-size: 24px;
  font-weight: 600;
  color: #e1eaf8;
  margin: 0 0 20px 0;
  text-transform: lowercase;
  letter-spacing: 0.5px;
}

.settings__options {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.settings__option {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  padding: 12px 16px;
  border-radius: 12px;
  transition: background-color 0.2s ease;
}

.settings__option:hover {
  background: rgba(145, 33, 56, 0.3);
}

.settings__radio {
  width: 20px;
  height: 20px;
  cursor: pointer;
  accent-color: #912138;
}

.settings__option-label {
  font-size: 18px;
  font-weight: 500;
  color: #e1eaf8;
  text-transform: lowercase;
  letter-spacing: 0.5px;
}

.settings__form {
  margin-top: 20px;
}

.settings__form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
}

.settings__form-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.settings__form-label {
  font-size: 16px;
  font-weight: 500;
  color: #e1eaf8;
  text-transform: lowercase;
  letter-spacing: 0.5px;
}

.settings__form-label-optional {
  font-size: 14px;
  font-weight: 400;
  color: rgba(225, 234, 248, 0.6);
  font-style: italic;
}

.settings__form-input {
  width: 100%;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(225, 234, 248, 0.3);
  border-radius: 12px;
  color: #e1eaf8;
  font-size: 16px;
  font-family: 'Involve', Arial, sans-serif;
  transition: all 0.2s ease;
}

.settings__form-input:focus {
  outline: none;
  border-color: #912138;
  background: rgba(255, 255, 255, 0.15);
}

.settings__form-input--error {
  border-color: #ff4444;
}

.settings__form-input--readonly {
  background: rgba(255, 255, 255, 0.05);
  cursor: not-allowed;
  opacity: 0.7;
}

.settings__form-error {
  font-size: 14px;
  color: #ff4444;
  margin-top: -4px;
}

.settings__form-hint {
  font-size: 12px;
  color: rgba(225, 234, 248, 0.5);
  font-style: italic;
}

.settings__form-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 24px;
}

.settings__form-button {
  padding: 12px 32px;
  background: rgba(145, 33, 56, 0.8);
  border: 1px solid #912138;
  border-radius: 12px;
  color: #e1eaf8;
  font-size: 18px;
  font-weight: 500;
  font-family: 'Involve', Arial, sans-serif;
  text-transform: lowercase;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.settings__form-button:hover:not(:disabled) {
  background: rgba(145, 33, 56, 1);
  transform: translateY(-2px);
}

.settings__form-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .settings {
    padding: 20px 16px;
  }

  .settings__container {
    padding: 24px;
  }

  .settings__title {
    font-size: 28px;
    margin-bottom: 32px;
  }

  .settings__section-title {
    font-size: 20px;
  }

  .settings__option-label {
    font-size: 16px;
  }

  .settings__form-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .settings__form-button {
    width: 100%;
    padding: 14px 24px;
  }
}
</style>


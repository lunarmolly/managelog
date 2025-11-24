<template>
  <div class="user-profile-view">
    <!-- Кнопка назад -->
    <div class="user-profile-header">
      <button class="back-button" @click="goBack">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span>назад к команде</span>
      </button>
    </div>

    <!-- Загрузка -->
    <div v-if="isLoading" class="user-profile-loading">
      <div class="loading-spinner"></div>
      <p>загрузка профиля...</p>
    </div>

    <!-- Ошибка -->
    <div v-else-if="error" class="user-profile-error">
      <p>{{ error }}</p>
      <button class="error-retry-button" @click="loadUserProfile">попробовать снова</button>
    </div>

    <!-- Профиль -->
    <div v-else-if="userInfo" class="user-profile-content">
      <!-- Левая колонка: Аватар и информация -->
      <div class="user-profile-sidebar">
        <div class="user-profile-card">
          <!-- Аватар -->
          <div class="user-profile-avatar-wrapper">
            <div class="user-profile-avatar">
              <img
                v-if="userInfo.avatar"
                :src="getAvatarUrl(userInfo.avatar)"
                :alt="getUserFullName(userInfo)"
              />
              <div v-else class="user-profile-avatar-placeholder">
                {{ getUserInitial(userInfo) }}
              </div>
            </div>
          </div>

          <!-- Информация о пользователе -->
          <div class="user-profile-info">
            <div class="user-profile-name-wrapper">
              <h2 class="user-profile-name">{{ getUserFullName(userInfo) || 'пользователь' }}</h2>
              <div class="user-profile-username">
                @{{ userInfo.login || 'username' }}
              </div>
            </div>

            <!-- Роль -->
            <div v-if="userInfo.role" class="user-profile-role-wrapper">
              <div class="user-profile-role-badge">
                <svg class="role-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span class="role-text">{{ userInfo.role }}</span>
              </div>
            </div>

            <!-- Компания -->
            <div v-if="userInfo.company" class="user-profile-company-wrapper">
              <div class="user-profile-company-name">{{ userInfo.company.name }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Правая колонка: Детальная информация -->
      <div class="user-profile-details">
        <!-- Контактная информация -->
        <div class="user-profile-section">
          <h3 class="user-profile-section-title">контактная информация</h3>
          <div class="user-profile-details-grid">
            <div v-if="userInfo.email" class="user-profile-detail-item">
              <div class="detail-label">email</div>
              <div class="detail-value">{{ userInfo.email }}</div>
            </div>
            <div v-if="userInfo.phone" class="user-profile-detail-item">
              <div class="detail-label">телефон</div>
              <div class="detail-value">{{ formatPhoneNumber(userInfo.phone) }}</div>
            </div>
            <div v-if="userInfo.birthDate" class="user-profile-detail-item">
              <div class="detail-label">дата рождения</div>
              <div class="detail-value">{{ formatDate(userInfo.birthDate) }}</div>
            </div>
          </div>
        </div>

        <!-- Общие проекты -->
        <div class="user-profile-section">
          <h3 class="user-profile-section-title">
            общие проекты
            <span v-if="commonProjects.length > 0" class="projects-count">({{ commonProjects.length }})</span>
          </h3>
          <div v-if="isLoadingProjects" class="projects-loading">
            <div class="loading-spinner-small"></div>
            <span>загрузка проектов...</span>
          </div>
          <div v-else-if="commonProjects.length === 0" class="projects-empty">
            <p>нет общих проектов</p>
          </div>
          <div v-else class="projects-grid">
            <router-link
              v-for="project in commonProjects"
              :key="project.id"
              :to="`/projects`"
              class="project-card-link"
            >
              <div class="project-card" :style="{ '--project-color': project.color }">
                <div
                  class="project-icon"
                  :style="{ backgroundColor: project.color }"
                  v-html="getProjectIconHtml(project)"
                ></div>
                <div class="project-info">
                  <h4 class="project-name">{{ project.name }}</h4>
                  <p v-if="project.description" class="project-description">{{ project.description }}</p>
                  <div class="project-meta">
                    <span class="project-status" :class="`project-status--${project.status}`">
                      {{ getStatusLabel(project.status) }}
                    </span>
                    <span v-if="project.requiresAction" class="project-action-required">
                      требуется действие
                    </span>
                  </div>
                </div>
              </div>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getUserById, type UserInfo } from '@/api/user';
import { getCommonProjects, type Project, type ProjectStatus } from '@/api/projects';

const route = useRoute();
const router = useRouter();

const userInfo = ref<UserInfo | null>(null);
const commonProjects = ref<Project[]>([]);
const isLoading = ref(true);
const isLoadingProjects = ref(false);
const error = ref<string | null>(null);

// Формирование полного URL аватара
function getAvatarUrl(avatar: string | null | undefined): string {
  if (!avatar) return '';
  
  if (avatar.startsWith('http')) {
    return avatar;
  }
  
  const baseUrl = import.meta.env.VITE_API_BASE_URL?.replace('/api/v1', '') || 'http://localhost:3000';
  if (avatar.startsWith('/')) {
    return `${baseUrl}${avatar}`;
  }
  
  return `${baseUrl}/api/v1/avatars/${avatar}`;
}

// Получение полного имени
function getUserFullName(user: UserInfo): string {
  const parts: string[] = [];
  if (user.firstName) parts.push(user.firstName);
  if (user.lastName) parts.push(user.lastName);
  return parts.length > 0 ? parts.join(' ') : (user.displayName || user.login || 'Неизвестно');
}

// Получение первой буквы для аватара
function getUserInitial(user: UserInfo): string {
  if (user.firstName) return user.firstName.charAt(0).toUpperCase();
  if (user.lastName) return user.lastName.charAt(0).toUpperCase();
  if (user.login) return user.login.charAt(0).toUpperCase();
  return '?';
}

// Форматирование телефона
function formatPhoneNumber(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  
  if (!digits) return phone;
  
  let phoneDigits = digits.startsWith('8') ? '7' + digits.slice(1) : digits;
  
  if (phoneDigits && !phoneDigits.startsWith('7')) {
    phoneDigits = '7' + phoneDigits;
  }
  
  if (phoneDigits.length > 11) {
    phoneDigits = phoneDigits.slice(0, 11);
  }
  
  if (phoneDigits.length === 11) {
    const code = phoneDigits.slice(1, 4);
    const part1 = phoneDigits.slice(4, 7);
    const part2 = phoneDigits.slice(7, 9);
    const part3 = phoneDigits.slice(9, 11);
    return `+7 (${code}) ${part1}-${part2}-${part3}`;
  }
  
  return phone;
}

// Форматирование даты
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  
  return `${day}.${month}.${year}`;
}

// Получение метки статуса
function getStatusLabel(status: ProjectStatus): string {
  const labels: Record<ProjectStatus, string> = {
    new: 'новый',
    in_progress: 'в работе',
    completed: 'завершен',
    on_hold: 'на паузе',
    cancelled: 'отменен',
  };
  return labels[status] || status;
}

// Массив иконок проектов
interface ProjectIcon {
  id: string;
  name: string;
  svg: string;
}

const projectIcons: ProjectIcon[] = [
  {
    id: 'building',
    name: 'Здание',
    svg: '<path d="M3 11L12 5L21 11V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V11Z"/><path d="M9 22V13H15V22"/>',
  },
  {
    id: 'folder',
    name: 'Папка',
    svg: '<path d="M4 8.5C4 7.94772 4.21071 7.4179 4.58579 7.04289C4.96086 6.66781 5.46957 6.5 6 6.5H10.5L13 9H18C18.5304 9 19.0391 9.21071 19.4142 9.58579C19.7893 9.96086 20 10.4696 20 11V19.5C20 20.0523 19.7893 20.5821 19.4142 20.9571C19.0391 21.3322 18.5304 21.5 18 21.5H6C5.46957 21.5 4.96086 21.3322 4.58579 20.9571C4.21071 20.5821 4 20.0523 4 19.5V8.5Z"/>',
  },
  {
    id: 'calendar',
    name: 'Календарь',
    svg: '<path d="M6 11.5H18M9 6V7.5M15 6V7.5M8 15H9.5M12.5 15H14M15.5 15H17M8 18H9.5M12.5 18H14M15.5 18H17M8 11.5H18C19.1046 11.5 20 12.3954 20 13.5V19.5C20 20.6046 19.1046 21.5 18 21.5H8C6.89543 21.5 6 20.6046 6 19.5V13.5C6 12.3954 6.89543 11.5 8 11.5Z"/>',
  },
  {
    id: 'chart',
    name: 'График',
    svg: '<path d="M5.5 6V19.5H20.5M10 18L13 15L15.5 17.5L20.5 12.5M20.5 12.5H17.5M20.5 12.5V15.5"/>',
  },
  {
    id: 'star',
    name: 'Звезда',
    svg: '<path d="M12 4.5L14.295 10.13L20.25 11.135L16.125 15.32L17.09 21.27L12 18.635L6.91 21.27L7.875 15.32L3.75 11.135L9.705 10.13L12 4.5Z"/>',
  },
  {
    id: 'target',
    name: 'Цель',
    svg: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5.5"/><circle cx="12" cy="12" r="2"/>',
  },
];

// Функция затемнения цвета
function darkenColor(hex: string, percent = 50): string {
  // Убираем #
  hex = hex.replace('#', '');
  
  // Конвертируем в RGB
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  
  // Затемняем
  const newR = Math.floor(r * (1 - percent / 100));
  const newG = Math.floor(g * (1 - percent / 100));
  const newB = Math.floor(b * (1 - percent / 100));
  
  // Конвертируем обратно в hex
  const toHex = (n: number) => {
    const hex = n.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  
  return `#${toHex(newR)}${toHex(newG)}${toHex(newB)}`;
}

// Получение HTML для иконки проекта
function getProjectIconHtml(project: Project): string {
  const icon = projectIcons.find((i) => i.id === project.icon);
  const iconSvg = icon?.svg || projectIcons[0].svg;
  const iconColor = darkenColor(project.color);
  return `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="stroke: ${iconColor}; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; width: 100%; height: 100%; max-width: 40px; max-height: 40px; object-fit: contain;">${iconSvg}</svg>`;
}

// Загрузка профиля пользователя
async function loadUserProfile(): Promise<void> {
  const userId = route.params.id as string;
  if (!userId) {
    error.value = 'ID пользователя не указан';
    isLoading.value = false;
    return;
  }

  try {
    isLoading.value = true;
    error.value = null;
    userInfo.value = await getUserById(userId);
  } catch (err: any) {
    console.error('Ошибка загрузки профиля пользователя:', err);
    if (err.status === 401 || err.status === 403) {
      localStorage.removeItem('auth_tokens');
      router.push('/auth');
      return;
    }
    error.value = err.message || 'Не удалось загрузить профиль пользователя';
  } finally {
    isLoading.value = false;
  }
}

// Загрузка общих проектов
async function loadCommonProjects(): Promise<void> {
  const userId = route.params.id as string;
  if (!userId || !userInfo.value) return;

  try {
    isLoadingProjects.value = true;
    commonProjects.value = await getCommonProjects(userId);
  } catch (err: any) {
    console.error('Ошибка загрузки общих проектов:', err);
    // Не показываем ошибку, просто оставляем список пустым
    commonProjects.value = [];
  } finally {
    isLoadingProjects.value = false;
  }
}

// Назад
function goBack(): void {
  router.push('/teams');
}

onMounted(async () => {
  await loadUserProfile();
  if (userInfo.value) {
    await loadCommonProjects();
  }
});
</script>

<style scoped>
.user-profile-view {
  min-height: calc(100vh - 100px);
  position: relative;
  overflow: visible;
  padding: 36px;
  padding-bottom: 120px;
  z-index: 1;
  box-sizing: border-box;
}

/* Фиксированный фон */
.user-profile-view::before {
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

.user-profile-header {
  max-width: 1400px;
  margin: 0 auto 32px;
}

.back-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: rgba(145, 33, 56, 0.3);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 40px;
  color: #e1eaf8;
  font-family: 'Involve', Arial, sans-serif;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.back-button:hover {
  background: rgba(145, 33, 56, 0.5);
  transform: translateX(-4px);
}

.back-button svg {
  width: 20px;
  height: 20px;
}

.user-profile-loading,
.user-profile-error {
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

.loading-spinner-small {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(145, 33, 56, 0.3);
  border-top-color: #912138;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.error-retry-button {
  padding: 10px 20px;
  background: rgba(145, 33, 56, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  color: #e1eaf8;
  font-family: 'Involve', Arial, sans-serif;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.error-retry-button:hover {
  background: rgba(145, 33, 56, 0.7);
}

.user-profile-content {
  display: grid;
  grid-template-columns: 400px 1fr;
  gap: 32px;
  max-width: 1400px;
  margin: 0 auto;
}

.user-profile-sidebar {
  position: sticky;
  top: 100px;
  height: fit-content;
}

.user-profile-card {
  background: rgba(245, 245, 245, 0.5);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 40px;
  padding: 32px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.user-profile-avatar-wrapper {
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
}

.user-profile-avatar {
  width: 160px;
  height: 160px;
  border-radius: 80px;
  overflow: hidden;
  background: rgba(145, 33, 56, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 24px rgba(145, 33, 56, 0.3);
}

.user-profile-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-profile-avatar-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #e1eaf8;
  font-size: 64px;
  font-weight: 600;
  font-family: 'Involve', Arial, sans-serif;
}

.user-profile-info {
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;
  text-align: center;
}

.user-profile-name-wrapper {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.user-profile-name {
  font-family: 'Involve', Arial, sans-serif;
  font-size: 24px;
  font-weight: 600;
  color: #292d32;
  margin: 0;
}

.user-profile-username {
  font-family: 'Involve', Arial, sans-serif;
  font-size: 16px;
  font-weight: 400;
  color: rgba(41, 45, 50, 0.6);
}

.user-profile-role-wrapper {
  display: flex;
  justify-content: center;
}

.user-profile-role-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: rgba(145, 33, 56, 0.2);
  border: 1px solid rgba(145, 33, 56, 0.3);
  border-radius: 20px;
  color: #292d32;
  font-family: 'Involve', Arial, sans-serif;
  font-size: 14px;
  font-weight: 500;
}

.role-icon {
  width: 16px;
  height: 16px;
}

.role-text {
  line-height: 1;
}

.user-profile-company-wrapper {
  margin-top: 8px;
}

.user-profile-company-name {
  font-family: 'Involve', Arial, sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: rgba(41, 45, 50, 0.6);
  text-transform: lowercase;
  padding: 6px 12px;
  border-radius: 12px;
  background: rgba(41, 45, 50, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.user-profile-details {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.user-profile-section {
  background: rgba(245, 245, 245, 0.5);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 40px;
  padding: 32px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.user-profile-section-title {
  font-family: 'Involve', Arial, sans-serif;
  font-size: 24px;
  font-weight: 600;
  color: #292d32;
  margin: 0 0 24px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.projects-count {
  font-size: 18px;
  font-weight: 400;
  color: rgba(41, 45, 50, 0.6);
}

.user-profile-details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
}

.user-profile-detail-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.detail-label {
  font-family: 'Involve', Arial, sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: rgba(41, 45, 50, 0.6);
  text-transform: lowercase;
}

.detail-value {
  font-family: 'Involve', Arial, sans-serif;
  font-size: 18px;
  font-weight: 400;
  color: #292d32;
}

.projects-loading {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 24px;
  color: rgba(41, 45, 50, 0.6);
  font-family: 'Involve', Arial, sans-serif;
  font-size: 14px;
}

.projects-empty {
  padding: 40px;
  text-align: center;
  color: rgba(41, 45, 50, 0.6);
  font-family: 'Involve', Arial, sans-serif;
  font-size: 16px;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.project-card-link {
  text-decoration: none;
  color: inherit;
}

.project-card {
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(10px);
  border-radius: 24px;
  padding: 20px;
  display: flex;
  gap: 16px;
  align-items: flex-start;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
  cursor: pointer;
}

.project-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
  background: rgba(255, 255, 255, 0.8);
}

.project-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: hidden;
}

.project-icon svg {
  width: 100%;
  height: 100%;
  max-width: 40px;
  max-height: 40px;
  object-fit: contain;
}

.project-info {
  flex: 1;
  min-width: 0;
}

.project-name {
  font-family: 'Involve', Arial, sans-serif;
  font-size: 18px;
  font-weight: 600;
  color: #292d32;
  margin: 0 0 8px 0;
}

.project-description {
  font-family: 'Involve', Arial, sans-serif;
  font-size: 14px;
  color: rgba(41, 45, 50, 0.7);
  margin: 0 0 12px 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.project-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

.project-status {
  font-family: 'Involve', Arial, sans-serif;
  font-size: 12px;
  font-weight: 500;
  padding: 4px 10px;
  border-radius: 12px;
  text-transform: lowercase;
}

.project-status--new {
  background: rgba(33, 150, 243, 0.2);
  color: #2196f3;
}

.project-status--in_progress {
  background: rgba(76, 175, 80, 0.2);
  color: #4caf50;
}

.project-status--completed {
  background: rgba(158, 158, 158, 0.2);
  color: #9e9e9e;
}

.project-status--on_hold {
  background: rgba(255, 152, 0, 0.2);
  color: #ff9800;
}

.project-status--cancelled {
  background: rgba(244, 67, 54, 0.2);
  color: #f44336;
}

.project-action-required {
  font-family: 'Involve', Arial, sans-serif;
  font-size: 11px;
  font-weight: 500;
  padding: 4px 10px;
  border-radius: 12px;
  background: rgba(145, 33, 56, 0.2);
  color: #912138;
  text-transform: lowercase;
}

/* Адаптивность */
@media (max-width: 1024px) {
  .user-profile-content {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .user-profile-sidebar {
    position: static;
  }
}

@media (max-width: 768px) {
  .user-profile-view {
    padding: 20px 16px;
    padding-bottom: 100px;
  }

  .user-profile-card {
    padding: 24px;
  }

  .user-profile-avatar {
    width: 120px;
    height: 120px;
    border-radius: 60px;
  }

  .user-profile-avatar-placeholder {
    font-size: 48px;
  }

  .user-profile-section {
    padding: 24px;
  }

  .projects-grid {
    grid-template-columns: 1fr;
  }
}
</style>


<template>
  <div class="teams-view">
    <!-- Заголовок -->
    <div class="teams-header">
      <h1 class="teams-title">сотрудники</h1>
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
        v-for="user in sortedCompanyUsers"
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

          <!-- Роль -->
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
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { getCompanyUsers, getUserInfo, type CompanyUser } from '@/api/user';

const router = useRouter();

const companyUsers = ref<CompanyUser[]>([]);
const currentUserId = ref<string | null>(null);
const isLoading = ref(true);

// Отсортированный список сотрудников (текущий пользователь первым)
const sortedCompanyUsers = computed(() => {
  if (!currentUserId.value) return companyUsers.value;
  
  const currentUser = companyUsers.value.find(u => u.id === currentUserId.value);
  const otherUsers = companyUsers.value.filter(u => u.id !== currentUserId.value);
  
  return currentUser ? [currentUser, ...otherUsers] : companyUsers.value;
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
  margin-bottom: 48px;
  max-width: 1400px;
  margin-left: auto;
  margin-right: auto;
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
}
</style>

<template>
  <header class="header" role="banner">
    <div class="header__container">
      <div class="header__content">
        <!-- Основной контент -->
        <div
          class="header__main"
          :class="{
            'header__main--hidden': isProfileOpen,
          }"
        >
          <!-- Логотип -->
          <router-link class="header__logo" to="/dashboard" aria-label="Главная страница">
            <div class="header__logo-icon" aria-hidden="true"></div>
            <span class="header__logo-text">managelog</span>
          </router-link>

          <!-- Навигация -->
          <nav class="header__nav" aria-label="Основная навигация">
            <router-link
              v-for="item in navItems"
              :key="item.path"
              :to="item.path"
              class="header__nav-item"
              :class="{ 'header__nav-item--active': isActive(item.path) }"
              :aria-current="isActive(item.path) ? 'page' : undefined"
            >
              {{ item.label }}
            </router-link>
          </nav>

          <!-- Действия -->
          <div class="header__actions">
            <button
              type="button"
              class="header__action-btn header__action-btn--notify"
              aria-label="Уведомления"
            >
              <svg class="header__action-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M13.73 21a2 2 0 0 1-3.46 0"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <span v-if="hasNotifications" class="header__notify-badge" aria-hidden="true"></span>
            </button>

            <button
              type="button"
              class="header__action-btn header__action-btn--avatar"
              @click="toggleProfile"
              :aria-label="isProfileOpen ? 'Закрыть профиль' : 'Открыть профиль'"
              :aria-expanded="isProfileOpen"
            >
              <transition name="avatar-transition" mode="out-in">
                <img
                  v-if="!isProfileOpen && avatarUrl"
                  key="avatar"
                  :src="avatarUrl"
                  alt="Аватар пользователя"
                  class="header__avatar-img"
                />
                <div
                  v-else-if="!isProfileOpen && !avatarUrl"
                  key="avatar-placeholder"
                  class="header__avatar-placeholder"
                >
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" fill="#912138"/>
                    <path d="M12.0002 14.5C6.99016 14.5 2.95016 17.86 2.95016 22C2.95016 22.28 3.17016 22.5 3.45016 22.5H20.5502C20.8302 22.5 21.0502 22.28 21.0502 22C21.0502 17.86 17.0102 14.5 12.0002 14.5Z" fill="#912138"/>
                  </svg>
                </div>
                <svg
                  v-else
                  key="close"
                  class="header__close-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M18 6L6 18M6 6L18 18"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </transition>
            </button>
          </div>
        </div>

        <!-- Панель профиля -->
        <div
          class="header__profile"
          :class="{
            'header__profile--visible': isProfileOpen,
          }"
        >
          <div class="header__profile-content">
            <div class="header__profile-info">
              <img
                v-if="avatarUrl"
                class="header__profile-avatar"
                :src="avatarUrl"
                alt="Аватар пользователя"
              />
              <div
                v-else
                class="header__profile-avatar-placeholder"
              >
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" fill="#912138"/>
                  <path d="M12.0002 14.5C6.99016 14.5 2.95016 17.86 2.95016 22C2.95016 22.28 3.17016 22.5 3.45016 22.5H20.5502C20.8302 22.5 21.0502 22.28 21.0502 22C21.0502 17.86 17.0102 14.5 12.0002 14.5Z" fill="#912138"/>
                </svg>
              </div>
              <div class="header__profile-details">
                <h3 class="header__profile-name">{{ displayName }}</h3>
                <router-link
                  to="/profile"
                  class="header__profile-link"
                  @click="toggleProfile"
                >
                  профиль
                </router-link>
              </div>
            </div>

            <div class="header__profile-actions">
              <router-link
                to="/settings"
                class="header__profile-action"
                @click="toggleProfile"
              >
                настройки
              </router-link>
              <button
                type="button"
                class="header__profile-action header__profile-action--logout"
                @click="handleLogout"
              >
                выход
              </button>
              <button
                type="button"
                class="header__action-btn header__action-btn--close"
                @click="toggleProfile"
                aria-label="Закрыть профиль"
              >
                <svg class="header__close-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M18 6L6 18M6 6L18 18"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { logout, clearTokens } from '../../api/auth';
import { getProfile, type Profile } from '../../api/profile';

const route = useRoute();
const isProfileOpen = ref(false);
const hasNotifications = ref(false); // Можно подключить к реальным уведомлениям
const profile = ref<Profile | null>(null);
const avatarUrl = ref<string | null>(null);
const displayName = ref<string>('Пользователь');

async function loadProfile(): Promise<void> {
  try {
    const profileData = await getProfile();
    profile.value = profileData;
    
    // Устанавливаем отображаемое имя
    displayName.value = profileData.displayName || profileData.firstName || profileData.login || 'Пользователь';
    
    // Формируем URL аватара
    if (profileData.avatar) {
      if (profileData.avatar.startsWith('http')) {
        avatarUrl.value = profileData.avatar;
      } else if (profileData.avatar.startsWith('/')) {
        const baseUrl = import.meta.env.VITE_API_BASE_URL?.replace('/api/v1', '') || 'http://localhost:3000';
        avatarUrl.value = `${baseUrl}${profileData.avatar}`;
      } else {
        const baseUrl = import.meta.env.VITE_API_BASE_URL?.replace('/api/v1', '') || 'http://localhost:3000';
        avatarUrl.value = `${baseUrl}/api/v1/avatars/${profileData.avatar}`;
      }
    } else {
      avatarUrl.value = null;
    }
  } catch (error) {
    console.error('Ошибка загрузки профиля:', error);
  }
}

onMounted(() => {
  loadProfile();
});

// Перезагружаем профиль при изменении маршрута
watch(() => route.path, () => {
  if (route.path === '/profile') {
    loadProfile();
  }
});

const navItems = [
  { label: 'дашборд', path: '/dashboard' },
  { label: 'проекты', path: '/projects' },
  { label: 'crm', path: '/crm' },
  { label: 'команды', path: '/teams' },
] as const;

const currentPath = computed(() => route.path);

function isActive(path: string): boolean {
  if (path === '/dashboard') {
    return currentPath.value === '/' || currentPath.value.startsWith(path);
  }
  return currentPath.value.startsWith(path);
}

function toggleProfile() {
  isProfileOpen.value = !isProfileOpen.value;
}

async function handleLogout(): Promise<void> {
  try {
    await logout();
  } catch (error) {
    console.error('Logout failed:', error);
  } finally {
    clearTokens();
    window.location.href = '/auth';
  }
}
</script>

<style scoped>
@font-face {
  font-family: 'Involve';
  src: url('/fonts/Involve-Regular.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Involve';
  src: url('/fonts/Involve-Medium.woff2') format('woff2');
  font-weight: 500;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Involve';
  src: url('/fonts/Involve-SemiBold.woff2') format('woff2');
  font-weight: 600;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Involve';
  src: url('/fonts/Involve-Bold.woff2') format('woff2');
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}

/* Base Header */
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  font-family: 'Involve', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
}

.header__container {
  width: 100%;
  background: rgba(145, 33, 56, 0.6);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(225, 234, 248, 0.1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.header__content {
  max-width: 1440px;
  margin: 0 auto;
  position: relative;
  height: clamp(48px, 5vw, 56px);
  overflow: hidden;
}

/* Main Content */
.header__main {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 clamp(0.75rem, 2vw, 1.5rem);
  gap: clamp(1rem, 3vw, 2rem);
  transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1),
    opacity 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: transform, opacity;
}

.header__main--hidden {
  transform: translateX(-100%);
  opacity: 0;
  pointer-events: none;
}

/* Logo */
.header__logo {
  display: flex;
  align-items: center;
  gap: clamp(0.5rem, 1.5vw, 1rem);
  text-decoration: none;
  flex-shrink: 0;
  transition: transform 0.2s ease;
}

.header__logo:hover {
  transform: scale(1.02);
}

.header__logo-icon {
  width: clamp(28px, 3.5vw, 36px);
  height: clamp(28px, 3.5vw, 36px);
  border-radius: 50%;
  background: linear-gradient(135deg, #e1eaf8 0%, #c8d4e8 100%);
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(225, 234, 248, 0.3);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.header__logo:hover .header__logo-icon {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(225, 234, 248, 0.4);
}

.header__logo-text {
  font-size: clamp(1.25rem, 3vw, 1.75rem);
  font-weight: 700;
  color: #e1eaf8;
  letter-spacing: clamp(0.5px, 0.1vw, 1px);
  text-transform: lowercase;
  white-space: nowrap;
  line-height: 1;
}

/* Navigation */
.header__nav {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  gap: clamp(0.5rem, 1.5vw, 1.5rem);
  align-items: center;
}

.header__nav-item {
  padding: clamp(0.375rem, 1vw, 0.5rem) clamp(0.875rem, 2vw, 1.25rem);
  border-radius: clamp(12px, 2vw, 16px);
  font-size: clamp(0.8125rem, 1.5vw, 1rem);
  font-weight: 500;
  color: rgba(225, 234, 248, 0.9);
  text-decoration: none;
  text-transform: lowercase;
  letter-spacing: 0.02em;
  transition: background 0.25s cubic-bezier(0.4, 0, 0.2, 1),
    color 0.25s cubic-bezier(0.4, 0, 0.2, 1),
    transform 0.25s cubic-bezier(0.4, 0, 0.2, 1),
    box-shadow 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  white-space: nowrap;
  background: transparent;
  border: none;
}

.header__nav-item::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: rgba(225, 234, 248, 0.05);
  opacity: 0;
  transition: opacity 0.25s ease;
}

.header__nav-item:hover::before {
  opacity: 1;
}

.header__nav-item:hover {
  color: #e1eaf8;
  transform: translateY(-1px);
}

.header__nav-item--active {
  background: rgba(26, 22, 28, 0.8);
  background-image: url('/images/backgrounds/bg.jpg');
  background-size: cover;
  background-position: center;
  background-blend-mode: overlay;
  color: #ffffff;
  border: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.header__nav-item--active::before {
  opacity: 0;
}

/* Actions */
.header__actions {
  display: flex;
  align-items: center;
  gap: clamp(0.5rem, 1.5vw, 1rem);
  flex-shrink: 0;
}

.header__action-btn {
  position: relative;
  width: clamp(32px, 4vw, 40px);
  height: clamp(32px, 4vw, 40px);
  border-radius: 50%;
  border: none;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  flex-shrink: 0;
}

.header__action-btn:focus-visible {
  outline: 2px solid #e1eaf8;
  outline-offset: 2px;
}

.header__action-btn--notify {
  background: rgba(145, 33, 56, 0.8);
  border: 1px solid rgba(225, 234, 248, 0.1);
}

.header__action-btn--notify:hover {
  background: rgba(145, 33, 56, 1);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(145, 33, 56, 0.4);
}

.header__action-btn--avatar {
  border: 2px solid rgba(145, 33, 56, 0.8);
  overflow: hidden;
  background: rgba(145, 33, 56, 0.2);
}

.header__action-btn--avatar:hover {
  border-color: rgba(184, 61, 94, 1);
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(145, 33, 56, 0.3);
}

.header__action-icon {
  width: clamp(18px, 2.5vw, 22px);
  height: clamp(18px, 2.5vw, 22px);
  color: #e1eaf8;
  stroke-width: 2;
}

.header__notify-badge {
  position: absolute;
  top: 2px;
  right: 2px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #ff4444;
  border: 2px solid rgba(145, 33, 56, 0.8);
  box-shadow: 0 0 4px rgba(255, 68, 68, 0.6);
}

.header__avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.header__avatar-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(145, 33, 56, 0.3);
}

.header__avatar-placeholder svg {
  width: 70%;
  height: 70%;
}

.header__close-icon {
  width: clamp(18px, 2.5vw, 20px);
  height: clamp(18px, 2.5vw, 20px);
  color: #e1eaf8;
  flex-shrink: 0;
}

/* Profile Panel */
.header__profile {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 100%;
  display: flex;
  align-items: center;
  transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1),
    opacity 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: transform, opacity;
  transform: translateX(100%);
  opacity: 0;
  pointer-events: none;
}

.header__profile--visible {
  transform: translateX(0);
  opacity: 1;
  pointer-events: auto;
}

.header__profile-content {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 clamp(0.75rem, 2vw, 1.5rem);
  gap: clamp(1rem, 3vw, 2rem);
}

.header__profile-info {
  display: flex;
  align-items: center;
  gap: clamp(0.75rem, 2vw, 1rem);
  flex: 1;
  min-width: 0;
}

.header__profile-avatar {
  width: clamp(32px, 4vw, 40px);
  height: clamp(32px, 4vw, 40px);
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid rgba(145, 33, 56, 0.8);
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(145, 33, 56, 0.3);
}

.header__profile-avatar-placeholder {
  width: clamp(32px, 4vw, 40px);
  height: clamp(32px, 4vw, 40px);
  border-radius: 50%;
  border: 2px solid rgba(145, 33, 56, 0.8);
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(145, 33, 56, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(145, 33, 56, 0.3);
}

.header__profile-avatar-placeholder svg {
  width: 60%;
  height: 60%;
}

.header__profile-details {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.header__profile-name {
  font-size: clamp(0.875rem, 1.5vw, 1rem);
  font-weight: 600;
  color: #e1eaf8;
  margin: 0;
  text-transform: lowercase;
  letter-spacing: 0.02em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.header__profile-link {
  font-size: clamp(0.75rem, 1.2vw, 0.875rem);
  font-weight: 400;
  color: rgba(225, 234, 248, 0.8);
  text-decoration: none;
  text-transform: lowercase;
  letter-spacing: 0.02em;
  transition: color 0.2s ease;
  white-space: nowrap;
}

.header__profile-link:hover {
  color: #e1eaf8;
}

.header__profile-actions {
  display: flex;
  align-items: center;
  gap: clamp(0.5rem, 1.5vw, 1rem);
  flex-shrink: 0;
}

.header__profile-action {
  padding: clamp(0.375rem, 1vw, 0.5rem) clamp(0.875rem, 2vw, 1.25rem);
  border-radius: clamp(12px, 2vw, 16px);
  font-size: clamp(0.8125rem, 1.5vw, 1rem);
  font-weight: 500;
  color: #e1eaf8;
  text-decoration: none;
  text-transform: lowercase;
  letter-spacing: 0.02em;
  background: rgba(145, 33, 56, 0.8);
  border: 1px solid rgba(225, 234, 248, 0.1);
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  white-space: nowrap;
  font-family: inherit;
}

.header__profile-action:hover {
  background: rgba(145, 33, 56, 1);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(145, 33, 56, 0.4);
}

.header__profile-action--logout {
  background: rgba(184, 61, 94, 0.8);
}

.header__profile-action--logout:hover {
  background: rgba(184, 61, 94, 1);
}

.header__action-btn--close {
  border: 2px solid rgba(145, 33, 56, 0.8);
  background: rgba(145, 33, 56, 0.2);
}

.header__action-btn--close:hover {
  border-color: rgba(184, 61, 94, 1);
  transform: scale(1.05);
}

/* Transitions */
.avatar-transition-enter-active,
.avatar-transition-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.avatar-transition-enter-from {
  opacity: 0;
  transform: scale(0.9);
}

.avatar-transition-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

/* Responsive Design */
@media (max-width: 1024px) {
  .header__nav {
    gap: clamp(0.5rem, 1vw, 1rem);
  }
}

@media (max-width: 768px) {
  .header__nav {
    position: static;
    transform: none;
    flex: 1;
    justify-content: center;
    gap: clamp(0.25rem, 1vw, 0.5rem);
  }

  .header__main {
    gap: clamp(0.5rem, 2vw, 1rem);
  }

  .header__logo {
    gap: clamp(0.375rem, 1vw, 0.75rem);
  }
}

@media (max-width: 640px) {
  .header__nav-item {
    padding: clamp(0.25rem, 1vw, 0.375rem) clamp(0.5rem, 1.5vw, 0.75rem);
    font-size: clamp(0.75rem, 2vw, 0.875rem);
  }

  .header__profile-actions {
    gap: clamp(0.375rem, 1vw, 0.75rem);
  }

  .header__profile-action {
    padding: clamp(0.25rem, 1vw, 0.375rem) clamp(0.5rem, 1.5vw, 0.75rem);
    font-size: clamp(0.75rem, 2vw, 0.875rem);
  }
}

/* Accessibility */
@media (prefers-reduced-motion: reduce) {
  .header__main,
  .header__profile,
  .header__nav-item,
  .header__action-btn,
  .header__profile-action,
  .avatar-transition-enter-active,
  .avatar-transition-leave-active {
    transition: none;
  }

  .header__nav-item:hover,
  .header__action-btn:hover,
  .header__profile-action:hover {
    transform: none;
  }
}

/* Focus styles */
.header__nav-item:focus-visible,
.header__profile-action:focus-visible {
  outline: 2px solid #e1eaf8;
  outline-offset: 2px;
}
</style>



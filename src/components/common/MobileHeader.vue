<template>
  <header
    class="mobile-header"
    :class="{
      'mobile-header--bottom': headerPosition === 'bottom',
    }"
    role="banner"
  >
    <div class="mobile-header__container">
      <div class="mobile-header__content">
        <!-- Навигация -->
        <nav class="mobile-header__nav" aria-label="Основная навигация">
          <router-link
            v-for="item in navItems"
            :key="item.path"
            :to="item.path"
            class="mobile-header__nav-item"
            :class="{ 'mobile-header__nav-item--active': isActive(item.path) }"
            :aria-current="isActive(item.path) ? 'page' : undefined"
          >
            <svg
              class="mobile-header__nav-icon"
              :class="{ 'mobile-header__nav-icon--active': isActive(item.path) }"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                v-if="isActive(item.path)"
                :d="item.activeIconPath"
                fill="currentColor"
              />
              <path
                v-else
                :d="item.iconPath"
                stroke="currentColor"
                stroke-width="2"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </router-link>
        </nav>

        <!-- Меню справа -->
        <button
          type="button"
          class="mobile-header__menu-btn"
          @click="toggleProfile"
          :aria-label="isProfileOpen ? 'Закрыть меню' : 'Открыть меню'"
          :aria-expanded="isProfileOpen"
        >
          <div class="mobile-header__menu-avatar">
            <img
              src="/images/avatars/photo_2025-11-23_17-19-15.jpg"
              alt="Аватар пользователя"
              class="mobile-header__menu-avatar-img"
            />
          </div>
        </button>
      </div>
    </div>

    <!-- Панель профиля -->
    <transition name="profile-slide">
      <div
        v-if="isProfileOpen"
        class="mobile-header__profile-overlay"
        @click="toggleProfile"
      >
        <div
          class="mobile-header__profile-panel"
          @click.stop
        >
          <div class="mobile-header__profile-header">
            <div class="mobile-header__profile-info">
              <img
                src="/images/avatars/photo_2025-11-23_17-19-15.jpg"
                alt="Аватар пользователя"
                class="mobile-header__profile-avatar"
              />
              <div class="mobile-header__profile-details">
                <h3 class="mobile-header__profile-name">Иван Иванов</h3>
              </div>
            </div>
            <button
              type="button"
              class="mobile-header__profile-close"
              @click="toggleProfile"
              aria-label="Закрыть меню"
            >
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
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
          <div class="mobile-header__profile-actions">
            <router-link
              to="/profile"
              class="mobile-header__profile-action"
              @click="toggleProfile"
            >
              профиль
            </router-link>
            <router-link
              to="/settings"
              class="mobile-header__profile-action"
              @click="toggleProfile"
            >
              настройки
            </router-link>
            <button
              type="button"
              class="mobile-header__profile-action mobile-header__profile-action--logout"
              @click="handleLogout"
            >
              выход
            </button>
          </div>
        </div>
      </div>
    </transition>
  </header>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useSettingsStore } from '@/stores/settings';
import { logout, clearTokens } from '../../api/auth';

const route = useRoute();
const settingsStore = useSettingsStore();
const isProfileOpen = ref(false);

const navItems = [
  {
    label: 'дашборд',
    path: '/dashboard',
    // Сетка 2x2 (outline)
    iconPath: 'M3 3h7v7H3V3zm11 0h7v7h-7V3zM3 14h7v7H3v-7zm11 0h7v7h-7v-7z',
    // Сетка 2x2 (filled)
    activeIconPath: 'M3 3h7v7H3V3zm11 0h7v7h-7V3zM3 14h7v7H3v-7zm11 0h7v7h-7v-7z',
  },
  {
    label: 'проекты',
    path: '/projects',
    // Папка (outline)
    iconPath: 'M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-6l-2-2H5a2 2 0 0 0-2 2z',
    // Папка (filled)
    activeIconPath: 'M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-6l-2-2H5a2 2 0 0 0-2 2z',
  },
  {
    label: 'crm',
    path: '/crm',
    // Фильтр/воронка (outline) - три горизонтальные линии разной ширины
    iconPath: 'M3 6h18M5 12h14M7 18h10',
    // Фильтр/воронка (filled) - три горизонтальные линии разной ширины (заполненные)
    activeIconPath: 'M3 5h18v2H3V5zm2 6h14v2H5v-2zm2 6h10v2H7v-2z',
  },
  {
    label: 'команды',
    path: '/teams',
    // Иконка команд из DashboardView.vue (outline версия)
    // Объединены все пути: нижняя часть, круг (голова) как path, правая группа
    iconPath: 'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M5 7a4 4 0 118 0 4 4 0 01-8 0zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75',
    // Filled версия той же иконки
    activeIconPath: 'M17 19v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2h16zM5 7a4 4 0 118 0 4 4 0 01-8 0zm12 0a4 4 0 11-4 4 4 4 0 014-4zM23 19v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75',
  },
] as const;

const currentPath = computed(() => route.path);
const headerPosition = computed(() => settingsStore.mobileHeaderPosition || 'bottom');

function isActive(path: string): boolean {
  if (path === '/dashboard') {
    return currentPath.value === '/' || currentPath.value.startsWith(path);
  }
  return currentPath.value.startsWith(path);
}

function toggleProfile() {
  isProfileOpen.value = !isProfileOpen.value;
  // Блокируем скролл при открытом меню
  if (isProfileOpen.value) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
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

/* Base Mobile Header */
.mobile-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  font-family: 'Involve', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.mobile-header--bottom {
  top: auto;
  bottom: 0;
}

.mobile-header__container {
  width: 100%;
  background: rgba(145, 33, 56, 0.6);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(225, 234, 248, 0.1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.mobile-header--bottom .mobile-header__container {
  border-bottom: none;
  border-top: 1px solid rgba(225, 234, 248, 0.1);
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
}

.mobile-header__content {
  max-width: 100%;
  margin: 0 auto;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px;
  gap: 16px;
}

/* Navigation */
.mobile-header__nav {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
  height: 100%;
}

.mobile-header__nav-item {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(225, 234, 248, 0.6);
  text-decoration: none;
  transition: color 0.2s ease, transform 0.2s ease;
  flex-shrink: 0;
}

.mobile-header__nav-item:hover {
  color: rgba(225, 234, 248, 0.9);
  transform: scale(1.1);
}

.mobile-header__nav-item--active {
  color: #e1eaf8;
}

.mobile-header__nav-icon {
  width: 100%;
  height: 100%;
  color: inherit;
  stroke: currentColor;
  stroke-width: 2;
}

.mobile-header__nav-icon--active {
  fill: currentColor;
  stroke: none;
}

/* Menu Button Right */
.mobile-header__menu-btn {
  width: 48px;
  height: 48px;
  border: none;
  background: transparent;
  cursor: pointer;
  padding: 0;
  flex-shrink: 0;
  position: relative;
  transition: transform 0.2s ease;
}

.mobile-header__menu-btn:hover {
  transform: scale(1.05);
}

.mobile-header__menu-btn:focus-visible {
  outline: 2px solid #e1eaf8;
  outline-offset: 2px;
  border-radius: 50%;
}

.mobile-header__menu-avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid rgba(145, 33, 56, 0.8);
  background: rgba(145, 33, 56, 0.2);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mobile-header__menu-avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
}


/* Profile Panel */
.mobile-header__profile-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  z-index: 1001;
  display: flex;
  align-items: flex-end;
}

.mobile-header__profile-panel {
  width: 100%;
  max-height: 70vh;
  background: rgba(145, 33, 56, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-top: 1px solid rgba(225, 234, 248, 0.1);
  border-radius: 20px 20px 0 0;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  overflow-y: auto;
}

.mobile-header__profile-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.mobile-header__profile-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
  min-width: 0;
}

.mobile-header__profile-avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid rgba(145, 33, 56, 0.8);
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(145, 33, 56, 0.3);
}

.mobile-header__profile-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.mobile-header__profile-name {
  font-size: 1.125rem;
  font-weight: 600;
  color: #e1eaf8;
  margin: 0;
  text-transform: lowercase;
  letter-spacing: 0.02em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}


.mobile-header__profile-close {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid rgba(145, 33, 56, 0.8);
  background: rgba(145, 33, 56, 0.2);
  color: #e1eaf8;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.mobile-header__profile-close:hover {
  border-color: rgba(184, 61, 94, 1);
  transform: scale(1.05);
}

.mobile-header__profile-close svg {
  width: 20px;
  height: 20px;
}

.mobile-header__profile-actions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.mobile-header__profile-action {
  padding: 0.875rem 1.25rem;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 500;
  color: #e1eaf8;
  text-decoration: none;
  text-transform: lowercase;
  letter-spacing: 0.02em;
  background: rgba(145, 33, 56, 0.8);
  border: 1px solid rgba(225, 234, 248, 0.1);
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  text-align: center;
  font-family: inherit;
}

.mobile-header__profile-action:hover {
  background: rgba(145, 33, 56, 1);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(145, 33, 56, 0.4);
}

.mobile-header__profile-action--logout {
  background: rgba(184, 61, 94, 0.8);
}

.mobile-header__profile-action--logout:hover {
  background: rgba(184, 61, 94, 1);
}

/* Transitions */
.profile-slide-enter-active,
.profile-slide-leave-active {
  transition: opacity 0.3s ease;
}

.profile-slide-enter-active .mobile-header__profile-panel,
.profile-slide-leave-active .mobile-header__profile-panel {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.profile-slide-enter-from {
  opacity: 0;
}

.profile-slide-enter-from .mobile-header__profile-panel {
  transform: translateY(100%);
}

.profile-slide-leave-to {
  opacity: 0;
}

.profile-slide-leave-to .mobile-header__profile-panel {
  transform: translateY(100%);
}

/* Responsive - только для мобильных */
@media (min-width: 769px) {
  .mobile-header {
    display: none;
  }
}

/* Safe area для iPhone */
@supports (padding: max(0px)) {
  .mobile-header--bottom {
    padding-bottom: max(0px, env(safe-area-inset-bottom));
  }
}

/* Accessibility */
@media (prefers-reduced-motion: reduce) {
  .mobile-header,
  .mobile-header__nav-item,
  .mobile-header__menu-btn,
  .mobile-header__profile-action,
  .profile-slide-enter-active,
  .profile-slide-leave-active {
    transition: none;
  }

  .mobile-header__nav-item:hover,
  .mobile-header__menu-btn:hover,
  .mobile-header__profile-action:hover {
    transform: none;
  }
}
</style>


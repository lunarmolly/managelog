<template>
  <header class="header">
    <div class="header__glass">
      <div class="header__content">
        <!-- Основной контент -->
        <div
          class="header__main-content"
          :class="{
            '-translate-x-full opacity-0': isProfileOpen,
            'translate-x-0 opacity-100': !isProfileOpen,
          }"
        >
          <router-link class="logo" to="/dashboard">
            <div class="logo__circle" />
            <span class="logo__text">managelog</span>
          </router-link>

          <nav class="nav">
            <router-link
              v-for="item in navItems"
              :key="item.path"
              :to="item.path"
              class="nav__item"
              :class="{ 'nav__item--active': isActive(item.path) }"
            >
              {{ item.label }}
            </router-link>
          </nav>

          <div class="actions">
            <button type="button" class="actions__notify" aria-label="notifications">
              <svg class="actions__notify-icon" viewBox="0 0 40 40" fill="none">
                <circle cx="20" cy="20" r="20" fill="#912138" />
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M12.9382 18C12.9382 16.1435 13.6757 14.363 14.9884 13.0503C16.3012 11.7375 18.0816 11 19.9382 11C21.7947 11 23.5752 11.7375 24.8879 13.0503C26.2007 14.363 26.9382 16.1435 26.9382 18V21.764L28.7602 25.408C28.844 25.5757 28.8836 25.7621 28.8752 25.9494C28.8668 26.1368 28.8106 26.3188 28.712 26.4783C28.6134 26.6379 28.4757 26.7695 28.3119 26.8608C28.1481 26.9521 27.9637 27 27.7762 27H23.8122C23.5897 27.8582 23.0886 28.6183 22.3874 29.1609C21.6863 29.7035 20.8248 29.9979 19.9382 29.9979C19.0516 29.9979 18.1901 29.7035 17.4889 29.1609C16.7877 28.6183 16.2866 27.8582 16.0642 27H12.1002C11.9126 27 11.7282 26.9521 11.5644 26.8608C11.4006 26.7695 11.2629 26.6379 11.1643 26.4783C11.0657 26.3188 11.0095 26.1368 11.0011 25.9494C10.9927 25.7621 11.0323 25.5757 11.1162 25.408L12.9382 21.764V18ZM18.2062 27C18.3817 27.304 18.6342 27.5565 18.9382 27.732C19.2422 27.9075 19.5871 27.9999 19.9382 27.9999C20.2892 27.9999 20.6341 27.9075 20.9381 27.732C21.2421 27.5565 21.4946 27.304 21.6702 27H18.2062ZM19.9382 13C18.6121 13 17.3403 13.5268 16.4026 14.4645C15.4649 15.4021 14.9382 16.6739 14.9382 18V21.764C14.9381 22.0743 14.8659 22.3804 14.7272 22.658L13.5572 25H26.3202L25.1502 22.658C25.0111 22.3805 24.9385 22.0744 24.9382 21.764V18C24.9382 16.6739 24.4114 15.4021 23.4737 14.4645C22.536 13.5268 21.2642 13 19.9382 13Z"
                  fill="#E1EAF8"
                />
              </svg>
            </button>

            <!-- <button type="button" class="actions__checkin">
              <svg class="actions__checkin-icon" viewBox="0 0 17 20" fill="none">
                <path
                  d="M10 0C12.56 0 14.898 0.964 16.667 2.547C16.7662 2.6342 16.8472 2.7402 16.9052 2.85887C16.9633 2.97754 16.9972 3.10653 17.0051 3.2384C17.013 3.37027 16.9947 3.50239 16.9513 3.62714C16.9078 3.75189 16.8401 3.86679 16.7519 3.96521C16.6638 4.06363 16.5571 4.14362 16.4379 4.20055C16.3187 4.25748 16.1894 4.29023 16.0574 4.29691C15.9255 4.30358 15.7936 4.28405 15.6692 4.23944C15.5449 4.19483 15.4306 4.12603 15.333 4.037C14.1819 3.00749 12.7574 2.33315 11.2315 2.09538C9.70561 1.85762 8.1435 2.06659 6.73375 2.69708C5.32399 3.32757 4.12685 4.35261 3.28684 5.64849C2.44682 6.94437 1.99984 8.45568 1.99984 10C1.99984 11.5443 2.44682 13.0556 3.28684 14.3515C4.12685 15.6474 5.32399 16.6724 6.73375 17.3029C8.1435 17.9334 9.70561 18.1424 11.2315 17.9046C12.7574 17.6669 14.1819 16.9925 15.333 15.963C15.4306 15.874 15.5449 15.8052 15.6692 15.7606C15.7936 15.7159 15.9255 15.6964 16.0574 15.7031C16.1894 15.7098 16.3187 15.7425 16.4379 15.7994C16.5571 15.8564 16.6638 15.9364 16.7519 16.0348C16.8401 16.1332 16.9078 16.2481 16.9513 16.3729C16.9947 16.4976 17.013 16.6297 17.0051 16.7616C16.9972 16.8935 16.9633 17.0225 16.9052 17.1411C16.8472 17.2598 16.7662 17.3658 16.667 17.453C14.8351 19.0956 12.4605 20.0028 10 20C4.477 20 0 15.523 0 10C0 4.477 4.477 0 10 0ZM6.964 6.65C6.98611 6.46603 7.0508 6.28975 7.15293 6.13515C7.25507 5.98055 7.39184 5.85189 7.55239 5.75938C7.71294 5.66688 7.89285 5.61307 8.07782 5.60225C8.2628 5.59142 8.44775 5.62386 8.618 5.697L8.943 5.84L9.383 6.042L9.732 6.211L10.122 6.407L10.552 6.63L11.014 6.881L11.508 7.161L11.757 7.306L12.226 7.588L12.654 7.856L13.218 8.224L13.682 8.542L14.137 8.87L14.22 8.931C14.855 9.408 14.86 10.36 14.221 10.84L13.938 11.049L13.545 11.325L13.049 11.66L12.662 11.91L12.232 12.18L11.759 12.463C11.677 12.5117 11.593 12.5607 11.507 12.61L11.009 12.892L10.543 13.145L10.113 13.369L9.723 13.565L9.218 13.807L8.818 13.988L8.616 14.076C8.44583 14.1486 8.2611 14.1805 8.07644 14.1693C7.89178 14.1582 7.71226 14.1042 7.55208 14.0116C7.3919 13.9191 7.25547 13.7905 7.15357 13.6361C7.05167 13.4817 6.98711 13.3057 6.965 13.122L6.911 12.623L6.881 12.289L6.839 11.69L6.815 11.23L6.797 10.724L6.787 10.175V9.596L6.797 9.048L6.815 8.542L6.839 8.082L6.881 7.483L6.952 6.753L6.964 6.65Z"
                  fill="#E1EAF8"
                />
              </svg>
              <span class="actions__checkin-text">чекин</span>
            </button> -->

            <button
              type="button"
              class="actions__avatar-btn"
              @click="toggleProfile"
              :aria-label="isProfileOpen ? 'Закрыть профиль' : 'Открыть профиль'"
            >
              <transition name="avatar-fade" mode="out-in">
                <img
                  v-if="!isProfileOpen"
                  key="avatar"
                  src="/images/avatars/photo_2025-11-23_17-19-15.jpg"
                  alt="avatar"
                  class="actions__avatar-img"
                />
                <svg
                  v-else
                  key="close"
                  class="actions__close-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M18 6L6 18M6 6L18 18"
                    stroke="#E1EAF8"
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
          class="header__profile-panel"
          :class="{
            'translate-x-0 opacity-100': isProfileOpen,
            'translate-x-full opacity-0 pointer-events-none': !isProfileOpen,
          }"
        >
          <div class="profile-panel__content">
            <div class="profile-panel__avatar-section">
              <img
                class="profile-panel__avatar-img"
                src="/images/avatars/photo_2025-11-23_17-19-15.jpg"
                alt="avatar"
              />
              <div class="profile-panel__info">
                <h3 class="profile-panel__name">Иван Иванов</h3>
                <router-link to="/profile" class="profile-panel__profile-link">профиль</router-link>
              </div>
            </div>
            <div class="profile-panel__right-section">
              <div class="profile-panel__actions">
                <!-- <router-link to="/tariff" class="profile-panel__action-btn">тариф</router-link> -->
                <router-link to="/settings" class="profile-panel__action-btn" @click="toggleProfile">настройки</router-link>
                <button class="profile-panel__action-btn" @click="handleLogout">выход</button>
              </div>
              <button
                type="button"
                class="profile-panel__close-btn"
                @click="toggleProfile"
                aria-label="Закрыть профиль"
              >
                <svg class="profile-panel__close-icon" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M18 6L6 18M6 6L18 18"
                    stroke="#E1EAF8"
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
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import { logout, clearTokens } from '../../api/auth';

const route = useRoute();
const isProfileOpen = ref(false);

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
    // Убеждаемся, что токены очищены
    clearTokens();
    // Используем window.location для полной перезагрузки и обхода guard'а
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

.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 71px;
  z-index: 1000;
  display: flex;
  justify-content: center;
  pointer-events: none;
  font-family: 'Involve', Arial, sans-serif;
}

.header__glass {
  width: 95vw;
  max-width: 100%;
  margin: 0.75rem auto 0;
  position: relative;
  height: 71px;
  padding: 0 3px;
  pointer-events: auto;
}

.header__glass::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 71px;
  background: rgba(145, 33, 56, 0.5);
  backdrop-filter: blur(25px);
  -webkit-backdrop-filter: blur(25px);
  border-radius: 40px;
  z-index: -1;
}

.header__content {
  position: relative;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  overflow: hidden;
}

.header__main-content {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 0.38rem;
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.4s ease;
  will-change: transform, opacity;
}

.header__profile-panel {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.4s ease;
  will-change: transform, opacity;
}

.logo {
  display: flex;
  align-items: center;
  gap: 24px;
  text-decoration: none;
  text-transform: lowercase;
}

.logo__circle {
  width: 55px;
  height: 55px;
  border-radius: 50%;
  background: #e1eaf8;
  flex-shrink: 0;
}

.logo__text {
  font-size: 40px;
  font-weight: 600;
  color: #e1eaf8;
  letter-spacing: 1px;
  white-space: nowrap;
  text-transform: lowercase;
}

.nav {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  gap: 12px;
  align-items: center;
}

.nav__item {
  min-width: 140px;
  height: 40px;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 20px;
  color: #e1eaf8;
  font-size: 18px;
  font-weight: 500;
  letter-spacing: 0.8px;
  text-decoration: none;
  text-transform: lowercase;
  transition: opacity 0.2s ease;
}

.nav__item:hover {
  opacity: 0.85;
}

.nav__item--active {
  background-color: #1a161c;
  background-image: url('/images/backgrounds/bg.jpg');
  background-size: cover;
  background-position: center;
  color: #ffffff;
}

.actions {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-shrink: 0;
}

.actions__notify,
.actions__checkin {
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.2s ease;
}

.actions__notify {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #912138;
  flex-shrink: 0;
}

.actions__notify:hover,
.actions__checkin:hover {
  opacity: 0.85;
}

.actions__notify-icon {
  width: 32px;
  height: 32px;
}

.actions__checkin {
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(145, 33, 56, 0.85);
  border-radius: 80px;
  padding: 0 24px;
  height: 48px;
  flex-shrink: 0;
}

.actions__checkin-icon {
  width: 18px;
  height: 22px;
}

.actions__checkin-text {
  color: #e1eaf8;
  font-size: 18px;
  font-weight: 500;
  letter-spacing: 1px;
  text-transform: lowercase;
}

.actions__avatar-btn {
  width: 55px;
  height: 55px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid #912138;
  flex-shrink: 0;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: border-color 0.3s ease, transform 0.2s ease;
  z-index: 10;
  position: relative;
}

.actions__avatar-btn:hover {
  border-color: #b83d5e;
  transform: scale(1.05);
}

.actions__avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.actions__close-icon {
  width: 28px;
  height: 28px;
  flex-shrink: 0;
}

/* Profile Panel Styles */
.profile-panel__content {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 0.38rem;
}

.profile-panel__avatar-section {
  display: flex;
  align-items: center;
  gap: 20px;
}

.profile-panel__avatar-img {
  width: 55px;
  height: 55px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #912138;
  flex-shrink: 0;
}

.profile-panel__info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.profile-panel__name {
  font-size: 20px;
  font-weight: 600;
  color: #e1eaf8;
  margin: 0;
  text-transform: lowercase;
  letter-spacing: 0.5px;
}

.profile-panel__profile-link {
  font-size: 15px;
  font-weight: 400;
  color: #e1eaf8;
  margin: 0;
  opacity: 0.8;
  letter-spacing: 0.3px;
  text-decoration: none;
  text-transform: lowercase;
  transition: opacity 0.2s ease;
  cursor: pointer;
}

.profile-panel__profile-link:hover {
  opacity: 1;
}

.profile-panel__right-section {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-left: auto;
}

.profile-panel__actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.profile-panel__action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 0 24px;
  height: 48px;
  background: rgba(145, 33, 56, 0.85);
  border: none;
  border-radius: 80px;
  color: #e1eaf8;
  font-size: 18px;
  font-weight: 500;
  font-family: 'Involve', Arial, sans-serif;
  text-transform: lowercase;
  letter-spacing: 1px;
  cursor: pointer;
  transition: opacity 0.2s ease;
  text-decoration: none;
  flex-shrink: 0;
}

.profile-panel__action-btn:hover {
  opacity: 0.85;
}

.profile-panel__close-btn {
  width: 55px;
  height: 55px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid #912138;
  flex-shrink: 0;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: border-color 0.3s ease, transform 0.2s ease;
}

.profile-panel__close-btn:hover {
  border-color: #b83d5e;
  transform: scale(1.05);
}

.profile-panel__close-icon {
  width: 28px;
  height: 28px;
  flex-shrink: 0;
}

/* Avatar/Close transition */
.avatar-fade-enter-active,
.avatar-fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.avatar-fade-enter-from {
  opacity: 0;
  transform: scale(0.8);
}

.avatar-fade-leave-to {
  opacity: 0;
  transform: scale(0.8);
}

@media (max-width: 1400px) {
  .header__glass {
    max-width: 100%;
  }
}

@media (max-width: 1280px) {
  .logo__text {
    font-size: 40px;
  }

  .nav__item {
    min-width: 120px;
    font-size: 17px;
  }

  .actions__checkin-text {
    font-size: 17px;
  }
}

@media (max-width: 1100px) {
  .logo__text {
    font-size: 36px;
  }

  .logo__circle {
    width: 45px;
    height: 45px;
  }

  .nav__item {
    min-width: 110px;
    font-size: 16px;
  }
}

@media (max-width: 900px) {
  .logo__text {
    font-size: 32px;
  }

  .nav__item {
    min-width: 100px;
    font-size: 15px;
  }

  .actions__checkin-text {
    display: none;
  }

  .actions__checkin {
    padding: 0;
    width: 36px;
    justify-content: center;
  }
}

@media (max-width: 768px) {
  .logo {
    gap: 12px;
  }

  .logo__text {
    font-size: 28px;
  }

  .logo__circle {
    width: 40px;
    height: 40px;
  }

  .nav {
    position: static;
    transform: none;
    flex: 1;
    justify-content: center;
    gap: 4px;
  }

  .header__content {
    gap: 12px;
  }

  .nav__item {
    min-width: 90px;
    font-size: 14px;
  }

  .actions {
    gap: 8px;
  }
}

@media (max-width: 640px) {
  .logo__text {
    font-size: 24px;
  }

  .nav__item {
    min-width: 70px;
    font-size: 12px;
  }
}
</style>

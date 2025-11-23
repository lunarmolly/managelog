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
                stroke-width="1.5"
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
    // Dashboard outline
    iconPath: 'M19 11C19.5046 10.9998 19.9906 11.1904 20.3605 11.5335C20.7305 11.8766 20.9572 12.3468 20.995 12.85L21 13V19C21.0002 19.5046 20.8096 19.9906 20.4665 20.3605C20.1234 20.7305 19.6532 20.9572 19.15 20.995L19 21H15C14.4954 21.0002 14.0094 20.8096 13.6395 20.4665C13.2695 20.1234 13.0428 19.6532 13.005 19.15L13 19V13C12.9998 12.4954 13.1904 12.0094 13.5335 11.6395C13.8766 11.2695 14.3468 11.0428 14.85 11.005L15 11H19ZM9 15C9.53043 15 10.0391 15.2107 10.4142 15.5858C10.7893 15.9609 11 16.4696 11 17V19C11 19.5304 10.7893 20.0391 10.4142 20.4142C10.0391 20.7893 9.53043 21 9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V17C3 16.4696 3.21071 15.9609 3.58579 15.5858C3.96086 15.2107 4.46957 15 5 15H9ZM9 3C9.53043 3 10.0391 3.21071 10.4142 3.58579C10.7893 3.96086 11 4.46957 11 5V11C11 11.5304 10.7893 12.0391 10.4142 12.4142C10.0391 12.7893 9.53043 13 9 13H5C4.46957 13 3.96086 12.7893 3.58579 12.4142C3.21071 12.0391 3 11.5304 3 11V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9ZM19 13H15V19H19V13ZM9 17H5V19H9V17ZM9 3C9.53043 3 10.0391 3.21071 10.4142 3.58579C10.7893 3.96086 11 4.46957 11 5V11C11 11.5304 10.7893 12.0391 10.4142 12.4142C10.0391 12.7893 9.53043 13 9 13H5C4.46957 13 3.96086 12.7893 3.58579 12.4142C3.21071 12.0391 3 11.5304 3 11V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9ZM9 5H5V11H9V5ZM19 3C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V7C21 7.53043 20.7893 8.03914 20.4142 8.41421C20.0391 8.78929 19.5304 9 19 9H15C14.4696 9 13.9609 8.78929 13.5858 8.41421C13.2107 8.03914 13 7.53043 13 7V5C13 4.46957 13.2107 3.96086 13.5858 3.58579C13.9609 3.21071 14.4696 3 15 3H19ZM19 5H15V7H19V5Z',
    // Dashboard filled
    activeIconPath: 'M19 11C19.5046 10.9998 19.9906 11.1904 20.3605 11.5335C20.7305 11.8766 20.9572 12.3468 20.995 12.85L21 13V19C21.0002 19.5046 20.8096 19.9906 20.4665 20.3605C20.1234 20.7305 19.6532 20.9572 19.15 20.995L19 21H15C14.4954 21.0002 14.0094 20.8096 13.6395 20.4665C13.2695 20.1234 13.0428 19.6532 13.005 19.15L13 19V13C12.9998 12.4954 13.1904 12.0094 13.5335 11.6395C13.8766 11.2695 14.3468 11.0428 14.85 11.005L15 11H19ZM9 15C9.53043 15 10.0391 15.2107 10.4142 15.5858C10.7893 15.9609 11 16.4696 11 17V19C11 19.5304 10.7893 20.0391 10.4142 20.4142C10.0391 20.7893 9.53043 21 9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V17C3 16.4696 3.21071 15.9609 3.58579 15.5858C3.96086 15.2107 4.46957 15 5 15H9ZM9 3C9.53043 3 10.0391 3.21071 10.4142 3.58579C10.7893 3.96086 11 4.46957 11 5V11C11 11.5304 10.7893 12.0391 10.4142 12.4142C10.0391 12.7893 9.53043 13 9 13H5C4.46957 13 3.96086 12.7893 3.58579 12.4142C3.21071 12.0391 3 11.5304 3 11V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9ZM19 3C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V7C21 7.53043 20.7893 8.03914 20.4142 8.41421C20.0391 8.78929 19.5304 9 19 9H15C14.4696 9 13.9609 8.78929 13.5858 8.41421C13.2107 8.03914 13 7.53043 13 7V5C13 4.46957 13.2107 3.96086 13.5858 3.58579C13.9609 3.21071 14.4696 3 15 3H19Z',
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
    // CRM outline
    iconPath: 'M14.001 16.0996C14.4851 16.1001 14.9506 16.2859 15.3027 16.6182C15.6549 16.9506 15.8671 17.4052 15.8955 17.8887C15.9239 18.3721 15.7669 18.8484 15.4561 19.2197C15.1453 19.591 14.7044 19.8295 14.2236 19.8867L14.1973 19.8896L14.1709 19.8916L14.0537 19.8984L14.0273 19.9004H9.99902C9.51492 19.8999 9.04936 19.7141 8.69727 19.3818C8.34513 19.0494 8.13287 18.5948 8.10449 18.1113C8.07612 17.6279 8.23312 17.1516 8.54395 16.7803C8.85469 16.409 9.29564 16.1705 9.77637 16.1133L9.80273 16.1104L9.8291 16.1084L9.94629 16.1016L9.97266 16.0996H14.001ZM17 10.0996C17.5039 10.0996 17.9874 10.2999 18.3438 10.6562C18.7001 11.0126 18.9004 11.4961 18.9004 12C18.9004 12.5039 18.7001 12.9874 18.3438 13.3438C17.9874 13.7001 17.5039 13.9004 17 13.9004H7C6.49609 13.9004 6.01257 13.7001 5.65625 13.3438C5.29993 12.9874 5.09961 12.5039 5.09961 12C5.09961 11.4961 5.29993 11.0126 5.65625 10.6562C6.01257 10.2999 6.49609 10.0996 7 10.0996H17ZM20 4.09961C20.5039 4.09961 20.9874 4.29993 21.3438 4.65625C21.7001 5.01257 21.9004 5.49609 21.9004 6C21.9004 6.50391 21.7001 6.98743 21.3438 7.34375C20.9874 7.70007 20.5039 7.90039 20 7.90039H4C3.49609 7.90039 3.01257 7.70007 2.65625 7.34375C2.29993 6.98743 2.09961 6.50391 2.09961 6C2.09961 5.49609 2.29993 5.01257 2.65625 4.65625C3.01257 4.29993 3.49609 4.09961 4 4.09961H20Z',
    // CRM filled
    activeIconPath: 'M14.001 16.0996C14.4851 16.1001 14.9506 16.2859 15.3027 16.6182C15.6549 16.9506 15.8671 17.4052 15.8955 17.8887C15.9239 18.3721 15.7669 18.8484 15.4561 19.2197C15.1453 19.591 14.7044 19.8295 14.2236 19.8867L14.1973 19.8896L14.1709 19.8916L14.0537 19.8984L14.0273 19.9004H9.99902C9.51492 19.8999 9.04936 19.7141 8.69727 19.3818C8.34513 19.0494 8.13287 18.5948 8.10449 18.1113C8.07612 17.6279 8.23312 17.1516 8.54395 16.7803C8.85469 16.409 9.29564 16.1705 9.77637 16.1133L9.80273 16.1104L9.8291 16.1084L9.94629 16.1016L9.97266 16.0996H14.001ZM17 10.0996C17.5039 10.0996 17.9874 10.2999 18.3438 10.6562C18.7001 11.0126 18.9004 11.4961 18.9004 12C18.9004 12.5039 18.7001 12.9874 18.3438 13.3438C17.9874 13.7001 17.5039 13.9004 17 13.9004H7C6.49609 13.9004 6.01257 13.7001 5.65625 13.3438C5.29993 12.9874 5.09961 12.5039 5.09961 12C5.09961 11.4961 5.29993 11.0126 5.65625 10.6562C6.01257 10.2999 6.49609 10.0996 7 10.0996H17ZM20 4.09961C20.5039 4.09961 20.9874 4.29993 21.3438 4.65625C21.7001 5.01257 21.9004 5.49609 21.9004 6C21.9004 6.50391 21.7001 6.98743 21.3438 7.34375C20.9874 7.70007 20.5039 7.90039 20 7.90039H4C3.49609 7.90039 3.01257 7.70007 2.65625 7.34375C2.29993 6.98743 2.09961 6.50391 2.09961 6C2.09961 5.49609 2.29993 5.01257 2.65625 4.65625C3.01257 4.29993 3.49609 4.09961 4 4.09961H20Z',
  },
  {
    label: 'команды',
    path: '/teams',
    // Teams outline
    iconPath: 'M12 12C13.873 12 15.57 12.62 16.815 13.487C17.998 14.312 19 15.538 19 16.857C19 17.581 18.691 18.181 18.204 18.627C17.746 19.048 17.148 19.321 16.532 19.507C15.301 19.88 13.68 20 12 20C10.32 20 8.699 19.88 7.468 19.507C6.852 19.321 6.254 19.048 5.795 18.627C5.31 18.182 5 17.582 5 16.858C5 15.539 6.002 14.313 7.185 13.488C8.43 12.62 10.127 12 12 12ZM12 14C10.56 14 9.257 14.48 8.33 15.127C7.341 15.817 7 16.519 7 16.857C7 17.161 7.352 17.351 7.672 17.471L7.877 17.541L8.047 17.593C8.987 17.877 10.367 18 12 18C13.508 18 14.799 17.895 15.728 17.656L16.032 17.569L16.222 17.509C16.565 17.392 17 17.195 17 16.857C17 16.519 16.659 15.817 15.67 15.127C14.744 14.481 13.44 14 12 14ZM19 13C20.044 13 20.992 13.345 21.693 13.833C22.333 14.28 23 15.023 23 15.929C23 17.264 21.703 17.742 20.537 17.909L20.237 17.946L19.948 17.971L19.81 17.979C19.932 17.634 20 17.259 20 16.857C19.9994 16.5578 19.9635 16.2598 19.893 15.969C20.279 15.939 20.596 15.889 20.832 15.818C20.936 15.786 20.842 15.688 20.732 15.603L20.625 15.525L20.549 15.474C20.2488 15.2691 19.9104 15.127 19.554 15.056C19.174 14.296 18.59 13.638 17.968 13.113C18.3069 13.0381 18.6529 13.0002 19 13ZM5 13C5.358 13.0013 5.702 13.039 6.032 13.113C5.41 13.638 4.826 14.296 4.446 15.056C4.08958 15.127 3.75116 15.2691 3.451 15.474L3.323 15.562C3.196 15.654 3.047 15.782 3.168 15.818C3.404 15.889 3.721 15.94 4.108 15.969C4.03622 16.2595 3.99995 16.5577 4 16.857C4 17.259 4.068 17.634 4.19 17.979L3.91 17.959L3.614 17.929C2.412 17.782 1 17.322 1 15.929C1 15.024 1.666 14.28 2.307 13.833C3.09997 13.2898 4.03882 12.9994 5 13ZM18.5 7C19.163 7 19.7989 7.26339 20.2678 7.73223C20.7366 8.20107 21 8.83696 21 9.5C21 10.163 20.7366 10.7989 20.2678 11.2678C19.7989 11.7366 19.163 12 18.5 12C17.837 12 17.2011 11.7366 16.7322 11.2678C16.2634 10.7989 16 10.163 16 9.5C16 8.83696 16.2634 8.20107 16.7322 7.73223C17.2011 7.26339 17.837 7 18.5 7ZM5.5 7C6.16304 7 6.79893 7.26339 7.26777 7.73223C7.73661 8.20107 8 8.83696 8 9.5C8 10.163 7.73661 10.7989 7.26777 11.2678C6.79893 11.7366 6.16304 12 5.5 12C4.83696 12 4.20107 11.7366 3.73223 11.2678C3.26339 10.7989 3 10.163 3 9.5C3 8.83696 3.26339 8.20107 3.73223 7.73223C4.20107 7.26339 4.83696 7 5.5 7ZM12 3C13.0609 3 14.0783 3.42143 14.8284 4.17157C15.5786 4.92172 16 5.93913 16 7C16 8.06087 15.5786 9.07828 14.8284 9.82843C14.0783 10.5786 13.0609 11 12 11C10.9391 11 9.92172 10.5786 9.17157 9.82843C8.42143 9.07828 8 8.06087 8 7C8 5.93913 8.42143 4.92172 9.17157 4.17157C9.92172 3.42143 10.9391 3 12 3ZM18.5 9C18.3674 9 18.2402 9.05268 18.1464 9.14645C18.0527 9.24021 18 9.36739 18 9.5C18 9.63261 18.0527 9.75979 18.1464 9.85355C18.2402 9.94732 18.3674 10 18.5 10C18.6326 10 18.7598 9.94732 18.8536 9.85355C18.9473 9.75979 19 9.63261 19 9.5C19 9.36739 18.9473 9.24021 18.8536 9.14645C18.7598 9.05268 18.6326 9 18.5 9ZM5.5 9C5.36739 9 5.24021 9.05268 5.14645 9.14645C5.05268 9.24021 5 9.36739 5 9.5C5 9.63261 5.05268 9.75979 5.14645 9.85355C5.24021 9.94732 5.36739 10 5.5 10C5.63261 10 5.75979 9.94732 5.85355 9.85355C5.94732 9.75979 6 9.63261 6 9.5C6 9.36739 5.94732 9.24021 5.85355 9.14645C5.75979 9.05268 5.63261 9 5.5 9ZM12 5C11.4696 5 10.9609 5.21071 10.5858 5.58579C10.2107 5.96086 10 6.46957 10 7C10 7.53043 10.2107 8.03914 10.5858 8.41421C10.9609 8.78929 11.4696 9 12 9C12.5304 9 13.0391 8.78929 13.4142 8.41421C13.7893 8.03914 14 7.53043 14 7C14 6.46957 13.7893 5.96086 13.4142 5.58579C13.0391 5.21071 12.5304 5 12 5Z',
    // Teams filled
    activeIconPath: 'M12 12C13.873 12 15.57 12.62 16.815 13.487C17.998 14.312 19 15.538 19 16.857C19 17.581 18.691 18.181 18.204 18.627C17.746 19.048 17.148 19.321 16.532 19.507C15.301 19.88 13.68 20 12 20C10.32 20 8.699 19.88 7.468 19.507C6.852 19.321 6.254 19.048 5.795 18.627C5.31 18.182 5 17.582 5 16.858C5 15.539 6.002 14.313 7.185 13.488C8.43 12.62 10.127 12 12 12ZM19 13C20.044 13 20.992 13.345 21.693 13.833C22.333 14.28 23 15.023 23 15.929C23 16.446 22.775 16.875 22.44 17.182C22.134 17.463 21.756 17.628 21.411 17.732C20.941 17.874 20.386 17.947 19.81 17.979C19.932 17.634 20 17.259 20 16.857C20 15.322 19.041 14.018 17.968 13.113C18.3069 13.0381 18.6529 13.0002 19 13ZM5 13C5.358 13.0013 5.702 13.039 6.032 13.113C4.96 14.018 4 15.322 4 16.857C4 17.259 4.068 17.634 4.19 17.979C3.614 17.947 3.06 17.874 2.589 17.732C2.244 17.628 1.866 17.463 1.559 17.182C1.38303 17.0244 1.24228 16.8314 1.14596 16.6156C1.04964 16.3999 0.999902 16.1663 1 15.93C1 15.025 1.666 14.281 2.307 13.834C3.09986 13.2905 4.03871 12.9997 5 13ZM18.5 7C19.163 7 19.7989 7.26339 20.2678 7.73223C20.7366 8.20107 21 8.83696 21 9.5C21 10.163 20.7366 10.7989 20.2678 11.2678C19.7989 11.7366 19.163 12 18.5 12C17.837 12 17.2011 11.7366 16.7322 11.2678C16.2634 10.7989 16 10.163 16 9.5C16 8.83696 16.2634 8.20107 16.7322 7.73223C17.2011 7.26339 17.837 7 18.5 7ZM5.5 7C6.16304 7 6.79893 7.26339 7.26777 7.73223C7.73661 8.20107 8 8.83696 8 9.5C8 10.163 7.73661 10.7989 7.26777 11.2678C6.79893 11.7366 6.16304 12 5.5 12C4.83696 12 4.20107 11.7366 3.73223 11.2678C3.26339 10.7989 3 10.163 3 9.5C3 8.83696 3.26339 8.20107 3.73223 7.73223C4.20107 7.26339 4.83696 7 5.5 7ZM12 3C13.0609 3 14.0783 3.42143 14.8284 4.17157C15.5786 4.92172 16 5.93913 16 7C16 8.06087 15.5786 9.07828 14.8284 9.82843C14.0783 10.5786 13.0609 11 12 11C10.9391 11 9.92172 10.5786 9.17157 9.82843C8.42143 9.07828 8 8.06087 8 7C8 5.93913 8.42143 4.92172 9.17157 4.17157C9.92172 3.42143 10.9391 3 12 3Z',
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
  width: 48px;
  height: 48px;
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


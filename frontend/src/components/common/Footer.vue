<template>
  <footer :class="['footer', $attrs.class]" role="contentinfo">
    <div class="footer__container">
      <div class="footer__content">
        <!-- Логотип и описание -->
        <div class="footer__brand">
          <div class="footer__logo">
            <div class="footer__logo-circle" aria-hidden="true" />
            <span class="footer__logo-text">managelog</span>
          </div>
          <p class="footer__description">
            Современная платформа для управления проектами и командами
          </p>
        </div>

        <!-- Навигационные колонки -->
        <nav class="footer__nav" aria-label="Footer navigation">
          <div class="footer__nav-column">
            <h3 class="footer__nav-title">Навигация</h3>
            <ul class="footer__nav-list">
              <li>
                <router-link class="footer__nav-link" to="/dashboard" aria-label="Дашборд">
                  Дашборд
                </router-link>
              </li>
              <li>
                <router-link class="footer__nav-link" to="/projects" aria-label="Проекты">
                  Проекты
                </router-link>
              </li>
              <li>
                <router-link class="footer__nav-link" to="/crm" aria-label="CRM">
                  CRM
                </router-link>
              </li>
              <li>
                <router-link class="footer__nav-link" to="/teams" aria-label="Команды">
                  Команды
                </router-link>
              </li>
            </ul>
          </div>

          <div class="footer__nav-column">
            <h3 class="footer__nav-title">Пользователям</h3>
            <ul class="footer__nav-list">
              <li>
                <a class="footer__nav-link" href="#contacts" aria-label="Контакты">
                  Контакты
                </a>
              </li>
              <li>
                <a class="footer__nav-link" href="#help" aria-label="Помощь">
                  Помощь
                </a>
              </li>
              <li>
                <a
                  class="footer__nav-link"
                  href="https://t.me/appmanagelog"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Telegram канал"
                >
                  Telegram
                </a>
              </li>
              <li>
                <a
                  class="footer__nav-link"
                  href="mailto:info@managelog.ru"
                  aria-label="Написать на email"
                >
                  Email
                </a>
              </li>
            </ul>
          </div>

          <div class="footer__nav-column">
            <h3 class="footer__nav-title">Юридическая информация</h3>
            <ul class="footer__nav-list">
              <li>
                <router-link
                  class="footer__nav-link"
                  to="/privacy"
                  aria-label="Политика конфиденциальности"
                >
                  Политика конфиденциальности
                </router-link>
              </li>
            </ul>
          </div>
        </nav>

        <!-- Социальные сети и копирайт -->
        <div class="footer__aside">
          <div class="footer__social">
            <h3 class="footer__social-title">Следите за нами</h3>
            <ul class="footer__social-list" role="list">
              <li>
                <a
                  class="footer__social-link"
                  href="https://t.me/appmanagelog"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Telegram"
                >
                  <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
                    <circle cx="24" cy="24" r="24" fill="currentColor" />
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M31.0169 15.1175C31.264 15.0135 31.5345 14.9776 31.8002 15.0136C32.0659 15.0496 32.317 15.1561 32.5276 15.3222C32.7381 15.4882 32.9003 15.7076 32.9973 15.9575C33.0942 16.2075 33.1224 16.4789 33.0789 16.7435L30.8109 30.5005C30.5909 31.8275 29.1349 32.5885 27.9179 31.9275C26.8999 31.3745 25.3879 30.5225 24.0279 29.6335C23.3479 29.1885 21.2649 27.7635 21.5209 26.7495C21.7409 25.8825 25.2409 22.6245 27.2409 20.6875C28.0259 19.9265 27.6679 19.4875 26.7409 20.1875C24.4389 21.9255 20.7429 24.5685 19.5209 25.3125C18.4429 25.9685 17.8809 26.0805 17.2089 25.9685C15.9829 25.7645 14.8459 25.4485 13.9179 25.0635C12.6639 24.5435 12.7249 22.8195 13.9169 22.3175L31.0169 15.1175Z"
                      fill="#E1EAF8"
                    />
                  </svg>
                </a>
              </li>
              <li>
                <a
                  class="footer__social-link"
                  href="mailto:hello@managelog.com"
                  aria-label="Email"
                >
                  <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
                    <circle cx="24" cy="24" r="24" fill="currentColor" />
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M16 24C16 21.8783 16.8429 19.8434 18.3431 18.3431C19.8434 16.8429 21.8783 16 24 16C29.367 16 32.445 20.445 32.006 24.39C31.886 25.476 31.568 26.113 31.286 26.485C31.004 26.857 30.715 27.025 30.553 27.105C29.8 27.482 29.42 27.317 29.27 27.198C29.08 27.048 28.898 26.695 28.986 26.164L28.992 26.132L29.495 21.1C29.5181 20.8713 29.4618 20.6417 29.3355 20.4497C29.2091 20.2577 29.0205 20.1151 28.8014 20.0458C28.5823 19.9766 28.346 19.9849 28.1322 20.0695C27.9185 20.154 27.7405 20.3096 27.628 20.51C27.1591 20.0313 26.5993 19.6512 25.9814 19.3919C25.3635 19.1326 24.7001 18.9994 24.03 19C21.279 19 19 21.229 19 24C19 26.774 21.288 29 24.038 29C25.25 29 26.388 28.564 27.275 27.824C27.45 28.184 27.7 28.506 28.028 28.766C28.945 29.492 30.2 29.518 31.448 28.894C31.785 28.726 32.358 28.384 32.882 27.691C33.406 26.998 33.838 26.009 33.994 24.611C34.556 19.554 30.633 14 24 14C18.477 14 14 18.477 14 24C14 29.523 18.477 34 24 34C25.5422 34.0021 27.0638 33.6461 28.445 32.96C28.6805 32.8408 28.8593 32.6333 28.9424 32.3828C29.0256 32.1324 29.0064 31.8591 28.8889 31.6228C28.7714 31.3864 28.5653 31.2061 28.3154 31.1211C28.0656 31.0361 27.7922 31.0533 27.555 31.169C26.3351 31.7741 24.981 32.0578 23.6208 31.9933C22.2607 31.9287 20.9395 31.5181 19.7824 30.8002C18.6253 30.0823 17.6706 29.081 17.0087 27.891C16.3468 26.701 15.9996 25.3617 16 24ZM21 24C21 22.353 22.364 21 24.03 21C25.95 21 27.394 22.767 27.004 24.62C26.713 25.998 25.465 27 24.038 27C22.368 27 21 25.645 21 24Z"
                      fill="#E1EAF8"
                    />
                  </svg>
                </a>
              </li>
            </ul>
          </div>

          <div class="footer__copyright">
            <svg
              class="footer__copyright-icon"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M12 2C17.523 2 22 6.477 22 12C22 17.523 17.523 22 12 22C6.477 22 2 17.523 2 12C2 6.477 6.477 2 12 2ZM12 4C9.878 4 7.844 4.843 6.343 6.343 4.843 7.843 4 9.878 4 12c0 2.122.843 4.157 2.343 5.657C7.844 19.157 9.878 20 12 20s4.156-.843 5.657-2.343C19.157 16.156 20 14.122 20 12s-.843-4.157-2.343-5.657C16.156 4.843 14.122 4 12 4Zm0 3c.71 0 1.41.151 2.057.442.647.292 1.224.718 1.693 1.25.176.199.265.459.248.724-.016.264-.137.512-.336.688-.199.176-.459.264-.724.248-.264-.016-.512-.137-.688-.336-.403-.457-.936-.781-1.527-.927-.592-.147-1.214-.11-1.784.105-.57.216-1.062.6-1.408 1.101-.346.501-.531 1.096-.531 1.705 0 .609.185 1.204.531 1.705.346.501.838.886 1.408 1.101.57.215 1.192.252 1.784.105.591-.147 1.124-.47 1.527-.927.176-.199.424-.32.688-.336.265-.016.525.072.724.248.199.176.32.424.336.688.017.265-.072.525-.248.724-.552.646-1.253 1.123-2.038 1.409-.785.286-1.629.371-2.455.246-.826-.124-1.607-.434-2.273-.938-.667-.504-1.196-1.167-1.54-1.928-.344-.762-.491-1.597-.429-2.43.062-.833.332-1.637.785-2.339.453-.701 1.075-1.279 1.809-1.678C10.342 7.21 11.165 7 12 7Z"
                fill="currentColor"
              />
            </svg>
            <span class="footer__copyright-text">
              <time :datetime="currentYear">{{ currentYear }}</time>, managelog. Все права защищены
            </span>
          </div>
        </div>
      </div>

      <!-- Кнопка "Наверх" -->
      <button
        v-if="showScrollTop"
        class="footer__scroll-top"
        @click="scrollToTop"
        aria-label="Прокрутить наверх"
        :class="{ 'footer__scroll-top--visible': showScrollTop }"
      >
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M12 19V5M5 12L12 5L19 12"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue';

const currentYear = computed(() => String(new Date().getFullYear()));
const showScrollTop = ref(false);

function handleScroll() {
  showScrollTop.value = window.scrollY > 300;
}

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
  handleScroll();
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
/* Font faces */
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

/* Base footer styles */
.footer {
  width: 100%;
  font-family: 'Involve', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1),
    transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: opacity, transform;
}

.footer.footer--visible {
  opacity: 1;
  transform: translateY(0);
}

.footer__container {
  background: rgba(145, 33, 56, 0.5);
  backdrop-filter: blur(25px);
  -webkit-backdrop-filter: blur(25px);
  border-top: 1px solid rgba(225, 234, 248, 0.1);
}

.footer__content {
  max-width: 1440px;
  margin: 0 auto;
  padding: 3rem 2rem;
  display: grid;
  grid-template-columns: 1fr;
  gap: 3rem;
}

/* Brand section */
.footer__brand {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.footer__logo {
  display: flex;
  align-items: center;
  gap: 1rem;
  text-transform: lowercase;
}

.footer__logo-circle {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background: #e1eaf8;
  flex-shrink: 0;
  transition: transform 0.3s ease;
}

.footer__logo:hover .footer__logo-circle {
  transform: scale(1.1);
}

.footer__logo-text {
  font-size: clamp(1.5rem, 4vw, 2rem);
  font-weight: 700;
  color: #e1eaf8;
  letter-spacing: -0.02em;
  line-height: 1.2;
}

.footer__description {
  font-size: 0.9375rem;
  line-height: 1.6;
  color: rgba(225, 234, 248, 0.8);
  max-width: 24rem;
  margin: 0;
}

/* Navigation */
.footer__nav {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 2.5rem;
}

.footer__nav-column {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.footer__nav-title {
  font-size: 1rem;
  font-weight: 600;
  color: #e1eaf8;
  margin: 0;
  text-transform: lowercase;
  letter-spacing: 0.05em;
}

.footer__nav-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.footer__nav-link {
  font-size: 0.9375rem;
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  text-transform: lowercase;
  letter-spacing: 0.02em;
  transition: all 0.2s ease;
  display: inline-block;
  position: relative;
  padding: 0.25rem 0;
}

.footer__nav-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 1px;
  background: #e1eaf8;
  transition: width 0.3s ease;
}

.footer__nav-link:hover,
.footer__nav-link:focus-visible {
  color: #e1eaf8;
  outline: none;
}

.footer__nav-link:hover::after,
.footer__nav-link:focus-visible::after {
  width: 100%;
}

/* Aside section (social & copyright) */
.footer__aside {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.footer__social {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.footer__social-title {
  font-size: 0.875rem;
  font-weight: 500;
  color: rgba(225, 234, 248, 0.7);
  margin: 0;
  text-transform: lowercase;
  letter-spacing: 0.05em;
}

.footer__social-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  gap: 0.75rem;
}

.footer__social-link {
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  background: rgba(145, 33, 56, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #912138;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-decoration: none;
  position: relative;
  overflow: hidden;
}

.footer__social-link::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(225, 234, 248, 0.1);
  transform: translate(-50%, -50%);
  transition: width 0.4s ease, height 0.4s ease;
}

.footer__social-link:hover::before,
.footer__social-link:focus-visible::before {
  width: 100%;
  height: 100%;
}

.footer__social-link:hover,
.footer__social-link:focus-visible {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(145, 33, 56, 0.4);
  outline: none;
}

.footer__social-link:active {
  transform: translateY(0);
}

.footer__social-link svg {
  width: 1.5rem;
  height: 1.5rem;
  position: relative;
  z-index: 1;
}

/* Copyright */
.footer__copyright {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(225, 234, 248, 0.1);
  font-size: 0.875rem;
  color: rgba(225, 234, 248, 0.7);
  letter-spacing: 0.02em;
}

.footer__copyright-icon {
  width: 1.125rem;
  height: 1.125rem;
  flex-shrink: 0;
  color: rgba(225, 234, 248, 0.7);
}

.footer__copyright-text {
  line-height: 1.5;
}

/* Tablet styles (768px and up) */
@media (min-width: 768px) {
  .footer__content {
    grid-template-columns: 1.5fr 1fr;
    gap: 3rem 4rem;
    padding: 3.5rem 2.5rem;
  }

  .footer__nav {
    grid-template-columns: repeat(2, 1fr);
    gap: 3rem;
  }

  .footer__aside {
    grid-column: 2;
    grid-row: 1 / 3;
    justify-content: space-between;
  }
}

/* Desktop styles (1024px and up) */
@media (min-width: 1024px) {
  .footer__content {
    grid-template-columns: 1.2fr 1.8fr 1fr;
    gap: 4rem;
    padding: 4rem 3rem;
  }

  .footer__brand {
    max-width: none;
  }

  .footer__nav {
    grid-template-columns: repeat(2, 1fr);
    gap: 4rem;
  }

  .footer__aside {
    grid-column: 3;
    grid-row: 1;
  }
}

/* Large desktop styles (1280px and up) */
@media (min-width: 1280px) {
  .footer__content {
    padding: 4.5rem 4rem;
    gap: 5rem;
  }

  .footer__nav {
    gap: 5rem;
  }
}

/* Small mobile styles (max 480px) */
@media (max-width: 480px) {
  .footer__content {
    padding: 2rem 1.25rem;
    gap: 2.5rem;
    padding-bottom: calc(2rem + 4.5rem); /* Добавляем отступ снизу для кнопки "вверх" */
  }

  .footer__logo-circle {
    width: 2rem;
    height: 2rem;
  }

  .footer__social-link {
    width: 2.75rem;
    height: 2.75rem;
  }

  .footer__social-link svg {
    width: 1.25rem;
    height: 1.25rem;
  }

  .footer__nav {
    gap: 2rem;
  }
}

/* Accessibility improvements */
@media (prefers-reduced-motion: reduce) {
  .footer,
  .footer__logo-circle,
  .footer__nav-link,
  .footer__social-link {
    transition: none;
  }
}

/* Focus visible styles for better accessibility */
.footer__nav-link:focus-visible,
.footer__social-link:focus-visible {
  outline: 2px solid #e1eaf8;
  outline-offset: 2px;
  border-radius: 2px;
}

.footer__social-link:focus-visible {
  border-radius: 50%;
}

/* Scroll to top button */
.footer__scroll-top {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 50%;
  background: rgba(145, 33, 56, 0.9);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(225, 234, 248, 0.2);
  color: #e1eaf8;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0;
  transform: translateY(20px) scale(0.8);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1000;
  box-shadow: 0 4px 16px rgba(145, 33, 56, 0.3);
}

.footer__scroll-top:hover,
.footer__scroll-top:focus-visible {
  background: rgba(145, 33, 56, 1);
  transform: translateY(-4px) scale(1);
  box-shadow: 0 8px 24px rgba(145, 33, 56, 0.5);
  outline: none;
}

.footer__scroll-top:active {
  transform: translateY(-2px) scale(0.95);
}

.footer__scroll-top--visible {
  opacity: 1;
  transform: translateY(0) scale(1);
}

.footer__scroll-top svg {
  width: 1.5rem;
  height: 1.5rem;
  transition: transform 0.3s ease;
}

.footer__scroll-top:hover svg {
  transform: translateY(-2px);
}

.footer__scroll-top:focus-visible {
  outline: 2px solid #e1eaf8;
  outline-offset: 2px;
}

/* Responsive scroll button */
@media (max-width: 768px) {
  .footer__scroll-top {
    width: 3rem;
    height: 3rem;
    bottom: 1.5rem;
    right: 1.5rem;
  }

  .footer__scroll-top svg {
    width: 1.25rem;
    height: 1.25rem;
  }

  .footer__content {
    padding-bottom: calc(2.5rem + 4.5rem); /* Добавляем отступ снизу для кнопки "вверх" */
  }
}

@media (max-width: 480px) {
  .footer__scroll-top {
    width: 2.75rem;
    height: 2.75rem;
    bottom: 1rem;
    right: 1rem;
  }
}

/* Accessibility for scroll button */
@media (prefers-reduced-motion: reduce) {
  .footer__scroll-top {
    transition: opacity 0.2s ease;
  }

  .footer__scroll-top:hover,
  .footer__scroll-top:focus-visible {
    transform: none;
  }

  .footer__scroll-top svg {
    transition: none;
  }
}
</style>
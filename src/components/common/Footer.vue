<template>
  <footer class="footer">
    <div class="footer__bg">
      <div class="footer__content">
        <div class="footer__logo">
          <div class="footer__logo-circle" />
          <span class="footer__logo-text">managelog</span>
        </div>

        <div class="footer__main">
          <div class="footer__columns">
            <div class="footer__column">
              <h4 class="footer__column-title">пользователям</h4>
              <a class="footer__link" href="#">контакты</a>
              <a class="footer__link" href="#">помощь</a>
              <a class="footer__link" href="#">telegram</a>
              <a class="footer__link" href="mailto:hello@managelog.com">email</a>
            </div>
            <div class="footer__column">
              <h4 class="footer__column-title">юридическая информация</h4>
              <a class="footer__link" href="#">политика конфиденциальности</a>
              <a class="footer__link" href="#">пользовательское соглашение</a>
              <a class="footer__link" href="#">согласие на обработку персональных данных</a>
            </div>
          </div>

          <div class="footer__right">
            <div class="footer__social">
              <a class="footer__social-btn" href="#" aria-label="telegram">
                <svg viewBox="0 0 48 48" fill="none">
                  <circle cx="24" cy="24" r="24" fill="#912138" />
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M31.0169 15.1175C31.264 15.0135 31.5345 14.9776 31.8002 15.0136C32.0659 15.0496 32.317 15.1561 32.5276 15.3222C32.7381 15.4882 32.9003 15.7076 32.9973 15.9575C33.0942 16.2075 33.1224 16.4789 33.0789 16.7435L30.8109 30.5005C30.5909 31.8275 29.1349 32.5885 27.9179 31.9275C26.8999 31.3745 25.3879 30.5225 24.0279 29.6335C23.3479 29.1885 21.2649 27.7635 21.5209 26.7495C21.7409 25.8825 25.2409 22.6245 27.2409 20.6875C28.0259 19.9265 27.6679 19.4875 26.7409 20.1875C24.4389 21.9255 20.7429 24.5685 19.5209 25.3125C18.4429 25.9685 17.8809 26.0805 17.2089 25.9685C15.9829 25.7645 14.8459 25.4485 13.9179 25.0635C12.6639 24.5435 12.7249 22.8195 13.9169 22.3175L31.0169 15.1175Z"
                    fill="#E1EAF8"
                  />
                </svg>
              </a>
              <a class="footer__social-btn" href="mailto:hello@managelog.com" aria-label="email">
                <svg viewBox="0 0 48 48" fill="none">
                  <circle cx="24" cy="24" r="24" fill="#912138" />
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M16 24C16 21.8783 16.8429 19.8434 18.3431 18.3431C19.8434 16.8429 21.8783 16 24 16C29.367 16 32.445 20.445 32.006 24.39C31.886 25.476 31.568 26.113 31.286 26.485C31.004 26.857 30.715 27.025 30.553 27.105C29.8 27.482 29.42 27.317 29.27 27.198C29.08 27.048 28.898 26.695 28.986 26.164L28.992 26.132L29.495 21.1C29.5181 20.8713 29.4618 20.6417 29.3355 20.4497C29.2091 20.2577 29.0205 20.1151 28.8014 20.0458C28.5823 19.9766 28.346 19.9849 28.1322 20.0695C27.9185 20.154 27.7405 20.3096 27.628 20.51C27.1591 20.0313 26.5993 19.6512 25.9814 19.3919C25.3635 19.1326 24.7001 18.9994 24.03 19C21.279 19 19 21.229 19 24C19 26.774 21.288 29 24.038 29C25.25 29 26.388 28.564 27.275 27.824C27.45 28.184 27.7 28.506 28.028 28.766C28.945 29.492 30.2 29.518 31.448 28.894C31.785 28.726 32.358 28.384 32.882 27.691C33.406 26.998 33.838 26.009 33.994 24.611C34.556 19.554 30.633 14 24 14C18.477 14 14 18.477 14 24C14 29.523 18.477 34 24 34C25.5422 34.0021 27.0638 33.6461 28.445 32.96C28.6805 32.8408 28.8593 32.6333 28.9424 32.3828C29.0256 32.1324 29.0064 31.8591 28.8889 31.6228C28.7714 31.3864 28.5653 31.2061 28.3154 31.1211C28.0656 31.0361 27.7922 31.0533 27.555 31.169C26.3351 31.7741 24.981 32.0578 23.6208 31.9933C22.2607 31.9287 20.9395 31.5181 19.7824 30.8002C18.6253 30.0823 17.6706 29.081 17.0087 27.891C16.3468 26.701 15.9996 25.3617 16 24ZM21 24C21 22.353 22.364 21 24.03 21C25.95 21 27.394 22.767 27.004 24.62C26.713 25.998 25.465 27 24.038 27C22.368 27 21 25.645 21 24Z"
                    fill="#E1EAF8"
                  />
                </svg>
              </a>
            </div>

            <div class="footer__bottom">
              <svg viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2C17.523 2 22 6.477 22 12C22 17.523 17.523 22 12 22C6.477 22 2 17.523 2 12C2 6.477 6.477 2 12 2ZM12 4C9.878 4 7.844 4.843 6.343 6.343 4.843 7.843 4 9.878 4 12c0 2.122.843 4.157 2.343 5.657C7.844 19.157 9.878 20 12 20s4.156-.843 5.657-2.343C19.157 16.156 20 14.122 20 12s-.843-4.157-2.343-5.657C16.156 4.843 14.122 4 12 4Zm0 3c.71 0 1.41.151 2.057.442.647.292 1.224.718 1.693 1.25.176.199.265.459.248.724-.016.264-.137.512-.336.688-.199.176-.459.264-.724.248-.264-.016-.512-.137-.688-.336-.403-.457-.936-.781-1.527-.927-.592-.147-1.214-.11-1.784.105-.57.216-1.062.6-1.408 1.101-.346.501-.531 1.096-.531 1.705 0 .609.185 1.204.531 1.705.346.501.838.886 1.408 1.101.57.215 1.192.252 1.784.105.591-.147 1.124-.47 1.527-.927.176-.199.424-.32.688-.336.265-.016.525.072.724.248.199.176.32.424.336.688.017.265-.072.525-.248.724-.552.646-1.253 1.123-2.038 1.409-.785.286-1.629.371-2.455.246-.826-.124-1.607-.434-2.273-.938-.667-.504-1.196-1.167-1.54-1.928-.344-.762-.491-1.597-.429-2.43.062-.833.332-1.637.785-2.339.453-.701 1.075-1.279 1.809-1.678C10.342 7.21 11.165 7 12 7Z"
                  fill="#E1EAF8"
                />
              </svg>
              <span class="footer__copyright-text">2025, managelog. Все права защищены</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
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

.footer {
  width: 100%;
  font-family: 'Involve', Arial, sans-serif;
}

.footer__bg {
  background: rgba(145, 33, 56, 0.5);
  backdrop-filter: blur(25px);
  -webkit-backdrop-filter: blur(25px);
  padding: 24px 36px;
}

.footer__content {
  display: flex;
  align-items: center;
  gap: 24px;
  max-width: 1440px;
  margin: 0 auto;
  width: 100%;
}

.footer__logo {
  display: flex;
  align-items: center;
  gap: 24px;
  text-transform: lowercase;
}

.footer__logo-circle {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  background: #e1eaf8;
}

.footer__logo-text {
  font-size: 31px;
  font-weight: 700;
  color: #e1eaf8;
  white-space: nowrap;
}

.footer__main {
  display: flex;
  gap: 24px;
  flex: 1;
  align-items: flex-start;
  color: #e1eaf8;
}

.footer__columns {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 24px;
  flex: 1;
}

.footer__column {
  display: flex;
  flex-direction: column;
  gap: 12px;
  text-transform: lowercase;
}

.footer__column-title {
  margin: 0;
  font-size: 24px;
  letter-spacing: 1.2px;
}

.footer__link {
  font-size: 15px;
  color: #ffffff;
  letter-spacing: 0.75px;
  text-decoration: none;
  transition: opacity 0.2s ease;
}

.footer__link:hover {
  opacity: 0.8;
}

.footer__right {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 132px;
  width: 359px;
}

.footer__social {
  display: flex;
  gap: 12px;
}

.footer__social-btn {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #912138;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease;
}

.footer__social-btn:hover {
  transform: scale(1.05);
}

.footer__social-btn svg {
  width: 100%;
  height: 100%;
}

.footer__bottom {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 0 0;
  color: #e1eaf8;
  letter-spacing: 0.75px;
  font-size: 15px;
}

.footer__bottom svg {
  width: 24px;
  height: 24px;
  fill: #e1eaf8;
}

@media (max-width: 1200px) {
  .footer__right {
    width: 280px;
  }
}

@media (max-width: 1024px) {
  .footer__bg {
    padding: 24px;
  }

  .footer__columns {
    gap: 16px;
  }

  .footer__logo-text {
    font-size: 26px;
  }

  .footer__right {
    width: 240px;
    height: auto;
    gap: 20px;
  }
}

@media (max-width: 768px) {
  .footer__content {
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
  }

  .footer__main {
    flex-direction: column;
    width: 100%;
  }

  .footer__columns {
    grid-template-columns: 1fr;
  }

  .footer__right {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .footer__bg {
    padding: 16px;
  }

  .footer__logo-text {
    font-size: 22px;
  }

  .footer__social-btn {
    width: 40px;
    height: 40px;
  }
}
</style>

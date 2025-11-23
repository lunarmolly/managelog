<template>
  <div class="settings">
    <div class="settings__container">
      <h1 class="settings__title">настройки</h1>

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
import { useSettingsStore } from '@/stores/settings';

const settingsStore = useSettingsStore();
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


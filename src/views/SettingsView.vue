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
}
</style>


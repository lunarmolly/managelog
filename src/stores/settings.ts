import { defineStore } from 'pinia';
import { ref } from 'vue';

export type HeaderType = 'brand' | 'compact';
export type MobileHeaderPosition = 'top' | 'bottom';

export const useSettingsStore = defineStore('settings', () => {
  // По умолчанию компактная версия
  const headerType = ref<HeaderType>('compact');
  // По умолчанию header снизу
  const mobileHeaderPosition = ref<MobileHeaderPosition>('bottom');

  // Загружаем настройки из localStorage при инициализации
  const loadSettings = () => {
    if (typeof window !== 'undefined') {
      const savedHeaderType = localStorage.getItem('headerType');
      if (savedHeaderType === 'brand' || savedHeaderType === 'compact') {
        headerType.value = savedHeaderType;
      }

      const savedPosition = localStorage.getItem('mobileHeaderPosition');
      if (savedPosition === 'top' || savedPosition === 'bottom') {
        mobileHeaderPosition.value = savedPosition;
      }
    }
  };

  // Сохраняем настройки в localStorage
  const setHeaderType = (type: HeaderType) => {
    headerType.value = type;
    if (typeof window !== 'undefined') {
      localStorage.setItem('headerType', type);
    }
  };

  const setMobileHeaderPosition = (position: MobileHeaderPosition) => {
    mobileHeaderPosition.value = position;
    if (typeof window !== 'undefined') {
      localStorage.setItem('mobileHeaderPosition', position);
    }
  };

  // Инициализация при создании store
  loadSettings();

  return {
    headerType,
    mobileHeaderPosition,
    setHeaderType,
    setMobileHeaderPosition,
  };
});


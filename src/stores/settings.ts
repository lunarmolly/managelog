import { defineStore } from 'pinia';
import { ref } from 'vue';

export type HeaderType = 'brand' | 'compact';

export const useSettingsStore = defineStore('settings', () => {
  // По умолчанию компактная версия
  const headerType = ref<HeaderType>('compact');

  // Загружаем настройки из localStorage при инициализации
  const loadSettings = () => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('headerType');
      if (saved === 'brand' || saved === 'compact') {
        headerType.value = saved;
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

  // Инициализация при создании store
  loadSettings();

  return {
    headerType,
    setHeaderType,
  };
});


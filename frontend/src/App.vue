<template>
  <div class="app">
    <!-- Desktop Headers -->
    <BrandHeader
      v-if="shouldShowHeader && settingsStore.headerType === 'brand' && !isMobile"
    />
    <CompactHeader
      v-if="shouldShowHeader && settingsStore.headerType === 'compact' && !isMobile"
    />
    <!-- Mobile Header -->
    <MobileHeader
      v-if="shouldShowHeader && isMobile"
    />
    <main
      :class="[
        'app__content',
        {
          'app__content--with-header-brand': shouldShowHeader && settingsStore.headerType === 'brand' && !isMobile,
          'app__content--with-header-compact': shouldShowHeader && settingsStore.headerType === 'compact' && !isMobile,
          'app__content--with-mobile-header': shouldShowHeader && isMobile,
          'app__content--with-mobile-header-top': shouldShowHeader && isMobile && settingsStore.mobileHeaderPosition === 'top',
          'app__content--with-mobile-header-bottom': shouldShowHeader && isMobile && settingsStore.mobileHeaderPosition === 'bottom',
        },
      ]"
    >
      <router-view />
    </main>
    <Footer :class="{ 'footer--visible': showFooter }" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted, nextTick, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useSettingsStore } from '@/stores/settings';
import BrandHeader from '@/components/common/BrandHeader.vue';
import CompactHeader from '@/components/common/CompactHeader.vue';
import MobileHeader from '@/components/common/MobileHeader.vue';
import Footer from '@/components/common/Footer.vue';

const route = useRoute();
const settingsStore = useSettingsStore();
const showFooter = ref(false);
const windowWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 1920);

const isMobile = computed(() => windowWidth.value <= 768);

const shouldShowHeader = computed(() => {
  return !route.path.startsWith('/auth') && route.path !== '/privacy';
});

function handleResize() {
  windowWidth.value = window.innerWidth;
  // Проверяем прокрутку при изменении размера окна
  checkScroll();
}

function checkScroll() {
  // Используем несколько способов определения прокрутки для надежности
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
  const documentHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
  const windowHeight = window.innerHeight || document.documentElement.clientHeight;
  
  // Показываем футер только при прокрутке больше 100px
  // Также проверяем, что есть что прокручивать
  const shouldShow = scrollTop > 100 && documentHeight > windowHeight;
  
  if (shouldShow && !showFooter.value) {
    // Добавляем небольшую задержку для анимации
    nextTick(() => {
      setTimeout(() => {
        showFooter.value = true;
      }, 50);
    });
  } else if (!shouldShow && showFooter.value) {
    showFooter.value = false;
  }
}

// Отслеживаем изменения маршрута
watch(() => route.path, () => {
  // Сбрасываем футер при смене страницы
  showFooter.value = false;
  checkScroll();
});

onMounted(() => {
  window.addEventListener('scroll', checkScroll, { passive: true });
  window.addEventListener('resize', handleResize);
  // Проверяем при монтировании с небольшой задержкой, чтобы DOM успел отрендериться
  nextTick(() => {
    setTimeout(() => {
      checkScroll();
    }, 100);
  });
});

onUnmounted(() => {
  window.removeEventListener('scroll', checkScroll);
  window.removeEventListener('resize', handleResize);
});
</script>

<style>
body {
  margin: 0;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  font-family: 'Involve', Arial, sans-serif;
}

.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app__content {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding-top: 24px;
}

.app__content--with-header-brand {
  padding-top: 5rem;
}

.app__content--with-header-compact {
  padding-top: 3rem;
}

.app__content--with-mobile-header-top {
  padding-top: 80px;
  padding-bottom: 0;
}

.app__content--with-mobile-header-bottom {
  padding-top: 0;
  padding-bottom: 80px;
}

</style>

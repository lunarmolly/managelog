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
import { computed, ref, onMounted, onUnmounted } from 'vue';
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
}

function checkScroll() {
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  // Показываем футер, если прокрутка больше 100px
  showFooter.value = scrollTop > 100;
}

onMounted(() => {
  window.addEventListener('scroll', checkScroll);
  window.addEventListener('resize', handleResize);
  checkScroll(); // Проверяем при монтировании
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

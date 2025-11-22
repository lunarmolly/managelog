<template>
  <div class="app">
    <BrandHeader v-if="shouldShowHeader && settingsStore.headerType === 'brand'" />
    <CompactHeader v-if="shouldShowHeader && settingsStore.headerType === 'compact'" />
    <main
      :class="[
        'app__content',
        {
          'app__content--with-header-brand': shouldShowHeader && settingsStore.headerType === 'brand',
          'app__content--with-header-compact': shouldShowHeader && settingsStore.headerType === 'compact',
        },
      ]"
    >
      <router-view />
    </main>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useSettingsStore } from '@/stores/settings';
import BrandHeader from '@/components/common/BrandHeader.vue';
import CompactHeader from '@/components/common/CompactHeader.vue';
import Footer from '@/components/common/Footer.vue';

const route = useRoute();
const settingsStore = useSettingsStore();

const shouldShowHeader = computed(() => {
  return !route.path.startsWith('/auth') && route.path !== '/privacy';
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
  padding-top: 120px;
}

.app__content--with-header-compact {
  padding-top: 3rem;
}
</style>

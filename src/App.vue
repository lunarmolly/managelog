<template>
  <div class="app">
    <Header v-if="shouldShowHeader" />
    <main :class="['app__content', { 'app__content--with-header': shouldShowHeader }]">
      <router-view />
    </main>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import Header from '@/components/common/Header.vue';
import Footer from '@/components/common/Footer.vue';

const route = useRoute();
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

.app__content--with-header {
  padding-top: 120px;
}
</style>

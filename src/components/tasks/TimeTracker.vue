<template>
  <div class="flex items-center gap-2">
    <button
      @click="toggle"
      :class="[
        'px-3 py-1 rounded text-sm font-medium',
        isRunning ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
      ]"
    >
      {{ isRunning ? 'Стоп' : 'Старт' }}
    </button>
    <span class="text-sm text-gray-600">{{ formatTime(totalMs) }}</span>
    <span v-if="isRunning" class="text-xs text-gray-500 animate-pulse">●</span>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { mockBus } from '../../realtime/mockBus';

const props = defineProps<{
  taskId: string;
  initialTotalMs?: number;
}>();

const emit = defineEmits<{
  (e: 'update', totalMs: number): void;
}>();

const totalMs = ref(props.initialTotalMs || 0);
const startedAt = ref<number | null>(null);
const intervalId = ref<number | null>(null);

const isRunning = computed(() => startedAt.value !== null);

function toggle() {
  if (isRunning.value) {
    stop();
  } else {
    start();
  }
}

function start() {
  startedAt.value = Date.now();
  intervalId.value = window.setInterval(() => {
    if (startedAt.value) {
      const elapsed = Date.now() - startedAt.value;
      const newTotal = totalMs.value + elapsed;
      totalMs.value = newTotal;
      emit('update', newTotal);
      
      // Emit realtime event
      mockBus.simulateTimeTracking('room1', props.taskId, newTotal, startedAt.value);
    }
  }, 1000);
}

function stop() {
  if (startedAt.value) {
    const elapsed = Date.now() - startedAt.value;
    totalMs.value += elapsed;
    emit('update', totalMs.value);
    
    // Emit realtime event
    mockBus.simulateTimeTracking('room1', props.taskId, totalMs.value);
  }
  
  startedAt.value = null;
  if (intervalId.value) {
    clearInterval(intervalId.value);
    intervalId.value = null;
  }
}

function formatTime(ms: number) {
  const hours = Math.floor(ms / 3600000);
  const minutes = Math.floor((ms % 3600000) / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  
  if (hours > 0) {
    return `${hours}ч ${minutes}м`;
  } else if (minutes > 0) {
    return `${minutes}м ${seconds}с`;
  } else {
    return `${seconds}с`;
  }
}

onMounted(() => {
  // Listen for realtime updates
  mockBus.subscribe('room1', 'time.synced', (payload) => {
    if (payload.taskId === props.taskId) {
      totalMs.value = payload.totalMs;
      if (payload.startedAt) {
        startedAt.value = payload.startedAt;
        start();
      }
    }
  });
});

onUnmounted(() => {
  if (intervalId.value) {
    clearInterval(intervalId.value);
  }
});
</script>

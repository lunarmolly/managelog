<template>
  <div class="color-picker">
    <div class="flex gap-2 mb-3">
      <button
        v-for="color in presetColors"
        :key="color"
        @click="selectColor(color)"
        :class="[
          'w-8 h-8 rounded border-2',
          selectedColor === color ? 'border-gray-800' : 'border-gray-300'
        ]"
        :style="{ backgroundColor: color }"
      />
    </div>
    <div class="flex items-center gap-2">
      <input
        v-model="customColor"
        type="color"
        class="w-8 h-8 border rounded"
        @change="selectColor(customColor)"
      />
      <input
        v-model="customColor"
        type="text"
        placeholder="#000000"
        class="px-2 py-1 border rounded text-sm"
        @change="selectColor(customColor)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
  value?: string;
}>();

const emit = defineEmits<{
  (e: 'update', color: string): void;
}>();

const presetColors = [
  '#3b82f6', // blue
  '#10b981', // emerald
  '#f59e0b', // amber
  '#ef4444', // red
  '#8b5cf6', // violet
  '#6b7280', // gray
];

const selectedColor = ref(props.value || presetColors[0]);
const customColor = ref(props.value || '#3b82f6');

function selectColor(color: string) {
  selectedColor.value = color;
  customColor.value = color;
  emit('update', color);
}
</script>

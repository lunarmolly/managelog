<template>
  <div
    :class="[
      'comment-item',
      isHighlighted ? 'bg-yellow-50 border-yellow-200' : 'bg-gray-50'
    ]"
    ref="commentRef"
  >
    <div class="flex items-start gap-3">
      <div class="w-8 h-8 bg-gray-300 rounded-full flex-shrink-0"></div>
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2 mb-1">
          <span class="text-sm font-medium">{{ comment.author }}</span>
          <span class="text-xs text-gray-500">{{ formatDate(comment.createdAt) }}</span>
        </div>
        
        <div v-if="!isEditing" class="text-sm text-gray-700">
          {{ comment.text }}
        </div>
        
        <div v-else class="space-y-2">
          <textarea
            v-model="editText"
            class="w-full border rounded px-2 py-1 text-sm"
            rows="2"
          ></textarea>
          <div class="flex gap-2">
            <button
              @click="saveEdit"
              class="bg-blue-600 text-white px-2 py-1 rounded text-xs"
            >
              Сохранить
            </button>
            <button
              @click="cancelEdit"
              class="bg-gray-500 text-white px-2 py-1 rounded text-xs"
            >
              Отмена
            </button>
          </div>
        </div>
      </div>
      
      <!-- Меню три точки -->
      <div class="relative">
        <button
          @click="showMenu = !showMenu"
          class="p-1 hover:bg-gray-200 rounded"
        >
          ⋯
        </button>
        
        <div
          v-if="showMenu"
          class="absolute right-0 top-8 bg-white border rounded shadow-lg z-10 min-w-32"
        >
          <button
            @click="startEdit"
            class="w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
          >
            Редактировать
          </button>
          <button
            @click="copyLink"
            class="w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
          >
            Копировать ссылку
          </button>
          <button
            @click="deleteComment"
            class="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 text-red-600"
          >
            Удалить
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick, watch } from 'vue';

const props = defineProps<{
  comment: {
    id: string;
    text: string;
    author: string;
    createdAt: string;
  };
  isHighlighted?: boolean;
}>();

const emit = defineEmits<{
  (e: 'update', commentId: string, updates: any): void;
  (e: 'delete', commentId: string): void;
  (e: 'copy-link', commentId: string): void;
}>();

const showMenu = ref(false);
const isEditing = ref(false);
const editText = ref('');
const commentRef = ref<HTMLElement>();

function formatDate(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMins < 1) return 'только что';
  if (diffMins < 60) return `${diffMins} мин назад`;
  if (diffHours < 24) return `${diffHours} ч назад`;
  if (diffDays < 7) return `${diffDays} дн назад`;
  return date.toLocaleDateString('ru-RU');
}

function startEdit() {
  isEditing.value = true;
  editText.value = props.comment.text;
  showMenu.value = false;
}

function saveEdit() {
  if (editText.value.trim()) {
    emit('update', props.comment.id, { text: editText.value.trim() });
  }
  isEditing.value = false;
}

function cancelEdit() {
  isEditing.value = false;
  editText.value = '';
}

function copyLink() {
  emit('copy-link', props.comment.id);
  showMenu.value = false;
}

function deleteComment() {
  if (confirm('Удалить комментарий?')) {
    emit('delete', props.comment.id);
  }
  showMenu.value = false;
}

// Закрыть меню при клике вне его
function handleClickOutside(event: MouseEvent) {
  const target = event.target as HTMLElement;
  if (!target.closest('.comment-item')) {
    showMenu.value = false;
  }
}

// Прокрутка к комментарию при подсветке
watch(() => props.isHighlighted, (highlighted) => {
  if (highlighted && commentRef.value) {
    nextTick(() => {
      commentRef.value?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }
});

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

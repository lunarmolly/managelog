<template>
  <div class="comments-section">
    <h3 class="text-sm font-medium mb-3">Комментарии</h3>
    
    <!-- Форма добавления комментария -->
    <div class="mb-4">
      <textarea
        v-model="newComment"
        placeholder="Добавить комментарий..."
        class="w-full border rounded px-3 py-2 text-sm"
        rows="3"
      ></textarea>
      <div class="flex justify-end mt-2">
        <button
          @click="addComment"
          :disabled="!newComment.trim()"
          class="bg-blue-600 text-white px-3 py-1 rounded text-sm disabled:opacity-50"
        >
          Добавить
        </button>
      </div>
    </div>
    
    <!-- Список комментариев -->
    <div class="space-y-3">
      <CommentItem
        v-for="comment in sortedComments"
        :key="comment.id"
        :comment="comment"
        :is-highlighted="comment.id === highlightCommentId"
        @update="updateComment"
        @delete="deleteComment"
        @copy-link="copyCommentLink"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import CommentItem from './CommentItem.vue';
import { createComment, updateComment as updateCommentApi, deleteComment as deleteCommentApi } from '../../api/projects';
import { mockBus } from '../../realtime/mockBus';

const props = defineProps<{
  taskId: string;
  highlightCommentId?: string;
}>();

const route = useRoute();
const newComment = ref('');

// Моковые комментарии
const comments = ref([
  {
    id: 'c1',
    text: 'Начал работу над задачей',
    author: 'user1',
    createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 час назад
  },
  {
    id: 'c2',
    text: 'Проверил требования, всё понятно',
    author: 'user2',
    createdAt: new Date(Date.now() - 1800000).toISOString(), // 30 мин назад
  },
  {
    id: 'c3',
    text: 'Готово к тестированию',
    author: 'user1',
    createdAt: new Date().toISOString(), // сейчас
  },
]);

// Сортировка от новых к старым
const sortedComments = computed(() => {
  return [...comments.value].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
});

async function addComment() {
  if (!newComment.value.trim()) return;
  
  try {
    const { comment } = await createComment('company1', 'project1', props.taskId, {
      text: newComment.value.trim(),
    });
    
    comments.value.push(comment);
    newComment.value = '';
    
    // Emit realtime event
    mockBus.simulateCommentCreated('room1', props.taskId, comment);
  } catch (error) {
    console.error('Failed to create comment:', error);
  }
}

async function updateComment(commentId: string, updates: any) {
  try {
    const { comment } = await updateCommentApi('company1', 'project1', props.taskId, commentId, {
      text: updates.text,
    });
    
    const existingComment = comments.value.find(c => c.id === commentId);
    if (existingComment) {
      Object.assign(existingComment, comment);
    }
    
    mockBus.simulateCommentUpdated('room1', props.taskId, commentId, comment);
  } catch (error) {
    console.error('Failed to update comment:', error);
  }
}

async function deleteComment(commentId: string) {
  try {
    await deleteCommentApi('company1', 'project1', props.taskId, commentId);
    comments.value = comments.value.filter(c => c.id !== commentId);
    mockBus.simulateCommentDeleted('room1', props.taskId, commentId);
  } catch (error) {
    console.error('Failed to delete comment:', error);
  }
}

function copyCommentLink(commentId: string) {
  const url = `${window.location.origin}${route.path}?taskId=${props.taskId}&commentId=${commentId}`;
  navigator.clipboard.writeText(url);
  // TODO: показать уведомление
}

onMounted(() => {
  // Listen for realtime comment events
  mockBus.subscribe('room1', 'comment.created', (payload) => {
    if (payload.taskId === props.taskId) {
      comments.value.push(payload.comment);
    }
  });
  
  mockBus.subscribe('room1', 'comment.updated', (payload) => {
    if (payload.taskId === props.taskId) {
      const comment = comments.value.find(c => c.id === payload.commentId);
      if (comment) {
        Object.assign(comment, payload.comment);
      }
    }
  });
  
  mockBus.subscribe('room1', 'comment.deleted', (payload) => {
    if (payload.taskId === props.taskId) {
      comments.value = comments.value.filter(c => c.id !== payload.commentId);
    }
  });
});
</script>

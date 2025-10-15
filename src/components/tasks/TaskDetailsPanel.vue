<template>
  <div v-if="isOpen" class="task-panel">
    <div class="task-panel-header">
      <h2 class="text-lg font-semibold">{{ task?.title || 'Новая задача' }}</h2>
      <button @click="closePanel" class="text-gray-500 hover:text-gray-700">×</button>
    </div>
    
    <div class="task-panel-content">
      <!-- Основные поля -->
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-1">Заголовок</label>
          <input
            v-model="taskForm.title"
            type="text"
            class="w-full border rounded px-3 py-2"
            placeholder="Введите заголовок задачи"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium mb-1">Описание</label>
          <textarea
            v-model="taskForm.description"
            class="w-full border rounded px-3 py-2 h-24"
            placeholder="Описание задачи"
          ></textarea>
        </div>
        
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium mb-1">Дедлайн</label>
            <input
              v-model="taskForm.deadline"
              type="date"
              class="w-full border rounded px-3 py-2"
            />
          </div>
          <div class="flex items-center">
            <input
              v-model="taskForm.priority"
              type="checkbox"
              id="priority"
              class="mr-2"
            />
            <label for="priority" class="text-sm">Срочно</label>
          </div>
        </div>
        
        <div>
          <label class="block text-sm font-medium mb-1">Исполнители</label>
          <div class="flex flex-wrap gap-2">
            <div
              v-for="assignee in taskForm.assignees"
              :key="assignee"
              class="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm flex items-center gap-1"
            >
              {{ assignee }}
              <button @click="removeAssignee(assignee)" class="text-blue-600">×</button>
            </div>
            <input
              v-model="newAssignee"
              @keyup.enter="addAssignee"
              type="text"
              placeholder="Добавить исполнителя"
              class="border rounded px-2 py-1 text-sm"
            />
          </div>
        </div>
        
        <div>
          <label class="block text-sm font-medium mb-1">Наблюдатели</label>
          <div class="flex flex-wrap gap-2">
            <div
              v-for="watcher in taskForm.watchers"
              :key="watcher"
              class="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm flex items-center gap-1"
            >
              {{ watcher }}
              <button @click="removeWatcher(watcher)" class="text-gray-600">×</button>
            </div>
            <input
              v-model="newWatcher"
              @keyup.enter="addWatcher"
              type="text"
              placeholder="Добавить наблюдателя"
              class="border rounded px-2 py-1 text-sm"
            />
          </div>
        </div>
        
        <!-- Тайм-трекер -->
        <div v-if="task">
          <label class="block text-sm font-medium mb-1">Время</label>
          <TimeTracker
            :task-id="task.id"
            :initial-total-ms="task.timeTracking?.totalMs || 0"
            @update="updateTimeTracking"
          />
        </div>
      </div>
      
      <!-- Чек-лист -->
      <div class="mt-6">
        <h3 class="text-sm font-medium mb-2">Чек-лист</h3>
        <div class="space-y-2">
          <div
            v-for="(item, index) in taskForm.checklist"
            :key="index"
            class="flex items-center gap-2"
          >
            <input
              v-model="item.checked"
              type="checkbox"
              class="mr-2"
            />
            <input
              v-model="item.text"
              type="text"
              class="flex-1 border rounded px-2 py-1 text-sm"
              placeholder="Пункт чек-листа"
            />
            <button @click="removeChecklistItem(index)" class="text-red-500">×</button>
          </div>
          <button @click="addChecklistItem" class="text-sm text-blue-600">+ Добавить пункт</button>
        </div>
      </div>
      
      <!-- Комментарии -->
      <CommentsList
        v-if="task"
        :task-id="task.id"
        :highlight-comment-id="highlightCommentId"
      />
    </div>
    
    <div class="task-panel-footer">
      <button
        @click="saveTask"
        class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {{ task ? 'Сохранить' : 'Создать' }}
      </button>
      <button
        v-if="task"
        @click="deleteTask"
        class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 ml-2"
      >
        Удалить
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useTasksStore } from '../../stores/tasks';
import { createTask, updateTask, deleteTask as deleteTaskApi } from '../../api/projects';
import TimeTracker from './TimeTracker.vue';
import CommentsList from './CommentsList.vue';

const props = defineProps<{
  isOpen: boolean;
  taskId?: string;
  columnId?: string; // для создания новой задачи
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'saved', task: any): void;
}>();

const route = useRoute();
const router = useRouter();
const tasksStore = useTasksStore();

const task = computed(() => {
  if (!props.taskId) return null;
  for (const columnId in tasksStore.tasks) {
    const found = tasksStore.tasks[columnId].find(t => t.id === props.taskId);
    if (found) return found;
  }
  return null;
});

const taskForm = ref({
  title: '',
  description: '',
  deadline: '',
  priority: false,
  assignees: [] as string[],
  watchers: [] as string[],
  checklist: [] as Array<{ text: string; checked: boolean }>,
});

const newAssignee = ref('');
const newWatcher = ref('');

// Инициализация формы
watch(() => props.taskId, (newTaskId) => {
  if (newTaskId && task.value) {
    taskForm.value = {
      title: task.value.title,
      description: task.value.description || '',
      deadline: task.value.deadline || '',
      priority: task.value.priority,
      assignees: [...task.value.assignees],
      watchers: [...task.value.watchers],
      checklist: [], // TODO: загрузить чек-лист
    };
  } else if (!newTaskId && props.columnId) {
    // Новая задача
    taskForm.value = {
      title: '',
      description: '',
      deadline: '',
      priority: false,
      assignees: [],
      watchers: [],
      checklist: [],
    };
  }
}, { immediate: true });

function addAssignee() {
  if (newAssignee.value && !taskForm.value.assignees.includes(newAssignee.value)) {
    taskForm.value.assignees.push(newAssignee.value);
    newAssignee.value = '';
  }
}

function removeAssignee(assignee: string) {
  taskForm.value.assignees = taskForm.value.assignees.filter(a => a !== assignee);
}

function addWatcher() {
  if (newWatcher.value && !taskForm.value.watchers.includes(newWatcher.value)) {
    taskForm.value.watchers.push(newWatcher.value);
    newWatcher.value = '';
  }
}

function removeWatcher(watcher: string) {
  taskForm.value.watchers = taskForm.value.watchers.filter(w => w !== watcher);
}

function addChecklistItem() {
  taskForm.value.checklist.push({ text: '', checked: false });
}

function removeChecklistItem(index: number) {
  taskForm.value.checklist.splice(index, 1);
}

function updateTimeTracking(totalMs: number) {
  if (task.value) {
    tasksStore.updateTask(task.value.id, { timeTracking: { totalMs } });
  }
}

async function saveTask() {
  try {
    if (task.value) {
      // Обновление существующей задачи
      const updatedTask = await updateTask('company1', 'project1', task.value.id, taskForm.value);
      tasksStore.updateTask(task.value.id, updatedTask.task);
      emit('saved', updatedTask.task);
    } else if (props.columnId) {
      // Создание новой задачи
      const newTask = await createTask('company1', 'project1', {
        ...taskForm.value,
        columnId: props.columnId,
      });
      tasksStore.addTask(newTask.task);
      emit('saved', newTask.task);
      
      // Обновить URL с новым taskId
      router.replace({ query: { ...route.query, taskId: newTask.task.id } });
    }
  } catch (error) {
    console.error('Failed to save task:', error);
  }
}

async function deleteTask() {
  if (!task.value) return;
  
  try {
    await deleteTaskApi('company1', 'project1', task.value.id);
    // TODO: удалить из стора
    closePanel();
  } catch (error) {
    console.error('Failed to delete task:', error);
  }
}

function closePanel() {
  emit('close');
  // Очистить query параметры
  router.replace({ query: {} });
}

// Deeplink: получить commentId из URL
const highlightCommentId = computed(() => route.query.commentId as string);
</script>

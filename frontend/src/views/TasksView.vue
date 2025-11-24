<template>
  <div class="tasks-view">
    <!-- Левая панель -->
    <div class="tasks-sidebar">
      <button class="back-btn" @click="$router.push('/projects')">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span>к проектам</span>
      </button>
      
      <div class="project-info">
        <h2 class="project-name">{{ project?.name || 'Загрузка...' }}</h2>
        <button class="info-btn" @click="showProjectInfo = !showProjectInfo">
          информация
        </button>
      </div>

      <div class="projects-list">
        <h3 class="projects-list-title">актуальные проекты</h3>
        <div class="projects-list-items">
          <div
            v-for="proj in displayedProjects"
            :key="proj.id"
            class="project-item"
            @click="navigateToProject(proj.id)"
          >
            <span class="project-item-name">{{ proj.name }}</span>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <div v-if="hasMoreProjects" class="project-item">
            <span class="project-item-name">еще</span>
          </div>
        </div>
      </div>

      <div class="search-box">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="найти"
          class="search-input"
        />
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" class="search-icon">
          <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2"/>
          <path d="m21 21-4.35-4.35" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </div>
    </div>

    <!-- Основная область -->
    <div class="tasks-main">
      <div class="kanban-board">
        <div
          v-for="column in sortedColumns"
          :key="column.id"
          class="kanban-column"
        >
          <div class="column-header">
            <h3 class="column-title">{{ column.name }}</h3>
            <div class="column-actions">
              <button class="column-action-btn" @click.stop="openCreateTaskModal(column.id)" title="Добавить задачу">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
              </button>
              <button class="column-action-btn" @click.stop="toggleColumnMenu(column.id)" title="Меню">
                <svg width="3" height="15" viewBox="0 0 3 15" fill="none">
                  <circle cx="1.5" cy="2.5" r="1.5" fill="currentColor"/>
                  <circle cx="1.5" cy="7.5" r="1.5" fill="currentColor"/>
                  <circle cx="1.5" cy="12.5" r="1.5" fill="currentColor"/>
                </svg>
              </button>
            </div>
          </div>
          
          <div class="column-tasks">
            <div
              v-for="task in getTasksForColumn(column.id)"
              :key="task.id"
              class="task-card"
              @click="openTaskModal(task)"
            >
              <div class="task-card-header">
                <input
                  type="checkbox"
                  :checked="task.isCompleted"
                  @click.stop
                  @change="toggleTaskComplete(task)"
                  :disabled="!canCompleteTask(task)"
                  class="task-checkbox"
                />
                <h4 class="task-name">{{ task.name }}</h4>
              </div>

              <!-- Прогресс подзадач -->
              <div v-if="task.subtasks.length > 0" class="task-progress">
                <div class="progress-bar">
                  <div 
                    class="progress-fill" 
                    :style="{ width: `${(getCompletedSubtasksCount(task) / task.subtasks.length) * 100}%` }"
                  ></div>
                </div>
                <span class="progress-text">{{ getCompletedSubtasksCount(task) }}/{{ task.subtasks.length }}</span>
              </div>

              <!-- Файлы -->
              <div v-if="task.files.length > 0" class="task-files">
                <div
                  v-for="file in task.files"
                  :key="file.url"
                  class="task-file"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M14 2V8H20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  <span>{{ file.name }}</span>
                </div>
              </div>

              <!-- Кнопка подзадачи -->
              <button class="task-subtask-btn" @click.stop="openCreateSubtaskModal(task)">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
                <span>подзадача</span>
              </button>

              <!-- Метаданные задачи -->
              <div class="task-meta">
                <div v-if="task.timeSpent" class="task-time">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                    <path d="M12 6V12L16 14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                  <span>{{ formatTime(task.timeSpent) }}</span>
                </div>
                <div v-if="task.deadline" class="task-deadline">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2"/>
                    <path d="M16 2V6M8 2V6M3 10H21" stroke="currentColor" stroke-width="2"/>
                  </svg>
                  <span>{{ formatDate(task.deadline) }}</span>
                </div>
              </div>

              <!-- Участники -->
              <div v-if="getTaskParticipants(task).length > 0" class="task-participants">
                <div
                  v-for="(participant, index) in getTaskParticipants(task).slice(0, 3)"
                  :key="participant.id"
                  class="participant-avatar"
                  :style="{ zIndex: 10 - index, marginLeft: index > 0 ? '-15px' : '0' }"
                >
                  <img
                    v-if="participant.avatar"
                    :src="participant.avatar"
                    :alt="participant.displayName || participant.firstName || ''"
                  />
                  <div v-else class="participant-placeholder">
                    {{ (participant.displayName || participant.firstName || participant.login || '?')[0].toUpperCase() }}
                  </div>
                </div>
                <div
                  v-if="getTaskParticipants(task).length > 3"
                  class="participant-avatar participant-more"
                  :style="{ zIndex: 7, marginLeft: '-15px' }"
                >
                  +{{ getTaskParticipants(task).length - 3 }}
                </div>
              </div>
            </div>

            <!-- Кнопка создания первой задачи -->
            <div v-if="getTasksForColumn(column.id).length === 0" class="create-first-task" @click="openCreateTaskModal(column.id)">
              <span>Создать первую задачу</span>
            </div>
          </div>
        </div>

        <!-- Кнопка создания столбца -->
        <button
          v-if="canCreateColumn"
          class="add-column-btn"
          @click="openCreateColumnModal"
        >
          <span>Создать столбец</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- Модальные окна остаются без изменений -->
    <Teleport to="body">
      <div v-if="showCreateTaskModal" class="modal-overlay" @click="closeCreateTaskModal">
        <div class="task-modal" @click.stop>
          <div class="modal-header">
            <h3 class="modal-title">создать задачу</h3>
            <button class="modal-close" @click="closeCreateTaskModal">×</button>
          </div>
          <div class="modal-content">
            <div class="form-group">
              <label class="form-label">название:</label>
              <input
                v-model="newTask.name"
                type="text"
                class="form-input"
                placeholder="Введите название задачи"
              />
            </div>
            <div class="form-group">
              <label class="form-label">описание:</label>
              <textarea
                v-model="newTask.description"
                class="form-textarea"
                placeholder="Введите описание задачи"
              ></textarea>
            </div>
            <div class="form-group">
              <label class="form-label">исполнитель:</label>
              <select v-model="newTask.assigneeId" class="form-select">
                <option value="">Не назначен</option>
                <option
                  v-for="user in projectParticipants"
                  :key="user.id"
                  :value="user.id"
                >
                  {{ user.displayName || user.firstName || user.login }}
                </option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">наблюдатели:</label>
              <div class="watchers-select">
                <div
                  v-for="user in projectParticipants"
                  :key="user.id"
                  class="watcher-option"
                >
                  <input
                    type="checkbox"
                    :value="user.id"
                    v-model="newTask.watcherIds"
                  />
                  <span>{{ user.displayName || user.firstName || user.login }}</span>
                </div>
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">дедлайн:</label>
              <input
                v-model="newTask.deadline"
                type="datetime-local"
                class="form-input"
              />
            </div>
            <div class="form-actions">
              <button class="btn-create" @click="createTask">создать задачу</button>
              <button class="btn-cancel" @click="closeCreateTaskModal">отмена</button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <Teleport to="body">
      <div v-if="showEditTaskModal && selectedTask" class="modal-overlay" @click="closeEditTaskModal">
        <div class="task-modal" @click.stop>
          <div class="modal-header">
            <h3 class="modal-title">редактировать задачу</h3>
            <button class="modal-close" @click="closeEditTaskModal">×</button>
          </div>
          <div class="modal-content">
            <div class="form-group">
              <label class="form-label">название:</label>
              <input
                v-model="editTask.name"
                type="text"
                class="form-input"
                :disabled="!canEditTask(selectedTask)"
              />
            </div>
            <div class="form-group">
              <label class="form-label">описание:</label>
              <textarea
                v-model="editTask.description"
                class="form-textarea"
                :disabled="!canEditTask(selectedTask)"
              ></textarea>
            </div>
            <div class="form-group">
              <label class="form-label">постановщик:</label>
              <div class="user-select">
                <img
                  v-if="selectedTask.creator.avatar"
                  :src="selectedTask.creator.avatar"
                  :alt="selectedTask.creator.displayName || ''"
                  class="user-avatar"
                />
                <span>{{ selectedTask.creator.displayName || selectedTask.creator.firstName || '' }}</span>
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">исполнитель:</label>
              <select
                v-model="editTask.assigneeId"
                class="form-select"
                :disabled="!canEditTask(selectedTask)"
              >
                <option value="">Не назначен</option>
                <option
                  v-for="user in projectParticipants"
                  :key="user.id"
                  :value="user.id"
                >
                  {{ user.displayName || user.firstName || user.login }}
                </option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">наблюдатели:</label>
              <div class="watchers-select">
                <div
                  v-for="user in projectParticipants"
                  :key="user.id"
                  class="watcher-option"
                >
                  <input
                    type="checkbox"
                    :value="user.id"
                    v-model="editTask.watcherIds"
                    :disabled="!canEditTask(selectedTask)"
                  />
                  <span>{{ user.displayName || user.firstName || user.login }}</span>
                </div>
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">подзадачи:</label>
              <div class="subtasks-list">
                <div
                  v-for="(subtask, index) in editTask.subtasks"
                  :key="index"
                  class="subtask-item"
                >
                  <input
                    type="checkbox"
                    v-model="subtask.isCompleted"
                    :disabled="!canEditTask(selectedTask)"
                  />
                  <input
                    type="text"
                    v-model="subtask.name"
                    class="subtask-input"
                    :disabled="!canEditTask(selectedTask)"
                  />
                  <button
                    v-if="canEditTask(selectedTask)"
                    @click="removeSubtask(index)"
                    class="remove-subtask-btn"
                  >
                    ×
                  </button>
                </div>
                <button
                  v-if="canEditTask(selectedTask)"
                  @click="addSubtask"
                  class="add-subtask-btn"
                >
                  + добавить подзадачу
                </button>
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">дедлайн:</label>
              <input
                v-model="editTask.deadline"
                type="datetime-local"
                class="form-input"
                :disabled="!canEditTask(selectedTask)"
              />
            </div>
            <div class="form-actions">
              <button
                v-if="canEditTask(selectedTask)"
                class="btn-save"
                @click="updateTask"
              >
                сохранить
              </button>
              <button
                v-if="canCompleteTask(selectedTask)"
                class="btn-complete"
                @click="completeTask"
              >
                готово
              </button>
              <button
                v-if="canEditTask(selectedTask)"
                class="btn-delete"
                @click="deleteTask"
              >
                удалить
              </button>
              <button class="btn-cancel" @click="closeEditTaskModal">отмена</button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <Teleport to="body">
      <div v-if="showCreateColumnModal" class="modal-overlay" @click="closeCreateColumnModal">
        <div class="task-modal" @click.stop>
          <div class="modal-header">
            <h3 class="modal-title">создать столбец</h3>
            <button class="modal-close" @click="closeCreateColumnModal">×</button>
          </div>
          <div class="modal-content">
            <div class="form-group">
              <label class="form-label">название:</label>
              <input
                v-model="newColumn.name"
                type="text"
                class="form-input"
                placeholder="Введите название колонки"
              />
            </div>
            <div class="form-actions">
              <button class="btn-create" @click="createColumn">создать столбец</button>
              <button class="btn-cancel" @click="closeCreateColumnModal">отмена</button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
  getColumns,
  createColumn as createColumnApi,
  getTasks,
  createTask as createTaskApi,
  updateTask as updateTaskApi,
  completeTask as completeTaskApi,
  deleteTask as deleteTaskApi,
  type Column,
  type Task,
} from '../api/tasks';
import { getProject, getProjects, type Project } from '../api/projects';
import { getCompanyUsers, getUserInfo, type CompanyUser } from '../api/user';

const route = useRoute();
const router = useRouter();

const projectId = computed(() => route.params.id as string);

const project = ref<Project | null>(null);
const projects = ref<Project[]>([]);
const columns = ref<Column[]>([]);
const tasks = ref<Task[]>([]);
const projectParticipants = ref<CompanyUser[]>([]);
const currentUser = ref<CompanyUser | null>(null);

const searchQuery = ref('');
const showCreateTaskModal = ref(false);
const showEditTaskModal = ref(false);
const showCreateColumnModal = ref(false);
const showProjectInfo = ref(false);
const selectedTask = ref<Task | null>(null);
const selectedColumnId = ref<string>('');

const newTask = ref({
  name: '',
  description: '',
  columnId: '',
  assigneeId: '',
  watcherIds: [] as string[],
  deadline: '',
});

const editTask = ref({
  name: '',
  description: '',
  assigneeId: '',
  watcherIds: [] as string[],
  subtasks: [] as Array<{ name: string; isCompleted: boolean }>,
  deadline: '',
});

const newColumn = ref({
  name: '',
});

const sortedColumns = computed(() => {
  return [...columns.value].sort((a, b) => a.order - b.order);
});

const availableProjects = computed(() => {
  // Исключаем текущий проект из списка
  return projects.value.filter(proj => proj.id !== projectId.value);
});

const displayedProjects = computed(() => {
  // Показываем до 5 проектов
  return availableProjects.value.slice(0, 5);
});

const hasMoreProjects = computed(() => {
  // Проверяем, есть ли еще проекты после первых 5
  return availableProjects.value.length > 5;
});

const filteredTasks = computed(() => {
  if (!searchQuery.value || searchQuery.value.trim() === '') {
    return tasks.value;
  }
  
  const query = searchQuery.value.toLowerCase().trim();
  
  return tasks.value.filter((task) => {
    // Поиск по названию задачи
    if (task.name.toLowerCase().includes(query)) {
      return true;
    }
    
    // Поиск по описанию
    if (task.description && task.description.toLowerCase().includes(query)) {
      return true;
    }
    
    // Поиск по подзадачам
    if (task.subtasks && task.subtasks.some(subtask => 
      subtask.name.toLowerCase().includes(query)
    )) {
      return true;
    }
    
    // Поиск по участникам (создатель, исполнитель, наблюдатели)
    if (task.creator) {
      const creatorName = (
        task.creator.displayName || 
        task.creator.firstName || 
        task.creator.login || 
        ''
      ).toLowerCase();
      if (creatorName.includes(query)) {
        return true;
      }
    }
    
    if (task.assignee) {
      const assigneeName = (
        task.assignee.displayName || 
        task.assignee.firstName || 
        task.assignee.login || 
        ''
      ).toLowerCase();
      if (assigneeName.includes(query)) {
        return true;
      }
    }
    
    if (task.watchers && task.watchers.some(watcher => {
      const watcherName = (
        watcher.displayName || 
        watcher.firstName || 
        watcher.login || 
        ''
      ).toLowerCase();
      return watcherName.includes(query);
    })) {
      return true;
    }
    
    // Поиск по названиям файлов
    if (task.files && task.files.some(file => 
      file.name.toLowerCase().includes(query)
    )) {
      return true;
    }
    
    return false;
  });
});

function getTasksForColumn(columnId: string): Task[] {
  return filteredTasks.value.filter((task) => task.column.id === columnId);
}

function getCompletedSubtasksCount(task: Task): number {
  return task.subtasks.filter((st) => st.isCompleted).length;
}

function formatDate(dateString: string | null): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours > 0) {
    return `${hours}:${mins.toString().padStart(2, '0')}`;
  }
  return `0:${mins.toString().padStart(2, '0')}`;
}

function getTaskParticipants(task: Task): CompanyUser[] {
  const participants: CompanyUser[] = [];
  if (task.assignee) {
    participants.push(task.assignee);
  }
  if (task.watchers) {
    participants.push(...task.watchers);
  }
  return participants;
}

function canEditTask(task: Task): boolean {
  if (!currentUser.value) return false;
  return task.creator.id === currentUser.value.id;
}

function canCompleteTask(task: Task): boolean {
  if (!currentUser.value) return false;
  return task.assignee?.id === currentUser.value.id;
}

const canCreateColumn = computed(() => {
  if (!project.value || !currentUser.value) return false;
  return (
    project.value.creator.id === currentUser.value.id ||
    currentUser.value.companyRole === 'owner' ||
    currentUser.value.companyRole === 'manager'
  );
});

function navigateToProject(id: string) {
  router.push(`/projects/${id}/tasks`);
}

function toggleColumnMenu(columnId: string) {
  // TODO: Реализовать меню колонки
  console.log('Toggle menu for column:', columnId);
}

function openCreateTaskModal(columnId: string) {
  selectedColumnId.value = columnId;
  newTask.value = {
    name: '',
    description: '',
    columnId,
    assigneeId: '',
    watcherIds: [],
    deadline: '',
  };
  showCreateTaskModal.value = true;
}

function closeCreateTaskModal() {
  showCreateTaskModal.value = false;
  selectedColumnId.value = '';
}

function openCreateSubtaskModal(task: Task) {
  // TODO: Реализовать модальное окно создания подзадачи
  console.log('Create subtask for task:', task.id);
}

function openEditTaskModal(task: Task) {
  selectedTask.value = task;
  editTask.value = {
    name: task.name,
    description: task.description || '',
    assigneeId: task.assignee?.id || '',
    watcherIds: task.watchers.map((w) => w.id),
    subtasks: task.subtasks.map((st) => ({ ...st })),
    deadline: task.deadline ? new Date(task.deadline).toISOString().slice(0, 16) : '',
  };
  showEditTaskModal.value = true;
}

function closeEditTaskModal() {
  showEditTaskModal.value = false;
  selectedTask.value = null;
}

function openTaskModal(task: Task) {
  openEditTaskModal(task);
}

function openCreateColumnModal() {
  newColumn.value = { name: '' };
  showCreateColumnModal.value = true;
}

function closeCreateColumnModal() {
  showCreateColumnModal.value = false;
}

function addSubtask() {
  editTask.value.subtasks.push({ name: '', isCompleted: false });
}

function removeSubtask(index: number) {
  editTask.value.subtasks.splice(index, 1);
}

async function loadData() {
  try {
    const [projectData, columnsData, tasksData, projectsData, userInfo] = await Promise.all([
      getProject(projectId.value),
      getColumns(projectId.value),
      getTasks(projectId.value),
      getProjects(),
      getUserInfo(),
    ]);

    project.value = projectData;
    columns.value = columnsData;
    tasks.value = tasksData;
    projects.value = projectsData;
    projectParticipants.value = [
      projectData.creator,
      ...projectData.participants,
    ];
    currentUser.value = userInfo;
  } catch (error: any) {
    console.error('Ошибка загрузки данных:', error);
  }
}

async function createTask() {
  try {
    if (!newTask.value.name.trim()) {
      alert('Введите название задачи');
      return;
    }

    const taskData = {
      ...newTask.value,
      deadline: newTask.value.deadline ? new Date(newTask.value.deadline).toISOString() : undefined,
    };

    const createdTask = await createTaskApi(projectId.value, taskData);
    tasks.value.push(createdTask);
    closeCreateTaskModal();
  } catch (error: any) {
    console.error('Ошибка создания задачи:', error);
    alert(error.message || 'Ошибка создания задачи');
  }
}

async function updateTask() {
  if (!selectedTask.value) return;

  try {
    const taskData = {
      ...editTask.value,
      deadline: editTask.value.deadline ? new Date(editTask.value.deadline).toISOString() : undefined,
    };

    const updatedTask = await updateTaskApi(projectId.value, selectedTask.value.id, taskData);
    const index = tasks.value.findIndex((t) => t.id === updatedTask.id);
    if (index !== -1) {
      tasks.value[index] = updatedTask;
    }
    closeEditTaskModal();
  } catch (error: any) {
    console.error('Ошибка обновления задачи:', error);
    alert(error.message || 'Ошибка обновления задачи');
  }
}

async function completeTask() {
  if (!selectedTask.value) return;

  try {
    const updatedTask = await completeTaskApi(projectId.value, selectedTask.value.id, true);
    const index = tasks.value.findIndex((t) => t.id === updatedTask.id);
    if (index !== -1) {
      tasks.value[index] = updatedTask;
    }
    closeEditTaskModal();
  } catch (error: any) {
    console.error('Ошибка завершения задачи:', error);
    alert(error.message || 'Ошибка завершения задачи');
  }
}

async function toggleTaskComplete(task: Task) {
  if (!canCompleteTask(task)) return;

  try {
    const updatedTask = await completeTaskApi(projectId.value, task.id, !task.isCompleted);
    const index = tasks.value.findIndex((t) => t.id === updatedTask.id);
    if (index !== -1) {
      tasks.value[index] = updatedTask;
    }
  } catch (error: any) {
    console.error('Ошибка изменения статуса задачи:', error);
  }
}

async function deleteTask() {
  if (!selectedTask.value) return;

  if (!confirm('Вы уверены, что хотите удалить эту задачу?')) {
    return;
  }

  try {
    await deleteTaskApi(projectId.value, selectedTask.value.id);
    tasks.value = tasks.value.filter((t) => t.id !== selectedTask.value!.id);
    closeEditTaskModal();
  } catch (error: any) {
    console.error('Ошибка удаления задачи:', error);
    alert(error.message || 'Ошибка удаления задачи');
  }
}

async function createColumn() {
  try {
    if (!newColumn.value.name.trim()) {
      alert('Введите название колонки');
      return;
    }

    const createdColumn = await createColumnApi(projectId.value, newColumn.value);
    columns.value.push(createdColumn);
    closeCreateColumnModal();
  } catch (error: any) {
    console.error('Ошибка создания колонки:', error);
    alert(error.message || 'Ошибка создания колонки');
  }
}

onMounted(() => {
  loadData();
});

watch(
  () => route.params.id,
  () => {
    loadData();
  }
);
</script>

<style scoped>
.tasks-view {
  display: flex;
  min-height: 100vh;
  background: transparent;
  color: #e1eaf8;
  font-family: 'Involve', Arial, sans-serif;
}

.tasks-sidebar {
  width: 186px;
  min-width: 186px;
  padding: 24px 12px;
  padding-bottom: 24px;
  background: rgba(145, 33, 56, 0.5);
  border-top-right-radius: 40px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  box-sizing: border-box;
  flex-shrink: 0;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  color: #e1eaf8;
  cursor: pointer;
  font-size: 20px;
  font-weight: 400;
  font-family: 'Involve', Arial, sans-serif;
  padding: 0;
  height: 24px;
  line-height: normal;
  white-space: nowrap;
}

.project-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.project-name {
  font-size: 32px;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
  line-height: normal;
  letter-spacing: 0.32px;
  font-family: 'Involve', Arial, sans-serif;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

.info-btn {
  background: #912138;
  border: none;
  color: #e1eaf8;
  padding: 4px 0;
  border-radius: 16px;
  cursor: pointer;
  font-size: 15px;
  font-weight: 400;
  font-family: 'Involve', Arial, sans-serif;
  text-align: center;
  line-height: normal;
  width: 100%;
  min-height: 24px;
}

.projects-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.projects-list-title {
  font-size: 20px;
  font-weight: 400;
  color: #e1eaf8;
  margin: 0;
  letter-spacing: 0.2px;
  line-height: normal;
  font-family: 'Involve', Arial, sans-serif;
}

.projects-list-items {
  display: flex;
  flex-direction: column;
  gap: 0;
  position: relative;
}

.project-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 0;
  min-height: 40px;
  height: 40px;
  cursor: pointer;
  color: #e1eaf8;
  font-size: 15px;
  font-weight: 400;
  font-family: 'Involve', Arial, sans-serif;
  position: relative;
  line-height: normal;
}

.project-item:not(:last-child)::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: rgba(255, 255, 255, 0.2);
}

.project-item-name {
  flex: 1;
}

.search-box {
  position: relative;
  margin-top: 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #912138;
  border-radius: 16px;
  padding: 4px 8px;
  height: 24px;
  box-sizing: border-box;
  gap: 8px;
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  background: transparent;
  border: none;
  color: #e1eaf8;
  font-size: 15px;
  font-weight: 400;
  font-family: 'Involve', Arial, sans-serif;
  padding: 0;
  outline: none;
  line-height: normal;
  min-width: 0;
}

.search-input::placeholder {
  color: #e1eaf8;
}

.search-icon {
  width: 18px;
  height: 18px;
  color: #e1eaf8;
  flex-shrink: 0;
  pointer-events: none;
}

.tasks-main {
  flex: 1;
  padding: 128px 36px 0;
  overflow-x: auto;
}

.kanban-board {
  display: flex;
  gap: 12px;
  min-width: fit-content;
}

.kanban-column {
  min-width: 224px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(145, 33, 56, 0.5);
  border-radius: 40px;
  padding: 12px 2px;
  display: flex;
  flex-direction: column;
  position: relative;
  box-shadow: 0px 41px 4px 0px inset rgba(255, 255, 255, 0.25);
}

.column-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 24px;
  gap: 4px;
}

.column-title {
  font-size: 18px;
  font-weight: 500;
  color: #d0cbca;
  text-transform: capitalize;
  margin: 0;
  flex: 1;
}

.column-actions {
  display: flex;
  align-items: center;
  gap: 4px;
}

.column-action-btn {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  color: #e1eaf8;
  cursor: pointer;
  padding: 0;
}

.column-tasks {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 0 2px;
  flex: 1;
  overflow-y: auto;
}

.task-card {
  background: rgba(255, 255, 255, 0.5);
  border-radius: 40px;
  padding: 12px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.task-card-header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.task-checkbox {
  width: 24px;
  height: 24px;
  cursor: pointer;
  flex-shrink: 0;
}

.task-name {
  font-size: 15px;
  font-weight: 500;
  color: #292d32;
  margin: 0;
  flex: 1;
  line-height: 1.2;
}

.task-progress {
  display: flex;
  align-items: center;
  gap: 10px;
}

.progress-bar {
  flex: 1;
  height: 8px;
  background: #912138;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
}

.progress-fill {
  height: 100%;
  background: #ffbe62;
  border-radius: 8px;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 14px;
  font-weight: 600;
  color: #292d32;
  min-width: 24px;
  text-align: center;
  letter-spacing: -1.4px;
}

.task-files {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.task-file {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 0 8px;
  height: 18px;
  background: rgba(84, 81, 81, 0.3);
  border-radius: 5px;
  font-size: 12px;
  color: #292d32;
}

.task-subtask-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  background: rgba(41, 45, 50, 0.3);
  border: none;
  border-radius: 50px;
  color: #e1eaf8;
  font-size: 12px;
  cursor: pointer;
  width: fit-content;
}

.task-meta {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-wrap: wrap;
}

.task-time,
.task-deadline {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px;
  background: #85afe4;
  border-radius: 50px;
  font-size: 12px;
  color: #213491;
}

.task-deadline {
  background: rgba(41, 45, 50, 0.3);
  color: #ce9eff;
}

.task-participants {
  display: flex;
  align-items: center;
  height: 32px;
}

.participant-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 2px solid rgba(42, 39, 22, 0);
  overflow: hidden;
  position: relative;
  flex-shrink: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.participant-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(225, 234, 248, 0.3);
  color: #e1eaf8;
  font-size: 13px;
  font-weight: 500;
}

.participant-more {
  background: rgba(42, 39, 22, 0);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #e1eaf8;
  font-size: 13px;
  font-weight: 500;
}

.create-first-task {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 40px;
  color: #e1eaf8;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  text-align: center;
}

.add-column-btn {
  min-width: 242px;
  height: 44px;
  background: rgba(255, 255, 255, 0.3);
  border: 1px solid rgba(145, 33, 56, 0.5);
  border-radius: 40px;
  color: #d0cbca;
  font-size: 18px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  padding: 5px;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
}

.task-modal {
  background: rgba(41, 45, 50, 0.95);
  border-radius: 16px;
  padding: 24px;
  max-width: 600px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.modal-title {
  font-size: 24px;
}

.modal-close {
  background: none;
  border: none;
  color: #e1eaf8;
  font-size: 32px;
  cursor: pointer;
}

.form-group {
  margin-bottom: 24px;
}

.form-label {
  display: block;
  margin-bottom: 8px;
  font-size: 16px;
}

.form-input,
.form-textarea,
.form-select {
  width: 100%;
  padding: 12px;
  background: #292d32;
  border: 1px solid rgba(225, 234, 248, 0.1);
  border-radius: 8px;
  color: #e1eaf8;
}

.form-textarea {
  min-height: 100px;
  resize: vertical;
}

.watchers-select {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.watcher-option {
  display: flex;
  align-items: center;
  gap: 8px;
}

.subtasks-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.subtask-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.subtask-input {
  flex: 1;
  padding: 8px;
  background: #292d32;
  border: 1px solid rgba(225, 234, 248, 0.1);
  border-radius: 8px;
  color: #e1eaf8;
}

.form-actions {
  display: flex;
  gap: 12px;
  margin-top: 24px;
}

.btn-create,
.btn-save,
.btn-complete,
.btn-delete,
.btn-cancel {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
}

.btn-create,
.btn-save {
  background: #dbf3c2;
  color: #292d32;
}

.btn-complete {
  background: #dbf3c2;
  color: #292d32;
}

.btn-delete {
  background: #f3c2c3;
  color: #292d32;
}

.btn-cancel {
  background: #f3c2c3;
  color: #292d32;
}

.user-select {
  display: flex;
  align-items: center;
  gap: 8px;
}

.user-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
}
</style>

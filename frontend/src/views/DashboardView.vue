<template>
  <div class="dashboard-view">
    <!-- Приветственный блок -->
    <div class="dashboard-header">
      <div class="header-content">
        <div class="welcome-section">
          <h1 class="welcome-title">{{ getGreeting() }}, <span class="user-name">{{ userData.name }}</span></h1>
          <p class="welcome-subtitle">{{ getSubtitle() }}</p>
        </div>
      </div>
    </div>

    <!-- Основная сетка навигации -->
    <div class="main-grid">
      <!-- Левый столбец: Проекты и Задачи -->
      <div class="column column-left">
        <!-- Быстрые ссылки -->
        <div class="quick-nav">
          <router-link 
            to="/projects" 
            class="nav-card nav-card-primary"
          >
            <div class="nav-card-icon">
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" stroke-width="1.5"/>
                <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" stroke-width="1.5"/>
                <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" stroke-width="1.5"/>
                <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" stroke-width="1.5"/>
              </svg>
            </div>
            <div class="nav-card-content">
              <h3 class="nav-card-title">Проекты</h3>
              <p class="nav-card-count">{{ stats.totalProjects }} всего</p>
            </div>
            <div class="nav-card-arrow">→</div>
          </router-link>

          <div class="nav-card nav-card-secondary">
            <div class="nav-card-icon">
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M9 6H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-4m-6 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m-6 0h8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="nav-card-content">
              <h3 class="nav-card-title">Задачи</h3>
              <p class="nav-card-count">{{ stats.totalTasks }} незавершенных</p>
            </div>
            <div class="nav-card-arrow" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
          </div>

          <router-link 
            to="/teams"
            class="nav-card nav-card-tertiary"
          >
            <div class="nav-card-icon">
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="12" cy="8" r="4" stroke="currentColor" stroke-width="1.5"/>
                <path d="M6 20c0-3.314 2.686-6 6-6s6 2.686 6 6H6z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="nav-card-content">
              <h3 class="nav-card-title">Команда</h3>
              <p class="nav-card-count">{{ stats.myTeamMembers }} участников</p>
            </div>
            <div class="nav-card-arrow" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <circle cx="8" cy="9" r="3" stroke="currentColor" stroke-width="1.5"/>
                <circle cx="16" cy="9" r="3" stroke="currentColor" stroke-width="1.5"/>
                <path d="M3.5 19c0-3 2.5-5 4.5-5s4.5 2 4.5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                <path d="M10.5 19c0-3 2.5-5 4.5-5s4.5 2 4.5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
            </div>
          </router-link>
        </div>

        <!-- Все проекты -->
        <div class="section all-projects-section">
          <div class="section-header">
            <h2 class="section-title">Мои проекты</h2>
            <router-link to="/projects" class="section-link">Все →</router-link>
          </div>
          <div v-if="!isLoading && projects.length > 0" class="projects-list">
            <router-link
              v-for="project in projects.slice(0, 8)"
              :key="project.id"
              to="/projects"
              class="project-item"
              :style="{ borderLeftColor: project.color }"
              :title="project.description"
            >
              <div class="project-icon" :style="{ backgroundColor: project.color + '20' }">
                 <svg v-html="getProjectIconSvg(project.icon, project.color)" class="project-icon-svg" :style="{ stroke: project.color }"/>
              </div>
              <div class="project-info">
                <h4 class="project-name">{{ project.name }}</h4>
                <div class="project-meta">
                  <span class="project-count">{{ getProjectTaskCount(project.id) }} задач</span>
                  <span v-if="isMyProject(project.id)" class="badge-creator">Создатель</span>
                </div>
              </div>
              <div class="project-participants">
                <div 
                  v-for="participant in project.participants.slice(0, 2)"
                  :key="participant.id"
                  class="avatar"
                  :title="participant.displayName || participant.login"
                >
                  <img 
                    v-if="participant.avatar"
                    :src="getAvatarUrl(participant.avatar)"
                    :alt="participant.displayName || participant.login"
                  />
                  <span v-else class="avatar-placeholder">{{ getInitials(participant.displayName || participant.login) }}</span>
                </div>
                <div v-if="project.participants.length > 2" class="avatar avatar-more" :title="project.participants.slice(2).map(p => p.displayName || p.login).join(', ')">
                  +{{ project.participants.length - 2 }}
                </div>
              </div>
            </router-link>
          </div>
          <div v-if="!isLoading && projects.length === 0" class="empty-state">
            <p>Нет проектов</p>
            <router-link to="/projects" class="empty-link">Создать проект</router-link>
          </div>
          <div v-if="isLoading" class="loading-state">
            <div class="spinner"></div>
          </div>
        </div>

        <!-- Задачи в работе -->
        <div class="section tasks-in-progress-section">
          <div class="section-header">
            <h2 class="section-title">Задачи в работе</h2>
            <router-link to="/projects" class="section-link">К проектам →</router-link>
          </div>
          <div v-if="!isLoading && tasksInProgress.length > 0" class="tasks-list">
            <div 
              v-for="task in tasksInProgress.slice(0, 8)"
              :key="task.id"
              class="task-item"
              :class="{ 
                'task-overdue': isOverdue(task.deadline),
                'task-important': task.isImportant
              }"
            >
              <div class="task-status-indicator"></div>
              <div class="task-content">
                <h4 class="task-name">{{ task.name }}</h4>
                <div class="task-details">
                  <span class="task-project">{{ getProjectName(task.project) }}</span>
                  <span v-if="task.assignee" class="task-assignee">{{ task.assignee.displayName || task.assignee.login }}</span>
                </div>
              </div>
              <div class="task-meta">
                <span v-if="task.isImportant" class="task-badge important" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" style="width: 1rem; height: 1rem;">
                    <path d="M12 3L14.6 9.5L21.5 10.5L16.5 15.2L17.8 22L12 18.5L6.2 22L7.5 15.2L2.5 10.5L9.4 9.5L12 3Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
                  </svg>
                </span>
                <span v-if="task.deadline" :class="['task-deadline', { 'is-overdue': isOverdue(task.deadline) }]">
                  {{ formatDate(task.deadline) }}
                </span>
              </div>
            </div>
          </div>
          <div v-if="!isLoading && tasksInProgress.length === 0" class="empty-state">
            <p>
              Все задачи завершены
              <span aria-hidden="true" style="display:inline-block; vertical-align:middle; margin-left: 0.25rem;">
                <svg viewBox="0 0 24 24" fill="none" style="width: 1rem; height: 1rem;">
                  <path d="M12 3L15 8L21 9L17 13L18 19L12 16L6 19L7 13L3 9L9 8L12 3Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
                </svg>
              </span>
            </p>
            <router-link to="/projects" class="empty-link">Перейти к проектам</router-link>
          </div>
          <div v-if="isLoading" class="loading-state">
            <div class="spinner"></div>
          </div>
        </div>
      </div>

      <!-- Правый столбец: Личные метрики и участники -->
      <div class="column column-right">
        <!-- Карточки статистики -->
        <div class="stats-cards">
          <div class="stat-card">
            <div class="stat-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="stat-content">
              <p class="stat-label">Завершено</p>
              <p class="stat-value">{{ stats.completedTasks }}</p>
            </div>
          </div>

          <div class="stat-card" :class="{ 'stat-alert': stats.overdueTasks > 0 }">
            <div class="stat-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="13" r="7" stroke="currentColor" stroke-width="2"/>
                <path d="M12 13V9M12 13L15 15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                <path d="M7 4L9 6M17 4L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </div>
            <div class="stat-content">
              <p class="stat-label">Просрочено</p>
              <p class="stat-value">{{ stats.overdueTasks }}</p>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M5 4H14L19 9V20C19 21.105 18.105 22 17 22H5C3.895 22 3 21.105 3 20V6C3 4.895 3.895 4 5 4Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
                <path d="M9 12H15M9 16H15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </div>
            <div class="stat-content">
              <p class="stat-label">Всего задач</p>
              <p class="stat-value">{{ stats.totalTasks }}</p>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M12 3L14.6 9.5L21.5 10.5L16.5 15.2L17.8 22L12 18.5L6.2 22L7.5 15.2L2.5 10.5L9.4 9.5L12 3Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="stat-content">
              <p class="stat-label">Важные</p>
              <p class="stat-value">{{ stats.importantTasks }}</p>
            </div>
          </div>
        </div>

        <!-- Участники моих проектов -->
        <div class="section team-section">
          <div class="section-header">
            <h2 class="section-title">Моя команда</h2>
            <router-link to="/teams" class="section-link">Все →</router-link>
          </div>
          <div v-if="!isLoading && teamMembers.length > 0" class="team-grid">
            <router-link
              v-for="member in teamMembers.slice(0, 8)"
              :key="member.id"
              class="team-member"
              :to="{ name: 'user-profile', params: { id: member.id } }"
            >
              <div class="member-avatar">
                <img 
                  v-if="member.avatar"
                  :src="getAvatarUrl(member.avatar)"
                  :alt="member.displayName || member.login"
                />
                <span v-else class="avatar-placeholder-large">{{ getInitials(member.displayName || member.login) }}</span>
              </div>
              <div class="member-info">
                <h4 class="member-name">{{ member.displayName || member.login }}</h4>
                <p class="member-projects">{{ getMyProjectCountForMember(member.id) }} в проектах</p>
              </div>
            </router-link>
          </div>
          <div v-if="!isLoading && teamMembers.length === 0" class="empty-state">
            <p>В ваших проектах нет участников</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { getProfile, type Profile } from '@/api/profile';
import { getProjects, type Project } from '@/api/projects';
import { getTasks, type Task, completeTask } from '@/api/tasks';

interface UserData {
  name: string;
  role?: string;
  avatar?: string;
  id?: string;
}

interface Stats {
  totalProjects: number;
  completedTasks: number;
  totalTasks: number;
  overdueTasks: number;
  importantTasks: number;
  myTeamMembers: number;
}

interface TeamMember {
  id: string;
  login: string;
  displayName?: string;
  avatar?: string;
}
interface ProjectIcon {
  id: string;
  name: string;
  svg: string;
}

const projectIcons: ProjectIcon[] = [
  {
    id: 'building',
    name: 'Здание',
    svg: '<path d="M3 11L12 5L21 11V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V11Z"/><path d="M9 22V13H15V22"/>',
  },
  {
    id: 'folder',
    name: 'Папка',
    svg: '<path d="M4 8.5C4 7.94772 4.21071 7.4179 4.58579 7.04289C4.96086 6.66781 5.46957 6.5 6 6.5H10.5L13 9H18C18.5304 9 19.0391 9.21071 19.4142 9.58579C19.7893 9.96086 20 10.4696 20 11V19.5C20 20.0523 19.7893 20.5821 19.4142 20.9571C19.0391 21.3322 18.5304 21.5 18 21.5H6C5.46957 21.5 4.96086 21.3322 4.58579 20.9571C4.21071 20.5821 4 20.0523 4 19.5V8.5Z"/>',
  },
  {
    id: 'calendar',
    name: 'Календарь',
    svg: '<path d="M6 11.5H18M9 6V7.5M15 6V7.5M8 15H9.5M12.5 15H14M15.5 15H17M8 18H9.5M12.5 18H14M15.5 18H17M8 11.5H18C19.1046 11.5 20 12.3954 20 13.5V19.5C20 20.6046 19.1046 21.5 18 21.5H8C6.89543 21.5 6 20.6046 6 19.5V13.5C6 12.3954 6.89543 11.5 8 11.5Z"/>',
  },
  {
    id: 'chart',
    name: 'График',
    svg: '<path d="M5.5 6V19.5H20.5M10 18L13 15L15.5 17.5L20.5 12.5M20.5 12.5H17.5M20.5 12.5V15.5"/>',
  },
  {
    id: 'star',
    name: 'Звезда',
    svg: '<path d="M12 4.5L14.295 10.13L20.25 11.135L16.125 15.32L17.09 21.27L12 18.635L6.91 21.27L7.875 15.32L3.75 11.135L9.705 10.13L12 4.5Z"/>',
  },
  {
    id: 'target',
    name: 'Цель',
    svg: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5.5"/><circle cx="12" cy="12" r="2"/>',
  },
];

const userData = ref<UserData>({ name: 'Пользователь' });
const userId = ref<string>('');
const projects = ref<Project[]>([]);
const tasks = ref<Task[]>([]);
const isLoading = ref(true);

const stats = ref<Stats>({
  totalProjects: 0,
  completedTasks: 0,
  totalTasks: 0,
  overdueTasks: 0,
  importantTasks: 0,
  myTeamMembers: 0,
});

// Вычисляемые свойства
const tasksInProgress = computed(() => {
  return tasks.value.filter(t => !t.isCompleted).sort((a, b) => {
    if (a.deadline && b.deadline) {
      return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
    }
    return 0;
  });
});

// Мои проекты - где я создатель
const myProjects = computed(() => {
  return projects.value.filter(p => p.creator.id === userId.value);
});

// Участники из моих проектов
const teamMembers = computed(() => {
  const members = new Map<string, TeamMember>();
  myProjects.value.forEach(project => {
    project.participants.forEach(participant => {
      if (!members.has(participant.id)) {
        members.set(participant.id, participant as TeamMember);
      }
    });
  });
  return Array.from(members.values());
});

// Функции для получения данных
async function loadData() {
  isLoading.value = true;
  try {
    const [profile, projectsList] = await Promise.all([
      getProfile(),
      getProjects(),
    ]);

    // Загрузка профиля
    userData.value.name = profile.displayName || profile.firstName || profile.login || 'Пользователь';
    userData.value.role = profile.role || undefined;
    userData.value.id = profile.id;
    userId.value = profile.id;
    if (profile.avatar) {
      userData.value.avatar = getAvatarUrl(profile.avatar);
    }

    // Загрузка проектов - все проекты где я участник или создатель
    projects.value = projectsList;

    // Загрузка задач из моих проектов (где я создатель)
    const myProjectIds = projectsList
      .filter(p => p.creator.id === profile.id)
      .map(p => p.id);
    
    const allTasks: Task[] = [];
    for (const projectId of myProjectIds) {
      try {
        const projectTasks = await getTasks(projectId);
        allTasks.push(...projectTasks);
      } catch (error) {
        console.warn(`Ошибка загрузки задач проекта ${projectId}:`, error);
      }
    }
    tasks.value = allTasks;

    // Расчет статистики
    calculateStats(profile.id, projectsList, allTasks);
  } catch (error) {
    console.error('Ошибка загрузки данных дашборда:', error);
  } finally {
    isLoading.value = false;
  }
}

function calculateStats(userId: string, projectsList: Project[], tasksList: Task[]) {
  const now = new Date();
  const myProjectsList = projectsList.filter(p => p.creator.id === userId);
  
  // Участники из моих проектов
  const myTeamMembersSet = new Set<string>();
  myProjectsList.forEach(p => {
    p.participants.forEach(participant => {
      myTeamMembersSet.add(participant.id);
    });
  });
  
  stats.value = {
    totalProjects: projectsList.length,
    completedTasks: tasksList.filter(t => t.isCompleted).length,
    totalTasks: tasksList.filter(t => !t.isCompleted).length,
    overdueTasks: tasksList.filter(t => 
      !t.isCompleted && t.deadline && new Date(t.deadline) < now
    ).length,
    importantTasks: tasksList.filter(t => t.isImportant && !t.isCompleted).length,
    myTeamMembers: myTeamMembersSet.size,
  };
}

// Вспомогательные функции
function getGreeting(): string {
  const hour = new Date().getHours();
  // Диапазоны:
  // 05:00–11:59 → Доброе утро
  // 12:00–16:59 → Добрый день
  // 17:00–22:59 → Добрый вечер
  // 23:00–04:59 → Доброй ночи
  if (hour >= 5 && hour < 12) return 'Доброе утро';
  if (hour >= 12 && hour < 17) return 'Добрый день';
  if (hour >= 17 && hour <= 22) return 'Добрый вечер';
  return 'Доброй ночи';
}

function getSubtitle(): string {
  const dayOfWeek = new Date().getDay();
  const titles = [
    'Хорошего выходного дня',
    'Начнём неделю со спокойствия',
    'Вторник — день тяжелый',
    'Середина недели',
    'Уже четверг',
    'Скоро выходные',
    'Отличного выходного дня',
  ];
  return titles[dayOfWeek] || 'Начнём работу';
}

function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    'new': 'Новый',
    'in_progress': 'В работе',
    'completed': 'Завершен',
    'on_hold': 'На паузе',
    'cancelled': 'Отменен',
  };
  return labels[status] || status;
}

function getAvatarUrl(avatar: string | undefined): string {
  if (!avatar) return '';
  if (avatar.startsWith('http')) return avatar;
  const baseUrl = import.meta.env.VITE_API_BASE_URL?.replace('/api/v1', '') || 'http://localhost:3000';
  if (avatar.startsWith('/')) return `${baseUrl}${avatar}`;
  return `${baseUrl}/api/v1/avatars/${avatar}`;
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function getProjectName(projectId: string): string {
  const project = projects.value.find(p => p.id === projectId);
  return project?.name || 'Проект';
}

function getProjectTaskCount(projectId: string): number {
  return tasks.value.filter(t => t.project === projectId && !t.isCompleted).length;
}

function getMyProjectCountForMember(memberId: string): number {
  return myProjects.value.filter(p => p.participants.some(pt => pt.id === memberId)).length;
}

function isMyProject(projectId: string): boolean {
  return projects.value.some(p => p.id === projectId && p.creator.id === userId.value);
}

function getProjectIconSvg(iconId: string, color: string): string {
  const icon = projectIcons.find(i => i.id === iconId) || projectIcons[0];
  return `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="stroke: ${color}; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; width: 100%; height: 100%;">${icon.svg}</svg>`;
}

function isEmojiOrText(icon: string): boolean {
  if (!icon || typeof icon !== 'string') return false;
  // Проверяем, является ли это эмодзи или простым текстом
  // Эмодзи обычно содержат специальные Unicode символы
  // Простой текст - это буквы, но не путь (не содержит /)
  const isUrl = icon.includes('/') || icon.startsWith('http');
  if (isUrl) return false;
  
  // Если это короткая строка без точек и слешей - скорее всего эмодзи или инициалы
  return icon.length <= 10;
}

function getIconUrl(icon: string): string {
  if (!icon || typeof icon !== 'string') return '';
  if (icon.startsWith('http')) return icon;
  const baseUrl = import.meta.env.VITE_API_BASE_URL?.replace('/api/v1', '') || 'http://localhost:3000';
  if (icon.startsWith('/')) return `${baseUrl}${icon}`;
  // Попробуем несколько путей
  const paths = [
    `${baseUrl}/api/v1/projects/icons/${icon}`,
    `${baseUrl}/api/v1/uploads/project-icons/${icon}`,
    `${baseUrl}/uploads/project-icons/${icon}`,
  ];
  return paths[0]; // Возвращаем первый вариант, сервер должен вернуть 404 если неправильно
}

function isOverdue(deadline: string | null | undefined): boolean {
  if (!deadline) return false;
  return new Date(deadline) < new Date();
}

function formatDate(date: string): string {
  const d = new Date(date);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (d.toDateString() === today.toDateString()) return 'Сегодня';
  if (d.toDateString() === tomorrow.toDateString()) return 'Завтра';

  return d.toLocaleDateString('ru-RU', { month: 'short', day: 'numeric' });
}

onMounted(() => {
  loadData();
});
</script>

<style scoped>
.dashboard-view {
  width: 100%;
  max-width: 1600px;
  margin: 0 auto;
  padding: 2rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
  min-height: calc(100vh - 100px);
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* Header */
.dashboard-header {
  background: linear-gradient(135deg, rgba(145, 33, 56, 0.5) 0%, rgba(93, 34, 51, 0.5) 100%);
  backdrop-filter: blur(25px);
  -webkit-backdrop-filter: blur(25px);
  border-radius: 1.5rem;
  padding: 2.5rem;
  border: 1px solid rgba(225, 234, 248, 0.1);
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.welcome-section {
  flex: 1;
}

.welcome-title {
  font-size: clamp(1.75rem, 4vw, 2.75rem);
  font-weight: 700;
  color: #e1eaf8;
  margin: 0 0 0.5rem 0;
  line-height: 1.2;
}

.user-name {
  background: linear-gradient(135deg, #b1ff8a 0%, #e1eaf8 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.welcome-subtitle {
  font-size: 1rem;
  color: rgba(225, 234, 248, 0.8);
  margin: 0;
}

/* Main Grid */
.main-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  align-items: start;
}

.column {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* Quick Navigation */
.quick-nav {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.nav-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem;
  background: rgba(145, 33, 56, 0.4);
  border: 1px solid rgba(225, 234, 248, 0.15);
  border-radius: 1rem;
  text-decoration: none;
  color: #e1eaf8;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  cursor: pointer;
}

.nav-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(177, 255, 138, 0.1) 0%, transparent 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.nav-card:hover {
  background: rgba(145, 33, 56, 0.6);
  border-color: rgba(225, 234, 248, 0.25);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(145, 33, 56, 0.3);
}

.nav-card:hover::before {
  opacity: 1;
}

.nav-card-primary { border-left: 3px solid #b1ff8a; }
.nav-card-secondary { border-left: 3px solid #e1eaf8; }
.nav-card-tertiary { border-left: 3px solid #ff6b6b; }

.nav-card-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  background: rgba(225, 234, 248, 0.1);
  border-radius: 0.75rem;
  flex-shrink: 0;
}

.nav-card-icon svg {
  width: 1.25rem;
  height: 1.25rem;
  stroke: currentColor;
  stroke-width: 1.5;
}

.nav-card-content {
  flex: 1;
  position: relative;
  z-index: 1;
}

.nav-card-title {
  font-size: 1rem;
  font-weight: 600;
  color: #e1eaf8;
  margin: 0 0 0.25rem 0;
}

.nav-card-count {
  font-size: 0.875rem;
  color: rgba(225, 234, 248, 0.7);
  margin: 0;
}

.nav-card-arrow {
  color: rgba(225, 234, 248, 0.5);
  font-size: 1.5rem;
  transition: transform 0.3s ease;
  position: relative;
  z-index: 1;
}

.nav-card:hover .nav-card-arrow {
  transform: translateX(4px);
  color: #b1ff8a;
}

/* Section */
.section {
  background: rgba(145, 33, 56, 0.4);
  backdrop-filter: blur(25px);
  -webkit-backdrop-filter: blur(25px);
  border: 1px solid rgba(225, 234, 248, 0.1);
  border-radius: 1.5rem;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.section-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #e1eaf8;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-size: 0.875rem;
}

.section-link {
  color: #b1ff8a;
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
  transition: color 0.2s ease;
}

.section-link:hover {
  color: #e1eaf8;
}

/* Projects List */
.projects-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.project-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(225, 234, 248, 0.05);
  border-left: 3px solid #b1ff8a;
  border-radius: 0.75rem;
  transition: all 0.2s ease;
  text-decoration: none;
  color: inherit;
}

.project-item:hover {
  background: rgba(225, 234, 248, 0.1);
  transform: translateX(4px);
}

.project-icon {
  flex-shrink: 0;
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.75rem;
}

.icon-text {
  font-size: 1.25rem;
  display: block;
  line-height: 1;
}

.icon-image {
  width: 1.5rem;
  height: 1.5rem;
  object-fit: contain;
}
.project-icon-svg {
  width: 100%;
  height: 100%;
  max-width: 32px;
  max-height: 32px;
  object-fit: contain;
}

.project-info {
  flex: 1;
}

.project-name {
  font-size: 0.95rem;
  font-weight: 600;
  color: #e1eaf8;
  margin: 0 0 0.25rem 0;
}

.project-meta {
  display: flex;
  gap: 0.75rem;
  font-size: 0.75rem;
  color: rgba(225, 234, 248, 0.6);
  align-items: center;
  flex-wrap: wrap;
}

.project-count {
  display: inline-block;
}

.badge-creator {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  background: rgba(177, 255, 138, 0.15);
  color: #b1ff8a;
  border-radius: 0.25rem;
  font-weight: 500;
}

.project-participants {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.avatar {
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 50%;
  background: rgba(225, 234, 248, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  flex-shrink: 0;
  border: 2px solid rgba(145, 33, 56, 0.6);
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  font-size: 0.625rem;
  font-weight: 600;
  color: #e1eaf8;
}

.avatar-more {
  font-size: 0.75rem;
  background: rgba(177, 255, 138, 0.2);
  color: #b1ff8a;
  border-color: rgba(177, 255, 138, 0.4);
}

/* Stats Cards */
.stats-cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem;
  background: rgba(145, 33, 56, 0.4);
  border: 1px solid rgba(225, 234, 248, 0.1);
  border-radius: 1rem;
  transition: all 0.2s ease;
}

.stat-card:hover {
  background: rgba(145, 33, 56, 0.6);
  border-color: rgba(225, 234, 248, 0.2);
}

.stat-alert {
  border-color: rgba(255, 107, 107, 0.3);
  background: rgba(255, 107, 107, 0.1);
}

.stat-icon {
  font-size: 1.75rem;
  flex-shrink: 0;
}

.stat-content {
  flex: 1;
}

.stat-label {
  font-size: 0.75rem;
  color: rgba(225, 234, 248, 0.7);
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.stat-value {
  font-size: 1.75rem;
  font-weight: 700;
  color: #e1eaf8;
  margin: 0;
  line-height: 1;
}

/* Tasks List */
.tasks-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.task-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem;
  background: rgba(225, 234, 248, 0.05);
  border-radius: 0.75rem;
  transition: all 0.2s ease;
  border-left: 3px solid rgba(225, 234, 248, 0.2);
}

.task-item:hover {
  background: rgba(225, 234, 248, 0.1);
}

.task-overdue {
  border-left-color: #ff6b6b;
  background: rgba(255, 107, 107, 0.08);
}

.task-overdue .task-name {
  color: #ff6b6b;
}

.task-important {
  border-left-color: #b1ff8a;
}

.task-assigned {
  background: rgba(177, 255, 138, 0.08);
}

.task-status-indicator {
  width: 3px;
  height: 1.5rem;
  background: rgba(177, 255, 138, 0.5);
  border-radius: 2px;
  flex-shrink: 0;
}

.task-content {
  flex: 1;
}

.task-name {
  font-size: 0.95rem;
  font-weight: 500;
  color: #e1eaf8;
  margin: 0 0 0.25rem 0;
  word-break: break-word;
}

.task-details {
  display: flex;
  gap: 0.75rem;
  font-size: 0.75rem;
  color: rgba(225, 234, 248, 0.6);
}

.task-project {
  display: inline-block;
}

.task-assignee {
  display: inline-block;
  padding: 0.125rem 0.5rem;
  background: rgba(225, 234, 248, 0.1);
  border-radius: 0.25rem;
}

.task-meta {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  flex-shrink: 0;
}

.task-badge {
  font-size: 0.875rem;
}

.task-deadline {
  font-size: 0.75rem;
  color: rgba(225, 234, 248, 0.7);
  padding: 0.25rem 0.5rem;
  background: rgba(225, 234, 248, 0.05);
  border-radius: 0.375rem;
  white-space: nowrap;
}

.task-deadline.is-overdue {
  color: #ff6b6b;
  background: rgba(255, 107, 107, 0.15);
}

/* Team Section */
.team-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;
}

.team-member {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem;
  background: rgba(225, 234, 248, 0.05);
  border-radius: 0.75rem;
  transition: all 0.2s ease;
}

.team-member:hover {
  background: rgba(225, 234, 248, 0.1);
}

.member-avatar {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background: rgba(225, 234, 248, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  flex-shrink: 0;
  border: 2px solid rgba(145, 33, 56, 0.6);
}

.member-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder-large {
  font-size: 0.75rem;
  font-weight: 600;
  color: #e1eaf8;
}

.member-info {
  flex: 1;
}

.member-name {
  font-size: 0.9rem;
  font-weight: 500;
  color: #e1eaf8;
  margin: 0 0 0.125rem 0;
}

.member-projects {
  font-size: 0.75rem;
  color: rgba(225, 234, 248, 0.6);
  margin: 0;
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 2rem 1rem;
  color: rgba(225, 234, 248, 0.6);
}

.empty-state p {
  margin: 0;
  font-size: 0.95rem;
}

.empty-link {
  color: #b1ff8a;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease;
}

.empty-link:hover {
  color: #e1eaf8;
}

/* Loading */
.loading-state {
  display: flex;
  justify-content: center;
  padding: 2rem 1rem;
}

.spinner {
  width: 1.5rem;
  height: 1.5rem;
  border: 2px solid rgba(225, 234, 248, 0.2);
  border-top-color: #b1ff8a;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Responsive */
@media (max-width: 1024px) {
  .dashboard-view {
    padding: 1.5rem;
    gap: 1.5rem;
  }

  .main-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .quick-nav {
    grid-template-columns: 1fr;
  }

  .stats-cards {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .dashboard-view {
    padding: 1rem;
    gap: 1.5rem;
  }

  .dashboard-header {
    padding: 1.5rem;
  }

  .welcome-title {
    font-size: 1.5rem;
  }

  .quick-nav {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
  }

  .nav-card {
    padding: 1rem;
    flex-direction: column;
    text-align: center;
  }

  .nav-card-arrow {
    display: none;
  }

  .stats-cards {
    grid-template-columns: 1fr;
  }

  .project-item,
  .task-item {
    flex-wrap: wrap;
  }

  .project-participants {
    order: 3;
    flex-basis: 100%;
    margin-top: 0.5rem;
  }
}

@media (max-width: 480px) {
  .dashboard-view {
    padding: 0.75rem;
    gap: 1rem;
  }

  .dashboard-header {
    padding: 1rem;
  }

  .welcome-title {
    font-size: 1.25rem;
  }

  .welcome-subtitle {
    font-size: 0.875rem;
  }

  .quick-nav {
    grid-template-columns: 1fr;
  }

  .nav-card {
    padding: 0.75rem;
  }

  .section {
    padding: 1rem;
  }

  .task-item {
    padding: 0.75rem;
  }
}
</style>

<template>
  <div class="dashboard-view">
    <!-- Приветственный блок с быстрыми действиями -->
    <div class="dashboard-welcome">
      <div class="welcome-content">
        <div class="welcome-greeting">
          <h1 class="welcome-title">Добро пожаловать, {{ userData.name }}!</h1>
          <p class="welcome-subtitle">Вот краткий обзор вашей работы за этот месяц</p>
        </div>
        <div class="quick-actions">
          <router-link to="/projects" class="quick-action-btn">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M9 11l3 3L22 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Проекты
          </router-link>
          <router-link to="/crm" class="quick-action-btn">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <circle cx="9" cy="7" r="4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            CRM
          </router-link>
          <router-link to="/teams" class="quick-action-btn">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <circle cx="9" cy="7" r="4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Команды
          </router-link>
        </div>
      </div>
    </div>

    <!-- Основные метрики - первый ряд -->
    <div class="metrics-grid">
      <!-- Загруженность команды -->
      <div class="metric-card metric-card-primary">
        <div class="metric-header">
          <h3 class="metric-title">Загруженность команды</h3>
          <div 
            class="metric-tooltip" 
            @mouseenter="!isMobile && (showTooltip = 'workload')" 
            @mouseleave="!isMobile && (showTooltip = null)"
            @click.stop.prevent="isMobile && toggleTooltip('workload', $event)"
          >
            <svg viewBox="0 0 24 24" fill="none" aria-label="Информация о метрике">
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
              <path d="M12 16v-4M12 8h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <div v-if="showTooltip === 'workload'" class="tooltip-content">
              Показывает текущую загруженность команды в процентах от максимальной производительности. 
              Учитывает все активные задачи и проекты.
            </div>
          </div>
        </div>
        <div class="metric-body">
          <div class="metric-main-value">
            <span class="metric-number">{{ workloadData.current }}%</span>
            <span class="metric-change" :class="{ 'metric-change-positive': workloadData.change > 0, 'metric-change-negative': workloadData.change < 0 }">
              {{ workloadData.change > 0 ? '+' : '' }}{{ workloadData.change }}%
            </span>
          </div>
          <div class="metric-progress">
            <div class="progress-bar-bg">
              <div class="progress-bar-fill" :style="{ width: `${workloadData.current}%` }"></div>
            </div>
          </div>
          <p class="metric-description">к прошлому периоду</p>
        </div>
      </div>

      <!-- Активные проекты -->
      <div class="metric-card metric-card-secondary">
        <div class="metric-header">
          <h3 class="metric-title">Активные проекты</h3>
          <div 
            class="metric-tooltip" 
            @mouseenter="!isMobile && (showTooltip = 'projects')" 
            @mouseleave="!isMobile && (showTooltip = null)"
            @click.stop.prevent="isMobile && toggleTooltip('projects', $event)"
          >
            <svg viewBox="0 0 24 24" fill="none" aria-label="Информация о метрике">
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
              <path d="M12 16v-4M12 8h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <div v-if="showTooltip === 'projects'" class="tooltip-content">
              Общее количество проектов, находящихся в активной разработке. 
              Включает проекты на всех стадиях: планирование, разработка, тестирование.
            </div>
          </div>
        </div>
        <div class="metric-body">
          <div class="metric-main-value">
            <span class="metric-number">{{ activeProjects }}</span>
          </div>
          <router-link to="/projects" class="metric-link">Посмотреть все проекты →</router-link>
        </div>
      </div>

      <!-- Завершенные задачи -->
      <div class="metric-card metric-card-accent">
        <div class="metric-header">
          <h3 class="metric-title">Завершенные задачи</h3>
          <div 
            class="metric-tooltip" 
            @mouseenter="!isMobile && (showTooltip = 'completed')" 
            @mouseleave="!isMobile && (showTooltip = null)"
            @click.stop.prevent="isMobile && toggleTooltip('completed', $event)"
          >
            <svg viewBox="0 0 24 24" fill="none" aria-label="Информация о метрике">
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
              <path d="M12 16v-4M12 8h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <div v-if="showTooltip === 'completed'" class="tooltip-content">
              Количество задач, завершенных за текущий период. 
              Показывает продуктивность команды и прогресс по проектам.
            </div>
          </div>
        </div>
        <div class="metric-body">
          <div class="metric-main-value">
            <span class="metric-number">{{ completedTasks.count }}</span>
            <span class="metric-unit">задач</span>
          </div>
          <div class="metric-trend">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <polyline points="17 6 23 6 23 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span>+{{ completedTasks.change }}% к прошлому периоду</span>
          </div>
        </div>
      </div>

      <!-- Задачи требующие внимания -->
      <div class="metric-card metric-card-alert">
        <div class="metric-header">
          <h3 class="metric-title">Требуют внимания</h3>
          <div 
            class="metric-tooltip" 
            @mouseenter="!isMobile && (showTooltip = 'attention')" 
            @mouseleave="!isMobile && (showTooltip = null)"
            @click.stop.prevent="isMobile && toggleTooltip('attention', $event)"
          >
            <svg viewBox="0 0 24 24" fill="none" aria-label="Информация о метрике">
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
              <path d="M12 16v-4M12 8h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <div v-if="showTooltip === 'attention'" class="tooltip-content">
              Количество задач и проектов, которые требуют немедленного внимания: 
              просроченные дедлайны, блокеры, задачи с высоким приоритетом.
            </div>
          </div>
        </div>
        <div class="metric-body">
          <div class="metric-main-value">
            <span class="metric-number">{{ attentionNeeded.count }}</span>
          </div>
          <div class="attention-items">
            <div v-for="(item, idx) in attentionNeeded.items.slice(0, 2)" :key="idx" class="attention-item">
              <span class="attention-icon">{{ item.icon }}</span>
              <span class="attention-text">{{ item.text }}</span>
            </div>
          </div>
          <router-link to="/projects" class="metric-link">Посмотреть все →</router-link>
        </div>
      </div>
    </div>

    <!-- Второй ряд: детальная аналитика -->
    <div class="analytics-grid">
      <!-- Соблюдение сроков -->
      <div class="analytics-card analytics-card-wide">
        <div class="analytics-header">
          <h3 class="analytics-title">Соблюдение сроков</h3>
          <div 
            class="metric-tooltip" 
            @mouseenter="!isMobile && (showTooltip = 'deadlines')" 
            @mouseleave="!isMobile && (showTooltip = null)"
            @click.stop.prevent="isMobile && toggleTooltip('deadlines', $event)"
          >
            <svg viewBox="0 0 24 24" fill="none" aria-label="Информация о метрике">
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
              <path d="M12 16v-4M12 8h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <div v-if="showTooltip === 'deadlines'" class="tooltip-content">
              Процент проектов, закрытых в срок, разбитый по типам проектов. 
              Показывает эффективность планирования и выполнения работ.
            </div>
          </div>
        </div>
        <div class="deadline-content">
          <div class="deadline-progress">
            <div class="progress-bar-container">
              <div class="progress-bar">
                <div
                  class="progress-segment progress-segment-large"
                  :style="{ width: `${deadlineData.large.percentage}%` }"
                >
                  <div class="progress-segment-label">{{ deadlineData.large.percentage }}%</div>
                </div>
                <div
                  class="progress-segment progress-segment-medium"
                  :style="{ width: `${deadlineData.medium.percentage}%` }"
                >
                  <div class="progress-segment-label">{{ deadlineData.medium.percentage }}%</div>
                </div>
                <div
                  class="progress-segment progress-segment-small"
                  :style="{ width: `${deadlineData.small.percentage}%` }"
                >
                  <div class="progress-segment-label">{{ deadlineData.small.percentage }}%</div>
                </div>
              </div>
              <div class="progress-labels">
                <div
                  class="progress-label"
                  :style="{ left: `${progressLabelPositions.large}%` }"
                >
                  большие
                </div>
                <div
                  class="progress-label"
                  :style="{ left: `${progressLabelPositions.medium}%` }"
                >
                  средние
                </div>
                <div
                  class="progress-label"
                  :style="{ left: `${progressLabelPositions.small}%` }"
                >
                  малые
                </div>
              </div>
            </div>
          </div>
          <div class="deadline-stats">
            <div class="deadline-stat">
              <div class="deadline-stat-value">{{ deadlineData.closedOnTime }} / {{ deadlineData.total }}</div>
              <div class="deadline-stat-label">закрыты в срок</div>
            </div>
            <div class="deadline-stat">
              <div class="deadline-stat-value highlight">{{ bestTaskType }}</div>
              <div class="deadline-stat-label">лучше всего удаются</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Финансовые показатели -->
      <div class="analytics-card">
        <div class="analytics-header">
          <h3 class="analytics-title">Финансы</h3>
          <div 
            class="metric-tooltip" 
            @mouseenter="!isMobile && (showTooltip = 'finance')" 
            @mouseleave="!isMobile && (showTooltip = null)"
            @click.stop.prevent="isMobile && toggleTooltip('finance', $event)"
          >
            <svg viewBox="0 0 24 24" fill="none" aria-label="Информация о метрике">
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
              <path d="M12 16v-4M12 8h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <div v-if="showTooltip === 'finance'" class="tooltip-content">
              Общий доход от всех активных проектов и маржинальность портфеля. 
              Маржинальность показывает процент прибыли от общей выручки.
            </div>
          </div>
        </div>
        <div class="finance-content">
          <div class="finance-item">
            <div class="finance-label">Общий доход</div>
            <div class="finance-value">{{ portfolioData.totalIncome }} ₽</div>
          </div>
          <div class="finance-item">
            <div class="finance-label">Маржинальность</div>
            <div class="finance-value finance-value-accent">{{ portfolioData.marginality }}%</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Третий ряд: важное и цели -->
    <div class="info-grid">
      <!-- Важные уведомления -->
      <div class="info-card info-card-important">
        <div class="info-card-header">
          <h3 class="info-card-title">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M13.73 21a2 2 0 01-3.46 0" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            важное
          </h3>
        </div>
        <div class="important-list">
          <div
            v-for="(item, index) in displayedImportantItems"
            :key="index"
            class="important-item"
          >
            <span class="important-text">{{ item }}</span>
          </div>
        </div>
      </div>

      <!-- Цели на месяц -->
      <div class="info-card info-card-goals">
        <div class="info-card-header">
          <h3 class="info-card-title">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M22 11.08V12a10 10 0 11-5.93-9.14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <polyline points="22 4 12 14.01 9 11.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            цели на месяц
          </h3>
        </div>
        <div class="goals-list">
          <div
            v-for="(goal, index) in displayedMonthlyGoals"
            :key="index"
            class="goal-item"
            :class="{ 'goal-item-completed': goal.completed }"
          >
            <svg v-if="goal.completed" viewBox="0 0 24 24" fill="none" aria-hidden="true" class="goal-check">
              <path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span class="goal-text">{{ goal.text }}</span>
            <div v-if="goal.progress !== undefined" class="goal-progress">
              <div class="goal-progress-bar">
                <div class="goal-progress-fill" :style="{ width: `${goal.progress}%` }"></div>
              </div>
              <span class="goal-progress-text">{{ goal.progress }}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue';

// Типы данных
interface UserData {
  name: string;
  role: string;
  avatar: string;
}

interface WorkloadData {
  current: number;
  change: number;
}

interface DeadlineSegment {
  percentage: number;
  label: string;
}

interface DeadlineData {
  large: DeadlineSegment;
  medium: DeadlineSegment;
  small: DeadlineSegment;
  closedOnTime: number;
  total: number;
}

interface Goal {
  text: string;
  completed?: boolean;
  progress?: number;
}

// Данные пользователя
const userData = ref<UserData>({
  name: 'Наташа',
  role: 'Менеджер',
  avatar: '/images/avatars/photo_2025-11-23_17-19-15.jpg',
});

// Метрики
const workloadData = ref<WorkloadData>({
  current: 75,
  change: 10,
});

const activeProjects = ref<number>(15);

const completedTasks = ref({
  count: 127,
  change: 15,
});

const attentionNeeded = ref({
  count: 7,
  items: [
    { icon: '⚠️', text: 'Проект "Редизайн" - дедлайн через 2 дня' },
    { icon: '🔴', text: '3 задачи просрочены' },
    { icon: '🟡', text: '2 проекта требуют одобрения' },
  ],
});

const deadlineData = ref<DeadlineData>({
  large: {
    percentage: 48,
    label: 'большие',
  },
  medium: {
    percentage: 25,
    label: 'средние',
  },
  small: {
    percentage: 27,
    label: 'малые',
  },
  closedOnTime: 132,
  total: 275,
});

const portfolioData = ref({
  totalIncome: '765 045',
  marginality: '42',
});

// Важные элементы
const importantItems = ref<string[]>([
  'Проект "Редизайн сайта" требует внимания: дедлайн через 3 дня',
  'Рекомендация: увеличить загрузку на 15% для достижения месячного плана',
  'Клиент запросил изменения в проекте "Мобильное приложение"',
  'Отчет за прошлую неделю готов к просмотру',
  'Все задачи по проекту "Корпоративный портал" выполнены в срок',
  'Новый проект "Разработка мобильного приложения" требует утверждения бюджета и сроков',
  'Аналитика показывает рост эффективности команды на 12% по сравнению с прошлым месяцем',
  'Проект "Внедрение CRM-системы" имеет риск срыва дедлайна из-за задержки поставки оборудования',
]);

const displayedImportantItems = computed(() => {
  return importantItems.value.slice(0, 5);
});

// Цели на месяц
const monthlyGoals = ref<Goal[]>([
  { text: 'Завершить 5 крупных проектов', completed: false, progress: 60 },
  { text: 'Достичь маржинальности портфеля 45%', completed: false, progress: 93 },
  { text: 'Увеличить общий доход на 20%', completed: false, progress: 75 },
  { text: 'Соблюсти дедлайны в 95% случаев', completed: true },
  { text: 'Привлечь 3 новых клиента', completed: false, progress: 67 },
  { text: 'Провести 10 встреч с командой', completed: false, progress: 80 },
]);

const displayedMonthlyGoals = computed(() => {
  return monthlyGoals.value.slice(0, 5);
});

// Вычисляемые свойства
const bestTaskType = computed(() => {
  const segments = [
    { type: 'большие', value: deadlineData.value.large.percentage },
    { type: 'средние', value: deadlineData.value.medium.percentage },
    { type: 'малые', value: deadlineData.value.small.percentage },
  ];
  return segments.reduce((max, current) => (current.value > max.value ? current : max)).type;
});

const progressLabelPositions = computed(() => {
  const large = deadlineData.value.large.percentage;
  const medium = deadlineData.value.medium.percentage;
  const small = deadlineData.value.small.percentage;
  
  return {
    large: large / 2,
    medium: large + (medium / 2),
    small: large + medium + (small / 2),
  };
});

// Tooltip
const showTooltip = ref<string | null>(null);

// Определение мобильного устройства
const windowWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 1920);
const isMobile = computed(() => windowWidth.value <= 768);

if (typeof window !== 'undefined') {
  const handleResizeWindow = () => {
    windowWidth.value = window.innerWidth;
  };
  window.addEventListener('resize', handleResizeWindow);
  onUnmounted(() => {
    window.removeEventListener('resize', handleResizeWindow);
  });
}

// Функция для переключения tooltip (для мобильных устройств)
function toggleTooltip(tooltipId: string, event?: MouseEvent | TouchEvent) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
  }
  
  if (showTooltip.value === tooltipId) {
    showTooltip.value = null;
  } else {
    showTooltip.value = tooltipId;
  }
}

// Закрытие tooltip при клике вне его
function handleClickOutside(event: MouseEvent) {
  const target = event.target as HTMLElement;
  // Не закрываем, если клик был на tooltip или его содержимое
  if (target.closest('.metric-tooltip') || target.closest('.tooltip-content')) {
    return;
  }
  
  showTooltip.value = null;
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});

// Вспомогательные функции
const getItemIcon = (item: string): string => {
  if (item.includes('⚠️')) return '⚠️';
  if (item.includes('💡')) return '💡';
  if (item.includes('🔔')) return '🔔';
  if (item.includes('📊')) return '📊';
  if (item.includes('✅')) return '✅';
  return '•';
};
</script>

<style scoped>
@font-face {
  font-family: 'Involve';
  src: url('/fonts/Involve-Regular.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Involve';
  src: url('/fonts/Involve-Medium.woff2') format('woff2');
  font-weight: 500;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Involve';
  src: url('/fonts/Involve-SemiBold.woff2') format('woff2');
  font-weight: 600;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Involve';
  src: url('/fonts/Involve-Bold.woff2') format('woff2');
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}

.dashboard-view {
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Involve', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
  min-height: calc(100vh - 100px);
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* Приветственный блок */
.dashboard-welcome {
  background: rgba(145, 33, 56, 0.5);
  backdrop-filter: blur(25px);
  -webkit-backdrop-filter: blur(25px);
  border-radius: 2rem;
  padding: 2rem;
  border: 1px solid rgba(225, 234, 248, 0.1);
}

.welcome-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
}

.welcome-greeting {
  flex: 1;
}

.welcome-title {
  font-size: clamp(1.5rem, 4vw, 2.5rem);
  font-weight: 700;
  color: #e1eaf8;
  margin: 0 0 0.5rem 0;
  line-height: 1.2;
}

.welcome-subtitle {
  font-size: 1rem;
  color: rgba(225, 234, 248, 0.8);
  margin: 0;
}

.quick-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.quick-action-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: rgba(225, 234, 248, 0.1);
  border: 1px solid rgba(225, 234, 248, 0.2);
  border-radius: 0.75rem;
  color: #e1eaf8;
  text-decoration: none;
  font-size: 0.9375rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.quick-action-btn svg {
  width: 1.25rem;
  height: 1.25rem;
  stroke: currentColor;
}

.quick-action-btn:hover {
  background: rgba(225, 234, 248, 0.2);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(145, 33, 56, 0.3);
}

/* Сетка метрик */
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

/* Карточки метрик */
.metric-card {
  background: rgba(145, 33, 56, 0.5);
  backdrop-filter: blur(25px);
  -webkit-backdrop-filter: blur(25px);
  border-radius: 1.5rem;
  padding: 1.5rem;
  border: 1px solid rgba(225, 234, 248, 0.1);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.metric-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(145, 33, 56, 0.4);
  border-color: rgba(225, 234, 248, 0.2);
}

.metric-card-primary {
  background: rgba(145, 33, 56, 0.6);
}

.metric-card-secondary {
  background: rgba(255, 255, 255, 0.25);
}

.metric-card-accent {
  background: linear-gradient(135deg, rgba(145, 33, 56, 0.6) 0%, rgba(93, 34, 51, 0.6) 100%);
}

.metric-card-alert {
  background: rgba(177, 255, 138, 0.1);
  border-color: rgba(177, 255, 138, 0.2);
}

.metric-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 0.5rem;
}

.metric-title {
  font-size: 1rem;
  font-weight: 600;
  color: #e1eaf8;
  margin: 0;
  text-transform: lowercase;
  letter-spacing: 0.02em;
}

.metric-tooltip {
  position: relative;
  cursor: help;
  flex-shrink: 0;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
  user-select: none;
  -webkit-user-select: none;
  pointer-events: auto;
}

.metric-tooltip svg {
  width: 1.125rem;
  height: 1.125rem;
  color: rgba(225, 234, 248, 0.6);
  transition: color 0.2s ease;
}

.metric-tooltip:hover svg {
  color: #e1eaf8;
}

.tooltip-content {
  position: absolute;
  bottom: calc(100% + 0.5rem);
  right: 0;
  width: 240px;
  max-width: calc(100vw - 2rem);
  background: rgba(20, 15, 25, 0.98);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(225, 234, 248, 0.2);
  border-radius: 0.75rem;
  padding: 0.75rem;
  font-size: 0.875rem;
  color: #e1eaf8;
  line-height: 1.5;
  z-index: 1000;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
  pointer-events: auto;
  animation: fadeInDown 0.2s ease-out;
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.tooltip-content::after {
  content: '';
  position: absolute;
  top: 100%;
  right: 1rem;
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-top: 6px solid rgba(20, 15, 25, 0.98);
}

.metric-body {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  flex: 1;
}

.metric-main-value {
  display: flex;
  align-items: baseline;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.metric-number {
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 700;
  color: #e1eaf8;
  line-height: 1;
}

.metric-unit {
  font-size: 1rem;
  color: rgba(225, 234, 248, 0.7);
  font-weight: 500;
}

.metric-change {
  font-size: 0.875rem;
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  border-radius: 0.5rem;
  background: rgba(225, 234, 248, 0.1);
}

.metric-change-positive {
  color: #b1ff8a;
  background: rgba(177, 255, 138, 0.2);
}

.metric-change-negative {
  color: #ff6b6b;
  background: rgba(255, 107, 107, 0.2);
}

.metric-progress {
  width: 100%;
}

.progress-bar-bg {
  width: 100%;
  height: 8px;
  background: rgba(225, 234, 248, 0.1);
  border-radius: 4px;
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #b1ff8a 0%, #e1eaf8 100%);
  border-radius: 4px;
  transition: width 0.6s ease;
}

.metric-description {
  font-size: 0.875rem;
  color: rgba(225, 234, 248, 0.7);
  margin: 0;
}

.metric-link {
  font-size: 0.875rem;
  color: #b1ff8a;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease;
}

.metric-link:hover {
  color: #e1eaf8;
}

.metric-trend {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: rgba(225, 234, 248, 0.8);
}

.metric-trend svg {
  width: 1rem;
  height: 1rem;
  color: #b1ff8a;
}

.attention-items {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.attention-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: rgba(225, 234, 248, 0.9);
}

.attention-icon {
  font-size: 1rem;
}

.attention-text {
  flex: 1;
}

/* Аналитика */
.analytics-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1.5rem;
}

.analytics-card {
  background: rgba(145, 33, 56, 0.5);
  backdrop-filter: blur(25px);
  -webkit-backdrop-filter: blur(25px);
  border-radius: 1.5rem;
  padding: 1.5rem;
  border: 1px solid rgba(225, 234, 248, 0.1);
}

.analytics-card-wide {
  grid-column: 1;
}

.analytics-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
}

.analytics-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #e1eaf8;
  margin: 0;
  text-transform: lowercase;
}

.deadline-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.deadline-progress {
  flex: 1;
}

.progress-bar-container {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.progress-bar {
  display: flex;
  height: 48px;
  border-radius: 1rem;
  overflow: hidden;
  position: relative;
}

.progress-segment {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  min-width: 0;
}

.progress-segment-large {
  background: #d9d9d9;
  border-radius: 1rem 0 0 1rem;
}

.progress-segment-medium {
  background: rgba(255, 252, 252, 0.34);
  background-image: repeating-linear-gradient(
    45deg,
    transparent,
    transparent 4px,
    rgba(217, 217, 217, 0.3) 4px,
    rgba(217, 217, 217, 0.3) 8px
  );
  border: 4px solid #d9d9d9;
  border-left: none;
  border-right: none;
}

.progress-segment-small {
  background: rgba(255, 252, 252, 0.34);
  border: 4px solid #d9d9d9;
  border-left: none;
  border-radius: 0 1rem 1rem 0;
}

.progress-segment-label {
  font-size: 1.5rem;
  font-weight: 600;
  color: #5d2233;
  position: absolute;
  white-space: nowrap;
}

.progress-labels {
  display: flex;
  position: relative;
  height: 1.5rem;
  width: 100%;
}

.progress-label {
  font-size: 0.875rem;
  color: #e1eaf8;
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  white-space: nowrap;
}

.deadline-stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.deadline-stat {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.deadline-stat-value {
  font-size: 1.75rem;
  font-weight: 700;
  color: #e1eaf8;
  line-height: 1.2;
}

.deadline-stat-value.highlight {
  color: #b1ff8a;
}

.deadline-stat-label {
  font-size: 0.875rem;
  color: rgba(225, 234, 248, 0.7);
}

.finance-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.finance-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.finance-label {
  font-size: 0.875rem;
  color: rgba(225, 234, 248, 0.7);
}

.finance-value {
  font-size: 2rem;
  font-weight: 700;
  color: #e1eaf8;
}

.finance-value-accent {
  color: #b1ff8a;
}

/* Информационные карточки */
.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 1.5rem;
}

.info-card {
  background: rgba(145, 33, 56, 0.5);
  backdrop-filter: blur(25px);
  -webkit-backdrop-filter: blur(25px);
  border-radius: 1.5rem;
  padding: 1.5rem;
  border: 1px solid rgba(225, 234, 248, 0.1);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.info-card-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.info-card-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #e1eaf8;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.info-card-title svg {
  width: 1.25rem;
  height: 1.25rem;
  stroke: currentColor;
}

.important-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.important-item {
  background: rgba(145, 33, 56, 0.6);
  border-radius: 0.75rem;
  padding: 1rem;
  color: #e1eaf8;
  font-size: 0.9375rem;
  line-height: 1.5;
  min-height: 3rem;
  display: flex;
  align-items: center;
}

.important-text {
  word-wrap: break-word;
  overflow-wrap: break-word;
}

.goals-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.goal-item {
  background: rgba(145, 33, 56, 0.6);
  border-radius: 0.75rem;
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #e1eaf8;
  font-size: 0.9375rem;
  transition: all 0.2s ease;
  min-height: 3rem;
}

.goal-item-completed {
  opacity: 0.7;
  background: rgba(177, 255, 138, 0.1);
}

.goal-check {
  width: 1.25rem;
  height: 1.25rem;
  color: #b1ff8a;
  flex-shrink: 0;
}

.goal-text {
  flex: 1;
}

.goal-progress {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 80px;
}

.goal-progress-bar {
  flex: 1;
  height: 4px;
  background: rgba(225, 234, 248, 0.1);
  border-radius: 2px;
  overflow: hidden;
}

.goal-progress-fill {
  height: 100%;
  background: #b1ff8a;
  border-radius: 2px;
  transition: width 0.6s ease;
}

.goal-progress-text {
  font-size: 0.75rem;
  color: rgba(225, 234, 248, 0.7);
  min-width: 2.5rem;
  text-align: right;
}

/* Адаптивность */
@media (max-width: 1024px) {
  .dashboard-view {
    padding: 1.5rem;
  }

  .analytics-grid {
    grid-template-columns: 1fr;
  }

  .analytics-card-wide {
    grid-column: 1;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .dashboard-view {
    padding: 1rem;
    gap: 1.5rem;
  }

  .welcome-content {
    flex-direction: column;
    align-items: flex-start;
  }

  .quick-actions {
    width: 100%;
  }

  .quick-action-btn {
    flex: 1;
    justify-content: center;
  }

  .metrics-grid {
    grid-template-columns: 1fr;
  }

  .deadline-content {
    gap: 1rem;
  }

  .progress-bar {
    height: 36px;
  }

  .progress-segment-label {
    font-size: 1.125rem;
  }

  .deadline-stats {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .dashboard-view {
    padding: 0.75rem;
  }

  .metric-card,
  .analytics-card,
  .info-card {
    padding: 1rem;
  }

  .welcome-title {
    font-size: 1.5rem;
  }

  .metric-number {
    font-size: 2rem;
  }

  .tooltip-content {
    position: fixed !important;
    top: 50% !important;
    left: 50% !important;
    right: auto !important;
    bottom: auto !important;
    transform: translate(-50%, -50%) !important;
    width: calc(100vw - 2rem);
    max-width: 280px;
    font-size: 0.8125rem;
    z-index: 10000 !important;
    animation: tooltipFadeIn 0.2s ease-out;
    pointer-events: auto;
  }

  .tooltip-content::after {
    left: 50%;
    right: auto;
    transform: translateX(-50%);
  }

  .metric-tooltip {
    cursor: pointer;
  }

  .metric-tooltip:active svg {
    color: #e1eaf8;
    transform: scale(1.1);
  }

  .metric-card {
    user-select: none;
    -webkit-user-select: none;
  }
}

/* Анимации */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes tooltipFadeIn {
  from {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}

.metric-card,
.analytics-card,
.info-card {
  animation: fadeIn 0.6s ease-out;
}

/* Accessibility */
@media (prefers-reduced-motion: reduce) {
  .metric-card,
  .quick-action-btn,
  .goal-item {
    transition: none;
  }

  .progress-bar-fill,
  .goal-progress-fill {
    transition: none;
  }
}
</style>
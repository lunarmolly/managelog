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
              <path d="M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-6l-2-2H5a2 2 0 0 0-2 2z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Проекты
          </router-link>
          <router-link to="/crm" class="quick-action-btn">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M14.001 16.0996C14.4851 16.1001 14.9506 16.2859 15.3027 16.6182C15.6549 16.9506 15.8671 17.4052 15.8955 17.8887C15.9239 18.3721 15.7669 18.8484 15.4561 19.2197C15.1453 19.591 14.7044 19.8295 14.2236 19.8867L14.1973 19.8896L14.1709 19.8916L14.0537 19.8984L14.0273 19.9004H9.99902C9.51492 19.8999 9.04936 19.7141 8.69727 19.3818C8.34513 19.0494 8.13287 18.5948 8.10449 18.1113C8.07612 17.6279 8.23312 17.1516 8.54395 16.7803C8.85469 16.409 9.29564 16.1705 9.77637 16.1133L9.80273 16.1104L9.8291 16.1084L9.94629 16.1016L9.97266 16.0996H14.001ZM17 10.0996C17.5039 10.0996 17.9874 10.2999 18.3438 10.6562C18.7001 11.0126 18.9004 11.4961 18.9004 12C18.9004 12.5039 18.7001 12.9874 18.3438 13.3438C17.9874 13.7001 17.5039 13.9004 17 13.9004H7C6.49609 13.9004 6.01257 13.7001 5.65625 13.3438C5.29993 12.9874 5.09961 12.5039 5.09961 12C5.09961 11.4961 5.29993 11.0126 5.65625 10.6562C6.01257 10.2999 6.49609 10.0996 7 10.0996H17ZM20 4.09961C20.5039 4.09961 20.9874 4.29993 21.3438 4.65625C21.7001 5.01257 21.9004 5.49609 21.9004 6C21.9004 6.50391 21.7001 6.98743 21.3438 7.34375C20.9874 7.70007 20.5039 7.90039 20 7.90039H4C3.49609 7.90039 3.01257 7.70007 2.65625 7.34375C2.29993 6.98743 2.09961 6.50391 2.09961 6C2.09961 5.49609 2.29993 5.01257 2.65625 4.65625C3.01257 4.29993 3.49609 4.09961 4 4.09961H20Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            CRM
          </router-link>
          <router-link to="/teams" class="quick-action-btn">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M12 12C13.873 12 15.57 12.62 16.815 13.487C17.998 14.312 19 15.538 19 16.857C19 17.581 18.691 18.181 18.204 18.627C17.746 19.048 17.148 19.321 16.532 19.507C15.301 19.88 13.68 20 12 20C10.32 20 8.699 19.88 7.468 19.507C6.852 19.321 6.254 19.048 5.795 18.627C5.31 18.182 5 17.582 5 16.858C5 15.539 6.002 14.313 7.185 13.488C8.43 12.62 10.127 12 12 12ZM12 14C10.56 14 9.257 14.48 8.33 15.127C7.341 15.817 7 16.519 7 16.857C7 17.161 7.352 17.351 7.672 17.471L7.877 17.541L8.047 17.593C8.987 17.877 10.367 18 12 18C13.508 18 14.799 17.895 15.728 17.656L16.032 17.569L16.222 17.509C16.565 17.392 17 17.195 17 16.857C17 16.519 16.659 15.817 15.67 15.127C14.744 14.481 13.44 14 12 14ZM19 13C20.044 13 20.992 13.345 21.693 13.833C22.333 14.28 23 15.023 23 15.929C23 17.264 21.703 17.742 20.537 17.909L20.237 17.946L19.948 17.971L19.81 17.979C19.932 17.634 20 17.259 20 16.857C19.9994 16.5578 19.9635 16.2598 19.893 15.969C20.279 15.939 20.596 15.889 20.832 15.818C20.936 15.786 20.842 15.688 20.732 15.603L20.625 15.525L20.549 15.474C20.2488 15.2691 19.9104 15.127 19.554 15.056C19.174 14.296 18.59 13.638 17.968 13.113C18.3069 13.0381 18.6529 13.0002 19 13ZM5 13C5.358 13.0013 5.702 13.039 6.032 13.113C5.41 13.638 4.826 14.296 4.446 15.056C4.08958 15.127 3.75116 15.2691 3.451 15.474L3.323 15.562C3.196 15.654 3.047 15.782 3.168 15.818C3.404 15.889 3.721 15.94 4.108 15.969C4.03622 16.2595 3.99995 16.5577 4 16.857C4 17.259 4.068 17.634 4.19 17.979L3.91 17.959L3.614 17.929C2.412 17.782 1 17.322 1 15.929C1 15.024 1.666 14.28 2.307 13.833C3.09997 13.2898 4.03882 12.9994 5 13ZM18.5 7C19.163 7 19.7989 7.26339 20.2678 7.73223C20.7366 8.20107 21 8.83696 21 9.5C21 10.163 20.7366 10.7989 20.2678 11.2678C19.7989 11.7366 19.163 12 18.5 12C17.837 12 17.2011 11.7366 16.7322 11.2678C16.2634 10.7989 16 10.163 16 9.5C16 8.83696 16.2634 8.20107 16.7322 7.73223C17.2011 7.26339 17.837 7 18.5 7ZM5.5 7C6.16304 7 6.79893 7.26339 7.26777 7.73223C7.73661 8.20107 8 8.83696 8 9.5C8 10.163 7.73661 10.7989 7.26777 11.2678C6.79893 11.7366 6.16304 12 5.5 12C4.83696 12 4.20107 11.7366 3.73223 11.2678C3.26339 10.7989 3 10.163 3 9.5C3 8.83696 3.26339 8.20107 3.73223 7.73223C4.20107 7.26339 4.83696 7 5.5 7ZM12 3C13.0609 3 14.0783 3.42143 14.8284 4.17157C15.5786 4.92172 16 5.93913 16 7C16 8.06087 15.5786 9.07828 14.8284 9.82843C14.0783 10.5786 13.0609 11 12 11C10.9391 11 9.92172 10.5786 9.17157 9.82843C8.42143 9.07828 8 8.06087 8 7C8 5.93913 8.42143 4.92172 9.17157 4.17157C9.92172 3.42143 10.9391 3 12 3ZM18.5 9C18.3674 9 18.2402 9.05268 18.1464 9.14645C18.0527 9.24021 18 9.36739 18 9.5C18 9.63261 18.0527 9.75979 18.1464 9.85355C18.2402 9.94732 18.3674 10 18.5 10C18.6326 10 18.7598 9.94732 18.8536 9.85355C18.9473 9.75979 19 9.63261 19 9.5C19 9.36739 18.9473 9.24021 18.8536 9.14645C18.7598 9.05268 18.6326 9 18.5 9ZM5.5 9C5.36739 9 5.24021 9.05268 5.14645 9.14645C5.05268 9.24021 5 9.36739 5 9.5C5 9.63261 5.05268 9.75979 5.14645 9.85355C5.24021 9.94732 5.36739 10 5.5 10C5.63261 10 5.75979 9.94732 5.85355 9.85355C5.94732 9.75979 6 9.63261 6 9.5C6 9.36739 5.94732 9.24021 5.85355 9.14645C5.75979 9.05268 5.63261 9 5.5 9ZM12 5C11.4696 5 10.9609 5.21071 10.5858 5.58579C10.2107 5.96086 10 6.46957 10 7C10 7.53043 10.2107 8.03914 10.5858 8.41421C10.9609 8.78929 11.4696 9 12 9C12.5304 9 13.0391 8.78929 13.4142 8.41421C13.7893 8.03914 14 7.53043 14 7C14 6.46957 13.7893 5.96086 13.4142 5.58579C13.0391 5.21071 12.5304 5 12 5Z" fill="currentColor"/>
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
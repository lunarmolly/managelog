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

    <!-- Модальное окно создания задачи -->
    <Teleport to="body">
      <div v-if="showCreateTaskModal" class="modal-overlay" @click="closeCreateTaskModal">
        <div class="create-task-modal" @click.stop>
          <div class="modal-header">
            <button class="modal-close-btn" @click="closeCreateTaskModal" aria-label="Закрыть">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M18 6L6 18M6 6L18 18"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </button>
            <h2 class="modal-title">Создать задачу</h2>
            <div class="modal-subtitle">Заполните информацию о задаче</div>
          </div>

          <!-- Название -->
          <div class="modal-field">
            <label class="modal-field-label" for="task-name">
              Название задачи
              <span class="modal-field-required">*</span>
            </label>
            <div class="modal-input-wrapper">
              <input
                id="task-name"
                v-model="newTask.name"
                type="text"
                class="modal-field-input"
                placeholder="Введите название задачи"
                required
              />
            </div>
          </div>

          <!-- Описание -->
          <div class="modal-field">
            <label class="modal-field-label" for="task-description">
              Описание задачи
            </label>
            <div class="modal-textarea-wrapper">
              <textarea
                id="task-description"
                v-model="newTask.description"
                class="modal-description-textarea"
                placeholder="Опишите задачу..."
                rows="6"
              ></textarea>
              <div class="modal-textarea-footer">
                <span class="modal-char-count">{{ newTask.description.length }} символов</span>
              </div>
            </div>
          </div>

          <!-- Генерация описания -->
          <div class="modal-generate-section">
            <div class="modal-generate-btn" @click="generateDescription">
              <div class="modal-generate-btn-icon">
                <img 
                  :src="isImportantTask ? '/images/icons/tasks/fire-active.svg' : '/images/icons/tasks/fire-unactive.svg'" 
                  alt="сгенерировать описание" 
                />
              </div>
              <div class="modal-generate-btn-text">сгенерировать описание</div>
            </div>
            <div
              v-if="generatedDescription"
              class="modal-generated-description"
            >
              <div class="modal-generated-content">
                <div class="modal-generated-text">{{ generatedDescription }}</div>
                <div class="modal-generated-actions">
                  <div class="modal-action-btn modal-action-accept" @click="acceptGeneratedDescription">
                    <div class="modal-action-btn-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M20 6L9 17l-5-5"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </div>
                    <span>принять</span>
                  </div>
                  <div class="modal-action-btn modal-action-refine" @click="refineGeneratedDescription">
                    <div class="modal-action-btn-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </div>
                    <span>доработать</span>
                  </div>
                  <div class="modal-action-btn modal-action-delete" @click="deleteGeneratedDescription">
                    <div class="modal-action-btn-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14zM10 11v6M14 11v6"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </div>
                    <span>удалить</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Постановщик, исполнитель, наблюдатели -->
          <div class="modal-field">
            <label class="modal-field-label">Участники</label>
            <div class="task-modal-participants-row">
              <button
                class="task-modal-participant-btn"
                :class="{ 'selected': newTask.creatorId }"
                @click="showCreatorSelect = !showCreatorSelect"
              >
                <img src="/images/icons/tasks/creator.svg" alt="постановщик" />
                <span>{{ getCreatorName() || 'постановщик' }}</span>
              </button>
              <button
                class="task-modal-participant-btn"
                :class="{ 'selected': newTask.assigneeId }"
                @click="showAssigneeSelect = !showAssigneeSelect"
              >
                <img src="/images/icons/tasks/executor.svg" alt="исполнитель" />
                <span>{{ getAssigneeName() || 'исполнитель' }}</span>
              </button>
              <button
                class="task-modal-participant-btn"
                :class="{ 'selected': newTask.watcherIds.length > 0 }"
                @click="showWatchersSelect = !showWatchersSelect"
              >
                <img src="/images/icons/tasks/watcher.svg" alt="наблюдатели" />
                <span>{{ newTask.watcherIds.length > 0 ? `${newTask.watcherIds.length} наблюдателей` : 'наблюдатели' }}</span>
              </button>
            </div>

            <!-- Выпадающие списки участников -->
            <div v-if="showCreatorSelect" class="task-modal-participants-dropdown">
              <div
                v-for="user in projectParticipants"
                :key="user.id"
                class="task-modal-participant-option"
                @click="selectCreator(user.id)"
              >
                <img v-if="user.avatar" :src="user.avatar" :alt="user.displayName || user.firstName || ''" />
                <div v-else class="task-modal-participant-avatar-placeholder">
                  {{ (user.displayName || user.firstName || user.login || '?')[0].toUpperCase() }}
                </div>
                <span>{{ user.displayName || user.firstName || user.login }}</span>
              </div>
            </div>
            <div v-if="showAssigneeSelect" class="task-modal-participants-dropdown">
              <div
                v-for="user in projectParticipants"
                :key="user.id"
                class="task-modal-participant-option"
                @click="selectAssignee(user.id)"
              >
                <img v-if="user.avatar" :src="user.avatar" :alt="user.displayName || user.firstName || ''" />
                <div v-else class="task-modal-participant-avatar-placeholder">
                  {{ (user.displayName || user.firstName || user.login || '?')[0].toUpperCase() }}
                </div>
                <span>{{ user.displayName || user.firstName || user.login }}</span>
              </div>
            </div>
            <div v-if="showWatchersSelect" class="task-modal-participants-dropdown">
              <div
                v-for="user in projectParticipants"
                :key="user.id"
                class="task-modal-participant-option"
                @click="toggleWatcher(user.id)"
              >
                <input type="checkbox" :checked="newTask.watcherIds.includes(user.id)" @change.stop />
                <img v-if="user.avatar" :src="user.avatar" :alt="user.displayName || user.firstName || ''" />
                <div v-else class="task-modal-participant-avatar-placeholder">
                  {{ (user.displayName || user.firstName || user.login || '?')[0].toUpperCase() }}
                </div>
                <span>{{ user.displayName || user.firstName || user.login }}</span>
              </div>
            </div>
          </div>

          <!-- Важная задача и дедлайн -->
          <div class="modal-field-group">
            <div class="modal-field">
              <label class="modal-field-label">Важная задача</label>
              <button 
                class="task-important-btn"
                :class="{ 'active': isImportantTask }"
                @click="isImportantTask = !isImportantTask"
              >
                <img 
                  :src="isImportantTask ? '/images/icons/tasks/fire-active.svg' : '/images/icons/tasks/fire-unactive.svg'" 
                  alt="важная задача" 
                />
              </button>
            </div>
            <div class="modal-field">
              <label class="modal-field-label" for="task-deadline">Дедлайн</label>
              <div class="modal-input-wrapper">
                <input
                  id="task-deadline"
                  v-model="newTask.deadline"
                  type="datetime-local"
                  class="modal-field-input"
                />
              </div>
            </div>
          </div>

          <!-- Кнопки действий -->
          <div class="modal-actions">
            <div class="modal-btn modal-btn-create" @click="createTask">
              <div class="modal-btn-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M12 5v14m7-7H5"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
              <span>создать задачу</span>
            </div>
            <div class="modal-btn modal-btn-cancel" @click="closeCreateTaskModal">
              <div class="modal-btn-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M20 5C20.2652 5 20.5196 5.10536 20.7071 5.29289C20.8946 5.48043 21 5.73478 21 6C21 6.26522 20.8946 6.51957 20.7071 6.70711C20.5196 6.89464 20.2652 7 20 7H19L18.997 7.071L18.064 20.142C18.0281 20.6466 17.8023 21.1188 17.4321 21.4636C17.0619 21.8083 16.5749 22 16.069 22H7.93C7.42414 22 6.93707 21.8083 6.56688 21.4636C6.1967 21.1188 5.97092 20.6466 5.935 20.142L5.002 7.072L5 7H4C3.73478 7 3.48043 6.89464 3.29289 6.70711C3.10536 6.51957 3 6.26522 3 6C3 5.73478 3.10536 5.48043 3.29289 5.29289C3.48043 5.10536 3.73478 5 4 5H20ZM16.997 7H7.003L7.931 20H16.069L16.997 7ZM14 2C14.2652 2 14.5196 2.10536 14.7071 2.29289C14.8946 2.48043 15 2.73478 15 3C15 3.26522 14.8946 3.51957 14.7071 3.70711C14.5196 3.89464 14.2652 4 14 4H10C9.73478 4 9.48043 3.89464 9.29289 3.70711C9.10536 3.51957 9 3.26522 9 3C9 2.73478 9.10536 2.48043 9.29289 2.29289C9.48043 2.10536 9.73478 2 10 2H14Z"
                    fill="#912138"
                  />
                </svg>
              </div>
              <span>отмена</span>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Модальное окно редактирования задачи -->
    <Teleport to="body">
      <div v-if="showEditTaskModal && selectedTask" class="modal-overlay" @click="closeEditTaskModal">
        <div class="edit-task-modal" @click.stop>
          <div class="modal-header">
            <button class="modal-close-btn" @click="closeEditTaskModal" aria-label="Закрыть">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M18 6L6 18M6 6L18 18"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </button>
            <h2 class="modal-title">Редактировать задачу</h2>
            <div class="modal-subtitle">Измените информацию о задаче</div>
          </div>

          <!-- Название -->
          <div class="modal-field">
            <label class="modal-field-label" for="edit-task-name">
              Название задачи
              <span class="modal-field-required">*</span>
            </label>
            <div class="modal-input-wrapper">
              <input
                id="edit-task-name"
                v-model="editTask.name"
                type="text"
                class="modal-field-input"
                :disabled="!canEditTask(selectedTask) && !canCompleteTask(selectedTask)"
                required
              />
            </div>
          </div>

          <!-- Описание -->
          <div class="modal-field">
            <label class="modal-field-label" for="edit-task-description">
              Описание задачи
            </label>
            <div class="modal-textarea-wrapper">
              <textarea
                id="edit-task-description"
                v-model="editTask.description"
                class="modal-description-textarea"
                :disabled="!canEditTask(selectedTask) && !canCompleteTask(selectedTask)"
                placeholder="Опишите задачу..."
                rows="6"
              ></textarea>
              <div class="modal-textarea-footer">
                <span class="modal-char-count">{{ editTask.description.length }} символов</span>
              </div>
            </div>
          </div>

          <!-- Постановщик, исполнитель, наблюдатели -->
          <div class="modal-field">
            <label class="modal-field-label">Участники</label>
            <div class="task-modal-participants-row">
              <div class="task-modal-participant-display">
                <img
                  v-if="selectedTask.creator.avatar"
                  :src="selectedTask.creator.avatar"
                  :alt="selectedTask.creator.displayName || ''"
                  class="task-modal-participant-avatar"
                />
                <div v-else class="task-modal-participant-avatar-placeholder">
                  {{ (selectedTask.creator.displayName || selectedTask.creator.firstName || selectedTask.creator.login || '?')[0].toUpperCase() }}
                </div>
                <span>{{ getCreatorDisplayName(selectedTask.creator) }}</span>
              </div>
              <div class="task-modal-participant-display">
                <img
                  v-if="selectedTask.assignee?.avatar"
                  :src="selectedTask.assignee.avatar"
                  :alt="selectedTask.assignee.displayName || ''"
                  class="task-modal-participant-avatar"
                />
                <div v-else-if="selectedTask.assignee" class="task-modal-participant-avatar-placeholder">
                  {{ (selectedTask.assignee.displayName || selectedTask.assignee.firstName || selectedTask.assignee.login || '?')[0].toUpperCase() }}
                </div>
                <span>{{ selectedTask.assignee ? getCreatorDisplayName(selectedTask.assignee) : 'исполнитель' }}</span>
              </div>
              <div class="task-modal-participant-display">
                <img
                  v-if="selectedTask.watchers && selectedTask.watchers.length > 0 && selectedTask.watchers[0].avatar"
                  :src="selectedTask.watchers[0].avatar"
                  :alt="selectedTask.watchers[0].displayName || ''"
                  class="task-modal-participant-avatar"
                />
                <div v-else-if="selectedTask.watchers && selectedTask.watchers.length > 0" class="task-modal-participant-avatar-placeholder">
                  {{ (selectedTask.watchers[0].displayName || selectedTask.watchers[0].firstName || selectedTask.watchers[0].login || '?')[0].toUpperCase() }}
                </div>
                <span>{{ selectedTask.watchers && selectedTask.watchers.length > 0 ? getCreatorDisplayName(selectedTask.watchers[0]) : 'наблюдатели' }}</span>
              </div>
            </div>
          </div>

          <!-- Время, редактор, дедлайн -->
          <div class="modal-field-group">
            <div class="modal-field">
              <label class="modal-field-label">Время</label>
              <div class="modal-input-wrapper">
                <input
                  v-model="editTask.timeSpent"
                  type="text"
                  class="modal-field-input"
                  :disabled="!canEditTask(selectedTask) && !canCompleteTask(selectedTask)"
                  placeholder="00:00"
                />
              </div>
            </div>
            <div class="modal-field">
              <label class="modal-field-label" for="edit-task-deadline">Дедлайн</label>
              <div class="modal-input-wrapper">
                <input
                  id="edit-task-deadline"
                  v-model="editTask.deadline"
                  type="datetime-local"
                  class="modal-field-input"
                  :disabled="!canEditTask(selectedTask) && !canCompleteTask(selectedTask)"
                />
              </div>
            </div>
          </div>

          <!-- Кнопки действий -->
          <div class="modal-actions">
            <button
              v-if="canEditTask(selectedTask)"
              class="modal-btn modal-btn-create"
              @click="updateTask"
            >
              <div class="modal-btn-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M20 6L9 17l-5-5"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
              <span>сохранить</span>
            </button>
            <button
              v-if="canCompleteTask(selectedTask) && !canEditTask(selectedTask)"
              class="modal-btn modal-btn-create"
              @click="completeTask"
            >
              <div class="modal-btn-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M20 6L9 17l-5-5"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
              <span>готово</span>
            </button>
            <button
              v-if="canEditTask(selectedTask)"
              class="modal-btn modal-btn-cancel"
              @click="deleteTask"
            >
              <div class="modal-btn-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M20 5C20.2652 5 20.5196 5.10536 20.7071 5.29289C20.8946 5.48043 21 5.73478 21 6C21 6.26522 20.8946 6.51957 20.7071 6.70711C20.5196 6.89464 20.2652 7 20 7H19L18.997 7.071L18.064 20.142C18.0281 20.6466 17.8023 21.1188 17.4321 21.4636C17.0619 21.8083 16.5749 22 16.069 22H7.93C7.42414 22 6.93707 21.8083 6.56688 21.4636C6.1967 21.1188 5.97092 20.6466 5.935 20.142L5.002 7.072L5 7H4C3.73478 7 3.48043 6.89464 3.29289 6.70711C3.10536 6.51957 3 6.26522 3 6C3 5.73478 3.10536 5.48043 3.29289 5.29289C3.48043 5.10536 3.73478 5 4 5H20ZM16.997 7H7.003L7.931 20H16.069L16.997 7ZM14 2C14.2652 2 14.5196 2.10536 14.7071 2.29289C14.8946 2.48043 15 2.73478 15 3C15 3.26522 14.8946 3.51957 14.7071 3.70711C14.5196 3.89464 14.2652 4 14 4H10C9.73478 4 9.48043 3.89464 9.29289 3.70711C9.10536 3.51957 9 3.26522 9 3C9 2.73478 9.10536 2.48043 9.29289 2.29289C9.48043 2.10536 9.73478 2 10 2H14Z"
                    fill="#912138"
                  />
                </svg>
              </div>
              <span>удалить</span>
            </button>
            <button class="modal-btn modal-btn-cancel" @click="closeEditTaskModal">
              <div class="modal-btn-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M20 5C20.2652 5 20.5196 5.10536 20.7071 5.29289C20.8946 5.48043 21 5.73478 21 6C21 6.26522 20.8946 6.51957 20.7071 6.70711C20.5196 6.89464 20.2652 7 20 7H19L18.997 7.071L18.064 20.142C18.0281 20.6466 17.8023 21.1188 17.4321 21.4636C17.0619 21.8083 16.5749 22 16.069 22H7.93C7.42414 22 6.93707 21.8083 6.56688 21.4636C6.1967 21.1188 5.97092 20.6466 5.935 20.142L5.002 7.072L5 7H4C3.73478 7 3.48043 6.89464 3.29289 6.70711C3.10536 6.51957 3 6.26522 3 6C3 5.73478 3.10536 5.48043 3.29289 5.29289C3.48043 5.10536 3.73478 5 4 5H20ZM16.997 7H7.003L7.931 20H16.069L16.997 7ZM14 2C14.2652 2 14.5196 2.10536 14.7071 2.29289C14.8946 2.48043 15 2.73478 15 3C15 3.26522 14.8946 3.51957 14.7071 3.70711C14.5196 3.89464 14.2652 4 14 4H10C9.73478 4 9.48043 3.89464 9.29289 3.70711C9.10536 3.51957 9 3.26522 9 3C9 2.73478 9.10536 2.48043 9.29289 2.29289C9.48043 2.10536 9.73478 2 10 2H14Z"
                    fill="#912138"
                  />
                </svg>
              </div>
              <span>отмена</span>
            </button>
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
  type UserInfo,
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
  creatorId: '',
  assigneeId: '',
  watcherIds: [] as string[],
  deadline: '',
  subtasks: [] as Array<{ name: string; isCompleted: boolean }>,
});

const showCreatorSelect = ref(false);
const showAssigneeSelect = ref(false);
const showWatchersSelect = ref(false);
const showDeadlinePicker = ref(false);
const showSubtasksModal = ref(false);
const showChecklistModal = ref(false);

const editTask = ref({
  name: '',
  description: '',
  assigneeId: '',
  watcherIds: [] as string[],
  subtasks: [] as Array<{ name: string; isCompleted: boolean }>,
  deadline: '',
  timeSpent: 0,
});

const showEditSubtasksModal = ref(false);
const showEditChecklistModal = ref(false);
const generatedDescription = ref('');
const isImportantTask = ref(false);

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

function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  return date.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
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
  if (!currentUser.value || !project.value) return false;
  // Руководитель проекта имеет доступ ко всем задачам
  if (project.value.creator.id === currentUser.value.id) return true;
  // Владелец и менеджер компании имеют доступ ко всем задачам
  if (currentUser.value.companyRole === 'owner' || currentUser.value.companyRole === 'manager') return true;
  // Постановщик может редактировать свою задачу
  return task.creator.id === currentUser.value.id;
}

function canCompleteTask(task: Task): boolean {
  if (!currentUser.value) return false;
  // Исполнитель может только нажать "готово"
  return task.assignee?.id === currentUser.value.id;
}

function canViewTask(task: Task): boolean {
  if (!currentUser.value || !project.value) return false;
  // Руководитель проекта имеет доступ ко всем задачам
  if (project.value.creator.id === currentUser.value.id) return true;
  // Владелец и менеджер компании имеют доступ ко всем задачам
  if (currentUser.value.companyRole === 'owner' || currentUser.value.companyRole === 'manager') return true;
  // Постановщик, исполнитель и наблюдатели имеют доступ
  if (task.creator.id === currentUser.value.id) return true;
  if (task.assignee?.id === currentUser.value.id) return true;
  if (task.watchers?.some(w => w.id === currentUser.value?.id)) return true;
  return false;
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
    creatorId: currentUser.value?.id || '',
    assigneeId: '',
    watcherIds: [],
    deadline: '',
    subtasks: [],
  };
  generatedDescription.value = '';
  isImportantTask.value = false;
  showCreateTaskModal.value = true;
  showCreatorSelect.value = false;
  showAssigneeSelect.value = false;
  showWatchersSelect.value = false;
  showDeadlinePicker.value = false;
}

function getCreatorName(): string {
  if (!newTask.value.creatorId) return '';
  const user = projectParticipants.value.find(u => u.id === newTask.value.creatorId);
  return user ? (user.displayName || user.firstName || user.login || '') : '';
}

function getAssigneeName(): string {
  if (!newTask.value.assigneeId) return '';
  const user = projectParticipants.value.find(u => u.id === newTask.value.assigneeId);
  return user ? (user.displayName || user.firstName || user.login || '') : '';
}

function selectCreator(userId: string) {
  newTask.value.creatorId = userId;
  showCreatorSelect.value = false;
}

function selectAssignee(userId: string) {
  newTask.value.assigneeId = userId;
  showAssigneeSelect.value = false;
}

function toggleWatcher(userId: string) {
  const index = newTask.value.watcherIds.indexOf(userId);
  if (index > -1) {
    newTask.value.watcherIds.splice(index, 1);
  } else {
    newTask.value.watcherIds.push(userId);
  }
}

async function generateDescription() {
  try {
    // TODO: Реализовать генерацию описания через AI
    generatedDescription.value = 'Сгенерированное описание задачи будет здесь...';
  } catch (error: any) {
    console.error('Ошибка генерации описания:', error);
  }
}

function acceptGeneratedDescription() {
  if (generatedDescription.value) {
    newTask.value.description = generatedDescription.value;
    generatedDescription.value = '';
  }
}

function refineGeneratedDescription() {
  // TODO: Реализовать доработку описания
  console.log('Refine description');
}

function deleteGeneratedDescription() {
  generatedDescription.value = '';
}

function closeCreateTaskModal() {
  showCreateTaskModal.value = false;
  selectedColumnId.value = '';
  showCreatorSelect.value = false;
  showAssigneeSelect.value = false;
  showWatchersSelect.value = false;
  showDeadlinePicker.value = false;
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
    timeSpent: task.timeSpent || 0,
  };
  showEditTaskModal.value = true;
}

function getCreatorDisplayName(user: UserInfo): string {
  if (user.displayName) return user.displayName;
  if (user.firstName && user.lastName) return `${user.firstName} ${user.lastName[0]}.`;
  if (user.firstName) return user.firstName;
  return user.login || '';
}

function sendToRework() {
  // TODO: Реализовать отправку на доработку
  console.log('Send to rework');
}

function closeEditTaskModal() {
  showEditTaskModal.value = false;
  selectedTask.value = null;
  showEditSubtasksModal.value = false;
  showEditChecklistModal.value = false;
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
      name: newTask.value.name,
      description: newTask.value.description || undefined,
      columnId: newTask.value.columnId,
      creatorId: newTask.value.creatorId || currentUser.value?.id || '',
      assigneeId: newTask.value.assigneeId || undefined,
      watcherIds: newTask.value.watcherIds,
      subtasks: newTask.value.subtasks,
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
  padding: 30px 36px 0;
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
  flex-direction: column;
  gap: clamp(0.5rem, 1vw, 0.75rem);
  padding-bottom: clamp(1rem, 2vw, 1.5rem);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
}

.modal-close-btn {
  position: absolute;
  top: 0;
  right: 0;
  width: clamp(2rem, 4vw, 2.5rem);
  height: clamp(2rem, 4vw, 2.5rem);
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: clamp(0.5rem, 1vw, 0.75rem);
  color: #e1eaf8;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  flex-shrink: 0;
}

.modal-close-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
  transform: scale(1.05);
}

.modal-close-btn svg {
  width: 1.25rem;
  height: 1.25rem;
}

.modal-title {
  color: #ffffff;
  font-size: clamp(1.5rem, 3vw, 2rem);
  font-weight: 600;
  font-family: 'Involve', Arial, sans-serif;
  margin: 0;
  line-height: 1.3;
  letter-spacing: -0.02em;
}

.modal-subtitle {
  color: rgba(225, 234, 248, 0.7);
  font-size: clamp(0.875rem, 1.5vw, 1rem);
  font-weight: 400;
  font-family: 'Involve', Arial, sans-serif;
  line-height: 1.5;
  margin: 0;
}

.modal-field {
  display: flex;
  flex-direction: column;
  gap: clamp(0.5rem, 1vw, 0.75rem);
}

.modal-field-group {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: clamp(1rem, 2vw, 1.5rem);
}

.modal-field-label {
  font-size: clamp(0.875rem, 1.5vw, 1rem);
  font-weight: 500;
  font-family: 'Involve', Arial, sans-serif;
  color: #e1eaf8;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  line-height: 1.5;
}

.modal-field-required {
  color: #912138;
  font-weight: 600;
}

.modal-input-wrapper {
  position: relative;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: clamp(0.75rem, 1.5vw, 1rem);
  padding: clamp(0.75rem, 1.5vw, 1rem) clamp(1rem, 2vw, 1.25rem);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.modal-input-wrapper:focus-within {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(145, 33, 56, 0.5);
  box-shadow: 0 0 0 3px rgba(145, 33, 56, 0.1);
}

.modal-field-input {
  width: 100%;
  font-size: clamp(0.9375rem, 1.5vw, 1.125rem);
  font-weight: 400;
  font-family: 'Involve', Arial, sans-serif;
  color: #ffffff;
  background: transparent;
  border: none;
  outline: none;
  padding: 0;
  line-height: 1.5;
}

.modal-field-input::placeholder {
  color: rgba(225, 234, 248, 0.5);
}

.modal-textarea-wrapper {
  position: relative;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: clamp(0.75rem, 1.5vw, 1rem);
  padding: clamp(0.75rem, 1.5vw, 1rem) clamp(1rem, 2vw, 1.25rem);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  min-height: clamp(8rem, 16vw, 10rem);
}

.modal-textarea-wrapper:focus-within {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(145, 33, 56, 0.5);
  box-shadow: 0 0 0 3px rgba(145, 33, 56, 0.1);
}

.modal-description-textarea {
  width: 100%;
  background: transparent;
  border: none;
  outline: none;
  color: #ffffff;
  font-size: clamp(0.9375rem, 1.5vw, 1.125rem);
  font-weight: 400;
  font-family: 'Involve', Arial, sans-serif;
  resize: vertical;
  min-height: clamp(6rem, 12vw, 8rem);
  max-height: clamp(12rem, 24vw, 16rem);
  overflow-y: auto;
  line-height: 1.6;
  padding: 0;
  scrollbar-width: thin;
  scrollbar-color: rgba(225, 234, 248, 0.3) transparent;
}

.modal-description-textarea::-webkit-scrollbar {
  width: 6px;
}

.modal-description-textarea::-webkit-scrollbar-track {
  background: transparent;
}

.modal-description-textarea::-webkit-scrollbar-thumb {
  background: rgba(225, 234, 248, 0.3);
  border-radius: 3px;
}

.modal-description-textarea::-webkit-scrollbar-thumb:hover {
  background: rgba(225, 234, 248, 0.5);
}

.modal-description-textarea::placeholder {
  color: rgba(225, 234, 248, 0.5);
}

.modal-textarea-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: clamp(0.5rem, 1vw, 0.75rem);
  padding-top: clamp(0.5rem, 1vw, 0.75rem);
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.modal-char-count {
  font-size: clamp(0.75rem, 1.25vw, 0.875rem);
  color: rgba(225, 234, 248, 0.6);
  font-family: 'Involve', Arial, sans-serif;
}

.modal-generate-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.modal-generate-btn {
  background: rgba(145, 33, 56, 0.8);
  border: 1px solid rgba(145, 33, 56, 0.5);
  border-radius: clamp(0.75rem, 1.5vw, 1rem);
  padding: clamp(0.625rem, 1.25vw, 0.875rem) clamp(1rem, 2vw, 1.5rem);
  height: auto;
  min-height: clamp(2.5rem, 5vw, 3rem);
  display: flex;
  align-items: center;
  gap: clamp(0.5rem, 1vw, 0.75rem);
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  width: 100%;
  justify-content: center;
}

.modal-generate-btn:hover {
  background: rgba(145, 33, 56, 1);
  border-color: rgba(145, 33, 56, 0.7);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(145, 33, 56, 0.3);
}

.modal-generate-btn-icon {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  color: #ffffff;
}

.modal-generate-btn-icon img {
  width: 100%;
  height: 100%;
}

.modal-generate-btn-text {
  color: #e1eaf8;
  font-size: 0.9375rem;
  font-weight: 400;
  font-family: 'Involve', Arial, sans-serif;
  flex: 1;
}

.modal-generated-description {
  background: rgba(145, 33, 56, 0.1);
  border: 2px solid rgba(145, 33, 56, 0.3);
  border-radius: clamp(0.75rem, 1.5vw, 1rem);
  padding: clamp(1rem, 2vw, 1.5rem);
  display: flex;
  flex-direction: column;
  gap: clamp(0.75rem, 1.5vw, 1rem);
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-generated-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.modal-generated-text {
  color: #ffffff;
  font-size: 1rem;
  font-weight: 400;
  font-family: 'Involve', Arial, sans-serif;
  line-height: 1.5;
  white-space: pre-wrap;
}

.modal-generated-actions {
  display: flex;
  gap: clamp(0.75rem, 1.5vw, 1rem);
  flex-wrap: wrap;
}

.modal-action-btn {
  border-radius: clamp(0.5rem, 1vw, 0.75rem);
  padding: clamp(0.5rem, 1vw, 0.75rem) clamp(0.75rem, 1.5vw, 1rem);
  height: auto;
  min-height: clamp(2.25rem, 4.5vw, 2.75rem);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: clamp(0.5rem, 1vw, 0.75rem);
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: clamp(0.875rem, 1.5vw, 1rem);
  font-weight: 500;
  font-family: 'Involve', Arial, sans-serif;
  flex: 1;
  border: 1px solid transparent;
}

.modal-action-accept {
  background: rgba(145, 33, 56, 0.8);
  color: #ffffff;
  border-color: rgba(145, 33, 56, 0.5);
}

.modal-action-accept:hover {
  background: rgba(145, 33, 56, 1);
  border-color: rgba(145, 33, 56, 0.7);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(145, 33, 56, 0.3);
}

.modal-action-refine {
  background: rgba(255, 255, 255, 0.1);
  color: #e1eaf8;
  border-color: rgba(255, 255, 255, 0.2);
}

.modal-action-refine:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.3);
  transform: translateY(-1px);
}

.modal-action-delete {
  background: rgba(255, 107, 107, 0.15);
  color: #ff6b6b;
  border-color: rgba(255, 107, 107, 0.3);
}

.modal-action-delete:hover {
  background: rgba(255, 107, 107, 0.2);
  border-color: rgba(255, 107, 107, 0.4);
  transform: translateY(-1px);
}

.modal-action-btn-icon {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: inherit;
}

.modal-action-btn-icon svg {
  width: 100%;
  height: 100%;
}

.modal-actions {
  display: flex;
  gap: clamp(0.75rem, 1.5vw, 1rem);
  padding-top: clamp(1rem, 2vw, 1.5rem);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin-top: auto;
}

.modal-btn {
  border-radius: clamp(0.75rem, 1.5vw, 1rem);
  padding: clamp(0.75rem, 1.5vw, 1rem) clamp(1.5rem, 3vw, 2rem);
  height: auto;
  min-height: clamp(2.75rem, 5.5vw, 3.5rem);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: clamp(0.5rem, 1vw, 0.75rem);
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: clamp(0.9375rem, 1.5vw, 1.125rem);
  font-weight: 500;
  font-family: 'Involve', Arial, sans-serif;
  border: 1px solid transparent;
  flex: 1;
}

.modal-btn-create {
  background: #912138;
  color: #ffffff;
  border-color: rgba(145, 33, 56, 0.5);
}

.modal-btn-create:hover {
  background: #a02a43;
  border-color: rgba(145, 33, 56, 0.7);
  color: #ffffff;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(145, 33, 56, 0.3);
}

.modal-btn-cancel {
  background: rgba(255, 255, 255, 0.05);
  color: #e1eaf8;
  border-color: rgba(255, 255, 255, 0.1);
}

.modal-btn-cancel:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-1px);
}

.modal-btn-icon {
  width: clamp(1.25rem, 2.5vw, 1.5rem);
  height: clamp(1.25rem, 2.5vw, 1.5rem);
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: inherit;
}

.modal-btn-icon svg {
  width: 100%;
  height: 100%;
}

.task-important-btn {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: clamp(0.75rem, 1.5vw, 1rem);
  padding: clamp(0.5rem, 1vw, 0.75rem);
  width: clamp(3rem, 6vw, 3.5rem);
  height: clamp(3rem, 6vw, 3.5rem);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  flex-shrink: 0;
}

.task-important-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
}

.task-important-btn.active {
  border-color: rgba(145, 33, 56, 0.5);
  box-shadow: 0 0 0 3px rgba(145, 33, 56, 0.1);
}

.task-important-btn img {
  width: 100%;
  height: 100%;
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

/* Стили для модальных окон создания и редактирования задач */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  display: flex;
  align-items: stretch;
  justify-content: flex-end;
  z-index: 10000;
  overflow: hidden;
}

.create-task-modal,
.edit-task-modal {
  background: rgba(4, 9, 16, 0.95);
  backdrop-filter: blur(30px);
  -webkit-backdrop-filter: blur(30px);
  border-left: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0;
  width: 100%;
  max-width: 720px;
  max-height: 100vh;
  height: 100vh;
  overflow-y: auto;
  overflow-x: hidden;
  padding: clamp(1.5rem, 3vw, 2rem) clamp(1.5rem, 3vw, 2.5rem);
  display: flex;
  flex-direction: column;
  gap: clamp(1.5rem, 3vw, 2rem);
  box-shadow: -10px 0 40px rgba(0, 0, 0, 0.5);
  box-sizing: border-box;
  animation: slideInRight 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.modal-back-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #e1eaf8;
  font-size: 20px;
  font-weight: 400;
  cursor: pointer;
  background: none;
  border: none;
  padding: 0;
  width: fit-content;
}

.modal-back-btn svg {
  width: 24px;
  height: 24px;
}

.modal-content-wrapper {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.task-modal-title-row {
  display: flex;
  align-items: center;
  gap: 24px;
}

.task-modal-label {
  font-size: 20px;
  font-weight: 400;
  color: #e1eaf8;
  min-width: 168px;
}

.task-modal-title-input {
  flex: 1;
  background: transparent;
  border: none;
  color: #e1eaf8;
  font-size: 15px;
  font-weight: 500;
  padding: 0;
  outline: none;
}

.task-modal-ai-btn {
  background: #912138;
  border: none;
  border-radius: 16px;
  padding: 6px;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
}

.task-modal-ai-btn img {
  width: 24px;
  height: 24px;
}

.task-modal-description-wrapper {
  background: #292d32;
  border-radius: 16px;
  padding: 12px;
  display: flex;
  gap: 6px;
  min-height: 327px;
}

.task-modal-description {
  flex: 1;
  background: transparent;
  border: none;
  color: #ffffff;
  font-size: 20px;
  font-weight: 400;
  resize: none;
  outline: none;
  min-height: 327px;
  font-family: 'Involve', Arial, sans-serif;
}

.task-modal-description:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.task-modal-scrollbar {
  width: 8px;
  background: rgba(225, 234, 248, 0.25);
  border-radius: 100px;
  position: relative;
  flex-shrink: 0;
}

.task-modal-scrollbar-thumb {
  width: 8px;
  height: 48px;
  background: #e1eaf8;
  border-radius: 100px;
}

.task-modal-generate-btn {
  background: #912138;
  border: none;
  border-radius: 16px;
  padding: 6px 12px;
  height: 36px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  color: #e1eaf8;
  font-size: 15px;
  font-weight: 400;
  transition: background 0.2s ease;
}

.task-modal-generate-btn:hover {
  background: rgba(145, 33, 56, 0.8);
}


.task-modal-generate-btn img {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
}

.task-modal-participants-row {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
  position: relative;
}

.task-modal-participant-btn {
  background: #292d32;
  border: none;
  border-radius: 16px;
  padding: 6px 12px;
  height: 36px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  color: #e1eaf8;
  font-size: 15px;
  font-weight: 400;
  min-width: 212px;
}

.task-modal-participant-btn.selected {
  background: rgba(145, 33, 56, 0.3);
}

.task-modal-participant-btn img {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
}

.task-modal-participants-dropdown {
  position: absolute;
  background: #292d32;
  border-radius: 16px;
  padding: 8px;
  margin-top: 4px;
  z-index: 10001;
  max-height: 200px;
  overflow-y: auto;
  min-width: 212px;
}

.task-modal-participant-option {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  cursor: pointer;
  border-radius: 8px;
  color: #e1eaf8;
  font-size: 15px;
}

.task-modal-participant-option:hover {
  background: rgba(255, 255, 255, 0.1);
}

.task-modal-participant-option img,
.task-modal-participant-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

.task-modal-participant-avatar-placeholder {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: rgba(225, 234, 248, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #e1eaf8;
  font-size: 12px;
  font-weight: 500;
  flex-shrink: 0;
}

.task-modal-participant-display {
  background: #292d32;
  border-radius: 16px;
  padding: 6px 12px;
  height: 36px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #ffffff;
  font-size: 15px;
  font-weight: 400;
  min-width: 212px;
}

.task-modal-action-btn {
  background: #292d32;
  border: none;
  border-radius: 16px;
  padding: 6px 12px;
  height: 36px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  color: #e1eaf8;
  font-size: 15px;
  font-weight: 400;
  width: 100%;
}

.task-modal-action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.task-modal-action-btn img {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
}

.task-modal-deadline-btn {
  background: #292d32;
  border: none;
  border-radius: 16px;
  padding: 6px 12px;
  height: 36px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  color: #e1eaf8;
  font-size: 15px;
  font-weight: 400;
  width: 212px;
}

.task-modal-deadline-btn img {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
}

.task-modal-deadline-picker {
  margin-top: -20px;
}

.task-modal-deadline-input {
  background: #292d32;
  border: none;
  border-radius: 16px;
  padding: 6px 12px;
  height: 36px;
  color: #e1eaf8;
  font-size: 15px;
  outline: none;
}

.task-modal-actions {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
}

.task-modal-btn-create,
.task-modal-btn-accept,
.task-modal-btn-complete {
  background: #dbf3c2;
  border: none;
  border-radius: 16px;
  padding: 6px 12px;
  height: 36px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  color: #292d32;
  font-size: 15px;
  font-weight: 400;
  min-width: 212px;
}

.task-modal-btn-create svg,
.task-modal-btn-accept svg,
.task-modal-btn-complete svg {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
}

.task-modal-btn-rework {
  background: #f3dbc2;
  border: none;
  border-radius: 16px;
  padding: 6px 12px;
  height: 36px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  color: #292d32;
  font-size: 15px;
  font-weight: 400;
  min-width: 212px;
}

.task-modal-btn-rework svg {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
}

.task-modal-btn-delete,
.task-modal-btn-cancel {
  background: #f3c2c3;
  border: none;
  border-radius: 16px;
  padding: 6px 12px;
  height: 36px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  color: #292d32;
  font-size: 15px;
  font-weight: 400;
  min-width: 212px;
}

.task-modal-btn-delete svg,
.task-modal-btn-cancel svg {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
}

.task-modal-meta-row {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
}

.task-modal-meta-item {
  background: #292d32;
  border-radius: 16px;
  padding: 6px 12px;
  height: 36px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #e1eaf8;
  font-size: 15px;
  font-weight: 400;
  min-width: 153px;
}

.task-modal-meta-item img,
.task-modal-meta-item svg {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
}

.task-modal-comments {
  min-height: 36px;
  background: #292d32;
  border-radius: 16px;
  flex: 1;
}

@media (max-width: 768px) {
  .modal-overlay {
    align-items: flex-start;
    justify-content: center;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }

  .create-task-modal,
  .edit-task-modal {
    width: 100%;
    max-width: 100%;
    height: auto;
    min-height: 100vh;
    max-height: none;
    border-left: none;
    border-radius: 0;
    padding: 12px 16px;
    gap: 20px;
    box-shadow: none;
  }
}
</style>

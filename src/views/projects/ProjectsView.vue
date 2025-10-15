<template>
  <AppLayout>
    <div class="p-6">
      <h1 class="text-2xl font-semibold mb-6">Проекты</h1>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="project in projects"
          :key="project.id"
          class="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
          @click="openProject(project.id)"
        >
          <h3 class="font-medium text-lg mb-2">{{ project.name }}</h3>
          <p class="text-gray-600 text-sm mb-3">{{ project.description }}</p>
          <div class="flex items-center justify-between text-sm text-gray-500">
            <span>{{ project.taskCount }} задач</span>
            <span>{{ formatDate(project.updatedAt) }}</span>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import AppLayout from '../../layouts/AppLayout.vue';

const router = useRouter();

type Project = {
  id: string;
  name: string;
  description: string;
  taskCount: number;
  updatedAt: string;
};

const projects = ref<Project[]>([
  {
    id: '1',
    name: 'Веб-сайт компании',
    description: 'Разработка корпоративного сайта',
    taskCount: 12,
    updatedAt: '2024-01-15',
  },
  {
    id: '2',
    name: 'Мобильное приложение',
    description: 'iOS и Android приложение',
    taskCount: 8,
    updatedAt: '2024-01-14',
  },
  {
    id: '3',
    name: 'API интеграция',
    description: 'Подключение внешних сервисов',
    taskCount: 5,
    updatedAt: '2024-01-13',
  },
]);

function openProject(projectId: string) {
  router.push(`/projects/${projectId}/tasks`);
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU');
}
</script>

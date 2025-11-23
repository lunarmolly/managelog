<template>
  <div class="avatar-uploader">
    <!-- Основной контейнер аватара -->
    <div class="avatar-container">
      <div class="avatar-wrapper" :class="{ 'avatar-wrapper--has-image': currentAvatar }">
        <img v-if="currentAvatar" :src="currentAvatar" alt="Avatar" class="avatar-image" />
        <div v-else class="avatar-placeholder">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" fill="#912138"/>
            <path d="M12.0002 14.5C6.99016 14.5 2.95016 17.86 2.95016 22C2.95016 22.28 3.17016 22.5 3.45016 22.5H20.5502C20.8302 22.5 21.0502 22.28 21.0502 22C21.0502 17.86 17.0102 14.5 12.0002 14.5Z" fill="#912138"/>
          </svg>
        </div>
        <div v-if="isUploading" class="avatar-loading">
          <div class="avatar-loading-spinner"></div>
        </div>
      </div>
      <div class="avatar-actions">
        <label class="avatar-action-btn avatar-action-btn--upload" :class="{ 'avatar-action-btn--disabled': isUploading }">
          <input
            ref="fileInputRef"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            @change="handleFileSelect"
            class="avatar-file-input"
            :disabled="isUploading"
          />
          {{ isUploading ? 'Загрузка...' : (currentAvatar ? 'Изменить' : 'Загрузить') }}
        </label>
        <button
          v-if="currentAvatar"
          class="avatar-action-btn avatar-action-btn--delete"
          @click="handleDelete"
          :disabled="isUploading"
          title="Удалить аватар"
        >
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="delete-icon">
            <path d="M3 6H5H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M10 11V17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M14 11V17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
      <div v-if="error" class="avatar-error">
        {{ error }}
      </div>
    </div>

    <!-- Модальное окно подтверждения удаления -->
    <div v-if="showDeleteConfirm" class="delete-modal-overlay" @click.self="cancelDelete">
      <div class="delete-modal-content">
        <div class="delete-modal-header">
          <h3 class="delete-modal-title">удалить аватар?</h3>
        </div>
        <div class="delete-modal-body">
          <p class="delete-modal-message">вы уверены, что хотите удалить аватар? это действие нельзя отменить.</p>
        </div>
        <div class="delete-modal-actions">
          <button class="delete-modal-btn delete-modal-btn--cancel" @click="cancelDelete">
            отмена
          </button>
          <button class="delete-modal-btn delete-modal-btn--confirm" @click="confirmDelete">
            удалить
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

interface Props {
  avatarUrl?: string | null;
  apiBaseUrl?: string;
}

interface Emits {
  (e: 'upload', file: File): void;
  (e: 'delete'): void;
  (e: 'error', error: string): void;
}

const props = withDefaults(defineProps<Props>(), {
  avatarUrl: null,
  apiBaseUrl: 'http://localhost:3000',
});

const emit = defineEmits<Emits>();

const fileInputRef = ref<HTMLInputElement | null>(null);
const currentAvatar = ref<string | null>(props.avatarUrl || null);
const error = ref<string>('');
const isUploading = ref(false);
const showDeleteConfirm = ref(false);

watch(() => props.avatarUrl, (newUrl) => {
  currentAvatar.value = newUrl || null;
});

function clearError() {
  error.value = '';
  emit('error', '');
}

async function processImage(file: File): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      img.src = dataUrl;

      img.onload = () => {
        try {
          // Определяем размер для кропа (берем минимальную сторону)
          const size = Math.min(img.width, img.height);
          
          // Создаем canvas для кропа
          const canvas = document.createElement('canvas');
          canvas.width = 800;
          canvas.height = 800;
          const ctx = canvas.getContext('2d');

          if (!ctx) {
            reject(new Error('Не удалось создать контекст canvas'));
            return;
          }

          // Вычисляем координаты для кропа по центру
          const sourceX = (img.width - size) / 2;
          const sourceY = (img.height - size) / 2;
          const sourceSize = size;

          // Рисуем обрезанное изображение на canvas
          ctx.drawImage(
            img,
            sourceX,
            sourceY,
            sourceSize,
            sourceSize,
            0,
            0,
            800,
            800
          );

          // Конвертируем в blob с сжатием
          // Используем формат исходного файла (JPEG/PNG/WebP) для избежания проблем
          let outputFormat: string;
          let outputExtension: string;
          
          if (file.type === 'image/png') {
            outputFormat = 'image/png';
            outputExtension = 'png';
          } else if (file.type === 'image/webp') {
            // WebP поддерживается не во всех браузерах через canvas.toBlob, используем JPEG как fallback
            outputFormat = 'image/jpeg';
            outputExtension = 'jpg';
          } else {
            outputFormat = 'image/jpeg';
            outputExtension = 'jpg';
          }
          
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error('Не удалось обработать изображение'));
                return;
              }

              // Проверяем, что blob не пустой
              if (blob.size === 0) {
                reject(new Error('Обработанное изображение пустое'));
                return;
              }

              // Создаем File из blob
              const processedFile = new File(
                [blob],
                file.name.replace(/\.[^/.]+$/, '') + '.' + outputExtension,
                {
                  type: outputFormat,
                  lastModified: Date.now(),
                }
              );

              resolve(processedFile);
            },
            outputFormat,
            0.85 // Качество 85%
          );
        } catch (err) {
          reject(err);
        }
      };

      img.onerror = () => {
        reject(new Error('Не удалось загрузить изображение'));
      };
    };

    reader.onerror = () => {
      reject(new Error('Не удалось прочитать файл'));
    };

    reader.readAsDataURL(file);
  });
}

async function handleFileSelect(event: Event) {
  clearError();
  
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  
  if (!file) {
    if (fileInputRef.value) {
      fileInputRef.value.value = '';
    }
    return;
  }

  // Валидация формата
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    error.value = 'Неподдерживаемый формат файла. Разрешены только JPEG, PNG и WebP';
    emit('error', error.value);
    if (fileInputRef.value) {
      fileInputRef.value.value = '';
    }
    return;
  }

  // Валидация размера (50MB)
  const maxSize = 50 * 1024 * 1024;
  if (file.size > maxSize) {
    error.value = 'Файл слишком большой. Максимальный размер: 50MB';
    emit('error', error.value);
    if (fileInputRef.value) {
      fileInputRef.value.value = '';
    }
    return;
  }

  isUploading.value = true;

  try {
    // Обрабатываем изображение: кроп и сжатие
    const processedFile = await processImage(file);
    
    // Проверяем размер обработанного файла
    if (processedFile.size === 0) {
      throw new Error('Обработанный файл пустой');
    }
    
    console.log('Processed file:', {
      name: processedFile.name,
      type: processedFile.type,
      size: processedFile.size,
    });
    
    // Отправляем обработанный файл
    emit('upload', processedFile);
  } catch (err: any) {
    const errorMessage = err?.message || 'Ошибка при обработке изображения';
    error.value = errorMessage;
    emit('error', errorMessage);
    console.error('Error processing image:', err);
    console.error('Error details:', {
      message: err?.message,
      stack: err?.stack,
      name: err?.name,
    });
  } finally {
    isUploading.value = false;
    if (fileInputRef.value) {
      fileInputRef.value.value = '';
    }
  }
}

function handleDelete() {
  showDeleteConfirm.value = true;
}

function confirmDelete() {
  showDeleteConfirm.value = false;
  clearError();
  emit('delete');
}

function cancelDelete() {
  showDeleteConfirm.value = false;
}

// Экспортируем функцию для очистки ошибки извне
defineExpose({
  clearError,
});
</script>

<style scoped>
.avatar-uploader {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.avatar-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  width: 100%;
}

.avatar-wrapper {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid rgba(225, 234, 248, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(4, 9, 16, 0.5);
  position: relative;
}

.avatar-wrapper--has-image {
  border-color: rgba(145, 33, 56, 0.5);
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(145, 33, 56, 0.2);
}

.avatar-placeholder svg {
  width: 60%;
  height: 60%;
}

.avatar-loading {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  z-index: 10;
}

.avatar-loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top-color: #e1eaf8;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.avatar-actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  justify-content: center;
}

.avatar-action-btn {
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  font-family: 'Involve', Arial, sans-serif;
  text-transform: lowercase;
}

.avatar-action-btn:disabled,
.avatar-action-btn--disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.avatar-action-btn--upload {
  background: rgba(145, 33, 56, 0.8);
  color: #e1eaf8;
}

.avatar-action-btn--upload:hover:not(:disabled) {
  background: rgba(145, 33, 56, 1);
}

.avatar-action-btn--delete {
  background: rgba(41, 45, 50, 0.3);
  color: #e1eaf8;
  border: none;
  padding: 0.75rem;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 40px;
  box-shadow: none;
}

.avatar-action-btn--delete:hover:not(:disabled) {
  background: rgba(41, 45, 50, 0.5);
  color: #ffffff;
}

.avatar-action-btn--delete:active:not(:disabled) {
  background: rgba(41, 45, 50, 0.6);
}

.delete-icon {
  width: 20px;
  height: 20px;
}

.avatar-file-input {
  display: none;
}

.avatar-error {
  color: #ff4444;
  font-family: 'Involve', Arial, sans-serif;
  font-size: 14px;
  text-align: center;
  padding: 0.5rem 1rem;
  background: rgba(255, 68, 68, 0.1);
  border: 1px solid rgba(255, 68, 68, 0.3);
  border-radius: 8px;
  width: 100%;
  max-width: 400px;
  margin-top: 0.5rem;
}

/* Модальное окно подтверждения удаления */
.delete-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  animation: fadeIn 0.2s ease;
}

.delete-modal-content {
  background: rgba(145, 33, 56, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 40px;
  padding: 32px;
  max-width: 480px;
  width: 90%;
  box-shadow: 0px 20px 60px rgba(0, 0, 0, 0.5);
  animation: slideUp 0.3s ease;
  border: 1px solid rgba(225, 234, 248, 0.1);
}

.delete-modal-header {
  margin-bottom: 20px;
}

.delete-modal-title {
  font-family: 'Involve', Arial, sans-serif;
  font-size: 24px;
  font-weight: 600;
  color: #e1eaf8;
  margin: 0;
  text-transform: lowercase;
  text-align: center;
}

.delete-modal-body {
  margin-bottom: 24px;
}

.delete-modal-message {
  font-family: 'Involve', Arial, sans-serif;
  font-size: 16px;
  font-weight: 400;
  color: #e1eaf8;
  margin: 0;
  text-align: center;
  line-height: 1.5;
}

.delete-modal-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.delete-modal-btn {
  padding: 12px 24px;
  border-radius: 40px;
  font-family: 'Involve', Arial, sans-serif;
  font-size: 20px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  text-transform: lowercase;
  min-width: 120px;
}

.delete-modal-btn--cancel {
  background: rgba(41, 45, 50, 0.3);
  color: #e1eaf8;
}

.delete-modal-btn--cancel:hover {
  background: rgba(41, 45, 50, 0.5);
  color: #ffffff;
}

.delete-modal-btn--confirm {
  background: rgba(255, 68, 68, 0.8);
  color: #ffffff;
}

.delete-modal-btn--confirm:hover {
  background: rgba(255, 68, 68, 1);
  box-shadow: 0 4px 12px rgba(255, 68, 68, 0.4);
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
